import Axios from '../service/http'
import api from '../service/api'
export default {
  userhome(params = {}) {
    return Axios({method: 'GET', url: api.userHome.userhome, params: params})
  },
}
