import {
  getInterfaceById,
  getInterfaceList, getUserInterfaceList, onlineInvokeInterface,
} from '@/services/ant-design-pro/api';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {
  FooterToolbar, ModalForm,
  PageContainer,
  ProDescriptions, ProForm, ProFormSelect, ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {Button, Divider, Table} from 'antd';
import React, { useRef, useState } from 'react';
import TextArea from "antd/es/input/TextArea";

const UserInterfaceList: React.FC = () => {

  /* 接口信息 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserInterfacePageVO>();
  const [interfaceInfo, setInterfaceInfo] = useState<API.InterfaceVO>();

  const [selectedRowsState, setSelectedRows] = useState<API.UserInterfacePageVO[]>([]);

  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页显示的数据数量

  // 用于存储接口请求参数
  const [requestParamValue, setRequestParamValue] = useState();
  // 用于存储返回结果
  const [responseData, setResponseData] = useState();


  // 点击按钮时执行的操作
  const handleInvoke = async () => {
    const response = await onlineInvokeInterface({
      accessKey: currentRow?.accessKey,
      secretKey: currentRow?.secretKey,
      id: interfaceInfo?.id,
      method: interfaceInfo?.method,
      url: interfaceInfo?.url,
      path: interfaceInfo?.path,
      requestParams: requestParamValue? requestParamValue : interfaceInfo?.requestParam
    });
    setResponseData(response);
    // 处理响应
    console.log('响应数据：', response);
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.UserInterfacePageVO>[] = [
    {
      title: (
        <FormattedMessage
          id="typings.UserInterfacePageVO.id"
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
          id="typings.UserInterfacePageVO.name"
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
      title: <FormattedMessage id="typings.UserInterfacePageVO.description" defaultMessage="描述"/>,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="typings.UserInterfacePageVO.leftNum" defaultMessage="剩余次数"/>,
      dataIndex: 'leftNum',
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: <FormattedMessage id="typings.UserInterfacePageVO.totalNum" defaultMessage="总次数"/>,
      dataIndex: 'totalNum',
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: <FormattedMessage id="typings.UserInterfacePageVO.accessKey" defaultMessage="accessKey"/>,
      dataIndex: 'accessKey',
      hideInSearch: true, // 隐藏搜索条件

    },
    {
      title: <FormattedMessage id="typings.UserInterfacePageVO.secretKey" defaultMessage="secretKey"/>,
      dataIndex: 'secretKey',
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
            }}
            type={"primary"}
          >
            <FormattedMessage id="common.operation.edit" defaultMessage="在线调试" />
          </Button>
        </>
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.UserInterfacePageVO, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '查询信息',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params) => {
          // 更新当前页码和每页显示数量
          setCurrentPage(params.current || 1);
          setPageSize(params.pageSize || 10);
          // 调用实际的请求方法，传递 params 参数
          return getUserInterfaceList(params);
        }}
        columns={columns}
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
        </FooterToolbar>
      )}

      {/* 接口详情 */}
      <ModalForm
        open={showDetail}
        modalProps={{
          onCancel: () => {
            setCurrentRow(undefined);
            setShowDetail(false);
            setInterfaceInfo(undefined);
            setRequestParamValue(undefined);
            setResponseData(undefined)
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
                  title: '请求参数',
                  dataIndex: 'requestParam',
                  valueType: 'textarea',
                  span: 4,
                  render: (_,  record) => {
                    return (
                      <div style={{ width: '100%' }}>
                        <TextArea
                          defaultValue={record.requestParam}
                          style={{ width: '100%' }}
                          onChange={(e) => setRequestParamValue(e.target.value)}
                        />
                        <Button
                          type="primary"
                          style={{ marginTop: '8px' }}
                          onClick={handleInvoke}
                        >
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
                  render: (_,  record) => {
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
        )}
      </ModalForm>


      {/*<ModalForm*/}
      {/*  open={showDetail}*/}
      {/*  modalProps={{*/}
      {/*    onCancel: () => {*/}
      {/*      setCurrentRow(undefined);*/}
      {/*      setShowDetail(false);*/}
      {/*      setInterfaceInfo(undefined);*/}
      {/*      setRequestParamValue(undefined);*/}
      {/*      setResponseData(undefined)*/}
      {/*    },*/}
      {/*  }}*/}
      {/*  submitter={false}*/}
      {/*>*/}
      {/*  {currentRow?.id &&(*/}
      {/*    <ProDescriptions<API.InterfaceVO>*/}
      {/*      column={4}*/}
      {/*      title={*/}
      {/*        <FormattedMessage id="pages.dataDetail.title" defaultMessage="接口详情"/>*/}
      {/*      }*/}
      {/*      request={async () => {*/}
      {/*        const response = await getInterfaceById({id: currentRow?.id});*/}
      {/*        setInterfaceInfo(response);*/}
      {/*        return {data: response};*/}
      {/*      }}*/}
      {/*      layout={"vertical"}*/}
      {/*      params={{*/}
      {/*        id: currentRow?.id,*/}
      {/*      }}*/}
      {/*      columns={*/}
      {/*        [*/}
      {/*          {*/}
      {/*            title: '名称',*/}
      {/*            dataIndex: 'name',*/}
      {/*            valueType: 'text',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '描述',*/}
      {/*            dataIndex: 'description',*/}
      {/*            valueType: 'textarea',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '状态',*/}
      {/*            dataIndex: 'status',*/}
      {/*            valueType: 'select',*/}
      {/*            valueEnum: {*/}
      {/*              0: '禁用',*/}
      {/*              1: '启用',*/}
      {/*            },*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '请求方法',*/}
      {/*            dataIndex: 'method',*/}
      {/*            valueType: 'text',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: 'URL',*/}
      {/*            dataIndex: 'url',*/}
      {/*            valueType: 'text',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '路径',*/}
      {/*            dataIndex: 'path',*/}
      {/*            valueType: 'text',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '创建时间',*/}
      {/*            dataIndex: 'createdTime',*/}
      {/*            valueType: 'dateTime',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '更新时间',*/}
      {/*            dataIndex: 'updatedTime',*/}
      {/*            valueType: 'dateTime',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '请求参数说明',*/}
      {/*            dataIndex: 'requestParamRemark',*/}
      {/*            valueType: 'jsonCode',*/}
      {/*            span: 24,*/}
      {/*            render: (_, record) => {*/}
      {/*              const parsedData = record.requestParamRemark? JSON.parse(record.requestParamRemark) : undefined;*/}
      {/*              // 定义表格列配置*/}
      {/*              const columns = [*/}
      {/*                {*/}
      {/*                  title: '参数名称',*/}
      {/*                  dataIndex: 'name',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '类型',*/}
      {/*                  dataIndex: 'type',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '是否必须',*/}
      {/*                  dataIndex: 'required',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '说明',*/}
      {/*                  dataIndex: 'description',*/}
      {/*                },*/}
      {/*              ];*/}
      {/*              return (*/}
      {/*                <Table*/}
      {/*                  dataSource={parsedData}*/}
      {/*                  columns={columns}*/}
      {/*                  bordered*/}
      {/*                  pagination={false}*/}
      {/*                  style={{ width: '100%' }} // 设置表格宽度为100%*/}
      {/*                />*/}
      {/*              );*/}
      {/*            },*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '响应参数说明',*/}
      {/*            dataIndex: 'responseParamRemark',*/}
      {/*            valueType: 'jsonCode',*/}
      {/*            span: 4,*/}
      {/*            render: (_, record) => {*/}
      {/*              const parsedData = record.responseParamRemark ? JSON.parse(record.responseParamRemark): undefined;*/}
      {/*              // 定义表格列配置*/}
      {/*              const columns = [*/}
      {/*                {*/}
      {/*                  title: '参数名称',*/}
      {/*                  dataIndex: 'name',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '类型',*/}
      {/*                  dataIndex: 'type',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '是否必须',*/}
      {/*                  dataIndex: 'required',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '说明',*/}
      {/*                  dataIndex: 'description',*/}
      {/*                },*/}
      {/*              ];*/}
      {/*              return (*/}
      {/*                <>*/}
      {/*                  <Table*/}
      {/*                    dataSource={parsedData}*/}
      {/*                    columns={columns}*/}
      {/*                    bordered*/}
      {/*                    pagination={false}*/}
      {/*                    style={{ width: '100%' }} // 设置表格宽度为100%*/}
      {/*                  />*/}
      {/*                </>*/}
      {/*              );*/}
      {/*            },*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '请求头',*/}
      {/*            dataIndex: 'requestHeader',*/}
      {/*            valueType: 'jsonCode',*/}
      {/*            span: 2,*/}
      {/*            render: (_, record) => {*/}
      {/*              const parsedData = record.requestHeader? JSON.parse(record.requestHeader) : undefined;*/}
      {/*              // 定义表格列配置*/}
      {/*              const columns = [*/}
      {/*                {*/}
      {/*                  title: '键',*/}
      {/*                  dataIndex: 'key',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '值',*/}
      {/*                  dataIndex: 'value',*/}
      {/*                },*/}
      {/*              ];*/}
      {/*              return (*/}
      {/*                <>*/}
      {/*                  <Table*/}
      {/*                    dataSource={*/}
      {/*                      parsedData ? Object.keys(parsedData).map((key) => ({*/}
      {/*                        key,*/}
      {/*                        value: parsedData[key],*/}
      {/*                      })) : undefined*/}
      {/*                    }*/}
      {/*                    columns={columns}*/}
      {/*                    bordered*/}
      {/*                    pagination={false}*/}
      {/*                    style={{ width: '100%', marginRight: '2.5%' }} // 设置表格宽度为100%*/}
      {/*                  />*/}
      {/*                </>*/}
      {/*              );*/}
      {/*            }*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '响应头',*/}
      {/*            dataIndex: 'responseHeader',*/}
      {/*            valueType: 'jsonCode',*/}
      {/*            span: 2,*/}
      {/*            render: (_, record) => {*/}
      {/*              const parsedData = record.responseHeader? JSON.parse(record.responseHeader) : undefined;*/}
      {/*              // 定义表格列配置*/}
      {/*              const columns = [*/}
      {/*                {*/}
      {/*                  title: '键',*/}
      {/*                  dataIndex: 'key',*/}
      {/*                },*/}
      {/*                {*/}
      {/*                  title: '值',*/}
      {/*                  dataIndex: 'value',*/}
      {/*                },*/}
      {/*              ];*/}
      {/*              return (*/}
      {/*                <Table*/}
      {/*                  dataSource={*/}
      {/*                    parsedData ?*/}
      {/*                      Object.keys(parsedData).map((key) => ({*/}
      {/*                        key,*/}
      {/*                        value: parsedData[key],*/}
      {/*                      })): undefined*/}
      {/*                  }*/}
      {/*                  columns={columns}*/}
      {/*                  bordered*/}
      {/*                  pagination={false}*/}
      {/*                  style={{ width: '100%'}} // 设置表格宽度为100%*/}
      {/*                />*/}
      {/*              );*/}
      {/*            }*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '请求参数',*/}
      {/*            dataIndex: 'requestParam',*/}
      {/*            valueType: 'textarea',*/}
      {/*            span: 4,*/}
      {/*            render: (_,  record) => {*/}
      {/*              return (*/}
      {/*                <div style={{ width: '100%' }}>*/}
      {/*                  <TextArea*/}
      {/*                    defaultValue={record.requestParam}*/}
      {/*                    style={{ width: '100%' }}*/}
      {/*                    onChange={(e) => setRequestParamValue(e.target.value)}*/}
      {/*                  />*/}
      {/*                  <Button*/}
      {/*                    type="primary"*/}
      {/*                    style={{ marginTop: '8px' }}*/}
      {/*                    onClick={handleInvoke}*/}
      {/*                  >*/}
      {/*                    在线调试*/}
      {/*                  </Button>*/}
      {/*                </div>*/}
      {/*              );*/}
      {/*            },*/}
      {/*          },*/}
      {/*          {*/}
      {/*            title: '返回结果',*/}
      {/*            dataIndex: 'responseData',*/}
      {/*            valueType: 'textarea',*/}
      {/*            span: 4,*/}
      {/*            render: (_,  record) => {*/}
      {/*              return (*/}
      {/*                <TextArea*/}
      {/*                  style={{ width: '100%' }}*/}
      {/*                  value={responseData}*/}
      {/*                  autoSize={{ minRows: 3 }}*/}
      {/*                />*/}
      {/*              );*/}
      {/*            },*/}
      {/*          },*/}
      {/*        ]}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</ModalForm>*/}


    </PageContainer>
  );
};

export default UserInterfaceList;
