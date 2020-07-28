<template>
  <div id="login" @keyup.13="login">
    <div class="content">
      <img class="adv" :src="$image.passport.logobg">
      <div class="loginbox">
        <el-tabs type="border-card" :value="tabValue">
          <el-tab-pane label="账号登录" name="tablogin">
            <div class="tablogin">
              <v-input :id="'txtmobile'" :text="'手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'"
                       v-model="mobile"></v-input>
              <v-input :id="'txtpassword'" :text="'密码'" :regx="'password'" :errmsg="'密码6-20位'"
                       v-model="password"></v-input>
              <v-input :id="'txtimgcode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'"
                       v-model="imgcode"></v-input>
              <img class="imgcode" :src="imageUrl" alt="验证码" @click="getImageCode">

              <el-button class="loginbtn f17" type="primary" @click="login">登 录</el-button>
              <p class="regtext">
                <router-link class="left f17" to="/register">免费注册</router-link>
                <router-link class="right f17" to="/findPassword">忘记密码</router-link>
              </p>
            </div>
          </el-tab-pane>

          <el-tab-pane label="微信二维码登录" name="tabwxlogin">
            <div v-if="wxlogin_step===0" class="tablogin">
              <v-qrcodewx class="loginqrcode" :redirecturl="wxScanRedirectUrl"></v-qrcodewx>
              <!--<div id="qrcode" class="qrcode"></div>-->
              <p class="scanLoginText">扫描二维码登录</p>
              <p class="regtext">还没有账号?
                <router-link to="/register">免费注册</router-link>
              </p>
            </div>
            <div v-else-if="wxlogin_step===1" class="tablogin wxlogin">
              <div class="pdtop50">
                <div class="errlbl">你微信尚未绑定手机号，请输入手机号进行绑定！</div>
                <v-input :id="'txtbindMobile'" :text="'手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'"
                         :tip="bindMobileTip" v-model="bindMobile" @blur="inputBlur" @input="onInput"></v-input>
                <el-button v-if="bindMobileTip === ''" class="loginbtn mtop60 f17" type="primary"
                           @click="checkmobileNext">
                  下一步
                </el-button>
                <el-button v-else class="loginbtn mtop60 f17" type="primary" @click="checkmobileNext">跳转注册</el-button>
                <p class="regtext">还没有账号?
                  <router-link to="/register">免费注册</router-link>
                </p>
              </div>
            </div>
            <div v-else-if="wxlogin_step===2" class="tablogin wxlogin">
              <div class="pdtop20">
                <v-input :id="'txtbindMobile2'" :text="'手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'"
                         v-model="bindMobile"></v-input>
                <!--<v-input :id="'txtbindPwd'" :text="'密码'" :regx="'password'" :errmsg="'密码6-20位'"
                          v-model="bindPwd" ></v-input>-->
                <v-input :id="'txtbindMCode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'"
                         :tip="bindSCodeTip" v-model="bindMCode"></v-input>
                <span class="sendMCode" @click="sendsmscode">{{getCodeTxt}}</span>
                <el-button style="margin-top: 80px" class="loginbtn f17" type="primary" @click="handlebindMobile">绑 定
                </el-button>
                <p class="regtext">
                  <router-link class="left f17" to="/register">免费注册</router-link>
                  <router-link class="right f17" to="/findPassword">忘记密码</router-link>
                </p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import input from '../../components/input.vue'
  import qrcodewx from '@/components/qrcodewx'
  export default {
    data() {
      return {
        tabValue: 'tablogin',
        isinput: '',
        mobile: '',
        password: '',
        imgcode: '',
        imageUrl: '',
        mobileregx: false,
        passwordregx: false,
        imgcoderegx: false,
        wxlogin_step: 0,
        login_step: 0,
        // 绑定手机号
        bindMobile: '',
        bindMobileTip: '',
        bindPwd: '',
        bindMCode: '',
        bindSCodeTip: '',
        unionid: '',
        redirect_url: '',
        getCodeTime: 0,
        getCodeTxt: '获取验证码',
        wxScanRedirectUrl: '',
        checkMobileing: true
      }
    },
    // 使用其它组件
    components: {
      'v-input': input,
      'v-qrcodewx': qrcodewx
    },
    watch: {
      '$route': function (val) {
        // console.warn(val)
      }
    },
    methods: {
      /*
      setStore(userData) {
        let userId = userData.id
        let realName = userData.realName
        if (realName === '' || realName === null) {
          this.$store.commit('USERDATA', userData)
          this.$cookie.set('userId', userId)
          this.$store.commit('ISLOGIN', true)
          this.$message({message: '请先完善用户信息', showClose: true, type: 'success', duration: 2000})
          this.$router.push('/register?step=2')
        } else {
          this.$store.commit('USERDATA', userData)
          this.$cookie.set('userId', userId)
          this.$store.commit('ISLOGIN', true)
          this.$message({message: '登录成功', showClose: true, type: 'success', duration: 2000})
          if (this.redirect_url) {
            location.href = this.redirect_url
          } else {
            this.$router.push('/index')
          }
        }
      },
      */
      // 获取图片验证码
      getImageCode() {
        this.imageUrl = this.$api.user.imageCode + '?time=' + new Date().getTime()
      },
      imgCodeCheck() {
        this.$db.dataUser.imgCodeCheck(this, this.imgcode)
          .then((res) => {
            if (res.data.returnCode !== 1) {
              this.imgcoderegx = true
            }
          })
      },
      link(url) {
        this.$router.push(url)
      },
      login() {
        this.mobileregx = !this.$regx.telphone(this.mobile)
        if (this.mobileregx) {
          document.querySelector('#txtmobile').focus()
          return false
        }
        this.passwordregx = !this.$regx.password(this.password)
        if (this.passwordregx) {
          document.querySelector('#txtpassword').focus()
          return false
        }
        this.imgcoderegx = !this.$regx.imgCode(this.imgcode)
        if (this.imgcoderegx) {
          document.querySelector('#txtimgcode').focus()
          return false
        }

        if (this.mobileregx || this.mobileregx || this.mobileregx) {
          return false
        }
        let pwd = ''
        if (this.password) {
          pwd = this.$md5(this.password)
        }
        this.$http({
          method: 'POST',
          url: this.$api.user.login,
          params: {
            mobile: this.mobile,
            password: pwd,
            kaptchacode: this.imgcode
          }
        }).then((res) => {
          let code = res.data.returnCode
          let returnObject = res.data.returnObject;
          if (code === 1) {
            /*
            if (!returnObject.weixinUnionId) {
              this.$message({message: '你还未绑定微信，请先扫码绑定', showClose: true, type: 'warning', duration: 3000})
              this.$auth.setStore(this, returnObject)
              this.$router.push('/bindWeixin')
            } else {
              this.setStore(res.data.returnObject)
            }
            */
            var IsVIP = returnObject.enterpriseUser ? 'vip' : 'normal';
            if (window._hmt) {
              window._hmt.push(['_setCustomVar', 1, 'customer', IsVIP, 3]);
            }
            this.$auth.loginSetAuth(this, res.data.returnObject)
            this.addUserLoginRecord(res.data.returnObject.id, res.data.returnObject.companyId)
          } else if (code === 501) {
            this.$message({message: this.$config.message[code], showClose: true, type: 'error', duration: 3000})
            this.getImageCode()
          } else if (code === 502) {
            this.$message({message: this.$config.message[code], showClose: true, type: 'error', duration: 3000})
            this.getImageCode()
          } else {
            this.$message({message: res.data.returnMsg, showClose: true, type: 'error', duration: 3000})
            this.getImageCode()
          }
        })
      },
      keySubmit(ev) {
        if (ev.keyCode === 13) {
          this.login()
        }
      },
      bannerH() {
        this.windowH = document.documentElement.clientHeight || document.body.clientHeight
        const that = this
        window.onresize = function temp() {
          that.windowH = document.documentElement.clientHeight || document.body.clientHeight
        }
        var header = document.getElementById('header').clientHeight
        var footer = document.getElementById('footer').clientHeight
        var login = document.getElementById('login')
        login.style.height = (this.windowH - footer - header) + 'px'
        login.style.minHeight = '580px'
      },
      qrCode() {
        let state = this.$common.uuid()
        let appid = this.$api.appid
        let redirect_uri = this.$api.host + 'login'
        let obj = new WxLogin({
          id: 'qrcode',
          appid: appid,
          scope: 'snsapi_login',
          redirect_uri: redirect_uri,
          state: state,
          style: 'black',
          href: '' // http://test.web.in-hope.com.cn/static/css/wxcss.css
        });
      },
      loginbyqrcode() {
        let code = this.$route.query.code
        let state = this.$route.query.state
        if (code) {
          this.tabValue = 'tabwxlogin'
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
              // 扫码登录成功
              console.log('created+wxScanRedirectUrl：' + this.wxScanRedirectUrl)
              //
              let returnObject = res.data.returnObject;
              //
              var IsVIP = returnObject.enterpriseUser ? 'vip' : 'normal';
              if (window._hmt) {
                window._hmt.push(['_setCustomVar', 1, 'customer', IsVIP, 3]);
              }
              this.$auth.loginSetAuth(this, res.data.returnObject);
              this.addUserLoginRecord(res.data.returnObject.id, res.data.returnObject.companyId)

            } else if (res.data.returnCode === 511) {
              // 扫码登录失败，验证流程
              this.wxlogin_step = 1
              this.unionid = res.data.returnObject.unionid
            } else if (res.data.returnCode === 512) {
              this.$auth.authRedirect(this, '/login?tab=rescan', 'code失效，请重新扫码！', '登录页')
              // code失效，重新扫码
              // this.$message({showClose: true, type: 'error', duration: 3000, message: 'code失效，请重新扫码'})
              // location.href = '/login?tab=rescan'
            }
          })
        }
      },
      // 绑定微信后登录
      handlebindMobile() {
        this.$db.dataUser.binduserafterqrscan(this, this.bindMobile, this.bindMCode)
          .then((res) => {
            if (res.data.returnCode === 1) {
              // this.setStore(res.data.returnObject)
              this.$auth.loginSetAuth(this, res.data.returnObject)
            } else if (res.data.returnCode === 521) {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '验证码错误'})
            } else if (res.data.returnCode === 522) {
              // 手机号不存在，请先注册
              this.$router.push('/register')
              this.$message({showClose: true, type: 'error', duration: 3000, message: '手机号未注册, 请先注册'})
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
            }
          })
      },
      onInput(id) {
        this.bindMobileTip = ''
      },
      inputBlur(id) {
        this.bindMobileregx = !this.$regx.telphone(this.bindMobile)
        if (this.bindMobileregx) {
          document.querySelector('#txtbindMobile').focus()
          return false
        }
        this.checkMobileing = true
        // this.bindMobileTip = '正在校验手机号是否注册'
        this.$db.dataUser.checkmobileexist(this, this.bindMobile)
          .then((res) => {
            this.checkMobileing = false
            if (res.data.returnCode === 1) {
              this.bindMobileTip = '该手机号未注册，请先注册'
              return true
            } else {
              this.bindMobileTip = ''
              return false
            }
          })
      },
      checkmobileNext() {
        this.bindMobileregx = !this.$regx.telphone(this.bindMobile)
        if (this.bindMobileregx) {
          document.querySelector('#txtbindMobile').focus()
          return false
        }
        if (this.checkMobileing) {
          return false
        }
        if (!this.checkMobileing) {
          if (this.bindMobileTip === '') {
            this.wxlogin_step = 2
          } else {
            this.$router.push('/register')
          }
        }
      },
      sendsmscode() {
        if (this.getCodeTime <= 0) {
          let mobile_regx = !this.$regx.telphone(this.bindMobile)
          if (mobile_regx) {
            document.querySelector('#txtbindMobile').focus()
            return false
          }
          this.$db.dataUser.sendsmscode(this, this.bindMobile, 'modifyWx')
            .then((res) => {
              if (res.data.returnCode === 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '验证码发送成功'})
                this.getCodeTime = 60
                this.codeTime()
              } else {
                this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
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
      addUserLoginRecord (userId, companyId) {
        this.$http({
          method: 'POST',
          url: this.$api.enterpriseCompany.addUserLoginRecord,
          message: 'none',
          params: {
            userId: userId,
            companyId: companyId
          }
        }).then((res) => {
        })
      }
    },
    beforeCreate() {
      if (this.$cookie.islogin()) {
        this.$router.push('/index')
      }
    },
    // 生命周期函数
    created() {
      this.wxScanRedirectUrl = this.$api.host + 'login'
      // alert(this.$route.query.redirect_url && !this.$cookie.islogin())
      if (this.$route.query.redirect_url && !this.$cookie.islogin()) {
        // this.redirect_url = this.$route.query.redirect_url
        this.redirect_url = decodeURIComponent(this.$route.fullPath).replace('/login?redirect_url=', '')
        this.wxScanRedirectUrl = this.$api.host + 'login?redirect_url=' + this.redirect_url
        this.$message({showClose: true, type: 'error', duration: 3000, message: '请先登录'})
      }
      this.getImageCode()
      this.loginbyqrcode()

    },
    mounted() {
      if (!this.$route.query.code) {
        // this.qrCode()
      }
      if (this.$route.query.tab) {
        this.tabValue = 'tabwxlogin'
      }
      this.bannerH()
    }
  }
</script>

<style lang="scss">
  #login {
    padding-bottom: 20px;
    .ts {
      transition: all .3s;
    }
    a {
      color: #ffb148;
      transition: all .3s;
    }
    a:hover {
      color: lighten(#ffb148, 10%)
    }
    .f17 {
      font-size: 17px;
    }
    .left {
      float: left;
    }
    .right {
      float: right;
    }
    .errlbl {
      color: #ff8361;
      padding-bottom: 30px;
    }
    .pdtop20 {
      padding-top: 20px;
    }
    .pdtop50 {
      padding-top: 50px;
    }
    .pdtop100 {
      padding-top: 100px;
    }
    .mtop60 {
      margin-top: 60px !important;
    }
    .mgtop100 {
      margin-top: 100px !important;
    }
    .content {
      height: 100%;
      .adv {
        /*margin: 80px 30px;*/
        float: left;
        margin-top: -270px;
        position: relative;
        top: 50%;
      }
      .loginbox {
        position: relative;
        top: 50%;
        width: 360px;
        height: 450px;
        float: right;
        margin: -225px 100px 0 0;
        .tablogin {
          padding: 0 10px;
          height: 370px;
          overflow: hidden;
          .imgcode {
            color: #ffb148;
            display: block;
            float: right;
            position: relative;
            margin-top: -45px;
            cursor: pointer;
            width: 100px;
            height: 40px;
            border: 1px solid #e5e5e5;
            border-radius: 5px;
          }
          .xn-input-active {
            .lbl {
              transform: translatey(10px);
              color: rgba(0, 0, 0, .38);
              font-size: 14px;
            }
          }
          .loginqrcode {
            margin-top: 20px;
          }
          .scanLoginText {
            text-align: center;
            font-weight: 600;
            margin-top: 15px;
          }
          .sendMCode {
            color: #ffb148;
            display: block;
            float: right;
            position: relative;
            margin-top: -30px;
            cursor: pointer;
          }
          .loginbtn {
            margin-top: 30px;
            width: 310px;
            height: 50px;
          }
          .scanbtn {
            margin-top: 20px;
            width: 310px;
            height: 50px;
          }

          .regtext {
            margin-top: 20px;
            font-size: 17px;
            text-align: center;
            color: #8d8d8d;
          }
          .sendMCode {
            color: #ffb148;
            display: block;
            float: right;
            position: relative;
            margin-top: -30px;
            cursor: pointer;
          }
        }

        /* element 样式重置 */
        .el-tabs__header {
          background-color: #fff3e5 !important;
        }
        .el-tabs__nav {
          width: 100%;
        }
        .el-tabs__item {
          width: 180px;
          height: 60px;
          font-size: 16px;
          line-height: 60px;
          text-align: center;
          color: #8d8d8d;
          border: 1px solid #eeeeee;
          background-color: #f3f3f3;
          z-index: 2;
        }
        .is-active {
          color: #FFAC38;
          border: 1px solid rgba(0, 0, 0, 0) !important;
          background-color: #fff;
          z-index: 1;
        }
      }
    }
  }

</style>
