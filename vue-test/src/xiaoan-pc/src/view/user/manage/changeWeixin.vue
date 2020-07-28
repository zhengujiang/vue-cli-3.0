<template>
  <div id="changemobile" class="content">
    <div class="title"><span class="txt fc">重新绑定微信</span></div>
    <div class="changeinfo">
      <div class="info">你的手机号码是：{{mobile}}</div>
      <div class="space"></div>
      <v-input :id="'cgmscode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'" :tip="smsCodeTip"
               v-model="smsCode"></v-input>
      <span class="sendMCode" @click="sendsmscode">{{getCodeTxt}}</span>
      <el-button class="changebtn" type="primary" @click="handlebindMobile">绑定微信</el-button>
    </div>
  </div>
</template>

<script>
  import input from '@/components/input'

  export default {
    data() {
      return {
        mobile: '',
        smsCode: '',
        smsCodeTip: '',
        getCodeTime: 0,
        getCodeTxt: '获取验证码'
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
      getUserInfo() {
        this.$db.dataUser.getUserInfo(this)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.mobile = res.data.returnObject.mobile
            }
          })
      },
      sendsmscode() {
        if (this.getCodeTime <= 0) {
          let mobileregx = !this.$regx.telphone(this.mobile)
          if (mobileregx) {
            document.querySelector('#cgmobile').focus()
            return false
          }
          this.$db.dataUser.sendsmscode(this, this.mobile, 'modifyWx')
            .then((res) => {
              if (res.data.returnCode === 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '验证码发送成功'})
                this.getCodeTime = 60
                this.codeTime()
              } else {
                this.$message({showClose: true, type: 'error', duration: 30000, message: res.data.returnMsg})
                // this.bindSCodeTip = res.data.returnMsg
              }
            })
        }

      },
      codeTime() {
        setTimeout(() => {
          this.getCodeTime--
          if (this.getCodeTime > 0) {
            this.getCodeTxt = this.getCodeTime + ' S '
            this.codeTime()
          } else {
            this.getCodeTxt = '获取验证码'
          }
        }, 1000)
      },
      loginbyqrcode() {
        let code = this.$route.query.code
        let state = this.$route.query.state
        if (code) {
          this.$http({
            method: 'POST',
            url: this.$api.user.loginbyqrcode,
            message: 'none',
            params: {
              code: code,
              state: state
            }
          }).then((res) => {
            if (res.data.returnCode === 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '微信号已经绑定，无须重新绑定'})
              this.$router.push('/manage/account')
            } else if (res.data.returnCode === 511) {
              // 用户的unionid未绑定，可以绑定，开始绑定流程

            } else if (res.data.returnCode === 512) {
              // code失效，重新扫码
              this.$message({showClose: true, type: 'error', duration: 3000, message: 'code失效，请重新扫码'})
              // this.$router.push('/register')
              this.$router.push('/manage/account')
            }
          })
        }
      },
      // 绑定微信后登录
      handlebindMobile() {
        this.$db.dataUser.changeweixinafterqrscan(this, this.mobile, this.smsCode)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.$auth.setStore(this, res.data.returnObject)
              this.$router.push('/manage/account')
            } else if (res.data.returnCode === 521) {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '验证码错误'})
            } else if (res.data.returnCode === 522) {
              // 重新绑定基本不存在手机号未注册
              this.$message({showClose: true, type: 'error', duration: 3000, message: '手机号未注册'})
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
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
      this.loginbyqrcode()
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  #changemobile {
    height: 560px !important;
    border: 1px solid #e3e3e3;
    padding: 0 30px;
    margin: 30px auto !important;
    .changebtn {
      width: 220px;
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
        width: 100px;
        text-align: center;
        border-bottom: 2px solid #ffb148;
      }
    }
    .info {
      margin-top: 60px;
    }
    .changeinfo {
      margin-left: 380px;
      width: 390px;
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
