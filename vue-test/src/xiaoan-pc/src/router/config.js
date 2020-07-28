const index = r => require.ensure([], () => r(require('@/view/index/index')), 'home')
const agreement = r => require.ensure([], () => r(require('@/view/index/agreement')), 'home')
const privacy = r => require.ensure([], () => r(require('@/view/index/privacy')), 'home')
const aboutus = r => require.ensure([], () => r(require('@/view/index/aboutus')), 'home')
const home = r => require.ensure([], () => r(require('@/view/home')), 'home')
const demo = r => require.ensure([], () => r(require('@/view/demo')), 'demo')

const transfer = r => require.ensure([], () => r(require('@/view/redirect/transfer')), 'user')
const redirect = r => require.ensure([], () => r(require('@/view/redirect/redirect')), 'user')
// const login = r => require.ensure([], () => r(require('@/view/passport/login')), 'user')
const login = r => require.ensure([], () => r(require('@/view/passport/loginLog')), 'user')
const companyLogin = r => require.ensure([], () => r(require('@/view/passport/companyLogin')), 'user')
const bindWeixin = r => require.ensure([], () => r(require('@/view/passport/bindWeixin')), 'user')
// const mobileBindWeiXin = r => require.ensure([], () => r(require('@/view/passport/mobileBindWeiXin')), 'user')
// const register = r => require.ensure([], () => r(require('@/view/passport/register')), 'user')
const personInfo = r => require.ensure([], () => r(require('@/view/passport/personInfo')), 'user')
const register = r => require.ensure([], () => r(require('@/view/passport/registerLog')), 'user')
const findPassword = r => require.ensure([], () => r(require('@/view/passport/findPassword')), 'user')
const manage = r => require.ensure([], () => r(require('@/view/user/manage')), 'user')
const account = r => require.ensure([], () => r(require('@/view/user/manage/account')), 'user')
const wxTransfer = r => require.ensure([], () => r(require('@/view/user/manage/wxTransfer')), 'user')
const person = r => require.ensure([], () => r(require('@/view/user/manage/person')), 'user')
const purchase = r => require.ensure([], () => r(require('@/view/user/manage/purchase')), 'user')
const purchaseApplication = r => require.ensure([], () => r(require('@/view/user/manage/purchaseApplication')), 'user')
const changeMobile = r => require.ensure([], () => r(require('@/view/user/manage/changeMobile')), 'change')
const changeEmail = r => require.ensure([], () => r(require('@/view/user/manage/changeEmail')), 'change')
const changePassword = r => require.ensure([], () => r(require('@/view/user/manage/changePassword')), 'change')
const changeWeixin = r => require.ensure([], () => r(require('@/view/user/manage/changeWeixin')), 'change')

const followUsers = r => require.ensure([], () => r(require('@/view/user/follow/users.vue')), 'followUsers')
const followQuestions = r => require.ensure([], () => r(require('@/view/user/follow/questions.vue')), 'followUsers')
const followTopics = r => require.ensure([], () => r(require('@/view/user/follow/topics.vue')), 'followUsers')
const followCompanies = r => require.ensure([], () => r(require('@/view/user/follow/companies.vue')), 'followUsers')
const followRegulations = r => require.ensure([], () => r(require('@/view/user/follow/regulations.vue')), 'followUsers')

const worksQuestions = r => require.ensure([], () => r(require('@/view/user/works/questions.vue')), 'works')
const worksAnswers = r => require.ensure([], () => r(require('@/view/user/works/answers.vue')), 'works')
const worksNoteLaw = r => require.ensure([], () => r(require('@/view/user/works/noteLaw.vue')), 'works')
const worksNoteList = r => require.ensure([], () => r(require('@/view/user/works/noteList.vue')), 'works')

const collect = r => require.ensure([], () => r(require('@/view/user/myCollect')), 'collect')
const addCollect = r => require.ensure([], () => r(require('@/view/user/collect/addCollect')), 'collect')
const subscribeList = r => require.ensure([], () => r(require('@/view/user/subscribe/subscribeList')), 'collect')
const collectDetails = r => require.ensure([], () => r(require('@/view/user/collect/collectDetails')), 'collect')
const subscribeContent = r => require.ensure([], () => r(require('@/view/user/subscribe/subscribeContent')), 'collect')

const share = r => require.ensure([], () => r(require('@/view/user/share')), 'user')
const follow = r => require.ensure([], () => r(require('@/view/user/follow')), 'user')
const works = r => require.ensure([], () => r(require('@/view/user/works')), 'user')
const favorite = r => require.ensure([], () => r(require('@/view/user/favorite')), 'user')
const subscribe = r => require.ensure([], () => r(require('@/view/user/subscribe')), 'user')
const goLogin = r => require.ensure([], () => r(require('@/view/user/goLogin')), 'user')
const changeCompany = r => require.ensure([], () => r(require('@/view/user/changeCompany')), 'change')

const rule = r => require.ensure([], () => r(require('@/view/rules/rule.vue')), 'rule')
const ruleDetail = r => require.ensure([], () => r(require('@/view/rules/ruleDetail')), 'rule')
const ruleCollect = r => require.ensure([], () => r(require('@/view/rules/ruleCollect')), 'rule')
const ruleCollectInfo = r => require.ensure([], () => r(require('@/view/rules/ruleCollectInfo')), 'rule')

const topTenRules = r => require.ensure([], () => r(require('@/view/rule/topTenRules')), 'rule')
const topTenDetails = r => require.ensure([], () => r(require('@/view/rule/topTenDetails')), 'rule')

const affiche = r => require.ensure([], () => r(require('@/view/affiche/affiche')), 'affiche')
const afficheDetails = r => require.ensure([], () => r(require('@/view/affiche/afficheDetails')), 'affiche')
const pdf = r => require.ensure([], () => r(require('@/view/affiche/pdf')), 'affiche')

const cases = r => require.ensure([], () => r(require('@/view/cases/cases')), 'cases')
const caseDetails = r => require.ensure([], () => r(require('@/view/cases/caseDetails')), 'cases')

const report = r => require.ensure([], () => r(require('@/view/report/report')), 'report')
const reportDetail = r => require.ensure([], () => r(require('@/view/report/reportDetails')), 'report')

const lookupTables = r => require.ensure([], () => r(require('@/view/user/lookupTables/lookupTables')), 'lookupTables')
const companyList = r => require.ensure([], () => r(require('@/view/user/lookupTables/companyList')), 'lookupTables')
const accessTables = r => require.ensure([], () => r(require('@/view/user/lookupTables/accessTables')), 'lookupTables')
//
const calendar = r => require.ensure([], () => r(require('@/view/user/calendar')), 'calendar')
const cIndex = r => require.ensure([], () => r(require('@/view/user/calendar/index')), 'calendar')
const cAddEvent = r => require.ensure([], () => r(require('@/view/user/calendar/addEvent')), 'calendar')
const cSearchEvent = r => require.ensure([], () => r(require('@/view/user/calendar/searchEvent')), 'calendar')
const cEventDetaile = r => require.ensure([], () => r(require('@/view/user/calendar/eventDetaile')), 'calendar')
const cEdit = r => require.ensure([], () => r(require('@/view/user/calendar/editCalendar')), 'calendar')
const cShareLink = r => require.ensure([], () => r(require('@/view/user/calendar/shareLink')), 'calendar')

const dashboard = r => require.ensure([], () => r(require('@/view/enterprises/dashboard')), 'enterprises')
const regulator = r => require.ensure([], () => r(require('@/view/enterprises/regulator')), 'enterprises')
const activities = r => require.ensure([], () => r(require('@/view/enterprises/activities')), 'enterprises')
const interacts = r => require.ensure([], () => r(require('@/view/enterprises/interacts')), 'enterprises')

const xhIndex = r => require.ensure([], () => r(require('@/view/xinhu/xhIndex')), 'xinhu')
const xhList = r => require.ensure([], () => r(require('@/view/xinhu/xhList')), 'xinhu')
const xhSearchResult = r => require.ensure([], () => r(require('@/view/xinhu/xhSearchResult')), 'xinhu')
const xhQuestionDetail = r => require.ensure([], () => r(require('@/view/xinhu/xhQuestionDetail')), 'xinhu')
const xhAnswerDetail = r => require.ensure([], () => r(require('@/view/xinhu/xhAnswerDetail')), 'xinhu')
const xhTopic = r => require.ensure([], () => r(require('@/view/xinhu/xhTopic')), 'xinhu')
const xhMy = r => require.ensure([], () => r(require('@/view/xinhu/xhMy')), 'xinhu')
//
const userManage = r => require.ensure([], () => r(require('@/view/enterprises/manage/userManage')), 'userManage')
const companyManage = r => require.ensure([], () => r(require('@/view/enterprises/manage/companyManage')), 'userManage')
const systemManage = r => require.ensure([], () => r(require('@/view/enterprises/manage/systemManage')), 'userManage')
const inviteUserManage = r => require.ensure([], () => r(require('@/view/enterprises/manage/inviteUserManage')), 'userManage')

