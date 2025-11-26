'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTonConnectUI } from '@tonconnect/ui-react'
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

  // 连接钱包
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      await tonConnectUI.connectWallet()
      message.success('钱包连接成功！')
    } catch (error) {
      setIsConnecting(false)
      message.error('钱包连接失败，请重试')
      console.error('Wallet connection error:', error)
    }
  }, [tonConnectUI])

  // 断开钱包连接
  const disconnect = useCallback(async () => {
    try {
      setIsDisconnecting(true)
      await tonConnectUI.disconnect()
      message.success('钱包已断开连接')
    } catch (error) {
      setIsDisconnecting(false)
      message.error('断开连接失败')
      console.error('Wallet disconnection error:', error)
    }
  }, [tonConnectUI])

  // 获取余额
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
          message.error('获取余额失败')
        }
      } catch (error) {
        console.error('Balance fetch error:', error)
        message.error('获取余额失败')
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

  // 监听钱包连接状态变化
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      if (wallet) {
        connectWallet(wallet.account.address)
        // 连接成功后获取余额
        fetchBalanceRef.current(wallet.account.address)
      } else {
        disconnectWallet()
      }
      setIsConnecting(false)
      setIsDisconnecting(false)
    })

    return unsubscribe
  }, [tonConnectUI, connectWallet, disconnectWallet, fetchBalanceRef])

  // 刷新余额
  const refreshBalance = useCallback(() => {
    if (address) {
      fetchBalance(address)
    }
  }, [address, fetchBalance])

  // 切换网络
  const switchNetwork = useCallback(
    (newNetwork: 'mainnet' | 'testnet') => {
      setNetwork(newNetwork)
      // 切换网络后重新获取余额
      if (address) {
        fetchBalance(address)
      }
    },
    [address, setNetwork, fetchBalance]
  )

  // 发送交易

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
    async (transaction: { to: string; amount: string; comment?: string }) => {
      if (!tonConnectUI.connected) {
        message.error('请先连接钱包')
        return { success: false, error: '钱包未连接' }
      }

      try {
        const result = await tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes expiry
          messages: [
            {
              address: transaction.to,
              amount: transaction.amount,
              payload: buildPayload(transaction.comment),
            },
          ],
        })

        try {
          recordWalletTransaction({
            boc: result.boc,
            sender: address ?? tonConnectUI.account?.address ?? null,
            network,
          })
        } catch (hashError) {
          console.warn('Failed to persist transaction hash', hashError)
        }

        message.success('交易发送成功！')

        // 交易成功后刷新余额
        setTimeout(() => {
          refreshBalance()
        }, 2000)

        return { success: true, data: result }
      } catch (error) {
        console.error('Transaction error:', error)
        message.error('交易发送失败')
        return {
          success: false,
          error: error instanceof Error ? error.message : '交易失败',
        }
      }
    },
    [tonConnectUI, refreshBalance, address, network]
  )

  return {
    // 状态
    isConnected,
    address,
    balance,
    network,
    isConnecting,
    isDisconnecting,
    balanceLoading,

    // 方法
    connect,
    disconnect,
    refreshBalance,
    switchNetwork,
    sendTransaction,
  }
}
