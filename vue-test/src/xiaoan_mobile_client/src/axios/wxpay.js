import Axios from '../service/http'
import api from '../service/api'
export default {
    payexam(params = {}) {
        return Axios({ method: 'POST', url: api.wxpay.payexam, params: params,emulateJSON:true })
    },
}
