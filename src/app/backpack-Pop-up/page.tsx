'use client'

import { useMemo, useState } from 'react'
import GiftProps from '@/components/backpack_up/GiftProps'
import NoseSection from '@/components/backpack_up/nosesection'
import NoseSectionResult from '@/components/backpack_up/nosesectionResult'
import Question from '@/components/backpack_up/Question'
import TostoreBuy from '@/components/backpack_up/TostoreBuy'

const demoTitle = 'Nose Section'

export default function BackpackPopupPlayground() {
  const [active, setActive] = useState<string>('nose')
  const [showPane, setShowPane] = useState<boolean>(true)

  const panes = useMemo(
    () => ({
      nose: (
        <NoseSection
          onGive={() => console.log('Give')}
          onSell={() => console.log('Sell')}
          onUse={() => console.log('Use')}
        />
      ),
      noseResultSuccess: (
        <NoseSectionResult
          status="success"
          title="Payment Successful"
          description="Viewable in the backpack"
          onConfirm={() => console.log('Confirm success')}
        />
      ),
      noseResultFail: (
        <NoseSectionResult
          status="failed"
          title="Payment Fail"
          description="Chat With Support"
          onContact={() => console.log('Contact support')}
        />
      ),
      giftProps: (
        <GiftProps
          defaultUsername="@exampleuser"
          defaultAmount={2}
          onConfirm={payload => console.log('Gift confirm', payload)}
          onCancel={() => console.log('Gift cancel')}
        />
      ),
      toStoreBuy: (
        <TostoreBuy
          onConfirm={() => console.log('To store confirm')}
          onCancel={() => console.log('To store cancel')}
        />
      ),
      question: <Question />,
    }),
    []
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B0F25] via-[#12163A] to-[#0B0F25] text-white mt-[50px] flex flex-col items-center py-10 px-4 gap-6">
      <h1 className="font-jersey-10 text-[32px] leading-[32px]">
        {demoTitle} Playground
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { id: 'nose', label: 'Nose Section' },
          { id: 'noseResultSuccess', label: 'Result Success' },
          { id: 'noseResultFail', label: 'Result Fail' },
          { id: 'giftProps', label: 'Gift Props' },
          { id: 'toStoreBuy', label: 'To Store Buy' },
          { id: 'question', label: 'Question' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => {
              setActive(btn.id)
              setShowPane(true)
            }}
            className={`px-3 py-2 rounded-[10px] border text-sm font-jersey-10 transition-colors duration-150 ${
              active === btn.id
                ? 'bg-white/20 border-white/60'
                : 'bg-white/5 border-white/20 hover:bg-white/10'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[340px] min-h-[380px]">
        {showPane && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
            onClick={() => setShowPane(false)}
          >
            <div className="relative z-50" onClick={e => e.stopPropagation()}>
              {panes[active as keyof typeof panes]}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
