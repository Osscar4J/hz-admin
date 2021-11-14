import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Store from '@/store'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/dashboard',
    component: Layout,
    children: [{
      path: '',
      name: '控制台',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },

  
]

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
    path: '/parts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '配件管理',
        component: () => import('@/views/parts/index'),
        meta: { title: '配件管理', icon: 'form' }
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
        meta: { title: '区域管理' },
        children: [
          {
            path: '',
            component: () => import('@/views/system/area/index'),
            name: 'areaIndex',
            meta: { title: '区域列表' },
            hidden: true
          },
          {
            path: 'editor',
            component: () => import('@/views/system/area/editor'),
            name: 'areaEditor',
            meta: { title: '编辑区域' },
            hidden: true
          }
        ]
      }
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/device',
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
          }
        ]
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' },
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(dynamicRouters)
})

const router = createRouter()

const commonPaths = ['/', '/login', '/logout', '']

let getRouter
router.beforeEach(async (to, from, next) => {
  
  if (!getRouter && !commonPaths.includes(to.path)) {
    console.log('before get menus')
    let res = await Store.dispatch('user/resetMenus')
    console.log('menus: ', res)
    if (res.code != 0){
      next({ path: '/login' })
    } else {
      console.log(Store.getters.menus)

      // router.addRoutes(dynamicRouters) // 动态添加路由
      // dynamicRouters.forEach(r => {
      //   router.options.routes.push(r)
      // })
      // // 404 page must be placed at the end !!!
      // router.options.routes.push({ path: '*', redirect: '/404', hidden: true })
      getRouter = true
      
      next()
    }
  } else {
    next()
  }
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
