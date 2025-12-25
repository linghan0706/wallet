'use client'
import MotionDiv from '@/components/motion/MotionDiv'
import { useCallback, useEffect, useState } from 'react'

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
        style={{ backgroundImage: `url(/layout/background.png)` }}
      ></div>

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
                className="h-[80px] w-[363px] rounded-[15px] bg-[rgba(0,0,0,0.1)] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.2)] backdrop-blur-[1.5px]"
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
              className="relative w-[363px] h-[80px] overflow-hidden"
              style={{
                backgroundImage: 'url(/GlobalBorder/task/basic_border.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              {/* 内容容器 */}
              <div className="relative w-[363px] h-full rounded-[12px] border border-white/15 flex items-center px-3 sm:px-4 bg-transparent">
                {/* 左侧图标和文本区域 */}
                <div className="flex items-center flex-1 min-w-0">
                  {/* 图标容器  */}
                  <div className="w-[50px] h-[50px] sm:w-[50px] sm:h-[50px] flex items-center justify-center relative flex-shrink-0">
                    {/* 图标背景圆圈 */}
                    <div className="absolute inset-0" />
                    {/* 主任务图标 */}
                    {hasTaskIconImage ? (
                      <Image
                        src={taskIconPath}
                        alt={task.taskName}
                        width={50}
                        height={50}
                        className="relative z-10"
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
                    <div className="flex flex-row justify-between items-center p-0 gap-[6px] w-[62px] h-[25px]">
                      {/* 徽章图标 */}
                      {showRewardIcon ? (
                        <div className="w-[20px] h-[25px] m-auto">
                          <Image
                            src={primaryRewardIcon}
                            alt="reward"
                            width={20}
                            height={25}
                            className="flex-shrink-0"
                            style={{ width: 'auto', height: 'auto' }}
                          />
                        </div>
                      ) : null}
                      {/* 奖励数值 */}
                      <span className="w-[40px] h-[25px] m-auto font-jersey-10 font-normal text-[14px] leading-[22px] text-white text-center flex-none order-1 flex-grow-0">
                        ·{rewardDisplay}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 右侧区域 - 进度条和按钮 */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                  {/* 进度条 */}
                  {showProgress && (
                    <div className="flex flex-col items-center w-[65px] justify-end mb-[-17px]">
                      <span className="font-jersey-10 font-normal text-[14px] leading-[20px] text-center text-white text-shadow-[1px_0px_0px_#6B0AE9]">
                        {currentProgressDisplay}/{totalRequirementDisplay}
                      </span>
                      <div className="w-full h-[7px] bg-gray-700/50 rounded-full overflow-hidden mb-1 border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-[#00D3F3] to-[#E377DA] transition-all duration-200 rounded-full shadow-sm"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex-shrink-0">
                    <button
                      className={`
                         w-[48px] h-[48px] sm:w-[80px] sm:h-[40px]
                         rounded-[8px] sm:rounded-[12px]
                         flex items-center justify-center
                         transition-all duration-300 transform
                       `}
                      onClick={() => handleTaskAction(task)}
                    >
                      {!task.buttonEnabled ? (
                        <div className="relative w-[48px] h-[48px] flex items-center justify-center">
                          <Image
                            src="/currency/InCompleted.png"
                            alt="Completed"
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative w-[48px] h-[48px] flex items-center justify-center">
                          <Image
                            src="/currency/InStatus.png"
                            alt="Incomplete"
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      )}
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
