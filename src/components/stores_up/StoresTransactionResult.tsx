'use client'

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
  const isEmpty = !items || items.length === 0
  const safeIndex = Math.min(
    Math.max(activeIndex, 0),
    Math.max(items.length - 1, 0)
  )
  const current = isEmpty ? undefined : items[safeIndex]

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="relative flex flex-col items-center justify-between p-4 sm:p-6 bg-[url('/stores/storeupback.png')] bg-cover bg-center rounded-[12px] w-[90vw] max-w-[520px] h-[60vh] max-h-[420px] border border-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
    >
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
          <div className="w-[317px] h-[300px] sm:w-[360px] sm:h-[320px] rounded-[12px] border border-white/10 bg-white/10 animate-pulse" />
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
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 w-full flex-1">
          {/* 顶部标题 */}
          <p className="mt-2 font-jersey-25 text-[22px] sm:text-[24px] leading-[26px] text-center">
            {current.title}
          </p>

          {/* 中间插图（静态演示图） */}
          <Image
            src="/stores/AutomaticCollector/super.svg"
            alt="reward"
            width={200}
            height={200}
            className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
          />

          {/* 底部结果按钮样式 */}
          {current.name === 'Payment successful' ? (
            <div className="mt-2 w-[80%] sm:w-[70%] h-[48px] rounded-[12px] bg-[linear-gradient(156.71deg,#84D947_2.78%,#39A740_99.22%)] flex items-center justify-center gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 15l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7Z"
                  fill="#fff"
                />
              </svg>
              <span className="font-roboto font-medium text-[16px]">
                Payment successful
              </span>
            </div>
          ) : (
            <div className="mt-2 w-[80%] sm:w-[70%] h-[48px] rounded-[12px] bg-[linear-gradient(156.71deg,#F43F4E_2.78%,#DF253C_99.22%)] flex items-center justify-center gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59Z"
                  fill="#fff"
                />
              </svg>
              <span className="font-roboto font-medium text-[16px]">
                Payment failed
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
