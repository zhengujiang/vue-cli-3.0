import Axios from '../service/http'
import api from '../service/api'
export default {
    wxAuthByCode(params = {}) {
      return Axios({method: 'GET', url: api.wxAuth.wxAuthByCode, params: params})
    }
}
