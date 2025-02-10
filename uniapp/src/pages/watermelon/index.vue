<script lang="ts" setup>
import { useToast } from 'wot-design-uni';
import { useUserStore } from '@/store/modules/user';

const toast = useToast();
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
const isLogin = computed(() => !!userInfo.value);
const defaultAvatar = '/static/images/common/avatar.svg';

// 登录
const loginHandle = async () => {
  if (isLogin.value) {
    try {
      toast.loading({
      msg: '退出中...',
      loadingColor: '#9899ff',
    });
    await userStore.logout();
    
    toast.close();
    toast.success('退出成功');
    } catch (error) {
      toast.close();
    }
  } else {
    uni.navigateTo({ url: '/pages/login/index' });
  }
};

// 常见问题
const navigateToFAQ = () => {
  uni.navigateTo({ url: '/pages/watermelon/faq/index' });
};
// 设置
const navigateToSettings = () => {
  uni.navigateTo({ url: '/pages/watermelon/settings/index' });
};
// 个人中心
const navigateToProfile = () => {
  uni.navigateTo({ url: '/pages/watermelon/profile/index' });
};
</script>

<template>
  <view class="watermelon-container">
    <view class="watermelon-header">
      <view class="flex items-center">
        <!-- 头像 -->
        <image class="w-100rpx h-100rpx rounded-full" :src="isLogin ? userInfo!.avatar : defaultAvatar" />
        <!-- 用户信息 -->
        <view class="ml-20rpx">
          <!-- 已登录 -->
          <view v-if="isLogin" class="whitespace-nowrap">
            <view class="text-32rpx font-bold w-200rpx overflow-hidden text-ellipsis">
              {{ userInfo!.cnName }}
            </view>
            <view class="text-28rpx mt-6rpx w-300rpx overflow-hidden text-ellipsis">{{ userInfo?.email }}</view>
          </view>
          <!-- 未登录 -->
          <view v-else>
            <view class="text-32rpx font-600">您未登录，请先登录</view>
            <view class="text-28rpx mt-6rpx">小螺号滴滴的吹</view>
          </view>
        </view>
        <view class="ml-60rpx">
          <wd-button custom-class="wd-button-custom" :icon="isLogin ? 'logout' : 'login'" @click="loginHandle">{{
            isLogin ? '退出' : '登录'
          }}</wd-button>
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
        <wd-cell v-if="isLogin" title="个人中心" icon="user" clickable @click="navigateToProfile">
          <wd-icon name="arrow-right" />
        </wd-cell>
      </wd-cell-group>
    </view>
  </view>

  <wd-toast />
</template>

<style lang="scss" scoped>
.watermelon-container {
  .watermelon-header {
    display: flex;
    align-items: start;
    justify-content: space-between;

    padding: 60rpx 20rpx;
    color: #fff;
    background: linear-gradient(60deg, #9899ff, #9899ffa0);

    .cursor-pointer {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      margin-right: 10rpx;
    }
  }
}
</style>
