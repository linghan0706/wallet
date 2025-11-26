'use client'

import { Address, beginCell, toNano } from '@ton/core'
import { tonApiConfig } from '@/lib/ton-config'

type WalletAdapter = {
  address?: string | null
  sendTransaction: (tx: {
    to: string
    amount: string
    comment?: string
    payload?: string
  }) => Promise<{ success: boolean; error?: string; hash?: string }>
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

function toJettonUnits(amount: number, decimals = 6): bigint {
  const factor = 10 ** Math.max(0, Math.min(decimals, 18))
  return BigInt(Math.round(amount * factor))
}

async function fetchJettonWalletAddress(
  owner: string,
  jettonMaster: string
): Promise<string | null> {
  if (!owner || !jettonMaster) return null
  try {
    const baseUrl = tonApiConfig.baseUrl.replace(/\/$/, '')
    const url = `${baseUrl}/v2/accounts/${owner}/jettons`
    const res = await fetch(url, {
      headers: tonApiConfig.apiKey
        ? { Authorization: `Bearer ${tonApiConfig.apiKey}` }
        : {},
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      balances?: Array<{
        jetton?: { address?: string }
        wallet_address?: string
      }>
    }
    const match = data.balances?.find(
      b => b.jetton?.address?.toLowerCase() === jettonMaster.toLowerCase()
    )
    const addr =
      match?.wallet_address ||
      (match?.jetton as unknown as { wallet_address?: string })?.wallet_address
    return addr || null
  } catch (error) {
    console.warn('Failed to fetch jetton wallet address', error)
    return null
  }
}

function buildJettonTransferBody(options: {
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
    .storeUint(0xf8a7ea5, 32)
    .storeUint(0, 64)
    .storeCoins(options.amount)
    .storeAddress(Address.parse(options.destination))
    .storeAddress(
      options.responseAddress ? Address.parse(options.responseAddress) : null
    )
    .storeMaybeRef(null)
    .storeCoins(toNano(options.forwardTonAmount || '0.02'))
    .storeMaybeRef(forwardPayload)
    .endCell()
}

export async function payWithUsdc({
  wallet,
  amount,
  paymentAddress,
  jettonMaster,
  gasTon = '0.05',
  decimals = 6,
  itemId,
  label,
}: UsdcPayParams): Promise<PaymentResult> {
  if (!wallet?.sendTransaction) {
    return { success: false, error: 'Wallet adapter unavailable' }
  }
  if (!wallet.address) {
    return { success: false, error: '未获取到钱包地址，请重新连接钱包' }
  }
  if (!paymentAddress) {
    return { success: false, error: 'USDC 收款地址未配置' }
  }
  if (!jettonMaster) {
    return { success: false, error: 'USDC jetton master 未配置' }
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'USDC 支付金额不合法' }
  }

  try {
    const jettonWalletAddress = await fetchJettonWalletAddress(
      wallet.address,
      jettonMaster
    )

    if (!jettonWalletAddress) {
      return {
        success: false,
        error: '未找到 USDC Jetton 钱包，请确认钱包内持有 USDC。',
      }
    }

    const jettonAmount = toJettonUnits(amount, decimals)
    const body = buildJettonTransferBody({
      amount: jettonAmount,
      destination: paymentAddress,
      responseAddress: wallet.address,
      forwardTonAmount: gasTon,
      comment:
        `Store item #${itemId ?? ''}${label ? ` · ${label}` : ''}`.trim(),
    })

    const result = await wallet.sendTransaction({
      to: jettonWalletAddress,
      amount: toNano(gasTon).toString(),
      payload: body.toBoc().toString('base64'),
    })

    if (!result?.success) {
      return { success: false, error: result?.error || 'USDC 支付未完成' }
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
      error: error instanceof Error ? error.message : 'USDC 支付失败',
    }
  }
}
