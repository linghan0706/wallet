'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useWallet } from '@/hooks/useWallet'
import {
  requestStarPurchaseInvoice,
  type StarInvoiceResult,
  type FormattedStoreItem,
  fetchFormattedStore,
  type PaymentMethod,
} from '@/utils/api/store/api'
import { payWithTon, payWithUsdc, paymentConfig } from '@/utils/payment'
import { formatAddress } from '@/utils/format'

type BannerState =
  | { type: 'idle'; message: '' }
  | { type: 'success' | 'error'; message: string }

const {
  defaultNetwork,
  tonPaymentAddress: TON_PAYMENT_ADDRESS,
  usdcPaymentAddress: USDC_PAYMENT_ADDRESS,
  usdcJettonMaster: USDC_JETTON_MASTER,
  usdcJettonGasTon: USDC_JETTON_GAS_TON,
  usdcDecimals: USDC_DECIMALS,
} = paymentConfig

const paymentOptions: {
  key: PaymentMethod
  label: string
  badge: string
  accent: string
  chip: string
  description: string
}[] = [
  {
    key: 'star',
    label: 'Stars',
    badge: 'Telegram',
    accent: 'from-[#5b8dff] via-[#6ec1ff] to-[#a9d8ff]',
    chip: 'bg-white/10 text-[#e3edff]',
    description: '一键打开小程序支付，不跳转。',
  },
  {
    key: 'ton',
    label: 'TON',
    badge: 'WalletConnect',
    accent: 'from-[#3c8ce7] via-[#00b7ff] to-[#00f2ff]',
    chip: 'bg-white/10 text-[#d5f0ff]',
    description: '通过 TonConnect 调起钱包完成链上支付。',
  },
  {
    key: 'usdc',
    label: 'U (USDC)',
    badge: 'WalletConnect',
    accent: 'from-[#6e7bff] via-[#9d6bff] to-[#ff8ec7]',
    chip: 'bg-white/10 text-[#f9e8ff]',
    description: '稳定币支付，适合跨境用户。',
  },
]

function getTelegramWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

function formatAmount(amount?: number) {
  if (amount === undefined || amount === null) return '—'
  return amount >= 1000 ? amount.toLocaleString() : `${amount}`
}

function getPriceByMethod(item: FormattedStoreItem, method: PaymentMethod) {
  return item.prices.find(price => price.paymentMethod === method)
}

function formatJettonBalance(
  balance?: string | null,
  decimals: number = 6
): string {
  if (!balance) return '0'
  try {
    const bi = BigInt(balance)
    const factor = BigInt(10) ** BigInt(Math.max(0, decimals))
    const whole = bi / factor
    const frac = (bi % factor)
      .toString()
      .padStart(decimals, '0')
      .replace(/0+$/, '')
    return frac ? `${whole.toString()}.${frac}` : whole.toString()
  } catch {
    return '0'
  }
}

function formatTonBalance(balance?: string | null) {
  if (!balance) return null
  try {
    const nano = BigInt(balance)
    const ton = Number(nano) / 1e9
    if (!Number.isFinite(ton)) return null
    return ton.toFixed(3)
  } catch {
    return null
  }
}

