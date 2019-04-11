import Axios from '../service/http'
import api from '../service/api'
export default {
    getUserCollectRecommend(params = {}) {
        return Axios({ method: 'GET', url: api.recommend.getUserCollectRecommend, params: params })
    },
    deleteUserCollectRecommend(params = {}) {
        return Axios({ method: 'GET', url: api.recommend.deleteUserCollectRecommend, params: params })
    },
    collectRecommend(params = {}) {
        return Axios({ method: 'GET', url: api.recommend.collectRecommend, params: params })
    },
    getRecommendCollectAttr(params = {}) {
        return Axios({ method: 'GET', url: api.recommend.getRecommendCollectAttr, params: params })
    },
    getRecommendDetails(params = {}) {
        return Axios({ method: 'GET', url: api.recommend.getRecommendDetails, params: params })
    },
}
