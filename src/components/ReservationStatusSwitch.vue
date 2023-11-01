<template>
  <div>
    <span v-if="props.status === '取消'">取消</span>
    <span v-else>
      <ElSwitch
        class="mb-2"
        v-model="value"
        style="

--el-switch-on-color: #e8b945"
        :active-text="props.activeText"
        :active-value="props.activeValue"
        :inactive-value="props.inactiveValue"
        :inactive-text="props.inactiveText"
        @change="handleChange"
      />
      <!-- @change="{handleSwitchChange.bind(this,"
        data)} -->
    </span>
  </div>
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { withDefaults, ref } from 'vue'

interface Props {
  activeText?: string
  inactiveText?: string
  activeValue?: string | number | boolean
  inactiveValue?: string | number | boolean
  status: string | number | boolean
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'handleSwitchChange', status: string | number | boolean): void
}>()

const handleChange = (value: string | number | boolean) => {
  console.log('switch change to: ', value)
  emits('handleSwitchChange', value)
}

const value = ref(props.status)
</script>
