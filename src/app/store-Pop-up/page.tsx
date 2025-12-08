'use client'

import SelectCard from '@/components/backpackCard/SelectCard'
import StoresTransactionCard from '@/components/stores_up/StoresTransactionCard'
import StoresTransactionResult from '@/components/stores_up/StoresTransactionResult'
export default function StorePopupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] flex flex-col items-center justify-center gap-4 p-6">
      {/* 返回结果 */}

      {/* <StoresTransactionResult
      // activeIndex={activeIndex}
      // loading={loading}
      // error={error}
      /> */}

      {/* 支付组件 */}

      <StoresTransactionCard />
    </div>
  )
}
