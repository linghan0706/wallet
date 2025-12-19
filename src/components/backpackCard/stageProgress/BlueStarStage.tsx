import React from 'react'

type PartId =
  | 'propulsionSystem'
  | 'noseSection'
  | 'landingGear'
  | 'horizontalStabilizer'
  | 'verticalStabilizer'
  | 'wings'
  | 'mainBody'

type Part = {
  id: PartId
  label: string
  icon: string
  box: { x: number; y: number; w: number; h: number }
}

type BlueStarStageProps = {
  /** Active (unlocked) part ids */
  activeParts?: PartId[]
  className?: string
}

const LOCK_ICON = '/backpack/part/lock/lock.png'
const SUBJECT_ICON = '/backpack/part/blue_star/subject.png'

const SUBJECT_SIZE = 160
const SUBJECT_TOP = 56
const SUBJECT_CENTER_X = 180
const circle = {
  x: SUBJECT_CENTER_X,
  y: SUBJECT_TOP + SUBJECT_SIZE / 2,
  r: SUBJECT_SIZE / 2,
}

const CONNECTOR_OFFSET = 0
const UNDERLINE_WIDTH = 40
const UNDERLINE_GAP = 8

const parts: Part[] = [
  {
    id: 'propulsionSystem',
    label: 'Propulsion System',
    icon: '/backpack/part/blue_star/propulsion_system.png',
    box: { x: 20, y: 5, w: 48, h: 58 },
  },
  {
    id: 'noseSection',
    label: 'Nose Section',
    icon: '/backpack/part/blue_star/nose_section.png',
    box: { x: 10, y: 120, w: 48, h: 58 },
  },
  {
    id: 'landingGear',
    label: 'Landing Gear',
    icon: '/backpack/part/blue_star/landing_gear.png',
    box: { x: 50, y: 195, w: 48, h: 58 },
  },
  {
    id: 'horizontalStabilizer',
    label: 'Horizontal Stabilizer',
    icon: '/backpack/part/blue_star/horizontal_stabilizer.png',
    box: { x: 292, y: 190, w: 48, h: 58 },
  },
  {
    id: 'verticalStabilizer',
    label: 'Vertical Stabilizer',
    icon: '/backpack/part/blue_star/vertical_stabilizer.png',
    box: { x: 294, y: 116, w: 48, h: 58 },
  },
  {
    id: 'wings',
    label: 'Wings',
    icon: '/backpack/part/blue_star/wings.png',
    box: { x: 300, y: 40, w: 48, h: 58 },
  },
  {
    id: 'mainBody',
    label: 'Main Body',
    icon: '/backpack/part/blue_star/main_body.png',
    box: { x: 237, y: 0, w: 48, h: 58 },
  },
]

// Default inactive parts: keep a couple unlocked for preview.
const defaultActiveParts: PartId[] = ['propulsionSystem', 'noseSection']

const partIconBase: React.CSSProperties = {
  width: '48px',
  height: '48px',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
}

const partLabelBase: React.CSSProperties = {
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '10px',
  textAlign: 'center',
  color: '#FFFFFF',
  whiteSpace: 'nowrap',
}

const getActiveIconStyle = (icon: string): React.CSSProperties => ({
  ...partIconBase,
  background: `url(${icon})`,
  boxShadow: 'none',
})

const lockedIconStyle: React.CSSProperties = {
  ...partIconBase,
  background: `linear-gradient(0deg, rgba(176, 176, 192, 0.2), rgba(176, 176, 192, 0.2)), url(${LOCK_ICON})`,
  borderRadius: '0px',
  boxShadow: 'inset 0px 1px 1px #B0B0C0',
}

const activeLabelStyle: React.CSSProperties = {
  ...partLabelBase,
  textShadow: '1px 1px 1px rgba(0, 240, 255, 0.7)',
}

const lockedLabelStyle: React.CSSProperties = {
  ...partLabelBase,
  opacity: 0.86,
  textShadow: '0px 1px 1px rgba(0, 0, 0, 0.35)',
}

