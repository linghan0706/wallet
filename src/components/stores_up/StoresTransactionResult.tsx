'use client'

import { useState } from 'react'
import Image from 'next/image'

type TransactionName = 'Payment successful' | 'Payment failed'

interface TransactionResultItem {
  name: TransactionName
  title: string
}

interface StoresTransactionResultProps {
  items?: TransactionResultItem[]
  activeIndex?: number
  loading?: boolean
  error?: string
  onClose?: () => void
}

const defaultResults: TransactionResultItem[] = [
  { name: 'Payment successful', title: 'Viewable in the backpack' },
  { name: 'Payment failed', title: 'Contact customer service' },
]

export default function StoresTransactionResult({
  items = defaultResults,
  activeIndex = 0,
  loading = false,
  error,
  onClose,
}: StoresTransactionResultProps) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex)

  const isEmpty = !items || items.length === 0
  const safeIndex = Math.min(
    Math.max(currentIndex, 0),
    Math.max(items.length - 1, 0)
  )
  const current = isEmpty ? undefined : items[safeIndex]
  const isSuccess = current?.name === 'Payment successful'
  const bgImage = isSuccess
    ? "url('/stores/StoreSuccessBackground.png')"
    : "url('/stores/StoreFailBackground.png')"
  const iconSrc = isSuccess
    ? '/stores/result/succee.png'
    : '/stores/result/fail.png'
  const actionLabel = isSuccess ? 'Continue' : 'Retry'
  const subtitle =
    current?.title ||
    (isSuccess ? 'Viewable in the backpack' : 'Chat With Support')

  // 切换成功/失败状态
  const toggleStatus = () => {
    setCurrentIndex((prev: number) => (prev === 0 ? 1 : 0))
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="relative flex flex-col items-center justify-between p-4 sm:p-6 rounded-[12px] w-[317px] h-[360px] border border-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden"
      style={{
        backgroundImage: bgImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_60%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* 关闭按钮 */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center"
      >
        <span className="text-xl">×</span>
      </button>

      {/* 加载态 */}
      {loading && (
        <div className="flex flex-1 w-full h-full items-center justify-center">
          <div className="w-full h-full rounded-[12px] border border-white/10 bg-white/10 animate-pulse" />
        </div>
      )}

      {/* 错误态 */}
      {!loading && error && (
        <div className="flex flex-1 w-full h-full items-center justify-center">
          <div className="text-center">
            <p className="font-roboto font-medium text-[18px]">Error</p>
            <p className="mt-2 font-roboto text-[14px] text-[#E4E4E4]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* 空态 */}
      {!loading && !error && isEmpty && (
        <div className="flex flex-1 w-full h-full items-center justify-center">
          <div className="text-center">
            <p className="font-roboto font-medium text-[18px]">
              No transaction result
            </p>
            <p className="mt-2 font-roboto text-[14px] text-[#E4E4E4]">
              Please try again later.
            </p>
          </div>
        </div>
      )}

      {/* 正常展示 */}
      {!loading && !error && !isEmpty && current && (
        <div className="flex flex-col items-center justify-between w-full h-full pt-8 pb-6 relative z-10">
          {/* 添加切换按钮 */}
          <button
            onClick={toggleStatus}
            className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Toggle Status
          </button>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col justify-center items-center p-0 w-[128px] h-[150px] box-border bg-[url('/stores/payiconbackground.png')] bg-cover rounded-[12px]">
              <div className="w-[126px] h-[148px] box-border rounded-[12px] flex items-center justify-center">
                <Image
                  src={iconSrc}
                  alt={current.name}
                  width={100}
                  height={100}
                  priority
                />
              </div>
              <div
                className="w-[100px] h-[6px] rounded-[12px]"
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(0, 240, 255, 0.25) 20%, rgba(26, 26, 64, 0.25) 75%, rgba(0, 102, 255, 0.25) 100%)',
                }}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="font-jersey-10 text-[22px] leading-[24px]">
                {current.name}
              </p>
              <p className="font-jersey-15 text-[14px] leading-[18px] text-white/80">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            className="absolute w-[180px] h-[30px] rounded-[8px] font-jersey-10 text-[18px] leading-[22px] text-center text-white transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
            style={{
              left: 'calc(50% - 180px/2 + 1.5px)',
              top: 'calc(50% - 30px/2 + 122px)',
              background: isSuccess
                ? 'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(25, 223, 153, 0.8) 24.84%, rgba(38, 214, 101, 0.8) 74.51%, rgba(44, 209, 76, 0.8) 86.92%, rgba(50, 205, 50, 0.8) 99.34%)'
                : 'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(128, 120, 128, 0.8) 49.67%, rgba(191, 60, 64, 0.8) 74.51%, rgba(223, 30, 32, 0.8) 86.92%, rgba(255, 0, 0, 0.8) 99.34%)',
              boxShadow: isSuccess
                ? '0px 1px 1px #32CD32, 0px -1px 1px #00F0FF, inset 0px 1px 1px #32CD32, inset 0px -1px 1px #00F0FF'
                : '0px 1px 1px #FF0000, 0px -1px 1px #00F0FF, inset 0px 1px 1px #FF0000, inset 0px -1px 1px #00F0FF',
              textShadow: isSuccess
                ? '1px 1px 3px #32CD32'
                : '0px 1px 1px #FF0000',
            }}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}
