import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 消息推送
  // 获取消息
  getMessageByType(params) {
    return Axios({method: 'GET', url: api.userMsg.getMessageByType, params: params})
  },
  // 类型消息全部设为阅读
  setAllUserMsgRead(params) {
    return Axios({method: 'PUT', url: api.userMsg.setAllUserMsgRead, params: params})
  },
  // 单条消息设置为已阅读
  setUserMsgRead(params) {
    return Axios({method: 'PUT', url: api.userMsg.setUserMsgRead, params: params})
  },
  // 添加 回答问题的所有消息
  addUserAnswerMsg(params) {
    return Axios({method: 'POST', url: api.userMsg.addUserAnswerMsg, params: params})
  }
}
