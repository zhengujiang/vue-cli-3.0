import Axios from "@/service/http";
import api from '@/service/api/index'
 // 制度
export default {
  selectAllForCompanyCatalog(params) {
    return Axios({method: 'GET', url: api.institution.selectAllForCompanyCatalog, params: params})
  },
  selectAllByCatalogType(params) {
    return Axios({method: 'GET', url: api.institution.selectAllByCatalogType, params: params})
  },
  listCompanyCatalog(params) {
    return Axios({method: 'GET', url: api.institution.listCompanyCatalog, params: params})
  },
  editRegulations(params) {
    return Axios({method: 'POST', url: api.institution.editRegulations, params: params})
  },
  editCompanyCatalog(params) {
    return Axios({method: 'POST', url: api.institution.editCompanyCatalog, params: params})
  },
  deleteRegulations(params) {
    return Axios({method: 'POST', url: api.institution.deleteRegulations, params: params})
  },
  deleteCompanyCatalog(params) {
    return Axios({method: 'POST', url: api.institution.deleteCompanyCatalog, params: params})
  },
  addCompanyCatalog(params) {
    return Axios({method: 'POST', url: api.institution.addCompanyCatalog, params: params})
  },
  listAllForGovernanceCataLog(params) {
    return Axios({method: 'GET', url: api.institution.listAllForGovernanceCataLog, params: params})
  },
  addRegulations(params) {
    return Axios({method: 'POST', url: api.institution.addRegulations, params: params})
  }
}
