import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 取消关注
  unFollow(params) {
    return Axios({method: 'DELETE', url: api.xinhu.unFollow, params: params})
  },
  // 根据问题Id获取回答id集合
  listAnswerIdsByQuestionId(params) {
    return Axios({method: 'GET', url: api.xinhu.listAnswerIdsByQuestionId, params: params})
  },
  // 回答详情
  getAnswerDetails(params) {
    return Axios({method: 'GET', url: api.xinhu.getAnswerDetails, params: params})
  },
  // 通过答案id 获取问题id
  getQuestionIdByAnswerId(params) {
    return Axios({method: 'GET', url: api.xinhu.getQuestionIdByAnswerId, params: params})
  },
  // 随机获取大V信息
  getRandomV(params) {
    return Axios({method: 'GET', url: api.xinhu.getRandomV, params: params})
  },
  // 随机获取大V信息
  getAttentionRandomV(params) {
    return Axios({method: 'GET', url: api.xinhu.getAttentionRandomV, params: params})
  },
  // 成就
  getUserXinHuInfo(params) {
    return Axios({method: 'GET', url: api.xinhu.getUserXinHuInfo, params: params})
  },
  // 显示邀请回答
  showInvite(params) {
    return Axios({method: 'GET', url: api.xinhu.showInvite, params: params})
  },
  // 忽略邀请回答
  ignoreInvitedQuestion(params) {
    return Axios({method: 'POST', url: api.xinhu.ignoreInvitedQuestion, params: params})
  },
  // 最新提问广告
  getAdvert(params) {
    return Axios({method: 'GET', url: api.xinhu.getAdvert, params: params})
  },
  // 邀请大V
  inviteForQuestion(params) {
    return Axios({method: 'POST', url: api.xinhu.inviteForQuestion, params: params})
  },
  // 敏感词
  getSensitiveWord(params) {
    return Axios({method: 'GET', url: api.xinhu.getSensitiveWord, params: params})
  },
  // 话题关注者列表
  getTopicAttentionUser(params) {
    return Axios({method: 'GET', url: api.xinhu.getTopicAttentionUser, params: params})
  },
  // 问题关注者列表
  getQuestionAttentionUserList(params) {
    return Axios({method: 'GET', url: api.xinhu.getQuestionAttentionUserList, params: params})
  },
  // 添加关注
  addAttention(params) {
    return Axios({method: 'POST', url: api.xinhu.addAttention, params: params})
  },
  // 查看我关注的问题
  getAttentionQuestion(params) {
    return Axios({method: 'GET', url: api.xinhu.getAttentionQuestion, params: params})
  },
  // 查看我关注的话题
  getAttentionTopic(params) {
    return Axios({method: 'GET', url: api.xinhu.getAttentionTopic, params: params})
  },
  // 查看我关注的用户 和关注我的用户
  searchAttentionUser(params) {
    return Axios({method: 'GET', url: api.xinhu.searchAttentionUser, params: params})
  },
  // xinhu/search
  // 关键字自动补全
  autoComplete(params) {
    return Axios({method: 'GET', url: api.xinhu.autoComplete, params: params})
  },
  // 提问关键字自动补全，只匹配标题
  autoCompleteQuestionTitle(params) {
    return Axios({method: 'GET', url: api.xinhu.autoCompleteQuestionTitle, params: params})
  },
  // 搜索列表
  listQuestion(params) {
    return Axios({method: 'GET', url: api.xinhu.listQuestion, params: params})
  },
  // 最新问题
  listQuestionLatest(params) {
    return Axios({method: 'GET', url: api.xinhu.listQuestionLatest, params: params})
  },
  // 精选回答
  listSiftAnswer(params) {
    return Axios({method: 'GET', url: api.xinhu.listSiftAnswer, params: params})
  },
  // 话题搜索
  listTopic(params) {
    return Axios({method: 'GET', url: api.xinhu.listTopic, params: params})
  },
  // 热门话题
  getHotTopics(params) {
    return Axios({method: 'GET', url: api.xinhu.getHotTopics, params: params})
  },
  // 添加回答
  addAnswer(params) {
    return Axios({method: 'POST', url: api.xinhu.addAnswer, params: params})
  },
  // 编辑回答
  editAnswer(params) {
    return Axios({method: 'POST', url: api.xinhu.editAnswer, params: params})
  },
  // 提交修改问题申请
  addEditQuestionApplication(params) {
    return Axios({method: 'POST', url: api.xinhu.addEditQuestionApplication, params: params})
  },
  // 添加评价
  addEvaluate(params) {
    return Axios({method: 'POST', url: api.xinhu.addEvaluate, params: params})
  },
  // 取消评价
  cancelEvaluate(params) {
    return Axios({method: 'POST', url: api.xinhu.cancelEvaluate, params: params})
  },
  // 添加问题
  addQuestion(params) {
    return Axios({method: 'POST', url: api.xinhu.addQuestion, params: params})
  },
  // 删除问题
  deleteAnswer(params) {
    return Axios({method: 'DELETE', url: api.xinhu.deleteAnswer, params: params})
  },
  // 获取热搜词
  getHotSearchWords(params) {
    return Axios({method: 'GET', url: api.xinhu.getHotSearchWords, params: params})
  },
  // 获取问题详情
  getQuestionDetails(params) {
    return Axios({method: 'GET', url: api.xinhu.getQuestionDetails, params: params})
  },
  // 话题详情
  getTopicDetails(params) {
    return Axios({method: 'GET', url: api.xinhu.getTopicDetails, params: params})
  },
  // 当前问题所包含的回答列表
  listAnswersForQuestion(params) {
    return Axios({method: 'GET', url: api.xinhu.listAnswersForQuestion, params: params})
  },
  // 获取问题列表
  listQuestions(params) {
    return Axios({method: 'GET', url: api.xinhu.listQuestions, params: params})
  },
   // 相关问题
  listRelatedQuestions(params) {
    return Axios({method: 'GET', url: api.xinhu.listRelatedQuestions, params: params})
  },
   // 搜索相关话题
  listSearchRelatedTopics(params) {
    return Axios({method: 'GET', url: api.xinhu.listSearchRelatedTopics, params: params})
  },
   // 话题相关问题列表
  listTopicRelatedQuestions(params) {
    return Axios({method: 'GET', url: api.xinhu.listTopicRelatedQuestions, params: params})
  },
   // 搜索问题接口
  searchQuestions(params) {
    return Axios({method: 'GET', url: api.xinhu.searchQuestions, params: params})
  },
   // 查看用户的回答
  searchUserAnswer(params) {
    return Axios({method: 'GET', url: api.xinhu.searchUserAnswer, params: params})
  },
   // 查看用户的提问
  searchUserQuestion(params) {
    return Axios({method: 'GET', url: api.xinhu.searchUserQuestion, params: params})
  },
   // 随机搜索标题
  searchUserTiltle(params) {
    return Axios({method: 'GET', url: api.xinhu.searchUserTiltle, params: params})
  }
}
