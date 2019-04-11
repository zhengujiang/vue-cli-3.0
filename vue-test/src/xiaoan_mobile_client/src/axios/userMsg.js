import Axios from '../service/http'
import api from '../service/api'
export default {
    getMessageByType(params = {}) {
        return Axios({method: 'GET', url: api.userMsg.getMessageByType, params: params})
      },
    setAllUserMsgRead(params = {}) {
        return Axios({method: 'PUT', url: api.userMsg.setAllUserMsgRead, params: params})
      },
    setUserMsgRead(params = {}) {
        return Axios({method: 'PUT', url: api.userMsg.setUserMsgRead, params: params})
      },
    addUserAnswerMsg(params = {}) {
        return Axios({method: 'POST', url: api.userMsg.addUserAnswerMsg, params: params,emulateJSON:true})
      },
}
