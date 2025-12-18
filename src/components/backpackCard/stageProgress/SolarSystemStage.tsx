import React from 'react'

type Point = { x: number; y: number }

type StageResult = {
  pathCommands: string
  endPoint: Point
}

type StageFunction = (
  startPoint: Point,
  params: PlanetRoutingContext,
  config: RoutingConfig
) => StageResult

type PlanetId =
  | 'neptune'
  | 'uranus'
  | 'saturn'
  | 'jupiter'
  | 'mars'
  | 'venus'
  | 'mercury'

type Planet = {
  id: PlanetId
  name: string
  mission: string
  icon: string
  center: number
}

type SolarSystemStageProps = {
  activePlanets?: PlanetId[]
  className?: string
  onContinue?: () => void
}

type RoutingConfig = {
  layerCount: number
  layerSpacing: number
  baseLayerY: number
  mainWalkwayY: number
  endpointY: number
  minDescentLength: number
  maxDescentLength: number
  convergenceSpread: number
  nodeTurnOffset: number
  mainTrackStartX: number
  mainTrackEndX: number
}

type PlanetRoutingContext = {
  planetIndex: number
  totalPlanets: number
  startX: number
  startY: number
  targetNodeX: number
  layerIndex: number
  isActive: boolean
}

const LOCK_ICON = '/backpack/part/lock/lock.png'
const SUBJECT_ICON = '/backpack/part/solar_system/subject.png'
const ICON_SIZE = 48
const PLANET_CARD_TOP = 110
const PLANET_CARD_HEIGHT = 86
const BUTTON_TOP = 230
const ACTIVE_COLOR = '#51E3FF'
const INACTIVE_COLOR = '#B0B0C0'
const INACTIVE_STROKE = '#9AA2B0'

// Align planet cards symmetrically over the shortened 100px rail
const centerStart = 36
const centerStep = 48

const planets: Planet[] = [
  {
    id: 'neptune',
    name: 'Neptune',
    mission: 'Deep Blue',
    icon: '/backpack/part/solar_system/neptune_deep_blue.png',
    center: centerStart + centerStep * 0,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    mission: 'Ice Mission',
    icon: '/backpack/part/solar_system/uranus_ice_mission.png',
    center: centerStart + centerStep * 1,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    mission: 'Ring Expedition',
    icon: '/backpack/part/solar_system/saturn_ring_expedition.png',
    center: centerStart + centerStep * 2,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    mission: 'Storm Quest',
    icon: '/backpack/part/solar_system/jupiter_storm_quest.png',
    center: centerStart + centerStep * 3,
  },
  {
    id: 'mars',
    name: 'Mars',
    mission: 'Colonization',
    icon: '/backpack/part/solar_system/mars_colonization.png',
    center: centerStart + centerStep * 4,
  },
  {
    id: 'venus',
    name: 'Venus',
    mission: 'Adventure',
    icon: '/backpack/part/solar_system/venus_adventure.png',
    center: centerStart + centerStep * 5,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    mission: 'Expedition',
    icon: '/backpack/part/solar_system/mercury_expedition.png',
    center: centerStart + centerStep * 6,
  },
]

// Default: keep Jupiter locked (inactive) to showcase inactive styling
const defaultActivePlanets: PlanetId[] = planets
  .filter(planet => planet.id !== 'jupiter')
  .map(planet => planet.id)

const iconBaseStyle: React.CSSProperties = {
  width: `${ICON_SIZE}px`,
  height: `${ICON_SIZE}px`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  borderRadius: '50%',
}

const getActiveIconStyle = (icon: string): React.CSSProperties => ({
  ...iconBaseStyle,
  backgroundImage: `url(${icon})`,
})

