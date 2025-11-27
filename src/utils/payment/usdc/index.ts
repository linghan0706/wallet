'use client'

import { Address, beginCell, toNano } from '@ton/core'
import { DEFAULT_NETWORK } from '@/lib/ton-config'
import { createTonClient } from '@/lib/ton-client'
import { extractTransactionHash } from '@/utils'
import { getJettonWalletAddress, isActiveContract } from '../jetton'

type WalletAdapter = {
  address?: string | null
  network?: 'mainnet' | 'testnet' | string | null
  sendTransaction: (tx: {
    to: string
    amount: string
    comment?: string
    payload?: string
  }) => Promise<{
    success: boolean
    error?: string
    hash?: string
    data?: { boc?: string }
  }>
}

export type UsdcPayParams = {
  wallet: WalletAdapter
  amount: number
  paymentAddress: string
  jettonMaster: string
  gasTon?: string
  decimals?: number
  itemId?: number
  label?: string
  expectedNetwork?: 'mainnet' | 'testnet'
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

function normalizeRawAddress(address?: string | null): string | null {
  if (!address) return null
  try {
    return Address.parse(address).toRawString()
  } catch {
    return null
  }
}

function toFriendlyAddress(address?: string | Address | null): string | null {
  if (!address) return null
  try {
    if (typeof address === 'string') {
      const trimmed = address.trim()
      Address.parse(trimmed) // validate only
      return trimmed
    }
    return address.toString({
      bounceable: false,
      urlSafe: true,
    })
  } catch {
    return null
  }
}

function toJettonUnits(amount: number, decimals = 6): bigint {
  const factor = 10 ** Math.max(0, Math.min(decimals, 18))
  return BigInt(Math.round(amount * factor))
}

function toNumber(
  value: string | number | undefined,
  fallback: number
): number {
  const num = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(num) && (num as number) > 0
    ? (num as number)
    : fallback
}

function createJettonTransferPayload(options: {
  amount: bigint
  destination: string
  responseAddress?: string | null
  forwardTonAmount?: string
  comment?: string
}) {
  const forwardPayload =
    options.comment && options.comment.trim().length > 0
      ? beginCell().storeUint(0, 32).storeStringTail(options.comment).endCell()
      : null

  return beginCell()
    .storeUint(0xf8a7ea5, 32) // transfer op
    .storeUint(0, 64) // query id
    .storeCoins(options.amount)
    .storeAddress(Address.parse(options.destination))
    .storeAddress(
      options.responseAddress ? Address.parse(options.responseAddress) : null
    )
    .storeMaybeRef(null)
    .storeCoins(toNano(options.forwardTonAmount || '0.01')) // forward_ton_amount
    .storeMaybeRef(forwardPayload)
    .endCell()
}

export async function payWithUsdc({
  wallet,
  amount,
  paymentAddress,
  jettonMaster,
  gasTon = '0.1',
  decimals = 6,
  itemId,
  label,
  expectedNetwork,
}: UsdcPayParams): Promise<PaymentResult> {
  const normalizedWalletAddress = toFriendlyAddress(wallet?.address)
  if (!normalizedWalletAddress) {
    return { success: false, error: 'Wallet address is invalid or missing' }
  }

  const paymentAddr = toFriendlyAddress(paymentAddress)
  if (!paymentAddr) {
    return {
      success: false,
      error: 'USDC payment address is not configured correctly',
    }
  }

  const jettonMasterRaw = normalizeRawAddress(jettonMaster)

  if (!wallet?.sendTransaction) {
    return { success: false, error: 'Wallet adapter unavailable' }
  }
  if (!jettonMasterRaw) {
    return { success: false, error: 'USDC jetton master is not configured' }
  }
  const activeMaster = await isActiveContract(
    jettonMasterRaw,
    expectedNetwork ?? DEFAULT_NETWORK
  )
  if (!activeMaster) {
    return {
      success: false,
      error:
        'USDC jetton master is not active on this network. Please check testnet configuration.',
    }
  }
  if (
    expectedNetwork &&
    wallet.network &&
    wallet.network.toLowerCase() !== expectedNetwork
  ) {
    return {
      success: false,
      error: `USDC payments run on ${expectedNetwork}. Please switch your wallet network.`,
    }
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'Invalid USDC payment amount' }
  }

  const totalGasTon = toNumber(gasTon, 0.1)
  const forwardTonAmountStr = '0.01'

  try {
    const jettonWalletAddress =
      (await getJettonWalletAddress(
        normalizedWalletAddress,
        jettonMasterRaw,
        expectedNetwork ?? DEFAULT_NETWORK
      )) ?? null

    if (!jettonWalletAddress) {
      return {
        success: false,
        error:
          'No USDC jetton wallet found. Please ensure your wallet holds USDC.',
      }
    }

    const jettonAmount = toJettonUnits(amount, decimals)
    const body = createJettonTransferPayload({
      amount: jettonAmount,
      destination: paymentAddr,
      responseAddress: normalizedWalletAddress,
      forwardTonAmount: forwardTonAmountStr,
      comment:
        `Store item #${itemId ?? ''}${label ? ` - ${label}` : ''}`.trim(),
    })

    const result = await wallet.sendTransaction({
      to: jettonWalletAddress,
      amount: toNano(totalGasTon).toString(),
      payload: body.toBoc().toString('base64'),
    })

    if (!result?.success) {
      return { success: false, error: result?.error || 'USDC payment not sent' }
    }

    let txHash = result.hash
    if (!txHash) {
      const boc = (result as { data?: { boc?: string } })?.data?.boc
      if (boc) {
        try {
          txHash = extractTransactionHash(boc)
        } catch {
          txHash = undefined
        }
      }
    }

    return {
      success: true,
      txHash,
      from: normalizedWalletAddress,
      to: paymentAddr,
      amount,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `USDC payment failed: ${error.message}`
          : 'USDC payment failed',
    }
  }
}
