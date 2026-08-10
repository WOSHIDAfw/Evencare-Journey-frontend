/**
 * 行程流程工具：时间安排、本地存储
 */

import { enrichPlacesWithCoords } from './geoService.js'

export const STORAGE_KEYS = {
  SELECTED: 'selectedTripPlaces',
  FINAL: 'finalTripPlaces',
  SEARCH_KEYWORD: 'tripSearchKeyword',
  TRIP_DATE: 'tripDate'
}

/** 默认各站到达时间（简单规则，非路径规划） */
export const DEFAULT_SCHEDULE_TIMES = ['10:30', '12:30', '15:30', '17:00', '18:30']

/**
 * 为行程地点分配时间与预计游览时长
 */
export function assignScheduleToPlaces(places) {
  return (places || []).map((place, index) => ({
    ...place,
    scheduleTime: DEFAULT_SCHEDULE_TIMES[index] || DEFAULT_SCHEDULE_TIMES[DEFAULT_SCHEDULE_TIMES.length - 1],
    visitMinutes: place.visitMinutes || 90,
    visitLabel: formatVisitDuration(place.visitMinutes || 90)
  }))
}

export function formatVisitDuration(minutes) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `预计游览 ${h} 小时 ${m} 分钟` : `预计游览 ${h} 小时`
  }
  return `预计游览 ${minutes} 分钟`
}

/** 估算总游览时长（小时，向上取整） */
export function estimateTotalHours(places) {
  const totalMinutes = (places || []).reduce((sum, p) => sum + (p.visitMinutes || 90), 0)
  return Math.max(1, Math.ceil(totalMinutes / 60))
}

export function getSelectedPlaces() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEYS.SELECTED)
    return enrichPlacesWithCoords(Array.isArray(raw) ? raw : [])
  } catch (e) {
    return []
  }
}

export function saveSelectedPlaces(places) {
  uni.setStorageSync(STORAGE_KEYS.SELECTED, places)
}

export function getFinalTripPlaces() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEYS.FINAL)
    return enrichPlacesWithCoords(Array.isArray(raw) ? raw : [])
  } catch (e) {
    return []
  }
}

export function saveFinalTripPlaces(places) {
  const scheduled = assignScheduleToPlaces(enrichPlacesWithCoords(places))
  uni.setStorageSync(STORAGE_KEYS.FINAL, scheduled)
  return scheduled
}

export function buildRouteSummary(places) {
  return (places || []).map((p) => p.name).join(' → ')
}

export function getTodayLabel() {
  const d = new Date()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${month}月${day}日 周${weekdays[d.getDay()]}`
}
