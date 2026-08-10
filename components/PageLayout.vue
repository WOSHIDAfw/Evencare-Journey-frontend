<template>
  <view class="page-layout">
    <view class="page-layout__status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="page-layout__header">
      <view v-if="showBrandHeader" class="page-layout__brand">
        <AppLogo :size="88" />
        <text class="page-layout__brand-name">银发悠旅</text>
      </view>
      <view v-else class="page-layout__title-row">
        <text class="page-layout__page-title">{{ pageTitle }}</text>
      </view>
    </view>
    <view class="page-layout__body">
      <slot></slot>
    </view>
    <view class="page-layout__safe-bottom"></view>
  </view>
</template>

<script>
import AppLogo from './AppLogo.vue'

export default {
  name: 'PageLayout',
  components: {
    AppLogo
  },
  props: {
    showBrandHeader: {
      type: Boolean,
      default: false
    },
    pageTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      statusBarHeight: 20
    }
  },
  created() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 20
  }
}
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
}

.page-layout__status-bar {
  width: 100%;
  background-color: #ffffff;
}

.page-layout__header {
  padding: 24rpx 40rpx 16rpx;
}

.page-layout__brand {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.page-layout__brand-name {
  font-size: 52rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.2;
}

.page-layout__title-row {
  padding-top: 8rpx;
}

.page-layout__page-title {
  font-size: 52rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.2;
}

.page-layout__body {
  padding: 32rpx 40rpx 48rpx;
}

.page-layout__safe-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
