/**
 * Telegram Star
 *    交易处理
 *    1. 发起支付请求
 *    2. 处理支付回调
 *    3. 验证支付状态
 *    4. 存储交易记录
 */

type TelegramStarPaymentCallback =
  | {
      status: 'paid' | 'pending' | 'failed' | 'cancelled'
      currency?: string
      total_amount?: number
      payload?: string
      invoice_slug?: string
      telegram_payment_charge_id?: string
      provider_payment_charge_id?: string
      error?: string
      [key: string]: unknown
    }
  | undefined

interface TelegramWebAppInterface {
  requestStarPayment?: (
    payload: TelegramStarRequestPayload,
    callback: (result: TelegramStarPaymentCallback) => void
  ) => void
  openInvoice?: (
    slug: string,
    callback: (result: TelegramStarPaymentCallback) => void
  ) => void
}

type TelegramWebApp = TelegramWebAppInterface

type TelegramStarRequestPayload = {
  amount: number
  currency?: string
  description?: string
  payload?: string
  bot_username?: string
}

export type StarPaymentRequest = {
  amount: number
  assetId: number
  description?: string
  payload?: string
  botUsername?: string
  invoiceSlug?: string
  metadata?: Record<string, unknown>
  currency?: string
}

export type StarPaymentRecord = {
  assetId: number
  amount: number
  currency: string
  success: boolean
  status: string
  paymentMethod: 'TELEGRAM_STAR'
  timestamp: number
  telegramPaymentChargeId?: string
  providerPaymentChargeId?: string
  payload?: string
  invoiceSlug?: string
  rawTransactionData: Record<string, unknown>
  metadata?: Record<string, unknown>
}

const STORAGE_KEY = 'telegram_star_payments'
const DEFAULT_CURRENCY = 'XTR'

function isClient(): boolean {
  return typeof window !== 'undefined'
}

function getTelegramWebApp(): TelegramWebApp {
  if (!isClient()) {
    throw new Error('Telegram WebApp is not available on the server')
  }
  const app = window.Telegram?.WebApp
  if (!app) {
    throw new Error('Telegram WebApp API is not available')
  }
  return app
}

function requestStarPaymentViaApi(
  app: TelegramWebApp,
  options: StarPaymentRequest
): Promise<TelegramStarPaymentCallback> {
  return new Promise((resolve, reject) => {
    const requestPayload = {
      amount: options.amount,
      currency: options.currency || DEFAULT_CURRENCY,
      description: options.description,
      payload: options.payload,
      bot_username: options.botUsername,
    }

    if (typeof app.requestStarPayment === 'function') {
      app.requestStarPayment(
        requestPayload,
        (result: TelegramStarPaymentCallback) => {
          if (!result) {
            reject(new Error('No response received from Telegram Star payment'))
            return
          }
          resolve(result)
        }
      )
      return
    }

    if (typeof app.openInvoice === 'function' && options.invoiceSlug) {
      app.openInvoice(
        options.invoiceSlug,
        (result: TelegramStarPaymentCallback) => {
          resolve(result)
        }
      )
      return
    }

    reject(
      new Error(
        'Telegram environment does not support Star payments or invoice fallback'
      )
    )
  })
}

function persistPaymentRecord(record: StarPaymentRecord): void {
  if (!isClient()) return
  try {
    const existingRaw = window.localStorage.getItem(STORAGE_KEY)
    const existing = existingRaw ? JSON.parse(existingRaw) : []
    existing.unshift(record)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(existing.slice(0, 20))
    )
  } catch (error) {
    console.warn('Failed to store Star payment record locally:', error)
  }
}

export function getStoredStarPayments(): StarPaymentRecord[] {
  if (!isClient()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StarPaymentRecord[]) : []
  } catch (error) {
    console.warn('Failed to read stored Star payments:', error)
    return []
  }
}

export function clearStoredStarPayments(): void {
  if (!isClient()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear Star payments cache:', error)
  }
}

export async function processStarPayment(
  request: StarPaymentRequest
): Promise<StarPaymentRecord> {
  if (!request || typeof request.amount !== 'number') {
    throw new Error('Star payment amount is required')
  }
  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    throw new Error('Star payment amount must be a positive number')
  }
  if (!request.assetId && request.assetId !== 0) {
    throw new Error('assetId is required for Star payments')
  }

  const app = getTelegramWebApp()
  const response = await requestStarPaymentViaApi(app, request)

  const status =
    response?.status ||
    (response?.telegram_payment_charge_id ? 'paid' : 'unknown')
  const success = status === 'paid' || status === 'pending'

  const record: StarPaymentRecord = {
    assetId: request.assetId,
    amount: request.amount,
    currency: request.currency || response?.currency || DEFAULT_CURRENCY,
    success,
    status,
    paymentMethod: 'TELEGRAM_STAR',
    timestamp: Date.now(),
    telegramPaymentChargeId: response?.telegram_payment_charge_id,
    providerPaymentChargeId: response?.provider_payment_charge_id,
    payload: response?.payload ?? request.payload,
    invoiceSlug: response?.invoice_slug ?? request.invoiceSlug,
    rawTransactionData: {
      request: {
        amount: request.amount,
        currency: request.currency || DEFAULT_CURRENCY,
        description: request.description,
        payload: request.payload,
        botUsername: request.botUsername,
        invoiceSlug: request.invoiceSlug,
      },
      response,
    },
    metadata: request.metadata,
  }

  persistPaymentRecord(record)

  if (!success) {
    throw new Error(response?.error || 'Star payment did not complete')
  }

  return record
}
