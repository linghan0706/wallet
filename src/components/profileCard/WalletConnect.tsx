'use client'

import { useWalletStore } from '@/stores/useWalletStore'
import { formatAddress } from '@/utils/format'

export default function WalletConnect() {
  const { isConnected, address } = useWalletStore()

  return (
    <div className="w-[363px] h-[80px] bg-[url('/GlobalBorder/profile/wallet.svg')] bg-cover bg-no-repeat mt-4">
      {/* 水平排列的外层容器 */}
      <div className="flex items-center justify-between w-full h-full px-4">
        {/* 左侧图标 */}
        <div className="flex items-center justify-start">
          <img
            src="/profile/wallet/wallet_Icon.png"
            alt="Wallet Icon"
            width={48}
            height={48}
          />
        </div>

        {/* 中央文字 - 显示钱包地址 */}
        <div className="flex items-center justify-center">
          <span className="font-orbitron font-bold text-[12px] leading-[15px] flex items-center text-center tracking-[0.06em] uppercase text-white">
            {isConnected && address
              ? formatAddress(address, 6, 4)
              : 'Wallet Connection'}
          </span>
        </div>

        {/* 右侧按钮 */}
        <div className="flex items-center justify-end">
          <button
            className="w-[100px] h-[30px] bg-[url('/GlobalBorder/Layout_General.svg')] bg-cover flex items-center justify-center"
            onClick={() => console.log('Button clicked')}
          >
            <span className="font-oxanium font-bold text-[14px] leading-[18px] flex items-center text-center tracking-[0.04em] uppercase text-[#00F0FF] ">
              {isConnected ? 'Manager' : 'Connect'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
