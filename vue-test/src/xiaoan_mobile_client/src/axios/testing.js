import Axios from '../service/http'
import api from '../service/api'
export default {
    myTest(params = {}) {
        return Axios({ method: 'GET', url: api.testing.myTest, params: params })
    },
    getNum(params = {}) {
        return Axios({ method: 'GET', url: api.testing.getNum, params: params })
    },
    start(params = {}) {
        return Axios({ method: 'POST', url: api.testing.start, params: params, emulateJSON:true })
    },
    commit(params = {}) {
        return Axios({ method: 'POST', url: api.testing.commit, params: params,emulateJSON:true })
    },
    toNext(params = {}) {
        return Axios({ method: 'POST', url: api.testing.toNext, params: params,emulateJSON:true })
    },
    shareSuccess(params = {}) {
        return Axios({ method: 'POST', url: api.testing.shareSuccess, params: params })
    },
    selectReport(params = {}) {
        return Axios({ method: 'POST', url: api.testing.selectReport, params: params,emulateJSON:true })
    },
    userTestInfo(params = {}) {
        return Axios({ method: 'POST', url: api.testing.userTestInfo, params: params })
    },
    xsbSelectResult(params = {}) {
        return Axios({ method: 'POST', url: api.testing.xsbSelectResult, params: params })
    },
    exitTest(params = {}) {
        return Axios({ method: 'POST', url: api.testing.exitTest, params: params,emulateJSON:true })
    },
    xsbStart(params = {}) {
        return Axios({ method: 'POST', url: api.testing.xsbStart, params: params,emulateJSON:true })
    },
    xsbCommit(params = {}) {
        return Axios({ method: 'POST', url: api.testing.xsbCommit, params: params,emulateJSON:true })
    },
    getNextQuestion(params = {}) {
        return Axios({ method: 'POST', url: api.testing.getNextQuestion, params: params,emulateJSON:true })
    },
    getLastQuestion(params = {}) {
        return Axios({ method: 'POST', url: api.testing.getLastQuestion, params: params,emulateJSON:true })
    },
    selectResult(params = {}) {
        return Axios({ method: 'GET', url: api.testing.selectResult, params: params })
    },
    selectCollect(params = {}) {
        return Axios({ method: 'POST', url: api.testing.selectCollect, params: params,emulateJSON:true })
    },
    deleteCollectQuestion(params = {}) {
        return Axios({ method: 'POST', url: api.testing.deleteCollectQuestion, params: params,emulateJSON:true })
    },
    getPayUserErrorQuestion(params = {}) {
        return Axios({ method: 'POST', url: api.testing.getPayUserErrorQuestion, params: params,emulateJSON:true })
    },
    getErrorQuestion(params = {}) {
        return Axios({ method: 'POST', url: api.testing.getErrorQuestion, params: params,emulateJSON:true })
    },
    collectQuestion(params = {}) {
        return Axios({ method: 'POST', url: api.testing.collectQuestion, params: params,emulateJSON:true })
    },
    checkWxIdByUserId(params = {}) {
        return Axios({ method: 'POST', url: api.testing.checkWxIdByUserId, params: params,emulateJSON:true })
    },
}
