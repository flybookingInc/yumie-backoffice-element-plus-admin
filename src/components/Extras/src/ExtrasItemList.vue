<template>
  <ContentWrap :title="t('router.views.extras.extrasItem.title')">
    <template #header>
      <el-row>
        <el-col :span="12" class="flex inline-flex justify-start p-2">
          <el-button class="primary" @click="addAction"> 新增商品 </el-button>
        </el-col>
        <el-col :span="12">
          <div class="flex inline-flex justify-end p-2">
            <el-switch
              v-model="extrasEnabled"
              inline-prompt
              active-text="啟用加購功能"
              inactive-text="停用加購功能"
              @change="handleExtraEnabledChange()"
            />
          </div>
        </el-col>
      </el-row>
    </template>
    <Table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :preview="['coverPhoto']"
      :fixed="true"
      :defaultSort="{ prop: 'sequence', order: 'ascending' }"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { ElSwitch, ElButton, ElRow, ElCol, ElMessage } from 'element-plus'
import { Alignment } from 'element-plus/es/components/table-v2/src/constants'
import { ref, watch, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from '@/hooks/web/useI18n'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import Swal from 'sweetalert2'
import { RowData } from './types'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const { hotelData, currentHotelId } = storeToRefs(useUserStore()) // use storeToRef to keep property reactive
const { updateEnableExtrasValue, updateExtraItemEnabledValue, deleteExtrasItem } = useApiStore()
const { t } = useI18n()
const extrasEnabled = ref<boolean>(false)
const tableRef = ref<typeof Table>()
const loading = ref(false)
const tableData = reactive<RowData[]>([])

const columns: TableColumn[] = [
  {
    field: 'id',
    label: 'ID',
    hidden: true
  },
  {
    field: 'sequence',
    label: '順序',
    width: '40px'
  },
  {
    field: 'status',
    label: '狀態',
    width: '100px',
    align: Alignment.CENTER,
    slots: {
      default: (data: any) => {
        console.log(data)
        return (
          <ElSwitch
            v-model={data.row.status}
            active-text="販售中"
            inactive-text="停售中"
            inline-prompt
            onChange={() => handleExtrasItemChange(data.row)}
          />
        )
      }
    }
  },
  {
    field: 'coverPhoto',
    label: '圖片'
  },
  {
    field: 'name',
    label: '名稱'
  },
  {
    field: 'description',
    label: '描述'
  },
  {
    field: 'price',
    label: '價格',
    width: '100px'
  },
  {
    field: 'actions',
    label: '動作',
    width: '160px',
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
    // formatter: (_record: Recordable, _tableColumn: TableColumn, _cellValue: string[]) => {
    //   return (
    //     <div class="flex flex-wrap gap-1 m-4 justify-center">
    //       <ElButton class="btn btn-primary"> 編輯 </ElButton>
    //       <ElButton class="btn btn-primary"> 刪除 </ElButton>
    //     </div>
    //   )
    // }
  }
]

// const actionFn = (data: TableSlotDefault) => {
//   console.log(data)
// }

const addAction = () => {
  push('/extras/items-add')
}

const updateAction = (row: RowData) => {
  push(`/extras/items-update?id=${row.id}`)
}

const deleteAction = async (row: RowData) => {
  if (!currentHotelId.value) return
  try {
    await deleteExtrasItem({ hotelId: currentHotelId.value, itemId: row.id })
    ElMessage.success('刪除成功')
  } catch (err) {
    ElMessage.error('刪除失敗')
  }
}

// bind extrasEnabled value to hotelData.extras.enableExtras
watch(
  () => hotelData.value?.extras?.enableExtras,
  (value) => {
    // update extrasEnabled
    extrasEnabled.value = value || false
  },
  { immediate: true }
)

// bind hotelData.extras.items to tableData
watch(
  () => hotelData.value?.extras?.items,
  (items) => {
    if (!items) {
      return
    }
    try {
      // reset tableData
      tableData.splice(0, tableData.length)
      const itemsKey = Object.keys(items)
      for (let key of itemsKey) {
        const item = items[key]
        const row: RowData = {
          id: key,
          coverPhoto: item.extraImagePath || '',
          name: item.extraName,
          description: item.extraDescription || '',
          price: item.extraPrice,
          status: item.enable || false,
          sequence: item.order,
          actions: ['修改', '刪除']
        }
        tableData.push(row)
      }
    } catch (e) {
      console.log(e)
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const handleExtraEnabledChange = () => {
  try {
    updateEnableExtrasValue({ value: extrasEnabled.value })
  } catch (e) {
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: '開啟或關閉加購功能失敗'
    })
  }
}

const handleExtrasItemChange = (record: Recordable) => {
  if (!record.id) {
    console.log('record.id is empty')
    return
  }
  if (!record.status) {
    console.log('record.status is empty')
    return
  }
  try {
    updateExtraItemEnabledValue({ extraId: record.id, value: record.status })
  } catch (e) {
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: '更新商品狀態失敗'
    })
  }
}
</script>
