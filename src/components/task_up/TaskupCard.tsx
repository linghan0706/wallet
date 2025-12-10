'use client'

import Image from 'next/image'

type TaskupType = 'Continue' | 'Retry' | '' | undefined

{
  /*
  * 任务进度json
{
  id: number          //任务进度id，id：1完成，id：2：失败，id：3：任务进行扫描中
  title: string       //标题              
  description?: string//进度描述  可以为空  id：1没有任务描述
  image: string       //任务进度图标
  Reward: number      //奖励数据，可以为空  仅id：1完成有奖励
  RewardIcon?: string //奖励图标  可以为空  仅id：完成有奖励图标
  type?: TaskupType   //任务情况  可以为空  类型 "Continue" | "Retry" | undefined
} 
*/
}

interface TaskupItem {
  id: number
  title: string
  description?: string
  image: string
  Reward: number
  RewardIcon?: string
  type?: TaskupType
}

interface TaskupCardProps {
  items?: TaskupItem[]
  loading?: boolean
  activeId?: number
}
{
  /*
  * 任务进度卡片组件
  *图层需要分级显示
  1.加载中loading
  2.任务完成
  3.任务失败
  4.任务扫描中
  传入参数：
  items：任务进度json数组
  loading：是否加载中
  activeId：当前激活的任务进度id
  默认显示第一个任务进度
    */
}
const defaultItems: TaskupItem[] = [
  {
    id: 1,
    title: 'task Complete!',
    description: '',
    image: '/Popup/taskComplete.svg',
    Reward: 100,
    RewardIcon: '/gamecoins/powers.png',
    type: 'Continue',
  },
  {
    id: 2,
    title: 'task Failed!!!',
    description: 'Task failed. Please try again.',
    image: '/Popup/taskFailed.svg',
    Reward: 0,
    RewardIcon: '/gamecoins/powers.png',
    type: 'Retry',
  },
  {
    id: 3,
    title: 'Task Scanning...',
    description: 'Analyzing task data, please wait...',
    image: '/Popup/taskScanning.svg',
    Reward: 0,
    RewardIcon: '/gamecoins/powers.png',
    type: '',
  },
]

export default function TaskupCard({
  items = defaultItems,
  loading = false,
  activeId,
}: TaskupCardProps) {
  const activeItem = items.find(i => i.id === activeId) ?? items[0]
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 p-4"
      role="list"
      aria-busy={loading}
    >
      {loading && (
        <div className="container flex justify-center items-center w-[317px] h-[300px] rounded-[12px]">
          <Image
            src="/Popup/loading.svg"
            alt="loading"
            width={100}
            height={100}
            className="w-[100px] h-[100px] animate-spin"
          ></Image>
        </div>
      )}

      {!loading && (
        <div
          key={activeItem.id}
          className="mb-2 w-[300px] h-[300px] rounded-[12px] overflow-hidden bg-[url('/Popup/taskupback.svg')] bg-cover bg-center bg-[#0F172B] border border-white/10 flex flex-col justify-center items-center gap-2 text-white"
          role="listitem"
        >
          <Image
            src={activeItem.image}
            alt={activeItem.title}
            width={140}
            height={140}
            className="w-[140px] h-[140px]"
          />
          <p className="mt-1 font-roboto font-medium text-[16px] leading-[22px] text-center text-white">
            {activeItem.title}
          </p>
          {activeItem.id !== 1 && activeItem.description && (
            <p className="font-roboto font-normal text-[14px] leading-[22px] text-center text-[#E4E4E4]">
              {activeItem.description}
            </p>
          )}

          {activeItem.Reward > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <span className="font-roboto font-normal text-[14px] leading-[22px] text-center text-[#E4E4E4]">
                Reward:
              </span>
              {activeItem.RewardIcon && (
                <Image
                  src={activeItem.RewardIcon}
                  alt="reward"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
              )}
              <span className="font-roboto font-normal text-[14px] leading-[22px] text-center text-[#E4E4E4]">
                +{activeItem.Reward}
              </span>
            </div>
          )}

          {activeItem.id !== 3 &&
            activeItem.type &&
            (activeItem.type === 'Continue' || activeItem.type === 'Retry') && (
              <button
                className={`mt-2 w-[140px] h-[30px] px-[10px] py-[4px] rounded-[8px] flex flex-row items-center justify-center gap-1 text-white font-jersey-10 font-medium text-[14px] leading-[22px] ${
                  activeItem.id === 1
                    ? 'bg-[linear-gradient(90deg, rgba(50, 205, 50, 0.6) 0%, rgba(0, 240, 255, 0.6) 97.12%)]'
                    : activeItem.id === 2
                      ? 'bg-[linear-gradient(90deg, rgba(255, 140, 0, 0.6) 0%, rgba(255, 140, 0, 0.6) 97.12%);]'
                      : ''
                }`}
              >
                {activeItem.type}
              </button>
            )}
        </div>
      )}
    </div>
  )
}
