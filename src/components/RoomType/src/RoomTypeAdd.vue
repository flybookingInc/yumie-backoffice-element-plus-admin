<script setup lang="ts">
import { RoomTypeForm } from '@/components/RoomType'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { RoomTypeListRowData } from './types'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { useEmitt } from '@/hooks/event/useEmitt'
import { RoomType } from '@/models/roomType'

const { push, go } = useRouter()
const { t } = useI18n()
const { emitter } = useEmitt()
const { currentHotelId } = useUserStore()
const { createRoomType } = useApiStore()
const formRef = ref<ComponentRef<typeof RoomTypeForm>>()
const loading = ref(false)

const save = async () => {
  const form = unref(formRef)
  const formData = (await form?.submit()) as RoomTypeListRowData
  if (formData) {
    if (!currentHotelId) {
      ElMessage.error('儲存失敗: 無旅館ID')
      return
    }
    loading.value = true
    try {
      const roomType: RoomType = {
        roomTypeName: formData.roomTypeName,
        inventorySyncToHotelDocDays: 3,
        interval: 30,
        associatePlansId: []
      }
      const res = await createRoomType({ hotelId: currentHotelId, roomType: roomType })
      if (res.status == 200) {
        ElMessage.success('新增成功')
        emitter.emit('getList', 'editor')
        push('/settings/room-type')
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
  <ContentDetailWrap title="新增" @back="push('/settings/room-type')">
    <RoomTypeForm ref="formRef" />

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
