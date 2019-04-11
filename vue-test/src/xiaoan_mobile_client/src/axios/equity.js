import Axios from '../service/http'
import api from '../service/api'
export default {
  addEquityPledge(params = {}) {
    return Axios({method: 'POST', url: api.equity.addEquityPledge, params: params, emulateJSON: true})
  }
}
