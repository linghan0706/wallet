'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { useLayoutManager } from '@/hooks/Guider'

// 引导页面样式配置接口
interface StyleConfig {
  className?: string // Added className for font classes
  fontSize?: string
  lineHeight?: string
  color?: string
  background?: string
  backgroundClip?: string
  WebkitBackgroundClip?: string
  WebkitTextFillColor?: string
  width?: string
  height?: string
  display?: string
  alignItems?: string
  textAlign?: string
  textFillColor?: string
  flex?: string
  order?: number
  flexGrow?: number
  textShadow?: string
  border?: string
  marginTop?: string
}

// 引导页面数据接口
interface GuidancePageData {
  id: number
  icon: string
  title: string
  subtitle?: string
  description: string
  styles?: {
    mainTitle?: StyleConfig
    subTitle?: StyleConfig
    description?: StyleConfig
  }
}

// 引导页面数据
const guidancePages: GuidancePageData[] = [
  {
    id: 1,
    icon: '/LoadingIcon/Loading-1.png',
    title: 'Welcome to',
    subtitle: 'NovaExplorer',
    description: 'Collect energy and search for spaceship parts',
    styles: {
      mainTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '58px',
        color: '#FFFFFF',
        height: '58px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      subTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '32px',
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(270deg, rgba(0, 240, 255, 0.8) 1.39%, rgba(188, 19, 254, 0.8) 28.4%, rgba(0, 240, 255, 0.8) 45.48%, rgba(188, 19, 254, 0.8) 54.81%, rgba(0, 240, 255, 0.8) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        height: '48px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      description: {
        className: 'font-exo2',
        fontSize: '16px',
        lineHeight: '22px',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        marginTop: '10px',
      },
    },
  },
  {
    id: 2,
    icon: '/LoadingIcon/Loading-2.png',
    title: '',
    subtitle: 'Blue Star',
    description: 'Collect energy and search for spaceship parts',
    styles: {
      subTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '32px',
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(270deg, rgba(0, 240, 255, 0.8) 1.39%, rgba(188, 19, 254, 0.8) 28.4%, rgba(0, 240, 255, 0.8) 45.48%, rgba(188, 19, 254, 0.8) 54.81%, rgba(0, 240, 255, 0.8) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        height: '48px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      description: {
        className: 'font-exo2',
        fontSize: '16px',
        lineHeight: '22px',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        marginTop: '10px',
      },
    },
  },
  {
    id: 3,
    icon: '/LoadingIcon/Loading-3.png',
    title: '',
    subtitle: 'Solar System',
    description: 'Roam the planets and explore the mysteries',
    styles: {
      subTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '32px',
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(270deg, rgba(0, 240, 255, 0.8) 1.39%, rgba(188, 19, 254, 0.8) 28.4%, rgba(0, 240, 255, 0.8) 45.48%, rgba(188, 19, 254, 0.8) 54.81%, rgba(0, 240, 255, 0.8) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        height: '48px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      description: {
        className: 'font-exo2',
        fontSize: '16px',
        lineHeight: '22px',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        marginTop: '10px',
      },
    },
  },
  {
    id: 4,
    icon: '/LoadingIcon/Loading-4.png',
    title: '',
    subtitle: 'Galaxy',
    description: 'Traverse the wormholes and challenge the unknown',
    styles: {
      subTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '32px',
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(270deg, rgba(0, 240, 255, 0.8) 1.39%, rgba(188, 19, 254, 0.8) 28.4%, rgba(0, 240, 255, 0.8) 45.48%, rgba(188, 19, 254, 0.8) 54.81%, rgba(0, 240, 255, 0.8) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        height: '48px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      description: {
        className: 'font-exo2',
        fontSize: '16px',
        lineHeight: '22px',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        marginTop: '10px',
      },
    },
  },
  {
    id: 5,
    icon: '/LoadingIcon/Loading-5.png',
    title: '',
    subtitle: 'Infinite Universe',
    description: 'Time-space Jump, Become a Legend',
    styles: {
      subTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '32px',
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(270deg, rgba(0, 240, 255, 0.8) 1.39%, rgba(188, 19, 254, 0.8) 28.4%, rgba(0, 240, 255, 0.8) 45.48%, rgba(188, 19, 254, 0.8) 54.81%, rgba(0, 240, 255, 0.8) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        height: '48px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      description: {
        className: 'font-exo2',
        fontSize: '16px',
        lineHeight: '22px',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        marginTop: '10px',
      },
    },
  },
  {
    id: 6,
    icon: '/LoadingIcon/Loading-6.png',
    title: 'Star—Universe',
    subtitle: 'UNI Heart NFT',
    description: 'your legend, eternally written in the cosmos',
    styles: {
      mainTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '58px',
        color: '#FFFFFF',
        height: '58px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      subTitle: {
        className: 'font-jersey-10',
        fontSize: '54px',
        lineHeight: '32px',
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(270deg, rgba(0, 240, 255, 0.8) 1.39%, rgba(188, 19, 254, 0.8) 28.4%, rgba(0, 240, 255, 0.8) 45.48%, rgba(188, 19, 254, 0.8) 54.81%, rgba(0, 240, 255, 0.8) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        height: '48px',
        textShadow: '0px 0px 1px #BC13FE',
      },
      description: {
        className: 'font-exo2',
        fontSize: '16px',
        lineHeight: '22px',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        marginTop: '10px',
      },
    },
  },
]

