<script setup lang="tsx">
import { reactive, ref, watch } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
// import { loginApi, getTestRoleApi, getAdminRoleApi } from '@/api/login'
// import { useStorage } from '@/hooks/web/useStorage'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import { RouteRecordRaw, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const { required } = useValidator()

const emit = defineEmits(['to-register'])

const appStore = useAppStore()
// const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

// const { currentRoute, addRoute, push, getRoutes } = useRouter()
const router = useRouter()

// const { setStorage } = useStorage()

const { t } = useI18n()

const rules = {
  email: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
        }
      }
    }
  },
  {
    field: 'email',
    label: t('login.email'),
    value: 'joshhsiao@gmail.com',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.emailPlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: 'glgidral',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
                <ElLink type="primary" underline={false}>
                  {t('login.forgetPassword')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <ElButton loading={loading.value} type="primary" class="w-[100%]" onClick={signIn}>
                  {t('login.login')}
                </ElButton>
              </div>
              <div class="w-[100%] mt-15px">
                <ElButton class="w-[100%]" onClick={toRegister}>
                  {t('login.register')}
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <Icon
                  icon="ant-design:github-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:wechat-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const remember = ref(false)

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

const redirect = ref<string>('')

watch(
  () => router.currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    console.log('redirect.value=', redirect.value)
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登錄
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserType>()

      try {
        // const res = await loginApi(formData)

        userStore.login({ email: formData.email, password: formData.password })

        // 是否使用动态路由
        if (appStore.getDynamicRouter) {
          // getRole()
        } else {
          await permissionStore.generateRoutes('static').catch(() => {})
          permissionStore.getAddRouters.forEach((route) => {
            router.addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
          })
          permissionStore.setIsAddRouters(true)
          console.log('redirect.value=', redirect.value)
          console.log('permissionStore.addRouters[0].path=', permissionStore.addRouters[0].path)
          // const result = push({ path: redirect.value || permissionStore.addRouters[0].path })
          const result = await router
            .push(redirect.value || permissionStore.addRouters[0].path)
            .catch(() => {})
          console.log('navigate to', result)
        }
        // const permissionStore = usePermissionStore()
        // if (!permissionStore.isDynamicAddedRoute) {
        //   // Get the id and set the menu
        //   const routes = await permissionStore.buildRoutesAction()
        //   routes.forEach((route) => {
        //     router.addRoute(route as unknown as RouteRecordRaw)
        //   })
        //   router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
        //   permissionStore.setDynamicAddedRoute(true)
        // }
        // goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME))
      } finally {
        loading.value = false
      }
    }
  })
}

// 獲取角色信息
// const getRole = async () => {
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

// 去註冊頁面
const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>
