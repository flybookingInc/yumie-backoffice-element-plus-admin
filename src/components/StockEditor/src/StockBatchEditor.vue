<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="flex flex-col">
          <span>更新包含什麼日期區間的庫存？</span>
          <el-date-picker
            type="daterange"
            v-model="batchDateRange"
            range-separator="到"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            :default-value="[new Date(), new Date()]"
          />
        </div>
      </el-col>
      <el-col :span="24">
        <div class="flex flex-col">
          <span>更新包含那些房型的庫存？</span>
          <el-select-v2 v-model="batchSelectedRoomTypes" :options="roomTypesOption" multiple />
        </div>
      </el-col>
      <el-col :span="24">
        <div class="flex flex-col">
          <span>更新包含那些星期的庫存？</span>
          <div class="flex-warp, flex-auto">
            <el-checkbox
              v-model="updatedWeekdays[0]"
              label="星期一"
              size="large"
              true-label="1"
              false-label="-1"
            />
            <el-checkbox
              v-model="updatedWeekdays[1]"
              label="星期二"
              size="large"
              true-label="2"
              false-label="-1"
            />
            <el-checkbox
              v-model="updatedWeekdays[2]"
              label="星期三"
              size="large"
              true-label="3"
              false-label="-1"
            />
            <el-checkbox
              v-model="updatedWeekdays[3]"
              label="星期四"
              size="large"
              true-label="4"
              false-label="-1"
            />
            <el-checkbox
              v-model="updatedWeekdays[4]"
              label="星期五"
              size="large"
              true-label="5"
              false-label="-1"
            />
            <el-checkbox
              v-model="updatedWeekdays[5]"
              label="星期六"
              size="large"
              true-label="6"
              false-label="-1"
            />
            <el-checkbox
              v-model="updatedWeekdays[6]"
              label="星期日"
              size="large"
              true-label="0"
              false-label="-1"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="flex flex-col">
          <span>填入要更新時段的庫存數量，空白時段表示該時段庫存不更新</span>
          <DataTable
            id="batchDataTable"
            ref="batchDataTable"
            class="display"
            :columns="batchDataTableColumns"
            :data="batchTableData"
            :options="batchTableOptions"
          />
        </div>
      </el-col>
      <el-col :span="24">
        <div class="flex flex-col">
          <span>※大量更新需較長時間，更新時請勿離開此畫面</span>
          <el-button type="primary" @click="submitBatchUpdate">更新</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElDatePicker,
  ElSelectV2,
  ElCheckbox,
  ElLoading,
  ElButton
} from 'element-plus'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import DataTable from 'datatables.net-vue3'
import Editor from '@datatables.net/editor-dt'
import AutoFill from 'datatables.net-autofill-dt'
import KeyTable from 'datatables.net-keytable-dt'
import Responsive from 'datatables.net-responsive-dt'
// import Select from 'datatables.net-select-dt'
import DataTablesCore from 'datatables.net'
import { useUserStore } from '@/store/modules/user'
import type { BatchTableRowData, tableColumn, editorFields, RoomType } from './types'
import dayjs from '@/utils/dayjs'
import { findIndex, find } from 'lodash-es'
import Swal from 'sweetalert2'

DataTable.use(DataTablesCore)
DataTable.use(Editor)
DataTable.use(AutoFill)
DataTable.use(KeyTable)
DataTable.use(Responsive)
// DataTable.use(Select)

interface roomTypesOption {
  value: string
  label: string
}

const emits = defineEmits<{
  (e: 'batchUpdateCallBack', isSuccess: boolean): void
}>()

const { getRoomTypesData, batchUpdateInventory, syncInventoryToHotelDoc } = useUserStore()
const batchDataTable = ref<typeof DataTable>() // dataTable object ref
const updatedWeekdays = ref<string[]>(['1', '2', '3', '4', '5', '6', '0'])
const roomTypesOption = ref<roomTypesOption[]>([])
const batchDataTableColumns: tableColumn[] = []
const batchEditorColumnFields: editorFields[] = []
const batchTimeColumnsList = ref<string[]>([])
const batchTableData = reactive<BatchTableRowData[]>([])
const batchDateRange = ref<[Date, Date]>([new Date(), new Date()])
const batchSelectedRoomTypes = ref<string[]>([])
let roomTypeIds: string[] = []
let roomTypeData: { [roomTypeId: string]: RoomType & { avail: { [key: string]: number } } } = {}
let batchEditor: any
let batchDt: any

const batchTableOptions = {
  paging: false,
  autoWidth: true,
  searching: false,
  ordering: false,
  deferRender: true,
  responsive: false,
  scrollX: true,
  columns: batchDataTableColumns,
  data: batchTableData,
  select: {
    blurable: true,
    selector: 'td:first-child',
    style: 'os'
  },
  autoFill: {
    editor: batchEditor
  },
  keys: {
    editor: batchEditor,
    // keys: ['\t'.charCodeAt(0)], // Listen for the tab key only. see https://datatables.net/reference/option/keys.keys
    editOnFocus: true
  },
  language: {
    url: './json/datatable-zh-TW.json'
  },
  columnDefs: [
    { orderable: false, targets: '_all', defaultContent: '' },
    {
      targets: 0,
      visible: false,
      searchable: false
    }
  ]
}

