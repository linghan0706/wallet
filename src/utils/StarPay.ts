/*   Telegram Star
 *    交易处理
 *    1. 发起支付请求
 *    2. 处理支付回调
 *    3. 验证支付状态
 *    4. 存储交易记录
 */

type TelegramWebApp = NonNullable<Window['Telegram']>['WebApp']

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

type CreateStarInvoiceResponse = {
  success: boolean
  invoiceUrl?: string
  invoiceSlug?: string
  message?: string
}

export type StarPaymentRequest = {
  /** Amount of Stars (XTR) to charge. */
  amount: number
  /** Asset identifier expected by our backend (e.g. Stars asset ID). */
  assetId: number
  /** Optional textual description shown to the user. */
  description?: string
  /** Optional payload (will be echoed by Telegram in callbacks). */
  payload?: string
  /** Optional Telegram invoice slug if we rely on openInvoice fallback. */
  invoiceSlug?: string
  /** Optional bot username that owns the Star subscription/product. */
  botUsername?: string
  /** Custom metadata we want to attach to the record (not sent to Telegram). */
  metadata?: Record<string, unknown>
  /** Currency code (defaults to Stars / XTR). */
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
const DEFAULT_BOT_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace('@', '') || undefined

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

async function createStarInvoice(
  options: StarPaymentRequest
): Promise<{ invoiceUrl: string; invoiceSlug: string }> {
  if (!isClient()) {
    throw new Error('Star payments are only available inside Telegram')
  }

  const response = await fetch('/api/telegram/createStarInvoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: options.amount,
      payload: options.payload ?? `asset-${options.assetId}`,
      description: options.description ?? 'Telegram Stars purchase',
      title: options.description ?? 'Telegram Stars purchase',
      assetId: options.assetId,
    }),
    cache: 'no-store',
  })

  const data = (await response.json().catch(() => ({}))) as
    | CreateStarInvoiceResponse
    | undefined

  if (!response.ok || !data?.success || !data.invoiceUrl) {
    throw new Error(data?.message || 'Failed to create Star invoice')
  }

  return {
    invoiceUrl: data.invoiceUrl,
    invoiceSlug: data.invoiceSlug || data.invoiceUrl,
  }
}

async function requestStarPaymentViaApi(
  app: TelegramWebApp,
  options: StarPaymentRequest
): Promise<TelegramStarPaymentCallback> {
  const requestPayload = {
    amount: options.amount,
    currency: options.currency || DEFAULT_CURRENCY,
    description: options.description,
    payload: options.payload,
    bot_username: options.botUsername ?? DEFAULT_BOT_USERNAME,
  }

  const requestStarPayment = app.requestStarPayment
  if (typeof requestStarPayment === 'function') {
    return new Promise((resolve, reject) => {
      requestStarPayment(requestPayload, result => {
        if (!result) {
          reject(new Error('No response received from Telegram Star payment'))
          return
        }
        resolve(result)
      })
    })
  }

  const invoice = options.invoiceSlug
    ? { invoiceSlug: options.invoiceSlug, invoiceUrl: options.invoiceSlug }
    : await createStarInvoice(options)

  const openInvoice = app.openInvoice
  if (typeof openInvoice === 'function') {
    const attemptOpenInvoice = (
      target: string
    ): Promise<TelegramStarPaymentCallback> =>
      new Promise(resolve => {
        openInvoice(target, result => {
          const merged =
            result === undefined
              ? {
                  status: 'pending',
                  invoice_slug: invoice.invoiceSlug ?? target,
                  invoice_url: invoice.invoiceUrl ?? target,
                }
              : {
                  ...result,
                  invoice_slug:
                    (result as TelegramStarPaymentCallback)?.invoice_slug ??
                    invoice.invoiceSlug ??
                    target,
                  invoice_url:
                    (result as TelegramStarPaymentCallback)?.invoice_url ??
                    invoice.invoiceUrl ??
                    target,
                }

          resolve(merged as TelegramStarPaymentCallback)
        })
      })

    // Prefer slug for WebApp compatibility; fall back to the full URL if slug fails synchronously.
    try {
      if (invoice.invoiceSlug) {
        return await attemptOpenInvoice(invoice.invoiceSlug)
      }
    } catch (error) {
      console.warn('openInvoice with slug failed, retrying with URL:', error)
    }

    return attemptOpenInvoice(invoice.invoiceUrl || invoice.invoiceSlug || '')
  }

  throw new Error(
    'Telegram client does not expose Star payment methods. Please update Telegram.'
  )
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
  if (typeof request.assetId !== 'number') {
    throw new Error('assetId must be a number for Star payments')
  }

  const app = getTelegramWebApp()
  if (typeof app.ready === 'function') {
    try {
      app.ready()
    } catch (error) {
      console.warn('Telegram WebApp ready() failed (continuing):', error)
    }
  }

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
