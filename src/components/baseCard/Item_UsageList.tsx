import React from 'react'
import Image from 'next/image'
{
  /***
   *数据获取定义
   *
   */
}

interface AutoCollectorItemProps {
  level: number
  name: string
  background: string
  icon: string
  isActive: boolean
  usageTime?: number
  efficiency?: number
}

interface AutoCollectorData {
  level: number
  name: string
  background: string
  icon: string
  isActive: boolean
  usageTime?: number // 使用时间，单位秒
  efficiency?: number // 效率值，百分比
}

const AutoCollectorItem = ({
  background,
  name,
  icon,
  isActive,
  usageTime,
  efficiency,
}: AutoCollectorItemProps) => {
  return (
    <div
      className="relative w-[80px] h-[80px] bg-cover no-repeat"
      style={{ backgroundImage: `url(${background})` }}
      title={`${name}\n使用时间: ${usageTime ? Math.floor(usageTime / 60) : 0}分钟\n效率: ${efficiency || 0}%`}
    >
      {/* 未激活遮罩 - 整体置暗 */}
      {!isActive && (
        <div>
          <div
            className="absolute inset-0 rounded-[8px]"
            style={{
              background: 'rgba(5, 5, 16, 0.6)',
              pointerEvents: 'none',
            }}
          />
          {/* <Image src={autoCollectorData.image} alt={name} width={80} height={80} /> */}
          <div className="absolute w-[80px]  bottom-[40px] font-oxanium font-medium text-[10px] leading-[12px] text-center tracking-[0.06em] capitalize text-white">
            {name}
          </div>
        </div>
      )}
      {/* 状态 */}
      <div className=" flex items-center justify-center mt-2">
        <div className="w-[60px] h-[60px]">
          <Image
            src={icon}
            alt={name}
            width={60}
            height={60}
            style={{ objectFit: 'contain' }}
            quality={100}
          />
        </div>
      </div>
    </div>
  )
}

// 数组存储不同等级自动收集器的信息
const autoCollectorData: AutoCollectorData[] = [
  {
    level: 0,
    name: 'Primary',
    background: '/base/item_usage/beginner.png',
    icon: '/stores/AutomaticCollector/primary.svg',
    isActive: true,
    usageTime: 300, // 5分钟
    efficiency: 20, // 20%效率
  },
  {
    level: 1,
    name: 'Intermediate',
    background: '/base/item_usage/advanced.png',
    icon: '/stores/AutomaticCollector/intermediate.svg',
    isActive: true,
    usageTime: 600, // 10分钟
    efficiency: 40, // 40%效率
  },
  {
    level: 2,
    name: 'Advanced',
    background: '/base/item_usage/intermediate.png',
    icon: '/stores/AutomaticCollector/advanced.svg',
    isActive: true,
    usageTime: 900, // 15分钟
    efficiency: 60, // 60%效率
  },
  {
    level: 3,
    name: 'Superior',
    background: '/base/item_usage/super.png',
    icon: '/stores/AutomaticCollector/super.svg',
    isActive: false,
    usageTime: 1200, // 20分钟
    efficiency: 80, // 80%效率
  },
]

export default function Item_UsageList() {
  return (
    <div
      className="flex flex-col items-center p-0"
      style={{
        width: '363px',
        left: 'calc(50% - 363px/2 + 3px)',
        top: 0,
      }}
    >
      {/* AutoCollectorItem行 */}
      <div
        className="flex flex-row justify-between items-start p-0"
        style={{
          width: '363px',
          height: '80px',
          gap: '5px',
        }}
      >
        {autoCollectorData.map(item => (
          <AutoCollectorItem
            key={item.level}
            level={item.level}
            name={item.name}
            background={item.background}
            icon={item.icon}
            isActive={item.isActive}
            usageTime={item.usageTime}
            efficiency={item.efficiency}
          />
        ))}
      </div>

      {/* 有效时间及效率百分比 */}
      {(() => {
        const highestLevelActiveItem = autoCollectorData
          .filter(item => item.isActive)
          .sort((a, b) => b.level - a.level)[0]

        if (highestLevelActiveItem) {
          return (
            <div className="w-[80px] flex justify-between text-[8px] text-white mt-1">
              <span>
                {highestLevelActiveItem.usageTime
                  ? `${Math.floor(highestLevelActiveItem.usageTime / 60)}m`
                  : '0m'}
              </span>
              <span>
                {highestLevelActiveItem.efficiency
                  ? `${highestLevelActiveItem.efficiency}%`
                  : '0%'}
              </span>
            </div>
          )
        }
        return null
      })()}
    </div>
  )
}
