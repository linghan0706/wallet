//获取主要任务接口数据类型定义
export interface GetTasksMain {
  code: number
  data: Datum[]
  message: string
  success: boolean
  timestamp: number
  [property: string]: unknown
}

export interface Datum {
  buttonEnabled: boolean
  buttonText: string
  currentProgress: number | null
  description: string
  rewardInfos: RewardInfo[]
  taskIcon: string
  taskId: number
  taskName: string
  taskRequirement: TaskRequirement
  taskStatus: string
  taskType: string
  totalRequirement: number | null
  userTaskProgressId: number
  weight: number
  [property: string]: unknown
}

export interface RewardInfo {
  assetId: number | null
  badgeId: number | null
  itemId: number | null
  rewardAmount: number | null
  rewardIcon: string
  rewardType: string
  [property: string]: unknown
}

export interface TaskRequirement {
  invite_count: number
  url?: string
  [property: string]: unknown
}
