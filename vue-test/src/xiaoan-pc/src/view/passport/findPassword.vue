
<template>
  <div id="findPassword" class="content">
    <div class="title"><span class="txt fc">找回密码</span></div>
    <div class="changeinfo">
      <div class="space"> </div>
      <v-input :id="'fdmobile'" :text="'手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'" v-model="mobile" ></v-input>
      <v-input :id="'fdpwd'" :text="'新密码'" :regx="'password'" :errmsg="'密码6-20位'" v-model="pwd" ></v-input>
      <v-input :id="'fdrepwd'" :text="'确认新密码'" :regx="'password'" :errmsg="'密码6-20位'" v-model="repwd"  :tip="repwdtip" @blur="reregblur"></v-input>
      <v-input :id="'fdmscode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'" :tip="smsCodeTip"  v-model="smsCode" ></v-input>
      <span class="sendMCode" @click="sendsmscode">{{getCodeTxt}}</span>

      <el-button class="changebtn"  type="primary" @click="findPwd">保 存</el-button>
    </div>

  </div>
</template>

<script>
  import input from '../../components/input'
  export default {
    data() {
      return {
        mobile: '',
        pwd: '',
        repwd: '',
        repwdtip: '',
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
      reregblur () {
        if (this.pwd !== this.repwd) {
          this.repwdtip = '两次输入不一致'
        } else {
          this.repwdtip = ''
        }
      },
      sendsmscode() {
        if (this.getCodeTime <= 0) {
          let mobile_regx = !this.$regx.telphone(this.mobile)
          if (mobile_regx) {
            document.querySelector('#fdmobile').focus()
            return false
          }
          this.$db.dataUser.sendsmscode(this, this.mobile, 'findPwd')
            .then((res) => {
              if (res.data.returnCode === 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '验证码发送成功'})
                this.getCodeTime = 60
                this.codeTime()
              } else {
                this.$message({showClose: true, type: 'error', duration: 30000, message: res.data.returnMsg})
              }
            })
        }

      },
      bannerH() {
        this.windowH = document.documentElement.clientHeight || document.body.clientHeight;
        const that = this
        window.onresize = function temp() {
          that.windowH = document.documentElement.clientHeight || document.body.clientHeight;
        }
        var header = document.getElementById('header').clientHeight
        var footer = document.getElementById('footer').clientHeight
        var findPassword = document.getElementById('findPassword')
        findPassword.style.height = (this.windowH - footer - header) + 'px'
      },
      codeTime () {
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
      findPwd () {
        let mobile_regx = !this.$regx.telphone(this.mobile)
        if (mobile_regx) {
          document.querySelector('#fdmobile').focus()
          return false
        }
        let pwd_regx = !this.$regx.password(this.pwd)
        if (pwd_regx) {
          document.querySelector('#fdpwd').focus()
          return false
        }
        let repwd_regx = !this.$regx.password(this.repwd)
        if (repwd_regx) {
          document.querySelector('#fdrepwd').focus()
          return false
        }
        let coderegx = !this.$regx.imgCode(this.smsCode)
        if (coderegx) {
          document.querySelector('#fdmscode').focus()
          return false
        }
        this.$db.dataUser.findloginpassword(this, this.mobile, this.pwd, this.smsCode)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '密码已重置'})
              this.$router.push('/login')
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
              // this.bindSCodeTip = res.data.returnMsg
            }
          })
      }
    },
    // 生命周期函数
    created() {

    },
    mounted() {
      this.bannerH();
    }
  }
</script>

<style lang="scss">
  #findPassword {
    // height: 560px !important;
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
