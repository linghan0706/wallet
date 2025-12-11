'use client'

/**
 * 背包弹窗全局状态管理
 * -give、shell、use三种状态管理
 * - 统一处理数据填充
 */

import { create } from 'zustand'
import type { BackpackItem } from '@/components/backpackCard/SelectCard'

export type ModalMode = 'none' | 'details' | 'gift' | 'result'
/** 操作结果 */
export type ResultStatus = 'use-success' | 'sell-success' | 'fail'

/** 结果弹窗结构 */
interface ResultPayload {
  /** 结果状态 */
  status: ResultStatus

  title?: string

  description?: string

  /** 展示图片地址 */
  imageSrc?: string
}

interface GiftPayload {
  defaultUsername?: string
  defaultAmount?: number
}

/** 背包弹窗状态结构与操作方法 */
interface BackpackModalState {
  /** 当前弹窗模式 */
  mode: ModalMode

  /** 当前选中的物品 */
  item: BackpackItem | null

  /** 当前结果弹窗的数据 */
  result: ResultPayload | null

  /** 当前赠送弹窗的默认数据 */
  gift: GiftPayload | null

  /** 打开道具弹窗 */
  openDetails: (item: BackpackItem) => void

  /** 打开give弹窗 */
  openGift: (payload?: GiftPayload) => void

  /** 打开shell、use结果弹窗 */
  openResult: (payload: ResultPayload) => void

  /** 重置状态none */
  close: () => void
}

/**
 * 背包弹窗状态仓库
 */
export const useBackpackModalStore = create<BackpackModalState>((set, get) => ({
  mode: 'none',
  item: null,
  result: null,
  gift: null,
  /** 设置当前物品并打开道具弹窗 */
  openDetails: item => set({ mode: 'details', item }),
  /** 打开give弹窗 */
  openGift: payload =>
    set(state => ({ mode: 'gift', gift: payload ?? state.gift })),
  openResult: payload => {
    const current = get()
    const name = current.item?.name ?? 'Item'
    const image = current.item?.iconPath
    const titleDefault =
      payload.title ??
      (payload.status === 'use-success'
        ? `${name} Successfully`
        : payload.status === 'sell-success'
          ? `${name} Successfully`
          : `${name} Failed`)
    const filled: ResultPayload = {
      status: payload.status,
      title: titleDefault,
      description: payload.description,
      imageSrc: payload.imageSrc ?? image,
    }
    set({ mode: 'result', result: filled })
  },
  close: () => set({ mode: 'none', item: null, result: null, gift: null }),
}))
