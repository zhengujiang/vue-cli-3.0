import Vue from 'vue'
import Router from 'vue-router'
import constant from '@/common/constant'
import store from '@/store/index'
import routes from './config'
import Config from '../libs/config'
Vue.use(Router);

const router = new Router({
  routes: routes
});
router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(123);
  window.document.title = to.meta.title;
  if (to.name === null) {
    next({path: '/rule'});
  }
  // 竞赛拦截
  let time = new Date().getTime();
  if (time >= 1544025600000) {
    if (to.meta.tab == 'competition') {
      next({path: '/competition/preheat', query: to.query});
      return
    }
  }
  /**
   * @url http://dev.web.in-hope.com.cn/competition/home?type=1&id=d4edce0e28f140e6b678ae84b05cbc08
   * **/
  if (Config.guidanceOldFormRoute(to.path) !== to.path) {
    next({path: Config.guidanceOldFormRoute(to.path), query: to.query});
    return
  }
  // 初始处理 isLogin
  if (Config.guidanceIsLoginRoute(to)) {
    next({path: Config.guidanceIsLoginRoute(to), query: to.query});
    return
  }
  //
  if (constant.ispc()) {
    window.location.href = Config.guidanceOldFormPCRoute(to);
    return
  }

  //
  let scrollTop = 0;
  if (from.name) {
    let contentElem = document.querySelector('.v-content')
    scrollTop = contentElem ? contentElem.scrollTop : '0'
    store.state.mutations.scrollValue[from.name] = scrollTop
  }
  next()
})
//
router.afterEach((to, from) => {
  if (from.name) {
    let scrollTop = store.state.mutations.scrollValue[to.name] || 0
    if (!scrollTop) {
      return
    }
    // 对scroll元素进行设置
    setTimeout(() => {
      let documentElem = document.querySelector('.v-content')
      if (documentElem) {
        documentElem.scrollTop = scrollTop
      }
    }, 0)
  }
})

export default router
