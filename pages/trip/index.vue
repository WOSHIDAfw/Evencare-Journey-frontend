<template>
  <view class="trip-page">
    <view class="trip-page__status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <scroll-view
      class="trip-page__scroll"
      scroll-y
      :show-scrollbar="false"
      :style="{ height: scrollHeight + 'px' }"
    >
      <!-- 顶部城市栏 -->
      <view class="trip-header">
        <view class="trip-header__city-row">
          <view class="trip-header__city">
            <text class="trip-header__city-name">{{ userInfo.city }}</text>
            <uni-icons type="bottom" size="14" color="#111111" />
          </view>
          <view class="trip-header__actions">
            <view class="trip-header__action-btn" @tap="onNotificationTap">
              <uni-icons type="notification" size="22" color="#ffffff" />
            </view>
            <view class="trip-header__action-btn" @tap="onMoreTap">
              <uni-icons type="more-filled" size="22" color="#ffffff" />
            </view>
          </view>
        </view>

        <view class="trip-header__welcome">
          <text class="trip-header__greeting">{{ greeting }}，{{ userInfo.name }}</text>
          <text class="trip-header__hint">今天想去哪里看看？</text>
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="trip-search" @tap="onSearchTap">
        <view class="trip-search__inner">
          <uni-icons type="search" size="20" color="#999999" />
          <text class="trip-search__placeholder">搜索景点、医院、公园等</text>
          <view class="trip-search__voice" @tap.stop="onSearchTap">
            <uni-icons type="mic" size="20" color="#01884D" />
          </view>
        </view>
      </view>

      <!-- 今日出行 -->
      <view class="trip-today">
        <view class="trip-today__header">
          <text class="trip-today__title">今日出行</text>
          <text class="trip-today__detail" @tap="onTripDetailTap">查看详情</text>
        </view>

        <view class="trip-today__card">
          <view class="trip-today__card-main">
            <view class="trip-today__card-info">
              <text class="trip-today__card-label">{{ displayTodayTrip.title }}</text>
              <text class="trip-today__card-route">{{ displayTodayTrip.route }}</text>
              <text class="trip-today__card-time">{{ displayTodayTrip.departTime }}</text>
              <text class="trip-today__card-summary">{{ displayTodayTrip.summary }}</text>
            </view>
            <view class="trip-today__card-icon">
              <uni-icons type="location" size="28" color="#ffffff" />
            </view>
          </view>
          <view class="trip-today__card-btn" @tap="onTripDetailTap">
            <text class="trip-today__card-btn-text">查看行程</text>
          </view>
        </view>
      </view>

      <!-- 为您推荐 -->
      <view class="trip-section">
        <SectionHeader title="为您推荐" />
        <scroll-view class="place-scroll" scroll-x :show-scrollbar="false" enable-flex>
          <view class="place-scroll__track">
            <PlaceCard
              v-for="place in recommendedPlaces"
              :key="place.id"
              :place="place"
            />
          </view>
        </scroll-view>
      </view>

      <!-- 轻松游览 -->
      <view class="trip-section">
        <SectionHeader title="轻松游览" />
        <scroll-view class="place-scroll" scroll-x :show-scrollbar="false" enable-flex>
          <view class="place-scroll__track">
            <PlaceCard
              v-for="place in easyPlaces"
              :key="place.id"
              :place="place"
            />
          </view>
        </scroll-view>
      </view>

      <!-- 康养推荐 -->
      <view class="trip-section">
        <SectionHeader title="康养推荐" />
        <scroll-view class="place-scroll" scroll-x :show-scrollbar="false" enable-flex>
          <view class="place-scroll__track">
            <PlaceCard
              v-for="place in wellnessPlaces"
              :key="place.id"
              :place="place"
            />
          </view>
        </scroll-view>
      </view>

      <!-- 长者热门 -->
      <view class="trip-section trip-section--last">
        <SectionHeader title="长者热门" />
        <scroll-view class="place-scroll" scroll-x :show-scrollbar="false" enable-flex>
          <view class="place-scroll__track">
            <PlaceCard
              v-for="place in seniorPopularPlaces"
              :key="place.id"
              :place="place"
            />
          </view>
        </scroll-view>
      </view>

      <view class="trip-page__bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script>
import SectionHeader from '@/components/SectionHeader.vue'
import PlaceCard from '@/components/PlaceCard.vue'
import {
  recommendedPlaces,
  easyPlaces,
  wellnessPlaces,
  seniorPopularPlaces,
  todayTrip,
  userInfo
} from '@/utils/mockData.js'
import { getFinalTripPlaces, buildRouteSummary } from '@/utils/tripUtils.js'

