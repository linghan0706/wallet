'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { processStarPayment } from '@/utils/StarPay'
import { initializeTelegramApp } from '@/telegramWebApp/telegrambot'

type Product = {
  id: string
  title: string
  description: string
  price: number
  icon: string
  assetId: number
}

type BannerState =
  | { type: 'idle'; message: '' }
  | { type: 'success' | 'error'; message: string }

export default function TelegramStarPay() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isTelegramReady, setIsTelegramReady] = useState(false)
  const [banner, setBanner] = useState<BannerState>({
    type: 'idle',
    message: '',
  })

  {
    /**道具配置信息 */
  }
  const products: Product[] = useMemo(
    () => [
      {
        id: 'collector-primary',
        title: 'Primary Collector',
        description: 'Entry-level auto collector',
        price: 1,
        icon: '/stores/AutomaticCollector/primary.svg',
        assetId: 2001,
      },
      {
        id: 'collector-intermediate',
        title: 'Intermediate Collector',
        description: 'Faster collection speed',
        price: 3,
        icon: '/stores/AutomaticCollector/intermediate.svg',
        assetId: 2002,
      },
      {
        id: 'collector-advanced',
        title: 'Advanced Collector',
        description: 'Enhanced efficiency boost',
        price: 5,
        icon: '/stores/AutomaticCollector/advanced.svg',
        assetId: 2003,
      },
      {
        id: 'collector-super',
        title: 'Super Collector',
        description: 'Top-tier auto collection power',
        price: 8,
        icon: '/stores/AutomaticCollector/super.svg',
        assetId: 2004,
      },
    ],
    []
  )

  useEffect(() => {
    const app = initializeTelegramApp()
    if (app) {
      setIsTelegramReady(true)
      return
    }

    // Telegram injects WebApp after script load; retry briefly in case it is late to attach.
    const retryTimer = setInterval(() => {
      const readyApp = initializeTelegramApp()
      if (readyApp) {
        setIsTelegramReady(true)
        clearInterval(retryTimer)
      }
    }, 300)

    return () => clearInterval(retryTimer)
  }, [])

  const handlePurchase = async (product: Product) => {
    if (!isTelegramReady) {
      setBanner({
        type: 'error',
        message: '请在 Telegram Mini App 中打开以完成 Star 支付',
      })
      return
    }

    setActiveId(product.id)
    setBanner({ type: 'idle', message: '' })

    try {
      const record = await processStarPayment({
        amount: product.price,
        assetId: product.assetId,
        description: product.description,
        payload: product.id,
      })

      setBanner({
        type: 'success',
        message: `${product.title} 订单已提交，状态：${record.status}`,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Star 支付失败，请稍后重试'
      setBanner({ type: 'error', message })
    } finally {
      setActiveId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1f2a36] px-4 py-8 flex justify-center">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-6">
          <span className="text-2xl">✨</span>
          <span>Star 商店</span>
        </div>

        <div className="mb-3 text-lg font-semibold text-[#1f2a36]">
          可用商品
        </div>

        <div className="space-y-3">
          {products.map(product => (
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
                </div>
              </div>
              <button
                onClick={() => handlePurchase(product)}
                disabled={activeId === product.id}
                className="flex items-center gap-2 rounded-xl bg-[#5fb5f7] px-4 py-2 text-white font-semibold shadow-md transition hover:brightness-105 active:translate-y-[1px] disabled:opacity-70"
              >
                <span className="text-base leading-none">{product.price}</span>
                <span className="text-lg leading-none">⭐</span>
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
