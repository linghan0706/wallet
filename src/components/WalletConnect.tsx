'use client'

import { TonConnectButton } from '@tonconnect/ui-react'
import { Card, Space, Typography } from 'antd'
import { useWallet } from '@/hooks/useWallet'
import WalletCard from '@/components/wallet_pay/WalletCard'

const { Text } = Typography

export default function WalletConnect() {
  const walletState = useWallet()

  if (!walletState.isConnected) {
    return (
      <Card title="连接钱包" className="w-full max-w-md">
        <Space direction="vertical" className="w-full">
          <Text type="secondary">请连接您的TON钱包以开始使用</Text>
          <TonConnectButton />
        </Space>
      </Card>
    )
  }

  return (
    <WalletCard
      wallet={walletState}
      onDisconnect={walletState.disconnect}
      loading={walletState.isDisconnecting}
    />
  )
}
