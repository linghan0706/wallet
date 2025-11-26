'use client'

import { PaymentResult as TonPaymentResult } from './ton'
import { PaymentResult as UsdcPaymentResult } from './usdc'

export type PaymentMethod = 'ton' | 'usdc' | 'star'

export type OrderPayload = {
  itemId: number
  paymentMethod: PaymentMethod
  txHash?: string
  payer?: string | null
  payee?: string
  amount?: number
}

type BasicItem = { id: number }

export function toOrderPayload(
  res: TonPaymentResult | UsdcPaymentResult,
  item: BasicItem,
  method: PaymentMethod
): OrderPayload {
  return {
    itemId: item.id,
    paymentMethod: method,
    txHash: res.txHash,
    payer: res.from ?? null,
    payee: res.to,
    amount: res.amount,
  }
}
