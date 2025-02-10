<script lang="ts" setup>
import { useToast } from 'wot-design-uni';
import { useUserStore } from '@/store/modules/user';

const toast = useToast();
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
// 新增微信绑定状态
const isWechatBound = computed(() => userStore.userInfo?.openId || 0);
// 绑定btn loading
const bindLoading = ref(false);

// 模拟微信绑定操作
const bindWechat = async () => {
  try {
    bindLoading.value = true;
    // 获取微信登录的临时 code
    const { code } = await uni.login({
      provider: 'weixin',
    });
    await userStore.bindWechat(code);
    bindLoading.value = false;
    toast.success('微信绑定成功');
  } catch (error) {
    bindLoading.value = false;
  }
};

// 模拟微信解绑操作
const unbindWechat = async () => {
  try {
    bindLoading.value = true;
    await userStore.unbindWechat();
    bindLoading.value = false;
    toast.success('微信解绑成功');
  } catch (error) {
    bindLoading.value = false;
  }
};
</script>

<template>
  <view class="profile p-32rpx bg-[#f5f6fa]">
    <!-- 头部信息卡片 -->
    <view class="bg-white rounded-24rpx p-[48rpx_32rpx] text-center shadow-[0_8rpx_24rpx_rgba(0,0,0,0.05)]">
      <image
        class="w-160rpx h-160rpx border-4rpx border-white shadow-[0_8rpx_24rpx_rgba(0,0,0,0.1)] mb-32rpx rounded-full"
        :src="userInfo?.avatar || '/static/images/common/avatar.svg'"
      />
      <text class="block text-36rpx font-bold text-[#2c3e50] mb-16rpx">
        {{ userInfo?.cnName || '未设置昵称' }}
      </text>
      <text class="text-24rpx text-[#95a5a6]">ID: {{ userInfo?.id }}</text>
    </view>

    <!-- 个人信息列表 -->
    <view class="mt-32rpx rounded-24rpx overflow-hidden shadow-[0_8rpx_24rpx_rgba(0,0,0,0.05)]">
      <wd-cell-group border>
        <wd-cell title="手机号码">
          {{ userInfo?.phone ? userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定' }}
        </wd-cell>

        <wd-cell title="电子邮箱">
          {{ userInfo?.email || '未绑定' }}
        </wd-cell>

        <wd-cell title="注册时间">
          {{ userInfo?.createdAt.split('T')[0] || '未知' }}
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 操作列表 -->
    <view class="mt-32rpx rounded-24rpx overflow-hidden shadow-[0_8rpx_24rpx_rgba(0,0,0,0.05)]">
      <wd-cell-group>
        <wd-cell center>
          <template #title>
            <text class="text-28rpx m-r-1">微信</text>
            <wd-tag custom-class="space" :type="isWechatBound ? 'success' : 'warning'">
              {{ isWechatBound ? '已绑定' : '未绑定' }}
            </wd-tag>
          </template>
          <!-- 绑定/解绑按钮 -->
          <wd-button
            custom-class="wd-button-custom"
            :loading="bindLoading"
            :type="isWechatBound ? 'warning' : 'success'"
            @click="isWechatBound ? unbindWechat() : bindWechat()"
          >
            {{ isWechatBound ? '解绑' : '绑定' }}
          </wd-button>
        </wd-cell>
      </wd-cell-group>
    </view>
  </view>

  <wd-toast />
</template>
