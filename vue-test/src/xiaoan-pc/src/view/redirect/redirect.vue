<template>
  <div id="redirect" class="content">
    <div class="redirectInfo">
      <p>
        <!--<i class="el-icon-success redirectIcon"></i>-->
        <i class="el-icon-loading redirectIcon"></i>
      </p>
      <div class="space"></div>
      <p>{{message}}</p>
      <p><span class="red">{{times}}S</span> 后系统自动跳转至{{pageName}}</p>
      <el-button class="redirectbtn"  type="primary" @click="redirect">立即跳转</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'redirect',
    data() {
      return {
        message: '退出成功！',
        redirectUrl: '/index',
        times: 3,
        pageName: '首页'
      }
    },
    // 生命周期函数
    created() {
      let redirectInfo = this.$store.state.redirect
      this.message = redirectInfo.msg
      this.redirectUrl = redirectInfo.url
      this.pageName = redirectInfo.name
      this.timeDown()
    },
    // 方法
    methods: {
      redirect () {
        if (this.redirectUrl.substring(0, 4) === 'http') {
          location.href = this.redirectUrl
        } else {
          this.$router.push(this.redirectUrl)
        }
      },
      timeDown () {
        setTimeout(() => {
          this.times--
          if (this.times > 0) {
            this.getCodeTxt = this.times + ' S '
            this.timeDown()
          } else {
            this.redirect()
          }
          console.log(this.times)
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  #redirect {
    height: 70% !important;
    min-height: 480px;
    border: 1px solid #e3e3e3;
    margin:30px auto !important;
    text-align: center;
    .redirectInfo {
      margin-top: 15%;
      p {
        line-height: 30px;
      }
      .redirectIcon {
        font-size: 40px;
        color: #67c23a;
      }
      .redirectbtn {
        margin-top: 20px;
      }
      .red {
        color: red;
      }
    }

  }
</style>
