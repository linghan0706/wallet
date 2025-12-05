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
//伪元素实现发光边框和内阴影效果
const NAV_WRAPPER_CLASS =
  "relative w-full max-w-[363px] mb-[14px] mx-auto h-[80px] flex items-center justify-center rounded-[25px] shadow-[0_12px_30px_rgba(5,5,16,0.65)] before:content-[''] before:absolute before:inset-0 before:rounded-[25px] before:opacity-80 before:bg-[linear-gradient(90deg,_#606070_0%,_#BC13FE_27%,_#00F0FF_45%,_#BC13FE_54%,_#B0B0C0_100%)] after:content-[''] after:absolute after:inset-[5px] after:rounded-[25px] after:bg-[radial-gradient(circle_at_20%_20%,_rgba(13,55,104,0.92)_0%,_rgba(13,55,104,0.8)_35%,_rgba(6,27,58,0.95)_100%)] after:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),_inset_0_-6px_18px_rgba(6,16,33,0.9)]"
const NAV_CONTENT_CLASS =
  'relative z-10 max-w-[363px] h-[80px] px-10 flex items-center justify-center mb-[14px]'

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

const buildCircleClasses = (isActive: boolean) => {
  const shadowClass = isActive
    ? 'shadow-[0px_0px_11px_#B0B0C0,_inset_0px_0px_9px_#B0B0C0]'
    : 'shadow-[0px_1px_1px_#FFFFFF,_0px_-1px_1px_#B0B0C0]'

  return [
    'box-border relative flex items-center justify-center rounded-full border border-white/25 transition-all duration-300 ease-in-out bg-[#0a1d3d]/90 w-[55px] h-[55px]',
    shadowClass,
  ].join(' ')
}

const buildCircleSurfaceStyle = (): CSSProperties => ({
  backgroundColor: 'rgba(10, 29, 61, 0.95)',
  backgroundImage:
    'linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45))',
})

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
      <div className={NAV_CONTENT_CLASS}>
        <nav className="flex items-center justify-center w-full gap-[9px] mt-3.5">
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
                <span
                  className={buildCircleClasses(isActive)}
                  style={buildCircleSurfaceStyle()}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none"
                    style={buildIconMaskStyle(item.icon, isActive)}
                  />
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
