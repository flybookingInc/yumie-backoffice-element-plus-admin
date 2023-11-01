<script setup lang="ts">
import ExtrasItemForm from './ExtrasItemForm.vue'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { RowData } from './types'
import { useApiStore } from '@/store/modules/api'
import { useUserStore } from '@/store/modules/user'
import { GetExtrasItemByIdResponse } from '@/store/modules/types/api'

const { push, go } = useRouter()

const { query } = useRoute()

const { t } = useI18n()

const { getExtrasItemById } = useApiStore()

const { currentHotelId } = useUserStore()

const currentRow = ref<Nullable<RowData>>(null)

const getTableRowData = async () => {
  const itemId = query.id as string
  if (!itemId || !currentHotelId) {
    ElMessage.error('發生錯誤')
    push('/extras/items')
  }
  const res = await getExtrasItemById({ hotelId: currentHotelId!, itemId: query.id as string })
  if (res && res.status === 200) {
    const data = res.data as GetExtrasItemByIdResponse
    currentRow.value = {
      id: itemId,
      coverPhoto: data.extraImagePath,
      description: data.extraDescription,
      name: data.extraName,
      price: data.extraPrice,
      sequence: data.order,
      status: data.enable,
      actions: ['編輯', '刪除']
    }
  }
}

getTableRowData()

const formRef = ref<ComponentRef<typeof ExtrasItemForm>>()

const loading = ref(false)

const save = async () => {
  const write = unref(formRef)
  const result = await write?.submit()
  if (result) {
    push('/extras/items')
  }
}
</script>

<template>
  <ContentDetailWrap title="編輯" @back="push('/extras/items')">
    <ExtrasItemForm ref="formRef" :current-row="currentRow" />

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
