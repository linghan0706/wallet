import { NextResponse } from 'next/server'
import { listPurchases } from '@/server/stars-purchases-store'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
        { status: 400 }
      )
    }

    const purchases = listPurchases(userId)

    return NextResponse.json({ success: true, data: purchases })
  } catch (error) {
    console.error('Stars purchases error:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to load Stars purchases',
      },
      { status: 500 }
    )
  }
}
