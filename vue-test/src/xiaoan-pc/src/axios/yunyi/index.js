import Axios from "@/service/http";
import api from '@/service/api/index'
export default {
  translateFile(params) {
    let apiuri = Object.assign({}, params, {
      method: 'POST',
      headers: {"Content-Type": "multipart/form-data"},
      url: api.yunyi.translateFile,
      timeout: 1000 * 60 * 10
    })
    return Axios(apiuri)
  },
  getTranslateFileByUser(params) {
    return Axios({method: 'GET', url: api.yunyi.getTranslateFileByUser, params: params})
  },
  deleteTranslateFile(params) {
    return Axios({method: 'PUT', url: api.yunyi.deleteTranslateFile, params: params, emulateJSON: true})
  },
  addEvaluate(params) {
    return Axios({method: 'POST', url: api.yunyi.addEvaluate, params: params, emulateJSON: true})
  }
}
