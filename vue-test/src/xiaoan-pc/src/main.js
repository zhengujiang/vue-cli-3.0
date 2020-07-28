// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'lodash'
// import '../static/iconfont/iconfont.css'
import '@/styles/reset.scss'
import '@/styles/common.scss'
import '@/styles/vxa-theme.scss'
import '@/styles/image-theme.scss'
import md5 from 'js-md5'
import moment from 'moment'
import Vue from 'vue'
import store from '@/store/store'
import App from '@/App'
import router from '@/router'
import Http from '@/service/http'
import Regx from '@/service/regx'
import Cookie from '@/service/cookie'
import Api from '@/service/api/index'
import Auth from '@/service/auth'
import Config from '@/config/config'
import VxaNotInfo from '@/components/vux/notInfo/notInfo'
// import Ele from '@/service/ele'
import common from './libs/common'
import arrayFun from './libs/array'
import dataUser from '@/service/dataUser'
import ElementUI from 'element-ui'
import VNoInfo from "./components/noInfo"
import shadowCard from "./components/vux/shadowCard"
import Advertisement from "./components/advertisement"
import vxaProgress from "./components/vux/progress/progress"
import Components from "@/service/components"
import axios from '@/axios/index'
import ImgUri from './config/image/index'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/eleui.scss'
import lineClamp from 'vue-line-clamp' // a cross browser component for fixing multi-line text
Vue.use(ElementUI)
Vue.use(lineClamp)
Components(Vue)

Vue.component('v-noInfo', VNoInfo)
Vue.component('shadow-card', shadowCard)
Vue.component('v-advertisement', Advertisement)
Vue.component('vxa-progress', vxaProgress)
Vue.component('vxa-not-info', VxaNotInfo)

Vue.prototype.$md5 = md5
Vue.prototype.$moment = moment
Vue.prototype.$api = Api
Vue.prototype.$config = Config
Vue.prototype.$http = Http
Vue.prototype.$regx = Regx
Vue.prototype.$cookie = Cookie
Vue.prototype.$auth = Auth
Vue.prototype.$common = common
Vue.prototype.$array = arrayFun
Vue.prototype.$axios = axios
Vue.prototype.$image = ImgUri
Vue.prototype.$db = {
  dataUser: dataUser
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  template: '<App/>',
  render: h => h(App)
  /*
  ,beforeCreate() {
     console.info('(全局)开始初始化vue实例')
  },
  created() {
    console.info('(全局)vue实例创建完成')
  },
  beforeMount() {
     console.info('(全局)开始渲染')
  },
  mounted() {
    console.info('(全局)渲染完成')
  },
  beforeUpdate() {
     console.info('(全局)DOM开始重新渲染或打补丁')
  },
  updated() {
    console.info('(全局)DOM渲染或打补丁完成')
  }
  */
}).$mount('#app')
