<template>
  <view class="schedule-page">
    <TripSubNav title="今日行程" />

    <scroll-view class="schedule-page__scroll" scroll-y :show-scrollbar="false">
      <view class="schedule-page__body">
        <!-- 摘要卡 -->
        <view class="summary-card">
          <view class="summary-card__heading">
          <text class="summary-card__title">成都一日轻松游</text>
            <text class="summary-card__edit" @tap="goEdit">编辑行程</text>
          </view>
          <view class="summary-card__row">
            <text class="summary-card__date">{{ dateLabel }}</text>
            <text class="summary-card__depart">预计 {{ departTime }} 出发</text>
          </view>
          <text class="summary-card__count">{{ places.length }} 个地点</text>
          <view class="summary-card__map-link" @tap="goMap">
            <uni-icons type="map" size="18" color="#01884D" />
            <text class="summary-card__map-text">查看地图</text>
          </view>
        </view>

        <!-- 时间安排 -->
        <view class="timeline-section">
          <text class="timeline-section__title">时间安排</text>

          <view v-if="places.length === 0" class="timeline-empty">
            <text>暂无行程安排，请先创建行程</text>
            <view class="timeline-empty__btn" @tap="goSearch">
              <text>去创建行程</text>
            </view>
          </view>

          <view v-else class="timeline">
            <view
              v-for="(place, index) in places"
              :key="place.id"
              class="timeline-item"
            >
              <view class="timeline-item__left">
                <view
                  class="timeline-item__dot"
                  :class="{ 'timeline-item__dot--active': index === 0 }"
                ></view>
                <view v-if="index < places.length - 1" class="timeline-item__line"></view>
              </view>
              <view class="timeline-item__content">
                <text class="timeline-item__time">{{ place.scheduleTime }}</text>
                <text class="timeline-item__name">{{ place.name }}</text>
                <text class="timeline-item__visit">{{ place.visitLabel }}</text>
                <text class="timeline-item__edit" @tap="openPlaceActions(index)">编辑</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-if="places.length > 0" class="schedule-page__footer">
      <view class="schedule-page__start" @tap="onStartTrip">
        <text class="schedule-page__start-text">开始行程</text>
      </view>
    </view>

    <view v-if="sheetMode" class="sheet-mask" @tap="closeSheet">
      <view class="edit-sheet" @tap.stop>
        <view class="edit-sheet__handle"></view>
        <template v-if="sheetMode === 'actions'">
          <text class="edit-sheet__title">调整地点</text>
          <text class="edit-sheet__place">{{ activePlace && activePlace.name }}</text>
          <button class="sheet-action" @tap="openTimeEditor">修改时间</button>
          <button class="sheet-action sheet-action--danger" @tap="confirmDelete">删除此地点</button>
          <button class="sheet-cancel" @tap="closeSheet">取消</button>
        </template>
        <template v-else>
          <text class="edit-sheet__title">修改到达时间</text>
          <text class="edit-sheet__label">当前地点</text>
          <text class="edit-sheet__place">{{ activePlace && activePlace.name }}</text>
          <text class="edit-sheet__label">当前时间</text>
          <picker mode="time" :value="draftTime" @change="onTimeChange">
            <view class="time-picker">{{ draftTime.replace(':', ' : ') }}</view>
          </picker>
          <button class="sheet-save" @tap="saveTime">保存时间</button>
          <button class="sheet-cancel" @tap="sheetMode = 'actions'">返回</button>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import TripSubNav from '@/components/TripSubNav.vue'
import { getFinalTripPlaces, getTodayLabel, STORAGE_KEYS, saveSelectedPlaces, saveTripPlaces } from '@/utils/tripUtils.js'

