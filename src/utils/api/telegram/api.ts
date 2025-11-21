export type TelegramCheckJoinedResponse = {
  success: boolean
  joined: boolean
  status?: string
  message?: string
}

export async function checkTelegramJoined(
  userId: number | string,
  chatId?: number | string
): Promise<TelegramCheckJoinedResponse> {
  if (!userId) {
    throw new Error('userId is required to verify Telegram membership')
  }

  const response = await fetch('/api/telegram/checkJoined', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, chat_id: chatId }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody?.message || 'Failed to verify Telegram status'
    throw new Error(message)
  }

  return response.json()
}
