'use client'

import { ErrorBoundary } from '@/components/ui'
import BottomNavigation from '@/components/layout/BottomNavigation'
import UserHeader from '@/components/layout/UserHeader'
interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      {/* 响应式容器 - 移动端铺满屏幕，大屏幕居中显示 */}
      <div className="h-screen w-full sm:max-w-md lg:max-w-lg xl:max-w-xl sm:h-[600px] lg:h-[700px] xl:h-[800px] rounded-none sm:rounded-2xl shadow-2xl relative overflow-hidden">
        {/* 顶部用户头部 - 绝对定位，浮动在内容之上 */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <UserHeader />
        </div>

        {/* 内容区域 - 可以滚动到导航栏下方，position-relative 确保内部背景图正确定位 */}
        <div className="h-full w-full overflow-auto relative">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>

        {/* 底部导航栏 - 绝对定位固定在底部 */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}
