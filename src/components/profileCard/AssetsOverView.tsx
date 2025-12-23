'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface AssetCardProps {
  label: string
  value: string | number
  borderImage: string
  valueColor?: string
}

// 资产卡片组件
const AssetCard = ({
  label,
  value,
  borderImage,
  valueColor = '#00F0FF',
}: AssetCardProps) => {
  return (
    <div className="relative w-[75px] h-[100px] flex flex-col items-center justify-between py-2">
      <Image
        src={borderImage}
        alt={`${label} border`}
        fill
        className="object-contain"
        priority
      />
      <div
        className="absolute top-[45px] font-oxanium font-bold text-[10px] leading-[12px] text-center tracking-[0.04em] relative z-10"
        style={{
          background: `linear-gradient(to bottom, ${valueColor} 0%, ${valueColor} 50%, #FFFFFF 50%, #FFFFFF 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {label}
      </div>

      {/* 资产数值 */}
      <div
        className="font-oxanium font-bold text-[14px] leading-[18px] text-center tracking-[0.04em] uppercase relative z-10 mb-1"
        style={{
          color: valueColor,
        }}
      >
        {value}
      </div>
    </div>
  )
}

// 资产概览组件
export default function AssetsOverview() {
  // 资产数据
  const assets = [
    {
      label: 'POWER',
      value: '8,547',
      borderImage: '/GlobalBorder/profile/Power.svg',
      valueColor: '#00F0FF',
    },
    {
      label: 'Nova',
      value: '100',
      borderImage: '/GlobalBorder/profile/Nova.svg',
      valueColor: '#E040FB',
    },
    {
      label: 'TON',
      value: '0',
      borderImage: '/GlobalBorder/profile/Ton.svg',
      valueColor: '#00F0FF',
    },
    {
      label: 'USDT',
      value: '0',
      borderImage: '/GlobalBorder/profile/Usdt.svg',
      valueColor: '#00F0FF',
    },
  ]

  return (
    <div className="relative w-full max-w-[375px] mx-auto">
      <div className="relative w-full" style={{ aspectRatio: '375/220' }}>
        <Image
          src="/profile/background.png"
          alt="Assets Overview Background"
          fill
          className="object-fill"
          priority
        />

        <div className="absolute inset-0 flex flex-col items-center">
          <h2 className="mt-4 font-orbitron font-black text-[14px] leading-[18px] text-center tracking-[0.06em] uppercase text-white">
            ASSETS OVERVIEW
          </h2>

          {/* 资产卡片 */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="flex gap-3 justify-center">
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AssetCard {...asset} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
