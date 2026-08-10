<template>
  <view class="map-page">
    <TripSubNav title="行程地图" />

    <view class="map-page__map-wrap">
      <map
        id="tripMap"
        class="map-page__map"
        :latitude="latitude"
        :longitude="longitude"
        :scale="scale"
        :markers="markers"
        :polyline="polyline"
        show-location
        enable-zoom
        enable-scroll
        @markertap="onMarkerTap"
        @regionchange="onRegionChange"
      />

      <!-- 未配置 Key 时的友好提示（不阻止 map 组件渲染） -->
      <view v-if="showMapTip" class="map-page__tip">
        <uni-icons type="info" size="20" color="#EF7F1D" />
        <text class="map-page__tip-text">地图服务尚未配置，请完成地图密钥设置。</text>
      </view>

      <!-- 顺序连线说明 -->
      <view v-if="places.length > 1" class="map-page__polyline-note">
        <text>绿色连线表示行程顺序，非真实道路导航路线</text>
      </view>

      <!-- 定位按钮 -->
      <view class="map-page__locate" @tap="locateMe">
        <uni-icons type="navigate-filled" size="22" color="#01884D" />
      </view>
    </view>

    <!-- Marker 点击底部卡片 -->
    <view v-if="activePlace" class="map-page__marker-card">
      <view class="marker-card">
        <text class="marker-card__name">{{ activePlace.name }}</text>
        <text class="marker-card__loc">{{ activePlace.city }} · {{ activePlace.district }}</text>
        <view v-if="activePlace.tags && activePlace.tags.length" class="marker-card__tags">
          <text class="marker-card__tag">{{ activePlace.tags[0] }}</text>
        </view>
        <view class="marker-card__btn" @tap="onPlaceDetail">
          <text class="marker-card__btn-text">查看详情</text>
        </view>
      </view>
    </view>

    <!-- 行程摘要 -->
    <view class="map-page__summary">
      <text class="map-page__summary-title">今日行程</text>
      <text class="map-page__summary-count">{{ places.length }} 个地点</text>
      <text class="map-page__summary-hours">预计游览：约 {{ totalHours }} 小时</text>

      <view class="map-page__summary-actions">
        <view class="map-page__btn map-page__btn--outline" @tap="goEdit">
          <text class="map-page__btn-text map-page__btn-text--green">返回编辑</text>
        </view>
        <view class="map-page__btn map-page__btn--primary" @tap="generateTrip">
          <text class="map-page__btn-text map-page__btn-text--white">生成行程</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import TripSubNav from '@/components/TripSubNav.vue'
import { CHENGDU_CENTER, isMapKeyConfigured } from '@/utils/mapConfig.js'
import { calcPlacesCenter } from '@/utils/geoService.js'
import {
  getSelectedPlaces,
  getFinalTripPlaces,
  saveFinalTripPlaces,
  estimateTotalHours,
  assignScheduleToPlaces,
  saveSelectedPlaces
} from '@/utils/tripUtils.js'

