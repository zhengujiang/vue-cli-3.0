import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // this.$store.state.isLogin
  state: {
    isLogin: false,
    userData: {},
    redirect: {
      url: '/index',
      msg: '',
      name: '首页'
    },
    column: 'rule',
    inviteCode: '',
    searchText: '',
    searchCode: '',
    beforeUrl: '',
    beforeSort: '',
    calendarSort: '',
    editStatus: '',
    marketTabIndex: '1',
    cScreen: '', // 筛选日历
    currentEvent: '', // 查看当前日期的事件
    watchCurrent: '', // 回到今天
    inputEvent: '', // 查询事件
    watchEventDate: '', // 查看事件的日期
    currentMonths: [], // 当前月份集合
    selectDate: '', // 选中日期
    selectAccessColumn: '', // 选择权限速查的披露栏目
    institutionAccountInfo: {}, // 个人股东信息
    shareholderDates: [], // 股东 总期数
    isLoading: false,
    setDialogInfo: false,  // 弹框的状态
    menuList: [],
    scaleShowState: true, // 侧边栏是否全屏显示的状态
    asideNoteState: false, // 打开侧边栏笔记
    scrollValue: {}
  },
  // this.$store.commit('ISLOGIN', true)
  mutations: {
    scrollValue: (state, data) => {
      state.scrollValue = data
    },
    asideNoteState: (state, data) => {
      state.asideNoteState = data
    },
    scaleShowState: (state, data) => {
      state.scaleShowState = data
    },
    setDialogInfo: (state, data) => {
      state.setDialogInfo = data
    },
    isLoading: (state, data) => {
      state.isLoading = data
    },
    shareholderDates: (state, data) => {
      state.shareholderDates = data
    },
    institutionAccountInfo: (state, data) => {
      state.institutionAccountInfo = data
    },
    selectAccessColumn: (state, data) => {
      state.selectAccessColumn = data
    },
    watchEventDate: (state, data) => {
      state.watchEventDate = data
    },
    currentMonths: (state, data) => {
      state.currentMonths = data
    },
    inputEvent: (state, data) => {
      state.inputEvent = data
    },
    watchCurrent: (state, data) => {
      state.watchCurrent = data
    },
    cScreen: (state, data) => {
      state.cScreen = data
    },
    selectDate: (state, data) => {
      state.selectDate = data
    },
    currentEvent: (state, data) => {
      state.currentEvent = data
    },
    editStatus: (state, data) => {
      state.editStatus = data
    },
    calendarM: (state, data) => {
      state.calendarSort = data
    },
    switchMarketTab: (state, data) => {
      state.marketTabIndex = data
    },
    // data: true or false
    ISLOGIN: (state, data) => {
      state.isLogin = data
    },
    // data: data object
    USERDATA: (state, data) => {
      state.userData = data
    },
    REDIRECT: (state, data) => {
      state.redirect = data
    },
    // data: data String
    COLUMN: (state, data) => {
      state.column = data
    },
    // data: data String
    INPUTVAL: (state, data) => {
      state.searchText = data
    },
    // data: data String
    INPUTCODE: (state, data) => {
      state.searchCode = data
    },
    // login before
    loginBeforeUrl: (state, data) => {
      state.beforeUrl = data
    },
    INPUTINVITECODE: (state, data) => {
      state.inviteCode = data
    },
    MENULIST: (state, data) => {
      console.log(data);
      state.menuList = data;
    }
  },
  actions: {
    asideNoteState: (context, data) => {
      context.commit('asideNoteState', data)
    },
    scrollValue: (context, data) => {
      context.commit('scrollValue', data)
    },
    scaleShowState: (context, data) => {
      context.commit('scaleShowState', data)
    },
    setDialogInfo: (context, data) => {
      context.commit('setDialogInfo', data)
    },
    isLoading: (context, data) => {
      context.commit('isLoading', data)
    },
    shareholderDates: (context, data) => {
      context.commit('shareholderDates', data)
    },
    institutionAccountInfo: (context, data) => {
      context.commit('institutionAccountInfo', data)
    },
    inputEvent: (context, data) => {
      context.commit('inputEvent', data)
    },
    watchCurrent: (context, data) => {
      context.commit('watchCurrent', data)
    },
    cScreen: (context, data) => {
      context.commit('cScreen', data)
    },
    selectDate: (context, data) => {
      context.commit('selectDate', data)
    },
    currentEvent: (context, data) => {
      context.commit('currentEvent', data)
    },
    editStatus: (context, data) => {
      context.commit('editStatus', data)
    },
    calendarM(context, data) {
      context.commit('calendarM', data)
    },
    switchMarketTab(context, data) {
      context.commit('switchMarketTab', data)
    },
    ISLOGIN(context, data) {
      context.commit('ISLOGIN', data)
    },
    USERDATA(context, data) {
      context.commit('USERDATA', data)
    },
    COLUMN(context, data) {
      context.commit('COLUMN', data)
    },
    INPUTVAL(context, data) {
      context.commit('INPUTVAL', data)
    },
    INPUTCODE(context, data) {
      context.commit('INPUTCODE', data)
    },
    INPUTINVITECODE(context, data) {
      context.commit('INPUTINVITECODE', data)
    },
    loginBeforeUrl(context, data) {
      context.commit('loginBeforeUrl', data)
    },
    MENULIST(context, data) {
      console.log(data);
      context.commit('MENULIST', data)
    }
  },
  getter: {}
})
export default store
