'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface InitialLoadingProps {
  onLoadingComplete?: () => void
}

const InitialLoading = ({ onLoadingComplete }: InitialLoadingProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 1000000s后加载
    const timer = setTimeout(() => {
      onLoadingComplete?.()
    }, 6)

    // 模拟进度条动画
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 6)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [onLoadingComplete])

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(/LoadingIcon/InitialLoading-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 主要内容区域 */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto px-6 mt-[412px]">
        {/* NovaExplorer 标题 */}
        <h1
          className="mb-4 font-jersey-10"
          style={
            {
              fontSize: '54px',
              lineHeight: '32px',
              fontWeight: 400,
              textAlign: 'center',
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(270deg, rgba(0, 240, 255, 0.8) 1.39%, rgba(188, 19, 254, 0.8) 28.4%, rgba(0, 240, 255, 0.8) 45.48%, rgba(188, 19, 254, 0.8) 54.81%, rgba(0, 240, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0px 0px 1px #BC13FE',
            } as React.CSSProperties
          }
        >
          NovaExplorer
        </h1>

        {/* 进度条 */}
        <div className="w-full max-w-xs mb-4">
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00D3F3] via-purple-400 to-[#E377DA] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* 加载状态文本 */}
        <p
          className="font-jersey-10"
          style={
            {
              fontSize: '18px',
              lineHeight: '22px',
              fontWeight: 400,
              textAlign: 'center',
              color: '#00F0FF',
            } as React.CSSProperties
          }
        >
          Loading data..
        </p>
      </div>

      {/* 像素风格装饰粒子 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400"
            style={{
              left: `${(i * 7) % 100}%`,
              bottom: `${(i * 3) % 20}px`,
              width: '2px',
              height: '2px',
              imageRendering: 'pixelated',
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + (i % 2),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        /* 像素风格样式 */
        * {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2rem;
          }
          .text-lg {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default InitialLoading
