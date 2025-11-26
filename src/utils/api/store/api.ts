import http from '../../http'
import { AUTH_HEADER, BEARER_PREFIX } from '@/config/auth'
import { getAccessToken } from '@/utils/auth/token'

{
  /**
   * 资产兑换定义
   */
}
export type AssetRedemption = {
  sourceAssetId: number
  sourceAssetName: string
  sourceAssetIcon: string
  sourceAmount: number
  targetAssetId: number
  targetAssetName: string
  targetAssetIcon: string
  targetAmount: number
  exchangeRate: string
}
export type StorePrice = {
  assetId: number
  assetName: string
  assetIcon: string
  amount: number
}
export type StoreProperty = {
  name: string
  value: number
  type: string
}
export type StoreItemEntry = {
  itemId: number
  itemName: string
  itemType: string
  description: string
  iconPath: string
  prices: StorePrice[]
  properties: StoreProperty[]
}
export type StoreItems = Record<string, StoreItemEntry[]>
export type StoreCenterData = {
  assetRedemption: AssetRedemption | null
  storeItems: StoreItems
}
export type ApiSuccess<T> = {
  success: boolean
  data: T
  message: string
  timestamp: number
}

export type PaymentMethod = 'star' | 'ton' | 'usdc' | 'other'

export type FormattedStorePrice = StorePrice & {
  amount: number
  paymentMethod: PaymentMethod
  label: string
}

export type FormattedStoreItem = {
  id: string
  itemId: number
  itemType: string
  title: string
  description?: string
  icon: string
  prices: FormattedStorePrice[]
  properties: StoreProperty[]
}

export type StarPayProduct = {
  id: string
  itemId: number
  title: string
  description?: string
  price: number
  icon: string
  paymentMethod?: PaymentMethod
  assetLabel?: string
  assetIcon?: string
}

export type TonPayProduct = StarPayProduct

export type UsdcPayProduct = StarPayProduct

/**
 * 订单定义
 */
export type StoreOrder = {
  orderId: number
  orderNumber: string
  userId: number
  itemId: number
  itemName: string
  quantity: number
  totalPrice: number
  assetId: number
  assetName: string
  orderStatus: string
  paymentMethod: string
  walletAddress: string
  transactionHash: string
  paymentTime: string
  verifiedTime: string
  verificationStatus: string
  verificationAttempts: number
  verificationError: string
  createdAt: string
  updatedAt: string
}

{
  /**
   * 购买提交请求
   */
}
export type PurchaseSubmitRequest = {
  itemId: number
  assetId: number
  quantity: number
  paymentMethod: string
  transactionHash: string
  walletAddress: string
  rawTransactionData: Record<string, unknown>
}

export type StarInvoiceRequest = {
  itemId: number
  quantity: number
}

export type StarInvoiceResponseData = {
  invoiceLink?: string
  status?: string
  messageId?: number
  chatId?: number
  currency?: string
  totalAmount?: number
  invoicePayload?: string
}

export type StarInvoiceResponse = {
  code?: string | number
  data?: StarInvoiceResponseData
  success?: boolean
  message?: string
  invoiceLink?: string
  [key: string]: unknown
}

export type StarInvoiceResult = StarInvoiceResponseData & {
  invoiceLink: string
}

{
  /**
   * 资产兑换请求
   */
}
export type ExchangeRequest = {
  sourceAssetId: number
  targetAssetId: number
  sourceAmount: number
}

/**
 * 获取商店中心数据
 */
export async function fetchStoreCenter(): Promise<ApiSuccess<StoreCenterData>> {
  const res = await http.get('/store/center')
  return res as unknown as ApiSuccess<StoreCenterData>
}

/**
 * 获取商店订单列表
 */
export async function fetchStoreOrders(): Promise<ApiSuccess<StoreOrder[]>> {
  const res = await http.get('/store/orders')
  return res as unknown as ApiSuccess<StoreOrder[]>
}
/**
 * 获取商店订单详情
 */
export async function fetchStoreOrderByNumber(
  orderNumber: string
): Promise<ApiSuccess<StoreOrder>> {
  const res = await http.get(`/store/orders/${encodeURIComponent(orderNumber)}`)
  return res as unknown as ApiSuccess<StoreOrder>
}
/**
 * 获取商店商品列表
 */
