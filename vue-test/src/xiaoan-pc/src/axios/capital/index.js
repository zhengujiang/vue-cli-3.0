import Axios from "@/service/http";
import api from '@/service/api/index'
// 资金
export default {
  getCompanyCapitalToday(params) {
    return Axios({method: 'GET', url: api.capital.getCompanyCapitalToday, params: params})
  },
  getCompanyCapitalTenDay(params) {
    return Axios({method: 'GET', url: api.capital.getCompanyCapitalTenDay, params: params})
  }
}
