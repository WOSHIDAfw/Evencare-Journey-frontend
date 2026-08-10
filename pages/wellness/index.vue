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
        <view v-for="(reminder, index) in reminders" :key="reminder.name" class="reminder-row">
          <view class="reminder-row__icon">{{ reminder.icon }}</view>
          <view class="reminder-row__content" @click="selectReminderTime(index)">
            <text class="reminder-row__name">{{ reminderLabel(reminder) }}</text>
            <text class="reminder-row__time">{{ reminder.labelKey ? t(reminder.labelKey) : t('wellness.everyDay', { time: reminder.time }) }}</text>
          </view>
          <switch :checked="reminder.enabled" color="#01884D" @change="toggleReminder(index, $event)" />
          <picker mode="time" :value="reminder.time" @change="updateReminderTime(index, $event)">
            <view class="edit-time">{{ t('wellness.edit') }}</view>
          </picker>
        </view>
      </view>

      <view class="quick-actions">
        <button class="primary-action" @click="addReminder">＋ {{ t('wellness.addReminder') }}</button>
        <button class="secondary-action" @click="showHealthRecord">{{ t('wellness.healthRecord') }}</button>
      </view>
      <text v-if="sharedNotice" class="shared-notice">此记录已加入家庭共享</text>
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
    toggleReminder(index, event) {
      this.reminders[index].enabled = event.detail.value
      this.persist()
    },
    updateReminderTime(index, event) {
      this.reminders[index].time = event.detail.value
      this.reminders[index].label = ''
      this.persist()
    },
    selectReminderTime() {},
    addReminder() {
      uni.showModal({
        title: this.t('wellness.addReminder'),
        content: this.t('wellness.reminderName'),
        editable: true,
        placeholderText: this.t('wellness.reminderExample'),
        success: ({ confirm, content }) => {
          const name = String(content || '').trim()
          if (!confirm || !name) return
          this.reminders.push({ icon: '醒', name, time: '09:00', enabled: true })
          this.persist()
          uni.showToast({ title: this.t('wellness.added'), icon: 'none' })
        }
      })
    },
    showHealthRecord() {
      uni.showToast({ title: this.t('wellness.healthComing'), icon: 'none' })
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
.reminders { border: 2rpx solid #e9eeeb; border-radius: 24rpx; overflow: hidden; }
.reminder-row { display: flex; align-items: center; min-height: 112rpx; padding: 18rpx 22rpx; border-bottom: 2rpx solid #edf1ef; gap: 18rpx; }
.reminder-row:last-child { border-bottom: none; }
.reminder-row__content { display: flex; flex: 1; flex-direction: column; }
.reminder-row__name { color: #222; font-size: 32rpx; font-weight: 600; }
.reminder-row__time { margin-top: 8rpx; color: #6c756f; font-size: 26rpx; }
.edit-time { padding: 20rpx 0 20rpx 12rpx; color: #01884d; font-size: 28rpx; }
.quick-actions { display: flex; gap: 18rpx; margin-top: 30rpx; }
.primary-action, .secondary-action { flex: 1; height: 104rpx; border-radius: 20rpx; font-size: 32rpx; line-height: 104rpx; }
.primary-action { background: #01884d; color: #fff; }
.secondary-action { background: #eef4f0; color: #075f38; }
.shared-notice { display: block; margin-top: 18rpx; text-align: center; color: #397157; font-size: 26rpx; }
</style>
