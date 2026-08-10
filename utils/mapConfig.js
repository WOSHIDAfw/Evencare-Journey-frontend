/**
 * 地图配置 — 请勿将 Key 散落到各页面
 *
 * 这里填写高德地图开发者平台申请的 AppKey：
 * https://console.amap.com/
 *
 * App 端还需在 HBuilderX：
 * manifest.json → App模块配置 → Maps（地图）→ 高德地图
 * 填写 Android / iOS 的 AppKey（可与 Web 端 Key 不同）。
 *
 * H5 端需在 manifest.json → h5 → sdkConfigs → maps → amap 配置 key。
 */

export const MAP_CONFIG = {
  /** 高德 Web / 通用 AppKey 占位，申请后填入 */
  amapKey: '',
  /** 高德安全密钥（Web JS API 2.0 如需） */
  securityJsCode: ''
}

/** 成都城区默认地图中心（天府广场附近，GCJ-02） */
export const CHENGDU_CENTER = {
  latitude: 30.659862,
  longitude: 104.065735
}

export function isMapKeyConfigured() {
  return Boolean(MAP_CONFIG.amapKey && String(MAP_CONFIG.amapKey).trim())
}
