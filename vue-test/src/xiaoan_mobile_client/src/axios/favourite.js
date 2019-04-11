import Axios from '../service/http'
import api from '../service/api'
export default {
    getDefault(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.getDefault, params: params })
    },
    getFavourite(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.getFavourite, params: params })
    },
    addFavourite(params = {}) {
        return Axios({ method: 'POST', url: api.favourite.addFavourite, params: params, emulateJSON: true })
    },
    deleteById(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.deleteById, params: params })
    },
    shareSwitch(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.shareSwitch, params: params })
    },
    getSubscriptionList(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.getSubscriptionList, params: params })
    },
    savedSubscription(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.savedSubscription, params: params })
    },
    cancelSubscription(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.cancelSubscription, params: params })
    },
    updateFavouriteName(params = {}) {
        return Axios({ method: 'POST', url: api.favourite.updateFavouriteName, params: params, emulateJSON: true })
    },
    addSubscription(params = {}) {
        return Axios({ method: 'GET', url: api.favourite.addSubscription, params: params })
    },
}
