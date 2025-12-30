'use client'

import { useState } from 'react'
import Image from 'next/image'

// Mock data
const topThreeData = [
  {
    rank: 2,
    name: 'ALEN',
    power: 100000,
    avatar: '/currency/avatar/avatar.png',
  },
  {
    rank: 1,
    name: 'ALEN',
    power: 100000,
    avatar: '/currency/avatar/avatar.png',
  },
  {
    rank: 3,
    name: 'ALEN',
    power: 100000,
    avatar: '/currency/avatar/avatar.png',
  },
]

const powerRankingListData = [
  {
    rank: 1,
    name: 'USER1',
    power: 150000,
    avatar: '/currency/avatar/avatar.png',
  },
  {
    rank: 2,
    name: 'USER2',
    power: 140000,
    avatar: '/currency/avatar/avatar.png',
  },
  {
    rank: 3,
    name: 'USER3',
    power: 130000,
    avatar: '/currency/avatar/avatar.png',
  },
  {
    rank: 4,
    name: 'USER4',
    power: 120000,
    avatar: '/currency/avatar/avatar.png',
  },
  {
    rank: 5,
    name: 'USER5',
    power: 110000,
    avatar: '/currency/avatar/avatar.png',
  },
]

const novaRankingListData = [
  { rank: 1, name: 'USERA', nova: 5000, avatar: '/currency/avatar/avatar.png' },
  { rank: 2, name: 'USERB', nova: 4500, avatar: '/currency/avatar/avatar.png' },
  { rank: 3, name: 'USERC', nova: 4000, avatar: '/currency/avatar/avatar.png' },
  { rank: 4, name: 'USERD', nova: 3500, avatar: '/currency/avatar/avatar.png' },
  { rank: 5, name: 'USERE', nova: 3000, avatar: '/currency/avatar/avatar.png' },
]

const currentUserData = {
  rank: 999,
  name: 'YOU',
  power: 123000,
  avatar: '/currency/avatar/avatar.png',
}

const historyData = {
  type: 'ASSET',
  time: '5 MINS AGO',
  action: 'DAILY CHECK-IN',
  amount: -1000,
  iconPath: '/currency/power.png',
}

const historyListData = [
  {
    id: 1,
    type: 'ASSET',
    time: '5 MINS AGO',
    action: 'DAILY CHECK-IN',
    amount: -1000,
    iconPath: '/currency/power.png',
  },
  {
    id: 2,
    type: 'NOVA',
    time: '10 MINS AGO',
    action: 'TASK REWARD',
    amount: 500,
    iconPath: '/currency/nova.png',
  },
  {
    id: 3,
    type: 'POWER',
    time: '15 MINS AGO',
    action: 'MINING REWARD',
    amount: 200,
    iconPath: '/currency/power.png',
  },
  {
    id: 4,
    type: 'ASSET',
    time: '20 MINS AGO',
    action: 'GIFT REDEEMED',
    amount: -500,
    iconPath: '/currency/power.png',
  },
  {
    id: 5,
    type: 'NOVA',
    time: '25 MINS AGO',
    action: 'REFERRAL BONUS',
    amount: 1000,
    iconPath: '/currency/nova.png',
  },
]

// Top rank card component
interface TopRankCardProps {
  rank: number
  name: string
  power?: number
  nova?: number
  avatar: string
}

