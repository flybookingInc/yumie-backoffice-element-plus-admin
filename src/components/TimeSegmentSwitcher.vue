<template>
  <el-card class="box-card" shadow="never" :body-style="{ border: '0px' }">
    <template #header>
      <el-row>
        <el-col :span="24">
          <h2>{{ props.title }}</h2>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>
            <el-button type="primary" @click="allToggleOn">全部開啟</el-button>
            <el-button type="primary" @click="allToggleOff">全部關閉</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p>{{ props.description }}</p>
        </el-col>
      </el-row>
    </template>
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="24" v-for="(_isChecked, key, index) in availability" :key="index">
            <div v-if="index < props.maxRow">
              {{ key }}
              <el-switch
                v-model="availability[key]"
                @change="handleToggleChange(key as string)"
                class="ml-2"
                style="

--el-switch-on-color: #e8b945; --el-switch-off-color: #d9534f"
              />
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="24" v-for="(_isChecked, key, index) in availability" :key="index">
            <div v-if="index >= props.maxRow">
              {{ key }}
              <el-switch
                v-model="availability[key]"
                @change="handleToggleChange(key as string)"
                class="ml-2"
                style="

--el-switch-on-color: #e8b945; --el-switch-off-color: #d9534f"
              />
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { Plan } from '@/types/hotel'
import { ElCard, ElRow, ElCol, ElButton, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import { sortObjectByKey } from '@/utils/object'

interface Props {
  title: string
  description: string
  planId: string
  plan: Nullable<Plan>
  maxRow?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  planId: '',
  plan: null,
  maxRow: 48
})

const emits = defineEmits<{
  allAvailabilityChange: [planId: string, availability: { [key: string]: boolean }] // 具名元组语法
  singleAvailabilityChange: [planId: string, key: string, isChecked: boolean]
}>()

const availability = ref(sortObjectByKey(props.plan?.availability) || {})

// turn on all toggle in certainly element
const allToggleOn = () => {
  if (!props.plan) return
  const keys = Object.keys(availability.value)
  for (let key of keys) {
    availability.value[key] = true
  }
  emits('allAvailabilityChange', props.planId, availability.value)
}
// turn off all toggle in certainly element
const allToggleOff = () => {
  const keys = Object.keys(availability.value)
  for (let key of keys) {
    availability.value[key] = false
  }
  emits('allAvailabilityChange', props.planId, availability.value)
}

const handleToggleChange = (key: string) => {
  emits('singleAvailabilityChange', props.planId, key, availability.value[key])
}
</script>
