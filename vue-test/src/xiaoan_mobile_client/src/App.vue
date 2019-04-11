<template>
  <div id="app">
    <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <loading v-model="isLoading" :text="'加载中'"></loading>
    <v-enterpriseApplyAds></v-enterpriseApplyAds>
    <transition name="fade">
      <xiaoan-footer v-transfer-dom ref="footerDom" v-show="$route.meta.footer"></xiaoan-footer>
    </transition>
  </div>

</template>

<script>
  import XiaoanFooter from '@/components/footer/XaFooter'
  import './assets/js/common.js'
  import {Drawer, Loading, TransferDom, XHeader} from 'vux'
  import {mapState} from 'vuex'
  import XaHome from '@/components/home/home'
  import enterpriseApplyAds from '@/components/enterprise/enterpriseApplyAds'
  export default {
    name: "app",
    directives: {
      TransferDom
    },
    components: {
      XiaoanFooter,
      Drawer,
      XHeader,
      Loading,
      XaHome,
      'v-enterpriseApplyAds': enterpriseApplyAds
    },
    computed: {
      ...mapState({
        direction: state => state.mutations.direction,
        isLoading: state => state.mutations.isLoading,
        drawerVisibility: state => state.mutations.isHomeShow,
        isMessage: state => state.mutations.isMessage
      })
    },
    data() {
      return {
        appheight: '',
        wrapperHeight: '',
        showMenus: false,
        showMore: false,
        showMenu: false,
        drawer: false,
        showModeValue: 'push',
        showPlacementValue: 'left'
      }
    },
    watch: {
      $route: function (to, form, next) {
        if (to.name !== form.name) {
          this.drawer = false;
          // 如果路由发生了变化 隐藏
          this.$vux.confirm.hide();
        }
        // 处理 错误的路由跳回（主页）law
        setTimeout(() => {
          this.$nextTick(() => {
            this.redirectRoute();
          })
        }, 1000);
      },
      drawerVisibility: function (val) {
        this.drawer = val;
      },
      drawer: function (type) {
        this.$store.commit('UPDATE_HOMESHOW', {isHomeShow: type});
      }
    },
    destroyed() {
      window.localStorage.removeItem("reload");
    },
    created() {
      this.directionCount()
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.searchUserData();
        this.apiUserHome();
      }
    },
    mounted() {
      document.body.addEventListener('touchstart', function () {
      }, false);
      this.$nextTick(() => {
        if (this.$const.userAgent().weixin) {
          // $('body').addClass('index_body');
          // 添加禁止滚动的样式 // 去掉手机滑动默认行为
        } else {
          // $('body').removeClass('index_body');
          // 去除禁止滚动的样式
        }
        if (this.$const.userAgent().android) {
          $(document).ready(function () {
            $("body").height($("body")[0].clientHeight);
            $("#app").height($("body")[0].clientHeight);
          });
        }
        //
        $('input').bind('blur', (e) => {
          // console.log(e);
          this.$const.inputBlur();
        })
      })
      this.$weixin.wxconfig(this);
    },
    methods: {
      directionCount() {
        let list = ['/rule', '/affiche', '/xhlist', '/report', '/home'];
        for (let i = 1; i < 6; i++) {
          sessionStorage.setItem(list[i - 1], i);
        }
      },
      searchUserData() {
        let params = {
          selectUserId: 0
        };
        this.$axios.user.searchUserData(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let userData = res.data.returnObject;
            let badgeD = true;
            if (userData.readMsgCount == 0 || userData.readMsgCount == null) {
              badgeD = 0
            } else {
              badgeD = userData.readMsgCount;
            }
            this.$store.commit('IS_MESSAGE', {isMessage: badgeD});
          }
        }).catch(err => {

        })
      },
      apiUserHome() {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then(res => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            this.$cookie.set('userInfo', window.JSON.stringify(data));
            window.localStorage.setItem('wx-my-home', window.JSON.stringify(data));
          }
        })
      },
      actionClick(key, item) {
        if (item) {
          window.location.reload();
        }
      },
      redirectRoute() {
        // 防止空路由 不跳转
        if (this.$route.name == null) {
          document.title = '跳转中';
          this.$router.replace({path: '/rule'});
        }
      }
    }
  }
