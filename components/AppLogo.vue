<template>
  <view class="app-logo" :style="{ width: sizeRpx + 'rpx', height: sizeRpx + 'rpx' }">
    <text class="app-logo__text" :style="{ fontSize: fontSizeRpx + 'rpx' }">悠</text>
  </view>
</template>

<script>
export default {
  name: 'AppLogo',
  props: {
    size: {
      type: Number,
      default: 88
    }
  },
  computed: {
    sizeRpx() {
      return this.size
    },
    fontSizeRpx() {
      return Math.round(this.size * 0.52)
    }
  }
}
</script>

<style scoped>
.app-logo {
  border-radius: 50%;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-logo__text {
  color: #ffffff;
  font-weight: 600;
  line-height: 1;
}
</style>
