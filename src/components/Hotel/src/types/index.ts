export interface RowData {
  hotelId: string
  hotelName: string
  hotelPhone: string
  notifyEmail: string
  hotelAddress: string
  hotelDirection: string
  googleTagManager: string
  message: string
  fullyBookShowingMessage: string
  footerMessage: string
  confirmScreenFooterMessage: string
  hotelShortDescription: string
  hotelDescription: string
  weekend: number[]
  parkingEnable: boolean
  hasEmptyParkingLot: boolean
  parkingEmptyMessage: string
  parkingFullMessage: string
  wisePmsApiEnable: boolean
  wisePmsApiHotelCode: string
  wisePmsApiFailAlertEmail: string
  flyKioskApiEnable: boolean
  flyKioskApiHotelCode: string
  flyKioskApiFailAlertEmail: string
}

export interface HotelListRowData {
  hotelId: string
  hotelName: string
  status: boolean
}
