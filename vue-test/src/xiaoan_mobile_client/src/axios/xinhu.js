import Axios from '../service/http'
import api from '../service/api'
export default {
  addAnswer(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.addAnswer, params: params, emulateJSON: true})
  },
  editAnswer(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.editAnswer, params: params, emulateJSON: true})
  },
  addEditQuestionApplication(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.addEditQuestionApplication, params: params, emulateJSON: true})
  },
  addEvaluate(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.addEvaluate, params: params, emulateJSON: true})
  },
  cancelEvaluate(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.cancelEvaluate, params: params, emulateJSON: true})
  },
  addQuestion(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.addQuestion, data: params, emulateJSON: true})
  },
  deleteAnswer(params = {}) {
    return Axios({method: 'DELETE', url: api.xinhu.deleteAnswer, params: params})
  },
  getHotSearchWords(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getHotSearchWords, params: params})
  },
  getQuestionDetails(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getQuestionDetails, params: params})
  },
  getTopicDetails(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getTopicDetails, params: params})
  },
  listAnswersForQuestion(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listAnswersForQuestion, params: params})
  },
  listQuestions(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listQuestions, params: params})
  },
  listRelatedQuestions(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listRelatedQuestions, params: params})
  },
  listSearchRelatedTopics(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listSearchRelatedTopics, params: params})
  },
  listTopicRelatedQuestions(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listTopicRelatedQuestions, params: params})
  },
  searchQuestions(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.searchQuestions, params: params})
  },
  searchUserAnswer(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.searchUserAnswer, params: params})
  },
  searchUserQuestion(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.searchUserQuestion, params: params})
  },
  searchUserTiltle(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.searchUserTiltle, params: params})
  },
  autoComplete(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.autoComplete, params: params})
  },
  autoCompleteQuestionTitle(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.autoCompleteQuestionTitle, params: params})
  },
  listQuestion(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listQuestion, params: params})
  },
  listQuestionLatest(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listQuestionLatest, params: params})
  },
  listSiftAnswer(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listSiftAnswer, params: params})
  },
  listTopic(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listTopic, params: params})
  },
  addAttention(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.addAttention, params: params, emulateJSON: true})
  },
  getAttentionQuestion(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getAttentionQuestion, params: params})
  },
  getAttentionTopic(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getAttentionTopic, params: params})
  },
  searchAttentionUser(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.searchAttentionUser, params: params})
  },
  unFollow(params = {}) {
    return Axios({method: 'DELETE', url: api.xinhu.unFollow, params: params})
  },
  listAnswerIdsByQuestionId(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.listAnswerIdsByQuestionId, params: params})
  },
  getAnswerDetails(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getAnswerDetails, params: params})
  },
  getQuestionIdByAnswerId(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getQuestionIdByAnswerId, params: params})
  },
  getRandomV(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getRandomV, params: params})
  },
  getAttentionRandomV(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getAttentionRandomV, params: params})
  },
  showInvite(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.showInvite, params: params})
  },
  getAdvert(params = {}) {
    return Axios({method: 'GET', url: api.xinhu.getAdvert, params: params})
  },
  inviteForQuestion(params = {}) {
    return Axios({method: 'POST', url: api.xinhu.inviteForQuestion, params: params, emulateJSON: true})
  }
}
