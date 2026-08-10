<template>
  <view class="auth-page">
    <view class="back" @click="goBack">‹</view><text class="title">验证码登录</text>
    <text class="description">验证码已发送至</text><text class="phone">{{ maskedPhone }}</text>
    <view class="code-boxes" @click="focusInput"><view v-for="index in 6" :key="index" class="code-box" :class="{active: code.length === index - 1}">{{ code[index-1] || '' }}</view></view>
    <input ref="codeInput" v-model="code" class="hidden-input" type="number" maxlength="6" :focus="inputFocused" @blur="inputFocused=false" />
    <button class="primary" @click="verify">验证并登录</button>
    <button class="resend" :disabled="countdown>0" @click="resend">{{ countdown > 0 ? `${countdown} 秒后重新发送` : '重新发送验证码' }}</button>
    <text v-if="devMode" class="dev-tip">测试验证码：123456</text>
  </view>
</template>

<script>
import { DEV_MODE, PHONE_CODE, PENDING_PHONE_KEY, maskPhone } from '@/utils/auth.js'
export default {
  data(){return{code:'',countdown:60,timer:null,inputFocused:true,devMode:DEV_MODE,maskedPhone:''}},
  onLoad(){this.maskedPhone=maskPhone(uni.getStorageSync(PENDING_PHONE_KEY));this.startCountdown()},
  onUnload(){this.clearTimer()},
  methods:{
    goBack(){uni.navigateBack()}, focusInput(){this.inputFocused=false;this.$nextTick(()=>{this.inputFocused=true})},
    startCountdown(){this.clearTimer();this.countdown=60;this.timer=setInterval(()=>{if(this.countdown<=1){this.countdown=0;this.clearTimer()}else this.countdown--},1000)},
    clearTimer(){if(this.timer){clearInterval(this.timer);this.timer=null}},
    resend(){uni.showToast({title:'验证码已重新发送',icon:'none'});this.startCountdown()},
    verify(){if(this.code!==PHONE_CODE)return uni.showToast({title:'验证码错误，请重新输入',icon:'none'});this.clearTimer();uni.navigateTo({url:'/pages/auth/bind-email'})}
  }
}
</script>

<style scoped>
.auth-page{min-height:100vh;padding:calc(44rpx + env(safe-area-inset-top)) 48rpx;background:#fff;box-sizing:border-box}.back{display:flex;align-items:center;justify-content:center;width:84rpx;height:84rpx;color:#222;font-size:70rpx}.title{display:block;margin-top:46rpx;color:#111;font-size:50rpx;font-weight:700}.description{display:block;margin-top:24rpx;color:#707973;font-size:30rpx}.phone{display:block;margin-top:8rpx;color:#222;font-size:36rpx;font-weight:600}.code-boxes{display:flex;justify-content:space-between;margin-top:60rpx}.code-box{display:flex;align-items:center;justify-content:center;width:88rpx;height:104rpx;border:2rpx solid #d7dfda;border-radius:18rpx;color:#111;font-size:46rpx;font-weight:700}.code-box.active{border-color:#01884d;box-shadow:0 0 0 4rpx #e0f2e8}.hidden-input{position:fixed;left:-9999px;width:1px;height:1px}.primary{height:108rpx;margin-top:58rpx;border:none;border-radius:22rpx;background:#01884d;color:#fff;font-size:36rpx;line-height:108rpx}.primary::after,.resend::after{border:none}.resend{margin-top:24rpx;background:transparent;color:#01884d;font-size:30rpx}.resend[disabled]{color:#909993}.dev-tip{display:block;margin-top:24rpx;text-align:center;color:#8a938e;font-size:26rpx}
</style>
