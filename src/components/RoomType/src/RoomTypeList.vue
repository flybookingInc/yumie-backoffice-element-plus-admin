<template>
  <ContentWrap :title="t('router.views.settings.roomType.title')">
    <template #header>
      <el-row>
        <el-col :span="12" class="flex inline-flex justify-start p-2">
          <el-button class="primary" @click="addAction"> 新增房型 </el-button>
        </el-col>
      </el-row>
    </template>
    <Table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :preview="['url']"
      :pageSize="10000"
      :fixed="true"
      :defaultSort="{ prop: 'RoomTypeId', order: 'ascending' }"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElRow, ElCol, ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from '@/hooks/web/useI18n'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { RoomTypeListRowData } from './types'
import { useRouter } from 'vue-router'
import { useEmitt } from '@/hooks/event/useEmitt'
import { getRoomTypesResponse } from '@/store/modules/types/api'

const { push } = useRouter()
const { currentHotelId } = storeToRefs(useUserStore()) // use storeToRef to keep property reactive
const { getRoomTypes, deleteRoomType } = useApiStore()
const { t } = useI18n()
const tableRef = ref<typeof Table>()
const loading = ref(false)
const tableData = reactive<RoomTypeListRowData[]>([])

const columns: TableColumn[] = [
  {
    field: 'roomTypeId',
    label: 'ID',
    hidden: true
  },
  {
    field: 'roomTypeName',
    label: '名稱'
  },
  {
    field: 'actions',
    label: '動作',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <div>
            <ElButton type="primary" onClick={() => updateAction(data.row)}>
              編輯
            </ElButton>
            <ElButton class="primary" onClick={() => deleteAction(data.row)}>
              刪除
            </ElButton>
          </div>
        )
      }
    }
  }
]

const getList = async (currentHotelId: string) => {
  tableData.splice(0, tableData.length)
  loading.value = true
  try {
    if (!currentHotelId) return
    const response = await getRoomTypes({ hotelId: currentHotelId }).catch((err) => {
      console.log(err)
      return
    })
    if (!response || response.status !== 200 || !response.data) return
    const { roomTypes } = response.data as getRoomTypesResponse
    roomTypes.forEach((roomType) => {
      tableData.push({
        roomTypeId: roomType.roomTypeId,
        roomTypeName: roomType.roomTypeName,
        inventorySyncToHotelDocDays: roomType.inventorySyncToHotelDocDays,
        interval: roomType.interval,
        associatePlansId: roomType.associatePlansId
      })
    })
  } catch (err) {
    console.log(err)
    ElMessage.error('取得旅館列表失敗')
  } finally {
    loading.value = false
  }
}

useEmitt({
  name: 'getList',
  callback: (_type: string) => {
    if (!currentHotelId.value) {
      tableData.splice(0, tableData.length)
      ElMessage.warning('請先選擇旅館')
      return
    }
    getList(currentHotelId.value)
  }
})

watch(currentHotelId, async (hotelId) => {
  if (!hotelId) return
  await getList(hotelId)
})

onMounted(async () => {
  if (!currentHotelId.value) return
  await getList(currentHotelId.value)
})

const addAction = () => {
  push('/settings/room-type-add')
}

const updateAction = (row: RoomTypeListRowData) => {
  push(`/settings/room-type-update?roomTypeId=${row.roomTypeId}`)
}

const deleteAction = async (row: RoomTypeListRowData) => {
  try {
    // ElMessageBox confirm dialog
    ElMessageBox.confirm('確定要刪除嗎?', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      if (!currentHotelId.value) return
      await deleteRoomType({
        hotelId: currentHotelId.value,
        roomTypeId: row.roomTypeId
      })
        .then(() => {
          getList(currentHotelId.value!)
          ElMessage.success('刪除成功')
        })
        .catch((err) => {
          console.log(err)
        })
    })
  } catch (err) {
    ElMessage.error('刪除失敗')
  }
}
</script>
