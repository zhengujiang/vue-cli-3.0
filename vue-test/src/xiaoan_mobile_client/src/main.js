// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import Axios from './service/http'
import VIEWUI from './common/viewui'
// 封装方法
import weixin from './common/weixin'
import cookie from './common/cookie'
import constant from './common/constant'
import array from './common/array'
import storage from './common/storage'
import MTAmethod from './common/MTAmethod'
import ybstore from './common/YBstore'
import $api from './service/api'
import $axios from './axios/axios'
import regExp from './common/regExp'
import image from './service/image'
// 移动端rem编译
import 'lib-flexible'
Vue.use(VIEWUI)
// const FastClick = require('fastclick')
// FastClick.attach(document.body)
// require("lrz/dist/lrz.bundle.js") // 图片压缩工具
Vue.prototype.$api = $api;
Vue.prototype.$axios = $axios;
Vue.prototype.$regExp = regExp;
Vue.prototype.$weixin = weixin;
Vue.prototype.$cookie = cookie;
Vue.prototype.$http = Axios;
Vue.prototype.$const = constant;
Vue.prototype.$array = array;
Vue.prototype.$storage = storage;
Vue.prototype.$MTAmethod = MTAmethod;
Vue.prototype.$YBstore = ybstore;
Vue.prototype.$image = image;

/**
 * @history
 *
 * **/
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 5
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})
/**
 * @params
 * **/
router.beforeEach((to, from, next) => {
  store.commit('UPDATE_LOADING', {isLoading: true})
  document.title = to.meta.title;
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('UPDATE_DIRECTION', {direction: 'forward'})
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('UPDATE_DIRECTION', {direction: ''})
      } else {
        store.commit('UPDATE_DIRECTION', {direction: 'reverse'})
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('UPDATE_DIRECTION', {direction: 'forward'})
  }
  history.setItem('count', history.getItem(to.path))
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    location.href = `http${url}`
  } else {
    next()
  }
});
//
router.afterEach((to) => {
  setTimeout(() => {
    store.commit('UPDATE_LOADING', {isLoading: false});
  }, 300)
});
/**
 * @log
 * @location 本地环境，测试环境,预发布环境添加log
 * @process.env.NODE_ENV process.env.NODE_ENV === 'dev' ||  development => 信安测试  test => 董办助手
 * @fundebug 监控
 * **/
if (process.env.XA_ENV === 'production') {
  const fundebug = require("fundebug-javascript");
  fundebug.apikey = "afd18f388a86ce155da61614d82e0bc61d8b72ff88f1b3dded2da0107bc7857d"; // Evans
}
if (process.env.XA_ENV === 'testing' || process.env.XA_ENV === 'development') {
  const opt = {
    'logExtJs': `/static/log/log_ext.js?${Math.random()}`,
    'logExtCss': `/static/log/log.css?${Math.random()}`
  };
  window.MLogger.init(opt);
}
Vue.config.productionTip = false; // 生产环境关闭提示
// Axios.defaults.withCredentials = true;
Vue.config.silent = true; // 输出日志
// eslint-disable no-new
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
