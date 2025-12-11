'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// 结果状态类型（严格类型）
export type ResultStatus = 'use-success' | 'sell-success' | 'fail'

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

/** 背包- nosesction 结果弹层 */
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

  const isSuccess = status === 'use-success' || status === 'sell-success'

  // 根据状态确定背景图片
  const getBackgroundImage = () => {
    switch (status) {
      case 'use-success':
        return '/backpack/result/success.png'
      case 'sell-success':
        return '/backpack/result/success.png'
      case 'fail':
        return '/backpack/result/fail.png'
      default:
        return '/backpack/result/success.png'
    }
  }

  // 根据状态获取配置信息
  const getStatusConfig = () => {
    switch (status) {
      case 'use-success':
        return {
          type_text: 'Used',
          result_text: 'Successfully!',
          description_text: 'EFFECTS ACTIVATED',
          result_shadow: '1px 1px 3px #32CD32',
          description_shadow: '1px 1px 3px #32CD32',
          result_top: '135px',
          description_top: '165px',
          result_font_size: '24px',
          description_font_size: '12px',
          result_height: '44px',
          description_height: '22px',
        }
      case 'sell-success':
        return {
          type_text: 'Sell',
          result_text: 'Successfully!',
          description_text: 'Viewable in the backpack',
          result_shadow: '1px 1px 3px #32CD32',
          description_shadow: '1px 1px 3px #32CD32',
          result_top: '135px',
          description_top: '165px',
          result_font_size: '24px',
          description_font_size: '12px',
          result_height: '44px',
          description_height: '22px',
        }
      case 'fail':
        return {
          type_text:
            status === 'fail'
              ? title?.includes('Sell')
                ? 'Sell'
                : 'Used'
              : '',
          result_text: 'Fail!',
          description_text: 'Chat With Support',
          result_shadow: '0px 1px 1px #FF0000',
          description_shadow: '0px 1px 1px #FF0000',
          result_top: '165px',
          description_top: '190px',
          result_font_size: '24px',
          description_font_size: '10px',
          result_height: '22px',
          description_height: '22px',
        }
      default:
        return {
          type_text: 'Used',
          result_text: 'Successfully!',
          description_text: 'EFFECTS ACTIVATED',
          result_shadow: '1px 1px 3px #32CD32',
          description_shadow: '1px 1px 3px #32CD32',
          result_top: '135px',
          description_top: '165px',
          result_font_size: '24px',
          description_font_size: '12px',
          result_height: '44px',
          description_height: '22px',
        }
    }
  }

  const backgroundImage = getBackgroundImage()
  const statusConfig = getStatusConfig()

  // 成功/失败按钮样式与文案
  const actionLabel = isSuccess ? 'Confirm' : 'contact customer service'
  const actionGradient = isSuccess
    ? 'bg-[linear-gradient(156.71deg,#84D947_2.78%,#39A740_99.22%)]'
    : 'bg-[linear-gradient(156.71deg,#F43F4E_2.78%,#DF253C_99.22%)]'

  if (!internalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <section
        className={[
          'relative w-full max-w-[317px] h-[360px] rounded-[12px]',
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
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* 顶部标题 */}
        <div className="relative z-10 w-full flex items-center justify-center pt-4 pb-2">
          <h2 className="font-jersey-10 text-white text-[20px] leading-[22px] text-show-[]">
            Nose Section
          </h2>
        </div>

        {/* 状态返回 */}
        <div className="relative z-10 flex-1 w-full flex items-center rounded-[12px] justify-center">
          {/* 渐变边框容器 */}
          <div
            className="relative w-[200px] h-[100px] rounded-[12px] flex items-center justify-center backdrop-blur-[1px] bg-[rgba(5,5,16,0.3)] border border-white/10"
            style={{
              boxSizing: 'border-box',
            }}
          >
            {/* 渐变边框遮罩：让渐变只留在边框区域 */}
            <div
              className="absolute inset-0 rounded-[12px] pointer-events-none"
              style={{
                padding: '5px',
                background:
                  'linear-gradient(136.39deg, #00F0FF 8.54%, rgba(255, 255, 255, 0) 30.01%, rgba(255, 255, 255, 0) 72.95%, #BC13FE 94.42%)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                boxSizing: 'border-box',
              }}
            />

            {/* 内容容器 */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-3">
              {/* 结果文字 */}
              <div
                className="font-jersey-10 text-white text-center flex flex-col items-center"
                style={{
                  fontSize: statusConfig.result_font_size,
                  lineHeight: '22px',
                  textShadow: statusConfig.result_shadow,
                  fontFamily: "'Jersey 10'",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  maxWidth: '100%',
                }}
              >
                {statusConfig.type_text && (
                  <span>{statusConfig.type_text}</span>
                )}
                <span>{statusConfig.result_text}</span>
              </div>

              {/* 描述文字 */}
              <div
                className="font-jersey-10 text-white text-center"
                style={{
                  fontSize: statusConfig.description_font_size,
                  lineHeight: '22px',
                  textShadow: statusConfig.description_shadow,
                  fontFamily: "'Jersey 10'",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  maxWidth: '100%',
                  marginTop: '4px',
                }}
              >
                {statusConfig.description_text}
              </div>
            </div>
          </div>
        </div>

        {/* 底部主操作按钮 */}
        <div className="relative z-10 w-full px-4 pb-4 flex justify-center">
          <button
            type="button"
            onClick={isSuccess ? onConfirm : onContact}
            className={`relative w-[180px] h-[30px] rounded-[4px] flex items-center justify-center text-white font-jersey-10 text-[18px] leading-[22px] overflow-hidden
              ${
                isSuccess
                  ? 'bg-[linear-gradient(98.64deg,rgba(0,240,255,0.8)_0%,rgba(25,223,153,0.8)_24.84%,rgba(38,214,101,0.8)_74.51%,rgba(44,209,76,0.8)_86.92%,rgba(50,205,50,0.8)_99.34%)] shadow-[0px_1px_1px_#32CD32,0px_-1px_1px_#00F0FF,inset_0px_1px_1px_#32CD32,inset_0px_-1px_1px_#00F0FF]'
                  : 'bg-[linear-gradient(98.64deg,rgba(0,240,255,0.8)_0%,rgba(128,120,128,0.8)_49.67%,rgba(191,60,64,0.8)_74.51%,rgba(223,30,32,0.8)_86.92%,rgba(255,0,0,0.8)_99.34%)] shadow-[0px_1px_1px_#B0B0C0,0px_-1px_1px_#00F0FF,inset_0px_1px_1px_#B0B0C0,inset_0px_-1px_1px_#00F0FF]'
              }`}
          >
            <span
              className="absolute w-[55px] h-[22px] left-[calc(50%-55px/2)] top-[calc(50%-22px/2)] text-center text-white font-jersey-10 text-[18px] leading-[22px]"
              style={{
                textShadow: isSuccess
                  ? '1px 1px 3px #32CD32'
                  : '0px 1px 1px #FF0000',
              }}
            >
              {isSuccess ? 'Continue' : 'Retry'}
            </span>
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
