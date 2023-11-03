<script setup lang="ts">
import { PlanForm } from '@/components/Plan/'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { PlanListRowData } from './types'
import { useEmitt } from '@/hooks/event/useEmitt'
import { Plan } from '@/types/hotel'

const { query } = useRoute()
const { push, go } = useRouter()
const { emitter } = useEmitt()
const { t } = useI18n()
const { currentHotelId } = useUserStore()
const { getPlan, updatePlan } = useApiStore()
const formRef = ref<ComponentRef<typeof PlanForm>>()
const currentRow = ref<Nullable<PlanListRowData>>(null)
const loading = ref(false)
const planId = query.planId as string
let PlanData: Nullable<Plan> = null

const getTableRowData = async () => {
  if (!planId || !currentHotelId) {
    ElMessage.error('發生錯誤')
    push('/settings/plan-list')
  }
  const res = await getPlan({ hotelId: currentHotelId!, planId: planId })

  if (res && res.status === 200) {
    PlanData = res.data as Plan
    currentRow.value = {
      planId: planId,
      planName: PlanData.planName,
      availability: PlanData.availability,
      intervalQuantity: PlanData.intervalQuantity,
      inventory: PlanData.inventory,
      disable: PlanData.disable,
      disabledWeekdays: PlanData.disabledWeekdays,
      imagePath: PlanData.imagePath,
      keepInventoryDays: PlanData.keepInventoryDays,
      roomTypeId: PlanData.roomTypeId,
      sequence: parseInt(PlanData.sequence, 10),
      weekListPrice: parseInt(PlanData.weekListPrice, 10),
      weekPrice: parseInt(PlanData.weekPrice, 10),
      weekQkDuration: parseInt(PlanData.weekQkDuration, 10),
      weekendListPrice: parseInt(PlanData.weekendListPrice, 10),
      weekendPrice: parseInt(PlanData.weekendPrice, 10),
      weekendQkDuration: parseInt(PlanData.weekendQkDuration, 10)
    }
  }
}

getTableRowData()

const save = async () => {
  const form = unref(formRef)
  const formData = (await form?.submit()) as PlanListRowData
  if (formData) {
    if (!currentHotelId) {
      ElMessage.error('儲存失敗: 無旅館ID')
      return
    }
    loading.value = true
    try {
      if (!PlanData) {
        ElMessage.error('更新失敗: 無相片資料')
        return
      }
      const newPlanData: Plan = {
        planName: formData.planName,
        availability: formData.availability,
        intervalQuantity: formData.intervalQuantity,
        inventory: formData.inventory,
        disable: formData.disable,
        disabledWeekdays: formData.disabledWeekdays,
        imagePath: formData.imagePath,
        keepInventoryDays: formData.keepInventoryDays,
        roomTypeId: formData.roomTypeId,
        sequence: formData.sequence.toString(),
        weekListPrice: formData.weekListPrice.toString(),
        weekPrice: formData.weekPrice.toString(),
        weekQkDuration: formData.weekQkDuration.toString(),
        weekendListPrice: formData.weekendListPrice.toString(),
        weekendPrice: formData.weekendPrice.toString(),
        weekendQkDuration: formData.weekendQkDuration.toString()
      }

      // update to DB
      const res = await updatePlan({
        hotelId: currentHotelId,
        planId: formData.planId,
        newPlanData: newPlanData,
        oldPlanData: PlanData
      })
      if (res.status !== 200) {
        ElMessage.error('更新失敗: ' + res.data?.message ?? '')
      }
      ElMessage.success('更新成功')
      emitter.emit('getList', 'editor')
      push('/settings/plan-list')
    } catch (err) {
      console.log(err)
      ElMessage.success('儲存失敗: ' + (err as unknown as Error).message ?? '')
    }
  }
}
</script>

<template>
  <ContentDetailWrap title="編輯" @back="push('/settings/plan-list')">
    <PlanForm ref="formRef" :current-row="currentRow" @submit="save" />

    <template #header>
      <ElButton @click="go(-1)">
        {{ t('common.back') }}
      </ElButton>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
