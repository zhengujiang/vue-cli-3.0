<template>
  <div id="goLogin">
    {{ second }}秒后跳转登录页面，
    <router-link to="login">立即跳转</router-link>
  </div>
</template>
<script>
  export default {
    name: 'goLogin',
    data() {
      return {
        second: 5
      }
    },
    mounted() {
      console.log(this.second, this.$store.state.beforeUrl)
      var set = setInterval(() => {
        this.second = this.second - 1
        if (this.second <= 1) {
          window.clearInterval(set)
          this.$router.push('/login')
        }
      }, 1000)

    }
  }
</script>
<style lang="scss" scoped>
  #goLogin {
    width: 100%;
    height: 100%;
    background: #fff;
    color: #ffb148;
    font-size: 50px;
    line-height: 400px;
    text-align: center;
  }
</style>
