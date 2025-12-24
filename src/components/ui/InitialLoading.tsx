'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  retrieveLaunchParams,
  retrieveRawInitData,
} from '@telegram-apps/sdk-react'
import {
  getInitData,
  isTelegramEnvironment,
} from '@/telegramWebApp/telegrambot'
import { telegramLogin } from '@/utils/api'

interface InitialLoadingProps {
  onLoadingComplete?: () => void
}

const NAV_PRELOAD_IMAGES = [
  '/layout/NavCion/task.png',
  '/layout/NavCion/store.png',
  '/layout/NavCion/base.png',
  '/layout/NavCion/backpack.png',
  '/layout/NavCion/home.png',
  '/components/layout/NavIcon/HomeIcon.png',
  '/currency/power.png',
  '/currency/nova.png',
]

const preloadImages = (sources: string[]) =>
  Promise.all(
    sources.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image()
          const done = () => resolve()
          img.onload = done
          img.onerror = done
          img.src = src
          if ('decode' in img) {
            img.decode().then(done).catch(done)
          }
        })
    )
  ).then(() => undefined)

const preloadLayoutAssets = () =>
  Promise.allSettled([
    import('@/components/layout/BottomNavigation'),
    import('@/components/layout/UserHeader'),
    preloadImages(NAV_PRELOAD_IMAGES),
  ]).then(() => undefined)

const InitialLoading = ({ onLoadingComplete }: InitialLoadingProps) => {
  const [progress, setProgress] = useState(0)
  // 控制是否跳过加载动画的变量（但仍要完成登录）
  const [skipLoading, setSkipLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false
    let isReady = false
    let isProgressDone = skipLoading
    let didComplete = false
    let completionTimer: ReturnType<typeof setTimeout> | null = null
    let progressTimer: ReturnType<typeof setInterval> | null = null

    const attemptComplete = () => {
      if (isCancelled || didComplete || !isReady || !isProgressDone) {
        return
      }
      didComplete = true
      onLoadingComplete?.()
    }

    const performLogin = async () => {
      try {
        const data = getInitData()
        console.log('Got Telegram InitData:', data)

        if (isTelegramEnvironment()) {
          try {
            const lp = retrieveLaunchParams()
            console.log('SDK LaunchParams:', lp)
          } catch (e) {
            console.warn('Failed to read LaunchParams (ignored):', e)
          }

          let rawInit: string | null = null
          try {
            rawInit = retrieveRawInitData() || null
            console.log('SDK raw initData:', rawInit)
          } catch (e) {
            console.warn('Failed to read raw initData (ignored):', e)
          }

          if (rawInit) {
            try {
              const res = await telegramLogin()
              console.log('Telegram login result:', res)
              if (res.success) {
                console.log('Login successful, user data:', res.data)
              } else {
                console.log('Login failed:', res.message)
              }
            } catch (err) {
              console.error('Telegram login error:', err)
            }
          } else {
            console.warn('No raw initData found, skipping login request.')
          }
        } else {
          console.warn(
            'Not in Telegram environment, skipping SDK parameter reading and login.'
          )
        }
      } catch (error) {
        console.error('Error during login process:', error)
      }
    }

    const warmup = async () => {
      await Promise.allSettled([performLogin(), preloadLayoutAssets()])
      if (isCancelled) return
      if (skipLoading) {
        completionTimer = setTimeout(() => {
          isReady = true
          attemptComplete()
        }, 100)
        return
      }
      isReady = true
      attemptComplete()
    }

    warmup()

    if (!skipLoading) {
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (progressTimer) {
              clearInterval(progressTimer)
            }
            isProgressDone = true
            attemptComplete()
            return 100
          }
          return prev + 2
        })
      }, 6)
    }

    return () => {
      isCancelled = true
      if (completionTimer) {
        clearTimeout(completionTimer)
      }
      if (progressTimer) {
        clearInterval(progressTimer)
      }
    }
  }, [onLoadingComplete, skipLoading])

  // 如果设置了跳过加载，不渲染加载界面
  if (skipLoading) {
    return null
  }

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
