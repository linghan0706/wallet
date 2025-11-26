'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { TonConnectButton } from '@tonconnect/ui-react'
import { toNano } from '@ton/core'
import { useWallet } from '@/features/wallet'
import {
  requestStarPurchaseInvoice,
  type StarInvoiceResult,
  type FormattedStoreItem,
  fetchFormattedStore,
  type PaymentMethod,
} from '@/utils/api/store/api'

type BannerState =
  | { type: 'idle'; message: '' }
  | { type: 'success' | 'error'; message: string }

const STAR_LABEL = 'XTR (Telegram Stars)'
const TON_PAYMENT_ADDRESS =
  process.env.NEXT_PUBLIC_TON_PAYMENT_ADDRESS ||
  process.env.NEXT_PUBLIC_TON_TREASURY_ADDRESS ||
  ''
const USDC_PAYMENT_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_PAYMENT_ADDRESS ||
  process.env.NEXT_PUBLIC_U_PAYMENT_ADDRESS ||
  ''

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

function shorten(value?: string | null, head = 4, tail = 4) {
  if (!value) return ''
  if (value.length <= head + tail + 3) return value
  return `${value.slice(0, head)}...${value.slice(-tail)}`
}

function formatAmount(amount?: number) {
  if (amount === undefined || amount === null) return '—'
  return amount >= 1000 ? amount.toLocaleString() : `${amount}`
}

function getPriceByMethod(item: FormattedStoreItem, method: PaymentMethod) {
  return item.prices.find(price => price.paymentMethod === method)
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
        ? `已连接 · ${shorten(wallet.address, 6, 6)}`
        : '未连接 TON 钱包',
    [hasWalletConnection, wallet.address]
  )

  const selectedPaymentAddress =
    selectedMethod === 'ton' ? TON_PAYMENT_ADDRESS : USDC_PAYMENT_ADDRESS

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
        message: '当前支付方式暂不可用，请切换其他方式。',
      })
      return
    }

    if (!hasWalletConnection) {
      setBanner({
        type: 'error',
        message: '请先通过 WalletConnect 连接 TON 钱包。',
      })
      return
    }

    if (!paymentAddress) {
      setBanner({
        type: 'error',
        message: '商户收款地址未配置，请联系管理员补充环境变量。',
      })
      return
    }

    setActiveId(item.id)
    setBanner({ type: 'idle', message: '' })

    try {
      if (method === 'usdc') {
        setBanner({
          type: 'success',
          message: `钱包已连接，请向 ${shorten(
            paymentAddress,
            6,
            6
          )} 转入 ${price.amount} ${price.label} 并在链上确认。`,
        })
        return
      }

      const amount = toNano(price.amount.toString()).toString()
      const result = await wallet.sendTransaction({
        to: paymentAddress,
        amount,
        comment: `Store item #${item.itemId} · ${price.label}`,
      })

      if (result?.success) {
        setBanner({
          type: 'success',
          message: `已提交 TON 支付至 ${shorten(
            paymentAddress,
            4,
            6
          )}，等待链上确认后会生成订单。`,
        })
      } else {
        throw new Error(result?.error || 'TON 支付未完成')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '链上支付失败，请稍后再试。'
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
    <div className="min-h-screen bg-gradient-to-b from-[#050b15] via-[#0b172a] to-[#0f1f33] text-white px-3 sm:px-4 py-5 pb-16 flex justify-center">
      <div className="w-full max-w-xl space-y-4 sm:space-y-5">
        <div className="rounded-3xl bg-gradient-to-br from-white/5 via-white/5 to-white/0 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Telegram · Web3 Checkout
              </p>
              <h1 className="text-xl sm:text-2xl font-semibold leading-tight mt-1">
                星球商店 · Stars / TON / U
              </h1>
              <p className="text-sm text-white/70 mt-1.5 sm:mt-2 leading-relaxed">
                为移动端优化的快速支付体验，支持 Telegram Stars 与 WalletConnect
                链上支付。
              </p>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-white/10 text-xs text-white/80">
              Mobile Ready
            </div>
          </div>

          <div className="mt-4">
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:gap-2 sm:overflow-visible sm:px-0 sm:mx-0">
              {paymentOptions.map(option => {
                const isActive = selectedMethod === option.key
                return (
                  <button
                    key={option.key}
                    onClick={() => setSelectedMethod(option.key)}
                    className={`relative overflow-hidden rounded-2xl border border-white/10 px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-w-[150px] sm:min-w-0 snap-center ${
                      isActive
                        ? 'shadow-lg shadow-black/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${option.accent} opacity-60 ${
                        isActive ? 'visible' : 'invisible'
                      }`}
                      aria-hidden
                    />
                    <div className="relative space-y-1">
                      <div className="text-[11px] uppercase tracking-wide text-white/70">
                        {option.badge}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-semibold">
                          {option.label}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-white shadow" />
                        )}
                      </div>
                      <p className="text-xs text-white/70 leading-snug">
                        {option.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="text-xs text-white/60 uppercase tracking-wide">
                  WalletConnect
                </div>
                <div className="text-sm font-semibold">{walletLabel}</div>
                <div className="text-xs text-white/60">
                  网络: {wallet.network === 'testnet' ? 'Testnet' : 'Mainnet'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TonConnectButton />
                {!hasWalletConnection && (
                  <button
                    onClick={wallet.connect}
                    disabled={wallet.isConnecting}
                    className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition disabled:opacity-60"
                  >
                    {wallet.isConnecting ? '连接中…' : '一键连接'}
                  </button>
                )}
              </div>
            </div>
            {selectedPaymentAddress && (
              <div className="mt-3 text-xs text-white/60">
                收款地址: {shorten(selectedPaymentAddress, 6, 6)}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70">选择商品并提交支付</div>
              <div className="text-lg font-semibold">
                支持 {paymentOptions.find(p => p.key === selectedMethod)?.label}
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
              移动端友好
            </div>
          </div>

          {loadingProducts &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="h-[104px] rounded-2xl bg-white/10 border border-white/5 animate-pulse"
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
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/0 p-3.5 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-base font-semibold">
                            {item.title}
                          </div>
                          <div className="text-sm text-white/70">
                            {item.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-2 py-1 rounded-full bg-white/10 text-[11px] text-white/70">
                            #{item.itemId}
                          </div>
                          <div className="px-2 py-1 rounded-full bg-white/10 text-[11px] text-white/70 capitalize">
                            {methodLabel || '当前方式'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1 text-sm">
                          <div className="text-white/60">支付金额</div>
                          <div className="font-semibold text-lg">
                            {priceLabel}
                          </div>
                        </div>
                        <button
                          onClick={() => handlePay(item)}
                          disabled={isProcessing || !price}
                          className="w-full sm:w-auto min-w-[150px] rounded-xl bg-gradient-to-r from-[#5b8dff] to-[#6fddff] text-[#0a152a] font-semibold py-3 px-4 shadow-lg shadow-black/25 transition hover:brightness-110 active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
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
        </div>

        {banner.type !== 'idle' && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm border ${
              banner.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-100 border-emerald-500/30'
                : 'bg-red-500/10 text-red-100 border-red-500/40'
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
