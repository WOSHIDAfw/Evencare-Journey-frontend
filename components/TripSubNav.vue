<template>
  <view class="sub-nav">
    <view class="sub-nav__status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="sub-nav__bar">
      <view class="sub-nav__back" @tap="onBack">
        <uni-icons type="back" size="22" color="#111111" />
      </view>
      <text class="sub-nav__title">{{ title }}</text>
      <view class="sub-nav__placeholder"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TripSubNav',
  props: {
    title: {
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
  },
  methods: {
    onBack() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({ url: '/pages/trip/index' })
        }
      })
    }
  }
}
</script>

<style scoped>
.sub-nav {
  background-color: #ffffff;
  flex-shrink: 0;
}

.sub-nav__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
}

.sub-nav__back {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sub-nav__title {
  flex: 1;
  text-align: center;
  font-size: 38rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.3;
}

.sub-nav__placeholder {
  width: 88rpx;
  flex-shrink: 0;
}
</style>
