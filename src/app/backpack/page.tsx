'use client'

import { useEffect, useState } from 'react'
import MotionDiv from '@/components/motion/MotionDiv'
import StageProgressCard from '@/components/backpackCard/StageProgressCard'
// import NoseSection from '@/components/backpack_up/nosesection'
import SelectCard, {
  BackpackItem,
  BackpackCategory,
} from '@/components/backpackCard/SelectCard'
import NoseSection from '@/components/backpack_up/nosesection'
import GiftProps from '@/components/backpack_up/GiftProps'
import NoseSectionResult from '@/components/backpack_up/nosesectionResult'
import { useBackpackModalStore } from '@/stores/backpackModalStore'
import backImage from '@/public/backImage.png'

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
    { label: 'All', value: 'all' },
    { label: 'Stage', value: 'stage' },
    { label: 'Collector', value: 'collector' },
    { label: 'Other', value: 'other' },
  ]
  {
    /**背包道具 */
  }
  const buildMockItems = (): BackpackItem[] => {
    return [
      {
        name: 'Nose Section',
        quantity: 1,
        iconPath: '/backpack/part/nose_section.svg',
        category: 'stage',
      },
      {
        name: 'Landing Gear',
        quantity: 1,
        iconPath: '/backpack/part/landing_gear.svg',
        category: 'stage',
      },
      {
        name: 'Horizontal Stabilizer',
        quantity: 1,
        iconPath: '/backpack/part/horizontal_stabilizer.svg',
        category: 'stage',
      },
      {
        name: 'Vertical Stabilizer',
        quantity: 1,
        iconPath: '/backpack/part/vertical_stabilizer.svg',
        category: 'stage',
      },
      {
        name: 'Wings',
        quantity: 1,
        iconPath: '/backpack/part/wings.svg',
        category: 'stage',
      },
      {
        name: 'Propulsion System',
        quantity: 1,
        iconPath: '/backpack/part/propulsion_system.svg',
        category: 'other',
      },
      {
        name: 'Main Body',
        quantity: 1,
        iconPath: '/backpack/part/main_body.svg',
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
  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 sm:pt-14 mt-[20px]">
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] bg-cover bg-contain"
        style={{ backgroundImage: `url(${backImage.src})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(107,10,233,0.4) 0%, rgba(100,16,177,0.2) 40%, rgba(94,50,172,0.1) 80%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(15px)',
          }}
        ></div>
      </div>
      {/* 顶部标题 */}
      <div className="relative z-10 px-4 pt-6 max-w-[420px] mx-auto">
        <MotionDiv
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-jersey-10 font-normal text-[36px] text-white mx-auto"
            style={{ width: '120px', height: '23px', lineHeight: '23px' }}
          >
            Backpack
          </h1>
          <p
            className="font-exo2 font-medium text-[16px] mx-auto"
            style={{ height: '23px', lineHeight: '23px', color: '#90A1B9' }}
          >
            Check your props and collections
          </p>
        </MotionDiv>
      </div>

      {/* 内容区：卡片组件 */}
      <div className="relative z-10 px-4 mt-6 flex flex-col gap-4 items-center">
        <StageProgressCard
          showCornerLocks
          lockedPositions={[{ left: 40, top: 320 }]}
          data-testid="stage-progress-card"
        />
        <SelectCard
          options={options}
          value={selectedCategory}
          onChange={value => setSelectedCategory(value as BackpackCategory)}
          items={items}
          loading={loading}
          error={error}
          onRetry={loadItems}
        />
        {mode !== 'none' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={close} />
            <div className="relative z-10">
              {mode === 'details' && (
                <NoseSection
                  onGive={() => openGift({})}
                  onSell={() => openResult({ status: 'success' })}
                  onUse={() => openResult({ status: 'success' })}
                />
              )}
              {mode === 'gift' && (
                <GiftProps
                  visible
                  onCancel={() => (item ? openDetails(item) : close())}
                  onConfirm={({ username, amount }) => {
                    openResult({
                      status: 'success',
                      description: `${username} X${amount}`,
                    })
                  }}
                />
              )}
              {mode === 'result' && result && (
                <NoseSectionResult
                  open
                  status={result.status}
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
      </div>
    </div>
  )
}
