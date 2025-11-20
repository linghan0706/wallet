import { Cell } from '@ton/core'
import { DEFAULT_NETWORK } from '@/lib/ton-config'

/** 钱包交易记录所属网络 */
export type WalletNetwork = 'mainnet' | 'testnet'

/** 本地存储的交易记录条目 */
export interface WalletTransactionRecord {
  hash: string
  sender: string
  boc: string
  network: WalletNetwork
  timestamp: number
}

/** 新增交易记录所需的最小载荷 */
export interface WalletTransactionPayload {
  boc: string
  sender?: string | null
  network?: WalletNetwork
}

// 本地存储键与历史条数上限
const STORAGE_KEY = 'wallet:transactions'
const HISTORY_LIMIT = 20

// 判断是否运行在浏览器环境（是否可用 localStorage）
function isBrowserEnvironment(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  )
}

// Uint8Array 转十六进制字符串（小写，不带 0x 前缀）
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

// 从 BOC 文本中计算交易哈希；无效时抛错
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

// 从 localStorage 读取交易历史（已做容错）
function readStoredHistory(): WalletTransactionRecord[] {
  if (!isBrowserEnvironment()) return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // 过滤掉无效条目，仅保留合法记录
    return parsed.filter(isWalletTransactionRecord)
  } catch (error) {
    console.warn('[wallet-hash] Failed to read transaction history', error)
    return []
  }
}

// 持久化交易历史到 localStorage，并裁剪到固定长度
function persistHistory(records: WalletTransactionRecord[]): void {
  if (!isBrowserEnvironment()) return

  try {
    const sliced = records.slice(0, HISTORY_LIMIT)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sliced))
  } catch (error) {
    console.warn('[wallet-hash] Failed to persist transaction history', error)
  }
}

// 运行时类型守卫：校验对象是否为 WalletTransactionRecord
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

// 记录一次钱包交易：计算哈希、整理字段并写入历史
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

// 获取全部钱包交易历史（新→旧）
export function getWalletTransactionHistory(): WalletTransactionRecord[] {
  return readStoredHistory()
}

// 获取最近的一条交易记录，没有则返回 null
export function getLatestWalletTransaction(): WalletTransactionRecord | null {
  const [latest] = readStoredHistory()
  return latest ?? null
}

// 清空钱包交易历史
export function clearWalletTransactionHistory(): void {
  if (!isBrowserEnvironment()) return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('[wallet-hash] Failed to clear transaction history', error)
  }
}
