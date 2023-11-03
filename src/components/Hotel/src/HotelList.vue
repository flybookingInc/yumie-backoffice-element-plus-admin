<template>
  <ContentWrap :title="t('router.views.settings.hotel.title')">
    <template #header>
      <el-row>
        <el-col :span="12" class="flex inline-flex justify-start p-2">
          <el-button class="primary" @click="addAction"> 新增旅館 </el-button>
        </el-col>
      </el-row>
    </template>
    <Table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :fixed="true"
      :defaultSort="{ prop: 'hotelName', order: 'ascending' }"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { ElSwitch, ElButton, ElRow, ElCol, ElMessage, ElMessageBox } from 'element-plus'
import { Alignment } from 'element-plus/es/components/table-v2/src/constants'
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from '@/hooks/web/useI18n'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { HotelListRowData } from './types'
import { useRouter } from 'vue-router'
import { Hotel } from '@/types/hotel'

const { push } = useRouter()
const { currentHotelId } = storeToRefs(useUserStore()) // use storeToRef to keep property reactive
const { deleteHotel, getHotels } = useApiStore()
const { t } = useI18n()
const tableRef = ref<typeof Table>()
const loading = ref(false)
const tableData = reactive<HotelListRowData[]>([])

const columns: TableColumn[] = [
  {
    field: 'hotelId',
    label: 'ID'
  },
  {
    field: 'hotelName',
    label: '名稱'
  },
  {
    field: 'status',
    label: '狀態',
    align: Alignment.CENTER,
    slots: {
      default: (data: any) => {
        return (
          <ElSwitch
            v-model={data.row.disabled}
            active-text="上線中"
            active-value={false}
            inactive-text="下線中"
            inactive-value={true}
            inline-prompt
            disabled={true}
          />
        )
      }
    }
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
            <ElButton class="primary" onClick={() => updatePhotoAction(data.row)}>
              照片
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

// get table list data
const getList = async () => {
  loading.value = true
  try {
    const response = await getHotels()
    if (response.status !== 200 || !response.data) return
    const hotels = response.data as Hotel[]
    for (let hotel of hotels) {
      tableData.push({
        hotelId: hotel.hotelId,
        hotelName: hotel.hotelName,
        status: !hotel.disabled
      })
    }
  } catch (err) {
    ElMessage.error('取得旅館列表失敗')
  } finally {
    loading.value = false
  }
}

getList()

const addAction = () => {
  push('/settings/hotel-add')
}

const updateAction = (row: HotelListRowData) => {
  push(`/settings/hotel-update?hotelId=${row.hotelId}`)
}

const updatePhotoAction = (row: HotelListRowData) => {
  push(`/settings/hotel-photo-update?hotelId=${row.hotelId}`)
}

const deleteAction = async (row: HotelListRowData) => {
  if (!currentHotelId.value) return
  try {
    ElMessageBox.confirm('確定要刪除嗎?', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteHotel({ hotelId: row.hotelId })
      await getList()
      ElMessage.success('刪除成功')
    })
  } catch (err) {
    ElMessage.error('刪除失敗')
  }
}
</script>
