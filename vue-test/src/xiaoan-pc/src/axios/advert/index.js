import Axios from "@/service/http";
import api from '@/service/api/index'
// 精选
export default {
  getAdvertByType(params) {
    return Axios({method: 'GET', url: api.advert.getAdvertByType, params: params})
  },
  getAdvertList(params) {
    return Axios({method: 'GET', url: api.advert.getAdvertList, params: params})
  },
  getAdvertType(params) {
    return Axios({method: 'GET', url: api.advert.getAdvertType, params: params})
  }
}
