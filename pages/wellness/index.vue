<template>
  <PageLayout page-title="康养">
    <view class="section">
      <text class="section__title">康养</text>
    </view>
  </PageLayout>
</template>

<script>
import PageLayout from '@/components/PageLayout.vue'

export default {
  components: {
    PageLayout
  }
}
</script>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
}

.section__title {
  font-size: 48rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.4;
}
</style>
