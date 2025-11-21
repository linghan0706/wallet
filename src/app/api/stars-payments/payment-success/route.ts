import { NextResponse } from 'next/server'
import { addPurchase } from '@/server/stars-purchases-store'
import { getSecretForItem } from '@/server/item-secrets'

type PaymentSuccessBody = {
  userId?: string
  itemId?: string
  transactionId?: string
  requestId?: string
}

function normalizeId(value?: string | number): string | null {
  if (value === undefined || value === null) return null
  return typeof value === 'number' ? value.toString() : String(value)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as PaymentSuccessBody
    const userId = normalizeId(body.userId)
    const itemId = body.itemId
    const transactionId = body.transactionId
    const requestId = body.requestId

    if (!userId || !itemId || !transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId, itemId and transactionId are required',
        },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    addPurchase({ userId, itemId, transactionId, requestId, timestamp })

    const secret = getSecretForItem(itemId)

    return NextResponse.json({
      success: true,
      secret,
      timestamp,
    })
  } catch (error) {
    console.error('Stars payment-success error:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to record payment success',
      },
      { status: 500 }
    )
  }
}
