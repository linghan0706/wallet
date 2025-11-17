import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'

// 计算基础地址：统一从环境变量读取后端服务地址，若未配置则退回同源
function resolveBaseURL(): string {
  return ''
}

// 创建 axios 实例（统一后端基础地址配置）
const http: AxiosInstance = axios.create({
  baseURL: resolveBaseURL() || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    console.log('Sending request:', config.method?.toUpperCase(), config.url)

    // 添加认证 token（如果存在）
    const token =
      localStorage.getItem('telegram_auth_token') ||
      localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    console.log('Response success:', response.status, response.config.url)

    // 统一处理响应数据格式
    const { data } = response

    // 如果后端返回的是标准格式 { code, message, data, success, timestamp }
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 200 || data.code === 0) {
        // 如果响应包含 success 字段（如登录接口），转换为前端期望的格式
        if ('success' in data && 'data' in data) {
          return {
            success: data.success,
            data: data.data,
            message: data.message || '',
            timestamp: data.timestamp || Date.now(),
          }
        }
        // 否则只返回 data 字段
        return data.data || data
      } else {
        // 业务错误
        const errorMessage = data.message || 'Request failed'
        console.error('Business error:', errorMessage)
        return Promise.reject(new Error(errorMessage))
      }
    }

    // 直接返回数据
    return data
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('Response error:', error)

    let errorMessage = 'Network error'

    if (error.response) {
      // 服务器响应了错误状态码
      const { status, data } = error.response

      switch (status) {
        case 400:
          errorMessage = 'Bad request'
          break
        case 401:
          errorMessage = 'Unauthorized, please login again'
          // 清除本地 token
          localStorage.removeItem('token')
          // 可以在这里跳转到登录页
          // window.location.href = '/login'
          break
        case 403:
          errorMessage = 'Access denied'
          break
        case 404:
          errorMessage = 'Resource not found'
          break
        case 500:
          errorMessage = 'Internal server error'
          break
        case 502:
          errorMessage = 'Bad gateway'
          break
        case 503:
          errorMessage = 'Service unavailable'
          break
        default:
          errorMessage = `Request failed (${status})`
      }

      // 如果后端返回了错误信息，优先使用后端的错误信息
      if (data && typeof data === 'object') {
        if ('message' in data && data.message) {
          errorMessage = data.message as string
        } else if ('error' in data && data.error) {
          errorMessage = data.error as string
        }
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = 'Network connection timeout, please check your network'
    } else {
      // 其他错误
      errorMessage = error.message || 'Request failed'
    }

    // 显示错误提示（可以集成 antd 的 message 组件）
    console.error('HTTP Error:', errorMessage)

    return Promise.reject(new Error(errorMessage))
  }
)

// 封装常用的请求方法
export const httpUtils = {
  // GET 请求
  get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    return http.get(url, { params })
  },

  // POST 请求
  post<T = unknown>(url: string, data?: unknown): Promise<T> {
    return http.post(url, data)
  },

  // PUT 请求
  put<T = unknown>(url: string, data?: unknown): Promise<T> {
    return http.put(url, data)
  },

  // DELETE 请求
  delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    return http.delete(url, { params })
  },

  // PATCH 请求
  patch<T = unknown>(url: string, data?: unknown): Promise<T> {
    return http.patch(url, data)
  },

  // 文件上传
  upload<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return http.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(progress)
        }
      },
    })
  },

  // 下载文件
  download(url: string, filename?: string): Promise<void> {
    return http
      .get(url, {
        responseType: 'blob',
      })
      .then(response => {
        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      })
  },
}

// 导出 axios 实例（用于更复杂的自定义请求）
export default http

// 导出类型定义
export type { AxiosRequestConfig, AxiosResponse, AxiosError }
