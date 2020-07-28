import Axios from "@/service/http";
import api from '@/service/api/index'
  // 法规笔记
export default {
  // 创建笔记
  addLawNote(params) {
    return Axios({method: 'POST', url: api.lawnote.addLawNote, data: params})
  },
  // 批量删除笔记
  deleteLawNote(params) {
    return Axios({method: 'POST', url: api.lawnote.deleteLawNote, params: params})
  },
  // 多段标记
  getMultistageNote(params) {
    return Axios({method: 'POST', url: api.lawnote.getMultistageNote, params: params})
  },
  // 获取个人所有笔记
  getNoteByUserId(params) {
    return Axios({method: 'POST', url: api.lawnote.getNoteByUserId, params: params})
  },
  // 查看笔记详情
  getNoteDetail(params) {
    return Axios({method: 'POST', url: api.lawnote.getNoteDetail, params: params})
  },
  // 获取隐私设置列表
  getPrivacyItem(params) {
    return Axios({method: 'GET', url: api.lawnote.getPrivacyItem, params: params})
  },
  // 点赞
  giveLike(params) {
    return Axios({method: 'POST', url: api.lawnote.giveLike, params: params})
  },
  // 搜索笔记
  searchNote(params) {
    return Axios({method: 'GET', url: api.lawnote.searchNote, params: params})
  },
  // 搜索我的笔记
  searchOwnerNote(params) {
    return Axios({method: 'GET', url: api.lawnote.searchOwnerNote, params: params})
  },
  // 更新笔记
  updateLawNote(params) {
    return Axios({method: 'POST', url: api.lawnote.updateLawNote, data: params})
  },
  // 批量编辑笔记状态
  updateNoteType(params) {
    return Axios({method: 'POST', url: api.lawnote.updateNoteType, params: params})
  },
  // 隐私设置
  updatePrivacyStatus(params) {
    return Axios({method: 'POST', url: api.lawnote.updatePrivacyStatus, params: params})
  },
  // 法规笔记评论接口
   // 添加评论
  addNoteComment(params) {
    return Axios({method: 'POST', url: api.lawnote.addNoteComment, params: params})
  },
   // 删除评论
  deleteLawComment(params) {
    return Axios({method: 'POST', url: api.lawnote.deleteLawComment, params: params})
  },
   // 获取评论列表
  getCommentsByNoteId(params) {
    return Axios({method: 'GET', url: api.lawnote.getCommentsByNoteId, params: params})
  },
   // 查看对话列表
  getDialog(params) {
    return Axios({method: 'GET', url: api.lawnote.getDialog, params: params})
  },
   // 获取user点过赞的评论列表
  getLikedComments(params) {
    return Axios({method: 'GET', url: api.lawnote.getLikedComments, params: params})
  }
}
