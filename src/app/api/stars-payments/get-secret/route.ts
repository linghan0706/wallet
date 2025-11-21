import { NextResponse } from 'next/server'
import { findPurchase } from '@/server/stars-purchases-store'
import { getSecretForItem } from '@/server/item-secrets'

type SecretRequestBody = {
  itemId?: string
  transactionId?: string
  userId?: string
}

function normalize(value?: string | number): string | null {
  if (value === undefined || value === null) return null
  return typeof value === 'number' ? value.toString() : String(value)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as SecretRequestBody
    const itemId = body.itemId
    const transactionId = body.transactionId
    const userId = normalize(body.userId)

    if (!itemId || !transactionId) {
      return NextResponse.json(
        { success: false, message: 'itemId and transactionId are required' },
        { status: 400 }
      )
    }

    const purchase = findPurchase(itemId, transactionId, userId || undefined)
    if (!purchase) {
      return NextResponse.json(
        { success: false, message: 'Purchase not found' },
        { status: 404 }
      )
    }

    const secret = getSecretForItem(itemId)

    return NextResponse.json({ success: true, secret })
  } catch (error) {
    console.error('Stars get-secret error:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch purchase secret',
      },
      { status: 500 }
    )
  }
}
