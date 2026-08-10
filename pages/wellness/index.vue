<template>
  <PageLayout :page-title="t('wellness.title')">
    <view class="wellness">
      <text class="subtitle">{{ t('wellness.subtitle') }}</text>

      <view class="overview">
        <text class="overview__label">{{ t('wellness.todayStatus') }}</text>
        <text class="overview__value">{{ t('wellness.good') }}</text>
        <text class="overview__hint">{{ t('wellness.recorded', { count: recordedCount }) }}</text>
      </view>

      <view class="section-heading">{{ t('wellness.metrics') }}</view>
      <view class="metrics">
        <view v-for="metric in metrics" :key="metric.key" class="metric-card">
          <view class="metric-card__icon">{{ metric.icon }}</view>
          <text class="metric-card__name">{{ metricLabel(metric) }}</text>
          <text class="metric-card__value">{{ metric.value }}<text class="metric-card__unit"> {{ metric.unit }}</text></text>
          <button class="record-button" @click="recordMetric(metric)">{{ t('wellness.record') }}</button>
        </view>
      </view>

      <view class="section-heading">{{ t('wellness.reminders') }}</view>
      <view class="reminders">
        <view v-for="(reminder, index) in reminders" :key="reminder.name" class="reminder-row" @click="openReminderEditor(index)">
          <view class="reminder-row__icon">{{ reminder.icon }}</view>
          <view class="reminder-row__content">
            <text class="reminder-row__name">{{ reminderLabel(reminder) }}</text>
            <text class="reminder-row__time">{{ reminderDisplay(reminder) }}</text>
          </view>
          <text class="reminder-row__status">{{ reminder.enabled ? '已开启' : '已关闭' }}</text>
          <text class="reminder-row__arrow">›</text>
        </view>
      </view>

      <view class="quick-actions">
        <button class="primary-action" @click="addReminder">＋ {{ t('wellness.addReminder') }}</button>
        <button class="secondary-action" @click="showHealthRecord">{{ t('wellness.healthRecord') }}</button>
      </view>
      <text v-if="sharedNotice" class="shared-notice">此记录已加入家庭共享</text>
      <view v-if="showRecords" class="record-summary">
        <text class="record-summary__title">今日健康记录</text>
        <text v-for="metric in metrics" :key="metric.key">{{ metricLabel(metric) }}：{{ metric.value }} {{ metric.unit }}</text>
      </view>
    </view>
    <view v-if="reminderEditorVisible" class="editor-mask" @click="closeReminderEditor">
      <view class="reminder-editor" @click.stop>
        <view class="editor-handle"></view>
        <text class="editor-title">{{ editingIndex < 0 ? '添加提醒' : '编辑提醒' }}</text>
        <text class="editor-label">提醒名称</text>
        <input v-model.trim="draftReminder.name" class="editor-input" placeholder="请输入提醒名称" />
        <text class="editor-label">提醒时间</text>
        <picker mode="time" :value="draftReminder.time" @change="changeDraftTime">
          <view class="editor-time">{{ draftReminder.time.replace(':', ' : ') }}</view>
        </picker>
        <text class="editor-label">重复</text>
        <picker mode="selector" :range="repeatOptions" :value="repeatIndex" @change="changeRepeat">
          <view class="editor-select">{{ draftReminder.repeat }}<text>›</text></view>
        </picker>
        <view class="editor-status"><text>状态</text><view class="editor-status__right"><text>{{ draftReminder.enabled ? '开启' : '关闭' }}</text><switch :checked="draftReminder.enabled" color="#01884D" @change="changeDraftStatus" /></view></view>
        <view class="editor-buttons"><button class="editor-cancel" @click="closeReminderEditor">取消</button><button class="editor-save" @click="saveReminder">保存</button></view>
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
    return {
      recordedCount: 3,
      sharedNotice: false,
      showRecords: false,
      reminderEditorVisible: false,
      editingIndex: -1,
      repeatOptions: ['每天', '每 1 小时', '每 2 小时', '每 3 小时'],
      draftReminder: { name: '', time: '09:00', repeat: '每天', enabled: true },
      metrics: [
        { key: 'heartRate', icon: '♥', name: '心率', value: '72', unit: '次/分钟' },
        { key: 'bloodPressure', icon: '压', name: '血压', value: '128 / 78', unit: 'mmHg' },
        { key: 'bloodOxygen', icon: '氧', name: '血氧', value: '98', unit: '%' },
        { key: 'temperature', icon: '温', name: '体温', value: '36.5', unit: '℃' }
      ],
      reminders: [
        { icon: '药', name: '用药提醒', nameKey: 'wellness.medication', time: '08:00', enabled: true },
        { icon: '水', name: '饮水提醒', nameKey: 'wellness.hydration', time: '10:00', labelKey: 'wellness.everyTwoHours', enabled: true },
        { icon: '压', name: '血压测量提醒', nameKey: 'wellness.pressureReminder', time: '09:00', enabled: true },
        { icon: '动', name: '运动提醒', nameKey: 'wellness.exercise', time: '16:00', enabled: false },
        { icon: '休', name: '休息提醒', nameKey: 'wellness.rest', time: '21:30', enabled: true }
      ]
    }
  },
  onLoad() {
    const stored = uni.getStorageSync('wellnessData')
    if (stored && Array.isArray(stored.metrics)) this.metrics = stored.metrics
    if (stored && Array.isArray(stored.reminders)) this.reminders = stored.reminders
    if (stored && Number.isFinite(stored.recordedCount)) this.recordedCount = stored.recordedCount
  },
  methods: {
    reminderDisplay(reminder) {
      const repeat = reminder.repeat || (reminder.labelKey ? '每 2 小时' : '每天')
      return repeat === '每天' ? `每天 ${reminder.time}` : repeat
    },
    metricLabel(metric) {
      const keys = { heartRate: 'wellness.heartRate', bloodPressure: 'wellness.bloodPressure', bloodOxygen: 'wellness.bloodOxygen', temperature: 'wellness.temperature' }
      return this.t(keys[metric.key])
    },
    reminderLabel(reminder) {
      return reminder.nameKey ? this.t(reminder.nameKey) : reminder.name
    },
    persist() {
      uni.setStorageSync('wellnessData', {
        metrics: this.metrics,
        reminders: this.reminders,
        recordedCount: this.recordedCount
      })
    },
    recordMetric(metric) {
      uni.showModal({
        title: `${this.t('wellness.record')} ${this.metricLabel(metric)}`,
        content: this.t('wellness.enterValue', { name: this.metricLabel(metric) }),
        editable: true,
        placeholderText: metric.value,
        success: ({ confirm, content }) => {
          const value = String(content || '').trim()
          if (!confirm || !value) return
          metric.value = value
          this.recordedCount = Math.min(4, this.recordedCount + 1)
          this.persist()
          uni.showToast({ title: this.t('wellness.saved'), icon: 'success' })
          const guardian = getGuardian()
          this.sharedNotice = Boolean(guardian && guardian.connected && guardian.sharing && guardian.sharing.health)
        }
      })
    },
    openReminderEditor(index) {
      const reminder = this.reminders[index]
      this.editingIndex = index
      this.draftReminder = {
        name: this.reminderLabel(reminder),
        time: reminder.time || '09:00',
        repeat: reminder.repeat || (reminder.labelKey ? '每 2 小时' : '每天'),
        enabled: reminder.enabled !== false,
        icon: reminder.icon || '醒'
      }
      this.reminderEditorVisible = true
    },
    closeReminderEditor() {
      this.reminderEditorVisible = false
      this.editingIndex = -1
    },
    changeDraftTime(event) { this.draftReminder.time = event.detail.value },
    changeRepeat(event) { this.draftReminder.repeat = this.repeatOptions[Number(event.detail.value)] },
    changeDraftStatus(event) { this.draftReminder.enabled = event.detail.value },
    saveReminder() {
      if (!this.draftReminder.name) return uni.showToast({ title: '请输入提醒名称', icon: 'none' })
      const reminder = { ...this.draftReminder, nameKey: '', labelKey: '' }
      if (this.editingIndex < 0) this.reminders.push(reminder)
      else this.reminders.splice(this.editingIndex, 1, reminder)
      this.persist()
      this.closeReminderEditor()
      uni.showToast({ title: '提醒已保存', icon: 'success' })
    },
    addReminder() {
      this.editingIndex = -1
      this.draftReminder = { name: '', time: '09:00', repeat: '每天', enabled: true, icon: '醒' }
      this.reminderEditorVisible = true
    },
    showHealthRecord() {
      this.showRecords = !this.showRecords
    }
  },
  computed: {
    repeatIndex() {
      const index = this.repeatOptions.indexOf(this.draftReminder.repeat)
      return index < 0 ? 0 : index
    }
  }
}
</script>

