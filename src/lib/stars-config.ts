export const MOCK_USER_ID = 'mock-user-id'

export function getBotToken(): string {
  const token =
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.BOT_TOKEN ||
    process.env.NEXT_PUBLIC_BOT_TOKEN
  if (!token) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN for Stars payments')
  }
  return token
}
