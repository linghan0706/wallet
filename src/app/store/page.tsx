'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import backImage from '@/public/backImage.png'
import AssetRedemption from '@/components/storeCard/AssetRedemption'
import StoreTabs from '@/components/storeCard/StoreTabs'
import RaffleTicketGrid from '@/components/storeCard/RaffleTicketGrid'
import AutomaticCollectorGrid from '@/components/storeCard/AutomaticCollectorGrid'
import { useTransactionModalStore } from '@/stores/transactionModalStore'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const StoresTransactionCardLazy = dynamic(
  () => import('@/components/stores_up/StoresTransactionCard'),
  {
    ssr: false,
  }
)

type TelegramWebApp = {
  viewportHeight?: number
  viewportStableHeight?: number
  onEvent?: (e: 'viewportChanged', cb: () => void) => void
  offEvent?: (e: 'viewportChanged', cb: () => void) => void
}

type TelegramWindow = Window &
  typeof globalThis & {
    Telegram?: { WebApp?: TelegramWebApp }
  }

function CardBackground({
  isFlipped,
  heightPx,
  widthPx,
}: {
  isFlipped: boolean
  heightPx?: number
  widthPx?: number
}) {
  const wPx = widthPx && widthPx > 0 ? widthPx : 361
  const hRaw = heightPx && heightPx > 0 ? heightPx : 278
  const TOP_FOLD_PX = 43.5
  const TOP_ANCHOR_PX = 55.5
  const BR_PX = 12
  const MIN_H = Math.ceil(TOP_ANCHOR_PX + BR_PX) // > 55.5 + 12
  const hPx = Math.max(MIN_H, hRaw)

  const sx = wPx / 361
  const X = (u: number) => (u * sx).toFixed(4)

  const CUT_X_SHIFT_PX = 10
  const Xc = (u: number) => (u * sx + CUT_X_SHIFT_PX).toFixed(4)

  const dynamicD = `M${X(361)} ${TOP_ANCHOR_PX}
    C${X(361)} 48.8726 ${X(355.627)} ${TOP_FOLD_PX} ${X(349)} ${TOP_FOLD_PX}
    H${Xc(186.459)}
    C${Xc(182.705)} ${TOP_FOLD_PX} ${Xc(179.167)} 41.7433 ${Xc(176.899)} 38.7526
    L${Xc(151.101)} 4.74736
    C${Xc(148.833)} 1.75667 ${Xc(145.295)} 0 ${Xc(141.541)} 0
    H${X(12)}
    C${X(5.37259)} 0 ${X(0)} 5.37258 ${X(0)} 12
    V${(hPx - BR_PX).toFixed(4)}
    C${X(0)} ${(hPx - 5.37259).toFixed(4)} ${X(5.37259)} ${hPx.toFixed(4)} ${X(12)} ${hPx.toFixed(4)}
    H${X(180.5)} H${X(349)}
    C${X(355.627)} ${hPx.toFixed(4)} ${X(361)} ${(hPx - 5.37259).toFixed(4)} ${X(361)} ${(hPx - BR_PX).toFixed(4)}
    V${TOP_ANCHOR_PX} Z`

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  const crossfadeDuration = prefersReduced ? 0.18 : 0.55
  const crossfadeEase = prefersReduced
    ? ('linear' as const)
    : ([0.645, 0.045, 0.355, 1] as const)
  return (
    <AnimatePresence>
      {isFlipped ? (
        <motion.svg
          key="back"
          className="absolute inset-0 z-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox={`0 0 ${wPx} ${hPx}`}
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: crossfadeDuration, ease: crossfadeEase }}
          style={{
            display: 'block',
            transform: 'scaleX(-1)',
            willChange: 'opacity',
            height: '100%',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_i_4061_547)">
            <motion.path
              d={dynamicD}
              fill="url(#paint0_linear_4061_547)"
              shapeRendering="geometricPrecision"
              transition={{ duration: crossfadeDuration, ease: crossfadeEase }}
            />
          </g>
          <defs>
            <filter
              id="filter0_i_4061_547"
              x="0"
              y="0"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="4.8" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_4061_547"
              />
            </filter>
            <linearGradient
              id="paint0_linear_4061_547"
              x1="316.5"
              y1="79.0282"
              x2="56.158"
              y2="221.792"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6B0AE9" />
              <stop offset="1" stopColor="#6410B1" />
            </linearGradient>
          </defs>
        </motion.svg>
      ) : (
        <motion.svg
          key="front"
          className="absolute inset-0 z-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox={`0 0 ${wPx} ${hPx}`}
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: crossfadeDuration, ease: crossfadeEase }}
          style={{
            display: 'block',
            transform: 'scaleX(1)',
            willChange: 'opacity',
            height: '100%',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_i_4061_547)">
            <motion.path
              d={dynamicD}
              fill="url(#paint0_linear_4061_547)"
              shapeRendering="geometricPrecision"
              transition={{ duration: crossfadeDuration, ease: crossfadeEase }}
            />
          </g>
          <defs>
            <filter
              id="filter0_i_4061_547"
              x="0"
              y="0"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="4.8" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_4061_547"
              />
            </filter>
            <linearGradient
              id="paint0_linear_4061_547"
              x1="316.5"
              y1="79.0282"
              x2="56.158"
              y2="221.792"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6B0AE9" />
              <stop offset="1" stopColor="#6410B1" />
            </linearGradient>
          </defs>
        </motion.svg>
      )}
    </AnimatePresence>
  )
}

