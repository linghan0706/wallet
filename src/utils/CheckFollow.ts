import type { Datum } from '@/types/tasks'
import { getSavedLoginInfo } from './api'
import { checkTelegramJoined } from './api/telegram/api'

type TelegramTaskConfig = {
  chatId?: string
  requirementLabel: string
  errorMessage: string
}
// 从env配置中读取的静态Telegram任务配置
const STATIC_TELEGRAM_TASK_CONFIG: Record<number, TelegramTaskConfig> = {
  3: {
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_ID,
    requirementLabel: 'Follow the official Telegram channel',
    errorMessage: 'Please follow the official Telegram channel first',
  },
  4: {
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_GROUP_ID,
    requirementLabel: 'Join the official Telegram group',
    errorMessage: 'Please join the official Telegram group first',
  },
}
// 从任务描述中推断的Telegram任务配置模板
const TELEGRAM_DESCRIPTION_CONFIG: Record<string, TelegramTaskConfig> = {
  'tasks.follow.subscribe_tg_channel': {
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_ID,
    requirementLabel: 'Follow the official Telegram channel',
    errorMessage: 'Please follow the official Telegram channel first',
  },
  'tasks.follow.join_tg_group': {
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_GROUP_ID,
    requirementLabel: 'Join the official Telegram group',
    errorMessage: 'Please join the official Telegram group first',
  },
}

const TELEGRAM_TASK_CONFIG_CACHE = new Map<number, TelegramTaskConfig>()

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
  const cached = TELEGRAM_TASK_CONFIG_CACHE.get(taskId)
  if (cached) return cached

  const staticConfig = STATIC_TELEGRAM_TASK_CONFIG[taskId]
  if (staticConfig) {
    TELEGRAM_TASK_CONFIG_CACHE.set(taskId, staticConfig)
    return staticConfig
  }
  return undefined
}

function buildConfigFromTask(
  task: Datum,
  template?: TelegramTaskConfig
): TelegramTaskConfig {
  const requirement = (task.taskRequirement ??
    {}) as Datum['taskRequirement'] & {
    chatId?: string | number
  }
  const chatIdFromRequirement =
    requirement && requirement.chatId !== undefined
      ? String(requirement.chatId)
      : undefined
  const requirementLabel =
    template?.requirementLabel ||
    task.taskName?.trim() ||
    'Telegram follow requirement'
  const errorMessage =
    template?.errorMessage || `Please complete ${requirementLabel} first`

  return {
    chatId: chatIdFromRequirement || template?.chatId,
    requirementLabel,
    errorMessage,
  }
}

function registerTelegramTaskConfig(task: Datum): void {
  const id = Number(task.taskId)
  if (!Number.isFinite(id) || TELEGRAM_TASK_CONFIG_CACHE.has(id)) return

  const descriptionKey =
    typeof task.description === 'string' ? task.description.trim() : ''
  if (descriptionKey && TELEGRAM_DESCRIPTION_CONFIG[descriptionKey]) {
    const template = TELEGRAM_DESCRIPTION_CONFIG[descriptionKey]
    TELEGRAM_TASK_CONFIG_CACHE.set(id, buildConfigFromTask(task, template))
    return
  }

  const staticConfig = STATIC_TELEGRAM_TASK_CONFIG[id]
  if (staticConfig) {
    TELEGRAM_TASK_CONFIG_CACHE.set(id, staticConfig)
  }
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
  return Boolean(getTelegramTaskConfig(id))
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
      message: 'Telegram verification runs on the client side only',
    }
  }

  if (!config.chatId) {
    return {
      taskId: id,
      joined: false,
      requiresTelegramVerification: true,
      requirementLabel: config.requirementLabel,
      message: 'Telegram chat ID is not configured',
    }
  }

  const telegramUserId = readTelegramUserId()
  if (!telegramUserId) {
    return {
      taskId: id,
      joined: false,
      requiresTelegramVerification: true,
      requirementLabel: config.requirementLabel,
      message: 'Please sign in with Telegram first',
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
        `Please complete ${result.requirementLabel || 'the Telegram task'} first`
    )
  }
}

export async function annotateTelegramTasks<T extends Datum>(
  tasks: T[]
): Promise<T[]> {
  if (!tasks || tasks.length === 0) return tasks

  tasks.forEach(registerTelegramTaskConfig)

  if (!isClientEnv()) {
    return tasks.map(task => {
      if (isTelegramFollowTask(task.taskId)) {
        return {
          ...task,
          requiresTelegramVerification: true,
          telegramRequirementLabel: getTelegramTaskConfig(Number(task.taskId))
            ?.requirementLabel,
        } as T
      }
      return {
        ...task,
        requiresTelegramVerification: false,
      } as T
    })
  }
  // 验证并注释每个任务的Telegram状态
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
