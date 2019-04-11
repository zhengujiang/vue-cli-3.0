<template>
   <div id="bindPhone">
    <p class="logon-left">
      <span v-show="this.$route.query.bind">该微信尚未绑定手机号，请输入手机号进行绑定！</span>
    </p>
    <div class="phoneNumber">
      <div style="border-bottom: 1px solid #E3E3E3;">
        <input @focus="resetPhone" maxlength="11" @blur="blurPhone" @input="checkPhone" type="text" v-model="phoneNumber" placeholder="手机号">
        <b @click="phoneNumber=''" v-show="phoneNumber.length>0 && phoneInfo" class="wrong"></b>
      </div>
    </div>
    <div class="phoneNumber">
      <p v-show="!alreadyBind" class="logon-right">
        <span v-show="noRegister">该手机号未注册,请先注册</span>
        <span v-show="phoneNumberErr">手机号输入错误</span>
        <span v-show="noPhoneNumber">请输入手机号</span>
      </p>
      <span v-show="alreadyBind" class="logon-left" >该手机号已和其它手机号绑定，请先登录，登录后可在个人中心更改绑定微信</span>
      <div v-show="promptInfo == '绑定'" class="verCode">
        <input @focus="resetVeri" @blur="blurVeri" @input="verificationCode = verificationCode.trim();" class="verificationCode" type="text" maxlength="4" v-model="verificationCode" placeholder="验证码">
        <b @click="verificationCode=''" v-show="verificationCode.length>0 && removeState" style="right:28%" class="wrong"></b>
        <span v-if="countDownTime" @click="getVerificationCode">获取验证码</span>
        <span style="color: rgba(141,141,141,1); text-align:center" v-else>{{countDown}}&nbsp;S</span>
      </div>
      <div v-show="promptInfo == '去注册' || promptInfo == '去登录'">
        <div class="grayCode">
          <div>验证码</div>
          <span>获取验证码</span>
        </div>
      </div>
    </div>
    <p class="logon-right">
      <span v-show="verificationCodeErr">验证码输入错误</span>
      <span v-show="noVerificationCode">请输入验证码</span>
    </p>
    <button v-if="promptInfo == '绑定'" type="button" @click="bindGo">绑定</button>
    <button v-if="promptInfo == '去注册'" type="button" @click="registerGo">去注册</button>
    <button v-if="promptInfo == '去登录'" type="button" @click="loginGo">去登录</button>
    <div v-transfer-dom>
      <confirm v-model="deleteInfo" :close-on-confirm="false" :title="''" @on-confirm="confirmClick">
        <div class="regnum">
          <div class="regbox">
            <input ref="regDom" @focus="resetRegnumber" @blur="blurRegnumber" @input="regnumber = regnumber.trim();" type="text" v-model="regnumber" placeholder="验证码" maxlength="4">
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
  </div>
