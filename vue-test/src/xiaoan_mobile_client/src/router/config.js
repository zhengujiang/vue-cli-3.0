// 登陆域注册 个人中心
const appIndex = r => require.ensure([], () => r(require('@/view/index.vue')), 'chunknameMy')
const My = r => require.ensure([], () => r(require('@/view/tabbar/my.vue')), 'chunknameMy')
const myIndex = r => require.ensure([], () => r(require('@/view/mySpace/myIndex.vue')), 'chunknameMy')
const manage = r => require.ensure([], () => r(require('@/view/mySpace/manage.vue')), 'chunknamePerson')
const reviseInfo = r => require.ensure([], () => r(require('@/view/mySpace/reviseInfo.vue')), 'chunknamePerson')
const revisePhone = r => require.ensure([], () => r(require('@/view/mySpace/revisePhone.vue')), 'chunknamePerson')
const revisePassword = r => require.ensure([], () => r(require('@/view/mySpace/revisePassword.vue')), 'chunknamePerson')
const number = r => require.ensure([], () => r(require('@/view/mySpace/number.vue')), 'chunknamePerson')
const reset = r => require.ensure([], () => r(require('@/view/mySpace/reset.vue')), 'chunknamePerson')
// const login = r => require.ensure([], () => r(require('@/view/mySpace/login.vue')), 'chunknamePerson')
const loadPass = r => require.ensure([], () => r(require('@/view/mySpace/loginLoading.vue')), 'chunknamePerson')
const personalInfo = r => require.ensure([], () => r(require('@/view/mySpace/personalInfo.vue')), 'chunknamePerson')
const completeInfo = r => require.ensure([], () => r(require('@/view/mySpace/completeInfo.vue')), 'chunknamePerson')
const userOther = r => require.ensure([], () => r(require('@/view/mySpace/userOther.vue')), 'chunknamePerson')

