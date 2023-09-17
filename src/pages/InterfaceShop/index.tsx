import {
  applyInterface,
  getInterfaceById,
  getInterfaceList,
} from '@/services/ant-design-pro/api';
import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  FooterToolbar, ModalForm,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {Button, message} from 'antd';
import React, { useRef, useState  } from 'react';
import { interfaceStatusEnum } from "@/utils/CommonValue";
import { useAccess } from 'umi';
import InterfaceDetailModal from "@/components/InterfaceModal/InterfaceDetailModal";

const InterfaceShop: React.FC = () => {

  /* 国际化 */
  const intl = useIntl();
  /* 权限 */
  const access = useAccess();
  /* 查看接口详情 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  /* 当前行 */
  const [currentRow, setCurrentRow] = useState<API.InterfacePageVO>();
  /* 分页数据 */
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页显示的数据数量
  const actionRefForSearch = useRef<ActionType>();
  /* 接口分页信息表头 */
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
              handleApplyInterface(record.id);
            }}
          >
            <FormattedMessage id="common.operation.edit" defaultMessage="申请" />
          </Button>
        </>
      ],
    },
  ];
  /* 申请接口 */
  const handleApplyInterface = async (id: number) => {
    if(id){
      const response = await applyInterface(id);
      message.success(response);
    }else{
      message.error("页面数据异常！")
    }
  }

  return (
    <PageContainer>
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
        request={(params) => {
          setCurrentPage(params.current || 1);
          setPageSize(params.pageSize || 10);
          return getInterfaceList(params);
        }}
        columns={InterfacePageColumns}
        pagination={{
          pageSizeOptions: ['10', '20', '50'],
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />

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

export default InterfaceShop;
