export interface Extras {
  items: ExtraItem[]
}

export interface ExtraItem {
  itemId: number
  itemAmt: number
  itemName: string
  itemPrice: number
}

export interface MakeOrderByAdminRequest {
  hotelId: string
  check_in_datetime: string
  check_in_time: string
  plan_id: string
  reserved_minutes: string
  total_price: string
  phoneNumber: string
  bookingInterval: number
  kioskMode?: boolean
}

export interface MakeOrderByAdminResponse {
  statusCode: number
  msg: string
  qkNumber: string
  verifyNumber: string
  check_in_time: string
  plan_name: string
  price: string
  orderId: string
  orderDate: string
  booking_datetime: string
  bookingInterval: number
  channel: string
  checkinDatetime: string
  customer_id: string
  extraBuy: string
  planId: string
  priceRemaining: string
  reservedMinutes: string
  room_type: string
  totalPrice: string
  associateRoomTypeId: string
}
