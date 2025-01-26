import { defineStore } from "pinia";
import AuthAPI, { type LoginFormData, UserInfo } from "@/api/auth";
import { setToken, getUserInfo, setUserInfo, clearAll } from "@/utils/cache";

// 导出一个名为 useUserStore 的函数，用于定义用户相关的状态和方法
export const useUserStore = defineStore("user", () => {
  // 定义一个响应式变量，用于存储用户信息
  const userInfo = ref<UserInfo | undefined>(getUserInfo());

  // 登录
  const login = (data: LoginFormData) => {
    // 返回一个 Promise 对象
    return new Promise((resolve, reject) => {
      // 调用 AuthAPI 的 login 方法，传入登录表单数据
      AuthAPI.login(data)
        .then((data) => {
          // 登录成功后，将 token 存入本地
          setToken(data.token);
          // 解析 Promise
          resolve(data);
        })
        .catch((error) => {
          // 登录失败时，打印错误信息，并拒绝 Promise
          console.error("登录失败", error);
          reject(error);
        });
    });
  };

  // 微信登录
  const loginByWechat = (code: string) => {
    // 返回一个 Promise 对象
    return new Promise((resolve, reject) => {
      // 调用 AuthAPI 的 wechatLogin 方法，传入微信登录的 code
      AuthAPI.wechatLogin(code)
        .then((data) => {
          // 登录成功后，将 token 存入本地
          setToken(data.token);
          // 解析 Promise
          resolve(data);
        })
        .catch((error) => {
          // 登录失败时，打印错误信息，并拒绝 Promise
          console.error("微信登录失败", error);
          reject(error);
        });
    });
  };

  // 获取用户信息
  const getInfo = () => {
    // 返回一个 Promise 对象
    return new Promise((resolve, reject) => {
      // 调用 AuthAPI 的 getUserInfo 方法，获取用户信息
      AuthAPI.getUserInfo()
        .then((data) => {
          // 获取成功后，将用户信息存入本地
          setUserInfo(data);
          // 将用户信息赋值给 userInfo 变量
          userInfo.value = data;
          // 解析 Promise
          resolve(data);
        })
        .catch((error) => {
          // 获取失败时，打印错误信息，并拒绝 Promise
          console.error("获取用户信息失败", error);
          reject(error);
        });
    });
  };

  // 登出
  const logout = async () => {
    try {
      await AuthAPI.logout(); // 调用后台注销接口
    } catch (error) {
      console.error("登出失败", error);
    } finally {
      clearAll(); // 清除本地的 token 和用户信息缓存
      userInfo.value = undefined; // 清空用户信息
    }
  };

  return {
    userInfo,
    login,
    loginByWechat,
    logout,
    getInfo,
  };
});
