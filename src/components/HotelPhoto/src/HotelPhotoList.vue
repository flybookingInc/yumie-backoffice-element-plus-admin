<template>
  <ContentWrap :title="t('router.views.settings.hotelPhoto.title')">
    <template #header>
      <el-row>
        <el-col :span="12" class="flex inline-flex justify-start p-2">
          <el-button class="primary" @click="addAction"> 新增圖片 </el-button>
        </el-col>
      </el-row>
    </template>
    <Table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :preview="['url']"
      :pageSize="10000"
      :fixed="true"
      :defaultSort="{ prop: 'photoId', order: 'ascending' }"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElRow, ElCol, ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from '@/hooks/web/useI18n'
import { useUserStore } from '@/store/modules/user'
import { useApiStore } from '@/store/modules/api'
import { HotelPhotoListRowData } from './types'
import { useRouter } from 'vue-router'
import { CoverPhoto } from '@/types/hotel'
import { HotelPhotoItem } from '@/store/modules/types/api'
import { useEmitt } from '@/hooks/event/useEmitt'

const { push } = useRouter()
const { currentHotelId } = storeToRefs(useUserStore()) // use storeToRef to keep property reactive
const { getHotelPhotos, deleteHotelPhoto } = useApiStore()
const { t } = useI18n()
const tableRef = ref<typeof Table>()
const loading = ref(false)
const tableData = reactive<HotelPhotoListRowData[]>([])

const columns: TableColumn[] = [
  {
    field: 'photoId',
    label: 'ID',
    hidden: true
  },
  {
    field: 'sequence',
    label: '輪播順序',
    width: '50px'
  },
  {
    field: 'url',
    label: '輪播圖片'
  },
  {
    field: 'title',
    label: '標題'
  },
  {
    field: 'subtitle',
    label: '副標題'
  },
  {
    field: 'actions',
    label: '動作',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <div>
            <ElButton type="primary" onClick={() => updateAction(data.row)}>
              編輯
            </ElButton>
            <ElButton class="primary" onClick={() => deleteAction(data.row)}>
              刪除
            </ElButton>
          </div>
        )
      }
    }
  }
]

// get table list data
const getList = async (currentHotelId: string) => {
  loading.value = true
  try {
    if (!currentHotelId) return
    const response = await getHotelPhotos({ hotelId: currentHotelId })
    if (response.status !== 200 || !response.data) return
    const coverPhotos = response.data as CoverPhoto[]
    coverPhotos.forEach((photo, index) => {
      tableData.push({
        photoId: index,
        sequence: index,
        title: photo.title,
        subtitle: photo.subtitle,
        url: photo.url
      })
    })
  } catch (err) {
    console.log(err)
    ElMessage.error('取得旅館列表失敗')
  } finally {
    loading.value = false
  }
}

if (currentHotelId.value) {
  getList(currentHotelId.value)
}

useEmitt({
  name: 'getList',
  callback: (_type: string) => {
    if (!currentHotelId.value) {
      tableData.splice(0, tableData.length)
      ElMessage.warning('請先選擇旅館')
      return
    }
    getList(currentHotelId.value)
  }
})

watch(currentHotelId, async (hotelId) => {
  if (!hotelId) return
  await getList(hotelId)
})

const addAction = () => {
  push('/settings/hotel-photo-add')
}

const updateAction = (row: HotelPhotoListRowData) => {
  push(`/settings/hotel-photo-update?photoId=${row.photoId}`)
}

const deleteAction = async (row: HotelPhotoListRowData) => {
  const deletePhoto: HotelPhotoItem = {
    sequence: row.sequence,
    title: row.title,
    subtitle: row.subtitle,
    url: row.url
  }
  try {
    ElMessageBox.confirm('確定要刪除嗎?', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      if (!currentHotelId.value) return
      await deleteHotelPhoto({ hotelId: currentHotelId.value, photo: deletePhoto })
      ElMessage.success('刪除成功')
    })
  } catch (err) {
    ElMessage.error('刪除失敗')
  }
}
</script>
