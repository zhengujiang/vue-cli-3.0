import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 违规案例标题自动补全
  autoCompleteC(params) {
    return Axios({method: 'GET', url: api.cases.autoCompleteC, params: params})
  },
  // 获取违规案例详情信息
  getdetailsC(params) {
    return Axios({method: 'GET', url: api.cases.getdetailsC, params: params})
  },
  // 获取违规案例筛选条件
  getFilter(params) {
    return Axios({method: 'GET', url: api.cases.getFilter, params: params})
  },
  // 获取违规案例热搜
  getCaseHotSearch(params) {
    return Axios({method: 'GET', url: api.cases.getCaseHotSearch, params: params})
  },
  // 违规案例查询
  searchC(params) {
    return Axios({method: 'POST', url: api.cases.searchC, params: params})
  }
}
