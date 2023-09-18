import { currentUser, updatePassword, updateUserProfile } from '@/services/ant-design-pro/api';
import { AntDesignOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Col, message, Row } from 'antd';
import React, { useRef, useState } from 'react';

const Profile: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [readonly, setReadonly] = useState(true);
  const formRef = useRef<ProFormInstance<any>>();
  const formRefForPassword = useRef<ProFormInstance<any>>();

  const handleSubmit = async (values: API.UserVO) => {
    const success = await updateUserProfile(values);
    if (success) {
      message.success('资料更新成功！');
    }
  };

  const handlePasswordSubmit = async (values: API.UserPasswordParam) => {
    const success = await updatePassword(values);
    if (success) {
      message.success('密码修改成功！');
    }
  };

  return (
    <PageContainer>
      <Row style={{ width: '100%', gap: '16px' }}>
        <Col style={{ width: '47.5%' }}>
          <ProCard
            style={{
              borderRadius: 8,
            }}
            bodyStyle={{
              backgroundImage:
                initialState?.settings?.navTheme === 'realDark'
                  ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                  : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
            }}
          >
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<AntDesignOutlined />}
              style={{
                marginBottom: '16px',
              }}
            />
            <ProForm
              layout="horizontal"
              formRef={formRef}
              readonly={readonly}
              request={async () => {
                return await currentUser();
              }}
              onFinish={handleSubmit}
              submitter={{
                render: (props, doms) => {
                  if (readonly) {
                    return (
                      <Button
                        onClick={() => {
                          setReadonly(false);
                        }}
                        type="primary"
                      >
                        修改资料
                      </Button>
                    );
                  }
                  return (
                    <>
                      <Button
                        onClick={() => {
                          formRef.current?.resetFields();
                          setReadonly(true);
                        }}
                        style={{ marginRight: '10px' }}
                        danger
                      >
                        取消修改
                      </Button>
                      <Button
                        onClick={() => {
                          setReadonly(true);
                          props.submit();
                        }}
                        type="primary"
                      >
                        提交
                      </Button>
                    </>
                  );
                },
              }}
            >
              <ProFormText label={'ID'} name={'id'} hidden={true} />
              <ProFormText label={'昵称'} name={'nickName'} />
              <ProFormText label={'用户名'} name={'username'} />
              <ProFormText label={'身份'} name={'role'} readonly={true} />
              <ProFormText label={'手机号'} name={'phone'} />
              <ProFormText label={'邮箱'} name={'email'} />
            </ProForm>
          </ProCard>
        </Col>
        <Col style={{ width: '47.5%' }}>
          <ProCard
            style={{
              borderRadius: 8,
            }}
            bodyStyle={{
              backgroundImage:
                initialState?.settings?.navTheme === 'realDark'
                  ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                  : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
            }}
          >
            <ProForm
              layout="horizontal"
              formRef={formRefForPassword}
              onFinish={handlePasswordSubmit}
              submitter={{
                searchConfig: {
                  resetText: '重置',
                  submitText: '修改密码',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
            >
              <ProFormText.Password
                label={'原密码'}
                name={'oldPassword'}
                rules={[
                  {
                    required: true,
                    message: '请输入原密码',
                  },
                ]}
              />
              <ProFormText.Password
                label={'新密码'}
                name={'newPassword'}
                rules={[
                  {
                    required: true,
                    message: '请输入新密码',
                  },
                ]}
              />
              <ProFormText.Password
                label={'确认新密码'}
                name={'checkNewPassword'}
                rules={[
                  {
                    required: true,
                    message: '请确认新密码',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('两次输入的新密码不匹配');
                    },
                  }),
                ]}
                dependencies={['newPassword']} // 指定依赖的字段
              />
            </ProForm>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Profile;
