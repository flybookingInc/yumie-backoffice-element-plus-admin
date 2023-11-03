<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { PlanListRowData } from './types'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { ElIcon, ElImage, ElMessage, ElMessageBox } from 'element-plus'
import { useApiStore } from '@/store/modules/api'
import { RoomTypeListRowData } from '@/components/RoomType/src/types'

const { required } = useValidator()
const { getRoomTypes } = useApiStore()

interface Props {
  currentRow?: Nullable<PlanListRowData>
}

const props = withDefaults(defineProps<Props>(), {
  currentRow: null
})

const { formRegister, formMethods } = useForm()
const { setValues, setSchema, getFormData, getElFormExpose } = formMethods
const API_URL = import.meta.env.VITE_API_URL as string
const { currentHotelId } = storeToRefs(useUserStore()) // use storeToRef to keep property reactive
const imageUrl = ref('')

const schema = reactive<FormSchema[]>([
  {
    field: 'planId',
    label: 'ID',
    component: 'Input',
    hidden: true,
    colProps: {
      span: 24
    }
  },
  {
    field: 'planName',
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
    field: 'weekendListPrice',
    label: '假日牌價',
    formItemProps: {
      rules: [required()]
    },
    component: 'InputNumber',
    colProps: {
      span: 24
    },
    componentProps: {
      min: 1
    }
  },
  {
    field: 'weekendPrice',
    label: '假日價格',
    formItemProps: {
      rules: [required()]
    },
    component: 'InputNumber',
    colProps: {
      span: 24
    },
    componentProps: {
      min: 1
    }
  },
  {
    field: 'weekListPrice',
    label: '平常日牌價',
    formItemProps: {
      rules: [required()]
    },
    component: 'InputNumber',
    colProps: {
      span: 24
    },
    componentProps: {
      min: 1
    }
  },
  {
    field: 'weekPrice',
    label: '平常日價格',
    formItemProps: {
      rules: [required()]
    },
    component: 'InputNumber',
    colProps: {
      span: 24
    },
    componentProps: {
      min: 1
    }
  },
  {
    field: 'weekendQkDuration',
    label: '假日休息時間',
    formItemProps: {
      rules: [required()]
    },
    component: 'InputNumber',
    colProps: {
      span: 24
    },
    componentProps: {
      min: 30,
      max: 1440,
      step: 30
    }
  },
  {
    field: 'weekQkDuration',
    label: '平常日休息時間',
    formItemProps: {
      rules: [required()]
    },
    component: 'InputNumber',
    colProps: {
      span: 24
    },
    componentProps: {
      min: 30,
      max: 1440,
      step: 30
    }
  },
  {
    field: 'disabledWeekdays',
    label: '此專案週幾不適用',
    component: 'CheckboxGroup',
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: '星期一',
          value: 1
        },
        {
          label: '星期二',
          value: 2
        },
        {
          label: '星期三',
          value: 3
        },
        {
          label: '星期四',
          value: 4
        },
        {
          label: '星期五',
          value: 5
        },
        {
          label: '星期六',
          value: 6
        },
        {
          label: '星期日',
          value: 0
        }
      ]
    }
  },
  {
    field: 'roomTypeId',
    label: '房型(專案將使用此房型之庫存)',
    component: 'SelectV2',
    componentProps: {
      options: []
    },
    optionApi: async () => {
      // dynamic load options from API
      if (!currentHotelId.value) return []
      const res = await getRoomTypes({ hotelId: currentHotelId.value })
      if (res && res.data && res.data.roomTypes) {
        return res.data.roomTypes.map((item: RoomTypeListRowData) => ({
          label: item.roomTypeName,
          value: item.roomTypeId
        }))
      }
      return []
    },
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'sequence',
    label: '專案顯示順序(數字小在前)',
    formItemProps: {
      rules: [required()]
    },
    component: 'InputNumber',
    colProps: {
      span: 24
    },
    componentProps: {
      min: 0,
      max: 9999
    }
  },
  {
    field: 'url',
    label: '圖片',
    component: 'Upload',
    colProps: {
      span: 24
    },
    componentProps: {
      limit: 1,
      showFileList: true,
      action: `${API_URL}/uploadPlanPhoto`,
      headers: {
        'Cache-Control': 'public, max-age=3153600'
        // 'Content-Type': 'multipart/form-data' // 'multipart/form-data' contentent-type will set automaticly
      },
      data: { hotelId: currentHotelId, planId: props.currentRow?.planId },
      multiple: false,
      onSuccess: async (_response, uploadFile) => {
        const formData = await getFormData()
        imageUrl.value = uploadFile.response.file
        formData.url = uploadFile.response.file
        await setValues(formData)
      },
      onRemove: async (_file) => {
        const formData = await getFormData()
        formData.url = ''
        await setValues(formData)
        imageUrl.value = ''
      },
      beforeRemove: (uploadFile) => {
        return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
          () => true,
          () => false
        )
      },
      onExceed: (_files, _uploadFiles) => {
        ElMessage.warning('僅允許上傳1張圖片')
      },
      slots: {
        default: () => (
          <div class="p-30px text-center inline-block border-2px border-white w-240px h-80px">
            {imageUrl.value ? <ElImage src={imageUrl.value} fit={'cover'} /> : null}
            {!imageUrl.value ? (
              <ElIcon class="avatar-uploader-icon" size="large">
                上傳
              </ElIcon>
            ) : null}
          </div>
        ),
        tip: () => (
          <div class="el-upload__tip">
            尺寸：寬305x高175像素，只允許 jpg/png 類型檔案,大小限制為 1MB 以內。
          </div>
        )
      }
    }
  },
  {
    field: 'disable',
    label: '狀態',
    formItemProps: {
      rules: [required()]
    },
    component: 'SelectV2',
    componentProps: {
      options: [
        { value: true, label: '啟用' },
        { value: false, label: '停用' }
      ]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'keepInventoryDays',
    label: '庫存同步天數',
    formItemProps: {
      rules: [required()]
    },
    value: 3,
    component: 'InputNumber',
    componentProps: {
      min: 3,
      max: 3
    },
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  planName: [required()],
  keepInventoryDays: [required()],
  disable: [required()],
  sequence: [required()],
  roomTypeId: [required()],
  weekendQkDuration: [required()],
  weekPrice: [required()],
  weekendPrice: [required()],
  weekQkDuration: [required()],
  weekListPrice: [required()],
  weekendListPrice: [required()]
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
    setSchema([
      {
        field: 'url',
        path: 'componentProps.fileList',
        value: [
          {
            name: 'photo',
            url: currentRow.imagePath
          }
        ]
      }
    ])
    imageUrl.value = currentRow.imagePath
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
