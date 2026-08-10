<template>
  <PageLayout :page-title="t('security.title')">
    <view class="security">
      <text class="security__hint">{{ t('security.hint') }}</text>
      <view class="sos-area">
        <view class="sos-ring sos-ring--outer">
          <view class="sos-ring sos-ring--inner">
            <button class="sos-button" @click="requestSOS">SOS</button>
          </view>
        </view>
        <text class="sos-caption">{{ t('security.emergencyHelp') }}</text>
      </view>
      <view class="setting-list">
        <view v-for="item in safetyItems" :key="item.labelKey" class="setting-row" @click="openFeature(item)">
          <text>{{ t(item.labelKey) }}</text><text class="setting-row__arrow">›</text>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script>
import PageLayout from '@/components/PageLayout.vue'
import { i18nMixin } from '@/utils/i18n.js'
import { getGuardian } from '@/utils/auth.js'

export default {
  mixins: [i18nMixin],
  components: {
    PageLayout
  },
  data() {
    return { safetyItems: [
      { labelKey: 'security.contacts' }, { labelKey: 'security.shareLocation' },
      { labelKey: 'security.hospitals' }, { labelKey: 'security.sosSettings' }
    ] }
  },
  methods: {
    requestSOS() {
      uni.showModal({
        title: this.t('security.emergencyHelp'),
        content: this.t('security.confirmHelp'),
        cancelText: this.t('common.cancel'),
        confirmText: this.t('security.confirmHelpButton'),
        confirmColor: '#E53935',
        success: ({ confirm }) => {
          if (!confirm) return
          const guardian = getGuardian()
          if (guardian && guardian.connected && guardian.sharing && guardian.sharing.emergency) {
            uni.showToast({ title: `已通知紧急联系人：${guardian.name}`, icon: 'none', duration: 1800 })
            setTimeout(() => this.chooseService(), 500)
          } else {
            this.chooseService()
          }
        }
      })
    },
    chooseService() {
      uni.showActionSheet({
        itemList: [this.t('security.police'), this.t('security.medical'), this.t('security.fire')],
        success: ({ tapIndex }) => {
          const services = [this.t('security.police'), this.t('security.medical'), this.t('security.fire')]
          uni.showModal({
            title: this.t('security.confirmContact'),
            content: this.t('security.simulatedCall', { service: services[tapIndex] }),
            showCancel: false,
            confirmText: this.t('security.understood')
          })
        }
      })
    },
    openFeature(item) {
      const messages = {
        'security.contacts': '请在设置中的家庭监护里管理联系人',
        'security.shareLocation': '当前位置仅在您主动授权后共享',
        'security.hospitals': '暂无附近医院数据',
        'security.sosSettings': '当前已启用 SOS 二次确认'
      }
      uni.showToast({ title: messages[item.labelKey] || '暂无相关信息', icon: 'none' })
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
