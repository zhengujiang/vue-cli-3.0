import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 企业管理
  companyInfo(params) {
    return Axios({method: 'GET', url: api.manage.companyInfo, params: params})
  },
  updateCompanyAccount(params) {
    return Axios({method: 'POST', url: api.manage.updateCompanyAccount, params: params})
  },
  getByCompanyCode(params) {
    return Axios({method: 'GET', url: api.manage.getByCompanyCode, params: params})
  },
  checkMobileExist(params) {
    return Axios({method: 'GET', url: api.manage.checkMobileExist, params: params})
  },
  getByCompanyId(params) {
    return Axios({method: 'GET', url: api.manage.getByCompanyId, params: params})
  },
  generateInvitationUrl(params) {
    return Axios({method: 'GET', url: api.manage.generateInvitationUrl, params: params})
  },
  checkInviteLink(params) {
    return Axios({method: 'GET', url: api.manage.checkInviteLink, params: params})
  },
  acceptInvited(params) {
    return Axios({method: 'POST', url: api.manage.acceptInvited, params: params})
  },
  cancelInvited(params) {
    return Axios({method: 'POST', url: api.manage.cancelInvited, params: params})
  },
  listUserByCompanyId(params) {
    return Axios({method: 'POST', url: api.manage.listUserByCompanyId, params: params})
  },
  inviteUsers(params) {
    return Axios({method: 'POST', url: api.manage.inviteUsers, params: params})
  },
  deleteInvite(params) {
    return Axios({method: 'GET', url: api.manage.deleteInvite, params: params})
  },
  getInvitationUrl(params) {
    return Axios({method: 'POST', url: api.manage.getInvitationUrl, params: params})
  },
  cancelUser(params) {
    return Axios({method: 'POST', url: api.manage.cancelUser, params: params})
  },
  removeUser(params) {
    return Axios({method: 'POST', url: api.manage.removeUser, params: params})
  },
  checkInvitedUserLimit(params) {
    return Axios({method: 'GET', url: api.manage.checkInvitedUserLimit, params: params})
  },
  getCompanyInfoFromInviteLink(params) {
    return Axios({method: 'GET', url: api.manage.getCompanyInfoFromInviteLink, params: params})
  },
  updateUserInfo(params) {
    return Axios({method: 'POST', url: api.manage.updateUserInfo, params: params})
  },
  // 检查事项节点是否存在于指定日历
  checkNodeInCalendar(params) {
    return Axios({method: 'GET', url: api.manage.checkNodeInCalendar, params: params})
  }
}
