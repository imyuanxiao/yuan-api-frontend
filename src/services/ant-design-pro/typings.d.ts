// @ts-ignore
/* eslint-disable */

declare namespace API {

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  /* 统一返回信息 */
  type ResultVO = {
    success?: boolean;
    errorCode?: number;
    errorMessage?: string;
    data?: any;
  };

  /* 用户信息 */
  type UserVO = {
    id?: number;
    username?: string;
    role?: string;
    status?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    nickName?: string;
  };

  /* 登录参数 */
  type LoginParams = {
    username?: string;
    password?: string;
    // autoLogin?: boolean;
  };

  /* 登录信息返回参数 */
  type LoginResponseVO = {
    token?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  /* 接口分页请求参数 */
  type InterfacePageParam = {
    current?: number;
    pageSize?: number;

    name?: string;
    description?: string;
  };

  /* 分页结果列表 */
  type ResultList<T> = {
    data?: T[];
    total?: number;
    success?: boolean;
  }

  /* 接口分页信息 */
  type InterfacePageVO = {
    id?: number;
    name?: string;
    description?: string;
    method?: string;
    status?: string;
    createdTime?: string;
  };

  /* 用户接口关系分页信息 */
  type UserInterfacePageVO = {
    id?: number;
    name?: string;
    description?: string;
    leftNum?: number;
    totalNum?: number;
    accessKey?: string;
    secretKey?: string;
    status?: string;
  };


  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

}
