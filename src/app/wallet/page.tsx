'use client'

import { useEffect, useState } from 'react'
import { Web3ConfigProvider } from '@ant-design/web3'
import dynamic from 'next/dynamic'
import { TonWeb3ConfigProvider, CHAIN as TON_CHAIN } from '@ant-design/web3-ton'
import {
  TonConnectUIProvider,
  CHAIN as TON_CHAIN_UI,
} from '@tonconnect/ui-react'
import WalletConnect from '@/components/WalletConnect'

function useManifestUrl() {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    const manifest = {
      url: 'http://localhost',
      name: 'Nova Explorer',
      iconUrl: 'https://web3.antdigital.dev/favicon.png',
    }
    try {
      const dataUrl =
        'data:application/json;base64,' + btoa(JSON.stringify(manifest))
      setUrl(dataUrl)
    } catch {
      setUrl(null)
    }
  }, [])
  return url
}

export default function WalletPage() {
  const manifestUrl = useManifestUrl()
  if (!manifestUrl) return null

  const NoSSRWalletConnect = dynamic(() => Promise.resolve(WalletConnect), {
    ssr: false,
  })

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      chain={TON_CHAIN_UI.MAINNET}
      reconnect
    >
      <TonWeb3ConfigProvider
        manifestUrl={manifestUrl}
        chain={TON_CHAIN.MAINNET}
        reconnect
      >
        <Web3ConfigProvider>
          <div className="min-h-screen w-full flex items-center justify-center p-4">
            <NoSSRWalletConnect />
          </div>
        </Web3ConfigProvider>
      </TonWeb3ConfigProvider>
    </TonConnectUIProvider>
  )
}
