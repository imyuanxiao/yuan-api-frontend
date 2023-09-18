import { getInterfaceById, onlineInvokeInterface } from '@/services/ant-design-pro/api';
import { ModalForm, ProDescriptions } from '@ant-design/pro-components';
import { Button, message, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';

interface InterfaceDetailModalProps {
  currentRow: API.UserInterfacePageVO;
  showInvoke: boolean;
  onCancel: () => void;
}

const InterfaceInvokeModal: React.FC<InterfaceDetailModalProps> = ({
  showInvoke,
  currentRow,
  onCancel,
}) => {
  const [interfaceInfo, setInterfaceInfo] = useState<API.InterfaceVO>();

  const [requestParamValue, setRequestParamValue] = useState<any>();

  const [responseData, setResponseData] = useState<any>();

  const handleInvoke = async () => {
    if (interfaceInfo) {
      const response = await onlineInvokeInterface({
        accessKey: currentRow.accessKey,
        secretKey: currentRow.secretKey,
        id: interfaceInfo.id,
        method: interfaceInfo.method,
        url: interfaceInfo.url,
        path: interfaceInfo.path,
        requestParams: requestParamValue ? requestParamValue : interfaceInfo?.requestParam,
      });
      setResponseData(response);
    } else {
      message.error('页面数据异常！');
    }
  };

  return (
    <ModalForm
      open={showInvoke}
      modalProps={{
        onCancel: onCancel,
      }}
      submitter={false}
    >
      <ProDescriptions<API.InterfaceVO>
        column={4}
        title={'接口详情'}
        request={async () => {
          const response = await getInterfaceById({ id: currentRow.id });
          setInterfaceInfo(response);
          return { data: response };
        }}
        layout={'vertical'}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            valueType: 'text',
          },
          {
            title: '描述',
            dataIndex: 'description',
            valueType: 'textarea',
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
              0: '禁用',
              1: '启用',
            },
          },
          {
            title: '请求方法',
            dataIndex: 'method',
            valueType: 'text',
          },
          {
            title: 'URL',
            dataIndex: 'url',
            valueType: 'text',
          },
          {
            title: '路径',
            dataIndex: 'path',
            valueType: 'text',
          },
          {
            title: '创建时间',
            dataIndex: 'createdTime',
            valueType: 'dateTime',
          },
          {
            title: '更新时间',
            dataIndex: 'updatedTime',
            valueType: 'dateTime',
          },
          {
            title: '请求参数说明',
            dataIndex: 'requestParamRemark',
            valueType: 'jsonCode',
            span: 24,
            render: (_, record) => {
              const parsedData = record.requestParamRemark
                ? JSON.parse(record.requestParamRemark)
                : undefined;
              // 定义表格列配置
              const columns = [
                {
                  title: '参数名称',
                  dataIndex: 'name',
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                },
                {
                  title: '是否必须',
                  dataIndex: 'required',
                },
                {
                  title: '说明',
                  dataIndex: 'description',
                },
              ];
              return (
                <Table
                  dataSource={parsedData}
                  columns={columns}
                  bordered
                  pagination={false}
                  style={{ width: '100%' }} // 设置表格宽度为100%
                />
              );
            },
          },
          {
            title: '响应参数说明',
            dataIndex: 'responseParamRemark',
            valueType: 'jsonCode',
            span: 4,
            render: (_, record) => {
              const parsedData = record.responseParamRemark
                ? JSON.parse(record.responseParamRemark)
                : undefined;
              const columns = [
                {
                  title: '参数名称',
                  dataIndex: 'name',
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                },
                {
                  title: '说明',
                  dataIndex: 'description',
                },
              ];
              return (
                <>
                  <Table
                    dataSource={parsedData}
                    columns={columns}
                    bordered
                    pagination={false}
                    style={{ width: '100%' }} // 设置表格宽度为100%
                  />
                </>
              );
            },
          },
          {
            title: '请求头',
            dataIndex: 'requestHeader',
            valueType: 'jsonCode',
            span: 2,
            render: (_, record) => {
              const parsedData = record.requestHeader
                ? JSON.parse(record.requestHeader)
                : undefined;
              const columns = [
                {
                  title: '键',
                  dataIndex: 'key',
                },
                {
                  title: '值',
                  dataIndex: 'value',
                },
              ];
              return (
                <>
                  <Table
                    dataSource={parsedData}
                    columns={columns}
                    bordered
                    pagination={false}
                    style={{ width: '100%', marginRight: '2.5%' }} // 设置表格宽度为100%
                  />
                </>
              );
            },
          },
          {
            title: '响应头',
            dataIndex: 'responseHeader',
            valueType: 'jsonCode',
            span: 2,
            render: (_, record) => {
              const parsedData = record.responseHeader
                ? JSON.parse(record.responseHeader)
                : undefined;
              const columns = [
                {
                  title: '键',
                  dataIndex: 'key',
                },
                {
                  title: '值',
                  dataIndex: 'value',
                },
              ];
              return (
                <Table
                  dataSource={parsedData}
                  columns={columns}
                  bordered
                  pagination={false}
                  style={{ width: '100%' }}
                />
              );
            },
          },
          {
            title: '请求参数',
            dataIndex: 'requestParam',
            valueType: 'textarea',
            span: 4,
            render: (_, record) => {
              return (
                <div style={{ width: '100%' }}>
                  <TextArea
                    defaultValue={record.requestParam}
                    style={{ width: '100%' }}
                    onChange={(e) => setRequestParamValue(e.target.value)}
                  />
                  <Button type="primary" style={{ marginTop: '8px' }} onClick={handleInvoke}>
                    在线调试
                  </Button>
                </div>
              );
            },
          },
          {
            title: '返回结果',
            dataIndex: 'responseData',
            valueType: 'textarea',
            span: 4,
            render: (_, record) => {
              return (
                <TextArea
                  style={{ width: '100%' }}
                  value={responseData}
                  autoSize={{ minRows: 3 }}
                />
              );
            },
          },
        ]}
      />
    </ModalForm>
  );
};

export default InterfaceInvokeModal;
