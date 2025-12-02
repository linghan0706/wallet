import { TonClient, WalletContractV4 } from '@ton/ton'
import { Address } from '@ton/core'
import { mnemonicToWalletKey } from '@ton/crypto'
import { TonApiClient } from '@ton-api/client'
import { tonApiConfig, networkConfig, DEFAULT_NETWORK } from './ton-config'

const rpcApiKey =
  readServerEnv('TONCENTER_API_KEY') ?? readServerEnv('TON_RPC_API_KEY')

export const createTonApiClient = (
  network: keyof typeof networkConfig = DEFAULT_NETWORK
) => {
  const config = networkConfig[network] ?? networkConfig[DEFAULT_NETWORK]
  const baseUrl = tonApiConfig.baseUrl ?? config.apiEndpoint

  return new TonApiClient({
    baseUrl,
    apiKey: tonApiConfig.apiKey,
  })
}

export const createTonClient = (
  network: keyof typeof networkConfig = DEFAULT_NETWORK
) => {
  const config = networkConfig[network]

  return new TonClient({
    endpoint: config.rpcEndpoint,
    ...(rpcApiKey ? { apiKey: rpcApiKey } : {}),
  })
}

export const createWalletFromMnemonic = async (
  mnemonic: string[],
  network: keyof typeof networkConfig = DEFAULT_NETWORK
) => {
  const key = await mnemonicToWalletKey(mnemonic)
  const client = createTonClient(network)
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: key.publicKey,
  })

  return {
    wallet,
    client,
    key,
  }
}

export const getWalletAddress = (wallet: WalletContractV4) => {
  return wallet.address.toString()
}

export const getWalletBalance = async (client: TonClient, address: string) => {
  const balance = await client.getBalance(Address.parse(address))
  return balance
}

function readServerEnv(key: string) {
  const value = process.env[key as keyof NodeJS.ProcessEnv]
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
