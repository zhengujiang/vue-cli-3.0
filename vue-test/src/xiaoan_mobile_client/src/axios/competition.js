import Axios from '../service/http'
import api from '../service/api'
export default {
  uploadCasecard: function (paeams = {}) {
    let apiuri = Object.assign({}, paeams, {
      method: 'POST',
      headers: {"Content-Type": "multipart/form-data"},
      url: api.competition.uploadCasecard,
      timeout: 1000 * 60 * 10
    })
    console.log(apiuri);
    return Axios(apiuri)
  },
  checkUserCaseUpload(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkUserCaseUpload, params: params})
  },
  checkIn(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkIn, params: params})
  },
  getAllTestPaper(params = {}) {
    return Axios({method: 'GET', url: api.competition.getAllTestPaper, params: params})
  },
  getUserCheckStatus(params = {}) {
    return Axios({method: 'GET', url: api.competition.getUserCheckStatus, params: params})
  },
  nextQuestion(params = {}) {
    return Axios({method: 'GET', url: api.competition.nextQuestion, params: params})
  },
  startTest(params = {}) {
    return Axios({method: 'GET', url: api.competition.startTest, params: params})
  },
  endTest(params = {}) {
    return Axios({method: 'GET', url: api.competition.endTest, params: params})
  },
  checkUserApply(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkUserApply, params: params})
  },
  getRankingList(params = {}) {
    return Axios({method: 'GET', url: api.competition.getRankingList, params: params})
  },
  //
  setJoinOffLine(params = {}) {
    return Axios({method: 'GET', url: api.competition.setJoinOffLine, params: params})
  },
  updateUserIsJoin(params = {}) {
    return Axios({method: 'GET', url: api.competition.updateUserIsJoin, params: params})
  },
  getMineInvite(params = {}) {
    return Axios({method: 'GET', url: api.competition.getMineInvite, params: params})
  },
  getQuestionById(params = {}) {
    return Axios({method: 'GET', url: api.competition.getQuestionById, params: params})
  },
  increaseAnswerNum(params = {}) {
    return Axios({method: 'GET', url: api.competition.increaseAnswerNum, params: params})
  },
  getNotFinishTest(params = {}) {
    return Axios({method: 'GET', url: api.competition.getNotFinishTest, params: params})
  },
  checkInviteSecretary(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkInviteSecretary, params: params})
  },
  increaseSecretaryRecord(params = {}) {
    return Axios({method: 'GET', url: api.competition.increaseSecretaryRecord, params: params})
  },
  checkCanInviteSecretart(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkCanInviteSecretart, params: params})
  },
  // GET /competition/getIntegralDetails
  getIntegralDetails(params = {}) {
    return Axios({method: 'GET', url: api.competition.getIntegralDetails, params: params})
  },
  checkJoinOffLineSet(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkJoinOffLineSet, params: params})
  }
}
