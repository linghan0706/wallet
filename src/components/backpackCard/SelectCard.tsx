import React from 'react'
import { useBackpackModalStore } from '@/stores/backpackModalStore'

// 背包物品分类类型定义
// /* Heading/Oxanium */
// font-family: 'Oxanium';
// font-style: normal;
// font-weight: 300;
// font-size: 10px;
// line-height: 12px;
// /* identical to box height */
// text-align: center;
// letter-spacing: 0.04em;
// text-transform: uppercase;
//
// color: #BC13FE;

export type BackpackCategory = 'all' | 'stage' | 'collector' | 'other'

// 选择选项类型定义
export type SelectOption = {
  label: string
  value: BackpackCategory
}

// 背包物品类型定义
export interface BackpackItem {
  name: string
  quantity: number
  iconPath: string
  category: BackpackCategory
}

// 排序键和排序顺序类型定义
export type SortKey = 'name' | 'quantity'
export type SortOrder = 'asc' | 'desc'

// 选择卡片组件属性定义
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

// 图标缓存，用于存储已加载的图标状态
const iconCache = new Map<string, boolean>()

// 自定义Hook：用于检测图片加载状态
function useIconStatus(src: string) {
  const [status, setStatus] = React.useState<'idle' | 'loaded' | 'error'>(
    'idle'
  )
  React.useEffect(() => {
    // 如果图标已在缓存中，直接设置为已加载状态
    if (iconCache.get(src)) {
      setStatus('loaded')
      return
    }
    // 创建新的图片对象来检测加载状态
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

// 物品卡片属性定义
type ItemCardProps = {
  item: BackpackItem
  selected: boolean
  onToggle: () => void
}

// 物品卡片组件：显示单个背包物品
const ItemCard: React.FC<ItemCardProps> = ({ item, selected, onToggle }) => {
  // 处理图标路径，确保格式正确
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

  // 获取图标加载状态
  const status = useIconStatus(srcPath)

  // 框架颜色常量
  const FRAME_COLOR = '#00F0FF'

  return (
    // 物品卡片容器，支持键盘操作和点击事件
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
        'group relative w-[100px] h-[100px] select-none cursor-pointer',
        'transition-transform duration-150 ease-out',
        selected ? 'scale-[1.02]' : 'scale-100',
      ].join(' ')}
      data-testid="select-card-item"
      style={{ touchAction: 'manipulation', isolation: 'isolate' }}
    >
      {/* 卡片框架样式 - 使用渐变边框 */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(11, 26, 60, 0.65)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          padding: '1px', // 边框厚度
          background:
            'linear-gradient(135deg, #00F0FF 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0) 60%, #00F0FF 100%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          boxSizing: 'border-box',
        }}
      />

      {/* 卡片内容区域 */}
      <div className="relative z-[1] w-full h-full flex flex-col">
        <div className="absolute left-1/2 -translate-x-1/2 top-[10px] h-[54px] w-[76px] flex items-center justify-center">
          {status === 'error' ? (
            <div className="w-[48px] h-[48px] bg-[#0B122C]" />
          ) : (
            <img
              src={srcPath}
              alt={item.name}
              className="w-[48px] h-[48px] object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.25)]"
              loading="lazy"
            />
          )}
        </div>

        <div
          className="absolute left-[70px] top-[61px] w-[30px] h-[16px] inline-flex justify-center items-center overflow-hidden"
          style={{
            border: `1px solid ${FRAME_COLOR}`,
            boxShadow: '0 0 6px rgba(0, 240, 255, 0.25)',
            background: 'rgba(11, 26, 60, 0.5)',
          }}
        >
          <span
            className="text-center text-white text-[10px] font-light font-oxanium leading-[12px]"
            style={{
              textShadow: '0px 0px 1px #BC13FE',
              letterSpacing: '0.04em',
            }}
            data-testid="select-card-quantity"
            aria-label={`Quantity ${item.quantity}`}
          >
            {item.quantity}
          </span>
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[8px] w-full h-[16px]  text-center"
          data-testid="select-card-item-name"
          style={{
            borderTop: '1px solid #00F0FF',
          }}
        >
          <span
            className="text-white text-[10px] font-light font-oxanium leading-[12px] inline-block w-full"
            style={{
              textShadow: '0px 0px 1px #BC13FE',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.04em',
            }}
          >
            {item.name}
          </span>
        </div>
      </div>
    </div>
  )
}

// 选择卡片主组件：包含分类筛选和物品展示
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
  // 当前选中的物品索引状态
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  // 使用背包模态框状态管理
  const { openDetails } = useBackpackModalStore()

  // 根据分类和排序条件过滤并排序物品
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

  const baseButtonClass =
    'w-[60px] h-[30px] inline-flex items-center justify-center font-oxanium font-light text-[10px] leading-[12px] text-center uppercase transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

  // 应用字体样式：Oxanium字体，字号10px，行高12px，字重300，字母间距0.04em，全大写，居中对齐，颜色为#BC13FE

  const getButtonStateClass = (
    category: BackpackCategory | string,
    selected: boolean
  ) => {
    if (selected) {
      if (category === 'all') {
        return 'bg-[#BC13FE] text-white border border-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] scale-100'
      }
      if (category === 'stage') {
        return 'bg-[#00F0FF] text-white border border-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] scale-100'
      }
      return 'bg-[#B0B0C0] text-white border border-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] scale-100'
    }

    if (category === 'all') {
      return 'bg-transparent text-[#BC13FE] border border-[#BC13FE]'
    }
    if (category === 'stage') {
      return 'bg-transparent text-[#00F0FF] border border-[#00F0FF]'
    }
    return 'bg-transparent text-[#B0B0C0] border border-[#B0B0C0]'
  }

  return (
    <>
      {/* 分类筛选选项卡区域 */}
      <section
        className={[
          'w-full max-w-[363px]',
          'flex flex-col gap-3',
          className ?? '',
        ].join(' ')}
        aria-label="Select card"
        data-testid="select-card"
      >
        <div
          role="tablist"
          aria-label="Select category"
          className="w-full max-w-[363px] h-[40px] flex items-center justify-between px-[10px] gap-[10px]"
          data-testid="select-category-tablist"
        >
          {options?.map(opt => {
            const selected = opt.value === value
            return (
              // 分类选项按钮
              <button
                key={opt.value}
                role="tab"
                aria-selected={selected}
                onClick={() => onChange?.(opt.value)}
                data-testid={`select-option-${opt.value}`}
                className={[
                  baseButtonClass,
                  getButtonStateClass(opt.value, selected),
                ].join(' ')}
                style={{
                  willChange: 'transform, opacity',
                  touchAction: 'manipulation',
                  letterSpacing: '0.04em',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* 物品展示区域 */}
      <div className="flex items-start w-full max-w-[363px]">
        <div
          data-testid="select-card-items-parent"
          className="mt-[1px] w-[363px]"
        >
          {/* 加载状态显示 */}
          {loading && (
            <div
              className="grid grid-cols-3 grid-flow-row gap-2 p-0 justify-items-start"
              data-testid="select-card-loading"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="relative flex-none basis-[100px] w-[100px] h-[100px] animate-pulse"
                />
              ))}
            </div>
          )}

          {/* 错误状态显示 */}
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

          {/* 空状态显示 */}
          {!loading && !error && filtered.length === 0 && (
            <div
              className="p-4 text-center text-[#90A1B9]"
              data-testid="select-card-empty"
            >
              No items
            </div>
          )}

          {/* 物品列表显示 */}
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
