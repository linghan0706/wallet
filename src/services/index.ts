//导出所有服务
export * from './api'
export * from './ton'

import { TonService } from './ton'
import { DEFAULT_NETWORK } from '@/lib/ton-config'

export const tonService = new TonService(DEFAULT_NETWORK)
