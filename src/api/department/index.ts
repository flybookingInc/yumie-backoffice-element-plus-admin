import request from '@/config/axios'
import { DepartmentUserParams } from './types'

export const getDepartmentApi = () => {
  return request.get({ url: '/department/list' })
}

export const getUserByIdApi = (params: DepartmentUserParams) => {
  return request.get({ url: '/department/users', params })
}

export const deleteUserByIdApi = (ids: string[] | number[]) => {
  return request.post({ url: '/department/user/delete', data: { ids } })
}

export const saveUserApi = (data: any) => {
  return request.post({ url: '/department/user/save', data })
}

export const saveDepartmentApi = (data: any) => {
  return request.post({ url: '/department/save', data })
}

export const deleteDepartmentApi = (ids: string[] | number[]) => {
  return request.post({ url: '/department/delete', data: { ids } })
}

export const getDepartmentTableApi = (params: any) => {
  return request.get({ url: '/department/table/list', params })
}
