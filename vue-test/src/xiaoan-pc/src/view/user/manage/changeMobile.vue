<template>
  <div id="changemobile" class="content">
    <div class="title"><span class="txt fc">更换手机</span></div>
    <div class="changeinfo">
      <div class="info">你绑定的手机号码是：{{oldmobile}}</div>
      <div class="space"></div>
      <v-input :id="'cgmobile'" :text="'新手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'"
               v-model="mobile" :tip="mobiletip"  @blur="inputBlur" @focus="onfocus"></v-input>
      <div class="space"></div>
      <v-input :id="'cgmscode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'" :tip="smsCodeTip"  v-model="smsCode" ></v-input>
      <span class="sendMCode" @click="sendsmscode">{{getCodeTxt}}</span>

      <el-button class="changebtn"  type="primary" @click="bindmobile">保 存</el-button>
    </div>

  </div>
</template>

<script>
  import input from '@/components/input'
  export default {
    data() {
      return {
        oldmobile: '',
        mobile: '',
        mobiletip: '',
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
      inputBlur () {
        if (this.oldmobile === this.mobile) {
          this.mobiletip = '新手机号跟绑定手机号不能相同'
        } else {
          this.mobiletip = ''
        }
      },
      onfocus () {
        this.mobiletip = ''
      },
      getUserInfo () {
        this.$db.dataUser.getUserInfo(this)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.oldmobile = res.data.returnObject.mobile
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
          if (this.oldmobile === this.mobile) {
            return false
          }
          let userId = this.$cookie.get('userId')
          this.$db.dataUser.sendsmscode(this, this.mobile, 'modifyMobile', userId)
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
      bindmobile () {
        let mobileregx = !this.$regx.telphone(this.mobile)
        if (mobileregx) {
          document.querySelector('#cgmobile').focus()
          return false
        }
        let coderegx = !this.$regx.imgCode(this.smsCode)
        if (coderegx) {
          document.querySelector('#cgmscode').focus()
          return false
        }
        if (this.oldmobile === this.mobile) {
          return false
        }
        this.$db.dataUser.bindmobile(this, this.mobile, this.smsCode)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '手机号修改成功'})
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
  #changemobile {
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
