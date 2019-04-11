import Axios from '../service/http'
import api from '../service/api'
export default {
    getCollect(params = {}) {
        return Axios({method: 'GET', url: api.collect.getCollect, params: params})
      },
    deleteCollectById(params = {}) {
        return Axios({method: 'POST', url: api.collect.deleteCollectById, params: params, emulateJSON:true})
      },
    addCollect(params = {}) {
        return Axios({method: 'GET', url: api.collect.addCollect, params: params})
      },
}