// 微信统一授权
const wxRedirect = r => require.ensure([], () => r(require('@/view/mySpace/wxRedirect.vue')), 'chunknameMy')
// 创作
const creation = r => require.ensure([], () => r(require('@/view/duty/creation.vue')), 'chunknameCreation')
// 消息
const pushMessage = r => require.ensure([], () => r(require('@/view/duty/message.vue')), 'chunknameMessage')
// 足迹页面
const xiaoanTrack = r => require.ensure([], () => r(require('@/view/duty/xaTrack.vue')), 'chunknametrack')
// 我的权限速查表
const referenceIndex = r => require.ensure([], () => r(require('@/view/reference/referenceIndex.vue')), 'chunknameTable')
const userTables = r => require.ensure([], () => r(require('@/view/reference/userTables.vue')), 'chunknameTable')
const customerTables = r => require.ensure([], () => r(require('@/view/reference/customerTables.vue')), 'chunknameTable')
const innerCustomerTables = r => require.ensure([], () => r(require('@/view/reference/innerCustomerTables.vue')), 'chunknameTable')
const internalTables = r => require.ensure([], () => r(require('@/view/reference/internalTables.vue')), 'chunknameTable')
const searchPower = r => require.ensure([], () => r(require('@/view/reference/searchPower.vue')), 'chunknameTable')
const searchInner = r => require.ensure([], () => r(require('@/view/reference/searchInner.vue')), 'chunknameTable')
// 关注页面
const dutyIndex = r => require.ensure([], () => r(require('@/view/duty/dutyIndex.vue')), 'chunknameFocus')
const Focus = r => require.ensure([], () => r(require('@/view/duty/focus.vue')), 'chunknameFocus')
const AddFocus = r => require.ensure([], () => r(require('@/view/duty/addFocus.vue')), 'chunknameFocus')
// 收藏夹
const collect = r => require.ensure([], () => r(require('@/view/duty/collect.vue')), 'chunknameCollect')
const collectDetails = r => require.ensure([], () => r(require('@/view/duty/collectDetails.vue')), 'chunknameCollect')
const collectGrooms = r => require.ensure([], () => r(require('@/view/duty/collectGroom.vue')), 'chunknameCollect')
// 小安指南
const manual = r => require.ensure([], () => r(require('@/view/manual/manual.vue')), 'chunknameN')
const manualDetails = r => require.ensure([], () => r(require('@/view/manual/manualDetails.vue')), 'chunknameN')
const brief = r => require.ensure([], () => r(require('@/view/duty/brief.vue')), 'chunknameN')
// 质押
const pledge = r => require.ensure([], () => r(require('../view/duty/pledge.vue')), 'chunknameN')
// 法规
const ruleIndex = r => require.ensure([], () => r(require('@/view/rules/ruleIndex.vue')), 'chunknameLawNew')
const rule = r => require.ensure([], () => r(require('@/view/rules/rule.vue')), 'chunknameLawNew')
const ruleNew = r => require.ensure([], () => r(require('@/view/rules/ruleNew.vue')), 'chunknameLaw')
const ruleList = r => require.ensure([], () => r(require('@/view/rules/rulesList.vue')), 'chunknameLaw')
const ruleSearch = r => require.ensure([], () => r(require('@/view/rules/ruleSearch.vue')), 'chunknameLaw')
const rulesDetails = r => require.ensure([], () => r(require('@/view/rules/ruleDetails.vue')), 'chunknameLaw')
const topTenRules = r => require.ensure([], () => r(require('@/view/regulation/topTenRules.vue')), 'chunknameLaw')
const topTenDetails = r => require.ensure([], () => r(require('@/view/regulation/topTenDetails.vue')), 'chunknameLaw')
// 公告
const noticeIndex = r => require.ensure([], () => r(require('@/view/announcement/noticeIndex.vue')), 'chunknameAffiche')
const Affiche = r => require.ensure([], () => r(require('@/view/tabbar/affiche.vue')), 'chunknameAfficheaaaa')
const Affpdf = r => require.ensure([], () => r(require('@/view/announcement/Affpdf.vue')), 'chunknameAffiche')
const newAffiche = r => require.ensure([], () => r(require('@/view/announcement/newaffiche.vue')), 'chunknameAffiche')
const searchList = r => require.ensure([], () => r(require('@/view/announcement/searchList.vue')), 'chunknameAffiche')
const afficheList = r => require.ensure([], () => r(require('@/view/announcement/afficheList.vue')), 'chunknameAffiche')
const afficheSearch = r => require.ensure([], () => r(require('@/view/announcement/afficheSearch.vue')), 'chunknameAffiche')
const afficheContent = r => require.ensure([], () => r(require('@/view/announcement/afficheContent.vue')), 'chunknameAffiche')
//测评引入
const testIndex = r => require.ensure([], () => r(require('@/view/testing/testIndex.vue')), 'chunknamePersonTest')
const testing = r => require.ensure([], () => r(require('@/view/testing/testing.vue')), 'chunknamePerson')
const testPlate = r => require.ensure([], () => r(require('@/view/testing/testPlate.vue')), 'chunknameTest')
const testingList = r => require.ensure([], () => r(require('@/view/testing/testingList.vue')), 'chunknameTest')
const testLoading = r => require.ensure([], () => r(require('@/view/testing/testLoading.vue')), 'chunknameTest')
const testingEnd = r => require.ensure([], () => r(require('@/view/testing/testingEnd.vue')), 'chunknameTest')
const newTestPlate = r => require.ensure([], () => r(require('@/view/testing/newOTCBBTestPlate.vue')), 'chunknamenewTest')
const newOTCBBTestingEnd = r => require.ensure([], () => r(require('@/view/testing/newOTCBBTestingEnd.vue')), 'chunknamenewTest')
const newOTCBBTestingList = r => require.ensure([], () => r(require('@/view/testing/newOTCBBTestingList.vue')), 'chunknamenewTest')
const newOTCBBTestWrong = r => require.ensure([], () => r(require('@/view/testing/newOTCBBTestWrong.vue')), 'chunknamenewTest')
const newOTCBBTestWrongList = r => require.ensure([], () => r(require('@/view/testing/newOTCBBTestWrongList.vue')), 'chunknamenewTest')
const newOTCBBTestDescribe = r => require.ensure([], () => r(require('@/view/testing/newOTCBBTestDescribe.vue')), 'chunknamenewTest')
const newOTCBBTestCollect = r => require.ensure([], () => r(require('@/view/testing/newOTCBBTestCollect.vue')), 'chunknamenewTest')
// 小鹅通 商学院相关
const businessIndex = r => require.ensure([], () => r(require('@/view/business/businessIndex.vue')), 'chunknameAsk')
const homework = r => require.ensure([], () => r(require('@/view/business/homework.vue')), 'chunknameAsk')
const homeworkEnd = r => require.ensure([], () => r(require('@/view/business/homeworkend.vue')), 'chunknameAsk')
const application = r => require.ensure([], () => r(require('@/view/business/application.vue')), 'chunknameAsk')
const applicationList = r => require.ensure([], () => r(require('@/view/business/applicationList.vue')), 'chunknameAsk')
const applicationImg = r => require.ensure([], () => r(require('@/view/business/applicationImg.vue')), 'chunknameAsk')
const ads = r => require.ensure([], () => r(require('@/view/choice/ads.vue')), 'chunknameAsk')
// 测试显示效果展示 路演中组件
const roadShow = r => require.ensure([], () => r(require('@/view/other/roadShow.vue')), 'chunknameLyz')
// 写部分测试例子用的页面
const vueDemo = r => require.ensure([], () => r(require('@/view/demo/vueDemo.vue')), 'chunknameDame')
const wxUser = r => require.ensure([], () => r(require('@/view/demo/wx_user.vue')), 'chunknameDame')
// 研报
const reportIndex = r => require.ensure([], () => r(require('@/view/report/reportIndex.vue')), 'chunknameyB')
const report = r => require.ensure([], () => r(require('@/view/tabbar/report.vue')), 'chunknameyB')
const searchReport = r => require.ensure([], () => r(require('@/view/report/searchReport.vue')), 'chunknameyb')
const detailReport = r => require.ensure([], () => r(require('@/view/report/detailReport.vue')), 'chunknameyb')
const listReport = r => require.ensure([], () => r(require('@/view/report/listReport.vue')), 'chunknameyb')
const pdfReport = r => require.ensure([], () => r(require('@/view/report/pdfReport.vue')), 'chunknameyb')
// 舆情
const opinionIndex = r => require.ensure([], () => r(require('@/view/opinion/opinionIndex.vue')), 'chunknameYQ')
const opinion = r => require.ensure([], () => r(require('@/view/opinion/opinion.vue')), 'chunknameYQ')
const supervise = r => require.ensure([], () => r(require('@/view/opinion/supervise.vue')), 'chunknameYQ')
const superviseList = r => require.ensure([], () => r(require('@/view/opinion/superviseList.vue')), 'chunknameYQ')
// 我的2017
const myYear = r => require.ensure([], () => r(require('@/view/myYear/myYear.vue')), 'chunknamemyYear')
const year2018 = r => require.ensure([], () => r(require('@/view/year2018/year2018.vue')), 'chunknamemyYear')
// 我的日历
const calendar = r => require.ensure([], () => r(require('@/view/calendar/calendar.vue')), 'chunknameCalendar')
const calendarList = r => require.ensure([], () => r(require('@/view/calendar/calendarList.vue')), 'chunknameCalendar')
const addCalendarItems = r => require.ensure([], () => r(require('@/view/calendar/addCalendarItems.vue')), 'chunknameCalendar')
const calendarAll = r => require.ensure([], () => r(require('@/view/calendar/calendarAll.vue')), 'chunknameCalendar')
const calendarEventDetails = r => require.ensure([], () => r(require('@/view/calendar/calendarEventDetails.vue')), 'chunknameCalendar')
const calendarDetails = r => require.ensure([], () => r(require('@/view/calendar/calendarDetails.vue')), 'chunknameCalendar')
const calendarWork = r => require.ensure([], () => r(require('@/view/calendar/calendarWork.vue')), 'chunknameCalendar')
const calendarModifyColor = r => require.ensure([], () => r(require('@/view/calendar/calendarModifyColor.vue')), 'chunknameCalendar')
const calendarBacklog = r => require.ensure([], () => r(require('@/view/calendar/calendarBacklog.vue')), 'chunknameCalendar')
const calendarSearch = r => require.ensure([], () => r(require('@/view/calendar/calendarSearch.vue')), 'chunknameCalendar')
const addCalendar = r => require.ensure([], () => r(require('@/view/calendar/addCalendar.vue')), 'chunknameCalendar')
const calendarShareEventDetails = r => require.ensure([], () => r(require('@/view/calendar/calendarShareEventDetails.vue')), 'chunknameCalendar')
// 信乎
const xhList = r => require.ensure([], () => r(require('@/view/xinhu/xhList.vue')), 'xinhu')
const xhSearch = r => require.ensure([], () => r(require('@/view/xinhu/xhSearch.vue')), 'xinhu')
const xhSearchResult = r => require.ensure([], () => r(require('@/view/xinhu/xhSearchResult.vue')), 'xinhu')
const xhQuestion = r => require.ensure([], () => r(require('@/view/xinhu/xhQuestion.vue')), 'xinhu')
const xhQuestionDetaile = r => require.ensure([], () => r(require('@/view/xinhu/xhQuestionDetaile.vue')), 'xinhu')
const xhAnswerDetaile = r => require.ensure([], () => r(require('@/view/xinhu/xhAnswerDetaile.vue')), 'xinhu')
const xhAnswer = r => require.ensure([], () => r(require('@/view/xinhu/xhAnswer.vue')), 'xinhu')
const xhTopic = r => require.ensure([], () => r(require('@/view/xinhu/xhTopic.vue')), 'xinhu')
const xhRedirect = r => require.ensure([], () => r(require('@/view/xinhu/xhRedirect.vue')), 'xinhu')
const xhIndex = r => require.ensure([], () => r(require('@/view/xinhu/xhIndex.vue')), 'xinhu')
// 链接缺省页 失效页
const xaError = r => require.ensure([], () => r(require('@/view/error/error.vue')), 'chunknameLawNew')

