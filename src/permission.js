import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/'] // no redirect whitelist

const dynamicRouters = [
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '用户管理',
        component: () => import('@/views/users/index'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/orgs',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '单位管理',
        component: () => import('@/views/org/index'),
        meta: { title: '单位管理', icon: 'form' }
      },
      {
        path: 'editor',
        name: '编辑',
        component: () => import('@/views/org/editor'),
        meta: { title: '修改单位信息', icon: 'form' },
        hidden: true
      },
      {
        path: 'check',
        name: '审核',
        component: () => import('@/views/org/check'),
        meta: { title: '审核单位', icon: 'form' },
        hidden: true
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/banners',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'banners',
        component: () => import('@/views/system/banner/layout'),
        name: 'Banners',
        meta: { title: '轮播图管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/system/banner/index'),
            name: 'bannerIndex',
            meta: { title: '轮播图列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/system/banner/editor'),
            name: 'bannerEditor',
            meta: { title: '编辑轮播图' },
            hidden: true
          }
        ]
      },
      {
        path: 'classify',
        component: () => import('@/views/system/classify/layout'),
        name: 'Classify',
        meta: { title: '分类管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/system/classify/index'),
            name: 'classifyIndex',
            meta: { title: '分类列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/system/classify/editor'),
            name: 'classifyEditor',
            meta: { title: '编辑分类' },
            hidden: true
          }
        ]
      },
      {
        path: 'area',
        component: () => import('@/views/system/area/layout'),
        name: 'area',
        meta: { title: '维修站管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/system/area/index'),
            name: 'areaIndex',
            meta: { title: '维修站列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/system/area/editor'),
            name: 'areaEditor',
            meta: { title: '编辑维修站' },
            hidden: true
          }
        ]
      }
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/device/index',
    name: 'Device',
    meta: {
      title: '设备管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'device',
        component: () => import('@/views/device/device/layout'),
        name: 'Devices',
        meta: { title: '设备管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/device/device/index'),
            name: 'deviceIndex',
            meta: { title: '设备列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/device/device/editor'),
            name: 'deviceEditor',
            meta: { title: '编辑设备' },
            hidden: true
          }
        ]
      },
      {
        path: 'parts',
        component: () => import('@/views/device/parts/layout'),
        name: 'Parts',
        meta: { title: '配件管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/device/parts/index'),
            name: 'partsIndex',
            meta: { title: '配件列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/device/parts/editor'),
            name: 'partsEditor',
            meta: { title: '编辑配件' },
            hidden: true
          },
          {
            path: 'sku',
            component: () => import('@/views/device/parts/sku'),
            name: 'partsSku',
            meta: { title: '库存管理' },
            hidden: true
          }
        ]
      },
      {
        path: 'brand',
        component: () => import('@/views/device/brand/layout'),
        name: 'Brands',
        meta: { title: '品牌管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/device/brand/index'),
            name: 'brandIndex',
            meta: { title: '品牌列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/device/brand/editor'),
            name: 'brandEditor',
            meta: { title: '编辑品牌' },
            hidden: true
          }
        ]
      },
      {
        path: 'model',
        component: () => import('@/views/device/model/layout'),
        name: 'models',
        meta: { title: '型号管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/device/model/index'),
            name: 'modelIndex',
            meta: { title: '型号列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/device/model/editor'),
            name: 'modelEditor',
            meta: { title: '编辑型号' },
            hidden: true
          }
        ]
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

let routerLoaded = false

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          if (!routerLoaded) {
            await store.dispatch('user/resetMenus')
            if (store.getters.menus) {
              router.addRoutes(dynamicRouters)
              dynamicRouters.forEach(r => {
                router.options.routes.push(r)
              })
            }
            routerLoaded = true
          }

          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
  //   /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
  // next()
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
