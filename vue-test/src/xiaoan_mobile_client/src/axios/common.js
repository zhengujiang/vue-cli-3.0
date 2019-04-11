import Axios from '../service/http'
import api from '../service/api'
export default {
    autoComplete(params = {}) {
        return Axios({ method: 'GET', url: api.common.autoComplete, params: params })
    },
    getStockCode(params = {}) {
        return Axios({ method: 'GET', url: api.common.getStockCode, params: params })
    },
    getAdvertType(params = {}) {
        return Axios({ method: 'GET', url: api.common.getAdvertType, params: params })
    },
    getAdvertInfo(params = {}) {
        return Axios({ method: 'GET', url: api.common.getAdvertInfo, params: params })
    },
    getAdvertByType(params = {}) {
        return Axios({ method: 'GET', url: api.common.getAdvertByType, params: params })
    },
    getAdvertImg(params = {}) {
        return Axios({ method: 'GET', url: api.common.getAdvertImg, params: params })
    },
    getYearSummaryByCode(params = {}) {
        return Axios({ method: 'POST', url: api.common.getYearSummaryByCode, params: params, emulateJSON: true })
    },
    getCompanyCount(params = {}) {
        return Axios({ method: 'GET', url: api.common.getCompanyCount, params: params })
    },
    getCompanyInfoByName(params = {}) {
        return Axios({ method: 'GET', url: api.common.getCompanyInfoByName, params: params })
    },
  get2018YearSummaryByCode(params = {}) {
      return Axios({ method: 'GET', url: api.common.get2018YearSummaryByCode, params: params })
    }
}
