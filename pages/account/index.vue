<template>
  <PageLayout page-title="设置">
    <view class="settings">
      <view class="profile-card">
        <view class="avatar">李</view>
        <view class="profile-card__text">
          <text class="profile-card__name">李明</text>
          <text class="profile-card__meta">68岁 · 成都</text>
        </view>
      </view>
      <view v-for="(group, groupIndex) in settingGroups" :key="groupIndex" class="setting-group">
        <view v-for="item in group" :key="item" class="setting-row" @click="openSetting(item)">
          <text :class="{ 'danger-text': item === '退出登录' }">{{ item }}</text>
          <text v-if="item !== '退出登录'" class="setting-row__arrow">›</text>
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
    return {
      settingGroups: [
        ['个人资料', '紧急联系人', '我的收藏', '我的行程'],
        ['消息通知', '适老模式', '语言设置'],
        ['隐私设置', '安全设置', '用户协议'],
        ['帮助与反馈', '关于银发悠旅', '退出登录']
      ]
    }
  },
  methods: {
    openSetting(item) {
      if (item === '退出登录') {
        uni.showModal({ title: '退出登录', content: '确认退出当前账号吗？', confirmColor: '#E53935' })
        return
      }
      uni.showToast({ title: `${item}功能正在完善`, icon: 'none' })
    }
  }
}
</script>

<style scoped>
.settings { padding-bottom: 24rpx; }
.profile-card { display: flex; align-items: center; padding: 32rpx; border-radius: 26rpx; background: #eaf6f0; }
.avatar { display: flex; align-items: center; justify-content: center; width: 112rpx; height: 112rpx; border-radius: 50%; background: #01884d; color: #fff; font-size: 48rpx; font-weight: 700; }
.profile-card__text { display: flex; flex-direction: column; margin-left: 26rpx; }
.profile-card__name { color: #111; font-size: 42rpx; font-weight: 700; }
.profile-card__meta { margin-top: 10rpx; color: #5f6c65; font-size: 30rpx; }
.setting-group { margin-top: 28rpx; border: 2rpx solid #e8edea; border-radius: 24rpx; overflow: hidden; }
.setting-row { display: flex; align-items: center; justify-content: space-between; min-height: 104rpx; padding: 0 28rpx; border-bottom: 2rpx solid #edf1ef; color: #222; font-size: 34rpx; }
.setting-row:last-child { border-bottom: none; }
.setting-row__arrow { color: #8a938e; font-size: 52rpx; }
.danger-text { color: #d93632; font-weight: 600; }
</style>