// 发行 IPO、并购重组、再融资
const ipoIndex = r => require.ensure([], () => r(require('@/view/publish/ipoIndex')), 'publish')
const publishSearch = r => require.ensure([], () => r(require('@/view/publish/publishSearch.vue')), 'publish')
const publishList = r => require.ensure([], () => r(require('@/view/publish/publishList.vue')), 'publish')
const publishDetaile = r => require.ensure([], () => r(require('@/view/publish/publishDetaile.vue')), 'publish')
const documentation = r => require.ensure([], () => r(require('@/view/publish/documentation.vue')), 'publish')

const enterpriseApply = r => require.ensure([], () => r(require('@/view/enterprise/apply.vue')), 'enterprise')
//
const competition = r => require.ensure([], () => r(require('@/view/competition/competition.vue')), 'competition')
const compEnroll = r => require.ensure([], () => r(require('@/view/competition/enroll.vue')), 'competition')
const compClause = r => require.ensure([], () => r(require('@/view/competition/clause.vue')), 'competition')
const compUpload = r => require.ensure([], () => r(require('@/view/competition/upload.vue')), 'competition')
const compHome = r => require.ensure([], () => r(require('@/view/competition/home.vue')), 'competition')
const compTesting = r => require.ensure([], () => r(require('@/view/competition/testing.vue')), 'competition')
const compResult = r => require.ensure([], () => r(require('@/view/competition/result.vue')), 'competition')
const compRanking = r => require.ensure([], () => r(require('@/view/competition/ranking.vue')), 'competition')
const compCall = r => require.ensure([], () => r(require('@/view/competition/call.vue')), 'competition')
const compSummary = r => require.ensure([], () => r(require('@/view/competition/summary.vue')), 'competition')
const comInvite = r => require.ensure([], () => r(require('@/view/competition/invite.vue')), 'competition')
const comFriendTesting = r => require.ensure([], () => r(require('@/view/competition/friendTesting.vue')), 'competition')
const comPreheat = r => require.ensure([], () => r(require('@/view/competition/preheat.vue')), 'competition')
const comDetails = r => require.ensure([], () => r(require('@/view/competition/details.vue')), 'competition')
//
const vxaSettings = r => require.ensure([], () => r(require('@/view/settings/settings.vue')), 'settings')
const vxaSettingsWx = r => require.ensure([], () => r(require('@/view/settings/wx.vue')), 'settings')
// 登陆页面
const loginPage = r => require.ensure([], () => r(require('@/view/login/loginPage.vue')), 'loginPage')
const loginInfo = r => require.ensure([], () => r(require('@/view/login/components/login.vue')), 'loginPage')
const register = r => require.ensure([], () => r(require('@/view/login/components/register.vue')), 'loginPage')
const bindPhone = r => require.ensure([], () => r(require('@/view/login/components/bindPhone.vue')), 'loginPage')
const loginWeixin = r => require.ensure([], () => r(require('@/view/login/components/loginWeixin.vue')), 'loginPage')
// 科创
const electronHome = r => require.ensure([], () => r(require('@/view/activity/electron/home.vue')), 'loginPage')
const electronTest = r => require.ensure([], () => r(require('@/view/activity/electron/test.vue')), 'loginPage')
const electronDetails = r => require.ensure([], () => r(require('@/view/activity/electron/details.vue')), 'loginPage')
const electronDetailsShare = r => require.ensure([], () => r(require('@/view/activity/electron/shareDetails.vue')), 'loginPage')

