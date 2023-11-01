<template>
  <content-wrap
    :title="t('router.views.reservations.book.title')"
    :message="t('router.views.reservations.book.description')"
  >
    <el-form :model="model" label-width="120px" @submit.prevent="makeReservation">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="日期">
            <el-date-picker
              v-model="model.checkinDate"
              type="date"
              placeholder="預約入住日期"
              :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="時間">
            <el-time-select
              v-model="model.selectedTime"
              start="00:00"
              step="00:30"
              end="23:30"
              placeholder="預約入住時間"
            />
            <!-- <el-select v-model="model.selectedTime" placeholder="預約入住時間">
              <el-option
                v-for="time in model.timeSelectOptions"
                :key="time"
                :label="time"
                :value="time"
              />
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方案">
            <el-select v-model="model.selectedPlanId">
              <el-option disabled value="">請選擇方案</el-option>
              <el-option
                v-for="plan in plans"
                :value="plan.key"
                :label="plan.planName"
                :key="plan.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入住者手機">
            <el-input v-model="model.phoneNumber" placeholder="入住者手機" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" native-type="submit">預約</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </content-wrap>
</template>

<script setup lang="ts">
import {
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElTimeSelect,
  ElOption,
  ElRow,
  ElCol
} from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, computed } from 'vue'
import dayjs from '@/utils/dayjs'
import { useReservationsStore } from '@/store/modules/reservations'
import { useUserStore } from '@/store/modules/user'
import { Plan } from '@/types/hotel'
import Swal from 'sweetalert2'
import { MakeOrderByAdminRequest } from '@/api/order/types'
import { sortBy } from 'lodash-es'

const { t } = useI18n()

const reservationStore = useReservationsStore()
const userStore = useUserStore()

interface Model {
  checkinDate: string
  selectedTime: string
  selectedPlanId: string
  phoneNumber: string
  timeSelectOptions: string[]
}

const model = reactive<Model>({
  checkinDate: '',
  selectedTime: '',
  selectedPlanId: '',
  phoneNumber: '',
  timeSelectOptions: []
})
const hotelData = computed(() => userStore?.hotelData)

const plans = computed(() => {
  const plansArray: (Plan & { key: string })[] = []
  for (let key in hotelData.value?.plans) {
    plansArray.push({ ...hotelData.value?.plans[key], key })
  }

  return sortBy(plansArray, 'sequence')
})

const makeReservation = async () => {
  let checkinDateTime = dayjs(
    dayjs(model.checkinDate).tz().format('YYYY-MM-DD') + model.selectedTime,
    'YYYY-MM-DDHHmm'
  ).tz()
  console.log('checkinDateTime', checkinDateTime.format('YYYY-MM-DD HH:mm'))
  console.log('dayjs().tz()', dayjs().tz().format('YYYY-MM-DD HH:mm'))
  console.log('checkinDateTime.isBefore(dayjs().tz())=', checkinDateTime.isBefore(dayjs().tz()))
  if (checkinDateTime.isBefore(dayjs().tz())) {
    Swal.fire({
      icon: 'error',
      title: '預約失敗',
      text: '不可預約過去時間'
    })
    return
  }
  let isWeek = !!reservationStore?.hotelData?.weekend.includes(checkinDateTime.day())

  const sendData: MakeOrderByAdminRequest = {
    hotelId: userStore.currentHotelId || 'test',
    check_in_datetime: checkinDateTime.toISOString(),
    check_in_time: checkinDateTime.format('HH:mm'),
    // plan_name: state.hotelData.plans[state.selectedPlanId].planName,
    plan_id: model.selectedPlanId,
    reserved_minutes: isWeek
      ? hotelData.value?.plans[model.selectedPlanId].weekendQkDuration || '0'
      : hotelData.value?.plans[model.selectedPlanId].weekQkDuration || '0',
    total_price: isWeek
      ? hotelData.value?.plans[model.selectedPlanId].weekendPrice || '9999'
      : hotelData.value?.plans[model.selectedPlanId].weekPrice || '9999',
    phoneNumber: '+886' + model.phoneNumber.trim(),
    bookingInterval: hotelData.value?.bookingInterval || 30
  }
  try {
    const result = await reservationStore.makeOrderByAdmin(sendData)
    Swal.fire({
      icon: 'success',
      title: '代碼：' + result.qkNumber,
      text: `預約日期：${result.checkinDatetime.slice(0, 10)}、
             預約時間：${result.check_in_time}、
             方案：${result.plan_name}、
             價格：NT${result.price}
                              `,
      showCloseButton: true
    })
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: `預約失敗: ${(e as unknown as Error).message}`
    })
  }
}

const disabledDate = (time: Date) => {
  return time.getTime() < dayjs().tz().subtract(1, 'day').valueOf()
}
</script>
