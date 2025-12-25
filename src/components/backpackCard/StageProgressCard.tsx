import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  BlueStarStage,
  GalaxyStage,
  InfiniteUniverseStage,
  SolarSystemStage,
  TopStage,
} from './stageProgress'

type StageProgressCardProps = {
  className?: string
  /** 当前阶段 key，可用于外部渲染详情 */
  activeStage?: keyof typeof stageKeyMap
  /** 自定义阶段详情内容（放在进度条下方） */
  content?: React.ReactNode
}

const stageKeyMap = {
  blueStar: 'blue star',
  solarSystem: 'solar system',
  galaxy: 'galaxy',
  infiniteUniverse: 'infinite universe',
  top: 'top',
}

const StageProgressCard: React.FC<StageProgressCardProps> = ({
  className,
  activeStage = 'blueStar',
  content,
}) => {
  const [testMode, setTestMode] = useState(false)
  const [testIndex, setTestIndex] = useState(0)
  const stageComponentMap = useMemo(
    () => ({
      blueStar: BlueStarStage,
      solarSystem: SolarSystemStage,
      galaxy: GalaxyStage,
      infiniteUniverse: InfiniteUniverseStage,
      top: TopStage,
    }),
    []
  )
  const ActiveStageComponent = stageComponentMap[activeStage]
  const testComponents = useMemo(
    () => [
      { key: 'blueStar', label: 'Blue Star', Component: BlueStarStage },
      {
        key: 'solarSystem',
        label: 'Solar System',
        Component: SolarSystemStage,
      },
      { key: 'galaxy', label: 'Galaxy', Component: GalaxyStage },
      {
        key: 'infiniteUniverse',
        label: 'Infinite Universe',
        Component: InfiniteUniverseStage,
      },
      { key: 'top', label: 'Top', Component: TopStage },
    ],
    []
  )
  const currentTest = testComponents[testIndex]

  {
    /**
     *元数据定义
     */
  }
  const stages = [
    {
      key: 'blueStar' as const,
      label: stageKeyMap.blueStar,
      icon: '/backpack/stage_progress/total/Blue_star.png',
      textShadow: '1px 1px 3px #00F0FF',
    },
    {
      key: 'solarSystem' as const,
      label: stageKeyMap.solarSystem,
      icon: '/backpack/stage_progress/total/Solar_system.png',
      textShadow: '1px 1px 3px #FF8C00',
    },
    {
      key: 'galaxy' as const,
      label: stageKeyMap.galaxy,
      icon: '/backpack/stage_progress/total/Galaxy.png',
      textShadow: '1px 1px 3px #BC13FE',
    },
    {
      key: 'infiniteUniverse' as const,
      label: stageKeyMap.infiniteUniverse,
      icon: '/backpack/stage_progress/total/Infinite_universe.png',
      textShadow: '1px 1px 3px #7000FF',
    },
    {
      key: 'top' as const,
      label: stageKeyMap.top,
      icon: '/backpack/stage_progress/total/Top.png',
      textShadow: '1px 1px 3px #7000FF',
    },
  ] as const

  const connectors = [
    {
      gradient: 'linear-gradient(90deg, #00F0FF 0%, #00F0FF 45%, #FF8C00 100%)',
      shadow: '#00F0FF',
    },
    {
      gradient: 'linear-gradient(90deg, #FF8C00 0%, #DE507F 45%, #BC13FE 100%)',
      shadow: '#FF8C00',
    },
    {
      gradient: 'linear-gradient(90deg, #BC13FE 0%, #960AFF 60%, #7000FF 100%)',
      shadow: '#960AFF',
    },
    {
      gradient: 'linear-gradient(90deg, #7000FF 0%, #3878FF 55%, #00F0FF 100%)',
      shadow: '#3878FF',
    },
  ] as const

  return (
    <section
      className={[
        'relative w-[353px] h-[370px] mx-auto flex flex-col items-center justify-start gap-[10px]',
        className ?? '',
      ].join(' ')}
      aria-label="Stage progress"
    >
      {/* 顶部标题 */}
      <header className="w-full flex flex-col items-center pt-[12px]">
        <h2
          className="font-oxanium font-bold text-[10px] leading-[12px] tracking-[0.04em] uppercase text-white/80 text-center"
          style={{
            textShadow: '0px 0px 1px #BC13FE',
            fontWeight: 700,
          }}
        >
          Stage Progress
        </h2>
      </header>

      {/* 阶段进度条 */}
      <div className="w-full flex flex-col items-center">
        <div className="self-stretch h-14 relative">
          <div
            className="absolute inset-0 rounded-[8px] pointer-events-none"
            style={{
              padding: '1px',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 10%, #1CB4FF 25%, #2A96FF 38%, #3187FF 44%, #3878FF 52%, #7000FF 72%, rgba(255,255,255,0) 100%)',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              boxSizing: 'border-box',
            }}
            aria-hidden
          />
          <div className="relative z-10 w-full h-full rounded-[8px]">
            <div className="absolute left-[10px] top-[5px] w-[320px] inline-flex justify-between items-center">
              {stages.map((stage, idx) => (
                <React.Fragment key={stage.label}>
                  <div className="w-10 inline-flex flex-col justify-center items-center">
                    <div className="w-[30px] h-[30px]">
                      <Image
                        src={stage.icon}
                        alt={stage.label}
                        width={30}
                        height={30}
                        className="w-full h-full object-contain select-none"
                        loading="lazy"
                      />
                    </div>
                    <div
                      className="text-center text-white text-[8px] font-bold font-ibm-plex-mono leading-[10px] w-full"
                      style={{
                        textShadow: '1px 1px 3px #FF8C00',
                        fontWeight: 700,
                      }}
                    >
                      {stage.label}
                    </div>
                  </div>
                  {idx < connectors.length && (
                    <div
                      className="flex-1 h-[6px] rounded-[3px]"
                      style={{
                        background: connectors[idx].gradient,
                        boxShadow: `0px 0px 6px ${connectors[idx].shadow}`,
                      }}
                      aria-hidden
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 阶段详情区 */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="absolute top-2 right-2 z-20 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setTestMode(prev => !prev)}
            className="px-2 py-[6px] rounded-md border border-cyan-400/60 bg-[rgba(0,240,255,0.08)] text-white shadow-[0_0_8px_rgba(0,240,255,0.35)] hover:shadow-[0_0_12px_rgba(0,240,255,0.5)] transition-shadow"
          >
            {testMode ? '关闭子组件测试' : '开启子组件测试'}
          </button>
          {testMode && (
            <button
              type="button"
              onClick={() =>
                setTestIndex(prev => (prev + 1) % testComponents.length)
              }
              className="px-2 py-[6px] rounded-md border border-cyan-400/60 bg-[rgba(0,240,255,0.08)] text-white shadow-[0_0_8px_rgba(0,240,255,0.35)] hover:shadow-[0_0_12px_rgba(0,240,255,0.5)] transition-shadow"
              title={`on：${currentTest.label}`}
            >
              切换子组件：{currentTest.label}
            </button>
          )}
        </div>

        <div className="w-full flex items-center justify-center">
          {testMode && currentTest?.Component ? (
            <div className="w-full flex items-center justify-center">
              <currentTest.Component />
            </div>
          ) : content ? (
            content
          ) : ActiveStageComponent ? (
            <div className="w-full flex items-center justify-center">
              <ActiveStageComponent />
            </div>
          ) : (
            <div className="text-[#90A1B9] text-sm text-center px-4">
              {`Displaying content for ${stageKeyMap[activeStage]}. Provide a stage detail component via 'content' prop to render here.`}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
export default StageProgressCard
