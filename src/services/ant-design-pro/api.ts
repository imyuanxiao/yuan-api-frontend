// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录接口 POST /api/login/account */
export async function register(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResponseVO>('/api/auth/register', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResponseVO>('/api/auth/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.UserVO>('/api/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取接口列表 GET /api/interface/page */
export async function getInterfaceList(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
    description?: string;
  },
  options?: { [key: string]: any },
) {
  const response = await request<API.ResultList<API.InterfacePageVO>>('/api/interface/page', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
  return {
    ...response,
    data: response.records,
  };
}

/** 根据ID获取接口信息 GET /api/interface/detail */
export async function getInterfaceById(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  return await request<API.InterfaceVO>(`/api/interface/detail/${params.id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 申请接口 GET /api/userInterface/apply/{id} */
export async function applyInterface(id: number, options?: { [key: string]: any }) {
  return request<any>(`/api/userInterface/apply/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取用户已有的接口列表 GET /api/userInterface/page */
export async function getUserInterfaceList(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
    description?: string;
  },
  options?: { [key: string]: any },
) {
  const response = await request<API.ResultList<API.UserInterfacePageVO>>(
    '/api/userInterface/page',
    {
      method: 'POST',
      data: {
        ...params,
      },
      ...(options || {}),
    },
  );
  return {
    ...response,
    data: response.records,
  };
}

function processRequestBody(body: any) {
  return {
    ...body,
    requestParamRemark: body.requestParamRemark
      ? JSON.stringify(body.requestParamRemark, (key, value) =>
          key === 'id' || key === 'index' ? undefined : value,
        )
      : undefined,
    responseParamRemark: body.responseParamRemark
      ? JSON.stringify(body.responseParamRemark, (key, value) =>
          key === 'id' || key === 'index' ? undefined : value,
        )
      : undefined,
    requestHeader: body.requestHeader
      ? JSON.stringify(body.requestHeader, (key, value) =>
          key === 'id' || key === 'index' ? undefined : value,
        )
      : undefined,
    responseHeader: body.responseHeader
      ? JSON.stringify(body.responseHeader, (key, value) =>
          key === 'id' || key === 'index' ? undefined : value,
        )
      : undefined,
  };
}

/** 修改接口 PUT /api/interface/update */
export async function updateInterface(body: any, options?: { [key: string]: any }) {
  const requestBody = processRequestBody(body);
  return request<any>('/api/interface/update', {
    method: 'PUT',
    data: requestBody,
    ...(options || {}),
  });
}

/** 新建接口 POST /api/interface/add */
export async function addInterface(body: any, options?: { [key: string]: any }) {
  // 对body进行处理
  const requestBody = processRequestBody(body);
  return request<any>('/api/interface/add', {
    method: 'POST',
    data: requestBody,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// status 0关闭 1开启
/** 发布/下线接口 PUT /api/interface/setStatus */
export async function setInterfaceStatus(
  params: {
    id: number;
    status: number;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/interface/setStatus', {
    method: 'PUT',
    data: params,
    ...(options || {}),
  });
}

/** 删除接口 DELETE /api/interface/delete */
export async function removeInterface(ids: number[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/interface/delete', {
    method: 'DELETE',
    data: ids,
    ...(options || {}),
  });
}

/** 在线调用接口 GET /api/interface/detail/{id} */
export async function onlineInvokeInterface(
  body: API.InvokeInterfaceParam,
  options?: { [key: string]: any },
) {
  const jsonStr = await request<API.ResultVO>('/api/userInterface/invokeInterface', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });

  // @ts-ignore
  return JSON.parse(jsonStr).data;
}

/** 更新用户资料 PUT /api/user/profile */
export async function updateUserProfile(
  body: API.UserProfileParam,
  options?: { [key: string]: any },
) {
  console.log(body);
  return request<Record<string, any>>('/api/user/profile', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 更新密码 PUT /api/user/profile/password */
export async function updatePassword(
  body: API.UserPasswordParam,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/user/profile/password', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 获取趋势表数据 GET /api/userInterface/chart/callTrend */
export async function getChartCallTrend(options?: { [key: string]: any }) {
  return request<number[]>('/api/userInterface/chart/callTrend', {
    method: 'GET',
    ...(options || {}),
  });
}
