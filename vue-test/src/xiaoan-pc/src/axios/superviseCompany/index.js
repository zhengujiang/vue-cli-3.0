import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 批量添加监管公司
  addSuperviseCompanyList(params) {
    return Axios({method: 'POST', url: api.superviseCompany.addSuperviseCompanyList, params: params})
  },
  // 批量删除监管公司
  deleteSuperviseCompanyList(params) {
    return Axios({method: 'PUT', url: api.superviseCompany.deleteSuperviseCompanyList, params: params})
  },
  // 通过userId获取用户所有的监管公司
  getAllSuperviseCompanyByUser(params) {
    return Axios({method: 'GET', url: api.superviseCompany.getAllSuperviseCompanyByUser, params: params})
  },
  // 获取市场舆情
  getMarketSentiment(params) {
    return Axios({method: 'GET', url: api.superviseCompany.getMarketSentiment, params: params})
  },
  // 通过userId搜索用户的监管公司行情等详细信息
  getSuperviseCompanyList(params) {
    return Axios({method: 'GET', url: api.superviseCompany.getSuperviseCompanyList, params: params})
  },
  // 获取监管公司舆情统计
  getSuperviseCompanySentimentTotal(params) {
    return Axios({method: 'GET', url: api.superviseCompany.getSuperviseCompanySentimentTotal, params: params})
  },
  // 根据关键词搜索上市公司
  searchCompanyByKeyWord(params) {
    return Axios({method: 'GET', url: api.superviseCompany.searchCompanyByKeyWord, params: params})
  },
  // 监管动态
  // 公司市值
  companyMV(params) {
    return Axios({method: 'GET', url: api.superviseCompany.companyMV, params: params})
  },
  // e互动TOP10
  eInteractInfo(params) {
    return Axios({method: 'GET', url: api.superviseCompany.eInteractInfo, params: params})
  },
  // listSuperviseDynamic
  listSuperviseDynamic(params) {
    return Axios({method: 'GET', url: api.superviseCompany.listSuperviseDynamic, params: params})
  },
  // 市场概览
  marketoverview(params) {
    return Axios({method: 'GET', url: api.superviseCompany.marketoverview, params: params})
  },
  // 监管公司概览
  superviseoverview(params) {
    return Axios({method: 'GET', url: api.superviseCompany.superviseoverview, params: params})
  },
  // 违规案例
  violateCase(params) {
    return Axios({method: 'GET', url: api.superviseCompany.violateCase, params: params})
  },
  // 预警
  warningoverview(params) {
    return Axios({method: 'GET', url: api.superviseCompany.warningoverview, params: params})
  }
}
