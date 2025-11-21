import { TOKEN_STORAGE_KEYS } from '../../config/auth'

export function getAccessToken(): string | null {
  for (const key of TOKEN_STORAGE_KEYS) {
    const v = localStorage.getItem(key)
    if (v) return v
  }
  return null
}

export function setAccessToken(token: string): void {
  const key = TOKEN_STORAGE_KEYS[0]
  localStorage.setItem(key, token)
}

export function clearAccessToken(): void {
  for (const key of TOKEN_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}

export function getRefreshToken(): string | null {
  const s = localStorage.getItem('telegram_user_info')
  if (!s) return null
  try {
    const obj = JSON.parse(s)
    return obj?.refreshToken ?? null
  } catch {
    return null
  }
}
