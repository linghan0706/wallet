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
    const jettonWalletAddress = await deriveJettonWalletAddress(
      client,
      userWallet,
      jettonMaster
    )

    if (!jettonWalletAddress) {
      return NextResponse.json(
        { error: 'Unable to derive jetton wallet address' },
        { status: 500 }
      )
    }

    try {
      const result = await client.runMethod(
        Address.parse(jettonWalletAddress),
        'get_wallet_data'
      )
      const balance = result.stack.readBigNumber()
      return NextResponse.json({
        balance: balance.toString(),
        jettonWalletAddress,
      })
    } catch (error) {
      console.error('[api/get-jetton-balance] runMethod failed', error)
      return NextResponse.json(
        { balance: '0', error: 'Failed to fetch jetton balance' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[api/get-jetton-balance] failed', error)
    return NextResponse.json(
      {
        balance: '0',
        error: error instanceof Error ? error.message : 'Internal error',
      },
      { status: 500 }
    )
  }
}

async function deriveJettonWalletAddress(
  client: ReturnType<typeof createTonClient>,
  owner: Address,
  jettonMaster: Address
): Promise<string | null> {
  try {
    const jm = client.open(JettonMaster.create(jettonMaster))
    const jw = await jm.getWalletAddress(owner)
    return jw.toString({ urlSafe: true, bounceable: true })
  } catch (error) {
    console.error('[api/get-jetton-balance] derive wallet failed', error)
    return null
  }
}

function readEnv(value?: string | null): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : ''
}
