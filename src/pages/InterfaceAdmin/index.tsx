import {
  getInterfaceById,
  getInterfaceList, removeInterface, setInterfaceStatus,
} from '@/services/ant-design-pro/api';
import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {Button, message} from 'antd';
import React, { useRef, useState  } from 'react';
import { interfaceStatusEnum } from "@/utils/CommonValue";
import { useAccess, Access } from 'umi';
import {PlusOutlined} from "@ant-design/icons";
import InterfaceDetailModal from "@/components/InterfaceModal/InterfaceDetailModal";
import InterfaceFormModal from "@/components/InterfaceModal/InterfaceFormModal";

const InterfaceAdmin: React.FC = () => {

  const intl = useIntl();
  const access = useAccess();

  const actionRefForSearch = useRef<ActionType>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.InterfacePageVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfacePageVO[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页显示的数据数量

  //const [interfaceInfo, setInterfaceInfo] = useState<API.InterfaceVO>()

  /* 创建接口 */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /* 编辑接口 */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  /* 上线/下线接口 */
  const handleInterfaceStatus = async(id: number, status: boolean) =>{
    if(id){
      const response = await setInterfaceStatus({
        id: id,
        status: status? 1: 0
      })
      if(response){
        actionRefForSearch.current?.reload();
      }
    }else{
      message.error("页面数据异常！")
    }
  }
  /* 批量删除接口 */
  const handleRemove = async (selectedRows: API.InterfacePageVO[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await removeInterface(selectedRows.map((row) => row.id));
      hide();
      message.success('删除成功');
    } catch (error) {
      hide();
      message.error('删除失败，请重试！');
    }
  };

  /* 接口分页表表头 */
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
          <Access
            key="editUserOption"
            accessible={access.canAdmin}>
            {record.status === 0 && (
              <Button
                onClick={() => {
                  setCurrentRow(record);
                  handleInterfaceStatus(record?.id, true);
                }}
                type={"primary"}
              >
                <FormattedMessage id="common.operation.online" defaultMessage="上线" />
              </Button>
            )}
            {record.status === 1 && (
              <Button
                onClick={() => {
                  setCurrentRow(record);
                  handleInterfaceStatus(record?.id,false);
                }}
                danger
                type={"primary"}
              >
                <FormattedMessage id="common.operation.offline" defaultMessage="下线" />
              </Button>
            )}
            <Button
              onClick={async () => {
                setCurrentRow(record);
                const response = await getInterfaceById({id: record.id});
                //setInterfaceInfo(response.data);
                handleUpdateModalOpen(true);
              }}
                >
              <FormattedMessage id="common.operation.edit" defaultMessage="编辑" />
            </Button>
          </Access>

        </>
      ],
    },
  ];

  return (
    <PageContainer>

      {/* 新增及编辑组件 */}
      <InterfaceFormModal
        modalOpen={createModalOpen || updateModalOpen}
        interfaceId={currentRow?.id}
        onCancel={() => {
          handleModalOpen(false);
          handleUpdateModalOpen(false);
          setCurrentRow(undefined);
        }}
        onFinish={() =>{
          handleModalOpen(false);
          handleUpdateModalOpen(false);
          setCurrentRow(undefined);
          actionRefForSearch.current?.reload();
        }}
      />

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
                setCurrentRow(undefined);
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
                await handleRemove(selectedRowsState);
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

      {/* 使用 InterfaceDetailModal 组件 */}
      <InterfaceDetailModal
        showDetail={showDetail}
        currentRow={currentRow}
        onCancel={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        onRequest={async () => {
          const response = await getInterfaceById({id: currentRow?.id});
          return {data: response};
        }}
      />

    </PageContainer>
  );
};

export default InterfaceAdmin;
