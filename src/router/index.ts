import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/reservations',
    component: Layout,
    redirect: '/reservation/list',
    name: 'Reservations',
    meta: {
      title: t('router.views.reservations.title'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/Reservation/reservationsList.vue'),
        name: 'List',
        meta: {
          title: t('router.views.reservations.list.title'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'book',
        component: () => import('@/views/Reservation/reservationsBook.vue'),
        name: 'Book',
        meta: {
          title: t('router.views.reservations.book.title'),
          noCache: true
        }
      }
    ]
  },
  {
    path: '/inventory',
    component: Layout,
    redirect: '/inventory/timeSegmentSwitch',
    name: 'inventory',
    meta: {
      title: t('router.views.inventory.title'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'timeSegmentSwitch',
        component: () => import('@/views/Inventory/timeSegmentSwitch.vue'),
        name: 'TimeSegmentSwitch',
        meta: {
          title: t('router.views.inventory.time_segment_switch.title'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'stock',
        component: () => import('@/views/Inventory/stock.vue'),
        name: 'stock',
        meta: {
          title: t('router.views.inventory.stock.title'),
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/extras',
    component: Layout,
    redirect: '/extras/items',
    name: 'extras',
    meta: {
      title: t('router.views.extras.title'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'items',
        component: () => import('@/views/Extra/extrasItem.vue'),
        name: 'items',
        meta: {
          title: t('router.views.extras.extrasItem.title'),
          noCache: true,
          affix: true
        }
      },
      {
        path: '/extras/items-add',
        component: () => import('@/components/Extras/src/ExtrasItemAdd.vue'),
        name: 'ExtrasItemAdd',
        meta: {
          hidden: true,
          title: '新增商品',
          noTagsView: true
        }
      },
      {
        path: '/extras/items-update',
        component: () => import('@/components/Extras/src/ExtrasItemUpdate.vue'),
        name: 'ExtrasItemUpdate',
        meta: {
          hidden: true,
          title: '編輯商品',
          noTagsView: true
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/hotel',
    name: 'settings',
    meta: {
      title: t('router.views.settings.title'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      //     {
      //       path: 'roomType',
      //       component: () => import('@/views/extrasItem.vue'),
      //       name: 'roomType',
      //       meta: {
      //         title: t('router.views.settings.roomType.title'),
      //         noCache: true,
      //         affix: true
      //       }
      //     },
      //     {
      //       path: 'plan',
      //       component: () => import('@/views/extrasItem.vue'),
      //       name: 'plan',
      //       meta: {
      //         title: t('router.views.settings.plan.title'),
      //         noCache: true,
      //         affix: true
      //       }
      //     },
      {
        path: 'hotel',
        component: () => import('@/views/Setting/hotel.vue'),
        name: 'hotel',
        meta: {
          title: t('router.views.settings.hotel.title'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'hotel-photo-list',
        component: () => import('@/views/Setting/hotelPhoto.vue'),
        name: 'hotelPhoto',
        meta: {
          title: t('router.views.settings.hotelPhoto.title'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'hotel-add',
        component: () => import('@/components/Hotel/src/HotelAdd.vue'),
        name: 'hotelAdd',
        meta: {
          hidden: true,
          title: '新增旅館',
          noTagsView: true
        }
      },
      {
        path: 'hotel-update',
        component: () => import('@/components/Hotel/src/HotelUpdate.vue'),
        name: 'hotelUpdate',
        meta: {
          hidden: true,
          title: '編輯旅館',
          noTagsView: true
        }
      },
      {
        path: 'hotel-photo-update',
        component: () => import('@/components/HotelPhoto/src/HotelPhotoUpdate.vue'),
        name: 'hotelPhotoUpdate',
        meta: {
          hidden: true,
          title: '編輯旅館圖片',
          noTagsView: true
        }
      },
      {
        path: 'hotel-photo-add',
        component: () => import('@/components/HotelPhoto/src/HotelPhotoAdd.vue'),
        name: 'hotelPhotoAdd',
        meta: {
          hidden: true,
          title: '新增旅館圖片',
          noTagsView: true
        }
      }
      //     {
      //       path: 'account',
      //       component: () => import('@/views/extrasItem.vue'),
      //       name: 'account',
      //       meta: {
      //         title: t('router.views.settings.account.title'),
      //         noCache: true,
      //         affix: true
      //       }
      //     }
    ]
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: t('router.dashboard'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: t('router.analysis'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'workplace',
        component: () => import('@/views/Dashboard/Workplace.vue'),
        name: 'Workplace',
        meta: {
          title: t('router.workplace'),
          noCache: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
