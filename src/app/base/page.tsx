'use client'
import MotionDiv from '@/components/motion/MotionDiv'
import Entrance from '@/components/baseCard/Entrance'

export default function BasePage() {
  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10">
      {/* 背景容器 */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black bg-cover bg-contain"
        style={{ backgroundImage: `url(/base/background/bg_blue_star.png)` }}
      ></div>

      {/* 主要内容 */}
      <div className="relative z-10 px-4 pt-6">
        <MotionDiv
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Entrance />
        </MotionDiv>
      </div>
    </div>
  )
}
