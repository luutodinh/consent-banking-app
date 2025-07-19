const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN)
}

export function setAccessToken(accessToken: string) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN, accessToken)
  }
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN)
}

export function setRefreshToken(refreshToken: string) {
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}

export function clearToken() {
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
}
