import { ModalForm } from '@ant-design/pro-form';
import ProFormText from '@ant-design/pro-form/lib/components/Text';
import { EditableProTable } from '@ant-design/pro-table';
import { message } from 'antd';
import React, { useRef, useState } from 'react';

import { addInterface, getInterfaceById, updateInterface } from '@/services/ant-design-pro/api';
import {
  ActionType,
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components'; // 替换为实际的 API 请求函数

// 其他导入语句...
interface InterfaceFormModalProps {
  interfaceId?: number;
  modalOpen: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

const InterfaceFormModal: React.FC<InterfaceFormModalProps> = ({
  modalOpen,
  onCancel,
  onFinish,
  interfaceId,
}) => {
  // 定义 formRef 和其他状态和函数
  const formRef = useRef<ProFormInstance<any>>();
  const [editableKeysForRequest, setEditableRowKeysForRequest] = useState<React.Key[]>(() => []);
  const editableFormRefForRequest = useRef<EditableFormInstance>();
  const actionRefForRequest = useRef<ActionType>();

  const [editableKeysForRequestHeader, setEditableRowKeysForRequestHeader] = useState<React.Key[]>(
    () => [],
  );
  const editableFormRefForRequestHeader = useRef<EditableFormInstance>();
  const actionRefForRequestHeader = useRef<ActionType>();

  const [editableKeysForResponseHeader, setEditableRowKeysForResponseHeader] = useState<
    React.Key[]
  >(() => []);
  const editableFormRefForResponseHeader = useRef<EditableFormInstance>();
  const actionRefForResponseHeader = useRef<ActionType>();

  const [editableKeysForResponse, setEditableRowKeysForResponse] = useState<React.Key[]>(() => []);
  const editableFormRefForResponse = useRef<EditableFormInstance>();
  const actionRefForResponse = useRef<ActionType>();

  type RequestParamRemarkItem = {
    id: React.Key;
    name?: string;
    type?: string;
    required?: boolean;
    description?: string;
  };
  const RequestParamRemarkColumns: ProColumns<RequestParamRemarkItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'text',
      ellipsis: true,
      initialValue: 'string',
    },
    {
      title: '是否必须',
      key: 'required',
      dataIndex: 'required',
      valueType: 'select',
      initialValue: 'false',
      valueEnum: {
        false: { text: '否', status: 'Warning' },
        true: { text: '是', status: 'Default' },
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue(
              'requestParamRemark',
            ) as RequestParamRemarkItem[];
            formRef.current?.setFieldsValue({
              requestParamRemark: tableDataSource.filter((item) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>,
        <a
          key="edit"
          onClick={() => {
            actionRefForRequest.current?.startEditable(row.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  type ResponseParamRemarkItem = {
    id: React.Key;
    name?: string;
    type?: string;
    required?: boolean;
    description?: string;
  };
  const ResponseParamRemarkColumns: ProColumns<ResponseParamRemarkItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'text',
      ellipsis: true,
      initialValue: 'string',
    },
    {
      title: '说明',
      dataIndex: 'description',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue(
              'responseParamRemark',
            ) as RequestParamRemarkItem[];
            formRef.current?.setFieldsValue({
              responseParamRemark: tableDataSource.filter((item) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>,
        <a
          key="edit"
          onClick={() => {
            actionRefForResponse.current?.startEditable(row.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  type HeaderItem = {
    id: React.Key;
    key?: string;
    value?: string;
  };
  const RequestHeaderColumns: ProColumns<HeaderItem>[] = [
    {
      title: '键',
      dataIndex: 'key',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '值',
      dataIndex: 'value',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('requestHeader') as HeaderItem[];
            formRef.current?.setFieldsValue({
              requestHeader: tableDataSource.filter((item) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>,
        <a
          key="edit"
          onClick={() => {
            actionRefForRequestHeader.current?.startEditable(row.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  const ResponseHeaderColumns: ProColumns<HeaderItem>[] = [
    {
      title: '键',
      dataIndex: 'key',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '值',
      dataIndex: 'value',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue(
              'responseHeader',
            ) as HeaderItem[];
            formRef.current?.setFieldsValue({
              responseHeader: tableDataSource.filter((item) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>,
        <a
          key="edit"
          onClick={() => {
            actionRefForResponseHeader.current?.startEditable(row.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <ModalForm
      layout="vertical"
      title={'新增接口'}
      formRef={formRef}
      open={modalOpen}
      modalProps={{
        onCancel: onCancel,
        destroyOnClose: true,
      }}
      request={async () => {
        if (interfaceId === undefined) {
          return {};
        }
        const response = await getInterfaceById({ id: interfaceId });
        const interfaceInfo = response as API.InterfaceVO;
        console.log('interfaceInfo>>', interfaceInfo);
        return {
          ...interfaceInfo,
          requestParam: interfaceInfo.requestParam,
          requestParamRemark: interfaceInfo.requestParamRemark
            ? JSON.parse(interfaceInfo.requestParamRemark).map((item: any, index: number) => ({
              ...item,
              id: index + 2, // 添加递增的 id 属性
            }))
            : undefined,
          requestHeader: interfaceInfo.requestHeader
            ? JSON.parse(interfaceInfo.requestHeader).map((item: any, index: number) => ({
              ...item,
              id: index + 2, // 添加递增的 id 属性
            }))
            : undefined,
          responseParamRemark: interfaceInfo.responseParamRemark
            ? JSON.parse(interfaceInfo.responseParamRemark).map((item: any, index: number) => ({
              ...item,
              id: index + 2, // 添加递增的 id 属性
            }))
            : undefined,
          responseHeader: interfaceInfo.responseHeader
            ? JSON.parse(interfaceInfo.responseHeader).map((item: any, index: number) => ({
              ...item,
              id: index + 2, // 添加递增的 id 属性
            }))
            : undefined,
        };
      }}
      onFinish={async (value) => {
        if (
          editableKeysForRequest.length > 0 ||
          editableKeysForRequestHeader.length > 0 ||
          editableKeysForResponseHeader.length > 0 ||
          editableKeysForResponse.length > 0
        ) {
          message.error('请先保存编辑中的数据！');
          return;
        }
        let success;
        if (interfaceId === undefined) {
          success = await addInterface(value);
        } else {
          success = await updateInterface(value);
        }
        if (success) {
          onFinish();
          formRef.current?.resetFields();
        }
      }}
      submitter={{
        searchConfig: {
          resetText: '重置',
        },
        resetButtonProps: {
          onClick: () => {
            if (
              editableKeysForRequest.length > 0 ||
              editableKeysForRequestHeader.length > 0 ||
              editableKeysForResponseHeader.length > 0 ||
              editableKeysForResponse.length > 0
            ) {
              console.log(
                editableKeysForRequest,
                editableKeysForRequestHeader,
                editableKeysForResponseHeader,
                editableKeysForResponse,
              );
              message.error('请先保存编辑中的数据！');
              return;
            }
            formRef.current?.resetFields();
          },
        },
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}
    >
      <ProFormText name="id" hidden={true} />
      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px' }}>
        <ProFormText
          name="name"
          width={'md'}
          label={'名称'}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText
          name="description"
          width={'md'}
          label={'描述'}
          rules={[
            {
              required: true,
            },
          ]}
        />
      </div>
      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px' }}>
        <ProFormText
          name="method"
          label={'方法'}
          width={'xs'}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText
          name="url"
          label={'URL'}
          width={'md'}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText
          name="path"
          label={'路径'}
          width={'sm'}
          rules={[
            {
              required: true,
            },
          ]}
        />
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <EditableProTable<RequestParamRemarkItem>
          rowKey="id"
          scroll={{
            x: true,
          }}
          formItemProps={{
            label: '请求参数说明',
          }}
          editableFormRef={editableFormRefForRequest}
          actionRef={actionRefForRequest}
          controlled
          maxLength={10}
          name="requestParamRemark"
          columns={RequestParamRemarkColumns}
          recordCreatorProps={{
            record: (index) => {
              return { id: index + 1 };
            },
          }}
          editable={{
            type: 'multiple',
            editableKeysForRequest,
            onChange: setEditableRowKeysForRequest,
          }}
        />

        <ProFormText name="requestParam" label={'请求参数示例'} style={{ width: '100%' }} />

        <EditableProTable<ResponseParamRemarkItem>
          rowKey="id"
          scroll={{
            x: true,
          }}
          formItemProps={{
            label: '响应参数说明',
          }}
          //formRef={formRefForResponse}
          editableFormRef={editableFormRefForResponse}
          actionRef={actionRefForResponse}
          controlled
          maxLength={10}
          name="responseParamRemark"
          columns={ResponseParamRemarkColumns}
          recordCreatorProps={{
            record: (index) => {
              return { id: index + 1 };
            },
          }}
          editable={{
            type: 'multiple',
            editableKeysForResponse,
            onChange: setEditableRowKeysForResponse,
          }}
        />
      </div>

      <EditableProTable<{ key: string; value: string }>
        rowKey="id"
        scroll={{
          x: true,
        }}
        formItemProps={{
          label: '请求头',
        }}
        editableFormRef={editableFormRefForRequestHeader}
        actionRef={actionRefForRequestHeader}
        controlled
        name="requestHeader"
        columns={RequestHeaderColumns}
        recordCreatorProps={{
          record: (index) => {
            return { id: index + 1 };
          },
        }}
        editable={{
          type: 'multiple',
          editableKeysForRequestHeader,
          onChange: setEditableRowKeysForRequestHeader,
        }}
      />

      <EditableProTable<{ key: string; value: string }>
        rowKey="id"
        scroll={{
          x: true,
        }}
        formItemProps={{
          label: '响应头',
        }}
        editableFormRef={editableFormRefForResponseHeader}
        actionRef={actionRefForResponseHeader}
        controlled
        name="responseHeader"
        columns={ResponseHeaderColumns}
        recordCreatorProps={{
          record: (index) => {
            return { id: index + 1 };
          },
        }}
        editable={{
          type: 'multiple',
          editableKeysForResponseHeader,
          onChange: setEditableRowKeysForResponseHeader,
        }}
      />
    </ModalForm>
  );
};

export default InterfaceFormModal;
