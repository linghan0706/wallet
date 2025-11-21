import { NextResponse, NextRequest } from 'next/server'

export const runtime = 'nodejs' // Vercel 使用 Node.js Runtime

type RouteParams = { path: string[] }

async function proxy(req: Request, params: RouteParams) {
  const base = process.env.API_BASE_URL?.replace(/\/$/, '')
  if (!base) {
    return NextResponse.json(
      { success: false, message: 'API_BASE_URL not set' },
      { status: 500 }
    )
  }

  const u = new URL(req.url)
  const segs = Array.isArray(params.path) ? params.path : []
  const trimmed = segs[0] === 'proxy' ? segs.slice(1) : segs
  const backendPath = `/api/${trimmed.join('/')}`
  const pathnameReplaced = u.pathname.replace(/^\/api\/proxy/, '/api')
  const finalPath =
    backendPath && backendPath !== '/api/' ? backendPath : pathnameReplaced
  const upstream = `${base}${finalPath}${u.search}`

  const headers = new Headers(req.headers)
  headers.delete('host')

  // 额外修复：Vercel 不自动转发 cookie，需要手动设置
  const cookie = req.headers.get('cookie')
  if (cookie) headers.set('cookie', cookie)

  // body 处理
  const body =
    req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text()

  if (body && !headers.get('content-type')) {
    headers.set('content-type', 'application/json')
  }

  const res = await fetch(upstream, {
    method: req.method,
    headers,
    body,
  })

  const contentType = res.headers.get('content-type') || ''
  const proxyHeaders = new Headers(res.headers)
  proxyHeaders.set('x-proxy-upstream', upstream)
  proxyHeaders.set(
    'x-proxy-debug',
    JSON.stringify({ base, pathname: u.pathname, computed_upstream: upstream })
  )

  if (contentType.includes('application/json')) {
    const data = await res.json()
    return NextResponse.json(data, {
      status: res.status,
      headers: proxyHeaders,
    })
  }

  return new NextResponse(await res.text(), {
    status: res.status,
    headers: proxyHeaders,
  })
}

// 支持所有方法
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const params = await ctx.params
  return proxy(req, params)
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const params = await ctx.params
  return proxy(req, params)
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const params = await ctx.params
  return proxy(req, params)
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const params = await ctx.params
  return proxy(req, params)
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<RouteParams> }
) {
  const params = await ctx.params
  return proxy(req, params)
}
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
