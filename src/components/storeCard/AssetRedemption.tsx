'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AssetRedemption() {
  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="relative h-[220px] w-[363px]  overflow-hidden rounded-[12px] border border-cyan-500/20 bg-[rgba(26,26,64,0.45)] px-6 pb-5 pt-4 shadow-[0_0_38px_rgba(0,0,0,0.45)]">
        {/* 光晕 */}
        <div className="absolute left-1/2 top-1/2 h-[220px] w-[394px] -translate-x-1/2 -translate-y-1/2 rotate-[-47deg] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,rgba(222,137,255,0.28)_10%,rgba(0,240,255,0.08)_30%,rgba(0,102,255,0.16)_50%,rgba(255,255,255,0)_100%)] opacity-80" />
        <div className="relative flex h-full flex-col items-center">
          <p className="mt-1 font-jersey-10 text-[24px] leading-[22px] text-white/80 [text-shadow:0_0_1px_#BC13FE]">
            asset redemption
          </p>

          <div className="relative mt-4 grid w-[288px] grid-cols-[112px_60px_112px] items-start gap-2">
            {/* 连接线 */}
            {/* <div className="pointer-events-none absolute left-1/2 top-[72px] h-[32px] w-[288px] -translate-x-1/2">
              <span className="absolute left-[112px] right-[112px] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <span className="absolute left-1/2 top-0 h-[32px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
              <span className="absolute left-[112px] top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_6px_#00F0FF]" />
              <span className="absolute right-[112px] top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_6px_#00F0FF]" />
            </div> */}

            {/* 左侧Power */}
            <div className="relative flex h-[120px] w-full flex-col items-center justify-center gap-2 rounded-[8px] bg-[rgba(26,26,64,0.8)] text-white">
              <div className="relative flex h-[89px] w-[80px] flex-col items-center justify-start gap-2 px-3 ">
                <div className="relative h-[60px] w-[60px]">
                  <div className="flex mt-1" />
                  <Image
                    src="/currency/power.svg"
                    alt="power"
                    width={60}
                    height={60}
                    className="relative h-[60px] w-[60px]"
                  />
                </div>
                <span className="font-jersey-10 text-[18px] leading-[22px] text-white [text-shadow:0_0_1px_#BC13FE]">
                  Power
                </span>
              </div>
              <div className="flex h-[22px] w-[100px] items-center justify-between rounded-[8px] border border-cyan-400/60 bg-[linear-gradient(0deg,rgba(188,19,254,0.2),rgba(188,19,254,0.2)),rgba(0,240,255,0.2)] px-[5px]">
                <span className="flex h-[22px] w-[16px] items-center justify-center ">
                  <Image
                    src="/currency/leftButton.svg"
                    alt="decrease amount"
                    width={12}
                    height={12}
                  />
                </span>
                <span className="font-jersey-10 text-[16px] leading-[22px] text-white fontjersey-10">
                  1,000
                </span>
                <span className="flex h-[22px] w-[16px] items-center justify-center">
                  <Image
                    src="/currency/rightButton.svg"
                    alt="increase amount"
                    width={12}
                    height={12}
                  />
                </span>
              </div>
            </div>
            {/* 兑换按钮 */}
            <div className="flex h-full w-full items-start justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-25 flex  w-[60px] h-[20px] items-center justify-center rounded-[5px] bg-[linear-gradient(98.64deg,rgba(0,240,255,0.8)_0%,rgba(188,19,254,0.8)_99.34%)] font-jersey-10 text-[12px] leading-[22px] text-white shadow-[0px_1px_1px_#BC13FE,0px_-1px_1px_#00F0FF,inset_0px_1px_1px_#BC13FE,inset_0px_-1px_1px_#00F0FF]"
              >
                exchange
              </motion.button>
            </div>
            {/* 右侧 Stars */}
            <div className="relative flex h-[120px] w-full flex-col items-center justify-center gap-2 rounded-[8px] bg-[rgba(26,26,64,0.8)] text-white">
              <div className="relative flex h-[89px] w-[80px] flex-col items-center justify-start  px-3 ">
                <div className="relative h-[60px] w-[60px]">
                  <div className="flex mt-1" />
                  <Image
                    src="/currency/stars.svg"
                    alt="star"
                    width={60}
                    height={60}
                    className="relative h-[60px] w-[60px]"
                  />
                </div>
                <span className="font-jersey-10 mt-2 text-[18px] leading-[22px] text-white [text-shadow:0_0_1px_#BC13FE]">
                  Star
                </span>
              </div>
              <div className="flex h-[22px] w-[100px] items-center justify-center font-jersey-10 rounded-[8px] border border-cyan-400/60 font-jersey-10 text-[16px] leading-[22px] text-[#B0B0C0]">
                100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
