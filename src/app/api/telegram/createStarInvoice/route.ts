import { NextResponse } from 'next/server'

const TELEGRAM_API_BASE = 'https://api.telegram.org'

type CreateInvoiceRequest = {
  amount?: number
  payload?: string
  description?: string
  title?: string
  assetId?: number
}

type TelegramInvoiceResponse = {
  ok: boolean
  result?: string
  description?: string
}

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

function extractInvoiceSlug(invoiceUrl: string): string | null {
  const match = invoiceUrl.match(/\/(\$|invoice\/)([A-Za-z0-9\\-_]+)/)
  return match?.[2] ?? null
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as CreateInvoiceRequest
    const amount = Number(body.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid Star amount is required' },
        { status: 400 }
      )
    }

    const botToken = requireEnv('TELEGRAM_BOT_TOKEN')
    const title =
      body.title?.toString().slice(0, 32) ||
      body.description?.toString().slice(0, 32) ||
      'Star item'
    const description =
      body.description?.toString().slice(0, 255) ||
      'Purchase with Telegram Stars'
    const payload =
      body.payload?.toString().slice(0, 64) ||
      `asset-${body.assetId ?? 'unknown'}`

    const prices = [{ label: title, amount: Math.round(amount) }]

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

    const tgJson = (await tgRes
      .json()
      .catch(() => null)) as TelegramInvoiceResponse | null

    if (!tgRes.ok || !tgJson?.ok || !tgJson.result) {
      const message =
        tgJson?.description ||
        `Telegram createInvoiceLink failed with status ${tgRes.status}`
      return NextResponse.json({ success: false, message }, { status: 502 })
    }

    const invoiceUrl = tgJson.result
    const invoiceSlug = extractInvoiceSlug(invoiceUrl) ?? invoiceUrl

    return NextResponse.json({ success: true, invoiceUrl, invoiceSlug })
  } catch (error) {
    console.error('Create Star invoice error:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create Star invoice',
      },
      { status: 500 }
    )
  }
}
