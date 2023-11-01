<template>
  <!-- Corner Button Start-->
  <div class="d-flex flex-row-reverse fixed-position-left-bottom" id="component-container">
    <div class="d-flex flex-column">
      <!-- <div class="d-flex flex-row-reverse mb-2">
        <el-button @click="goTop" class="btn btn-primary">TOP</el-button>
      </div> -->
      <div class="d-flex flex-row-reverse mb-2">
        <el-affix :offset="10" target="#component-container">
          <el-button @click="emits('save')" class="btn btn-primary">儲存</el-button>
        </el-affix>
      </div>
    </div>
  </div>
  <!-- Corner Button End-->
</template>

<script setup lang="ts">
import { ElButton, ElAffix } from 'element-plus'

const emits = defineEmits<{
  save: [] // 具名元组语法
}>()

// const goTop = () => {
//   window.scrollTo(0, 0)
// }
</script>

<style scoped>
.fixed-position-left-bottom {
  position: fixed;
  right: 2.5%;
  bottom: 5%;
  z-index: 5;
}
</style>
