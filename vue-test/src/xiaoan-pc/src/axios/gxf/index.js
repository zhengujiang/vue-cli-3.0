import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  Axios: Axios,
  // 股东名册上传接口
  FileUpload(paeams) {
    console.log(paeams);
    let apiuri = Object.assign({}, paeams, {
      method: 'POST',
      // headers: {"Content-Type": "application/x-www-form-urlencoded"},
      url: api.gxfApi.fileUpload,
      timeout: 1000 * 60 * 10
    })
    console.log(apiuri);
    return Axios(apiuri)
  },
  // 添加分组
  addGroup(params) {
    return Axios({method: 'POST', url: api.gxfApi.addGroup, params: params})
  },
  // 删除分组
  deleteGroup(params) {
    return Axios({method: 'POST', url: api.gxfApi.deleteGroup, params: params})
  },
  // 删除控股股东
  deleteHoldCrew(params) {
    return Axios({method: 'POST', url: api.gxfApi.deleteHoldCrew, params: params})
  },
  // 修改组信息
  editGroupInfo(params) {
    return Axios({method: 'POST', url: api.gxfApi.editGroupInfo, params: params})
  },
  // 修改警戒线
  editGroupGuardLine(params) {
    return Axios({method: 'POST', url: api.gxfApi.editGroupGuardLine, params: params})
  },
  // 设置控股股东
  setControllShareholder(params) {
    return Axios({method: 'POST', url: api.gxfApi.setControllShareholder, params: params})
  },
  // 从股东名册中添加
  getNewRollOfficial(params) {
    return Axios({method: 'GET', url: api.gxfApi.getNewRollOfficial, params: params})
  },
  // 历史股东搜索
  getHistoryHolderInfo(params) {
    return Axios({method: 'GET', url: api.gxfApi.getHistoryHolderInfo, params: params})
  },
  // 获取指定期数的地域集合
  getAddressList(params) {
    return Axios({method: 'GET', url: api.gxfApi.getAddressList, params: params})
  },
  // 获取机构热词
  getHotInstitutioninfo(params) {
    return Axios({method: 'GET', url: api.gxfApi.getHotInstitutioninfo, params: params})
  },
  // 获取股东信息
  getOfficialDataByInstitution(params) {
    return Axios({method: 'GET', url: api.gxfApi.getOfficialDataByInstitution, params: params})
  },
  // 自动填充机构热词
  getAutoCompleteHotWord(params) {
    return Axios({method: 'GET', url: api.gxfApi.getAutoCompleteHotWord, params: params})
  },
  // 自动填充历史股东条件
  getHistoryAutoCompleteHotWord(params) {
    return Axios({method: 'GET', url: api.gxfApi.getHistoryAutoCompleteHotWord, params: params})
  },
  // 编辑投资者
  updateInvestor(params) {
    return Axios({method: 'POST', url: api.gxfApi.updateInvestor, params: params})
  },
  // 编辑投资者
  deleteInvestor(params) {
    return Axios({method: 'PUT', url: api.gxfApi.deleteInvestor, params: params})
  },
  // 搜素自动填充
  autoInvestor(params) {
    return Axios({method: 'GET', url: api.gxfApi.autoInvestor, params: params})
  },
  // 导出数据库
  uploadInvestor(params) {
    return Axios({method: 'GET', url: api.gxfApi.uploadInvestor, params: params})
  },
  // 获取投资者信息byId
  getById(params) {
    return Axios({method: 'GET', url: api.gxfApi.getById, params: params})
  },
  // 投资者数据库管理
  searchInvestor(params) {
    return Axios({method: 'GET', url: api.gxfApi.searchInvestor, params: params})
  },
  // 投资者数据库调研记录管理
  getOneInvestor(params) {
    return Axios({method: 'GET', url: api.gxfApi.getOneInvestor, params: params})
  },
  getInvestorResearchRecord(params) {
    return Axios({method: 'GET', url: api.gxfApi.getInvestorResearchRecord, params: params})
  },
  editInvestorResearchRecord(params) {
    return Axios({method: 'POST', url: api.gxfApi.editInvestorResearchRecord, params: params})
  },
  downloadInvestorResearchRecord(params) {
    return Axios({method: 'POST', url: api.gxfApi.downloadInvestorResearchRecord, params: params})
  },
  deleteInvestorResearchRecord(params) {
    return Axios({method: 'POST', url: api.gxfApi.deleteInvestorResearchRecord, params: params})
  },
  addInvestorResearchRecord(params) {
    return Axios({method: 'POST', url: api.gxfApi.addInvestorResearchRecord, params: params})
  },
  //  获取股价对比
  getStockPriceComparison(params) {
    return Axios({method: 'GET', url: api.gxfApi.getStockPriceComparison, params: params})
  },
  //  分组股东对比-股东组对比信息
  getGroupComparisonInfo(params) {
    return Axios({method: 'GET', url: api.gxfApi.getGroupComparisonInfo, params: params})
  },
  //  导出对比报告
  exportComparisonExcel(params) {
    return Axios({method: 'GET', url: api.gxfApi.exportComparisonExcel, params: params})
  },
  //  重要股东概览
  getImportantHolderOverview(params) {
    return Axios({method: 'GET', url: api.gxfApi.getImportantHolderOverview, params: params})
  },
  //  重要股东-最新前十大股东
  getLastedImportantHolderInfo(params) {
    return Axios({method: 'GET', url: api.gxfApi.getLastedImportantHolderInfo, params: params})
  },
  //  重要股东-最新前十大流通股东
  getLastedPTHolderInfo(params) {
    return Axios({method: 'GET', url: api.gxfApi.getLastedPTHolderInfo, params: params})
  },
  //  设置其他持股情况
  setOtherShareHolding(params) {
    return Axios({method: 'GET', url: api.gxfApi.setOtherShareHolding, params: params})
  },
  //  生成股东趋势分析报告
  generateHolderTrendReport(params) {
    return Axios({method: 'GET', url: api.gxfApi.generateHolderTrendReport, params: params})
  },
  //  限售股解禁时间表详情
  getLockStockTimeDetail(params) {
    return Axios({method: 'GET', url: api.gxfApi.getLockStockTimeDetail, params: params})
  },
  //  限售股解禁时间表
  getLockStockTimeList(params) {
    return Axios({method: 'GET', url: api.gxfApi.getLockStockTimeList, params: params})
  },
  //  获取公募基金持股情况分析
  getPublicHolder(params) {
    return Axios({method: 'GET', url: api.gxfApi.getPublicHolder, params: params})
  },
  //  获取潜在基金持股情况分析
  getPotentialFundHolderByStockCode(params) {
    return Axios({method: 'GET', url: api.gxfApi.getPotentialFundHolderByStockCode, params: params})
  },
  //  获取潜在基金持股情况明细
  getPotentialFundHolderDetails(params) {
    return Axios({method: 'GET', url: api.gxfApi.getPotentialFundHolderDetails, params: params})
  },
  //  获取股份整体质押情况
  getStockPledge(params) {
    return Axios({method: 'GET', url: api.gxfApi.getStockPledge, params: params})
  },
  //  融资融券情况分析（列表、图表）
  listAndChartRZRQAnalysis(params) {
    return Axios({method: 'GET', url: api.gxfApi.listAndChartRZRQAnalysis, params: params})
  },
  //  沪、深股通持股情况分析（列表、图表）
  listAndChartSHSZGTStockOwnershipAnalysis(params) {
    return Axios({method: 'GET', url: api.gxfApi.listAndChartSHSZGTStockOwnershipAnalysis, params: params})
  },
  // 判断用户是否属于股行分指定用户
  checkIsGxfUser(params) {
    return Axios({method: 'GET', url: api.gxfApi.checkIsGxfUser, params: params})
  },
  // 上传 部分
  updateAgreeMent(params) {
    return Axios({method: 'POST', url: api.gxfApi.updateAgreeMent, params: params})
  },
  // 查询上传记录
  getUserUploadRecord(params) {
    return Axios({method: 'GET', url: api.gxfApi.getUserUploadRecord, params: params})
  },
  // 查询上传记录
  exportRollOfficial(params) {
    return Axios({method: 'POST', url: api.gxfApi.exportRollOfficial, params: params})
  },
  // 根据上传Id删除导入记录
  deleteBySummaryIds(params) {
    return Axios({method: 'DELETE', url: api.gxfApi.deleteBySummaryIds, params: params})
  },
  //  根据用户ID清除所有上传记录
  batchDeleteUploadRecords(params) {
    return Axios({method: 'DELETE', url: api.gxfApi.batchDeleteUploadRecords, params: params})
  },
  // 股东名册搜索;
  searchRollOfficial(params) {
    return Axios({method: 'GET', url: api.gxfApi.searchRollOfficial, params: params})
  },
  // 股东名册搜索
  getShareStatistics(params) {
    return Axios({method: 'GET', url: api.gxfApi.getShareStatistics, params: params})
  },
  // 获取名册期数
  getLastedRecordDate(params) {
    return Axios({method: 'GET', url: api.gxfApi.getLastedRecordDate, params: params})
  },
  // 股东人员信息
  searchHolderInfo(params) {
    return Axios({method: 'GET', url: api.gxfApi.searchHolderInfo, params: params})
  },
  // 获取股东性质枚举
  getPossessorTypes() {
    return Axios({method: 'GET', url: api.gxfApi.getPossessorTypes, params: {}})
  },
  // 获取股东性质枚举
  addInvestor(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.addInvestor, params: params})
  },
  // 获取组信息 /holdegroup/getGroupListInfo
  getGroupListInfo(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getGroupListInfo, params: params})
  },
  // 分项股东对比-股东性质对比信息
  getHolderPropertyComparisonInfo(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getHolderPropertyComparisonInfo, params: params})
  },
  // 股东对比分析总览-获取股东对比信息可选日期
  getHolderComparisonChooseDate(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getHolderComparisonChooseDate, params: params})
  },
  // 股东对比分析总览-获取股东对比信息
  getHolderComparisonInfo(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getHolderComparisonInfo, params: params})
  },
  // 股东对比分析总览-获取一键对比信息
  getOneKeyComparisonInfo(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getOneKeyComparisonInfo, params: params})
  },
  // 导出一键对比Excel报告
  exportOneKeyComparisonExcel(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.exportOneKeyComparisonExcel, params: params})
  },
  // 获取股东对比变动图
  getHolderComparisonChart(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getHolderComparisonChart, params: params})
  },
  // GET /shareholderList/searchShareholderList
  searchShareholderList(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.searchShareholderList, params: params})
  },
  // GET /shareholderList/searchShareholderList
  getShareholderStatistics(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getShareholderStatistics, params: params})
  },
  // GET /shareholderList/searchShareholderList
  exportShareholderList(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.exportShareholderList, params: params})
  },
  holdingStockDegree(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.holdingStockDegree, params: params})
  },
  holderType(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.holderType, params: params})
  },
  getCreditGuaranteeInfo(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getCreditGuaranteeInfo, params: params})
  },
  holderAddress(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.holderAddress, params: params})
  },
  // 个人信息
  getShareholderInfo(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.getShareholderInfo, params: params})
  },
  getShareChanges(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.getShareChanges, params: params})
  },
  getConcertedShareChanges(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.getConcertedShareChanges, params: params})
  },
  getRestrictionDetails(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.getRestrictionDetails, params: params})
  },
  // 查询股东基本信息
  getBasicInfo(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.getBasicInfo, params: params})
  },
  // 查询股东基本信息
  getOtherProductsShareChanges(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getOtherProductsShareChanges, params: params})
  },
  // 查询股东基本信息 POST /rollOfficialData/getOtherShareHolding
  getOtherShareHolding(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.getOtherShareHolding, params: params})
  },
  //
  // 查询股东基本信息 POST /rollOfficialData/getOtherShareHolding
  getPublicValueReport(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.getPublicValueReport, params: params})
  },
  //
  // 通过 风报
  riskstorm(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.riskstorm, params: params})
  },
  // 查询管理公司信息
  getManageInfo(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getManageInfo, params: params})
  },
  // 查询旗下其他产品持有公司股份的情况的持股变动图
  getOtherProductsShareChangesTu(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getOtherProductsShareChangesTu, params: params})
  },
  // 获取分组对比变动图
  getGroupComparisonChart(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getGroupComparisonChart, params: params})
  },
  // 获取趋势分析头部的数量统计
  getGeneralInfoByStockCode(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getGeneralInfoByStockCode, params: params})
  },
  // 获取同行业股东户数
  listSameIndustryShareholderss(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.listSameIndustryShareholderss, params: params})
  },
  // 股东户数及平均持股情况分析
  getStockHolderAndShareInfoByStockCode(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getStockHolderAndShareInfoByStockCode, params: params})
  },
  // 获取用户所绑定的股票代码
  getUseStockCode(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getUseStockCode, params: params})
  },
  // 生成股东分析报告
  generateHolderAnalysisReport(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.generateHolderAnalysisReport, params: params})
  },
  // 判断是否有工商信息
  checkHasIndustryName(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.checkHasIndustryName, params: params})
  },
  // 获取同行业公司
  getManualSameIndustry(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getManualSameIndustry, params: params})
  },
  // 手动设置同行业公司
  setManualSameIndustry(params = {}) {
    return Axios({method: 'POST', url: api.gxfApi.setManualSameIndustry, params: params})
  },
  // 获取所有同行业公司
  getAllIndustryCompany(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getAllIndustryCompany, params: params})
  },
  // 恢复默认同行业公司
  getDefaultSameIndustry(params = {}) {
    return Axios({method: 'GET', url: api.gxfApi.getDefaultSameIndustry, params: params})
  }
}
