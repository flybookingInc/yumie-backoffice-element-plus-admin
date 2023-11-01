import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { ElMessage, ComponentSize } from 'element-plus'
import { useStorage } from '@/hooks/web/useStorage'

const { getStorage, setStorage } = useStorage()

interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  serverDynamicRouter: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  userInfo: string
  isDark: boolean
  currentSize: ComponentSize
  sizeMap: ComponentSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
  backTop: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      userInfo: 'yumie_backoffice', // 登錄信息存儲字段-建議每個項目換一個字段，避免與其它項目衝突
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // 是否是移動端
      title: import.meta.env.VITE_APP_TITLE, // 標題
      pageLoading: false, // 路由跳轉loading
      breadcrumb: true, // 麪包屑
      breadcrumbIcon: true, // 麪包屑圖標
      collapse: false, // 摺疊菜單
      uniqueOpened: false, // 是否只保持一個子菜單的展開
      hamburger: true, // 摺疊圖標
      screenfull: true, // 全屏圖標
      size: true, // 尺寸圖標
      locale: true, // 多語言圖標
      tagsView: true, // 標籤頁
      tagsViewIcon: true, // 是否顯示標籤圖標
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: true, // 顯示頁腳
      greyMode: false, // 是否開始灰色模式，用於特殊悼念日
      dynamicRouter: false, // getStorage('dynamicRouter'), // 是否動態路由
      serverDynamicRouter: false, // getStorage('serverDynamicRouter'), // 是否服務端渲染動態路由
      fixedMenu: true, // getStorage('fixedMenu'), // 是否固定菜單
      backTop: false, // 是否顯示返回頂部

      layout: getStorage('layout') || 'classic', // layout佈局
      isDark: getStorage('isDark'), // 是否是暗黑模式
      currentSize: getStorage('default') || 'default', // 組件尺寸
      theme: getStorage('theme') || {
        // 主題色
        elColorPrimary: '#409eff',
        // 左側菜單邊框顏色
        leftMenuBorderColor: 'inherit',
        // 左側菜單背景顏色
        leftMenuBgColor: '#001529',
        // 左側菜單淺色背景顏色
        leftMenuBgLightColor: '#0f2438',
        // 左側菜單選中背景顏色
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        // 左側菜單收起選中背景顏色
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // 左側菜單字體顏色
        leftMenuTextColor: '#bfcbd9',
        // 左側菜單選中字體顏色
        leftMenuTextActiveColor: '#fff',
        // logo字體顏色
        logoTitleTextColor: '#fff',
        // logo邊框顏色
        logoBorderColor: 'inherit',
        // 頭部背景顏色
        topHeaderBgColor: '#fff',
        // 頭部字體顏色
        topHeaderTextColor: 'inherit',
        // 頭部懸停顏色
        topHeaderHoverColor: '#f6f6f6',
        // 頭部邊框顏色
        topToolBorderColor: '#eee'
      }
    }
  },
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getUserInfo(): string {
      return this.userInfo
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ComponentSize {
      return this.currentSize
    },
    getSizeMap(): ComponentSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo: boolean) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter: boolean) {
      setStorage('dynamicRouter', dynamicRouter)
      this.dynamicRouter = dynamicRouter
    },
    setServerDynamicRouter(serverDynamicRouter: boolean) {
      setStorage('serverDynamicRouter', serverDynamicRouter)
      this.serverDynamicRouter = serverDynamicRouter
    },
    setFixedMenu(fixedMenu: boolean) {
      setStorage('fixedMenu', fixedMenu)
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移動端模式下不支持切換其它佈局')
        return
      }
      this.layout = layout
      setStorage('layout', this.layout)
    },
    setTitle(title: string) {
      this.title = title
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      setStorage('isDark', this.isDark)
    },
    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize
      setStorage('currentSize', this.currentSize)
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
      setStorage('theme', this.theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
    },
    setFooter(footer: boolean) {
      this.footer = footer
    }
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
