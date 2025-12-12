import React from 'react'

interface ConfirmAgainProps {
  itemName: string
  itemType?: 'use' | 'sell' // 新增类型参数，默认为'use'
  powerValue?: string | number // 新增power值参数，用于sell场景
  itemCount?: number // 物品数量，用于计算sell场景下的power值
  onClose: () => void
  onConfirm: () => void
}

const ConfirmAgain: React.FC<ConfirmAgainProps> = ({
  itemName,
  itemType = 'use',
  powerValue,
  itemCount = 1,
  onClose,
  onConfirm,
}) => {
  // 默认单价，实际应用中应该从配置或API获取
  const unitPrice = 1000

  // 根据itemType确定显示的文本
  const getTitleText = () => {
    return itemType === 'sell' ? 'Confirm Sell' : 'Confirm Use'
  }

  const getDescriptionText = () => {
    if (itemType === 'sell') {
      // 如果传入了powerValue，则直接使用；否则根据数量和单价计算
      const calculatedPower = powerValue || itemCount * unitPrice
      return `Sell the ${itemName} to get ${calculatedPower.toLocaleString()} Power`
    }
    return `Use the ${itemName} to activate effects?`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="relative w-[317px] h-[116px] rounded-[12px]"
        style={{ background: 'rgba(5, 5, 16, 0.8)' }}
      >
        {/* 遮罩层叠加渐变边框*/}
        <div
          className="absolute inset-0 rounded-[12px] pointer-events-none"
          style={{
            padding: '1px', // 边框厚度
            background:
              'linear-gradient(136.39deg, #00F0FF 8.54%, rgba(255, 255, 255, 0) 30.01%, rgba(255, 255, 255, 0) 72.95%, #BC13FE 94.42%)',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            boxSizing: 'border-box',
          }}
        />

        {/* 内容区域 */}
        <div className="relative z-10 w-full h-full rounded-[10px] flex flex-col justify-between py-4 px-4">
          {/* 文本内容 */}
          <div className="flex flex-col items-center">
            <div className="w-[67px] h-[22px] mb-2">
              <span className="w-full h-full text-white text-center block font-['Jersey_10'] font-normal text-base leading-[22px]">
                {getTitleText()}
              </span>
            </div>

            <div className="w-full h-[22px]">
              <span className="w-full h-full text-[#B0B0C0] text-center block font-['Jersey_10'] font-normal text-sm leading-[22px]">
                {getDescriptionText()}
              </span>
            </div>
          </div>

          {/* 按钮容器 */}
          <div className="flex flex-row justify-between w-full">
            <button
              onClick={onClose}
              className="relative w-[120px] h-[30px] rounded-[4px] overflow-hidden bg-gradient-to-r from-[#00f0ffcc] via-[#58d0e0cc] to-[#b0b0c0cc] flex items-center justify-center"
              style={{
                boxShadow:
                  '0px 1px 1px #B0B0C0, 0px -1px 1px #00F0FF, inset 0px 1px 1px #B0B0C0, inset 0px -1px 1px #00F0FF',
                background:
                  'linear-gradient(97.09deg, rgba(0, 240, 255, 0.8) 6.87%, rgba(88, 208, 224, 0.8) 29.72%, rgba(132, 192, 208, 0.8) 75.43%, rgba(154, 184, 200, 0.8) 86.86%, rgba(176, 176, 192, 0.8) 98.29%)',
              }}
            >
              <span
                className="text-white font-['Jersey_10'] font-normal text-lg leading-[22px]"
                style={{ textShadow: '0px 1px 1px #B0B0C0' }}
              >
                Cancel
              </span>
            </button>

            {/* Confirm  */}
            <button
              onClick={onConfirm}
              className="relative w-[130px] h-[30px] rounded-[4px] overflow-hidden bg-gradient-to-r from-[#00f0ffcc] via-[#25df99cc] to-[#32cd32cc] flex items-center justify-center"
              style={{
                boxShadow:
                  '0px 1px 1px #32CD32, 0px -1px 1px #00F0FF, inset 0px 1px 1px #32CD32, inset 0px -1px 1px #00F0FF',
                background:
                  'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(25, 223, 153, 0.8) 24.84%, rgba(38, 214, 101, 0.8) 74.51%, rgba(44, 209, 76, 0.8) 86.92%, rgba(50, 205, 50, 0.8) 99.34%)',
              }}
            >
              <span
                className="text-white font-['Jersey_10'] font-normal text-lg leading-[22px]"
                style={{ textShadow: '1px 1px 3px #32CD32' }}
              >
                Confirm
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmAgain
