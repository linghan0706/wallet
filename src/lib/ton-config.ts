const DEFAULT_MANIFEST_PATH = '/api/tonconnect/manifest'
const STATIC_MANIFEST_FALLBACK = '/tonconnect-manifest.json'

const rawManifestUrl = process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL?.trim()
const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()

const resolvedManifestUrl =
  resolveManifestUrl(rawManifestUrl, rawAppUrl) ??
  resolveManifestUrl(DEFAULT_MANIFEST_PATH, rawAppUrl) ??
  resolveManifestUrl(STATIC_MANIFEST_FALLBACK, rawAppUrl) ??
  DEFAULT_MANIFEST_PATH

// TON Connect 配置
export const tonConnectConfig = {
  manifestUrl: resolvedManifestUrl,
  walletsListSource:
    'https://raw.githubusercontent.com/ton-community/tonconnect-utils/main/tonconnect-wallets.json',
  walletsListCacheTTLMs: 1000 * 60 * 60 * 24, // 24 hours
}

// TON API 配置
export const tonApiConfig = {
  apiKey: process.env.NEXT_PUBLIC_TON_API_KEY || '',
  baseUrl: 'https://tonapi.io',
}

// 网络配置
export const networkConfig = {
  mainnet: {
    rpcEndpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiEndpoint: 'https://tonapi.io',
  },
  testnet: {
    rpcEndpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiEndpoint: 'https://testnet.tonapi.io',
  },
}

// 默认网络
export const DEFAULT_NETWORK = 'mainnet' as keyof typeof networkConfig

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
