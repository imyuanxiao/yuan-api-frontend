import {
  addInterface,
  getInterfaceById,
  getInterfaceList,
} from '@/services/ant-design-pro/api';
import type {
  ActionType,
  EditableFormInstance,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance
} from '@ant-design/pro-components';
import {
  FooterToolbar, ModalForm,
  PageContainer,
  ProDescriptions,
  ProTable,
  ProForm, ProFormText, ProFormSelect, EditableProTable
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {Button, Drawer, Input, message, Table} from 'antd';
import React, { useRef, useState, useEffect  } from 'react';
import { interfaceStatusEnum } from "@/utils/CommonValue";
import { useAccess, Access } from 'umi';
import {PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const InterfaceList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<API.InterfacePageVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfacePageVO[]>([]);

  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页显示的数据数量

  const [interfaceInfo, setInterfaceInfo] = useState<API.InterfaceVO>();

  /* 创建接口 */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  /* 编辑接口 */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  //const restFormRef = useRef<ProFormInstance>();


  const formRef = useRef<ProFormInstance<any>>();

  const [editableKeysForRequest, setEditableRowKeysForRequest] = useState<React.Key[]>(() => []);
  const editableFormRefForRequest = useRef<EditableFormInstance>();
  const actionRefForRequest = useRef<ActionType>();

  const [editableKeysForRequestHeader, setEditableRowKeysForRequestHeader] = useState<React.Key[]>(() => []);
  const editableFormRefForRequestHeader = useRef<EditableFormInstance>();
  const actionRefForRequestHeader = useRef<ActionType>();

  const [editableKeysForResponseHeader, setEditableRowKeysForResponseHeader] = useState<React.Key[]>(() => []);
  const editableFormRefForResponseHeader = useRef<EditableFormInstance>();
  const actionRefForResponseHeader = useRef<ActionType>();

  const [editableKeysForResponse, setEditableRowKeysForResponse] = useState<React.Key[]>(() => []);
  const editableFormRefForResponse = useRef<EditableFormInstance>();
  const actionRefForResponse = useRef<ActionType>();

  const actionRefForSearch = useRef<ActionType>();



  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const access = useAccess();

  const InterfacePageColumns: ProColumns<API.InterfacePageVO>[] = [
    {
      title: (
        <FormattedMessage
          id="typings.InterfacePageVO.id"
          defaultMessage="接口ID"
        />
      ),
      dataIndex: 'id',
      hideInTable: true, // 隐藏该列
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: (
        <FormattedMessage
          id="common.index"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'index',
      hideInSearch: true,
      render: (dom, entity, index) => {
        const realIndex = (currentPage - 1) * pageSize + index + 1; // 计算真实的序号
        return realIndex;
      },
    },
    {
      title: (
        <FormattedMessage
          id="typings.InterfacePageVO.name"
          defaultMessage="名称"
        />
      ),
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="typings.UserListItem.userPhone" defaultMessage="描述"/>,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="typings.UserListItem.userPhone" defaultMessage="方法"/>,
      dataIndex: 'method',
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: <FormattedMessage id="typings.UserListItem.userStatus" defaultMessage="状态"/>,
      dataIndex: 'status',
      valueEnum: interfaceStatusEnum,
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: <FormattedMessage id="typings.UserListItem.userPhone" defaultMessage="创建时间"/>,
      dataIndex: 'createdTime',
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: <FormattedMessage id="common.operation" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          <Button
            onClick={() => {
              setCurrentRow(record);
              //handleUpdateModalOpen(true);
            }}
           // type={"primary"}
          >
            <FormattedMessage id="common.operation.edit" defaultMessage="申请" />
          </Button>
          <Access
            key="editUserOption"
            accessible={access.canAdmin}>
            {record.status === 0 && (
              <Button
                onClick={() => {
                  setCurrentRow(record);
                  //handleUpdateModalOpen(true);
                }}
                type={"primary"}
              >
                <FormattedMessage id="common.operation.edit" defaultMessage="发布" />
              </Button>
            )}
            {record.status === 1 && (
              <Button
                onClick={() => {
                  setCurrentRow(record);
                  //handleUpdateModalOpen(true);
                }}
                danger
                type={"primary"}
              >
                <FormattedMessage id="common.operation.edit" defaultMessage="下线" />
              </Button>
            )}
          </Access>

        </>
      ],
    },
  ];

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
      initialValue: 'string'
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
      initialValue: 'string'
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
            const tableDataSource = formRef.current?.getFieldValue(
              'requestHeader',
            ) as HeaderItem[];
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
    <PageContainer>

      {/* 新增接口弹窗 */}
      <ModalForm
        layout="vertical"
        title={"新增接口"}
        formRef={formRef}
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          if(
            editableKeysForRequest.length > 0
            || editableKeysForRequestHeader.length > 0
            || editableKeysForResponseHeader.length > 0
            || editableKeysForResponse.length > 0
          ){
            message.error("请先保存编辑中的数据！");
            return;
          }
          const success = await addInterface(value);
          if (success) {
            handleModalOpen(false);
            //formRef.current?.resetFields();
            if (actionRefForSearch.current) {
              actionRefForSearch.current.reload();
            }
          }
        }}
        submitter={{
          searchConfig: {
            resetText: '重置',
          },
          resetButtonProps: {
            onClick: () => {
              // 清楚所有表格的编辑状态
              if(
                editableKeysForRequest.length > 0
              || editableKeysForRequestHeader.length > 0
              || editableKeysForResponseHeader.length > 0
              || editableKeysForResponse.length > 0
              ){
                message.error("请先保存编辑中的数据！");
                return;
              }
              formRef.current?.resetFields();
            },
          },
        }}
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
        }}
      >
        <div style={{ gridColumn: 'span 2', display: "flex",  gap: '16px' }}>
          <ProFormText
            name="name"
            width={"md"}
            label={"名称"}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText
            name="description"
            width={"md"}
            label={"描述"}
            rules={[
              {
                required: true,
              },
            ]}
          />
        </div>
        <div style={{ gridColumn: 'span 2' , display: "flex", gap: '16px'}}>
          <ProFormText
            name="method"
            label={"方法"}
            width={"xs"}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText
            name="url"
            label={"URL"}
            width={"md"}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText
            name="path"
            label={"路径"}
            width={"sm"}
            rules={[
              {
                required: true,
              },
            ]}
          />
        </div>
        <div style={{ gridColumn: 'span 2'}}>
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

          <ProFormText
            name="requestParam"
            label={"请求参数示例"}
            width={"100%"}
          />

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

        <EditableProTable<{ key:string, value:string }>
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

        <EditableProTable<{ key:string, value:string }>
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



      <ProTable<API.InterfacePageVO, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '查询信息',
        })}
        actionRef={actionRefForSearch}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Access
            key="tableAddUser"
            accessible={access.canAdmin}>
            <Button
              type="primary"
              onClick={() => {
                handleModalOpen(true);
              }}
            >
              <PlusOutlined/> <FormattedMessage id="common.operation.add" defaultMessage="新增"/>
            </Button>
          </Access>,
        ]}
        request={(params) => {
          // 更新当前页码和每页显示数量
          setCurrentPage(params.current || 1);
          setPageSize(params.pageSize || 10);
          // 调用实际的请求方法，传递 params 参数
          return getInterfaceList(params);
        }}
        columns={InterfacePageColumns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '50'], // 自定义的每页显示数据数量选项
          defaultPageSize: 10, // 默认的每页显示数据数量
          showSizeChanger: true,
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
            </div>
          }
        >
          <Access accessible={access.canAdmin}>
            <Button
              onClick={async () => {
                // await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRefForSearch.current?.reloadAndRest?.();
              }}
              danger={true}
            >
              <FormattedMessage
                id="pages.searchTable.batchDeletion"
                defaultMessage="批量删除"
              />
            </Button>
          </Access>
        </FooterToolbar>
      )}

      <ModalForm
        open={showDetail}
        modalProps={{
          onCancel: () => {
            setCurrentRow(undefined);
            setShowDetail(false);
            setInterfaceInfo(undefined);
          },
        }}
        submitter={false}
      >
        {currentRow?.id &&(
          <ProDescriptions<API.InterfaceVO>
            column={4}
            title={
              <FormattedMessage id="pages.dataDetail.title" defaultMessage="接口详情"/>
            }
            request={async () => {
              const response = await getInterfaceById({id: currentRow?.id});
              setInterfaceInfo(response);
              return {data: response};
            }}
            layout={"vertical"}
            params={{
              id: currentRow?.id,
            }}
            columns={
              [
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
                    const parsedData = record.requestParamRemark? JSON.parse(record.requestParamRemark) : undefined;
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
                    const parsedData = record.responseParamRemark ? JSON.parse(record.responseParamRemark): undefined;
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
                    const parsedData = record.requestHeader? JSON.parse(record.requestHeader) : undefined;
                    // 定义表格列配置
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
                          dataSource={
                            parsedData ? Object.keys(parsedData).map((key) => ({
                              key,
                              value: parsedData[key],
                            })) : undefined
                          }
                          columns={columns}
                          bordered
                          pagination={false}
                          style={{ width: '100%', marginRight: '2.5%' }} // 设置表格宽度为100%
                        />
                      </>
                    );
                  }
                },
                {
                  title: '响应头',
                  dataIndex: 'responseHeader',
                  valueType: 'jsonCode',
                  span: 2,
                  render: (_, record) => {
                    const parsedData = record.responseHeader? JSON.parse(record.responseHeader) : undefined;
                    // 将解析后的请求头数据转换为包含 "键" 和 "值" 的对象数组
                    // const dataSource = Object.keys(parsedData).map((key) => ({
                    //   key,
                    //   value: parsedData[key],
                    // }));
                    // 定义表格列配置
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
                        dataSource={
                          parsedData ?
                            Object.keys(parsedData).map((key) => ({
                              key,
                              value: parsedData[key],
                            })): undefined
                        }
                        columns={columns}
                        bordered
                        pagination={false}
                        style={{ width: '100%'}} // 设置表格宽度为100%
                      />
                    );
                  }
                },
                {
                  title: '请求参数示例',
                  dataIndex: 'requestParam',
                  valueType: 'textarea',
                  span: 4,
                },
              ]}
          />
        )}
      </ModalForm>



    </PageContainer>
  );
};

export default InterfaceList;
