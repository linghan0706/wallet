'use client'

import { PaymentResult as TonPaymentResult } from './ton'
import { PaymentResult as UsdcPaymentResult } from './usdc'
import http from '@/utils/http'

export type PaymentMethod = 'ton' | 'usdc' | 'star'

export type OrderPayload = {
  itemId: number
  paymentMethod: PaymentMethod
  txHash?: string
  payer?: string | null
  payee?: string
  // 实际在链上发生的支付金额（前端/钱包返回）
  amount?: number
  // 以下字段来自后端 `/api/store` 返回的价格配置（可选）
  assetId?: number
  assetName?: string
  assetIcon?: string
  // 后端配置的面额（用于与链上实际支付金额对比/记录）
  listedAmount?: number
}

type PriceInfo = {
  assetId: number
  assetName: string
  assetIcon?: string
  amount: number
}

type BasicItem = { id: number; prices?: PriceInfo[] }

export function toOrderPayload(
  res: TonPaymentResult | UsdcPaymentResult,
  item: BasicItem,
  method: PaymentMethod
): OrderPayload {
  const prices = Array.isArray(item.prices) ? item.prices : undefined

  // 匹配后端配置中的资产名（不区分大小写），例如 'Ton'/'Usdc'/'Star'
  const targetName = method?.toLowerCase()
  const matched = prices?.find(
    p => String(p.assetName || '').toLowerCase() === targetName
  )

  return {
    itemId: item.id,
    paymentMethod: method,
    txHash: res.txHash,
    payer: res.from ?? null,
    payee: res.to,
    amount: res.amount,
    assetId: matched?.assetId,
    assetName: matched?.assetName,
    assetIcon: matched?.assetIcon,
    listedAmount: matched?.amount,
  }
}

// 请求后端记录/查询订单的封装
export type SubmitPurchaseResult = {
  success: boolean
  orderId?: number | string
  message?: string
  [key: string]: unknown
}

/**
 * 提交钱包支付信息到后端 `/api/store/purchase/submit`
 * 会将常见字段映射为后端预期的字段名。返回解析后的 JSON。
 */
export async function submitPurchase(
  payload: OrderPayload & { quantity?: number }
): Promise<SubmitPurchaseResult> {
  const body = {
    itemId: payload.itemId,
    assetId: payload.assetId,
    quantity: payload.quantity ?? 1,
    // 保证后端接收大写形式（例如 "TON"/"U"/"STAR"）
    paymentMethod: String(payload.paymentMethod || '').toUpperCase(),
    transactionHash: payload.txHash,
    walletAddress: payload.payer,
    rawTransactionData: {},
  }

  try {
    // 使用项目统一的 http 实例（会自动添加 Authorization header）
    const res = await http.post('/store/purchase/submit', body)
    return res as unknown as SubmitPurchaseResult
  } catch (err) {
    // 保持与之前相似的错误信息格式
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`submitPurchase failed: ${message}`)
  }
}

/**
 * 请求后端生成 Telegram Stars 发票：`POST /api/store/purchase/star/invoice`
 * 返回后端原始响应（通常包含 invoiceLink 等信息）。
 */
export async function requestStarInvoice(
  itemId: number,
  quantity = 1
): Promise<unknown> {
  try {
    const res = await http.post('/store/purchase/star/invoice', {
      itemId,
      quantity: Math.max(1, Math.floor(quantity)),
    })
    return res
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`requestStarInvoice failed: ${message}`)
  }
}

/**
 * 查询当前用户的订单列表：`GET /api/store/orders`
 */
export async function fetchOrders(): Promise<unknown> {
  try {
    const res = await http.get('/store/orders')
    return res as unknown
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`fetchOrders failed: ${message}`)
  }
}

/**
 * 查询单个订单详情：`GET /api/store/orders/{id}`
 */
export async function fetchOrder(id: number | string): Promise<unknown> {
  try {
    const res = await http.get(`/store/orders/${id}`)
    return res as unknown
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`fetchOrder failed: ${message}`)
  }
}
