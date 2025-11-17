import React from 'react'
import { useBackpackModalStore } from '@/stores/backpackModalStore'

export type BackpackCategory = 'all' | 'stage' | 'collector' | 'other'

export type SelectOption = {
  label: string
  value: BackpackCategory
}

export interface BackpackItem {
  name: string
  quantity: number
  iconPath: string
  category: BackpackCategory
}

export type SortKey = 'name' | 'quantity'
export type SortOrder = 'asc' | 'desc'

export type SelectCardProps = {
  options?: SelectOption[]
  value?: BackpackCategory | string
  onChange?: (value: BackpackCategory | string) => void
  className?: string
  items?: BackpackItem[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  sortKey?: SortKey
  sortOrder?: SortOrder
}

const iconCache = new Map<string, boolean>()

function useIconStatus(src: string) {
  const [status, setStatus] = React.useState<'idle' | 'loaded' | 'error'>(
    'idle'
  )
  React.useEffect(() => {
    if (iconCache.get(src)) {
      setStatus('loaded')
      return
    }
    const img = new Image()
    img.onload = () => {
      iconCache.set(src, true)
      setStatus('loaded')
    }
    img.onerror = () => {
      setStatus('error')
    }
    img.src = src
  }, [src])
  return status
}

type ItemCardProps = {
  item: BackpackItem
  selected: boolean
  onToggle: () => void
}

const ItemCard: React.FC<ItemCardProps> = ({ item, selected, onToggle }) => {
  const srcPath = React.useMemo(() => {
    let p = item.iconPath || ''
    const idx = p.toLowerCase().lastIndexOf('public')
    if (idx !== -1) {
      p = p.slice(idx + 'public'.length)
    }
    p = p.replace(/\\/g, '/')
    if (!p.startsWith('/')) p = `/${p}`
    return p
  }, [item.iconPath])
  const status = useIconStatus(srcPath)
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      className={[
        'relative group select-card__focus flex-none basis-[115px] w-[115px] h-[149px] rounded-[12px] bg-transparent',
        'flex flex-col items-center gap-[10px] select-none',
        'transition-transform duration-200 ease-[cubic-bezier(.22,.61,.36,1)]',
        'hover:translate-y-[1px] active:scale-[0.98]',
        selected ? 'ring-2 ring-[#6B0AE9]/80 ring-offset-0' : 'ring-0',
      ].join(' ')}
      data-testid="select-card-item"
    >
      <div
        className="absolute inset-0 rounded-[12px] pointer-events-none z-0"
        style={{
          background: 'rgba(67,42,133,0.6)',
          border: '1px solid rgba(110,110,110,0.7)',
        }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center gap-[10px] w-full h-full pt-[6px]">
        <div className="w-[99px] h-[100px] rounded-[12px] flex flex-col items-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] bg-[linear-gradient(0deg,#221A4C,#221A4C),linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)]">
          <div
            className="w-[64px] h-[64px] mt-[12px] overflow-hidden flex items-center justify-center"
            aria-hidden
          >
            {status === 'error' ? (
              <div className="w-[64px] h-[64px] rounded bg-[#1A0B2E]" />
            ) : (
              <img
                src={srcPath}
                alt={item.name}
                className="w-[64px] h-[64px] object-contain"
                loading="lazy"
              />
            )}
          </div>
          <div
            className="select-card__title font-jersey-10 text-white text-[14px] leading-[22px] text-center mt-[6px]"
            data-testid="select-card-item-name"
          >
            {item.name}
          </div>
        </div>
        <div
          className={[
            'w-[99px] h-[32px] rounded-[8px] flex flex-col justify-center items-center p-[6px]',
            'bg-[linear-gradient(0deg,#221A4C,#221A4C),linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)] shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-opacity duration-200',
            selected ? 'opacity-100' : 'opacity-95 group-hover:opacity-100',
          ].join(' ')}
          data-testid="select-card-quantity"
          aria-label={`Quantity ${item.quantity}`}
        >
          <span className="font-jersey-25 text-white text-[16px] leading-[22px] text-center">
            X{item.quantity}
          </span>
        </div>
      </div>
    </div>
  )
}

const SelectCard: React.FC<SelectCardProps> = ({
  options,
  value = 'all',
  onChange,
  className,
  items = [],
  loading = false,
  error = null,
  onRetry,
  sortKey = 'name',
  sortOrder = 'asc',
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const { openDetails } = useBackpackModalStore()
  const filtered = React.useMemo(() => {
    const v = value as BackpackCategory
    const list = v === 'all' ? items : items.filter(i => i.category === v)
    return [...list].sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir
      if (sortKey === 'quantity') return (a.quantity - b.quantity) * dir
      return 0
    })
  }, [items, value, sortKey, sortOrder])
  return (
    <>
      <section
        className={[
          'w-full max-w-[361px] rounded-[14px]',
          'flex flex-col gap-3',
          'shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
          className ?? '',
          'border border-solid border-[#6A0BE2]',
        ].join(' ')}
        aria-label="Select card"
        data-testid="select-card"
      >
        <div
          role="tablist"
          aria-label="Select category"
          className="w-full max-w-[361px] h-[37px] rounded-[14px] bg-[rgba(15,21,43,0.5)]  flex items-center justify-center gap-3"
          data-testid="select-category-tablist"
        >
          {options?.map(opt => {
            const selected = opt.value === value
            return (
              <button
                key={opt.value}
                role="tab"
                aria-selected={selected}
                onClick={() => onChange?.(opt.value)}
                data-testid={`select-option-${opt.value}`}
                className={[
                  'min-w-[80px] h-[29px] rounded-[43px] inline-flex items-center justify-center font-exo2 font-medium text-[14px] leading-[23px] text-center',
                  'transition-transform transition-opacity duration-300 ease-[cubic-bezier(.22,.61,.36,1)]',
                  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                  selected
                    ? 'text-white bg-[linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)] scale-100 opacity-100'
                    : 'text-[#90A1B9] bg-transparent scale-95 opacity-90',
                ].join(' ')}
                style={{
                  willChange: 'transform, opacity',
                  touchAction: 'manipulation',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </section>
      <div className="flex items-start w-full max-w-[361px]">
        <div
          data-testid="select-card-items-parent"
          className="mt-[1px] w-[361px]"
        >
          {loading && (
            <div
              className="grid grid-cols-3 grid-flow-row gap-2 p-0 justify-items-start"
              data-testid="select-card-loading"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="relative flex-none basis-[115px] w-[115px] h-[149px] rounded-[12px] bg-[rgba(67,42,133,0.3)] animate-pulse"
                />
              ))}
            </div>
          )}
          {!loading && error && (
            <div
              className="p-4 text-center text-[#90A1B9]"
              data-testid="select-card-error"
            >
              <div className="mb-2">{error}</div>
              <button
                onClick={onRetry}
                className="min-w-[80px] h-[29px] rounded-[43px] px-4 text-white bg-[linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)]"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div
              className="p-4 text-center text-[#90A1B9]"
              data-testid="select-card-empty"
            >
              No items
            </div>
          )}
          {!loading && !error && filtered.length > 0 && (
            <div
              data-testid="select-card-grid"
              className="grid grid-cols-3 grid-flow-row gap-2 p-0 justify-items-start"
            >
              {filtered.map((it, idx) => {
                const selected = activeIndex === idx
                return (
                  <ItemCard
                    key={`${it.name}-${idx}`}
                    item={it}
                    selected={selected}
                    onToggle={() => {
                      setActiveIndex(selected ? null : idx)
                      openDetails(it)
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SelectCard
