import {
  getUserInterfaceList,
} from '@/services/ant-design-pro/api';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import {Button, Input} from 'antd';
import React, { useRef, useState } from 'react';
import InterfaceDetailModal from "@/components/InterfaceModal/InterfaceDetailModal";
import InterfaceInvokeModal from "@/components/InterfaceModal/InterfaceInvokeModal";

const UserInterfaceList: React.FC = () => {

  /* 接口信息 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  /* 在线调试 */
  const [showInvoke, setShowInvoke] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserInterfacePageVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInterfacePageVO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns: ProColumns<API.UserInterfacePageVO>[] = [
    {
      title: (
        <FormattedMessage
          id="typings.UserInterfacePageVO.id"
          defaultMessage="接口ID"
        />
      ),
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
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
      hideInSearch: true,
      render: (_, record) => [
        <Input.Password
          defaultValue={record.accessKey}
        />
      ],
    },
    {
      title: <FormattedMessage id="typings.UserInterfacePageVO.secretKey" defaultMessage="secretKey"/>,
      dataIndex: 'secretKey',
      hideInSearch: true,
      render: (_, record) => [
        <Input.Password
          defaultValue={record.secretKey}
        />
      ],
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
              setShowInvoke(true);
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
        headerTitle={"查询信息"}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params) => {
          setCurrentPage(params.current || 1);
          setPageSize(params.pageSize || 10);
          return getUserInterfaceList(params);
        }}
        columns={columns}
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
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
            </div>
          }
        >
        </FooterToolbar>
      )}

      {currentRow?.id &&
        <InterfaceDetailModal
          showDetail={showDetail}
          interfaceId={currentRow.id}
          onCancel={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
        />
      }
      {currentRow?.id &&
          <InterfaceInvokeModal
            showInvoke={showInvoke}
            currentRow={currentRow}
            onCancel={() => {
              setCurrentRow(undefined);
              setShowInvoke(false);
            }}
          />
      }

    </PageContainer>
  );
};

export default UserInterfaceList;
