import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 增加信批事项
  addInfoClosureItemMain(params) {
    return Axios({method: 'PUT', url: api.disclosure.addInfoClosureItemMain, params: params})
  },
  // 删除信批事项
  deleteClosureItemMain(params) {
    return Axios({method: 'DELETE', url: api.disclosure.deleteClosureItemMain, params: params})
  },
  // 删除事项节点
  deleteItemNode(params) {
    return Axios({method: 'DELETE', url: api.disclosure.deleteItemNode, params: params})
  },
  // 查询系统事项模板
  getInfoDisclosureEventByCompanyId(params) {
    return Axios({method: 'GET', url: api.disclosure.getInfoDisclosureEventByCompanyId, params: params})
  },
  // 查询事项归档
  getArchivedItemMain(params) {
    return Axios({method: 'GET', url: api.disclosure.getArchivedItemMain, params: params})
  },
  // 获取事项邀请信息
  getItemMainSharedInfo(params) {
    return Axios({method: 'GET', url: api.disclosure.getItemMainSharedInfo, params: params})
  },
  // 查询自定义模板要点详情和审议程序
  getCustomInfoByItemId(params) {
    return Axios({method: 'GET', url: api.disclosure.getCustomInfoByItemId, params: params})
  },
  // 获取信批事项
  getInfoDisclosureItemMain(params) {
    return Axios({method: 'GET', url: api.disclosure.getInfoDisclosureItemMain, params: params})
  },
  // 获取待办邀请信息
  getInviteByUserId(params) {
    return Axios({method: 'GET', url: api.disclosure.getInviteByUserId, params: params})
  },
  // 查询自定义事项模板
  getCustomTemplateByUserId(params) {
    return Axios({method: 'GET', url: api.disclosure.getCustomTemplateByUserId, params: params})
  },
  // 查询系统默认模板要点详情
  getInfoByItemId(params) {
    return Axios({method: 'GET', url: api.disclosure.getInfoByItemId, params: params})
  },
  // 通过事项二级Id获取节点
  getItemNodeList(params) {
    return Axios({method: 'GET', url: api.disclosure.getItemNodeList, params: params})
  },
  // 点击节点名称获取要点信息
  getPointByTemplateId(params) {
    return Axios({method: 'GET', url: api.disclosure.getPointByTemplateId, params: params})
  },
  // 归档
  archivedItemMain(params) {
    return Axios({method: 'POST', url: api.disclosure.archivedItemMain, params: params})
  },
  // 归档
  addNodeToCalender(params) {
    return Axios({method: 'POST', url: api.disclosure.addNodeToCalender, params: params})
  },
  // 添加节点到日历
  addItemMainToCalender(params) {
    return Axios({method: 'POST', url: api.disclosure.addItemMainToCalender, params: params})
  },
  // 撤回归档
  cancelArchivedItemMain(params) {
    return Axios({method: 'POST', url: api.disclosure.cancelArchivedItemMain, params: params})
  },
  // 存为信披模板
  saveToTemplate(params) {
    return Axios({method: 'POST', url: api.disclosure.saveToTemplate, params: params})
  },
  // 获取企业版用户信息
  getEnterpriseUserList(params) {
    return Axios({method: 'GET', url: api.disclosure.getEnterpriseUserList, params: params})
  },
  // 获取事项分享用户信息（编辑分享时用）
  getDisClosureItemSharedUserInfo(params) {
    return Axios({method: 'GET', url: api.disclosure.getDisClosureItemSharedUserInfo, params: params})
  },
  // 修改事项分享信息
  updateItemSharedDetail(params) {
    return Axios({method: 'POST', url: api.disclosure.updateItemSharedDetail, params: params})
  },
  // 修改信批事项
  updateInfoClosureItemMain(params) {
    return Axios({method: 'POST', url: api.disclosure.updateInfoClosureItemMain, params: params})
  },
  // 修改自定义模板
  updateCustomTemplate(params) {
    return Axios({method: 'POST', url: api.disclosure.updateCustomTemplate, params: params})
  },
  // 修改信批事项
  deleteTemplate(params) {
    return Axios({method: 'POST', url: api.disclosure.deleteTemplate, params: params})
  },
  // 在当前位置下插入节点，【节点序号】传当前位置的序号
  addItemNode(params) {
    return Axios({method: 'POST', url: api.disclosure.addItemNode, params: params})
  },
  // 编辑事项节点
  editItemNode(params) {
    return Axios({method: 'POST', url: api.disclosure.editItemNode, params: params})
  },
  // 移动类型可选 UP :上移 DOWN ：下移
  moveNode(params) {
    return Axios({method: 'POST', url: api.disclosure.moveNode, params: params})
  },
  downloadReport(params) {
    return Axios({method: 'POST', url: api.disclosure.downloadReport, params: params})
  },
  checkDocExist(params) {
    return Axios({method: 'GET', url: api.disclosure.checkDocExist, params: params})
  },
  getDocRecordList(params) {
    return Axios({method: 'GET', url: api.disclosure.getDocRecordList, params: params})
  }
}
