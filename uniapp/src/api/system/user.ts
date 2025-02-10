import request from "@/utils/request";

const USER_BASE_URL = "/system/user-manage";

const UserAPI = {
   /**
   * 修改用户
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  update(id: number, data: UserForm) {
    return request({
      url: `${USER_BASE_URL}/${id}`,
      method: "PUT",
      data: data,
    });
  },

   /**
   * 绑定微信
   *
   * @param data 微信临时code
   */
   bindWechat( data: weChat) {
    return request<UserInfo>({
      url: `${USER_BASE_URL}/bind-wechat`,
      method: "POST",
      data: data,
    });
  },

   /**
   * 解绑微信
   */
   unbindWechat() {
    return request<UserInfo>({
      url: `${USER_BASE_URL}/unbind-wechat`,
      method: "POST",
    });
  },
};
export default UserAPI;

/** 用户表单 */
export interface UserForm {
  /** 用户头像 */
  avatar?: string;
  /** 部门ID */
  deptId?: number;
  /** 邮箱 */
  email?: string;
  /** 性别 */
  gender?: number;
  /** 用户ID */
  id?: number;
  /** 手机号 */
  mobile?: string;
  /** 昵称 */
  nickname?: string;
  /** 角色ID集合 */
  roleIds: number[];
  /** 用户状态(1:正常;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
}

/** 微信绑定 */
export interface weChat {
  code: string;
}

/** 用户信息 */
export interface UserInfo {
  [key: string]: any 
}
