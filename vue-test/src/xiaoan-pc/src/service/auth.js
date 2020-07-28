import Cookie from '@/service/cookie'
import router from '@/router'
import cookie from './cookie';
import http from './http';

export default {
  // 设置用户store
  setStore(vue, userData) {
    // debugger
    let userId = userData.id
    vue.$cookie.set('userId', userId)
    let xa_u = (userData.weixinUnionId ? 1 : 0) + '|' + (userData.userName ? 1 : 0)
    vue.$cookie.set('xa_u', xa_u)
    vue.$store.commit('ISLOGIN', true)
    vue.$store.commit('USERDATA', userData)
    if (userData.authorityMenuList && userData.authorityMenuList.length > 0) {
      // vue.$cookie.set('menuList', JSON.stringify(userData.authorityMenuList));
      userData.authorityMenuList = null;
    }
    vue.$cookie.set('userInfo', JSON.stringify(userData))
    this.getMenuInfo(vue);
  },
  // 登录后设置auth, 绑定微信判断，完善信息判断
  loginSetAuth(vue, userData) {
    // if (!userData.weixinUnionId) {
    //   // vue.$message({message: '你还未绑定微信，请先扫码绑定', showClose: true, type: 'warning', duration: 3000})
    //   // vue.$router.push('/bindWeixin')
    // } else
    if (!userData.companyName) {
      vue.$message({message: '请先完善个人信息！', showClose: true, type: 'warning', duration: 3000});
      sessionStorage.setItem('registerInfo', JSON.stringify(userData));
      vue.$router.push('/personInfo')
      // vue.$router.push('/register?step=2')
    } else {
      this.setStore(vue, userData)
      vue.$message({message: '登录成功', showClose: true, type: 'success', duration: 3000})
      if (vue.redirect_url) {
        if (vue.redirect_url.indexOf("/businessCourse") != -1) {
          if (vue.redirect_url.indexOf("&code") != -1) {
            vue.$common.openWindow(vue.redirect_url.split('&code')[0]);
          } else {
            vue.$common.openWindow(vue.redirect_url);
          }
          vue.$router.push('/index')
        } else {
          location.href = vue.redirect_url
        }

      } else {
        if (userData.enterpriseCompanyCode) {
          if (process.env.XA_ENV === 'dev') {
            vue.$router.push('/dashboard')
          } else {
            let code = userData.enterpriseCompanyCode.toString().replace(/(^\s*)|(\s*$)/g, '')
            let host = vue.$api.enterpriseHost.replace('{{code}}', code)

            location.href = host + 'dashboard'
          }
        } else {
          if (process.env.XA_ENV === 'dev') {
            vue.$router.push('/index')
          } else {
            let host = vue.$api.host.split('://')
            location.href = host[0] + '://' + host[1] + 'index'
          }
        }
      }
    }
  },
  // 退出登录后跳转
  logout_redirect: () => {
    if (!Cookie.islogin()) {
      router.push('/login?redirect_url=' + location.href)
    }
  },
  // 登录后跳转判断 有到计时
  checkAuth(vue) {
    if (Cookie.islogin()) {
      // let userData = vue.$store.state.userData
      let xa_u = vue.$cookie.get('xa_u')
      console.log('xa_u:' + xa_u)
      let weixinUnionId = xa_u.split('|')[0]
      let userName = xa_u.split('|')[1]
      if (vue.$route.name !== 'index' && vue.$route.name !== 'rule' && vue.$route.name !== 'affiche' && vue.$route.name !== 'cases') {
        // if (weixinUnionId === '0' && vue.$route.name !== 'bindWeixin') {
        //   // 登录未绑定微信
        //   // vue.$router.push('/bindWeixin')
        //   // console.log(vue.$route.name)
        //   this.authRedirect(vue, '/bindWeixin?redirect_url=' + location.href, '你还未完成微信绑定，请先绑定微信！', '绑定微信页')
        // } else
        if (userName === '0') {
          // 未完善用户信息
          // vue.$router.push('/register?step=2')
          this.authRedirect(vue, '/register?step=2&redirect_url=' + location.href, '请先完善个人信息！', '完善个人信息页')
        }
      }
    } else {
      this.clearAuth(vue)
      this.authRedirect(vue, '/login?redirect_url=' + location.href, '请先登录！', '登录页')
    }
  },
  authRedirect(vue, url, msg, name) {
    let data = {
      url: url,
      msg: msg,
      name: name
    }
    vue.$store.commit('REDIRECT', data)
    vue.$router.push('/redirect')
  },
  // 清除store and cookie
  clearAuth(vue) {
    vue.$store.commit('ISLOGIN', false)
    vue.$store.commit('USERDATA', {})
    vue.$cookie.remove('userId')
    vue.$cookie.remove('xa_u')
    vue.$cookie.remove('userInfo')
    if (vue.$route.loginState == '2') {
      vue.$router.push('/login?redirect_url=' + location.href)
    } else {
      // vue.$router.push('/login')
      vue.$router.push(vue.$route.fullPath)
    }
    this.getMenuInfo(vue);

  },
  // 重置用户store信息
  reSetUserStore(vue) {
    if (Cookie.islogin()) {
      // 登录状态
      let userId = vue.$cookie.get('userId')
      http({
        method: 'GET',
        url: vue.$api.user.getMyInfo,
        params: {userId: userId}
      }).then((res) => {
        if (res.data.returnCode === 1) {
          // vue.$store.commit('USERDATA', res.data.returnObject)
          this.setStore(vue, res.data.returnObject)
        }
      })
    } else {
      this.clearStore()
    }
  },
  getMenuInfo(vue) {
    let userInfo = cookie.get('userInfo') ? JSON.parse(cookie.get('userInfo')) : {rootUserId: '', companyId: ''};
    if (!userInfo.companyId) {
      userInfo.companyId = ''
    }
    http({
      method: 'GET',
      url: vue.$api.authority.getMenuInfo,
      params: {
        userId: userInfo.rootUserId,
        companyId: userInfo.companyId
      }
    }).then((res) => {

      if (res.data.returnCode == 200 || res.data.returnCode == 1) {
        let data = this.menuList(res.data.returnObject)
        vue.$store.commit('MENULIST', data)
        cookie.set('menuList', JSON.parse(data))
      }
    }).catch(() => {
    })
  },
  menuList(val) {
    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < val[i].children.length; j++) {
        for (let m = 0; m < val[i].children[j].children.length; m++) {
          let data = val[i].children[j].children[m];
          if (data.link.indexOf('本公司') > -1) {
            data.link = data.link.replace('本公司', encodeURIComponent('本公司'));
          }
          if (data.link.indexOf('可比公司') > -1) {
            data.link = data.link.replace('可比公司', encodeURIComponent('可比公司'));
          }
          if (data.link.indexOf('关注公司') > -1) {
            data.link = data.link.replace('关注公司', encodeURIComponent('关注公司'));
          }
          if (data.link.indexOf('监管公司') > -1) {
            data.link = data.link.replace('监管公司', encodeURIComponent('监管公司'));
          }
        }
      }
    }
    return val
  }
}
