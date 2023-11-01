interface tableColumn {
  data: string // Set the data source for the column from the rows data object / array
  name: string // Set a descriptive name for a column
  title: string // Set the column title
}

interface editorFields {
  name: string // Unique name of the field - sent to the server on form submission.
  label: string // Label for the field - this is what the user sees.
  data: string // Data property from the data source object to use as the data for this field
}

interface TableRowData {
  DT_RowId: string
  roomTypeName: string
  associatePlansId: string[]
  inventory: { [Timekey: string]: number | string }
}

interface BatchTableRowData {
  DT_RowId: string
  inventory: { [TimeKey: string]: number | string }
}

interface RoomType {
  associatePlansId: string[]
  interval: number
  inventorySyncToHotelDocDays: number
  RoomTypeName: string
}

export { tableColumn, editorFields, TableRowData, BatchTableRowData, RoomType }
