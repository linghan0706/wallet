'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// 结果状态类型（严格类型）
export type ResultStatus = 'success' | 'failed'

// 组件入参（严格类型定义）
export interface NoseSectionResultProps {
  /** 是否展示弹层；默认 true */
  open?: boolean
  /** 成功或失败状态 */
  status: ResultStatus
  /** 标题文案，未提供时按状态给默认值 */
  title?: string
  /** 额外描述文案（可选） */
  description?: string
  /** 主体图像（默认使用背包爆闪飞船） */
  imageSrc?: string
  /** 关闭弹层 */
  onClose?: () => void
  /** 帮助按钮（右上角问号） */
  onHelp?: () => void
  /** 成功态确认动作 */
  onConfirm?: () => void
  /** 失败态联系客户动作 */
  onContact?: () => void
  /** 自定义类名 */
  className?: string
}

const NoseSectionResult: React.FC<NoseSectionResultProps> = ({
  open = true,
  status,
  title,
  description,
  imageSrc = '/backpack/StageProgress.svg',
  onClose,
  onHelp,
  onConfirm,
  onContact,
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState<boolean>(open)

  useEffect(() => {
    setInternalOpen(open)
  }, [open])

  const handleClose = () => {
    if (onClose) onClose()
    else setInternalOpen(false)
  }

  const isSuccess = status === 'success'
  const computedTitle =
    title ?? (isSuccess ? 'Successfully Sold' : 'Sale Failed')

  // 成功/失败按钮样式与文案
  const actionLabel = isSuccess ? 'Confirm' : 'contact customer service'
  const actionGradient = isSuccess
    ? 'bg-[linear-gradient(156.71deg,#84D947_2.78%,#39A740_99.22%)]'
    : 'bg-[linear-gradient(156.71deg,#F43F4E_2.78%,#DF253C_99.22%)]'

  // 图标（不依赖外部资源，确保像素一致与可控）
  const IconCircleCheck = (
    <svg
      aria-hidden
      width={18}
      height={18}
      viewBox="0 0 18 18"
      className="flex-none"
    >
      <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="2" fill="none" />
      <path
        d="M5 9.5 L7.5 12 L13 6.5"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )

  const IconCircleClose = (
    <svg
      aria-hidden
      width={18}
      height={18}
      viewBox="0 0 18 18"
      className="flex-none"
    >
      <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="2" fill="none" />
      <path
        d="M6 6 L12 12 M12 6 L6 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )

  if (!internalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label={computedTitle}
      onClick={handleClose}
    >
      <section
        className={[
          'relative w-full max-w-[317px] h-[300px] rounded-[12px]',
          'shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
          'border border-white/10',
          'flex flex-col items-center',
          'bg-[#0F172B] overflow-hidden',
          className ?? '',
        ].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        {/* 背景层：星空卡面 */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/Popup/taskupback.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* 顶部标题与操作按钮 */}
        <div className="relative z-10 w-full flex items-center justify-center pt-4 pb-2">
          <h2 className="font-jersey-10 text-white text-[22px] leading-[22px]">
            {computedTitle}
          </h2>

          {/* 问号帮助按钮 */}
          <button
            type="button"
            title="help"
            onClick={onHelp}
            className="absolute right-[20px] top-3 w-[18px] h-[18px] rounded-[6px] flex items-center justify-center text-white"
          >
            <span className="text-[12px] leading-none">
              <Image
                src="/backpack/question/question.png"
                alt="Help"
                width={10}
                height={10}
                className="w-[10px] h-[10px] object-contain"
                priority
              />
            </span>
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute right-3 top-3 w-[22px] h-[22px] rounded-[6px] flex items-center justify-center bg-white/10 hover:bg-white/20 text-white"
          >
            ×
          </button>
        </div>

        {/* 中心展示图（爆闪飞船） */}
        <div className="relative z-10 flex-1 w-full flex items-center justify-center">
          <Image
            src={imageSrc}
            alt="Nose section result"
            width={160}
            height={160}
            className="object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
            priority
          />
        </div>

        {/* 底部主操作按钮 */}
        <div className="relative z-10 w-full px-4 pb-4">
          <button
            type="button"
            onClick={isSuccess ? onConfirm : onContact}
            className={[
              'w-full h-[36px] rounded-[12px]',
              'flex items-center justify-center gap-2 text-white',
              'font-jersey-10 text-[18px] leading-[22px]',
              actionGradient,
              'shadow-[0_4px_12px_rgba(0,0,0,0.25)]',
            ].join(' ')}
          >
            {isSuccess ? IconCircleCheck : IconCircleClose}
            {actionLabel}
          </button>

          {description && (
            <p className="mt-2 text-center text-[#E4E4E4] font-roboto text-[12px] leading-[18px]">
              {description}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default NoseSectionResult
