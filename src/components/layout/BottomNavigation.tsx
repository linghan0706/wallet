'use client'

import type { CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  id: string
  label: string
  path: string
  icon: string
  isCenter?: boolean
}
{
  /**
   * Todo list:
   * 1. 底部导航栏
   *     a.修改外层容器边边框，当前渐变效果不理想，且 伪元素 实现导致 边框大小过大。
           Figma样式导出：
             渐变层级：0%： #606070  100%，
                      27%: #BC13FE  100%,
                      45%: #00F0FF  100%,
                      54%: #BC13FE  100%,
                      100%: #B0b0C0 100%
            径向渐变（从左到右）：
                      0%：#FFFFFF     100%，
                      76% #00F0FF   100%，
                      100% #050510  100%

    2. 激活标签样式
        标签外部边框样式：
            描边：#FFFFFF 不透明度10%。
             断点 ： 0%：  #B0B0C0 100%，
                    27%： #FFFFFF 100%
                    45%： #00F0FF 100%
                    54%： #FFFFFF 100%
                    100%： #B0B0C0 100%
   *  
   *
   */
}
{
  /***移除伪类实现，采用多层背景堆叠实现 */
}

//最外层容器（导航栏）
const NAV_WRAPPER_CLASS =
  'relative w-full max-w-[363px] mb-[14px] mx-auto h-[80px] flex items-center justify-center rounded-[25px] shadow-[0_12px_30px_rgba(5,5,16,0.65)]'
const NAV_CONTENT_CLASS =
  'relative z-20 w-full max-w-[363px] h-[80px] px-10 flex items-center justify-center'

const navItems: NavItem[] = [
  {
    id: 'task',
    label: '待办事项',
    path: '/task',
    icon: '/layout/NavCion/task.png',
  },
  {
    id: 'store',
    label: '购物袋',
    path: '/store',
    icon: '/layout/NavCion/store.png',
  },
  {
    id: 'base',
    label: '火箭',
    path: '/base',
    icon: '/layout/NavCion/base.png',
    isCenter: true,
  },
  {
    id: 'backpack',
    label: '包裹',
    path: '/backpack',
    icon: '/layout/NavCion/backpack.png',
  },
  {
    id: 'home',
    label: '个人中心',
    path: '/home',
    icon: '/layout/NavCion/home.png',
  },
]
//标签激活样式处理
const buildCircleClasses = (isActive: boolean) => {
  const baseClasses =
    'box-border mx-auto flex-none relative flex items-center justify-center rounded-full border border-transparent transition-all duration-300 ease-in-out w-[55px] h-[55px]'

  if (isActive) {
    // 激活状态：使用内部阴影
    return `${baseClasses} shadow-[0px_0px_11px_#12425F,_inset_0px_0px_6px_#B0B0C0]`
  }

  // 非激活状态：使用默认阴影
  return `${baseClasses} shadow-[0px_1px_1px_#FFFFFF,_0px_-1px_1px_#12425F]`
}
//激活呼吸效果
const buildCircleSurfaceStyle = (isActive: boolean): CSSProperties =>
  isActive
    ? {
        backgroundImage:
          'radial-gradient(50% 50% at 50% 50%, rgba(5, 5, 16, 0.5) 0%, rgba(0, 240, 255, 0.5) 75.52%, rgba(5, 5, 16, 0.5) 100%)',
        mixBlendMode: 'normal',
      }
    : {
        backgroundColor: '#156583',
      }

const CIRCLE_SURFACE_CLASS =
  'box-border flex items-center justify-center w-full h-full rounded-full'

const buildIconMaskStyle = (
  icon: string,
  isActive: boolean
): CSSProperties => ({
  width: 55,
  height: 55,
  display: 'inline-block',
  backgroundImage: `url(${icon})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: '55px 55px',
  ...(isActive
    ? {}
    : {
        filter: 'brightness(0.35) saturate(0.8)',
      }),
})

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className={NAV_WRAPPER_CLASS}>
      {/* 线性渐变边框样式 */}
      <div className="absolute inset-0 rounded-[24px] opacity-80 bg-[linear-gradient(90deg,_#606070_0%,_#BC13FE_27%,_#00F0FF_45%,_#BC13FE_54%,_#B0B0C0_100%)]"></div>

      {/* 径向渐变背景层 */}
      <div className="absolute inset-[4px] rounded-[24px] bg-[radial-gradient(ellipse_at_center,_#FFFFFF_0%,_#00F0FF_76%,_#050510_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),_inset_0_-6px_18px_rgba(6,16,33,0.9)]"></div>

      {/* #1A1A40半透明遮罩层 */}
      <div className="absolute inset-[4px] rounded-[24px] bg-[#1A1A40] opacity-72"></div>

      <div className={NAV_CONTENT_CLASS}>
        <nav className="flex items-center justify-center w-full gap-[9px]">
          {navItems.map(item => {
            const isActive =
              pathname === item.path ||
              (item.path === '/base' && pathname === '/')

            return (
              <Link
                key={item.id}
                href={item.path}
                prefetch={false}
                aria-label={item.label}
                className="flex items-center justify-center"
              >
                <span className="relative">
                  {/* 激活状态的渐变边框 */}
                  {isActive && (
                    <>
                      <div className="absolute inset-[-4px] rounded-full bg-[linear-gradient(90deg,_#B0B0C0_0%,_#FFFFFF_27%,_#00F0FF_45%,_#FFFFFF_54%,_#B0B0C0_100%)] pointer-events-none -z-10"></div>
                      <div className="absolute inset-[0px] rounded-full bg-[#156583] pointer-events-none -z-10"></div>
                    </>
                  )}
                  <span className={buildCircleClasses(isActive)}>
                    <span
                      className={CIRCLE_SURFACE_CLASS}
                      style={buildCircleSurfaceStyle(isActive)}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none"
                        style={buildIconMaskStyle(item.icon, isActive)}
                      />
                    </span>
                  </span>
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
