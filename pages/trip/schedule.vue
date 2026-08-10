<template>
  <view class="schedule-page">
    <TripSubNav title="今日行程" />

    <scroll-view class="schedule-page__scroll" scroll-y :show-scrollbar="false">
      <view class="schedule-page__body">
        <!-- 摘要卡 -->
        <view class="summary-card">
          <text class="summary-card__title">成都一日轻松游</text>
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
  </view>
</template>

<script>
import TripSubNav from '@/components/TripSubNav.vue'
import { getFinalTripPlaces, getTodayLabel, STORAGE_KEYS, saveSelectedPlaces } from '@/utils/tripUtils.js'

export default {
  components: { TripSubNav },
  data() {
    return {
      places: [],
      dateLabel: '今天'
    }
  },
  computed: {
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
    onStartTrip() {
      uni.showModal({
        title: '开始导航',
        content: '真实导航将在下一阶段接入，现在可以先查看地图路线。',
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
</style>
