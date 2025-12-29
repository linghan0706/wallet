'use client'
import MotionDiv from '@/components/motion/MotionDiv'
import Entrance from '@/components/baseCard/Entrance'
import ItemUsage from '@/components/baseCard/Item_UsageList'
import CentralCollector from '@/components/baseCard/Central_Collector'
export default function BasePage() {
  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 flex flex-col items-center justify-center">
      {/* 背景容器 */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black bg-cover bg-contain"
        style={{ backgroundImage: `url(/base/background/bg_blue_star.png)` }}
      ></div>

      {/* 主要内容 */}
      <div className="relative z-10 px-4 pt-10">
        <MotionDiv
          className="text-center py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Entrance />
        </MotionDiv>

        <MotionDiv
          className="text-center py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <CentralCollector />
        </MotionDiv>
        <MotionDiv
          className="text-center py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ItemUsage />
        </MotionDiv>
      </div>
    </div>
  )
}
