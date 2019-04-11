<template>
  <div class="report-index">
    <!--<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">-->
      <!--<keep-alive>-->
        <router-view></router-view>
      <!--</keep-alive>-->
      <!--<router-view v-if="!$route.meta.isKeepAlive"></router-view>-->
    <!--</transition>-->
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "report-index",
    data() {
      return {}
    },
    methods: {},
    computed: {
      ...mapState({
        direction: state => state.mutations.direction
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/transition.css";
  .report-index {
    width: 100%;
    height: 100%;
    background: #f0f1f5;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
