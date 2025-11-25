'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  requestStarPurchaseInvoice,
  type StarInvoiceResult,
} from '@/utils/api/store/api'

type Product = {
  id: string
  itemId: number
  title: string
  description: string
  price: number
  icon: string
}

type BannerState =
  | { type: 'idle'; message: '' }
  | { type: 'success' | 'error'; message: string }

function getTelegramWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

const PRODUCTS: Product[] = [
  {
    id: 'collector-primary',
    itemId: 5,
    title: 'Primary Collector',
    description: 'Entry-level auto collector',
    price: 60,
    icon: '/stores/AutomaticCollector/primary.svg',
  },
  {
    id: 'collector-intermediate',
    itemId: 6,
    title: 'Intermediate Collector',
    description: 'Faster collection speed',
    price: 180,
    icon: '/stores/AutomaticCollector/intermediate.svg',
  },
  {
    id: 'collector-advanced',
    itemId: 7,
    title: 'Advanced Collector',
    description: 'Enhanced efficiency boost',
    price: 350,
    icon: '/stores/AutomaticCollector/advanced.svg',
  },
  {
    id: 'collector-super',
    itemId: 8,
    title: 'Super Collector',
    description: 'Top-tier auto collection power',
    price: 700,
    icon: '/stores/AutomaticCollector/super.svg',
  },
]

export default function TelegramStarPay() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [banner, setBanner] = useState<BannerState>({
    type: 'idle',
    message: '',
  })

  const handlePurchase = async (product: Product) => {
    setActiveId(product.id)
    setBanner({ type: 'idle', message: '' })

    try {
      const webApp = getTelegramWebApp()
      const tgOpenInvoice = webApp?.openInvoice
      const tgOpenLink = webApp?.openTelegramLink || webApp?.openLink
      if (!tgOpenInvoice && !tgOpenLink) {
        throw new Error(
          'Please open this page inside Telegram to pay with Stars.'
        )
      }

      const invoice: StarInvoiceResult = await requestStarPurchaseInvoice({
        itemId: product.itemId,
        quantity: 1,
      })

      const invoiceLink = invoice.invoiceLink
      if (!invoiceLink) {
        throw new Error('No invoice link received from server.')
      }

      setBanner({
        type: 'success',
        message: 'Invoice created, opening Telegram payment sheet...',
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
            'Opening Telegram to complete payment. After paying, backend will place the order automatically.',
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
          {PRODUCTS.map(product => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-2xl bg-white shadow-sm border border-gray-100 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner overflow-hidden">
                  <Image
                    src={product.icon}
                    alt={product.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-[#2f3a4a]">
                    {product.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Item #{product.itemId} | Quantity 1 | Est. {product.price}{' '}
                    XTR
                  </div>
                </div>
              </div>
              <button
                onClick={() => handlePurchase(product)}
                disabled={activeId === product.id}
                className="flex items-center gap-2 rounded-xl bg-[#5fb5f7] px-4 py-2 text-white font-semibold shadow-md transition hover:brightness-105 active:translate-y-[1px] disabled:opacity-70"
              >
                <span className="text-sm leading-none">
                  {activeId === product.id ? 'Sending...' : 'Send order'}
                </span>
              </button>
            </div>
          ))}
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
