import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  autoCompleteA(params) {
    return Axios({method: 'GET', url: api.affiche.autoCompleteA, params: params})
  },
  // 公告热门搜索
  hotSearch(params) {
    return Axios({method: 'GET', url: api.affiche.hotSearch, params: params})
  },
  // 公告查询
  afficheSearch(params) {
    return Axios({method: 'POST', url: api.affiche.afficheSearch, params: params})
  },
  // 公告详情
  afficheContent(params) {
    return Axios({method: 'GET', url: api.affiche.afficheContent, params: params})
  }
  
}
