<template>
  <PageLayout :page-title="t('settings.title')">
    <view class="settings">
      <view class="profile-card">
        <view class="avatar">李</view>
        <view class="profile-card__text">
          <text class="profile-card__name">李明</text>
          <text class="profile-card__meta">{{ t('settings.ageCity') }}</text>
        </view>
      </view>
      <view class="language-card" @click="showLanguagePanel = true">
        <view class="language-card__icon">🌐</view>
        <view class="language-card__content">
          <text class="language-card__title">{{ t('settings.language') }}</text>
          <text class="language-card__current">{{ currentLanguageLabel }}</text>
        </view>
        <text class="setting-row__arrow">›</text>
      </view>
      <view v-for="group in settingGroups" :key="group.title" class="group-wrap">
        <text class="group-title">{{ t(group.title) }}</text>
        <view class="setting-group">
        <view v-for="item in group.items" :key="item.key" class="setting-row" @click="openSetting(item)">
          <text v-if="item.icon" class="setting-row__icon">{{ item.icon }}</text>
          <text :class="{ 'danger-text': item.key === 'logout' }">{{ t(item.labelKey) }}</text>
          <text v-if="item.key !== 'logout'" class="setting-row__arrow">›</text>
        </view>
        </view>
      </view>
      <view v-if="showLanguagePanel" class="language-mask" @click="showLanguagePanel = false">
        <view class="language-sheet" @click.stop>
          <view class="language-sheet__handle"></view>
          <text class="language-sheet__title">{{ t('settings.chooseLanguage') }}</text>
          <view v-for="language in languages" :key="language.code" class="language-option" :class="{ 'language-option--selected': language.code === currentLocale }" @click="chooseLanguage(language.code)">
            <text>{{ language.label }}</text><text class="language-option__check">{{ language.code === currentLocale ? '✓' : '' }}</text>
          </view>
          <button class="language-sheet__cancel" @click="showLanguagePanel = false">{{ t('common.cancel') }}</button>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script>
import PageLayout from '@/components/PageLayout.vue'
import { i18nMixin, localeOptions, setLocale } from '@/utils/i18n.js'
import { logout } from '@/utils/auth.js'

export default {
  mixins: [i18nMixin],
  components: {
    PageLayout
  },
  data() {
    return {
      showLanguagePanel: false,
      languages: localeOptions,
      settingGroups: [
        { title: 'settings.accountGroup', items: [{ key: 'profile', labelKey: 'settings.profile' }, { key: 'guardian', labelKey: 'settings.familyGuardian', icon: '♡' }, { key: 'contacts', labelKey: 'settings.emergencyContacts' }, { key: 'favorites', labelKey: 'settings.favorites' }, { key: 'trips', labelKey: 'settings.trips' }] },
        { title: 'settings.usageGroup', items: [{ key: 'notifications', labelKey: 'settings.notifications' }, { key: 'seniorMode', labelKey: 'settings.seniorMode' }, { key: 'language', labelKey: 'settings.languageSettings' }] },
        { title: 'settings.securityGroup', items: [{ key: 'privacy', labelKey: 'settings.privacy' }, { key: 'safety', labelKey: 'settings.safety' }] },
        { title: 'settings.aboutGroup', items: [{ key: 'agreement', labelKey: 'settings.agreement' }, { key: 'feedback', labelKey: 'settings.feedback' }, { key: 'about', labelKey: 'settings.about' }, { key: 'logout', labelKey: 'settings.logout' }] }
      ]
    }
  },
  computed: {
    currentLanguageLabel() {
      const language = this.languages.find(item => item.code === this.currentLocale)
      return language ? language.label : '简体中文'
    }
  },
  methods: {
    chooseLanguage(code) {
      setLocale(code)
      this.showLanguagePanel = false
    },
    openSetting(item) {
      if (item.key === 'language') {
        this.showLanguagePanel = true
        return
      }
      if (item.key === 'guardian') {
        uni.navigateTo({ url: '/pages/account/family-guardian' })
        return
      }
      if (item.key === 'logout') {
        uni.showModal({ title: this.t('settings.logout'), content: this.t('settings.logoutConfirm'), cancelText: this.t('common.cancel'), confirmText: this.t('common.confirm'), confirmColor: '#E53935', success: ({ confirm }) => { if (confirm) { logout(); uni.reLaunch({ url: '/pages/auth/login' }) } } })
        return
      }
      uni.showToast({ title: `${this.t(item.labelKey)}：${this.t('common.improving')}`, icon: 'none' })
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
.language-card { display: flex; align-items: center; min-height: 126rpx; margin-top: 28rpx; padding: 20rpx 28rpx; border: 2rpx solid #cfe9db; border-radius: 24rpx; background: #f0faf5; }
.language-card__icon { display: flex; align-items: center; justify-content: center; width: 72rpx; height: 72rpx; border-radius: 50%; background: #d9f1e4; color: #01884d; font-size: 44rpx; font-weight: 700; }
.language-card__content { display: flex; flex: 1; flex-direction: column; margin-left: 22rpx; }
.language-card__title { color: #173e2d; font-size: 34rpx; font-weight: 700; }
.language-card__current { margin-top: 4rpx; color: #4d685b; font-size: 28rpx; }
.group-wrap { margin-top: 28rpx; }
.group-title { display: block; margin: 0 8rpx 12rpx; color: #68736d; font-size: 27rpx; }
.setting-group { border: 2rpx solid #e8edea; border-radius: 24rpx; overflow: hidden; }
.setting-row { display: flex; align-items: center; justify-content: space-between; min-height: 104rpx; padding: 0 28rpx; border-bottom: 2rpx solid #edf1ef; color: #222; font-size: 34rpx; }
.setting-row>text:nth-child(2):not(.setting-row__arrow) { flex: 1; }
.setting-row__icon { width: 56rpx; color: #01884d; font-size: 38rpx; }
.setting-row:last-child { border-bottom: none; }
.setting-row__arrow { color: #8a938e; font-size: 52rpx; }
.danger-text { color: #d93632; font-weight: 600; }
.language-mask { position: fixed; z-index: 99; top: 0; right: 0; bottom: 0; left: 0; display: flex; align-items: flex-end; background: rgba(0,0,0,.36); }
.language-sheet { width: 100%; padding: 18rpx 36rpx calc(28rpx + env(safe-area-inset-bottom)); border-radius: 34rpx 34rpx 0 0; background: #fff; }
.language-sheet__handle { width: 82rpx; height: 8rpx; margin: 0 auto 22rpx; border-radius: 8rpx; background: #ccd3cf; }
.language-sheet__title { display: block; margin-bottom: 16rpx; color: #111; font-size: 40rpx; font-weight: 700; }
.language-option { display: flex; align-items: center; justify-content: space-between; min-height: 92rpx; padding: 0 24rpx; border-bottom: 2rpx solid #edf1ef; color: #222; font-size: 34rpx; }
.language-option--selected { border-radius: 18rpx; background: #e7f6ee; color: #017343; font-weight: 700; }
.language-option__check { color: #01884d; font-size: 40rpx; }
.language-sheet__cancel { height: 96rpx; margin-top: 24rpx; border: none; border-radius: 20rpx; background: #eef3f0; color: #31483d; font-size: 32rpx; line-height: 96rpx; }
.language-sheet__cancel::after { border: none; }
</style>
