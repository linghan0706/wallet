'use client'

import { useState } from 'react'
import Image from 'next/image'

// 渲染数据
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

// 前三名卡片组件
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

  // 根据排名设置不同的样式
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
      {/* 包含头像、用户名和数值的完整卡片 */}
      <div
        className={`relative ${cardStyle.size} flex flex-col items-center justify-center`}
        style={{
          backgroundImage: `url(${cardStyle.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 头像 */}
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

        {/* 用户名 */}
        <div className="font-oxanium font-bold text-[12px] text-white z-10">
          {name}
        </div>

        {/* 数值 */}
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

// 排行榜列表项组件
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
      {/* 排名 */}
      <div className="flex items-center gap-3 flex-1">
        <span
          className="font-oxanium font-bold text-[14px] w-[40px] ml-[-15px] mt-[2px]"
          style={{ color: '#FFFF' }}
        >
          #{rank}
        </span>

        {/* 头像 */}
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

        {/* 用户名 */}
        <span className="font-oxanium font-bold text-[14px] text-white ">
          {name}
        </span>
      </div>

      {/* 数值 */}
      <span
        className="font-oxanium font-bold text-[14px]"
        style={{ color: '#00F0FF' }}
      >
        {power !== undefined ? power.toLocaleString() : nova?.toLocaleString()}
      </span>
    </div>
  )
}

// 当前用户项组件
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
      {/* 排名 */}
      <div className="flex items-center flex-1" style={{ paddingLeft: '5px' }}>
        <span
          className="font-oxanium font-bold text-[14px] w-[40px]"
          style={{ color: '#FFFF' }}
        >
          #{rank}
        </span>

        {/* 头像 */}
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

        {/* 用户名 */}
        <span className="font-oxanium font-bold text-[14px] text-white  ml-3">
          {name}
        </span>
      </div>

      {/* 数值 */}
      <span
        className="font-oxanium font-bold text-[14px]"
        style={{ color: '#00F0FF' }}
      >
        {power !== undefined ? power.toLocaleString() : nova?.toLocaleString()}
      </span>
    </div>
  )
}

// 历史记录卡片组件
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
        {/* 左侧信息 */}
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
        {/* 右侧数值 */}
        <div className="flex items-center gap-1">
          <span
            className="font-oxanium font-bold text-[24px]"
            style={{ color: '#BC13FE' }}
          >
            {amount.toLocaleString()}
          </span>
          <img src={iconPath} alt="Asset Icon" className="w-[50px] h-[50px]" />
        </div>
      </div>
    </div>
  )
}

export default function Ranking() {
  const tabs = [
    { key: 'history', label: 'HISTORY' },
    { key: 'power', label: 'POWER' },
    { key: 'nova', label: 'NOVA' },
  ] as const

  const [activeTab, setActiveTab] = useState<'history' | 'power' | 'nova'>(
    'history'
  )
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab)
  const activeLeft = `${activeIndex * 121}px`
  const borderSrc = '/GlobalBorder/profile/RankingBorder.svg'

  return (
    <div className="flex flex-col items-center mt-4">
      {/* 标签页容器 */}
      <div className="w-[363px] h-[30px] relative">
        {/* SVG 边框 */}
        <div className="absolute inset-0">
          <img
            src={borderSrc}
            alt="Ranking Border"
            className="w-full h-full object-fill"
          />
        </div>

        {/* 激活指示器 */}
        <div
          className="absolute top-[1px] h-[26px] w-[115px] transition-all duration-300 ease-in-out"
          style={{
            left: activeLeft,
            background:
              activeTab === 'nova'
                ? 'linear-gradient(90deg, rgba(188, 19, 254, 0.35) 0%, rgba(188, 19, 254, 0.35) 100%)'
                : 'linear-gradient(90deg, rgba(0, 240, 255, 0.35) 0%, rgba(0, 240, 255, 0.35) 100%)',
          }}
        />

        {/* 标签文本 */}
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab
          const left = `${index * 121}px`

          return (
            <div
              key={tab.key}
              className="absolute top-0 h-[30px] w-[121px] flex items-center justify-center cursor-pointer"
              style={{ left }}
              onClick={() => setActiveTab(tab.key)}
            >
              <span
                className="font-oxanium font-bold text-[14px] leading-[18px] text-center tracking-[0.04em] uppercase"
                style={{
                  color: isActive
                    ? tab.key === 'nova'
                      ? '#BC13FE'
                      : '#00F0FF'
                    : '#B0B0C0',
                  textShadow: isActive
                    ? tab.key === 'nova'
                      ? '0 0 6px rgba(188, 19, 254, 0.55)'
                      : '0 0 6px rgba(0, 240, 255, 0.5)'
                    : 'none',
                }}
              >
                {tab.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* History 卡片 - 仅在 history tab 显示 */}
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

      {/* Power 排行榜 - 仅在 power tab 显示 */}
      {activeTab === 'power' && (
        <div className="flex justify-center mt-4 overflow-hidden">
          <div
            className="w-[363px] h-[383px] relative bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url('/profile/ranking/background.png')`,
            }}
          >
            <div className="relative z-10 pt-8 px-4 space-y-3 max-h-[383px] overflow-y-auto scrollbar-hide">
              {/* 顶部标签 */}
              <div className="flex justify-center">
                <div
                  className="font-orbitron font-[900] text-[15px] leading-[19px] flex items-center text-center tracking-[0.06em] uppercase"
                  style={{ color: '#FFFFFF' }}
                >
                  POWER RANKING
                </div>
              </div>

              {/* 前三名 - 按照从左到右：2、1、3的顺序 */}
              <div className="flex justify-center gap-6 mb-2">
                {topThreeData
                  .slice(0, 3)
                  .sort((a, b) => {
                    // 自定义排序：第2名、第1名、第3名
                    if (a.rank === 2) return -1
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
              {/* 排行榜列表 */}
              <div className="space-y-2">
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

              {/* 当前用户 */}
              <CurrentUserItem
                rank={currentUserData.rank}
                name={currentUserData.name}
                power={currentUserData.power}
                avatar={currentUserData.avatar}
              />
            </div>
          </div>
        </div>
      )}

      {/* Nova 排行榜 - 仅在 nova tab 显示 */}
      {activeTab === 'nova' && (
        <div className="flex justify-center mt-4 overflow-hidden">
          <div
            className="w-[363px] h-[383px] relative bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url('/profile/ranking/background.png')`,
            }}
          >
            <div className="relative z-10 pt-8 px-4 space-y-3 max-h-[383px] overflow-y-auto scrollbar-hide">
              {/* 顶部标签 */}
              <div className="flex justify-center">
                <div
                  className="font-orbitron font-[900] text-[15px] leading-[19px] flex items-center text-center tracking-[0.06em] uppercase"
                  style={{ color: '#FFFFFF' }}
                >
                  NOVA RANKING
                </div>
              </div>

              {/* 前三名 - 按照从左到右：2、1、3的顺序 */}
              <div className="flex justify-center gap-6 mb-2">
                {topThreeData
                  .slice(0, 3)
                  .sort((a, b) => {
                    // 自定义排序：第2名、第1名、第3名
                    if (a.rank === 2) return -1
                    if (b.rank === 2) return 1
                    if (a.rank === 1) return -1
                    if (b.rank === 1) return 1
                    return 0
                  })
                  .map(user => {
                    // 为Nova排行榜创建模拟数据
                    const novaUser = {
                      ...user,
                      nova: user.power / 10, // 简单转换，实际应从真实数据获取
                    }
                    return (
                      <TopRankCard
                        key={novaUser.rank}
                        rank={novaUser.rank}
                        name={novaUser.name}
                        nova={novaUser.nova} // 使用nova值
                        avatar={novaUser.avatar}
                      />
                    )
                  })}
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-[24px] w-[260px] bg-[url('/profile/ranking/top3/ranking_header.png')] bg-cover bg-no-repeat"></div>
              </div>
              {/* 排行榜列表 */}
              <div className="space-y-2">
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

              {/* 当前用户 */}
              <CurrentUserItem
                rank={currentUserData.rank}
                name={currentUserData.name}
                nova={Math.floor(currentUserData.power / 10)} // 简单转换
                avatar={currentUserData.avatar}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
