import http from '../../http'

{
  /**Store基础类型定义*/
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
  assetRedemption: AssetRedemption
  storeItems: StoreItems
}
export type ApiSuccess<T> = {
  success: boolean
  data: T
  message: string
  timestamp: number
}

/**商店订单*/
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
  /**购买订单号查询*/
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

{
  /**资产兑换*/
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
 * 根据订单号查询商店订单
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

/**
 * 提交商店购买订单
 */
export async function submitStorePurchase(
  payload: PurchaseSubmitRequest
): Promise<ApiSuccess<StoreOrder>> {
  const res = await http.post('/store/purchase/submit', payload)
  return res as unknown as ApiSuccess<StoreOrder>
}

/**
 * 资产兑换
 */
export async function submitStoreExchange(
  payload: ExchangeRequest
): Promise<ApiSuccess<AssetRedemption>> {
  const res = await http.post('/store/exchange', payload)
  return res as unknown as ApiSuccess<AssetRedemption>
}
