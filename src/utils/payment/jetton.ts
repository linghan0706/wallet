import { Address, Cell, beginCell } from '@ton/core'
import { JettonMaster } from '@ton/ton'
import { DEFAULT_NETWORK, networkConfig } from '@/lib/ton-config'
import { createTonApiClient, createTonClient } from '@/lib/ton-client'

type TonNetwork = 'mainnet' | 'testnet'

type ToncenterStackItem =
  | [string, string]
  | { type?: string; value?: string }
  | { [key: string]: unknown }

type ToncenterResult = {
  stack?: ToncenterStackItem[]
  result?: { stack?: ToncenterStackItem[] }
}

const rpcApiKey = readRpcApiKey()

const toncenterHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(rpcApiKey ? { 'X-API-Key': rpcApiKey } : {}),
}

function normalizeRawAddress(address?: string | null): string | null {
  if (!address) return null
  try {
    return Address.parse(address.trim()).toRawString()
  } catch {
    return null
  }
}

function toFriendly(address?: string | Address | null): string | null {
  if (!address) return null
  try {
    if (typeof address === 'string') {
      const trimmed = address.trim()
      Address.parse(trimmed)
      return trimmed
    }
    return address.toString({ bounceable: true, urlSafe: true })
  } catch {
    return null
  }
}

