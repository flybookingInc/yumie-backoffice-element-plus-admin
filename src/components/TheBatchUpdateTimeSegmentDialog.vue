<template>
  <div>
    <el-dialog v-model="isVisible" :fullscreen="true" id="timeSegmentDialog">
      <el-row class="m-4">
        <el-col :span="24">
          <span>※僅更新有選取的專案</span>
          <el-select-v2
            v-model="selectedPlans"
            :options="options"
            multiple
            size="large"
            class="w-full mt-2"
          />
        </el-col>
      </el-row>
      <el-row class="m-4">
        <el-col :span="24">
          <div class="flex gap-2">
            <el-button type="primary" @click="disableAll">全部關閉</el-button>
            <el-button type="primary" @click="enableAll">全部開啟</el-button>
            <el-button type="primary" @click="resetAll">全不變更</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row justify="space-around">
        <el-col :span="12">
          <el-row justify="center">
            <el-col :span="24" v-for="(timeSegment, index) in TIME_SEGMENTS" :key="index">
              <div v-if="index < props.maxRow">
                <span class="text-lg m-4">{{ timeSegment }}</span>
                <el-radio-group
                  v-model="availability[timeSegment]"
                  :label="timeSegment"
                  size="large"
                >
                  <el-radio label="0" :border="true">不可預定</el-radio>
                  <el-radio label="1" :border="true">可預訂</el-radio>
                  <el-radio label="-1" :border="true">不變更</el-radio>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row justify="center">
            <el-col :span="24" v-for="(timeSegment, index) in TIME_SEGMENTS" :key="index">
              <div v-if="index >= props.maxRow">
                <span class="text-lg m-4">{{ timeSegment }}</span>
                <el-radio-group
                  v-model="availability[timeSegment]"
                  :label="timeSegment"
                  size="large"
                >
                  <el-radio label="0" :border="true">不可預定</el-radio>
                  <el-radio label="1" :border="true">可預訂</el-radio>
                  <el-radio label="-1" :border="true">不變更</el-radio>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <fixed-conner-items-vue @save="savePlans" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plan } from '@/types/hotel'
import { ElDialog, ElSelectV2, ElButton, ElRow, ElCol, ElRadioGroup, ElRadio } from 'element-plus'
import { ref, computed } from 'vue'
import { TIME_SEGMENTS } from '@/config/constants'
import FixedConnerItemsVue from './FixedConnerItems.vue'
import { useUserStore } from '@/store/modules/user'
import Swal from 'sweetalert2'

const { batchUpdatePlanAvailability, savePlansToDb } = useUserStore()

interface Props {
  isVisible: boolean
  maxRow?: number
  plans: Nullable<{ [key: string]: Plan }>
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
  maxRow: 24,
  plans: null
})

// dialog emit
const emits = defineEmits<{
  'update:isVisible': [value: boolean]
}>()

const isVisible = computed({
  get: () => props.isVisible,
  set: (value) => emits('update:isVisible', value)
})

// init availability
const initAvailability = () => {
  const result: { [key: string]: string } = {}
  for (const key of TIME_SEGMENTS) {
    result[key] = '-1'
  }
  return result
}
const availability = ref<{ [key: string]: string }>(initAvailability())

const getSelectOptions = () => {
  if (!props.plans) return []
  const keys = Object.keys(props.plans)
  const options = keys.map((key) => {
    return {
      value: key,
      label: props.plans?.[key].planName || ''
    }
  })
  return options
}

const disableAll = () => {
  for (const key of TIME_SEGMENTS) {
    availability.value[key] = '0'
  }
}

const enableAll = () => {
  for (const key of TIME_SEGMENTS) {
    availability.value[key] = '1'
  }
}

const resetAll = () => {
  for (const key of TIME_SEGMENTS) {
    availability.value[key] = '-1'
  }
}

const savePlans = async () => {
  if (!selectedPlans.value.length) {
    Swal.fire({
      icon: 'error',
      title: '請選擇專案',
      showConfirmButton: true,
      timer: 1500,
      target: document.getElementById('timeSegmentDialog')
    })
    return
  }
  batchUpdatePlanAvailability(selectedPlans.value, availability.value)
  await savePlansToDb()
  Swal.fire({
    icon: 'success',
    title: '儲存成功',
    showConfirmButton: false,
    timer: 1500,
    target: document.getElementById('timeSegmentDialog')
  }).then(() => {
    isVisible.value = false
  })
}

const selectedPlans = ref<string[]>(Object.keys(props.plans || {}))
const options = ref<{ value: string; label: string }[]>(getSelectOptions())
</script>
