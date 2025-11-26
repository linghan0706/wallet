'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  requestStarPurchaseInvoice,
  type StarInvoiceResult,
  type FormattedStoreItem,
  fetchFormattedStore,
} from '@/utils/api/store/api'

type BannerState =
  | { type: 'idle'; message: '' }
  | { type: 'success' | 'error'; message: string }

const STAR_LABEL = 'XTR (Telegram Stars)'

function getTelegramWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
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

  const getStarPrice = (item: FormattedStoreItem) =>
    item.prices.find(p => p.paymentMethod === 'star')

  const handlePurchase = async (item: FormattedStoreItem) => {
    setActiveId(item.id)
    setBanner({ type: 'idle', message: '' })

    const starPrice = getStarPrice(item)
    if (!starPrice) {
      setBanner({
        type: 'error',
        message: 'This item is not available for Stars payment.',
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
        message:
          'Invoice created, opening Telegram Stars (XTR) payment sheet...',
      })

      // Prefer Telegram's invoice API; fall back to openLink if the method is unavailable.
      if (tgOpenInvoice) {
        await new Promise<void>((resolve, reject) => {
          try {
            tgOpenInvoice(invoiceLink, result => {
              const status = result?.status || 'unknown'
              if (status === 'paid') {
                setBanner({
                  type: 'success',
                  message:
                    'Payment completed! Backend will create the order automatically. You can check order status in the Orders list shortly.',
                })
              } else if (status === 'pending') {
                setBanner({
                  type: 'success',
                  message:
                    'Payment is pending. The backend will place the order automatically once confirmed.',
                })
              } else if (status === 'cancelled') {
                setBanner({
                  type: 'error',
                  message: 'Payment was cancelled.',
                })
              } else if (status === 'failed') {
                setBanner({
                  type: 'error',
                  message: 'Payment failed. Please try again.',
                })
              } else {
                setBanner({
                  type: 'error',
                  message: `Invoice status: ${status}`,
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
          message:
            'Opening Telegram to complete payment with Stars (XTR). After paying, backend will place the order automatically.',
        })
      } else {
        // Fallback for unexpected environments: navigate directly to the invoice link.
        window.location.href = invoiceLink
        setBanner({
          type: 'success',
          message:
            'Redirecting to payment. If payment does not open, please try again inside Telegram to pay with Stars (XTR).',
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

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1f2a36] px-4 py-8 flex justify-center">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-6">
          <span>Star Store</span>
        </div>

        <div className="mb-3 text-lg font-semibold text-[#1f2a36]">
          Select an item to send an invoice request
        </div>

        <div className="space-y-3">
          {loadingProducts &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="h-[92px] rounded-2xl bg-white shadow-sm border border-gray-100 px-4 py-3 animate-pulse"
              />
            ))}

          {!loadingProducts && productError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              {productError}
            </div>
          )}

          {!loadingProducts && !productError && items.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
              No store items available.
            </div>
          )}

          {!loadingProducts &&
            items.map(item => {
              const starPrice = getStarPrice(item)
              const priceLabel =
                starPrice?.amount !== undefined
                  ? `${starPrice.amount.toLocaleString()} ${STAR_LABEL}`
                  : 'Stars not supported'

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-white shadow-sm border border-gray-100 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner overflow-hidden">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-[#2f3a4a]">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Item #{item.itemId} | Quantity 1 | Est. {priceLabel}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.prices.map(price => (
                          <div
                            key={`${price.paymentMethod}-${price.assetId}`}
                            className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs text-[#2f3a4a] border border-slate-100"
                            title={price.label}
                          >
                            {price.assetIcon && (
                              <Image
                                src={price.assetIcon}
                                alt={price.label}
                                width={14}
                                height={14}
                                className="object-contain"
                              />
                            )}
                            <span>
                              {price.amount} {price.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={activeId === item.id || !starPrice}
                    className="flex items-center gap-2 rounded-xl bg-[#5fb5f7] px-4 py-2 text-white font-semibold shadow-md transition hover:brightness-105 active:translate-y-[1px] disabled:opacity-70"
                  >
                    <span className="text-sm leading-none">
                      {activeId === item.id
                        ? 'Sending...'
                        : starPrice
                          ? 'Send order'
                          : 'Stars unavailable'}
                    </span>
                  </button>
                </div>
              )
            })}
        </div>

        {banner.type !== 'idle' && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm ${
              banner.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100'
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
