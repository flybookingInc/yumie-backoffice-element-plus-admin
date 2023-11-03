<script setup lang="ts">
import { PlanForm } from '@/components/Plan'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { PlanListRowData } from './types'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { useEmitt } from '@/hooks/event/useEmitt'
import { createPlanRequest } from '@/store/modules/types/api'

const { push, go } = useRouter()
const { t } = useI18n()
const { emitter } = useEmitt()
const { currentHotelId } = useUserStore()
const { createPlan } = useApiStore()
const formRef = ref<ComponentRef<typeof PlanForm>>()
const loading = ref(false)

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
      const sendData: createPlanRequest = {
        hotelId: currentHotelId,
        planData: {
          sequence: formData.sequence.toString(),
          availability: {},
          intervalQuantity: {},
          inventory: {},
          roomTypeId: formData.roomTypeId,
          planName: formData.planName,
          weekendListPrice: formData.weekendListPrice.toString(),
          weekendPrice: formData.weekendPrice.toString(),
          weekListPrice: formData.weekListPrice.toString(),
          weekPrice: formData.weekPrice.toString(),
          weekendQkDuration: formData.weekendQkDuration.toString(),
          weekQkDuration: formData.weekQkDuration.toString(),
          imagePath: formData.imagePath,
          disabledWeekdays: formData.disabledWeekdays,
          keepInventoryDays: formData.keepInventoryDays,
          disable: true
        }
      }
      const res = await createPlan(sendData)
      if (res.status == 200) {
        ElMessage.success('新增成功')
        emitter.emit('getList', 'editor')
        push('/settings/plan-list')
      }
    } catch (err) {
      ElMessage.error(`新增失敗: ${(err as unknown as Error).message ?? ''}`)
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <ContentDetailWrap title="新增" @back="push('/settings/plan-list')">
    <PlanForm ref="formRef" />

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
