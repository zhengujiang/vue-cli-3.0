import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  //
  getBusinessDetail: function (params = {}) {
    return Axios({method: 'GET', url: api.business.getBusinessDetail, params: params})
  },
  getShowList: function (params = {}) {
    return Axios({method: 'GET', url: api.business.getShowList, params: params})
  },
  getTypes: function (params = {}) {
    return Axios({method: 'GET', url: api.business.getTypes, params: params})
  }

}
