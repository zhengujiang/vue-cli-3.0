import Axios from '../service/http'
import api from '../service/api'
export default {
  shareSign(params = {}) {
    return Axios({method: 'GET', url: api.share.shareSign, params: params})
  },
  defaultImg(params = {}) {
    return Axios({method: 'GET', url: api.share.defaultImg, params: params})
  },
  testingImg(params = {}) {
    return Axios({method: 'GET', url: api.share.testingImg, params: params})
  },
  myYearImg(params = {}) {
    return Axios({method: 'GET', url: api.share.myYearImg, params: params})
  }
}
