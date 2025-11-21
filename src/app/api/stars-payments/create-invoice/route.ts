import { NextResponse } from 'next/server'
const TELEGRAM_API_BASE = 'https://api.telegram.org'

type CreateInvoiceBody = {
  itemId?: string
  userId?: string
  title?: string
  description?: string
  price?: number
}

function requireBotToken(): string {
  const token =
    process.env.TELEGRAM_BOT_TOKEN ??
    process.env.BOT_TOKEN ??
    process.env.BOT_API_TOKEN
  if (!token) {
    throw new Error('Missing Telegram bot token for Stars invoicing')
  }
  return token
}

function normalizeUserId(raw?: string | number): string | null {
  if (raw === undefined || raw === null) return null
  return typeof raw === 'number' ? raw.toString() : String(raw)
}

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `req-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as CreateInvoiceBody
    const itemId = body.itemId
    const userId = normalizeUserId(body.userId)
    const title = body.title?.toString().slice(0, 64) || 'Stars item'
    const description =
      body.description?.toString().slice(0, 255) || 'Telegram Stars purchase'
    const price = Number(body.price)

    if (!itemId || !userId) {
      return NextResponse.json(
        { success: false, message: 'itemId and userId are required' },
        { status: 400 }
      )
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid price is required' },
        { status: 400 }
      )
    }

    const botToken = requireBotToken()
    const requestId = generateRequestId()
    const payload = `${itemId}:${userId}:${requestId}`
    const prices = [{ label: title, amount: Math.round(price) }]

    const tgRes = await fetch(
      `${TELEGRAM_API_BASE}/bot${botToken}/createInvoiceLink`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          title,
          description,
          payload,
          currency: 'XTR',
          prices,
        }),
      }
    )

    const tgJson = (await tgRes.json().catch(() => null)) as {
      ok: boolean
      result?: string
      description?: string
    } | null

    if (!tgRes.ok || !tgJson?.ok || !tgJson.result) {
      const message =
        tgJson?.description ||
        `Telegram createInvoiceLink failed with status ${tgRes.status}`
      return NextResponse.json({ success: false, message }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      invoiceLink: tgJson.result,
      requestId,
    })
  } catch (error) {
    console.error('Stars create-invoice error:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create Stars invoice',
      },
      { status: 500 }
    )
  }
}
