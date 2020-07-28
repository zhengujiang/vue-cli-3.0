import cookies from 'js-cookie'
import api from '@/service/api/index'
const env = process.env.XA_ENV;
//
export default {
  get(name) {
    let value = cookies.get(`${env}_${name}`)
    if (!value) {
      value = ''
    }
    return value
  },
  set(name, value) {
    // 例：cookies.set(name, value) cookies.set(name, value, { expires: 7 })
    name = `${env}_${name}`;
    if (env === 'dev') {
      cookies.set(name, value, {expires: 7})
    } else {
      cookies.set(name, value, {expires: 7, domain: api.cookieHost})
    }
  },
  remove(name) {
    name = `${env}_${name}`
    if (env === 'dev') {
      cookies.set(name, '', {expires: -1})
    } else {
      cookies.set(name, '', {expires: -1})
      cookies.set(name, '', {expires: -1, domain: api.cookieHost})
      cookies.set(name, '', {expires: -1, domain: '.test.web.in-hope.com.cn'})
      cookies.set(name, '', {expires: -1, domain: '.web.in-hope.com.cn'})
      cookies.set(name, '', {expires: -1, domain: '.in-hope.com.cn'})
      cookies.set(name, '', {expires: -1, domain: 'xiaoan.in-hope.cn'})
    }
  },
  islogin() {
    let userId = this.get('userId');
    let type = false
    if (userId) {
      return true
    }
    return type
  },
  isLogin() {
    let userId = this.get('userId');
    let type = false
    if (userId) {
      return true
    }
    return type
  },
  // 获取用户信息
  getUserInfo() {
    return this.get('userInfo') ? JSON.parse(this.get('userInfo')) : '';
  }
}
