export default function Entrance() {
  return (
    <div className="flex items-center justify-center w-[363px] h-[50px] gap-8">
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
  )
}
