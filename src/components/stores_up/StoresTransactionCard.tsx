'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type CurrencyName = 'USDC' | 'Ton' | 'Stars'

interface CurrencyItem {
  name: CurrencyName
  icon: string
}

interface StoresTransactionCardProps {
  items?: CurrencyItem[]
  initialIndex?: number
  initialQuantity?: number
  onConfirm?: (selection: CurrencyName, quantity: number) => void
  initialIconSrc?: string
  onClose?: () => void
}

export default function StoresTransactionCard({
  items = [
    { name: 'Stars', icon: '/currency/stars.svg' },
    { name: 'Ton', icon: '/currency/ton.svg' },
    { name: 'USDC', icon: '/currency/usdc.svg' },
  ],
  initialIndex = 2,
  initialQuantity = 56,
  onConfirm,
  initialIconSrc,
  onClose,
}: StoresTransactionCardProps) {
  // 支付方式列表，保持结构严格为 name + icon 对
  // const paymentMethods = items.map((item) => ({
  //   name: item.name,
  //   icon: item.icon,
  // }))

  // 数量对应金额映射，根据名称派生；保持 item 结构严格为 name + icon 对
  const amountMap: Record<CurrencyName, number> = {
    Stars: 60,
    Ton: 0.2,
    USDC: 0.45,
  }

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex)
  const [quantity, setQuantity] = useState<number>(initialQuantity)
  const [iconSrc, setIconSrc] = useState<string>(
    initialIconSrc || '/stores/AutomaticCollector/super.svg'
  )

  // 同步传入的图标到状态
  useEffect(() => {
    if (initialIconSrc) setIconSrc(initialIconSrc)
  }, [initialIconSrc])

  const active = useMemo(
    () => items[Math.min(Math.max(activeIndex, 0), items.length - 1)],
    [activeIndex, items]
  )

  const handleDec = () => setQuantity(q => Math.max(1, q - 1))
  const handleInc = () => setQuantity(q => Math.min(9999, q + 1))
  const handleConfirm = () => onConfirm?.(active.name, quantity)

  return (
    <div className="relative flex flex-col items-center gap-4 p-4 sm:p-6 w-[317px] h-[456.19px] text-white rounded-[12px] border border-white/10 bg-[url('/stores/storeupback.png')] bg-cover bg-center shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      {/* 兑换关闭 */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white text-xl"
      >
        ×
      </button>

      {/* 道具支付标题 */}
      <h3 className="font-jersey-10 font-['Jersey_10'] font-normal text-xl leading-[22px] text-center text-white">
        Please select a payment method
      </h3>

      {/* 道具支付图标容器 */}
      <div className="flex flex-col justify-center items-center p-0 w-[128px] h-[150px] box-border bg-[url('/stores/payiconback.png')] bg-cover rounded-[12px] mt-[52px]">
        <div className="w-[126px] h-[148px] box-border rounded-[12px]">
          <Image src={iconSrc} alt="item" width={126} height={148} priority />
        </div>
        <div
          className="w-[100px] h-[6px] rounded-[12px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(0, 240, 255, 0.25) 20%, rgba(26, 26, 64, 0.25) 75%, rgba(0, 102, 255, 0.25) 100%)',
          }}
        />
      </div>

      {/* 数量选择器 */}
      <div
        className="flex items-center gap-3 mt-1 w-[100px] h-[22px] border-[#00F0FFCC] border-[1px] rounded-[8px]"
        style={{
          background:
            'linear-gradient(0deg, rgba(188, 19, 254, 0.2), rgba(188, 19, 254, 0.2)), rgba(0, 240, 255, 0.2)',
        }}
      >
        <button
          onClick={handleDec}
          aria-label="Decrease"
          className="w-7 h-7 flex items-center justify-center bg-transparent"
        >
          <Image
            src="/currency/leftButton.svg"
            alt="Decrease"
            width={6}
            height={22}
          />
        </button>
        <span className="font-jersey-10 font-bold text-[16px]">{quantity}</span>
        <button
          onClick={handleInc}
          aria-label="Increase"
          className="w-7 h-7 flex items-center justify-center bg-transparent"
        >
          <Image
            src="/currency/rightButton.svg"
            alt="Increase"
            width={6}
            height={22}
          />
        </button>
      </div>

      {/* 道具支付方式选项 */}
      <div className="flex flex-row items-stretch justify-center gap-4 w-full px-2">
        {items.map((c, idx) => {
          const isActive = idx === activeIndex
          const amount = amountMap[c.name]
          const activeBg =
            c.name === 'Stars'
              ? 'bg-[#FFC506]'
              : c.name === 'Ton'
                ? 'bg-[#48BFF9]'
                : 'bg-[#92D233]'
          const activeTextColor =
            c.name === 'Stars'
              ? 'text-[#FFC506]'
              : c.name === 'Ton'
                ? 'text-[#48BFF9]'
                : 'text-[#92D233]'
          const displayLabel = c.name === 'USDC' ? 'USDC' : c.name.toLowerCase()
          return (
            <button
              key={c.name}
              onClick={() => setActiveIndex(idx)}
              className={`group w-[91px] h-[64px] rounded-lg border border-white/10 flex flex-col justify-between items-start p-2 ${
                isActive
                  ? `${activeBg} text-[#1A1A1A]`
                  : 'bg-black/40 text-white'
              } transform-gpu transition-colors duration-200 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none`}
            >
              <div
                className={`text-[18px] font-jersey-10  leading-[14px] font-bold text-center w-full ${isActive ? 'text-[#141F23]' : 'text-[#606060]'}`}
              >
                {displayLabel}
              </div>
              <div
                className={`w-[75px] h-[34px] flex items-center justify-center gap-[4px] whitespace-nowrap select-none mt-[2px] rounded-[8px] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.35)] transform-gpu transition-colors duration-200 ease-out motion-reduce:transition-none ${isActive ? 'bg-[#141F23] hover:bg-[#1A2429] group-focus-visible:ring-2 group-focus-visible:ring-white/40 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#141F23]' : 'bg-[#0B171B] hover:bg-[#102027] group-focus-visible:ring-2 group-focus-visible:ring-white/40 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#0B171B]'} group-disabled:opacity-50 group-disabled:grayscale`}
              >
                <Image
                  className="shrink-0"
                  src={c.icon}
                  alt={c.name}
                  width={16}
                  height={16}
                />
                <span
                  className={`font-exo2 font-bold tabular-nums text-[14px] leading-[14px] align-middle text-center ${isActive ? activeTextColor : 'text-[#606060]'} transition-colors duration-150`}
                >
                  {amount}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* 支付 */}
      <button
        className="mt-auto w-[285px] h-[42px] rounded-[8px] text-white font-jersey-10 font-normal text-[18px] leading-[22px]"
        onClick={handleConfirm}
        style={{
          background:
            'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(188, 19, 254, 0.8) 99.34%)',
          boxShadow:
            '0px 1px 1px #BC13FE, 0px -1px 1px #00F0FF, inset 0px 1px 1px #BC13FE, inset 0px -1px 1px #00F0FF',
        }}
      >
        Confirm the transaction
      </button>
    </div>
  )
}
