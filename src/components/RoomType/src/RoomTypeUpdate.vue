<script setup lang="ts">
import { RoomTypeForm } from '@/components/RoomType/'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { RoomTypeListRowData } from './types'
import { getRoomTypeResponse } from '@/store/modules/types/api'
import { useEmitt } from '@/hooks/event/useEmitt'
import { RoomType } from '@/models/roomType'

const { query } = useRoute()
const { push, go } = useRouter()
const { emitter } = useEmitt()
const { t } = useI18n()
const { currentHotelId } = useUserStore()
const { getRoomType, updateRoomType } = useApiStore()
const formRef = ref<ComponentRef<typeof RoomTypeForm>>()
const currentRow = ref<Nullable<RoomTypeListRowData>>(null)
const loading = ref(false)
const roomTypeId = query.roomTypeId as string
let roomTypeData: Nullable<getRoomTypeResponse> = null

const getTableRowData = async () => {
  if (!roomTypeId || !currentHotelId) {
    ElMessage.error('發生錯誤')
    push('/settings/room-type')
  }
  const res = await getRoomType({ hotelId: currentHotelId!, roomTypeId: roomTypeId })

  if (res && res.status === 200) {
    roomTypeData = res.data as getRoomTypeResponse
    currentRow.value = {
      roomTypeId: roomTypeData.roomTypeId,
      roomTypeName: roomTypeData.roomTypeName,
      inventorySyncToHotelDocDays: roomTypeData.inventorySyncToHotelDocDays,
      interval: roomTypeData.interval,
      associatePlansId: roomTypeData.associatePlansId
    }
  }
}

getTableRowData()

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
      if (!roomTypeData) {
        ElMessage.error('更新失敗: 無相片資料')
        return
      }
      console.log('formData', formData)
      // use updated data to replace old data
      const sendData: RoomType = {
        roomTypeName: formData.roomTypeName,
        inventorySyncToHotelDocDays: formData.inventorySyncToHotelDocDays,
        interval: formData.interval,
        associatePlansId: formData.associatePlansId
      }

      // update to DB
      const res = await updateRoomType({
        hotelId: currentHotelId,
        roomTypeId: formData.roomTypeId,
        roomType: sendData
      })
      if (res.status !== 200) {
        ElMessage.error('更新失敗: ' + res.data?.message ?? '')
      }
      ElMessage.success('更新成功')
      emitter.emit('getList', 'editor')
      push('/settings/room-type')
    } catch (err) {
      console.log(err)
      ElMessage.success('儲存失敗: ' + (err as unknown as Error).message ?? '')
    }
  }
}
</script>

<template>
  <ContentDetailWrap title="編輯" @back="push('/settings/room-type')">
    <RoomTypeForm ref="formRef" :current-row="currentRow" @submit="save" />

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