// 样式映射函数
const getStyleForElement = (
  pageData: GuidancePageData,
  elementType: 'mainTitle' | 'subTitle' | 'description'
) => {
  const styleConfig = pageData.styles?.[elementType]
  if (!styleConfig) return { style: {}, className: '' }

  // 构建基础样式对象，只包含已定义的样式属性
  const baseStyle: React.CSSProperties = {
    fontSize: styleConfig.fontSize,
    lineHeight: styleConfig.lineHeight,
    display: 'flex',
    alignItems: 'center',
    textAlign:
      (styleConfig.textAlign as React.CSSProperties['textAlign']) || 'center',
    textShadow: styleConfig.textShadow,
    height: styleConfig.height,
    border: styleConfig.border,
    marginTop: styleConfig.marginTop,
  }

  // 只有当width属性存在时才添加到样式中
  if (styleConfig.width) {
    baseStyle.width = styleConfig.width
  }

  let finalStyle = baseStyle

  // 处理背景渐变样式
  if (styleConfig.background) {
    finalStyle = {
      ...baseStyle,
      background: styleConfig.background,
      WebkitBackgroundClip: styleConfig.WebkitBackgroundClip || 'text',
      WebkitTextFillColor: styleConfig.WebkitTextFillColor || 'transparent',
      backgroundClip: styleConfig.backgroundClip || 'text',
    }
  } else if (styleConfig.color) {
    // 处理纯色样式
    finalStyle = {
      ...baseStyle,
      color: styleConfig.color,
    }
  }

  return {
    style: finalStyle,
    className: styleConfig.className || '',
  }
}

interface LoadingProps {
  onComplete?: () => void
}

