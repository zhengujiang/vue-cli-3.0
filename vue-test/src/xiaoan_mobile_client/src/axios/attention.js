import Axios from '../service/http'
import api from '../service/api'
export default {
  getAttentions(params = {}) {
    return Axios({method: 'GET', url: api.attention.getAttentions, params: params})
  },
  deleteAttention(params = {}) {
    return Axios({method: 'GET', url: api.attention.deleteAttention, params: params})
  },
  getIndustry(params = {}) {
    return Axios({method: 'GET', url: api.attention.getIndustry, params: params})
  },
  oneKeyAttention(params = {}) {
    return Axios({method: 'GET', url: api.attention.oneKeyAttention, params: params})
  },
  oneKeyCancel(params = {}) {
    return Axios({method: 'GET', url: api.attention.oneKeyCancel, params: params})
  },
  searchStock(params = {}) {
    return Axios({method: 'GET', url: api.attention.searchStock, params: params})
  },
  addAttention(params = {}) {
    return Axios({method: 'GET', url: api.attention.addAttention, params: params})
  },
  getStockInfo(params = {}) {
    return Axios({method: 'GET', url: api.attention.getStockInfo, params: params})
  }
}