//
const finance = r => require.ensure([], () => r(require('@/view/informationDisclosure/finance/finance')), 'enterprises')
const financeMain = r => require.ensure([], () => r(require('@/view/informationDisclosure/finance/financeMain')), 'enterprises')
const financeFinancials = r => require.ensure([], () => r(require('@/view/informationDisclosure/finance/financeFinancials')), 'enterprises')
const financeComparison = r => require.ensure([], () => r(require('@/view/informationDisclosure/finance/financeComparison')), 'enterprises')
const financeAnalyse = r => require.ensure([], () => r(require('@/view/informationDisclosure/finance/financeAnalyse')), 'enterprises')
//
const supervise = r => require.ensure([], () => r(require('@/view/supervise/supervise')), 'supervise')
//
const disclosure = r => require.ensure([], () => r(require('@/view/informationDisclosure/disclosure/disclosure')), 'disclosure')
const disclosureProceed = r => require.ensure([], () => r(require('@/view/informationDisclosure/disclosure/disclosureProceed')), 'disclosure')
const disclosureArchive = r => require.ensure([], () => r(require('@/view/informationDisclosure/disclosure/disclosureArchive.vue')), 'disclosure')
const disclosureChecklist = r => require.ensure([], () => r(require('@/view/informationDisclosure/disclosure/disclosureChecklist.vue')), 'disclosure')
//
const regulation = r => require.ensure([], () => r(require('@/view/regulation/regulation')), 'regulation')
const regulationManage = r => require.ensure([], () => r(require('@/view/regulation/regulationManage')), 'regulationManage')
const regulationLibrary = r => require.ensure([], () => r(require('@/view/regulation/regulationLibrary')), 'regulationLibrary')
//
const market = r => require.ensure([], () => r(require('@/view/condition/market')), 'condition')
const company = r => require.ensure([], () => r(require('@/view/condition/company')), 'condition')
const abnormal = r => require.ensure([], () => r(require('@/view/condition/abnormal')), 'condition')
//
const business = r => require.ensure([], () => r(require('@/view/business/business')), 'business')
const businessSchool = r => require.ensure([], () => r(require('@/view/business/businessSchool')), 'business')
const businessLibrary = r => require.ensure([], () => r(require('@/view/business/businessLibrary')), 'business')
const businessTraining = r => require.ensure([], () => r(require('@/view/business/businessTraining')), 'business')
const businessSwift = r => require.ensure([], () => r(require('@/view/business/businessSwift')), 'business')
const businessTest = r => require.ensure([], () => r(require('@/view/business/businessTest')), 'business')

//
const admin = r => require.ensure([], () => r(require('@/view/admin/admin')), 'enterprisesAdmin')
const adminMembers = r => require.ensure([], () => r(require('@/view/admin/members')), 'enterprisesAdmin')
const adminMembersManage = r => require.ensure([], () => r(require('@/view/admin/components/members/manage.vue')), 'enterprisesAdmin')
const adminMembersInvite = r => require.ensure([], () => r(require('@/view/admin/components/members/invite.vue')), 'enterprisesAdmin')
const adminApplication = r => require.ensure([], () => r(require('@/view/admin/application')), 'enterprisesAdmin')
const adminApplicationCompare = r => require.ensure([], () => r(require('@/view/admin/components/application/compare.vue')), 'enterprisesAdmin')
const adminApplicationCollect = r => require.ensure([], () => r(require('@/view/admin/components/application/collect.vue')), 'enterprisesAdmin')
const adminApplicationAddCollect = r => require.ensure([], () => r(require('@/view/admin/components/application/addCollect.vue')), 'enterprisesAdmin')
const adminApplicationSupervise = r => require.ensure([], () => r(require('@/view/admin/components/application/supervise.vue')), 'enterprisesAdmin')
const adminFinance = r => require.ensure([], () => r(require('@/view/admin/finance')), 'enterprisesAdmin')
const adminFinancePay = r => require.ensure([], () => r(require('@/view/admin/components/finance/pay.vue')), 'enterprisesAdmin')
const adminFinanceInvoice = r => require.ensure([], () => r(require('@/view/admin/components/finance/invoice.vue')), 'enterprisesAdmin')
// ====>
const loading = r => require.ensure([], () => r(require('@/components/loading')), 'loading')
// 投资者关系
const investorIndex = r => require.ensure([], () => r(require('@/view/investor/investorIndex')), 'investorSearch')
const investor = r => require.ensure([], () => r(require('@/view/investor/investor')), 'investorSearch')
const investorAnswer = r => require.ensure([], () => r(require('@/view/investor/investorAnswer')), 'investorSearch')
const investorPersonal = r => require.ensure([], () => r(require('@/view/investor/investorPersonal')), 'investorSearch')
const investorCompany = r => require.ensure([], () => r(require('@/view/investor/investorCompany')), 'investorSearch')
const investorCompanyOverview = r => require.ensure([], () => r(require('@/view/investor/company/investorCompanyOverview')), 'investorAll')
const investorCompanyList = r => require.ensure([], () => r(require('@/view/investor/company/investorCompanyList')), 'investorAll')
const investorLeaderboard = r => require.ensure([], () => r(require('@/view/investor/investorLeaderboard')), 'investorSearch')
const investorLeaderboardBrief = r => require.ensure([], () => r(require('@/view/investor/leaderboard/investorLeaderboardBrief')), 'investorAll')
const investorLeaderboardOverview = r => require.ensure([], () => r(require('@/view/investor/leaderboard/investorLeaderboardOverview')), 'investorAll')
//
const ipoIndex = r => require.ensure([], () => r(require('@/view/preIPO/ipoIndex')), 'ipoSearch')
const ipoSearch = r => require.ensure([], () => r(require('@/view/preIPO/ipoSearch')), 'ipoSearch')
const ipoDetails = r => require.ensure([], () => r(require('@/view/preIPO/ipoDetails')), 'ipoSearch')
//
const ipoRetrial = r => require.ensure([], () => r(require('@/view/preIPO/ipoRetrial')), 'ipoSearch')
const ipoRetrialList = r => require.ensure([], () => r(require('@/view/preIPO/components/ipoRetrialList')), 'ipoAll')
const ipoRetrialOverview = r => require.ensure([], () => r(require('@/view/preIPO/components/ipoRetrialOverview')), 'ipoAll')
//
const ipoWill = r => require.ensure([], () => r(require('@/view/preIPO/ipoWill')), 'ipoSearch')
const ipoWillList = r => require.ensure([], () => r(require('@/view/preIPO/components/ipoWillList')), 'ipoAll')
const ipoWillOverview = r => require.ensure([], () => r(require('@/view/preIPO/components/ipoWillOverview')), 'ipoAll')

