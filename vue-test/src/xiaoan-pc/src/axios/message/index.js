import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  //  分类查看推送消息
  getMessageByType(params) {
    return Axios({method: 'GET', url: api.message.getMessageByType, params: params})
  },
  //  全部消息设置为已阅读
  setAllUserMsgRead(params) {
    return Axios({method: 'POST', url: api.message.setAllUserMsgRead, params: params})
  },
  //  单条消息设置为已阅读
  setUserMsgRead(params) {
    return Axios({method: 'POST', url: api.message.setUserMsgRead, params: params})
  },
  //  删除消息
  deleteUserMsg(params) {
    return Axios({method: 'DELETE', url: api.message.deleteUserMsg, params: params})
  }
}
