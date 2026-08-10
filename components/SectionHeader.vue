<template>
  <view class="section-header">
    <text class="section-header__title">{{ title }}</text>
    <text class="section-header__more" @tap="onMoreTap">{{ moreText }}</text>
  </view>
</template>

<script>
export default {
  name: 'SectionHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    moreText: {
      type: String,
      default: '查看更多'
    }
  },
  methods: {
    onMoreTap() {
      uni.showToast({
        title: '更多内容正在完善',
        icon: 'none'
      })
      this.$emit('more')
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
  margin-bottom: 24rpx;
}

.section-header__title {
  font-size: 42rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.3;
}

.section-header__more {
  font-size: 30rpx;
  color: #01884D;
  line-height: 1.4;
  padding: 8rpx 0 8rpx 16rpx;
  min-height: 88rpx;
  display: flex;
  align-items: center;
}
</style>
