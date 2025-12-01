'use client'

import { DEFAULT_NETWORK } from '@/lib/ton-config'
import { payWithTon } from './ton'
import { payWithUsdc } from './usdc'

type PaymentNetwork = 'mainnet' | 'testnet'

const readEnv = (value?: string | null) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : ''
}

export const paymentConfig = {
  defaultNetwork: DEFAULT_NETWORK as PaymentNetwork,
  tonPaymentAddress:
    readEnv(process.env.NEXT_PUBLIC_TON_PAYMENT_ADDRESS) ||
    readEnv(process.env.NEXT_PUBLIC_TON_TREASURY_ADDRESS),
  usdcPaymentAddress:
    readEnv(process.env.NEXT_PUBLIC_USDC_PAYMENT_ADDRESS) ||
    readEnv(process.env.NEXT_PUBLIC_U_PAYMENT_ADDRESS),
  usdcJettonMaster: readEnv(process.env.NEXT_PUBLIC_USDC_JETTON_MASTER),
  usdcJettonGasTon:
    readEnv(process.env.NEXT_PUBLIC_USDC_JETTON_GAS_TON) || '0.05',
  usdcDecimals:
    Number.parseInt(readEnv(process.env.NEXT_PUBLIC_USDC_DECIMALS), 10) || 6,
} as const

export { payWithTon, payWithUsdc }
export type { PaymentNetwork }
export {
  submitPurchase,
  requestStarInvoice,
  fetchOrders,
  fetchOrder,
} from './order'
