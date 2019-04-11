import Axios from '../service/http'
import api from '../service/api'
export default {
  getBrowsing(params = {}) {
    return Axios({method: 'GET', url: api.browsing.getBrowsing, params: params})
  },
  deleteByUserId(params = {}) {
    return Axios({method: 'POST', url: api.browsing.deleteByUserId, params: params, emulateJSON: true})
  },
}
