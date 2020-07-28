<template>
  <div class="scroll-component-up" @click="scrollToTop"><i class="iconfont web-dingbu"></i></div>
</template>

<script>
  import {scrollToTop} from '../../libs/utils'
  export default {
    name: "scrollerUp",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    methods: {
      scrollToTop() {
        scrollToTop();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll-component-up {
    background: rgba(51, 52, 55, 1);
    position: fixed;
    right: 0;
    bottom: 0;
    width: 50px;
    height: 45px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    z-index: 2000;
    i {
      color: #fff;
      display: block;
      line-height: 45px;
      text-align: center;
      font-size: 20px;
    }
  }
</style>
