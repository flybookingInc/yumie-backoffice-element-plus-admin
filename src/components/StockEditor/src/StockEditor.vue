<!-- https://github.com/DataTables/Vue -->
<template>
  <el-row>
    <el-col>
      <div class="flex flex-row-reverse flex-items-end">
        <el-date-picker type="date" v-model="pickedDate" @change="handleDatePickerChange" />
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <DataTable
        id="theDataTable"
        ref="dataTable"
        class="display"
        :columns="dataTableColumns"
        :data="tableData"
        :options="tableOptions"
      />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="flex flex-row-reverse flex-items-end">
        <el-button type="primary" @click="save">儲存</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ElRow, ElCol, ElButton, ElDatePicker } from 'element-plus'
import DataTable from 'datatables.net-vue3'
import Editor from '@datatables.net/editor-dt'
import AutoFill from 'datatables.net-autofill-dt'
import KeyTable from 'datatables.net-keytable-dt'
import Responsive from 'datatables.net-responsive-dt'
import type { Api } from 'datatables.net'
// import Select from 'datatables.net-select-dt'
import DataTablesCore from 'datatables.net'
import { ref, reactive, onMounted, onBeforeMount, computed } from 'vue'
import dayjs from '@/utils/dayjs'
import { useUserStore } from '@/store/modules/user'
import { findIndex, find } from 'lodash-es'
import type { TableRowData, tableColumn, editorFields } from './types'
import Swal from 'sweetalert2'

DataTable.use(DataTablesCore)
DataTable.use(Editor)
DataTable.use(AutoFill)
DataTable.use(KeyTable)
DataTable.use(Responsive)
// DataTable.use(Select)

onBeforeMount(() => {
  // column should be generated before datatable mounted
  generateTableColumnTitle(30)
  // editor should be init before datatable mounted
  initEditor()
})

const { getRoomTypeInventoryByRangeDate, getRoomTypesData, updateInventoryToDb } = useUserStore()
const dataTable = ref<typeof DataTable>() // dataTable object ref
const dataTableColumns: tableColumn[] = []
const editorColumnFields: editorFields[] = []
const timeColumnsList = ref<string[]>([])
const pickedDate = ref(new Date())
const tableData = reactive<TableRowData[]>([])
let roomTypeIds: string[] = []
let roomTypeData: object = {}
let editor: Editor | null = null
let dt: Api<any>
const tableOptions = {
  paging: false,
  autoWidth: true,
  searching: false,
  deferRender: true,
  responsive: false,
  scrollX: true,
  columns: dataTableColumns,
  data: tableData,
  select: {
    blurable: true,
    selector: 'td:first-child',
    style: 'os'
  },
  autoFill: {
    columns: ':not(:first-child)',
    editor: editor
  },
  keys: {
    columns: ':not(:first-child)',
    editor: editor,
    // keys: ['\t'.charCodeAt(0)], // Listen for the tab key only. see https://datatables.net/reference/option/keys.keys
    editOnFocus: true
  },
  order: [1, 'asc'],
  language: {
    url: './json/datatable-zh-TW.json'
  },
  columnDefs: [
    { orderable: false, targets: '_all', defaultContent: '0' },
    {
      targets: 0,
      visible: false,
      searchable: false
    }
  ]
}

// define the date range of table
const startDay = computed(() => {
  return dayjs(pickedDate.value).tz().startOf('day')
})

// defiine the date range of table
const endDay = computed(() => {
  return dayjs(pickedDate.value).tz().endOf('day')
})

onMounted(() => {
  // Get a DataTables API reference
  if (dataTable.value) {
    dt = dataTable.value.dt
  }
  // Activate an inline edit on click of a table cell
  dt.on('click', 'tbody td:not(:first-child)', (value: { target: any }) => {
    editor?.inline(value.target, {
      onBlur: 'submit' // 'submit', 'cancel', 'close'
      // submit: 'allIfChanged' // 'all', 'changed', 'allIfChanged'
    })
  })
  // editor.on('blur', function () {
  //   console.log('event triggered: blur')
  // })
  // load table content
  loadTableContent()
})

const initEditor = () => {
  if (editor) {
    editor.destroy()
  }
  editor = new Editor({
    ajax: handleTableCrud,
    table: '#theDataTable',
    fields: editorColumnFields,
    formOptions: {
      inline: {
        onBlur: true
      }
    }
  })
}

