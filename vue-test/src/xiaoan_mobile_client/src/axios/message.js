import Axios from '../service/http'
import api from '../service/api'
export default {
  getManageByUserId(params = {}) {
    return Axios({method: 'GET', url: api.massage.getManageByUserId, params: params})
  },
  updateStarted(params = {}) {
    return Axios({method: 'POST', url: api.massage.updateStarted, params: params, emulateJSON: true})
  }
}
