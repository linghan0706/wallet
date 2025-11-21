// �������з���
export * from './api'
export * from './ton'

// ��������ʵ��
import { TonService } from './ton'
import { DEFAULT_NETWORK } from '@/lib/ton-config'

// ���ݻ������������ô�������ʵ��
export const tonService = new TonService(DEFAULT_NETWORK)
