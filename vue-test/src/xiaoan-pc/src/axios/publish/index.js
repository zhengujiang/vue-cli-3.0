import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // ipo 筛选项
  filterConditions(params) {
    return Axios({method: 'GET', url: api.publish.filterConditions, params: params})
  },
  // ipo 筛选项
  search(params) {
    return Axios({method: 'GET', url: api.publish.search, params: params})
  },
  // ipo 详情
  getDetails(params) {
    return Axios({method: 'GET', url: api.publish.getDetails, params: params})
  },
  // 筛选条件
  retrialFilterConditions(params) {
    return Axios({method: 'GET', url: api.publish.retrialFilterConditions, params: params})
  },
  // 获取IPO在审公司分布数据
  getDistributionFromAuditing(params) {
    return Axios({method: 'GET', url: api.publish.getDistributionFromAuditing, params: params})
  },
  // 查询在审信息列表
  searchAuditingCompany(params) {
    return Axios({method: 'POST', url: api.publish.searchAuditingCompany, params: params})
  },
  // IPO在审公司所属板块统计信息
  getMarketFromAuditing(params) {
    return Axios({method: 'GET', url: api.publish.getMarketFromAuditing, params: params})
  },
  // 获取IPO在审公司审核状态统计信息
  getAuditStatusFromAuditing(params) {
    return Axios({method: 'GET', url: api.publish.getAuditStatusFromAuditing, params: params})
  },
  // 获取热词
  getHotWords(params) {
    return Axios({method: 'GET', url: api.publish.getHotWords, params: params})
  },
  // 过会公司列表
  getIpoCompanyInfoList(params) {
    return Axios({method: 'POST', url: api.publish.getIpoCompanyInfoList, params: params})
  },
  // 上会公司
  getInstitutionFromAuditing(params) {
    return Axios({method: 'GET', url: api.publish.getInstitutionFromAuditing, params: params})
  },
  // 上会公司
  getDataSourceId(params) {
    return Axios({method: 'GET', url: api.publish.getDataSourceId, params: params})
  },
  getInstitutionData(params) {
    return Axios({method: 'GET', url: api.publish.getInstitutionData, params: params})
  },
  getIpoBoardData(params) {
    return Axios({method: 'GET', url: api.publish.getIpoBoardData, params: params})
  },
  getDistributionData(params) {
    return Axios({method: 'GET', url: api.publish.getDistributionData, params: params})
  },
  getLastOneYearInfo(params) {
    return Axios({method: 'GET', url: api.publish.getLastOneYearInfo, params: params})
  },
  getIndustryList(params) {
    return Axios({method: 'GET', url: api.publish.getIndustryList, params: params})
  }
}
