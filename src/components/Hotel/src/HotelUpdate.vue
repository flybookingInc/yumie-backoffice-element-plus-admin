<script setup lang="ts">
import { HotelForm } from '@/components/Hotel/'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
const { query } = useRoute()

const hotelId = query.hotelId as string

const { push, go } = useRouter()

const { t } = useI18n()

const formRef = ref<ComponentRef<typeof HotelForm>>()

const loading = ref(false)

const save = async () => {
  const write = unref(formRef)
  if (!write) return
  await write.submit()
}
</script>

<template>
  <ContentDetailWrap title="編輯" @back="push('/settings/hotel')">
    <HotelForm ref="formRef" :hotel-id="hotelId" />

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
