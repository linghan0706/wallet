import React from 'react'

type GalaxyPartId =
  | 'voidSovereignsCrown'
  | 'abyssalLordsSkull'
  | 'chaosMonarchsVisage'
  | 'shadowOverlordsMask'
  | 'emperorOfNihilitysHelm'
  | 'abyssalCountesssDiadem'
  | 'voidProphetsOracle'

type GalaxyStageProps = {
  /** Active (unlocked) part ids */
  activeParts?: GalaxyPartId[]
  className?: string
}

type Box = { x: number; y: number; w: number; h: number }

type GalaxyPart = {
  id: GalaxyPartId
  label: string
  icon: string
  box: Box
}

const LOCK_ICON = '/backpack/part/lock/lock.png'
const GALAXY_BG = '/backpack/part/galaxy/backimage/back.png'
const GALAXY_PORTAL_ACTIVE = '/backpack/part/galaxy/backimage/active.png'
const GALAXY_PORTAL_INACTIVE = '/backpack/part/galaxy/backimage/inactive.png'

const parts: GalaxyPart[] = [
  {
    id: 'voidSovereignsCrown',
    label: "Void Sovereign's Crown",
    icon: "/backpack/part/galaxy/void_sovereign's_crown.png",
    box: { x: 0, y: 30, w: 50, h: 94 },
  },
  {
    id: 'abyssalLordsSkull',
    label: "Abyssal Lord's Skull",
    icon: "/backpack/part/galaxy/abyssal_lord's_skull.png",
    box: { x: 59, y: 0, w: 48, h: 94 },
  },
  {
    id: 'chaosMonarchsVisage',
    label: "Chaos Monarch's Visage",
    icon: "/backpack/part/galaxy/chaos_minarch's_visage.png",
    box: { x: 142, y: 0, w: 68, h: 104 },
  },
  {
    id: 'shadowOverlordsMask',
    label: "Shadow Overlord's Mask",
    icon: "/backpack/part/galaxy/shadow_dveriord's_mask.png",
    box: { x: 225, y: 1, w: 56, h: 95 },
  },
  {
    id: 'emperorOfNihilitysHelm',
    label: "Emperor of Nihility's Helm",
    icon: "/backpack/part/galaxy/emperor_of_nihility's_helm.png",
    box: { x: 281, y: 45, w: 60, h: 90 },
  },
  {
    id: 'abyssalCountesssDiadem',
    label: "Abyssal Countess's Diadem",
    icon: "/backpack/part/galaxy/abyssal_countess's_diadem.png",
    box: { x: 183, y: 64, w: 56, h: 90 },
  },
  {
    id: 'voidProphetsOracle',
    label: "Void Prophet's Oracle",
    icon: "/backpack/part/galaxy/void_prophet's_oracle.png",
    box: { x: 94, y: 61, w: 48, h: 90 },
  },
]

const GalaxyStage: React.FC<GalaxyStageProps> = ({
  activeParts = parts.map(part => part.id),
  className,
}) => {
  const activeSet = React.useMemo(() => new Set(activeParts), [activeParts])
  const allActive = React.useMemo(
    () => parts.every(part => activeSet.has(part.id)),
    [activeSet]
  )

  return (
    <div
      className={[
        'relative w-full max-w-[360px] h-[300px] select-none',
        className ?? '',
      ].join(' ')}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: '363px', height: '258px', zIndex: 0 }}
        aria-hidden
      >
        <img
          src={GALAXY_BG}
          alt=""
          className="w-full h-full object-contain select-none"
          draggable={false}
          loading="lazy"
        />
      </div>

      <div
        className="absolute pointer-events-none"
        style={{ left: '155px', top: '2px', width: '127px', height: '127px' }}
        aria-hidden
      >
        <img
          src={allActive ? GALAXY_PORTAL_ACTIVE : GALAXY_PORTAL_INACTIVE}
          alt=""
          className="w-full h-full object-contain select-none"
          draggable={false}
          loading="lazy"
          style={{
            filter: allActive
              ? 'drop-shadow(0 0 10px rgba(188, 19, 254, 0.35))'
              : 'none',
            opacity: allActive ? 1 : 0.92,
          }}
        />
      </div>

      <div
        className="absolute left-[20px] top-[88px]"
        style={{ width: '329px', height: '154px', zIndex: 2 }}
        aria-label="Galaxy stage parts"
      >
        {parts.map(part => {
          const isActive = activeSet.has(part.id)

          return (
            <div
              key={part.id}
              className="absolute"
              style={{
                left: part.box.x,
                top: part.box.y,
                width: part.box.w,
                height: part.box.h,
              }}
            >
              <img
                src={part.icon}
                alt={part.label}
                className="w-full h-full object-contain select-none"
                draggable={false}
                loading="lazy"
                style={{
                  opacity: isActive ? 1 : 0.72,
                  filter: isActive
                    ? 'none'
                    : 'grayscale(1) brightness(0.9) contrast(0.95)',
                }}
              />
              {!isActive && (
                <img
                  src={LOCK_ICON}
                  alt="Locked"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                  style={{
                    width: '22px',
                    height: '22px',
                    opacity: 0.92,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))',
                  }}
                  draggable={false}
                  loading="lazy"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GalaxyStage
