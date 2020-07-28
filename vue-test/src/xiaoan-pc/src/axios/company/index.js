import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 简况
  getCompanyInfo(params) {
    return Axios({method: 'GET', url: api.company.getCompanyInfo, params: params})
  }
}
