'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import { useBackpackModalStore } from '@/stores/backpackModalStore'
import { useItemFlowStore } from '@/stores/backpackItemFlowStore'
import Question from './Question'

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
  const { openDetail } = useItemFlowStore()
  const title = item?.name ?? 'Item'
  const imageSrc = item?.iconPath ?? '/backpack/StageProgress.svg'
  const [activeAction, setActiveAction] = useState<'give' | 'sell' | 'use'>(
    'use'
  )
  const [showQuestion, setShowQuestion] = useState(false)
  const helpButtonRef = useRef<HTMLButtonElement>(null)

  const buttonBase =
    'w-[90px] h-[25px] rounded-[4px] font-jersey-10 text-[16px] leading-[20px] transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30'

  return (
    <>
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
            ref={helpButtonRef}
            type="button"
            title="help"
            className="absolute right-3 top-3 w-[10px] h-[10px] flex items-center justify-center"
            onClick={() => setShowQuestion(!showQuestion)}
          >
            <Image
              src={
                showQuestion
                  ? '/backpack/Question/question_active.svg'
                  : '/backpack/Question/question_inactive.svg'
              }
              alt="help"
              width={10}
              height={10}
              className="w-[10px] h-[10px] object-contain"
            />
          </button>
        </div>
        <div className="relative z-10 flex-1 w-full flex items-center justify-center">
          <div className="relative w-[150px] h-[150px]">
            <div className="absolute w-[128px] h-[150px] left-[11px] top-0 rounded-[12px] overflow-hidden">
              {/* 渐变边框，使用遮罩使内部保持透明 */}
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

              {/* 实际内容层（与 StoresTransactionCard 结构匹配） */}
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
                {/* 资产底部光影效果 */}
                <div className="w-[100px] h-[6px] rounded-[12px]">
                  <Image
                    src="/backpack/FooterShaw.png"
                    alt="资产底部光影"
                    width={100}
                    height={6}
                    className="w-full h-full object-contain"
                  />
                </div>
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
              if (item) {
                openDetail(item, 'sell')
              }
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
              if (item) {
                openDetail(item, 'use')
              }
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

      {/* Question 组件覆盖层*/}
      {showQuestion &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[50] flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowQuestion(false)}
            />
            <div onClick={e => e.stopPropagation()}>
              <Question />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default NoseSection
