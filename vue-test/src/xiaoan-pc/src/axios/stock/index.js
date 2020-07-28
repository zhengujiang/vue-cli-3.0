import Axios from "@/service/http";
import api from '@/service/api/index';

export default {
  //  股票行情想关API
  //  获取K线
  getStockKLineData(params) {
    return Axios({method: 'GET', url: api.stock.getStockKLineData, params: params})
  },
  //  获取时间K线
  getStockTimeKLineData(params) {
    return Axios({method: 'GET', url: api.stock.getStockTimeKLineData, params: params})
  },
  //  
  getStockInfo(params) {
    return Axios({method: 'GET', url: api.stock.getStockInfo, params: params})
  },
  //  获取更多行情数据
  getMore(params) {
    return Axios({method: 'GET', url: api.stock.getMore, params: params})
  },
  //  批量获取行情
  getStockInfoByCodes(params) {
    return Axios({method: 'GET', url: api.stock.getStockInfoByCodes, params: params})
  },
  //  获取我关注的公司
  getMyAttentions(params) {
    return Axios({method: 'GET', url: api.stock.getMyAttentions, params: params})
  },
  //  申万 和证监会
  listAllSameIndustryCompany(params) {
    return Axios({method: 'GET', url: api.stock.listAllSameIndustryCompany, params: params})
  },
  //  申万 和证监会
  listSameIndustryCompany(params) {
    return Axios({method: 'GET', url: api.stock.listSameIndustryCompany, params: params})
  },
  //  比较
  listSameIndustryFinData(params) {
    return Axios({method: 'POST', url: api.stock.listSameIndustryFinData, params: params})
  },
  //  
  getDeviationValue(params) {
    return Axios({method: 'GET', url: api.stock.getDeviationValue, params: params})
  },
  //  
  listMarketSituation(params) {
    return Axios({method: 'GET', url: api.stock.listMarketSituation, params: params})
  },
  //  获取同行业行情
  getSameIndustryStockInfo(params) {
    return Axios({method: 'GET', url: api.stock.getSameIndustryStockInfo, params: params})
  },
  //  获取换手率
  getThrunoverInfo(params) {
    return Axios({method: 'GET', url: api.stock.getThrunoverInfo, params: params})
  },
  //  
  getSameIndustryThrunoverInfo(params) {
    return Axios({method: 'GET', url: api.stock.getSameIndustryThrunoverInfo, params: params})
  },
  searchStock(params) {
    return Axios({method: 'GET', url: api.stock.searchStock, params: params})
  },
  addAttention(params) {
    return Axios({method: 'GET', url: api.stock.addAttention, params: params})
  },
  deleteAttention(params) {
    return Axios({method: 'GET', url: api.stock.deleteAttention, params: params})
  },
  batchDeleteAttention(params) {
    return Axios({method: 'GET', url: api.stock.batchDeleteAttention, params: params})
  },
  getStockChangeAnnouncement(params) {
    return Axios({method: 'GET', url: api.stock.getStockChangeAnnouncement, params: params})
  },
  getStockChangeForReportList(params) {
    return Axios({method: 'GET', url: api.stock.getStockChangeForReportList, params: params})
  }
}   
