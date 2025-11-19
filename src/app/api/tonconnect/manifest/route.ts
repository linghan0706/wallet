import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Nova Explorer Bot'
const DEFAULT_APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim()
const ICON_OVERRIDE = process.env.NEXT_PUBLIC_TONCONNECT_ICON_URL?.trim()
const TERMS_OVERRIDE = process.env.NEXT_PUBLIC_TONCONNECT_TERMS_URL?.trim()
const PRIVACY_OVERRIDE = process.env.NEXT_PUBLIC_TONCONNECT_PRIVACY_URL?.trim()

export async function GET(request: NextRequest) {
  const baseUrl = resolveBaseUrl(request)

  const iconUrl =
    ICON_OVERRIDE && isAbsoluteUrl(ICON_OVERRIDE)
      ? ICON_OVERRIDE
      : new URL('/icon-192x192.png', baseUrl).toString()

  const termsUrl =
    TERMS_OVERRIDE && isAbsoluteUrl(TERMS_OVERRIDE)
      ? TERMS_OVERRIDE
      : new URL('/terms', baseUrl).toString()

  const privacyUrl =
    PRIVACY_OVERRIDE && isAbsoluteUrl(PRIVACY_OVERRIDE)
      ? PRIVACY_OVERRIDE
      : new URL('/privacy', baseUrl).toString()

  const manifest: Record<string, string> = {
    url: baseUrl,
    name: DEFAULT_NAME,
    iconUrl,
    termsOfUseUrl: termsUrl,
    privacyPolicyUrl: privacyUrl,
  }

  return NextResponse.json(manifest)
}

function resolveBaseUrl(request: NextRequest) {
  if (DEFAULT_APP_URL && isAbsoluteUrl(DEFAULT_APP_URL)) {
    return normalizeUrl(DEFAULT_APP_URL)
  }

  if (request.nextUrl?.origin) {
    return request.nextUrl.origin
  }

  const host = request.headers.get('host')
  if (host) {
    return `https://${host}`
  }

  throw new Error('Unable to determine application base URL for TON manifest')
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function normalizeUrl(url: string) {
  const normalized = new URL(url)
  return normalized.toString().replace(/\/$/, '')
}
