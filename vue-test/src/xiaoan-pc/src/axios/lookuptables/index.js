import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 内部 用户添加关注公司
  addFocus(params) {
    return Axios({method: 'GET', url: api.lookuptables.addFocus, params: params})
  },
  // 内部 用户删除关注公司
  delFocus(params) {
    return Axios({method: 'GET', url: api.lookuptables.delFocus, params: params})
  },
  // 内部 用户关注的公司
  userFocus(params) {
    return Axios({method: 'GET', url: api.lookuptables.userFocus, params: params})
  },
  // 内部 内部员工获取年报数据
  getYearData(params) {
    return Axios({method: 'GET', url: api.lookuptables.getYearData, params: params})
  },
  // 内部 内部员工通过年份获取年报
  getNumData(params) {
    return Axios({method: 'GET', url: api.lookuptables.getNumData, params: params})
  },
  // 内部 获取内部员工的权限速查表
  getInsideList(params) {
    return Axios({method: 'GET', url: api.lookuptables.getInsideList, params: params})
  },
  // 内部 [内部]保存数据校准
  saveDatas(params) {
    return Axios({method: 'POST', url: api.lookuptables.saveDatas, params: params})
  },
  // 内部 [内部]重置数据校准
  resetData(params) {
    return Axios({method: 'GET', url: api.lookuptables.resetData, params: params})
  },
  // 公司代码autocomplete
  checkIsAttend(params) {
    return Axios({method: 'GET', url: api.lookuptables.checkIsAttend, params: params})
  },
  // 重置数据校准
  resetDataOut(params) {
    return Axios({method: 'GET', url: api.lookuptables.resetDataOut, params: params})
  },
  // 保存数据校准
  saveDataOut(params) {
    return Axios({method: 'POST', url: api.lookuptables.saveDataOut, params: params})
  },
  // 获取权限速查表
  getInsideListOut(params) {
    return Axios({method: 'POST', url: api.lookuptables.getInsideListOut, params: params})
  },
  // 
  getPermissionCheckListEnterprise(params) {
    return Axios({method: 'GET', url: api.lookuptables.getPermissionCheckListEnterprise, params: params})
  },
  // 获取年报数据
  getData(params) {
    return Axios({method: 'GET', url: api.lookuptables.getData, params: params})
  },
  // 提示获取最新年报数据
  setNewAnnualReport(params) {
    return Axios({method: 'GET', url: api.lookuptables.setNewAnnualReport, params: params})
  }
}