const routes = [
  {
    path: '/login', name: 'loginPage', component: loginPage,
    meta: {isLogin: 2, title: '登录', name: 'loginPage'},
    // redirect: '/loginPage/login',
    children: [
      {
        path: '/login', name: 'login', component: loginInfo,
        meta: {isLogin: 2, title: '登录', keepAlive: false}
      },
      {
        path: '/login/register', name: 'register', component: register,
        meta: {isLogin: 2, title: '注册', keepAlive: false}
      },
      {
        path: '/login/bindPhone', name: 'bindPhone', component: bindPhone,
        meta: {isLogin: 2, title: '绑定手机号', keepAlive: false}
      }
    ]
  },
  {
    path: '/loginWeixin', name: 'loginWeixin', component: loginWeixin,
    meta: {isLogin: 2, title: '微信授权登陆', keepAlive: false, footer: true}
  },
  {
    path: '/wxRedirect', name: 'wxRedirect', component: wxRedirect,
    meta: {isLogin: 2, title: '微信授权登陆', keepAlive: false, footer: true}
  },
  {
    // 路由引导
    path: '/', name: 'index', redirect: '/rule', component: appIndex,
    meta: {isLogin: 0, title: '信公小安', name: 'appIndex', footer: true}
  },
  //
  {
    path: '/my', name: 'My', component: My,
    meta: {isLogin: 0, title: '个人中心', name: 'My', keepAlive: false, footer: true}
  },
  //  个人中心最新引导
  {
    path: '/home', name: 'home', component: My,
    meta: {isLogin: 0, title: '个人中心', name: 'My', keepAlive: false, footer: true}
  },
  //
  {
    path: '/creation', name: 'creation', component: creation,
    meta: {isLogin: 1, title: '我的创作', name: 'My', keepAlive: false, footer: true}
  },
  //
  {
    path: '/message', name: 'message', component: pushMessage,
    meta: {isLogin: 1, title: '我的消息', name: 'My', keepAlive: false, footer: true}
  },
  //
  {
    path: '/track', name: 'track', component: xiaoanTrack,
    meta: {isLogin: 1, title: '我的足迹', name: 'My', keepAlive: false, footer: true}
  },
  //
  {
    path: '/error', name: 'error', component: xaError,
    meta: {isLogin: 0, title: '链接失效', keepAlive: false, footer: true}
  },
  // 十大新规
  {
    path: '/topTenRules', name: 'topTenRules', component: topTenRules,
    meta: {isLogin: 1, title: '2018年资本市场十大新规', keepAlive: false, footer: true}
  },
  // 十大新规详情
  {
    path: '/topTenDetails', name: 'topTenDetails', component: topTenDetails,
    meta: {isLogin: 1, title: '十大新规详情', keepAlive: false, footer: true}
  },
  // 董秘测试
  {
    path: '/testing', name: 'testing-index', component: testIndex,
    children: [
      {
        path: '/testing', name: 'testing', component: testing,
        meta: {isLogin: 1, title: '我的测评', keepAlive: false}
      },
      {
        path: '/testPlate', name: 'testPlate', component: testPlate,
        meta: {isLogin: 1, title: '董秘测试', keepAlive: false}
      },
      {
        path: '/testingList', name: 'testingList', component: testingList,
        meta: {isLogin: 1, title: '董秘测试', keepAlive: false}
      },
      {
        path: '/testLoading', name: 'testLoading', component: testLoading,
        meta: {isLogin: 1, title: '董秘测试', keepAlive: false}
      },
      {
        path: '/testingEnd', name: 'testingEnd', component: testingEnd,
        meta: {isLogin: 1, title: '董秘测试', keepAlive: false}
      },
      {
        path: '/newOTCBBTestingEnd', name: 'newOTCBBTestingEnd', component: newOTCBBTestingEnd,
        meta: {isLogin: 1, title: '董秘测试', keepAlive: false}
      },
      {
        path: '/newOTCBBTestingList', name: 'newOTCBBTestingList', component: newOTCBBTestingList,
        meta: {isLogin: 1, title: '董秘测试', keepAlive: false}
      },
      {
        path: '/newOTCBBTestWrong', name: 'newOTCBBTestWrong', component: newOTCBBTestWrong,
        meta: {isLogin: 1, title: '错题', keepAlive: false}
      },
      {
        path: '/newOTCBBTestWrongList', name: 'newOTCBBTestWrongList', component: newOTCBBTestWrongList,
        meta: {isLogin: 1, title: '错题', keepAlive: false}
      },
      {
        path: '/newOTCBBTestDescribe', name: 'newOTCBBTestDescribe', component: newOTCBBTestDescribe,
        meta: {isLogin: 1, title: '付费简介', keepAlive: false}
      },
      {
        path: '/newOTCBBTestCollect', name: 'newOTCBBTestCollect', component: newOTCBBTestCollect,
        meta: {isLogin: 1, title: '付费简介', keepAlive: false}
      },
      {
        path: '/newTestPlate', name: 'newTestPlate', component: newTestPlate,
        meta: {isLogin: 1, title: '选择题数', keepAlive: false}
      }
    ]
  },
  // 最新年报 统计H5
  {
    path: '/myYear', name: 'myYear', component: myYear,
    meta: {isLogin: 0, title: '我在董办的2017', name: 'myYear',}
  },
  {
    path: '/year2018', name: 'year2018', component: year2018,
    meta: {isLogin: 0, title: '我在董办的2018', name: 'year2018',}
  },
  // 法规
  {
    path: '/rule', name: 'rule-index', component: ruleIndex,
    meta: {isLogin: 0, title: '信公小安',},
    children: [
      {
        path: '/rule', name: 'rule', component: rule,
        meta: {isLogin: 0, title: '信公小安', name: 'rule', keepAlive: false, footer: true}
      },
      {
        path: '/rule/search', name: 'rule-search', component: ruleSearch,
        meta: {isLogin: 0, title: '法规', type: 'rule', keepAlive: false}
      },
      {
        path: '/rule/details', name: 'rule-details', component: rulesDetails,
        meta: {isLogin: 0, title: '法规内容', type: 'rule', keepAlive: false}
      },
      {
        path: '/rule/list', name: 'rule-list', component: ruleList,
        meta: {isLogin: 0, title: '法规列表', name: 'rule', type: 'rule', keepAlive: false, footer: true}
      },
      {
        path: '/rule/new', name: 'rule-new', component: ruleNew,
        meta: {isLogin: 0, title: '最新法规', name: 'rule', keepAlive: false, footer: true}
      }
    ]
  },
  // 公告
  {
    path: '/affiche', name: 'notice-index', component: noticeIndex,
    meta: {isLogin: 0, title: '公告'},
    children: [
      {
        path: '/affiche', name: 'affiche', component: Affiche,
        meta: {isLogin: 0, title: '公告', name: 'Affiche', keepAlive: false, footer: true}
      },
      {
        path: '/searchList', name: 'searchList', component: searchList,
        meta: {isLogin: 0, title: '公告列表', name: 'Affiche', keepAlive: false, footer: true}
      },
      {
        path: '/afficheList', name: 'afficheList', component: afficheList,
        meta: {isLogin: 0, title: '关注公司', name: 'Affiche', keepAlive: false, footer: true}
      },
      {
        path: '/afficheSearch', name: 'afficheSearch', component: afficheSearch,
        meta: {isLogin: 0, title: '公告搜索', name: 'Affiche', keepAlive: false}
      },
      {
        path: '/afficheContent', name: 'afficheContent', component: afficheContent,
        meta: {isLogin: 0, title: '公告详情', keepAlive: false}
      },
      {
        path: '/Affpdf', name: 'Affpdf', component: Affpdf,
        meta: {isLogin: 1, title: '研报搜索', keepAlive: false}
      },
      {
        path: '/newAffiche', name: 'newAffiche', component: newAffiche,
        meta: {isLogin: 1, title: '关注公司最新公告', keepAlive: false}
      },
      //  最新路由
      {
        path: '/affiche/details', name: 'affiche-details', component: afficheContent,
        meta: {isLogin: 0, title: '公告详情', keepAlive: false}
      },
      {
        path: '/affiche/new', name: 'affiche-new', component: newAffiche,
        meta: {isLogin: 1, title: '关注公司最新公告', keepAlive: false}
      },
      {
        path: '/affiche/search', name: 'affiche-search', component: afficheSearch,
        meta: {isLogin: 0, title: '公告搜索', name: 'affiche', keepAlive: false}
      },
      {
        path: '/affiche/list', name: 'affiche-list', component: searchList,
        meta: {isLogin: 0, title: '公告列表', name: 'affiche', keepAlive: false, footer: true}
      },
      {
        path: '/affiche/company', name: 'affiche-company', component: afficheList,
        meta: {isLogin: 0, title: '关注公司', name: 'affiche', keepAlive: false, footer: true}
      },
    ]
  },
  //
  {
    path: '/home', name: 'my-index', component: myIndex,
    meta: {isLogin: 0, title: '个人中心', name: 'my-index'},
    children: [
      {
        path: '/number', name: 'number', component: number,
        meta: {isLogin: 0, title: '完善个人信息', keepAlive: false}
      },
      {
        path: '/reset', name: 'reset', component: reset,
        meta: {isLogin: 0, title: '找回密码', keepAlive: false}
      },
      {
        path: '/personal-info', name: 'personal-info', component: personalInfo,
        meta: {isLogin: 0, title: '完善个人信息', keepAlive: false}
      },
      {
        path: '/completeInfo', name: 'completeInfo', component: completeInfo,
        meta: {isLogin: 0, title: '完善个人信息', keepAlive: false}
      },
      // {
      //   path: '/login', name: 'login', component: login,
      //   meta: {isLogin: 1, title: '完善个人信息', keepAlive: false}
      // },
      {
        path: '/manage', name: 'manage', component: manage,
        meta: {isLogin: 0, title: '账号管理', keepAlive: false}
      },
      {
        path: '/manage/reviseInfo', name: 'reviseInfo', component: reviseInfo,
        meta: {isLogin: 0, title: '修改个人信息', keepAlive: false}
      },
      {
        path: '/manage/revisePhone', name: 'revisePhone', component: revisePhone,
        meta: {isLogin: 0, title: '修改绑定手机', keepAlive: false}
      },
      {
        path: '/manage/revisePassword', name: 'revisePassword', component: revisePassword,
        meta: {isLogin: 0, title: '修改登录密码', keepAlive: false}
      },
      {
        path: '/loadPass', name: 'loadPass', component: loadPass,
        meta: {isLogin: 0, title: '登录成功', keepAlive: false}
      }
    ]
  },
  // 研报
  {
    path: '/report', name: 'report-index', component: reportIndex,
    meta: {isLogin: 1, title: '研报'},
    children: [
      {
        path: '/report', name: 'report', component: report,
        meta: {isLogin: 1, title: '研报', name: 'Report', keepAlive: false, footer: true}
      },
      {
        path: '/searchReport', name: 'searchReport', component: searchReport,
        meta: {isLogin: 1, title: '研报搜索', keepAlive: false}
      },
      {
        path: '/listReport', name: 'listReport', component: listReport,
        meta: {isLogin: 1, title: '研报列表', keepAlive: false}
      },
      {
        path: '/detailReport', name: 'detailReport', component: detailReport,
        meta: {isLogin: 1, title: '研报', keepAlive: false}
      },
      {
        path: '/pdfReport', name: 'pdfReport', component: pdfReport,
        meta: {isLogin: 1, title: '研报', keepAlive: false}
      },
      // todo 最新路由引导
      {
        path: '/report/details', name: 'report-detail', component: detailReport,
        meta: {isLogin: 1, title: '研报', keepAlive: false}
      },
      {
        path: '/report/search', name: 'report-search', component: searchReport,
        meta: {isLogin: 1, title: '研报搜索', keepAlive: false}
      },
      {
        path: '/report/list', name: 'report-list', component: listReport,
        meta: {isLogin: 1, title: '研报列表', keepAlive: false}
      }
    ]
  },
  // 小鹅通
  {
    path: 'business-index', name: 'business-index', component: businessIndex, meta: {isLogin: 1, title: '商学院'},
    children: [
      {
        path: '/application', name: 'application', component: application,
        meta: {isLogin: 1, title: '申请开票信息', keepAlive: false}
      },
      {
        path: '/applicationList', name: 'applicationList', component: applicationList,
        meta: {isLogin: 1, title: '开票信息', keepAlive: false}
      },
      {
        path: '/applicationImg', name: 'applicationImg', component: applicationImg,
        meta: {isLogin: 1, title: '凭证示范', keepAlive: false}
      },
      {
        path: '/homework', name: 'homework', component: homework,
        meta: {isLogin: 1, title: '小鹅通作业', keepAlive: false}
      },
      {
        path: '/homeworkend', name: 'homeworkend', component: homeworkEnd,
        meta: {isLogin: 1, title: '我的作业', keepAlive: false}
      },

    ]
  },
  // 精选
  {
    path: '/ads', name: 'ads', component: ads,
    meta: {isLogin: 0, title: '精选', keepAlive: false}
  },
  // 我的关注
  {
    path: '/focus', name: 'focus', component: Focus,
    meta: {isLogin: 1, title: '我的关注', name: 'My', keepAlive: false, footer: true}
  },
  //
  {
    path: '/addFocus', name: 'addFocus', component: AddFocus,
    meta: {isLogin: 1, title: '添加关注', keepAlive: false}
  },
  // 收藏夹
  {
    path: '/collect', name: 'collect', component: collect,
    meta: {isLogin: 1, title: '我的收藏', name: 'My', keepAlive: false, footer: true}
  },
  //
  {
    path: '/collect/collectDetails', name: 'collectDetails', component: collectDetails,
    meta: {isLogin: 1, title: '我的收藏夹', keepAlive: false}
  },
  // 可订阅 推荐收藏夹
  {
    path: '/collectGroom', name: 'collectGroom', component: collectGrooms,
    meta: {isLogin: 0, title: '推荐收藏夹', keepAlive: false}
  },
  //
  {
    path: '/brief', name: 'brief', component: brief,
    meta: {isLogin: 0, title: '小安指南', keepAlive: false}
  },
  // 最新小安指南
  {
    path: '/manual', name: 'manual', component: manual,
    meta: {isLogin: 0, title: '小安指南2.0', name: 'My', keepAlive: false, footer: true}
  },
  //
  {
    path: '/manual/details', name: 'manual-details', component: manualDetails,
    meta: {isLogin: 0, title: '小安指南2.0', keepAlive: false}
  },
  // 质押
  {
    path: '/pledge', name: 'pledge', component: pledge,
    meta: {isLogin: 0, title: '股权质押', keepAlive: false}
  },
  // 权限速查
  {
    path: '/lookupTables', name: 'reference-index', component: referenceIndex,
    children: [
      {
        path: '/lookupTables', name: 'lookupTables', component: userTables,
        meta: {isLogin: 1, title: '权限速查', keepAlive: false}
      },
      {
        path: '/customerTables', name: 'customerTables', component: customerTables,
        meta: {isLogin: 1, title: '数据校准', keepAlive: false}
      },
      {
        path: '/innerCustomerTables', name: 'innerCustomerTables', component: innerCustomerTables,
        meta: {isLogin: 1, title: '数据校准', keepAlive: false}
      },
      {
        path: '/internalTables', name: 'internalTables', component: internalTables,
        meta: {isLogin: 1, title: '内部权限速查', keepAlive: false}
      },
      {
        path: '/searchPower', name: 'searchPower', component: searchPower,
        meta: {isLogin: 1, title: '权限速查'}
      },
      {
        path: '/searchInner', name: 'searchInner', component: searchInner,
        meta: {isLogin: 1, title: '权限速查', keepAlive: false}
      }
    ]
  },
  // 路演中
  {   //信公小安 路演中
    path: '/roadShow', name: 'roadShow', component: roadShow,
    meta: {isLogin: 1, title: '信公小安×路演中', keepAlive: false}
  },
  // 舆情
  {
    path: '/superviseList', name: 'opinion-index', component: opinionIndex,
    children: [
      {   //信公小安 路演中
        path: '/opinion', name: 'opinion', component: opinion,
        meta: {isLogin: 1, title: '舆情', keepAlive: false}
      },
      {   //信公小安 路演中
        path: '/supervise', name: 'supervise', component: supervise,
        meta: {isLogin: 1, title: '舆情', keepAlive: false}
      },
      {   //信公小安 路演中
        path: '/superviseList', name: 'superviseList', component: superviseList,
        meta: {isLogin: 1, title: '舆情', keepAlive: false}
      }
    ]
  },
  // demo
  {   //信公小安 路演中
    path: '/vueDemo', name: 'vueDemo', component: vueDemo,
    meta: {isLogin: 0, title: '信公小安',}
  },// demo
  {   //信公小安 路演中
    path: '/wx/user', name: 'vueDemo', component: wxUser,
    meta: {isLogin: 0, title: '信公小安',}
  },
  // 日历
  {
    path: '/calendar', name: 'calendar', component: calendar,
    children: [
      {   //信公小安 日历
        path: '/calendar/addCalendarItems', name: 'addCalendarItems', component: addCalendarItems,
        meta: {isLogin: 1, title: '日历-添加事件', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/calendarAll', name: 'calendarAll', component: calendarAll,
        meta: {isLogin: 1, title: '我的日历', keepAlive: false}
      },
      {   // 日历详情
        path: '/calendar/calendarDetails', name: 'calendarDetails', component: calendarDetails,
        meta: {isLogin: 1, title: '日历详情', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/calendarEventDetails', name: 'calendarEventDetails', component: calendarEventDetails,
        meta: {isLogin: 1, title: '日历-事件详情', keepAlive: false}
      }, {   //信公小安 日历
        path: '/calendar/calendarWork', name: 'calendarWork', component: calendarWork,
        meta: {isLogin: 1, title: '我的日历', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/calendarModifyColor', name: 'calendarModifyColor', component: calendarModifyColor,
        meta: {isLogin: 1, title: '编辑日历', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/calendarBacklog', name: 'calendarBacklog', component: calendarBacklog,
        meta: {isLogin: 1, title: '日历-提醒事项', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/calendarSearch', name: 'calendarSearch', component: calendarSearch,
        meta: {isLogin: 1, title: '日历-事件搜索', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/addCalendar', name: 'addCalendar', component: addCalendar,
        meta: {isLogin: 1, title: '添加日历', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/calendarShareEventDetails', name: 'calendarShareEventDetails',
        component: calendarShareEventDetails, meta: {isLogin: 1, title: '日历详情', keepAlive: false}
      },
      {   //信公小安 日历
        path: '/calendar/calendarList', name: 'calendarList', component: calendarList,
        meta: {isLogin: 1, title: '日历列表', keepAlive: false}
      }
    ]
  },
  // ipo
  {
    path: '/ipo',
    name: 'ipoIndex',
    redirect: '/ipo/list',
    component: ipoIndex,
    children: [
      {
        path: '/ipo/search', name: 'publishSearch', component: publishSearch,
        meta: {isLogin: 0, title: 'IPO搜索', publishType: "IPO", keepAlive: false}
      },
      {
        path: '/ipo/details', name: 'publishDetaile', component: publishDetaile,
        meta: {isLogin: 0, title: 'IPO详情页', publishType: "IPO", keepAlive: false}
      },
      {
        path: '/documentation', name: 'documentation', component: documentation,
        meta: {isLogin: 0, title: '文档', keepAlive: false}
      },
      {
        path: "/ipo/list", name: 'publishList', component: publishList,
        meta: {isLogin: 0, title: 'IPO', name: 'publishList', publishType: "IPO", keepAlive: true, footer: true}
      }
    ]
  },
  // 信乎
  {
    path: '/xhList',
    name: 'xh-index',
    component: xhIndex,
    meta: {isLogin: 1, title: '信乎'},
    children: [
      // 信乎
      {
        path: '/userOther', name: 'userOther', component: userOther,
        meta: {isLogin: 1, title: '用户', name: 'xinhu', keepAlive: false, footer: true}
      },
      {
        path: '/xhList', name: 'xhList', component: xhList,
        meta: {isLogin: 1, title: '信乎', name: 'xinhu', keepAlive: true, footer: true}
      },
      {
        path: '/xhSearchResult', name: 'xhSearchResult', component: xhSearchResult,
        meta: {isLogin: 1, title: '信乎', name: 'xinhu', keepAlive: true, footer: true}
      },
      {
        path: '/xhQuestion', name: 'xhQuestion', component: xhQuestion,
        meta: {isLogin: 1, title: '提问', keepAlive: true}
      },
      {
        path: '/xhTopic', name: 'xhTopic', component: xhTopic,
        meta: {isLogin: 1, title: '信乎', name: 'xinhu', keepAlive: false, footer: true}
      },
      {
        path: '/xhSearch', name: 'xhSearch', component: xhSearch,
        meta: {isLogin: 1, title: '信乎', keepAlive: false}
      },
      {
        path: '/xhQuestionDetaile', name: 'xhQuestionDetaile', component: xhQuestionDetaile,
        meta: {isLogin: 1, title: '信乎', keepAlive: false}
      },
      {
        path: '/xhAnswerDetaile', name: 'xhAnswerDetaile', component: xhAnswerDetaile,
        meta: {isLogin: 1, title: '信乎', keepAlive: false}
      },
      {
        path: '/xhAnswer', name: 'xhAnswer', component: xhAnswer,
        meta: {isLogin: 1, title: '信乎', keepAlive: false}
      },
      {
        path: '/xhRedirect', name: 'xhRedirect', component: xhRedirect,
        meta: {isLogin: 1, title: '信乎', keepAlive: false}
      }
    ]
  },
  // 企业版上传
  {
    path: '/enterpriseApply', name: 'enterpriseApply', component: enterpriseApply,
    meta: {isLogin: 1, title: '申请小安企业版', keepAlive: false}
  },
  // competition
  {
    path: '/competition', name: 'competition', redirect: '/competition/home', component: competition,
    meta: {tab: 'competition', isLogin: 1, title: '董办知识大赛', parent: true, keepAlive: false},
    children: [
      {
        path: '/competition/clause', name: 'competition-clause', component: compClause,
        meta: {tab: 'competition', isLogin: true, title: '活动条款', keepAlive: false},
      },
      {
        path: '/competition/enroll', name: 'competition-enroll', component: compEnroll,
        meta: {tab: 'competition', isLogin: true, title: '董办知识大赛', keepAlive: false},
      },
      {
        path: '/competition/upload', name: 'competition-upload', component: compUpload,
        meta: {tab: 'competition', isLogin: true, title: '上传个人名片', keepAlive: false},
      },
      {
        path: '/competition/home', name: 'competition-home', component: compHome,
        meta: {tab: 'competition', isLogin: true, title: '董办知识大赛', keepAlive: false},
      },
      {
        path: '/competition/testing', name: 'competition-testing', component: compTesting,
        meta: {tab: 'competition', isLogin: true, title: '答题', keepAlive: false},
      },
      {
        path: '/competition/result', name: 'competition-result', component: compResult,
        meta: {tab: 'competition', isLogin: true, title: '答题结果', keepAlive: false},
      },
      {
        path: '/competition/ranking', name: 'competition-ranking', component: compRanking,
        meta: {tab: 'competition', isLogin: true, title: '排行榜', keepAlive: false},
      },
      {
        path: '/competition/call', name: 'competition-call', component: compCall,
        meta: {tab: 'competition', isLogin: false, title: '董办打Call', keepAlive: false},
      },
      {
        path: '/competition/summary', name: 'competition-summary', component: compSummary,
        meta: {tab: 'summary', isLogin: true, title: '战绩总结', keepAlive: false},
      },
      {
        path: '/competition/invite', name: 'competition-invite', component: comInvite,
        meta: {tab: 'competition', isLogin: true, title: '邀请海报', keepAlive: false},
      },
      {
        path: '/competition/friendTesting', name: 'competition-friendTesting', component: comFriendTesting,
        meta: {tab: 'competition', isLogin: true, title: '邀请好友答题', keepAlive: false},
      },
      {
        path: '/competition/preheat', name: 'competition-preheat', component: comPreheat,
        meta: {tab: 'preheat', isLogin: true, title: '获奖名单', keepAlive: false},
      },
      {
        path: '/competition/details', name: 'competition-details', component: comDetails,
        meta: {tab: 'competition', isLogin: true, title: '积分详情', keepAlive: false},
      }
    ]
  },
  //  settings
  {
    path: '/settings', name: 'settings', component: vxaSettings,
    meta: {isLogin: 1, title: '设置', keepAlive: false},
    children: [
      {
        path: '/settings/wx', name: 'settings-wx', component: vxaSettingsWx,
        meta: {isLogin: 1, title: '微信通知设置', keepAlive: false},
      }
    ]
  },
  //  settings
  {
    path: '/electron/home', name: 'electron-home', component: electronHome,
    meta: {isLogin: 0, title: '科创板，我来了！', keepAlive: false},
  }, {
    path: '/electron', name: 'electron', component: electronDetails,
    meta: {isLogin: 0, title: '科创板，我来了！', keepAlive: false},
  },
  {
    path: '/electron/test', name: 'electron-test', component: electronTest,
    meta: {isLogin: 0, title: '科创板，我来了！', keepAlive: false},
  },
  {
    path: '/electron/share', name: 'electron-share', component: electronDetailsShare,
    meta: {isLogin: 0, title: '科创板，我来了！', keepAlive: false},
  },
]

export default routes
