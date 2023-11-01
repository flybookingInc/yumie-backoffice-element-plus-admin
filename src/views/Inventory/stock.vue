<template>
  <div>
    <div>
      <el-button type="primary" @click="ToggleBatchDialog">同步調整</el-button>
    </div>
    <div>
      <stock-editor ref="stockEditRef" />
    </div>

    <!-- Batch Stock Editor Dialog -->
    <el-dialog v-model="isBatchStckEditorDialogVisible" :fullscreen="true">
      <stock-batch-editor @batch-update-call-back="handleBatchUpdateCallBack" />
    </el-dialog>
    <!-- Batch Stock Editor Dialog End -->
  </div>
</template>

<script setup lang="ts">
import { StockEditor, StockBatchEditor } from '@/components/StockEditor'
import { ElButton, ElDialog } from 'element-plus'
import { ref } from 'vue'

const isBatchStckEditorDialogVisible = ref(false)
const stockEditRef = ref<InstanceType<typeof StockEditor>>()

const ToggleBatchDialog = () => {
  isBatchStckEditorDialogVisible.value = !isBatchStckEditorDialogVisible.value
}

const handleBatchUpdateCallBack = (isSuccess: boolean) => {
  if (isSuccess) {
    // reload table content
    stockEditRef.value?.loadTableContent()
    // close modal
    isBatchStckEditorDialogVisible.value = false
  }
}
</script>
