'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface PropCardProps {
  title: string
  validity?: string
  dailyCap?: string
  icon?: string
  onPurchase?: (payload?: {
    id?: string
    icon?: string
    title?: string
  }) => void
}

interface TextSegments {
  prefix: string
  value?: string
  suffix?: string
}

const splitTextSegments = (text: string): TextSegments => {
  const match = text.match(/^(.*?)([+-]?\d+(?:\.\d+)?)(.*)$/)

  if (!match) return { prefix: text.trim() }

  const [, prefix, value, suffix] = match

  return {
    prefix: prefix.trim(),
    value: value.trim(),
    suffix: suffix.trim(),
  }
}

const InfoBadge = ({
  text,
  emphasizeValue = false,
}: {
  text: string
  emphasizeValue?: boolean
}) => {
  const { prefix, value, suffix } = splitTextSegments(text)

  if (!emphasizeValue || !value) {
    return (
      <div className="flex items-center  justify-center text-center whitespace-nowrap font-ibm-plex-mono font-bold text-[8px]  leading-[12px] text-[#00F0FF]  [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] translate-y-2">
        {prefix && (
          //validity
          <span className="inline-flex items-center justify-center font-ibm-plex-mono font-bold text-[8px] leading-[10px] text-[#00F0FF] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] mt-3">
            {prefix}
          </span>
        )}

        {value && (
          <span className="inline-flex items-center font-ibm-plex-mono font-bold text-[14px] leading-[14px] text-white [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] mt-2 ">
            {value}
          </span>
        )}

        {suffix && (
          <span className="inline-flex items-center justify-center font-ibm-plex-mono font-bold text-[8px] leading-[10px] text-[#B0B0C0] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] ml-1 mt-3 ">
            {suffix}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-[2px] whitespace-nowrap text-center translate-y-2">
      {prefix && (
        <span className="inline-flex items-center justify-center font-ibm-plex-mono font-bold text-[8px] leading-[10px] text-[#00F0FF] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
          {prefix}
        </span>
      )}

      {value && (
        <span className="inline-flex items-center font-ibm-plex-mono font-bold text-[14px] leading-[14px] text-white [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
          {value}
        </span>
      )}

      {suffix && (
        <span className="inline-flex items-center justify-center font-ibm-plex-mono font-bold text-[8px] leading-[10px] text-[#B0B0C0] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
          {suffix}
        </span>
      )}
    </div>
  )
}

export function PropCard({
  title,
  validity = 'Validity: 3 Days',
  dailyCap = 'Daily Energy Cap +50%',
  icon,
  onPurchase,
}: PropCardProps) {
  const handleClick = () => {
    onPurchase?.({
      id: title,
      icon,
      title,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-[157.53px] h-[166px] overflow-hidden cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/GlobalBorder/store/prop_store_border.png"
          alt="Prop Card Border"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between h-full p-0 w-full">
        <div className="flex items-center justify-center pt-[5px] w-full h-[22px]">
          <div
            className="flex items-center justify-center font-oxanium font-bold text-[14px] leading-[18px] tracking-[0.04em] capitalize text-white text-center whitespace-nowrap [text-shadow:0_0_1px_#BC13FE]"
            style={{}}
          >
            {title}
          </div>
        </div>

        <div
          className="absolute w-[158px] h-[100px] flex items-center justify-center"
          style={{
            left: 'calc(50% - 158px/2 + 0.24px)',
            top: 'calc(50% - 100px/2 - 2px)',
          }}
        >
          <div
            className="relative z-10 w-[100px] h-[100px]"
            style={{
              boxSizing: 'border-box',
              background:
                'linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(0, 240, 255, 0.15) 75%, rgba(255, 255, 255, 0.176) 87.5%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(180deg, rgba(188, 19, 254, 0.08) 0%, rgba(0, 102, 255, 0.32) 25%, rgba(0, 240, 255, 0.64) 50%, rgba(0, 102, 255, 0.32) 75%, rgba(188, 19, 254, 0.08) 100%)',
              backgroundImage:
                'url(/GlobalBorder/store/item_background_icon.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {icon ? (
              <Image
                src={icon}
                alt={title}
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain"
              />
            ) : (
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center text-sm text-white/70"
              >
                gift
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-[10px] left-0 w-full flex flex-col items-center gap-[2px]">
          <InfoBadge text={validity} />
          <InfoBadge text={dailyCap} emphasizeValue />
        </div>
      </div>
    </motion.div>
  )
}
