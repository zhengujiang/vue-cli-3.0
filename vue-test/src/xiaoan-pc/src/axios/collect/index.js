import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  //
  getCollectContent: function (params = {}) {
    let data = Object.assign({}, params, {isDesktop: 'y'})
    return Axios({method: 'GET', url: api.user.getCollectContent, params: data})
  },
  //
  deleteCollectById: function (params = {}) {
    return Axios({method: 'POST', url: api.user.delCollectList, params: params})
  }
}
