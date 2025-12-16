import React from 'react'

const SolarSystemStage: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-[4px] w-[40px] h-[40px] flex-none">
    <div className="w-[30px] h-[30px]">
      <img
        src="/backpack/stage_progress/total/Solar_system.png"
        alt="solar system"
        className="w-full h-full object-contain select-none"
        loading="lazy"
      />
    </div>
    <span
      className="font-jersey-10 text-white text-[10px] leading-[10px] text-center w-full"
      style={{ textShadow: '1px 1px 3px #FF8C00' }}
    >
      solar system
    </span>
  </div>
)

export default SolarSystemStage