<style scoped>
.wellness { padding-bottom: 24rpx; }
.subtitle { display: block; margin: -16rpx 0 28rpx; color: #5f6b65; font-size: 32rpx; line-height: 1.6; }
.overview { display: flex; flex-direction: column; padding: 36rpx; border-radius: 28rpx; background: #e7f6ee; }
.overview__label { color: #397157; font-size: 30rpx; }
.overview__value { margin: 12rpx 0; color: #075f38; font-size: 52rpx; font-weight: 700; }
.overview__hint { color: #527060; font-size: 28rpx; }
.section-heading { margin: 42rpx 0 22rpx; color: #111; font-size: 40rpx; font-weight: 700; }
.metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; }
.metric-card { display: flex; flex-direction: column; padding: 26rpx; border: 2rpx solid #e5ebe7; border-radius: 24rpx; background: #fff; }
.metric-card__icon, .reminder-row__icon { display: flex; align-items: center; justify-content: center; width: 64rpx; height: 64rpx; border-radius: 50%; background: #e7f6ee; color: #01884d; font-size: 30rpx; font-weight: 700; }
.metric-card__name { margin-top: 18rpx; color: #333; font-size: 30rpx; }
.metric-card__value { margin: 8rpx 0 20rpx; color: #111; font-size: 36rpx; font-weight: 700; white-space: nowrap; }
.metric-card__unit { color: #66716b; font-size: 23rpx; font-weight: 400; }
.record-button { width: 100%; height: 76rpx; margin: auto 0 0; border: none; border-radius: 16rpx; background: #e7f6ee; color: #017343; font-size: 30rpx; line-height: 76rpx; }
.record-button::after, .primary-action::after, .secondary-action::after { border: none; }
.reminders { display: flex; flex-direction: column; gap: 18rpx; }
.reminder-row { display: flex; align-items: center; min-height: 126rpx; padding: 24rpx; border: 2rpx solid #e9eeeb; border-radius: 24rpx; background: #fff; gap: 18rpx; }
.reminder-row__content { display: flex; flex: 1; flex-direction: column; }
.reminder-row__name { color: #222; font-size: 32rpx; font-weight: 600; }
.reminder-row__time { margin-top: 8rpx; color: #6c756f; font-size: 26rpx; }
.reminder-row__status { color: #397157; font-size: 26rpx; }
.reminder-row__arrow { color: #8a938e; font-size: 46rpx; }
.quick-actions { display: flex; gap: 18rpx; margin-top: 30rpx; }
.primary-action, .secondary-action { flex: 1; height: 104rpx; border-radius: 20rpx; font-size: 32rpx; line-height: 104rpx; }
.primary-action { background: #01884d; color: #fff; }
.secondary-action { background: #eef4f0; color: #075f38; }
.shared-notice { display: block; margin-top: 18rpx; text-align: center; color: #397157; font-size: 26rpx; }
.record-summary { display: flex; flex-direction: column; gap: 10rpx; margin-top: 22rpx; padding: 26rpx; border-radius: 22rpx; background: #F0FAF5; color: #40554A; font-size: 28rpx; }
.record-summary__title { margin-bottom: 4rpx; color: #173E2D; font-size: 34rpx; font-weight: 700; }
.editor-mask { position: fixed; z-index: 80; inset: 0; display: flex; align-items: flex-end; background: rgba(0,0,0,.38); }
.reminder-editor { width: 100%; padding: 18rpx 40rpx calc(30rpx + env(safe-area-inset-bottom)); border-radius: 36rpx 36rpx 0 0; background: #fff; }
.editor-handle { width: 82rpx; height: 8rpx; margin: 0 auto 22rpx; border-radius: 8rpx; background: #CCD3CF; }
.editor-title { display: block; color: #111; font-size: 42rpx; font-weight: 700; }
.editor-label { display: block; margin: 22rpx 0 10rpx; color: #5F6B65; font-size: 28rpx; }
.editor-input { height: 94rpx; padding: 0 24rpx; border: 2rpx solid #DCE4DF; border-radius: 18rpx; font-size: 32rpx; }
.editor-time { display: flex; align-items: center; justify-content: center; height: 126rpx; border: 2rpx solid #CFE9DB; border-radius: 22rpx; background: #F0FAF5; color: #075F38; font-size: 56rpx; font-weight: 700; letter-spacing: 4rpx; }
.editor-select, .editor-status { display: flex; align-items: center; justify-content: space-between; min-height: 94rpx; padding: 0 24rpx; border: 2rpx solid #E1E7E3; border-radius: 18rpx; color: #222; font-size: 31rpx; }
.editor-status { margin-top: 20rpx; }
.editor-status__right { display: flex; align-items: center; gap: 18rpx; color: #397157; }
.editor-buttons { display: flex; gap: 18rpx; margin-top: 28rpx; }
.editor-cancel, .editor-save { flex: 1; height: 104rpx; border: none; border-radius: 20rpx; font-size: 34rpx; line-height: 104rpx; }
.editor-cancel { background: #EEF3F0; color: #4F5D55; }
.editor-save { background: #01884D; color: #FFF; }
.editor-cancel::after, .editor-save::after { border: none; }
</style>
