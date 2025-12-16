import React from 'react'

const GalaxyStage: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-[4px] w-[40px] h-[40px] flex-none">
    <div className="w-[30px] h-[30px]">
      <img
        src="/backpack/stage_progress/total/Galaxy.png"
        alt="galaxy"
        className="w-full h-full object-contain select-none"
        loading="lazy"
      />
    </div>
    <span
      className="font-jersey-10 text-white text-[10px] leading-[10px] text-center w-full"
      style={{ textShadow: '1px 1px 3px #BC13FE' }}
    >
      galaxy
    </span>
  </div>
)

export default GalaxyStage
