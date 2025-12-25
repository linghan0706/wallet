import Image from 'next/image'

export default function Entrance() {
  return (
    <div className="flex flex-col ">
      <div className="w-[363px] h-[100px] bg-[url('/base/TopDisplay_border.png')] bg-contain bg-no-repeat bg-center   ">
        <div className="flex items-center px-4 h-full">
          {/* 左侧阶段图标区域 */}
          <div className="w-[80px] h-[80px] ">
            <Image
              src="/base/"
              alt="Entry Icon"
              width={80}
              height={80}
              unoptimized={true}
              className="w-full h-full"
            />
          </div>

          {/* 右侧阶段内容区域 */}
          <div className="flex flex-col justify-center h-full">
            {/* 标题 */}
            <div
              className="font-orbitron text-white text-left"
              style={{
                fontSize: '20px',
                fontWeight: 900,
                lineHeight: '25px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textAlign: 'left',
                textShadow: '0px 0px 4px #FFFFFF',
              }}
            >
              Blue Stars
            </div>

            {/* 描述文本 */}
            <div
              className="font-oxanium text-[#B0B0C0] text-center mt-1"
              style={{
                fontSize: '10px',
                fontWeight: 500,
                lineHeight: '12px',
                textTransform: 'capitalize',
                textAlign: 'center',
                textShadow: '0px 0px 4px #B0B0C0',
              }}
            >
              Launch your journey from Earth. Use the Power Core to gather
              energy and collect 7 unique parts to assemble the
              &quot;Entry&quot; ship.
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-[363px] h-[50px] gap-8 mt-3">
        <div className="RankingLink relative w-30 h-12.5">
          <a href="/ranking" className="block w-full h-full relative">
            <div className="w-full h-full bg-[url('/base/ranking.png')] bg-contain bg-no-repeat bg-center"></div>
            <div
              className="absolute right-8 transform translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-2xl font-bold font-oxanium tracking-[0.04em] text-center uppercase flex items-center justify-center w-auto max-w-[100px]"
              style={{
                fontSize: '12px',
                lineHeight: '25px',
                textShadow: '0px 0px 4px #00F0FF',
              }}
            >
              RANKING
            </div>
          </a>
        </div>
        <div className="ProfileLink relative w-23 h-6.5">
          <div className="w-full h-full bg-[url('/base/line.png')] bg-contain bg-no-repeat bg-center"></div>
        </div>
        <div className="LotteryDrawLink relative w-30 h-12.5">
          <a href="/lottery" className="block w-full h-full relative">
            <div className="w-full h-full bg-[url('/base/lotter_draw.png')] bg-contain bg-no-repeat bg-center"></div>
            <div
              className="absolute right-8 transform translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-2xl font-bold font-oxanium tracking-[0.04em] text-center uppercase flex items-center justify-center w-auto max-w-[100px]"
              style={{
                fontSize: '12px',
                lineHeight: '25px',
                textShadow: '0px 0px 4px #00F0FF',
              }}
            >
              NUMBER
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
