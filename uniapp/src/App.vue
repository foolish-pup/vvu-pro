<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Hide');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
:root,
page {
  background: #f8f8f8;
  --wot-color-theme: #9899ff;
}
.uni-tabbar-border {
  height: 0;
}

/* wod 按钮 */
.wd-button-custom {
  font-size: 28rpx !important;
  height: 60rpx !important;
  line-height: 60rpx;
  border-radius: 10rpx !important;
  box-shadow:
    0 3px 1px -2px rgb(0 0 0 / 20%),
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
}
</style>
