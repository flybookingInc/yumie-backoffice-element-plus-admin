<script setup lang="ts">
import { HotelPhotoForm } from '@/components/HotelPhoto/'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { HotelPhotoListRowData } from './types'
import { HotelPhotoItem } from '@/store/modules/types/api'
import { useEmitt } from '@/hooks/event/useEmitt'

const { query } = useRoute()
const { push, go } = useRouter()
const { emitter } = useEmitt()
const { t } = useI18n()
const { currentHotelId } = useUserStore()
const { getHotelPhotos, updateHotelPhoto } = useApiStore()
const formRef = ref<ComponentRef<typeof HotelPhotoForm>>()
const currentRow = ref<Nullable<HotelPhotoListRowData>>(null)
const loading = ref(false)
const photoId = query.photoId as string
let hotelPhotosData: Nullable<HotelPhotoItem[]> = null

const getTableRowData = async () => {
  if (!photoId || !currentHotelId) {
    ElMessage.error('發生錯誤')
    push('/settings/hotel-photo-list')
  }
  const res = await getHotelPhotos({ hotelId: currentHotelId! })

  if (res && res.status === 200) {
    hotelPhotosData = res.data as HotelPhotoItem[]
    currentRow.value = {
      photoId: parseInt(photoId, 10),
      sequence: hotelPhotosData[photoId].sequence,
      url: hotelPhotosData[photoId].url,
      title: hotelPhotosData[photoId].title,
      subtitle: hotelPhotosData[photoId].subtitle
    }
  }
}

getTableRowData()

const save = async () => {
  const form = unref(formRef)
  const formData = (await form?.submit()) as HotelPhotoListRowData
  if (formData) {
    if (!currentHotelId) {
      ElMessage.error('儲存失敗: 無旅館ID')
      return
    }
    loading.value = true
    try {
      if (!hotelPhotosData) {
        ElMessage.error('更新失敗: 無相片資料')
        return
      }
      console.log('formData', formData)
      // use updated data to replace old data
      hotelPhotosData[formData.photoId] = {
        url: formData.url,
        sequence: formData.sequence,
        title: formData.title,
        subtitle: formData.subtitle
      }
      console.log('hotelPhotosData', hotelPhotosData)

      // update to DB
      const res = await updateHotelPhoto({ hotelId: currentHotelId, photos: hotelPhotosData })
      if (res.status !== 200) {
        ElMessage.error('更新失敗: ' + res.data?.message ?? '')
      }
      ElMessage.success('更新成功')
      emitter.emit('getList', 'editor')
      push('/settings/hotel-photo-list')
    } catch (err) {
      console.log(err)
      ElMessage.success('儲存失敗: ' + (err as unknown as Error).message ?? '')
    }
  }
}
</script>

<template>
  <ContentDetailWrap title="編輯" @back="push('/settings/hotel-photo-list')">
    <HotelPhotoForm ref="formRef" :current-row="currentRow" @submit="save" />

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
