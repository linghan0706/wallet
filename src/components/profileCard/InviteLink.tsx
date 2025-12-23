export default function InviteLink() {
  return (
    <div className="w-[363px] h-[100px] bg-[url(/profile/invite/background.png)] bg-cover bg-no-repeat mt-4 relative">
      <div className="absolute pl-2">
        <span
          className="font-oxanium font-bold text-[10px] leading-[12px] text-center tracking-[0.04em] uppercase text-white"
          style={{
            fontFamily: "'Oxanium', sans-serif",
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '10px',
            lineHeight: '12px',
            textAlign: 'center',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          Recruitment Link
        </span>
      </div>

      {/* 邀请链接容器 */}
      <div className="w-[280px] h-[30px] pt-10 ml-10">
        <div className="flex items-center justify-between h-[32px]  bg-[url('/profile/ranking/invite_link.svg')] bg-cover bg-no-repeat">
          {/* 链接框 */}
          <div className="w-[280px] h-[30px] flex items-center justify-center">
            {/* 链接文本 */}
            <div
              className="font-ibm-plex-mono font-bold text-[8px] leading-[10px] text-center text-[#B0B0C0]"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '8px',
                lineHeight: '10px',
                textAlign: 'center',
                color: '#B0B0C0',
              }}
            >
              https://t.me/nova_bot?start=x8s9d
            </div>
          </div>

          {/* 分享按钮 */}
          <button className="w-[60px] h-[30px] bg-transparent cursor-pointer flex items-center justify-center">
            <div
              className="font-oxanium font-bold text-[14px] leading-[18px] tracking-[0.04em] uppercase text-[#00F0FF] ml-[-5px] mt-[2px]"
              style={{
                fontFamily: "'Oxanium', sans-serif",
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '18px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#00F0FF',
                textShadow: '0px 1px 1px #FFFFFF',
              }}
            >
              share
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
