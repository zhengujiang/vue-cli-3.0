/**todo
 * @charset UTF-8
 * @Version 1.0.0
 * @接口
 * @name Evans_Cai
 * **/
import {HOSTS, protocol} from '@/service/host'
// const protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
// console.log(process.env)
const User = HOSTS[process.env.XA_ENV].user
const HOST = HOSTS[process.env.XA_ENV].domain
const Calendar = HOSTS[process.env.XA_ENV].calendar
const Disclosure = HOSTS[process.env.XA_ENV].disclosure
// const Disclosure = HOSTS['testing'].disclosure
const Enterprise = HOSTS[process.env.XA_ENV].enterprise
const Law = HOSTS[process.env.XA_ENV].law
const Listedcompany = HOSTS[process.env.XA_ENV].listCompany
const Usermsg = HOSTS[process.env.XA_ENV].usermsg
const Publish = HOSTS[process.env.XA_ENV].publish
const Report = HOSTS[process.env.XA_ENV].report
const Xinhu = HOSTS[process.env.XA_ENV].xinhu
const Sectest = HOSTS[process.env.XA_ENV].sectest
const Wxpay = HOSTS[process.env.XA_ENV].wxpay
const Sentiment = HOSTS[process.env.XA_ENV].sentiment

const currentIP = HOSTS[process.env.XA_ENV].currentIP
const appId = HOSTS[process.env.XA_ENV].appId
const pcUrl = HOSTS[process.env.XA_ENV].pcUrl
const cookieHost = HOSTS[process.env.XA_ENV].cookieHost
export default {
  appId: appId,
  pcUrl: pcUrl,
  cookieHost: cookieHost,
  // 小安的ip
  CURRENTIP: {
    IP: currentIP
  },
  // 小安的版本
  version: {
    code: 'V1.1.1'
  },
  xiaoeknow: 'https://h5.xiaoeknow.com/appe8O3plIM2665/homepage', // 小鹅通 信公商学院
  //
  user: {
    loginByMobileAndCode: User + 'loginByMobileAndCode', // 快捷登录
    bindingWxInfo: User + 'bindingWxInfo', // 绑定或解除微信信息
    loginByWeixin: User + 'loginByWeixin', // 通过微信授权登录
    checkMobileBindWeixin: User + 'checkMobileBindWeixin', // 检查手机是否已绑定微信
    bindingWxInfoByCode: User + 'bindingWxInfoByCode', // 通过短信验证码绑定微信信息

    loginbyqrcode: User + 'user/loginbyqrcode', // 微信登录
    searchUserData: User + 'searchUserData', // 查看用户资料
    completePersonInfo: User + 'completePersonInfo',
    getUserCompanyInfo: User + 'getUserCompanyInfo',
    getUserPosition: User + 'getUserPosition',
    getImageCode: User + 'getImageCode', // 验证码
    imgCodeCheck: User + 'imgCodeCheck', // 验证码 验证方法
    mobileLogin: User + 'mobileLogin', // 验证码 验证方法
    checkMobileExist: User + 'checkMobileExist', // 通过手机验证是否是用户
    exit: User + 'exit', // 退出登录
    sendSmsCode: User + 'sendSmsCode', // code
    findLoginPassword: User + 'findLoginPassword', // code
    modifyLoginPassword: User + 'modifyLoginPassword', // code
    bindMobile: User + 'bindMobile', // code
    mobileRegister: User + 'mobileRegister', // code
    updateSynopsisByUserId: User + 'updateSynopsisByUserId'
  },
  //
  wxAuth: {
    wxAuthByCode: User + 'wxauth/wxAuthByCode'
  },
  // 发票
  invoice: {
    addInvoice: User + 'invoice/addInvoice',
    getInvoiceList: User + 'invoice/getInvoiceList'
  },
  // 小鹅通作业
  course: {
    getQuestions: Sectest + 'course/getQuestions',
    getErrorResult: Sectest + 'course/getErrorResult',
    answerRecord: Sectest + 'course/answerRecord',
    getStatute: Sectest + 'course/getStatute',
    getAnswerResult: Sectest + 'course/getAnswerResult',
  },
  // 舆情
  opinion: {
    getSentimentSummary: Sentiment + 'publicSentiment/getSentimentSummary',
    getSemtimentData: Sentiment + 'publicSentiment/getSemtimentData',
    getAllProject: Sentiment + 'sentiment/getAllProject',
    addProject: Sentiment + 'sentiment/addProject',
    updateProject: Sentiment + 'sentiment/updateProject',
    deleteProject: Sentiment + 'sentiment/deleteProject',
  },
  // ipo
  publish: {
    getDetails: Publish + 'publishPro/search/getDetails',
    listPublish: Publish + 'publishPro/search/listPublish',
    filterConditions: Publish + 'publishPro/search/filterConditions',
  },
  // 研报
  report: {
    getIntegratedReportByType: Report + 'report/getIntegratedReportByType',
    getAllIntegratedReport: Report + 'report/getAllIntegratedReport',
    getIntegratedTypeList: Report + 'report/getIntegratedTypeList',
    getAllIndutryReportByIndustry: Report + 'report/getAllIndutryReportByIndustry',
    getAllIndustryReport: Report + 'report/getAllIndustryReport',
    getIndustryTypeList: Report + 'report/getIndustryTypeList',
    getAllCompanyReportByIndustry: Report + 'report/getAllCompanyReportByIndustry',
    getAllCompanyIndustryList: Report + 'report/getAllCompanyIndustryList',
    getAllCompanyReport: Report + 'report/getAllCompanyReport',
    getNewResearchReport: Report + 'report/getNewResearchReport',
    getMyAttentionCompany: Report + 'report/getMyAttentionCompany',
    getMyResearchReport: Report + 'report/getMyResearchReport',
    getReportDetails: Report + 'report/getReportDetails', // 研报详情
    getRelatedIndutryReport: Report + 'report/getRelatedIndutryReport', // 研报详情 行业相关
    getRelatedCompanyReport: Report + 'report/getRelatedCompanyReport', // 研报详情 公司相关
    getRelatedIntegratedReport: Report + 'report/getRelatedIntegratedReport', // 研报详情 综合相关
    searchReports: Report + 'report/searchReports', // 搜索
  },
  // 消息推送
  userMsg: {
    getMessageByType: Usermsg + 'usermsg/getMessageByType', // 获取消息
    setAllUserMsgRead: Usermsg + 'usermsg/setAllUserMsgRead', // 类型消息全部设为阅读
    setUserMsgRead: Usermsg + 'usermsg/setUserMsgRead', // 单条消息设置为已阅读
    addUserAnswerMsg: Usermsg + 'usermsg/addUserAnswerMsg' // 添加 回答问题的所有消息
  },
  common: {
    autoComplete: User + 'common/autoComplete', // 公告股票代码 的autocomplete
    getStockCode: User + 'getStockCode', // 根据代码查询公司名称
    getAdvertType: User + 'getAdvertType', // 精选
    getAdvertInfo: User + 'getAdvertInfo', // 精选
    getAdvertByType: User + 'getAdvertByType', // 精选
    getAdvertImg: User + 'getAdvertImg', // 精选
    getYearSummaryByCode: User + 'common/getYearSummaryByCode', // 2017
    getCompanyCount: User + 'common/getCompanyCount', // 2017
    getCompanyInfoByName: User + 'common/getCompanyInfoByName', // 2017
    get2018YearSummaryByCode: User + 'common/get2018YearSummaryByCode'
  },
  //
  law: {
    getDetails: Law + 'law/getDetails', // 法规的详情
    search: Law + 'law/search', // 法规的搜索
    autoComplete: Law + 'law/autoComplete', // 法规的autocomplete
    getalllmappingrules: Law + 'getalllmappingrules', // 法规的筛选索引
    getHotSearch: Law + 'law/getHotSearch', // 法规的筛选索引
    getRecommendCollectFavoriteAll: User + 'recommend/getRecommendCollectFavoriteAll', // 法规汇编
  },
  testing: {
    //沪深
    myTest: Sectest + 'sectest/myTest',
    getNum: Sectest + 'sectest/getNum',
    start: Sectest + 'sectest/start',
    commit: Sectest + 'sectest/commit',
    toNext: Sectest + 'sectest/toNext',
    // 新三板
    shareSuccess: Sectest + 'sectest/shareSuccess',
    selectReport: Sectest + 'sectest/selectReport',
    userTestInfo: Sectest + 'sectest/userTestInfo',
    xsbSelectResult: Sectest + 'sectest/xsbSelectResult',
    exitTest: Sectest + 'sectest/exitTest',
    xsbStart: Sectest + 'sectest/xsbStart',
    xsbCommit: Sectest + 'sectest/xsbCommit',
    getNextQuestion: Sectest + 'sectest/getNextQuestion',
    getLastQuestion: Sectest + 'sectest/getLastQuestion',
    selectResult: Sectest + 'sectest/selectResult',
    selectCollect: Sectest + 'sectest/selectCollect',
    deleteCollectQuestion: Sectest + 'sectest/deleteCollectQuestion',
    getPayUserErrorQuestion: Sectest + 'sectest/getPayUserErrorQuestion',
    getErrorQuestion: Sectest + 'sectest/getErrorQuestion',
    collectQuestion: Sectest + 'sectest/collectQuestion',
    checkWxIdByUserId: User + 'checkWxIdByUserId',
  },
  wxpay: {
    payexam: Wxpay + 'wxpay/payexam'
  },
  //
  permission: {
    getPermissionCheckList: User + 'permission/getPermissionCheckList', //
    resetAnnualReport: User + 'permission/resetAnnualReport', //
    getAnnualReport: User + 'permission/getAnnualReport', //
    saveAnnualReport: User + 'permission/saveAnnualReport', //
    getAnnualReportByYear: User + 'permission/getAnnualReportByYear', //
    getAnnualReportInside: User + 'permission/getAnnualReportInside', //
    saveInsideAnnualReport: User + 'permission/saveInsideAnnualReport', //
    resetInsideAnnualReport: User + 'permission/resetInsideAnnualReport', //
    getPermissionInsideList: User + 'permission/getPermissionInsideList', //
    deleteInsideCompany: User + 'permission/deleteInsideCompany', //
    getInsideList: User + 'permission/getInsideList', //
    setNewAnnualReport: User + 'permission/setNewAnnualReport', //
    checkIsAttend: User + 'permission/checkIsAttend', //
    addInsideCompany: User + 'permission/addInsideCompany', //
  },
  // 收藏
  collect: {
    getCollect: User + 'collect/getCollect', // 获取收藏夹详情
    deleteCollectById: User + 'collect/deleteCollectById', // 删除收藏夹里的数据
    addCollect: User + 'collect/addCollect'  // 增加收藏夹
  },
  // 我的收藏
  favourite: {
    getDefault: User + 'favourite/getDefault', //
    getFavourite: User + 'favourite/getFavourite',
    addFavourite: User + 'favourite/addFavourite',
    deleteById: User + 'favourite/deleteById',
    shareSwitch: User + 'favourite/shareSwitch',
    getSubscriptionList: User + 'favourite/getSubscriptionList',
    cancelSubscription: User + 'favourite/cancelSubscription',
    savedSubscription: User + 'favourite/savedSubscription',
    updateFavouriteName: User + 'favourite/updateFavouriteName',
    addSubscription: User + 'favourite/addSubscription',
  },
  recommend: {
    getUserCollectRecommend: User + 'recommend/getUserCollectRecommend',
    deleteUserCollectRecommend: User + 'recommend/deleteUserCollectRecommend',
    collectRecommend: User + 'recommend/collectRecommend',
    getRecommendCollectAttr: User + 'recommend/getRecommendCollectAttr',
    getRecommendDetails: User + 'recommend/getRecommendDetails',
  },
  // 我的关注
  attention: {
    getAttentions: User + 'attention/getAttentions',
    deleteAttention: User + 'attention/deleteAttention',
    getIndustry: User + 'attention/getIndustry',
    oneKeyAttention: User + 'attention/oneKeyAttention',
    oneKeyCancel: User + 'attention/oneKeyCancel',
    searchStock: User + 'attention/searchStock',
    addAttention: User + 'attention/addAttention',
    getStockInfo: User + 'attention/getStockInfo',
  },
  //equity
  equity: {
    addEquityPledge: Enterprise + 'equity/addEquityPledge'
  },
  // 股票
  stock: {
    getMore: Listedcompany + 'stock/getMore',
    getThrunoverInfo: Listedcompany + 'stock/getThrunoverInfo', // 换手率
    getSameIndustryThrunoverInfo: Listedcompany + 'stock/getSameIndustryThrunoverInfo', // 获取同行换手率信息
    getDeviationValue: Listedcompany + 'stock/getDeviationValue', // 获取偏离值
    getSameIndustryStockInfo: Listedcompany + 'stock/getSameIndustryStockInfo', // 获取同行偏离值
  },
  // 获取最新关注的公告
  disclosure: {
    getAnnouncementByAttend: Disclosure + 'disclosure/getAnnouncementByAttend',
    getDetails: Disclosure + 'disclosure/getDetails',
    search: Disclosure + 'disclosure/search',
    getHotSearch: Disclosure + 'disclosure/getHotSearch'
  },
  // 分享的图片
  share: {
    shareSign: User + 'shareSign', // 分享获取openId接口
    defaultImg: 'https://oss.in-hope.cn/xiaoan/shareRulesContent.jpg', // 默认
    testingImg: 'https://oss.in-hope.cn/xiaoan/20170628162356.jpg', // 董秘测评
    myYearImg: 'https://oss.in-hope.cn/image/1441513133897_.pic.jpg', // 2017
  },
  // 足迹接口
  browsing: {
    getBrowsing: User + 'browsing/getBrowsing',
    deleteByUserId: User + 'browsing/deleteByUserId'
  },
  // 个人详细信息
  userHome: {
    userhome: User + 'userHome'
  },
  // 我的日历
  calendar: {
    // post
    editCalendarInfo: Calendar + 'canlendar/editCalendarInfo', // 编辑修改个人工作日历
    deleteCalendarInfo: Calendar + 'canlendar/deleteCalendarInfo', // 删除个人工作日历
    cancelCalendarShareUsers: Calendar + 'canlendar/cancelCalendarShareUsers', // 取消日历共享人
    addShareCalendar: Calendar + 'canlendar/addShareCalendar', // 共享日历添加
    addCalendar: Calendar + 'canlendar/addCalendar', // 添加日历
    editCalendarColor: Calendar + 'canlendar/editCalendarColor', // 修改日历颜色
    updateCalendarCheckedStatus: Calendar + 'canlendar/updateCalendarCheckedStatus', // 修改日历颜色
    // get
    getCalendarByUserId: Calendar + 'canlendar/getCalendarByUserId', // 根据id 获取自己的日历
    getCalendarInfo: Calendar + 'canlendar/getCalendarInfo', // 查看工作日历详情
    getCloseDate: Calendar + 'canlendar/getCloseDate', // 获取休市日期
    getCalendarShareUsers: Calendar + 'canlendar/getCalendarShareUsers', // 获取日历共享人
    getShareCalendarInfo: Calendar + 'canlendar/getShareCalendarInfo', // 共享日历查看
    getShareCalendarLink: Calendar + 'canlendar/getShareCalendarLink', // 共享日历链接获取
    getUserCanlendarList: Calendar + 'canlendar/getUserCanlendarList', // 根据userID获取个人日历列表
    updateShareCalendarLink: Calendar + 'canlendar/updateShareCalendarLink', // 更新共享链接
    getAvatarByMobile: Calendar + 'normalevent/getAvatarByMobile', // 根据手机号码返回用户头像
    getAllCloseDate: Calendar + 'canlendar/getAllCloseDate',
    // post
    addNormalEvent: Calendar + 'normalevent/addNormalEvent', // 添加日常事件
    changeConfirmType: Calendar + 'normalevent/changeConfirmType', // 设置事件提醒方式
    editNormalEventInfo: Calendar + 'normalevent/editNormalEventInfo', // 编辑普通事件详情
    deleteEventById: Calendar + 'normalevent/deleteEventById', // 删除事件
    // get
    getEventsListBytimeSlot: Calendar + 'normalevent/getEventsListBytimeSlot', // 根据时间段获取事件列表
    getNormalEventInfo: Calendar + 'normalevent/getNormalEventInfo', // 获取普通事件详情
    searchEventList: Calendar + 'normalevent/searchEventList', // 根据事件名称搜索个人事件列表
    getTemplateList: Calendar + 'normalevent/getTemplateList', // 获取所有模板
    // post
    addTemplateEvent: Calendar + 'calendarTemplateEvent/addTemplateEvent', // 添加模板事件
    editTemplateEvent: Calendar + 'calendarTemplateEvent/editTemplateEvent', // 编辑模板事件
    // get
    addInviter: Calendar + 'calendarTemplateEvent/addInviter', // 添加邀请人
    checkDate: Calendar + 'calendarTemplateEvent/checkDate', // 检查股东大会召开日和股权登记日是否合法
    checkInviter: Calendar + 'calendarTemplateEvent/checkInviter', // 检查邀请人的合法性
    deleteInviter: Calendar + 'calendarTemplateEvent/deleteInviter', // 删除邀请人
    getEventContainList: Calendar + 'calendarTemplateEvent/getEventContainList', // 获取事件节点信息
    getTemplateEventInfo: Calendar + 'calendarTemplateEvent/getTemplateEventInfo', // 获取模板事件详情
    updateRemind: Calendar + 'calendarTemplateEvent/updateRemind', // 设置节点是否提醒
    deleteTemplateEvent: Calendar + 'calendarTemplateEvent/deleteTemplateEvent' // 删除模板事件
  },
  // 信乎
  xinhu: {
    // POST
    addAnswer: Xinhu + 'xinhu/qa/addAnswer',  // 添加回答
    editAnswer: Xinhu + 'xinhu/qa/editAnswer',  // 添加回答
    // addAttention: HOST + 'xinhu/qa/addAttention',  // 添加关注
    addEditQuestionApplication: Xinhu + 'xinhu/qa/addEditQuestionApplication',  // 提交修改问题申请
    addEvaluate: Xinhu + 'xinhu/qa/addEvaluate',  // 添加评价
    cancelEvaluate: Xinhu + 'xinhu/qa/cancelEvaluate',  // 取消评价
    addQuestion: Xinhu + 'xinhu/qa/addQuestion',  // 添加问题
    deleteAnswer: Xinhu + 'xinhu/qa/deleteAnswer',  // 添加问题
    // GET
    getHotSearchWords: Xinhu + 'xinhu/qa/getHotSearchWords',  // 获取热搜词
    getQuestionDetails: Xinhu + 'xinhu/qa/getQuestionDetails',  // 获取问题详情
    getTopicDetails: Xinhu + 'xinhu/qa/getTopicDetails',  // 话题详情
    listAnswersForQuestion: Xinhu + 'xinhu/qa/listAnswersForQuestion',  // 当前问题所包含的回答列表
    listQuestions: Xinhu + 'xinhu/qa/listQuestions',  // 获取问题列表
    listRelatedQuestions: Xinhu + 'xinhu/qa/listRelatedQuestions',  // 相关问题
    listSearchRelatedTopics: Xinhu + 'xinhu/qa/listSearchRelatedTopics',  // 搜索相关话题  1111111111111111111
    listTopicRelatedQuestions: Xinhu + 'xinhu/qa/listTopicRelatedQuestions',  // 话题相关问题列表  22222222222
    searchQuestions: Xinhu + 'xinhu/qa/searchQuestions',  // 搜索问题接口
    searchUserAnswer: Xinhu + 'xinhu/qa/searchUserAnswer',  // 查看用户的回答
    searchUserQuestion: Xinhu + 'xinhu/qa/searchUserQuestion',  // 查看用户的提问
    searchUserTiltle: Xinhu + 'xinhu/qa/getQuestionOrderByCountRand',//随机搜索标题
    // xinhu/search
    autoComplete: Xinhu + 'xinhu/search/autoComplete',  // 关键字自动补全
    autoCompleteQuestionTitle: Xinhu + 'xinhu/search/autoCompleteQuestionTitle',  // 提问关键字自动补全，只匹配标题
    listQuestion: Xinhu + 'xinhu/search/listQuestion',  // 搜索列表
    listQuestionLatest: Xinhu + 'xinhu/search/listQuestionLatest',  // 最新问题
    listSiftAnswer: Xinhu + 'xinhu/search/listSiftAnswer',  // 精选回答
    listTopic: Xinhu + 'xinhu/search/listTopic',  // 话题搜索
    addAttention: Xinhu + 'xinhu/attention/addAttention',  // 添加关注
    getAttentionQuestion: Xinhu + 'xinhu/attention/getAttentionQuestion',  // 查看我关注的问题
    getAttentionTopic: Xinhu + 'xinhu/attention/getAttentionTopic',  // 查看我关注的话题
    searchAttentionUser: Xinhu + 'xinhu/attention/searchAttentionUser',  // 查看我关注的用户 和关注我的用户
    //  测试
    unFollow: Xinhu + 'xinhu/attention/unFollow',  // 取消关注
    // xinhu / question
    listAnswerIdsByQuestionId: Xinhu + 'xinhu/qa/listAnswerIdsByQuestionId',  // 根据问题Id获取回答id集合
    getAnswerDetails: Xinhu + 'xinhu/qa/getAnswerDetails',  // 回答详情
    getQuestionIdByAnswerId: Xinhu + 'xinhu/qa/getQuestionIdByAnswerId', // 通过答案id 获取问题id
    // 大V GET
    getRandomV: Xinhu + 'xinhu/qa/getRandomV',  // 随机获取大V信息
    getAttentionRandomV: Xinhu + 'xinhu/qa/getAttentionRandomV',  // 随机获取大V信息
    showInvite: Xinhu + 'xinhu/qa/showInvite',  // 显示邀请回答
    getAdvert: Xinhu + 'xinhu/qa/getAdvert',  // 最新提问广告
    // POST
    inviteForQuestion: Xinhu + 'xinhu/qa/inviteForQuestion'  // 邀请大V
  },
  // 企业版
  enterprise: {
    uploadPicByBase64: Enterprise + 'enterpriseCompany/uploadPicByBase64',  // base64上传图片
    applyEnterprise: Enterprise + 'enterpriseCompany/applyEnterprise',  // 申请企业版
    getEnterprisePackage: Enterprise + 'enterpriseCompany/getEnterprisePackage'  // 获取企业套餐
  },
  //
  competition: {
    uploadCasecard: HOST + 'competition/uploadCasecard', // 上传名片
    checkUserCaseUpload: HOST + 'competition/checkUserCaseUpload', // 检查用户是否已上传名片
    checkIn: HOST + 'competition/checkIn', // 签到
    getAllTestPaper: HOST + 'competition/getAllTestPaper', // 获取所有试卷
    getUserCheckStatus: HOST + 'competition/getUserCheckStatus', // 获取签到状态
    nextQuestion: HOST + 'competition/nextQuestion', // 下一题
    startTest: HOST + 'competition/startTest', // 开始测试
    endTest: HOST + 'competition/endTest', // 结束测试
    checkUserApply: HOST + 'competition/checkUserApply', // 检查用户是否已报名
    increaseAnswerNum: HOST + 'competition/increaseAnswerNum', // 增加答题次数
    getRankingList: HOST + 'competition/getRankingList', // 获取排行榜
    setJoinOffLine: HOST + 'competition/setJoinOffLine', // 设置是否参加线下活动
    getMineInvite: HOST + 'competition/getMineInvite', // 设置是否参加线下活动
    updateUserIsJoin: HOST + 'competition/updateUserIsJoin', // 修改用户为报名状态
    getQuestionById: HOST + 'competition/getQuestionById', // 修改用户为报名状态
    getNotFinishTest: HOST + 'competition/getNotFinishTest', // 修改用户为报名状态
    checkInviteSecretary: HOST + 'competition/checkInviteSecretary', // 修改用户为报名状态
    increaseSecretaryRecord: HOST + 'competition/increaseSecretaryRecord', // 修改用户为报名状态
    checkCanInviteSecretart: HOST + 'competition/checkCanInviteSecretart', // 修改用户为报名状态
    getIntegralDetails: HOST + 'competition/getIntegralDetails', // 修改用户为报名状态
    checkJoinOffLineSet: HOST + 'competition/checkJoinOffLineSet' // 修改用户为报名状态
  },
  massage: {
    // GET /msgManage/getManageByUserId
    getManageByUserId: User + 'msgManage/getManageByUserId',  // 查看微信提醒设置列表
    updateStarted: User + 'msgManage/updateStarted'  // 查看微信提醒设置列表
  },
  //
  cotrun: {
    //POST /cotrun/calcScore GET /cotrun/getConditions GET /cotrun/getUserCotrunRecord
    calcScore: HOST + 'sectest/cotrun/calcScore',
    getConditions: HOST + 'sectest/cotrun/getConditions',
    getUserCotrunRecord: HOST + 'sectest/cotrun/getUserCotrunRecord'
  }
}