export default function StorePage() {
  const search = useSearchParams()
  const tab = (search.get('tab') as 'raffle' | 'collector') || 'raffle'
  const { isOpen, payload, openModal, closeModal } = useTransactionModalStore()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)
  const [svgSize, setSvgSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 278,
  })

  // Simple debounce helper
  const debounce = <T extends (...args: unknown[]) => void>(
    fn: T,
    delay = 120
  ) => {
    let t: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
      if (t) clearTimeout(t)
      t = setTimeout(() => fn(...args), delay)
    }
  }

  const computeSvgSize = (cardCount: number, containerWidth: number) => {
    const columns = 2 // grids are 2 columns in both tabs
    const rows = Math.max(1, Math.ceil(cardCount / columns))
    const cardHeight = 208 // PropCard height
    const gapY = containerWidth >= 640 ? 32 : 20 // sm breakpoint
    const paddingY = containerWidth >= 640 ? 24 : 20 // p-6 / p-5
    const navBlock = 80 // approximate nav area height inside wrapper
    const innerHeight = rows * cardHeight + (rows - 1) * gapY
    let height = innerHeight + paddingY * 2 + navBlock
    // boundaries
    const minH = 278
    const maxH = Math.max(
      minH,
      Math.floor(
        (typeof window !== 'undefined' ? window.innerHeight : 800) -
          (containerWidth >= 640 ? 280 : 260)
      )
    )
    height = Math.max(minH, Math.min(height, maxH))
    const width = containerWidth
    return { width, height }
  }

  const measureSvgSize = useCallback(() => {
    const el = wrapperRef.current
    if (!el) return
    const grid = el.querySelector('[role="grid"]') as HTMLElement | null
    const containerWidth =
      el.clientWidth || el.getBoundingClientRect().width || 361
    let count = 0
    if (grid) {
      const children = Array.from(grid.children) as HTMLElement[]
      count = children.filter(
        c => c.getAttribute('aria-hidden') !== 'true'
      ).length
    } else {
      count = tab === 'raffle' ? 1 : 4
    }
    const predicted = computeSvgSize(count, containerWidth)
    const rect = el.getBoundingClientRect()
    const viewportH =
      viewportHeight ??
      (typeof window !== 'undefined' ? window.innerHeight : null)
    const targetHeight =
      viewportH !== null
        ? Math.max(
            predicted.height,
            Math.max(278, viewportH - (containerWidth >= 640 ? 280 : 260))
          )
        : predicted.height
    const scrollH = el.scrollHeight || 0
    const height = Math.max(
      Math.round(el.clientHeight || rect.height || targetHeight) ||
        targetHeight,
      scrollH
    )
    const width = Math.round(el.clientWidth || rect.width || containerWidth)
    setSvgSize({ width, height })
  }, [tab, viewportHeight])

  const recalc = useMemo(
    () =>
      debounce(() => {
        measureSvgSize()
      }, 150),
    [measureSvgSize]
  )

  useEffect(() => {
    measureSvgSize()
    recalc()
    const el = wrapperRef.current
    if (!el) return
    const grid = el.querySelector('[role="grid"]') as HTMLElement | null

    let resizeObs: ResizeObserver | null = null
    let mutationObs: MutationObserver | null = null

    // Observe container width changes
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(() => recalc())
      resizeObs.observe(el)
    }

    // Observe grid children changes
    if (grid && typeof MutationObserver !== 'undefined') {
      mutationObs = new MutationObserver(() => recalc())
      mutationObs.observe(grid, { childList: true, subtree: false })
    }

    return () => {
      if (resizeObs) resizeObs.disconnect()
      if (mutationObs) mutationObs.disconnect()
    }
  }, [measureSvgSize, recalc])

  useEffect(() => {
    const updateViewportHeight = () => {
      if (typeof window === 'undefined') return
      const tg = (window as TelegramWindow)?.Telegram?.WebApp
      const h = tg?.viewportHeight || tg?.viewportStableHeight
      setViewportHeight(h ?? window.innerHeight ?? null)
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => measureSvgSize())
      } else {
        measureSvgSize()
      }
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    const tg = (window as TelegramWindow)?.Telegram?.WebApp
    const handler = () => updateViewportHeight()
    tg?.onEvent?.('viewportChanged', handler)

    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      tg?.offEvent?.('viewportChanged', handler)
    }
  }, [measureSvgSize])

  const containerWidthForHeight =
    wrapperRef.current?.clientWidth || svgSize.width || 361
  const bgMinHeight = svgSize.height ? `${svgSize.height}px` : undefined
  const dynamicHeight =
    viewportHeight !== null
      ? `${Math.max(
          278,
          viewportHeight - (containerWidthForHeight >= 640 ? 280 : 260)
        )}px`
      : undefined

  const handlePurchase = (payload: {
    id?: string
    icon?: string
    title?: string
  }) => {
    openModal(payload)
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 sm:pt-14 mt-[20px]">
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] bg-cover bg-contain"
        style={{ backgroundImage: `url(${backImage.src})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(107,10,233,0.4) 0%, rgba(100,16,177,0.2) 40%, rgba(94,50,172,0.1) 80%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(15px)',
          }}
        ></div>
      </div>

      <div className="relative z-10 px-4">
        <div className="flex flex-col items-center pt-3 sm:pt-6 space-y-2 sm:space-y-3">
          <h1 className="font-jersey-25 text-[32px] sm:text-[40px] leading-[40px] sm:leading-[48px] text-white font-normal tracking-wide text-center">
            store
          </h1>
          <p className="font-jersey-25 text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-center text-[#B2B2B2] font-normal">
            redeem props and resources
          </p>
        </div>
        {/* 资产兑换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-4"
        >
          <AssetRedemption />
        </motion.div>

        <div className="w-full max-w-[380px] sm:max-w-[400px] mx-auto mt-6 sm:mt-8">
          <div className="font-jersey-10 text-white text-[36px] leading-[22px] sm:text-[24px] text-center">
            Prop Store
          </div>
        </div>
        {/* 外层包裹 */}
        <div
          ref={wrapperRef}
          id="store-scroll-container"
          className="relative w-[361px] max-w-[380px] sm:max-w-[400px] mx-auto mt-[20px] sm:mt-3 p-5 sm:p-6 bg-[#29006E] overflow-y-auto no-scrollbar overflow-anchor-none h-[calc(100vh-260px)] sm:h-[calc(100vh-280px)]"
          style={{
            height: dynamicHeight,
            minHeight: bgMinHeight,
            backgroundColor: '#29006E',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.10)',
            perspective: 'none',
          }}
        >
          {/* 背景 SVG，作为卡片背景，响应容器尺寸并可翻转 */}
          <CardBackground
            isFlipped={tab === 'collector'}
            heightPx={svgSize.height}
            widthPx={svgSize.width}
          />

          {/* 导航栏切换 */}
          <div className="relative z-10 flex flex-col items-center">
            <StoreTabs />
          </div>

          <div className="mt-4 sm:mt-6 relative z-10">
            {tab === 'raffle' ? (
              <RaffleTicketGrid onPurchase={handlePurchase} />
            ) : (
              <AutomaticCollectorGrid onPurchase={handlePurchase} />
            )}
          </div>
        </div>
      </div>
      {/* 动态加载的交易卡片模态层 */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <ErrorBoundary onReset={closeModal}>
                <StoresTransactionCardLazy
                  initialIconSrc={payload?.icon}
                  onClose={closeModal}
                />
              </ErrorBoundary>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
