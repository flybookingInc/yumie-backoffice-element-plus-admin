<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { RoomTypeListRowData } from '@/components/RoomType/src/types'

const { required } = useValidator()

interface Props {
  currentRow?: Nullable<RoomTypeListRowData>
}

const props = withDefaults(defineProps<Props>(), {
  currentRow: null
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const schema = reactive<FormSchema[]>([
  {
    field: 'roomTypeId',
    label: '房型ID',
    component: 'Input',
    hidden: true,
    colProps: {
      span: 24
    }
  },
  {
    field: 'roomTypeName',
    label: '房型名稱',
    formItemProps: {
      rules: [required()]
    },
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'inventorySyncToHotelDocDays',
    label: '庫存同步至飯店天數',
    hidden: true,
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'interval',
    label: '預定時段間隔',
    hidden: true,
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'associatePlansId',
    hidden: true,
    label: '關聯的專案ID',
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  roomTypeName: [required()]
})

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

watch(
  () => props.currentRow,
  async (currentRow) => {
    console.log(currentRow)
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="schema" />
</template>