const generateTableColumnTitle = (interval: number) => {
  let intevalCounterPerDay = Math.round((24 * 60) / interval)

  //   add fixed columns
  dataTableColumns.push(
    {
      data: 'DT_RowId',
      name: 'DT_RowId',
      title: 'DT_RowId'
    },
    {
      data: 'roomTypeName',
      name: 'roomTypeName',
      title: '房型'
    }
  )

  // add fixed columns
  editorColumnFields.push(
    {
      label: 'DT_RowId',
      name: 'DT_RowId',
      data: 'DT_RowId'
    },
    {
      label: 'roomTypeName',
      name: 'roomTypeName',
      data: 'roomTypeName'
    }
  )

  // generate dymatic column header by interval
  for (
    let d = 0;
    d <= Math.abs(endDay.value.endOf('day').diff(startDay.value.startOf('day'), 'day'));
    d++
  ) {
    let timePointer = startDay.value.add(d, 'day')
    for (let i = 0; i < intevalCounterPerDay; i++) {
      const key = timePointer.format('HHmm')
      // rowData[key] = 1
      dataTableColumns.push({
        data: `inventory.${key}`,
        name: `inventory.${key}`,
        title: key.slice(-4, -2) + ':' + key.slice(-2)
      })
      editorColumnFields.push({
        label: key.slice(-4, -2) + ':' + key.slice(-2),
        name: `inventory.${key}`, // this is what actually bind to datatables field
        data: `inventory.${key}`
      })
      timeColumnsList.value.push(key)
      timePointer = timePointer.add(interval, 'minute')
    }
    // tableData.value.push(rowData)
  }
  console.log('editorColumnFields=', editorColumnFields)
  console.log('dataTableColumns=', dataTableColumns)
}

const loadTableContent = async () => {
  // reset tableData
  tableData.splice(0, tableData.length)
  // reset roomTypeIds
  roomTypeIds = []
  // reset roomTypeData
  roomTypeData = {}
  //get room type Data
  const roomTypesQuerySnapshot = await getRoomTypesData()
  roomTypesQuerySnapshot.forEach((doc) => {
    roomTypeData[doc.id] = doc.data()
    roomTypeData[doc.id]['avail'] = {}
    roomTypeIds.push(doc.id)
  })

  // get inventory of each room type
  let row: TableRowData
  for (let roomTypeId of roomTypeIds) {
    let index = roomTypeIds.indexOf(roomTypeId)
    let dbSnapshop = await getRoomTypeInventoryByRangeDate(roomTypeId, startDay.value, endDay.value)

    // init
    row = {
      DT_RowId: roomTypeId,
      roomTypeName: roomTypeData[roomTypeId]['RoomTypeName'],
      associatePlansId: roomTypeData[roomTypeId]['associatePlansId'],
      inventory: {}
    }

    if (dbSnapshop.empty) {
      // no inventory, use 0 instead
      console.log('no inventory, use 0 instead')
      dataTableColumns.forEach((column) => {
        if (!isNaN(parseInt(column.name, 10))) {
          roomTypeData[roomTypeId]['avail'][column.name] = 0
          row.inventory[column.name] = 0
        }
      })
    } else {
      dbSnapshop.forEach((doc) => {
        // get inventory
        for (let timeKey in doc.data().availability) {
          // convert timeKey YYYYMMDDHHmm to HHmm format
          roomTypeData[roomTypeId]['avail'][timeKey.slice(-4)] = doc.data().availability[timeKey]
        }
        // roomTypeData[roomTypeId]['avail'] = Object.assign(
        //   roomTypeData[roomTypeId]['avail'],
        //   doc.data().availability
        // )
        //row.inventory = Object.assign(row.inventory, doc.data().availability)
        for (let timeKey in doc.data().availability) {
          // convert timeKey YYYYMMDDHHmm to HHmm format
          row.inventory[timeKey.slice(-4)] = doc.data().availability[timeKey]
        }
      })
      console.log('roomTypeData=', roomTypeData)
    }
    console.log('row=', row)
    tableData[index] = row
  }
}

/**
 * function that catch the event of table CRUD.
 * @description Only deal with edit action now. callback a modified row data if update is success committed
 * @link https://editor.datatables.net/examples/inline-editing/options.html
 * @link https://editor.datatables.net/examples/extensions/autoFill.html
 * @link https://editor.datatables.net/manual/api#Example
 * @link https://datatables.net/forums/discussion/77058
 * @link https://editor.datatables.net/reference/type/form-options
 * @param _method 
 * @param _url 
 * @param d 
 * @param successCallback 
 * @param _errorCallback 
 * @example 
 * _method = null
 * _url = null
 * d.action = 'edit',  
 * d.data = {
    "RGYDpiHzpkypChINFl4e": {
        "202310090300": "3"
    }
  }
 * successCallback = (data: { data: TableRowData[] }) => {}
 * example of callback data. should return a modified row data if update is success committed
 * {
    data: [
      {
        DT_RowId: "RGYDpiHzpkypChINFl4e",
        roomType: "標準雙人房有窗",
        associatePlansId: ["ED"],
        202203170000: 8,
        202203170030: 8,
        202203170100: 8,
        202203170130: 8,
        202203170200: 8,
        202203170230: 8,
        202203170300: 8,
        202203170330: 8,
        202203170400: 8,
        202203170430: 8,
        202203170500: 8,
        202203170530: 8,
        202203170600: 8,
        202203170630: 8,
        202203170700: 8,
        202203170730: 8,
        202203170800: 8,
        202203170830: 8,
        202203170900: 8,
        202203170930: 8,
        202203171000: 8,
        202203171030: 8,
        202203171100: 8,
        202203171130: 8,
        202203171200: 8,
        202203171230: 8,
        202203171300: 8,
        202203171330: 8,
        202203171400: 8,
        202203171430: 8,
        202203171500: 8,
        202203171530: 8,
        202203171600: 8,
        202203171630: 8,
        202203171700: 8,
        202203171730: 8,
        202203171800: 8,
        202203171830: 8,
        202203171900: 8,
        202203171930: 8,
        202203172000: 8,
        202203172030: 8,
        202203172100: 8,
        202203172130: 8,
        202203172200: 8,
        202203172230: 8,
        202203172300: 8,
        202203172330: 8,
      },
    ],
  };
 */
