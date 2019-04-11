import Axios from '../service/http'
import api from '../service/api'
export default {
    getDetails(params = {}) {
        return Axios({ method: 'GET', url: api.law.getDetails, params: params })
    },
    search(params = {}) {
        return Axios({ method: 'GET', url: api.law.search, params: params })
    },
    autoComplete(params = {}) {
        return Axios({ method: 'GET', url: api.law.autoComplete, params: params })
    },
    getalllmappingrules(params = {}) {
        return Axios({ method: 'GET', url: api.law.getalllmappingrules, params: params })
    },
    getHotSearch(params = {}) {
        return Axios({ method: 'GET', url: api.law.getHotSearch, params: params })
    },
}