</script>
<style lang="less">
  @import '~vux/src/styles/1px.less';
  @import "./styles/theme.less";
</style>

<style lang="scss">
  @import './styles/reset.css';
  @import './styles/animate.css';
  @import './styles/csshake.css';
  @import './styles/transition.css';
  @import './styles/vxa-theme';
  //
  @import './styles/vux-theme';
  @import './styles/mint-theme';
  @import './styles/device';
  .vux-header.v-transfer-dom {
    width: 100%;
    z-index: 1000;
    position: fixed !important;
    top: 0;
    left: 0;
  }
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    &.vux-drawer {
      .vux-drawer-body {
        .xa-drawer-container {
          height: 100%;
          width: 100%;
          .weui-tab__panel {
            padding-bottom: 0 !important;
            overflow: hidden;
          }
          .xa-box {
            box-sizing: border-box;
            height: 100%;
            background-color: #fff;
            width: 100%;
          }
          .weui-tab {
            .weui-tab__panel {
              height: 100%;
              box-sizing: border-box;
              padding-bottom: 0 !important;
            }
          }
        }
      }
    }
  }
  .index_body {
    overflow-y: hidden; /*为了兼容普通PC的浏览器*/
    height: 100%;
    position: fixed;
  }
  //
  #shareXh {
    .weui-dialog {
      position: absolute;
      background-color: transparent;
      z-index: 6000;
    }
    .weui-mask {background-color: rgba(0, 0, 0, 0.8)}
    .share-box {
      img {
        display: inherit;
        width: 100%;
        padding-left: 9%;
        padding-bottom: 92%;
      }
    }
  }
  .simpleModal {
    .weui-dialog {
      position: absolute;
      height: auto;
      width: 75%;
      max-width: 100%;
      max-height: 100%;
      background-color: transparent;
    }
    .img-box {
      height: 100%;
      width: 100%;
      /*.box-content {*/
      /*position: relative;*/
      #canvas_box {
        display: inherit;
        width: 100%;
      }
      #imgShow, .imgShow, img {
        -webkit-touch-callout: default;
        max-width: 100%;
        display: inherit;
        border-radius: 2px;
        user-select: default;
      }
      .fan {
        position: absolute;
        top: 0;
        right: 0;
        i {
          position: absolute;
          top: 5px;
          right: 5px;
          color: white;
          transform: rotate(45deg);
        }
      }
      .fan:before {
        content: '';
        position: absolute;
        top: -36px;
        right: -35px;
        width: 0;
        height: 0;
        border-radius: 35px;
        border-width: 35px;
        border-style: solid;
        border-color: transparent transparent transparent rgba(0, 0, 0, 0.4);
        transform: rotate(-45deg);
        line-height: 99em;
        overflow: hidden;
        cursor: pointer;
      }
      /*}*/
      .box-btns {
        margin-top: 5px;
        display: flex;
        .btn-label {
          flex: 1;
          button {
            border: 0;
            width: 98%;
            height: 40px;
            border-radius: 4px;
            color: #8d8d8d;
            background-color: white;
            &:active {
              background-color: #F5A44B;
              color: #323232;
            }
          }
        }
        .btn-label.left {
          text-align: left;
          button {
            background-color: #fff;
            color: #ffb148;
            font-size: 15px;
          }
        }
        .btn-label.right {
          text-align: right;
          button {
            background-color: #ffb148;
            color: #fff;
            font-size: 15px;
          }
        }
      }
      .kaitong-btn {
        position: absolute;
        bottom: 47px;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 30px;
        background-color: #ffb148;
        color: #fff;
        opacity: 0;
      }
    }
  }
</style>
