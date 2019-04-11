<template>
  <div id="login">
    <div class="phoneNumber">
      <div class="information vux-1px-b">
        <input @focus="resetPhone" @blur="blurPhone" @input="checkPhone" type="text" maxlength="11"
               v-model="phoneNumber" placeholder="手机号">
        <b @click="phoneNumber=''" v-show="phoneNumber.length>0 && phoneInfo" class="wrong"></b>
      </div>
    </div>
    <div class="phoneNumber">
      <p class="logon-right">
        <span v-show="noRegister">该手机号未注册,请先注册</span>
        <span v-show="phoneNumberErr">手机号输入错误</span>
        <span v-show="noPhoneNumber">请输入手机号</span>
      </p>
      <div class="information vux-1px-b">
        <div v-show="!noRegister">
          <div v-show="!quickLand">
            <input @focus="resetPassword" @blur="blurPassword" @input="password = password.trim();" maxlength="20"
                   class="password" type="password" v-model="password" placeholder="密码(6-20位密码)">
            <b @click="closeEye" v-show="eyeState" class="closeEye"></b>
            <b @click="openEye" v-show="!eyeState" class="openEye"></b>
          </div>
          <div class="verCode" v-show="quickLand">
            <input class="password" type="text" v-model="verificationCode"
                   @focus="resetVeri" @blur="blurVeri" @input="verificationCode = verificationCode.trim();"
                   placeholder="验证码" maxlength="4">
            <b @click="verificationCode=''" v-show="verificationCode.length>0 && removeState" style="right:28%" class="wrong"></b>
            <span v-if="countDownTime" @click="getVerificationCode">获取验证码</span>
            <span v-else style="color: rgba(141,141,141,1); text-align:center">{{countDown}}&nbsp;S</span>
          </div>
        </div>
        <div v-show="noRegister">
          <div v-show="!quickLand">
            <div class="grayDiv">密码(6-20位密码)</div>
            <b v-show="eyeState" class="closeEye"></b>
          </div>
          <div class="grayCode" v-show="quickLand">
            <div>验证码</div>
            <span>获取验证码</span>
          </div>
        </div>
      </div>
    </div>
    <p class="logon-right">
      <span v-show="passwordLength && !noRegister && !quickLand">请输入6-20位密码</span>
      <span v-show="passwordErr && !noRegister && !quickLand">密码输入错误</span>
      <span v-show="verificationCodeErr && quickLand">验证码输入错误</span>
      <span v-show="noVerificationCode && quickLand">请输入验证码</span>
    </p>
    <template v-if="!noRegister">
      <p class="prompt vxa-flex-box align" v-if="!quickLand">
        <span class="col t-left" @click="fastLogin">手机验证码快捷登录</span>
        <span class="col t-right" @click="forget">忘记密码</span>
      </p>
      <p class="prompt" v-else>
        <span @click="fastLogin">账号密码登录</span>
      </p>
    </template>
    <div class="grayprompt" v-else>
      <p class="prompt vxa-flex-box" v-show="!quickLand">
        <span class="col t-left">手机验证码快捷登录</span>
        <span class="col t-right">忘记密码</span>
      </p>
      <p class="prompt" v-show="quickLand">
        <span>账号密码登录</span>
      </p>
    </div>
    <button v-if="!noRegister" type="button" @click="confirmLogin">登录</button>
    <button v-else type="button" @click="registerGo">去注册</button>
    <p @click="registerGo" class="newUser">新用户注册 ></p>
    <div v-transfer-dom>
      <confirm v-model="deleteInfo" :close-on-confirm="false" :title="''" @on-confirm="confirmClick">
        <div class="regnum">
          <div class="regbox">
            <input ref="regDom" @focus="resetRegnumber" @blur="blurRegnumber" @input="regnumber = regnumber.trim();"
                   type="text" v-model="regnumber" placeholder="验证码" maxlength="4">
            <img v-lazy="ImageCode" alt="验证码" @click="changeReg" id="changeRegimg">
            <b @click="regnumber=''" v-show="regnumber.length>0 && regnumberInfo" style="right:33%" class="wrong"></b>
          </div>
          <p class="logon-right">
            <span v-show="regError">{{errorText}}</span>
          </p>
        </div>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm class="pauseInfoDialog" v-model="show6" :show-cancel-button="false" @on-confirm="onConfirm">
        <p class="pauseInfo">尊敬的用户，抱歉，由于连续多次获取验证码，您的账户暂被停用，请于1小时后再试。</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm class="pauseInfoDialogInfo" v-model="show5" :show-cancel-button="false" @on-confirm="onConfirmInfo">
        <div class="pauseInfo">尊敬的用户，信公小安注册登录流程已优化改版，如遇到需要反复登录等问题，可致电021-20740322，或联系微信号：infaithjinjin。</div>
      </confirm>
    </div>
  </div>
