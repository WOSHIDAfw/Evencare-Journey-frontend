import { reactive } from 'vue'
import zhCN from '@/locales/zh-CN.js'
import jaJP from '@/locales/ja-JP.js'
import koKR from '@/locales/ko-KR.js'
import thTH from '@/locales/th-TH.js'
import enUS from '@/locales/en-US.js'

export const LOCALE_STORAGE_KEY = 'appLocale'
export const DEFAULT_LOCALE = 'zh-CN'
export const localeOptions = [
  { code: 'zh-CN', label: '简体中文' }, { code: 'ja-JP', label: '日本語' },
  { code: 'ko-KR', label: '한국어' }, { code: 'th-TH', label: 'ไทย' },
  { code: 'en-US', label: 'English' }
]

const messages = { 'zh-CN': zhCN, 'ja-JP': jaJP, 'ko-KR': koKR, 'th-TH': thTH, 'en-US': enUS }
export const localeState = reactive({ current: DEFAULT_LOCALE })

function readPath(source, key) {
  return key.split('.').reduce((value, part) => value && value[part], source)
}

export function t(key, params = {}) {
  const translated = readPath(messages[localeState.current], key)
  const fallback = readPath(messages[DEFAULT_LOCALE], key)
  const value = typeof translated === 'string' && translated ? translated : fallback
  if (typeof value !== 'string' || !value) return '—'
  return value.replace(/\{(\w+)\}/g, (_, name) => params[name] === undefined ? '' : String(params[name]))
}

export function applyTabBarLabels() {
  ;['trip', 'wellness', 'security', 'settings'].forEach((key, index) => {
    try { uni.setTabBarItem({ index, text: t(`tab.${key}`) }) } catch (error) {}
  })
}

export function setLocale(code) {
  localeState.current = messages[code] ? code : DEFAULT_LOCALE
  uni.setStorageSync(LOCALE_STORAGE_KEY, localeState.current)
  applyTabBarLabels()
}

export function initLocale() {
  const stored = uni.getStorageSync(LOCALE_STORAGE_KEY)
  localeState.current = messages[stored] ? stored : DEFAULT_LOCALE
  applyTabBarLabels()
  return localeState.current
}

export const i18nMixin = {
  computed: { currentLocale() { return localeState.current } },
  methods: { t }
}
