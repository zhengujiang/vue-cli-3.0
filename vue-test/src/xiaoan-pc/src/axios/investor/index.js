import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  //  投资者关系
  // shaixuan
  conditions(params) {
    return Axios({method: 'GET', url: api.investor.conditions, params: params})
  },
  // shousuo
  search(params) {
    return Axios({method: 'GET', url: api.investor.search, params: params})
  },
  // 根据公司代码获取跳转链接
  getHrefByCompanyCode(params) {
    return Axios({method: 'GET', url: api.investor.getHrefByCompanyCode, params: params})
  },
  // 根据公司代码获取跳转链接
  getRelationQuestion(params) {
    return Axios({method: 'GET', url: api.investor.getRelationQuestion, params: params})
  },
  // 问答详情
  getQuestionDetail(params) {
    return Axios({method: 'GET', url: api.investor.getQuestionDetail, params: params})
  },
  // 问答详情
  getInvosterQuestionCompany(params) {
    return Axios({method: 'GET', url: api.investor.getInvosterQuestionCompany, params: params})
  },
  // 获取投资者提问数
  getInvosterQuestionCount(params) {
    return Axios({method: 'GET', url: api.investor.getInvosterQuestionCount, params: params})
  },
  // 投资者词云
  getKeywordByUserName(params) {
    return Axios({method: 'GET', url: api.investor.getKeywordByUserName, params: params})
  },
  // 获取市场平均数据
  getMarketAverageSummary(params) {
    return Axios({method: 'GET', url: api.investor.getMarketAverageSummary, params: params})
  },
  // 获取市场平均数据
  getMaxQuestionCountUser(params) {
    return Axios({method: 'GET', url: api.investor.getMaxQuestionCountUser, params: params})
  },
  // 获取公司词云
  getKeywordByCompanyCode(params) {
    return Axios({method: 'GET', url: api.investor.getKeywordByCompanyCode, params: params})
  },
  // 公司与行业对比数据接口
  getCompanyMarketCompareData(params) {
    return Axios({method: 'GET', url: api.investor.getCompanyMarketCompareData, params: params})
  },
  // 获取公司市场排名
  getCompanyIndexFromMarket(params) {
    return Axios({method: 'GET', url: api.investor.getCompanyIndexFromMarket, params: params})
  },
  // 获取同行业问答情况及公司排名
  getIndustryIndexData(params) {
    return Axios({method: 'GET', url: api.investor.getIndustryIndexData, params: params})
  },
  // 获取公司问答情况总览
  getCompanySummaryByEnum(params) {
    return Axios({method: 'GET', url: api.investor.getCompanySummaryByEnum, params: params})
  },
  // 获取市场问答情况总览
  getMarketSummaryByEnum(params) {
    return Axios({method: 'GET', url: api.investor.getMarketSummaryByEnum, params: params})
  },
  // 获取市场词云
  getKeywordByMarket(params) {
    return Axios({method: 'GET', url: api.investor.getKeywordByMarket, params: params})
  },
  // 获取前十排行榜
  getInteractTopTenRank(params) {
    return Axios({method: 'GET', url: api.investor.getInteractTopTenRank, params: params})
  }
}
