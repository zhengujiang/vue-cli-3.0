import Axios from "@/service/http";
import api from '@/service/api/index'
 // 企业公司
export default {
  // 获取可比公司
  getCompanyCompare(params) {
    return Axios({method: 'GET', url: api.enterpriseCompany.getCompanyCompare, params: params})
  },
  // 查询用户下的公司
  getCompanyByUser(params) {
    return Axios({method: 'GET', url: api.enterpriseCompany.getCompanyByUser, params: params})
  },
  // 
  getEnterprisePackage(params) {
    return Axios({method: 'GET', url: api.enterpriseCompany.getEnterprisePackage, params: params})
  },
  // 移交管理权限
  changeCompanyAdmin(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.changeCompanyAdmin, params: params})
  },
  // 切换公司
  changeCompany(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.changeCompany, params: params})
  },
  // 切换公司
  searchCompany(params) {
    return Axios({method: 'GET', url: api.enterpriseCompany.searchCompany, params: params})
  },
  // 添加可比公司
  addCompanyCompare(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.addCompanyCompare, params: params})
  },
  // 添加用户企业版登录日志
  addUserLoginRecord(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.addUserLoginRecord, params: params})
  },
  // 
  sendExitSms(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.sendExitSms, params: params})
  },
  // 删除可比公司
  deleteCompanyCompare(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.deleteCompanyCompare, params: params})
  },
  // 添加续费企业订单
  addEnterpriseOrder(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.addEnterpriseOrder, params: params})
  },
  // 退出公司
  exitCompany(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.exitCompany, params: params})
  },
  // 
  sendRemoveMemberSms(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.sendRemoveMemberSms, params: params})
  },
  sendTransferAdminSms(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.sendTransferAdminSms, params: params})
  },
  uploadPicByBase64(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.uploadPicByBase64, params: params})
  },
  applyEnterprise(params) {
    return Axios({method: 'POST', url: api.enterpriseCompany.applyEnterprise, params: params})
  } 
}
