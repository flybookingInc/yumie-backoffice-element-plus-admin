<template>
  <el-tag
    v-for="(tag, index) in props.tags"
    :key="index"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else size="small" :link="true" @click="showInput"> +新增 </el-button>
</template>

<script lang="ts" setup>
import { ElInput, ElTag, ElButton } from 'element-plus'
import { ref, nextTick, PropType } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  tags: {
    type: Array as PropType<string[]>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'addTag', id: string, tagText: string): void
  (e: 'removeTag', id: string, tagText: string): void
}>()

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
  emits('removeTag', props.id, tag)
  // dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value.trim() && props.tags.indexOf(inputValue.value) === -1) {
    emits('addTag', props.id, inputValue.value)
    // dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>
