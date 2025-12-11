export default function Question() {
  return (
    <div
      className="absolute w-[259px] h-[148px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[8px]"
      style={{
        background: 'rgba(5, 5, 16, 0.8)',
        boxSizing: 'border-box',
      }}
    >
      {/* 使用伪元素实现渐变边框 */}
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none"
        style={{
          padding: '2px',
          background:
            'linear-gradient(136.39deg, #00F0FF 8.54%, rgba(255, 255, 255, 0) 30.01%, rgba(255, 255, 255, 0) 72.95%, #BC13FE 94.42%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          boxSizing: 'border-box',
        }}
      />
      <div className="p-[8px] h-full flex flex-col justify-center relative z-10">
        <p className="w-[243px] h-[88px] text-white text-center font-['Jersey_10'] text-[12px] leading-[22px] m-0">
          One of the spacecraft components found during the exploration of Blue
          Star. Collecting seven different spacecraft parts will enable you to
          assemble a complete spaceship and embark on the next phase of your
          journey.
        </p>
      </div>
    </div>
  )
}
