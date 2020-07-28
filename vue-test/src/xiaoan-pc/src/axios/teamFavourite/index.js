import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  // 获取团队默认收藏夹
  getTeamDefault(params) {
    return Axios({method: 'GET', url: api.teamFavourite.getTeamDefault, params: params})
  },
  // 根据用户Id获取收藏夹
  getFavourite(params) {
    return Axios({method: 'GET', url: api.teamFavourite.getFavourite, params: params})
  },
  // 根据用户Id获取收藏夹
  getTeamFavouriteInfoById(params) {
    return Axios({method: 'GET', url: api.teamFavourite.getTeamFavouriteInfoById, params: params})
  },
  // 编辑团队收藏夹
  updateFavouriteName(params) {
    return Axios({method: 'POST', url: api.teamFavourite.updateFavouriteName, params: params})
  },
  // 删除团队收藏夹
  deleteById(params) {
    return Axios({method: 'POST', url: api.teamFavourite.deleteById, params: params})
  },
  // 新建团队收藏夹
  addTeamFavourite(params) {
    return Axios({method: 'POST', url: api.teamFavourite.addTeamFavourite, params: params})
  }  
}
