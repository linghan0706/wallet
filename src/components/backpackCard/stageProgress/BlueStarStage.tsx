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

const circle = { x: 180, y: 146, r: 90 }

const parts: Part[] = [
  {
    id: 'propulsionSystem',
    label: 'Propulsion System',
    icon: '/backpack/part/blue_star/propulsion_system.png',
    box: { x: 8, y: 8, w: 48, h: 58 },
  },
  {
    id: 'noseSection',
    label: 'Nose Section',
    icon: '/backpack/part/blue_star/nose_section.png',
    box: { x: 10, y: 136, w: 48, h: 58 },
  },
  {
    id: 'landingGear',
    label: 'Landing Gear',
    icon: '/backpack/part/blue_star/landing_gear.png',
    box: { x: 78, y: 214, w: 48, h: 58 },
  },
  {
    id: 'horizontalStabilizer',
    label: 'Horizontal Stabilizer',
    icon: '/backpack/part/blue_star/horizontal_stabilizer.png',
    box: { x: 262, y: 222, w: 48, h: 58 },
  },
  {
    id: 'verticalStabilizer',
    label: 'Vertical Stabilizer',
    icon: '/backpack/part/blue_star/vertical_stabilizer.png',
    box: { x: 284, y: 136, w: 48, h: 58 },
  },
  {
    id: 'wings',
    label: 'Wings',
    icon: '/backpack/part/blue_star/wings.png',
    box: { x: 262, y: 32, w: 48, h: 58 },
  },
  {
    id: 'mainBody',
    label: 'Main Body',
    icon: '/backpack/part/blue_star/main_body.png',
    box: { x: 198, y: 4, w: 48, h: 58 },
  },
]

// 默认部分未激活：仅保留少量已解锁用于展示锁定态
const defaultActiveParts: PartId[] = ['propulsionSystem', 'noseSection']

// 基础样式：道具图标方块
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

// 基础样式：道具文字
const partLabelBase: React.CSSProperties = {
  width: '100%',
  height: '10px',
  fontFamily: 'Jersey 10',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '10px',
  textAlign: 'center',
  color: '#FFFFFF',
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
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

// 计算连线路径：从文字底部下方出发 -> 水平延伸（与文字底部平行） -> 拐点 -> 圆形边缘终点
const getConnectorPath = (box: Part['box']) => {
  // 文字底部Y坐标（盒子最底部）+ 向下偏移
  const labelBottomY = box.y + box.h
  const boxCenterX = box.x + box.w / 2
  const dirToCircle = { x: circle.x - boxCenterX, y: circle.y - labelBottomY }
  const goingRight = dirToCircle.x >= 0

  // 起点：文字底部中心下方
  const verticalOffset = 10
  const start = { x: boxCenterX, y: labelBottomY + verticalOffset }

  // 拐点：从起点水平延伸一段（与文字底部平行）
  const horizontalOffset = goingRight ? 22 : -22
  const bend = { x: start.x + horizontalOffset, y: start.y }

  // 终点：从拐点指向圆心，落在圆形边框上
  const toCircleFromBend = { x: circle.x - bend.x, y: circle.y - bend.y }
  const dist = Math.hypot(toCircleFromBend.x, toCircleFromBend.y) || 1
  const scale = dist > circle.r ? (dist - circle.r) / dist : 0
  const end = {
    x: bend.x + toCircleFromBend.x * scale,
    y: bend.y + toCircleFromBend.y * scale,
  }

  return { start, bend, end }
}

const BlueStarStage: React.FC<BlueStarStageProps> = ({
  activeParts = defaultActiveParts,
  className,
}) => {
  // 当前激活集合；全部激活后中心图标点亮
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
          const { start, bend, end } = getConnectorPath(part.box)
          const isActive = activeSet.has(part.id)
          return (
            <g key={`${part.id}-connector`}>
              <polyline
                points={`${start.x},${start.y} ${bend.x},${bend.y} ${end.x},${end.y}`}
                fill="none"
                stroke={isActive ? '#00F0FF' : '#B0B0C0'}
                strokeOpacity={isActive ? 0.8 : 0.7}
                strokeWidth={isActive ? 1.5 : 1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx={end.x}
                cy={end.y}
                r={isActive ? 3 : 2.5}
                fill={isActive ? '#00F0FF' : '#B0B0C0'}
                fillOpacity={isActive ? 0.9 : 0.8}
              />
            </g>
          )
        })}
      </svg>

      <div className="relative z-10 w-full h-full">
        <div
          className="absolute left-1/2 top-[56px] -translate-x-1/2 rounded-full border"
          style={{
            boxShadow: allActive
              ? '0 0 8px rgba(0, 240, 255, 0.35)'
              : 'inset 0px 1px 1px #B0B0C0',
            width: '160px',
            height: '160px',
            borderColor: allActive ? 'rgba(0, 240, 255, 0.7)' : '#B0B0C0',
            filter: allActive
              ? 'drop-shadow(0px 0px 6px rgba(0, 240, 255, 0.35))'
              : 'drop-shadow(1px 0px 5px #B0B0C0) drop-shadow(0px 1px 1px #B0B0C0)',
          }}
        >
          <img
            src={SUBJECT_ICON}
            alt="Blue Star spaceship"
            className="w-[160px] h-full object-contain select-none"
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
              <div style={isActive ? activeLabelStyle : lockedLabelStyle}>
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
