import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  //
  chartIndustrySentimentTop5: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartIndustrySentimentTop5, params: params})
  },
  chartIndustryHeatCompanyTop10: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartIndustryHeatCompanyTop10, params: params})
  },
  chartMarketSentiment: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartMarketSentiment, params: params})
  },
  chartSourceStatistics: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartSourceStatistics, params: params})
  },
  chartSentimentTrend: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartSentimentTrend, params: params})
  },
  chartChannelAnalysis: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartChannelAnalysis, params: params})
  },
  listSuperviseDynamic: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listSuperviseDynamic, params: params})
  },
  countSentiments: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.countSentiments, params: params})
  },
  // 公司舆情列表
  listCompanySentiment: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listCompanySentiment, params: params})
  },
  // 市场舆情
  listMarketSentiment: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listMarketSentiment, params: params})
  },
  // 行业舆情
  listIndustrySentiment: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listIndustrySentiment, params: params})
  },
  // 公司舆情Top10
  listCompanySentimentTop10: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listCompanySentimentTop10, params: params})
  },
  // 同行业对比
  listComparisonWithIndustry: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listComparisonWithIndustry, params: params})
  },
  // 舆情搜索
  sentimentSearch: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.sentimentSearch, params: params})
  },
  // 关键字
  hotWords: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.hotWords, params: params})
  },
  // 相似时间轴
  newsDir: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.newsDir, params: params})
  },
  companyNewsDir: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.companyNewsDir, params: params})
  },
  // 可比公司
  getCompanyCompare: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.getCompanyCompare, params: params})
  },
  // 删除可比公司
  deleteCompanyCompare: function (params = {}) {
    return Axios({method: 'POST', url: api.sentiment.deleteCompanyCompare, params: params})
  },
  // 生成报告列表
  report: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.report, params: params})
  },
  // 一键生成报告
  generateSentimentReport: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.generateSentimentReport, params: params})
  },
  // 删除生成报告
  sentimentReportLogDel: function (params = {}) {
    return Axios({method: 'DELETE', url: api.sentiment.sentimentReportLogDel, params: params})
  },

  // 自定义
  sentimentPlans: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.sentimentPlans, params: params})
  },
  sentimentDelPlans: function (params = {}) {
    return Axios({method: 'DELETE', url: api.sentiment.sentimentDelPlans, params: params})
  },
  getCompanySentimentPlans: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.getCompanySentimentPlans, params: params})
  },
  updateCompanySentimentPlans: function (params = {}) {
    return Axios({method: 'POST', url: api.sentiment.updateCompanySentimentPlans, data: params, emulateJSON: true})
  },
  updateSentimentPlans: function (params = {}) {
    return Axios({method: 'POST', url: api.sentiment.updateSentimentPlans, data: params, emulateJSON: true})
  },
  manager: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.manager, params: params})
  },
  createSentimentPlans: function (params = {}) {
    return Axios({method: 'POST', url: api.sentiment.createSentimentPlans, data: params, emulateJSON: true})
  },
  company: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.company, params: params})
  },
  industry: function (params = {}) {
    return Axios({method: 'GET', url: api.sentiment.industry, params: params})
  }
}
