import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import Layout from '@/layout'
import crypto from "@/utils/crypto";

// import menuApi from "@/api/menu";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()

  if (to.path === '/login') {
    // if is logged in, redirect to the home page
    // next({ path: '/' })
    next()
    // NProgress.done()x
  } else {
    const isAddRouter = store.getters.isAddRouter
    // const isAddRouter = false
    // console.log(isAddRouter);
    if (isAddRouter) {
      next()
    } else {
      try {
        // get user info
        await store.dispatch('user/getMenu')
        console.log(store.getters.menuList, 'store.getters.menuList');

        // 过滤数组
        // const idS = store.getters.userMenu
        // const idS = window.SITE_CONFIG['userMenu']
        const idS = crypto.decrypt(localStorage.getItem('menuList'))
        console.log(idS, 'idS');
        // const newRouterId = store.getters.menuList.filter((item) => idS.includes(item.id))
        // 调用递归函数
        // const newRouterId = filterMenuList(store.getters.menuList, idS);
        // const filteredMenuList = store.getters.menuList.filter(item => {
        //   if (idS.includes(item.id)) {
        //     // 如果当前项的 id 在 arr 中，返回 true，表示保留该项
        //     return true;
        //   } else if (item.children && item.children.length > 0) {
        //     // 如果当前项有子节点，递归检查子节点中是否有符合条件的项
        //     item.children = item.children.filter(child => idS.includes(child.id));
        //     return item.children.length > 0; // 只保留有子节点的项
        //   }

        //   return false; // 不在 arr 中且没有子节点，返回 false，表示过滤掉该项
        // });
        const newRouterId = filterMenuList(store.getters.menuList, idS);
        // if (idS.length === 0) {
        //   Message.error('没有菜单权限,请重新登录')
        //   await store.dispatch('user/logout')
        //   next('/login')
        // }
        // 路由转换
        // console.log(newRouterId, ' newRouterId');
        // console.log(idS, ' idS');
        // const myRoutes = myFilterAsyncRoutes(store.getters.menuList);
        const myRoutes = myFilterAsyncRoutes(newRouterId);
        myRoutes.push({
          path: '*',
          redirect: '/404',
          hidden: true
        });
        // 动态添加路由
        router.addRoutes(myRoutes);
        // console.log(myRoutes, 'myRoutes');
        // 存至全局变量
        global.myRoutes = myRoutes;
        // SET_MENU_ROUTER
        store.commit('user/SET_MENU_ROUTER')
        next({ ...to, replace: true })// 防止刷新后页面空白
        // 记录已保存
        // localStorage.setItem('isAddRouter', true)
        // next()
      } catch (error) {
        // remove token and go to login page to re-login
        // await store.dispatch('user/resetToken')
        // Message.error('亲:' + error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
  // }
  // else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
})
// 过滤
// let filteredMenuList = []
function filterMenuList(menuList, idsToKeep) {
  return menuList.reduce((acc, item) => {
    const newItem = { ...item };

    if (idsToKeep.includes(item.id)) {
      // 保留当前项
      if (item.children && item.children.length > 0) {
        // 递归过滤子节点
        newItem.children = filterMenuList(item.children, idsToKeep);
      }
      acc.push(newItem);
    } else if (item.children && item.children.length > 0) {
      // 递归过滤子节点
      newItem.children = filterMenuList(item.children, idsToKeep);
      if (newItem.children.length > 0) {
        // 只保留有子节点的项
        acc.push(newItem);
      }
    }

    return acc;
  }, []);
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function myFilterAsyncRoutes(menuList) {
  // console.log(menuList);
  // 请求当前用户菜单权限 getUserMenuIds
  // idS.include(item => item === 1)
  menuList.filter(menu => {
    // 没有不执行
    if (menu.component === 'Layout') {
      menu.component = Layout
      menu.path = menu.url
      menu.meta = { title: menu.name }
      // menu.meta.icon = 'userManage'
      menu.meta.icon = menu.icon
      // console.log(menu);
      // console.log(menu.component);
    } else {
      // console.log(menu);
      menu.path = menu.url
      menu.meta = Object.assign({}, { title: menu.name })
      menu.meta.icon = menu.icon
      menu.component = require(`@/views${menu.url}.vue`).default
    }
    // 递归处理子菜单
    if (menu.children && menu.children.length) {
      menu.children = myFilterAsyncRoutes(menu.children)
    }
    // console.log(menuList);
    return true
  })
  return menuList;
}
