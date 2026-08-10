export const DEV_MODE = true
export const PHONE_CODE = '123456'
export const EMAIL_CODE = '888888'
export const LOGIN_KEY = 'isLoggedIn'
export const USER_INFO_KEY = 'loginUserInfo'
export const PENDING_PHONE_KEY = 'pendingLoginPhone'
export const GUARDIAN_KEY = 'familyGuardian'

export function maskPhone(phone = '') {
  return phone.length === 11 ? `${phone.slice(0, 3)} **** ${phone.slice(7)}` : phone
}

export function completeLogin(email = '') {
  const phone = uni.getStorageSync(PENDING_PHONE_KEY) || '13800008888'
  uni.setStorageSync(LOGIN_KEY, true)
  uni.setStorageSync(USER_INFO_KEY, { name: '李明', phone: maskPhone(phone), email })
}

export function logout() {
  uni.removeStorageSync(LOGIN_KEY)
  uni.removeStorageSync(USER_INFO_KEY)
  uni.removeStorageSync(PENDING_PHONE_KEY)
}

export function getGuardian() {
  const stored = uni.getStorageSync(GUARDIAN_KEY)
  return stored && typeof stored === 'object' ? stored : null
}
