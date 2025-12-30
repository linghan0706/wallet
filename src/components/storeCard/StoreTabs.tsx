'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type TabKey = 'raffle' | 'collector'

export default function StoreTabs() {
  const router = useRouter()
  const search = useSearchParams()
  const pathname = usePathname()
  const scrollYRef = useRef(0)
  const scrollRatioRef = useRef<number | null>(null)

  const current: TabKey = (search.get('tab') as TabKey) || 'raffle'

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'scrollRestoration' in window.history
    ) {
      window.history.scrollRestoration = 'manual'
    }
    return () => {
      if (
        typeof window !== 'undefined' &&
        'scrollRestoration' in window.history
      ) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  const getScrollContainer = (): HTMLElement | null => {
    if (typeof document === 'undefined') return null
    return (
      (document.getElementById(
        'store-scroll-container'
      ) as HTMLElement | null) ||
      (document.querySelector(
        '[data-store-scroll-container]'
      ) as HTMLElement | null)
    )
  }

  const setTab = (key: TabKey) => {
    if (typeof window !== 'undefined') {
      const el = getScrollContainer()
      if (el) {
        const max = Math.max(el.scrollHeight - el.clientHeight, 0)
        scrollYRef.current = el.scrollTop
        scrollRatioRef.current = max > 0 ? el.scrollTop / max : 0
        try {
          sessionStorage.setItem('store_scroll_top', String(scrollYRef.current))
          sessionStorage.setItem(
            'store_scroll_ratio',
            String(scrollRatioRef.current ?? '')
          )
          sessionStorage.setItem('store_scroll_ts', String(Date.now()))
        } catch {}
      } else {
        scrollYRef.current = window.scrollY
        scrollRatioRef.current = null
        try {
          sessionStorage.setItem('store_scroll_top', String(scrollYRef.current))
          sessionStorage.setItem('store_scroll_ratio', '')
          sessionStorage.setItem('store_scroll_ts', String(Date.now()))
        } catch {}
      }
    }
    const params = new URLSearchParams(search.toString())
    params.set('tab', key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // 切换后在新内容渲染完成时进行恢复（更稳健）
  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = getScrollContainer()
    if (!el) return

    const savedTop = Number(sessionStorage.getItem('store_scroll_top') || '0')
    const savedRatioRaw = sessionStorage.getItem('store_scroll_ratio')
    const savedRatio =
      savedRatioRaw !== null && savedRatioRaw !== ''
        ? Number(savedRatioRaw)
        : null

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const behavior: ScrollBehavior = prefersReduced ? 'auto' : 'smooth'

    const applyRestore = () => {
      const newMax = Math.max(el.scrollHeight - el.clientHeight, 0)
      let target = savedTop
      if (savedRatio !== null && newMax > 0) {
        target = Math.min(Math.max(Math.round(savedRatio * newMax), 0), newMax)
      } else {
        target = Math.min(target, newMax)
      }
      if ('scrollBehavior' in document.documentElement.style) {
        el.scrollTo({ top: target, behavior })
      } else {
        el.scrollTop = target
      }
    }

    // 多次尝试：rAF + interval，确保布局稳定
    applyRestore()
    const raf = requestAnimationFrame(applyRestore)
    const short = setTimeout(applyRestore, 32)
    const mid = setTimeout(applyRestore, 120)
    const long = setTimeout(applyRestore, 300)

    // 监听内容变动与图片加载
    const observer = new MutationObserver(() => applyRestore())
    observer.observe(el, { childList: true, subtree: true })
    const imgs = Array.from(el.querySelectorAll('img'))
    imgs.forEach(img => {
      if (!img.complete)
        img.addEventListener('load', applyRestore, { once: true })
    })

    // 清理并移除存储
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(short)
      clearTimeout(mid)
      clearTimeout(long)
      observer.disconnect()
      try {
        sessionStorage.removeItem('store_scroll_top')
        sessionStorage.removeItem('store_scroll_ratio')
        sessionStorage.removeItem('store_scroll_ts')
      } catch {}
    }
  }, [current])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between select-none w-full mt-[2px]">
        <div
          onClick={() => setTab('raffle')}
          className={`font-jersey-10 transition-opacity duration-200 ease-in-out font-[24px] leading-[22px] tracking-wide text-[#DEF5FF] ${
            current === 'raffle' ? 'opacity-100' : 'opacity-70 hover:opacity-90'
          }`}
          style={{ textShadow: '0 0 4px #6B0AE9' }}
        >
          <span className="ml-[23px] text-[13px] font-ibm-plex-mono leading-[22px] whitespace-nowrap">
            Raffle Ticket
          </span>
        </div>
        <div
          onClick={() => setTab('collector')}
          className={`font-jersey-10 transition-opacity duration-200 ease-in-out font-[24px] leading-[22px] tracking-wide ml-2 text-[#DEF5FF] ${
            current === 'collector'
              ? 'opacity-100'
              : 'opacity-70 hover:opacity-90'
          }`}
          style={{ textShadow: '0 0 4px #6B0AE9' }}
        >
          <span className="ml-[40px] text-[13px] font-ibm-plex-mono leading-[22px] whitespace-nowrap">
            Automatic Collector
          </span>
        </div>
      </div>
    </div>
  )
}
