import request from '@/config/axios'

export const request1 = () => {
  return request.get({
    url: '/request/1'
  })
}

export const request2 = () => {
  return request.get({
    url: '/request/2'
  })
}

export const request3 = () => {
  return request.get({
    url: '/request/3'
  })
}

export const request4 = () => {
  return request.get({
    url: '/request/4'
  })
}

export const request5 = () => {
  return request.get({
    url: '/request/5'
  })
}
