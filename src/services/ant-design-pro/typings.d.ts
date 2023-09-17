// @ts-ignore
/* eslint-disable */

declare namespace API {

  /* 统一返回信息 */
  type ResultVO = {
    success?: boolean;
    code?: number;
    message?: string;
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
    status?: number;
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

  /* 接口信息 */
  type InterfaceVO = {
    id?: number;
    name?: string;
    description?: string;
    path?: string;
    url?: string;
    requestParam?: string;
    requestParamRemark?: string;
    responseParamRemark?: string;
    requestHeader?: string;
    responseHeader?: string;
    method?: string;
    createdTime?: string;
    updatedTime?: string;
  };

  type InvokeInterfaceParam = {
    accessKey: string,
    secretKey: string,
    id: number,
    method: string,
    path: string,
    url: string,
    requestParams?: string
  }

}
