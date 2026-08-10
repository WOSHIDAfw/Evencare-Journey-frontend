<template>
  <PageLayout page-title="安全中心">
    <view class="security">
      <text class="security__hint">如遇紧急情况，请立即使用 SOS 求助。</text>
      <view class="sos-area">
        <view class="sos-ring sos-ring--outer">
          <view class="sos-ring sos-ring--inner">
            <button class="sos-button" @click="requestSOS">SOS</button>
          </view>
        </view>
        <text class="sos-caption">紧急求助</text>
      </view>
      <view class="setting-list">
        <view v-for="item in safetyItems" :key="item" class="setting-row" @click="openFeature(item)">
          <text>{{ item }}</text><text class="setting-row__arrow">›</text>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script>
import PageLayout from '@/components/PageLayout.vue'

export default {
  components: {
    PageLayout
  },
  data() {
    return { safetyItems: ['紧急联系人', '当前位置共享', '附近医院', 'SOS 设置'] }
  },
  methods: {
    requestSOS() {
      uni.showModal({
        title: '紧急求助',
        content: '确认发起紧急求助吗？',
        cancelText: '取消',
        confirmText: '确认求助',
        confirmColor: '#E53935',
        success: ({ confirm }) => { if (confirm) this.chooseService() }
      })
    },
    chooseService() {
      uni.showActionSheet({
        itemList: ['公安报警 110', '医疗急救 120', '消防救援 119'],
        success: ({ tapIndex }) => {
          const services = ['110 公安报警', '120 医疗急救', '119 消防救援']
          uni.showModal({
            title: '确认联系',
            content: `即将联系 ${services[tapIndex]}，当前为模拟呼叫，不会自动拨号。`,
            showCancel: false,
            confirmText: '我知道了'
          })
        }
      })
    },
    openFeature(name) {
      uni.showToast({ title: `${name}功能正在完善`, icon: 'none' })
    }
  }
}
</script>

<style scoped>
.security { padding-bottom: 24rpx; }
.security__hint { display: block; color: #5d6661; font-size: 32rpx; line-height: 1.6; }
.sos-area { display: flex; align-items: center; flex-direction: column; padding: 60rpx 0 48rpx; }
.sos-ring { display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.sos-ring--outer { width: 380rpx; height: 380rpx; background: #fde4e3; }
.sos-ring--inner { width: 330rpx; height: 330rpx; background: #f9c5c3; }
.sos-button { width: 286rpx; height: 286rpx; margin: 0; padding: 0; border: none; border-radius: 50%; background: #e53935; color: #fff; font-size: 76rpx; font-weight: 800; line-height: 286rpx; box-shadow: 0 14rpx 30rpx rgba(229,57,53,.28); }
.sos-button::after { border: none; }
.sos-caption { margin-top: 24rpx; color: #b32623; font-size: 34rpx; font-weight: 700; }
.setting-list { border: 2rpx solid #e9eeeb; border-radius: 24rpx; overflow: hidden; }
.setting-row { display: flex; align-items: center; justify-content: space-between; min-height: 104rpx; padding: 0 28rpx; border-bottom: 2rpx solid #edf1ef; color: #222; font-size: 34rpx; }
.setting-row:last-child { border-bottom: none; }
.setting-row__arrow { color: #8a938e; font-size: 52rpx; }
</style>
