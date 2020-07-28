<template>
  <div id="wxTransfer"></div>
</template>
<script>
export default {
  data () {
    return {
      
    };
  },

  components: {},
  created() {},
  mounted() {
    this.loginbyqrcode();
  },
  methods: {
    loginbyqrcode() {
      let code = this.$route.query.code;
      let state = this.$route.query.state;
      let binding = this.$route.query.bindWx;
      if (code) {
        this.$http({
          method: 'POST',
          url: this.$api.user.qrBindWeixinByUser,
          message: 'none',
          params: {
            userId: this.$cookie.get('userId'),
            binding: binding,
            code: code,
            state: state
          }
        }).then((res) => {
          sessionStorage.setItem('wxTransfer', JSON.stringify(res.data));
          this.$router.push({path: '/manage/account'})
          // if (res.data.returnCode === 200) {
          //   // 扫码登录成功
          //   this.info = true;
          //   this.wxInfo = res.data.returnMsg;
          //   this.getUserInfo()
          // } else if (res.data.returnCode === 512) {
          //   this.info = true;
          //   this.wxInfo = '该用户code获取不到access或者openid，请重试！'
          // } else if (res.data.returnCode === 524) {
          //   // 需要绑定的微信已绑定其他账号
          //   this.info = true;
          //   this.wxInfo = "该微信已绑定其他账号，故无法绑定";
          // } else if (res.data.returnCode === 526) {
          //   // 解绑的不是该微信
          //   this.info = true;
          //   this.wxInfo = "您当前扫码的微信账号并非原来绑定的微信账号，故无法解绑";
          // }
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
#wxTransfer {
  min-height: 800px;
}
</style>