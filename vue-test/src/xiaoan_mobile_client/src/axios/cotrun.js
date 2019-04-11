import Axios from '../service/http'
import api from '../service/api'
export default {
  calcScore(params = {}) {
    return Axios({method: 'POST', url: api.cotrun.calcScore, data: params, emulateJSON: true})
  },
  getConditions(params = {}) {
    return Axios({method: 'GET', url: api.cotrun.getConditions, params: params})
  },
  getUserCotrunRecord(params = {}) {
    return Axios({method: 'GET', url: api.cotrun.getUserCotrunRecord, params: params})
  },
}
