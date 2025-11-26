'use client'

import { toNano } from '@ton/core'

type WalletAdapter = {
  address?: string | null
  sendTransaction: (tx: {
    to: string
    amount: string
    comment?: string
    payload?: string
  }) => Promise<{ success: boolean; error?: string; hash?: string }>
}

export type TonPayParams = {
  wallet: WalletAdapter
  amount: number
  paymentAddress: string
  itemId?: number
  label?: string
  comment?: string
}

export type PaymentResult = {
  success: boolean
  message?: string
  error?: string
  txHash?: string
  from?: string | null
  to?: string
  amount?: number
  network?: string
}

export async function payWithTon({
  wallet,
  amount,
  paymentAddress,
  itemId,
  label,
  comment,
}: TonPayParams): Promise<PaymentResult> {
  if (!wallet?.sendTransaction) {
    return { success: false, error: 'Wallet adapter unavailable' }
  }
  if (!wallet.address) {
    return {
      success: false,
      error: 'Wallet address is missing, please connect',
    }
  }
  if (!paymentAddress) {
    return { success: false, error: 'Missing TON payment address' }
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'Invalid TON payment amount' }
  }

  const memo =
    comment || `Store item #${itemId ?? ''}${label ? ` - ${label}` : ''}`.trim()

  try {
    const result = await wallet.sendTransaction({
      to: paymentAddress,
      amount: toNano(amount.toString()).toString(),
      comment: memo,
    })

    if (!result?.success) {
      return { success: false, error: result?.error || 'TON payment not sent' }
    }

    return {
      success: true,
      txHash: result.hash,
      from: wallet.address ?? null,
      to: paymentAddress,
      amount,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'TON payment failed',
    }
  }
}
