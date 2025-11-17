import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function proxy(req: Request) {
  const u = new URL(req.url)
  const base = (process.env.API_BASE_URL || '').replace(/\/$/, '')
  if (!base) {
    // API_BASE_URL读取失败，返回 500
    return NextResponse.json(
      {
        success: false,
        message: 'API_BASE_URL not set',
        timestamp: Date.now(),
      },
      { status: 500 }
    )
  }
  const upstream = `${base}${u.pathname}${u.search}`

  const headers = new Headers(req.headers)
  headers.delete('host')
  const path = u.pathname
  const requiresAuth =
    path.startsWith('/api/store') || path === '/api/auth/logout'
  if (requiresAuth) {
    const auth = headers.get('authorization')
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', timestamp: Date.now() },
        { status: 401 }
      )
    }
  }

  const bodyText = ['GET', 'HEAD'].includes(req.method)
    ? undefined
    : await req.text()
  const init: RequestInit = { method: req.method, headers, body: bodyText }
  const res = await fetch(upstream, init)
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data: unknown = await res.json()
    const out = NextResponse.json(data, { status: res.status })
    out.headers.set('x-proxy-upstream', upstream)
    out.headers.set('x-proxy-runtime', 'nodejs')
    return out
  }
  const text = await res.text()
  const out = new NextResponse(text, { status: res.status })
  out.headers.set('x-proxy-upstream', upstream)
  out.headers.set('x-proxy-runtime', 'nodejs')
  return out
}

export async function GET(req: Request) {
  return proxy(req)
}

export async function POST(req: Request) {
  return proxy(req)
}

export async function PUT(req: Request) {
  return proxy(req)
}

export async function PATCH(req: Request) {
  return proxy(req)
}

export async function DELETE(req: Request) {
  return proxy(req)
}
