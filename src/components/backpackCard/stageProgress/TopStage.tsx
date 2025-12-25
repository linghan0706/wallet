import React from 'react'
import Image from 'next/image'

const TopStage: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-[4px] w-[40px] h-[40px] flex-none">
    <div className="w-[30px] h-[30px]">
      <Image
        src="/backpack/stage_progress/total/Top.png"
        alt="top"
        width={30}
        height={30}
        className="w-full h-full object-contain select-none"
        loading="lazy"
      />
    </div>
    <span
      className="font-jersey-10 text-white text-[10px] leading-[10px] text-center w-full"
      style={{ textShadow: '1px 1px 3px #7000FF' }}
    >
      top
    </span>
  </div>
)

export default TopStage
