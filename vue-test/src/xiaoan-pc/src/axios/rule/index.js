import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  autoComplete(params) {
    return Axios({method: 'GET', url: api.rule.autoComplete, params: params})
  },
  /* 获取筛选的类 */
  getalllmappingrules(params) {
    return Axios({method: 'GET', url: api.rule.getalllmappingrules, params: params})
  },
  getHotSearch(params) {
    return Axios({method: 'GET', url: api.rule.getHotSearch, params: params})
  },
  getDetails(params) {
    return Axios({method: 'GET', url: api.rule.getDetails, params: params})
  },
  lawSearch(params) {
    return Axios({method: 'GET', url: api.rule.lawSearch, params: params})
  }
}
