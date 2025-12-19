'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  LayoutBounds,
  TRANSITION_CONFIG,
  calculateAvoidancePosition,
  getResponsiveSpacing,
  validateLayout,
} from '@/utils/GuideUtils'

interface UseLayoutManagerProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  mainIconRef: React.RefObject<HTMLDivElement | null>
  titleAreaRef: React.RefObject<HTMLDivElement | null>
  svgElementRef: React.RefObject<SVGSVGElement | null>
}

interface LayoutState {
  containerBounds: LayoutBounds
  mainIconBounds: LayoutBounds
  titleAreaBounds: LayoutBounds
  svgElementBounds: LayoutBounds
  hasCollisions: boolean
  adjustedPositions: Map<string, LayoutBounds>
}

export function useLayoutManager({
  containerRef,
  mainIconRef,
  titleAreaRef,
  svgElementRef,
}: UseLayoutManagerProps) {
  const [layoutState, setLayoutState] = useState<LayoutState>({
    containerBounds: { x: 0, y: 0, width: 0, height: 0 },
    mainIconBounds: { x: 0, y: 0, width: 0, height: 0 },
    titleAreaBounds: { x: 0, y: 0, width: 0, height: 0 },
    svgElementBounds: { x: 0, y: 0, width: 0, height: 0 },
    hasCollisions: false,
    adjustedPositions: new Map(),
  })

  const [screenWidth, setScreenWidth] = useState(0)
  const isTransitioningRef = useRef(false)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  //获取元素边界信息
  const getBounds = useCallback(
    (element: HTMLElement | SVGSVGElement | null): LayoutBounds => {
      if (!element) return { x: 0, y: 0, width: 0, height: 0 }

      const rect = element.getBoundingClientRect()
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      }
    },
    []
  )

  // 更新布局状态
  const updateLayoutState = useCallback(() => {
    const container = containerRef.current
    const mainIcon = mainIconRef.current
    const titleArea = titleAreaRef.current
    const svgElement = svgElementRef.current

    if (!container) return

    const containerBounds = getBounds(container)
    const mainIconBounds = getBounds(mainIcon)
    const titleAreaBounds = getBounds(titleArea)
    const svgElementBounds = getBounds(svgElement)

    // 检测碰撞
    const elements = [mainIconBounds, titleAreaBounds, svgElementBounds].filter(
      bounds => bounds.width > 0 && bounds.height > 0
    )

    const validation = validateLayout(elements)
    const minDistance = getResponsiveSpacing(screenWidth)

    // 计算调整后的位置
    const adjustedPositions = new Map<string, LayoutBounds>()

    if (!validation.isValid) {
      // 如果检测到碰撞，计算避让位置
      validation.conflicts.forEach(conflict => {
        const element1 = elements[conflict.element1]
        const element2 = elements[conflict.element2]

        // 优先保持主图标位置不变，调整其他元素
        if (conflict.element1 === 0) {
          // 主图标是第一个元素
          const adjustedPos = calculateAvoidancePosition(
            element2,
            element1,
            containerBounds,
            minDistance
          )
          adjustedPositions.set(`element-${conflict.element2}`, adjustedPos)
        } else if (conflict.element2 === 0) {
          const adjustedPos = calculateAvoidancePosition(
            element1,
            element2,
            containerBounds,
            minDistance
          )
          adjustedPositions.set(`element-${conflict.element1}`, adjustedPos)
        }
      })
    }

    setLayoutState({
      containerBounds,
      mainIconBounds,
      titleAreaBounds,
      svgElementBounds,
      hasCollisions: !validation.isValid,
      adjustedPositions,
    })
  }, [
    containerRef,
    mainIconRef,
    titleAreaRef,
    svgElementRef,
    getBounds,
    screenWidth,
  ])

  // 应用布局调整
  const applyLayoutAdjustments = useCallback(async () => {
    if (layoutState.adjustedPositions.size === 0 || isTransitioningRef.current)
      return

    isTransitioningRef.current = true

    //应用平滑过渡动画
    const promises: Promise<void>[] = []

    layoutState.adjustedPositions.forEach((bounds, elementKey) => {
      const promise = new Promise<void>(resolve => {
        const element = document.querySelector(
          `[data-layout-key="${elementKey}"]`
        ) as HTMLElement
        if (!element) {
          resolve()
          return
        }

        // 应用过渡样式
        element.style.transition = `transform ${TRANSITION_CONFIG.duration}ms ${TRANSITION_CONFIG.easing}`
        element.style.transform = `translate(${bounds.x}px, ${bounds.y}px)`

        setTimeout(() => {
          resolve()
        }, TRANSITION_CONFIG.duration)
      })

      promises.push(promise)
    })

    await Promise.all(promises)
    isTransitioningRef.current = false
  }, [layoutState.adjustedPositions])

  // 重置布局
  const resetLayout = useCallback(() => {
    const elements = document.querySelectorAll('[data-layout-key]')
    elements.forEach(element => {
      const htmlElement = element as HTMLElement
      htmlElement.style.transition = `transform ${TRANSITION_CONFIG.duration}ms ${TRANSITION_CONFIG.easing}`
      htmlElement.style.transform = 'translate(0px, 0px)'
    })

    setTimeout(() => {
      setLayoutState(prev => ({
        ...prev,
        adjustedPositions: new Map(),
        hasCollisions: false,
      }))
      isTransitioningRef.current = false
    }, TRANSITION_CONFIG.duration)
  }, [])

  // 监听屏幕尺寸变化
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 设置ResizeObserver监听元素尺寸变化
  useEffect(() => {
    if (!containerRef.current) return

    resizeObserverRef.current = new ResizeObserver(() => {
      updateLayoutState()
    })

    const elementsToObserve = [
      containerRef.current,
      mainIconRef.current,
      titleAreaRef.current,
      svgElementRef.current,
    ].filter(Boolean)

    elementsToObserve.forEach(element => {
      if (element && resizeObserverRef.current) {
        resizeObserverRef.current.observe(element)
      }
    })

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [
    containerRef,
    mainIconRef,
    titleAreaRef,
    svgElementRef,
    updateLayoutState,
  ])

  // 当检测到碰撞时自动应用调整
  useEffect(() => {
    if (layoutState.hasCollisions && !isTransitioningRef.current) {
      applyLayoutAdjustments()
    }
  }, [layoutState.hasCollisions, applyLayoutAdjustments])

  return {
    layoutState,
    screenWidth,
    minSafeDistance: getResponsiveSpacing(screenWidth),
    applyLayoutAdjustments,
    resetLayout,
    updateLayoutState,
  }
}
