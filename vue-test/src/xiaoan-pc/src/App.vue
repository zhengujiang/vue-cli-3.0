<template>
  <div id="app" v-loading.fullscreen.body.lock="fullscreenLoading">
    <router-view/>
    <transition name="el-zoom-in-top">
      <scroll-up v-if="returnTop"></scroll-up>
    </transition>
  </div>
</template>

<script>
  import TransferDom from './directive/transfer-dom'
  import ScrollUp from './components/scrollerUp/scrollerUp'
  export default {
    name: 'app',
    components: {
      ScrollUp
    },
    data() {
      return {
        fullscreenLoading: false,
        returnTop: false
      }
    },
    computed: {
      isLoading: function (e) {
        return this.$store.state.isLoading
      }
    },
    watch: {
      isLoading: function (val) {
        // this.fullscreenLoading = val;
        // console.log('=================>loading', val);
      }
    },
    directives: {
      TransferDom
    },
    created() {
    },
    methods: {
      scrollCheck() {

      }
    },
    mounted() {
      window.addEventListener('scroll', (e) => {
        setTimeout(_ => {
          let isScrollTop = document.documentElement.scrollTop;
          let isScrollLeft = document.documentElement.scrollLeft;
          if (isScrollTop > 60) {
            document.getElementById('header').classList.add('floating');
          } else {
            document.getElementById('header').classList.remove('floating');
          }
          if (isScrollTop > 300) {
            this.returnTop = true;
          } else if (isScrollTop <= 300) {
            this.returnTop = false;
          }
          if (document.querySelector('#header .header-menu.menu-fixed')) {
            document.querySelector('#header .header-menu.menu-fixed').style.left = `-${isScrollLeft}px`
          } else {
            document.querySelector('#header .header-menu').style.left = 0
          }
        })
      })
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 27) {
          // 按 Esc
          // 要做的事情
          document.body.classList.remove('overflowAuto')
        }
        if (e && e.keyCode == 113) {
          // 按 F2
          // 要做的事情
        }
        if (e && e.keyCode == 13) {
          // enter 键
          // 要做的事情
        }
        if (e && e.keyCode == 32) {
          // 空格 键
          // console.log(e);
          // 要做的事情
        }
      }
    }
  }
</script>

<style lang="scss">
  .el-dialog__wrapper {
    // top: 100px !important;
  }
  .vxa-global-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 10000000;
    .el-progress-bar__outer {
      background-color: transparent;
    }
  }
  // body {
  //   overflow-y: scroll;
  //   // transition: all .3s;
  //   min-width: 1200px;
  //   -webkit-overflow-scrolling: touch;
  // }
  .el-popup-parent--hidden, .el-loading-parent--hidden {
    #header {
      .menu-fixed {
        padding-right: 10px;
      }
      .head-pull-down .zoom, .vxa-app-header .head-pull-down .zoom {
        margin-right: 10px;
      }
    }
    .vxa-aside-popup {
      &:not(.vux-popup-show) {
        .vxa-aside-right {
          left: -60px !important;
          transition: all 0s !important;
        }
      }
      /*.vxa-popup-body.animate-right-active {*/
      /*width: 470px !important;*/
      /*transition: all 0s !important;*/
      /*}*/
    }
    .scroll-component-up {
      right: 70px !important;
    }
  }
  .el-loading-parent--relative.el-loading-parent--hidden {
    #header {
      .header-menu.menu-fixed {
        padding-right: 10px;
      }
    }
    #home {
      padding-right: 10px;
    }
  }
  .html-body-overflow {
    /*transition: .3s all;*/
    padding-right: 10px !important;
    overflow: hidden !important;
    #vxa-header {
      // padding-right: 10px;
    }
    #header {
      // padding-right: 10px;
      .header-bar, .header-menu {
        padding-right: 10px;
      }
    }
  }
  #app {
    // min-width: 1230px;
    .content {
      width: 1230px;
      padding: 0 15px;
      height: auto;
      margin: 0 auto;
      position: relative;
    }
  }
</style>
