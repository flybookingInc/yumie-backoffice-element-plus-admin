<template>
  <div>
    <ContentWrap :title="t('router.views.reservations.list.title')">
      <template #header>
        <el-row>
          <el-col :span="24" class="flex inline-flex justify-end p-2">
            <el-date-picker type="date" v-model="pickedDate" placeholder="選取日期" />
            <el-button class="btn btn-primary" @click="handleDateChange()"> 查詢 </el-button>
          </el-col>
        </el-row>
      </template>
      <Table
        :columns="columns"
        :data="dataTable.data"
        :loading="loading"
        :defaultSort="{ prop: 'display_time', order: 'descending' }"
      />
    </ContentWrap>
  </div>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { ref, reactive, onMounted, watch, computed, defineOptions } from 'vue'
import { useReservationsStore } from '@/store/modules/reservations'
import { useUserStore } from '@/store/modules/user'
import { ElButton, ElRow, ElCol, ElDatePicker } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
// import type { SortBy } from 'element-plus'
import { RowData } from '@/types/reservations.page'
import { Alignment } from 'element-plus/es/components/table-v2/src/constants'
import EditableTag from '@/components/EditableTag.vue'
import ReservationStatusSwitch from '@/components/ReservationStatusSwitch.vue'
import Swal from 'sweetalert2'

const { t } = useI18n()

defineOptions({
  name: 'Reservations'
})

const pickedDate = ref<Date>(new Date())
const loading = ref(false)
// table sort ref
// const sortState = ref<SortBy>({
//   key: 'qkCheckInTime',
//   order: TableV2SortOrder.ASC
// })
const reservationStore = useReservationsStore()
const userStore = useUserStore()
// if (!dataStore.hotelData || !dataStore.user) {
//   navigateTo({ path: "/login" });
// }
const hotelId = computed(() => userStore.currentHotelId)

const columns: TableColumn[] = [
  {
    field: 'qkCheckInTime',
    label: '時段'
  },
  {
    field: 'qkNumber',
    label: '號碼'
  },
  {
    field: 'qkPlan',
    label: '方案'
  },
  {
    field: 'qkDuration',
    label: '時間'
  },
  {
    field: 'qkRemaining',
    label: '到付'
  },
  {
    field: 'qkExtras',
    label: '加購'
  },
  {
    field: 'qkPhoneNumber',
    label: '電話'
  },
  {
    field: 'qkStatus',
    label: '狀態',
    align: Alignment.CENTER,
    formatter: (record: Recordable, _tableColumn: TableColumn, cellValue: string) => {
      return (
        <ReservationStatusSwitch
          status={cellValue}
          active-text="抵達"
          active-value="抵達"
          inactive-value="OK"
          inactive-text="OK"
          onHandleSwitchChange={(value: string) => {
            handleSwitchChange(record.id, value)
          }}
        />
      )
    }
  },
  {
    field: 'qkTags',
    label: '標籤',
    align: Alignment.CENTER,
    formatter: (record: Recordable, _tableColumn: TableColumn, cellValue: string[]) => {
      return (
        <div class="flex flex-wrap gap-1 m-4 justify-center">
          <EditableTag
            id={record.id}
            tags={cellValue}
            onAddTag={(id: string, tagText: string) => {
              handleAddTag(id, tagText)
            }}
            onRemoveTag={(id: string, tagText: string) => {
              handleRemoveTag(id, tagText)
            }}
          />
        </div>
      )
    }
  }
]

const dataTable = reactive<{ data: RowData[] }>(reservationStore.reservationsTable)

// make object reactive!
watch(dataTable, (newVal) => {
  dataTable.data = newVal.data
})

// tag remove event handler
const handleRemoveTag = (id: string, tagText: string) => {
  dataTable.data.forEach((row) => {
    if (row.id === id) {
      const newTags: string[] = [...row.qkTags]
      newTags.splice(row.qkTags.indexOf(tagText), 1)
      try {
        const phone = row.qkPhoneNumber
        if (!hotelId.value) {
          throw new Error('hotelId is null')
        }
        reservationStore.putCustomerTags(hotelId.value, phone, newTags)
        // remove tag from curent row's tag cuoumn include others row with duplicate phone number
        dataTable.data.forEach((row2) => {
          if (row2.qkPhoneNumber === phone) {
            row2.qkTags.splice(row.qkTags.indexOf(tagText), 1)
          }
        })
      } catch (e) {
        console.log(e)
        Swal.fire({
          icon: 'error',
          title: '更新標籤失敗'
        })
      }
    }
  })
}

// tag create event handler
const handleAddTag = (id: string, tagText: string) => {
  dataTable.data.forEach((row) => {
    if (row.id === id) {
      const newTags: string[] = [...row.qkTags, tagText]
      try {
        const phone = row.qkPhoneNumber
        if (!hotelId.value) {
          throw new Error('hotelId is null')
        }
        reservationStore.putCustomerTags(hotelId.value, phone, newTags)
        // add tag to curent row's tag cuoumn include others row with duplicate phone number
        dataTable.data.forEach((row2) => {
          if (row2.qkPhoneNumber === phone) {
            row2.qkTags.push(tagText)
          }
        })
      } catch (e) {
        console.log(e)
        Swal.fire({
          icon: 'error',
          title: '更新標籤失敗'
        })
      }
    }
  })
}

// status switch change event handler
const handleSwitchChange = async (reservationId: string, cellValue: string) => {
  try {
    if (!hotelId.value) {
      throw new Error('hotelId is null')
    }
    await reservationStore.updateReservationStatusColumn(hotelId.value, cellValue, reservationId)
  } catch (e) {
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: '更新狀態失敗'
    })
  }
}

// date picker change event handler
const handleDateChange = async () => {
  try {
    if (!hotelId.value) {
      throw new Error('hotelId is null')
    }
    reservationStore.subscibeReservations(hotelId.value, pickedDate.value)
  } catch (e) {
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: '訂單列表載入失敗'
    })
  }
}

onMounted(async () => {
  try {
    if (!hotelId.value) {
      throw new Error('hotelId is null')
    }
    loading.value = true
    reservationStore.subscibeReservations(hotelId.value, pickedDate.value)
  } catch (e) {
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: '訂單列表載入失敗'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>
