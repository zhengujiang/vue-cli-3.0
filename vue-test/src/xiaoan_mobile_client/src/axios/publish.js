import Axios from '../service/http'
import api from '../service/api'
export default {
    getDetails(params = {}) {
        return Axios({method: 'GET', url: api.publish.getDetails, params: params})
      },
    listPublish(params = {}) {
        return Axios({method: 'GET', url: api.publish.listPublish, params: params})
      },
    filterConditions(params = {}) {
        return Axios({method: 'GET', url: api.publish.filterConditions, params: params})
      },
}
