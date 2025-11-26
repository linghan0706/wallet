'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { CHAIN } from '@tonconnect/ui'
import { beginCell } from '@ton/core'
import { useWalletStore } from '@/stores/useWalletStore'
import { tonService } from '@/services'
import { message } from 'antd'
import { recordWalletTransaction } from '@/utils'

export function useWallet() {
  const [tonConnectUI] = useTonConnectUI()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)

  const {
    isConnected,
    address,
    balance,
    network,
    connectWallet,
    disconnectWallet,
    updateBalance,
    setNetwork,
  } = useWalletStore()

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      await tonConnectUI.connectWallet()
      message.success('Wallet connected successfully.')
    } catch (error) {
      setIsConnecting(false)
      message.error('Wallet connection failed, please try again.')
      console.error('Wallet connection error:', error)
    }
  }, [tonConnectUI])

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      setIsDisconnecting(true)
      await tonConnectUI.disconnect()
      message.success('Wallet disconnected.')
    } catch (error) {
      setIsDisconnecting(false)
      message.error('Failed to disconnect wallet.')
      console.error('Wallet disconnection error:', error)
    }
  }, [tonConnectUI])

  // Fetch balance
  const fetchBalance = useCallback(
    async (walletAddress?: string) => {
      const targetAddress = walletAddress || address
      if (!targetAddress) return

      try {
        setBalanceLoading(true)
        const response = await tonService.getBalance(targetAddress)

        if (response.success && response.data) {
          updateBalance(response.data)
        } else {
          console.error('Failed to fetch balance:', response.error)
          message.error('Failed to fetch balance.')
        }
      } catch (error) {
        console.error('Balance fetch error:', error)
        message.error('Failed to fetch balance.')
      } finally {
        setBalanceLoading(false)
      }
    },
    [address, updateBalance]
  )

  const fetchBalanceRef = useRef(fetchBalance)

  useEffect(() => {
    fetchBalanceRef.current = fetchBalance
  }, [fetchBalance])

  const mapChainToNetwork = useCallback((chain?: string | null) => {
    if (chain === CHAIN.TESTNET) return 'testnet' as const
    return 'mainnet' as const
  }, [])

  // Watch wallet status changes
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      if (wallet) {
        const walletNetwork = mapChainToNetwork(wallet.account.chain)
        setNetwork(walletNetwork)
        connectWallet(wallet.account.address)
        // Fetch balance after successful connection
        fetchBalanceRef.current(wallet.account.address)
      } else {
        disconnectWallet()
      }
      setIsConnecting(false)
      setIsDisconnecting(false)
    })

    return unsubscribe
  }, [
    tonConnectUI,
    connectWallet,
    disconnectWallet,
    fetchBalanceRef,
    mapChainToNetwork,
    setNetwork,
  ])

  // Refresh balance
  const refreshBalance = useCallback(() => {
    if (address) {
      fetchBalance(address)
    }
  }, [address, fetchBalance])

  // Switch network
  const switchNetwork = useCallback(
    (newNetwork: 'mainnet' | 'testnet') => {
      setNetwork(newNetwork)
      // Refresh balance after switching network
      if (address) {
        fetchBalance(address)
      }
    },
    [address, setNetwork, fetchBalance]
  )

  // Build transaction payload
  const buildPayload = (comment?: string) => {
    if (!comment) return undefined
    try {
      const cell = beginCell()
        .storeUint(0, 32)
        .storeStringTail(comment)
        .endCell()
      return cell.toBoc().toString('base64')
    } catch (error) {
      console.warn('Failed to encode comment payload', error)
      return undefined
    }
  }

  const sendTransaction = useCallback(
    async (transaction: {
      to: string
      amount: string
      comment?: string
      payload?: string
    }) => {
      if (!tonConnectUI.connected) {
        message.error('Please connect your wallet first.')
        return { success: false, error: 'Wallet not connected' }
      }

      try {
        const result = await tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes expiry
          messages: [
            {
              address: transaction.to,
              amount: transaction.amount,
              payload: transaction.payload ?? buildPayload(transaction.comment),
            },
          ],
        })

        let txHash: string | undefined

        try {
          const record = recordWalletTransaction({
            boc: result.boc,
            sender: address ?? tonConnectUI.account?.address ?? null,
            network,
          })
          txHash = record.hash
        } catch (hashError) {
          console.warn('Failed to persist transaction hash', hashError)
        }

        message.success('Transaction sent successfully.')

        // Refresh balance after successful transaction
        setTimeout(() => {
          refreshBalance()
        }, 2000)

        return { success: true, data: result, hash: txHash }
      } catch (error) {
        console.error('Transaction error:', error)
        message.error('Transaction failed to send.')
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Transaction failed',
        }
      }
    },
    [tonConnectUI, refreshBalance, address, network]
  )

  return {
    // State
    isConnected,
    address,
    balance,
    network,
    isConnecting,
    isDisconnecting,
    balanceLoading,

    // Actions
    connect,
    disconnect,
    refreshBalance,
    switchNetwork,
    sendTransaction,
  }
}
