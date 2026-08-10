<template><view class="success-page"><view class="check">✓</view><text class="title">登录成功</text><text class="description">正在为您进入银发悠旅</text><text class="countdown">{{ countdown }} 秒后自动进入首页</text><button class="enter" @click="enterNow">立即进入</button></view></template>
<script>
export default {data(){return{countdown:3,timer:null,entered:false}},onLoad(){this.timer=setInterval(()=>{if(this.countdown<=1){this.countdown=0;this.enterNow()}else this.countdown--},1000)},onUnload(){this.clearTimer()},methods:{clearTimer(){if(this.timer){clearInterval(this.timer);this.timer=null}},enterNow(){if(this.entered)return;this.entered=true;this.clearTimer();uni.switchTab({url:'/pages/trip/index'})}}}
</script>
<style scoped>
.success-page{display:flex;align-items:center;flex-direction:column;min-height:100vh;padding:30vh 48rpx 40rpx;background:#fff;box-sizing:border-box}.check{display:flex;align-items:center;justify-content:center;width:156rpx;height:156rpx;border-radius:50%;background:#01884d;color:#fff;font-size:86rpx;font-weight:700}.title{margin-top:42rpx;color:#111;font-size:52rpx;font-weight:700}.description{margin-top:18rpx;color:#56635c;font-size:32rpx}.countdown{margin-top:18rpx;color:#01884d;font-size:30rpx}.enter{margin-top:54rpx;background:transparent;color:#01884d;font-size:32rpx;font-weight:600}.enter::after{border:none}
</style>
