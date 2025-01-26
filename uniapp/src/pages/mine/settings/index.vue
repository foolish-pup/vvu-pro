<template>
  <view class="settings-container">
    <wd-cell-group>
      <wd-cell title="用户协议" icon="user" is-link @click="navigateToUserAgreement" />
      <wd-cell title="隐私政策" icon="folder" is-link @click="navigateToPrivacy" />
    </wd-cell-group>

    <wd-cell-group custom-style="margin-top:40rpx">
      <wd-cell title="网络测试" icon="wifi" is-link @click="navigateToNetworkTest" />
      <wd-cell
        title="清空缓存"
        icon="delete1"
        :value="cacheSize"
        clickable
        @click="handleClearCache"
      />
    </wd-cell-group>

    <wd-cell-group v-if="isLogin" custom-style="margin-top:40rpx">
      <wd-cell title="退出" icon="logout" is-link @click="handleLogout" />
    </wd-cell-group>

    <!-- 全屏 loading -->
    <view v-if="clearing" class="loading-mask">
      <view class="loading-content">
        <view class="loading-icon" />
        <text class="loading-text">正在清理...</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();

const isLogin = computed(() => !!userStore.userInfo);

// 用户协议
const navigateToUserAgreement = () => {
  uni.navigateTo({ url: "/pages/mine/settings/agreement/index" });
};
// 隐私政策
const navigateToPrivacy = () => {
  uni.navigateTo({ url: "/pages/mine/settings/privacy/index" });
};
// 网络测试
const navigateToNetworkTest = () => {
  uni.navigateTo({ url: "/pages/mine/settings/network/index" });
};

// 是否正在清理
const clearing = ref(false);
// 缓存大小
const cacheSize = ref<any>("计算中...");
// 获取缓存大小
const getCacheSize = async () => {
  try {
    // #ifdef MP-WEIXIN
    const res = await uni.getStorageInfo();
    cacheSize.value = formatSize(res.currentSize);
    // #endif
    // #ifdef H5
    cacheSize.value = formatSize(
      Object.keys(localStorage).reduce((size, key) => size + localStorage[key].length, 0)
    );
    // #endif
    if (!cacheSize.value) {
      cacheSize.value = "0B";
    }
  } catch (error) {
    console.error("获取缓存大小失败:", error);
    cacheSize.value = "获取失败";
  }
};

// 格式化存储大小
const formatSize = (size: number) => {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else {
    return (size / 1024 / 1024).toFixed(2) + "MB";
  }
};

// 处理清除缓存
const handleClearCache = async () => {
  if (cacheSize.value === "获取失败") {
    uni.showToast({
      title: "获取缓存信息失败，请稍后重试",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  if (cacheSize.value === "0B") {
    uni.showToast({
      title: "暂无缓存需要清理",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  if (clearing.value) {
    return;
  }

  try {
    clearing.value = true;
    // 模拟清理过程
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // 清除缓存
    await uni.clearStorage();
    // 更新缓存大小显示
    await getCacheSize();
    // 提示清理成功
    uni.showToast({
      title: "清理成功",
      icon: "success",
    });
  } catch (error) {
    uni.showToast({
      title: "清理失败",
      icon: "error",
    });
  } finally {
    clearing.value = false;
  }
};

// 退出登录
const handleLogout = () => {
  userStore.logout().then(() => {
    uni.showToast({ title: "已退出登录", icon: "success" });
    // 跳转到登录页
    uni.reLaunch({ url: "/pages/mine/index" });
  });
};

onLoad(() => {
  getCacheSize();
});
</script>
<style lang="scss" scoped>
.settings-container {
  padding: 20px;

  .loading-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);

    .loading-content {
      padding: 30rpx 40rpx;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 12rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);

      .loading-icon {
        width: 60rpx;
        height: 60rpx;
        margin: 0 auto 20rpx;
        border: 4rpx solid #f3f3f3;
        border-top: 4rpx solid #409eff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .loading-text {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
      }
    }
  }
}
</style>
