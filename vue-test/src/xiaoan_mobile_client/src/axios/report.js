import Axios from '../service/http'
import api from '../service/api'
export default {
    getIntegratedReportByType(params = {}) {
        return Axios({method: 'GET', url: api.report.getIntegratedReportByType, params: params})
      },
    getAllIntegratedReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getAllIntegratedReport, params: params})
      },
    getIntegratedTypeList(params = {}) {
        return Axios({method: 'GET', url: api.report.getIntegratedTypeList, params: params})
      },
    getAllIndutryReportByIndustry(params = {}) {
        return Axios({method: 'GET', url: api.report.getAllIndutryReportByIndustry, params: params})
      },
    getAllIndustryReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getAllIndustryReport, params: params})
      },
    getIndustryTypeList(params = {}) {
        return Axios({method: 'GET', url: api.report.getIndustryTypeList, params: params})
      },
    getAllCompanyReportByIndustry(params = {}) {
        return Axios({method: 'GET', url: api.report.getAllCompanyReportByIndustry, params: params})
      },
    getAllCompanyIndustryList(params = {}) {
        return Axios({method: 'GET', url: api.report.getAllCompanyIndustryList, params: params})
      },
    getAllCompanyReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getAllCompanyReport, params: params})
      },
    getNewResearchReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getNewResearchReport, params: params})
      },
    getMyAttentionCompany(params = {}) {
        return Axios({method: 'GET', url: api.report.getMyAttentionCompany, params: params})
      },
    getMyResearchReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getMyResearchReport, params: params})
      },
    getReportDetails(params = {}) {
        return Axios({method: 'GET', url: api.report.getReportDetails, params: params})
      },
    getRelatedIndutryReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getRelatedIndutryReport, params: params})
      },
    getRelatedCompanyReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getRelatedCompanyReport, params: params})
      },
    getRelatedIntegratedReport(params = {}) {
        return Axios({method: 'GET', url: api.report.getRelatedIntegratedReport, params: params})
      },
    searchReports(params = {}) {
        return Axios({method: 'GET', url: api.report.searchReports, params: params})
      },
}
