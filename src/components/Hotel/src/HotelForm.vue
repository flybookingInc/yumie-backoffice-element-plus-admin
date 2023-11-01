<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { RowData } from '@/components/Hotel/src/types'
import { Hotel } from '@/types/hotel'
import { useApiStore } from '@/store/modules/api'
import { ElMessage } from 'element-plus'

const { required } = useValidator()
const { getHotel, updateHotel, createHotel } = useApiStore()

interface Props {
  hotelId?: string
}

const props = defineProps<Props>()

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

let hotelData: Nullable<Hotel> = null
let formMode: string = '新增'

const schema = reactive<FormSchema[]>([
  {
    field: 'hotelId',
    label: 'Hotel ID',
    component: 'Input',
    hidden: formMode === '新增' ? false : true,
    colProps: {
      span: 24
    }
  },
  {
    field: 'hotelName',
    label: '名稱',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'hotelPhone',
    label: '聯絡電話',
    component: 'Input',
    colProps: {
      span: 12
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'notifyEmail',
    label: '訂單通知Email',
    colProps: {
      span: 12
    },
    component: 'Input',
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'hotelAddress',
    label: '地址',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'hotelDirection',
    label: 'Google Map網址',
    colProps: {
      span: 12
    },
    component: 'Input',
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'googleTagManager',
    label: 'Google Tag Manager ID',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'message',
    label: '凸顯訊息',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'fullyBookShowingMessage',
    label: '全部關房顯示訊息',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'footerMessage',
    label: '頁尾顯示訊息',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'confirmScreenFooterMessage',
    label: '預訂完成頁尾訊息',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'hotelShortDescription',
    label: 'Google搜尋要顯示的標題',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'hotelDescription',
    label: 'Google搜尋要顯示的內文',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'weekend',
    label: '星期幾為周末',
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
    field: 'parking',
    label: '停車位',
    component: 'Divider'
  },
  {
    field: 'parkingEnable',
    label: '停車位揭露',
    componentProps: {
      activeText: '啟用',
      inactivateText: '停用',
      inlinePrompt: true
    },
    component: 'Switch',
    colProps: {
      span: 24
    }
  },
  {
    field: 'hasEmptyParkingLot',
    label: '目前有停車位',
    componentProps: {
      activeText: '目前有停車位',
      inactivateText: '目前無停車位',
      inlinePrompt: true
    },
    component: 'Switch',
    colProps: {
      span: 24
    }
  },
  {
    field: 'parkingEmptyMessage',
    label: '有空停車位顯示訊息',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'parkingFullMessage',
    label: '無空停車位顯示訊息',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'wise',
    label: '靈知串接',
    component: 'Divider'
  },
  {
    field: 'wisePmsApiEnable',
    label: '靈知PMS自動進單',
    componentProps: {
      activeText: '啟用',
      inactivateText: '停用',
      inlinePrompt: true
    },
    component: 'Switch',
    colProps: {
      span: 24
    }
  },
  {
    field: 'wisePmsApiHotelCode',
    label: '靈知旅館代碼',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'wisePmsApiFailAlertEmail',
    label: '自動進單失敗警告信Email',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'flykiosk',
    label: 'FlyKiosk串接',
    component: 'Divider'
  },
  {
    field: 'flyKioskApiEnable',
    label: 'FlyKiosk自動進單',
    componentProps: {
      activeText: '啟用',
      inactivateText: '停用',
      inlinePrompt: true
    },
    component: 'Switch',
    colProps: {
      span: 24
    }
  },
  {
    field: 'flyKioskApiHotelCode',
    label: 'FlyKiosk旅館代碼',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'flyKioskApiFailAlertEmail',
    label: '自動進單失敗警告信Email',
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

const updateFormDataToHotelData = (data: RowData) => {
  if (!hotelData) return
  hotelData.hotelName = data.hotelName
  hotelData.hotelAddress = data.hotelAddress
  hotelData.hotelPhone = data.hotelPhone
  hotelData.notifyEmail = data.notifyEmail
  hotelData.hotelDirection = data.hotelDirection
  hotelData.googleTagManager.id = data.googleTagManager
  hotelData.message = data.message
  hotelData.fullyBookShowingMessage = data.fullyBookShowingMessage
  hotelData.footerMessage = data.footerMessage
  hotelData.confirmScreenFooterMessage = data.confirmScreenFooterMessage
  hotelData.hotelShortDescription = data.hotelShortDescription
  hotelData.hotelDescription = data.hotelDescription
  hotelData.weekend = data.weekend
  hotelData.parking.enable = data.parkingEnable
  hotelData.parking.hasEmptyParkingLot = data.hasEmptyParkingLot
  hotelData.parking.emptyMessage = data.parkingEmptyMessage
  hotelData.parking.fullMessage = data.parkingFullMessage
  hotelData.wisePmsApi.enable = data.wisePmsApiEnable
  hotelData.wisePmsApi.HotelCode = data.wisePmsApiHotelCode
  hotelData.wisePmsApi.failAlertEmail = data.wisePmsApiFailAlertEmail
  hotelData.flyKioskApi.enabled = data.flyKioskApiEnable
  hotelData.flyKioskApi.hotelCode = data.flyKioskApiHotelCode
  hotelData.flyKioskApi.failAlertEmail = data.flyKioskApiFailAlertEmail
}

const submit = async () => {
  try {
    const elForm = await getElFormExpose()
    const valid = await elForm?.validate().catch((err) => {
      console.log(err)
    })
    if (valid) {
      if (formMode === '新增') {
        const data = (await getFormData()) as Hotel // force convert to Hotel DataType
        const res = await createHotel({ hotelId: data.hotelId, hotelData: data })
        if (res.status !== 200) {
          ElMessage.error('新增失敗: ' + res.data?.message ?? '')
        }
        ElMessage.success('新增成功')
      } else {
        if (!props.hotelId || !hotelData) return
        const data = (await getFormData()) as RowData
        updateFormDataToHotelData(data)

        // update DB
        const res = await updateHotel({ hotelId: props.hotelId, hotelData: hotelData })
        if (res.status !== 200) {
          ElMessage.error('儲存失敗: ' + res.data?.message ?? '')
        }
        ElMessage.success('儲存成功')
      }
    }
  } catch (err) {
    console.log(err)
    ElMessage.success('儲存失敗: ' + (err as unknown as Error).message ?? '')
  }
}

watch(
  () => props.hotelId,
  async (hotelId) => {
    if (!hotelId) return
    formMode = '修改'
    const res = await getHotel(hotelId)

    if (res.status !== 200 && res.data) {
      return
    }
    hotelData = res.data as Hotel

    const formData: RowData = {
      hotelId: hotelId,
      hotelName: hotelData?.hotelName ?? '',
      hotelAddress: hotelData?.hotelAddress ?? '',
      hotelPhone: hotelData?.hotelPhone ?? '',
      notifyEmail: hotelData?.notifyEmail ?? '',
      hotelDirection: hotelData?.hotelDirection ?? '',
      googleTagManager: hotelData?.googleTagManager?.id ?? '',
      message: hotelData?.message ?? '',
      fullyBookShowingMessage: hotelData?.fullyBookShowingMessage ?? '',
      footerMessage: hotelData?.footerMessage ?? '',
      confirmScreenFooterMessage: hotelData?.confirmScreenFooterMessage ?? '',
      hotelShortDescription: hotelData?.hotelShortDescription ?? '',
      hotelDescription: hotelData?.hotelDescription ?? '',
      // weekend: weekendOptions.length > 0 ? weekendOptions : [],
      weekend: hotelData?.weekend ?? [],
      parkingEnable: hotelData?.parking?.enable ?? false,
      hasEmptyParkingLot: hotelData?.parking?.hasEmptyParkingLot ?? false,
      parkingEmptyMessage: hotelData?.parking?.emptyMessage ?? '',
      parkingFullMessage: hotelData?.parking?.fullMessage ?? '',
      wisePmsApiEnable: hotelData?.wisePmsApi?.enable ?? false,
      wisePmsApiHotelCode: hotelData?.wisePmsApi?.HotelCode ?? '',
      wisePmsApiFailAlertEmail: hotelData?.wisePmsApi?.failAlertEmail ?? '',
      flyKioskApiEnable: hotelData?.flyKioskApi?.enabled ?? false,
      flyKioskApiHotelCode: hotelData?.flyKioskApi?.hotelCode ?? '',
      flyKioskApiFailAlertEmail: hotelData?.flyKioskApi?.failAlertEmail ?? ''
    }
    console.log('formData=', formData)
    setValues(formData)
    // setSchema([
    //   {
    //     field: 'coverPhoto',
    //     path: 'componentProps.fileList',
    //     value: [
    //       {
    //         name: 'photo',
    //         url: formData.coverPhoto
    //       }
    //     ]
    //   }
    // ])
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
