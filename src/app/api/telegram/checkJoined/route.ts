import { NextResponse } from 'next/server'

const TELEGRAM_API_BASE = 'https://api.telegram.org'
const VALID_STATUSES = new Set(['member', 'administrator', 'creator'])

type CheckJoinedRequest = {
  user_id?: number | string
  userId?: number | string
  chat_id?: number | string
  chatId?: number | string
}

function getRequiredEnv(key: string, fallbackKey?: string): string {
  const value =
    process.env[key] ?? (fallbackKey ? process.env[fallbackKey] : undefined)
  if (!value) {
    throw new Error(
      `Missing environment variable: ${fallbackKey ? `${key} or ${fallbackKey}` : key}`
    )
  }
  return value
}

async function queryTelegramMembership(
  botToken: string,
  chatId: string,
  userId: string
) {
  const url = `${TELEGRAM_API_BASE}/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(
    chatId
  )}&user_id=${encodeURIComponent(userId)}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // avoid caching to ensure real-time verification
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Telegram API error: ${res.status} ${text}`)
  }

  return res.json()
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as CheckJoinedRequest
    const userId = body.user_id ?? body.userId
    const overrideChatId = body.chat_id ?? body.chatId

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'user_id is required' },
        { status: 400 }
      )
    }

    const botToken = getRequiredEnv('TELEGRAM_BOT_TOKEN')
    const defaultChatId = getRequiredEnv(
      'TELEGRAM_GROUP_ID',
      'TELEGRAM_CHAT_ID'
    )
    const chatId = (overrideChatId ?? defaultChatId).toString()

    const telegramRes = await queryTelegramMembership(
      botToken,
      chatId,
      userId.toString()
    )

    const status = telegramRes?.result?.status as string | undefined
    const joined = status ? VALID_STATUSES.has(status) : false

    return NextResponse.json({ success: true, joined, status })
  } catch (error) {
    console.error('Telegram checkJoined error:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to verify membership',
      },
      { status: 500 }
    )
  }
}
