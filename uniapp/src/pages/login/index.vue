<template>
  <view class="login-container">
    <view class="login-header">
      <image src="/static/images/common/logo.svg" class="w160rpx h160rpx" />
    </view>

    <view class="login-form">
      <wd-form ref="loginFormRef" :model="loginFormData">
        <wd-cell-group border>
          <wd-input
            v-model="loginFormData.userName"
            label="用户名"
            label-width="100px"
            prop="userName"
            clearable
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <wd-input
            v-model="loginFormData.password"
            label="密码"
            label-width="100px"
            prop="password"
            show-password
            clearable
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </wd-cell-group>
        <view class="mt-80rpx">
          <wd-button size="large" type="primary" block @click="handleLogin">登录</wd-button>
        </view>
      </wd-form>
    </view>

    <view class="login-footer">
      <view class="text-center">
        <wd-divider>
          <img
            src="/src/static/icons/login/wx_icon.png"
            class="w-[80rpx] h-[80rpx]"
            @click="handleWechatLogin"
          />
        </wd-divider>
      </view>
      <view class="text-center mt-20rpx text-sm">
        <text class="text-gray">登录即同意</text>
        <text @click="navigateToUserAgreement">《用户协议》</text>
        <text class="text-gray">和</text>
        <text @click="navigateToPrivacy">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { type LoginFormData } from "@/api/auth";
import { useUserStore } from "@/store/modules/user";
import { useDictStore } from "@/store/modules/dict";
const loginFormRef = ref();

const loginFormData = ref<LoginFormData>({
  userName: "Admin",
  password: "abc123456"
});

const userStore = useUserStore();
const dictStore = useDictStore();

// 登录处理
const handleLogin = () => {
  loginFormRef.value.validate().then(async ({ valid }: { valid: boolean }) => {
    if (valid) {
      try {
        await userStore.login(loginFormData.value);
        await userStore.getInfo();
        uni.showToast({ title: "登录成功", icon: "success" });

        // 检查是否有上一页
        const pages = getCurrentPages();
        console.log("pages", pages.length);
        if (pages.length > 1) {
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/index/index",
            });
          }, 1500);
        }
      } catch (error: any) {
        console.log("登录失败", error.message);
      }
    }
  });
};

const navigateToUserAgreement = () => {
  uni.navigateTo({
    url: "/pages/mine/user-agreement/index",
  });
};
const navigateToPrivacy = () => {
  uni.navigateTo({
    url: "/pages/mine/privacy/index",
  });
};

// 微信登录处理
const handleWechatLogin = async () => {
  try {
    // 获取微信登录的临时 code
    const { code } = await uni.login({
      provider: "weixin",
    });

    // 调用后端接口进行登录认证
    const result = await userStore.loginByWechat(code);

    if (result) {
      // 获取用户信息
      await userStore.getInfo();

      uni.showToast({
        title: "登录成功",
        icon: "success",
      });

      const pages = getCurrentPages();

      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.reLaunch({
          url: "/pages/index/index",
        });
      }
    }
  } catch (error: any) {
    console.error("微信登录失败", error);
    uni.showToast({
      title: error.message || "微信登录失败",
      icon: "none",
    });
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: calc(100vh - 100rpx);
  background: #fff;
  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
  }
  .login-form {
    width: 80%;
    margin: 180rpx auto;
  }

  .login-footer {
    position: absolute;
    bottom: 40rpx;
    width: 100%;
  }
}
</style>
