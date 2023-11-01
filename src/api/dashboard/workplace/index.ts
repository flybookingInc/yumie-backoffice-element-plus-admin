import request from '@/config/axios'
import { AxiosResponse } from 'axios'

export const getCountApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/workplace/total' })
}

export const getProjectApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/workplace/project' })
}

export const getDynamicApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/workplace/dynamic' })
}

export const getTeamApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/workplace/team' })
}

export const getRadarApi = (): Promise<AxiosResponse> => {
  return request.get({ url: '/workplace/radar' })
}
