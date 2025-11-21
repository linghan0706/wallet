import { TonClient } from '@ton/ton'
import { ApiClient } from './api'
import { tonApiConfig, networkConfig, DEFAULT_NETWORK } from '@/lib/ton-config'
import { ApiResponse } from '@/types'

export interface TonAccount {
  address: string
  balance: string
  status: 'active' | 'uninitialized' | 'frozen'
  lastActivity: number
}

export interface TonTransaction {
  hash: string
  lt: string
  account: string
  success: boolean
  value: string
  fee: string
  timestamp: number
  comment?: string
  inMsg?: {
    source?: string
    destination: string
    value: string
  }
  outMsgs?: Array<{
    source: string
    destination?: string
    value: string
  }>
}

export interface TonBlock {
  workchain: number
  shard: string
  seqno: number
  rootHash: string
  fileHash: string
  genUtime: number
  transactions: number
}

export class TonService {
  private apiClient: ApiClient
  private tonClient: TonClient | null = null

  constructor(network: keyof typeof networkConfig = DEFAULT_NETWORK) {
    const config = networkConfig[network]
    this.apiClient = new ApiClient(config.apiEndpoint, {
      headers: tonApiConfig.apiKey
        ? {
            Authorization: `Bearer ${tonApiConfig.apiKey}`,
          }
        : {},
    })
  }

  /**
   * 获取账户信息
   */
  async getAccount(address: string): Promise<ApiResponse<TonAccount>> {
    try {
      return await this.apiClient.get<TonAccount>(`/v2/accounts/${address}`)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取账户信息失败',
      }
    }
  }

  /**
   * 获取账户余额
   */
  async getBalance(address: string): Promise<ApiResponse<string>> {
    try {
      const response = await this.getAccount(address)
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.balance,
        }
      }
      return {
        success: false,
        error: response.error || '获取余额失败',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取余额失败',
      }
    }
  }

  /**
   * 获取交易历史
   */
  async getTransactions(
    address: string,
    options: {
      limit?: number
      offset?: number
      startLt?: string
      endLt?: string
    } = {}
  ): Promise<ApiResponse<TonTransaction[]>> {
    try {
      const params = {
        limit: options.limit || 20,
        offset: options.offset || 0,
        ...options,
      }

      return await this.apiClient.get<TonTransaction[]>(
        `/v2/accounts/${address}/transactions`,
        params
      )
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取交易历史失败',
      }
    }
  }

  /**
   * 获取单个交易详情
   */
  async getTransaction(hash: string): Promise<ApiResponse<TonTransaction>> {
    try {
      return await this.apiClient.get<TonTransaction>(
        `/v2/transactions/${hash}`
      )
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取交易详情失败',
      }
    }
  }

  /**
   * 获取最新区块信息
   */
  async getLatestBlocks(limit: number = 10): Promise<ApiResponse<TonBlock[]>> {
    try {
      return await this.apiClient.get<TonBlock[]>('/v2/blocks', { limit })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取区块信息失败',
      }
    }
  }

  /**
   * 搜索地址或交易
   */
  async search(query: string): Promise<ApiResponse<Record<string, unknown>>> {
    try {
      return await this.apiClient.get<Record<string, unknown>>(`/v2/search`, {
        query,
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '搜索失败',
      }
    }
  }

  /**
   * 验证地址格式
   */
  isValidAddress(address: string): boolean {
    try {
      // 这里可以使用TON SDK的地址验证方法
      return address.length === 48 && /^[A-Za-z0-9+/=_-]+$/.test(address)
    } catch {
      return false
    }
  }

  /**
   * 格式化地址为用户友好格式
   */
  formatAddress(address: string): string {
    // 这里可以使用TON SDK的地址格式化方法
    // 暂时返回原地址
    return address
  }
}
