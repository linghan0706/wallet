'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AssetRedemption() {
  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="relative h-[220px] w-[363px]  overflow-hidden rounded-[8px] border border-cyan-500/20 bg-[rgba(26,26,64,0.45)] px-6 pb-5 pt-4 shadow-[0_0_38px_rgba(0,0,0,0.45)]">
        <div className="absolute" />
        <div className="relative flex h-full flex-col items-center">
          <p className="font-jersey-15 text-[16px] sm:text-[16px] leading-[22px] sm:leading-[20px] text-center text-[#B2B2B2] font-normal">
            redeem props and resources
          </p>
          <p className="mt-2 font-jersey-10 text-[24px] leading-[22px] text-white/80 [text-shadow:0_0_1px_#BC13FE]">
            asset redemption
          </p>
          <div className="relative mt-4 grid w-[288px] grid-cols-[112px_60px_112px] items-start gap-2">
            {/* 连接线 */}
            <div className="pointer-events-none absolute left-[149px] top-[33px] h-[32px] w-[130px] -translate-x-1/2">
              <Image
                src="/stores/connection.svg"
                alt="connection"
                width={130}
                height={32}
                className="absolute left-0 top-0 h-[32px] w-[288px]"
              />
            </div>

            {/* 左侧Power */}
            <div
              className="relative h-[120px] w-full rounded-[8px] overflow-hidden "
              style={{
                borderRadius: '8px',
                border: '1px solid transparent',
                backgroundImage:
                  'linear-gradient(#0d0f24, #0d0f24), linear-gradient(136.39deg, #00F0FF 8.54%, rgba(255, 255, 255, 0) 30.01%, rgba(255, 255, 255, 0) 72.95%, #BC13FE 94.42%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[7px] bg-[#1A1A40CC] text-white">
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
                <div className="flex h-[22px] w-[100px] items-center justify-between rounded-xl mb-2 border border-cyan-400/60 bg-[linear-gradient(0deg,rgba(188,19,254,0.2),rgba(188,19,254,0.2)),rgba(0,240,255,0.2)] px-[5px]">
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
            </div>
            {/* 兑换按钮 */}
            <div className="flex h-full w-full items-start justify-center ">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-24 flex  w-[60px] h-[20px] items-center justify-center rounded-[5px] bg-[linear-gradient(98.64deg,rgba(0,240,255,0.8)_0%,rgba(188,19,254,0.8)_99.34%)] font-jersey-10 text-[12px] leading-[22px] text-white shadow-[0px_1px_1px_#BC13FE,0px_-1px_1px_#00F0FF,inset_0px_1px_1px_#BC13FE,inset_0px_-1px_1px_#00F0FF]"
              >
                exchange
              </motion.button>
            </div>
            {/* 右侧 Stars */}
            <div
              className="relative h-[120px] w-full rounded-[8px] overflow-hidden ml-[-3px]"
              style={{
                borderRadius: '8px',
                border: '1px solid transparent',
                backgroundImage:
                  'linear-gradient(#0d0f24, #0d0f24), linear-gradient(136.39deg, #00F0FF 8.54%, rgba(255, 255, 255, 0) 30.01%, rgba(255, 255, 255, 0) 72.95%, #BC13FE 94.42%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[7px] bg-[#1A1A40CC] text-white">
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
                <div className="flex h-[22px] w-[100px] items-center justify-center font-jersey-10 rounded-xl border border-cyan-400/60 font-jersey-10 text-[16px] leading-[22px] mb-2 text-[#B0B0C0]">
                  100
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
