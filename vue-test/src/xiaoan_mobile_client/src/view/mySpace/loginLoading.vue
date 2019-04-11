<template>
  <div class="login-loading">
    <div class="success">
      <img :src="$image.personal.register" alt="">
    </div>
    <div class="text">
      <p class="text1">{{test}}</p>
      <p class="time"><span class="two">{{ timer }}</span><span>秒</span>后将跳至{{gototi}}！</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login-loading",
    data() {
      return {
        test: '',
        timer: 2,
        gototi: '个人中心',
      }
    },
    //离开当前页面后
    destroyed() {
      window.clearInterval(this.interval);
      window.sessionStorage.removeItem('refer_title');
      window.sessionStorage.removeItem('refer_url');
      window.sessionStorage.removeItem('loginPage');
    },
    beforeDestroy() {
    },
    created() {
      if (window.sessionStorage.getItem("register") == 0) {
        this.test = '注册成功！';
      } else if (window.sessionStorage.getItem("register") == 1) {
        this.test = '登录成功！';
      } else if (window.sessionStorage.getItem("register") == 2) {
        this.test = '修改成功！';
      } else if (window.sessionStorage.getItem("register") == 3) {
        this.test = '绑定成功！';
      }
      //
      let that = this;
      if (window.sessionStorage.getItem('refer_title') !== null) {
        that.gototi = window.sessionStorage.getItem('refer_title');
      } else if (window.sessionStorage.getItem('manage') !== null) {
        that.gototi = '个人中心';
      } else if (window.sessionStorage.getItem('collect') !== null) {
        that.gototi = '我的收藏';
      } else if (window.sessionStorage.getItem('collectDetails') !== null) {
        that.gototi = '我的收藏夹';
      } else if (window.sessionStorage.getItem('track') !== null) {
        that.gototi = '我的足迹';
      } else if (window.sessionStorage.getItem('lookupTables') !== null) {
        that.gototi = '我的权限速查表';
      } else if (window.sessionStorage.getItem('customerTables') !== null) {
        that.gototi = '我的权限速查表';
      } else if (window.sessionStorage.getItem('focus') !== null) {
        that.gototi = '我的关注';
      } else if (window.sessionStorage.getItem('answersDetails') !== null) {
        that.gototi = '问答详情';
      } else if (window.sessionStorage.getItem('testing') !== null) {
        that.gototi = '董秘测评';
      } else if (window.sessionStorage.getItem('afficheContentId') !== null) {
        that.gototi = '公告详情';
      } else if (window.sessionStorage.getItem('collectGroom') !== null) {
        that.gototi = '推荐收藏';
      } else if (window.sessionStorage.getItem('luyanzhong') !== null) {
        that.gototi = '路演中';
      } else if (window.sessionStorage.getItem('loginPage') !== null) {
        that.gototi = '登录页面';
      } else {
        that.gototi = '个人中心';
      }
    },
    watch: {},
    mounted() {
      let that = this;
      this.interval = window.setInterval(() => {
        that.timer--;
        if (that.timer <= 0) {
          window.clearInterval(this.interval);
          if (window.sessionStorage.getItem('refer_url') !== null) {
            window.location.replace(window.sessionStorage.getItem('refer_url'));
          } else if (window.sessionStorage.getItem('collect') !== null) {
            that.gototi = '我的收藏';
            that.$router.replace({path: "/collect"});
          } else if (window.sessionStorage.getItem('collectDetails') !== null) {
            that.gototi = '我的收藏夹';
            window.location.href = window.sessionStorage.getItem('collectDetails');
          } else if (window.sessionStorage.getItem('track') !== null) {
            that.gototi = '我的足迹';
            that.$router.replace({path: '/track'});
          } else if (window.sessionStorage.getItem('lookupTables') !== null) {
            that.gototi = '我的权限速查表';
            that.$router.replace({path: '/lookupTables'});
          } else if (window.sessionStorage.getItem('customerTables') !== null) {
            that.gototi = '我的权限速查表';
            that.$router.replace({path: '/lookupTables'});
          } else if (window.sessionStorage.getItem('focus') !== null) {
            that.gototi = '我的关注';
            that.$router.replace({path: '/focus'});
          } else if (window.sessionStorage.getItem('answersDetails') !== null) {
            that.gototi = '问答详情';
            let pa = window.sessionStorage.getItem('answersDetails').split("@#");
            that.$router.replace({path: '/answersDetails?question=' + pa[0] + "&scopeId=" + pa[1]});
          } else if (window.sessionStorage.getItem('testing') !== null) {
            that.gototi = '董秘测评';
            that.$router.replace({path: '/testing'});
          } else if (window.sessionStorage.getItem('afficheContentId') !== null) {
            that.gototi = '公告详情';
            let id = window.sessionStorage.getItem("afficheContentId");
            window.sessionStorage.setItem("afficheContentId", id);
            that.$router.replace({path: "/afficheContent"});
          } else if (window.sessionStorage.getItem('collectGroom') !== null) {
            that.gototi = '推荐收藏';
            let titex = window.sessionStorage.getItem("collectGroom").split("$#");
            that.$router.replace({path: "/collectGroom", query: {id: titex[0], title: titex[1]}});
          } else if (window.sessionStorage.getItem('loginPage') !== null) {
            that.gototi = '登录页面';
            that.$router.replace({path: '/login'});
          } else {
            that.gototi = '个人中心';
            that.$router.replace({path: "/my"});
          }
        }
      }, 800);
    }
  }
</script>

<style scoped lang="scss">
  .login-loading {
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: 150px;
    box-sizing: border-box;
    .success {
      width: 63px;
      height: 63px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .text {
      width: 100%;
      height: auto;
      margin-top: 40px;
      .text1, .time {
        width: 100%;
        height: auto;
        text-align: center;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 15px;
        color: #323232;
        margin: 12px 0;
        .text1 {
          font-family: PingFangSC-Medium, sans-serif, "Microsoft Yahei", "Helvetica";
          font-style: normal;
        }
      }
      .time span {
        color: #ffb148;
      }
    }
  }
</style>
