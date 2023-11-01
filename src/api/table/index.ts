import request from '@/config/axios'
import type { TableData } from './types'
import { AxiosResponse } from 'axios'

export const getTableListApi = (params: any) => {
  return request.get({ url: '/example/list', params })
}

export const getTreeTableListApi = (params: any) => {
  return request.get({ url: '/example/treeList', params })
}

export const saveTableApi = (data: Partial<TableData>): Promise<AxiosResponse> => {
  return request.post({ url: '/example/save', data })
}

export const getTableDetApi = (id: string): Promise<AxiosResponse> => {
  return request.get({ url: '/example/detail', params: { id } })
}

export const delTableListApi = (ids: string[] | number[]): Promise<AxiosResponse> => {
  return request.post({ url: '/example/delete', data: { ids } })
}
