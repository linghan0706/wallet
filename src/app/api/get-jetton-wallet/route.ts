import { NextRequest, NextResponse } from 'next/server'
import { Address } from '@ton/core'
import { JettonMaster } from '@ton/ton'
import { createTonClient } from '@/lib/ton-client'

const DEFAULT_JETTON_MASTER =
  readEnv(process.env.NEXT_PUBLIC_USDC_JETTON_MASTER) || null

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userWalletAddress = readEnv(searchParams.get('user'))
    const jettonMasterAddress =
      readEnv(searchParams.get('jetton')) || DEFAULT_JETTON_MASTER

    if (!userWalletAddress) {
      return NextResponse.json(
        { error: 'Missing user address' },
        { status: 400 }
      )
    }

    if (!jettonMasterAddress) {
      return NextResponse.json(
        { error: 'Missing jetton master address' },
        { status: 400 }
      )
    }

    let userWallet: Address
    let jettonMaster: Address
    try {
      userWallet = Address.parse(userWalletAddress)
      jettonMaster = Address.parse(jettonMasterAddress)
    } catch {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }

    const client = createTonClient()
    const jm = client.open(JettonMaster.create(jettonMaster))
    const jw = await jm.getWalletAddress(userWallet)

    return NextResponse.json({
      jettonWalletAddress: jw.toString({ urlSafe: true, bounceable: true }),
    })
  } catch (error) {
    console.error('[api/get-jetton-wallet] failed', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    )
  }
}

function readEnv(value?: string | null): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : ''
}
