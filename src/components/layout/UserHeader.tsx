'use client'
import Image from 'next/image'

const powerIcon = '/currency/power.png'
const novaIcon = '/currency/nova.png'

export default function UserHeader() {
  return (
    <header className="fixed top-[25px] left-0 z-50 w-full px-4 sm:px-6 flex justify-center">
      <div className="relative w-full max-w-[520px] h-12 md:h-14">
        <div className="flex items-center justify-between gap-6 sm:gap-10 h-full px-4 sm:px-5 md:px-6 rounded-[12px] border border-white/20 bg-[#141423]/70 backdrop-blur-[20px] shadow-[0px_1px_5px_#1EDDD6,0px_0px_10px_rgba(188,19,254,0.8)]">
          {/* 用户信息区 */}
          <div className="flex items-center shrink-0 gap-2.5">
            {/* 用户头像 */}
            <Image
              src="/components/layout/NavIcon/HomeIcon.png"
              alt="user avatar"
              width={40}
              height={40}
              className="shrink-0 w-10 h-10 rounded-full border-2 border-[#522682]"
            />

            {/* 用户名 */}
            <span className="text-white text-center shrink-0 font-jersey-10">
              Alen
            </span>
          </div>

          {/* 资产信息区 */}
          <div className="flex items-center justify-center gap-2 shrink-0 h-[46px]">
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
      </div>
    </header>
  )
}
