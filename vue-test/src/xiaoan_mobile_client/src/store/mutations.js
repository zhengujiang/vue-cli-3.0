/**
 * Created by Administrator on 2017/12/29.
 */
import * as types from './types'
import getters from './getters'

const state = {
  isLoading: false,
  direction: 'forward',
  isHomeShow: false,
  footerHeight: 0,
  collectDetailsWatch: 0,
  isTestUser: 0,  // 0为正式用户 1为测试 2是非测试
  isMessage: 0, // 是否有最新的消息
  isFootMsg: {"xh": false, "loading": true},
  scrollValue: {},
  isCompetition: null,
  competitionObject: {
    dialog: ''
  }
};

const mutations = {
  [types.UPDATE_LOADING](state, payload) {
    state.isLoading = payload.isLoading
  },
  [types.UPDATE_DIRECTION](state, payload) {
    state.direction = payload.direction
  },
  [types.UPDATE_HOMESHOW](state, payload) {
    state.isHomeShow = payload.isHomeShow
  },
  [types.UPDATE_FOOTER](state, payload) {
    state.footerHeight = payload.footerHeight
  },
  [types.UPDATE_COLLECTDETAILS](state, payload) {
    state.collectDetailsWatch = payload.collectDetailsWatch
  },
  [types.IS_TEST_USER](state, payload) {
    state.isTestUser = payload.isTestUser
  },
  [types.IS_MESSAGE](state, payload) {
    state.isMessage = payload.isMessage
  },
  [types.IS_FOOTER_MESSAGE](state, payload) {
    state.isFootMsg = payload.isFootMsg
  },
  [types.IS_SET_SCROLL](state, payload) {
    state.scrollValue = payload.scrollValue
  },
  [types.IS_COMPETITION](state, payload) {
    state.isCompetition = payload.isCompetition
  },
  [types.COMPETITION_OBJECT](state, payload) {
    state.competitionObject = payload.competitionObject
  }
};

export default {
  state,
  mutations,
  getters
}
