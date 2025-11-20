// 导出所有类型定义
export * from './wallet'
export * from './api'

// 基础类型定义
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface User {
  id: string
  username?: string
  firstName?: string
  lastName?: string
  languageCode?: string
}

export interface BotConfig {
  token: string
  webhookUrl?: string
  allowedUsers?: string[]
}

export type Theme = 'light' | 'dark' | 'auto'

export interface AppConfig {
  theme: Theme
  language: string
  notifications: boolean
}

// Telegram 相关类型定义
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
  allows_write_to_pm?: boolean
}

export interface TelegramChat {
  id: number
  type: string
  title?: string
  username?: string
  photo_url?: string
}

export interface TelegramInitData {
  query_id?: string
  user?: TelegramUser
  receiver?: TelegramUser
  chat?: TelegramChat
  chat_type?: string
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
}

export interface TelegramThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
}

export interface TelegramWebAppData {
  webApp: NonNullable<Window['Telegram']>['WebApp'] | null
  initData: string
  initDataUnsafe: TelegramInitData | null
  user: TelegramUser | null
  chat: TelegramChat | null
  startParam: string | null
  isReady: boolean
}

// 全局类型声明
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: Record<string, unknown>
        platform: string
        version: string
        colorScheme: 'light' | 'dark'
        themeParams: TelegramThemeParams
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        ready(): void
        expand(): void
        close(): void
        showAlert(message: string): void
        showConfirm(
          message: string,
          callback: (confirmed: boolean) => void
        ): void
        showPopup(
          params: {
            title?: string
            message: string
            buttons?: Array<{
              id?: string
              type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
              text: string
            }>
          },
          callback?: (buttonId: string) => void
        ): void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText(text: string): void
          onClick(callback: () => void): void
          offClick(callback: () => void): void
          show(): void
          hide(): void
          enable(): void
          disable(): void
          showProgress(leaveActive?: boolean): void
          hideProgress(): void
        }
        BackButton: {
          isVisible: boolean
          onClick(callback: () => void): void
          offClick(callback: () => void): void
          show(): void
          hide(): void
        }
        HapticFeedback: {
          impactOccurred(
            style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
          ): void
          notificationOccurred(type: 'error' | 'success' | 'warning'): void
          selectionChanged(): void
        }
        requestStarPayment?(
          params: {
            amount: number
            currency?: string
            description?: string
            payload?: string
            bot_username?: string
          },
          callback: (result: {
            status: 'paid' | 'pending' | 'failed' | 'cancelled'
            currency?: string
            total_amount?: number
            payload?: string
            invoice_slug?: string
            telegram_payment_charge_id?: string
            provider_payment_charge_id?: string
            error?: string
            [key: string]: unknown
          }) => void
        ): void
        openInvoice?(
          slug: string,
          callback: (result: {
            status: 'paid' | 'pending' | 'failed' | 'cancelled'
            [key: string]: unknown
          }) => void
        ): void
      }
    }
  }
}
