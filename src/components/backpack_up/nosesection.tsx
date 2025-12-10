'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useBackpackModalStore } from '@/stores/backpackModalStore'

type NoseSectionProps = {
  className?: string
  onGive?: () => void
  onSell?: () => void
  onUse?: () => void
}

const NoseSection: React.FC<NoseSectionProps> = ({
  className,
  onGive,
  onSell,
  onUse,
}) => {
  const { item } = useBackpackModalStore()
  const title = item?.name ?? 'Item'
  const imageSrc = item?.iconPath ?? '/backpack/StageProgress.svg'
  const [activeAction, setActiveAction] = useState<'give' | 'sell' | 'use'>(
    'use'
  )
  const buttonBase =
    'w-[90px] h-[25px] rounded-[4px] font-jersey-10 text-[16px] leading-[20px] transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30'

  return (
    <section
      className={[
        'relative w-[317px] h-[360px] rounded-[12px]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.35)]',
        'border border-white/10',
        'flex flex-col items-center justify-between overflow-hidden',
        className ?? '',
      ].join(' ')}
      aria-label={title}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-[12px]"
        style={{
          backgroundImage: 'url(/stores/storeupback.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full flex items-center justify-center pt-4 pb-1">
        <h2 className="font-jersey-10 text-white text-[28px] leading-[22px]">
          {title}
        </h2>
        <button
          type="button"
          title="help"
          className="absolute right-3 top-3 w-[22px] h-[22px] rounded-[6px] flex items-center justify-center border border-white/20"
        >
          <Image
            src="/backpack/question/question.png"
            alt="Help"
            width={10}
            height={10}
            className="w-[10px] h-[10px] object-contain"
            priority
          />
        </button>
      </div>
      <div className="relative z-10 flex-1 w-full flex items-center justify-center">
        <div className="relative w-[150px] h-[150px]">
          <div className="absolute w-[128px] h-[150px] left-[11px] top-0 rounded-[12px] overflow-hidden">
            {/* Gradient border, masked so inner remains transparent */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[12px]"
              style={{
                padding: '2px',
                background:
                  'linear-gradient(135deg, rgba(0, 240, 255, 0.8) 0%, rgba(94, 130, 255, 0.8) 30%, rgba(141, 74, 254, 0.8) 70%, rgba(188, 19, 254, 0.8) 100%)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                boxSizing: 'border-box',
              }}
              aria-hidden
            />

            {/* Actual content layer (matches StoresTransactionCard structure) */}
            <div className="relative h-full w-full flex flex-col items-center justify-center bg-[url('/stores/bg_item_Value\\ \\(Multi\\).png')] bg-cover bg-center rounded-[12px]">
              <div className="w-[126px] h-[148px] box-border rounded-[12px]">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={126}
                  height={148}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div
                className="w-[100px] h-[6px] rounded-[12px]"
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(0, 240, 255, 0.25) 20%, rgba(26, 26, 64, 0.25) 75%, rgba(0, 102, 255, 0.25) 100%)',
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full px-4 pb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveAction('give')
            onGive?.()
          }}
          className={[buttonBase, 'text-white'].join(' ')}
          style={{
            background:
              activeAction === 'give'
                ? 'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(94, 130, 255, 0.8) 24.84%, rgba(141, 74, 254, 0.8) 74.51%, rgba(165, 47, 254, 0.8) 86.92%, rgba(188, 19, 254, 0.8) 99.34%)'
                : 'linear-gradient(0deg, rgba(176, 176, 192, 0.5), rgba(176, 176, 192, 0.5)), linear-gradient(0deg, rgba(188, 19, 254, 0.2), rgba(188, 19, 254, 0.2)), rgba(0, 240, 255, 0.2)',
          }}
        >
          Give
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveAction('sell')
            onSell?.()
          }}
          className={[buttonBase, 'text-white'].join(' ')}
          style={{
            background:
              activeAction === 'sell'
                ? 'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(94, 130, 255, 0.8) 24.84%, rgba(141, 74, 254, 0.8) 74.51%, rgba(165, 47, 254, 0.8) 86.92%, rgba(188, 19, 254, 0.8) 99.34%)'
                : 'rgba(5, 5, 16, 0.8)',
          }}
        >
          Sell
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveAction('use')
            onUse?.()
          }}
          className={[
            buttonBase,
            'text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)]',
          ].join(' ')}
          style={{
            background:
              activeAction === 'use'
                ? 'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(94, 130, 255, 0.8) 24.84%, rgba(141, 74, 254, 0.8) 74.51%, rgba(165, 47, 254, 0.8) 86.92%, rgba(188, 19, 254, 0.8) 99.34%)'
                : 'rgba(5, 5, 16, 0.8)',
          }}
        >
          Use
        </button>
      </div>
    </section>
  )
}

export default NoseSection
