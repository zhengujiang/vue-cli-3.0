import Axios from '../service/http'
import api from '../service/api'
export default {
    getSentimentSummary(params = {}) {
        return Axios({method: 'GET', url: api.opinion.getSentimentSummary, params: params})
      },
    getSemtimentData(params = {}) {
        return Axios({method: 'GET', url: api.opinion.getSemtimentData, params: params})
      },
    getAllProject(params = {}) {
        return Axios({method: 'GET', url: api.opinion.getAllProject, params: params})
      },
    addProject(params = {}) {
        return Axios({method: 'GET', url: api.opinion.addProject, params: params})
      },
    updateProject(params = {}) {
        return Axios({method: 'GET', url: api.opinion.updateProject, params: params})
      },
    deleteProject(params = {}) {
        return Axios({method: 'POST', url: api.opinion.deleteProject, params: params,emulateJSON:true})
      },
}
