<template>
  <view class="edit-page">
    <TripSubNav title="我的行程" />

    <scroll-view class="edit-page__scroll" scroll-y :show-scrollbar="false">
      <view class="edit-page__body">
        <text class="edit-page__desc">已为您安排一个轻松的游览顺序</text>

        <view v-if="places.length === 0" class="edit-page__empty">
          <text class="edit-page__empty-text">暂无行程地点，请先选择景点</text>
          <view class="edit-page__empty-btn" @tap="goSelect">
            <text>去选择景点</text>
          </view>
        </view>

        <view v-else class="edit-list">
          <view
            v-for="(place, index) in places"
            :key="place.id"
            class="edit-item"
          >
            <view class="edit-item__time-col">
              <text class="edit-item__time">{{ place.scheduleTime }}</text>
              <view v-if="index < places.length - 1" class="edit-item__line"></view>
            </view>

            <view class="edit-item__card">
              <view class="edit-item__thumb-wrap">
                <image
                  v-if="!place._imgError"
                  class="edit-item__thumb"
                  :src="place.image"
                  mode="aspectFill"
                  @error="onImgError(index)"
                />
                <view v-else class="edit-item__thumb edit-item__thumb--placeholder"></view>
              </view>

              <view class="edit-item__info">
                <text class="edit-item__name">{{ place.name }}</text>
                <text class="edit-item__visit">{{ place.visitLabel }}</text>
                <view class="edit-item__tags">
                  <text
                    v-for="tag in (place.tags || []).slice(0, 2)"
                    :key="tag"
                    class="edit-item__tag"
                  >{{ tag }}</text>
                </view>
              </view>

              <view class="edit-item__actions">
                <view
                  class="edit-item__action"
                  :class="{ 'edit-item__action--disabled': index === 0 }"
                  @tap="moveUp(index)"
                >
                  <uni-icons type="up" size="18" color="#01884D" />
                </view>
                <view
                  class="edit-item__action"
                  :class="{ 'edit-item__action--disabled': index === places.length - 1 }"
                  @tap="moveDown(index)"
                >
                  <uni-icons type="down" size="18" color="#01884D" />
                </view>
                <view class="edit-item__action edit-item__action--delete" @tap="removeAt(index)">
                  <uni-icons type="trash" size="18" color="#E84A4A" />
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="places.length > 0" class="edit-page__map-btn" @tap="goMap">
          <uni-icons type="map" size="20" color="#01884D" />
          <text class="edit-page__map-btn-text">在地图上查看</text>
        </view>
        <view v-if="places.length > 0" class="edit-page__add-btn" @tap="goSelect">
          <text>＋ 添加景点</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import TripSubNav from '@/components/TripSubNav.vue'
import {
  getSelectedPlaces,
  getFinalTripPlaces,
  saveTripPlaces,
  assignScheduleToPlaces
} from '@/utils/tripUtils.js'

export default {
  components: { TripSubNav },
  data() {
    return {
      places: []
    }
  },
  onShow() {
    this.loadPlaces()
  },
  methods: {
    loadPlaces() {
      const finalPlaces = getFinalTripPlaces()
      const raw = finalPlaces.length > 0 ? finalPlaces : getSelectedPlaces()
      this.places = assignScheduleToPlaces(raw).map((p) => ({ ...p, _imgError: false }))
    },
    persist() {
      this.places = saveTripPlaces(this.places).map((p) => ({
        ...p,
        _imgError: p._imgError || false
      }))
    },
    onImgError(index) {
      this.places[index]._imgError = true
    },
    removeAt(index) {
      this.places.splice(index, 1)
      this.places = assignScheduleToPlaces(this.places).map((p) => ({
        ...p,
        _imgError: p._imgError || false
      }))
      this.persist()
    },
    moveUp(index) {
      if (index <= 0) return
      const list = [...this.places]
      const temp = list[index - 1]
      list[index - 1] = list[index]
      list[index] = temp
      this.places = assignScheduleToPlaces(list).map((p) => ({
        ...p,
        _imgError: p._imgError || false
      }))
      this.persist()
    },
    moveDown(index) {
      if (index >= this.places.length - 1) return
      const list = [...this.places]
      const temp = list[index + 1]
      list[index + 1] = list[index]
      list[index] = temp
      this.places = assignScheduleToPlaces(list).map((p) => ({
        ...p,
        _imgError: p._imgError || false
      }))
      this.persist()
    },
    goMap() {
      if (this.places.length === 0) return
      this.persist()
      uni.navigateTo({ url: '/pages/trip/map' })
    },
    goSelect() {
      uni.navigateTo({ url: '/pages/trip/select' })
    }
  }
}
</script>

<style scoped>
.edit-page {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.edit-page__scroll {
  flex: 1;
  height: 0;
}

.edit-page__body {
  padding: 16rpx 40rpx 48rpx;
}

.edit-page__desc {
  display: block;
  font-size: 30rpx;
  color: #777777;
  line-height: 1.6;
  margin-bottom: 32rpx;
}

.edit-page__empty {
  padding: 80rpx 0;
  text-align: center;
}

.edit-page__empty-text {
  font-size: 32rpx;
  color: #777777;
}

.edit-page__empty-btn {
  margin-top: 32rpx;
  display: inline-flex;
  padding: 20rpx 48rpx;
  background-color: #01884D;
  border-radius: 999rpx;
  color: #ffffff;
  font-size: 32rpx;
}

.edit-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.edit-item {
  display: flex;
  gap: 20rpx;
}

.edit-item__time-col {
  width: 100rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-item__time {
  font-size: 28rpx;
  font-weight: 600;
  color: #01884D;
  line-height: 1.4;
  padding-top: 24rpx;
}

.edit-item__line {
  flex: 1;
  width: 4rpx;
  background-color: #CADBA4;
  margin-top: 12rpx;
  min-height: 60rpx;
}

.edit-item__card {
  flex: 1;
  display: flex;
  gap: 20rpx;
  background-color: #F5F7F5;
  border-radius: 28rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  min-width: 0;
}

.edit-item__thumb-wrap {
  flex-shrink: 0;
}

.edit-item__thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  display: block;
}

.edit-item__thumb--placeholder {
  background-color: #EFF6EB;
}

.edit-item__info {
  flex: 1;
  min-width: 0;
}

.edit-item__name {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.35;
}

.edit-item__visit {
  display: block;
  font-size: 26rpx;
  color: #777777;
  margin-top: 8rpx;
}

.edit-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
}

.edit-item__tag {
  font-size: 22rpx;
  color: #01884D;
  background-color: #EFF6EB;
  border-radius: 999rpx;
  padding: 6rpx 16rpx;
}

.edit-item__actions {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex-shrink: 0;
}

.edit-item__action {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-item__action--disabled {
  opacity: 0.3;
}

.edit-item__action--delete {
  background-color: #FFF0F0;
}

.edit-page__map-btn {
  margin-top: 40rpx;
  height: 96rpx;
  border-radius: 999rpx;
  border: 2rpx solid #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.edit-page__map-btn-text {
  font-size: 34rpx;
  color: #01884D;
  font-weight: 500;
}

.edit-page__add-btn {
  margin-top: 20rpx;
  height: 96rpx;
  border-radius: 999rpx;
  background: #EFF6EB;
  color: #01884D;
  font-size: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
