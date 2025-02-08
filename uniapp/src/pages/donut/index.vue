<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
const isLogin = computed(() => !!userInfo.value);
</script>

<template>
  <view class="donut"> donut </view>
</template>

<style lang="scss" scoped>
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}
/* stylelint-enable selector-type-no-unknown */
</style>
