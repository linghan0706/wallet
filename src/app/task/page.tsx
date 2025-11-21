'use client'
import MotionDiv from '@/components/motion/MotionDiv'
import { useCallback, useEffect, useState } from 'react'

import backImage from '@/public/backImage.png'
import Image from 'next/image'
import { fetchTasksCenter, checkTaskProgress } from '@/utils/api/task/api'
import type { Datum } from '@/types/tasks'

export default function TaskPage() {
  const [tasks, setTasks] = useState<Datum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingTaskId, setCheckingTaskId] = useState<number | null>(null)

  const loadTasks = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false
    if (!silent) setLoading(true)
    setError(null)
    try {
      const res = await fetchTasksCenter()
      const taskList = Array.isArray(res?.data) ? res.data : []
      setTasks(taskList)
    } catch (err) {
      console.error('Failed to load tasks', err)
      if (!silent) {
        setTasks([])
      }
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const handleTaskAction = useCallback(
    async (task: Datum) => {
      if (!task.buttonEnabled) return

      setCheckingTaskId(task.taskId)
      setError(null)
      try {
        const res = await checkTaskProgress(task.taskId)
        if (res?.data) {
          setTasks(prev => {
            const hasTask = prev.some(item => item.taskId === res.data.taskId)
            if (!hasTask) return prev
            return prev.map(item =>
              item.taskId === res.data.taskId ? res.data : item
            )
          })
        } else {
          await loadTasks({ silent: true })
        }
      } catch (err) {
        console.error('Failed to update task progress', err)
        setError(
          err instanceof Error ? err.message : 'Failed to update task progress'
        )
      } finally {
        setCheckingTaskId(null)
      }
    },
    [loadTasks]
  )

  const showSkeleton = loading && tasks.length === 0
  const showEmptyState = !loading && tasks.length === 0

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 sm:pt-14">
      {/* 背景容器 */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] bg-cover bg-contain"
        style={{ backgroundImage: `url(${backImage.src})` }}
      >
        {/* 椭圆径向渐变遮罩层 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(107,10,233,0.4) 0%, rgba(100,16,177,0.2) 40%, rgba(94,50,172,0.1) 80%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(15px)',
          }}
        ></div>
      </div>

      {/* 头部标题区域*/}
      <div className="flex flex-col items-center pt-12 sm:pt-16 space-y-3 sm:space-y-4 relative z-10 px-4">
        <h1 className="font-jersey-10 text-[36px] sm:text-[40px] leading-[22px] sm:leading-[48px] text-white font-normal tracking-wide text-center">
          Task Center
        </h1>
        <p className="font-exo2 text-[16px] sm:text-[18px] leading-[22px] sm:leading-[24px] text-center text-[#B2B2B2] font-normal max-w-[280px] sm:max-w-[300px]">
          Complete tasks to get rewards
        </p>
      </div>

      {error && (
        <div className="mt-4 px-3 sm:px-4 max-w-[380px] sm:max-w-[400px] mx-auto relative z-10">
          <div className="rounded-[14px] border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        </div>
      )}

      {/* 任务列表  */}
      <div className="mt-6 sm:mt-8 px-3 sm:px-4 space-y-3 max-w-[380px] sm:max-w-[400px] mx-auto">
        {showSkeleton && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`task-skeleton-${index}`}
                className="h-[80px] sm:h-[88px] rounded-[14px] sm:rounded-[16px] border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {showEmptyState && (
          <div className="rounded-[14px] border border-white/10 bg-white/5 px-4 py-6 text-center text-white/70 font-exo2">
            No tasks available right now.
          </div>
        )}

        {tasks.map((task, index) => {
          const taskIconPath =
            typeof task.taskIcon === 'string' ? task.taskIcon : ''
          const hasTaskIconImage =
            Boolean(taskIconPath) && Boolean(task.taskIconIsImage)
          const fallbackIconText =
            typeof task.taskIconFallbackText === 'string' &&
            task.taskIconFallbackText.trim() !== ''
              ? task.taskIconFallbackText
              : task.taskName?.charAt(0) || '🎉'
          const primaryRewardIcon =
            typeof task.primaryRewardIcon === 'string'
              ? task.primaryRewardIcon
              : ''
          const showRewardIcon =
            Boolean(primaryRewardIcon) && Boolean(task.primaryRewardIconIsImage)
          const rewardDisplay =
            typeof task.totalRewardDisplay === 'string' &&
            task.totalRewardDisplay.trim() !== ''
              ? task.totalRewardDisplay
              : typeof task.totalRewardAmount === 'number'
                ? task.totalRewardAmount.toLocaleString()
                : '0'
          const currentProgress =
            typeof task.currentProgress === 'number'
              ? task.currentProgress
              : null
          const totalRequirement =
            typeof task.totalRequirement === 'number'
              ? task.totalRequirement
              : null
          const showProgress = task.showProgress === true
          const currentProgressDisplay = currentProgress ?? 0
          const totalRequirementDisplay = totalRequirement ?? 0
          const progressPercent =
            typeof task.progressPercent === 'number' ? task.progressPercent : 0
          const normalizedStatus = (task.taskStatus || '').toUpperCase()
          const isCompleted =
            !task.buttonEnabled ||
            ['CLAIMED', 'COMPLETED', 'FINISHED'].includes(normalizedStatus)
          const isChecking = checkingTaskId === task.taskId
          const isButtonDisabled = !task.buttonEnabled || isChecking
          const resolvedButtonText = (task.buttonText ?? '').trim()
          const buttonLabel = isChecking
            ? '...'
            : resolvedButtonText || (isCompleted ? 'Done' : 'Check')

          return (
            <MotionDiv
              key={task.taskId}
              className="relative w-full h-[80px] sm:h-[88px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              {/* 背景模糊*/}
              <div
                className="absolute inset-0 backdrop-blur-[25px] rounded-[14px] sm:rounded-[16px] border border-white/10"
                style={{ backdropFilter: 'blur(25px)' }}
              />

              {/* 主背景  */}
              <div
                className="absolute inset-0 rounded-[14px] sm:rounded-[16px]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(34,26,76,0.9) 0%, rgba(34,26,76,0.7) 100%)',
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              />

              {/* 内容容器 */}
              <div className="relative w-full h-full flex items-center px-3 sm:px-4">
                {/* 左侧图标和文本区域 */}
                <div className="flex items-center flex-1 min-w-0">
                  {/* 图标容器  */}
                  <div className="w-[48px] h-[48px] sm:w-[48px] sm:h-[48px] flex items-center justify-center relative flex-shrink-0">
                    {/* 图标背景圆圈 */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(107,10,233,0.3) 0%, rgba(100,16,177,0.3) 100%)',
                      }}
                    />
                    {/* 主任务图标 */}
                    {hasTaskIconImage ? (
                      <Image
                        src={taskIconPath}
                        alt={task.taskName}
                        width={48}
                        height={48}
                        className="relative z-10"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    ) : (
                      <span className="text-[24px] sm:text-[28px] relative z-10">
                        {fallbackIconText}
                      </span>
                    )}
                  </div>

                  {/* 文本信息 */}
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    {/* 任务标题 */}
                    <div className="text-white text-[22px] sm:text-[20px] leading-[22px] sm:leading-[24px] font-normal font-jersey-10 mb-1 truncate">
                      {task.taskName}
                    </div>

                    {/* 奖励信息 */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* 徽章图标 */}
                      {showRewardIcon ? (
                        <Image
                          src={primaryRewardIcon}
                          alt="reward"
                          width={26}
                          height={26}
                          className="flex-shrink-0"
                          style={{ width: 'auto', height: 'auto' }}
                        />
                      ) : null}
                      {/* 奖励数值 */}
                      <span className="text-white text-[14px] sm:text-[16px] leading-[22px] sm:leading-[20px] font-normal font-exo2 text-center">
                        +{rewardDisplay}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 右侧区域 - 进度条和按钮 */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                  {/* 进度条 */}
                  {showProgress && (
                    <div className="flex flex-col items-center w-[65px] justify-end mb-[-17px]">
                      <span className="text-white text-[11px] font-jersey-25 text-center leading-tight">
                        {currentProgressDisplay}/{totalRequirementDisplay}
                      </span>
                      <div className="w-full h-[7px] bg-gray-700/50 rounded-full overflow-hidden mb-1 border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-[#EE3BA7] to-[#B448FB] transition-all duration-200 rounded-full shadow-sm"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Check 按钮  */}
                  <div className="flex-shrink-0">
                    <button
                      className={`
                         px-3 sm:px-4 py-1.5 sm:py-2 rounded-[8px] w-[69px] height-[34px] sm:rounded-[12px] min-w-[70px] sm:min-w-[80px] h-[36px] sm:h-[40px]
                         flex items-center justify-center
                         text-white text-[16px] sm:text-[16px] leading-[22px] sm:leading-[20px] font-normal font-jersey-10
                         transition-all duration-300 transform
                         ${
                           isButtonDisabled
                             ? 'bg-gray-600/60 cursor-not-allowed opacity-70'
                             : 'bg-gradient-to-r from-[#6B0AE9] to-[#6410B1] hover:from-[#7B1AF9] hover:to-[#7420C1] hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl active:scale-95'
                         }
                       `}
                      disabled={isButtonDisabled}
                      onClick={() => handleTaskAction(task)}
                    >
                      {buttonLabel}
                    </button>
                  </div>
                </div>
              </div>
            </MotionDiv>
          )
        })}
      </div>
    </div>
  )
}
