import React from 'react'
import Image from 'next/image'

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
  labelWidth?: number
  labelPlacement?: 'top' | 'bottom'
  iconSize?: { w: number; h: number }
}

const LOCK_ICON = '/backpack/part/lock/lock.png'
const GALAXY_BG = '/backpack/part/galaxy/backimage/background.png'
const GALAXY_PORTAL_ACTIVE = '/backpack/part/galaxy/backimage/active.png'
const GALAXY_PORTAL_INACTIVE = '/backpack/part/galaxy/backimage/inactive.png'

const encodeAssetPath = (path: string) => path.replace(/'/g, '%27')

const parts: GalaxyPart[] = [
  {
    id: 'voidSovereignsCrown',
    label: "Void Sovereign's Crown",
    icon: "/backpack/part/galaxy/void_sovereign's_crown.png",
    box: { x: 6, y: 64, w: 64, h: 110 },
    labelWidth: 64,
    labelPlacement: 'top',
    iconSize: { w: 56, h: 90 },
  },
  {
    id: 'abyssalLordsSkull',
    label: "Abyssal Lord's Skull",
    icon: "/backpack/part/galaxy/abyssal_lord's_skull.png",
    box: { x: 78, y: 0, w: 64, h: 110 },
    labelWidth: 64,
    labelPlacement: 'top',
    iconSize: { w: 56, h: 90 },
  },
  {
    id: 'chaosMonarchsVisage',
    label: "Chaos Monarch's Visage",
    icon: "/backpack/part/galaxy/chaos_minarch's_visage.png",
    box: { x: 154, y: 0, w: 74, h: 118 },
    labelWidth: 74,
    labelPlacement: 'top',
    iconSize: { w: 64, h: 96 },
  },
  {
    id: 'shadowOverlordsMask',
    label: "Shadow Overlord's Mask",
    icon: "/backpack/part/galaxy/shadow_dveriord's_mask.png",
    box: { x: 246, y: 0, w: 64, h: 110 },
    labelWidth: 64,
    labelPlacement: 'top',
    iconSize: { w: 56, h: 90 },
  },
  {
    id: 'emperorOfNihilitysHelm',
    label: "Emperor of Nihility's Helm",
    icon: "/backpack/part/galaxy/emperor_of_nihility's_helm.png",
    box: { x: 280, y: 108, w: 70, h: 110 },
    labelWidth: 70,
    labelPlacement: 'bottom',
    iconSize: { w: 60, h: 96 },
  },
  {
    id: 'abyssalCountesssDiadem',
    label: "Abyssal Countess's Diadem",
    icon: "/backpack/part/galaxy/abyssal_countess's_diadem.png",
    box: { x: 176, y: 142, w: 68, h: 110 },
    labelWidth: 68,
    labelPlacement: 'bottom',
    iconSize: { w: 58, h: 92 },
  },
  {
    id: 'voidProphetsOracle',
    label: "Void Prophet's Oracle",
    icon: "/backpack/part/galaxy/void_prophet's_oracle.png",
    box: { x: 98, y: 136, w: 64, h: 110 },
    labelWidth: 64,
    labelPlacement: 'bottom',
    iconSize: { w: 56, h: 92 },
  },
]

const labelBase: React.CSSProperties = {
  minHeight: '18px',
  height: 'auto',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '10px',
  color: '#D6F6FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  flex: 'none',
  order: 0,
  flexGrow: 0,
  flexShrink: 0,
}

const getActiveLabelStyle = (labelWidth?: number): React.CSSProperties => ({
  ...labelBase,
  width: labelWidth ? `${labelWidth}px` : 'auto',
  textShadow:
    '0 0 6px rgba(32, 210, 255, 0.75), 0 0 2px rgba(32, 210, 255, 0.9)',
})

const getLockedLabelStyle = (labelWidth?: number): React.CSSProperties => ({
  ...labelBase,
  width: labelWidth ? `${labelWidth}px` : 'auto',
  opacity: 0.6,
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.55)',
})

const getActiveIconStyle = (
  icon: string,
  size: GalaxyPart['iconSize']
): React.CSSProperties => ({
  width: `${size?.w || 48}px`,
  height: `${size?.h || 48}px`,
  backgroundImage: `url(${encodeAssetPath(icon)})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  flexShrink: 0,
  filter: 'drop-shadow(0 0 8px rgba(86, 210, 255, 0.4))',
})

const getLockedIconStyle = (
  size: GalaxyPart['iconSize']
): React.CSSProperties => ({
  width: `${size?.w || 48}px`,
  height: `${size?.h || 48}px`,
  background: `linear-gradient(0deg, rgba(176, 176, 192, 0.2), rgba(176, 176, 192, 0.2)), url(${LOCK_ICON})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: '36%',
  flexShrink: 0,
  filter: 'grayscale(0.4)',
})

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
        'relative w-[363px] h-[300px] mx-auto select-none',
        className ?? '',
      ].join(' ')}
    >
      {/* Background */}
      <div
        className="absolute left-0 top-[21px] pointer-events-none"
        style={{ width: '363px', height: '258px', zIndex: 0 }}
        aria-hidden
      >
        <Image
          src={GALAXY_BG}
          alt=""
          width={363}
          height={258}
          className="w-full h-full object-contain select-none"
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Center portal */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '65%',
          top: '6px',
          width: '127px',
          height: '127px',
          transform: 'translateX(-50%)',
        }}
        aria-hidden
      >
        <Image
          src={allActive ? GALAXY_PORTAL_ACTIVE : GALAXY_PORTAL_INACTIVE}
          alt=""
          width={127}
          height={127}
          className="w-full h-full object-contain select-none"
          draggable={false}
          loading="lazy"
          style={{
            filter: allActive
              ? 'drop-shadow(0 0 10px rgba(32, 210, 255, 0.35))'
              : 'none',
            opacity: allActive ? 1 : 0.92,
          }}
        />
      </div>

      {/* Parts */}
      <div
        className="absolute left-0 top-[21px]"
        style={{ width: '363px', height: '258px', zIndex: 2 }}
        aria-label="Galaxy stage parts"
      >
        {parts.map(part => {
          const isActive = activeSet.has(part.id)

          const labelNode = (
            <div
              className="font-jersey-10"
              style={
                isActive
                  ? getActiveLabelStyle(part.labelWidth)
                  : getLockedLabelStyle(part.labelWidth)
              }
            >
              {part.label}
            </div>
          )

          const iconNode = (
            <div
              style={
                isActive
                  ? getActiveIconStyle(part.icon, part.iconSize)
                  : getLockedIconStyle(part.iconSize)
              }
            />
          )

          return (
            <div
              key={part.id}
              className="absolute flex flex-col items-center p-0"
              style={{
                left: part.box.x,
                top: part.box.y,
                width: part.box.w,
                height: part.box.h,
                gap: '2px',
              }}
            >
              {part.labelPlacement === 'top' ? labelNode : iconNode}
              {part.labelPlacement === 'top' ? iconNode : labelNode}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GalaxyStage
