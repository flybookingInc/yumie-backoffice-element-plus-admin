import request from '@/config/axios'
import type { UserType } from './types'
import { AxiosResponse } from 'axios'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<AxiosResponse> => {
  return request.post({ url: '/user/login', data })
}

export const loginOutApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get({ url: '/user/list', params })
}

export const getAdminRoleApi = (params: RoleParams): Promise<AxiosResponse> => {
  return request.get({ url: '/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<AxiosResponse> => {
  return request.get({ url: '/role/list2', params })
}
