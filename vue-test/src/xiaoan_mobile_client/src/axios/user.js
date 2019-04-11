import Axios from '../service/http'
import api from '../service/api'
export default {
  bindingWxInfoByCode(params = {}) {
    return Axios({ method: 'POST', url: api.user.bindingWxInfoByCode, params: params, emulateJSON: true })
  },
  loginByMobileAndCode(params = {}) {
    return Axios({ method: 'POST', url: api.user.loginByMobileAndCode, params: params, emulateJSON: true })
  },
  bindingWxInfo(params = {}) {
    return Axios({ method: 'POST', url: api.user.bindingWxInfo, params: params, emulateJSON: true })
  },
  loginByWeixin(params = {}) {
    return Axios({ method: 'GET', url: api.user.loginByWeixin, params: params })
  },
  checkMobileBindWeixin(params = {}) {
    return Axios({ method: 'GET', url: api.user.checkMobileBindWeixin, params: params })
  },
  searchUserData(params = {}) {
    return Axios({ method: 'GET', url: api.user.searchUserData, params: params })
  },
  completePersonInfo(params = {}) {
    return Axios({ method: 'POST', url: api.user.completePersonInfo, params: params, emulateJSON: true })
  },
  getUserCompanyInfo(params = {}) {
    return Axios({ method: 'GET', url: api.user.getUserCompanyInfo, params: params })
  },
  getUserPosition(params = {}) {
    return Axios({ method: 'GET', url: api.user.getUserPosition, params: params })
  },
  imgCodeCheck(params = {}) {
    return Axios({ method: 'GET', url: api.user.imgCodeCheck, params: params })
  },
  mobileLogin(params = {}) {
    return Axios({ method: 'GET', url: api.user.mobileLogin, params: params })
  },
  checkMobileExist(params = {}) {
    return Axios({ method: 'GET', url: api.user.checkMobileExist, params: params })
  },
  exit(params = {}) {
    return Axios({ method: 'GET', url: api.user.exit, params: params })
  },
  sendSmsCode(type, params = {}) {
    return Axios({ method: type, url: api.user.sendSmsCode, params: params })
  },
  findLoginPassword(params = {}) {
    return Axios({ method: 'POST', url: api.user.findLoginPassword, params: params, emulateJSON: true })
  },
  modifyLoginPassword(params = {}) {
    return Axios({ method: 'POST', url: api.user.modifyLoginPassword, params: params, emulateJSON: true })
  },
  bindMobile(params = {}) {
    return Axios({ method: 'POST', url: api.user.bindMobile, params: params, emulateJSON: true })
  },
  mobileRegister(params = {}) {
    return Axios({ method: 'POST', url: api.user.mobileRegister, params: params, emulateJSON: true })
  },
  updateSynopsisByUserId(params = {}) {
    return Axios({ method: 'POST', url: api.user.updateSynopsisByUserId, params: params, emulateJSON: true })
  },
}
