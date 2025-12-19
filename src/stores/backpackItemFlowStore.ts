'use client'

/**
 * 背包物品操作流程状态管理
 * 管理从 nosesection -> ItemDetailModal -> Confirm_again -> nosesectionResult 的流程状态
 */

import { create } from 'zustand'
import type { BackpackItem } from '@/components/backpackCard/SelectCard'
import type { ResultStatus } from '@/components/backpack_up/nosesectionResult'

type FlowStep = 'none' | 'detail' | 'confirm' | 'result'

/**
 * 处理图标路径，确保格式正确（去掉 public 前缀）
 */
const normalizeIconPath = (path: string | undefined): string => {
  if (!path) return ''
  let p = path
  const idx = p.toLowerCase().lastIndexOf('public')
  if (idx !== -1) {
    p = p.slice(idx + 'public'.length)
  }
  p = p.replace(/\\/g, '/')
  if (!p.startsWith('/')) p = `/${p}`
  return p
}

interface ItemFlowState {
  /** 当前流程步骤 */
  step: FlowStep

  /** 当前选中的物品 */
  currentItem: BackpackItem | null

  /** 当前操作类型 */
  actionType: 'use' | 'sell' | null

  /** 结果状态 */
  resultStatus: ResultStatus | null

  /** 结果描述 */
  resultDescription: string | null

  /** 打开详情弹窗 */
  openDetail: (item: BackpackItem, action: 'use' | 'sell') => void

  /** 进入确认弹窗 */
  goToConfirm: () => void

  /** 确认操作并进入结果页 */
  confirmAction: (status: ResultStatus, description?: string) => void

  /** 重置流程 */
  resetFlow: () => void
}

export const useItemFlowStore = create<ItemFlowState>(set => ({
  step: 'none',
  currentItem: null,
  actionType: null,
  resultStatus: null,
  resultDescription: null,

  openDetail: (item, action) =>
    set({
      step: 'detail',
      currentItem: {
        ...item,
        iconPath: normalizeIconPath(item.iconPath),
      },
      actionType: action,
      resultStatus: null,
      resultDescription: null,
    }),

  goToConfirm: () => set({ step: 'confirm' }),

  confirmAction: (status, description) =>
    set({
      step: 'result',
      resultStatus: status,
      resultDescription: description || null,
    }),

  resetFlow: () =>
    set({
      step: 'none',
      currentItem: null,
      actionType: null,
      resultStatus: null,
      resultDescription: null,
    }),
}))
