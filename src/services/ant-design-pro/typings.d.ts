// @ts-ignore
/* eslint-disable */

/** 当前登录用户信息 **/
declare namespace API {
  type CurrentUser = {
    userInfo?: UserInfo;
    userAuth?: UserAuthority[];
    userRole?: UserRole[];
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  /** 用户信息 **/
  type UserInfo = {
    id: number;
    username: string;
    status: number;
    superAdmin: boolean;
    nickname: string;
    avatar: boolean;
    gender: string;
  }
  /** 用户角色 **/
  type UserRole = {
    id: number;
    name: string;
    status: number;
  }
  /** 用户权限 **/
  type UserAuthority = {
    id: number;
    authKey: string;
    name: string;
    type: string;
    status: number;
  }

  type LoginResult = {
    token?: string
    status?: string;
    errorMsg?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type RegisterParams = {
    username: string;
    email: string;
    smsCode: string;
    password: string;
    checkPassword: string;
  };

  type RegisterResult = {
    status?: string
    errorMsg?: string
  };

  type SmsReviseParams = {
    username: string;
    oldPassword?: string;
    newPassword: string;
    checkPassword: string;
    smsCode?: string;
    type: string;
  };

  type SmsCodeSendParams = {
    username: string;
    email: string;
  };

  type PersonalSettingsParams = {
    checkPassword: string;
    nickname: string;
    gender: number;
  };

  type StatusResult = {
    status?: string
    errorMsg?: string
  };


  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
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
