'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

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
  initialIndex = 0,
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

  //数量对应金额映射，根据名称派生；保持 item 结构严格为 name + icon 对
  const amountMap: Record<CurrencyName, number> = {
    Stars: 60,
    Ton: 0.2,
    USDC: 0.45,
  }

  const labelMap: Record<CurrencyName, string> = {
    Stars: 'STARS',
    Ton: 'TON',
    USDC: 'USDT',
  }

  const accentMap: Record<CurrencyName, string> = {
    Stars: '#FFC506',
    Ton: '#48BFF9',
    USDC: '#92D233',
  }

  const glowMap: Record<CurrencyName, string> = {
    Stars: '0px 0px 6px rgba(255, 197, 6, 0.9)',
    Ton: '0px 0px 6px rgba(72, 191, 249, 0.9)',
    USDC: '0px 0px 6px rgba(146, 210, 51, 0.9)',
  }

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex)
  const [quantity, setQuantity] = useState<number>(initialQuantity)
  const iconSrc = initialIconSrc || '/stores/AutomaticCollector/super.svg'

  const safeActiveIndex = Math.min(
    Math.max(activeIndex, 0),
    Math.max(items.length - 1, 0)
  )

  const active = useMemo(() => items[safeActiveIndex], [items, safeActiveIndex])

  const handleDec = () => setQuantity(q => Math.max(1, q - 1))
  const handleInc = () => setQuantity(q => Math.min(9999, q + 1))
  const handleConfirm = () => onConfirm?.(active.name, quantity)

  return (
    <div className="relative flex flex-col items-center gap-4 p-4 sm:p-6 w-[317px] h-[456.19px] text-white bg-[url('/stores/storeupbackground.png')] bg-cover bg-center shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      {/* 关闭按钮 */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8  flex items-center justify-center"
      >
        <Image src="/layout/close.png" alt="Close" width={8.75} height={8.75} />
      </button>

      {/* 支付标题 */}
      <h3 className="font-orbitron font-bold text-[15px] leading-[19px] text-center text-white tracking-[0.06em] uppercase [text-shadow:0px_0px_1px_#BC13FE]">
        PAYMENT
      </h3>
      {/* 道具支付图标容器*/}
      <div className="flex flex-col justify-center items-center p-0 w-[200px] h-[200px] box-border bg-[url('/GlobalBorder/store/item_background_icon.png')] bg-cover  mt-[5px]">
        <div className="w-full h-full box-border">
          <Image
            src={iconSrc}
            alt="item"
            width={200}
            height={200}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>
      {/* 数量选择器*/}
      <div className="flex items-center justify-center gap-3 mt-1 w-[200px] h-[23px]">
        <button
          onClick={handleDec}
          aria-label="Decrease"
          className="w-[23px] h-[23px] flex items-center justify-center bg-transparent"
        >
          <Image
            src="/currency/leftButton.svg"
            alt="Decrease"
            width={23}
            height={23}
          />
        </button>
        <span className="w-[112px] h-[23px] bg-[#B0B0C0] border-l-[1px] border-l-[#00F0FF] border-r-[1px] border-r-[#BC13FE] rounded-[1px] font-oxanium font-bold text-[18px] leading-[22px] text-center tracking-[0.04em] uppercase text-white">
          {quantity}
        </span>
        <button
          onClick={handleInc}
          aria-label="Increase"
          className="w-[23px] h-[23px] flex items-center justify-center bg-transparent"
        >
          <Image
            src="/currency/rightButton.svg"
            alt="Increase"
            width={23}
            height={23}
          />
        </button>
      </div>

      {/* 支付方式 */}
      <div className="flex flex-row items-stretch justify-center gap-4 w-full px-2">
        {items.map((c, idx) => {
          const isActive = idx === safeActiveIndex
          const amount = amountMap[c.name]
          const accent = accentMap[c.name]
          const displayLabel = labelMap[c.name]

          // 映射支付方式到对应的背景图片
          const getBackgroundImage = (name: CurrencyName) => {
            switch (name) {
              case 'Stars':
                return 'bg-[url("/stores/payment/star.png")]'
              case 'Ton':
                return 'bg-[url("/stores/payment/ton.png")]'
              case 'USDC':
                return 'bg-[url("/stores/payment/usdt.png")]'
              default:
                return 'bg-[url("/stores/payment/star.png")]'
            }
          }

          return (
            <button
              key={c.name}
              onClick={() => setActiveIndex(idx)}
              type="button"
              aria-pressed={isActive}
              className="group relative w-[91px] h-[80px] bg-[#0B0B17] transform-gpu transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
            >
              <Image
                src={(() => {
                  switch (c.name) {
                    case 'Stars':
                      return '/stores/payment/star.png'
                    case 'Ton':
                      return '/stores/payment/ton.png'
                    case 'USDC':
                      return '/stores/payment/usdt.png'
                    default:
                      return '/stores/payment/star.png'
                  }
                })()}
                alt=""
                width={91}
                height={80}
                className="absolute inset-0 z-0 object-cover pointer-events-none"
              />
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0) 45%, ${accent}B3 46%, ${accent}B3 100%)`,
                  }}
                />
              )}
              {!isActive && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05050F]/65 pointer-events-none">
                  <span
                    className="font-oxanium font-bold text-[14px] leading-[18px] tracking-[0.04em] text-center uppercase"
                    style={{ color: '#B0B0C0' }}
                  >
                    {displayLabel}
                  </span>
                </div>
              )}
              <div
                className={`relative z-10 w-[91px] h-[80px] ${
                  isActive
                    ? 'flex flex-col justify-between items-start px-2 pt-2 pb-1'
                    : 'flex items-center justify-center'
                }`}
              >
                {isActive ? (
                  <>
                    <div
                      className="font-oxanium font-bold text-[14px] leading-[100%] tracking-[0.08em] text-center uppercase w-full"
                      style={{
                        color: accent,
                        textShadow: glowMap[c.name],
                      }}
                    >
                      {displayLabel}
                    </div>
                    <div className="w-[75px] h-[40px] flex items-center justify-start gap-2 whitespace-nowrap select-none mt-[2px] bg-[#1A1A4099]">
                      <div className="w-[25px] h-[25px] flex items-center justify-center">
                        <Image
                          src={c.icon}
                          alt={c.name}
                          width={25}
                          height={25}
                        />
                      </div>
                      <span
                        className="font-oxanium font-bold text-[16px] leading-[100%] text-center uppercase tracking-[0.04em]"
                        style={{
                          color: '#FFFFFF',
                          textShadow: glowMap[c.name],
                        }}
                      >
                        {amount}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[75px] h-[40px] flex items-center justify-center mt-[10px] bg-[#1A1A4099]">
                      <div className="w-[25px] h-[25px] flex items-center justify-center">
                        <Image
                          src={c.icon}
                          alt={c.name}
                          width={25}
                          height={25}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* 支付 */}
      <button
        className="mt-auto w-[230px] h-[26px] text-white font-oxanium font-bold text-[14px] leading-[18px] bg-[url('/GlobalBorder/Global_Button.svg')] bg-cover bg-center uppercase"
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </div>
  )
}
