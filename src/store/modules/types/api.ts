import { Hotel, Plan } from '@/types/hotel'
import { RoomType } from '@/models/roomType'

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

export interface getExtrasItemsRequest {
  hotelId: string
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

export interface getRoomTypesRequest {
  hotelId: string
}

export interface getRoomTypesItemResponse {
  roomTypeId: string
  roomTypeName: string
  inventorySyncToHotelDocDays: number
  interval: number
  associatePlansId: string[]
}

export interface getRoomTypesResponse {
  roomTypes: getRoomTypesItemResponse[]
}

export interface getRoomTypeRequest {
  hotelId: string
  roomTypeId: string
}

export interface getRoomTypeResponse {
  roomTypeId: string
  roomTypeName: string
  inventorySyncToHotelDocDays: number
  interval: number
  associatePlansId: string[]
}

export interface updateRoomTypeRequest {
  hotelId: string
  roomTypeId: string
  roomType: RoomType
}

export interface createRoomTypeRequest {
  hotelId: string
  roomType: RoomType
}

export interface deleteRoomTypeRequest {
  hotelId: string
  roomTypeId: string
}

export interface getPlansRequest {
  hotelId: string
}

export interface getPlansResponse {
  [planId: string]: Plan
}

export interface getPlanRequest {
  hotelId: string
  planId: string
}

export interface updatePlanRequest {
  hotelId: string
  planId: string
  newPlanData: Plan
  oldPlanData: Plan
}

// delete plan
export interface deletePlanRequest {
  hotelId: string
  planId: string
  roomTypeId: string //The room type which associate with this plan
}

// create plan
export interface createPlanRequest {
  hotelId: string
  planData: Plan
}

// update plan status
export interface updatePlanStatusRequest {
  hotelId: string
  planId: string
  enabled: boolean
}
