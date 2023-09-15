// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录接口 POST /api/login/account */
export async function register(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResponseVO>('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResponseVO>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.UserVO;
  }>('/api/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取接口列表 GET /api/rule */
export async function getInterfaceList(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
    description?: string;
  },
  options?: { [key: string]: any },
) {
  const response = await  request<API.ResultList<API.InterfacePageVO>>('/api/interface/page', {
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

/** 新建规则 PUT /api/rule */
export async function updateInterface(options?: { [key: string]: any }) {
  return request<API.InterfacePageVO>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addInterface(options?: { [key: string]: any }) {
  return request<API.InterfacePageVO>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeInterface(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
