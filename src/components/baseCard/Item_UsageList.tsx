import React from 'react'

interface AutoCollectorItemProps {
  level: number
  name: string
  color: string
  textColor?: string
  image: string
  isActive: boolean
}

interface AutoCollectorData {
  level: number
  name: string
  color: string
  image: string
  isActive: boolean
}

const AutoCollectorItem = ({
  level,
  name,
  color,
  textColor = '#FFFFFF',
  image,
  isActive,
}: AutoCollectorItemProps) => {
  return (
    <div
      className={`relative w-[80px] h-[80px] bg-cover bg-center bg-no-repeat ${isActive ? 'border border-[#00F0FF]' : ''}`}
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
          <div className="absolute w-[80px]  bottom-[40px] font-oxanium font-medium text-[10px] leading-[12px] text-center tracking-[0.06em] capitalize text-white">
            {name}
          </div>
        </div>
      )}
    </div>
  )
}

// 数组存储不同等级自动收集器的信息
const autoCollectorData: AutoCollectorData[] = [
  {
    level: 0,
    name: 'Primary',
    color: '#00F0FF',
    image: '/base/item_usage/beginner.png',
    isActive: false,
  },
  {
    level: 1,
    name: 'Intermediate',
    color: '#BC13FE',
    image: '/base/item_usage/beginner.png',
    isActive: false,
  },
  {
    level: 2,
    name: 'Advanced',
    color: '#F5CDA0',
    image: '/base/item_usage/beginner.png',
    isActive: false,
  },
  {
    level: 3,
    name: 'Superior',
    color: '#DD462B',
    image: '/base/item_usage/beginner.png',
    isActive: false,
  },
]

export default function Item_UsageList() {
  return (
    <div
      className="flex flex-row justify-between items-start p-0"
      style={{
        width: '363px',
        height: '80px',
        left: 'calc(50% - 363px/2 + 3px)',
        top: 0,
        gap: '5px',
      }}
    >
      {autoCollectorData.map(item => (
        <AutoCollectorItem
          key={item.level}
          level={item.level}
          name={item.name}
          color={item.color}
          image={item.image}
          isActive={item.isActive}
        />
      ))}
    </div>
  )
}
