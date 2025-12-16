import React from 'react'

const InfiniteUniverseStage: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-[4px] w-[40px] h-[40px] flex-none">
    <div className="w-[30px] h-[30px]">
      <img
        src="/backpack/stage_progress/total/Infinite_universe.png"
        alt="infinite universe"
        className="w-full h-full object-contain select-none"
        loading="lazy"
      />
    </div>
    <span
      className="font-jersey-10 text-white text-[10px] leading-[10px] text-center w-full"
      style={{ textShadow: '1px 1px 3px #7000FF' }}
    >
      infinite universe
    </span>
  </div>
)

export default InfiniteUniverseStage