const handleTableCrud = (
  _method: string,
  _url: string,
  d: { action: string; data: { [rowKey: string]: { inventory: { [timeKey: string]: number } } } },
  successCallback: (data: { data: TableRowData[] }) => {},
  _errorCallback: () => {}
) => {
  console.log('input data=', d.data)
  const { action, data } = d
  let responseData: TableRowData[] = []

  // find the row data in tableData, then set the value to responseData
  const updateResponseData = (roomTypeKey: string) => {
    const tableRowData = find(tableData, (row) => {
      return row.DT_RowId === roomTypeKey
    })

    if (tableRowData === undefined) {
      return
    }

    const index = findIndex(responseData, (item) => {
      return item.DT_RowId === roomTypeKey
    })
    if (index === -1) {
      responseData.push(tableRowData)
    } else {
      responseData[index] = tableRowData
    }
  }

  if (action === 'create') {
    // pass
  } else if (action === 'edit') {
    // Update each edited item with the data submitted
    for (const roomTypeKey in data) {
      for (const timeKey in data[roomTypeKey].inventory) {
        const fieldValue = data[roomTypeKey].inventory[timeKey].toString()
        if (!fieldValue) {
          // if field is empty, set value 0
          updateTableData(roomTypeKey, timeKey, 0)
        } else if (isNaN(parseInt(fieldValue, 10))) {
          // if field value can't convert to number, set value 0
          updateTableData(roomTypeKey, timeKey, 0)
          // tableData[roomTypeIndex][timeKey] = 0
        } else {
          // set value as converted number value
          updateTableData(roomTypeKey, timeKey, parseInt(fieldValue, 10))
        }
        updateResponseData(roomTypeKey)
      }
    }
  } else if (action === 'remove') {
    // pass
  }
  console.log('responseData=', responseData)
  // response a newest tableData if update is success committed
  successCallback({
    data: responseData
  })
}

const updateTableData = (rowId: string, columnId: string, value: number) => {
  tableData.forEach((row) => {
    if (row.DT_RowId === rowId) {
      row.inventory[columnId] = value
      return
    }
  })
}

const handleDatePickerChange = () => {
  loadTableContent()
}

// convert tableData's timeKey key to YYYYMMDDHHmm format
const convertTableDataTimekeyToDbTimekey = (data: TableRowData[], prefixDate: string) => {
  const unproxyedData: TableRowData[] = [] // unproxyed table data
  for (let row of data) {
    const newRow: TableRowData = {
      DT_RowId: row.DT_RowId,
      roomTypeName: row.roomTypeName,
      associatePlansId: [],
      inventory: {}
    }
    for (let planId of row.associatePlansId) {
      newRow.associatePlansId.push(planId)
    }
    for (let timeKey in row.inventory) {
      newRow.inventory[prefixDate + timeKey] = row.inventory[timeKey]
    }
    unproxyedData.push(newRow)
  }
  return unproxyedData
}

const save = async () => {
  const convertTableData = convertTableDataTimekeyToDbTimekey(
    tableData,
    startDay.value.format('YYYYMMDD')
  )
  if (await updateInventoryToDb(startDay.value, endDay.value, convertTableData)) {
    Swal.fire({
      icon: 'success',
      title: '更新成功',
      showConfirmButton: false,
      timer: 1500
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: '更新失敗',
      showConfirmButton: false,
      timer: 1500
    })
  }
}

defineExpose({
  loadTableContent
})
</script>

<style>
@import url('datatables.net-dt');
@import url('@datatables.net/editor-dt');
@import url('datatables.net-responsive-dt');
@import url('datatables.net-keytable-dt');
@import url('datatables.net-autofill-dt');

/* @import 'datatables.net-select-dt'; */

/* div.DTE_Inline input {
  border: none;
  background-color: transparent;
  padding: 0 !important;
  font-size: 90%;
}

div.DTE_Inline input:focus {
  outline: none;
  background-color: transparent;
} */
</style>
