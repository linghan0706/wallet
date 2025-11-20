import http from '../../http'
import type {
  Datum,
  GetTaskDetail,
  GetTasksMain,
  RewardInfo,
} from '../../../types/tasks'

const IMAGE_EXT_PATTERN = /\.(png|jpe?g|gif|svg|webp)$/i

function normalizeStaticPath(assetPath?: string | null): string {
  if (!assetPath) return ''
  if (/^https?:\/\//i.test(assetPath)) return assetPath
  const trimmed = assetPath.replace(/^public\//i, '').replace(/^\/+/, '')
  return trimmed ? `/${trimmed}` : ''
}

function isImageAsset(path?: string | null): boolean {
  if (!path) return false
  return IMAGE_EXT_PATTERN.test(path)
}

function parseNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

function formatRewardInfo(info: RewardInfo): RewardInfo {
  const rewardIcon = normalizeStaticPath(info.rewardIcon)
  const rewardAmount = parseNullableNumber(info.rewardAmount)
  return {
    ...info,
    rewardIcon,
    rewardAmount,
    rewardIconIsImage: isImageAsset(rewardIcon),
  }
}

function formatTask(task: Datum): Datum {
  const rewardInfos = Array.isArray(task.rewardInfos)
    ? task.rewardInfos.map(formatRewardInfo)
    : []
  const taskIcon = normalizeStaticPath(task.taskIcon)
  const totalRewardAmount = rewardInfos.reduce(
    (sum, reward) => sum + (reward.rewardAmount ?? 0),
    0
  )
  const currentProgress = parseNullableNumber(task.currentProgress)
  const totalRequirement = parseNullableNumber(task.totalRequirement)
  const showProgress =
    currentProgress !== null &&
    totalRequirement !== null &&
    totalRequirement > 0
  const progressPercent =
    showProgress && totalRequirement
      ? Math.min(Math.max((currentProgress! / totalRequirement) * 100, 0), 100)
      : 0
  const primaryRewardIcon = rewardInfos[0]?.rewardIcon ?? ''
  const primaryRewardIconIsImage = rewardInfos[0]?.rewardIconIsImage ?? false

  return {
    ...task,
    taskIcon,
    taskIconIsImage: isImageAsset(taskIcon),
    taskIconFallbackText: task.taskName ? task.taskName.charAt(0) : '🎉',
    rewardInfos,
    totalRewardAmount,
    totalRewardDisplay:
      totalRewardAmount > 0 ? totalRewardAmount.toLocaleString() : '0',
    primaryRewardIcon,
    primaryRewardIconIsImage,
    currentProgress,
    totalRequirement,
    showProgress,
    progressPercent,
  }
}

function formatTasksResponse(res: GetTasksMain): GetTasksMain {
  const data = Array.isArray(res.data) ? res.data : []
  return {
    ...res,
    data: data.map(formatTask),
  }
}

function formatTaskDetailResponse(res: GetTaskDetail): GetTaskDetail {
  return {
    ...res,
    data: formatTask(res.data),
  }
}

export async function fetchTasksCenter(): Promise<GetTasksMain> {
  const res = await http.get('/tasks/center')
  const parsed = res as unknown as GetTasksMain
  const formatted = formatTasksResponse(parsed)
  console.log('获取任务中心', formatted)
  return formatted
}

export async function fetchTaskCenterById(
  taskId: number | string
): Promise<GetTaskDetail> {
  const res = await http.get(`/tasks/center/${encodeURIComponent(taskId)}`)
  const parsed = res as unknown as GetTaskDetail
  const formatted = formatTaskDetailResponse(parsed)
  console.log('获取任务详情', formatted)
  return formatted
}

export async function checkTaskProgress(
  taskId: number | string
): Promise<GetTaskDetail> {
  const res = await http.get(`/tasks/${encodeURIComponent(taskId)}/check`)
  const parsed = res as unknown as GetTaskDetail
  const formatted = formatTaskDetailResponse(parsed)
  console.log('获取任务进度', formatted)
  return formatted
}
