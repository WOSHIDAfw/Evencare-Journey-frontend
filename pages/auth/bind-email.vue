<template>
  <view class="auth-page">
    <view class="back" @click="goBack">‹</view><text class="title">绑定邮箱</text><text class="description">绑定邮箱后，可用于账号安全验证和重要通知。</text>
    <view class="form"><text class="label">邮箱地址</text><input v-model.trim="email" class="input" placeholder="请输入常用邮箱" />
      <text class="label code-label">邮箱验证码</text><view class="code-row"><input v-model="code" class="input code-input" type="number" maxlength="6" placeholder="请输入验证码" /><button class="send" @click="sendCode">获取验证码</button></view>
      <text v-if="devMode" class="dev-tip">测试验证码：888888</text><button class="primary" @click="finish">完成绑定</button><button class="later" @click="skip">稍后绑定</button>
    </view>
  </view>
</template>

<script>
import { DEV_MODE, EMAIL_CODE, completeLogin } from '@/utils/auth.js'
export default {data(){return{email:'',code:'',codeSent:false,devMode:DEV_MODE}},methods:{
  goBack(){uni.navigateBack()}, validEmail(){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)},
  sendCode(){if(!this.validEmail())return uni.showToast({title:'请输入正确的邮箱地址',icon:'none'});this.codeSent=true;uni.showToast({title:'验证码已发送',icon:'none'})},
  finish(){if(!this.validEmail())return uni.showToast({title:'请输入正确的邮箱地址',icon:'none'});if(!this.codeSent||this.code!==EMAIL_CODE)return uni.showToast({title:'邮箱验证码错误',icon:'none'});completeLogin(this.email);uni.navigateTo({url:'/pages/auth/login-success'})},
  skip(){completeLogin('');uni.navigateTo({url:'/pages/auth/login-success'})}
}}</script>

<style scoped>
.auth-page{min-height:100vh;padding:calc(44rpx + env(safe-area-inset-top)) 48rpx;background:#fff;box-sizing:border-box}.back{display:flex;align-items:center;justify-content:center;width:84rpx;height:84rpx;font-size:70rpx}.title{display:block;margin-top:42rpx;color:#111;font-size:50rpx;font-weight:700}.description{display:block;margin-top:20rpx;color:#657069;font-size:30rpx;line-height:1.6}.form{margin-top:58rpx}.label{display:block;margin-bottom:14rpx;color:#222;font-size:31rpx;font-weight:600}.code-label{margin-top:32rpx}.input{height:104rpx;padding:0 25rpx;border:2rpx solid #dce4df;border-radius:20rpx;background:#fafcfb;font-size:32rpx}.code-row{display:flex;gap:16rpx}.code-input{flex:1;min-width:0}.send{width:210rpx;height:104rpx;margin:0;border:none;border-radius:20rpx;background:#e7f6ee;color:#017343;font-size:28rpx;line-height:104rpx}.primary{height:108rpx;margin-top:46rpx;border:none;border-radius:22rpx;background:#01884d;color:#fff;font-size:35rpx;line-height:108rpx}.primary::after,.send::after,.later::after{border:none}.later{margin-top:18rpx;background:transparent;color:#01884d;font-size:31rpx}.dev-tip{display:block;margin-top:18rpx;color:#87918b;font-size:26rpx}
</style>
