// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取当前的用户 GET /api/user/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户修改密码接口 POST /api/user/revisePassword */
export async function revisePassword(body: API.SmsReviseParams, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/revisePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送短信验证码接口 POST /api/user/sendSmsCode */
export async function sendSmsCode(body: API.SmsCodeSendParams, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/sendSmsCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户个人信息修改接口 POST /api/user/personalSettings */
export async function personalSettings(body: API.PersonalSettingsParams, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/personalSettings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
