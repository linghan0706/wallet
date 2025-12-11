import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import Question from '@/components/backpack_up/Question'

// 定义组件属性接口
interface ItemDetailModalProps {
  itemName: string // 物品名称
  itemIcon: string // 物品图标路径
  onClose: () => void // 关闭弹窗回调函数
  onConfirm: () => void // 确认操作回调函数
}

// 背包物品详情弹窗组件
const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  itemName,
  itemIcon,
  onClose,
  onConfirm,
}) => {
  const [showQuestion, setShowQuestion] = useState(false)
  const helpButtonRef = useRef<HTMLButtonElement>(null)

  return (
    // 弹窗容器 - 居中显示
    <div className="absolute w-[317px] h-[456.19px] rounded-[12px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-[74.9px]">
      {/* 背景图片层 */}
      <div
        className="absolute inset-0 rounded-[12px]"
        style={{
          backgroundImage: 'url(/stores/storeupback.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 内容层 */}
      <div className="relative z-10 w-full h-full">
        {/* 顶部标题栏 */}
        <div className="absolute top-[10px] left-[16px] w-[285px] h-[22px] flex flex-col justify-center items-center gap-[2px]">
          <div className="w-[92px] h-[22px] text-white text-center font-['Jersey_10'] font-normal text-[20px] leading-[22px] text-shadow-[0px_0px_1px_#BC13FE]">
            {itemName}
          </div>
        </div>

        {/* 详情按钮图标 */}
        <button
          ref={helpButtonRef}
          type="button"
          title="help"
          className="absolute right-3 top-3 w-[10px] h-[10px] flex items-center justify-center"
          onClick={() => setShowQuestion(!showQuestion)}
        >
          <Image
            src={
              showQuestion
                ? '/backpack/Question/question_active.svg'
                : '/backpack/Question/question_inactive.svg'
            }
            alt="help"
            width={10}
            height={10}
            className="w-[10px] h-[10px] object-contain"
          />
        </button>

        {/* 物品图片容器 */}
        <div className="absolute w-[150px] h-[150px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-[75.1px] rounded-[100px]">
          {/* 背景特效层 */}
          <div className="absolute w-[128px] h-[150px] left-[11px] top-0">
            {/* 渐变背景矩形 */}
            <div className="absolute w-[126px] h-[148px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[url('/stores/bg_item_Value\\ \\(Multi\\).png')] bg-[rgba(176,176,192,0.2)] rounded-[12px]" />

            {/* 渐变边框遮罩层 */}
            <div
              className="absolute inset-0 rounded-[12px] pointer-events-none"
              style={{
                padding: '1px', // 边框厚度
                background:
                  'linear-gradient(144.07deg, #BC13FE 0%, rgba(77, 77, 77, 0) 34%, rgba(51, 51, 51, 0) 67%, #00F0FF 100%)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                boxSizing: 'border-box',
              }}
            />

            {/* 内部矩形边框 */}
            <div className="absolute w-[126px] h-[148px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[12px]" />

            {/* 资产底部光影效果 */}
            <div className="absolute w-[100px] h-[6px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-y-[64px]">
              <Image
                src="/backpack/FooterShaw.png"
                alt="Asset bottom shadow"
                width={100}
                height={6}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 物品图片 */}
            <div className="absolute w-[100px] h-[100px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Image
                src={itemIcon}
                alt={itemName}
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* 效果说明区域 */}
        <div className="absolute w-[285px] h-[120px] left-[15px] top-[245px] box-border rounded-[4px] bg-[rgba(5,5,16,0.5)]">
          <div className="absolute w-[48px] h-[22px] left-[27px] top-[5px] text-white text-center font-['Jersey_10'] font-normal text-[16px] leading-[22px] text-shadow-[0px_0px_1px_#BC13FE]">
            Use item
          </div>
        </div>

        {/* 按钮容器 */}
        <div className="absolute flex flex-row justify-between items-center w-[285px] h-[30px] left-[17px] top-[377px] gap-[36px]">
          {/* 取消按钮 */}
          <button
            onClick={onClose}
            className="relative w-[120px] h-[30px] rounded-[4px] overflow-hidden bg-gradient-to-r from-[#00f0ffcc] via-[#58d0e0cc] to-[#b0b0c0cc]"
            style={{
              background:
                'linear-gradient(97.09deg, rgba(0, 240, 255, 0.8) 6.87%, rgba(88, 208, 224, 0.8) 29.72%, rgba(132, 192, 208, 0.8) 75.43%, rgba(154, 184, 200, 0.8) 86.86%, rgba(176, 176, 192, 0.8) 98.29%)',
              boxShadow:
                '0px 1px 1px #B0B0C0, 0px -1px 1px #00F0FF, inset 0px 1px 1px #B0B0C0, inset 0px -1px 1px #00F0FF',
            }}
          >
            <span className="absolute w-[42px] h-[22px] left-[39px] top-[4px] text-white text-center font-['Jersey_10'] font-normal text-[18px] leading-[22px] text-shadow-[0px_1px_1px_#B0B0C0]">
              Cancel
            </span>
          </button>

          {/* 确认按钮 */}
          <button
            onClick={onConfirm}
            className="relative w-[130px] h-[30px] rounded-[4px] overflow-hidden bg-gradient-to-r from-[#00f0ffcc] via-[#19df99cc] to-[#32cd32cc]"
            style={{
              background:
                'linear-gradient(98.64deg, rgba(0, 240, 255, 0.8) 0%, rgba(25, 223, 153, 0.8) 24.84%, rgba(38, 214, 101, 0.8) 74.51%, rgba(44, 209, 76, 0.8) 86.92%, rgba(50, 205, 50, 0.8) 99.34%)',
              boxShadow:
                '0px 1px 1px #32CD32, 0px -1px 1px #00F0FF, inset 0px 1px 1px #32CD32, inset 0px -1px 1px #00F0FF',
            }}
          >
            <span className="absolute w-[50px] h-[22px] left-[40px] top-[4px] text-white text-center font-['Jersey_10'] font-normal text-[18px] leading-[22px] text-shadow-[1px_1px_3px_#32CD32]">
              Confirm
            </span>
          </button>
        </div>
      </div>
      {/* Question 组件覆盖层*/}
      {showQuestion &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[50] flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowQuestion(false)}
            />
            <div onClick={e => e.stopPropagation()}>
              <Question />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default ItemDetailModal
