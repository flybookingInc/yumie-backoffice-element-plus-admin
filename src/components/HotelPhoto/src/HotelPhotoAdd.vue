<script setup lang="ts">
import { HotelPhotoForm } from '@/components/HotelPhoto'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { HotelPhotoListRowData } from './types'
import { useUserStore } from '@/store/modules/user'
import { CoverPhoto } from '@/types/hotel'
import { useApiStore } from '@/store/modules/api'
import { useEmitt } from '@/hooks/event/useEmitt'

const { push, go } = useRouter()
const { t } = useI18n()
const { emitter } = useEmitt()
const { currentHotelId } = useUserStore()
const { createHotelPhoto } = useApiStore()
const formRef = ref<ComponentRef<typeof HotelPhotoForm>>()
const loading = ref(false)

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
      const photo: CoverPhoto = {
        url: formData.url,
        sequence: formData.sequence,
        title: formData.title,
        subtitle: formData.subtitle
      }
      const res = await createHotelPhoto({ hotelId: currentHotelId, photo: photo })
      if (res.status == 200) {
        ElMessage.success('新增成功')
        emitter.emit('getList', 'editor')
        push('/settings/hotel-photo-list')
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
  <ContentDetailWrap title="新增" @back="push('/settings/hotel-photo-list')">
    <HotelPhotoForm ref="formRef" />

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
