<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch } from 'vue'
import { RowData } from './types'
import { useValidator } from '@/hooks/web/useValidator'
import { ElMessage, ElMessageBox, ElButton } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { getFirestore, collection, doc } from 'firebase/firestore'
import { useApiStore } from '@/store/modules/api'
import type { CreateExtrasItemRequest } from '@/store/modules/types/api'

const { required } = useValidator()
const { currentHotelId } = useUserStore()
const { updateExtrasItem } = useApiStore()

interface Props {
  currentRow: Nullable<RowData>
}

const props = withDefaults(defineProps<Props>(), {
  currentRow: null
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

const itemId = '' //doc(collection(getFirestore(), 'qk-list')).id // pre-generate a item ID here
const API_URL = import.meta.env.VITE_API_URL as string

let formMode: string = '新增'

const schema = reactive<FormSchema[]>([
  {
    field: 'sequence',
    label: '順序',
    component: 'InputNumber',
    componentProps: {
      placeholder: '數字越小排序越前面'
    },
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'status',
    label: '狀態',
    component: 'SelectV2',
    colProps: {
      span: 12
    },
    componentProps: {
      options: [
        { label: '啟用', value: true },
        { label: '停用', value: false }
      ],
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'name',
    label: '名稱',
    colProps: {
      span: 12
    },
    component: 'Input',
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'description',
    label: '描述',
    component: 'Input'
  },
  {
    field: 'price',
    label: '價格',
    colProps: {
      span: 12
    },
    component: 'InputNumber',
    value: 0,
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'coverPhoto',
    label: '圖片',
    component: 'Upload',
    colProps: {
      span: 24
    },
    componentProps: {
      limit: 1,
      action: `${API_URL}/addExtrasItemPhoto`,
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
      data: { hotelId: currentHotelId, itemId: itemId },
      multiple: false,
      onSuccess: async (_response, uploadFile) => {
        const formData = await getFormData()
        formData.coverPhoto = uploadFile.response.file
        await setValues(formData)
      },
      onRemove: (file) => {
        console.log(file)
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
        default: () => <ElButton type="primary">上傳</ElButton>,
        tip: () => <div class="el-upload__tip">只允許 jpg/png 類型檔案,大小限制為 1MB 以內。</div>
      }
    }
  },
  {
    field: 'id',
    label: '商品ID',
    component: 'Input',
    hidden: true,
    colProps: {
      span: 12
    }
  }
])

const rules = reactive({
  sequence: [required()],
  status: [required()],
  name: [required()],
  price: [required()]
})

const submit = async (): Promise<boolean> => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()

    try {
      const sendData: CreateExtrasItemRequest = {
        hotelId: currentHotelId || '',
        itemId: formData.id ?? doc(collection(getFirestore(), 'qk-list')).id, // create item id if empty
        extraName: formData.name,
        extraDescription: formData.description,
        extraPrice: formData.price,
        extraImagePath: formData.coverPhoto,
        enable: formData.status,
        order: formData.sequence
      }
      const response = await updateExtrasItem(sendData)
      if (response.status === 200) {
        ElMessage.success(`${formMode}成功`)
        return true
      }
    } catch (error) {
      ElMessage.error(`${formMode}失敗：${(error as unknown as Error).message}`)
    }
  }
  return false
}

watch(
  () => props.currentRow,
  async (currentRow) => {
    if (!currentRow) return
    formMode = '修改'
    setValues(currentRow)
    setSchema([
      {
        field: 'coverPhoto',
        path: 'componentProps.fileList',
        value: [
          {
            name: 'photo',
            url: currentRow.coverPhoto
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
