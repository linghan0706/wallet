'use client'

import { Button, Card, Flex, Space, Typography } from 'antd'
import { formatAddress } from '@/utils/format'

const { Text } = Typography

interface WalletCardProps {
  wallet: {
    address: string | null
    balance: string | null
    network: 'mainnet' | 'testnet'
  }
  onDisconnect?: () => void
  loading?: boolean
}

export default function WalletCard({
  wallet,
  onDisconnect,
  loading = false,
}: WalletCardProps) {
  const formattedBalance = wallet.balance
    ? `${Number(wallet.balance) / 1e9} TON`
    : 'Loading...'

  return (
    <Card
      title="Wallet Info"
      className="w-full max-w-md"
      extra={
        onDisconnect && (
          <Button
            danger
            loading={loading}
            onClick={onDisconnect}
            size="small"
            aria-label="Disconnect wallet"
          >
            Disconnect
          </Button>
        )
      }
    >
      <Space direction="vertical" className="w-full">
        <Flex align="center" gap={8}>
          <Text type="secondary">Address:</Text>
          <Text code>{formatAddress(wallet.address ?? '') || 'N/A'}</Text>
        </Flex>
        <Flex align="center" gap={8}>
          <Text type="secondary">Balance:</Text>
          <Text>{formattedBalance}</Text>
        </Flex>
        <Flex align="center" gap={8}>
          <Text type="secondary">Network:</Text>
          <Text>{wallet.network === 'testnet' ? 'Testnet' : 'Mainnet'}</Text>
        </Flex>
      </Space>
    </Card>
  )
}
