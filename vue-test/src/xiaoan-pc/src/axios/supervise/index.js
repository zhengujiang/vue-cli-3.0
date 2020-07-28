import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  superviseDynamic(params) {
    return Axios({method: 'GET', url: api.supervise.superviseDynamic, params: params})
  }
}