onBeforeMount(() => {
  // column should be generated before datatable mounted
  generateTableColumnTitle(30)
  // editor should be init before datatable mounted
  initEditor()
})

onMounted(() => {
  // Get a DataTables API reference
  if (batchDataTable.value) {
    batchDt = batchDataTable.value.dt
  }
  // Activate an inline edit on click of a table cell
  batchDt.on('click', function (ele) {
    batchEditor.inline(ele.target, {
      onBlur: 'submit' // 'submit', 'cancel', 'close'
      // submit: 'allIfChanged' // 'all', 'changed', 'allIfChanged'
    })
  })
  loadTableInitContent()
})

const init = async () => {
  await loadTableInitContent()
  initEditor()
  batchDateRange.value = [new Date(), new Date()]
}

const initEditor = () => {
  if (batchEditor) {
    batchEditor.destroy()
  }
  batchEditor = new Editor({
    ajax: handleTableCrud,
    table: '#batchDataTable',
    fields: batchEditorColumnFields,
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
  batchDataTableColumns.push({
    data: 'DT_RowId',
    name: 'DT_RowId',
    title: 'DT_RowId'
  })

  // add fixed columns
  batchEditorColumnFields.push({
    label: 'DT_RowId',
    name: 'DT_RowId',
    data: 'DT_RowId'
  })

  // generate dymatic column header by interval
  let timePointer = dayjs('00:00', 'HH:mm')
  for (let i = 0; i < intevalCounterPerDay; i++) {
    const key = timePointer.format('HHmm')
    // rowData[key] = 1
    batchDataTableColumns.push({
      data: `inventory.${key}`,
      name: `inventory.${key}`,
      title: key.slice(-4, -2) + ':' + key.slice(-2)
    })
    batchEditorColumnFields.push({
      label: key.slice(-4, -2) + ':' + key.slice(-2),
      name: `inventory.${key}`, // this is what actually bind to datatables field
      data: `inventory.${key}`
    })
    batchTimeColumnsList.value.push(key)
    timePointer = timePointer.add(interval, 'minute')
  }
  // tableData.value.push(rowData)

  console.log('editorColumnFields=', batchEditorColumnFields)
  console.log('dataTableColumns=', batchDataTableColumns)
}

const loadTableInitContent = async () => {
  // reset
  roomTypeIds = []
  roomTypeData = {}
  batchSelectedRoomTypes.value = []
  batchTableData.splice(0, batchTableData.length)

  // get roomTypeData
  const roomTypesQuerySnapshot = await getRoomTypesData()
  roomTypesQuerySnapshot.forEach((doc) => {
    roomTypeData[doc.id] = { ...(doc.data() as RoomType), avail: {} }
    roomTypeIds.push(doc.id)
    roomTypesOption.value.push({
      value: doc.id,
      label: doc.data().RoomTypeName
    })
    batchSelectedRoomTypes.value.push(doc.id) // default sellect all room types
  })

  // init
  const row: BatchTableRowData = {
    DT_RowId: 'batchData',
    inventory: {
      '0000': '',
      '0030': '',
      '0100': '',
      '0130': '',
      '0200': '',
      '0230': '',
      '0300': '',
      '0330': '',
      '0400': '',
      '0430': '',
      '0500': '',
      '0530': '',
      '0600': '',
      '0630': '',
      '0700': '',
      '0730': '',
      '0800': '',
      '0830': '',
      '0900': '',
      '0930': '',
      '1000': '',
      '1030': '',
      '1100': '',
      '1130': '',
      '1200': '',
      '1230': '',
      '1300': '',
      '1330': '',
      '1400': '',
      '1430': '',
      '1500': '',
      '1530': '',
      '1600': '',
      '1630': '',
      '1700': '',
      '1730': '',
      '1800': '',
      '1830': '',
      '1900': '',
      '1930': '',
      '2000': '',
      '2030': '',
      '2100': '',
      '2130': '',
      '2200': '',
      '2230': '',
      '2300': '',
      '2330': ''
    }
  }
  batchTableData.push(row)

  console.log('tableData=', batchTableData)
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
  d: {
    action: string
    data: { [rowKey: string]: { inventory: { [timeKey: string]: number | string } } }
  },
  successCallback: (data: { data: BatchTableRowData[] }) => {},
  _errorCallback: () => {}
) => {
  const { action, data } = d
  console.log('handleTableCrud action=', action)
  console.log('handleTableCrud data=', data)
  let responseData: BatchTableRowData[] = []

  // find the row data in tableData, then set the value to responseData
  const updateResponseData = (roomTypeKey: string) => {
    const tableRowData = find(batchTableData, (row) => {
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
    console.log('batchTableData=', batchTableData)
    for (const roomTypeKey in data) {
      for (const timeKey in data[roomTypeKey].inventory) {
        const fieldValue = data[roomTypeKey].inventory[timeKey].toString()
        if (fieldValue === '') {
          // if field is empty, do nothing
        } else if (isNaN(parseInt(fieldValue, 10))) {
          // if field value can't convert to number, set value as empty string
          updateTableData(roomTypeKey, timeKey, '')
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

const updateTableData = (rowId: string, columnId: string, value: number | string) => {
  batchTableData.forEach((row) => {
    if (row.DT_RowId === rowId) {
      row.inventory[columnId] = value
      return
    }
  })
}

const submitBatchUpdateValidation = (data: {
  applyDayOfWeek: number[]
  applyTimeAndInventory: { [timeKey: string]: number }
}): string => {
  const { applyDayOfWeek, applyTimeAndInventory } = data
  //check parameters
  if (batchDateRange.value.length !== 2) {
    return '請選擇要更新的日期範圍'
  }
  if (batchSelectedRoomTypes.value.length === 0) {
    return '請選擇要更新的房型'
  }
  if (applyDayOfWeek.length === 0) {
    return '請選擇要更新的星期'
  }
  if (Object.keys(applyTimeAndInventory).length === 0) {
    return '請設定要更新的庫存'
  }
  return ''
}

const submitBatchUpdate = async () => {
  const roller = ElLoading.service()

  // get checked apply day of week
  let applyDayOfWeek: number[] = []
  for (let checkboxValue of updatedWeekdays.value) {
    if (checkboxValue !== '-1') {
      applyDayOfWeek.push(parseInt(checkboxValue, 10))
    }
  }

  //get apply time and tnventory
  const applyTimeAndInventory = {}
  try {
    const roomTypeIdkey = Object.keys(batchTableData)[0]
    console.log('roomTypeIdkey=', roomTypeIdkey)
    const row = batchTableData[roomTypeIdkey]
    const timeKeys = Object.keys(row.inventory)
    console.log('timeKeys=', timeKeys)
    for (let key of timeKeys) {
      if (row[key] !== '' && !isNaN(parseInt(row.inventory[key].toString(), 10))) {
        console.log('apply key=', key, parseInt(row.inventory[key].toString(), 10))
        applyTimeAndInventory[key] = parseInt(row.inventory[key].toString(), 10)
      }
    }
    console.log('applyTimeAndInventory=', applyTimeAndInventory)
  } catch (error) {
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '請設定要更新的庫存'
    })
  } finally {
    roller.close()
  }

  // get room type bookinginterval
  let bookingInterval: number[] = []
  for (let id of roomTypeIds) {
    bookingInterval.push(roomTypeData[id].interval)
  }

  // validation input
  const errorMessage = submitBatchUpdateValidation({
    applyDayOfWeek: applyDayOfWeek,
    applyTimeAndInventory: applyTimeAndInventory
  })
  if (errorMessage !== '') {
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: errorMessage
    })
    roller.close()
    return
  }

  const startDay = dayjs(batchDateRange.value[0]).tz().startOf('day')
  const endDay = dayjs(batchDateRange.value[1]).tz().endOf('day')

  // get room types which have to re-sync to hotel doc
  let reSyncRoomType: string[] = []
  let today = dayjs().tz().startOf('day')
  for (let id of roomTypeIds) {
    const { inventorySyncToHotelDocDays } = roomTypeData[id]
    if (today.add(inventorySyncToHotelDocDays - 1, 'day').diff(startDay, 'day') > 0) {
      reSyncRoomType.push(id)
    }
  }
  try {
    const response = await batchUpdateInventory({
      roomTypesId: roomTypeIds,
      startDate: startDay,
      endDate: endDay,
      bookingInterval: bookingInterval[0], // because interval is hotel level variable, every interval of room type should be same.
      applyDayofWeek: applyDayOfWeek,
      applyTimeAndInventory: applyTimeAndInventory
    })
    if (response.data?.status === 0) {
      // 批次更新執行成功
      // 將最新庫存同步到hotel doc
      if (reSyncRoomType.length > 0) {
        let syncResult = await syncInventoryToHotelDoc({
          sourceRoomTypes: reSyncRoomType
        })
        if (syncResult.status === 200) {
          // reflash web page data
          init()
          Swal.fire({
            icon: 'success',
            title: '成功',
            text: '同步更新成功'
          })
          emits('batchUpdateCallBack', true)
        } else {
          Swal.fire({
            icon: 'error',
            title: '失敗',
            text: syncResult.data.msg
          })
        }
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: response.data.msg
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '更新失敗'
    })
  } finally {
    roller.close()
  }
}
</script>

<style>
@import url('datatables.net-dt');
@import url('@datatables.net/editor-dt');
@import url('datatables.net-responsive-dt');
@import url('datatables.net-keytable-dt');
@import url('datatables.net-autofill-dt');

/* @import 'datatables.net-select-dt'; */

#batch-data-table tbody tr {
  height: 40px;
}

div.dt-autofill-list {
  z-index: 5200;
}

.swal2-container {
  z-index: 5300;
}
</style>
