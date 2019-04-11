<template>
  <transition name="bounce">
    <div class="xiaoan-box loginPage">
      <div class="revise-password-scroll">
        <div class="logo">
          <img :src="$image.login.logo" alt="">
        </div>
        <router-view></router-view>
        <div v-show="!bind">
          <div class="collectGroomHe">
            <div class="testingEnd-content-middle-item">
              <span class="testingEnd-content-middle1"><div></div></span>
              <span class="testingEnd-content-middle-text">社交账号登录</span>
              <span class="testingEnd-content-middle2"><div></div></span>
            </div>
          </div>
          <div class="weChat">
            <img @click="wxAuthRedirect('loginWeixin')" :src="$image.login.weixin" alt="">
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import {Confirm} from 'vux'
  import login from './components/login.vue';
  import register from './components/register.vue';
  import bindPhone from './components/bindPhone.vue';
  import { setTimeout } from 'timers';
  export default {
    name: "loginPage",
    components: {
      Confirm,
      login,
      register,
      bindPhone
    },
    data() {
      return {
        bind: false
      }
    },
    created() {
      if (this.$route.query.bind) {
        this.bind = this.$route.query.bind;
      }
    },
    mounted () {
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/home'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    destroyed () {
    },
    methods: {
      wxAuthRedirect(state) {
        if (window.sessionStorage.getItem('refer_url') !== null) {
          window.localStorage.setItem('address_title', window.sessionStorage.getItem('refer_title'));
          window.localStorage.setItem('address_url', window.sessionStorage.getItem('refer_url'));
        }
        var redirect_uri = encodeURIComponent(this.$api.CURRENTIP.IP + '#/loginWeixin');
        var protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
        var wxUrl = protocol + '//open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$api.appId + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect'
        location.replace(wxUrl);
      }
    }
  }
</script>
<style scoped lang="scss">
  .loginPage {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    position: relative;
    // padding-bottom: 65px;
    .revise-password-scroll {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      padding: 15px;
      .logo {
        width: 100%;
        height: auto;
        text-align: center;
        img {
          // display: block;
          width: 67px;
          height: 97px;
          margin: 23px auto;
        }
      }
      .collectGroomHe {
        box-sizing: border-box;
        .testingEnd-content-middle-item {
          text-align: center;
          color: #ffb551;
          .testingEnd-content-middle1, .testingEnd-content-middle2 {
            width: 60px;
            height: 2px;
            display: inline-block;
            box-sizing: border-box;
            border-bottom: 1px solid #E3E3E3;
            position: relative;
            top: -5px;
          }
          .testingEnd-content-middle-text {
            padding: 0 3px;
            font-size: 13px;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
        }
      }
      .weChat {
        width: 100%;
        height: auto;
        text-align: center;
        img {
          width: 50px;
          height: 50px;
          margin: 25px auto 0;
        }
      }
    }
  }
</style>
