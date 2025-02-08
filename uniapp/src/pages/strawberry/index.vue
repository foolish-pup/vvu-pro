<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
const isLogin = computed(() => !!userInfo.value);

const current = ref<number>(0);

const swiperList = ref([
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
]);
const noticeArray = ref(['大厨记录小程序上线啦！', '点击甜甜圈记录可口饭菜！']);

function handleClick(e: any) {
  console.log(e);
}
function onChange(e: any) {
  console.log(e);
}
</script>

<template>
  <view style="width: 100%; height: var(--status-bar-height)" />
  <view class="strawberry">
    <wd-swiper v-model:current="current" :list="swiperList" :indicator="{ type: 'dots-bar' }" autoplay @click="handleClick" @change="onChange" />

    <!-- 通知公告 -->
    <wd-notice-bar
      class="mt-20rpx"
      :text="noticeArray"
      type="info"
      direction="vertical"
      :delay="3"
      custom-class="space"
    >
      <template #prefix>
        <wd-tag color="#FAA21E" bg-color="#FAA21E" plain custom-style="margin-right:10rpx"> 通知公告 </wd-tag>
      </template>
    </wd-notice-bar>
  </view>
</template>

<style setup lang="scss">
.strawberry {
  padding: 28rpx 28rpx;
  :deep(.custom-item) {
    height: 80px !important;
  }
  :deep(.wd-card) {
    margin: 10rpx 0 !important;
  }
}
</style>
