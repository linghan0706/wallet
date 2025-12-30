'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
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

const CARD_BG_VIEWBOX = '0 0 363 409'

function CardBackground({
  isFlipped,
  isActive,
  heightPx: _heightPx,
  widthPx: _widthPx,
}: {
  isFlipped: boolean
  isActive: boolean
  heightPx?: number
  widthPx?: number
}) {
  const uid = useId().replace(/:/g, '')
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  const crossfadeDuration = prefersReduced ? 0.18 : 0.55
  const crossfadeEase = prefersReduced
    ? ('linear' as const)
    : ([0.645, 0.045, 0.355, 1] as const)
  const dashDuration = prefersReduced ? 0 : isActive ? 2.6 : 5.2
  const pulseDuration = prefersReduced ? 0 : isActive ? 1.8 : 3.4
  const shimmerDuration = prefersReduced ? 0 : isActive ? 3.2 : 6.8
  const borderOpacity = isActive ? 0.9 : 0.65
  const accentOpacity = isActive ? 1 : 0.7
  const shimmerOpacity = isActive ? 0.45 : 0.18

  const renderSvgContent = (suffix: string) => {
    const paint0Id = `paint0-${uid}-${suffix}`
    const paint1Id = `paint1-${uid}-${suffix}`
    const paint2Id = `paint2-${uid}-${suffix}`
    const shineId = `shine-${uid}-${suffix}`

    return (
      <>
        <motion.rect
          y="2"
          width="361"
          height="405"
          fill="#1A1A40"
          fillOpacity="0.8"
          stroke={`url(#${paint0Id})`}
          strokeDasharray="2 2"
          strokeOpacity={borderOpacity}
          animate={
            prefersReduced
              ? { strokeDashoffset: 0 }
              : { strokeDashoffset: [0, -18] }
          }
          transition={{
            duration: dashDuration || 0.01,
            ease: 'linear',
            repeat: prefersReduced ? 0 : Infinity,
          }}
        />
        <motion.rect
          x="1"
          y="1"
          width="361"
          height="405"
          stroke={`url(#${paint1Id})`}
          strokeWidth="2"
          strokeOpacity={borderOpacity}
          animate={
            prefersReduced
              ? { opacity: borderOpacity }
              : { opacity: [borderOpacity, 1, borderOpacity] }
          }
          transition={{
            duration: pulseDuration || 0.01,
            ease: 'easeInOut',
            repeat: prefersReduced ? 0 : Infinity,
          }}
        />
        <motion.rect
          x="0"
          y="-80"
          width="363"
          height="120"
          fill={`url(#${shineId})`}
          opacity={shimmerOpacity}
          style={{ mixBlendMode: 'screen' }}
          animate={prefersReduced ? { y: -80 } : { y: [-80, 409] }}
          transition={{
            duration: shimmerDuration || 0.01,
            ease: 'linear',
            repeat: prefersReduced ? 0 : Infinity,
          }}
        />
        <motion.path
          d="M348.805 2.5L362.5 15.2168V408.5H0.5V21.8184L13.7715 28.623L13.8789 28.6777H152.646L152.77 28.5986L206.146 2.5H348.805Z"
          stroke={`url(#${paint2Id})`}
          strokeOpacity={borderOpacity}
          animate={
            prefersReduced
              ? { opacity: borderOpacity }
              : { opacity: [borderOpacity, 1, borderOpacity] }
          }
          transition={{
            duration: pulseDuration || 0.01,
            ease: 'easeInOut',
            repeat: prefersReduced ? 0 : Infinity,
          }}
        />
        <motion.g
          animate={
            prefersReduced
              ? { opacity: accentOpacity }
              : { opacity: [accentOpacity, 1, accentOpacity] }
          }
          transition={{
            duration: pulseDuration || 0.01,
            ease: 'easeInOut',
            repeat: prefersReduced ? 0 : Infinity,
          }}
        >
          <path d="M309 9H311L309 15H307L309 9Z" fill="#BC13FE" />
          <path d="M313 9H315L313 15H311L313 9Z" fill="#BC13FE" />
          <path d="M317 9H319L317 15H315L317 9Z" fill="#BC13FE" />
          <path d="M321 9H323L321 15H319L321 9Z" fill="#00F0FF" />
          <path d="M325 9H327L325 15H323L325 9Z" fill="#00F0FF" />
          <path d="M329 9H331L329 15H327L329 9Z" fill="#00F0FF" />
          <path d="M333 9H335L333 15H331L333 9Z" fill="#00F0FF" />
          <path d="M337 9H339L337 15H335L337 9Z" fill="#00F0FF" />
          <path d="M341 9H343L341 15H339L341 9Z" fill="#00F0FF" />
          <path d="M345 9H347L345 15H343L345 9Z" fill="#00F0FF" />
        </motion.g>
        <motion.g
          animate={
            prefersReduced
              ? { opacity: accentOpacity }
              : { opacity: [accentOpacity, 1, accentOpacity] }
          }
          transition={{
            duration: pulseDuration || 0.01,
            ease: 'easeInOut',
            repeat: prefersReduced ? 0 : Infinity,
          }}
        >
          <rect x="202" y="29" width="30" height="3" fill="#BC13FE" />
          <rect x="232" y="30" width="90" height="1" fill="#BC13FE" />
        </motion.g>
        <defs>
          <linearGradient
            id={paint0Id}
            x1="0"
            y1="2"
            x2="361.241"
            y2="406.785"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.01" stopColor="white" />
            <stop offset="0.01" stopColor="#BC13FE" stopOpacity="0" />
            <stop offset="0.1" stopColor="#BC13FE" stopOpacity="0" />
            <stop offset="0.1" stopColor="white" />
            <stop offset="0.25" stopColor="white" />
            <stop offset="0.25" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={paint1Id}
            x1="2"
            y1="2"
            x2="361.481"
            y2="404.57"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="0.01" stopColor="white" stopOpacity="0" />
            <stop offset="0.01" stopColor="#BC13FE" />
            <stop offset="0.1" stopColor="#BC13FE" />
            <stop offset="0.1" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={paint2Id}
            x1="363"
            y1="2.00002"
            x2="0.0000340343"
            y2="409"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00F0FF" />
            <stop offset="1" stopColor="#BC13FE" />
          </linearGradient>
          <linearGradient
            id={shineId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stopColor="#00F0FF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#BC13FE" stopOpacity="0.55" />
            <stop offset="1" stopColor="#00F0FF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </>
    )
  }

  return (
    <AnimatePresence>
      {isFlipped ? (
        <motion.svg
          key="back"
          className="absolute inset-0 z-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox={CARD_BG_VIEWBOX}
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
          {renderSvgContent('back')}
        </motion.svg>
      ) : (
        <motion.svg
          key="front"
          className="absolute inset-0 z-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox={CARD_BG_VIEWBOX}
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
          {renderSvgContent('front')}
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
  const [isBgActive, setIsBgActive] = useState(false)
  const recalcTimer = useRef<NodeJS.Timeout | null>(null)

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
    () => () => {
      if (recalcTimer.current) clearTimeout(recalcTimer.current)
      recalcTimer.current = setTimeout(() => {
        measureSvgSize()
      }, 150)
    },
    [measureSvgSize]
  )

  useEffect(() => {
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

  useEffect(() => {
    return () => {
      if (recalcTimer.current) clearTimeout(recalcTimer.current)
    }
  }, [])

  const containerWidthForHeight = svgSize.width || 363
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
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 sm:pt-14 mt-[24px]">
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] bg-cover bg-contain"
        style={{ backgroundImage: `url(/layout/background.png)` }}
      ></div>

      <div className="relative z-10 px-4 py-5">
        {/* 资产兑换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-4"
        >
          <AssetRedemption />
        </motion.div>

        <div className="w-[363px] h-[42px] max-w-[380px] sm:max-w-[400px] mx-auto mt-6 sm:mt-8 bg-[#1A1A4073]  flex items-center">
          <div className="font-orbitron font-[900] text-[15px] leading-[19px]  ml-1h tracking-[0.06em] uppercase text-white/80 [text-shadow:0px_0px_1px_#BC13FE]">
            Prop Store
            <span>
              <div
                style={{ width: '30px', height: '3px', background: '#00F0FF' }}
              />
              <div
                style={{
                  width: '90px',
                  height: '1px',
                  background: '#00F0FF',
                  marginTop: '-2px',
                }}
              />
            </span>
          </div>
          <div className="ml-auto ">
            <svg
              width="47"
              height="13"
              viewBox="0 0 47 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.86989 12.9948L4.85864 12.125L3.98883 8.13621L8.3117e-05 9.00602L0.86989 12.9948ZM8.89088 0.499996L8.89088 -3.327e-06L8.61769 -3.6205e-06L8.47011 0.229889L8.89088 0.499996ZM24.8909 0.499996L24.8909 -3.03246e-06L24.8909 0.499996ZM8.89088 0.499996L8.47011 0.229889L2.0086 10.2954L2.42936 10.5655L2.85012 10.8356L9.31164 0.770104L8.89088 0.499996ZM46.8909 0.500001L46.8909 1.03319e-06L24.8909 -3.03246e-06L24.8909 0.499996L24.8909 0.999996L46.8909 1L46.8909 0.500001ZM24.8909 0.499996L24.4473 0.269237L18.4473 11.8024L18.8909 12.0332L19.3344 12.264L25.3344 0.730756L24.8909 0.499996ZM24.8909 0.499996L24.8909 -3.03246e-06L8.89088 -3.327e-06L8.89088 0.499996L8.89088 0.999996L24.8909 0.999996L24.8909 0.499996Z"
                fill="#00F0FF"
              />
            </svg>
          </div>
        </div>
        {/* 外层包裹 */}
        <div
          ref={wrapperRef}
          id="store-scroll-container"
          className="relative w-[363px]  max-w-[380px] sm:max-w-[400px] mx-auto  sm:mt-3 p-5 sm:p-6  overflow-y-auto no-scrollbar overflow-anchor-none h-[calc(100vh-260px)] sm:h-[calc(100vh-280px)]"
          onPointerEnter={() => setIsBgActive(true)}
          onPointerLeave={() => setIsBgActive(false)}
          onPointerDown={() => setIsBgActive(true)}
          onPointerUp={() => setIsBgActive(false)}
          onPointerCancel={() => setIsBgActive(false)}
          style={{
            height: dynamicHeight,
            minHeight: bgMinHeight,
            backgroundColor: '#1A1A4073',
            perspective: 'none',
          }}
        >
          {/* 背景 SVG，作为卡片背景，响应容器尺寸并可翻转 */}
          <CardBackground
            isFlipped={tab === 'collector'}
            isActive={isBgActive}
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
