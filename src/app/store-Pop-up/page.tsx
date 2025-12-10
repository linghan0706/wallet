'use client'

import { useState } from 'react'
import SelectCard from '@/components/backpackCard/SelectCard'
import StoresTransactionCard from '@/components/stores_up/StoresTransactionCard'
import StoresTransactionResult from '@/components/stores_up/StoresTransactionResult'

export default function StorePopupPage() {
  const [showResult, setShowResult] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] flex flex-col items-center justify-center gap-4 p-6">
      {/* 切换按钮 */}
      <button
        onClick={() => setShowResult(!showResult)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Switch to {showResult ? 'Payment' : 'Result'} Page
      </button>

      {/* 返回结果 */}
      {showResult && (
        <StoresTransactionResult
        // activeIndex={activeIndex}
        // loading={loading}
        // error={error}
        />
      )}

      {/* 支付组件 */}
      {!showResult && <StoresTransactionCard />}
    </div>
  )
}
