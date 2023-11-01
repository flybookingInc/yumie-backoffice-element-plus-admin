<script setup lang="ts">
import { HotelForm } from '@/components/Hotel'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref } from 'vue'
import { ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'

const { push, go } = useRouter()

const { t } = useI18n()

const formRef = ref<ComponentRef<typeof HotelForm>>()

const loading = ref(false)

const save = async () => {
  const form = unref(formRef)
  await form?.submit()
}
</script>

<template>
  <ContentDetailWrap title="新增" @back="push('/settings/hotel')">
    <HotelForm ref="formRef" />

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
