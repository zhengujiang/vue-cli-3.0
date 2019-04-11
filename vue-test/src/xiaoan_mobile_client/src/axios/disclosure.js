import Axios from '../service/http'
import api from '../service/api'
export default {
  getAnnouncementByAttend(params = {}) {
    return Axios({method: 'GET', url: api.disclosure.getAnnouncementByAttend, params: params})
  },
  getDetails(params = {}) {
    return Axios({method: 'GET', url: api.disclosure.getDetails, params: params})
  },
  search(params = {}) {
    return Axios({method: 'GET', url: api.disclosure.search, params: params})
  },
  getHotSearch(params = {}) {
    return Axios({method: 'GET', url: api.disclosure.getHotSearch, params: params})
  },
}
