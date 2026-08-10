<script>
import { initLocale, applyTabBarLabels } from '@/utils/i18n.js'
import { LOGIN_KEY } from '@/utils/auth.js'

export default {
  onLaunch() {
    initLocale()
    if (uni.getStorageSync(LOGIN_KEY) !== true) {
      setTimeout(() => uni.reLaunch({ url: '/pages/auth/login' }), 0)
    }
    console.log('银发悠旅 App Launch')
  },
  onShow() {
    applyTabBarLabels()
    console.log('银发悠旅 App Show')
  },
  onHide() {
    console.log('银发悠旅 App Hide')
  }
}
</script>

<style>
page {
  background-color: #ffffff;
  color: #111111;
  font-size: 36rpx;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

view,
text {
  box-sizing: border-box;
}
</style>
