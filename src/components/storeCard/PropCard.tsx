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
      className="relative w-[157.53px] h-[166px] rounded-[12px] overflow-hidden cursor-pointer select-none"
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
      {/* 渐变边框容器 */}
      <div
        className="absolute inset-0 rounded-[12px]"
        style={{
          borderRadius: '12px',
          border: '1px solid transparent',
          backgroundImage:
            'linear-gradient(#1A1A40, #1A1A40), linear-gradient(136.39deg, #00F0FF 8.54%, rgba(255, 255, 255, 0) 30.01%, rgba(255, 255, 255, 0) 72.95%, #00F0FF 94.42%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-between h-full p-0 w-full">
        {/* 顶部：道具标题 */}
        <div className="flex flex-row justify-center items-center pt-[5px] w-[105.59px] h-[22px]">
          <div
            className="font-jersey-10 text-white text-[24px] leading-[22px] text-center whitespace-nowrap mt-0.5 overflow-hidden"
            style={{ textShadow: '0px 0px 1px #BC13FE' }}
          >
            {title}
          </div>
        </div>

        {/* 中间：道具图片 */}
        <div
          className="absolute w-[158px] h-[100px] flex items-center justify-center"
          style={{
            left: 'calc(50% - 158px/2 + 0.24px)',
            top: 'calc(50% - 100px/2 - 2px)',
          }}
        >
          {/* 背景图层 */}
          <div
            className="absolute inset-0 w-[158px] h-[100px]"
            style={{
              boxSizing: 'border-box',
              background:
                'linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(0, 240, 255, 0.15) 75%, rgba(255, 255, 255, 0.176) 87.5%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(180deg, rgba(188, 19, 254, 0.08) 0%, rgba(0, 102, 255, 0.32) 25%, rgba(0, 240, 255, 0.64) 50%, rgba(0, 102, 255, 0.32) 75%, rgba(188, 19, 254, 0.08) 100%)',
              backgroundImage: 'url(/stores/payiconback.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>

          {icon ? (
            <div className="relative z-10">
              <Image
                src={icon}
                alt={title}
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
          ) : (
            <div className="relative z-10">
              <span role="img" aria-label="gift" className="text-4xl">
                🎁
              </span>
            </div>
          )}
        </div>

        {/* 底部：道具信息 */}
        <div
          className="absolute bottom-0 w-full flex flex-col items-center pb-[10px]"
          style={{ height: '14px', top: '140px' }}
        >
          <div className="flex flex-row justify-center items-center gap-[6px] w-full">
            <div className="font-jersey-10 text-[#00F0FF] text-[8px] leading-[14px] flex items-center justify-center text-center w-[56px] h-[14px] whitespace-nowrap overflow-hidden">
              {validity}
            </div>
            <div className="font-jersey-10 text-[#00F0FF] text-[8px] leading-[14px] flex items-center justify-center text-center w-[70px] h-[14px]  whitespace-nowrap overflow-hidden">
              {dailyCap}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
