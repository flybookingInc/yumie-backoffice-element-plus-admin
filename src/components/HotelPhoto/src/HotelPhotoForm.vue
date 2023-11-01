<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { HotelPhotoListRowData } from '@/components/HotelPhoto/src/types'
import { ElIcon, ElMessage, ElMessageBox, ElImage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const { required } = useValidator()
const { currentHotelId } = useUserStore()

interface Props {
  currentRow?: Nullable<HotelPhotoListRowData>
}

const props = withDefaults(defineProps<Props>(), {
  currentRow: null
})

const { formRegister, formMethods } = useForm()
const { setValues, setSchema, getFormData, getElFormExpose } = formMethods

const API_URL = import.meta.env.VITE_API_URL as string
const imageUrl = ref('')

const schema = reactive<FormSchema[]>([
  {
    field: 'photoId',
    label: 'Photo ID',
    component: 'Input',
    hidden: true,
    colProps: {
      span: 24
    }
  },
  {
    field: 'sequence',
    label: '排序',
    component: 'InputNumber',
    hidden: true,
    value: -1, // when create photo, set default value to -1, actually value will be set in backend function
    colProps: {
      span: 24
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
      action: `${API_URL}/uploadHotelPhoto`,
      // fileList: [
      //   {
      //     name: 'element-plus-logo.svg',
      //     url: 'https://element-plus.org/images/element-plus-logo.svg'
      //   }
      // ],
      headers: {
        'Cache-Control': 'public, max-age=3153600'
        // 'Content-Type': 'multipart/form-data' // 'multipart/form-data' contentent-type will set automaticly
      },
      data: { hotelId: currentHotelId },
      multiple: true,
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
        tip: () => <div class="el-upload__tip">只允許 jpg/png 類型檔案,大小限制為 1MB 以內。</div>
      }
    }
  },
  {
    field: 'title',
    label: '標題',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'subtitle',
    label: '副標題',
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  sequence: [required()],
  status: [required()],
  name: [required()],
  price: [required()]
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
    if (!currentRow) return
    imageUrl.value = currentRow.url
    setValues(currentRow)
    setSchema([
      {
        field: 'url',
        path: 'componentProps.fileList',
        value: [
          {
            name: 'photo',
            url: currentRow.url
          }
        ]
      }
    ])
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
