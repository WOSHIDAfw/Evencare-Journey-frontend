<template>
  <view class="select-page">
    <TripSubNav title="选择景点" />

    <view class="select-page__intro">
      <text class="select-page__desc">挑选您感兴趣的地点，我们会帮您安排轻松行程。</text>
      <text class="select-page__count">已选择 {{ selectedIds.length }} 个地点</text>
    </view>

    <scroll-view class="select-page__scroll" scroll-y :show-scrollbar="false">
      <view class="select-page__list">
        <PlaceCard
          v-for="place in places"
          :key="place.id"
          :place="place"
          :added="selectedIds.includes(place.id)"
          :show-favorite="false"
          full-width
          @add-change="onAddChange"
        />
      </view>
    </scroll-view>

    <view class="select-page__footer">
      <text class="select-page__footer-count">已选择 {{ selectedIds.length }} 个地点</text>
      <view
        class="select-page__continue"
        :class="{ 'select-page__continue--disabled': selectedIds.length === 0 }"
        @tap="onContinue"
      >
        <text class="select-page__continue-text">继续</text>
      </view>
    </view>
  </view>
</template>

<script>
import TripSubNav from '@/components/TripSubNav.vue'
import PlaceCard from '@/components/PlaceCard.vue'
import { selectPagePlaces } from '@/utils/mockData.js'
import { enrichPlacesWithCoords } from '@/utils/geoService.js'
import { getSelectedPlaces, saveTripPlaces } from '@/utils/tripUtils.js'

export default {
  components: { TripSubNav, PlaceCard },
  data() {
    return {
      places: enrichPlacesWithCoords(selectPagePlaces),
      selectedIds: [],
      selectedMap: {}
    }
  },
  onLoad() {
    const selected = getSelectedPlaces()
    this.selectedIds = selected.map((place) => place.id)
    this.selectedMap = selected.reduce((map, place) => {
      map[place.id] = place
      return map
    }, {})
  },
  methods: {
    onAddChange({ id, isAdded, place }) {
      if (isAdded) {
        if (!this.selectedIds.includes(id)) {
          this.selectedIds.push(id)
          this.selectedMap[id] = place
        }
      } else {
        this.selectedIds = this.selectedIds.filter((item) => item !== id)
        delete this.selectedMap[id]
      }
    },
    onContinue() {
      if (this.selectedIds.length === 0) {
        uni.showToast({ title: '请至少选择一个地点', icon: 'none' })
        return
      }
      const existing = getSelectedPlaces().filter((place) => this.selectedIds.includes(place.id))
      const existingIds = existing.map((place) => place.id)
      const added = this.places.filter((place) => this.selectedIds.includes(place.id) && !existingIds.includes(place.id))
      saveTripPlaces([...existing, ...added])
      uni.navigateTo({ url: '/pages/trip/edit' })
    }
  }
}
</script>

<style scoped>
.select-page {
  min-height: 100vh;
  background-color: #F5F7F5;
  display: flex;
  flex-direction: column;
}

.select-page__intro {
  padding: 16rpx 40rpx 24rpx;
  background-color: #ffffff;
}

.select-page__desc {
  display: block;
  font-size: 30rpx;
  color: #777777;
  line-height: 1.6;
}

.select-page__count {
  display: block;
  font-size: 32rpx;
  color: #01884D;
  font-weight: 500;
  margin-top: 12rpx;
}

.select-page__scroll {
  flex: 1;
  height: 0;
}

.select-page__list {
  padding: 24rpx 40rpx;
  padding-bottom: 48rpx;
}

.select-page__footer {
  padding: 24rpx 40rpx;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.select-page__footer-count {
  display: block;
  text-align: center;
  font-size: 30rpx;
  color: #777777;
  margin-bottom: 16rpx;
}

.select-page__continue {
  height: 96rpx;
  border-radius: 999rpx;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-page__continue--disabled {
  opacity: 0.45;
}

.select-page__continue-text {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>
