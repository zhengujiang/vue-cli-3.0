import HOSTS from '@/service/host' // HOSTS抽离
// const HOST = HOSTS[process.env.XA_ENV]
const HOST = HOSTS['production']
const GXFHOST = HOST.gxfApi;
const BUSINESS = HOST.api.replace('/zuul', '/v1');
const MOBHOST = HOST.api.replace('/zuul', '/v1').replace('desktop', 'api');
//
export default {
  // origin: protocol + '//' + document.location.host + '/',
  host: HOST.host,
  enterpriseHost: HOST.enterpriseHost,
  cookieHost: HOST.cookieHost,
  appid: HOST.appid,
  xinhuUserId: HOST.xinhuUserId,
  mobileHost: HOST.mobileHost, // 分享对应手机端链接配置
  //
  business: {
    getBusinessDetail: HOST.business + 'business/getBusinessDetail', // 获取详情
    getShowList: HOST.business + 'business/getShowList', // 更具tab获取显示列表
    getTypes: HOST.business + 'business/getTypes' // 获取type列表
  },
  competition: {
    checkCanInviteSecretart: MOBHOST + 'competition/checkCanInviteSecretart', // 是否已帮该用户打CALL
    checkInviteSecretary: MOBHOST + 'competition/checkInviteSecretary', // 是否已邀请董秘打call
    increaseSecretaryRecord: MOBHOST + 'competition/increaseSecretaryRecord', // 增加董秘打CALL记录
    uploadCasecard: MOBHOST + 'competition/uploadCasecard', // 上传名片
    checkUserCaseUpload: MOBHOST + 'competition/checkUserCaseUpload', // 检查用户是否已上传名片
    checkIn: MOBHOST + 'competition/checkIn', // 签到
    getAllTestPaper: MOBHOST + 'competition/getAllTestPaper', // 获取所有试卷
    getUserCheckStatus: MOBHOST + 'competition/getUserCheckStatus', // 获取签到状态
    nextQuestion: MOBHOST + 'competition/nextQuestion', // 下一题
    startTest: MOBHOST + 'competition/startTest', // 开始测试
    endTest: MOBHOST + 'competition/endTest', // 结束测试
    checkUserApply: MOBHOST + 'competition/checkUserApply', // 检查用户是否已报名
    increaseAnswerNum: MOBHOST + 'competition/increaseAnswerNum', // 增加答题次数
    getRankingList: MOBHOST + 'competition/getRankingList', // 获取排行榜
    setJoinOffLine: MOBHOST + 'competition/setJoinOffLine', // 设置是否参加线下活动
    getMineInvite: MOBHOST + 'competition/getMineInvite', // 设置是否参加线下活动
    updateUserIsJoin: MOBHOST + 'competition/updateUserIsJoin', // 修改用户为报名状态
    getQuestionById: MOBHOST + 'competition/getQuestionById', // 修改用户为报名状态
    getNotFinishTest: MOBHOST + 'competition/getNotFinishTest', // 获取当前用户未结束测试
    getIntegralDetails: MOBHOST + 'competition/getIntegralDetails', // 获取积分详情信息
    checkJoinOffLineSet: MOBHOST + 'competition/checkJoinOffLineSet' // 获取积分详情信息
  },
  gxfApi: {
    // 上传 部分
    fileUpload: GXFHOST + 'rollManger/fileUpload',
    getUserUploadRecord: GXFHOST + 'rollManger/getUserUploadRecord',
    deleteBySummaryIds: GXFHOST + 'rollManger/deleteBySummaryIds',
    batchDeleteUploadRecords: GXFHOST + 'rollManger/batchDeleteUploadRecords',
    updateAgreeMent: GXFHOST + 'rollManger/updateAgreeMent',
    // 股东人员信息
    searchHolderInfo: GXFHOST + 'holderoll/searchHolderInfo', // 股东人员信息
    // 股东分组及设置
    addGroup: GXFHOST + 'holdegroup/addGroup', // 添加分组
    deleteGroup: GXFHOST + 'holdegroup/deleteGroup', // 删除分组
    deleteHoldCrew: GXFHOST + 'holdegroup/deleteHoldCrew', // 删除控股股东
    editGroupInfo: GXFHOST + 'holdegroup/editGroupInfo', // 修改组信息
    editGroupGuardLine: GXFHOST + 'holdegroup/editGroupGuardLine', // 修改警戒线
    getGroupListInfo: GXFHOST + 'holdegroup/getGroupListInfo', // 获取组信息
    getLastedRecordDate: GXFHOST + 'holdegroup/getLastedRecordDate', // 获取最新期数
    getPossessorTypes: GXFHOST + 'holdegroup/getPossessorTypes', // 获取最新期数
    setControllShareholder: GXFHOST + 'holdegroup/setControllShareholder', // 设置控股股东
    // 股东名册查看及导出
    exportRollOfficial: GXFHOST + 'rollSearch/exportRollOfficial', // 导出股东名册
    getShareStatistics: GXFHOST + 'rollSearch/getShareStatistics', // 获取 股本数据/户数数据 统计
    searchRollOfficial: GXFHOST + 'rollSearch/searchRollOfficial', // 股东名册搜索
    getNewRollOfficial: GXFHOST + 'rollSearch/getNewRollOfficial', // 从股东名册中添加
    getHistoryHolderInfo: GXFHOST + 'rollSearch/getHistoryHolderInfo', // 历史股东搜索
    getAddressList: GXFHOST + 'rollSearch/getAddressList', // 获取指定期数的地域集合
    getHotInstitutioninfo: GXFHOST + 'rollSearch/getHotInstitutioninfo', // 获取机构热词
    getOfficialDataByInstitution: GXFHOST + 'rollSearch/getOfficialDataByInstitution', // 获取股东信息
    getAutoCompleteHotWord: GXFHOST + 'rollSearch/getAutoCompleteHotWord', // 自动填充机构热词
    getHistoryAutoCompleteHotWord: GXFHOST + 'rollSearch/getHistoryAutoCompleteHotWord', // 自动填充历史股东条件

    // 投资者数据库管理
    searchInvestor: GXFHOST + 'investor/searchInvestor', // 搜索投资者
    getById: GXFHOST + 'investor/getById', // 获取投资者信息byId
    uploadInvestor: GXFHOST + 'investor/uploadInvestor', // 导出数据库
    autoInvestor: GXFHOST + 'investor/autoInvestor', // 搜素自动填充
    deleteInvestor: GXFHOST + 'investor/deleteInvestor', // 删除调研记录
    addInvestor: GXFHOST + 'investor/addInvestor', // 增加投资者
    updateInvestor: GXFHOST + 'investor/updateInvestor', // 编辑投资者

    // 投资者数据库调研记录管理
    addInvestorResearchRecord: GXFHOST + 'investorResearchRecord/addInvestorResearchRecord', // 增加调研记录
    deleteInvestorResearchRecord: GXFHOST + 'investorResearchRecord/deleteInvestorResearchRecord', // 删除投资调研记录
    downloadInvestorResearchRecord: GXFHOST + 'investorResearchRecord/downloadInvestorResearchRecord', // 下载投资调研记录
    editInvestorResearchRecord: GXFHOST + 'investorResearchRecord/editInvestorResearchRecord', // 修改投资调研记录
    getInvestor: GXFHOST + 'investorResearchRecord/getInvestor', // 获取参与人
    getInvestorResearchRecord: GXFHOST + 'investorResearchRecord/getInvestorResearchRecord', // 查询投资调研记录
    getOneInvestor: GXFHOST + 'investorResearchRecord/getOneInvestor', // 编辑调研记录

    // 股东对比
    exportComparisonExcel: GXFHOST + 'holdecomparison/exportComparisonExcel', // 导出对比报告
    exportOneKeyComparisonExcel: GXFHOST + 'holdecomparison/exportOneKeyComparisonExcel', // 导出一键对比Excel报告
    getGroupComparisonChart: GXFHOST + 'holdecomparison/getGroupComparisonChart', // 获取分组对比变动图
    getGroupComparisonInfo: GXFHOST + 'holdecomparison/getGroupComparisonInfo', // 分组股东对比-股东组对比信息
    getHolderComparisonChart: GXFHOST + 'holdecomparison/getHolderComparisonChart', // 获取股东对比变动图
    getHolderComparisonChooseDate: GXFHOST + 'holdecomparison/getHolderComparisonChooseDate', // 股东对比分析总览-获取股东对比信息可选日期
    getHolderComparisonInfo: GXFHOST + 'holdecomparison/getHolderComparisonInfo', // 股东对比分析总览-获取股东对比信息
    getHolderPropertyComparisonInfo: GXFHOST + 'holdecomparison/getHolderPropertyComparisonInfo', // 分项股东对比-股东性质对比信息
    getOneKeyComparisonInfo: GXFHOST + 'holdecomparison/getOneKeyComparisonInfo', // 股东对比分析总览-获取一键对比信息
    getStockPriceComparison: GXFHOST + 'holdecomparison/getStockPriceComparison', // 获取股价对比
    // shareholder-list-controller : 股东名单
    searchShareholderList: GXFHOST + 'lastedholder/searchShareholderList', // 股东名单搜索
    holdingStockDegree: GXFHOST + 'lastedholder/holdingStockDegree', // 按持股集中度搜索
    holderType: GXFHOST + 'lastedholder/holderType', // 按股东性质
    getCreditGuaranteeInfo: GXFHOST + 'lastedholder/getCreditGuaranteeInfo', // 信用担保用户情况
    holderAddress: GXFHOST + 'lastedholder/holderAddress', // 按股东地理位置

    getShareholderStatistics: GXFHOST + 'lastedholder/getShareStatistics', // 股东名单--获取 股本数据/户数数据 统计
    exportShareholderList: GXFHOST + 'lastedholder/exportShareholderList', // 股东名单--获取 股本数据/户数数据 统计
    // 最新股东分析
    getImportantHolderOverview: GXFHOST + 'lastedholder/getImportantHolderOverview', // 重要股东概览
    getLastedImportantHolderInfo: GXFHOST + 'lastedholder/getLastedImportantHolderInfo', // 重要股东-最新前十大股东
    getLastedPTHolderInfo: GXFHOST + 'lastedholder/getLastedPTHolderInfo', // 重要股东-最新前十大流通股东
    HoldingStockDegree: GXFHOST + 'holderStructure/HoldingStockDegree', // 按持股集中度搜索
    // 个人信息 POST /rollOfficialData/getShareholderInfo
    getBasicInfo: GXFHOST + 'rollOfficialData/getBasicInfo', // 查询股东基本信息
    getConcertedShareChanges: GXFHOST + 'rollOfficialData/getConcertedShareChanges', // 查询一致行动人持股变动情况
    getOtherProductsShareChanges: GXFHOST + 'rollOfficialData/getOtherProductsShareChanges', // 查询旗下其他产品持有公司股份的情况
    getOtherShareHolding: GXFHOST + 'rollOfficialData/getOtherShareHolding', //  查询其他持股情况
    getPublicValueReport: GXFHOST + 'rollOfficialData/getPublicValueReport', // 查询净值日报
    getRestrictionDetails: GXFHOST + 'rollOfficialData/getRestrictionDetails', //  查询限售股解禁时间数据
    getShareChanges: GXFHOST + 'rollOfficialData/getShareChanges', // 查询持股变动情况
    getShareholderInfo: GXFHOST + 'rollOfficialData/getShareholderInfo', // 查询股东账户信息
    setOtherShareHolding: GXFHOST + 'rollOfficialData/setOtherShareHolding', // 设置其他持股情况
    getManageInfo: GXFHOST + 'rollOfficialData/getManageInfo', // 查询管理公司信息
    checkHasIndustryName: GXFHOST + 'rollOfficialData/checkHasIndustryName', // 查询管理公司信息
    // rollOfficialData/riskstorm
    riskstorm: GXFHOST + `rollOfficialData/riskstorm`,
    getOtherProductsShareChangesTu: GXFHOST + `rollOfficialData/getOtherProductsShareChangesTu`,
    // 股东趋势分析
    generateHolderAnalysisReport: GXFHOST + 'holderTrend/generateHolderAnalysisReport', // 生成股东分析报告
    generateHolderTrendReport: GXFHOST + 'holderTrend/generateHolderTrendReport', // 生成股东趋势分析报告

    getGeneralInfoByStockCode: GXFHOST + 'holderTrend/getGeneralInfoByStockCode', // 获取趋势分析头部的数量统计
    getLockStockTimeDetail: GXFHOST + 'holderTrend/getLockStockTimeDetail', // 限售股解禁时间表详情
    getLockStockTimeList: GXFHOST + 'holderTrend/getLockStockTimeList', // 限售股解禁时间表
    getPublicHolder: GXFHOST + 'holderTrend/getPublicHolder', // 获取公募基金持股情况分析

    getPotentialFundHolderByStockCode: GXFHOST + 'holderTrend/getPotentialFundHolderByStockCode', // 获取潜在基金持股情况分析
    getPotentialFundHolderDetails: GXFHOST + 'holderTrend/getPotentialFundHolderDetails', // 获取潜在基金持股情况明细

    getStockPledge: GXFHOST + 'holderTrend/getStockPledge', // 获取股份整体质押情况
    getUseStockCode: GXFHOST + 'holderTrend/getUseStockCode', // 获取用户所绑定的股票代码
    listAndChartRZRQAnalysis: GXFHOST + 'holderTrend/listAndChartRZRQAnalysis', // 融资融券情况分析（列表、图表）
    listAndChartSHSZGTStockOwnershipAnalysis: GXFHOST + 'holderTrend/listAndChartSHSZGTStockOwnershipAnalysis', // 沪、深股通持股情况分析（列表、图表）
    listSameIndustryShareholderss: GXFHOST + 'holderTrend/listSameIndustryShareholders', // 同行业股东数
    getStockHolderAndShareInfoByStockCode: GXFHOST + 'holderTrend/getStockHolderAndShareInfoByStockCode', // 股东户数及平均持股情况分析

    getManualSameIndustry: GXFHOST + 'holderTrend/getManualSameIndustry', // 获取同行业公司
    setManualSameIndustry: GXFHOST + 'holderTrend/setManualSameIndustry', // 手动设置同行业公司
    getAllIndustryCompany: GXFHOST + 'holderTrend/getAllIndustryCompany', // 获取所有同行业公司
    getDefaultSameIndustry: GXFHOST + 'holderTrend/getDefaultSameIndustry', // 恢复默认同行业公司

    checkIsGxfUser: GXFHOST + 'gxfUser/checkIsGxfUser' // 判断用户是否属于股行分指定用户
  },
  //
  user: {
    // 登录
    // quikeLogin: MOBHOST + 'loginByMobileAndCode', // 快捷登录
    quikeLogin: HOST.user + 'loginByMobileAndCodeDesktop', // 快捷登录
    login: HOST.user + 'user/desktoploginbymobile',
    autologin: HOST.user + 'autologin/login',
    loginbyqrcode: HOST.user + 'user/loginbyqrcode', // 扫码登录，绑定用户
    checkMobileBindWeixin: HOST.user + 'checkMobileBindWeixin', // 手机号是否已绑定微信
    qrBindWeixinByUser: HOST.user + 'user/qrBindWeixinByUser', // 微信解绑和绑定
    // checkmobileexist: HOST.api1 + 'user/checkmobileexist', // 手机号是否注册
    checkmobileexist: HOST.user + 'checkMobileExist', // 手机号是否注册
    sendsmscode: HOST.user + 'sendSmsCodeDesktop', // 发送验证码
    sendsmscodev1: HOST.user + 'sendSmsCodeDesktop', // 发送验证码v1
    binduserafterqrscan: HOST.user + 'user/binduserafterqrscan', // 扫码后，填写手机号，绑定微信
    changeweixinafterqrscan: HOST.user + 'user/changeweixinafterqrscan', // 重新绑定微信
    qrcsanbinduserafterlogin: HOST.user + 'user/qrcsanbinduserafterlogin', // 手机号登录后，未绑定微信号，扫码直接绑定
    // 注册
    mobileregister: HOST.user + 'mobileRegisterDesktop', // 手机号注册
    logout: HOST.user + 'user/desktoplogout', // post 手动退出登录
    imageCode: HOST.user + 'getImageCodeDesktop',
    imgcodecheck: HOST.user + 'imgCodeCheckDesktop',
    // imgcodecheck: MOBHOST + 'usercode/imgcodecheck',
    getMyInfo: HOST.user + 'userHome', // 获取用户信息
    modifyloginpassword: HOST.user + 'modifyLoginPasswordDesktop', // 修改密码
    findloginpassword: HOST.user + 'findLoginPasswordDesktop', // 找回密码
    updateemail: HOST.user + 'updateEmail', // 修改邮箱
    // 个人中心 信息修改 manage/account
    getCompanyinfo: HOST.user + 'getUserCompanyInfo', // 获取用户公司类型
    getPosition: HOST.user + 'getUserPosition', // 获取用户职位
    getStockCode: HOST.user + 'getStockCode', // 根据股票代码获取公司名称
    completePersonInfo: HOST.user + 'completePersonInfo', // 补全用户信息
    bindmobile: HOST.user + 'bindMobile', // 修改绑定手机号

    // quikeLogin: MOBHOST + 'loginByMobileAndCode', // 快捷登录
    // login: HOST.api1 + 'passport/login',
    // autologin: HOST.api1 + 'autologin/login',
    // loginbyqrcode: HOST.api1 + 'passport/loginbyqrcode', // 扫码登录，绑定用户
    // checkMobileBindWeixin: MOBHOST + 'checkMobileBindWeixin', // 手机号是否已绑定微信
    // qrBindWeixinByUser: MOBHOST + 'user/qrBindWeixinByUser', // 微信解绑和绑定
    // checkmobileexist: HOST.api1 + 'user/checkmobileexist', // 手机号是否注册
    // sendsmscode: HOST.api1 + 'usercode/sendsmscodedesktop', // 发送验证码
    // sendsmscodev1: MOBHOST + 'sendSmsCode', // 发送验证码v1
    // binduserafterqrscan: HOST.api1 + 'passport/binduserafterqrscan', // 扫码后，填写手机号，绑定微信
    // changeweixinafterqrscan: HOST.api1 + 'passport/changeweixinafterqrscan', // 重新绑定微信
    // qrcsanbinduserafterlogin: HOST.api1 + 'passport/qrcsanbinduserafterlogin', // 手机号登录后，未绑定微信号，扫码直接绑定
    // // 注册
    // mobileregister: HOST.api1 + 'user/mobileregisterdesktop', // 手机号注册
    // logout: HOST.api1 + 'passport/logout', // post 手动退出登录
    // imageCode: HOST.api1 + 'usercode/getimagecodedesktop',
    // imgcodecheck: HOST.api1 + 'usercode/imgcodecheckdesktop',
    // // imgcodecheck: MOBHOST + 'usercode/imgcodecheck',
    // getMyInfo: HOST.api1 + 'user/userhomedesktop', // 获取用户信息
    // modifyloginpassword: HOST.api1 + 'user/modifyloginpassworddesktop', // 修改密码
    // findloginpassword: HOST.api1 + 'user/findloginpassworddesktop', // 找回密码
    // updateemail: HOST.api1 + 'user/updateemail', // 修改邮箱
    // // 个人中心 信息修改 manage/account
    // getCompanyinfo: HOST.api1 + 'user/getusercompanyinfo', // 获取用户公司类型
    // getPosition: HOST.api1 + 'user/getuserposition', // 获取用户职位
    // getStockCode: HOST.api1 + 'user/getstockcode', // 根据股票代码获取公司名称
    // completePersonInfo: HOST.api1 + 'user/completepersoninfo', // 补全用户信息
    // bindmobile: HOST.api1 + 'user/bindmobile', // 修改绑定手机号

    // track
    getTrack: HOST.user + 'browsing/getBrowsingDesktop', // 根据userId获取用户足迹
    delTrack: HOST.user + 'browsing/deleteByUserId', // 根据userId删除用户足迹
    // collect
    addfavourite: HOST.user + 'favourite/addFavourite', // 添加收藏夹
    getfavouritebyid: HOST.user + 'favourite/getFavouriteById', // 根据id获取收藏夹
    shareswitch: HOST.user + 'favourite/shareSwitch', // 收藏夹分享，取消分享
    updatefavouritename: HOST.user + 'favourite/updateFavouriteName', // 编辑收藏夹
    getMyCollect: HOST.user + 'favourite/getFavourite', // 获取用户收藏夹信息
    getMySubscribe: HOST.user + 'favourite/getSubscriptionList', // 获取用户订阅信息
    cancelSubscribe: HOST.user + 'favourite/cancelSubscription', // 取消订阅收藏夹
    getRecommend: HOST.user + 'recommend/getUserCollectRecommend', // 获取用户收藏的推荐收藏夹
    cancelRecommend: HOST.user + 'recommend/deleteUserCollectRecommend', // 取消订阅用户收藏的推荐收藏夹
    getRecommendCollect: HOST.user + 'recommend/getRecommendCollectListDesktop', // 获取推荐收藏夹列表
    getRecommendCollectFavoriteAll: HOST.user + 'recommend/getRecommendCollectFavoriteAll', // 获取推荐收藏夹列表
    getAllRecommendDetailsOrderByDate: HOST.user + 'recommend/getAllRecommendDetailsOrderByDate', // 通过时间排序获取推荐法规集合,
    subscribeRecommend: HOST.user + 'recommend/collectRecommend', // 订阅推荐收藏夹
    subscribeContent: HOST.user + 'recommend/getRecommendCollectAttr', // 获取订阅收藏夹信息
    subscribeList: HOST.user + 'recommend/getRecommendDetailsDesktop', // 获取订阅收藏夹列表
    getCollectContent: HOST.user + 'collect/getCollect', // 获取收藏夹内容
    getDefaultContent: HOST.user + 'favourite/getDefault', // 获取默认收藏夹内容
    // addCollectList: HOST.api + 'collect/addCollect', // 添加收藏内容
    addCollectList: HOST.user + 'collect/addCollectDesktop', // 添加收藏内容
    alreadyCollect: HOST.user + 'favourite/getIsCollectId', // 已收藏的id
    addCollect: HOST.user + 'favourite/addFavourite', // 新建收藏夹
    delCollect: HOST.user + 'favourite/deleteById', // 删除收藏夹
    delCollectList: HOST.user + 'collect/deleteCollectById', // 删除收藏内容
    //
    searchUserData: HOST.user + 'searchUserData', // 查看用户资料
    updateSynopsisByUserId: HOST.user + 'updateSynopsisByUserId'
  },
  rule: {
    // autoComplete: HOST.api + 'lawsearch/autocomplete',
    // getalllmappingrules: HOST.api + 'lawsearch/getallmappingrules',
    // getHotSearch: HOST.api + 'lawsearch/gethotsearch',
    // getDetails: HOST.api + 'lawdetail/getdetails',
    // lawSearch: HOST.api + 'lawsearch/search'
    autoComplete: HOST.law + 'law/autoComplete',
    getalllmappingrules: HOST.law + 'getalllmappingrules',
    getHotSearch: HOST.law + 'law/getHotSearch',
    getDetails: HOST.law + 'law/getDetails',
    lawSearch: HOST.law + 'law/search'
  },
  affiche: {
    // autoCompleteA: HOST.api + 'common/autocomplete',
    // hotSearch: HOST.api + 'announcesearch/gethotsearch', // 公告热门搜索
    // afficheSearch: HOST.api + 'announcesearch/search', // 公告查询
    // afficheContent: HOST.api + 'announcedetail/getdetails' // 公告详情
    autoCompleteA: HOST.user + 'common/autoComplete',
    hotSearch: HOST.disclosure + 'disclosure/getHotSearch', // 公告热门搜索
    afficheSearch: HOST.disclosure + 'disclosure/desktopSearch', // 公告查询
    afficheContent: HOST.disclosure + 'disclosure/getDetails' // 公告详情
  },
  cases: {
    autoCompleteC: HOST.caselaw + 'case/autoComplete', // 违规案例标题自动补全
    getdetailsC: HOST.caselaw + 'case/getDetails', // 获取违规案例详情信息
    getFilter: HOST.caselaw + 'case/getFilteronditions', // 获取违规案例筛选条件
    getCaseHotSearch: HOST.caselaw + 'case/getHotSearch', // 获取违规案例热搜
    searchC: HOST.caselaw + 'case/search' // 违规案例查询
  },
  report: {
    autoCompany: HOST.report + 'report/companyAutoComplete', // 公司自动提示
    autoAuthor: HOST.report + 'report/authorAutoComplete', // 作者自动提示
    newReport: HOST.report + 'report/getNewResearchReport',
    reportDetail: HOST.report + 'report/getReportDetails',
    searchReport: HOST.report + 'report/searchReports', // reportsearch/searchReports reportsearch/getRelatedIntegratedReportByConditions
    searchReportS: HOST.report + 'report/searchReports', // 筛选搜索
    getIndustryList: HOST.report + 'report/getIndustryTypeList',
    getIndustryReport: HOST.report + 'report/getAllIndutryReportByIndustry',
    releaseAffiche_I: HOST.report + 'report/getRelatedIndutryReport', // 获取行业报告相关内容
    releaseAffiche_T: HOST.report + 'report/getRelatedIntegratedReport', // 获取综合报告相关内容
    releaseAffiche_C: HOST.report + 'report/getRelatedCompanyReport' // 获取公司报相关内容
  },
  lookuptables: {
    addFocus: HOST.user + 'permission/addInsideCompany', // 内部 用户添加关注公司
    delFocus: HOST.user + 'permission/deleteInsideCompany', // 内部 用户删除关注公司
    userFocus: HOST.user + 'permission/getPermissionInsideList', // 内部 用户关注的公司
    getYearData: HOST.user + 'permission/getAnnualReportInside', // 内部 内部员工获取年报数据
    getNumData: HOST.user + 'permission/getAnnualReportByYear', // 内部 内部员工通过年份获取年报
    getInsideList: HOST.user + 'permission/getInsideList', // 内部 获取内部员工的权限速查表
    saveDatas: HOST.user + 'permission/saveInsideAnnualReport', // 内部 [内部]保存数据校准
    resetData: HOST.user + 'permission/resetInsideAnnualReport', // 内部 [内部]重置数据校准
    checkIsAttend: HOST.user + 'permission/checkIsAttend', //

    resetDataOut: HOST.user + 'permission/resetAnnualReport', // 重置数据校准
    saveDataOut: HOST.user + 'permission/saveAnnualReport', // 保存数据校准
    getInsideListOut: HOST.user + 'permission/getPermissionCheckList', // 获取权限速查表
    getPermissionCheckListEnterprise: HOST.user + 'permission/getPermissionCheckListEnterprise', //
    getData: HOST.user + 'permission/getAnnualReport', // 获取年报数据
    setNewAnnualReport: HOST.user + 'permission/setNewAnnualReport' // 提示获取最新年报数据
  },
  calendar: {
    // 日历
    getCloseDate: HOST.calendar + 'canlendar/getAllCloseDate', // 获取休市日期
    addCalendar: HOST.calendar + 'canlendar/addCalendar', // 创建日历
    getCalendarByUserId: HOST.calendar + 'canlendar/getCalendarByUserId', // 获取所属自己的日历
    editCalendarInfo: HOST.calendar + 'canlendar/editCalendarInfo', // 编辑修改个人工作日历
    updateCalendarCheckedStatus: HOST.calendar + 'canlendar/updateCalendarCheckedStatus', // 修改日历选中状态

    deleteCalendarInfo: HOST.calendar + 'canlendar/deleteCalendarInfo', // 删除个人工作日历
    getShareCalendarLink: HOST.calendar + 'canlendar/getShareCalendarLink', // 共享日历链接获取
    getCalendarShareUsers: HOST.calendar + 'canlendar/getCalendarShareUsers', // 获取日历共享人
    updateShareCalendarLink: HOST.calendar + 'canlendar/updateShareCalendarLink', // 更新共享链接
    editCalendarColor: HOST.calendar + 'canlendar/editCalendarColor', // 修改日历颜色
    getUserCanlendarList: HOST.calendar + 'canlendar/getUserCanlendarList', // 根据userID获取个人日历列表
    getCalendarInfo: HOST.calendar + 'canlendar/getCalendarInfo', // 查看工作日历详情
    getShareCalendarInfo: HOST.calendar + 'canlendar/getShareCalendarInfo', // 共享日历查看
    addShareCalendar: HOST.calendar + 'canlendar/addShareCalendar', // 共享日历添加
    cancelCalendarShareUsers: HOST.calendar + 'canlendar/cancelCalendarShareUsers', // 取消日历共享人

    // 日常事件
    addNormalEvent: HOST.calendar + 'normalevent/addNormalEvent', // 添加日常事件
    changeConfirmType: HOST.calendar + 'normalevent/changeConfirmType', // 设置事件提醒方式
    editNormalEventInfo: HOST.calendar + 'normalevent/editNormalEventInfo', // 编辑普通事件详情
    getEventsListBytimeSlot: HOST.calendar + 'normalevent/getEventsListBytimeSlot', //  根据时间段获取事件列表
    getNormalEventInfo: HOST.calendar + 'normalevent/getNormalEventInfo', // 获取普通事件详情
    getTemplateList: HOST.calendar + 'normalevent/getTemplateList', // 获取所有模板
    searchEventList: HOST.calendar + 'normalevent/searchEventList', // 根据事件名称搜索个人事件列表
    deleteEventById: HOST.calendar + 'normalevent/deleteEventById', // 删除事件
    getEnterpriseEvents: HOST.calendar + 'normalevent/getEnterpriseEvents', // dashbord获取待办事项

    // 模板事件
    updateRemind: HOST.calendar + 'calendarTemplateEvent/updateRemind', // 设置节点是否提醒
    addTemplateEvent: HOST.calendar + 'calendarTemplateEvent/addTemplateEvent', // 添加模板事件
    checkDate: HOST.calendar + 'calendarTemplateEvent/checkDate', // 检查股东大会召开日和股权登记日是否合法
    editTemplateEvent: HOST.calendar + 'calendarTemplateEvent/editTemplateEvent', // 编辑模板事件
    getEventContainList: HOST.calendar + 'calendarTemplateEvent/getEventContainList', // 获取事件节点信息
    getTemplateEventInfo: HOST.calendar + 'calendarTemplateEvent/getTemplateEventInfo', // 获取事件节点信息
    deleteTemplateEvent: HOST.calendar + 'calendarTemplateEvent/deleteTemplateEvent', // 删除事件

    // 编辑事件邀请人
    getAvatarByMobile: HOST.calendar + 'normalevent/getAvatarByMobile', // 获取邀请人头像
    addInviter: HOST.calendar + 'calendarTemplateEvent/addInviter', // 添加邀请人
    deleteInviter: HOST.calendar + 'calendarTemplateEvent/deleteInviter', // 删除邀请人
    checkInviter: HOST.calendar + 'calendarTemplateEvent/checkInviter' // 检查邀请人合法性
  },
  // 消息推送
  userMsg: {
    getMessageByType: HOST.usermsg + 'usermsg/getMessageByType', // 获取消息
    setAllUserMsgRead: HOST.usermsg + 'usermsg/setAllUserMsgRead', // 类型消息全部设为阅读
    setUserMsgRead: HOST.usermsg + 'usermsg/setUserMsgRead', // 单条消息设置为已阅读
    addUserAnswerMsg: HOST.usermsg + 'usermsg/addUserAnswerMsg' // 添加 回答问题的所有消息
  },
  xinhu: {
    // POST
    addAnswer: HOST.xinhu + 'xinhu/qa/addAnswer', // 添加回答
    editAnswer: HOST.xinhu + 'xinhu/qa/editAnswer', // 添加回答
    addEditQuestionApplication: HOST.xinhu + 'xinhu/qa/addEditQuestionApplication', // 提交修改问题申请
    addEvaluate: HOST.xinhu + 'xinhu/qa/addEvaluate', // 添加评价
    cancelEvaluate: HOST.xinhu + 'xinhu/qa/cancelEvaluate', // 取消评价
    addQuestion: HOST.xinhu + 'xinhu/qa/addQuestion', // 添加问题
    deleteAnswer: HOST.xinhu + 'xinhu/qa/deleteAnswer', // 添加问题
    // GET
    getHotSearchWords: HOST.xinhu + 'xinhu/qa/getHotSearchWords', // 获取热搜词
    getQuestionDetails: HOST.xinhu + 'xinhu/qa/getQuestionDetails', // 获取问题详情
    getTopicDetails: HOST.xinhu + 'xinhu/qa/getTopicDetails', // 话题详情
    listAnswersForQuestion: HOST.xinhu + 'xinhu/qa/listAnswersForQuestion', // 当前问题所包含的回答列表
    listQuestions: HOST.xinhu + 'xinhu/qa/listQuestions', // 获取问题列表
    listRelatedQuestions: HOST.xinhu + 'xinhu/qa/listRelatedQuestions', // 相关问题
    // listSearchRelatedTopics: HOST.xinhu + 'xinhu/qa/listSearchRelatedTopics', // 搜索相关话题
    // listTopicRelatedQuestions: HOST.xinhu + 'xinhu/qa/listTopicRelatedQuestions', // 话题相关问题列表
    searchQuestions: HOST.xinhu + 'xinhu/qa/searchQuestions', // 搜索问题接口
    searchUserAnswer: HOST.xinhu + 'xinhu/qa/searchUserAnswer', // 查看用户的回答
    searchUserQuestion: HOST.xinhu + 'xinhu/qa/searchUserQuestion', // 查看用户的提问
    searchUserTiltle: HOST.xinhu + 'xinhu/qa/getQuestionOrderByCountRand', // 随机搜索标题
    // xinhu/search
    autoComplete: HOST.xinhu + 'xinhu/search/autoComplete', // 关键字自动补全
    autoCompleteQuestionTitle: HOST.xinhu + 'xinhu/search/autoCompleteQuestionTitle', // 提问关键字自动补全，只匹配标题
    listQuestion: HOST.xinhu + 'xinhu/search/listQuestion', // 搜索列表
    listQuestionLatest: HOST.xinhu + 'xinhu/search/listQuestionLatest', // 最新问题
    listSiftAnswer: HOST.xinhu + 'xinhu/search/listSiftAnswer', // 精选回答
    listTopic: HOST.xinhu + 'xinhu/search/listTopic', // 话题搜索
    getHotTopics: HOST.xinhu + 'xinhu/topicmanager/getHotTopics', // 热门话题

    getTopicAttentionUser: HOST.xinhu + 'xinhu/topicmanager/getTopicAttentionUser', // 话题关注者列表,
    getQuestionAttentionUserList: HOST.xinhu + 'xinhu/qa/getQuestionAttentionUserList', // 问题关注者列表
    addAttention: HOST.xinhu + 'xinhu/attention/addAttention', // 添加关注
    getAttentionQuestion: HOST.xinhu + 'xinhu/attention/getAttentionQuestion', // 查看我关注的问题
    getAttentionTopic: HOST.xinhu + 'xinhu/attention/getAttentionTopic', // 查看我关注的话题
    searchAttentionUser: HOST.xinhu + 'xinhu/attention/searchAttentionUser', // 查看我关注的用户 和关注我的用户
    // //  测试
    unFollow: HOST.xinhu + 'xinhu/attention/unFollow', // 取消关注
    // // xinhu / question
    listAnswerIdsByQuestionId: HOST.xinhu + 'xinhu/qa/listAnswerIdsByQuestionId', // 根据问题Id获取回答id集合
    getAnswerDetails: HOST.xinhu + 'xinhu/qa/getAnswerDetails', // 回答详情
    getQuestionIdByAnswerId: HOST.xinhu + 'xinhu/qa/getQuestionIdByAnswerId', // 通过答案id 获取问题id
    // // 大V GET
    getRandomV: HOST.xinhu + 'xinhu/qa/getRandomV', // 随机获取大V信息
    getAttentionRandomV: HOST.xinhu + 'xinhu/qa/getAttentionRandomV', // 随机获取大V信息
    getUserXinHuInfo: HOST.xinhu + 'xinhu/qa/getUserXinHuInfo', // 成就
    showInvite: HOST.xinhu + 'xinhu/qa/showInvite', // 显示邀请回答
    ignoreInvitedQuestion: HOST.xinhu + 'xinhu/qa/ignoreInvitedQuestion', // 忽略邀请回答
    getAdvert: HOST.xinhu + 'xinhu/qa/getAdvert', // 最新提问广告
    // POST
    inviteForQuestion: HOST.xinhu + 'xinhu/qa/inviteForQuestion', // 邀请大V
    getSensitiveWord: HOST.xinhu + 'xinhu/qa/getSensitiveWord' // 敏感词
  },
  supervise: {
    superviseDynamic: HOST.supervise + 'supervise/listSuperviseDynamic' // 监管动态
  },
  // 财务数据
  indicator: {
    listIndicators: HOST.listedcompany + 'stock/listIndicators',
    listMainIndicatorsData: HOST.listedcompany + 'stock/listMainIndicatorsData',
    listFinancialData: HOST.listedcompany + 'stock/listFinancialData',
    chartMainIndicatorsData: HOST.listedcompany + 'stock/chartMainIndicatorsData',
    listCompareCompany: HOST.listedcompany + 'stock/listCompareCompany'
  },
  // 移动端分享连接
  share: {
    index: HOST.mobileHost,
    rule: HOST.mobileHost + '#/search',
    affiche: HOST.mobileHost + '#/afficheSearch',
    cases: HOST.mobileHost + '#/rule',
    caseDetail: HOST.host + 'caseDetail?id=',
    report: HOST.mobileHost + '#/report',
    detailReport: HOST.mobileHost + '#/report/details?id=',
    ruleDetail: HOST.mobileHost + '#/rule/details?id=',
    afficheDetail: HOST.mobileHost + '#/affiche/details?id=',
    collectDetails: HOST.mobileHost + '#/collect/collectDetails?id=',
    xhAnswerDetaile: HOST.mobileHost + '#/xhAnswerDetaile?',
    enterpriseApply: HOST.mobileHost + '#/enterpriseApply?code='
  },
  // 企业管理
  manage: {
    companyInfo: HOST.enterprise + 'enterprise/getByCompanyId',
    updateCompanyAccount: HOST.enterprise + 'enterprise/updateCompanyAccount',
    getByCompanyCode: HOST.enterprise + 'enterprise/getByCompanyCode',
    checkMobileExist: HOST.enterprise + 'enterprise/checkMobileExist',
    getByCompanyId: HOST.enterprise + 'enterprise/getByCompanyId',
    generateInvitationUrl: HOST.enterprise + 'enterprise/generateInvitationUrl',
    checkInviteLink: HOST.enterprise + 'enterprise/checkInviteLink',
    acceptInvited: HOST.enterprise + 'enterprise/acceptInvited',
    cancelInvited: HOST.enterprise + 'enterprise/cancelInvited',
    listUserByCompanyId: HOST.enterprise + 'enterprise/listUserByCompanyId',
    inviteUsers: HOST.enterprise + 'enterprise/addMobileToInvite',
    deleteInvite: HOST.enterprise + 'enterprise/deleteInvite',
    getInvitationUrl: HOST.enterprise + 'enterprise/getInvitationUrl',
    cancelUser: HOST.enterprise + 'enterprise/cancelUser',
    removeUser: HOST.enterprise + 'enterprise/removeUser',
    checkInvitedUserLimit: HOST.enterprise + 'enterprise/checkInvitedUserLimit',
    getCompanyInfoFromInviteLink: HOST.enterprise + 'enterprise/getCompanyInfoFromInviteLink',
    updateUserInfo: HOST.enterprise + 'enterprise/updateUserInfo',
    checkNodeInCalendar: HOST.enterprise + 'enterprise/checkNodeInCalendar' // 检查事项节点是否存在于指定日历

  },
  // 舆情
  sentiment: {
    getSentimentData: HOST.sentiment + 'publicSentiment/getSemtimentData',
    getSentimentSummary: HOST.sentiment + 'publicSentiment/getSentimentSummary',

    addProject: HOST.sentiment + 'sentiment/addProject',
    getAllProject: HOST.sentiment + 'sentiment/getAllProject',
    getProjectByCompanyId: HOST.sentiment + 'sentiment/getProjectByCompanyId',
    deleteProject: HOST.sentiment + 'sentiment/deleteProject',
    updateProject: HOST.sentiment + 'sentiment/updateProject',
    // =============================> companySentiment/chartIndustrySentimentTop5
    chartIndustrySentimentTop5: HOST.sentiment + 'companySentiment/chartIndustrySentimentTop5',
    chartIndustryHeatCompanyTop10: HOST.sentiment + 'companySentiment/chartIndustryHeatCompanyTop10',
    chartMarketSentiment: HOST.sentiment + 'companySentiment/chartMarketSentiment',
    chartSourceStatistics: HOST.sentiment + 'companySentiment/chartSourceStatistics',
    chartSentimentTrend: HOST.sentiment + 'companySentiment/chartSentimentTrend',
    chartChannelAnalysis: HOST.sentiment + 'companySentiment/chartChannelAnalysis',
    countSentiments: HOST.sentiment + 'companySentiment/countSentiments',

    listSuperviseDynamic: HOST.supervise + 'supervise/listSuperviseDynamic',

    listCompanySentiment: HOST.sentiment + 'companySentiment/listCompanySentiment',
    listCompanySentimentTop10: HOST.sentiment + 'companySentiment/listCompanySentimentTop10',
    listComparisonWithIndustry: HOST.sentiment + 'companySentiment/listComparisonWithIndustry',
    listMarketSentiment: HOST.sentiment + 'companySentiment/listMarketSentiment',
    listIndustrySentiment: HOST.sentiment + 'companySentiment/listIndustrySentiment',
    sentimentSearch: HOST.sentiment + 'companySentiment/sentimentSearch',
    hotWords: HOST.sentiment + 'companySentiment/hotWords',
    newsDir: HOST.sentiment + 'companySentiment/newsDir',
    companyNewsDir: HOST.sentiment + 'companySentiment/companyNewsDir',
    getCompanyCompare: HOST.enterprise + 'enterpriseCompany/getCompanyCompare',
    deleteCompanyCompare: HOST.enterprise + 'enterpriseCompany/deleteCompanyCompare',
    report: HOST.sentiment + 'companySentiment/report',
    generateSentimentReport: HOST.sentiment + 'companySentiment/generateSentimentReport',
    sentimentReportLogDel: HOST.sentiment + 'companySentiment/sentimentReportLogDel',
    // 自定义
    sentimentPlans: HOST.sentiment + 'sentimentPlans',
    sentimentDelPlans: HOST.sentiment + 'sentimentPlans',
    getCompanySentimentPlans: HOST.sentiment + 'getCompanySentimentPlans',
    updateCompanySentimentPlans: HOST.sentiment + 'updateCompanySentimentPlans',
    updateSentimentPlans: HOST.sentiment + 'updateSentimentPlans',
    manager: HOST.sentiment + 'sentimentPlans/manager',
    createSentimentPlans: HOST.sentiment + 'createSentimentPlans',
    company: HOST.sentiment + 'sentimentPlans/company',
    industry: HOST.sentiment + 'sentimentPlans/industry'
  },
  // 信披事项
  disclosure: {
    // put
    addInfoClosureItemMain: HOST.disclosure + 'infoDisclosureItemMain/addInfoClosureItemMain', // 增加信批事项
    // delete
    deleteClosureItemMain: HOST.disclosure + 'infoDisclosureItemMain/deleteClosureItemMain', // 删除信批事项
    deleteItemNode: HOST.disclosure + 'disclosureItemNode/deleteItemNode', // 删除事项节点
    // get
    getInfoDisclosureEventByCompanyId: HOST.disclosure + 'infoDisclosureItem/getInfoDisclosureEventByCompanyId', // 查询系统事项模板
    getArchivedItemMain: HOST.disclosure + 'infoDisclosureItemMain/getArchivedItemMain', // 查询事项归档

    getItemMainSharedInfo: HOST.disclosure + 'infoDisclosureItemMain/getItemMainSharedInfo', // 获取事项邀请信息

    getCustomInfoByItemId: HOST.disclosure + 'infoDisclosureItem/getCustomInfoByItemId', // 查询自定义模板要点详情和审议程序
    getInfoDisclosureItemMain: HOST.disclosure + 'infoDisclosureItemMain/getInfoDisclosureItemMain', // 获取信批事项
    getInviteByUserId: HOST.disclosure + 'infoDisclosureItemMain/getInviteByUserId', // 获取待办邀请信息
    getCustomTemplateByUserId: HOST.disclosure + 'infoDisclosureItem/getCustomTemplateByUserId', // 查询自定义事项模板
    getInfoByItemId: HOST.disclosure + 'infoDisclosureItem/getInfoByItemId', // 查询系统默认模板要点详情
    getItemNodeList: HOST.disclosure + 'disclosureItemNode/getItemNodeList', // 通过事项二级Id获取节点
    getPointByTemplateId: HOST.disclosure + 'disclosureItemNode/getPointByTemplateId', // 点击节点名称获取要点信息
    // post
    archivedItemMain: HOST.disclosure + 'infoDisclosureItemMain/archivedItemMain', // 归档
    addNodeToCalender: HOST.disclosure + 'disclosureItemNode/addNodeToCalender', // 归档
    addItemMainToCalender: HOST.disclosure + 'infoDisclosureItemMain/addItemMainToCalender', // 添加节点到日历
    cancelArchivedItemMain: HOST.disclosure + 'infoDisclosureItemMain/cancelArchivedItemMain', // 撤回归档
    saveToTemplate: HOST.disclosure + 'infoDisclosureItemMain/saveToTemplate', // 存为信披模板
    getEnterpriseUserList: HOST.disclosure + 'infoDisclosureItemMain/getEnterpriseUserList', // 获取企业版用户信息
    getDisClosureItemSharedUserInfo: HOST.disclosure + 'infoDisclosureItemMain/getDisClosureItemSharedUserInfo', // 获取事项分享用户信息（编辑分享时用）
    updateItemSharedDetail: HOST.disclosure + 'infoDisclosureItemMain/updateItemSharedDetail', // 修改事项分享信息
    updateInfoClosureItemMain: HOST.disclosure + 'infoDisclosureItemMain/updateInfoClosureItemMain', // 修改信批事项
    updateCustomTemplate: HOST.disclosure + 'infoDisclosureItemMain/updateCustomTemplate', // 修改自定义模板
    deleteTemplate: HOST.disclosure + 'infoDisclosureItemMain/deleteTemplate', // 修改信批事项
    addItemNode: HOST.disclosure + 'disclosureItemNode/addItemNode', // 在当前位置下插入节点，【节点序号】传当前位置的序号
    editItemNode: HOST.disclosure + 'disclosureItemNode/editItemNode', // 编辑事项节点
    moveNode: HOST.disclosure + 'disclosureItemNode/moveNode', // 移动类型可选 UP :上移 DOWN ：下移
    downloadReport: HOST.enterprise + 'enterprise/downloadWordDocx',
    getExportReportTimeList: HOST.enterprise + 'enterprise/getExportReportTimeList',
    checkDocExist: HOST.enterprise + 'enterprise/checkDocExist',
    getDocRecordList: HOST.enterprise + 'enterprise/getDocRecordList'
  },
  // 互动e
  interact: {
    listInteractByCompanyCode: HOST.interact + 'interact/listInteractByCompanyCode'
  },
  // 精选
  advert: {
    getAdvertByType: HOST.user + 'getAdvertByType',
    getAdvertList: HOST.user + 'getAdvertList',
    getAdvertType: HOST.user + 'getAdvertType'
  },
  //  股票行情想关API
  stock: {
    getStockKLineData: HOST.listedcompany + "stock/getStockKLineData", //  获取K线
    getStockTimeKLineData: HOST.listedcompany + "stock/getStockTimeKLineData", //  获取时间K线
    getStockInfo: HOST.user + 'attention/getStockInfo',
    getMore: HOST.listedcompany + 'stock/getMore', // 获取更多行情数据
    getStockInfoByCodes: HOST.listedcompany + 'stock/getStockInfoByCodes', // 批量获取行情
    getMyAttentions: HOST.listedcompany + "stock/getMyAttentions", // 获取我关注的公司
    listAllSameIndustryCompany: HOST.listedcompany + 'stock/listAllSameIndustryCompany', // 申万 和证监会
    listSameIndustryCompany: HOST.listedcompany + 'stock/listSameIndustryCompany', // 申万 和证监会
    listSameIndustryFinData: HOST.listedcompany + 'stock/listSameIndustryFinData', // 比较
    getDeviationValue: HOST.listedcompany + 'stock/getDeviationValue',
    listMarketSituation: HOST.listedcompany + 'stock/listMarketSituation',
    getSameIndustryStockInfo: HOST.listedcompany + 'stock/getSameIndustryStockInfo', // 获取同行业行情
    getThrunoverInfo: HOST.listedcompany + 'stock/getThrunoverInfo', // 获取换手率
    getSameIndustryThrunoverInfo: HOST.listedcompany + 'stock/getSameIndustryThrunoverInfo',
    searchStock: HOST.user + 'attention/searchStock',
    addAttention: HOST.user + 'attention/addAttention',
    deleteAttention: HOST.user + 'attention/deleteAttention',
    batchDeleteAttention: HOST.user + 'attention/oneKeyCancel',
    getStockChangeAnnouncement: HOST.listedcompany + 'stock/getStockChangeAnnouncement', // 获取股票异常波动公告
    getStockChangeForReportList: HOST.listedcompany + 'stock/getStockChangeForReportList' // 获取股票异常波动报告
  },
  // 资金
  capital: {
    getCompanyCapitalToday: HOST.enterprise + 'enterprise/getCompanyCapitalToday',
    getCompanyCapitalTenDay: HOST.enterprise + 'enterprise/getCompanyCapitalTenDay'
  },
  message: {
    // get
    getMessageByType: HOST.usermsg + 'usermsg/getMessageByType', //  分类查看推送消息
    // post
    setAllUserMsgRead: HOST.usermsg + 'usermsg/setAllUserMsgRead', // 全部消息设置为已阅读
    setUserMsgRead: HOST.usermsg + 'usermsg/setUserMsgRead', //  单条消息设置为已阅读
    // delete
    deleteUserMsg: HOST.usermsg + 'usermsg/deleteUserMsg' // 删除消息

  },
  // 简况
  company: {
    getCompanyInfo: HOST.enterprise + 'enterprise/getCompanyInfo'
  },
  // 制度
  institution: {
    selectAllForCompanyCatalog: HOST.enterprise + 'institutionList/selectAllForCompanyCatalog',
    selectAllByCatalogType: HOST.enterprise + 'institutionList/selectAllByCatalogType',
    listCompanyCatalog: HOST.enterprise + 'institutionList/listCompanyCatalog',
    editRegulations: HOST.enterprise + 'institutionList/editRegulations',
    editCompanyCatalog: HOST.enterprise + 'institutionList/editCompanyCatalog',
    deleteRegulations: HOST.enterprise + 'institutionList/deleteRegulations',
    deleteCompanyCatalog: HOST.enterprise + 'institutionList/deleteCompanyCatalog',
    addCompanyCatalog: HOST.enterprise + 'institutionList/addCompanyCatalog',
    listAllForGovernanceCataLog: HOST.enterprise + 'institutionList/listAllForGovernanceCataLog',
    addRegulations: HOST.enterprise + 'institutionList/addRegulations'
  },
  // 团队收藏夹 Favourite
  teamFavourite: {
    // get
    getTeamDefault: HOST.user + 'teamFavourite/getTeamDefault', // 获取团队默认收藏夹
    getFavourite: HOST.user + 'teamFavourite/getFavourite', // 根据用户Id获取收藏夹
    getTeamFavouriteInfoById: HOST.user + 'teamFavourite/getTeamFavouriteInfoById', // 根据用户Id获取收藏夹
    updateFavouriteName: HOST.user + 'teamFavourite/updateFavouriteName', // 编辑团队收藏夹
    // post
    deleteById: HOST.user + 'teamFavourite/deleteById', // 删除团队收藏夹
    addTeamFavourite: HOST.user + 'teamFavourite/addTeamFavourite' // 新建团队收藏夹
  },
  // 企业公司
  enterpriseCompany: {
    // get
    getCompanyCompare: HOST.enterprise + 'enterpriseCompany/getCompanyCompare', // 获取可比公司
    getCompanyByUser: HOST.enterprise + 'enterpriseCompany/getCompanyByUser', // 查询用户下的公司
    getEnterprisePackage: HOST.enterprise + 'enterpriseCompany/getEnterprisePackage',
    // post
    changeCompanyAdmin: HOST.enterprise + 'enterpriseCompany/changeCompanyAdmin', // 移交管理权限
    changeCompany: HOST.enterprise + 'enterpriseCompany/changeCompany', // 切换公司
    searchCompany: HOST.enterprise + 'enterpriseCompany/searchCompany', // 切换公司
    addCompanyCompare: HOST.enterprise + 'enterpriseCompany/addCompanyCompare', // 添加可比公司
    addUserLoginRecord: HOST.enterprise + 'enterpriseCompany/addUserLoginRecord', // 添加用户企业版登录日志
    sendExitSms: HOST.enterprise + 'enterpriseCompany/sendExitSms',
    addEnterpriseOrder: HOST.enterprise + 'enterpriseOrder/addEnterpriseOrder',  // 添加续费企业订单
    //
    // delete
    deleteCompanyCompare: HOST.enterprise + 'enterpriseCompany/deleteCompanyCompare', // 删除可比公司
    exitCompany: HOST.enterprise + 'enterpriseCompany/exitCompany', // 退出公司,
    sendRemoveMemberSms: HOST.enterprise + 'enterpriseCompany/sendRemoveMemberSms',
    sendTransferAdminSms: HOST.enterprise + 'enterpriseCompany/sendTransferAdminSms',
    uploadPicByBase64: HOST.enterprise + 'enterpriseCompany/uploadPicByBase64',
    applyEnterprise: HOST.enterprise + 'enterpriseCompany/applyEnterprise'
  },
  //  投资者关系
  investor: {
    conditions: HOST.interact + 'interactSearch/conditions', // shaixuan
    search: HOST.interact + 'interactSearch/search', // shousuo
    getHrefByCompanyCode: HOST.interact + 'interactSearch/getHrefByCompanyCode', // 根据公司代码获取跳转链接
    getRelationQuestion: HOST.interact + 'interactSearch/getRelationQuestion', // 根据公司代码获取跳转链接
    getQuestionDetail: HOST.interact + 'interactSearch/getQuestionDetail', // 问答详情
    getInvosterQuestionCompany: HOST.interact + 'interactSearch/getInvosterQuestionCompany', // 问答详情
    getInvosterQuestionCount: HOST.interact + 'interactSearch/getInvosterQuestionCount', // 获取投资者提问数
    getKeywordByUserName: HOST.interact + 'interactSearch/getKeywordByUserName', // 投资者词云
    getMarketAverageSummary: HOST.interact + 'interactSearch/getMarketAverageSummary', // 获取市场平均数据
    getMaxQuestionCountUser: HOST.interact + 'interactSearch/getMaxQuestionCountUser', // 获取市场平均数据
    getKeywordByCompanyCode: HOST.interact + 'interactSearch/getKeywordByCompanyCode', // 获取公司词云
    getCompanyMarketCompareData: HOST.interact + 'interactSearch/getCompanyMarketCompareData', // 公司与行业对比数据接口
    getCompanyIndexFromMarket: HOST.interact + 'interactSearch/getCompanyIndexFromMarket', // 获取公司市场排名
    getIndustryIndexData: HOST.interact + 'interactSearch/getIndustryIndexData', // 获取同行业问答情况及公司排名
    getCompanySummaryByEnum: HOST.interact + 'interactSearch/getCompanySummaryByEnum', // 获取公司问答情况总览
    getMarketSummaryByEnum: HOST.interact + 'interactSearch/getMarketSummaryByEnum', // 获取市场问答情况总览
    getKeywordByMarket: HOST.interact + 'interactSearch/getKeywordByMarket', // 获取市场词云
    //
    // getInteractTopTenRank: HOST.api + 'getInteractTopTenRank', // 获取前十排行榜 (废弃)
    getInteractTopTenRank: HOST.interact + 'interactSearch/getTopTenByType' // 获取前十排行榜
  },
  //
  common: {
    getAdvertByType: HOST.user + 'common/getAdvertByType', // 获取广告详情
    getAdvertTypeList: HOST.user + 'common/getAdvertTypeList' // 获取广告分类
  },
  superviseCompany: {
    // post
    addSuperviseCompanyList: HOST.supervise + 'superviseCompany/addSuperviseCompanyList', // 批量添加监管公司
    // put
    deleteSuperviseCompanyList: HOST.supervise + 'superviseCompany/deleteSuperviseCompanyList', // 批量删除监管公司
    // get
    getAllSuperviseCompanyByUser: HOST.supervise + 'superviseCompany/getAllSuperviseCompanyByUser', // 通过userId获取用户所有的监管公司
    getMarketSentiment: HOST.supervise + 'superviseCompany/getMarketSentiment', // 获取市场舆情
    getSuperviseCompanyList: HOST.supervise + 'superviseCompany/getSuperviseCompanyList', // 通过userId搜索用户的监管公司行情等详细信息
    getSuperviseCompanySentimentTotal: HOST.supervise + 'superviseCompany/getSuperviseCompanySentimentTotal', // 获取监管公司舆情统计
    searchCompanyByKeyWord: HOST.supervise + 'superviseCompany/searchCompanyByKeyWord', // 根据关键词搜索上市公司
    // 监管动态
    companyMV: HOST.supervise + 'supervise/companyMV', // 公司市值
    eInteractInfo: HOST.supervise + 'supervise/eInteractInfo', // e互动TOP10
    listSuperviseDynamic: HOST.supervise + 'supervise/listSuperviseDynamic', // listSuperviseDynamic
    marketoverview: HOST.supervise + 'supervise/marketoverview', // 市场概览
    superviseoverview: HOST.supervise + 'supervise/superviseoverview', // 监管公司概览
    violateCase: HOST.supervise + 'supervise/violateCase', // 违规案例
    warningoverview: HOST.supervise + 'supervise/warningoverview' // 预警
  },
  // 法规笔记
  lawnote: {
    addLawNote: HOST.law + 'lawnote/addLawNote', // 创建笔记
    deleteLawNote: HOST.law + 'lawnote/deleteLawNote', // 批量删除笔记
    getMultistageNote: HOST.law + 'lawnote/getMultistageNote', // 多段标记
    getNoteByUserId: HOST.law + 'lawnote/getNoteByUserId', // 获取个人所有笔记
    getNoteDetail: HOST.law + 'lawnote/getNoteDetail', // 查看笔记详情
    getPrivacyItem: HOST.law + 'lawnote/getPrivacyItem', // 获取隐私设置列表
    giveLike: HOST.law + 'lawnote/giveLike', // 点赞
    searchNote: HOST.law + 'lawnote/searchNote', // 搜索笔记
    searchOwnerNote: HOST.law + 'lawnote/searchOwnerNote', // 搜索我的笔记
    updateLawNote: HOST.law + 'lawnote/updateLawNote', // 更新笔记
    updateNoteType: HOST.law + 'lawnote/updateNoteType', // 批量编辑笔记状态
    updatePrivacyStatus: HOST.law + 'lawnote/updatePrivacyStatus', // 隐私设置
    // 法规笔记评论接口
    addNoteComment: HOST.law + 'lawnotecomment/addNoteComment', // 添加评论
    deleteLawComment: HOST.law + 'lawnotecomment/deleteLawComment', // 删除评论
    getCommentsByNoteId: HOST.law + 'lawnotecomment/getCommentsByNoteId', // 获取评论列表
    getDialog: HOST.law + 'lawnotecomment/getDialog', // 查看对话列表
    // getLikedComments: HOST.api + 'lawnotecomment/getLikedComments' // 获取user点过赞的评论列表
    getLikedComments: HOST.law + 'lawnotecomment/getDialog' // 获取user点过赞的评论列表
  },
  publish: {
    filterConditions: HOST.publish + 'publishPro/search/filterConditions',  // ipo 筛选项
    search: HOST.publish + 'publishPro/search/listPublish',  // ipo 筛选项
    getDetails: HOST.publish + 'publishPro/search/getDetails',  // ipo 详情
    retrialFilterConditions: HOST.publish + 'publishDocket/filterConditions',  // 筛选条件
    getDistributionFromAuditing: HOST.publish + 'publishDocket/getDistributionFromAuditing',  // 获取IPO在审公司分布数据
    searchAuditingCompany: HOST.publish + 'publishDocket/searchAuditingCompany',  // 查询在审信息列表
    getMarketFromAuditing: HOST.publish + 'publishDocket/getMarketFromAuditing',  // IPO在审公司所属板块统计信息
    getAuditStatusFromAuditing: HOST.publish + 'publishDocket/getAuditStatusFromAuditing',  // 获取IPO在审公司审核状态统计信息
    getHotWords: HOST.publish + 'publishDocket/getHotWords',  // 获取热词
    getIpoCompanyInfoList: HOST.publish + 'ipo/getIpoCompanyInfoList',  // 过会公司列表
    getInstitutionFromAuditing: HOST.publish + 'publishDocket/getInstitutionFromAuditing',  // 上会公司
    getDataSourceId: HOST.publish + 'publishDocket/getDataSourceId',  // 上会公司
    getInstitutionData: HOST.publish + 'ipo/getInstitutionData',
    getIpoBoardData: HOST.publish + 'ipo/getIpoBoardData',
    getDistributionData: HOST.publish + 'ipo/getDistributionData',
    getLastOneYearInfo: HOST.publish + 'ipo/getLastOneYearInfo',
    getIndustryList: HOST.publish + 'ipo/getIndustryList'
  },
  yunyi: {
    translateFile: HOST.user + 'cloudtranslate/translateFile', // 文件云译接口
    getTranslateFileByUser: HOST.user + 'cloudtranslate/getTranslateFileByUser', // 获取用户的云译文件接口
    deleteTranslateFile: HOST.user + 'cloudtranslate/deleteTranslateFile', // 删除云译文件接口
    addEvaluate: HOST.user + 'cloudtranslate/addEvaluate' // 添加评价接口
  },
  authority: {
    getMenuInfo: HOST.authority + 'authority/getMenuInfo'  // 用户菜单权限接口
  },
  kechuangban: {
    getStibNews: HOST.publish + 'stib/getStibNews', // 获取科创板新闻
    getStibSupervise: HOST.publish + 'stib/getStibSupervise', // 获取科创板监管动态
    listStibPublish: HOST.publish + 'publishPro/search/listStibPublish', // 获取科创板ipo检索
    getStibDataSource: HOST.publish + 'stib/getStibDataSource', // 获取科创板审核动态
    getStibDetails: HOST.publish + 'publishPro/search/getStibDetails', // 获取科创板ipo详情
    getStibAnalysisInfo: HOST.publish + 'stib/getStibAnalysisInfo', // 获取科创板再审统计图表
    getStibConditions: HOST.publish + 'stib/getStibConditions', // 获取科创板再审统计筛选条件
    getStibDetailsFromDB: HOST.publish + 'stib/getStibDetailsFromDB', // 获取科创板在审详情
    getAdvertInfo: HOST.publish + 'stib/getAdvertInfo' // 获取科创板广告图片
  }
}