export default function TelegramStarPay() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [banner, setBanner] = useState<BannerState>({
    type: 'idle',
    message: '',
  })
  const [items, setItems] = useState<FormattedStoreItem[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('star')
  const wallet = useWallet()

  const [usdcBalance, setUsdcBalance] = useState<string | null>(null)
  const [usdcJettonWallet, setUsdcJettonWallet] = useState<string | null>(null)
  const [usdcBalanceLoading, setUsdcBalanceLoading] = useState(false)
  const [usdcBalanceError, setUsdcBalanceError] = useState<string | null>(null)
  const formattedTonBalance = useMemo(
    () => formatTonBalance(wallet.balance),
    [wallet.balance]
  )

  useEffect(() => {
    let mounted = true

    const loadProducts = async () => {
      setLoadingProducts(true)
      setProductError(null)
      try {
        const { items } = await fetchFormattedStore()
        if (mounted) {
          setItems(items)
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to load store items. Please try again.'
        if (mounted) {
          setProductError(message)
        }
      } finally {
        if (mounted) {
          setLoadingProducts(false)
        }
      }
    }

    loadProducts()

    return () => {
      mounted = false
    }
  }, [])

  const hasWalletConnection = wallet.isConnected
  const walletLabel = useMemo(
    () =>
      hasWalletConnection
        ? `已连接 · ${formatAddress(wallet.address ?? '')}`
        : '未连接 TON 钱包',
    [hasWalletConnection, wallet.address]
  )

  const selectedPaymentAddress =
    selectedMethod === 'ton' ? TON_PAYMENT_ADDRESS : USDC_PAYMENT_ADDRESS

  const fetchUsdcBalance = useCallback(async (userAddress: string) => {
    if (!paymentConfig.usdcJettonMaster) {
      setUsdcBalance(null)
      setUsdcJettonWallet(null)
      return
    }
    setUsdcBalanceLoading(true)
    setUsdcBalanceError(null)
    try {
      const params = new URLSearchParams({
        user: userAddress,
        jetton: paymentConfig.usdcJettonMaster,
      })
      const res = await fetch(`/api/get-jetton-balance?${params.toString()}`)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to fetch USDC balance')
      }
      const data = (await res.json()) as {
        balance?: string
        jettonWalletAddress?: string
        error?: string
      }
      if (data.error) {
        throw new Error(data.error)
      }
      setUsdcBalance(data.balance ?? null)
      setUsdcJettonWallet(data.jettonWalletAddress ?? null)
    } catch (error) {
      setUsdcBalance(null)
      setUsdcJettonWallet(null)
      setUsdcBalanceError(
        error instanceof Error ? error.message : 'Failed to fetch USDC balance'
      )
    } finally {
      setUsdcBalanceLoading(false)
    }
  }, [])

  useEffect(() => {
    if (
      selectedMethod === 'usdc' &&
      wallet.isConnected &&
      wallet.address &&
      paymentConfig.usdcJettonMaster
    ) {
      fetchUsdcBalance(wallet.address)
    } else {
      setUsdcBalance(null)
      setUsdcJettonWallet(null)
    }
  }, [
    selectedMethod,
    wallet.isConnected,
    wallet.address,
    fetchUsdcBalance,
    paymentConfig.usdcJettonMaster,
  ])

  const handleStarPayment = async (item: FormattedStoreItem) => {
    setActiveId(item.id)
    setBanner({ type: 'idle', message: '' })

    const starPrice = getPriceByMethod(item, 'star')
    if (!starPrice) {
      setBanner({
        type: 'error',
        message: '当前商品暂不支持 Stars 支付。',
      })
      setActiveId(null)
      return
    }

    try {
      const webApp = getTelegramWebApp()
      const tgOpenInvoice = webApp?.openInvoice
      const tgOpenLink = webApp?.openTelegramLink || webApp?.openLink

      const invoice: StarInvoiceResult = await requestStarPurchaseInvoice({
        itemId: item.itemId,
        quantity: 1,
      })

      const invoiceLink = invoice.invoiceLink
      if (!invoiceLink) {
        throw new Error('No invoice link received from server.')
      }

      setBanner({
        type: 'success',
        message: '账单已生成，正在调起 Telegram Stars (XTR) 支付…',
      })

      if (tgOpenInvoice) {
        await new Promise<void>((resolve, reject) => {
          try {
            tgOpenInvoice(invoiceLink, result => {
              const status = result?.status || 'unknown'
              if (status === 'paid') {
                setBanner({
                  type: 'success',
                  message:
                    '支付完成！后台会自动创建订单，可稍后在订单列表查看状态。',
                })
              } else if (status === 'pending') {
                setBanner({
                  type: 'success',
                  message: '支付处理中，确认后会自动创建订单。',
                })
              } else if (status === 'cancelled') {
                setBanner({
                  type: 'error',
                  message: '支付已取消。',
                })
              } else if (status === 'failed') {
                setBanner({
                  type: 'error',
                  message: '支付失败，请重试。',
                })
              } else {
                setBanner({
                  type: 'error',
                  message: `账单状态：${status}`,
                })
              }
              resolve()
            })
          } catch (err) {
            reject(
              err instanceof Error
                ? err
                : new Error('Failed to open invoice in Telegram.')
            )
          }
        })
      } else if (tgOpenLink) {
        tgOpenLink(invoiceLink)
        setBanner({
          type: 'success',
          message: '已跳转至 Telegram 支付 Stars，支付后订单会自动创建。',
        })
      } else {
        window.location.href = invoiceLink
        setBanner({
          type: 'success',
          message: '正在打开支付页。如未能自动调起，请在 Telegram 内重试。',
        })
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to submit order. Please try again.'
      setBanner({ type: 'error', message })
    } finally {
      setActiveId(null)
    }
  }

  const handleOnChainPayment = async (
    item: FormattedStoreItem,
    method: PaymentMethod
  ) => {
    const price = getPriceByMethod(item, method)
    const paymentAddress =
      method === 'ton' ? TON_PAYMENT_ADDRESS : USDC_PAYMENT_ADDRESS

    if (!price) {
      setBanner({
        type: 'error',
        message:
          'Selected payment method is unavailable. Please choose another.',
      })
      return
    }

    if (!hasWalletConnection) {
      setBanner({
        type: 'error',
        message: 'Please connect your TON wallet via WalletConnect first.',
      })
      return
    }

    if (!paymentAddress) {
      setBanner({
        type: 'error',
        message: 'Payment address is not configured. Please contact support.',
      })
      return
    }

    if (method === 'usdc' && !USDC_JETTON_MASTER) {
      setBanner({
        type: 'error',
        message: 'USDC jetton master is not configured.',
      })
      return
    }

    setActiveId(item.id)
    setBanner({ type: 'idle', message: '' })

    try {
      if (method === 'usdc') {
        const result = await payWithUsdc({
          wallet,
          amount: price.amount,
          paymentAddress,
          jettonMaster: USDC_JETTON_MASTER,
          gasTon: USDC_JETTON_GAS_TON,
          decimals: USDC_DECIMALS,
          itemId: item.itemId,
          label: price.label,
          expectedNetwork: defaultNetwork,
        })

        if (result.success) {
          setBanner({
            type: 'success',
            message: `USDC payment submitted${
              result.txHash
                ? ` (tx: ${formatAddress(result.txHash, 6, 6)})`
                : ''
            }. Waiting for confirmation.`,
          })
        } else {
          throw new Error(result.error || 'USDC payment failed')
        }
        return
      }

      const tonResult = await payWithTon({
        wallet,
        amount: price.amount,
        paymentAddress,
        itemId: item.itemId,
        label: price.label,
        comment: `Store item #${item.itemId} - ${price.label}`,
      })

      if (tonResult.success) {
        setBanner({
          type: 'success',
          message: `Submitted TON payment to ${formatAddress(
            paymentAddress,
            4,
            6
          )}${tonResult.txHash ? ` (tx: ${formatAddress(tonResult.txHash, 6, 6)})` : ''}. Waiting for confirmation.`,
        })
      } else {
        throw new Error(tonResult.error || 'TON payment not sent')
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'On-chain payment failed, please try again.'
      setBanner({ type: 'error', message })
    } finally {
      setActiveId(null)
    }
  }

  const handlePay = (item: FormattedStoreItem) => {
    if (selectedMethod === 'star') {
      return handleStarPayment(item)
    }
    return handleOnChainPayment(item, selectedMethod)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b15] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(99,149,255,0.26),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,141,226,0.2),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(74,222,128,0.15),transparent_32%)]" />
      </div>

      <div className="relative mx-auto flex max-w-[620px] flex-col gap-4 px-4 pb-16 pt-7 sm:px-6">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                Telegram x Web3 Checkout
              </p>
              <h1 className="text-2xl font-semibold leading-tight">
                移动端优化的 Stars / TON / U 收银台
              </h1>
              <p className="text-sm leading-relaxed text-white/70">
                为移动端优化的快速结算体验，支持 Telegram Stars 与 WalletConnect
                链上支付
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs text-white/80">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Mobile Ready
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Touch 优化
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
              <div className="text-xs text-white/60">网络</div>
              <div className="font-semibold">
                {wallet.network === 'testnet' ? 'Testnet' : 'Mainnet'}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
              <div className="text-xs text-white/60">TON Balance</div>
              <div className="font-semibold">
                {wallet.balanceLoading
                  ? 'Fetching...'
                  : formattedTonBalance
                    ? `${formattedTonBalance} TON`
                    : 'Unknown'}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
              <div className="text-xs text-white/60">当前方式</div>
              <div className="font-semibold">
                {paymentOptions.find(p => p.key === selectedMethod)?.label}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_14px_48px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                支付选项
              </div>
              <p className="text-sm text-white/70">
                点击或横滑切换支付方式，移动端同样顺滑
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
              {paymentOptions.find(p => p.key === selectedMethod)?.label}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {paymentOptions.map(option => {
              const isActive = selectedMethod === option.key
              return (
                <button
                  key={option.key}
                  onClick={() => setSelectedMethod(option.key)}
                  className={`group relative overflow-hidden rounded-2xl border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    isActive
                      ? 'border-white/40 bg-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.35)]'
                      : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.accent} transition-opacity ${
                      isActive
                        ? 'opacity-70'
                        : 'opacity-0 group-hover:opacity-40'
                    }`}
                    aria-hidden
                  />
                  <div className="relative flex items-start gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="text-[11px] uppercase tracking-wide text-white/70">
                        {option.badge}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {option.label}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-white shadow" />
                        )}
                      </div>
                      <p className="text-xs text-white/75 leading-snug">
                        {option.description}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border border-white/10 px-2 py-1 text-[11px] ${option.chip}`}
                    >
                      {isActive ? '使用中' : '切换'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.35)] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                WalletConnect
              </div>
              <div className="text-sm text-white/80 leading-snug">
                {walletLabel}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TonConnectButton />
              {!hasWalletConnection && (
                <button
                  onClick={wallet.connect}
                  disabled={wallet.isConnecting}
                  className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-black/30 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {wallet.isConnecting ? '连接中…' : '一键连接'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs text-white/70 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <span className="text-white/50">网络</span>
              <span className="text-white">
                {wallet.network === 'testnet' ? 'Testnet' : 'Mainnet'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <span className="text-white/50">TON Balance</span>
              <span className="text-white">
                {wallet.balanceLoading
                  ? 'Fetching...'
                  : formattedTonBalance
                    ? `${formattedTonBalance} TON`
                    : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 sm:col-span-2">
              <span className="text-white/50">钱包地址</span>
              <span className="truncate text-white">
                {wallet.address
                  ? formatAddress(wallet.address, 6, 6)
                  : '未连接'}
              </span>
            </div>
            {selectedMethod === 'usdc' && paymentConfig.usdcJettonMaster && (
              <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">USDC</span>
                  <span className="text-white">
                    {usdcBalanceLoading
                      ? 'Fetching...'
                      : usdcBalanceError
                        ? 'Unavailable'
                        : `${formatJettonBalance(usdcBalance, USDC_DECIMALS)}${usdcJettonWallet ? ` · ${formatAddress(usdcJettonWallet, 4, 6)}` : ''}`}
                  </span>
                </div>
                {usdcBalanceError && (
                  <span className="text-[11px] text-red-200/80">
                    {usdcBalanceError}
                  </span>
                )}
              </div>
            )}
          </div>

          {selectedPaymentAddress && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
              收款地址: {formatAddress(selectedPaymentAddress, 6, 6)}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-sm text-white/70">选择商品并提交支付</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              支持 {paymentOptions.find(p => p.key === selectedMethod)?.label}
            </div>
          </div>

          {loadingProducts &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="h-[118px] rounded-2xl border border-white/5 bg-white/10 animate-pulse"
              />
            ))}

          {!loadingProducts && productError && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-inner">
              {productError}
            </div>
          )}

          {!loadingProducts && !productError && items.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              暂无可售商品。
            </div>
          )}

          {!loadingProducts &&
            items.map(item => {
              const price = getPriceByMethod(item, selectedMethod)
              const priceLabel = price
                ? `${formatAmount(price.amount)} ${price.label}`
                : '当前方式暂不支持'
              const methodLabel =
                paymentOptions.find(p => p.key === selectedMethod)?.label || ''
              const isProcessing = activeId === item.id

              return (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-white/10 bg-white/5 p-4 shadow-[0_12px_45px_rgba(0,0,0,0.32)]"
                >
                  <div className="flex gap-3">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="text-base font-semibold">
                            {item.title}
                          </div>
                          <div className="text-sm leading-snug text-white/70">
                            {item.description}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-1">
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/70">
                            #{item.itemId}
                          </span>
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/70 capitalize">
                            {methodLabel || '当前方式'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1 text-sm">
                          <div className="text-white/60">支付金额</div>
                          <div className="text-xl font-semibold">
                            {priceLabel}
                          </div>
                          {selectedMethod !== 'star' && (
                            <div className="text-[11px] text-white/60">
                              收款地址{' '}
                              {formatAddress(
                                selectedPaymentAddress || '',
                                4,
                                6
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handlePay(item)}
                          disabled={isProcessing || !price}
                          className="w-full rounded-xl bg-gradient-to-r from-[#5b8dff] to-[#6fddff] px-4 py-3 text-base font-semibold text-[#0a152a] shadow-lg shadow-black/25 transition hover:brightness-110 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[160px]"
                        >
                          {isProcessing
                            ? '处理中…'
                            : price
                              ? selectedMethod === 'star'
                                ? 'Stars 支付'
                                : '链上支付'
                              : '暂不支持'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </section>

        {banner.type !== 'idle' && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              banner.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                : 'border-red-500/40 bg-red-500/10 text-red-100'
            }`}
            role="status"
            aria-live="polite"
          >
            {banner.message}
          </div>
        )}
      </div>
    </div>
  )
}