const lockedIconStyle: React.CSSProperties = {
  width: `${ICON_SIZE}px`,
  height: `${ICON_SIZE}px`,
  background: `linear-gradient(0deg, rgba(176, 176, 192, 0.2), rgba(176, 176, 192, 0.2)), url(${LOCK_ICON})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  boxShadow: 'inset 0px 1px 1px #B0B0C0',
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const assignLayer = (planetIndex: number, totalPlanets: number) => {
  const centerIndex = (totalPlanets - 1) / 2
  return Math.floor(Math.abs(planetIndex - centerIndex))
}

const calculateInitialDescent = (
  planetIndex: number,
  totalPlanets: number,
  config: RoutingConfig
) => {
  const centerIndex = (totalPlanets - 1) / 2
  const distanceFromCenter = Math.abs(planetIndex - centerIndex)
  const maxDistance = Math.max(1, Math.ceil((totalPlanets - 1) / 2))
  const ratio = distanceFromCenter / maxDistance

  return (
    config.minDescentLength +
    (config.maxDescentLength - config.minDescentLength) * ratio
  )
}

const calculateConvergenceX = (
  params: PlanetRoutingContext,
  config: RoutingConfig
) => {
  const centerIndex = (params.totalPlanets - 1) / 2
  const mainTrackCenter =
    config.mainTrackStartX + (config.mainTrackEndX - config.mainTrackStartX) / 2
  const offset = (params.planetIndex - centerIndex) * config.convergenceSpread
  const lean =
    (params.targetNodeX - params.startX) *
    clamp(Math.abs(offset) / 80, 0.15, 0.35)

  return clamp(
    mainTrackCenter + offset + lean,
    config.mainTrackStartX + 6,
    config.mainTrackEndX - 6
  )
}

const stage1InitialDescent: StageFunction = (startPoint, params, config) => {
  const descent = calculateInitialDescent(
    params.planetIndex,
    params.totalPlanets,
    config
  )
  const layerY = config.baseLayerY + params.layerIndex * config.layerSpacing
  // Cap descent at the layer height to avoid overshooting and extra vertical segments
  const endY = Math.min(startPoint.y + descent, layerY)
  const endPoint = { x: startPoint.x, y: endY }
  return {
    pathCommands: `L ${endPoint.x} ${endPoint.y}`,
    endPoint,
  }
}

const stage2FirstTurn: StageFunction = (startPoint, params, config) => {
  const layerY = config.baseLayerY + params.layerIndex * config.layerSpacing
  const endPoint = { x: startPoint.x, y: layerY }
  // If already at layerY, no extra vertical movement is needed
  if (startPoint.y === layerY) {
    return { pathCommands: '', endPoint }
  }
  return {
    pathCommands: `L ${endPoint.x} ${endPoint.y}`,
    endPoint,
  }
}

const stage3HorizontalLayer: StageFunction = (startPoint, params, config) => {
  // Extend horizontally on the layer until aligned with the target dot
  const endX = clamp(
    params.targetNodeX,
    config.mainTrackStartX,
    config.mainTrackEndX
  )
  const endPoint = { x: endX, y: startPoint.y }
  return {
    pathCommands: `L ${endPoint.x} ${endPoint.y}`,
    endPoint,
  }
}

const stage4ConvergenceTurn: StageFunction = (startPoint, _params, config) => {
  // Strict vertical drop to preserve a 90-degree second elbow
  const endPoint = { x: startPoint.x, y: config.mainWalkwayY }
  return {
    pathCommands: `L ${endPoint.x} ${endPoint.y}`,
    endPoint,
  }
}

const stage5MainTrack: StageFunction = (startPoint, params) => {
  // Move horizontally on the walkway; no vertical allowed to avoid extra y segments
  const endPoint = {
    x: params.targetNodeX,
    y: params.targetNodeX === startPoint.x ? startPoint.y : startPoint.y,
  }
  return {
    pathCommands:
      startPoint.x === params.targetNodeX
        ? ''
        : `L ${endPoint.x} ${endPoint.y}`,
    endPoint,
  }
}

const stagePipeline: StageFunction[] = [
  stage1InitialDescent,
  stage2FirstTurn,
  stage3HorizontalLayer,
  stage4ConvergenceTurn,
  stage5MainTrack,
]

const SolarSystemStage: React.FC<SolarSystemStageProps> = ({
  activePlanets = defaultActivePlanets,
  className,
  onContinue,
}) => {
  const routingConfig = React.useMemo<RoutingConfig>(
    () => ({
      layerCount: 4,
      layerSpacing: 8,
      baseLayerY: PLANET_CARD_TOP + PLANET_CARD_HEIGHT + 4,
      mainWalkwayY: BUTTON_TOP - 6, // keep second elbow just above button border
      endpointY: BUTTON_TOP + 12,
      minDescentLength: 16,
      maxDescentLength: 34,
      convergenceSpread: 14,
      nodeTurnOffset: 6,
      mainTrackStartX: 130,
      mainTrackEndX: 230,
    }),
    []
  )

  const activeSet = React.useMemo(() => new Set(activePlanets), [activePlanets])
  const allActive = activeSet.size === planets.length

  const nodePositions = React.useMemo(() => {
    const segment =
      (routingConfig.mainTrackEndX - routingConfig.mainTrackStartX) /
      Math.max(1, planets.length - 1)
    const positions = planets.map(
      (_, idx) => routingConfig.mainTrackStartX + segment * idx
    )

    // Keep Jupiter (center) perfectly vertical: align its dot exactly to the planet center
    const centerIdx = Math.floor((planets.length - 1) / 2)
    positions[centerIdx] = planets[centerIdx].center

    return positions
  }, [routingConfig.mainTrackEndX, routingConfig.mainTrackStartX])

  const routes = React.useMemo(() => {
    const startY = PLANET_CARD_TOP + PLANET_CARD_HEIGHT - 4

    return planets.map((planet, index) => {
      const isCenter = index === Math.floor((planets.length - 1) / 2)
      const context: PlanetRoutingContext = {
        planetIndex: index,
        totalPlanets: planets.length,
        startX: planet.center,
        startY,
        targetNodeX: nodePositions[index],
        layerIndex: clamp(
          assignLayer(index, planets.length),
          0,
          routingConfig.layerCount - 1
        ),
        isActive: activeSet.has(planet.id),
      }

      let currentPoint: Point = { x: context.startX, y: context.startY }
      const commands = [`M ${currentPoint.x} ${currentPoint.y}`]

      // All planets use the same pipeline - center planet will naturally get a vertical line
      // since its startX equals targetNodeX
      stagePipeline.forEach(stage => {
        const result = stage(currentPoint, context, routingConfig)
        if (result.pathCommands) {
          commands.push(result.pathCommands)
        }
        currentPoint = result.endPoint
      })

      if (commands.length === 1) {
        // Fallback to guarantee a visible connector even if upstream commands were skipped
        commands.push(`L ${context.targetNodeX} ${routingConfig.mainWalkwayY}`)
      }

      return {
        id: planet.id,
        path: commands.join(' '),
        isActive: context.isActive,
      }
    })
  }, [activeSet, nodePositions, routingConfig])

  return (
    <div
      className={[
        'relative w-full max-w-[360px] h-[320px] select-none',
        className ?? '',
      ].join(' ')}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 360 320"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
        style={{ zIndex: 20 }}
      >
        <defs>
          <filter
            id="route-glow-active"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="route-glow-muted"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={`M ${routingConfig.mainTrackStartX} ${routingConfig.mainWalkwayY} L ${routingConfig.mainTrackEndX} ${routingConfig.mainWalkwayY}`}
          stroke={INACTIVE_STROKE}
          strokeWidth={1}
          opacity={0.5}
        />

        {nodePositions.map((x, idx) => {
          const isActive = activeSet.has(planets[idx].id)
          return (
            <circle
              key={planets[idx].id}
              cx={x}
              cy={routingConfig.mainWalkwayY}
              r={isActive ? 4 : 3}
              fill={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
              stroke={isActive ? '#8AFFFF' : INACTIVE_STROKE}
              strokeWidth={isActive ? 1.2 : 1}
              opacity={isActive ? 0.95 : 0.65}
              filter={isActive ? 'url(#route-glow-active)' : undefined}
            />
          )
        })}

        {routes.map(route => (
          <path
            key={route.id}
            d={route.path}
            fill="none"
            stroke={route.isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
            strokeWidth={route.isActive ? 2 : 1.2}
            opacity={route.isActive ? 0.9 : 0.7}
            strokeLinejoin="miter"
            strokeLinecap="square"
            filter={route.isActive ? 'url(#route-glow-active)' : undefined}
          />
        ))}
      </svg>

      <div className="relative z-10 w-full h-full">
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: 12,
            width: '160px',
            height: '160px',
            filter: allActive
              ? 'drop-shadow(0px 0px 10px rgba(0, 240, 255, 0.35))'
              : 'drop-shadow(1px 1px 4px #181A1F)',
          }}
        >
          <img
            src={SUBJECT_ICON}
            alt="Solar system subject"
            className="w-full h-full object-contain"
            loading="lazy"
            style={{
              opacity: allActive ? 1 : 0.78,
              filter: allActive ? 'none' : 'grayscale(0.4)',
            }}
          />
        </div>

        {planets.map(planet => {
          const isActive = activeSet.has(planet.id)
          return (
            <div
              key={planet.id}
              className="absolute flex flex-col items-center"
              style={{
                left: planet.center,
                top: PLANET_CARD_TOP,
                width: '70px',
                height: `${PLANET_CARD_HEIGHT}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={
                  isActive ? getActiveIconStyle(planet.icon) : lockedIconStyle
                }
              />
              <div className="flex flex-col items-center gap-0 mt-[6px]">
                <span
                  className="font-jersey-10 text-[8px] leading-[10px] text-center uppercase"
                  style={{
                    color: isActive ? '#5EF5FF' : '#B0B0C0',
                    textShadow: isActive
                      ? '1px 1px 1px rgba(0, 240, 255, 0.7)'
                      : '0px 1px 1px rgba(0, 0, 0, 0.35)',
                  }}
                >
                  {planet.name}
                </span>
                <span
                  className="font-jersey-10 text-[8px] leading-[10px] text-center"
                  style={{
                    color: isActive ? '#5EF5FF' : '#B0B0C0',
                    textShadow: isActive
                      ? '1px 1px 1px rgba(0, 240, 255, 0.7)'
                      : '0px 1px 1px rgba(0, 0, 0, 0.35)',
                  }}
                >
                  {planet.mission}
                </span>
              </div>
            </div>
          )
        })}

        <button
          type="button"
          onClick={onContinue}
          className="absolute rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          style={{
            width: '140px',
            height: '32px',
            left: 'calc(50% - 140px / 2 + 4.5px)',
            top: '220px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            zIndex: 1,
          }}
          aria-label="Continue journey"
        >
          <img
            src={
              allActive
                ? '/backpack/part/solar_system/button/active.png'
                : '/backpack/part/solar_system/button/inactive.png'
            }
            alt="Continue journey"
            className="w-full h-full object-contain select-none"
            draggable={false}
            loading="lazy"
          />
        </button>
      </div>
    </div>
  )
}

export default SolarSystemStage
