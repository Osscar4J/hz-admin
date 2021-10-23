import Cookies from 'js-cookie'

const tokenKey = 'hezhi_token'
const refreshTokenKey = 'hezhi_refresh_token'
const tokenExpiredKey = 'token_expired'

export function getToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token) {
  setTokenExpired()
  return Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshTokenKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshTokenKey)
}

export function getTokenExpired() {
  return Cookies.get(tokenExpiredKey)
}

function setTokenExpired (expireTime) {
  expireTime = expireTime || new Date().getTime() + 26 * 60 * 1000
  return Cookies.set(tokenExpiredKey, expireTime)
}
