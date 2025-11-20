import http from '../../http'
import type {
  Datum,
  GetTaskDetail,
  GetTasksMain,
  RewardInfo,
} from '../../../types/tasks'
import {
  annotateTelegramTasks,
  enforceTelegramFollowRequirement,
} from '../../CheckFollow'

// 常见图片扩展名匹配规则
const IMAGE_EXT_PATTERN = /\.(png|jpe?g|gif|svg|webp)$/i

// 标准化静态资源路径：保留 http(s)，去掉 'public/' 与多余斜杠
function normalizeStaticPath(assetPath?: string | null): string {
  if (!assetPath) return ''
  if (/^https?:\/\//i.test(assetPath)) return assetPath
  const trimmed = assetPath.replace(/^public\//i, '').replace(/^\/+/, '')
  return trimmed ? `/${trimmed}` : ''
}

// 判断给定路径是否为图片资源
function isImageAsset(path?: string | null): boolean {
  if (!path) return false
  return IMAGE_EXT_PATTERN.test(path)
}

// 将未知值解析为数字；失败返回 null
function parseNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

// 规范化奖励信息并标记图标是否为图片
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

// 规范化任务数据，计算奖励与进度展示
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

// 格式化任务列表接口响应
function formatTasksResponse(res: GetTasksMain): GetTasksMain {
  const data = Array.isArray(res.data) ? res.data : []
  return {
    ...res,
    data: data.map(formatTask),
  }
}

// 格式化任务详情接口响应
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
  formatted.data = await annotateTelegramTasks(formatted.data)
  console.log('获取任务中心', formatted)
  return formatted
}

export async function fetchTaskCenterById(
  taskId: number | string
): Promise<GetTaskDetail> {
  const res = await http.get(`/tasks/center/${encodeURIComponent(taskId)}`)
  const parsed = res as unknown as GetTaskDetail
  const formatted = formatTaskDetailResponse(parsed)
  const [annotated] = await annotateTelegramTasks([formatted.data])
  if (annotated) {
    formatted.data = annotated
  }
  console.log('获取任务详情', formatted)
  return formatted
}

export async function checkTaskProgress(
  taskId: number | string
): Promise<GetTaskDetail> {
  await enforceTelegramFollowRequirement(taskId)
  const res = await http.get(`/tasks/${encodeURIComponent(taskId)}/check`)
  const parsed = res as unknown as GetTaskDetail
  const formatted = formatTaskDetailResponse(parsed)
  const [annotated] = await annotateTelegramTasks([formatted.data])
  if (annotated) {
    formatted.data = annotated
  }
  console.log('获取任务进度', formatted)
  return formatted
}
