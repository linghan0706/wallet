'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import Question from '@/components/backpack_up/Question'

type GiftPropsModalProps = {
  visible?: boolean
  defaultUsername?: string
  defaultAmount?: number
  itemName: string
  itemIcon: string
  onCancel?: () => void
  onConfirm?: (payload: { username: string; amount: number }) => void
  onClose: () => void
  className?: string
}

export default function GiftProps({
  visible = true,
  defaultUsername = '',
  defaultAmount = 1,
  itemName,
  itemIcon,
  onCancel,
  onConfirm,
  onClose,
  className: _className = '',
}: GiftPropsModalProps) {
  const [username, setUsername] = useState(defaultUsername)
  const [amount, setAmount] = useState<number>(defaultAmount)
  const [error, setError] = useState<string | null>(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const helpButtonRef = useRef<HTMLButtonElement>(null)
  const [giftAmount, setGiftAmount] = useState(1)
  const minGiftAmount = 1
  const maxGiftAmount = 99999

  const handleDecrease = () => {
    setGiftAmount(prev => Math.max(minGiftAmount, prev - 1))
  }

  const handleIncrease = () => {
    setGiftAmount(prev => Math.min(maxGiftAmount, prev + 1))
  }

  const handleSetMin = () => setGiftAmount(minGiftAmount)
  const handleSetMax = () => setGiftAmount(maxGiftAmount)

  const validate = () => {
    // Telegram 用户名：5-32字符，字母数字和下划线，允许带或不带 @
    const pattern = /^@?[a-zA-Z0-9_]{5,32}$/
    if (!pattern.test(username)) {
      setError(
        'Please enter a valid Telegram username (5–32 letters, digits, or underscore)'
      )
      return false
    }
    if (!Number.isFinite(amount) || amount < 1) {
      setError('Amount must be a positive integer of at least 1')
      return false
    }
    setError(null)
    return true
  }

  const handleConfirm = () => {
    if (!validate()) return
    onConfirm?.({
      username: username.startsWith('@') ? username : `@${username}`,
      amount,
    })
  }

  return (
    // 弹窗容器 - 居中显示
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-[317px] h-[456.19px] rounded-[12px]">
        {/* 背景图片层 */}
        <div
          className="absolute inset-0 rounded-[12px]"
          style={{
            backgroundImage: 'url(/stores/storeupbackground.png)',
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

          {/* 说明区域 */}
          <div className="absolute w-[285px] h-[120px] left-[15px] top-[245px] box-border rounded-[4px] bg-[rgba(5,5,16,0.5)]">
            <div className="absolute left-[20px] top-[6px] text-white text-center font-['Jersey_10'] font-normal text-[16px] leading-[22px] text-shadow-[0px_0px_1px_#BC13FE]">
              Gift item
            </div>

            <div className="flex flex-col items-center justify-center h-full pt-2">
              {/* 用户名输入框 */}
              <div className="relative w-[157px] h-[22px] mb-2 rounded-[4px]">
                {/* 渐变边框遮罩层 */}
                <div
                  className="absolute inset-0 rounded-[4px] pointer-events-none"
                  style={{
                    padding: '1px', // 边框厚度
                    background:
                      'linear-gradient(0deg, rgba(0, 240, 255, 0.8), rgba(0, 240, 255, 0.8)), linear-gradient(0deg, rgba(5, 5, 16, 0.2), rgba(5, 5, 16, 0.2))',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    boxSizing: 'border-box',
                  }}
                />
                {/* 输入框 */}
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@Username"
                  className="relative w-full h-full rounded-[4px] pl-2 text-white font-['Jersey_10'] text-[16px] leading-[22px] focus:outline-none z-10 box-border"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.2)), linear-gradient(0deg, rgba(188, 19, 254, 0.2), rgba(188, 19, 254, 0.2))',
                  }}
                  aria-label="Telegram username"
                  title="Telegram username"
                />
              </div>
              <div className="flex flex-row items-center gap-[7px] w-[157px] h-[22px]">
                <button
                  type="button"
                  onClick={handleSetMin}
                  className="w-[19px] h-[22px] text-center  font-['Jersey_10'] text-[16px] leading-[22px] text-[#00F0FF] flex-none order-0 flex-grow-0"
                >
                  min
                </button>
                <div
                  className="box-border flex flex-row items-center justify-between w-[100px] h-[22px] px-[5px] rounded-[8px]"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.2)), linear-gradient(0deg, rgba(188, 19, 254, 0.2), rgba(188, 19, 254, 0.2))',
                    border: '1px solid',
                    borderImageSource:
                      'linear-gradient(0deg, rgba(0, 240, 255, 0.8), rgba(0, 240, 255, 0.8)), linear-gradient(0deg, rgba(5, 5, 16, 0.2), rgba(5, 5, 16, 0.2))',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleDecrease}
                    title="Decrease amount"
                    className="w-[6px] h-[22px] mx-auto text-center font-['Jersey_10'] text-[16px] leading-[22px] text-[rgba(255,255,255,0.5)]  flex-none order-0 flex-grow-0"
                  >
                    <Image
                      src="/currency/leftButton.svg"
                      alt="Decrease"
                      width={6}
                      height={22}
                    />
                  </button>
                  <div className="w-[37px] h-[22px] mx-auto text-center font-['Jersey_10'] text-[16px] leading-[22px] text-white flex-none order-1 flex-grow-0">
                    {giftAmount.toLocaleString('en-US')}
                  </div>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    title="Increase amount"
                    className="w-[6px] h-[22px] mx-auto text-center font-['Jersey_10'] text-[16px] leading-[22px] text-[rgba(255,255,255,0.5)]   flex-none order-2 flex-grow-0"
                  >
                    <Image
                      src="/currency/rightButton.svg"
                      alt="Increase"
                      width={6}
                      height={22}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="w-[24px] h-[22px] text-center  font-['Jersey_10'] text-[16px] leading-[22px] text-[#BC13FE] flex-none order-2 flex-grow-0"
                >
                  max
                </button>
              </div>
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
              onClick={handleConfirm}
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
    </div>
  )
}
