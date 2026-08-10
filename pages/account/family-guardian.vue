<template>
  <view class="page">
    <view class="status-bar" :style="{height:statusBarHeight+'px'}"></view>
    <view class="nav"><view class="back" @click="goBack">‹</view><text class="nav-title">家庭监护</text></view>
    <scroll-view scroll-y class="content">
      <text class="intro">与家人建立连接，让出行和健康多一份安心。</text>
      <view class="status-card">
        <text class="eyebrow">当前监护状态</text>
        <template v-if="!guardian"><text class="status-title">尚未连接家属</text><text class="status-hint">连接后，家属可在您的主动授权下接收相关信息。</text></template>
        <template v-else><view class="connected"><view class="avatar">李</view><view class="person"><text class="status-title">{{ guardian.name }}</text><text class="status-hint">关系：{{ guardian.relation }} · 已连接</text><text class="phone">{{ guardian.phone }}</text></view></view></template>
      </view>

      <view v-if="!guardian" class="actions"><button class="primary" @click="panel='invite'">邀请家属</button><button class="secondary" @click="panel='code'">输入邀请码</button></view>

      <template v-else>
        <text class="section-title">接收设置</text>
        <view class="rows"><view v-for="item in notificationItems" :key="item.key" class="row"><text>{{ item.label }}</text><switch :checked="guardian.notifications[item.key]" color="#01884D" @change="updateSetting('notifications',item.key,$event)" /></view></view>
        <text class="section-title">共享设置</text>
        <view class="rows"><view v-for="item in sharingItems" :key="item.key" class="row"><text>{{ item.label }}</text><switch :checked="guardian.sharing[item.key]" color="#01884D" @change="updateSetting('sharing',item.key,$event)" /></view></view>
      </template>

      <view class="info-card"><text class="info-title">家属可以看到什么？</text><text>· 您的紧急求助信息</text><text>· 您主动共享的行程</text><text>· 您主动共享的健康提醒</text><text>· 您的安全状态</text><text class="privacy">所有信息均由您主动授权，可随时关闭共享。</text></view>
      <button v-if="guardian" class="unlink" @click="unlink">解除家庭监护关系</button><view class="spacer"></view>
    </scroll-view>

    <view v-if="panel" class="mask" @click="panel=''">
      <view class="sheet" @click.stop>
        <view class="handle"></view>
        <template v-if="panel==='invite'"><text class="sheet-title">邀请家属连接</text><text class="sheet-label">我的邀请码</text><text class="invite-code">YF8888</text><text class="sheet-help">请将邀请码发送给您的子女或家属。</text><button class="primary" @click="copyCode">复制邀请码</button><button class="secondary" @click="shareInvite">分享邀请</button></template>
        <template v-else><text class="sheet-title">输入邀请码</text><input v-model.trim="inputCode" class="code-input" maxlength="12" placeholder="请输入家属提供的邀请码" /><button class="primary" @click="connect">建立连接</button></template>
        <button class="close" @click="panel=''">取消</button>
      </view>
    </view>
  </view>
</template>

<script>
import { GUARDIAN_KEY, getGuardian } from '@/utils/auth.js'
export default {
  data(){return{statusBarHeight:20,guardian:null,panel:'',inputCode:'',notificationItems:[{key:'health',label:'接收健康提醒'},{key:'sos',label:'接收紧急 SOS'},{key:'trip',label:'接收行程信息'}],sharingItems:[{key:'trip',label:'共享行程'},{key:'health',label:'共享健康提醒'},{key:'emergency',label:'共享紧急状态'}]}},
  onLoad(){const info=uni.getSystemInfoSync();this.statusBarHeight=info.statusBarHeight||20;this.guardian=getGuardian()},
  methods:{
    goBack(){uni.navigateBack()},persist(){uni.setStorageSync(GUARDIAN_KEY,this.guardian)},
    copyCode(){uni.setClipboardData({data:'YF8888'} )},shareInvite(){uni.setClipboardData({data:'银发悠旅家庭邀请码：YF8888',success:()=>uni.showToast({title:'邀请内容已复制，请发送给家属',icon:'none'})})},
    connect(){if(this.inputCode.toUpperCase()!=='CHILD01')return uni.showToast({title:'邀请码无效，请重新输入',icon:'none'});this.guardian={connected:true,name:'李晓雨',relation:'女儿',phone:'138 **** 6688',notifications:{health:true,sos:true,trip:true},sharing:{trip:true,health:true,emergency:true}};this.persist();this.panel='';uni.showToast({title:'家庭连接已建立',icon:'success'})},
    updateSetting(group,key,event){this.guardian[group][key]=event.detail.value;this.persist()},
    unlink(){uni.showModal({title:'解除家庭监护',content:'确认解除与李晓雨的家庭监护连接吗？',cancelText:'取消',confirmText:'确认解除',confirmColor:'#E53935',success:({confirm})=>{if(confirm){uni.removeStorageSync(GUARDIAN_KEY);this.guardian=null;uni.showToast({title:'已解除连接',icon:'none'})}}})}
  }
}
</script>

