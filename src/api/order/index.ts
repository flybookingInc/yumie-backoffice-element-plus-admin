import { AxiosResponse } from 'axios'
import request from '@/config/axios'
import { MakeOrderByAdminRequest, MakeOrderByAdminResponse } from './types'

export const makeOrderByAdminApi = async (
  data: MakeOrderByAdminRequest
): Promise<AxiosResponse<MakeOrderByAdminResponse, any>> => {
  return request.post({ url: '/makeOrderByAdmin', data: data })
}
