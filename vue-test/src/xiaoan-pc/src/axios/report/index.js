import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 公司自动提示
  autoCompany(params) {
    return Axios({method: 'GET', url: api.report.autoCompany, params: params})
  },
  // 作者自动提示
  autoAuthor(params) {
    return Axios({method: 'GET', url: api.report.autoAuthor, params: params})
  },
  newReport(params) {
    return Axios({method: 'GET', url: api.report.newReport, params: params})
  },
  reportDetail(params) {
    return Axios({method: 'GET', url: api.report.reportDetail, params: params})
  },
  searchReport(params) {
    return Axios({method: 'GET', url: api.report.searchReport, params: params})
  },
  // 筛选搜索
  searchReportS(params) {
    return Axios({method: 'GET', url: api.report.searchReportS, params: params})
  },
  getIndustryList(params) {
    return Axios({method: 'GET', url: api.report.getIndustryList, params: params})
  },
  getIndustryReport(params) {
    return Axios({method: 'GET', url: api.report.getIndustryReport, params: params})
  },
  // 获取行业报告相关内容
  releaseAffiche_I(params) {
    return Axios({method: 'GET', url: api.report.releaseAffiche_I, params: params})
  },
  // 获取综合报告相关内容
  releaseAffiche_T(params) {
    return Axios({method: 'GET', url: api.report.releaseAffiche_T, params: params})
  },
  // 获取公司报相关内容
  releaseAffiche_C(params) {
    return Axios({method: 'GET', url: api.report.releaseAffiche_C, params: params})
  }

}
