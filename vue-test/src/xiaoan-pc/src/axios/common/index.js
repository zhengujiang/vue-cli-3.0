import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 获取广告详情
  getAdvertByType(params) {
    return Axios({method: 'GET', url: api.common.getAdvertByType, params: params})
  },
  // 获取广告分类
  getAdvertTypeList(params) {
    return Axios({method: 'GET', url: api.common.getAdvertTypeList, params: params})
  }
}
