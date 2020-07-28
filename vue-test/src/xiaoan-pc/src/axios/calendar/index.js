import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 编辑事件邀请人
  // 获取邀请人头像
  getAvatarByMobile(params) {
    return Axios({method: 'GET', url: api.calendar.getAvatarByMobile, params: params})
  },
  // 添加邀请人
  addInviter(params) {
    return Axios({method: 'GET', url: api.calendar.addInviter, params: params})
  },
  // 删除邀请人
  deleteInviter(params) {
    return Axios({method: 'GET', url: api.calendar.deleteInviter, params: params})
  },
  // 检查邀请人合法性
  checkInviter(params) {
    return Axios({method: 'GET', url: api.calendar.checkInviter, params: params})
  },
  // 模板事件
  // 设置节点是否提醒
  updateRemind(params) {
    return Axios({method: 'GET', url: api.calendar.updateRemind, params: params})
  },
  // 添加模板事件
  addTemplateEvent(params) {
    return Axios({method: 'POST', url: api.calendar.addTemplateEvent, params: params})
  },
  // 检查股东大会召开日和股权登记日是否合法
  checkDate(params) {
    return Axios({method: 'GET', url: api.calendar.checkDate, params: params})
  },
  // 编辑模板事件
  editTemplateEvent(params) {
    return Axios({method: 'POST', url: api.calendar.editTemplateEvent, params: params})
  },
  // 获取事件节点信息
  getEventContainList(params) {
    return Axios({method: 'GET', url: api.calendar.getEventContainList, params: params})
  },
  // 获取事件节点信息
  getTemplateEventInfo(params) {
    return Axios({method: 'GET', url: api.calendar.getTemplateEventInfo, params: params})
  },
  // 删除事件
  deleteTemplateEvent(params) {
    return Axios({method: 'GET', url: api.calendar.deleteTemplateEvent, params: params})
  },
  // 日常事件
  // 添加日常事件
  addNormalEvent(params) {
    return Axios({method: 'POST', url: api.calendar.addNormalEvent, params: params})
  },
  // 设置事件提醒方式
  changeConfirmType(params) {
    return Axios({method: 'POST', url: api.calendar.changeConfirmType, params: params})
  },
  // 编辑普通事件详情
  editNormalEventInfo(params) {
    return Axios({method: 'POST', url: api.calendar.editNormalEventInfo, params: params})
  },
  // 根据时间段获取事件列表
  getEventsListBytimeSlot(params) {
    return Axios({method: 'GET', url: api.calendar.getEventsListBytimeSlot, params: params})
  },
  // 获取普通事件详情
  getNormalEventInfo(params) {
    return Axios({method: 'GET', url: api.calendar.getNormalEventInfo, params: params})
  },
  // 获取所有模板
  getTemplateList(params) {
    return Axios({method: 'GET', url: api.calendar.getTemplateList, params: params})
  },
  // 根据事件名称搜索个人事件列表
  searchEventList(params) {
    return Axios({method: 'GET', url: api.calendar.searchEventList, params: params})
  },
  // 删除事件
  deleteEventById(params) {
    return Axios({method: 'POST', url: api.calendar.deleteEventById, params: params})
  },
  // dashbord获取待办事项
  getEnterpriseEvents(params) {
    return Axios({method: 'GET', url: api.calendar.getEnterpriseEvents, params: params})
  },
  // 日历
  // 获取休市日期
  getCloseDate(params) {
    return Axios({method: 'GET', url: api.calendar.getCloseDate, params: params})
  },
  // 创建日历
  addCalendar(params) {
    return Axios({method: 'POST', url: api.calendar.addCalendar, params: params})
  },
  // 获取所属自己的日历
  getCalendarByUserId(params) {
    return Axios({method: 'GET', url: api.calendar.getCalendarByUserId, params: params})
  },
  // 编辑修改个人工作日历
  editCalendarInfo(params) {
    return Axios({method: 'POST', url: api.calendar.editCalendarInfo, params: params})
  },
  // 修改日历选中状态
  updateCalendarCheckedStatus(params) {
    return Axios({method: 'POST', url: api.calendar.updateCalendarCheckedStatus, params: params})
  },
  // 删除个人工作日历
  deleteCalendarInfo(params) {
    return Axios({method: 'POST', url: api.calendar.deleteCalendarInfo, params: params})
  },
  // 共享日历链接获取
  getShareCalendarLink(params) {
    return Axios({method: 'POST', url: api.calendar.getShareCalendarLink, params: params})
  },
  // 获取日历共享人
  getCalendarShareUsers(params) {
    return Axios({method: 'GET', url: api.calendar.getCalendarShareUsers, params: params})
  },
  // 更新共享链接
  updateShareCalendarLink(params) {
    return Axios({method: 'GET', url: api.calendar.updateShareCalendarLink, params: params})
  },
  // 修改日历颜色
  editCalendarColor(params) {
    return Axios({method: 'POST', url: api.calendar.editCalendarColor, params: params})
  },
  // 根据userID获取个人日历列表
  getUserCanlendarList(params) {
    return Axios({method: 'GET', url: api.calendar.getUserCanlendarList, params: params})
  },
  // 查看工作日历详情
  getCalendarInfo(params) {
    return Axios({method: 'GET', url: api.calendar.getCalendarInfo, params: params})
  },
  // 共享日历查看
  getShareCalendarInfo(params) {
    return Axios({method: 'GET', url: api.calendar.getShareCalendarInfo, params: params})
  },
  // 共享日历添加
  addShareCalendar(params) {
    return Axios({method: 'POST', url: api.calendar.addShareCalendar, params: params})
  },
  // 取消日历共享人
  cancelCalendarShareUsers(params) {
    return Axios({method: 'POST', url: api.calendar.cancelCalendarShareUsers, params: params})
  }
}
