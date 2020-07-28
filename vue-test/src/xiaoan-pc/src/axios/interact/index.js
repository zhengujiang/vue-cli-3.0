import Axios from "@/service/http";
import api from '@/service/api/index'
// 互动e
export default {
  listInteractByCompanyCode(params) {
    return Axios({method: 'GET', url: api.interact.listInteractByCompanyCode, params: params})
  }
}
