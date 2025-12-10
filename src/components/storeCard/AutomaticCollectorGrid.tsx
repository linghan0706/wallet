'use client'

import { PropCard } from './PropCard'
import { emitPurchase } from '@/lib/purchaseBus'
{
  /**
   * 商店接口
  前端获取json格式
    {
      title:string,  
      validity_period?: number // 有效期，天
      ceiling?: number // 上限，百分比或数值
      icon?: string // 图标 url 从定义前端图片资源路径获取 
  */
}
interface GridItem {
  title: string
  validity_period?: number // 有效期，天
  ceiling?: number // 上限，百分比或数值
  icon?: string // 图标 url
}
interface AutomaticCollectorGridProps {
  items?: GridItem[]
  loading?: boolean
  emptyMessage?: string
  onPurchase?: (payload: { id?: string; icon?: string; title?: string }) => void
}

export default function AutomaticCollectorGrid({
  items = [
    {
      title: 'Primary',
      validity_period: 3,
      ceiling: 50,
      icon: '/stores/AutomaticCollector/primary.svg',
    },
    {
      title: 'Intermediate',
      validity_period: 3,
      ceiling: 50,
      icon: '/stores/AutomaticCollector/intermediate.svg',
    },
    {
      title: 'Advanced',
      validity_period: 3,
      ceiling: 50,
      icon: '/stores/AutomaticCollector/advanced.svg',
    },
    {
      title: 'Super',
      validity_period: 3,
      ceiling: 50,
      icon: '/stores/AutomaticCollector/super.svg',
    },
  ],
  loading = false,
  emptyMessage = 'No collectors available',
  onPurchase,
}: AutomaticCollectorGridProps) {
  return (
    <div
      role="grid"
      aria-busy={loading}
      className="grid grid-cols-2 justify-items-center gap-x-4 sm:gap-x-6 gap-y-5 sm:gap-y-8 w-full max-w-[380px] sm:max-w-[400px] mx-auto px-1.5 overflow-hidden"
    >
      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="w-full h-[170px] sm:h-[180px] rounded-[16px] border border-white/10 bg-white/10 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            aria-hidden
          />
        ))}

      {!loading && items.length === 0 && (
        <div className="col-span-full text-center text-white/85 font-jersey-25 text-[16px] sm:text-[18px] py-5 rounded-[12px] border border-white/10 bg-gradient-to-br from-[#2A215D]/60 to-[#221A4C]/60">
          {emptyMessage}
        </div>
      )}

      {!loading &&
        items.length > 0 &&
        items.map(item => (
          <PropCard
            key={item.title}
            title={item.title}
            validity={`Validity: ${item.validity_period ?? 3} Days`}
            dailyCap={`Daily Energy Cap +${item.ceiling ?? 50}%`}
            icon={item.icon}
            onPurchase={payload => {
              const p = payload ?? {
                id: item.title,
                icon: item.icon,
                title: item.title,
              }
              if (onPurchase) onPurchase(p)
              else emitPurchase(p)
            }}
          />
        ))}
    </div>
  )
}
