import Axios from '../service/http'
import api from '../service/api'
export default {
  getMore(params = {}) {
    return Axios({method: 'GET', url: api.stock.getMore, params: params})
  },
  getThrunoverInfo(params = {}) {
    return Axios({method: 'GET', url: api.stock.getThrunoverInfo, params: params})
  },
  getSameIndustryThrunoverInfo(params = {}) {
    return Axios({method: 'GET', url: api.stock.getSameIndustryThrunoverInfo, params: params})
  },
  getDeviationValue(params = {}) {
    return Axios({method: 'GET', url: api.stock.getDeviationValue, params: params})
  },
  getSameIndustryStockInfo(params = {}) {
    return Axios({method: 'GET', url: api.stock.getSameIndustryStockInfo, params: params})
  },
}
