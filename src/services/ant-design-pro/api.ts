// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

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

/** 获取当前的用户 GET /api/interface/detail/{id} */
export async function getInterfaceById(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }) {
  return request<{
    data: API.InterfaceVO;
  }>(`/api/interface/detail/${params.id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取用户接口列表 GET /api/userInterface/page */
export async function getUserInterfaceList(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
    description?: string;
  },
  options?: { [key: string]: any },
) {
  const response = await  request<API.ResultList<API.UserInterfacePageVO>>('/api/userInterface/page', {
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
export async function addInterface(body: any, options?: { [key: string]: any }) {

  console.log("addInterface>>body", body)

  // 对body进行处理
  const requestBody = {
    ...body,
    requestParam: body.requestParam ? JSON.stringify(body.requestParam) : undefined,
    requestParamRemark: body.requestParamRemark ? JSON.stringify(body.requestParamRemark,
      (key, value) => (key === "id" ||  key === "index"? undefined : value))  : undefined,
    responseParamRemark: body.responseParamRemark ? JSON.stringify(
      body.responseParamRemark,
      (key, value) => (key === "id"||  key === "index" ? undefined : value))  : undefined,
    requestHeader: body.requestHeader ? JSON.stringify(body.requestHeader,
      (key, value) => (key === "id" ||  key === "index"? undefined : value))  : undefined,
    responseHeader: body.responseHeader? JSON.stringify(body.responseHeader,
      (key, value) => (key === "id" ||  key === "index"? undefined : value))  : undefined,
  }
  console.log("addInterface>>requestBody", requestBody)

  return  request<any>('/api/interface/add', {
    method: 'POST',
    data: requestBody,
    headers: {
      'Content-Type': 'application/json',
    },
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

// String invokeInterface(String apiName, long id, String params, String url, String method,String path)
/** 在线调用接口 GET /api/interface/detail/{id} */
export async function onlineInvokeInterface(body: API.InvokeInterfaceParam, options?: { [key: string]: any }) {
  console.log("onlineInvokeInterface>>>body", body)
  return request<{ data: API.ResultVO; }>('/api/userInterface/invokeInterface',
    {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json', // 设置请求头的 Content-Type 为 JSON
      },
      ...(options || {}),
    });
}