</template>
<script>
  import {Confirm} from 'vux'
  import {setTimeout} from 'timers';
  export default {
    name: "login",
    components: {Confirm},
    data() {
      return {
        regnumberInfo:false,
        phoneInfo: false,
        codeTime: 0,
        verificationTime: 0,
        noVerificationCode: false,
        verificationCodeErr: false,
        noRegister: false,
        noPhoneNumber: false,
        alreadyRegister: false,
        quickLand: false,
        show6: false,
        deleteInfo: false,
        countDownTime: true,
        timer: 60,
        countDown: 60,
        verificationCode: "",
        errorPrompt: true,
        eyeState: true,
        phoneNumber: "",
        phoneNumberErr: false,
        oldPassword: "",
        password: "",
        apassword: "",
        getNumber: "获取验证码",
        reg: "",
        oldPasswordvalid: true,
        passvalid: true,
        apassvalid: false,
        regvalid: false,
        isRepeat: false,
        regnumber: "",
        imgSrc: this.$image.personal.yizhuce,
        ImageCode: "",
        showregErr: false,
        errorText: "",
        passwordLength: false,
        passwordErr: false,
        regError: false,
        show5: true,
        removeState: false
      }
    },
    created() {
      if (this.$cookie.isLogin()) {
        this.$router.replace({path: '/home'});
      }
      this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
      this.$cookie.get('firstLogin') ? this.show5 = false : this.show5 = true;
    },
    mounted() {
      // var user_id = this.$cookie.getCookie("userId");
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/home'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    destroyed() {
      window.clearInterval(this.setTimeDown);
    },
    methods: {
      resolveBug(e) {
        setTimeout(() => {
          var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
          // alert(1);
          if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            return
          }
          let result = 'pc';
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
            result = 'ios'
          } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
            result = 'android'
          }
          if (result == 'ios') {
            document.activeElement.scrollIntoViewIfNeeded(true);
          }
        }, 400)
      },
      onConfirmInfo () {
        this.show5 = false;
        this.$cookie.set("firstLogin","1");
      },
      onConfirm() {
        this.show6 = false;
      },
      resetRegnumber() {
        this.regnumberInfo = true;
        this.regError = false;
        this.errorText = '';
      },
      blurRegnumber() {
        this.regnumberInfo = false;
        if (this.regnumber.length == 0) {
          this.regError = true;
          this.errorText = '请输入验证码';
        } else if (this.regnumber.length > 0 && this.regnumber.length < 4) {
          this.regError = true;
          this.errorText = '验证码输入错误';
        }
      },
      // 验证码 验证方法
      apiImgCodeCheck() {
        let params = {code: this.regnumber}
        this.$axios.user.imgCodeCheck(params).then(res => {
          if (res.data.returnCode == -1) {
            this.errorText = '验证码输入错误';
            this.regnumber = '';
            this.changeReg();
            this.regError = true;
            this.codeTime ++;
            if (this.codeTime >= 5) {
              this.regError = false;
              this.errorText = '';
              this.deleteInfo = false;
              this.codeTime = 0;
              this.$vux.toast.show({
                text: '验证码连续输入错误,请重新获取',
                position: 'middle',
                type: 'text',
                width: 'auto',
                time: 2500
              });
            }
          } else if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.regError = false;
            this.errorText = '';
            this.regnumber = '';
            this.deleteInfo = false;
            this.getNum();
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      blurVeri() {
        this.removeState = false;
        if (this.verificationCode.length == 0) {
          this.verificationCodeErr = false;
          this.noVerificationCode = true;
        }
        if (this.verificationCode.length > 0 && this.verificationCode.length < 4) {
          this.verificationCodeErr = true;
          this.noVerificationCode = false;
        }
        this.resolveBug();
      },
      resetVeri() {
        this.removeState = true;
        this.verificationCodeErr = false;
        this.noVerificationCode = false;
      },
      fastLogin() {
        this.quickLand = !this.quickLand;
        this.passwordLength = false;
        this.passwordErr = false;
        this.alreadyRegister = false;
        this.noRegister = false;
      },
      resetPassword() {
        this.passwordLength = false;
        this.passwordErr = false;
      },
      blurPassword() {
        if (this.password.length < 6 || this.password.length > 20) {
          this.passwordLength = true;
        }
        this.resolveBug();
      },
      confirmLogin() {
        if (this.phoneNumber.length == 0) {
          this.noPhoneNumber = true;
        }
        if (!this.quickLand) {
          if (this.password.length == 0) {
            this.passwordLength = true;
          }
          if (this.phoneNumber.length == 11 && this.alreadyRegister && !this.passwordLength) {
            this.mobileLogin();
          }
        } else {
          if (this.verificationCode.length == 0) {
            this.noVerificationCode = true;
          }
          if (this.phoneNumber.length == 11 && this.alreadyRegister && this.verificationCode.length == 4) {
            this.loginByMobileAndCode();
          }
        }
      },
      // 手机快捷登录
      loginByMobileAndCode() {
        let params = {
          mobile: this.phoneNumber,
          code: this.verificationCode
        }
        this.$axios.user.loginByMobileAndCode(params).then(res => {
          if (res.data.returnCode == 522) {
            this.noRegister = true;
            console.log("未注册");
          } else if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            console.log("登录成功");
            if (data.companyName == '' || data.companyName == null) {
              window.sessionStorage.setItem('registerInfo', JSON.stringify(data));
              this.$MTAmethod.mtaClick('dongminenglicep-2', {regpasswd: true})
              this.$router.push({path: '/manage/reviseInfo', query: {id: 1}});
            } else {
              if (window.sessionStorage.getItem('refer_title') == '账号管理') {
                window.sessionStorage.removeItem('refer_title');
                window.sessionStorage.removeItem('refer_url');
              }
              this.$cookie.setAuth(data);
              window.sessionStorage.setItem('register', 1);
              this.$router.replace({path: '/loadPass'});
            }
          } else if (res.data.returnCode == 521) {
            this.verificationCodeErr = true;
            this.verificationCode = '';
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      // 提交 登陆
      mobileLogin() {
        let params = {
          mobile: this.phoneNumber,
          password: this.password,
        }
        this.$axios.user.mobileLogin(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            if (data.companyName == '' || data.companyName == null) {
              window.sessionStorage.setItem('registerInfo', JSON.stringify(data));
              this.$MTAmethod.mtaClick('dongminenglicep-2', {regpasswd: true})
              this.$router.push({path: '/manage/reviseInfo', query: {id: 1}});
            } else {
              if (window.sessionStorage.getItem('refer_title') == '账号管理') {
                window.sessionStorage.removeItem('refer_title');
                window.sessionStorage.removeItem('refer_url');
              }
              this.$cookie.setAuth(data);
              window.sessionStorage.setItem('register', 1);
              this.$router.replace({path: '/loadPass'});
            }
          } else if (res.data.returnCode == -1) {
            if (res.data.returnMsg == '密码错误！') {
              this.passwordErr = true;
            }
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg + '(' + res.data.returnCode + ')',
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      blurPhone() {
        this.phoneInfo = false;
        if (this.phoneNumber.length == 0) {
          this.noPhoneNumber = true;
        } else {
          this.phoneNumberErr = !this.isPoneAvailable(this.phoneNumber);
          if (this.phoneNumber.length == 11) {
            this.checkMobileExist();
          }
        }
        this.resolveBug();
      },
      resetPhone() {
        this.phoneInfo = true;
        this.alreadyRegister = false;
        this.phoneNumberErr = false;
        this.noPhoneNumber = false;
      },
      checkMobileExist() {
        let params = {
          mobile: this.phoneNumber,
        }
        this.$axios.user.checkMobileExist(params).then(res => {
          if (res.data.returnCode == -1) {
            this.alreadyRegister = true
            console.log("已注册");
            // this.$router.replace({path: '/login', query: {mobile: this.phoneNumber}});
          } else if (res.data.returnCode == 1) {
            this.noRegister = true;
            console.log("未注册");
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      checkPhone(val) {
        this.alreadyRegister = true;
        this.noRegister = false;
        this.phoneNumber = this.phoneNumber.trim();
        if (this.phoneNumber.length == 11) {
          this.phoneNumberErr = !this.isPoneAvailable(this.phoneNumber)
          if (!this.phoneNumberErr) {
            this.checkMobileExist();
          }
        } else if (this.phoneNumber.length > 11) {
          this.phoneNumberErr = true;
        } else {
          this.phoneNumberErr = false;
        }
      },
      isPoneAvailable(str) {
        if (str != '') {
          let myreg = /^[1][0-9]{10}$/;
          if (!myreg.test(str)) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      forget() {
        this.$router.push({path: '/reset'})
      },
      registerGo() {
        this.$router.push({path: '/login/register'})
      },
      closeEye() {
        $(".password").attr('type', 'text');
        this.eyeState = false;
      },
      openEye() {
        $(".password").attr('type', 'password');
        this.eyeState = true;
      },
      getVerificationCode() {
        if (this.phoneNumber.length == 0) {
          this.noPhoneNumber = true;
        } else {
          if (this.alreadyRegister && !this.phoneNumberErr) {
            if (this.verificationTime == 0) {
              this.getNum();
            } else {
              this.errorText = '';
              this.regError = false;
              this.deleteInfo = true;
              this.changeReg();
              this.regnumber = '';
            }
          }
        }
      },
      getNum() {
        let params = {
          mobile: this.phoneNumber,
          type: 'login'  // 登录发短信
        }
        this.$axios.user.sendSmsCode('GET', params).then(res => {
          if (res.data.returnCode == -1) {
            this.show6 = true;
          } else if (res.data.returnCode == 1) {
            this.verificationTime++;
            this.timeDown();
          }
          console.log(res)
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 倒计时
      timeDown() {
        this.countDownTime = false;
        this.setTimeDown = setInterval(() => {
          if (this.timer > 0) {
            this.timer--;
            this.countDown = this.timer
            if (this.timer < 10) {
              this.countDown = `0${this.timer}`;
            }
          } else {
            clearInterval(this.setTimeDown)
            this.countDownTime = true;
            this.timer = this.countDown = 60;

            // this.$router.push({path: '/rule', query: {from: 'apply'}})
          }
        }, 1000)
      },
      // 弹框
      confirmClick() {
        if (this.regnumber.length == 0) {
          this.errorText = '请输入验证码';
          this.regError = true;
        } else if (this.regnumber.length > 0 && this.regnumber.length < 4) {
          this.regError = true;
          this.errorText = '验证码输入错误';
        } else {
          this.apiImgCodeCheck();
        }
      },
      changeReg() {
        this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
        $("#changeRegimg").attr({src: this.ImageCode, alt: "验证码"});
      }
    }
  }
</script>
<style lang="scss">
  .pauseInfoDialog {
    .weui-dialog__bd:first-child {
      padding: 26px 12px;
    }
  }
  .pauseInfoDialogInfo {
    .weui-dialog .weui-dialog__bd {
      height: auto;
      padding: 16px 10px 12px 10px;
    }
    .weui-dialog__btn.weui-dialog__btn_primary {
      margin-top: 1px;
    }
  }
</style>

<style scoped lang="scss">
  #login {
    width: 100%;
    .logon-left, .logon-right {
      font-size: 12px;
      font-weight: 400;
      color: rgba(251, 72, 16, 1);
      margin-top: 6px;
    }
    .logon-right {
      text-align: right;
    }
    .information {
      width: 100%;
      // border-bottom: 1px solid #E3E3E3;
    }
    p {
      height: 17px;
    }
    .phoneNumber {
      .wrong {
        bottom: 15px;
      }
      position: relative;
      .verCode {
        width: 100%;
        position: relative;
        input {
          width: 73%;
          border: none;
          font-weight: 500;
        }
        span {
          // flex-grow: 1;
          display: inline-block;
          height: 15px;
          border-left: 1px solid #E3E3E3;
          width: 25%;
          padding-left: 7px;
          line-height: 15px;
          font-size: 15px;
          font-weight: 400;
          text-align: right;
          color: rgba(50, 50, 50, 1);
          margin-bottom: 13px;
        }
      }
      .grayCode {
        position: relative;
        font-size: 15px;
        font-weight: 400;
        color: rgba(174, 174, 174, 1);
        div {
          display: inline-block;
          width: 73%;
          height: 42px;
          line-height: 42px;
          border: none;
          font-weight: 400;
        }
        span {
          display: inline-block;
          height: 15px;
          border-left: 1px solid #E3E3E3;
          width: 25%;
          padding-left: 7px;
          // line-height: 42px;
          line-height: 15px;
          text-align: right;
          margin-bottom: 13px;
        }
      }
    }
    .grayprompt {
      .prompt {
        color: rgba(174, 174, 174, 1);
      }
    }
    .prompt {
      margin: 3px 0 34px 0;
      font-size: 13px;
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
      line-height: 18px;
    }
    input {
      width: 100%;
      height: 42px;
      border: none;
      font-size: 15px;
      font-weight: 500;
      color: #323232;
    }
    .grayDiv {
      width: 100%;
      height: 42px;
      border: none;
      font-size: 15px;
      font-weight: 400;
      line-height: 42px;
      // vertical-align: middle;
      color: rgba(174, 174, 174, 1);
    }
    button {
      display: block;
      width: 100%;
      height: 50px;
      text-align: center;
      border-radius: 2px;
      border: 0;
      background: #ffb148;
      color: #FFFFFF;
      font-size: 18px;
      border-radius: 2px;
    }
    .newUser {
      font-size: 13px;
      font-weight: 400;
      color: rgba(40, 50, 65, 1);
      margin: 15px 0 63px 0;
      text-align: center;
    }
    .regbox {
      width: 100%;
      height: 50px;
      // border-radius: 2px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: 1px solid #E3E3E3;
      input {
        width: 70%;
        border: none;
        font-weight: 500;
      }
      img {
        width: 30%;
        border-radius: 2px;
        height: 35px;
        border: 1px solid #E3E3E3;
        margin-bottom: 0px;
      }
      .wrong {
        top: 5px;
      }
    }
    .pauseInfo {
      text-align: justify;
      font-size: 14px;
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
    }
    .wrong, .closeEye, .openEye {
      width: 20px;
      height: 14px;
      color: #fff;
      position: absolute;
      right: 10px;
      top: 15px;
      bottom: 0;
      margin: auto;
      // border-radius: 50%;
      background-size: contain;
    }
    .wrong {
      width: 16px;
      height: 16px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/login/wrong.jpg");
    }
    .closeEye {
      top: 5px;
      right: 8px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/login/closeEye.jpg");
    }
    .openEye {
      top: 5px;
      right: 8px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/login/openEye.jpg");
    }
  }

</style>
