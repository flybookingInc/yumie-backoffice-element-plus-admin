import service from './service'
import config from './config'
import { appCheck } from '@/utils/firebase'
import { getToken } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { AxiosResponse } from 'axios'

const { defaultHeaders, baseUrl } = config

/**
 * Get axios request header
 * always return a header object, even if error occurs
 */
const getRequestHeader = async (option: AxiosConfig) => {
  const { headersType } = option
  const header: {
    Authorization?: string
    'X-Firebase-AppCheck'?: string
    'Content-Type'?: string | AxiosHeaders
  } = {
    'Content-Type': headersType || defaultHeaders
  }
  const auth = getAuth()
  const user = auth.currentUser
  try {
    let token = ''
    if (user) {
      token = await user.getIdToken()
      header.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    console.log(e)
  }
  try {
    if (appCheck) {
      const appCheckTokenResponse = await getToken(appCheck, false)
      header['X-Firebase-AppCheck'] = appCheckTokenResponse.token
    }
  } catch (e) {
    console.log(e)
  }
  return header
}

const request = async (option: AxiosConfig) => {
  const { url, method, params, data, responseType } = option
  return service.request({
    url: (baseUrl[import.meta.env.VITE_API_BASE_PATH] as string) + url,
    method,
    params,
    data,
    responseType: responseType,
    headers: await getRequestHeader(option)
  })
}

export default {
  get: (option: AxiosConfig): Promise<AxiosResponse> => {
    return request({ method: 'get', ...option })
  },
  post: (option: AxiosConfig): Promise<AxiosResponse> => {
    return request({ method: 'post', ...option })
  },
  delete: (option: AxiosConfig): Promise<AxiosResponse> => {
    return request({ method: 'delete', ...option })
  },
  put: (option: AxiosConfig): Promise<AxiosResponse> => {
    return request({ method: 'put', ...option })
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
