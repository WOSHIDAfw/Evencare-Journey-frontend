/**
 * 地理坐标服务
 *
 * 已确认坐标使用 GCJ-02（火星坐标），与 uni.getLocation({ type: 'gcj02' }) 及国内地图底图一致。
 * 未确认坐标的景点可通过 geocodePlaceName / searchPOI 在未来接入高德 Web 服务 API 获取。
 */

import { MAP_CONFIG } from './mapConfig.js'

/**
 * 已通过公开 POI 信息核实的成都景点坐标（GCJ-02）
 * 来源：高德 / 公开地图 POI，仅供开发测试
 */
const CONFIRMED_COORDS = {
  wuhouci: { latitude: 30.647865, longitude: 104.053012 },
  dufu: { latitude: 30.660148, longitude: 104.028912 },
  kuanzhai: { latitude: 30.663812, longitude: 104.053678 },
  renmin: { latitude: 30.657482, longitude: 104.065312 },
  jinli: { latitude: 30.645612, longitude: 104.048756 },
  jinsha: { latitude: 30.681523, longitude: 104.013678 },
  qingcheng: { latitude: 30.900421, longitude: 103.567289 },
  huanhuaxi: { latitude: 30.659812, longitude: 104.034567 },
  botanic: { latitude: 30.771234, longitude: 104.127845 }
}

/**
 * 为景点对象补充坐标字段
 * @param {Object} place
 * @returns {Object}
 */
export function enrichPlaceWithCoords(place) {
  if (!place) return place
  const coords = CONFIRMED_COORDS[place.id]
  if (coords) {
    return {
      ...place,
      latitude: coords.latitude,
      longitude: coords.longitude,
      hasCoords: true
    }
  }
  return {
    ...place,
    latitude: null,
    longitude: null,
    hasCoords: false
  }
}

/**
 * 批量补充坐标，过滤无坐标项
 */
export function enrichPlacesWithCoords(places) {
  return (places || []).map(enrichPlaceWithCoords)
}

/**
 * 计算多个点的地图中心（简单均值）
 */
export function calcPlacesCenter(places) {
  const valid = (places || []).filter((p) => p.latitude != null && p.longitude != null)
  if (!valid.length) return null
  const sum = valid.reduce(
    (acc, p) => ({
      latitude: acc.latitude + p.latitude,
      longitude: acc.longitude + p.longitude
    }),
    { latitude: 0, longitude: 0 }
  )
  return {
    latitude: sum.latitude / valid.length,
    longitude: sum.longitude / valid.length
  }
}

/**
 * 未来：通过高德地理编码 API 根据名称获取坐标
 * 需配置 MAP_CONFIG.amapKey 并在服务端或合规环境下调用
 */
export async function geocodePlaceName(name, city = '成都') {
  if (!MAP_CONFIG.amapKey) {
    console.warn('[geoService] 未配置 amapKey，无法地理编码：', name, city)
    return null
  }
  // 第四阶段接入高德 REST API：/v3/geocode/geo
  return null
}

/**
 * 未来：通过高德 POI 搜索获取坐标
 */
export async function searchPOI(keyword, city = '成都') {
  if (!MAP_CONFIG.amapKey) {
    console.warn('[geoService] 未配置 amapKey，无法 POI 搜索：', keyword)
    return null
  }
  // 第四阶段接入高德 REST API：/v3/place/text
  return null
}

export { CONFIRMED_COORDS }
