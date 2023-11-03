interface ExtraItem {
  enable: boolean
  extraDescription: string | null
  extraImagePath: string | null
  extraName: string
  extraPrice: number
  order: number
}

export interface ExtraItems {
  [key: string]: ExtraItem
}

export interface Extras {
  enableExtras: boolean
  items: ExtraItems
}

interface Parking {
  emptyMessage: string
  enable: boolean
  fullMessage: string
  hasEmptyParkingLot: boolean
}

export interface Plan {
  availability: { [key: string]: boolean }
  disable: boolean
  disabledWeekdays: number[]
  imagePath: string
  inventory: { [key: string]: number }
  keepInventoryDays: number
  intervalQuantity: { [key: string]: number }
  planName: string
  roomTypeId: string
  sequence: string
  weekListPrice: string
  weekPrice: string
  weekQkDuration: string
  weekendListPrice: string
  weekendPrice: string
  weekendQkDuration: string
}

export interface CoverPhoto {
  sequence: number
  subtitle: string
  title: string
  url: string
}

export interface Hotel {
  bookingInterval: number
  confirmScreenFooterMessage: string
  coverPhoto: CoverPhoto[]
  disabled: boolean
  extras: Extras
  flyKioskApi: { enabled: boolean; failAlertEmail: string; hotelCode: string }
  footerMessage: string
  fullyBookShowingMessage: string
  googleTagManager: { enable: boolean; id: string }
  hotelAddress: string
  hotelDescription: string
  hotelDirection: string
  hotelFaviconUrl: string
  hotelId: string
  hotelLogoUrl: string
  hotelMobileLogoUrl: string
  hotelName: string
  hotelPhone: string
  hotelShortDescription: string
  hotelWebsiteUrl: string
  message: string
  notifyEmail: string
  parking: Parking
  plans: { [key: string]: Plan }
  redirect: { enabled: boolean; redirectUrl: string }
  weekend: number[]
  wisePmsApi: { enable: boolean; failAlertEmail: string; HotelCode: string }
}