const TopRankCard = ({ rank, name, power, nova, avatar }: TopRankCardProps) => {
  const borderColor =
    rank === 1 ? '#00F0FF' : rank === 2 ? '#3B82F6' : '#BC13FE'

  // Set different styles based on rank
  const cardStyles: Record<
    number,
    { bgImage: string; size: string; avatarSize: string; marginTop: string }
  > = {
    1: {
      bgImage: '/profile/ranking/top3/No.1.png',
      size: 'w-[80px] h-[80px]',
      avatarSize: 'w-[40px] h-[40px]',
      marginTop: 'mt-0',
    },
    2: {
      bgImage: '/profile/ranking/top3/No.2.png',
      size: 'w-[80px] h-[80px]',
      avatarSize: 'w-[40px] h-[40px]',
      marginTop: 'mt-4',
    },
    3: {
      bgImage: '/profile/ranking/top3/No.3.png',
      size: 'w-[80px] h-[80px]',
      avatarSize: 'w-[40px] h-[40px]',
      marginTop: 'mt-6',
    },
  }
  const cardStyle = cardStyles[rank] || cardStyles[2]

  return (
    <div className={`flex flex-col items-center ${cardStyle.marginTop}`}>
      {/* Complete card containing avatar, username and value */}
      <div
        className={`relative ${cardStyle.size} flex flex-col items-center justify-center`}
        style={{
          backgroundImage: `url(${cardStyle.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Avatar */}
        <div
          className={`relative ${cardStyle.avatarSize} rounded-full overflow-hidden z-10 mb-1 flex items-center justify-center `}
          style={{
            border: `2px solid ${borderColor}`,
            boxShadow: `0 0 12px ${borderColor}60`,
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
            transform: 'translateY(6px)',
          }}
        >
          <Image
            src={avatar}
            alt={name}
            width={40}
            height={40}
            className="w-full h-full rounded-full object-cover"
            style={{ width: '100%', height: '100%' }}
            unoptimized={true}
          />
        </div>

        {/* Username */}
        <div className="font-oxanium font-bold text-[12px] text-white z-10">
          {name}
        </div>

        {/* Value */}
        <div
          className="font-oxanium font-bold text-[12px] z-10"
          style={{ color: borderColor }}
        >
          {power !== undefined
            ? power.toLocaleString()
            : nova !== undefined
              ? nova.toLocaleString()
              : ''}
        </div>
      </div>
    </div>
  )
}

// Ranking list item component
interface RankingItemProps {
  rank: number
  name: string
  power?: number
  nova?: number
  avatar: string
  isCurrentUser?: boolean
}

const RankingItem = ({
  rank,
  name,
  power,
  nova,
  avatar,
  isCurrentUser = false,
}: RankingItemProps) => {
  return (
    <div
      className={`flex items-center justify-center px-4 py-2 w-[260px] mx-auto ${
        isCurrentUser
          ? 'border-2 border-solid border-[#0066FF] bg-[#00F0FF10]'
          : 'bg-gradient-to-r from-[#1a1a3e80] to-[#2a2a4e80] rounded-lg'
      }`}
      style={{
        backgroundImage: 'url(/profile/ranking/top3/rank_border.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Rank */}
      <div className="flex items-center gap-3 flex-1">
        <span
          className="font-oxanium font-bold text-[14px] w-[40px] ml-[-15px] mt-[2px]"
          style={{ color: '#FFFF' }}
        >
          #{rank}
        </span>

        {/* Avatar */}
        <div className="w-[20px] h-[20px] rounded-full overflow-hidden border border-[#00F0FF] flex items-center justify-center">
          <Image
            src={avatar}
            alt={name}
            width={20}
            height={20}
            className="w-full h-full rounded-full object-cover"
            style={{ width: '100%', height: '100%' }}
            unoptimized={true}
          />
        </div>

        {/* Username */}
        <span className="font-oxanium font-bold text-[14px] text-white ">
          {name}
        </span>
      </div>

      {/* Value */}
      <span
        className="font-oxanium font-bold text-[14px]"
        style={{ color: '#00F0FF' }}
      >
        {power !== undefined ? power.toLocaleString() : nova?.toLocaleString()}
      </span>
    </div>
  )
}

// Current user item component
interface CurrentUserItemProps {
  rank: number
  name: string
  power?: number
  nova?: number
  avatar: string
}

const CurrentUserItem = ({
  rank,
  name,
  power,
  nova,
  avatar,
}: CurrentUserItemProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-2 w-[300px] mx-auto border-2 border-dashed border-[#0066FF] bg-[#00F0FF10]">
      {/* Rank */}
      <div className="flex items-center flex-1" style={{ paddingLeft: '5px' }}>
        <span
          className="font-oxanium font-bold text-[14px] w-[40px]"
          style={{ color: '#FFFF' }}
        >
          #{rank}
        </span>

        {/* Avatar */}
        <div
          className="w-[20px] h-[20px] rounded-full overflow-hidden border border-[#00F0FF] flex items-center justify-center"
          style={{ marginLeft: '9px' }}
        >
          <Image
            src={avatar}
            alt={name}
            width={20}
            height={20}
            className="w-full h-full rounded-full object-cover"
            style={{ width: '100%', height: '100%' }}
            unoptimized={true}
          />
        </div>

        {/* Username */}
        <span className="font-oxanium font-bold text-[14px] text-white  ml-3">
          {name}
        </span>
      </div>

      {/* Value */}
      <span
        className="font-oxanium font-bold text-[14px]"
        style={{ color: '#00F0FF' }}
      >
        {power !== undefined ? power.toLocaleString() : nova?.toLocaleString()}
      </span>
    </div>
  )
}

// History record card component
interface HistoryCardProps {
  type: string
  time: string
  action: string
  amount: number
  iconPath: string
}

const HistoryCard = ({
  type,
  time,
  action,
  amount,
  iconPath,
}: HistoryCardProps) => {
  return (
    <div className="bg-[url(/profile/ranking/history_border.png)] bg-cover bg-no-repeat w-[363px] h-[83px] flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        {/* Left info */}
        <div className="flex flex-col">
          <div className="w-[55px] h-[20px] bg-[url('/profile/ranking/asset_border.svg')] bg-cover bg-no-repeat flex items-center justify-center">
            <span className="font-oxanium font-bold uppercase text-[14px] text-[#B0B0C0]">
              {type}
            </span>
          </div>
          <span className="font-oxanium text-[10px] text-[#808090] mt-1 self-start">
            {time}
          </span>
        </div>
        <div>
          <span className="font-oxanium font-bold text-[16px] text-white">
            {action}
          </span>
        </div>
        {/* Right value */}
        <div className="flex items-center gap-1">
          <span
            className="font-oxanium font-bold text-[24px]"
            style={{ color: '#BC13FE' }}
          >
            {amount.toLocaleString()}
          </span>
          <Image
            src={iconPath}
            alt="Asset Icon"
            width={50}
            height={50}
            className="w-[50px] h-[50px]"
          />
        </div>
      </div>
    </div>
  )
}

interface RankingProps {
  defaultTab?: 'history' | 'power' | 'nova'
}

export default function Ranking({ defaultTab = 'history' }: RankingProps = {}) {
  const tabs = [
    { key: 'history', label: 'HISTORY' },
    { key: 'power', label: 'POWER' },
    { key: 'nova', label: 'NOVA' },
  ] as const

  const [activeTab, setActiveTab] = useState<'history' | 'power' | 'nova'>(
    defaultTab
  )
  const borderSrc = '/GlobalBorder/profile/RankingBorder.svg'
  const tabWidth = 121
  const tabHeight = 30
  const tabTop = 5
  const tabLeft = 1 // Add left margin for spacing

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Tab container */}
      <div className="w-[363px] h-[40px] relative">
        {/* SVG border */}
        <div className="absolute inset-0">
          <Image
            src={borderSrc}
            alt="Ranking Border"
            width={363}
            height={40}
            className="w-full h-full object-fill"
          />
        </div>

        {/* Tab text */}
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab
          const left = `${index * tabWidth}px`

          return (
            <div
              key={tab.key}
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                left,
                top: `${tabTop}px`,
                width: `${tabWidth}px`,
                height: `${tabHeight}px`,
                background: isActive
                  ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.35) 0%, rgba(0, 240, 255, 0.2) 100%)'
                  : 'transparent',
                boxShadow: isActive
                  ? '0 0 10px rgba(0, 240, 255, 0.35)'
                  : 'none',
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <span
                className="font-oxanium font-bold text-[14px] leading-[18px] text-center tracking-[0.04em] uppercase"
                style={{
                  color: isActive ? '#00F0FF' : '#9B8FB3',
                  textShadow: isActive
                    ? '0 0 6px rgba(0, 240, 255, 0.55)'
                    : 'none',
                }}
              >
                {tab.label}
              </span>
              {index < tabs.length - 1 &&
                tab.key !== 'power' &&
                tabs[index + 1].key !== 'power' && (
                  <span
                    className="absolute top-0 right-[-1px] h-full w-[2px] pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(0, 240, 255, 0.6) 0%, rgba(188, 19, 254, 0.6) 100%)',
                    }}
                  />
                )}
            </div>
          )
        })}
      </div>

      {/* History card - only show in history tab */}
      {activeTab === 'history' && (
        <div className="mt-4 space-y-2">
          {historyListData.map(history => (
            <HistoryCard
              key={history.id}
              type={history.type}
              time={history.time}
              action={history.action}
              amount={history.amount}
              iconPath={history.iconPath}
            />
          ))}
        </div>
      )}

      {/* Power ranking - only show in power tab */}
      {activeTab === 'power' && (
        <div className="flex justify-center mt-4 overflow-hidden">
          <div
            className="w-[363px] h-[383px] relative bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url('/profile/ranking/background.png')`,
            }}
          >
            <div className="relative z-10 pt-8 px-4 space-y-3 h-full flex flex-col">
              {/* Top label */}
              <div className="flex justify-center">
                <div
                  className="font-orbitron font-[900] text-[15px] leading-[19px] flex items-center text-center tracking-[0.06em] uppercase"
                  style={{ color: '#FFFFFF' }}
                >
                  POWER RANKING
                </div>
              </div>

              {/* Top 3 - ordered as 2, 1, 3 from left to right */}
              <div className="flex justify-center gap-6 mb-2">
                {topThreeData
                  .slice(0, 3)
                  .sort((a, b) => {
                    // Custom order: 2nd, 1st, 3rd                    if (a.rank === 2) return -1
                    if (b.rank === 2) return 1
                    if (a.rank === 1) return -1
                    if (b.rank === 1) return 1
                    return 0
                  })
                  .map(user => (
                    <TopRankCard
                      key={user.rank}
                      rank={user.rank}
                      name={user.name}
                      power={user.power}
                      avatar={user.avatar}
                    />
                  ))}
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-[24px] w-[260px] bg-[url('/profile/ranking/top3/ranking_header.png')] bg-cover bg-no-repeat"></div>
              </div>

              {/* Scrollable ranking list area */}
              <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pb-2">
                {powerRankingListData.map(user => (
                  <RankingItem
                    key={user.rank}
                    rank={user.rank}
                    name={user.name}
                    power={user.power}
                    avatar={user.avatar}
                    isCurrentUser={user.name === currentUserData.name}
                  />
                ))}
              </div>

              {/* Current user - fixed at bottom */}
              <div className="flex-shrink-0">
                <CurrentUserItem
                  rank={currentUserData.rank}
                  name={currentUserData.name}
                  power={currentUserData.power}
                  avatar={currentUserData.avatar}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nova ranking - only show in nova tab */}
      {activeTab === 'nova' && (
        <div className="flex justify-center mt-4 overflow-hidden">
          <div
            className="w-[363px] h-[383px] relative bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url('/profile/ranking/background.png')`,
            }}
          >
            <div className="relative z-10 pt-8 px-4 space-y-3 h-full flex flex-col">
              {/* Top label */}
              <div className="flex justify-center">
                <div
                  className="font-orbitron font-[900] text-[15px] leading-[19px] flex items-center text-center tracking-[0.06em] uppercase"
                  style={{ color: '#FFFFFF' }}
                >
                  NOVA RANKING
                </div>
              </div>

              {/* Top 3 - ordered as 2, 1, 3 from left to right */}
              <div className="flex justify-center gap-6 mb-2">
                {topThreeData
                  .slice(0, 3)
                  .sort((a, b) => {
                    // Custom order: 2nd, 1st, 3rd                    if (a.rank === 2) return -1
                    if (b.rank === 2) return 1
                    if (a.rank === 1) return -1
                    if (b.rank === 1) return 1
                    return 0
                  })
                  .map(user => {
                    // Create mock data for Nova ranking
                    const novaUser = {
                      ...user,
                      nova: user.power / 10, // Simple conversion, should get real data
                    }
                    return (
                      <TopRankCard
                        key={novaUser.rank}
                        rank={novaUser.rank}
                        name={novaUser.name}
                        nova={novaUser.nova} // Use nova value
                        avatar={novaUser.avatar}
                      />
                    )
                  })}
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-[24px] w-[260px] bg-[url('/profile/ranking/top3/ranking_header.png')] bg-cover bg-no-repeat"></div>
              </div>

              {/* Scrollable ranking list area */}
              <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pb-2">
                {novaRankingListData.map(user => (
                  <RankingItem
                    key={user.rank}
                    rank={user.rank}
                    name={user.name}
                    nova={user.nova}
                    avatar={user.avatar}
                    isCurrentUser={user.name === currentUserData.name}
                  />
                ))}
              </div>

              {/* Current user - fixed at bottom */}
              <div className="flex-shrink-0">
                <CurrentUserItem
                  rank={currentUserData.rank}
                  name={currentUserData.name}
                  nova={Math.floor(currentUserData.power / 10)} // Simple conversion
                  avatar={currentUserData.avatar}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
