import type { Metadata } from 'next'
import {
  Inter,
  Jersey_10,
  Jersey_15,
  Jersey_25,
  Roboto,
  Exo_2,
  Orbitron,
  Oxanium,
  IBM_Plex_Mono,
} from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/font.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { MainLayout } from '@/components/layout'
import { LoadingProvider } from '@/components/ui/LoadingProvider'
import { WebVitals } from '@/components/analytics/WebVitals'

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true })
const jersey10 = Jersey_10({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jersey-10',
})
const jersey15 = Jersey_15({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jersey-15',
})
const jersey25 = Jersey_25({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jersey-25',
})
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto',
})
const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo-2',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: '900',
})

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  weight: '300',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: '700',
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
        className={`${inter.className} ${jersey10.variable} ${jersey15.variable} ${jersey25.variable} ${roboto.variable} ${exo2.variable} ${orbitron.variable} ${oxanium.variable} ${ibmPlexMono.variable}`}
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
