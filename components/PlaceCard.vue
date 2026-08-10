<template>
  <view class="place-card" :class="{ 'place-card--full': fullWidth }">
    <view class="place-card__image-wrap">
      <image
        v-if="!imageError"
        class="place-card__image"
        :src="place.image"
        mode="aspectFill"
        @error="onImageError"
      />
      <view v-else class="place-card__image place-card__image--placeholder"></view>
      <view v-if="showFavorite" class="place-card__favorite" @tap.stop="toggleFavorite">
        <uni-icons
          :type="isFavorite ? 'heart-filled' : 'heart'"
          :color="isFavorite ? '#01884D' : '#999999'"
          size="20"
        />
      </view>
    </view>

    <view class="place-card__body">
      <text class="place-card__name">{{ place.name }}</text>
      <text class="place-card__location">{{ place.city }} · {{ place.district }}</text>

      <view v-if="displayTags.length" class="place-card__tags">
        <text
          v-for="tag in displayTags"
          :key="tag"
          class="place-card__tag"
        >{{ tag }}</text>
      </view>

      <view class="place-card__footer">
        <text class="place-card__rating">{{ place.rating }} 分</text>
        <view
          class="place-card__add-btn"
          :class="{ 'place-card__add-btn--added': addedState }"
          @tap.stop="toggleAdded"
        >
          <text class="place-card__add-btn-text">{{ addedState ? '已加入 ✓' : '加入行程' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PlaceCard',
  props: {
    place: {
      type: Object,
      required: true
    },
    /** 受控模式：由父组件传入是否已加入 */
    added: {
      type: Boolean,
      default: undefined
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    showFavorite: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imageError: false,
      isFavorite: false,
      internalAdded: false
    }
  },
  computed: {
    displayTags() {
      const tags = this.place.tags || []
      return tags.slice(0, 3)
    },
    addedState() {
      return this.added !== undefined ? this.added : this.internalAdded
    }
  },
  watch: {
    added(val) {
      if (val !== undefined) {
        this.internalAdded = val
      }
    }
  },
  methods: {
    onImageError() {
      this.imageError = true
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      this.$emit('favorite-change', {
        id: this.place.id,
        isFavorite: this.isFavorite
      })
    },
    toggleAdded() {
      const next = !this.addedState
      if (this.added === undefined) {
        this.internalAdded = next
      }
      this.$emit('add-change', {
        id: this.place.id,
        isAdded: next,
        place: this.place
      })
    }
  }
}
</script>

<style scoped>
.place-card {
  width: 520rpx;
  flex-shrink: 0;
  background-color: #ffffff;
  border-radius: 38rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.place-card--full {
  width: 100%;
  margin-bottom: 28rpx;
}

.place-card__image-wrap {
  position: relative;
  width: 100%;
  height: 280rpx;
}

.place-card__image {
  width: 100%;
  height: 280rpx;
  border-radius: 38rpx 38rpx 0 0;
  display: block;
}

.place-card__image--placeholder {
  background-color: #EFF6EB;
}

.place-card__favorite {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.place-card__body {
  padding: 28rpx 30rpx 32rpx;
}

.place-card__name {
  display: block;
  font-size: 38rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.35;
  margin-bottom: 8rpx;
}

.place-card__location {
  display: block;
  font-size: 28rpx;
  color: #777777;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.place-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.place-card__tag {
  font-size: 24rpx;
  color: #01884D;
  background-color: #EFF6EB;
  border-radius: 999rpx;
  padding: 8rpx 20rpx;
  line-height: 1.4;
}

.place-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.place-card__rating {
  font-size: 30rpx;
  color: #111111;
  font-weight: 500;
  line-height: 1.4;
}

.place-card__add-btn {
  min-width: 168rpx;
  height: 80rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  background-color: #01884D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.place-card__add-btn--added {
  background-color: #CADBA4;
}

.place-card__add-btn-text {
  font-size: 28rpx;
  color: #ffffff;
  line-height: 1.4;
  white-space: nowrap;
}

.place-card__add-btn--added .place-card__add-btn-text {
  color: #01884D;
}
</style>
