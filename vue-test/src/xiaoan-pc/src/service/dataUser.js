import axios from './http'
const dataUser = {
  // 获取用户信息
  getUserInfo: (vue) => {
    let userId = vue.$cookie.get('userId')
    return axios({method: 'GET', url: vue.$api.user.getMyInfo, params: {userId: userId}})
  },
  // 验证用户手机号是否注册 （returnCode = 1 true = 未注册）
  checkmobileexist: (vue, mobile) => {
    return axios({method: 'GET', url: vue.$api.user.checkmobileexist, params: {mobile: mobile}, message: 'none'})
  },
  // 发送手机验证码
  sendsmscode: (vue, mobile, type, userId) => {
    // let userId = vue.$cookie.get('userId')
    let params = {}
    if (userId) {
      params = {mobile: mobile, type: type, userId: userId}
    } else {
      params = {mobile: mobile, type: type}
    }
    return axios({method: 'GET', url: vue.$api.user.sendsmscode, params: params, message: 'none'})
  },
  // 扫码登录后，未绑定用户，绑定微信号
  binduserafterqrscan: (vue, mobile, smscode) => {
    return axios({
      method: 'POST',
      url: vue.$api.user.binduserafterqrscan,
      params: {mobile: mobile, smscode: smscode},
      message: 'none'
    })
  },
  // 重新绑定微信
  changeweixinafterqrscan: (vue, mobile, smscode) => {
    return axios({
      method: 'POST',
      url: vue.$api.user.changeweixinafterqrscan,
      params: {mobile: mobile, smscode: smscode},
      message: 'none'
    })
  },
  // 验证图形验证码
  imgCodeCheck: (vue, code) => {
    return axios({method: 'GET', url: vue.$api.user.imgcodecheck, params: {code: code}})
  },
  // 获取用户公司类型
  getCompanyinfo: (vue) => {
    return axios({method: 'GET', url: vue.$api.user.getCompanyinfo, params: {}})
  },
  // 获取用户职位
  getPosition: (vue) => {
    return axios({method: 'GET', url: vue.$api.user.getPosition, params: {}})
  },
  // 根据股票代码获取公司名称
  getStockCode: (vue, companyCode) => {
    return axios({method: 'GET', url: vue.$api.user.getStockCode, params: {companyCode: companyCode}, message: 'none'})
  },
  // 补全用户信息
  completePersonInfo: (vue, data) => {
    let form = new FormData();
    for (let i in data) {
      form.append(i, data[i]);
    }
    return axios({
      method: 'POST',
      headers: {"Content-Type": "multipart/form-data"},
      url: vue.$api.user.completePersonInfo,
      data: form
    })
  },
  // 注册
  // 微信扫码后，手机号注册
  mobileregister: (vue, params) => {
    return axios({method: 'POST', url: vue.$api.user.mobileregister, params: params})
  },
  // 修改，绑定手机号
  bindmobile: (vue, mobile, code) => {
    let userId = vue.$cookie.get('userId')
    return axios({method: 'POST', url: vue.$api.user.bindmobile, params: {userId: userId, mobile: mobile, code: code}})
  },
  // 修改密码
  modifyloginpassword: (vue, oldPassword, newPassword, code) => {
    let userId = vue.$cookie.get('userId')
    return axios({
      method: 'POST',
      url: vue.$api.user.modifyloginpassword,
      params: {userId: userId, oldPassword: oldPassword, newPassword: newPassword, code: code}
    })
  },
  // 重置密码
  findloginpassword: (vue, mobile, password, code) => {
    return axios({
      method: 'POST',
      url: vue.$api.user.findloginpassword,
      params: {mobile: mobile, password: password, code: code}
    })
  },
  // 修改邮箱
  updateemail: (vue, email) => {
    let userId = vue.$cookie.get('userId')
    return axios({method: 'GET', url: vue.$api.user.updateemail, params: {userId: userId, email: email}})
  }
}

export default dataUser
