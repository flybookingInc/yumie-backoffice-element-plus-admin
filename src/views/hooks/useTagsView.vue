<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton } from 'element-plus'
import { useTagsView } from '@/hooks/web/useTagsView'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage, setTitle } =
  useTagsView()

const closeAllTabs = () => {
  closeAll(() => {
    push('/')
  })
}

const closeLeftTabs = () => {
  closeLeft()
}

const closeRightTabs = () => {
  closeRight()
}

const closeOtherTabs = () => {
  closeOther()
}

const refresh = () => {
  refreshPage()
}

const closeCurrentTab = () => {
  closeCurrent(undefined, () => {
    push('/')
  })
}

const setTabTitle = () => {
  setTitle(new Date().getTime().toString())
}

const setAnalysisTitle = () => {
  setTitle(`訂單-${new Date().getTime().toString()}`, '/reservations/list')
}
</script>

<template>
  <ContentWrap title="useTagsView">
    <ElButton type="primary" @click="closeAllTabs"> 關閉所有標籤頁 </ElButton>
    <ElButton type="primary" @click="closeLeftTabs"> 關閉左側標籤頁 </ElButton>
    <ElButton type="primary" @click="closeRightTabs"> 關閉右側標籤頁 </ElButton>
    <ElButton type="primary" @click="closeOtherTabs"> 關閉其他標籤頁 </ElButton>
    <ElButton type="primary" @click="closeCurrentTab"> 關閉當前標籤頁 </ElButton>
    <ElButton type="primary" @click="refresh"> 刷新當前標籤頁 </ElButton>
    <ElButton type="primary" @click="setTabTitle"> 修改當前標題 </ElButton>
    <ElButton type="primary" @click="setAnalysisTitle"> 修改分析頁標題 </ElButton>
  </ContentWrap>
</template>
