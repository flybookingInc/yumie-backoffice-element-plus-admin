<template>
  <content-wrap :title="t('router.views.inventory.time_segment_switch.title')">
    <template #header>
      <el-row>
        <el-col :span="24" class="flex inline-flex justify-end p-2">
          <el-button type="primary" @click="showSyncDialog"> 同步調整 </el-button>
        </el-col>
      </el-row>
    </template>
    <el-tabs v-model="activeTabName" type="card" class="demo-tabs" @tab-click="() => {}">
      <el-tab-pane label="全部" name="all">
        <el-row>
          <el-col :span="6" v-for="(plan, key) in plans" :key="key">
            <time-segment-switch
              :title="plan.planName"
              description="休息時段 (黃色為可預定、紅色為不可預定)"
              :planId="key.toString()"
              :plan="plan"
              :maxRow="24"
              @all-availability-change="handleAllAvailabilityChange"
              @single-availability-change="handleSingleAvailabilityChange"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-for="(plan, key) in plans" :key="key" :label="plan.planName" :name="key">
        <el-row>
          <el-col :span="6">
            <time-segment-switch
              :title="plan.planName"
              description="休息時段 (黃色為可預定、紅色為不可預定)"
              :planId="key.toString()"
              :plan="plan"
              @all-availability-change="handleAllAvailabilityChange"
              @single-availability-change="handleSingleAvailabilityChange"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <fix-conner-items @save="savePlans" />
    <the-batch-update-time-segment-dialog
      v-model:isVisible="batchUpdateDialogVisible"
      :plans="plans"
      :maxRow="24"
    />
  </content-wrap>
</template>
<script setup lang="ts">
import TimeSegmentSwitch from '@/components/TimeSegmentSwitcher.vue'
import TheBatchUpdateTimeSegmentDialog from '@/components/TheBatchUpdateTimeSegmentDialog.vue'
import FixConnerItems from '@/components/FixedConnerItems.vue'
import { ElRow, ElCol, ElTabs, ElTabPane, ElButton } from 'element-plus'
import { sortByObjectObjectFieldValue } from '@/utils/object'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { useUserStore } from '@/store/modules/user'
import { Plan } from '@/types/hotel'
import { ref } from 'vue'

const { t } = useI18n()

const userStore = useUserStore()
const activeTabName = ref('all') // default active tab 'all'
const batchUpdateDialogVisible = ref(false)

// sort plans by plan's sequence field value
const getSortedPlans = () => {
  try {
    return sortByObjectObjectFieldValue(userStore.hotelData?.plans || {}, 'sequence') as {
      [key: string]: Plan
    }
  } catch (e) {
    console.log(e)
    return userStore.hotelData?.plans || {}
  }
}
const plans = ref<{
  [key: string]: Plan
}>(getSortedPlans())

const handleAllAvailabilityChange = (planId: string, availability: { [key: string]: boolean }) => {
  userStore.updatePlanAvailability(planId, availability)
}

const handleSingleAvailabilityChange = (planId: string, key: string, isChecked: boolean) => {
  userStore.updatePlanAvailability(planId, { [key]: isChecked })
}

const savePlans = () => {
  userStore.savePlansToDb()
}

const showSyncDialog = () => {
  batchUpdateDialogVisible.value = true
}
</script>
