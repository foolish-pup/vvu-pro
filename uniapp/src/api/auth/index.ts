import request from "@/utils/request";

const USER_BASE_URL = "/auth"

const AuthAPI = {
  /**
   * 登录接口
   *
   * @param username 用户名
   * @param password 密码
   * @returns 返回 token
   */
  login(data: LoginFormData): Promise<LoginResult> {
    console.log("data", data);
    return request<LoginResult>({
      url: `${USER_BASE_URL}/login`,
      method: "POST",
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  getUserInfo(): Promise<UserInfo> {
    return request<UserInfo>({
      url: `${USER_BASE_URL}/getUserInfo`,
      method: "GET",
    });
  },

  /**
   * 微信登录接口
   *
   * @param code 微信登录code
   * @returns 返回 token
   */
  wechatLogin(code: string): Promise<LoginResult> {
    return request<LoginResult>({
      url: `${USER_BASE_URL}/wechat-login`,
      method: "POST",
      data: { code },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  /**
   * 登出接口
   */
  logout(): Promise<void> {
    return request({
      url: `${USER_BASE_URL}/logout`,
      method: "POST",
    });
  },
};

export default AuthAPI;

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  token: string;
  /** sessionId */
  cookie: string;
}

export interface LoginFormData {
  userName: string;
  password: string;
}

/** 登录用户信息 */
export interface UserInfo {
  [key: string]: any 
}
