import type { Datum } from '@/types/tasks'
import { getSavedLoginInfo } from './api'
import { checkTelegramJoined } from './api/telegram/api'

type TelegramTaskConfig = {
  chatId?: string
  requirementLabel: string
  errorMessage: string
}

const TELEGRAM_TASK_CONFIG: Record<number, TelegramTaskConfig> = {
  2: {
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_GROUP_ID,
    requirementLabel: '加入官方 Telegram 群组',
    errorMessage: '请先加入官方 Telegram 群组',
  },
  3: {
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_ID,
    requirementLabel: '关注官方 Telegram 频道',
    errorMessage: '请先关注官方 Telegram 频道',
  },
}

const TELEGRAM_TASK_IDS = new Set<number>(
  Object.keys(TELEGRAM_TASK_CONFIG).map(Number)
)

export type TelegramFollowCheckResult = {
  taskId: number
  joined: boolean
  requiresTelegramVerification: boolean
  status?: string
  requirementLabel?: string
  message?: string
}

function isClientEnv(): boolean {
  return typeof window !== 'undefined'
}

function getTelegramTaskConfig(taskId: number): TelegramTaskConfig | undefined {
  return TELEGRAM_TASK_CONFIG[taskId]
}

function readTelegramUserId(): number | null {
  if (!isClientEnv()) return null
  try {
    const saved = getSavedLoginInfo()
    return saved.user?.telegramId ?? null
  } catch (error) {
    console.warn('Failed to read Telegram user info from storage', error)
    return null
  }
}

export function isTelegramFollowTask(taskId: number | string): boolean {
  const id = Number(taskId)
  if (!Number.isFinite(id)) return false
  return TELEGRAM_TASK_IDS.has(id)
}

export async function checkTelegramFollowStatus(
  taskId: number | string
): Promise<TelegramFollowCheckResult> {
  const id = Number(taskId)
  if (!Number.isFinite(id)) {
    return {
      taskId: id,
      joined: false,
      requiresTelegramVerification: false,
    }
  }

  const config = getTelegramTaskConfig(id)
  if (!config) {
    return {
      taskId: id,
      joined: true,
      requiresTelegramVerification: false,
    }
  }

  if (!isClientEnv()) {
    return {
      taskId: id,
      joined: false,
      requiresTelegramVerification: true,
      requirementLabel: config.requirementLabel,
      message: 'Telegram 验证仅在客户端执行',
    }
  }

  if (!config.chatId) {
    return {
      taskId: id,
      joined: false,
      requiresTelegramVerification: true,
      requirementLabel: config.requirementLabel,
      message: '未配置 Telegram chat ID',
    }
  }

  const telegramUserId = readTelegramUserId()
  if (!telegramUserId) {
    return {
      taskId: id,
      joined: false,
      requiresTelegramVerification: true,
      requirementLabel: config.requirementLabel,
      message: '请先完成 Telegram 登录',
    }
  }

  try {
    const response = await checkTelegramJoined(telegramUserId, config.chatId)
    return {
      taskId: id,
      joined: response.joined,
      requiresTelegramVerification: true,
      status: response.status,
      requirementLabel: config.requirementLabel,
      message: response.joined ? undefined : config.errorMessage,
    }
  } catch (error) {
    console.error('Telegram follow verification failed:', error)
    return {
      taskId: id,
      joined: false,
      requiresTelegramVerification: true,
      requirementLabel: config.requirementLabel,
      message: error instanceof Error ? error.message : config.errorMessage,
    }
  }
}

export async function enforceTelegramFollowRequirement(
  taskId: number | string
): Promise<void> {
  if (!isClientEnv()) return
  if (!isTelegramFollowTask(taskId)) return

  const result = await checkTelegramFollowStatus(taskId)
  if (!result.joined) {
    throw new Error(
      result.message ||
        `请先完成 ${result.requirementLabel || '指定 Telegram 任务'}`
    )
  }
}

export async function annotateTelegramTasks<T extends Datum>(
  tasks: T[]
): Promise<T[]> {
  if (!tasks || tasks.length === 0) return tasks

  if (!isClientEnv()) {
    return tasks.map(task => {
      if (isTelegramFollowTask(task.taskId)) {
        return {
          ...task,
          requiresTelegramVerification: true,
          telegramRequirementLabel: getTelegramTaskConfig(task.taskId)
            ?.requirementLabel,
        } as T
      }
      return {
        ...task,
        requiresTelegramVerification: false,
      } as T
    })
  }

  const annotated = await Promise.all(
    tasks.map(async task => {
      if (!isTelegramFollowTask(task.taskId)) {
        return {
          ...task,
          requiresTelegramVerification: false,
        } as T
      }

      const result = await checkTelegramFollowStatus(task.taskId)
      return {
        ...task,
        requiresTelegramVerification: true,
        telegramVerified: result.joined,
        telegramVerificationStatus: result.status,
        telegramVerificationMessage: result.message,
        telegramRequirementLabel: result.requirementLabel,
      } as T
    })
  )

  return annotated
}
