<template>
  <div id="changeEmail" class="content">
    <div class="title"><span class="txt fc">更换邮箱</span></div>
    <div class="changeinfo">
      <div class="info">你邮箱是：{{oldemail}}</div>
      <div class="space"></div>
      <v-input :id="'cgemail'" :text="'邮箱'" :regx="'email'" :errmsg="'邮箱格式错误'" v-model="email" ></v-input>
      <div class="space"></div>

      <el-button class="changebtn" type="primary" @click="updateemail">保 存</el-button>
    </div>

  </div>
</template>

<script>
  import input from '@/components/input'
  export default {
    data() {
      return {
        oldemail: '',
        email: '',
        smsCodeTip: ''
      }
    },
    // 使用其它组件
    components: {
      'v-input': input
    },
    // 方法
    computed: {},
    watch: {},
    methods: {
      getUserInfo () {
        this.$db.dataUser.getUserInfo(this)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.oldemail = res.data.returnObject.email
            }
          })
      },
      updateemail () {
        let email_regx = !this.$regx.mail(this.email)
        if (email_regx) {
          document.querySelector('#cgemail').focus()
          return false
        }
        this.$db.dataUser.updateemail(this, this.email)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '邮箱修改成功'})
              this.$router.push('/manage/account')
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
              // this.bindSCodeTip = res.data.returnMsg
            }
          })
      }
    },
    beforeCreate() {
      if (!this.$cookie.islogin()) {
        this.$router.push('/login?redirect_url=' + location.href)
        this.$message({showClose: true, type: 'error', duration: 3000, message: '请先登录'})
      }
    },
    // 生命周期函数
    created() {
      this.getUserInfo()
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  #changeEmail {
    height: 560px !important;
    border: 1px solid #e3e3e3;
    padding: 0 30px;
    margin:30px auto !important;
    .changebtn {
      width:220px;
      height: 40px;
      margin: 50px 80px;
    }
    .title {
      height: 60px;
      line-height: 60px;
      border-bottom: 2px solid #e3e3e3;
      .txt {
        display: block;
        font-weight: 600;
        height: 59px;
        width:70px;
        text-align: center;
        border-bottom: 2px solid #ffb148;
      }
    }
    .info {
      margin-top: 60px;
    }
    .changeinfo {
      margin-left:380px;
      width:390px;
      .sendMCode {
        color: #ffb148;
        display: block;
        float: right;
        position: relative;
        margin-top: -30px;
        cursor: pointer;
      }
    }
  }
</style>
