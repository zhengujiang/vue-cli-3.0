<template>
  <div id="loginWeixin" class="xiaoan-box">
    <div class="loginWeixin-scroll">
      <div class="wxloading">
        <spinner :type="types[0]" :size="'40px'"></spinner>
      </div>
    </div>
  </div>
</template>

<script>
  import {Spinner} from 'vux'

  export default {
    data() {
      return {
        code: '',
        types: ['ios', 'ios-small'],
        userId: '',
        userHomeData: {}
      }
    },
    components: {
      Spinner
    },
    methods: {
      wxOauthByCode(code, state) {
        let params = {
          code: code
        }
        this.$axios.wxAuth.wxAuthByCode(params).then(res => {
          console.log('wxauth/wxAuthByCode', res);
          if (res.data.returnCode === 1) {
            let wxxinxi = window.JSON.stringify(res.data.returnObject);
            window.localStorage.setItem('wx-auth', wxxinxi);
            if (state == 'loginWeixin') {
              this.loginByWeixin();
            } else {
              this.bindingWxInfo(state)
            }
          } else {
            setTimeout(() => {
              this.$router.replace({path: '/rule'});
            }, 1000);
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '获取微信授权信息失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          setTimeout(() => {
            this.$router.replace({path: '/rule'});
          }, 1000)
        })
      },
      // 通过微信登录
      loginByWeixin() {
        // let params = {
        //   code: code,
        //   state: state
        // }
        if (window.localStorage.getItem('address_url') !== null) {
          window.sessionStorage.setItem('refer_title', window.localStorage.getItem('address_title'));
          window.sessionStorage.setItem('refer_url', window.localStorage.getItem('address_url'));
          window.localStorage.removeItem('address_title');
          window.localStorage.removeItem('address_url');
        }
        this.$axios.user.loginByWeixin({}).then(res => {
          if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            if (data.companyName == '' || data.companyName == null) {
              window.sessionStorage.setItem('registerInfo', JSON.stringify(data));
              this.$MTAmethod.mtaClick('dongminenglicep-2', {regpasswd: true})
              this.$router.push({path: '/manage/reviseInfo', query: {id: 1}});
            } else {
              if (window.sessionStorage.getItem('refer_title') == '账号管理') {
                window.sessionStorage.removeItem('refer_title');
                window.sessionStorage.removeItem('refer_url');
              }
              this.$cookie.setAuth(data);
              window.sessionStorage.setItem('register', 1);
              this.$router.replace({path: '/loadPass'});
            }
          } else if (res.data.returnCode == 511) {
            this.$router.replace({path: '/login/bindPhone', query: {bind: true}});
            window.sessionStorage.setItem('weixinBindPhone', 1);
          }
        }).catch((err) => {
          this.$vux.toast.show({text: '网络连接失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 绑定或解除微信信息
      bindingWxInfo(state) {
        let params = {
          userId: this.userId,
          binding: state
        }
        this.$axios.user.bindingWxInfo(params).then(res => {
          if (res.data.returnCode == 200) {
            this.apiUserHome();
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          } else {
            this.apiUserHome();
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
            setTimeout(()=> {
              this.$router.replace({path:'/manage'});
              // this.$router.push({path: '/login/bindPhone', query: {bind: true}});
            },2000)
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      apiUserHome() {
        this.$axios.userHome.userhome({}).then(res => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            this.$cookie.set('userInfo', window.JSON.stringify(data));
            window.localStorage.setItem('wx-my-home', window.JSON.stringify(data));
            this.$router.replace({path: '/manage'});
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
            setTimeout(()=> {
              this.$router.replace({path: '/home'})
            },2000)
          }
        })
      }
    },
    // 生命周期函数
    created() {
      let code = this.$const.getQueryString('code');
      let state = this.$const.getQueryString('state');
      if (code === null || state === null) {
        window.location.href = this.$api.CURRENTIP.IP + '#/home';
      }
      if (this.$cookie.getUserInfo()) {
        this.userHomeData = this.$cookie.getUserInfo();
        this.userId = this.userHomeData.id;
      }
      this.wxOauthByCode(code, state);
    },
    activated() {
    },
    mounted() {
    }
  }
</script>

<style scoped lang="scss">
  #loginWeixin {
    background-color: #FFFFFF;
    padding-bottom: 50px;
    .loginWeixin-scroll {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background-color: #FFFFFF;
      .wxloading {
        position: absolute;
        width: 28px;
        height: 28px;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
</style>
