import Axios from '../service/http'
import api from '../service/api'
export default {
  editCalendarInfo(params = {}) {
    return Axios({method: 'POST', url: api.calendar.editCalendarInfo, params: params, emulateJSON: true})
  },
  deleteCalendarInfo(params = {}) {
    return Axios({method: 'POST', url: api.calendar.deleteCalendarInfo, params: params, emulateJSON: true})
  },
  cancelCalendarShareUsers(params = {}) {
    return Axios({method: 'POST', url: api.calendar.cancelCalendarShareUsers, params: params, emulateJSON: true})
  },
  addShareCalendar(params = {}) {
    return Axios({method: 'POST', url: api.calendar.addShareCalendar, params: params, emulateJSON: true})
  },
  addCalendar(params = {}) {
    return Axios({method: 'POST', url: api.calendar.addCalendar, params: params, emulateJSON: true})
  },
  editCalendarColor(params = {}) {
    return Axios({method: 'POST', url: api.calendar.editCalendarColor, params: params, emulateJSON: true})
  },
  updateCalendarCheckedStatus(params = {}) {
    return Axios({method: 'POST', url: api.calendar.updateCalendarCheckedStatus, params: params, emulateJSON: true})
  },
  getCalendarByUserId(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getCalendarByUserId, params: params})
  },
  getCalendarInfo(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getCalendarInfo, params: params})
  },
  getCloseDate(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getCloseDate, params: params})
  },
  getCalendarShareUsers(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getCalendarShareUsers, params: params})
  },
  getShareCalendarInfo(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getShareCalendarInfo, params: params})
  },
  getShareCalendarLink(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getShareCalendarLink, params: params})
  },
  getUserCanlendarList(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getUserCanlendarList, params: params})
  },
  updateShareCalendarLink(params = {}) {
    return Axios({method: 'GET', url: api.calendar.updateShareCalendarLink, params: params})
  },
  getAvatarByMobile(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getAvatarByMobile, params: params})
  },
  getAllCloseDate(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getAllCloseDate, params: params})
  },
  addNormalEvent(params = {}) {
    return Axios({method: 'POST', url: api.calendar.addNormalEvent, params: params, emulateJSON: true})
  },
  changeConfirmType(params = {}) {
    return Axios({method: 'POST', url: api.calendar.changeConfirmType, params: params, emulateJSON: true})
  },
  editNormalEventInfo(params = {}) {
    return Axios({method: 'POST', url: api.calendar.editNormalEventInfo, params: params, emulateJSON: true})
  },
  deleteEventById(params = {}) {
    return Axios({method: 'POST', url: api.calendar.deleteEventById, params: params, emulateJSON: true})
  },
  getEventsListBytimeSlot(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getEventsListBytimeSlot, params: params})
  },
  getNormalEventInfo(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getNormalEventInfo, params: params})
  },
  searchEventList(params = {}) {
    return Axios({method: 'GET', url: api.calendar.searchEventList, params: params})
  },
  getTemplateList(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getTemplateList, params: params})
  },
  addTemplateEvent(params = {}) {
    return Axios({method: 'POST', url: api.calendar.addTemplateEvent, data: params, emulateJSON: true})
  },
  editTemplateEvent(params = {}) {
    return Axios({method: 'POST', url: api.calendar.editTemplateEvent, data: params, emulateJSON: true})
  },
  addInviter(params = {}) {
    return Axios({method: 'GET', url: api.calendar.addInviter, params: params})
  },
  checkDate(params = {}) {
    return Axios({method: 'GET', url: api.calendar.checkDate, params: params})
  },
  checkInviter(params = {}) {
    return Axios({method: 'GET', url: api.calendar.checkInviter, params: params})
  },
  deleteInviter(params = {}) {
    return Axios({method: 'GET', url: api.calendar.deleteInviter, params: params})
  },
  getEventContainList(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getEventContainList, params: params})
  },
  getTemplateEventInfo(params = {}) {
    return Axios({method: 'GET', url: api.calendar.getTemplateEventInfo, params: params})
  },
  updateRemind(params = {}) {
    return Axios({method: 'GET', url: api.calendar.updateRemind, params: params})
  },
  deleteTemplateEvent(params = {}) {
    return Axios({method: 'GET', url: api.calendar.deleteTemplateEvent, params: params})
  },
}
