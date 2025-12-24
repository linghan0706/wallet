'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { tonConnectConfig } from '@/lib/ton-config'
import { useWallet } from '@/hooks/useWallet'
import { formatAddress } from '@/utils/format'
import { useWalletConnectModalStore } from '@/stores/walletConnectModalStore'
import Image from 'next/image'

type WalletState = ReturnType<typeof useWallet>

function WalletConnectModalContent({
  onClose,
  wallet,
}: {
  onClose: () => void
  wallet: WalletState
}) {
  const formattedBalance = useMemo(() => {
    if (wallet.balanceLoading) return 'Loading...'
    if (!wallet.balance) return '--'
    return `${Number(wallet.balance) / 1e9} TON`
  }, [wallet.balance, wallet.balanceLoading])

  const addressLabel = wallet.address
    ? formatAddress(wallet.address, 6, 4)
    : 'N/A'

  const networkLabel = wallet.network === 'testnet' ? 'Testnet' : 'Mainnet'

  return (
    <>
      <motion.div
        key="wallet-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="wallet-modal-content"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-sm rounded-xl border border-white/10 bg-[#111327] p-5 text-white shadow-xl">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wallet modal"
            className="absolute right-3 top-3 text-xs uppercase tracking-[0.14em] text-white/70 hover:text-white"
          >
            <Image
              src="/layout/close.png"
              alt="Close"
              width={15}
              height={15}
              className="object-contain"
            />
          </button>
          <div className="mb-4 text-center">
            <div className="font-orbitron text-sm uppercase tracking-[0.2em] text-white/80">
              Wallet Connection
            </div>
            <div className="mt-2 text-xs text-white/60">
              Manage your TON wallet connection.
            </div>
          </div>

          {wallet.isConnected ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Address</span>
                <span className="font-oxanium text-white">{addressLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Balance</span>
                <span className="font-oxanium text-white">
                  {formattedBalance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Network</span>
                <span className="font-oxanium text-white">{networkLabel}</span>
              </div>
              <button
                type="button"
                onClick={wallet.disconnect}
                disabled={wallet.isDisconnecting}
                className="mt-2 w-full rounded-md border border-red-400/50 bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {wallet.isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center text-sm">
              <div className="text-white/70">
                Connect your wallet to sync assets and activity.
              </div>
              <button
                type="button"
                onClick={wallet.connect}
                disabled={wallet.isConnecting}
                className="w-full rounded-md border border-cyan-300/50 bg-cyan-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

function WalletConnectModalInner({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const wallet = useWallet()

  return (
    <AnimatePresence>
      {isOpen && (
        <WalletConnectModalContent onClose={onClose} wallet={wallet} />
      )}
    </AnimatePresence>
  )
}

export default function WalletConnectModal() {
  const { isOpen, closeModal } = useWalletConnectModalStore()
  const [manifestUrl, setManifestUrl] = useState(tonConnectConfig.manifestUrl)

  useEffect(() => {
    if (!tonConnectConfig.manifestUrl) return
    if (isAbsoluteUrl(tonConnectConfig.manifestUrl)) return
    if (typeof window === 'undefined') return

    const resolveUrl = () => {
      try {
        const resolvedUrl = new URL(
          tonConnectConfig.manifestUrl,
          window.location.origin
        ).toString()
        setManifestUrl(resolvedUrl)
      } catch (error) {
        console.error('Failed to resolve TON manifest URL', error)
      }
    }

    // 使用 setTimeout 将 setState 调用移到下一个事件循环
    setTimeout(() => {
      resolveUrl()
    }, 0)
  }, [])

  if (!manifestUrl) {
    return null
  }

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl} restoreConnection>
      <WalletConnectModalInner isOpen={isOpen} onClose={closeModal} />
    </TonConnectUIProvider>
  )
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url)
}
