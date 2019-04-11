<template>
  <div id="comp-enroll">
    <div class="one"></div>
    <div class="two">
      <div class="backimg"></div>
    </div>
    <div class="three">
      <button class="btn" @click="enrollNative"></button>
    </div>
    <div class="four">
      <div class="check not">
        <button class="col" @click="checkChange"><label class="label" v-if="check"></label></button>
        <button class="col get" @click="$router.push({path:'/competition/clause'})"></button>
      </div>
    </div>
    <div class="five">
      <span class="check"></span>
    </div>
    <div class="vux-dom down" v-transfer-dom><img :src="$image.competition.enroll_downtip" alt=""></div>
    <!--<x-button @click.native="$store.commit('UPDATE_HOMESHOW', {isHomeShow: true})">打开隐藏</x-button>-->
  </div>
</template>

<script>
  import {TransferDom} from 'vux'
  export default {
    name: "comp-enroll",
    components: {},
    directives: {
      TransferDom
    },
    data() {
      return {
        check: false
      }
    },
    created() {
      if (this.$cookie.isLogin()) {
        this.checkUserApply();
      }
      if (this.$route.query.check) {
        this.check = this.$route.query.check == 2 ? true : false;
      } else {
        this.check = false;
        this.$router.replace({query: Object.assign({}, this.$route.query, {check: 1})});
      }
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    methods: {
      checkChange() {
        this.check = !this.check;
      },
      enrollNative() {
        if (this.$cookie.isLogin()) {
          if (this.check) {
            this.checkUserCaseUpload();
          } else {
            this.$vux.toast.show({text: '请先勾选活动条款', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        } else {
          this.$storage.loginStatus(this, '知识竞赛', window.location.href);
        }
      },
      checkUserApply() {
        let params = {
          // userId: 'd9f91fdd9eba49bdbd874f5c7fdae190'
        }
        this.$axios.competition.checkUserApply(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log(res);
            let data = res.data.returnObject;
            if (data) {
              console.log(this.$route);
              if (this.$route.name == 'competition-enroll') {
                this.$router.replace({path: '/competition/home'});
              }
            }
          }
        }).catch(err => {

        })
      },
      // GET /competition/checkUserCaseUpload
      checkUserCaseUpload() {
        let params = {
          // userId: 'd9f91fdd9eba49bdbd874f5c7fdae190'
        }
        this.$axios.competition.checkUserCaseUpload(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log(res);
            let data = res.data.returnObject;
            if (data) {
              this.updateUserIsJoin();
              // console.log(this.$route);
            } else {
              this.$router.push({path: '/competition/upload'});
            }
          } else {
            this.$router.push({path: '/competition/upload'});
          }
        }).catch(err => {

        })
      },
      // GET /competition/updateUserIsJoin
      updateUserIsJoin() {
        let competitionUser = {id: '', type: 0};
        if (window.sessionStorage.getItem('competition_user')) {
          competitionUser = JSON.parse(window.sessionStorage.getItem('competition_user'));
        }
        let params = {
          inviteId: competitionUser.id
        }
        this.$axios.competition.updateUserIsJoin(params).then(res => {
          if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            this.$vux.toast.show({text: '报名成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$router.replace({path: '/competition/home'});
            window.sessionStorage.removeItem('competition_user');
          }
        }).catch(err => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #comp-enroll {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .two {
      position: relative;
      width: 100%;
      height: 291px;
      padding: 0 22px;
      .backimg {
        width: 100%;
        height: 100%;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/enroll_JL1X.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
    }
    .three {
      width: 100%;
      text-align: center;
      padding-top: 16px;
      font-size: 0;
      .btn {
        margin: 0;
        border: 0;
        width: 231px;
        height: 66px;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/enroll_btn.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
    }
    .four {
      width: 100%;
      text-align: center;
      padding-top: 10px;
      .check {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 130px;
        height: 15px;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/enroll_agree.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
        .col {
          border: 0;
          background: transparent;
          flex: 1;
          height: 15px;
          text-align: left;
          &.get {
            text-align: right;
            flex: 0 0 60px;
          }
          .label {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 15px;
            background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/enroll_confirm.png) no-repeat;
            background-size: contain;
            background-origin: padding-box;
          }
        }
      }
    }
    .five {
      width: 100%;
      text-align: center;
      padding: 42px 22px 20px 22px;
      .check {
        display: inline-block;
        width: 320px;
        height: 400px;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/enroll_rule.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
    }
  }
</style>
<style lang="scss">
  .vux-dom.down {
    position: fixed;
    margin: 0px auto;
    right: 0px;
    left: 0px;
    bottom: 0;
    width: 75px;
    height: 38px;
    // margin-right: 75px;
    img {
      width: 75px;
      height: 38px;
    }
  }
  .vux-dom.down {
    animation: twinkling 4s;
    animation-fill-mode: forwards;
  }
  @keyframes twinkling {
    0% {opacity: 1;}
    15% {opacity: 0;}
    30% {opacity: 1;}
    45% {opacity: 0;}
    60% {opacity: 1;}
    75% {opacity: 0;}
    90% {opacity: 1;}
    100% {opacity: 0;}
  }
</style>

