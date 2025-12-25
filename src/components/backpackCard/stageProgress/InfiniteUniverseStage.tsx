import React from 'react'
import Image from 'next/image'

type InfiniteUniversePartId =
  | 'cosmicEdgeExpedition'
  | 'quantumTunnelTransit'
  | 'interstellarStormSprint'
  | 'wormholeJump'
  | 'gravitationalWaveVoyage'
  | 'hyperspaceLeap'
  | 'nebulaTraverse'

type InfiniteUniverseStageProps = {
  /** Active (unlocked) part ids */
  activeParts?: InfiniteUniversePartId[]
  className?: string
}

type PartBox = { x: number; y: number; w: number; h: number }
type Part = {
  id: InfiniteUniversePartId
  label: string
  icon: string
  box: PartBox
  labelWidth: number
  labelPlacement: 'top' | 'bottom'
  iconSize: { w: number; h: number }
  gap?: number
  justify?: React.CSSProperties['justifyContent']
}

const STAGE_BG = '/backpack/part/infinite__universe/background.png'
const LOCK_ICON = '/backpack/part/lock/lock.png'

const parts: Part[] = [
  {
    id: 'cosmicEdgeExpedition',
    label: 'Cosmic Edge Expedition',
    icon: '/backpack/part/infinite__universe/cosmic_edge_expedition.png',
    box: { x: 0, y: 105, w: 48, h: 68 },
    labelWidth: 38,
    labelPlacement: 'top',
    iconSize: { w: 48, h: 48 },
  },
  {
    id: 'quantumTunnelTransit',
    label: 'Quantum Tunnel Transit',
    icon: '/backpack/part/infinite__universe/quantum_tunnel_transit.png',
    box: { x: 53, y: 55, w: 48, h: 68 },
    labelWidth: 58,
    labelPlacement: 'top',
    iconSize: { w: 48, h: 48 },
  },
  {
    id: 'interstellarStormSprint',
    label: 'Interstellar Storm Sprint',
    icon: '/backpack/part/infinite__universe/interstellar_storm_sprint.png',
    box: { x: 120, y: 39, w: 48, h: 68 },
    labelWidth: 38,
    labelPlacement: 'top',
    iconSize: { w: 48, h: 48 },
  },
  {
    id: 'wormholeJump',
    label: 'Wormhole Jump',
    icon: '/backpack/part/infinite__universe/wormhole_jump.png',
    box: { x: 239, y: 0, w: 48, h: 68 },
    labelWidth: 38,
    labelPlacement: 'top',
    iconSize: { w: 48, h: 48 },
  },
  {
    id: 'gravitationalWaveVoyage',
    label: 'Gravitational Wave Voyage',
    icon: '/backpack/part/infinite__universe/gravitational_wave_voyage.png',
    box: { x: 220, y: 80, w: 48, h: 68 },
    labelWidth: 38,
    labelPlacement: 'bottom',
    iconSize: { w: 48, h: 48 },
    gap: 1,
    justify: 'center',
  },
  {
    id: 'hyperspaceLeap',
    label: 'Hyperspace Leap',
    icon: '/backpack/part/infinite__universe/hyperspace_leap.png',
    box: { x: 160, y: 120, w: 48, h: 68 },
    labelWidth: 38,
    labelPlacement: 'bottom',
    iconSize: { w: 48, h: 48 },
    justify: 'center',
  },
  {
    id: 'nebulaTraverse',
    label: 'Nebula Traverse',
    icon: '/backpack/part/infinite__universe/nebula_traverse.png',
    box: { x: 83, y: 142, w: 48, h: 68 },
    labelWidth: 38,
    labelPlacement: 'bottom',
    iconSize: { w: 48, h: 48 },
  },
]

const defaultActiveParts: InfiniteUniversePartId[] = [
  'cosmicEdgeExpedition',
  'quantumTunnelTransit',
  'interstellarStormSprint',
  'wormholeJump',
  'gravitationalWaveVoyage',
]

const labelBase: React.CSSProperties = {
  minHeight: '20px',
  height: 'auto',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '10px',
  color: '#FFFFFF',
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

const getActiveLabelStyle = (labelWidth: number): React.CSSProperties => ({
  ...labelBase,
  width: `${labelWidth}px`,
  textShadow: '1px 1px 1px rgba(0, 240, 255, 0.7)',
})

const getLockedLabelStyle = (labelWidth: number): React.CSSProperties => ({
  ...labelBase,
  width: `${labelWidth}px`,
})

const getActiveIconStyle = (
  icon: string,
  size: Part['iconSize']
): React.CSSProperties => ({
  width: `${size.w}px`,
  height: `${size.h}px`,
  backgroundImage: `url(${icon})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: '4px',
  flexShrink: 0,
})

const getLockedIconStyle = (size: Part['iconSize']): React.CSSProperties => ({
  width: `${size.w}px`,
  height: `${size.h}px`,
  background: `linear-gradient(0deg, rgba(176, 176, 192, 0.2), rgba(176, 176, 192, 0.2)), url(${LOCK_ICON})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  borderRadius: '0px',
  boxShadow: 'inset 0px 1px 1px #B0B0C0',
  flexShrink: 0,
})

const InfiniteUniverseStage: React.FC<InfiniteUniverseStageProps> = ({
  activeParts = defaultActiveParts,
  className,
}) => {
  const activeSet = React.useMemo(() => new Set(activeParts), [activeParts])

  return (
    <div
      className={['relative mx-auto select-none', className ?? ''].join(' ')}
      style={{ width: '363px', height: '270px' }}
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={STAGE_BG}
          alt=""
          width={363}
          height={270}
          className="w-full h-full object-contain select-none"
          draggable={false}
          loading="lazy"
        />
      </div>

      <div
        className="absolute"
        style={{ left: '19px', top: '18px', width: '302px', height: '208px' }}
        aria-label="Infinite universe parts"
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
                left: `${part.box.x}px`,
                top: `${part.box.y}px`,
                width: `${part.box.w}px`,
                minHeight: `${part.box.h}px`,
                gap: part.gap ? `${part.gap}px` : undefined,
                justifyContent: part.justify,
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

export default InfiniteUniverseStage