</template>
<script>
  import {Confirm} from 'vux'
  export default {
    name: "bindPhone",
    components: {
      Confirm
    },
    data() {
      return {
        regnumberInfo: false,
        removeState:false,
        phoneInfo: false,
        codeTime: 0,
        promptInfo: "绑定",
        regnumber: "",
        alreadyBind: false,
        noVerificationCode: false,
        verificationCodeErr: false,
        passwordLength: false,
        phoneNumberErr: false,
        noRegister: false,
        noPhoneNumber: false,
        alreadyRegister: false,
        shadowBox: false,
        chengseduigou: this.$image.personal.chengseduigou,
        checked: false,
        deleteInfo: false,
        countDownTime: true,
        timer: 60,
        countDown: 60,
        verificationCode: "",
        eyeState: true,
        phoneNumber: "",
        oldPassword: "",
        password: "",
        reg: "",
        ImageCode: "",
        regError: false,
        errorText: "",
        show6: false,
        verificationTime: 0
      }
    },
    created() {
      this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
    },
    mounted () {
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/home'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    destroyed () {
    },
    methods: {
      onConfirm () {
        this.show6 = false;
      },
      resetRegnumber () {
        this.regnumberInfo = true;
        this.regError = false;
        this.errorText = '';
      },
      blurRegnumber () {
        this.regnumberInfo = false;
        if (this.regnumber.length == 0) {
          this.regError = true;
          this.errorText = '请输入验证码';
        } else if (this.regnumber.length > 0 && this.regnumber.length < 4) {
          this.regError = true;
          this.errorText = '验证码输入错误';
        }
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
      bindGo () {
        if (this.verificationCode.length == 0) {
          this.verificationCodeErr = false;
          this.noVerificationCode = true;
        }
        if (this.phoneNumber.length == 11 && this.alreadyBind == false && this.verificationCode.length == 4) {
          this.bindingWxInfoByCode();
        }
      },
      // 绑定手机
      bindingWxInfoByCode() {
        let params = {
          code: this.verificationCode,
          mobile: this.phoneNumber
        }
        this.$axios.user.bindingWxInfoByCode(params).then(res => {
          if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            this.$cookie.setAuth(data);
            if (data.companyName == '' || data.companyName == null) {
              this.$MTAmethod.mtaClick('dongminenglicep-2', {regpasswd: true})
              this.$router.push({path: '/manage/reviseInfo', query: {id: 1}});
            } else {
              window.sessionStorage.setItem('register', 1);
              this.$router.replace({path: '/loadPass'});
            }
            window.sessionStorage.setItem('register', 3);
            this.$router.replace({path: '/loadPass'});
            if (window.sessionStorage.getItem('refer_title') == '账号管理') {
              window.sessionStorage.removeItem('refer_title');
              window.sessionStorage.removeItem('refer_url');
            }
            // window.sessionStorage.removeItem('refer_title');
            // window.sessionStorage.removeItem('refer_url');
          } else if (res.data.returnCode == 100) {
            this.$vux.toast.show({
              text: res.data.returnMsg + '(' + res.data.returnCode + ')',
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          } else if (res.data.returnCode == 521) {
            this.verificationCodeErr = true;
            this.verificationCode = '';
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      blurVeri () {
        this.removeState = false;
        if (this.verificationCode.length == 0) {
          this.verificationCodeErr = false;
          this.noVerificationCode = true;
        }
        if (this.verificationCode.length > 0 && this.verificationCode.length < 4) {
          this.verificationCodeErr = true;
          this.noVerificationCode = false;
        }
      },
      resetVeri () {
        this.removeState = true;
        this.verificationCodeErr = false;
        this.noVerificationCode = false;
      },
      getVerificationCode () {
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
           type: 'modifyMobile'
        }
        this.$axios.user.sendSmsCode('GET',params).then(res => {
          if (res.data.returnCode == -1) {
            this.show6 = true;
            // this.$vux.toast.show({
            //   text: res.data.returnMsg + '(' + res.data.returnCode + ')',
            //   position: 'middle',
            //   type: 'text',
            //   width: 'auto',
            //   time: 2500
            // });
          } else if (res.data.returnCode == 1) {
            this.verificationTime ++;
            this.timeDown();
          }
          console.log(res)
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      changeReg() {
        this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
        $("#changeRegimg").attr({src: this.ImageCode, alt: "验证码"});
      },
      resetPhone() {
        this.phoneInfo = true;
        this.alreadyRegister = false;
        this.phoneNumberErr = false;
        this.noPhoneNumber = false;
      },
      blurPhone () {
        this.phoneInfo = false;
        if (this.phoneNumber.length == 0) {
          this.noPhoneNumber = true;
        } else {
          this.phoneNumberErr = !this.isPoneAvailable(this.phoneNumber);
          if (this.phoneNumber.length == 11) {
            this.checkMobileExist();
          }
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
      loginGo () {
        this.$router.push({path: '/login'})
      },
      closeEye () {
        $(".password").attr('type','text');
        this.eyeState = false;
      },
      openEye () {
        $(".password").attr('type','password');
        this.eyeState = true;
      },
      // 倒计时
      timeDown () {
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
       showInfo() {
        this.shadowBox = true;
      },
      closeInfo() {
        this.shadowBox = false;
      },
      checkPhone () {
        this.alreadyBind = false;
        this.promptInfo = '绑定';
        this.noRegister = false;
        this.alreadyRegister = false;
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
          let myreg=/^[1][0-9]{10}$/;
          if (!myreg.test(str)) {
              return false;
          } else {
              return true;
          }
        } else {
          return true;
        }
      },
      checkMobileExist () {
        let params = {
          mobile: this.phoneNumber,
        }
        this.$axios.user.checkMobileExist(params).then(res => {
          if (res.data.returnCode == -1) {
            this.alreadyRegister = true
            console.log("已注册");
            this.checkMobileBindWeixin();
            // this.$router.replace({path: '/login', query: {mobile: this.phoneNumber}});
          } else if (res.data.returnCode == 1) {
            this.noRegister = true;
            this.promptInfo = '去注册';
            console.log("未注册");
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      // 检查手机是否已绑定微信
      checkMobileBindWeixin () {
        let params = {
          mobile: this.phoneNumber,
        }
        this.$axios.user.checkMobileBindWeixin(params).then(res => {
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.alreadyBind = true;
              this.promptInfo = '去登录';
            } else {
              this.alreadyBind = false;
              this.promptInfo = '绑定';
            }
          } else if (res.data.returnCode == 522) {

          }
        }).catch((err) => {
          console.error(err);
        });
      },
      registerGo () {
        this.$router.push('/login/register');
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
</style>

<style scoped lang="scss">
  #bindPhone {
    .logon-left, .logon-right {
      height: 17px;
      font-size:12px;
      font-weight:400;
      color:rgba(251,72,16,1);
      margin-top: 6px;
    }
    .logon-right {
      text-align: right;
    }
    .phoneNumber {
      height: auto;
      position: relative;
      .wrong {
        bottom: 15px;
      }
      .verCode {
        width: 100%;
        position: relative;
        border-bottom: 1px solid #E3E3E3;
        input {
          width: 73%;
          border: none;
          font-weight: 500;
        }
        span {
          display: inline-block;
          height: 15px;
          border-left: 1px solid #E3E3E3;
          width: 25%;
          padding-left: 7px;
          line-height: 15px;
          font-size:15px;
          text-align: right;
          font-weight:400;
          color:rgba(50,50,50,1);
          margin-bottom: 13px;
        }
      }
    }
    input {
      width: 100%;
      height: 42px;
      border: none;
      font-size: 15px;
      font-weight: 500;
      vertical-align: bottom;
      color:#323232;
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
      margin-top: 30px;
    }
    .grayCode {
      width: 100%;
      position: relative;
      font-size: 15px;
      font-weight: 400;
      color: rgba(174,174,174,1);
      border-bottom: 1px solid #E3E3E3;
      div {
        display: inline-block;
        width: 73%;
        height: 42px;
        line-height: 42px;
        border: none;
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
    .wrong {
      width: 16px;
      height: 16px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/login/wrong.jpg");
      color: #fff;
      position: absolute;
      right: 10px;
      top: 15px;
      bottom: 0;
      margin: auto;
      // border-radius: 50%;
      background-size: contain;
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
        border-radius:2px;
        height: 35px;
        border: 1px solid #E3E3E3;
        margin-bottom: 0px;
      }
      .wrong {
        top: 5px;
      }
    }
  }
</style>
