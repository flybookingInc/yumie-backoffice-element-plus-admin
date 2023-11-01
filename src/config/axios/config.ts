import {
  AxiosConfig,
  AxiosResponse,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig
} from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'

const config: AxiosConfig = {
  /**
   * api请求基础路径
   */
  baseUrl: {
    // 开发环境接口前缀
    base: 'http://127.0.0.1:5001/yumie-test/asia-east1/api',

    // 打包开发环境接口前缀
    dev: 'http://127.0.0.1:5001/yumie-test/asia-east1/api',

    // 打包生产环境接口前缀
    pro: 'http://127.0.0.1:5001/yumie-test/asia-east1/api',

    // 打包测试环境接口前缀
    test: 'http://127.0.0.1:5001/yumie-test/asia-east1/api'
  },

  /**
   * 接口成功返回状态码
   */
  code: 0,

  /**
   * 接口请求超时时间
   */
  timeout: 60000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  defaultHeaders: 'application/json',

  interceptors: {
    //请求拦截
    // requestInterceptors: (config) => {
    //   return config
    // },
    // 响应拦截器
    // responseInterceptors: (result: AxiosResponse) => {
    //   return result
    // }
  }
}

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse<any>) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === config.code) {
    return response.data
  } else {
    ElMessage.error((response as any).message)
  }
}

export const timeSegments: string[] = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30'
]

export { defaultResponseInterceptors, defaultRequestInterceptors }
export default config
