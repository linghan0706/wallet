import { httpUtils } from './http'
import { getFormattedInitData } from '../telegramWebApp/telegrambot'

// 定义 Telegram 登录相关的类型
export interface TelegramLoginRequest {
  initData: string
}

// 统一的API响应基础结构
export interface BaseApiResponse {
  success: boolean
  message: string
  timestamp: number
}

// 登录成功时的用户数据
export interface LoginUserData {
  accessToken: string
  refreshToken: string
  userId: number
  telegramId: number
  username: string
  avatarUrl: string
  expiresIn: number
}

// 成功响应（包含用户数据）
export interface TelegramLoginSuccessResponse extends BaseApiResponse {
  success: true
  data: LoginUserData
}

// 空数据响应（用于某些成功但无数据的情况）
export interface TelegramLoginEmptyResponse extends BaseApiResponse {
  success: true
  data: Record<string, never>
}

// 统一的登录响应类型
export type TelegramLoginResponse =
  | TelegramLoginSuccessResponse
  | TelegramLoginEmptyResponse

// 错误响应类型
export interface LoginError extends BaseApiResponse {
  success: false
  data?: Record<string, never>
}

// 存储键名常量
const STORAGE_KEYS = {
  TOKEN: 'telegram_auth_token',
  USER: 'telegram_user_info',
  LOGIN_TIME: 'telegram_login_time',
} as const
// 导出格式化数据
export const initData = getFormattedInitData()
/**
 * Telegram Web App 登录函数
 * 使用 getFormattedInitData 返回的数据进行登录
 */
export async function telegramLogin(): Promise<
  TelegramLoginResponse | LoginError
> {
  try {
    // 1. 获取格式化后的 Telegram initData
    const initDataResult = getFormattedInitData()

    if (!initDataResult || !initDataResult.initData) {
      return {
        success: false,
        message:
          '无法获取 Telegram initData。请确保在 Telegram Web App 环境中运行。',
        timestamp: Date.now(),
      }
    }

    // 2. 准备请求数据
    const requestData: TelegramLoginRequest = {
      initData: initDataResult.initData,
    }
    console.log('Sending Telegram login request...')

    // 3. 发送登录请求（优先 header-only，401/缺少令牌时回退 JSON body）
    const response = await httpUtils.post<TelegramLoginResponse>(
      '/auth/login',
      requestData,
      { headers: { 'X-Telegram-Init-Data': initDataResult.initData } }
    )

    // 4. 验证响应数据
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format from server')
    }

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Login failed',
        timestamp: response.timestamp || Date.now(),
      }
    }

    // 5. 检查是否是成功响应且包含用户数据
    if (
      'data' in response &&
      response.data &&
      typeof response.data === 'object' &&
      'accessToken' in response.data
    ) {
      const successResponse = response as TelegramLoginSuccessResponse

      // 6. 验证必要字段
      if (!successResponse.data.accessToken || !successResponse.data.userId) {
        throw new Error(
          'Missing required fields in response (accessToken or userId)'
        )
      }

      // 7. 保存登录信息到本地存储
      saveLoginInfo(successResponse)

      console.log('Telegram login successful:', successResponse.data)
      return successResponse
    }

    // 8. 处理空数据的成功响应
    return response
  } catch (error) {
    console.error('Telegram login error:', error)

    // 处理不同类型的错误
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        timestamp: Date.now(),
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred during login',
      timestamp: Date.now(),
    }
  }
}

/**
 * 保存登录信息到本地存储
 */
function saveLoginInfo(loginResponse: TelegramLoginSuccessResponse): void {
  try {
    // 保存认证令牌
    localStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.data.accessToken)

    // 保存用户信息
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        userId: loginResponse.data.userId,
        telegramId: loginResponse.data.telegramId,
        username: loginResponse.data.username,
        avatarUrl: loginResponse.data.avatarUrl,
        refreshToken: loginResponse.data.refreshToken,
        expiresIn: loginResponse.data.expiresIn,
      })
    )

    // 保存登录时间
    localStorage.setItem(STORAGE_KEYS.LOGIN_TIME, Date.now().toString())

    console.log('Login info saved to localStorage')
  } catch (error) {
    console.error('Failed to save login info to localStorage:', error)
  }
}
/**
 * 从本地存储获取保存的登录信息
 */
export function getSavedLoginInfo(): {
  token: string | null
  user: {
    userId: number
    telegramId: number
    username: string
    avatarUrl: string
    refreshToken: string
    expiresIn: number
  } | null
  loginTime: number | null
} {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    const loginTimeStr = localStorage.getItem(STORAGE_KEYS.LOGIN_TIME)

    const user = userStr ? JSON.parse(userStr) : null
    const loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : null

    return { token, user, loginTime }
  } catch (error) {
    console.error('Failed to get saved login info:', error)
    return { token: null, user: null, loginTime: null }
  }
}

/**
 * 检查用户是否已登录
 */
export function isUserLoggedIn(): boolean {
  const { token, loginTime } = getSavedLoginInfo()

  if (!token || !loginTime) {
    return false
  }

  // 检查登录是否过期（例如：7天）
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
  const isExpired = Date.now() - loginTime > SEVEN_DAYS

  if (isExpired) {
    clearLoginInfo()
    return false
  }

  return true
}

/**
 * 清除登录信息
 */
export function clearLoginInfo(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.LOGIN_TIME)
    console.log('Login info cleared')
  } catch (error) {
    console.error('Failed to clear login info:', error)
  }
}

/**
 * 登出函数
 */
export async function telegramLogout(): Promise<BaseApiResponse> {
  try {
    // 清除本地存储
    clearLoginInfo()

    // 可选：通知后端用户登出
    try {
      await httpUtils.post('/auth/logout')
    } catch (error) {
      console.warn('Failed to notify server about logout:', error)
      // 不影响本地登出流程
    }

    return {
      success: true,
      message: '登出成功',
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '登出失败',
      timestamp: Date.now(),
    }
  }
}

// Telegram API 集合
export const telegramApi = {
  login: telegramLogin,
  logout: telegramLogout,
  getSavedLoginInfo,
  isUserLoggedIn,
  clearLoginInfo,
}

// 导出所有 API
const api = {
  telegram: telegramApi,
}

export default api
