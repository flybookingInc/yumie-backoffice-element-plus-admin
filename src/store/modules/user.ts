import { defineStore } from 'pinia'
// import { store } from '@/store'
import { RoleEnum } from '@/enums/roleEnum'
import { resetRouter } from '@/router'
import { getCurrentUser } from '@/utils/firebase'
import {
  getFirestore,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  documentId,
  orderBy
} from 'firebase/firestore'
import { Hotel } from '@/types/hotel'
import { User, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useStorage } from '@/hooks/web/useStorage'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import dayjs from '@/utils/dayjs'
import request from '@/config/axios'
import { TableRowData } from '@/components/StockEditor/src/types'

export interface LoginParams {
  email: string
  password: string
}

/**
 * @description: Get user information return value
 */
export interface UserInfoModel {
  // 所屬旅館
  groups: string[]
  // 角色
  roles: RoleEnum[]
  // 用户id
  userId: string | number
  // 用户名
  username: string
  // 真實名字
  realName: string
  // 頭像
  avatar: string
  // 介紹
  desc?: string
}

export const useUserStore = defineStore('userStore', () => {
  // user info
  const userInfo = ref<Nullable<UserInfoModel>>(null)
  // current hotelId
  const currentHotelId = ref<Nullable<string>>(null)
  // hotel data
  const hotelData = ref<Nullable<Hotel>>(null)
  // token, this value will be the condition of login status
  const token = ref<Nullable<string>>(null)
  // Last fetch time
  const lastUpdateTime = ref<number>(0)
  // Unsubscribe function of hotel data
  const unSubscribeHotelData = ref<() => void>(() => {})

  const getCurrentHotelId = computed(() => {
    return currentHotelId.value || ''
  })
  const getToken = computed(() => {
    return token.value || null
  })
  const getLastUpdateTime = computed(() => {
    return lastUpdateTime
  })
  const setUserInfo = (info: UserInfoModel | null) => {
    userInfo.value = info
  }
  const setToken = (tokenValue: string | null) => {
    token.value = tokenValue // for null or undefined value
  }
  const setCurrentHotelId = (hotelId: string) => {
    if (!userInfo.value?.groups.includes(hotelId)) {
      throw new Error('無此飯店權限')
    }
    currentHotelId.value = hotelId
    // 讀取此飯店資料
    subscriptHotelData(hotelId)
  }
  const resetState = () => {
    userInfo.value = null
    currentHotelId.value = null
    hotelData.value = null
    token.value = null
  }
  /**
   * @description: login
   */
  const login = async (params: LoginParams): Promise<void> => {
    try {
      await signInWithEmailAndPassword(getAuth(), params.email, params.password)
      // const token = await UserCredential.user.getIdToken()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const afterLoginAction = async (): Promise<void> => {
    console.log('execute after login action')
    const appStore = useAppStore()
    const { setStorage } = useStorage('localStorage')

    // get user info
    const userInfo = await getUserInfoAction()

    setStorage(appStore.getUserInfo, userInfo)
  }

  const getUserInfoAction = async (): Promise<UserInfoModel | null> => {
    const user = await getCurrentUser() // wait for firebase auth to get current user.
    if (!user) return null
    token.value = await user.getIdToken()
    const userInfo = await getUserInfo(user)
    setUserInfo(userInfo)
    if (userInfo.groups.length > 0 && !currentHotelId.value) {
      setCurrentHotelId(userInfo.groups[0])
    }
    return userInfo
  }

  /**
   * @description: Get user information and save to store
   */
  const getUserInfo = async (user: User): Promise<UserInfoModel> => {
    const idTokenResult = await user.getIdTokenResult()
    if (!idTokenResult) {
      console.log('user not login')
      throw new Error('user not login')
    }
    setToken(idTokenResult.token)
    const userInfo: UserInfoModel = {
      groups: [...(idTokenResult.claims.hotelGroup as string[])],
      roles: [idTokenResult.claims.rule as RoleEnum],
      userId: user.uid as string,
      username: user.email as string,
      realName: user.displayName as string,
      avatar: ''
    }
    return userInfo
  }
  // 獲取角色信息
  // const getRole = async() => {
  //   const formData = await getFormData<UserType>()
  //   const params = {
  //     roleName: formData.email
  //   }
  //   const res =
  //     appStore.getDynamicRouter && appStore.getServerDynamicRouter
  //       ? await getAdminRoleApi(params)
  //       : await getTestRoleApi(params)
  //   if (res) {
  //     const routers = res.data || []
  //     setStorage('roleRouters', routers)
  //     appStore.getDynamicRouter && appStore.getServerDynamicRouter
  //       ? await permissionStore.generateRoutes('server', routers).catch(() => {})
  //       : await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})

  //     permissionStore.getAddRouters.forEach((route) => {
  //       addRoute(route as RouteRecordRaw) // 動態添加可訪問路由表
  //     })
  //     permissionStore.setIsAddRouters(true)
  //     push({ path: redirect.value || permissionStore.addRouters[0].path })
  //   }
  // }
  /**
   * @description: logout
   */
  const logout = async () => {
    const { clear } = useStorage('localStorage')
    const tagsViewStore = useTagsViewStore()
    const { replace } = useRouter()
    if (getToken.value) {
      try {
        await signOut(getAuth())
      } catch {
        console.log('註銷Token失敗')
      }
    }
    setToken(null)
    setUserInfo(null)
    clear()
    tagsViewStore.delAllViews()
    resetRouter() // 重置靜態路由表
    replace('/login')
  }

  // 設定firebase auth狀態改變時的處理函式，inject到 @/utils/firebase.ts setupOnAuthStateChanged 函數中
  const handleAuthStateChanged = async (user: User | null) => {
    console.log('injected auth state changed function excuted', user)
    afterLoginAction()
  }

  const subscriptHotelData = (hotelId: string) => {
    if (!hotelId || typeof hotelId !== 'string') {
      throw new Error('飯店ID錯誤')
    }
    unSubscribeHotelData.value() // unsubscript previous hotel data subscription
    // subscribe to hotel data
    unSubscribeHotelData.value = onSnapshot(
      doc(getFirestore(), 'qk-list', hotelId),
      (doc) => {
        hotelData.value = doc.data() as Hotel
      },
      (error) => {
        console.log(error)
      }
    )
  }

  // update plan availability by planId and availability object
  const updatePlanAvailability = (planId: string, availability: { [key: string]: boolean }) => {
    if (!hotelData.value) {
      throw new Error('飯店資料尚未讀取')
    }
    if (!hotelData.value.plans[planId]) {
      throw new Error('無此方案')
    }
    // update plan availability if key equal to input availability key
    Object.keys(availability).forEach((key) => {
      if (hotelData.value?.plans[planId].availability[key] !== undefined) {
        hotelData.value!.plans[planId].availability[key] = availability[key]
      }
    })
    lastUpdateTime.value = Date.now()
  }

  // update plan availability by planIds and availability object
  const batchUpdatePlanAvailability = (
    planIds: string[],
    availability: { [key: string]: string }
  ) => {
    if (!hotelData.value) {
      throw new Error('飯店資料尚未讀取')
    }
    if (planIds.length === 0) {
      throw new Error('請選擇至少一個專案')
    }
    planIds.forEach((planId) => {
      if (!hotelData.value!.plans[planId]) {
        throw new Error('無此方案')
      }
    })
    const availabilityTransform: { [key: string]: boolean } = {}
    for (const key in availability) {
      if (availability[key] === '0' || availability[key] === '1') {
        availabilityTransform[key] = availability[key] ? true : false
      }
    }
    // update plan availability if key equal to input availability key
    planIds.forEach((planId) => {
      updatePlanAvailability(planId, availabilityTransform)
    })
  }

  // update availability to db
  const updateInventoryToDb = async (
    startDay: dayjs.Dayjs,
    endDay: dayjs.Dayjs,
    inventoryData: TableRowData[]
  ): Promise<boolean> => {
    try {
      console.log('send data', {
        hotelId: currentHotelId.value,
        InventoryData: inventoryData,
        startOfDay: startDay.toISOString(),
        endOfDay: endDay.toISOString()
      })
      const response = await request.put({
        url: '/updateInventory',
        data: {
          hotelId: currentHotelId.value,
          inventoryData: inventoryData,
          startOfDay: startDay.toISOString(),
          endOfDay: endDay.toISOString()
        }
      })
      if (response.status === 200 && response.data?.status === 0) {
        return true
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const savePlansToDb = async () => {
    try {
      const docRef = doc(getFirestore(), `qk-list/${currentHotelId.value}`)
      await updateDoc(docRef, { plans: hotelData.value?.plans })
      Swal.fire({
        icon: 'success',
        title: '更新成功'
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: '更新失敗'
      })
    }
  }

  /**
   * Batch update inventory by specific room type and date range and day of week.
   * @param roomTypesId The room type id array
   * @param startDate The start date of the range
   * @param endDate The end date of the range
   * @param bookingInterval The booking interval array of each room type
   * @param applyDayofWeek The days of week to apply batch update
   * @param applyTimeAndInventory  The timeField of inventory objsect to apply batch update
   * @returns AxiosResponse
   * @throws Error
   */
  const batchUpdateInventory = async (data: {
    roomTypesId: string[]
    startDate: dayjs.Dayjs
    endDate: dayjs.Dayjs
    bookingInterval: number
    applyDayofWeek: number[]
    applyTimeAndInventory: { [key: string]: number }
  }) => {
    const {
      roomTypesId,
      startDate,
      endDate,
      bookingInterval,
      applyDayofWeek,
      applyTimeAndInventory
    } = data
    return await request.put({
      url: '/batchUpdateInventory',
      data: {
        hotelId: currentHotelId.value,
        roomTypesId: roomTypesId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        bookingInterval: bookingInterval,
        applyDayofWeek: applyDayofWeek,
        applyTimeAndInventory: applyTimeAndInventory
      }
    })
  }

  /**
   * Sync inventory to hotel doc
   * @param sourceRoomTypes The room types id to sync to hotel doc
   * @returns AxiosResponse
   * @throws Error
   */
  const syncInventoryToHotelDoc = async (data: { sourceRoomTypes: string[] }) => {
    const { sourceRoomTypes } = data
    return await request.put({
      url: '/syncInventoryToHotelDoc',
      data: {
        hotelId: currentHotelId.value,
        sourceRoomTypes: sourceRoomTypes
      }
    })
  }

  const getRoomTypeInventoryByRangeDate = async (
    roomTypeId: string,
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
  ) => {
    const collectionRef = collection(
      getFirestore(),
      `qk-list/${currentHotelId.value}/roomType/${roomTypeId}/inventory`
    )
    const documentIdField = documentId()
    const q = query(
      collectionRef,
      where(documentIdField, '>=', startDate.format('YYYYMMDD')),
      where(documentIdField, '<=', endDate.format('YYYYMMDD')),
      orderBy(documentIdField, 'asc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot
  }

  const getRoomTypesData = async () => {
    const collectionRef = collection(getFirestore(), `qk-list/${currentHotelId.value}/roomType`)
    const q = query(collectionRef, orderBy('RoomTypeName', 'asc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot
  }

  return {
    userInfo,
    currentHotelId,
    hotelData,
    token,
    lastUpdateTime,
    unSubscribeHotelData,
    getCurrentHotelId,
    getToken,
    getLastUpdateTime,
    setUserInfo,
    setToken,
    setCurrentHotelId,
    resetState,
    login,
    afterLoginAction,
    getUserInfo,
    getUserInfoAction,
    logout,
    handleAuthStateChanged,
    subscriptHotelData,
    updatePlanAvailability,
    batchUpdatePlanAvailability,
    savePlansToDb,
    getRoomTypeInventoryByRangeDate,
    getRoomTypesData,
    updateInventoryToDb,
    batchUpdateInventory,
    syncInventoryToHotelDoc
  }
})
