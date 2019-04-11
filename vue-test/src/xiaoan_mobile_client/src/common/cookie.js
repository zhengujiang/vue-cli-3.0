/**
 * *todo
 * @name Evans
 * @type cookie
 **/
import Cookie from 'js-cookie'
import Api from '../service/api'
const USERTOKEN = `XIAOAN_${process.env.XA_ENV}_TOKEN`;

export default {
  // 获取一级域名
  parseDomain(str) {
    if (!str) return '';
    if (str.indexOf('://') != -1) str = str.substr(str.indexOf('://') + 3);
    let topLevel = ['com', 'net', 'org', 'gov', 'edu', 'mil', 'biz', 'name', 'info', 'mobi', 'pro', 'travel', 'museum', 'int', 'areo', 'post', 'rec'];
    let domains = str.split('.');
    if (domains.length <= 1) return str;
    if (!isNaN(domains[domains.length - 1])) return str;
    let i = 0;
    while (i < topLevel.length && topLevel[i] != domains[domains.length - 1]) i++;
    if (i != topLevel.length) return domains[domains.length - 2] + '.' + domains[domains.length - 1];
    else {
      i = 0;
      while (i < topLevel.length && topLevel[i] != domains[domains.length - 2]) i++;
      if (i == topLevel.length) return domains[domains.length - 2] + '.' + domains[domains.length - 1];
      else return domains[domains.length - 3] + '.' + domains[domains.length - 2] + '.' + domains[domains.length - 1];
    }
  },
  // *设置cookie*/
  setCookie(name, value, days) {
    let domain = this.parseDomain(document.domain);
    // console.log('这里的domain是一级域名', domain);
    let d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";path=/;domain=" + domain + ";expires=" + d.toGMTString();
  },
  // *读取cookie*/
  getCookie(name) {
    // let localToken = localStorage.getItem("token");
    // let localUserId = document.cookie.match('(^|;) ?' + 'userId' + '=([^;]*)(;|$)');
    // let UserId = localUserId ? localUserId[2] : '';
    // let localXIAOAN = document.cookie.match('(^|;) ?' + 'XIAOAN_TOKEN' + '=([^;]*)(;|$)');
    // let XIAOAN = localXIAOAN ? localXIAOAN[2] : '';
    // let token = localToken || UserId || XIAOAN;
    // return token ? token : '';
    return this.get(name);
  },
  isLogin() {
    if (this.get('userId')) {
      return true
    } else {
      return false
    }
  },
  // *清空Cookie*/
  deleteCookie(name) {
    this.setCookie(name, '', -1);
    if (name == 'userId') {
      this.setCookie('token', '', -1);
    }
  },
  // 清空所有的cookie/
  clearCookies() {
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    let domain = this.parseDomain(document.domain);
    if (keys) {
      for (let i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;domain=' + domain + ';expires=' + new Date(0).toUTCString();
      }
    }
  },
  // 全局项目设置token
  setAuth(userInfo) {
    this.set('userInfo', userInfo);
    this.set('userId', userInfo.id);
    // this.setCookie('XIAOAN_TOKEN', userInfo.token, 365);
    // localStorage.setItem("token", userInfo.token);
    // localStorage.setItem("weixinId", userInfo.weixinId);
    // let wx = window.JSON.stringify(userInfo);
    // localStorage.setItem('wx-my-home', wx);
  },
  // 全局项目清除token
  clearAuth() {
    this.remove('userId');
    this.remove('userInfo');
    this.deleteCookie('token');
    this.deleteCookie('XIAOAN_TOKEN');
    localStorage.removeItem("token");
    localStorage.removeItem("weixinId");
    localStorage.removeItem("wx-my-home");
    localStorage.removeItem("wixAccreditCode");
  },
  // 退出登录控制
  apiUserClear(that, path) {
    let params = {
      userId: this.getCookie()
    }
    that.$axios.user.exit(params).then(res => {
      this.clearAuth();
      if (path) {
        that.$router.replace(path);
      }
    }).catch((err) => {
      console.error(err);
      this.clearAuth();
      if (path) {
        that.$router.replace(path);
      }
    })
  },
  //
  get(name) {
    name = process.env.XA_ENV + '_' + name
    let value = Cookie.get(name)
    if (!value) {
      value = ''
    }
    return value
  },
  //
  set(name, value) {
    // cookies.set(name, value)
    // cookies.set(name, value, { expires: 7 })
    name = process.env.XA_ENV + '_' + name;
    if (process.env.XA_ENV === 'dev') {
      Cookie.set(name, value, {expires: 365})
    } else {
      Cookie.set(name, value, {expires: 365, domain: Api.cookieHost})
    }
  },
  //
  remove(name) {
    name = process.env.XA_ENV + '_' + name
    if (process.env.XA_ENV === 'dev') {
      Cookie.set(name, '', {expires: -1})
    } else {
      Cookie.set(name, '', {expires: -1})
      Cookie.set(name, '', {expires: -1, domain: Api.cookieHost})
    }
  },
  //
  getUserInfo() {
    return this.get('userInfo') ? JSON.parse(this.get('userInfo')) : '';
  }
}
