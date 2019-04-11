import Axios from '../service/http'
import api from '../service/api'
export default {
    getPermissionCheckList(params = {}) {
        return Axios({ method: 'GET', url: api.permission.getPermissionCheckList, params: params })
    },
    resetAnnualReport(params = {}) {
        return Axios({ method: 'GET', url: api.permission.resetAnnualReport, params: params })
    },
    getAnnualReport(params = {}) {
        return Axios({ method: 'GET', url: api.permission.getAnnualReport, params: params })
    },
    saveAnnualReport(params = {}) {
        return Axios({ method: 'POST', url: api.permission.saveAnnualReport, params: params, emulateJSON: true })
    },
    getAnnualReportByYear(params = {}) {
        return Axios({ method: 'GET', url: api.permission.getAnnualReportByYear, params: params })
    },
    getAnnualReportInside(params = {}) {
        return Axios({ method: 'GET', url: api.permission.getAnnualReportInside, params: params })
    },
    saveInsideAnnualReport(params = {}) {
        return Axios({ method: 'POST', url: api.permission.saveInsideAnnualReport, params: params,emulateJSON: true })
    },
    resetInsideAnnualReport(params = {}) {
        return Axios({ method: 'GET', url: api.permission.resetInsideAnnualReport, params: params })
    },
    getPermissionInsideList(params = {}) {
        return Axios({ method: 'GET', url: api.permission.getPermissionInsideList, params: params })
    },
    deleteInsideCompany(params = {}) {
        return Axios({ method: 'GET', url: api.permission.deleteInsideCompany, params: params })
    },
    getInsideList(params = {}) {
        return Axios({ method: 'GET', url: api.permission.getInsideList, params: params })
    },
    setNewAnnualReport(params = {}) {
        return Axios({ method: 'GET', url: api.permission.setNewAnnualReport, params: params })
    },
    checkIsAttend(params = {}) {
        return Axios({ method: 'GET', url: api.permission.checkIsAttend, params: params })
    },
    addInsideCompany(params = {}) {
        return Axios({ method: 'GET', url: api.permission.addInsideCompany, params: params })
    },
}
