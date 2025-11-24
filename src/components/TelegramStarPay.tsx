'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  requestStarPurchaseInvoice,
  type StarInvoiceResponseData,
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

const PRODUCTS: Product[] = [
  {
    id: 'collector-primary',
    itemId: 101,
    title: 'Primary Collector',
    description: 'Entry-level auto collector',
    price: 1,
    icon: '/stores/AutomaticCollector/primary.svg',
  },
  {
    id: 'collector-intermediate',
    itemId: 102,
    title: 'Intermediate Collector',
    description: 'Faster collection speed',
    price: 3,
    icon: '/stores/AutomaticCollector/intermediate.svg',
  },
  {
    id: 'collector-advanced',
    itemId: 103,
    title: 'Advanced Collector',
    description: 'Enhanced efficiency boost',
    price: 5,
    icon: '/stores/AutomaticCollector/advanced.svg',
  },
  {
    id: 'collector-super',
    itemId: 104,
    title: 'Super Collector',
    description: 'Top-tier auto collection power',
    price: 8,
    icon: '/stores/AutomaticCollector/super.svg',
  },
]

function formatInvoiceMessage(invoice: StarInvoiceResponseData): string {
  const parts = [`Status: ${invoice.status || 'UNKNOWN'}`]

  if (invoice.totalAmount && invoice.currency) {
    parts.push(`Total: ${invoice.totalAmount} ${invoice.currency}`)
  }
  if (invoice.chatId) parts.push(`Chat ID: ${invoice.chatId}`)
  if (invoice.messageId) parts.push(`Message ID: ${invoice.messageId}`)

  return parts.join(' | ')
}

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
      const invoice = await requestStarPurchaseInvoice({
        itemId: product.itemId,
        quantity: 1,
      })

      setBanner({
        type: 'success',
        message: `Order submitted. The invoice will be sent via Telegram. ${formatInvoiceMessage(invoice)}`,
      })
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