export default {
  components: { TripSubNav },
  data() {
    return {
      places: [],
      dateLabel: '今天',
      activeIndex: -1,
      sheetMode: '',
      draftTime: '10:30'
    }
  },
  computed: {
    activePlace() {
      return this.activeIndex >= 0 ? this.places[this.activeIndex] : null
    },
    departTime() {
      return this.places.length > 0 ? this.places[0].scheduleTime : '10:30'
    }
  },
  onShow() {
    this.loadTrip()
  },
  methods: {
    loadTrip() {
      this.places = getFinalTripPlaces()
      try {
        const storedDate = uni.getStorageSync(STORAGE_KEYS.TRIP_DATE)
        const today = new Date()
        const y = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, '0')
        const d = String(today.getDate()).padStart(2, '0')
        const todayStr = `${y}-${m}-${d}`
        this.dateLabel = storedDate === todayStr || !storedDate ? '今天' : storedDate
      } catch (e) {
        this.dateLabel = getTodayLabel()
      }
    },
    goMap() {
      if (this.places.length === 0) {
        uni.showToast({ title: '暂无行程地点', icon: 'none' })
        return
      }
      saveSelectedPlaces(this.places)
      uni.navigateTo({ url: '/pages/trip/map' })
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/trip/search' })
    },
    goEdit() {
      saveTripPlaces(this.places)
      uni.navigateTo({ url: '/pages/trip/edit' })
    },
    openPlaceActions(index) {
      this.activeIndex = index
      this.draftTime = this.places[index].scheduleTime || '10:30'
      this.sheetMode = 'actions'
    },
    openTimeEditor() {
      this.sheetMode = 'time'
    },
    onTimeChange(event) {
      this.draftTime = event.detail.value
    },
    saveTime() {
      if (!this.activePlace) return
      this.places[this.activeIndex].scheduleTime = this.draftTime
      this.places[this.activeIndex].recommendedTime = this.draftTime
      this.places = saveTripPlaces(this.places)
      this.closeSheet()
      uni.showToast({ title: '到达时间已保存', icon: 'success' })
    },
    confirmDelete() {
      if (!this.activePlace) return
      const placeName = this.activePlace.name
      uni.showModal({
        title: '删除地点',
        content: `确认从今日行程中删除“${placeName}”吗？`,
        cancelText: '取消',
        confirmText: '确认删除',
        confirmColor: '#E53935',
        success: ({ confirm }) => {
          if (!confirm) return
          this.places.splice(this.activeIndex, 1)
          this.places = saveTripPlaces(this.places)
          this.closeSheet()
          uni.showToast({ title: '已删除', icon: 'none' })
        }
      })
    },
    closeSheet() {
      this.sheetMode = ''
      this.activeIndex = -1
    },
    onStartTrip() {
      uni.showModal({
        title: '开始导航',
        content: '当前提供行程地图预览，是否现在查看？',
        confirmText: '查看地图',
        cancelText: '暂不开始',
        success: (res) => {
          if (res.confirm) {
            this.goMap()
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.schedule-page {
  min-height: 100vh;
  background-color: #F5F7F5;
  display: flex;
  flex-direction: column;
}

.schedule-page__scroll {
  flex: 1;
  height: 0;
}

.schedule-page__body {
  padding: 24rpx 40rpx 48rpx;
}

.summary-card {
  background-color: #EFF6EB;
  border-radius: 36rpx;
  padding: 36rpx 32rpx;
  margin-bottom: 40rpx;
}

.summary-card__title {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.35;
}

.summary-card__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.summary-card__edit {
  flex-shrink: 0;
  padding: 12rpx 20rpx;
  border: 2rpx solid #01884D;
  border-radius: 999rpx;
  color: #01884D;
  font-size: 28rpx;
  font-weight: 600;
}

.summary-card__row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 16rpx;
}

.summary-card__date {
  font-size: 30rpx;
  color: #01884D;
  font-weight: 500;
}

.summary-card__depart {
  font-size: 30rpx;
  color: #333333;
}

.summary-card__count {
  display: block;
  font-size: 28rpx;
  color: #777777;
  margin-top: 12rpx;
}

.summary-card__map-link {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 24rpx;
  padding: 16rpx 28rpx;
  background-color: #ffffff;
  border-radius: 999rpx;
  min-height: 72rpx;
}

.summary-card__map-text {
  font-size: 30rpx;
  color: #01884D;
  font-weight: 500;
}

.timeline-section__title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #111111;
  margin-bottom: 32rpx;
}

.timeline-empty {
  text-align: center;
  padding: 60rpx 0;
  font-size: 30rpx;
  color: #777777;
}

.timeline-empty__btn {
  margin-top: 24rpx;
  display: inline-flex;
  padding: 20rpx 48rpx;
  background-color: #01884D;
  border-radius: 999rpx;
  color: #ffffff;
  font-size: 32rpx;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 24rpx;
  min-height: 120rpx;
}

.timeline-item__left {
  width: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline-item__dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  border: 4rpx solid #CADBA4;
  background-color: #ffffff;
  flex-shrink: 0;
}

.timeline-item__dot--active {
  background-color: #01884D;
  border-color: #01884D;
  width: 28rpx;
  height: 28rpx;
}

.timeline-item__line {
  flex: 1;
  width: 4rpx;
  background-color: #CADBA4;
  margin: 8rpx 0;
  min-height: 60rpx;
}

.timeline-item__content {
  flex: 1;
  padding-bottom: 32rpx;
}

.timeline-item__time {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #01884D;
  line-height: 1.4;
}

.timeline-item__name {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #111111;
  margin-top: 8rpx;
  line-height: 1.35;
}

.timeline-item__visit {
  display: block;
  font-size: 28rpx;
  color: #777777;
  margin-top: 8rpx;
}

.timeline-item__edit {
  display: inline-flex;
  margin-top: 14rpx;
  padding: 10rpx 28rpx;
  border-radius: 999rpx;
  background: #EFF6EB;
  color: #01884D;
  font-size: 28rpx;
  font-weight: 600;
}

.schedule-page__footer {
  padding: 24rpx 40rpx;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.schedule-page__start {
  height: 96rpx;
  border-radius: 999rpx;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.schedule-page__start-text {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 500;
}

.sheet-mask {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.36);
}

.edit-sheet {
  width: 100%;
  padding: 18rpx 40rpx calc(30rpx + env(safe-area-inset-bottom));
  border-radius: 36rpx 36rpx 0 0;
  background: #FFFFFF;
}

.edit-sheet__handle { width: 84rpx; height: 8rpx; margin: 0 auto 24rpx; border-radius: 8rpx; background: #CCD3CF; }
.edit-sheet__title { display: block; color: #111; font-size: 42rpx; font-weight: 700; }
.edit-sheet__label { display: block; margin-top: 26rpx; color: #6C756F; font-size: 28rpx; }
.edit-sheet__place { display: block; margin-top: 8rpx; color: #173E2D; font-size: 38rpx; font-weight: 700; }
.time-picker { display: flex; align-items: center; justify-content: center; height: 142rpx; margin-top: 16rpx; border: 2rpx solid #CFE9DB; border-radius: 24rpx; background: #F0FAF5; color: #075F38; font-size: 62rpx; font-weight: 700; letter-spacing: 5rpx; }
.sheet-action, .sheet-save, .sheet-cancel { height: 104rpx; margin-top: 22rpx; border: none; border-radius: 20rpx; font-size: 34rpx; line-height: 104rpx; }
.sheet-action { background: #EFF6EB; color: #075F38; }
.sheet-action--danger { background: #FFF0F0; color: #D93632; }
.sheet-save { background: #01884D; color: #FFF; }
.sheet-cancel { background: #F1F4F2; color: #56635C; }
.sheet-action::after, .sheet-save::after, .sheet-cancel::after { border: none; }
</style>
