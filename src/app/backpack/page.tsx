'use client'

import { useEffect, useState } from 'react'
import MotionDiv from '@/components/motion/MotionDiv'
import StageProgressCard from '@/components/backpackCard/StageProgressCard'
import SelectCard, {
  BackpackItem,
  BackpackCategory,
} from '@/components/backpackCard/SelectCard'
import NoseSection from '@/components/backpack_up/nosesection'
import GiftProps from '@/components/backpack_up/GiftProps'
import NoseSectionResult from '@/components/backpack_up/nosesectionResult'
import ItemDetailModal from '@/components/backpack_up/ItemDetailModal'
import ConfirmAgain from '@/components/backpack_up/Confirm_again'
import { useBackpackModalStore } from '@/stores/backpackModalStore'
import { useItemFlowStore } from '@/stores/backpackItemFlowStore'

export default function BackpackPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<BackpackCategory>('all')
  const [items, setItems] = useState<BackpackItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  {
    /** 筛选器*/
  }
  const options: { label: string; value: BackpackCategory }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'Stage', value: 'stage' },
    { label: 'collector', value: 'collector' },
    { label: 'other', value: 'other' },
  ]
  {
    /**背包道具 */
  }
  const buildMockItems = (): BackpackItem[] => {
    return [
      {
        name: 'Nose Section',
        quantity: 1,
        iconPath: '/public/backpack/part/blue_star/nose_section.png',
        category: 'stage',
      },
      {
        name: 'Landing Gear',
        quantity: 1,
        iconPath: '/public/backpack/part/blue_star/landing_gear.png',
        category: 'stage',
      },
      {
        name: 'Horizontal Stabilizer',
        quantity: 1,
        iconPath: '/public/backpack/part/blue_star/horizontal_stabilizer.png',
        category: 'stage',
      },
      {
        name: 'Vertical Stabilizer',
        quantity: 1,
        iconPath: '/public/backpack/part/blue_star/vertical_stabilizer.png',
        category: 'stage',
      },
      {
        name: 'Wings',
        quantity: 1,
        iconPath: '/public/backpack/part/blue_star/wings.png',
        category: 'stage',
      },
      {
        name: 'Propulsion System',
        quantity: 1,
        iconPath: '/public/backpack/part/blue_star/propulsion_system.png',
        category: 'other',
      },
      {
        name: 'Main Body',
        quantity: 1,
        iconPath: '/public/backpack/part/blue_star/main_body.png',
        category: 'other',
      },
    ]
  }

  const loadItems = async () => {
    try {
      setLoading(true)
      setError(null)
      await new Promise(r => setTimeout(r, 300))
      setItems(buildMockItems())
    } catch (e) {
      setError('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])
  const { mode, item, result, gift, close, openGift, openResult, openDetails } =
    useBackpackModalStore()
  const {
    step,
    currentItem,
    actionType,
    resultStatus,
    resultDescription,
    resetFlow,
  } = useItemFlowStore()

  // 处理确认操作
  const handleConfirmAction = () => {
    if (actionType === 'use') {
      openResult({
        status: 'use-success',
        description: resultDescription || undefined,
      })
    } else if (actionType === 'sell') {
      openResult({
        status: 'sell-success',
        description: resultDescription || undefined,
      })
    }
    resetFlow()
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 sm:pt-14 mt-[20px]">
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] bg-cover bg-contain"
        style={{ backgroundImage: `url(/layout/back.png)` }}
      ></div>

      {/* 顶部标题 */}
      <div className="relative z-10 px-4 pt-6 max-w-[420px] mx-auto">
        <MotionDiv
          className="flex flex-col justify-between items-center w-[360px] h-[52px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-orbitron font-bold text-[32px] leading-[40px] tracking-[0.06em] uppercase text-white text-shadow-[0px_0px_10px_rgba(0,_240,_255,_0.6)]"
            style={{
              fontWeight: 900,
            }}
          >
            Backpack
          </h1>
          <p
            className="font-oxanium font-light text-[10px] leading-[12px] text-center tracking-[0.04em] uppercase"
            style={{
              fontWeight: 300,
              color: '#B0B0C0',
            }}
          >
            Check your props and collections
          </p>
        </MotionDiv>
      </div>

      {/* 阶段进度 */}
      <div className="relative z-10 px-4 mt-6 flex flex-col items-center gap-6">
        <div className="relative w-[353px] h-[370px]">
          <div className="relative z-10 w-full h-full rounded-[8px] bg-[rgba(176,176,192,0.1)] flex items-center justify-center">
            <StageProgressCard
              data-testid="stage-progress-card"
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="relative w-full max-w-[400px] rounded-[18px]">
          <div className="relative z-10 rounded-[16px] bg-[rgba(10,16,35,0.78)] flex flex-col gap-4 items-center px-4 py-4">
            <SelectCard
              options={options}
              value={selectedCategory}
              onChange={value => setSelectedCategory(value as BackpackCategory)}
              items={items}
              loading={loading}
              error={error}
              onRetry={loadItems}
            />
          </div>
        </div>
      </div>

      {mode !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative z-10">
            {mode === 'details' && (
              <NoseSection
                onGive={() => openGift({})}
                onSell={() => {}}
                onUse={() => {}}
              />
            )}
            {mode === 'gift' && item && (
              <GiftProps
                visible
                itemName={item.name}
                itemIcon={item.iconPath || '/backpack/StageProgress.svg'}
                onCancel={() => openDetails(item)}
                onConfirm={({ username, amount }) => {
                  openResult({
                    status: 'use-success',
                    description: `${username} X${amount}`,
                  })
                }}
                onClose={close}
              />
            )}
            {mode === 'result' && result && (
              <NoseSectionResult
                open
                status={
                  result.status as import('@/components/backpack_up/nosesectionResult').ResultStatus
                }
                title={result.title}
                description={result.description}
                imageSrc={result.imageSrc}
                onConfirm={close}
                onContact={close}
                onClose={close}
              />
            )}
          </div>
        </div>
      )}

      {/* 新的流程状态管理 */}
      {step !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={resetFlow} />
          <div className="relative z-10">
            {step === 'detail' && currentItem && (
              <ItemDetailModal
                itemName={currentItem.name}
                itemIcon={currentItem.iconPath || '/backpack/StageProgress.svg'}
                actionType={actionType || 'use'}
                onClose={resetFlow}
                onConfirm={() => useItemFlowStore.getState().goToConfirm()}
              />
            )}
            {step === 'confirm' && currentItem && (
              <ConfirmAgain
                itemName={currentItem.name}
                itemType={actionType || 'use'}
                powerValue={99999} // 这里应该从实际数据中获取power值
                onClose={resetFlow}
                onConfirm={handleConfirmAction}
              />
            )}
            {step === 'result' && resultStatus && (
              <NoseSectionResult
                open
                status={resultStatus}
                title={currentItem?.name}
                description={resultDescription || undefined}
                imageSrc={
                  currentItem?.iconPath || '/backpack/StageProgress.svg'
                }
                onConfirm={close}
                onContact={close}
                onClose={() => {
                  close()
                  resetFlow()
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
