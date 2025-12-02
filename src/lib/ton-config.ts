const DEFAULT_MANIFEST_PATH = '/api/tonconnect/manifest'
const STATIC_MANIFEST_FALLBACK = '/tonconnect-manifest.json'
const KNOWN_NETWORKS = ['mainnet', 'testnet'] as const

type TonNetwork = (typeof KNOWN_NETWORKS)[number]

type NetworkSettings = {
  rpcEndpoint: string
  apiEndpoint: string
}

const rawManifestUrl = readEnvValue(
  process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL
)
const rawAppUrl = readEnvValue(process.env.NEXT_PUBLIC_APP_URL)

const resolvedManifestUrl =
  resolveManifestUrl(rawManifestUrl, rawAppUrl) ??
  resolveManifestUrl(DEFAULT_MANIFEST_PATH, rawAppUrl) ??
  resolveManifestUrl(STATIC_MANIFEST_FALLBACK, rawAppUrl) ??
  DEFAULT_MANIFEST_PATH

export const tonConnectConfig = {
  manifestUrl: resolvedManifestUrl,
  walletsListSource:
    'https://raw.githubusercontent.com/ton-community/tonconnect-utils/main/tonconnect-wallets.json',
  walletsListCacheTTLMs: 1000 * 60 * 60 * 24,
}

const resolvedNetwork = resolveNetwork(
  readEnvValue(process.env.NEXT_PUBLIC_NETWORK)
)

const networkConfigDefaults: Record<TonNetwork, NetworkSettings> = {
  mainnet: {
    rpcEndpoint:
      readEnvValue(process.env.NEXT_PUBLIC_TON_MAINNET_RPC_ENDPOINT) ??
      'https://toncenter.com/api/v2/jsonRPC',
    apiEndpoint:
      readEnvValue(process.env.NEXT_PUBLIC_TON_MAINNET_API_ENDPOINT) ??
      'https://tonapi.io',
  },
  testnet: {
    rpcEndpoint:
      readEnvValue(process.env.NEXT_PUBLIC_TON_TESTNET_RPC_ENDPOINT) ??
      'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiEndpoint:
      readEnvValue(process.env.NEXT_PUBLIC_TON_TESTNET_API_ENDPOINT) ??
      'https://testnet.tonapi.io',
  },
}

export const networkConfig = networkConfigDefaults
export const DEFAULT_NETWORK = resolvedNetwork

const resolvedTonApiBaseUrl = readEnvValue(
  process.env.NEXT_PUBLIC_TON_API_BASE_URL
)

export const tonApiConfig = {
  apiKey: readEnvValue(process.env.NEXT_PUBLIC_TON_API_KEY) ?? '',
  baseUrl: resolvedTonApiBaseUrl,
}

function resolveManifestUrl(manifest?: string, appUrl?: string): string | null {
  if (!manifest) {
    return null
  }

  if (isAbsoluteUrl(manifest)) {
    return manifest
  }

  if (!appUrl) {
    return null
  }

  try {
    return new URL(manifest, ensureTrailingSlash(appUrl)).toString()
  } catch {
    return null
  }
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function ensureTrailingSlash(url: string) {
  if (!url) return url
  return url.endsWith('/') ? url : `${url}/`
}

function resolveNetwork(value?: string): TonNetwork {
  if (!value) {
    return 'testnet'
  }

  const normalized = value.toLowerCase()
  return isTonNetwork(normalized) ? (normalized as TonNetwork) : 'testnet'
}

function isTonNetwork(value: string): value is TonNetwork {
  return (KNOWN_NETWORKS as readonly string[]).includes(value)
}

function readEnvValue(value?: string | null) {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