export default {
  components: {
    SectionHeader,
    PlaceCard
  },
  data() {
    return {
      statusBarHeight: 20,
      scrollHeight: 600,
      recommendedPlaces,
      easyPlaces,
      wellnessPlaces,
      seniorPopularPlaces,
      todayTrip,
      userInfo,
      displayTodayTrip: { ...todayTrip }
    }
  },
  computed: {
    greeting() {
      const hour = new Date().getHours()
      if (hour < 12) return '上午好'
      if (hour < 18) return '下午好'
      return '晚上好'
    }
  },
  onReady() {
    this.calcScrollHeight()
  },
  onShow() {
    this.refreshTodayTrip()
  },
  created() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 20
  },
  methods: {
    calcScrollHeight() {
      const systemInfo = uni.getSystemInfoSync()
      const windowHeight = systemInfo.windowHeight || systemInfo.screenHeight || 600
      this.scrollHeight = windowHeight - this.statusBarHeight
    },
    refreshTodayTrip() {
      const final = getFinalTripPlaces()
      if (final.length > 0) {
        this.displayTodayTrip = {
          title: '今日行程',
          route: buildRouteSummary(final),
          departTime: `预计 ${final[0].scheduleTime || '10:30'} 出发`,
          summary: `${final.length} 个地点 · 约 ${final.length * 1.8} 公里`
        }
      } else {
        this.displayTodayTrip = { ...todayTrip }
      }
    },
    onNotificationTap() {
      uni.showToast({
        title: '暂无新消息',
        icon: 'none'
      })
    },
    onMoreTap() {
      uni.showActionSheet({
        itemList: ['切换城市', '行程设置', '帮助']
      })
    },
    onSearchTap() {
      uni.navigateTo({ url: '/pages/trip/search' })
    },
    onTripDetailTap() {
      const final = getFinalTripPlaces()
      if (final.length > 0) {
        uni.navigateTo({ url: '/pages/trip/schedule' })
      } else {
        uni.navigateTo({ url: '/pages/trip/search' })
      }
    }
  }
}
</script>

<style scoped>
.trip-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.trip-page__status-bar {
  width: 100%;
  background-color: #ffffff;
}

.trip-page__scroll {
  width: 100%;
}

.trip-page__bottom-spacer {
  height: calc(220rpx + constant(safe-area-inset-bottom));
  height: calc(220rpx + env(safe-area-inset-bottom));
}

/* 顶部区域 */
.trip-header {
  padding: 16rpx 40rpx 0;
}

.trip-header__city-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.trip-header__city {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.trip-header__city-name {
  font-size: 50rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.3;
}

.trip-header__actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.trip-header__action-btn {
  width: 92rpx;
  height: 92rpx;
  border-radius: 50%;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trip-header__welcome {
  margin-top: 20rpx;
}

.trip-header__greeting {
  display: block;
  font-size: 32rpx;
  color: #111111;
  line-height: 1.5;
}

.trip-header__hint {
  display: block;
  font-size: 28rpx;
  color: #777777;
  line-height: 1.5;
  margin-top: 4rpx;
}

/* 搜索框 */
.trip-search {
  padding: 32rpx 40rpx 0;
}

.trip-search__inner {
  height: 108rpx;
  background-color: #F5F7F5;
  border-radius: 34rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  gap: 16rpx;
}

.trip-search__placeholder {
  flex: 1;
  font-size: 32rpx;
  color: #777777;
  line-height: 1.4;
}

.trip-search__voice {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 今日出行 */
.trip-today {
  padding: 48rpx 40rpx 0;
}

.trip-today__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.trip-today__title {
  font-size: 42rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.3;
}

.trip-today__detail {
  font-size: 30rpx;
  color: #01884D;
  line-height: 1.4;
  padding: 8rpx 0 8rpx 16rpx;
  min-height: 88rpx;
  display: flex;
  align-items: center;
}

.trip-today__card {
  background-color: #EFF6EB;
  border-radius: 42rpx;
  padding: 36rpx 36rpx 32rpx;
  overflow: hidden;
}

.trip-today__card-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.trip-today__card-info {
  flex: 1;
  min-width: 0;
}

.trip-today__card-label {
  display: block;
  font-size: 28rpx;
  color: #01884D;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.trip-today__card-route {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.45;
  margin-bottom: 16rpx;
}

.trip-today__card-time {
  display: block;
  font-size: 30rpx;
  color: #333333;
  line-height: 1.5;
  margin-bottom: 8rpx;
}

.trip-today__card-summary {
  display: block;
  font-size: 28rpx;
  color: #777777;
  line-height: 1.5;
}

.trip-today__card-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trip-today__card-btn {
  margin-top: 32rpx;
  height: 84rpx;
  border-radius: 999rpx;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trip-today__card-btn-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  line-height: 1.4;
}

/* 推荐区域 */
.trip-section {
  margin-top: 56rpx;
}

.trip-section--last {
  margin-bottom: 0;
}

.place-scroll {
  width: 100%;
}

.place-scroll__track {
  display: flex;
  flex-direction: row;
  gap: 28rpx;
  padding: 0 40rpx;
}
</style>
