import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    success: false,
    message:
      'Refunds for Stars need to be handled via the Telegram Bot owner. Please contact support with your transaction ID.',
  })
}
