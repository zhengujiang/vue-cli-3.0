/**
 * Created by Administrator on 2017/12/29.
 */
import Vue from 'vue';
import VueX from 'vuex';
import actions from './actions'
import mutations from './mutations'

Vue.use(VueX);

export default new VueX.Store({
  modules: {
    mutations
  },
  actions
});
