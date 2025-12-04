'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const powerIcon = '/currency/power.png'
const novaIcon = '/currency/nova.png'

export default function UserHeader() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <header className="fixed top-[25px] left-1/2 -translate-x-1/2 z-50 w-[363px] h-12">
      {/* 主容器 */}
      <div
        className="flex items-center justify-between gap-16 p-0 w-full h-full rounded-[12px]  border-solid backdrop-blur-[20px]  border-white/30 border-image-[linear-gradient(270deg,rgba(255,255,255,0.3)_5%,rgba(255,255,255,0.3)_30%)]  shadow-[0_0_10px_0_#BC13FECC] shadow-[0_1px_5px_0_#1EDDD6] "
        style={{
          borderImage:
            'linear-gradient(270deg, rgba(255, 255, 255, 0.3) 5%, rgba(255, 255, 255, 0.3) 30%) 1',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* 用户信息区 */}
        <div className="flex items-center shrink-0 gap-2.5 w-20 h-10">
          {/* 用户头像 */}
          <Image
            src="/components/layout/NavIcon/HomeIcon.png"
            alt="user avatar"
            width={40}
            height={40}
            className="shrink-0 w-10 h-10 rounded-full border-2 border-[#522682]"
          />

          {/* 用户名 */}
          <span className="text-white text-center shrink-0 jersey-font-lg">
            Alen
          </span>
        </div>

        {/* 资产信息区 */}
        <div className="flex items-center justify-center gap-1.5 shrink-0 h-[46px]">
          {/* Power资产 */}
          <div className="flex items-center justify-center gap-0.5 rounded-full p-2 shrink-0 w-[72px] h-[46px]">
            <Image src={powerIcon} alt="power" width={30} height={30} />
            <span className="text-white text-center shrink-0 jersey-font-md w-[31px]">
              8547
            </span>
          </div>

          {/* Nova资产 */}
          <div className="flex items-center justify-center gap-0.5 rounded-full p-2 shrink-0 w-[72px] h-[46px]">
            <Image src={novaIcon} alt="nova" width={30} height={30} />
            <span className="text-white text-center shrink-0 jersey-font-md w-[23px]">
              320
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
