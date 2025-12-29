import Image from 'next/image'

export default function AssetRedemption() {
  return (
    <div className="relative h-[221px] w-[363px] overflow-hidden bg-[url('/GlobalBorder/store/exchange_border.png')] bg-cover bg-no-repeat font-oxanium text-white">
      <div className="absolute inset-[6px] rounded-[4px] bg-[radial-gradient(ellipse_at_center,_rgba(26,32,72,0.85)_0%,_rgba(13,16,38,0.95)_55%,_rgba(10,12,30,1)_100%)]" />
      <div className="absolute inset-[6px] rounded-[4px] bg-[radial-gradient(circle_at_18%_28%,_rgba(255,255,255,0.15)_0%,_rgba(255,255,255,0)_40%),radial-gradient(circle_at_72%_20%,_rgba(130,170,255,0.2)_0%,_rgba(130,170,255,0)_45%),radial-gradient(circle_at_48%_72%,_rgba(120,90,255,0.25)_0%,_rgba(120,90,255,0)_50%)] opacity-60" />
      <div className="absolute inset-0 pointer-events-none">
        <svg
          width="120"
          height="18"
          viewBox="0 0 120 18"
          className="absolute right-[18px] top-[16px]"
          fill="none"
        >
          <path
            d="M2 9H50L60 3H78L88 9H118"
            stroke="#BC13FE"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="3" r="2.5" fill="#00F0FF" />
          <circle cx="78" cy="3" r="2.5" fill="#00F0FF" />
          <circle cx="88" cy="9" r="2.5" fill="#00F0FF" />
        </svg>
        <Image
          src="/GlobalBorder/store/line.svg"
          alt=""
          width={66}
          height={74}
          unoptimized
          aria-hidden="true"
          className="absolute left-1/2 top-[64px] -translate-x-1/2 opacity-70"
        />
      </div>

      <div className="relative z-10 flex h-full flex-col px-[16px] pb-[12px] pt-[12px]">
        <div className="flex items-center justify-between">
          <div className="font-orbitron text-[13px] font-bold tracking-[0.2em] text-[#C9D6FF] [text-shadow:0_0_6px_rgba(188,19,254,0.7)]">
            ASSET REDEMPTION
          </div>
        </div>

        <div className="mt-[10px] flex flex-1 items-start justify-between">
          <div className="relative h-[130px] w-[130px]">
            <div
              className="absolute inset-0 bg-[#171B3B]/65"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderImageSlice: 1,
                borderImageSource:
                  'linear-gradient(136.39deg, #00F0FF 8.54%, #00F0FF 17.12%, #606070 17.12%, #606070 85.83%, #BC13FE 85.83%, #BC13FE 94.42%)',
              }}
            />
            <div className="absolute left-0 top-0 h-[12px] w-[40px] " />
            <div className="absolute bottom-0 right-0 h-[12px] w-[40px]" />
            <div className="relative z-10 flex h-full flex-col items-center justify-between pb-[10px] pt-[10px]">
              <div className="relative flex h-[42px] w-[42px] items-center justify-center">
                <Image
                  src="/currency/power.png"
                  alt="Power"
                  width={40}
                  height={40}
                  unoptimized
                  className="[filter:drop-shadow(0_0_8px_rgba(0,240,255,0.6))_drop-shadow(0_0_10px_rgba(188,19,254,0.6))]"
                />
                <div className="absolute -bottom-[6px] left-1/2 h-[10px] w-[54px] -translate-x-1/2  bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.5)_0%,_rgba(188,19,254,0.35)_45%,_rgba(0,0,0,0)_70%)]" />
              </div>
              <div className="font-oxanium font-bold text-[14px] text-white [text-shadow:0px_0px_1px_#BC13FE] tracking-[0.04em] uppercase flex items-center">
                POWER
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="font-oxanium font-bold text-[10px] text-[#00F0FF] underline uppercase flex items-center">
                  MIN
                </span>
                <div className="h-[22px] w-[78px]">
                  <div className="h-full w-full border-l-[1px] border-l-[#00F0FF] border-r-[1px] border-r-[#BC13FE] p-[1px] bg-[#3F3F56]">
                    <div className="flex h-full w-full items-center justify-center rounded-[1px] bg-[#B0B0C0] text-[14px] font-bold tracking-[0.08em] text-white [text-shadow:0_0_4px_rgba(255,255,255,0.8)]">
                      1,000
                    </div>
                  </div>
                </div>
                <span className="font-oxanium font-bold text-[10px] text-[#BC13FE] underline uppercase flex items-center tracking-[0.04em]">
                  ALL
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-[130px] w-[130px]">
            <div
              className="absolute inset-0 bg-[#171B3B]/65"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderImageSlice: 1,
                borderImageSource:
                  'linear-gradient(136.39deg, #00F0FF 8.54%, #00F0FF 17.12%, #606070 17.12%, #606070 85.83%, #BC13FE 85.83%, #BC13FE 94.42%)',
              }}
            />
            <div className="absolute left-0 top-0 h-[12px] w-[40px]" />
            <div className="absolute bottom-0 right-0 h-[12px] w-[40px]  " />
            <div className="relative z-10 flex h-full flex-col items-center justify-between pb-[12px] pt-[10px]">
              <div className="relative flex h-[42px] w-[42px] items-center justify-center">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                >
                  <path
                    d="M32 6l7.6 15.5 17.1 2.5-12.3 12 2.9 17-15.3-8.1-15.3 8.1 2.9-17-12.3-12 17.1-2.5L32 6z"
                    fill="#F6C24A"
                  />
                </svg>
                <div className="absolute -bottom-[6px] left-1/2 h-[10px] w-[54px] -translate-x-1/2  bg-[radial-gradient(ellipse_at_center,_rgba(255,214,102,0.45)_0%,_rgba(255,165,0,0.25)_45%,_rgba(0,0,0,0)_70%)]" />
              </div>
              <div className="font-oxanium font-bold text-[14px] text-white [text-shadow:0px_0px_1px_#BC13FE] tracking-[0.04em] uppercase">
                STAR
              </div>
              <div className="h-[22px] w-[98px]">
                <div className="h-full w-full rounded-[2px] bg-[#606174] p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-[1px] bg-[#6E6F83] text-[14px] font-bold tracking-[0.08em] text-[#E6E7F2]">
                    1,000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[6px] flex justify-center">
          <button
            type="button"
            className="h-[30px] w-[160px] bg-[url('/GlobalBorder/store/button.png')] bg-cover bg-center font-oxanium font-bold text-[14px] text-white tracking-[0.04em] uppercase"
          >
            EXCHANGE
          </button>
        </div>
      </div>
    </div>
  )
}
