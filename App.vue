<script>
import { initLocale, applyTabBarLabels } from '@/utils/i18n.js'
import { DEV_MODE, LOGIN_KEY } from '@/utils/auth.js'

export default {
  onLaunch() {
    initLocale()
    if (DEV_MODE || uni.getStorageSync(LOGIN_KEY) !== true) {
      setTimeout(() => uni.reLaunch({ url: '/pages/auth/login' }), 0)
    } else {
      setTimeout(() => uni.switchTab({ url: '/pages/trip/index' }), 0)
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