export default {
  components: { TripSubNav },
  data() {
    return {
      latitude: CHENGDU_CENTER.latitude,
      longitude: CHENGDU_CENTER.longitude,
      scale: 13,
      places: [],
      markers: [],
      polyline: [],
      activePlace: null,
      mapCtx: null,
      showMapTip: false
    }
  },
  computed: {
    totalHours() {
      return estimateTotalHours(this.places)
    }
  },
  onReady() {
    this.mapCtx = uni.createMapContext('tripMap', this)
    this.checkMapConfig()
    this.loadTripPlaces()
  },
  onShow() {
    this.loadTripPlaces()
  },
  methods: {
    checkMapConfig() {
      // #ifdef H5
      this.showMapTip = !isMapKeyConfigured()
      // #endif
      // #ifndef H5
      this.showMapTip = false
      // #endif
    },
    loadTripPlaces() {
      const final = getFinalTripPlaces()
      const selected = getSelectedPlaces()
      const raw = final.length > 0 ? final : selected
      this.places = assignScheduleToPlaces(raw)
      this.buildMapData()
    },
    buildMapData() {
      const validPlaces = this.places.filter(
        (p) => p.latitude != null && p.longitude != null
      )

      this.markers = validPlaces.map((place, index) => ({
        id: index,
        latitude: place.latitude,
        longitude: place.longitude,
        title: place.name,
        width: 32,
        height: 32,
        label: {
          content: String(index + 1),
          color: '#ffffff',
          fontSize: 14,
          bgColor: '#01884D',
          borderRadius: 20,
          padding: 4,
          anchorX: 0,
          anchorY: -40
        }
      }))

      if (validPlaces.length > 1) {
        this.polyline = [
          {
            points: validPlaces.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude
            })),
            color: '#01884D',
            width: 5,
            arrowLine: true,
            borderColor: '#01884D',
            borderWidth: 1
          }
        ]
      } else {
        this.polyline = []
      }

      const center = calcPlacesCenter(validPlaces)
      if (center) {
        this.latitude = center.latitude
        this.longitude = center.longitude
      } else {
        this.latitude = CHENGDU_CENTER.latitude
        this.longitude = CHENGDU_CENTER.longitude
      }

      if (validPlaces.length === 1) {
        this.scale = 15
      } else if (validPlaces.length > 1) {
        this.scale = 13
        this.$nextTick(() => {
          this.fitMapToMarkers(validPlaces)
        })
      }
    },
    fitMapToMarkers(places) {
      if (!this.mapCtx || !places.length) return
      this.mapCtx.includePoints({
        points: places.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude
        })),
        padding: [80, 40, 80, 40]
      })
    },
    onMarkerTap(e) {
      const markerId = e.detail.markerId
      const place = this.places.filter(
        (p) => p.latitude != null && p.longitude != null
      )[markerId]
      if (place) {
        this.activePlace = place
      }
    },
    onRegionChange() {
      // 保留以便后续扩展
    },
    onPlaceDetail() {
      uni.showToast({
        title: '景点详情将在后续完善',
        icon: 'none'
      })
    },
    locateMe() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.latitude = res.latitude
          this.longitude = res.longitude
          if (this.mapCtx) {
            this.mapCtx.moveToLocation({
              latitude: res.latitude,
              longitude: res.longitude
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '暂时无法获取当前位置，请检查定位权限。',
            icon: 'none',
            duration: 2500
          })
        }
      })
    },
    goEdit() {
      saveSelectedPlaces(this.places)
      uni.navigateTo({ url: '/pages/trip/edit' })
    },
    generateTrip() {
      if (this.places.length === 0) {
        uni.showToast({ title: '请先选择行程地点', icon: 'none' })
        return
      }
      saveFinalTripPlaces(this.places)
      uni.navigateTo({ url: '/pages/trip/schedule' })
    }
  }
}
</script>

<style scoped>
.map-page {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.map-page__map-wrap {
  position: relative;
  width: 100%;
  height: 70vh;
  flex-shrink: 0;
}

.map-page__map {
  width: 100%;
  height: 100%;
}

.map-page__tip {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  right: 24rpx;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.map-page__tip-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
}

.map-page__polyline-note {
  position: absolute;
  bottom: 24rpx;
  left: 24rpx;
  right: 24rpx;
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  z-index: 10;
}

.map-page__polyline-note text {
  font-size: 24rpx;
  color: #777777;
  line-height: 1.5;
}

.map-page__locate {
  position: absolute;
  right: 32rpx;
  bottom: 100rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.map-page__marker-card {
  padding: 0 32rpx;
  margin-top: -20rpx;
  position: relative;
  z-index: 11;
}

.marker-card {
  background-color: #ffffff;
  border-radius: 28rpx;
  padding: 28rpx 32rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
}

.marker-card__name {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #111111;
}

.marker-card__loc {
  display: block;
  font-size: 28rpx;
  color: #777777;
  margin-top: 8rpx;
}

.marker-card__tags {
  margin-top: 16rpx;
}

.marker-card__tag {
  font-size: 24rpx;
  color: #01884D;
  background-color: #EFF6EB;
  border-radius: 999rpx;
  padding: 8rpx 20rpx;
}

.marker-card__btn {
  margin-top: 20rpx;
  height: 80rpx;
  border-radius: 999rpx;
  border: 2rpx solid #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-card__btn-text {
  font-size: 30rpx;
  color: #01884D;
}

.map-page__summary {
  flex: 1;
  padding: 32rpx 40rpx;
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.map-page__summary-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #111111;
}

.map-page__summary-count {
  display: block;
  font-size: 30rpx;
  color: #777777;
  margin-top: 8rpx;
}

.map-page__summary-hours {
  display: block;
  font-size: 30rpx;
  color: #01884D;
  margin-top: 8rpx;
}

.map-page__summary-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.map-page__btn {
  flex: 1;
  height: 96rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-page__btn--outline {
  border: 2rpx solid #01884D;
  background-color: #ffffff;
}

.map-page__btn--primary {
  background-color: #01884D;
}

.map-page__btn-text {
  font-size: 32rpx;
  font-weight: 500;
}

.map-page__btn-text--green {
  color: #01884D;
}

.map-page__btn-text--white {
  color: #ffffff;
}
</style>
