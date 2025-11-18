import http from '../../http'
import type { GetTasksMain } from '../../../types/tasks'

export async function fetchTasksCenter(): Promise<GetTasksMain> {
  const res = await http.get('/tasks/center')
  console.log('获取到的任务中心', res)
  return res as unknown as GetTasksMain
}
