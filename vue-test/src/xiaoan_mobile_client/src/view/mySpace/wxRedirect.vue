<template>
  <div id="redirect" class="xiaoan-box">
    <div class="redirect-scroll">
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
        types: ['ios', 'ios-small']
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
            this.linkPage(state, res.data.returnObject.openId);
            let wxxinxi = window.JSON.stringify(res.data.returnObject);
            window.localStorage.setItem('wx-auth', wxxinxi);
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
      // 授权登陆state ['TESTING-userid','COURSE-courseId','INVOICE','SUBSCRIBE','STATE']
      linkPage(state, openId) {
        if (state.indexOf('TESTING') > -1) {
          let fromUserId = state.split('-')[1];
          window.location.replace(this.$api.CURRENTIP.IP + '#/testing?fromUserId=' + fromUserId);
        } else if (state === 'INVOICE') {
          window.location.replace(this.$api.CURRENTIP.IP + '#/applicationList?&weixinId=' + openId)
        } else if (state.indexOf('COURSE') > -1) {
          let courseId = state.split('-')[1];
          window.location.replace(this.$api.CURRENTIP.IP + '#/homework?courseId=' + courseId)
        } else if (state === 'SUBSCRIBE') {
          window.location.replace(this.$api.CURRENTIP.IP + '#/number')
        } else {
          window.location.replace(this.$api.CURRENTIP.IP + '#/home');
        }
      },
      getTitle(state) {
        if (state.indexOf('TESTING') > -1) {
          window.document.title = '我的测评';
        } else if (state === 'INVOICE') {
          window.document.title = '发票管理';
        } else if (state.indexOf('COURSE') > -1) {
          window.document.title = '小鹅通作业';
        } else if (state === 'SUBSCRIBE') {
          window.document.title = '完善个人信息';
        } else {
          window.document.title = '个人中心';
        }
      }
    },
    // 生命周期函数
    created() {
      let code = this.$const.getQueryString('code');
      let state = this.$const.getQueryString('state');
      if (code === null || state === null) {
        window.location.href = this.$api.CURRENTIP.IP + '#/home';
      }
      this.getTitle(state);
      console.log('code:' + code + ' state:' + state);
      this.wxOauthByCode(code, state);
    },
    activated() {

    },
    mounted() {
    }
  }
</script>

<style scoped lang="scss">
  #redirect {
    background-color: #FFFFFF;
    padding-bottom: 50px;
    .redirect-scroll {
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
