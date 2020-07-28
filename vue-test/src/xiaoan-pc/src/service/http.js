import Vue from 'vue'
import Axios from 'axios'
import router from '@/router'
import cookie from '@/service/cookie'
import store from '@/store/store'

const message = {
  '1': '成功',
  '-1': '服务器错误，请重试',
  '100': '请先登录',
  '501': '用户名或密码错误',
  '502': '验证码错误',
  '511': '请先绑定用户',
  '512': 'code失效，请重新扫码绑定',
  '521': '手机验证码错误',
  '523': '无法获取用户信息，请重新登录' // 已登录用户id无法获取到用户，系统异常
}

Axios.defaults.timeout = 600000
Axios.defaults.withCredentials = true
// 请求拦截器
Axios.interceptors.request.use(config => {
  config.headers['origin-type'] = 'WEB'
  if (config.method.toLocaleLowerCase() == 'get') {
    if (!config.params) {
      config.params = {}
    }
    config.params.t = new Date().getTime()
    config.params.userId = cookie.get('userId') ? cookie.get('userId') : ''
    // config.params.originType = 'WEB'
  }
  if (config.method.toLocaleLowerCase() == 'post') {
    console.log(config.params);
    console.log(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
Axios.interceptors.response.use(response => {
  let retrunCode = response.data.returnCode
  if (retrunCode == 100 || (retrunCode === -1 && response.data.returnMsg === '用户未登录')) {
    if (response.config.autoLogin) {

    } else {
      store.commit('ISLOGIN', false)
      store.commit('USERDATA', {})
      cookie.remove('userId')
      cookie.remove('xa_u')
      router.push('/login?redirect_url=' + location.href)
    }
    return response;
  } else {
    return response;
  }
}, error => {
  // error.response.data.message
  // error.config.message == 'none'
  console.log(error)
  if (error.config.message != 'none') {
    if (error.message == 'Network Error') {
      Vue.prototype.$message({message: '网络异常，请稍后再试', showClose: true, type: 'error', duration: 1000})
    } else if (error.message.indexOf('timeout') > -1) {
      Vue.prototype.$message({message: '请求超时，请稍后重试', showClose: true, type: 'error', duration: 1000})
    } else {
      Vue.prototype.$message({message: '网络异常，请稍后再试', showClose: true, type: 'error', duration: 1000})
    }
  }
  return Promise.reject(error)
})

export default Axios
