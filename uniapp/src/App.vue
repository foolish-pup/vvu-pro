<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Hide");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
page {
  background: #f8f8f8;
}
</style>
