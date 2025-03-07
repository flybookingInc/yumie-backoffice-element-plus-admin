export default {
  common: {
    inputText: '請輸入',
    selectText: '請選擇',
    startTimeText: '開始時間',
    endTimeText: '結束時間',
    login: '登錄',
    required: '該項為必填項',
    loginOut: '退出系統',
    document: '項目文檔',
    reminder: '温馨提示',
    loginOutMessage: '是否退出本系統？',
    back: '返回',
    ok: '確定',
    cancel: '取消',
    reload: '重新載入',
    closeTab: '關閉標籤頁',
    closeTheLeftTab: '關閉左側標籤頁',
    closeTheRightTab: '關閉右側標籤頁',
    closeOther: '關閉其它標籤頁',
    closeAll: '關閉全部標籤頁',
    prevLabel: '上一步',
    nextLabel: '下一步',
    skipLabel: '跳過',
    doneLabel: '結束',
    menu: '選單',
    menuDes: '以路由的結構渲染的選單欄',
    collapse: '展開縮收',
    collapseDes: '展開和縮放選單欄',
    tagsView: '標籤頁',
    tagsViewDes: '用於記錄路由歷史記錄',
    tool: '工具',
    toolDes: '用於設置定製系統',
    query: '查詢',
    reset: '重置',
    shrink: '收起',
    expand: '展開',
    delMessage: '是否刪除所選中數據？',
    delWarning: '提示',
    delOk: '確定',
    delCancel: '取消',
    delNoData: '請選擇需要刪除的數據',
    delSuccess: '刪除成功',
    refresh: '刷新',
    fullscreen: '全屏',
    size: '尺寸',
    columnSetting: '列設置',
    lengthRange: '長度在 {min} 到 {max} 個字符',
    notSpace: '不能包含空格',
    notSpecialCharacters: '不能包含特殊字符',
    isEqual: '兩次輸入不一致'
  },
  lock: {
    lockScreen: '鎖定屏幕',
    lock: '鎖定',
    lockPassword: '鎖屏密碼',
    unlock: '點擊解鎖',
    backToLogin: '返回登錄',
    entrySystem: '進入系統',
    placeholder: '請輸入鎖屏密碼',
    message: '鎖屏密碼錯誤'
  },
  error: {
    noPermission: `抱歉，您無權訪問此頁面。`,
    pageError: '抱歉，您訪問的頁面不存在。',
    networkError: '抱歉，服務器報告錯誤。',
    returnToHome: '返回首頁'
  },
  setting: {
    projectSetting: '項目配置',
    theme: '主題',
    layout: '佈局',
    systemTheme: '系統主題',
    menuTheme: '選單主題',
    interfaceDisplay: '界面顯示',
    breadcrumb: '麪包屑',
    breadcrumbIcon: '麪包屑圖示',
    collapseMenu: '摺疊選單',
    hamburgerIcon: '摺疊圖示',
    screenfullIcon: '全屏圖示',
    sizeIcon: '尺寸圖示',
    localeIcon: '多語言圖示',
    tagsView: '標籤頁',
    logo: '標誌',
    greyMode: '灰色模式',
    fixedHeader: '固定頭部',
    headerTheme: '頭部主題',
    cutMenu: '切割選單',
    copy: '拷貝',
    clearAndReset: '清除緩存並且重置',
    copySuccess: '拷貝成功',
    copyFailed: '拷貝失敗',
    footer: '頁腳',
    uniqueOpened: '選單手風琴',
    tagsViewIcon: '標籤頁圖示',
    dynamicRouter: '開啓動態路由',
    serverDynamicRouter: '服務端動態路由',
    reExperienced: '請重新退出登錄體驗',
    fixedMenu: '固定選單'
  },
  size: {
    default: '默認',
    large: '大',
    small: '小'
  },
  login: {
    welcome: '歡迎使用本系統',
    message: '開箱即用的中後台管理系統',
    email: '電子信箱',
    password: '密碼',
    register: '註冊',
    checkPassword: '確認密碼',
    login: '登錄',
    otherLogin: '其它登錄方式',
    remember: '記住我',
    hasUser: '已有賬號？去登錄',
    forgetPassword: '忘記密碼',
    emailPlaceholder: '請輸入電子信箱',
    passwordPlaceholder: '請輸入密碼',
    code: '驗證碼',
    codePlaceholder: '請輸入驗證碼'
  },
  router: {
    views: {
      inventory: {
        title: '房況',
        stock: {
          title: '房量'
        },
        time_segment_switch: {
          title: '時段'
        },
        time_segment_quantity: {
          title: '數量'
        }
      },
      extras: {
        title: '加購',
        extrasItem: {
          title: '商品',
          description: ''
        }
      },
      statstastics: {
        title: '統計',
        description: '',
        sms: {
          title: '簡訊統計',
          description: ''
        }
      },
      settings: {
        title: '設定',
        description: '',
        hotel: {
          title: '旅館',
          description: ''
        },
        hotelPhoto: {
          title: '輪播圖片',
          description: ''
        },
        account: {
          title: '帳號',
          description: ''
        },
        roomType: {
          title: '房型',
          description: ''
        },
        plan: {
          title: '專案',
          description: ''
        }
      },
      reservations: {
        title: '訂單',
        description: '',
        list: {
          title: '列表',
          description: ''
        },
        book: {
          title: '預約',
          description:
            '後台手動代客預約，可預約今日後休息，預約後房量仍會減1，不受日期、房量、時段，方案之設定所限制。'
        }
      },
      authorization: {
        title: '權限管理',
        description: '',
        user: {
          title: '使用者',
          description: ''
        },
        role: {
          title: '角色',
          description: ''
        },
        menu: {
          title: '選單',
          description: ''
        }
      }
    },
    login: '登錄',
    level: '多級選單',
    menu: '選單',
    menu1: '選單1',
    menu11: '選單1-1',
    menu111: '選單1-1-1',
    menu12: '選單1-2',
    menu2: '選單2',
    dashboard: '首頁',
    analysis: '分析頁',
    workplace: '工作台',
    guide: '引導',
    component: '元件',
    icon: '圖示',
    echart: '圖表',
    countTo: '數字動畫',
    watermark: '浮水印',
    qrcode: '二維碼',
    highlight: '醒目',
    infotip: '信息提示',
    form: '表單',
    defaultForm: '全部示例',
    search: '查詢',
    table: '表格',
    defaultTable: '基礎示例',
    editor: '編輯器',
    richText: '富文本',
    jsonEditor: 'JSON編輯器',
    dialog: '對話窗',
    imageViewer: '圖片預覽',
    descriptions: '描述',
    example: '綜合示例',
    exampleDialog: '綜合示例 - 對話窗',
    examplePage: '綜合示例 - 頁面',
    exampleAdd: '綜合示例 - 新增',
    exampleEdit: '綜合示例 - 編輯',
    exampleDetail: '綜合示例 - 詳情',
    errorPage: '錯誤頁面',
    authorization: '權限管理',
    user: '用户管理',
    role: '角色管理',
    document: '文檔',
    inputPassword: '密碼輸入框',
    sticky: '黏性',
    treeTable: '樹形表格',
    PicturePreview: '表格圖片預覽',
    department: '部門管理',
    menuManagement: '選單管理',
    permission: '權限測試頁',
    function: '功能',
    multipleTabs: '多開標籤頁',
    details: '詳情頁',
    iconPicker: '圖示選擇器',
    request: '請求'
  },
  permission: {
    hasPermission: '請設置操作權限值'
  },
  analysis: {
    newUser: '新增用户',
    unreadInformation: '未讀消息',
    transactionAmount: '成交金額',
    totalShopping: '購物總量',
    monthlySales: '每月銷售額',
    userAccessSource: '用户訪問來源',
    january: '一月',
    february: '二月',
    march: '三月',
    april: '四月',
    may: '五月',
    june: '六月',
    july: '七月',
    august: '八月',
    september: '九月',
    october: '十月',
    november: '十一月',
    december: '十二月',
    estimate: '預計',
    actual: '實際',
    directAccess: '直接訪問',
    mailMarketing: '郵件營銷',
    allianceAdvertising: '聯盟廣告',
    videoAdvertising: '視頻廣告',
    searchEngines: '搜索引擎',
    weeklyUserActivity: '每週用户活躍量',
    activeQuantity: '活躍量',
    monday: '週一',
    tuesday: '週二',
    wednesday: '週三',
    thursday: '週四',
    friday: '週五',
    saturday: '週六',
    sunday: '週日'
  },
  workplace: {
    goodMorning: '早安',
    happyDay: '祝你開心每一天!',
    toady: '今日晴',
    project: '項目數',
    access: '項目訪問',
    toDo: '待辦',
    introduction: '一個正經的簡介',
    more: '更多',
    shortcutOperation: '快捷操作',
    operation: '操作',
    index: '指數',
    personal: '個人',
    team: '團隊',
    quote: '引用',
    contribution: '貢獻',
    hot: '熱度',
    yield: '產量',
    dynamic: '動態',
    push: '推送',
    pushCode: 'Archer 推送 代碼到 Github',
    follow: '關注'
  },
  formDemo: {
    input: '輸入框',
    inputNumber: '數字輸入框',
    default: '默認',
    icon: '圖示',
    mixed: '複合型',
    password: '密碼框',
    textarea: '多行文本',
    remoteSearch: '遠程搜索',
    slot: '插槽',
    position: '位置',
    autocomplete: '自動補全',
    select: '選擇器',
    optionSlot: '選項插槽',
    selectGroup: '選項分組',
    selectV2: '虛擬列表選擇器',
    cascader: '級聯選擇器',
    switch: '開關',
    rate: '評分',
    colorPicker: '顏色選擇器',
    transfer: '穿梭框',
    render: '渲染器',
    radio: '單選框',
    radioGroup: '單選框組',
    button: '按鈕',
    checkbox: '多選框',
    checkboxButton: '多選框按鈕',
    checkboxGroup: '多選框組',
    slider: '滑塊',
    datePicker: '日期選擇器',
    shortcuts: '快捷選項',
    today: '今天',
    yesterday: '昨天',
    aWeekAgo: '一週前',
    week: '周',
    year: '年',
    month: '月',
    dates: '日期',
    daterange: '日期範圍',
    monthrange: '月份範圍',
    dateTimePicker: '日期時間選擇器',
    dateTimerange: '日期時間範圍',
    timePicker: '時間選擇器',
    timeSelect: '時間選擇',
    inputPassword: '密碼輸入框',
    passwordStrength: '密碼強度',
    defaultForm: '全部示例',
    formDes: '基於 ElementPlus 的 Form 元件二次封裝，實現數據驅動，支持所有 Form 參數',
    example: '示例',
    operate: '操作',
    change: '更改',
    restore: '還原',
    disabled: '禁用',
    disablement: '解除禁用',
    delete: '刪除',
    add: '添加',
    setValue: '設置值',
    resetValue: '重置值',
    set: '設置',
    subitem: '子項',
    formValidation: '表單驗證',
    verifyReset: '驗證重置',
    // 富文本編輯器
    richText: '富文本編輯器',
    // JSON編輯器
    jsonEditor: 'JSON編輯器',
    form: '表單',
    // 遠程載入
    remoteLoading: '遠程載入',
    // 聚焦
    focus: '聚焦',
    treeSelect: '樹形選擇器',
    showCheckbox: '顯示覆選框',
    selectAnyLevel: '選擇任意級別',
    multiple: '多選',
    filterable: '可篩選',
    customContent: '自定義內容',
    lazyLoad: '延遲載入',
    upload: '上傳',
    userAvatar: '用户圖片',
    iconPicker: '圖示選擇器'
  },
  guideDemo: {
    guide: '引導頁',
    start: '開始',
    message:
      '引導頁對於一些第一次進入項目的人很有用，你可以簡單介紹下項目的功能。引導頁基於 driver.js'
  },
  iconDemo: {
    icon: '圖示',
    localIcon: '本地圖示',
    iconify: 'Iconify元件',
    recommendedUse: '推薦使用',
    recommendeDes:
      'Iconify元件基本包含所有的圖示，你可以查詢到你想要的任何圖示。並且封裝只會用到的圖示。',
    accessAddress: '訪問地址'
  },
  echartDemo: {
    echart: '圖表',
    echartDes:
      '基於 echarts 二次封裝元件，自適應寬度，只需傳入 options 與 height 屬性即可展示對應的圖表。'
  },
  countToDemo: {
    countTo: '數字動畫',
    countToDes: '基於 vue-count-to 進行改造，支持所有 vue-count-to 參數。',
    suffix: '後綴',
    prefix: '前綴',
    separator: '分隔符號',
    duration: '持續時間',
    endVal: '結束值',
    startVal: '開始值',
    start: '開始',
    pause: '暫停',
    resume: '繼續'
  },
  watermarkDemo: {
    watermark: '浮水印',
    createdWatermark: '創建浮水印',
    clearWatermark: '清除浮水印',
    resetWatermark: '重置浮水印'
  },
  qrcodeDemo: {
    qrcode: '二維碼',
    qrcodeDes: '基於 qrcode 二次封裝',
    basicUsage: '基礎用法',
    imgTag: 'img標籤',
    style: '樣式配置',
    click: '點擊事件',
    asynchronousContent: '異步內容',
    invalid: '失效',
    logoConfig: 'logo配置',
    logoStyle: 'logo樣式',
    size: '大小配置'
  },
  highlightDemo: {
    highlight: '醒目',
    message: '種一棵樹最好的時間是十年前，其次就是現在。',
    keys1: '十年前',
    keys2: '現在'
  },
  infotipDemo: {
    infotip: '信息提示',
    infotipDes: '基於 Highlight 元件二次封裝',
    title: '注意事項'
  },
  levelDemo: {
    menu: '多級選單緩存'
  },
  searchDemo: {
    search: '查詢',
    searchDes: '基於 Form 元件二次封裝，實現查詢、重置功能',
    operate: '操作',
    change: '更改',
    grid: '柵格',
    button: '按鈕',
    restore: '還原',
    inline: '內聯',
    bottom: '底部',
    position: '位置',
    left: '左',
    center: '中',
    right: '右',
    dynamicOptions: '動態選項',
    // 刪除單選框
    deleteRadio: '刪除單選框',
    // 還原單選框
    restoreRadio: '還原單選框',
    loading: '載入中',
    reset: '重置'
  },
  stickyDemo: {
    sticky: '黏性'
  },
  tableDemo: {
    table: '表格',
    tableDes: '基於 ElementPlus 的 Table 元件二次封裝',
    index: '序號',
    title: '標題',
    author: '作者',
    displayTime: '創建時間',
    importance: '重要性',
    pageviews: '閲讀數',
    action: '操作',
    important: '重要',
    good: '良好',
    commonly: '一般',
    operate: '操作',
    example: '示例',
    show: '顯示',
    hidden: '隱藏',
    pagination: '分頁',
    reserveIndex: '疊加序號',
    restoreIndex: '還原序號',
    showSelections: '顯示多選',
    hiddenSelections: '隱藏多選',
    showExpandedRows: '顯示展開行',
    hiddenExpandedRows: '隱藏展開行',
    changeTitle: '修改標題',
    header: '頭部',
    selectAllNone: '全選/全不選',
    delOrAddAction: '刪除/添加操作列',
    showOrHiddenStripe: '顯示/隱藏斑馬紋',
    showOrHiddenBorder: '顯示/隱藏邊框',
    fixedHeaderOrAuto: '固定頭部/自動',
    getSelections: '獲取多選數據',
    preview: '封面',
    showOrHiddenSortable: '顯示/隱藏排序'
  },
  richText: {
    richText: '富文本',
    richTextDes: '基於 wangeditor 二次封裝',
    jsonEditor: 'JSON編輯器',
    jsonEditorDes: '基於 vue-json-pretty 二次封裝'
  },
  dialogDemo: {
    dialog: '對話窗',
    dialogDes: '基於 ElementPlus 的 Dialog 元件二次封裝',
    open: '打開',
    close: '關閉',
    combineWithForm: '與表單結合',
    submit: '提交'
  },
  imageViewerDemo: {
    open: '打開',
    imageViewer: '圖片預覽',
    imageViewerDes: '基於 ElementPlus 的 ImageViewer 元件二次封裝'
  },
  descriptionsDemo: {
    descriptions: '描述',
    descriptionsDes: '基於 ElementPlus 的 Descriptions 元件二次封裝',
    username: '用户名',
    nickName: '暱稱',
    phone: '聯繫電話',
    email: '郵箱',
    addr: '地址',
    form: '與 Form 元件組合'
  },
  exampleDemo: {
    title: '標題',
    add: '新增',
    del: '刪除',
    edit: '編輯',
    author: '作者',
    displayTime: '創建時間',
    importance: '重要性',
    pageviews: '閲讀數',
    important: '重要',
    content: '內容',
    save: '保存',
    detail: '詳情'
  },
  userDemo: {
    title: '用户管理',
    message: '由於是模擬數據，所以只提供了兩種不同權限的帳號，開發者可根據實際情況自行改造結合。',
    index: '序號',
    action: '操作',
    username: '用户名',
    password: '密碼',
    role: '角色',
    remark: '備註',
    remarkMessage1: '後端控制路由權限',
    remarkMessage2: '前端控制路由權限',
    // 部門列表
    departmentList: '部門列表',
    searchDepartment: '搜索部門',
    account: '賬號',
    email: '郵箱',
    createTime: '創建時間',
    // 所屬部門
    department: '所屬部門',
    departmentName: '部門名稱',
    status: '狀態',
    // 啓用
    enable: '啓用',
    // 禁用
    disable: '禁用',
    // 上級部門
    superiorDepartment: '上級部門'
  },
  menu: {
    menuName: '選單名稱',
    icon: '圖示',
    permission: '權限標識',
    component: '元件',
    path: '路徑',
    status: '狀態',
    hidden: '是否隱藏',
    alwaysShow: '是否一直顯示',
    noCache: '是否清除緩存',
    breadcrumb: '是否顯示麪包屑',
    affix: '是否固定在標籤頁',
    noTagsView: '是否隱藏標籤頁',
    activeMenu: '醒目選單',
    canTo: '是否可跳轉',
    name: '元件名稱'
  },
  role: {
    roleName: '角色名稱',
    role: '角色',
    menu: '選單分配'
  },
  inputPasswordDemo: {
    title: '密碼輸入框',
    inputPasswordDes: '基於 ElementPlus 的 Input 元件二次封裝'
  }
}
