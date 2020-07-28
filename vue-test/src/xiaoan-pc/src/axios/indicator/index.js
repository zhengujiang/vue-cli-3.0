import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 财务数据
  listIndicators(params) {
    return Axios({method: 'GET', url: api.indicator.listIndicators, params: params})
  },
  listMainIndicatorsData(params) {
    return Axios({method: 'GET', url: api.indicator.listMainIndicatorsData, params: params})
  },
  listFinancialData(params) {
    return Axios({method: 'GET', url: api.indicator.listFinancialData, params: params})
  },
  chartMainIndicatorsData(params) {
    return Axios({method: 'GET', url: api.indicator.chartMainIndicatorsData, params: params})
  },
  listCompareCompany(params) {
    return Axios({method: 'GET', url: api.indicator.listCompareCompany, params: params})
  }
}