export default function Loading({ onComplete }: LoadingProps) {
  // 初始化为1，这样第二个进度条（index=1）会在进入时点亮
  const [currentPage, setCurrentPage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 布局管理器的ref引用
  const containerRef = useRef<HTMLDivElement>(null)
  const mainIconRef = useRef<HTMLDivElement>(null)
  const titleAreaRef = useRef<HTMLDivElement>(null)
  const svgElementRef = useRef<SVGSVGElement>(null)

  // 使用布局管理器
  useLayoutManager({
    containerRef,
    mainIconRef,
    titleAreaRef,
    svgElementRef,
  })

  const currentData = guidancePages[currentPage - 1]

  const handleNext = () => {
    if (currentPage < guidancePages.length && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsTransitioning(false)
      }, 500)
    } else if (currentPage === guidancePages.length) {
      onComplete?.()
    }
  }

  const handlePrev = () => {
    if (currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setIsTransitioning(false)
      }, 500)
    }
  }

  const handleSkip = () => {
    onComplete?.()
  }

  const handleDotClick = (index: number) => {
    // 允许点击任何引导页的dot (1-6)
    if (index >= 1 && index !== currentPage && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(index)
        setIsTransitioning(false)
      }, 500)
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col relative overflow-hidden"
      data-layout-key="main-container"
      style={{
        background: 'linear-gradient(to top, #0F1226, #0C2957)',
      }}
    >
      {/* 跳过 Skip */}
      {/* <button
        onClick={handleSkip}
        className="absolute top-8 right-6 z-50 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-full transition-colors font-jersey-10"
      >
        skip
      </button> */}

      {/* 上层图片 Section: Image */}
      <div className="w-full relative" ref={mainIconRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="relative w-[393px] flex items-center justify-center"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Image
              src={currentData.icon}
              alt={currentData.title}
              width={393}
              height={452}
              className="object-contain drop-shadow-2xl"
              style={{
                width: '100%',
                height: '100%',
              }}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 下层内容 Section: Content */}
      <div
        ref={titleAreaRef}
        className="flex flex-col items-center justify-center w-[393px] h-[356px] p-[56px_44px] gap-[15px] mx-auto relative z-10 border-t border-[#CED4DD] rounded-[12px]"
        style={{
          background: 'linear-gradient(to top, #0F1226, #0C2957)',
        }}
      >
        {/* 主要内容  */}
        <div
          className="flex flex-col items-center w-full"
          style={{ height: '120px' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentPage}`}
              className="flex flex-col items-center w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ height: '106px' }} // 主标题(58px) + 副标题(48px)
            >
              {/* 主标题容器  */}
              <div
                style={{
                  width: '100%',
                  height: '58px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                  order: 0,
                }}
              >
                <h1
                  style={getStyleForElement(currentData, 'mainTitle').style}
                  className={
                    getStyleForElement(currentData, 'mainTitle').className
                  }
                >
                  {currentData.title}
                </h1>
              </div>

              {/* 副标题容器 */}
              <div
                style={{
                  width: '100%',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                  order: 1,
                }}
              >
                <h2
                  style={getStyleForElement(currentData, 'subTitle').style}
                  className={
                    getStyleForElement(currentData, 'subTitle').className
                  }
                >
                  {currentData.subtitle || ''}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 描述文本 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
            order: 2,
            minHeight: '44px',
          }}
        >
          <p
            style={getStyleForElement(currentData, 'description').style}
            className={getStyleForElement(currentData, 'description').className}
          >
            {currentData.description}
          </p>
        </div>

        {/* 分页器 */}
        <div
          className="flex flex-col gap-[15px] w-full items-center"
          style={{
            marginTop: '5px',
            order: 3,
          }}
        >
          {/* 点点 Dots */}
          <div
            className="flex flex-row items-center gap-[10px]"
            style={{ width: '106px', height: '6px', flex: 'none' }}
          >
            {Array.from({ length: 6 }, (_, i) => {
              const index = i + 1
              const isActive = index === currentPage
              return (
                <motion.div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="cursor-pointer"
                  style={{
                    width: isActive ? '26px' : '6px',
                    height: '6px',
                    background: isActive
                      ? 'linear-gradient(172.02deg, #00F0FF -21.97%, #0066FF 99.02%)'
                      : '#FFFFFF',
                    borderRadius: isActive ? '20px' : '50%',
                    flex: 'none',
                  }}
                  layout
                />
              )
            })}
          </div>

          {/*回退箭头 Button*/}
          <div
            style={{
              width: '305px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flex: 'none',
            }}
          >
            {currentPage > 1 && (
              <motion.button
                onClick={handlePrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/button/left.svg"
                  alt="Back"
                  width={22}
                  height={22}
                  style={{ width: 'auto', height: '22px' }}
                />
              </motion.button>
            )}

            {/* Next Step Button */}
            <motion.button
              className="flex items-center justify-center relative"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: currentPage > 1 ? 'calc(100% - 40px)' : '100%',
                height: '22px',
                background:
                  'linear-gradient(90deg, rgba(0, 240, 255, 0.8) 0%, rgba(0, 102, 255, 0.8) 100%)',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                className="font-jersey-10"
                style={{
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                Next Step
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
