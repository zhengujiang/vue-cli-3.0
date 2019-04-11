import Axios from '../service/http'
import api from '../service/api'
export default {
  uploadPicByBase64(params = {}) {
    return Axios({method: 'POST', url: api.enterprise.uploadPicByBase64, data: params, emulateJSON: true})
  },
  applyEnterprise(params = {}) {
    return Axios({method: 'POST', url: api.enterprise.applyEnterprise, data: params, emulateJSON: true})
  },
  getEnterprisePackage(params = {}) {
    return Axios({method: 'GET', url: api.enterprise.getEnterprisePackage, params: params})
  }
}