export async function fetchStoreItems(): Promise<ApiSuccess<StoreItemEntry[]>> {
  const res = await http.get('/store/items')
  return res as unknown as ApiSuccess<StoreItemEntry[]>
}

function normalizePaymentMethod(price: StorePrice): PaymentMethod {
  const name = price?.assetName?.toLowerCase?.() || ''
  if (price.assetId === 4 || name === 'star') return 'star'
  if (price.assetId === 5 || name === 'ton' || name === 'toncoin') return 'ton'
  if (price.assetId === 7 || name === 'usdc') return 'usdc'
  return 'other'
}

function normalizePublicPath(path?: string, fallback = ''): string {
  if (!path) return fallback
  if (/^https?:\/\//i.test(path)) return path
  const cleaned = path.replace(/^\/?public\//, '').replace(/^\/+/, '')
  return `/${cleaned}`
}

function formatPrice(price: StorePrice): FormattedStorePrice {
  const amount = Number(price?.amount ?? 0)
  const paymentMethod = normalizePaymentMethod(price)
  return {
    ...price,
    amount: Number.isFinite(amount) ? amount : 0,
    paymentMethod,
    label: price?.assetName || `Asset ${price?.assetId ?? ''}`,
    assetIcon: normalizePublicPath(price?.assetIcon || ''),
  }
}

export function formatStoreItems(
  storeItems?: StoreItems
): FormattedStoreItem[] {
  if (!storeItems || typeof storeItems !== 'object') return []

  const items: FormattedStoreItem[] = []

  Object.entries(storeItems).forEach(([itemType, entries]) => {
    if (!Array.isArray(entries)) return
    entries.forEach(entry => {
      const prices = Array.isArray(entry.prices)
        ? entry.prices.map(formatPrice).filter(p => Number.isFinite(p.amount))
        : []

      items.push({
        id: `${entry.itemType || itemType}-${entry.itemId}`,
        itemId: entry.itemId,
        itemType: entry.itemType || itemType,
        title:
          entry.itemName || `${entry.itemType || itemType} ${entry.itemId}`,
        description: entry.description || itemType,
        icon: normalizePublicPath(
          entry.iconPath,
          '/stores/AutomaticCollector/primary.svg'
        ),
        prices,
        properties: Array.isArray(entry.properties) ? entry.properties : [],
      })
    })
  })

  return items
}

function pickStarPrice(prices?: FormattedStorePrice[]): number | null {
  if (!Array.isArray(prices)) return null
  const star = prices.find(p => p.paymentMethod === 'star') || null
  if (!star) return null
  const amount = Number(star.amount)
  return Number.isFinite(amount) ? amount : null
}

function pickPriceByMethod(
  prices: FormattedStorePrice[],
  method: PaymentMethod
): FormattedStorePrice | null {
  return prices.find(p => p.paymentMethod === method) || null
}

function formatItemsForPayment(
  storeItems: StoreItems | undefined,
  method: PaymentMethod
): StarPayProduct[] {
  const formatted = formatStoreItems(storeItems)

  return formatted.reduce<StarPayProduct[]>((acc, item) => {
    const priceEntry = pickPriceByMethod(item.prices, method)
    if (!priceEntry) return acc
    acc.push({
      id: item.id,
      itemId: item.itemId,
      title: item.title,
      description: item.description,
      price: Number(priceEntry.amount),
      icon: item.icon,
      paymentMethod: method,
      assetLabel: priceEntry.label,
      assetIcon: priceEntry.assetIcon,
    })
    return acc
  }, [])
}

export function formatStoreItemsForStarPay(
  storeItems?: StoreItems
): StarPayProduct[] {
  const formatted = formatStoreItems(storeItems)

  return formatted.reduce<StarPayProduct[]>((acc, item) => {
    const price = pickStarPrice(item.prices)
    if (price === null) return acc
    acc.push({
      id: item.id,
      itemId: item.itemId,
      title: item.title,
      description: item.description,
      price,
      icon: item.icon,
      paymentMethod: 'star',
    })
    return acc
  }, [])
}

export function formatStoreItemsForTonPay(
  storeItems?: StoreItems
): TonPayProduct[] {
  return formatItemsForPayment(storeItems, 'ton')
}

export function formatStoreItemsForUsdcPay(
  storeItems?: StoreItems
): UsdcPayProduct[] {
  return formatItemsForPayment(storeItems, 'usdc')
}

export type FormattedStorePayload = {
  assetRedemption: AssetRedemption | null
  storeItems: StoreItems
  items: FormattedStoreItem[]
}

/**
 * 获取商店中心数据（格式化）
 */
export async function fetchFormattedStore(): Promise<FormattedStorePayload> {
  const res = await http.get<ApiSuccess<StoreCenterData> | StoreCenterData>(
    '/store'
  )

  const data = res as unknown as
    | ApiSuccess<StoreCenterData>
    | StoreCenterData
    | null

  const payload =
    (data as ApiSuccess<StoreCenterData>)?.data ||
    (data as StoreCenterData | null)

  const storeItems: StoreItems =
    payload?.storeItems ||
    (data as unknown as { storeItems?: StoreItems }).storeItems ||
    {}

  const assetRedemption: AssetRedemption | null =
    payload?.assetRedemption ||
    (data as unknown as { assetRedemption?: AssetRedemption | null })
      .assetRedemption ||
    null

  return {
    assetRedemption: assetRedemption ?? null,
    storeItems,
    items: formatStoreItems(storeItems),
  }
}

/**
 * 获取 Stars 支付产品列表
 */
export async function fetchStarPayProducts(): Promise<StarPayProduct[]> {
  const { storeItems } = await fetchFormattedStore()

  return formatStoreItemsForStarPay(storeItems)
}

/**
 * 获取 Ton 支付产品列表
 */
export async function fetchTonPayProducts(): Promise<TonPayProduct[]> {
  const { storeItems } = await fetchFormattedStore()

  return formatStoreItemsForTonPay(storeItems)
}

/**
 * 获取 USDC 支付产品列表
 */
export async function fetchUsdcPayProducts(): Promise<UsdcPayProduct[]> {
  const { storeItems } = await fetchFormattedStore()

  return formatStoreItemsForUsdcPay(storeItems)
}

/**
 * 提交商店购买订单 （Stars 支付）
 */
export async function submitStorePurchase(
  payload: PurchaseSubmitRequest
): Promise<ApiSuccess<StoreOrder>> {
  const res = await http.post('/store/purchase/submit', payload)
  return res as unknown as ApiSuccess<StoreOrder>
}

/**
 * 请求 Stars 支付订单发票
 */
export async function requestStarPurchaseInvoice(
  payload: StarInvoiceRequest
): Promise<StarInvoiceResult> {
  const itemId = Number(payload?.itemId)
  const quantity = Number(payload?.quantity)

  if (!Number.isFinite(itemId)) {
    throw new Error('itemId is required')
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive number')
  }

  const token = typeof window === 'undefined' ? null : getAccessToken()
  if (!token) {
    throw new Error('Missing access token, please login first')
  }

  const baseUrl = (http.defaults?.baseURL || '/api/proxy').replace(/\/$/, '')
  const url = `${baseUrl}/store/purchase/star/invoice`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [AUTH_HEADER]: token.startsWith(BEARER_PREFIX)
      ? token
      : `${BEARER_PREFIX}${token}`,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      itemId,
      quantity: Math.max(1, Math.floor(quantity)),
    }),
  })

  const data = (await response
    .json()
    .catch(() => null)) as StarInvoiceResponse | null

  if (!response.ok) {
    const message =
      data?.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  const code = data?.code
  const success =
    data?.success === true ||
    code === 'SUCCESS' ||
    code === 200 ||
    code === 0 ||
    code === '200'

  const payloadData =
    (data?.data as StarInvoiceResponseData | undefined) ||
    (data as unknown as StarInvoiceResponseData | undefined) ||
    {}

  const invoiceLink =
    payloadData?.invoiceLink ||
    (payloadData as Record<string, unknown>)?.invoice_link ||
    data?.invoiceLink ||
    (data as Record<string, unknown>)?.invoice_link

  if (!success && !invoiceLink) {
    throw new Error(data?.message || 'Failed to submit order')
  }

  if (!invoiceLink || typeof invoiceLink !== 'string') {
    throw new Error('No invoice link returned')
  }

  return { ...payloadData, invoiceLink }
}

/**
 * 提交商店资产兑换订单
 */
export async function submitStoreExchange(
  payload: ExchangeRequest
): Promise<ApiSuccess<AssetRedemption>> {
  const res = await http.post('/store/exchange', payload)
  return res as unknown as ApiSuccess<AssetRedemption>
}
