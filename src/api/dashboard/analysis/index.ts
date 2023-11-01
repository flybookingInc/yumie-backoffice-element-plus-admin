import request from '@/config/axios'
import { AxiosResponse } from 'axios'

export const getCountApi = async (): Promise<AxiosResponse> => {
  return request.get({ url: '/analysis/total' })
}

export const getUserAccessSourceApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/analysis/userAccessSource' })
}

export const getWeeklyUserActivityApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/analysis/weeklyUserActivity' })
}

export const getMonthlySalesApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/analysis/monthlySales' })
}
