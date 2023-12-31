import InterfaceDetailModal from '@/components/InterfaceModal/InterfaceDetailModal';
import InterfaceFormModal from '@/components/InterfaceModal/InterfaceFormModal';
import {
  getInterfaceList,
  removeInterface,
  setInterfaceStatus,
} from '@/services/ant-design-pro/api';
import { interfaceStatusEnum } from '@/utils/CommonValue';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { Access, useAccess } from 'umi';

const InterfaceAdmin: React.FC = () => {
  /* 权限管理 */
  const access = useAccess();

  const actionRefForSearch = useRef<ActionType>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.InterfacePageVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfacePageVO[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页显示的数据数量

  /* 创建接口 */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /* 编辑接口 */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  /* 上线/下线接口 */
  const handleInterfaceStatus = async (id: number, status: boolean) => {
    if (id) {
      const response = await setInterfaceStatus({
        id: id,
        status: status ? 1 : 0,
      });
      if (response) {
        actionRefForSearch.current?.reload();
      }
    } else {
      message.error('页面数据异常！');
    }
  };
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
      title: '接口ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '序号',
      dataIndex: 'index',
      hideInSearch: true,
      render: (dom, entity, index) => {
        const realIndex = (currentPage - 1) * pageSize + index + 1; // 计算真实的序号
        return realIndex;
      },
    },
    {
      title: '名称',
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
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '方法',
      dataIndex: 'method',
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: interfaceStatusEnum,
      hideInSearch: true, // 隐藏搜索条件
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          <Access key="editUserOption" accessible={access.canAdmin || false}>
            {record.status === 0 && (
              <Button
                onClick={() => {
                  setCurrentRow(record);
                  handleInterfaceStatus(record.id, true);
                }}
                type={'primary'}
              >
                上线
              </Button>
            )}
            {record?.id && record.status === 1 && (
              <Button
                onClick={() => {
                  setCurrentRow(record);
                  handleInterfaceStatus(record.id, false);
                }}
                danger
                type={'primary'}
              >
                下线
              </Button>
            )}
            <Button
              onClick={async () => {
                setCurrentRow(record);
                handleUpdateModalOpen(true);
              }}
            >
              编辑
            </Button>
          </Access>
        </>,
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
        onFinish={() => {
          handleModalOpen(false);
          handleUpdateModalOpen(false);
          setCurrentRow(undefined);
          actionRefForSearch.current?.reload();
        }}
      />

      <ProTable<API.InterfacePageVO, API.PageParams>
        headerTitle={'查询信息'}
        actionRef={actionRefForSearch}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Access key="tableAddUser" accessible={access.canAdmin || false}>
            <Button
              type="primary"
              onClick={() => {
                setCurrentRow(undefined);
                handleModalOpen(true);
              }}
            >
              <PlusOutlined /> 新增
            </Button>
          </Access>,
        ]}
        request={(params) => {
          setCurrentPage(params.current || 1);
          setPageSize(params.pageSize || 10);
          return getInterfaceList(params);
        }}
        columns={InterfacePageColumns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '50'],
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Access accessible={access.canAdmin || false}>
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRefForSearch.current?.reloadAndRest?.();
              }}
              danger={true}
            >
              批量删除
            </Button>
          </Access>
        </FooterToolbar>
      )}

      {currentRow?.id && (
        <InterfaceDetailModal
          showDetail={showDetail}
          interfaceId={currentRow.id}
          onCancel={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default InterfaceAdmin;
