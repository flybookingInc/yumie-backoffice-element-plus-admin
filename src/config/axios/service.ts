import axios from 'axios'
import config from './config'

import { AxiosInstance, RequestConfig, AxiosResponse } from './types'
// import { ElMessage } from 'element-plus'

const { baseUrl } = config
export const PATH_URL = baseUrl[import.meta.env.VITE_API_BASE_PATH]

// const { requestInterceptors, responseInterceptors } = interceptors

const abortControllerMap: Map<string, AbortController> = new Map()

const axiosInstance: AxiosInstance = axios.create({
  ...config,
  baseURL: PATH_URL
})

// axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
//   const controller = new AbortController()
//   const url = res.url || ''
//   res.signal = controller.signal
//   abortControllerMap.set(url, controller)
//   return res
// })

// axiosInstance.interceptors.response.use(
//   (res: AxiosResponse) => {
//     console.log('response interceptors triggered')

//     try {
//       const url = res.config.url || ''
//       abortControllerMap.delete(url)
//       // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
//       console.log('interceptors response = ', res)
//       return res
//     } catch (e) {
//       console.log(e)
//       throw e
//     }
//   },
//   (error: AxiosError) => {
//     console.log('err' + error) // for debug
//     ElMessage.error(error.message)
//     return Promise.reject(error)
//   }
// )

// axiosInstance.interceptors.request.use(requestInterceptors || defaultRequestInterceptors)
// axiosInstance.interceptors.response.use(responseInterceptors || defaultResponseInterceptors)

const service = {
  request: (config: RequestConfig): Promise<AxiosResponse> => {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }

      axiosInstance
        .request(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  },
  // request: (config: RequestConfig): Promise<AxiosResponse> => {
  //   return new Promise((resolve, reject) => {
  //     if (config.interceptors?.requestInterceptors) {
  //       config = config.interceptors.requestInterceptors(config as any)
  //     }

  //     axiosInstance
  //       .request(config)
  //       .then((res) => {
  //         resolve(res)
  //       })
  //       .catch((err: any) => {
  //         reject(err)
  //       })
  //   })
  // },
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  }
}

export default service