<style scoped>
.page{min-height:100vh;background:#fff}.status-bar{width:100%}.nav{display:flex;align-items:center;height:96rpx;padding:0 28rpx}.back{display:flex;align-items:center;justify-content:center;width:72rpx;height:72rpx;font-size:64rpx}.nav-title{margin-left:12rpx;font-size:44rpx;font-weight:700}.content{height:calc(100vh - 120rpx);padding:12rpx 40rpx;box-sizing:border-box}.intro{display:block;color:#5f6b65;font-size:31rpx;line-height:1.6}.status-card{display:flex;flex-direction:column;margin-top:28rpx;padding:34rpx;border-radius:26rpx;background:#eaf6f0}.eyebrow{color:#397157;font-size:28rpx}.status-title{margin-top:10rpx;color:#123d2a;font-size:42rpx;font-weight:700}.status-hint,.phone{margin-top:10rpx;color:#627068;font-size:28rpx}.connected{display:flex;align-items:center}.avatar{display:flex;align-items:center;justify-content:center;width:104rpx;height:104rpx;border-radius:50%;background:#01884d;color:#fff;font-size:42rpx;font-weight:700}.person{display:flex;flex-direction:column;margin-left:24rpx}.actions{display:flex;gap:18rpx;margin-top:28rpx}.primary,.secondary{height:104rpx;border:none;border-radius:20rpx;font-size:33rpx;line-height:104rpx}.primary{flex:1;background:#01884d;color:#fff}.secondary{flex:1;background:#edf5f0;color:#075f38}.primary::after,.secondary::after,.close::after,.unlink::after{border:none}.section-title{display:block;margin:38rpx 0 18rpx;font-size:37rpx;font-weight:700}.rows{border:2rpx solid #e7ece9;border-radius:22rpx;overflow:hidden}.row{display:flex;align-items:center;justify-content:space-between;min-height:104rpx;padding:0 26rpx;border-bottom:2rpx solid #edf1ef;font-size:32rpx}.row:last-child{border-bottom:none}.info-card{display:flex;flex-direction:column;gap:9rpx;margin-top:34rpx;padding:30rpx;border-radius:24rpx;background:#f0faf5;color:#45584e;font-size:28rpx}.info-title{margin-bottom:8rpx;color:#174b34;font-size:35rpx;font-weight:700}.privacy{margin-top:14rpx;color:#017343;font-weight:600}.unlink{margin-top:32rpx;background:transparent;color:#d93632;font-size:31rpx}.spacer{height:100rpx}.mask{position:fixed;z-index:20;top:0;right:0;bottom:0;left:0;display:flex;align-items:flex-end;background:rgba(0,0,0,.38)}.sheet{width:100%;padding:18rpx 40rpx calc(30rpx + env(safe-area-inset-bottom));border-radius:34rpx 34rpx 0 0;background:#fff}.handle{width:80rpx;height:8rpx;margin:0 auto 22rpx;border-radius:8rpx;background:#ccd3cf}.sheet-title{display:block;font-size:42rpx;font-weight:700}.sheet-label{display:block;margin-top:28rpx;color:#68736d;font-size:28rpx}.invite-code{display:block;margin-top:5rpx;color:#01884d;font-size:64rpx;font-weight:800;letter-spacing:8rpx}.sheet-help{display:block;margin:12rpx 0 26rpx;color:#58665f;font-size:29rpx}.sheet .primary,.sheet .secondary{width:100%;margin-top:18rpx}.code-input{height:104rpx;margin:30rpx 0 16rpx;padding:0 24rpx;border:2rpx solid #dce4df;border-radius:20rpx;font-size:32rpx}.close{margin-top:18rpx;background:transparent;color:#68736d;font-size:30rpx}
</style>
