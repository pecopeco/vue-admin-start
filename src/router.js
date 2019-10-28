import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home/home-total',
    name: 'Home',
    meta: { title: '首页', icon: 'home' },
    children: [
      {
        path: 'home-total',
        name: 'HomeTotal',
        component: () => import('@/views/home/homeTotal'),
        meta: { title: '对账汇总统计报表', icon: 'home-total' }
      },
      {
        path: 'home-warn',
        name: 'HomeWarn',
        component: () => import('@/views/home/homeWarn'),
        meta: { title: '异常账单差异报表', icon: 'home-warn' }
      }
    ]
  },

  {
    path: '/bill',
    component: Layout,
    redirect: '/bill',
    children: [
      {
        path: 'bill',
        name: 'bill',
        component: () => import('@/views/bill/index'),
        meta: { title: '实时账单统计', icon: 'bill' }
      }
    ]
  },
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
