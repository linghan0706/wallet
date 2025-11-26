'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { tonConnectConfig } from '@/lib/ton-config'

export default function WalletPage() {
  const [manifestUrl, setManifestUrl] = useState(tonConnectConfig.manifestUrl)

  useEffect(() => {
    if (!tonConnectConfig.manifestUrl) return
    if (isAbsoluteUrl(tonConnectConfig.manifestUrl)) return
    if (typeof window === 'undefined') return

    try {
      const resolvedUrl = new URL(
        tonConnectConfig.manifestUrl,
        window.location.origin
      ).toString()
      setManifestUrl(resolvedUrl)
    } catch (error) {
      console.error('Failed to resolve TON manifest URL', error)
    }
  }, [])

  if (!manifestUrl) {
    return null
  }

  const NoSSRWalletConnect = dynamic(
    () => import('@/components/WalletConnect'),
    { ssr: false }
  )
  const NoSSRTelegramStarPay = dynamic(
    () => import('@/components/TelegramStarPay'),
    {
      ssr: false,
    }
  )

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl} restoreConnection>
      <div className="min-h-screen w-full flex flex-col gap-8 items-center justify-center p-4 mt-[56px]">
        {/* <NoSSRWalletConnect /> */}
        <NoSSRTelegramStarPay />
      </div>
    </TonConnectUIProvider>
  )
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url)
}