function readRpcApiKey(): string | undefined {
  const keys = [
    'TONCENTER_API_KEY',
    'TON_RPC_API_KEY',
    'NEXT_PUBLIC_TONCENTER_API_KEY',
    'NEXT_PUBLIC_TON_RPC_API_KEY',
  ] as const
  for (const key of keys) {
    const value = process.env[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return undefined
}

function withApiKey(url: string): string {
  if (!rpcApiKey || url.includes('api_key=')) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}api_key=${encodeURIComponent(rpcApiKey)}`
}

function extractCellBase64(item?: ToncenterStackItem | null): string | null {
  if (!item) return null
  if (Array.isArray(item)) {
    const value = item[1]
    return typeof value === 'string' ? value : null
  }
  if (typeof item === 'object') {
    const value =
      typeof (item as { value?: unknown }).value === 'string'
        ? (item as { value?: string }).value
        : null
    return value ?? null
  }
  return null
}

function extractInt(item?: ToncenterStackItem | null): bigint | null {
  if (!item) return null
  const read = (type: string | undefined, value: unknown): bigint | null => {
    if (!value || !type) return null
    if (typeof value !== 'string') return null
    if (type.toLowerCase() === 'num' || type.toLowerCase() === 'int') {
      try {
        return BigInt(value)
      } catch {
        return null
      }
    }
    return null
  }

  if (Array.isArray(item)) {
    return read(item[0], item[1])
  }
  if (typeof item === 'object') {
    return read(
      (item as { type?: string }).type,
      (item as { value?: unknown }).value
    )
  }
  return null
}

export async function isActiveContract(
  addressFriendly: string,
  network: TonNetwork
): Promise<boolean> {
  const friendly = toFriendly(addressFriendly)
  if (!friendly) return false
  try {
    const tonApi = createTonApiClient()
    const account = await tonApi.accounts.getAccount(Address.parse(friendly))
    if ((account as { status?: string }).status === 'active') return true
  } catch {}
  try {
    const client = createTonClient(network)
    const state = await client.getContractState(Address.parse(friendly))
    return state.state === 'active' || state.state === 'frozen'
  } catch {
    // ignore
  }
  return false
}

async function runToncenterMethod(
  address: string,
  method: string,
  stack: ToncenterStackItem[],
  network: TonNetwork
): Promise<ToncenterStackItem[] | null> {
  const endpoint = withApiKey(networkConfig[network].rpcEndpoint)
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: toncenterHeaders,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'runGetMethod',
      params: {
        address,
        method,
        stack,
      },
    }),
  })
  if (!res.ok) {
    throw new Error(`Toncenter RPC failed with status ${res.status}`)
  }
  const data = (await res.json()) as { result?: ToncenterResult }
  const result = data?.result
  if (!result) return null
  return result.stack ?? result.result?.stack ?? null
}

async function toncenterJettonWalletAddress(
  ownerRaw: string,
  jettonMasterFriendly: string,
  network: TonNetwork
): Promise<string | null> {
  try {
    const ownerCell = beginCell()
      .storeAddress(Address.parse(ownerRaw))
      .endCell()
      .toBoc({ idx: false })
      .toString('base64')
    const stack = await runToncenterMethod(
      jettonMasterFriendly,
      'get_wallet_address',
      [{ type: 'slice', value: ownerCell }],
      network
    )
    const cellBase64 = extractCellBase64(stack?.[0])
    if (!cellBase64) return null
    const address = Cell.fromBase64(cellBase64)
      .beginParse()
      .loadAddress()
      ?.toString({ bounceable: true, urlSafe: true })
    return address ?? null
  } catch {
    return null
  }
}

async function toncenterJettonBalance(
  jettonWallet: string,
  network: TonNetwork
): Promise<string | null> {
  try {
    const stack = await runToncenterMethod(
      jettonWallet,
      'get_wallet_data',
      [],
      network
    )
    const balance = extractInt(stack?.[0])
    return balance !== null ? balance.toString() : null
  } catch {
    return null
  }
}

export async function getJettonWalletAddress(
  owner: string,
  jettonMaster: string,
  network: TonNetwork = DEFAULT_NETWORK
): Promise<string | null> {
  const ownerRaw = normalizeRawAddress(owner)
  const jettonMasterRaw = normalizeRawAddress(jettonMaster)
  if (!ownerRaw || !jettonMasterRaw) return null
  const masterFriendly = toFriendly(jettonMasterRaw)
  if (!masterFriendly || !(await isActiveContract(masterFriendly, network))) {
    return null
  }

  // 1) On-chain derivation via JettonMaster
  try {
    const client = createTonClient(network)
    const jetton = client.open(
      JettonMaster.create(Address.parse(jettonMasterRaw))
    )
    const walletAddress = await jetton.getWalletAddress(Address.parse(ownerRaw))
    const friendly = walletAddress.toString({ bounceable: true, urlSafe: true })
    if (await isActiveContract(friendly, network)) {
      return friendly
    }
  } catch (error) {
    console.warn('Jetton wallet derive failed, fallback to TonAPI', error)
  }

  // 2) TonAPI fallback
  try {
    const tonApi = createTonApiClient()
    const res = await tonApi.accounts.getAccountJettonBalance(
      Address.parse(ownerRaw),
      Address.parse(jettonMasterRaw)
    )
    const tonApiWallet =
      (res.walletAddress as { address?: Address | string } | undefined)
        ?.address ?? (res.walletAddress as unknown as string | undefined)
    const friendly = toFriendly(tonApiWallet)
    if (friendly && (await isActiveContract(friendly, network))) return friendly
  } catch (error) {
    console.warn('TonAPI jetton wallet lookup failed', error)
  }

  // 3) Toncenter RPC fallback
  const toncenterWallet = await toncenterJettonWalletAddress(
    ownerRaw,
    masterFriendly,
    network
  )
  if (toncenterWallet && (await isActiveContract(toncenterWallet, network))) {
    return toncenterWallet
  }
  return null
}

export async function getJettonBalance(
  owner: string,
  jettonMaster: string,
  network: TonNetwork = DEFAULT_NETWORK
): Promise<{ balance: string; jettonWalletAddress: string | null }> {
  const jettonWalletAddress = await getJettonWalletAddress(
    owner,
    jettonMaster,
    network
  )
  if (!jettonWalletAddress) {
    return { balance: '0', jettonWalletAddress: null }
  }

  // 1) On-chain getter
  try {
    const client = createTonClient(network)
    const res = await client.runMethod(
      Address.parse(jettonWalletAddress),
      'get_wallet_data'
    )
    if (res.stack.remaining > 0) {
      const balance = res.stack.readBigNumber()
      return { balance: balance.toString(), jettonWalletAddress }
    }
  } catch (error) {
    console.warn(
      'On-chain jetton balance getter failed, fallback to TonAPI',
      error
    )
  }

  const ownerRaw = normalizeRawAddress(owner)
  const jettonMasterRaw = normalizeRawAddress(jettonMaster)

  // 2) TonAPI fallback
  if (ownerRaw && jettonMasterRaw) {
    try {
      const tonApi = createTonApiClient()
      const res = await tonApi.accounts.getAccountJettonBalance(
        Address.parse(ownerRaw),
        Address.parse(jettonMasterRaw)
      )
      const rawBalance = (res as { balance?: unknown }).balance
      const balance =
        typeof rawBalance === 'string'
          ? rawBalance
          : ((
              rawBalance as { toString?: () => string } | undefined
            )?.toString?.() ?? '0')
      return {
        balance,
        jettonWalletAddress:
          toFriendly(
            (res.walletAddress as { address?: Address | string } | undefined)
              ?.address ?? (res.walletAddress as unknown as string | undefined)
          ) ?? jettonWalletAddress,
      }
    } catch (error) {
      console.warn('TonAPI jetton balance lookup failed', error)
    }
  }

  // 3) Toncenter RPC fallback
  const toncenterBalance = await toncenterJettonBalance(
    jettonWalletAddress,
    network
  )
  return {
    balance: toncenterBalance ?? '0',
    jettonWalletAddress,
  }
}
