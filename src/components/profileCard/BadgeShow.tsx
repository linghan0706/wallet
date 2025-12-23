'use client'

import { useState, useRef } from 'react'

export default function BadgeShow() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)
  const startX = useRef(0)
  const endX = useRef(0)

  const filters = [
    { label: 'All', active: false },
    { label: 'ACTIVE', active: false },
    { label: 'STAGE', active: false },
    { label: 'OTHER', active: false },
  ]

  // 更新筛选器激活状态
  const updatedFilters = filters.map(filter => ({
    ...filter,
    active: filter.label === activeFilter,
  }))

  const allBadges = [
    // ACTIVE 类型徽章
    {
      label: ['NOVICE', 'STAREXPLORER'],
      image: '/profile/badge/novice_star_explorer.png',
      active: true,
      type: 'ACTIVE',
    },
    {
      label: ['SPACE', 'ROOKIE'],
      image: '/profile/badge/space_rookie.png',
      active: true,
      type: 'ACTIVE',
    },
    {
      label: ['COSMIC', 'PIONEER'],
      image: '/profile/badge/cosmic_pioneer.png',
      active: true,
      type: 'ACTIVE',
    },
    // STAGE 类型徽章
    {
      label: ['INTERSTELLAR', 'VOYAGER'],
      image: '/profile/badge/interstellar_voyager.png',
      active: false,
      type: 'STAGE',
    },
    {
      label: ['GALACTIC', 'GUARDIAN'],
      image: '/profile/badge/galactic_guardian.png',
      active: false,
      type: 'STAGE',
    },
    {
      label: ['COSMIC', 'SOCIAL'],
      image: '/profile/badge/cosmic_social_legend.png',
      active: false,
      type: 'STAGE',
    },
    // OTHER 类型徽章
    {
      label: ['GALACTIC', 'SOCIAL'],
      image: '/profile/badge/Galactic Social Master.png',
      active: false,
      type: 'OTHER',
    },
    {
      label: ['INTERSTELLAR', 'COLLAB'],
      image: '/profile/badge/interstellar_collaborator.png',
      active: false,
      type: 'OTHER',
    },
  ]

  // 根据当前筛选器过滤徽章
  const filteredBadges =
    activeFilter === 'All'
      ? allBadges
      : allBadges.filter(badge => badge.type === activeFilter)

  // 获取总页数
  const totalPages = Math.ceil(filteredBadges.length / 2)

  // 获取当前页的徽章
  const getCurrentBadges = () => {
    const startIndex = currentIndex * 2
    return filteredBadges.slice(startIndex, startIndex + 2)
  }

  // 处理筛选器变化
  const handleFilterChange = (filterLabel: string) => {
    setActiveFilter(filterLabel)
    setCurrentIndex(0) // 重置到第一页
  }

  // 处理指示器点击
  const handleIndicatorClick = (index: number) => {
    if (index >= 0 && index < totalPages) {
      setCurrentIndex(index)
    }
  }

  // 处理触摸开始事件
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX =
      'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    startX.current = clientX
  }

  // 处理触摸结束事件
  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX =
      'changedTouches' in e
        ? e.changedTouches[0].clientX
        : (e as React.MouseEvent).clientX
    endX.current = clientX

    const minSwipeDistance = 50
    const swipeDistance = startX.current - endX.current

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // 向左滑动，下一页
        if (currentIndex < totalPages - 1) {
          setCurrentIndex(prev => prev + 1)
        }
      } else {
        // 向右滑动，上一页
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1)
        }
      }
    }
  }

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX
  }

  // 处理鼠标抬起事件
  const handleMouseUp = (e: React.MouseEvent) => {
    endX.current = e.clientX

    const minSwipeDistance = 50
    const swipeDistance = startX.current - endX.current

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // 向左滑动，下一页
        if (currentIndex < totalPages - 1) {
          setCurrentIndex(prev => prev + 1)
        }
      } else {
        // 向右滑动，上一页
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1)
        }
      }
    }
  }

  return (
    <div className="relative w-[363px] h-[197px] bg-[url(/profile/badge/background.png)] bg-cover bg-no-repeat mt-4">
      <div className="absolute right-[16px] top-[10px] flex flex-col items-end">
        <span
          className="font-oxanium font-bold text-[10px] leading-[12px] text-center tracking-[0.04em] uppercase text-white"
          style={{
            fontFamily: "'Oxanium', sans-serif",
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '10px',
            lineHeight: '12px',
            textAlign: 'center',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          BADGE SHOW
        </span>
      </div>

      <div className="absolute left-[12px] top-[14px] w-[60px] h-[180px] bg-[#1A1A40]">
        <div className="absolute left-[1.33px] top-[1.8px] w-[60px] h-[180px] border border-[rgba(255,255,255,0.15)]" />
        <div className="absolute left-0 top-[18px] w-full text-center font-oxanium font-normal text-[12px] leading-[15px] text-[#00F0FF]">
          FILTERS
        </div>
        <div className="absolute left-0 top-[54px] flex flex-col gap-[9px]">
          {updatedFilters.map(filter => (
            <div
              key={filter.label}
              className={`w-[60px] h-[20px] flex items-center justify-center border cursor-pointer ${
                filter.active
                  ? 'bg-[rgba(0,240,255,0.8)] border-[rgba(255,255,255,0.6)]'
                  : 'border-[rgba(176,176,192,0.6)]'
              }`}
              onClick={() => handleFilterChange(filter.label)}
            >
              <span
                className={`font-oxanium font-light text-[12px] leading-[15px] text-center uppercase ${
                  filter.active ? 'text-[#1A1A40]' : 'text-[#00F0FF]'
                }`}
              >
                {filter.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute w-[280px] h-[120px] left-[70px] top-[55px] right-[16px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex items-center justify-center">
          {getCurrentBadges().map(badge => (
            <div
              key={badge.label.join(' ')}
              className="relative w-[120px] h-[96.5px] flex flex-col items-center"
            >
              <div className="relative w-[100px] h-[60px] flex items-center justify-center">
                {badge.active && (
                  <>
                    <div
                      className="absolute left-1/2 top-0 h-[60px] w-[100px] -translate-x-1/2"
                      style={{
                        background:
                          'linear-gradient(178.14deg, rgba(0, 240, 255, 0) -0.71%, rgba(0, 240, 255, 0.2) 149.94%)',
                      }}
                    />
                    <div
                      className="absolute left-1/2 top-[57px] h-[4px] w-[100px] -translate-x-1/2"
                      style={{
                        background:
                          'radial-gradient(50% 50% at 50% 50%, #00F0FF 0%, #00F0FF 10%, rgba(255, 255, 255, 0) 100%)',
                      }}
                    />
                  </>
                )}
                {!badge.active ? (
                  <img
                    src="/profile/badge/badge_locked.png"
                    alt="Locked"
                    className="absolute z-20 w-[48px] h-[48px] opacity-80"
                  />
                ) : (
                  <img
                    src={badge.image}
                    alt={badge.label.join(' ')}
                    className={`relative z-10 ${badge.active ? 'w-[60px] h-[60px]' : 'w-[48px] h-[48px] opacity-70 grayscale'}`}
                    style={
                      badge.active
                        ? { filter: 'drop-shadow(0px -1px 1px #00F0FF)' }
                        : undefined
                    }
                  />
                )}
              </div>
              <div
                className="mt-[6px] font-oxanium text-[12px] leading-[15px] text-center tracking-[0.04em] uppercase text-white"
                style={{
                  fontFamily: "'Oxanium', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '15px',
                  textAlign: 'center',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                }}
              >
                <span className="block">{badge.label[0]}</span>
                <span className="block">{badge.label[1]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 指示器 */}
      <div className="absolute left-1/2 bottom-[12px] flex -translate-x-1/2 gap-[10px]">
        <span
          className="h-[8px] w-[8px] bg-[#BC13FE] cursor-pointer"
          onClick={() => handleIndicatorClick(0)}
        />
        <span
          className={`h-[8px] w-[8px] cursor-pointer ${
            currentIndex === 1 ? 'bg-[#00F0FF]' : 'bg-[#B0B0C0]'
          }`}
          onClick={() => handleIndicatorClick(1)}
        />
        <span
          className={`h-[8px] w-[8px] cursor-pointer ${
            currentIndex === 2 ? 'bg-[#00F0FF]' : 'bg-[#B0B0C0]'
          }`}
          onClick={() => handleIndicatorClick(2)}
        />
        <span
          className={`h-[8px] w-[8px] cursor-pointer ${
            currentIndex === 3 ? 'bg-[#00F0FF]' : 'bg-[#B0B0C0]'
          }`}
          onClick={() => handleIndicatorClick(3)}
        />
      </div>
    </div>
  )
}