const getConnectorPath = (box: Part['box']) => {
  const boxCenterX = box.x + box.w / 2
  const labelBottomY = box.y + box.h + UNDERLINE_GAP

  const isLeft = boxCenterX < circle.x

  const underlineStart = {
    x: boxCenterX - UNDERLINE_WIDTH / 2,
    y: labelBottomY,
  }
  const underlineEnd = {
    x: boxCenterX + UNDERLINE_WIDTH / 2,
    y: labelBottomY,
  }

  const lineStart = isLeft ? underlineEnd : underlineStart

  const dx = circle.x - lineStart.x
  const dy = circle.y - lineStart.y
  const dist = Math.hypot(dx, dy) || 1
  const endRadius = circle.r + CONNECTOR_OFFSET

  const lineEnd = {
    x: circle.x - (dx / dist) * endRadius,
    y: circle.y - (dy / dist) * endRadius,
  }

  return { underlineStart, underlineEnd, lineStart, lineEnd }
}

const BlueStarStage: React.FC<BlueStarStageProps> = ({
  activeParts = defaultActiveParts,
  className,
}) => {
  // 褰撳墠婵€娲婚泦鍚堬紱鍏ㄩ儴婵€娲诲悗涓績鍥炬爣鐐逛寒
  const activeSet = React.useMemo(() => new Set(activeParts), [activeParts])
  const allActive = React.useMemo(
    () => parts.every(part => activeSet.has(part.id)),
    [activeSet]
  )

  return (
    <div
      className={[
        'relative w-full max-w-[360px] h-[300px]',
        className ?? '',
      ].join(' ')}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 360 300"
        fill="none"
        aria-hidden
        preserveAspectRatio="none"
      >
        {parts.map(part => {
          const { underlineStart, underlineEnd, lineStart, lineEnd } =
            getConnectorPath(part.box)
          const isActive = activeSet.has(part.id)
          const strokeColor = isActive ? '#00F0FF' : '#B0B0C0'
          const strokeOp = isActive ? 0.8 : 0.7
          const strokeW = isActive ? 1.5 : 1
          return (
            <g key={`${part.id}-connector`}>
              <line
                x1={underlineStart.x}
                y1={underlineStart.y}
                x2={underlineEnd.x}
                y2={underlineEnd.y}
                stroke={strokeColor}
                strokeOpacity={strokeOp}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke={strokeColor}
                strokeOpacity={strokeOp}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
              <circle
                cx={lineEnd.x}
                cy={lineEnd.y}
                r={isActive ? 3 : 2.5}
                fill={strokeColor}
                fillOpacity={isActive ? 0.9 : 0.8}
              />
            </g>
          )
        })}
      </svg>

      <div className="relative z-10 w-full h-full">
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full border"
          style={{
            boxShadow: allActive
              ? '0 0 8px rgba(0, 240, 255, 0.35)'
              : 'inset 0px 1px 1px #B0B0C0',
            width: `${SUBJECT_SIZE}px`,
            height: `${SUBJECT_SIZE}px`,
            top: `${SUBJECT_TOP}px`,
            borderColor: allActive ? 'rgba(0, 240, 255, 0.7)' : '#B0B0C0',
            filter: allActive
              ? 'drop-shadow(0px 0px 6px rgba(0, 240, 255, 0.35))'
              : 'drop-shadow(1px 0px 5px #B0B0C0) drop-shadow(0px 1px 1px #B0B0C0)',
          }}
        >
          <img
            src={SUBJECT_ICON}
            alt="Blue Star spaceship"
            className="w-full h-full object-contain select-none"
            loading="lazy"
            style={{
              opacity: allActive ? 1 : 0.75,
              filter: allActive ? 'none' : 'grayscale(1)',
            }}
          />
        </div>

        {parts.map(part => {
          const isActive = activeSet.has(part.id)
          return (
            <div
              key={part.id}
              className="absolute inline-flex flex-col items-center"
              style={{
                left: part.box.x,
                top: part.box.y,
                width: part.box.w,
                height: part.box.h,
              }}
            >
              <div
                style={
                  isActive ? getActiveIconStyle(part.icon) : lockedIconStyle
                }
              />
              <div
                className="font-jersey-10"
                style={isActive ? activeLabelStyle : lockedLabelStyle}
              >
                {part.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BlueStarStage
