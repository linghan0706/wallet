import { Cell } from '@ton/core'
import { DEFAULT_NETWORK } from '@/lib/ton-config'

export type WalletNetwork = 'mainnet' | 'testnet'

export interface WalletTransactionRecord {
  hash: string
  sender: string
  boc: string
  network: WalletNetwork
  timestamp: number
}

export interface WalletTransactionPayload {
  boc: string
  sender?: string | null
  network?: WalletNetwork
}

const STORAGE_KEY = 'wallet:transactions'
const HISTORY_LIMIT = 20

function isBrowserEnvironment(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  )
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function extractTransactionHash(boc: string): string {
  if (!boc || typeof boc !== 'string') {
    throw new Error('Transaction BOC is required to compute hash')
  }

  try {
    const normalizedBoc = boc.trim()
    const cell = Cell.fromBase64(normalizedBoc)
    return toHex(cell.hash())
  } catch (error) {
    console.error('[wallet-hash] Failed to decode transaction BOC', error)
    throw new Error('INVALID_TRANSACTION_BOC')
  }
}

function readStoredHistory(): WalletTransactionRecord[] {
  if (!isBrowserEnvironment()) return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isWalletTransactionRecord)
  } catch (error) {
    console.warn('[wallet-hash] Failed to read transaction history', error)
    return []
  }
}

function persistHistory(records: WalletTransactionRecord[]): void {
  if (!isBrowserEnvironment()) return

  try {
    const sliced = records.slice(0, HISTORY_LIMIT)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sliced))
  } catch (error) {
    console.warn('[wallet-hash] Failed to persist transaction history', error)
  }
}

function isWalletTransactionRecord(
  value: unknown
): value is WalletTransactionRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<WalletTransactionRecord>

  if (typeof record.hash !== 'string' || !record.hash) return false
  if (typeof record.sender !== 'string') return false
  if (typeof record.boc !== 'string' || !record.boc) return false
  if (typeof record.timestamp !== 'number') return false
  if (record.network !== 'mainnet' && record.network !== 'testnet') {
    return false
  }

  return true
}

export function recordWalletTransaction({
  boc,
  sender,
  network = DEFAULT_NETWORK,
}: WalletTransactionPayload): WalletTransactionRecord {
  const hash = extractTransactionHash(boc)
  const normalizedSender =
    typeof sender === 'string' && sender.trim().length > 0
      ? sender.trim()
      : 'unknown'

  const record: WalletTransactionRecord = {
    hash,
    sender: normalizedSender,
    boc,
    network,
    timestamp: Date.now(),
  }

  const history = readStoredHistory().filter(item => item.hash !== hash)
  history.unshift(record)
  persistHistory(history)

  return record
}

export function getWalletTransactionHistory(): WalletTransactionRecord[] {
  return readStoredHistory()
}

export function getLatestWalletTransaction(): WalletTransactionRecord | null {
  const [latest] = readStoredHistory()
  return latest ?? null
}

export function clearWalletTransactionHistory(): void {
  if (!isBrowserEnvironment()) return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('[wallet-hash] Failed to clear transaction history', error)
  }
}
