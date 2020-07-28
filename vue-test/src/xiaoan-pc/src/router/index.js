import Vue from 'vue'
import Router from 'vue-router'
import common from '../libs/common'
import Cookie from '@/service/cookie'
import Store from '@/store/store'
import Config from '../libs/config'
import routes from './config'
import {scrollToTop} from '../libs/utils'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  // fallback: false,
  routes: routes
});
/*
* const loading = this.$loading({
        lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
*
*
* */
// router.beforeEach((to, from, next) => {
//   window.document.title = to.meta.title;
//   Store.commit('isLoading', true);
//   console.log('topath:', to.path, 'fullPath:', to.fullPath);
//   // 路由引导 新旧路由
//   if (Config.guidanceOldFormRoute(to.path) !== to.path) {
//     next({path: Config.guidanceOldFormRoute(to.path), query: to.query});
//     return
//   }
//   // 批量处理跳转到 mobile
//   if (!common.ispc()) {
//     window.location.href = Config.guidanceOldFormMobileRoute(to)
//   }
//   // 空路由跳转到 主页
//   let userId = Cookie.get('userId');
//   if (to.name === null) {
//     next({path: '/index'});
//   }
//   // 未登录用户权限判断
//   if (to.meta.loginState >= 1 && !userId) {
//     // location.href = '/login?redirect_url=' + to.fullPath
//     next({path: '/login', query: {redirect_url: to.fullPath}});
//     return
//   }
//   // 判断是否登录
//   if (userId) {
//     let userInfo = JSON.parse(Cookie.get('userInfo'))
//     let enterpriseUser = userInfo.enterpriseUser
//     let superviseUser = userInfo.superviseUser
//     // loginState权限判断: (0:未登陆，1：登陆普通用户，2：企业用户)
//     if (to.meta.loginState == 2) {
//       if (!enterpriseUser && !superviseUser) {
//         // location.href = '/index?enterpriseUser=0'
//         next({path: '/index', query: {enterpriseUser: 0}})
//         return
//       }
//     }
//     // 企业用户首页跳转
//     if (to.fullPath == '/index') {
//       if (enterpriseUser) {
//         next({path: '/dashboard'})
//         return
//       }
//       if (superviseUser) {
//         next({path: '/dashboard/regulator'})
//         return
//       }
//     }
//   }
//   //
//   let scrollTop = 0;
//   if (from.name) {
//     let contentElem = document.body || document.documentElement
//     scrollTop = contentElem ? contentElem.scrollTop : '0'
//     Store.state.scrollValue[from.name] = scrollTop
//   }
//   // 切换页面 遇到顶部
//   if (to.path != from.path) {
//     scrollToTop()
//   }
//   next();
// });
//
// router.afterEach((to, from) => {
//   Store.commit('isLoading', false);
// });

export default router
