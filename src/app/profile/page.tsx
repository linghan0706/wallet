'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MotionDiv from '@/components/motion/MotionDiv'
import AssetsOverview from '@/components/profileCard/AssetsOverView'
import WalletConnect from '@/components/profileCard/WalletConnect'
import WalletConnectModal from '@/components/profileCard/WalletConnectModal'
import BadgeShow from '@/components/profileCard/BadgeShow'
import InviteLink from '@/components/profileCard/InviteLink'
import Ranking from '@/components/profileCard/Ranking'

export default function ProfilePage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // 检查是否有hash值
    if (window.location.hash === '#ranking') {
      const rankingElement = document.getElementById('ranking')
      if (rankingElement) {
        // 等待页面渲染完成后滚动到锚点
        setTimeout(() => {
          rankingElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }, 100)
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10">
      {/* 背景容器 */}
      <div
        className="fixed inset-0 bg-cover bg-contain"
        style={{ backgroundImage: `url(/layout/background.png)` }}
      ></div>

      {/* 主要内容 */}
      <div className="relative z-10 px-4 pt-6 flex flex-col items-center">
        <MotionDiv
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AssetsOverview />
          <WalletConnect />
          <BadgeShow />
          <InviteLink />
          <div id="ranking">
            <Ranking
              defaultTab={
                (searchParams.get('tab') as 'history' | 'power' | 'nova') ||
                'power'
              }
            />
          </div>
        </MotionDiv>
        <WalletConnectModal />
      </div>
    </div>
  )
}
