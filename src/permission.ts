import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useStorage } from '@/hooks/web/useStorage'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { getCurrentUser } from './utils/firebase'

const permissionStore = usePermissionStoreWithOut()

const appStore = useAppStoreWithOut()

const { getStorage } = useStorage()

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const whiteList = ['/login'] // 不重定向白名單

// router guard
router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  // if (getStorage(appStore.getUserInfo)) {
  if (await getCurrentUser()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }

      // 開發者可根據實際情況進行修改
      const roleRouters = getStorage('roleRouters') || []
      console.log('roleRouters', roleRouters)

      // 是否使用動態路由
      if (appStore.getDynamicRouter) {
        appStore.serverDynamicRouter
          ? await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])
          : await permissionStore.generateRoutes('frontEnd', roleRouters as string[])
      } else {
        await permissionStore.generateRoutes('static')
      }

      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 動態添加可訪問路由表
      })
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否則全部重定向到登錄頁
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 結束Progress
  loadDone()
})
