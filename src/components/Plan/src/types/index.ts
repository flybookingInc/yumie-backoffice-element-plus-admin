export interface PlanListRowData {
  planId: string
  availability: { [key: string]: boolean }
  disable: boolean
  disabledWeekdays: number[]
  imagePath: string
  inventory: { [key: string]: number }
  keepInventoryDays: number
  intervalQuantity: { [key: string]: number }
  planName: string
  roomTypeId: string
  roomTypeName?: string
  sequence: number
  weekListPrice: number
  weekPrice: number
  weekQkDuration: number
  weekendListPrice: number
  weekendPrice: number
  weekendQkDuration: number
}
