'use client'
import MotionDiv from '@/components/motion/MotionDiv'
import { useEffect } from 'react'
import {
  retrieveLaunchParams,
  retrieveRawInitData,
} from '@telegram-apps/sdk-react'
import {
  getInitData,
  isTelegramEnvironment,
} from '@/telegramWebApp/telegrambot'
import { initData, telegramLogin } from '@/utils/api'
import Wallet from '@/app/wallet/page'
export default function HomePage() {
  useEffect(() => {
    const data = getInitData()

    console.log('Got Telegram InitData:', data)
    console.log('Formatted initData:', initData)
    if (isTelegramEnvironment()) {
      try {
        const lp = retrieveLaunchParams()
        console.log('SDK LaunchParams:', lp)
      } catch (e) {
        console.warn('Failed to read LaunchParams (ignored):', e)
      }
      let rawInit: string | null = null
      try {
        rawInit = retrieveRawInitData() || null
        console.log('SDK raw initData:', rawInit)
      } catch (e) {
        console.warn('Failed to read raw initData (ignored):', e)
      }

      if (rawInit) {
        telegramLogin()
          .then(res => {
            console.log('Telegram login result:', res)
            if (res.success) {
              console.log('Login successful, user data:', res.data)
            } else {
              console.log('Login failed:', res.message)
            }
          })
          .catch(err => {
            console.error('Telegram login error:', err)
          })
      } else {
        console.warn('No raw initData found, skipping login request.')
      }
    } else {
      console.warn(
        'Not in Telegram environment, skipping SDK parameter reading and login.'
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden pb-20">
      {/* 主要内容 */}
      <div className="relative z-10 px-4 pt-6">
        <MotionDiv
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* <h1 className="text-white text-2xl font-bold mb-4">个人中心</h1>
          <p className="text-gray-400">个人中心功能开发中...</p> */}
          <Wallet />
        </MotionDiv>
      </div>
    </div>
  )
}
