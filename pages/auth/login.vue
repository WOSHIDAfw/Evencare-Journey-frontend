<template>
  <view class="auth-page">
    <view class="brand"><view class="logo">悠</view><text class="title">欢迎使用银发悠旅</text><text class="subtitle">安心出行，健康相伴</text></view>
    <view class="form">
      <text class="label">手机号码</text>
      <view class="phone-input"><text class="prefix">+86</text><input v-model="phone" type="number" maxlength="11" placeholder="请输入手机号码" /></view>
      <button class="primary" @click="getCode">获取验证码</button>
    </view>
    <view class="agreement"><text>登录即表示您已阅读并同意</text><view><text class="link">《用户协议》</text><text class="link">《隐私政策》</text></view></view>
  </view>
</template>

<script>
import { PENDING_PHONE_KEY } from '@/utils/auth.js'
export default {
  data() { return { phone: '' } },
  methods: {
    getCode() {
      if (!this.phone) return uni.showToast({ title: '请输入手机号码', icon: 'none' })
      if (!/^1\d{10}$/.test(this.phone)) return uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
      uni.setStorageSync(PENDING_PHONE_KEY, this.phone)
      uni.navigateTo({ url: '/pages/auth/verify-code' })
    }
  }
}
</script>

<style scoped>
.auth-page{min-height:100vh;padding:calc(90rpx + env(safe-area-inset-top)) 52rpx 46rpx;background:#fff;box-sizing:border-box}.brand{display:flex;align-items:center;flex-direction:column}.logo{display:flex;align-items:center;justify-content:center;width:142rpx;height:142rpx;border-radius:38rpx;background:#01884d;color:#fff;font-size:76rpx;font-weight:700}.title{margin-top:34rpx;color:#111;font-size:48rpx;font-weight:700}.subtitle{margin-top:12rpx;color:#6a746e;font-size:30rpx}.form{margin-top:82rpx}.label{display:block;margin-bottom:16rpx;color:#222;font-size:32rpx;font-weight:600}.phone-input{display:flex;align-items:center;height:106rpx;padding:0 26rpx;border:2rpx solid #dce4df;border-radius:22rpx;background:#fafcfb}.prefix{padding-right:22rpx;border-right:2rpx solid #dce4df;color:#222;font-size:34rpx}.phone-input input{flex:1;height:100%;padding-left:22rpx;font-size:34rpx}.primary{height:108rpx;margin-top:36rpx;border:none;border-radius:22rpx;background:#01884d;color:#fff;font-size:36rpx;font-weight:600;line-height:108rpx}.primary::after,.text-button::after{border:none}.text-button{margin-top:18rpx;background:transparent;color:#01884d;font-size:31rpx}.agreement{position:absolute;right:40rpx;bottom:calc(36rpx + env(safe-area-inset-bottom));left:40rpx;text-align:center;color:#7a837e;font-size:25rpx}.link{margin:0 8rpx;color:#01884d}
</style>
