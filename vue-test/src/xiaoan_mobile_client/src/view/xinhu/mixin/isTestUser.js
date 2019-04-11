export default {
  data() {
    return {}
  },
  created() {
    let userId = this.$cookie.getCookie('userId');
    if (!this.$cookie.isLogin()) {
      this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
    }
  },
  activated() {
    let userId = this.$cookie.getCookie('userId');
    if (!this.$cookie.isLogin()) {
      this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
    }
  },
  methods: {
    // 非测试用户跳转
    apiUserHome() {
      if (this.$cookie.getCookie('userId')) {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            let isTestUser = data.testUser;
            if (isTestUser == false) {
              // 非测试用户
              this.$router.replace({path: '/error', query: {text: '您目前不是内测用户，该功能只对内测用户有效!', show: '1'}})
            }
          }
        })
      }
    }
  }
}
