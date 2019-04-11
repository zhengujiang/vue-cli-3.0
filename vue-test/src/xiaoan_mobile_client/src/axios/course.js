import Axios from '../service/http'
import api from '../service/api'
export default {
    getQuestions(params = {}) {
        return Axios({method: 'GET', url: api.course.getQuestions, params: params})
      },
    getErrorResult(params = {}) {
        return Axios({method: 'GET', url: api.course.getErrorResult, params: params})
      },
    answerRecord(params = {}) {
        return Axios({method: 'GET', url: api.course.answerRecord, params: params})
      },
    getStatute(params = {}) {
        return Axios({method: 'GET', url: api.course.getStatute, params: params})
      },
    getAnswerResult(params = {}) {
        return Axios({method: 'GET', url: api.course.getAnswerResult, params: params})
      },
}