// 股东行为分析
const stockholder = r => require.ensure([], () => r(require('@/view/stockholder/stockholder')), 'datastockholder')
// 股东数据管理
const dataManage = r => require.ensure([], () => r(require('@/view/stockholder/dataManage/dataManage')), 'dataManagestockholder')
const rosterExport = r => require.ensure([], () => r(require('@/view/stockholder/dataManage/rosterExport')), 'rosterExportstockholder')
const groupSet = r => require.ensure([], () => r(require('@/view/stockholder/dataManage/groupSet')), 'datastockholder')
const investorManage = r => require.ensure([], () => r(require('@/view/stockholder/dataManage/investorManage')), 'dataManagestockholder')
const relationshipResearch = r => require.ensure([], () => r(require('@/view/stockholder/dataManage/relationshipResearch')), 'datastockholder')
const surveyRecords = r => require.ensure([], () => r(require('@/view/stockholder/dataManage/surveyRecords')), 'surveyRecordstockholder')
// 股东对比分析
const comparisonAnalysis = r => require.ensure([], () => r(require('@/view/stockholder/comparisonAnalysis/comparisonAnalysis')), 'Comparisonstockholder')
const stockholderComparison = r => require.ensure([], () => r(require('@/view/stockholder/comparisonAnalysis/stockholderComparison')), 'Comparisonstockholder')
const subitemComparison = r => require.ensure([], () => r(require('@/view/stockholder/comparisonAnalysis/subitemComparison')), 'Comparisonstockholder')
const groupComparison = r => require.ensure([], () => r(require('@/view/stockholder/comparisonAnalysis/groupComparison')), 'Comparisonstockholder')
//
const viewShareholder = r => require.ensure([], () => r(require('@/view/stockholder/viewShareholder/rosterViewShareholder')), 'Comparisonstockholder')
// 股东信息检索
const historyStockholder = r => require.ensure([], () => r(require('@/view/stockholder/informationRetrieval/historyStockholder')), 'stockholder')
const marketInstitution = r => require.ensure([], () => r(require('@/view/stockholder/informationRetrieval/marketInstitution')), 'stockholder')
// 个人信息
const institutionIndex = r => require.ensure([], () => r(require('@/view/stockholder/institutionPerson/institutionIndex')), 'institutionstockholder')
const institutionAccountInfo = r => require.ensure([], () => r(require('@/view/stockholder/institutionPerson/institutionAccountInfo')), 'institutionstockholder')
const institutionBaseInfo = r => require.ensure([], () => r(require('@/view/stockholder/institutionPerson/institutionBaseInfo')), 'institutionstockholder')
const institutionManageInfo = r => require.ensure([], () => r(require('@/view/stockholder/institutionPerson/institutionManageInfo')), 'institutionstockholder')
const institutionOtherInfo = r => require.ensure([], () => r(require('@/view/stockholder/institutionPerson/institutionOtherInfo')), 'institutionstockholder')
const institutionRelation = r => require.ensure([], () => r(require('@/view/stockholder/institutionPerson/institutionRelation')), 'institutionstockholder')
const institutionRisk = r => require.ensure([], () => r(require('@/view/stockholder/institutionPerson/institutionRisk')), 'institutionstockholder')
// 股东趋势
const trendAnalysis = r => require.ensure([], () => r(require('@/view/stockholder/trendAnalysis/trendAnalysis')), 'stockholder')
// 最新股东分析
const newStockholderAnalysis = r => require.ensure([], () => r(require('@/view/stockholder/newStockholderAnalysis/newStockholderAnalysis')), 'stockholder')
const importantStock = r => require.ensure([], () => r(require('@/view/stockholder/newStockholderAnalysis/importantStock')), 'stockholder')
const stockStruct = r => require.ensure([], () => r(require('@/view/stockholder/newStockholderAnalysis/stockStruct')), 'stockholder')
const stockRollOfficial = r => require.ensure([], () => r(require('@/view/stockholder/newStockholderAnalysis/stockRollOfficial')), 'stockholder')

// 相关报告的页面
const RAIndex = r => require.ensure([], () => r(require('@/view/reportAudit/RAIndex')), 'RA')
const RAUpload = r => require.ensure([], () => r(require('@/view/reportAudit/RAUpload')), 'RA')
const RAResult = r => require.ensure([], () => r(require('@/view/reportAudit/RAResult')), 'RA')
const RADetail = r => require.ensure([], () => r(require('@/view/reportAudit/RADetail')), 'RA')
// 舆情
const sentimentIndex = r => require.ensure([], () => r(require('@/view/sentiment/index.vue')), 'sentiment')
const companySentiment = r => require.ensure([], () => r(require('@/view/sentiment/companySentiment')), 'companysentiment')
const marketSentiment = r => require.ensure([], () => r(require('@/view/sentiment/marketSentiment')), 'marketsentiment')
const sentimentMonitor = r => require.ensure([], () => r(require('@/view/sentiment/sentimentMonitor')), 'sentiment')
const sentimentSearch = r => require.ensure([], () => r(require('@/view/sentiment/sentimentSearch')), 'sentiment')

const companySentimentList = r => require.ensure([], () => r(require('@/view/sentiment/companySentimentList')), 'Monitorsentiment')
const sentimentMonitorCustom = r => require.ensure([], () => r(require('@/view/sentiment/sentimentMonitorCustom')), 'Monitorsentiment')
const sentimentMonitorReport = r => require.ensure([], () => r(require('@/view/sentiment/sentimentMonitorReport')), 'Monitorsentiment')
const sentimentMonitorUpdateCustom = r => require.ensure([], () => r(require('@/view/sentiment/sentimentMonitorUpdateCustom')), 'Monitorsentiment')
//
const competitionIndex = r => require.ensure([], () => r(require('@/view/competition/competition')), 'competition')
const competitionHome = r => require.ensure([], () => r(require('@/view/competition/home')), 'competition')
const competitionUpload = r => require.ensure([], () => r(require('@/view/competition/upload')), 'competition')
const competitionUploadSuccess = r => require.ensure([], () => r(require('@/view/competition/uploadSuccess')), 'competition')
const competitionActivityAnswer = r => require.ensure([], () => r(require('@/view/competition/activityAnswer')), 'competition')
const competitionJoin = r => require.ensure([], () => r(require('@/view/competition/join')), 'competition')
const competitionAnswerResults = r => require.ensure([], () => r(require('@/view/competition/answerResults')), 'competition')
const competitionTerms = r => require.ensure([], () => r(require('@/view/competition/term')), 'competition')
const competitionCall = r => require.ensure([], () => r(require('@/view/competition/call')), 'competition')
const competitionHeart = r => require.ensure([], () => r(require('@/view/competition/hearting')), 'competition')
const competitionEndPage = r => require.ensure([], () => r(require('@/view/competition/endPage')), 'competition')

const kechuangban = r => require.ensure([], () => r(require('@/view/kechuangban/kechuangban.vue')), 'kechuangban')
const expertRead = r => require.ensure([], () => r(require('@/view/kechuangban/expertRead.vue')), 'expertRead')
const kechuangbanDetails = r => require.ensure([], () => r(require('@/view/kechuangban/kechuangbanDetails.vue')), 'kechuangbanDetails')
const kechuangbanIpo = r => require.ensure([], () => r(require('@/view/kechuangban/kechuangbanIpo.vue')), 'kechuangbanIpo')
const kechuangbanTrend = r => require.ensure([], () => r(require('@/view/kechuangban/kechuangbanTrend.vue')), 'kechuangbanTrend')
const kechuangbanInfo = r => require.ensure([], () => r(require('@/view/kechuangban/kechuangbanInfo.vue')), 'kechuangbanInfo')

const yunyiUpload = r => require.ensure([], () => r(require('@/view/yunyi/upload/yunyiUpload')), 'yunyi')
const yunyiError = r => require.ensure([], () => r(require('@/view/yunyi/upload/error')), 'yunyi')
const repair = r => require.ensure([], () => r(require('@/view/repair/repair')), 'user')

const equityIncentive = r => require.ensure([], () => r(require('@/view/equityIncentive/equityIncentive.vue')), 'equityIncentive')
const basicSituation = r => require.ensure([], () => r(require('@/view/equityIncentive/basicSituation/basicSituation')), 'equityIncentive')
const chartOverview = r => require.ensure([], () => r(require('@/view/equityIncentive/basicSituation/chartOverview')), 'equityIncentive')
const projectManagement = r => require.ensure([], () => r(require('@/view/equityIncentive/projectManagement/projectManagement')), 'equityIncentive')
const complateNewPro = r => require.ensure([], () => r(require('@/view/equityIncentive/projectManagement/complateNewPro')), 'equityIncentive')
const planManagement = r => require.ensure([], () => r(require('@/view/equityIncentive/projectManagement/planManagement')), 'equityIncentive')
const personalInformation = r => require.ensure([], () => r(require('@/view/equityIncentive/projectManagement/personalInformation')), 'equityIncentive')
const personalManagement = r => require.ensure([], () => r(require('@/view/equityIncentive/personalManagement/personalManagement')), 'equityIncentive')
const tool = r => require.ensure([], () => r(require('@/view/equityIncentive/tool/tool')), 'equityIncentive')
const preview = r => require.ensure([], () => r(require('@/view/equityIncentive/tool/preview')), 'equityIncentive')
const editQuestion = r => require.ensure([], () => r(require('@/view/equityIncentive/tool/editQuestion')), 'equityIncentive')
const statistics = r => require.ensure([], () => r(require('@/view/equityIncentive/tool/statistics')), 'equityIncentive')
const statisticsChart = r => require.ensure([], () => r(require('@/view/equityIncentive/tool/statisticsChart')), 'equityIncentive')
const file = r => require.ensure([], () => r(require('@/view/equityIncentive/file/file')), 'equityIncentive')
const questionsAndAnswers = r => require.ensure([], () => r(require('@/view/equityIncentive/questionsAndAnswers/questionsAndAnswers')), 'equityIncentive')

const IncentiveObject = r => require.ensure([], () => r(require('@/view/IncentiveObject/IncentiveObject.vue')), 'IncentiveObject')
const myEquityIncentive = r => require.ensure([], () => r(require('@/view/IncentiveObject/myEquityIncentive/myEquityIncentive')), 'myEquityIncentive')
const myquestionsAndAnswers = r => require.ensure([], () => r(require('@/view/IncentiveObject/myquestionsAndAnswers/myquestionsAndAnswers')), 'myquestionsAndAnswers')

