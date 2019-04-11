<template>
  <div id="competition" class="competition-back">
    <router-view></router-view>
  </div>
</template>

<script>
  import {XButton} from 'vux'
  export default {
    name: "competition",
    components: {
      XButton
    },
    data() {
      return {
        userInfo: {
          level: ""
        },
        competitionUser: {}
      }
    },
    computed: {},
    created() {
      this.userInfo = this.$cookie.getUserInfo();
      if (this.$cookie.isLogin()) {
        // 登陆
        this.apiUserHome();
        this.checkUserApply();
      } else {
        // 未登录
        if (this.$route.meta.isLogin) {
          this.$storage.loginStatus(this, '知识竞赛', window.location.href);
        } else {
          console.warn('不需要登陆');
        }
      }
      // if (time < 1542816000000) {
      //   this.$router.replace({path: '/competition/preheat'});
      // }
    },
    mounted() {
      // this.POPState = function () {
      //   alert("popstate我监听到了浏览器的返回按钮事件啦"); // 根据自己的需求实现自己的功能
      // };
      // window.addEventListener("popstate", this.POPState, false);
    },
    methods: {
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
      //
      checkUserApply() {
        let params = {}
        this.$axios.competition.checkUserApply(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log('43223542345435345435', res);
            let data = res.data.returnObject;
            this.$store.commit('IS_COMPETITION', {isCompetition: data});
          } else {
            let data = res.data.returnObject;
            if (!data) {
              if (window.sessionStorage.getItem('competition_user')) {
                this.competitionUser = window.JSON.parse(window.sessionStorage.getItem('competition_user'));
                if (this.competitionUser.type == "0" || this.competitionUser.type == "1") {
                  this.$router.replace({path: '/competition/enroll'});
                }
              } else {
                this.$router.replace({path: '/competition/enroll'});
              }
            }
          }
        }).catch(err => {

        })
      },
    },
    destroyed() {
      // setTimeout(_ => {
      //   window.removeEventListener('popstate', this.POPState, false)
      // }, 3000)
    }
  }
</script>

<style lang="scss">
  #competition {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    &.competition-back {
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/competition-back.png) no-repeat;
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
      // filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="/static/img/competition/competition-back.png", sizingMethod="scale");
    }
    .one {
      width: 100%;
      height: 108px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/enroll_title.png) no-repeat;
      background-size: contain;
    }
  }
  //
  .vxa-table {
    tbody {
      tr {
        td {
          .cell {
            display: flex;
            align-items: center;
            &.justify {
              justify-content: center;
            }
            .user_head {
              height: 33px;
              width: 33px;
              font-size: 0;
            }
          }
        }
        &.setColor {
          * {
            color: #FFCC00;
          }
        }
      }
    }
  }
  //
  #shareDialog {
    .weui-dialog {
      position: absolute;
      background-color: transparent;
      z-index: 6000;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
    }
    .weui-mask {background-color: rgba(0, 0, 0, 0.8)}
    .share-box {
      height: 100%;
      width: 100%;
      text-align: right;
      img {
        display: inline-block;
        width: 192.5px;
        margin: 10px 17.5px 0 0;
      }
    }
  }
</style>
