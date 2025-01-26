<template>
  <view class="mine-container">
    <view class="mine-header">
      <view class="flex items-center">
        <!-- 头像 -->
        <image
          class="w-100rpx h-100rpx rounded-full"
          :src="isLogin ? userInfo!.avatar : defaultAvatar"
        />
        <!-- 用户信息 -->
        <view class="ml-20rpx">
          <!-- 已登录 -->
          <view v-if="isLogin">
            <view class="text-32rpx">
              {{ userInfo!.cnName }}
            </view>
            <view class="text-28rpx mt2">{{ userInfo?.username }}</view>
          </view>
          <!-- 未登录 -->
          <view v-else>
            <view class="login-tip">您还未登录，请先登录</view>
            <view class="w120rpx mt-2">
              <button class="login-btn" @click="navigateToLoginPage">登录</button>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 菜单列表 -->
    <view class="mt40rpx">
      <wd-cell-group border>
        <wd-cell title="常见问题" icon="help-circle" clickable @click="navigateToFAQ">
          <wd-icon name="arrow-right" />
        </wd-cell>
        <wd-cell title="设置" icon="setting1" clickable @click="navigateToSettings">
          <wd-icon name="arrow-right" />
        </wd-cell>
      </wd-cell-group>
    </view>

    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { useToast } from "wot-design-uni";
import { useUserStore } from "@/store/modules/user";

const toast = useToast();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const isLogin = computed(() => !!userInfo.value);
const defaultAvatar = "/static/images/avatar.svg";

// 登录
const navigateToLoginPage = () => {
  uni.navigateTo({ url: "/pages/login/index" });
};

// 常见问题
const navigateToFAQ = () => {
  uni.navigateTo({ url: "/pages/mine/faq/index" });
};
// 设置
const navigateToSettings = () => {
  uni.navigateTo({ url: "/pages/mine/settings/index" });
};
</script>

<style lang="scss" scoped>
.mine-container {
  .mine-header {
    display: flex;
    align-items: start;
    justify-content: space-between;

    padding: 60rpx 20rpx;
    color: #fff;
    background: linear-gradient(60deg, #517cf0, #769ef5);

    .login-tip {
      font-size: 28rpx;
      color: #fff;
    }
    .login-btn {
      font-size: 28rpx;
      line-height: 50rpx;
      color: #4d80f0;
      border-radius: 10rpx;
    }
    .cursor-pointer {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      margin-right: 10rpx;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