const URL = [
  {
    path: '/',
    name: 'home',
    component: home,
    redirect: '/index',
    meta: {loginState: 1, title: '信公小安', tabName: '/'},
    children: [
      {path: '/index', name: 'index', component: index, meta: {loginState: 0, title: '信公小安', tabName: 'index'}},
      {
        path: '/agreement',
        name: 'agreement',
        component: agreement,
        meta: {loginState: 0, title: '信公小安用户协议', tabName: ''}
      },
      {path: '/privacy', name: 'privacy', component: privacy, meta: {loginState: 0, title: '信公小安隐私条款', tabName: ''}},
      {path: '/aboutus', name: 'aboutus', component: aboutus, meta: {loginState: 0, title: '关于信公', tabName: ''}},
      {path: '/redirect', name: 'redirect', component: redirect, meta: {loginState: 0, title: '跳转中', tabName: ''}},
      {path: '/login', name: 'login', component: login, meta: {loginState: 0, title: '登录', tabName: 'login'}},
      {
        path: '/companyLogin',
        name: 'companyLogin',
        component: companyLogin,
        meta: {loginState: 0, title: '登录', tabName: ''}
      },
      {
        path: '/bindWeixin',
        name: 'bindWeixin',
        component: bindWeixin,
        meta: {loginState: 0, title: '扫码绑定微信', tabName: ''}
      },
      {path: '/register', name: 'register', component: register, meta: {loginState: 0, title: '注册', tabName: ''}},
      {
        path: '/personInfo',
        name: 'personInfo',
        component: personInfo,
        meta: {loginState: 0, title: '个人信息', tabName: ''}
      },
      {
        path: '/findPassword',
        name: 'findPassword',
        component: findPassword,
        meta: {loginState: 0, title: '找回密码', tabName: ''}
      },
      {
        path: '/manage',
        name: 'manage',
        component: manage,
        meta: {loginState: 1, title: '账号管理', tabName: ''},
        redirect: '/manage/account',
        children: [
          {
            path: '/manage/account',
            name: 'account',
            component: account,
            meta: {loginState: 1, title: '账号信息', tabName: 'account'}
          },
          {
            path: '/manage/person',
            name: 'person',
            component: person,
            meta: {loginState: 1, title: '个人信息', tabName: 'person'}
          },
          {
            path: '/manage/purchase',
            name: 'purchase',
            component: purchase,
            meta: {loginState: 1, title: '套餐选择', tabName: 'purchase'}
          },
          {
            path: '/manage/purchaseApplication',
            name: 'purchaseApplication',
            component: purchaseApplication,
            meta: {loginState: 1, title: '套餐选择', tabName: 'purchase'}
          },
          {
            path: '/manage/changeCompany',
            name: 'changeCompany',
            component: changeCompany,
            meta: {loginState: 1, title: '套餐选择', tabName: 'purchase'}
          }
        ]
      },
      {
        path: '/wxTransfer',
        name: 'wxTransfer',
        component: wxTransfer,
        meta: {loginState: 0, title: '账号', tabName: 'wxTransfer'}
      },
      {
        path: '/follow',
        name: 'follow',
        component: follow,
        meta: {loginState: 1, title: '我的关注', tabName: ''},
        redirect: '/follow/users',
        children: [
          {
            path: '/follow/users',
            name: 'followUsers',
            component: followUsers,
            meta: {loginState: 1, title: '关注用户', tabName: 'users'}
          },
          {
            path: '/follow/questions',
            name: 'followQuestions',
            component: followQuestions,
            meta: {loginState: 1, title: '关注问题', tabName: 'questions'}
          },
          {
            path: '/follow/topics',
            name: 'followTopics',
            component: followTopics,
            meta: {loginState: 1, title: '关注话题', tabName: 'topics'}
          },
          {
            path: '/follow/companies',
            name: 'followCompanies',
            component: followCompanies,
            meta: {loginState: 1, title: '关注公司', tabName: 'companies'}
          },
          {
            path: '/follow/regulations',
            name: 'followRegulations',
            component: followRegulations,
            meta: {loginState: 1, title: '关注法规合集', tabName: 'regulations'}
          }
        ]
      },
      {
        path: '/works',
        name: 'works',
        component: works,
        meta: {loginState: 1, title: '我的创作', tabName: ''},
        redirect: '/works/questions',
        children: [
          {
            path: '/works/questions',
            name: 'worksQuestions',
            component: worksQuestions,
            meta: {loginState: 1, title: '我的提问', tabName: 'questions'}
          },
          {
            path: '/works/answers',
            name: 'worksAnswers',
            component: worksAnswers,
            meta: {loginState: 1, title: '我的回答', tabName: 'answers'}
          },
          {
            path: '/works/noteLaw',
            name: 'worksNoteLaw',
            component: worksNoteLaw,
            meta: {loginState: 1, title: '我的笔记', tabName: 'noteLaw'}
          },
          {
            path: '/works/noteList',
            name: 'worksNoteList',
            component: worksNoteList,
            meta: {loginState: 1, title: '我的笔记', tabName: 'noteLaw'}
          }
        ]
      },
      {
        path: '/changeMobile',
        name: 'changeMobile',
        component: changeMobile,
        meta: {loginState: 1, title: '修改手机', tabName: ''}
      },
      {
        path: '/changeEmail',
        name: 'changeEmail',
        component: changeEmail,
        meta: {loginState: 1, title: '修改邮箱', tabName: ''}
      },
      {
        path: '/changePassword',
        name: 'changePassword',
        component: changePassword,
        meta: {loginState: 1, title: '修改密码', tabName: ''}
      },
      {
        path: '/changeWeixin',
        name: 'changeWeixin',
        component: changeWeixin,
        meta: {loginState: 1, title: '重新绑定微信', tabName: ''}
      },
      {
        path: '/collect',
        name: 'collect',
        component: collect,
        meta: {loginState: 1, title: '我的收藏', tabName: ''},
        redirect: '/collect/addCollect',
        children: [
          {
            path: '/collect/collectDetails',
            name: 'collectDetails',
            component: collectDetails,
            meta: {loginState: 1, title: '收藏夹内容', tabName: 'collectDetails'}
          },
          {
            path: '/collect/addCollect',
            name: 'addCollect',
            component: addCollect,
            meta: {loginState: 1, title: '新建收藏夹', tabName: 'addCollect'}
          }
        ]
      },
      {path: '/share', name: 'share', component: share, meta: {loginState: 1, title: '我的分享', tabName: ''}},
      {
        path: '/favorite',
        name: 'favorite',
        component: favorite,
        meta: {loginState: 1, title: '我的收藏', tabName: 'favorite'},
        alias: ['/favorite-rules', '/favorite-affiche', '/favorite-cases', '/favorite-IPO', '/favorite-report']
      },
      {path: '/subscribe', name: 'subscribe', component: subscribe, meta: {loginState: 1, title: '我的订阅', tabName: ''}},
      {
        path: '/lookupTables',
        name: 'lookupTables',
        component: lookupTables,
        meta: {loginState: 1, title: '我的权限速查表', tabName: 'lookuptables'},
        redirect: '/lookupTables/companyList',
        children: [
          {
            path: '/lookupTables/companyList',
            name: 'companyList',
            component: companyList,
            meta: {loginState: 1, title: '我的权限速查表', tabName: 'lookuptables'}
          }
        ]
      },
      {
        path: '/accessTables',
        name: 'accessTables',
        component: accessTables,
        meta: {loginState: 1, title: '我的权限速查表', tabName: 'lookuptables'}
      },
      {
        path: '/subscribeList',
        name: 'subscribeList',
        component: subscribeList,
        meta: {loginState: 1, title: '订阅内容', tabName: ''},
        redirect: '/subscribeList/subscribeContent',
        children: [
          {
            path: '/subscribeList/subscribeContent',
            name: 'subscribeContent',
            component: subscribeContent,
            meta: {loginState: 1, title: '订阅内容', tabName: ''}
          }
        ]
      },
      {
        path: '/calendar',
        name: 'calendar',
        component: calendar,
        meta: {loginState: 1, title: '我的日历', tabName: ''},
        redirect: '/calendar/index',
        children: [
          {
            path: '/calendar/index',
            name: 'cIndex',
            component: cIndex,
            meta: {loginState: 1, title: '我的日历', tabName: 'calendar'}
          },
          {
            path: '/calendar/addEvent',
            name: 'cAddEvent',
            component: cAddEvent,
            meta: {loginState: 1, title: '添加事件', tabName: 'calendar', keepAlive: false}
          },
          {
            path: '/calendar/searchEvent',
            name: 'cSearchEvent',
            component: cSearchEvent,
            meta: {loginState: 1, title: '搜索事件', tabName: 'calendar', keepAlive: true}
          },
          {
            path: '/calendar/eventDetaile',
            name: 'cEventDetaile',
            component: cEventDetaile,
            meta: {loginState: 1, title: '事件详情', tabName: 'calendar', keepAlive: false}
          },
          {
            path: '/calendar/editCalendar',
            name: 'cEdit',
            component: cEdit,
            meta: {loginState: 1, title: '编辑日历', tabName: 'calendar', keepAlive: false}
          },
          {
            path: '/calendar/shareLink',
            name: 'cShareLink',
            component: cShareLink,
            meta: {loginState: 1, title: '共享链接', tabName: 'calendar', keepAlive: false}
          }
        ]
      },
      {
        path: '/rule',
        name: 'rule',
        component: rule,
        meta: {loginState: 0, title: '法规', tabName: 'rule', aside: true, asideOption: ['collect', 'track']}
      },
      {
        path: '/rule/details',
        name: 'ruleDetail',
        component: ruleDetail,
        meta: {
          loginState: 0,
          title: '法规详情',
          tabName: 'rule',
          aside: true,
          asideOption: ['note', 'collect', 'print', 'track', 'share', 'zoom']
        }
      },
      {
        path: '/ruleCollect',
        name: 'ruleCollect',
        component: ruleCollect,
        meta: {loginState: 1, title: '法规汇编', tabName: 'ruleCollect', aside: true, asideOption: ['collect', 'track']}
      },
      {
        path: '/topTenRules',
        name: 'topTenRules',
        component: topTenRules,
        meta: {loginState: 1, title: '十大新规', tabName: 'topTenRules'}
      },
      {
        path: '/topTenDetails',
        name: 'topTenDetails',
        component: topTenDetails,
        meta: {loginState: 1, title: '十大新规', tabName: 'topTenDetails'}
      },
      {
        path: '/ruleCollectInfo',
        name: 'ruleCollectInfo',
        component: ruleCollectInfo,
        meta: {loginState: 1, title: '法规汇编', tabName: 'ruleCollect', aside: true, asideOption: ['collect', 'track']}
      },
      {
        path: '/affiche',
        name: 'affiche',
        component: affiche,
        meta: {loginState: 0, title: '公告', tabName: 'affiche', aside: true, asideOption: ['collect', 'track']}
      },
      {
        path: '/affiche/details',
        name: 'afficheContent',
        component: afficheDetails,
        meta: {
          loginState: 0,
          title: '公告详情',
          tabName: 'affiche',
          aside: true,
          asideOption: ['note', 'collect', 'share', 'zoom']
        }
      },
      {
        path: '/case',
        name: 'cases',
        component: cases,
        meta: {loginState: 1, title: '案例', tabName: 'cases', aside: true, asideOption: ['collect', 'track']}
      },
      {
        path: '/report',
        name: 'report',
        component: report,
        meta: {loginState: 1, title: '研报', tabName: 'report', aside: true, asideOption: ['collect', 'track']}
      },
      {
        path: '/report/details',
        name: 'reportDetail',
        component: reportDetail,
        meta: {
          loginState: 1,
          title: '研报详情',
          tabName: 'report',
          aside: true,
          asideOption: ['note', 'collect', 'share', 'zoom']
        }
      },
      {
        path: '/case/details',
        name: 'caseDetail',
        component: caseDetails,
        meta: {loginState: 1, title: '案例详情', tabName: 'cases', aside: true, asideOption: ['note', 'collect', 'zoom']}
      },
      // 企业版新增页面
      {
        path: '/xhList',
        name: 'xhIndex',
        component: xhIndex,
        meta: {loginState: 1, title: '信乎社区', tabName: 'xhList', aside: true, asideOption: ['collect', 'track']},
        children: [
          {
            path: '/xhQuestionDetail',
            name: 'xhQuestionDetail',
            component: xhQuestionDetail,
            meta: {loginState: 1, title: '信乎社区', tabName: 'xhList'}
          },
          {
            path: '/xhAnswerDetail',
            name: 'xhAnswerDetail',
            component: xhAnswerDetail,
            meta: {
              loginState: 1,
              title: '信乎社区',
              tabName: 'xhList',
              aside: true,
              asideOption: ['note', 'collect', 'share']
            }
          },
          {
            path: '/xhList', name: 'xhList', component: xhList,
            meta: {loginState: 1, title: '信乎社区', tabName: 'xhList', aside: true, asideOption: ['collect', 'track']}
          },
          {
            path: '/xhSearchResult',
            name: 'xhSearchResult',
            component: xhSearchResult,
            meta: {loginState: 1, title: '信乎社区', tabName: 'xhList'}
          },
          {
            path: '/xhTopic',
            name: 'xhTopic',
            component: xhTopic,
            meta: {loginState: 1, title: '信乎社区', tabName: 'xhList'}
          },
          {path: '/xhMy', name: 'xhMy', component: xhMy, meta: {loginState: 1, title: '信乎社区', tabName: 'xhList'}}
          // {path: '/xhTop', name: 'xhTop', component: xhTop, meta: {loginState: 1, title: '信乎', tabName: 'xhList'}}
        ]
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard,
        meta: {loginState: 2, title: '信公小安企业版', tabName: 'dashboard'}
      },
      {
        path: '/dashboard/regulator',
        name: 'regulator',
        component: regulator,
        meta: {loginState: 2, title: '信公小安', tabName: 'regulator'}
      },
      {
        path: '/activities',
        name: 'activities',
        component: activities,
        meta: {loginState: 1, title: '监管动态', tabName: 'dashboard'}
      },
      {
        path: '/interacts',
        name: 'interacts',
        component: interacts,
        meta: {loginState: 2, title: '公司投资者问答', tabName: 'dashboard'}
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: userManage,
        meta: {loginState: 2, title: '用户管理', tabName: 'userManage'}
      },
      {
        path: '/companyManage',
        name: 'companyManage',
        component: companyManage,
        meta: {loginState: 2, title: '公司管理', tabName: 'userManage'}
      },
      {
        path: '/systemManage',
        name: 'systemManage',
        component: systemManage,
        meta: {loginState: 2, title: '系统管理', tabName: 'userManage'}
      },
      {
        path: '/inviteUserManage',
        name: 'inviteUserManage',
        component: inviteUserManage,
        meta: {loginState: 1, title: '企业邀请', tabName: 'inviteUserManage'}
      },
      //
      {
        path: '/supervise',
        name: 'supervise',
        component: supervise,
        meta: {loginState: 2, title: '舆情监控', tabName: 'supervise'}
      },
      //
      {
        path: '/finance',
        name: 'finance',
        component: finance,
        meta: {loginState: 2, title: '财务分析', tabName: 'finance'},
        redirect: '/finance/main', // finance-main
        children: [
          {
            path: '/finance/main',
            name: 'main',
            component: financeMain,
            meta: {loginState: 2, title: '财务分析', tabName: 'main'}
          },
          {
            path: '/finance/financials',
            name: 'financials',
            component: financeFinancials,
            meta: {loginState: 2, title: '财务分析', tabName: 'financials'}
          },
          {
            path: '/finance/comparison',
            name: 'comparison',
            component: financeComparison,
            meta: {loginState: 2, title: '财务分析', tabName: 'comparison'}
          },
          {
            path: '/finance/analyse',
            name: 'analyse',
            component: financeAnalyse,
            meta: {loginState: 2, title: '财务分析', tabName: 'analyse'}
          }
        ]
      },
      {
        path: 'disclosure',
        name: 'disclosure',
        component: disclosure,
        meta: {loginState: 2, title: '披露清单', tabName: 'disclosure'},
        redirect: '/disclosure/checklist',
        children: [
          {
            path: '/disclosure/proceed',
            name: 'proceed',
            component: disclosureProceed,
            meta: {loginState: 2, title: '披露清单', tabName: 'proceed'}
          },
          {
            path: '/disclosure/archive',
            name: 'archive',
            component: disclosureArchive,
            meta: {loginState: 2, title: '披露清单', tabName: 'archive'}
          },
          {
            path: '/disclosure/checklist',
            name: 'checklist',
            component: disclosureChecklist,
            meta: {loginState: 2, title: '披露清单', tabName: 'checklist'}
          }
        ]
      },
      {
        path: '/regulation',
        name: 'regulation',
        component: regulation,
        meta: {loginState: 2, title: '公司规章制度', tabName: 'regulation'},
        redirect: '/regulation/library',
        children: [{
          path: '/regulation/manage',
          name: 'regulationManage',
          component: regulationManage,
          meta: {loginState: 2, title: '公司规章制度', tabName: 'manage'}
        },
          {
            path: '/regulation/library',
            name: 'regulationLibrary',
            component: regulationLibrary,
            meta: {loginState: 2, title: '公司规章制度', tabName: 'library'}
          }
        ]
      },
      {
        path: '/business',
        name: 'business',
        component: business,
        meta: {loginState: 0, title: '信公商学院', tabName: 'business'},
        redirect: '/business/school',
        children: [{
          path: '/business/school',
          name: 'businessSchool',
          component: businessSchool,
          meta: {loginState: 0, title: '在线课堂', tabName: 'businessSchool'}
        },
          {
            path: '/business/training',
            name: 'businessTraining',
            component: businessTraining,
            meta: {loginState: 0, title: '培训信息', tabName: 'businessTraining'}
          },
          {
            path: '/business/test',
            name: 'businessTest',
            component: businessTest,
            meta: {loginState: 0, title: '董秘测试', tabName: 'businessTest'}
          },
          {
            path: '/business/library',
            name: 'businessLibrary',
            component: businessLibrary,
            meta: {loginState: 0, title: '信公图书馆', tabName: 'businessLibrary'}
          },
          {
            path: '/business/swift',
            name: 'businessSwift',
            component: businessSwift,
            meta: {loginState: 0, title: '信公精选', tabName: 'businessSwift'}
          }
        ]
      },
      // 企业管理
      {
        path: '/admin',
        name: 'enterprises-admin',
        component: admin,
        redirect: '/admin/members/manage',
        meta: {loginState: 2, title: '企业管理', tabName: 'admin'},
        children: [
          {
            path: '/admin/members',
            name: 'admin-members',
            component: adminMembers,
            meta: {loginState: 2, title: '团队管理', tabName: 'members'},
            redirect: '/admin/members/manage',
            children: [
              {
                path: '/admin/members/manage',
                name: 'admin-members-manage',
                component: adminMembersManage,
                meta: {loginState: 2, title: '成员管理', tabName: 'members-manage'}
              },
              {
                path: '/admin/members/invite',
                name: 'admin-members-invite',
                component: adminMembersInvite,
                meta: {loginState: 2, title: '添加成员', tabName: 'members-invite'}
              }
            ]
          },
          {
            path: '/admin/application',
            name: 'admin-application',
            redirect: '/admin/application/compare',
            component: adminApplication,
            meta: {loginState: 2, title: '成员管理', tabName: 'application'},
            children: [
              {
                path: '/admin/application/compare',
                name: 'admin-application-compare',
                component: adminApplicationCompare,
                meta: {loginState: 2, title: '可比公司', tabName: 'application-compare'}
              },
              {
                path: '/admin/application/collect',
                name: 'admin-application-collect',
                component: adminApplicationCollect,
                meta: {loginState: 2, title: '团队收藏夹', tabName: 'application-collect'}
              },
              {
                path: '/admin/application/addCollect',
                name: 'admin-application-addCollect',
                component: adminApplicationAddCollect,
                meta: {loginState: 2, title: '团队收藏夹', tabName: 'application-collect'}
              },
              {
                path: '/admin/application/supervise',
                name: 'admin-application-supervise',
                component: adminApplicationSupervise,
                meta: {loginState: 2, title: '舆情设置', tabName: 'application-supervise'}
              }
            ]
          },
          {
            path: '/admin/finance',
            name: 'admin-finance',
            component: adminFinance,
            redirect: '/admin/finance/pay',
            meta: {loginState: 2, title: '成员管理', tabName: 'finance'},
            children: [
              {
                path: '/admin/finance/pay',
                name: 'admin-application-pay',
                component: adminFinancePay,
                meta: {loginState: 2, title: '可比公司', tabName: 'finance-pay'}
              },
              {
                path: '/admin/finance/invoice',
                name: 'admin-application-invoice',
                component: adminFinanceInvoice,
                meta: {loginState: 2, title: '可比公司', tabName: 'finance-invoice'}
              }
            ]
          }
        ]
      },
      {
        path: '/market-condition',
        name: 'market',
        component: market,
        meta: {loginState: 1, title: '市场行情', tabName: 'market'}
      },
      {
        path: '/company-condition',
        name: 'company',
        component: company,
        meta: {loginState: 1, title: '公司行情', tabName: 'company'}
      },
      {
        path: '/company-condition/:code',
        name: 'companyCustom',
        component: company,
        meta: {loginState: 1, title: '公司行情', tabName: 'company'}
      },
      {
        path: '/abnormal-condition',
        name: 'abnormal',
        component: abnormal,
        meta: {loginState: 2, title: '异常波动报告', tabName: 'abnormal-condition'}
      },
      // 投资者关系
      {
        path: '/investor',
        name: 'investor-index',
        component: investorIndex,
        redirect: '/investor/search',
        meta: {loginState: 2, title: '投资者关系'},
        children: [
          {
            path: '/investor/search',
            name: 'investor',
            component: investor,
            meta: {
              loginState: 2,
              title: '投资者关系',
              tabName: 'investor-search',
              aside: true,
              asideOption: ['collect', 'track']
            }
          }, {
            path: '/investor/answer',
            name: 'investor-answer',
            component: investorAnswer,
            meta: {loginState: 2, title: '投资者关系', tabName: 'investor-search', asideOption: ['note', 'collect', 'track']}
          }, {
            path: '/investor/personal',
            name: 'investor-personal',
            component: investorPersonal,
            meta: {loginState: 2, title: '个人投资者关系', tabName: 'investor-search'}
          }, {
            path: '/investor/company',
            name: 'investor-company',
            component: investorCompany,
            redirect: '/investor/company/list',
            meta: {loginState: 2, title: '公司e互动'},
            children: [
              {
                path: '/investor/company/list',
                name: 'investor-company-list',
                component: investorCompanyList,
                meta: {loginState: 2, title: '公司e互动', check: 'list', tabName: 'investor-company-overview'}
              }, {
                path: '/investor/company/overview',
                name: 'investor-company-overview',
                component: investorCompanyOverview,
                meta: {loginState: 2, title: '公司e互动', check: 'overview', tabName: 'investor-company-overview'}
              }
            ]
          }, {
            path: '/investor/leaderboard',
            name: 'investor-leaderboard',
            component: investorLeaderboard,
            redirect: '/investor/leaderboard/brief',
            meta: {title: 'e互动排行榜'},
            children: [
              {
                path: '/investor/leaderboard/brief',
                name: 'investor-leaderboard-brief',
                component: investorLeaderboardBrief,
                meta: {loginState: 1, title: 'e互动排行榜', check: 'brief', tabName: 'investor-leaderboard-overview'}
              }, {
                path: '/investor/leaderboard/overview',
                name: 'investor-leaderboard-overview',
                component: investorLeaderboardOverview,
                meta: {loginState: 1, title: '市场概况', check: 'overview', tabName: 'investor-leaderboard-overview'}
              }
            ]
          }
        ]
      },
      {
        path: '/ipo',
        name: 'ipo',
        component: ipoIndex,
        redirect: '/ipo/search',
        meta: {},
        children: [
          {
            path: '/ipo/search',
            name: 'ipo-search',
            component: ipoSearch,
            meta: {loginState: 1, title: 'IPO搜索', tabName: 'ipo-search', aside: true, asideOption: ['collect', 'track']}
          },
          {
            path: '/ipo/details',
            name: 'ipo-details',
            component: ipoDetails,
            meta: {
              loginState: 1,
              title: 'IPO详情',
              tabName: 'ipo-search',
              aside: true,
              asideOption: ['note', 'collect', 'print']
            }
          },
          {
            path: '/ipo/retrial',
            name: 'ipo-retrial',
            redirect: '/ipo/retrial/list',
            component: ipoRetrial,
            meta: {title: 'IPO在审公司统计'},
            children: [
              {
                path: '/ipo/retrial/list',
                name: 'ipo-retrial-list',
                component: ipoRetrialList,
                meta: {loginState: 1, title: 'IPO在审公司统计', check: 'list', tabName: 'ipo-retrial-overview'}
              }, {
                path: '/ipo/retrial/overview',
                name: 'ipo-retrial-overview',
                component: ipoRetrialOverview,
                meta: {loginState: 1, title: 'IPO在审公司统计', check: 'overview', tabName: 'ipo-retrial-overview'}
              }
            ]
          },
          {
            path: '/ipo/will',
            name: 'ipo-will',
            redirect: '/ipo/will/list',
            component: ipoWill,
            meta: {title: 'IPO上会统计'},
            children: [
              {
                path: '/ipo/will/list',
                name: 'ipo-will-list',
                component: ipoWillList,
                meta: {loginState: 1, title: 'IPO上会统计', check: 'list', tabName: 'ipo-will-overview'}
              }, {
                path: '/ipo/will/overview',
                name: 'ipo-will-overview',
                component: ipoWillOverview,
                meta: {loginState: 1, title: 'IPO上会统计', check: 'overview', tabName: 'ipo-will-overview'}
              }
            ]
          }
        ]
      },
      {
        path: '/stockholder',
        name: 'stockholder',
        component: stockholder,
        meta: {loginState: 1, title: '股东行为分析', tabName: 'stockholder'},
        redirect: '/stockholder/rosterExport', // finance-main
        children: [
          {
            path: '/stockholder/dataManage', name: 'dataManage', component: dataManage,
            meta: {loginState: 2, title: '股东数据管理', tabName: 'dataManage'},
            redirect: '/stockholder/rosterExport',
            children: [
              {
                path: '/stockholder/rosterExport',
                name: 'rosterExport',
                component: rosterExport,
                meta: {loginState: 2, title: '股东数据管理', tabName: 'dataManage', needDateCount: 0}
              },
              {
                path: '/stockholder/groupSet',
                name: 'groupSet',
                component: groupSet,
                meta: {loginState: 2, title: '股东数据管理', tabName: 'dataManage'}
              },
              {
                path: '/stockholder/investorManage',
                name: 'investorManage',
                component: investorManage,
                meta: {loginState: 2, title: '股东数据管理', tabName: 'dataManage'}
              },
              {
                path: '/stockholder/relationshipResearch',
                name: 'investorManage-relationshipResearch',
                component: relationshipResearch,
                meta: {loginState: 2, title: '股东数据管理', tabName: 'dataManage'}
              },
              {
                path: '/stockholder/surveyRecords',
                name: 'investorManage-surveyRecords',
                component: surveyRecords,
                meta: {loginState: 2, title: '股东数据管理', tabName: 'dataManage'}
              }
            ]
          },
          {
            path: '/stockholder/comparisonAnalysis', name: 'comparisonAnalysis', component: comparisonAnalysis,
            meta: {loginState: 2, title: '股东对比分析', tabName: 'comparisonAnalysis'},
            redirect: '/stockholder/stockholderComparison',
            children: [
              {
                path: '/stockholder/stockholderComparison',
                name: 'comparisonAnalysis-stockholderComparison',
                component: stockholderComparison,
                meta: {loginState: 2, title: '股东对比分析总览', tabName: 'comparisonAnalysis', needDateCount: 2}
              },
              {
                path: '/stockholder/subitemComparison',
                name: 'comparisonAnalysis-subitemComparison',
                component: subitemComparison,
                meta: {loginState: 2, title: '分项股东对比分析', tabName: 'comparisonAnalysis', needDateCount: 2}
              },
              {
                path: '/stockholder/groupComparison',
                name: 'comparisonAnalysis-groupComparison',
                component: groupComparison,
                meta: {loginState: 2, title: '分组对比分析', tabName: 'comparisonAnalysis', needDateCount: 2}
              }
            ]
          },
          {
            path: '/stockholder/newStockholderAnalysis',
            name: 'newStockholderAnalysis',
            component: newStockholderAnalysis,
            meta: {loginState: 2, title: '最新股东分析', tabName: 'newStockholderAnalysis'},
            redirect: '/stockholder/importantStock',
            children: [
              {
                path: '/stockholder/importantStock',
                name: 'newStockholderAnalysis-importantStock',
                component: importantStock,
                meta: {loginState: 2, title: '重要股东', tabName: 'newStockholderAnalysis'}
              },
              {
                path: '/stockholder/stockStruct',
                name: 'newStockholderAnalysis-stockStruct',
                component: stockStruct,
                meta: {loginState: 2, title: '股东结构', tabName: 'newStockholderAnalysis'}
              },
              {
                path: '/stockholder/stockRollOfficial',
                name: 'newStockholderAnalysis-stockRollOfficial',
                component: stockRollOfficial,
                meta: {loginState: 2, title: '股东名册', tabName: 'newStockholderAnalysis'}
              }
            ]
          },
          {
            path: '/stockholder/institutionAccountInfo',
            name: 'institutionIndex',
            component: institutionIndex,
            meta: {loginState: 2, title: '股东个人详情', tabName: 'informationRetrieval', showMenu: 'hide'},
            children: [
              {
                path: '/stockholder/institutionAccountInfo',
                name: 'institutionAccountInfo',
                component: institutionAccountInfo,
                meta: {loginState: 2, title: '股东详情', tabName: 'institutionAccountInfo', active: '', showMenu: 'hide'}
              },
              {
                path: '/stockholder/institutionBaseInfo',
                name: 'institutionBaseInfo',
                component: institutionBaseInfo,
                meta: {loginState: 2, title: '股东详情', tabName: 'institutionBaseInfo', active: '', showMenu: 'hide'}
              },
              {
                path: '/stockholder/institutionManageInfo',
                name: 'institutionManageInfo',
                component: institutionManageInfo,
                meta: {loginState: 2, title: '股东详情', tabName: 'institutionManageInfo', active: '', showMenu: 'hide'}
              },
              {
                path: '/stockholder/institutionOtherInfo',
                name: 'institutionOtherInfo',
                component: institutionOtherInfo,
                meta: {loginState: 2, title: '股东详情', tabName: 'institutionOtherInfo', active: '', showMenu: 'hide'}
              },
              {
                path: '/stockholder/institutionRelation',
                name: 'institutionRelation',
                component: institutionRelation,
                meta: {loginState: 2, title: '股东详情', tabName: 'institutionRelation', active: '', showMenu: 'hide'}
              },
              {
                path: '/stockholder/institutionRisk',
                name: 'institutionRisk',
                component: institutionRisk,
                meta: {loginState: 2, title: '股东详情', tabName: 'institutionRisk', active: '', showMenu: 'hide'}
              }
            ]
          },
          {
            path: '/stockholder/historyStockholder',
            name: 'historyStockholder',
            component: historyStockholder,
            meta: {loginState: 2, title: '股东信息检索', tabName: 'informationRetrieval'}
          },
          {
            path: '/stockholder/viewShareholder',
            name: 'viewShareholder',
            component: viewShareholder,
            meta: {loginState: 2, title: '查看股东名册', tabName: 'informationRetrieval', showMenu: 'hide'}
          },
          {
            path: '/stockholder/trendAnalysis',
            name: 'trendAnalysis',
            component: trendAnalysis,
            meta: {loginState: 1, title: '股东趋势', tabName: 'trendAnalysis', active: '', needDateCount: 0}
          },
          {
            path: '/stockholder/marketInstitution',
            name: 'marketInstitution',
            component: marketInstitution,
            meta: {loginState: 2, title: '股东信息检索', tabName: 'informationRetrieval'}
          }
        ]
      },
      {
        path: '/audit',
        name: 'audit-index',
        component: RAIndex,
        redirect: '/audit/upload',
        meta: {loginState: 1, title: '相关报告', tabName: 'audit'},
        children: [
          {
            path: '/audit/upload',
            name: 'audit-upload',
            component: RAUpload,
            meta: {loginState: 1, title: '相关报告结果', tabName: 'audit'}
          },
          {
            path: '/audit/result',
            name: 'audit-result',
            component: RAResult,
            meta: {loginState: 1, title: '相关报告结果', tabName: 'audit'}
          },
          {
            path: '/audit/detail',
            name: 'audit-detail',
            component: RADetail,
            meta: {loginState: 1, title: '相关报告详情', tabName: 'audit'}
          }
        ]
      },
      {
        path: '/sentiment',
        name: 'sentiment-index',
        component: sentimentIndex,
        // redirect: '/sentiment',
        meta: {loginState: 1, title: '舆情', tabName: 'sentiment'},
        children: [
          {
            path: '/sentiment/companySentiment',
            name: 'sentiment-companySentiment',
            component: companySentiment,
            meta: {loginState: 1, title: '公司舆情', tabName: 'sentiment'}
          },
          {
            path: '/sentiment/companySentimentList',
            name: 'sentiment-companySentimentList',
            component: companySentimentList,
            meta: {loginState: 1, title: '公司舆情详情', tabName: 'sentiment'}
          },
          {
            path: '/sentiment/marketSentiment',
            name: 'sentiment-marketSentiment',
            component: marketSentiment,
            meta: {loginState: 1, title: '市场舆情', tabName: 'sentiment'}
          },
          {
            path: '/sentiment/sentimentSearch',
            name: 'sentiment-sentimentSearch',
            component: sentimentSearch,
            meta: {loginState: 1, title: '舆情实时搜索', tabName: 'sentiment'}
          },
          {
            path: '/sentiment/sentimentMonitor',
            name: 'sentiment-sentimentMonitor',
            component: sentimentMonitor,
            meta: {loginState: 1, title: '自定义舆情监控', tabName: 'sentiment'}
          },
          {
            path: '/sentiment/sentimentMonitorCustom',
            name: 'sentiment-sentimentMonitorCustom',
            component: sentimentMonitorCustom,
            meta: {loginState: 1, title: '新建自定义舆情监控方案', tabName: 'sentiment'}
          },
          {
            path: '/sentiment/sentimentMonitorReport',
            name: 'sentiment-sentimentMonitorReport',
            component: sentimentMonitorReport,
            meta: {loginState: 1, title: '生成自定义舆情报告', tabName: 'sentiment'}
          },
          {
            path: '/sentiment/sentimentMonitorUpdateCustom',
            name: 'sentiment-sentimentMonitorUpdateCustom',
            component: sentimentMonitorUpdateCustom,
            meta: {loginState: 1, title: '自定义舆情报告监控方案编辑', tabName: 'sentiment'}
          }
        ]
      },
      {
        path: '/competition', name: 'competition',
        component: competitionIndex,
        redirect: '/competition/home',
        meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competitionHeart'},
        children: [
          {
            path: '/competition/home', name: 'competition-home',
            component: competitionHome,
            meta: {mobile: '#/competition/home', loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/upload', name: 'competition-upload',
            component: competitionUpload,
            meta: {mobile: '#/competition/upload', loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/uploadSuccess', name: 'competition-upload-success',
            component: competitionUploadSuccess,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/activityAnswer', name: 'competition-activity-answer',
            component: competitionActivityAnswer,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/join', name: 'competition-join',
            component: competitionJoin,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/answerResults', name: 'competition-answer-results',
            component: competitionAnswerResults,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/call', name: 'competition-call',
            component: competitionCall,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/term', name: 'competition-term',
            component: competitionTerms,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/heart', name: 'competition-heart',
            component: competitionHeart,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          },
          {
            path: '/competition/endPage', name: 'competition-endPage',
            component: competitionEndPage,
            meta: {loginState: 0, title: '信公杯董办知识大赛', tabName: 'competition'}
          }
        ]
      },
      // 科创版
      {
        name: 'kechuangban',
        path: '/kechuangban',
        component: kechuangban,
        // redirect: '/kechuangban',
        meta: {loginState: 0, title: '科创板', tabName: 'kechuangban'}
      },
      {
        name: 'expertRead',
        path: '/kechuangban/expertRead',
        component: expertRead,
        meta: {loginState: 1, title: '科创板', tabName: 'expertRead'}
      },
      {
        name: 'kechuangbanDetails',
        path: '/kechuangban/details',
        component: kechuangbanDetails,
        meta: {loginState: 1, title: '科创板', tabName: 'kechuangbanDetails'}
      },
      {
        name: 'kechuangbanIpo',
        path: '/kechuangban/kechuangbanIpo',
        component: kechuangbanIpo,
        meta: {loginState: 1, title: '科创板IPO检索', tabName: 'kechuangbanIpo', aside: true, asideOption: ['collect', 'track']}
      },
      {
        name: 'kechuangbanTrend',
        path: '/kechuangban/kechuangbanTrend',
        component: kechuangbanTrend,
        meta: {loginState: 1, title: '科创板IPO在审公司统计', tabName: 'kechuangbanTrend'}
      },
      {
        name: 'kechuangbanInfo',
        path: '/kechuangban/info',
        component: kechuangbanInfo,
        meta: {loginState: 1, title: '公司详情', tabName: 'kechuangbanInfo'}
      },
      // 云译
      {
        path: '/yunyi',
        name: 'yunyi',
        component: yunyiUpload,
        meta: {loginState: 1, title: '云译', tabName: 'yunyi'}
      },
      {
        path: '/error',
        name: 'error',
        component: yunyiError,
        meta: {loginState: 1, title: '翻译错误', tabName: 'yunyiError'}
      },
      {
        path: '/repair',
        name: 'repair',
        component: repair,
        meta: {loginState: 0, title: '系统正在升级维护中！', tabName: 'repair'}
      },
      /**/
      /**/
      /**/
      {
        path: '/equityIncentive',
        name: 'equityIncentive',
        redirect: '/equityIncentive/basicSituation',
        component: equityIncentive,
        meta: {loginState: 0, title: '股权激励', tabName: ''},
        children: [
          {
            path: '/equityIncentive/basicSituation',
            name: 'basicSituation',
            component: basicSituation,
            meta: {loginState: 0, title: '公司基本情况', tabName: 'basicSituation'}
          },
          {
            path: '/equityIncentive/chartOverview',
            name: 'chartOverview',
            component: chartOverview,
            meta: {loginState: 0, title: '公司基本情况', tabName: 'chartOverview'}
          },
          {
            path: '/equityIncentive/projectManagement',
            name: 'projectManagement',
            component: projectManagement,
            meta: {loginState: 0, title: '项目管理', tabName: 'projectManagement'}
          },
          {
            path: '/equityIncentive/complateNewPro',
            name: 'complateNewPro',
            component: complateNewPro,
            meta: {loginState: 0, title: '项目管理', tabName: 'complateNewPro'}
          },
          {
            path: '/equityIncentive/planManagement',
            name: 'planManagement',
            component: planManagement,
            meta: {loginState: 0, title: '项目管理', tabName: 'planManagement'}
          },
          {
            path: '/equityIncentive/personalInformation',
            name: 'personalInformation',
            component: personalInformation,
            meta: {loginState: 0, title: '项目管理', tabName: 'personalInformation'}
          },
          {
            path: '/equityIncentive/personalManagement',
            name: 'personalManagement',
            component: personalManagement,
            meta: {loginState: 0, title: '人员管理', tabName: 'personalManagement'}
          },
          {
            path: '/equityIncentive/tool',
            name: 'tool',
            component: tool,
            meta: {loginState: 0, title: '辅助工具', tabName: 'tool'}
          },
          {
            path: '/equityIncentive/preview',
            name: 'preview',
            component: preview,
            meta: {loginState: 0, title: '辅助工具', tabName: 'preview'}
          },
          {
            path: '/equityIncentive/editQuestion',
            name: 'editQuestion',
            component: editQuestion,
            meta: {loginState: 0, title: '辅助工具', tabName: 'editQuestion'}
          },
          {
            path: '/equityIncentive/statistics',
            name: 'statistics',
            component: statistics,
            meta: {loginState: 0, title: '辅助工具', tabName: 'statistics'}
          },
          {
            path: '/equityIncentive/statisticsChart',
            name: 'statisticsChart',
            component: statisticsChart,
            meta: {loginState: 0, title: '辅助工具', tabName: 'statisticsChart'}
          },
          {
            path: '/equityIncentive/file',
            name: 'file',
            component: file,
            meta: {loginState: 0, title: '文件库', tabName: 'file'}
          },
          {
            path: '/equityIncentive/questionsAndAnswers',
            name: 'questionsAndAnswers',
            component: questionsAndAnswers,
            meta: {loginState: 0, title: '文件库', tabName: 'questionsAndAnswers'}
          }
        ]
      },
      {
        path: '/IncentiveObject',
        name: 'IncentiveObject',
        redirect: '/IncentiveObject/myEquityIncentive',
        component: IncentiveObject,
        meta: {loginState: 0, title: '被激励对象', tabName: ''},
        children: [
          {
            path: '/IncentiveObject/myEquityIncentive',
            name: 'myEquityIncentive',
            component: myEquityIncentive,
            meta: {loginState: 0, title: '我的股权激励', tabName: 'myEquityIncentive'}
          },
          {
            path: '/IncentiveObject/myquestionsAndAnswers',
            name: 'myquestionsAndAnswers',
            component: myquestionsAndAnswers,
            meta: {loginState: 0, title: '问答', tabName: 'myquestionsAndAnswers'}
          }
        ]
      }
    ]
  },
  {path: '/pdf', name: 'pdf', component: pdf, meta: {loginState: 0, title: '公告详情', tabName: 'affiche'}},
  {path: '/goLogin', name: 'goLogin', component: goLogin, meta: {loginState: 0, title: '请先登录', tabName: ''}},
  {path: '/loading', name: 'loading', component: loading, meta: {title: '加载中'}},
  {path: '/transfer', name: 'transfer', component: transfer, meta: {title: ''}},
  {path: '/demo', name: 'demo', component: demo, meta: {title: ''}}
]
export default URL
