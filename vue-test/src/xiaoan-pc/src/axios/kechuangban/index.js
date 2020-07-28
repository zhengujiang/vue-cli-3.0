import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  //  获取科创板新闻
  getStibNews(params) {
    return Axios({method: 'GET', url: api.kechuangban.getStibNews, params: params})
  },
  // 获取科创板监管动态
  getStibSupervise(params) {
    return Axios({method: 'GET', url: api.kechuangban.getStibSupervise, params: params})
  },
  // 获取科创板ipo检索
  listStibPublish(params) {
    return Axios({method: 'GET', url: api.kechuangban.listStibPublish, params: params})
  },
  // 获取科创板审核动态
  getStibDataSource(params) {
    return Axios({method: 'POST', url: api.kechuangban.getStibDataSource, params: params})
  },
  // 获取科创板ipo详情
  getStibDetails(params) {
    return Axios({method: 'GET', url: api.kechuangban.getStibDetails, params: params})
  },
  // 获取科创板再审统计图表
  getStibAnalysisInfo(params) {
    return Axios({method: 'GET', url: api.kechuangban.getStibAnalysisInfo, params: params})
  },
  // 获取科创板再审统计筛选条件
  getStibConditions(params) {
    return Axios({method: 'GET', url: api.kechuangban.getStibConditions, params: params})
  },
  // 获取科创板在审详情
  getStibDetailsFromDB(params) {
    return Axios({method: 'GET', url: api.kechuangban.getStibDetailsFromDB, params: params})
  },
  // 获取科创板在审详情
  getAdvertInfo(params) {
    return Axios({method: 'GET', url: api.kechuangban.getAdvertInfo, params: params})
  }
}
