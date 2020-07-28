<template>
  <div id="login" class="login vxa-image-passport-bg-companybg">
    <div id="LoginContent" class="content company-content">
      <div class="loginbox" :class="{'login_index': wx_mask}">
        <el-tabs type="border-card" :value="tabValue" v-if="!wx_mask" @tab-click="tabClick">
          <el-tab-pane label="账号登录" name="tablogin">
            <div class="tablogin" v-if="tabValue == 'tablogin'" @keyup.13="login">
              <v-input :id="'txtmobile'" :text="'手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'"
                       v-model="mobile" :noneValue="noneValue" @checkMobile="checkMobile" @cleanNum="cleanNum"></v-input>
              <v-input :account="account" :id="'txtpassword'" :forget="true" :text="'密码(6-20位)'" :regx="'password'" :errmsg="'密码6-20位'" :maxlength="'20'"
                       v-model="password" :noneValue="noneValue"></v-input>
              <!-- <span class="sendMCode" @click="sendsmscodev1()">忘记密码</span> -->
              <router-link class="sendMCode" :class="{'stop': account}" to="/findPassword">忘记密码</router-link>
              <el-button v-if="!account" class="loginbtn f17" type="primary" @click="login">登 录</el-button>
              <el-button v-else class="loginbtn f17" type="primary" @click="stepRegister">去注册</el-button>
              <p class="regtext">
                <span>社交账号登录:</span>
                <img @click="showWx" src="https://oss.in-hope.cn/xiaoan/web_static/wxlogo.png" alt="">
                <!-- <router-link class="left f17" to="/register">免费注册</router-link>
                <router-link class="right f17" to="/findPassword">忘记密码</router-link> -->
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="手机号快捷登录" name="quikeLogin">
            <div class="tablogin" v-if="tabValue == 'quikeLogin'" @keyup.13="quikeLogin">
              <v-input :id="'txtmobile'" :text="'手机号'" :regx="'mobile'" :errmsg="''" :maxlength="'11'"
                v-model="mobile" :noneValue="noneMobile" @checkMobile="checkMobile"  @cleanNum="cleanNum"></v-input>
              <v-input :account="account" :id="'regsmscode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'"
                v-model="imgcode" :noneValue="noneValue"></v-input>
              <span class="sendMCode" :class="{'stop': account}" @click="sendsmscodev1()">{{getCodeTxt}}</span>
              <el-button v-if="!account" class="loginbtn f17" type="primary" @click="quikeLogin">登 录</el-button>
              <el-button v-else class="loginbtn f17" type="primary" @click="stepRegister">去注册</el-button>
              <p class="regtext">
                <span>社交账号登录:</span>
                <img @click="showWx" src="https://oss.in-hope.cn/xiaoan/web_static/wxlogo.png" alt="">
              </p>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="微信二维码登录" name="tabwxlogin">
            <div v-if="wxlogin_step===0" class="tablogin">
              <v-qrcodewx class="loginqrcode" :redirecturl="wxScanRedirectUrl"></v-qrcodewx>
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
          </el-tab-pane> -->
        </el-tabs>
        <div class="wx_box" v-else>
          <div class="wx_title vux-1px-b">
            <span class="wx_word">微信登录</span>
            <span class="icon" @click="wxClose"><i class="el-icon-close"></i></span>
          </div>
          <div class="wx_content">
            <div v-if="wxlogin_step===0" class="tablogin wxlogin">
              <v-qrcodewx class="loginqrcode" :redirecturl="wxScanRedirectUrl"></v-qrcodewx>
              <div class="wx_footer">
                <p>请用微信扫描二维码登录</p>
                <p>信公小安</p>
              </div>
            </div>
            <div v-else-if="wxlogin_step===1" class="tablogin wxlogin">
              <div style="padding: 0 10px">
                <div class="errlbl">你微信尚未绑定手机号，请输入手机号进行绑定！</div>
                <v-input :id="'txtbindMobile'" :text="'手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'"
                         :tip="bindMobileTip" :noneValue="noneMobile" v-model="mobile" @checkMobile="checkMobile"  @cleanNum="cleanNum"></v-input>
                <v-input :account="account" :id="'regsmscode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'"
                  v-model="imgcode" :noneValue="noneValue"></v-input>
                <span class="sendMCode" :class="{'stop': account}" @click="sendsmscode">{{getCodeTxt}}</span>
                <el-button v-if="!account" class="loginbtn f17" type="primary"
                           @click="handlebindMobile">
                  绑定
                </el-button>
                <el-button v-else class="loginbtn f17" type="primary" @click="stepRegister">
                  <span v-if="!wxBind">去注册</span>
                  <span v-else>去登录</span>
                </el-button>
                <p class="regtext" style="text-align: center">还没有账号?
                  <router-link to="/register">免费注册</router-link>
                </p>
              </div>
            </div>
            <!-- <div v-else-if="wxlogin_step===2" class="tablogin wxlogin">
              <div class="pdtop20">
                <v-input :id="'txtbindMobile2'" :text="'手机号'" :regx="'mobile'" :errmsg="'手机号格式错误'" :maxlength="'11'"
                         v-model="bindMobile"></v-input>
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
            </div> -->
          </div>
          
        </div>
      </div>
    </div>
    <div class="wx_mask" v-if="wx_mask"></div>
    <el-dialog v-if="codeDialog" class="authDialog" :modal-append-to-body='false' :close-on-click-modal='false' title="填写验证码" :visible.sync="codeDialog" width="355px" center top="28vh">
      <div class="message">
        <v-input :id="'txtimgcode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'"
                  v-model="codeImg" :noneValue="codeValue" :codeErrmsg="codeErrmsg" @codeMsg="codeMsg"></v-input>
        <img class="imgcode" :src="imageUrl" alt="验证码" @click="getImageCode">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="imgcodecheck">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import input from './components/input.vue'
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
        checkMobileing: true,
        noneValue: 1,
        noneMobile: 1,
        codeValue: 1,
        codeDialog: false,
        wx_mask: false,
        codeImg: '',
        codeErrmsg: '',
        codeIndex: 0,
        account: false, // 未注册
        wxBind: false, // 是否绑定微信
        imgCodeIndex: 0
      }
    },
    // 使用其它组件
    components: {
      'v-input': input,
      'v-qrcodewx': qrcodewx
    },
    watch: {
      '$route': function (val) {
        console.warn(val)
      },
      'tabValue': function() {
        this.mobile = '';
        this.password = '';
        this.imgcode = '';
        this.account = false;
      }
    },
    methods: {
      // 获取图片验证码
      getImageCode() {
        this.imageUrl = this.$api.user.imageCode + '?time=' + new Date().getTime()
      },
      wxClose() {
        this.wx_mask = false;
        this.tabValue = 'tablogin';
        this.mobile = '';
        this.getCodeTime = 0;
        this.imgcode = '';
        this.account = false;
        this.wxBind = false;
      },
      showWx() {
        this.wx_mask = true;
        this.mobile = '';
        this.getCodeTime = 0;
        this.imgcode = '';
        this.account = false;
        this.wxBind = false;
      },
      wxTabLogin() {
        this.codeDialog = true;
      },
      cleanNum() {
        this.mobile = '';
        this.bindMobile = '';
      },
      codeMsg() {
        this.codeErrmsg = '';
      },
      checkMobile(val, type) {
        this.account = val;
        type == 'wxBind' ? this.wxBind = true : this.wxBind = false;
      },
      stepRegister() {
        if (!this.wxBind) {
          this.$router.push('/register');
        } else {
          this.wxClose();
        }
      },
      imgcodecheck() {
        if (this.codeImg.length < 4) {
          this.codeValue++;
          return false
        }
        let params = {
          code: this.codeImg
        }
        this.$axios.user.imgcodecheck(params).then(res => {
          if (res.data.returnCode == -1) {
            this.codeErrmsg = '验证码不正确！';
            this.codeImg = '';
            this.imgCodeIndex++;
            if (this.imgCodeIndex >= 5) {
              this.$message({message: '验证码连续输入错误,请重新获取', showClose: true, type: 'error', duration: 3000});
              this.imgCodeIndex = 0;
              this.codeDialog = false;
            }
            this.getImageCode();
          } else if (res.data.returnCode == 1) {
            this.codeDialog = false;
            this.codeIndex = 0;
            this.imgCodeIndex = 0;
            this.sendsmscode();
          }
        })
      },
      tabClick(val) {
        this.tabValue = val.name;
      },
      // link(url) {
      //   this.$router.push(url)
      // },
      // 快捷登录
      quikeLogin() {
        let params = {
          mobile: this.mobile,
          code: this.imgcode
        }
        this.$axios.user.quikeLogin(params).then(res => {
          let code = res.data.returnCode
          let returnObject = res.data.returnObject;
          if (code === 200) {
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
      login() {
        this.mobileregx = !this.$regx.telphone(this.mobile)
        this.passwordregx = !this.$regx.password(this.password)

        if (this.mobileregx || this.passwordregx) {
          this.noneValue++
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
            password: pwd
          }
        }).then((res) => {
          let code = res.data.returnCode
          let returnObject = res.data.returnObject;
          if (code === 1) {
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
        this.windowH = document.documentElement.clientHeight || document.body.clientHeight;
        const that = this
        window.onresize = function temp() {
          that.windowH = document.documentElement.clientHeight || document.body.clientHeight;
        }
        var header = document.getElementById('header').clientHeight
        var footer = document.getElementById('footer').clientHeight
        var login = document.getElementById('login')
        login.style.height = (this.windowH - footer - header) + 'px'
        var LoginContent = document.getElementById('LoginContent')
        LoginContent.style.height = (this.windowH - footer - header) + 'px'
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
        let code = this.$route.query.code;
        let state = this.$route.query.state;
        
        if (code) {
          this.tabValue = 'quikeLogin';
          this.wx_mask = true;
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
        this.$db.dataUser.binduserafterqrscan(this, this.mobile, this.imgcode)
          .then((res) => {
            if (res.data.returnCode === 1) {
              let reg = /^(\d{3})\d{4}(\d{4})$/;
              let mobile = this.mobile.replace(reg, "$1****$2");
              this.$message({message: `您已成功绑定${mobile}手机号`, customClass:'wxBox', showClose: true, type: 'success', duration: 2000});
              setTimeout(e => {
                this.$auth.loginSetAuth(this, res.data.returnObject)
              }, 2000)
            } else if (res.data.returnCode === 521) {
              this.$message({showClose: true, type: 'error', duration: 3000, customClass:'wxBox', message: '验证码错误'})
            } else if (res.data.returnCode === 522) {
              // 手机号不存在，请先注册
              this.$router.push('/register')
              this.$message({showClose: true, type: 'error', duration: 3000, message: '手机号未注册, 请先注册'})
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, customClass:'wxBox', message: res.data.returnMsg})
            }
          })
      },
      // onInput(id) {
      //   this.bindMobileTip = ''
      // },
      sendsmscode() {
        if (this.getCodeTime <= 0) {
          let mobile_regx = !this.$regx.telphone(this.mobile);
          if (mobile_regx) {
            this.noneMobile++
            return false
          }
          if (this.codeIndex > 0) {
            this.codeDialog = true;
            this.codeErrmsg = '';
            return false
          }
          this.$db.dataUser.sendsmscode(this, this.mobile, 'modifyWx')
            .then((res) => {
              if (res.data.returnCode === 1) {
                this.codeIndex++;
                this.$message({showClose: true, type: 'success', duration: 2000, message: '验证码发送成功'})
                this.getCodeTime = 60
                this.codeTime()
              } else {
                this.$message({showClose: true, type: 'error', duration: 2000, message: res.data.returnMsg})
                // this.bindSCodeTip = res.data.returnMsg
              }
            })
        }
      },
      sendsmscodev1() {
        if (this.getCodeTime <= 0) {
          let mobile_regx = !this.$regx.telphone(this.mobile);
          if (mobile_regx) {
            this.noneMobile++
            return false
          }
          if (this.codeIndex > 0) {
            this.codeDialog = true;
            this.codeErrmsg = '';
            this.getImageCode();
            return false
          }
          let params = {
            mobile: this.mobile,
            type: 'login'
          }
          this.$axios.user.sendsmscodev1(params).then(res => {
            if (res.data.returnCode === 1) {
                this.codeIndex++;
                this.$message({showClose: true, type: 'success', duration: 3000, message: '验证码发送成功'})
                this.getCodeTime = 60
                this.codeTime()
              } else {
                this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
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
      addUserLoginRecord(userId, companyId) {
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
      let tab = this.$route.query.tab;
      if (tab) {
        this.wx_mask = true;
        this.wxlogin_step = 0;
      }
      this.wxScanRedirectUrl = this.$api.host + 'login'
      console.log(this.wxScanRedirectUrl);
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
  input:-webkit-autofill {-webkit-box-shadow: 0 0 0px 1000px white inset;}
  .wxBox {
    z-index: 20000 !important;
  }
  #login {
    padding-bottom: 20px;
    .v-modal {
      z-index: 100000 !important;
    }
    .authDialog {
      z-index: 1000000 !important;
      .el-dialog__header {
        border-bottom: 1px solid #e3e3e3;
        .el-dialog__title {
          color: #ffb148;
        }
        .el-dialog__body {
          padding: 25px;
        }
      }
      .message {
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
      }
      .el-button {
        padding: 0;
        width: 100px;
        height: 35px;
        line-height: 35px;
        font-size: 16px;
      }
    }
    .wx_mask {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #000;
      z-index: 10000;
      opacity: 0.5;
    }
    .login_index {
      z-index: 10002 !important;
    }
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
      width: 304px;
      color: #FB4319;
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
        height: 400px;
        float: right;
        margin: -225px 100px 0 0;
        z-index: 1000;
        .wx_box {
          width: 100%;
          height: 440px;
          background: #fff;
          border-radius: 4px;
          z-index: 1000;
          position: relative;
          .wx_title {
            padding: 20px;
            padding-bottom: 10px;
            text-align: center;
            font-size: 16px;
            .wx_word {
              color: #FFB148;
            }
            .icon {
              float: right;
              cursor: pointer;
              color: #909399;
              &:hover {
                color: #FFB148;
              }
            }
          }
          .wx_content {
            height: 323px;
          }
          .wx_footer {
            height: 80px;
            width: 100%;
            background: #FFB148;
            border-bottom-right-radius:4px;
            border-bottom-left-radius:4px;
            text-align: center;
            padding-top: 20px;
            position: absolute;
            bottom: 0;
            right: 0;
            p {
              color: #fff;
              font-size: 16px;
            }
          }
        }
        .tablogin {
          padding: 0 10px;
          height: 310px;
          overflow: hidden;
          .sendMCode {
            color: #ffb148;
            display: block;
            float: right;
            position: relative;
            margin-top: -110px;
            cursor: pointer;
          }
          .stop {
            color: rgba(0,0,0,.38) !important;
          }
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
            margin-top: 10px;
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
            text-align: left;
            color: #8d8d8d;
            span {
              color: #AEAEAE;
              vertical-align: middle;
            }
            img {
              width: 35px;
              height: 35px;
              vertical-align: middle;
              cursor: pointer;
            }
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
        .wxlogin {
          height: 390px;
          padding: 15px;
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
    .company-content {
      min-height: 550px;
    }
  }
</style>
