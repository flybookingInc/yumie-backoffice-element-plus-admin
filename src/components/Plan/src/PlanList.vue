<template>
  <ContentWrap :title="t('router.views.settings.plan.title')">
    <template #header>
      <el-row>
        <el-col :span="12" class="flex inline-flex justify-start p-2">
          <el-button class="primary" @click="addAction"> 新增專案 </el-button>
        </el-col>
      </el-row>
    </template>
    <Table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :preview="['imagePath']"
      :pageSize="10000"
      :fixed="true"
      :defaultSort="{ prop: 'sequence', order: 'ascending' }"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElRow, ElCol, ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { ref, reactive, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from '@/hooks/web/useI18n'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { PlanListRowData } from './types'
import { useRouter } from 'vue-router'
import { useEmitt } from '@/hooks/event/useEmitt'
import { getPlansResponse, getRoomTypesResponse } from '@/store/modules/types/api'
import { Alignment } from 'element-plus/es/components/table-v2/src/constants'

const { push } = useRouter()
const { currentHotelId } = storeToRefs(useUserStore()) // use storeToRef to keep property reactive
const { getPlans, deletePlan, updatePlanStatus, getRoomTypes } = useApiStore()
const { t } = useI18n()
const tableRef = ref<typeof Table>()
const loading = ref(false)
const tableData = reactive<PlanListRowData[]>([])

const columns: TableColumn[] = [
  {
    field: 'planId',
    label: 'ID',
    hidden: true
  },
  {
    field: 'sequence',
    label: '順序',
    width: '50px'
  },
  {
    field: 'imagePath',
    label: '圖片',
    minWidth: '150px'
  },
  {
    field: 'planName',
    label: '專案名稱'
  },
  {
    field: 'weekendPrice',
    label: '假日價格'
  },
  {
    field: 'weekPrice',
    label: '平常日價格'
  },
  {
    field: 'weekendQkDuration',
    label: '假日休息時間'
  },
  {
    field: 'weekQkDuration',
    label: '平常日休息時間'
  },
  {
    field: 'roomTypeName',
    label: '房型'
  },
  {
    field: 'disable',
    label: '狀態',
    width: '100px',
    align: Alignment.CENTER,
    slots: {
      default: (data: any) => {
        return (
          <ElSwitch
            v-model={data.row.disable}
            active-text="啟用中"
            active-value={true}
            inactive-text="停用中"
            inactive-value={false}
            inline-prompt
            beforeChange={() => handlePlanStatusChange(data.row)}
          />
        )
      }
    }
  },
  {
    field: 'actions',
    label: '動作',
    minWidth: '200px',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    formatter: (record: Recordable, _tableColumn: TableColumn, _cellValue: string[]) => {
      console.log('record=', record)
      return (
        <div class="flex flex-wrap gap-1 m-4 justify-center">
          <ElButton type="primary" onClick={() => updateAction(record.row)}>
            編輯
          </ElButton>
          <ElButton class="primary" onClick={() => deleteAction(record.row)}>
            刪除
          </ElButton>
        </div>
      )
    }
    // slots: {
    //   default: (data: any) => {
    //     return (
    //       <div>
    //         <ElButton type="primary" onClick={() => updateAction(data.row)}>
    //           編輯
    //         </ElButton>
    //         <ElButton class="primary" onClick={() => deleteAction(data.row)}>
    //           刪除
    //         </ElButton>
    //       </div>
    //     )
    //   }
    // }
  }
]

const getList = async (currentHotelId: string) => {
  tableData.splice(0, tableData.length)
  loading.value = true
  try {
    if (!currentHotelId) return
    // get room type list
    const roomTypeResponse = await getRoomTypes({ hotelId: currentHotelId }).catch((err) => {
      console.log(err)
      return
    })
    if (!roomTypeResponse || roomTypeResponse.status !== 200 || !roomTypeResponse.data) return

    const roomTypesData = (roomTypeResponse.data as getRoomTypesResponse).roomTypes
    console.log('roomTypesData=', roomTypesData)
    const roomTypeIdAndNamesMap: { [key: string]: string } = {} // keep room type id and name map
    roomTypesData.forEach((roomType) => {
      roomTypeIdAndNamesMap[roomType.roomTypeId] = roomType.roomTypeName
    })

    const response = await getPlans({ hotelId: currentHotelId }).catch((err) => {
      console.log(err)
      return
    })
    if (!response || response.status !== 200 || !response.data) return
    const plans = response.data as getPlansResponse
    const planIds = Object.keys(plans)
    planIds.forEach((planId) => {
      plans[planId].disable = !plans[planId].disable
      tableData.push({
        planId: planId,
        roomTypeName: roomTypeIdAndNamesMap[plans[planId].roomTypeId],
        planName: plans[planId].planName,
        weekendPrice: parseInt(plans[planId].weekendPrice, 10),
        weekPrice: parseInt(plans[planId].weekPrice, 10),
        weekendQkDuration: parseInt(plans[planId].weekendQkDuration, 10),
        weekQkDuration: parseInt(plans[planId].weekQkDuration, 10),
        imagePath: plans[planId].imagePath,
        sequence: parseInt(plans[planId].sequence, 10),
        disable: plans[planId].disable,
        intervalQuantity: plans[planId].intervalQuantity,
        keepInventoryDays: plans[planId].keepInventoryDays,
        inventory: plans[planId].inventory,
        roomTypeId: plans[planId].roomTypeId,
        availability: plans[planId].availability,
        weekendListPrice: parseInt(plans[planId].weekendListPrice, 10),
        weekListPrice: parseInt(plans[planId].weekListPrice, 10),
        disabledWeekdays: plans[planId].disabledWeekdays
      })
    })
    console.log('tableData=', tableData)
  } catch (err) {
    console.log(err)
    ElMessage.error('取得專案列表失敗')
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
  push('/settings/plan-add')
}

const updateAction = (row: PlanListRowData) => {
  push(`/settings/plan-update?planId=${row.planId}`)
}

const deleteAction = async (row: PlanListRowData) => {
  try {
    // ElMessageBox confirm dialog
    ElMessageBox.confirm('確定要刪除嗎?', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      if (!currentHotelId.value) return
      await deletePlan({
        hotelId: currentHotelId.value,
        planId: row.planId,
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

const handlePlanStatusChange = async (record: Recordable): Promise<boolean> => {
  if (!currentHotelId.value) return false
  if (!record.planId || typeof record.planId !== 'string') {
    console.log('record.planId is wrong')
    return false
  }
  if (record.disable === undefined || typeof record.disable !== 'boolean') {
    console.log('record.status is wrong')
    return false
  }
  try {
    await updatePlanStatus({
      hotelId: currentHotelId.value,
      planId: record.planId,
      enabled: !record.disable
    })
  } catch (e) {
    console.log(e)
    ElMessage.error('更新失敗')
    return false
  }
  return true
}
</script>
