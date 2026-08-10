<template>
  <view class="search-page">
    <TripSubNav title="想去哪里？" />

    <scroll-view class="search-page__scroll" scroll-y :show-scrollbar="false">
      <view class="search-page__body">
        <!-- 搜索框 -->
        <view class="search-box">
          <uni-icons type="search" size="20" color="#999999" />
          <input
            v-model="keyword"
            class="search-box__input"
            type="text"
            placeholder="搜索景点、公园、医院等"
            placeholder-class="search-box__placeholder"
            confirm-type="search"
          />
          <view v-if="keyword" class="search-box__clear" @tap="keyword = ''">
            <uni-icons type="clear" size="18" color="#999999" />
          </view>
        </view>

        <!-- 附近地点 -->
        <view class="search-section">
          <text class="search-section__title">附近地点</text>
          <view class="place-list">
            <view
              v-for="place in filteredNearby"
              :key="place.id"
              class="place-item"
              @tap="selectPlace(place)"
            >
              <view class="place-item__icon">
                <uni-icons type="location" size="18" color="#01884D" />
              </view>
              <view class="place-item__info">
                <text class="place-item__name">{{ place.name }}</text>
                <text class="place-item__addr">{{ place.city }} · {{ place.district }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 热门推荐 -->
        <view class="search-section">
          <text class="search-section__title">热门推荐</text>
          <view class="place-list">
            <view
              v-for="place in filteredHot"
              :key="place.id"
              class="place-item"
              @tap="selectPlace(place)"
            >
              <view class="place-item__icon">
                <uni-icons type="star-filled" size="18" color="#01884D" />
              </view>
              <view class="place-item__info">
                <text class="place-item__name">{{ place.name }}</text>
                <text class="place-item__addr">{{ place.city }} · {{ place.district }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 出行日期 -->
        <view class="search-date">
          <text class="search-date__label">出行日期</text>
          <picker mode="date" :value="tripDate" :start="minDate" @change="onDateChange">
            <view class="search-date__value">
              <text>{{ dateLabel }}</text>
              <uni-icons type="right" size="16" color="#777777" />
            </view>
          </picker>
        </view>
      </view>
    </scroll-view>

    <view class="search-page__footer">
      <view class="search-btn" @tap="onSearch">
        <text class="search-btn__text">搜索</text>
      </view>
    </view>
  </view>
</template>

<script>
import TripSubNav from '@/components/TripSubNav.vue'
import { searchHotPlaces, searchNearbyPlaces } from '@/utils/mockData.js'
import { enrichPlacesWithCoords } from '@/utils/geoService.js'
import { STORAGE_KEYS } from '@/utils/tripUtils.js'

export default {
  components: { TripSubNav },
  data() {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    return {
      keyword: '',
      tripDate: `${y}-${m}-${d}`,
      minDate: `${y}-${m}-${d}`,
      hotPlaces: enrichPlacesWithCoords(searchHotPlaces),
      nearbyPlaces: enrichPlacesWithCoords(searchNearbyPlaces)
    }
  },
  computed: {
    dateLabel() {
      const today = this.formatDate(new Date())
      return this.tripDate === today ? '今天' : this.tripDate
    },
    filteredHot() {
      return this.filterPlaces(this.hotPlaces)
    },
    filteredNearby() {
      return this.filterPlaces(this.nearbyPlaces)
    }
  },
  methods: {
    formatDate(date) {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    filterPlaces(list) {
      const kw = this.keyword.trim()
      if (!kw) return list
      return list.filter(
        (p) => p.name.includes(kw) || p.district.includes(kw)
      )
    },
    selectPlace(place) {
      this.keyword = place.name
    },
    onDateChange(e) {
      this.tripDate = e.detail.value
    },
    onSearch() {
      uni.setStorageSync(STORAGE_KEYS.TRIP_DATE, this.tripDate)
      uni.setStorageSync(STORAGE_KEYS.SEARCH_KEYWORD, this.keyword.trim())
      uni.navigateTo({ url: '/pages/trip/select' })
    }
  }
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.search-page__scroll {
  flex: 1;
  height: 0;
}

.search-page__body {
  padding: 24rpx 40rpx 48rpx;
}

.search-box {
  height: 108rpx;
  background-color: #F5F7F5;
  border-radius: 34rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  gap: 16rpx;
  margin-bottom: 48rpx;
}

.search-box__input {
  flex: 1;
  font-size: 32rpx;
  color: #111111;
  height: 80rpx;
}

.search-box__placeholder {
  color: #777777;
  font-size: 32rpx;
}

.search-box__clear {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-section {
  margin-bottom: 40rpx;
}

.search-section__title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #111111;
  margin-bottom: 24rpx;
}

.place-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.place-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 16rpx;
  border-radius: 20rpx;
  min-height: 96rpx;
}

.place-item:active {
  background-color: #F5F7F5;
}

.place-item__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background-color: #EFF6EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.place-item__info {
  flex: 1;
  min-width: 0;
}

.place-item__name {
  display: block;
  font-size: 34rpx;
  font-weight: 500;
  color: #111111;
  line-height: 1.4;
}

.place-item__addr {
  display: block;
  font-size: 28rpx;
  color: #777777;
  line-height: 1.5;
  margin-top: 4rpx;
}

.search-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  border-top: 1rpx solid #E5E5E5;
}

.search-date__label {
  font-size: 34rpx;
  color: #111111;
  font-weight: 500;
}

.search-date__value {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 32rpx;
  color: #01884D;
  min-height: 88rpx;
  padding-left: 24rpx;
}

.search-page__footer {
  padding: 24rpx 40rpx;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.search-btn {
  height: 96rpx;
  border-radius: 999rpx;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn__text {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>
