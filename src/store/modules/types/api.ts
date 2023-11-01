import { Hotel } from '@/types/hotel'

export interface CreateExtrasItemRequest {
  hotelId: string
  itemId: string
  extraName: string
  extraDescription: string
  extraPrice: number
  extraImagePath: string
  enable: boolean
  order: Number
}

export interface GetExtrasItemByIdRequest {
  hotelId: string
  itemId: string
}

export interface GetExtrasItemByIdResponse {
  enable: true
  extraDescription: string
  extraImagePath: string
  extraName: string
  extraPrice: number
  order: number
}

export interface DeleteExtrasItemRequest {
  hotelId: string
  itemId: string
}

export interface UpdateExtraItemEnabledValueRequest {
  value: boolean
  extraId: string
}

export interface UpdateHotelRequest {
  hotelId: string
  hotelData: Hotel
}

export interface CreateHotelRequest {
  hotelId: string
  hotelData: Hotel
}

export interface DeleteHotelRequest {
  hotelId: string
}

export interface GetHotelPhotosRequest {
  hotelId: string
}

export interface HotelPhotoItem {
  sequence: number
  url: string
  title: string
  subtitle: string
}

export interface UpdateHotelPhotosRequest {
  hotelId: string
  photos: HotelPhotoItem[]
}

export interface DeleteHotelPhotoRequest {
  hotelId: string
  photo: HotelPhotoItem
}

export interface CreateHotelPhotoRequest {
  hotelId: string
  photo: HotelPhotoItem
}
