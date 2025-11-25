import type { Metadata } from 'next'
import { Inter, Jersey_10, Jersey_25 } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { MainLayout } from '@/components/layout'
import { LoadingProvider } from '@/components/ui/LoadingProvider'
import { WebVitals } from '@/components/analytics/WebVitals'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true })
const jersey10 = Jersey_10({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jersey-10',
})
const jersey25 = Jersey_25({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jersey-25',
})

export const metadata: Metadata = {
  title: 'Nova Explorer GAME',
  description: 'Nova星际游戏',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body
        className={`${inter.className} ${jersey10.variable} ${jersey25.variable}`}
      >
        <AntdRegistry>
          <ConfigProvider locale={zhCN}>
            <LoadingProvider>
              <MainLayout>{children}</MainLayout>
              <WebVitals />
            </LoadingProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
