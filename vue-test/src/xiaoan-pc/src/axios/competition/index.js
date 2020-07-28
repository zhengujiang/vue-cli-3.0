import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  Axios: Axios,
  // 股东名册上传接口
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
  checkCanInviteSecretart(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkCanInviteSecretart, params: params})
  },
  checkInviteSecretary(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkInviteSecretary, params: params})
  },
  getNotFinishTest(params = {}) {
    return Axios({method: 'GET', url: api.competition.getNotFinishTest, params: params})
  },
  increaseSecretaryRecord(params = {}) {
    return Axios({method: 'GET', url: api.competition.increaseSecretaryRecord, params: params})
  },
  getIntegralDetails(params = {}) {
    return Axios({method: 'GET', url: api.competition.getIntegralDetails, params: params})
  },
  checkJoinOffLineSet(params = {}) {
    return Axios({method: 'GET', url: api.competition.checkJoinOffLineSet, params: params})
  },
  chartIndustrySentimentTop5(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartIndustrySentimentTop5, params: params})
  },
  chartIndustryHeatCompanyTop10(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartIndustryHeatCompanyTop10, params: params})
  },
  chartMarketSentiment(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartMarketSentiment, params: params})
  },
  listMarketSentiment(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listMarketSentiment, params: params})
  },
  listIndustrySentiment(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listMarketSentiment, params: params})
  },
  listSuperviseDynamic(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listSuperviseDynamic, params: params})
  },
  listComparisonWithIndustry(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.listComparisonWithIndustry, params: params})
  },
  newsDir(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.newsDir, params: params})
  },
  companyNewsDir(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.companyNewsDir, params: params})
  },
  chartSourceStatistics(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartSourceStatistics, params: params})
  },
  chartSentimentTrend(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartSentimentTrend, params: params})
  },
  chartChannelAnalysis(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.chartChannelAnalysis, params: params})
  },
  hotWords(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.hotWords, params: params})
  },
  countSentiments(params = {}) {
    return Axios({method: 'GET', url: api.sentiment.countSentiments, params: params})
  }

}
