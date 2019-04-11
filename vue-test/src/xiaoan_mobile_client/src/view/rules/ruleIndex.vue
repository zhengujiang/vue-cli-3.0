<template>
  <div class="law-index">
    <!--<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">-->
      <!--<keep-alive>-->
    <!--<transition name="bounce">-->
        <router-view></router-view>
    <!--</transition>-->
      <!--</keep-alive>-->
      <!--<router-view v-if="!$route.meta.isKeepAlive"></router-view>-->
    <!--</transition>-->
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "law-index",
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
  .law-index {
    width: 100%;
    height: 100%;
    background: #f0f1f5;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
