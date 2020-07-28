<template>
  <div id="reg">
    <div class="title">注册信公小安!</div>
    <div class="step content">
      <div class="circle c1">1</div>
      <div class="line line1"></div>
      <div class="circle c2" :class="{gray:step<2}">2</div>
      <div class="line line2" :class="{lineActive: step >= 2}"></div>
      <div class="circle c3" :class="{gray:step<3}">3</div>
    </div>
    <el-row class="steptitle content">
      <el-col class="colorAct" :span="2">创建账户</el-col>
      <el-col class="colorGray" :class="{colorAct:step>=2}" :span="20">完善个人信息</el-col>
      <el-col class="colorGray" :class="{colorAct:step>=3}" :span="2">注册成功</el-col>
    </el-row>
    <div class="phoneCode content" v-if="step===0">
      <div class="reginfo">
        <v-input :id="'regmobile'" :text="'手机号'" :regx="'mobile'" :errmsg="errmsg" :maxlength="'11'"
            v-model="mobile" :noneValue="noneValue" @cleanNum="cleanNum" @checkMobile="checkMobile"></v-input>
        <!-- <i class="eyes" :class="{'cleanUp':mobile.length > 0}" @click="cleanUp"></i> -->
        <template v-if="!isRegister && mobile.length == 11">
          <v-input :id="'regpwd'" :text="'设置登录密码(6-20位密码)'" :regx="'password'" :errmsg="'密码6-20位'"
              v-model="pwd" :noneValue="noneValue"></v-input>
          <v-input :id="'regsmscode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'" :tip="smsCodeTip"
              v-model="smsCode" :noneValue="noneValue"></v-input>
          <span class="sendMCode" @click="sendsmscode()">{{getCodeTxt}}</span>
          <div class="agree">
            <div>
              <el-checkbox v-model="checked"></el-checkbox>
              我已阅读并同意<a href="/agreement" target="_blank" style="text-decoration: underline">《信公小安用户协议》</a>
            </div>
          </div>
        </template>
        <el-button v-if="account" class="regbtn" type="primary" style="margin-top: 30px" @click="stepAccount">创建账户</el-button>
        <el-button v-else class="regbtn" type="primary" style="margin-top: 30px" @click="stepLogin">去登录</el-button>
      </div>
    </div>
    <div class="step2 content" v-else-if="step===2">
      <div class="reginfo">
        <v-personEdit :stype="'add'" :weixinNick="weixinNick" :register="true" :userName="userName" @submitForm="step3"></v-personEdit>
        <!--<el-button class="regbtn" type="primary" @click="step3">注 册</el-button>-->
      </div>
    </div>
    <div class="step3 content" v-else-if="step===3">
      <div class="reginfo">
        <img src="https://oss.in-hope.cn/xiaoan/web_static/qrcodetest.png">
        <p><a href="#">你已成功注册信公小安！</a>扫码关注，添加移动董办工具！</p>
        <p><span class="red">{{times}}S</span>后系统自动跳转至首页</p>
        <el-button class="regbtn" type="primary" @click="step4">立即跳转</el-button>
      </div>
    </div>
    <el-dialog v-if="codeDialog" class="authDialog" :close-on-click-modal='false' title="填写验证码" :visible.sync="codeDialog" width="355px" center top="28vh">
      <div class="message">
        <v-input :id="'txtimgcode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'" :maxlength="'4'"
                  v-model="imgcode" :noneValue="codeValue" :codeErrmsg="codeErrmsg" @codeMsg="codeMsg"></v-input>
        <img class="imgcode" :src="imageUrl" alt="验证码" @click="getImageCode">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="imgcodecheck">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import input from './components/input'
  import personEdit from '../../components/personEdit'
  import qrcodewx from '@/components/qrcodewx'
  import agreement from '@/components/agreement'
  export default {
    data() {
      return {
        step: 0,
        unionid: '',
        mobile: '',
        smsCode: '',
        smsCodeTip: '',
        pwd: '',
        checked: false,
        regUserId: '',
        times: 3,
        getCodeTime: 0,
        getCodeTxt: '获取验证码',
        wxScanRedirectUrl: '',
        weixinNick: '',
        isRoadShowChina: false,
        errmsg: '手机号输入错误',
        register: 'phone',
        isRegister: true,
        account: true,
        codeDialog: false,
        codeIndex: 0,
        imgcode: '',
        imageUrl: '',
        codeErrmsg: '',
        noneValue: 1,
        codeValue: 1,
        imgCodeIndex: 0,
        userName: ''
      }
    },
    components: {
      'v-input': input,
      'v-personEdit': personEdit,
      'v-qrcodewx': qrcodewx,
      'v-agreement': agreement
    },
    watch: {
      'mobile': function() {
        this.smsCode = '';
        this.pwd = '';
        this.checked = false;
        this.mobile = this.$common.Trim(this.mobile);
      }
    },
    methods: {
      qrCode() {
        let state = this.$common.uuid()
        let obj = new WxLogin({
          id: 'qrcode',
          appid: this.$api.appid,
          scope: 'snsapi_login',
          redirect_uri: this.$api.host + 'register',
          state: state,
          style: 'black',
          href: '' // http://test.web.in-hope.com.cn/static/css/wxcss.css
        });
      },
      loginbyqrcode() {
        let code = this.$route.query.code
        let state = this.$route.query.state
        if (code) {
          this.step = 1
          this.$http({
            method: 'POST',
            message: 'none',
            url: this.$api.user.loginbyqrcode,
            params: {
              code: code,
              state: state
            }
          }).then((res) => {
            if (res.data.returnCode === 1) {
              // 扫码登录成功
              let dataObj = res.data.returnObject
              this.$auth.setStore(this, res.data.returnObject)
              if (!dataObj.realName) {
                this.step = 2
              } else {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '微信号已经绑定，登录成功'})
                this.$router.push('/index')
              }
            } else if (res.data.returnCode === 511) {
              // 扫码登录失败，开始注册流程
              this.wxlogin_step = 1
              this.unionid = res.data.returnObject.unionid
            } else if (res.data.returnCode === 512) {
              // code失效，重新扫码
              this.wxlogin_step = 0
              this.qrCode()
              this.$message({showClose: true, type: 'error', duration: 3000, message: 'code失效，请重新扫码'})
            }
          })
        }
      },
      sendsmscode() {
        if (this.getCodeTime <= 0) {
          let mobileregx = !this.$regx.telphone(this.mobile)
          if (mobileregx) {
            document.querySelector('#regmobile').focus()
            return false
          }
          if (this.codeIndex > 0) {
            this.codeDialog = true;
            this.codeErrmsg = '';
            this.getImageCode();
            return false
          }
          this.smsCode = '';
          this.$db.dataUser.sendsmscode(this, this.mobile, 'register')
            .then((res) => {
              if (res.data.returnCode === 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '验证码发送成功'})
                this.codeIndex++;
                this.getCodeTime = 60
                this.codeTime()
              } else {
                this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
                // this.bindSCodeTip = res.data.returnMsg
              }
            })
        }

      },
      imgcodecheck() {
        if (this.imgcode.length < 4) {
          this.codeValue++;
          return false
        }
        let params = {
          code: this.imgcode
        }
        this.$axios.user.imgcodecheck(params).then(res => {
          if (res.data.returnCode == -1) {
            this.codeErrmsg = '验证码不正确！';
            this.imgcode = '';
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
            this.imgcode = '';
            this.sendsmscode();
          }
        })
      },
      cleanNum() {
        this.mobile = '';
      },
      // 获取图片验证码
      getImageCode() {
        this.imageUrl = this.$api.user.imageCode + '?time=' + new Date().getTime()
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
      stepAccount() {
        let mobile_regx = !this.$regx.telphone(this.mobile)
        let code_regx = !this.$regx.imgCode(this.smsCode)
        let pwd_regx = !this.$regx.password(this.pwd)
        if (mobile_regx || code_regx || pwd_regx) {
          this.noneValue++;
          return false
        }
        if (!this.checked) {
          this.$message({showClose: true, type: 'error', duration: 3000, message: '请先同意用户协议'})
          return false
        }
        // this.register = 'passWord';
        let pwd = this.$md5(this.pwd);
        var params = {
          mobile: this.mobile,
          smscode: this.smsCode,
          password: pwd,
          isNeedForRoadShow: this.isRoadShowChina // 增加参数
        };
        // , this.unionid
        this.$db.dataUser.mobileregister(this, params).then((res) => {
          if (res.data.returnCode === 1) {
            this.weixinNick = res.data.returnObject.weixinUsername
            sessionStorage.setItem('registerInfo', JSON.stringify(res.data.returnObject));
            // this.setStore(res.data.returnObject)
            // this.$auth.setStore(this, res.data.returnObject)
            this.step = 2
            this.userName = res.data.returnObject.userName;
          } else if (res.data.returnCode === 521) {
            this.$message({showClose: true, type: 'error', duration: 3000, message: '验证码错误'})
          } else if (res.data.returnCode === 601) {
            this.$message({showClose: true, type: 'error', duration: 3000, message: 'code失效，请重新扫码'})
            location.href = '/register'
          } else if (res.data.returnCode === 602) {
            this.$message({showClose: true, type: 'error', duration: 3000, message: '手机号已经注册，请更换手机号或者使用手机号登录'})
          }
        })
      },
      stepLogin() {
        this.$router.push({path: '/login'})
      },
      checkMobile(val) {
        this.isRegister = val;
        val ? this.account = false : this.account = true;
      },
      codeMsg() {
        this.codeErrmsg = '';
      },
      step3() {
        this.step = 3
        setTimeout(() => {
          this.times--
          if (this.times <= 0) {
            this.$router.push('/index')
          } else {
            this.step3()
          }
        }, 1000)
      },
      step4() {
        this.$router.push('/index')
      }
    },
    // 生命周期函数
    created() {
      this.wxScanRedirectUrl = this.$api.host + 'register'
      let step = this.$route.query.step
      if (step === '2') {
        this.step = 2
      }
      this.loginbyqrcode();
      this.getImageCode();
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  input:-webkit-autofill {-webkit-box-shadow: 0 0 0px 1000px white inset;}
  #reg {
    min-height: 650px;
    .authDialog {
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
    .ts {
      transition: all .3s;
    }
    .xn-input {
      position: relative;
      height: 80px;
      &::before {
        content:"";
        position: absolute;
        bottom: 35px;
        height: 1px;
        width: 100%;
      }
      .lbl {
        transform: translateY(40px);
        color: rgba(0,0,0,.38);
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
      }
      .txt {
        height: 40px;
        width:100%;
        border:0;
        caret-color: #ffb148;
        border-bottom:1px solid #e3e3e3;
      }
      .txterr {
        border-bottom:1px solid #fb4319;
      }
      .txtinput {
        border-bottom:1px solid #ffb148;
      }
      .errmsg {
        position: relative;
        bottom: 0;
        text-align: right;
        color:#fb4319;
        width:100%;
        height:30px;
        line-height: 30px;
        font-size: 14px;

      }
      .imgcode {
        position: absolute;
        top: 34px;
        right: 0;
        width: 100px;
        height: 40px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .xn-input-active {
      .lbl {
        transform: translatey(10px);
        color: rgba(0,0,0,.38);
        font-size: 14px;
      }
    }
    a, .linka {
      color: #ffb148;
      transition: all .3s;
      cursor: pointer;
    }
    a:hover, .linka:hover {
      color: lighten(#ffb148, 10%);
    }

    .colorAct {
      color: #ffb148 !important;
    }
    .colorGray {
      color: #8d8d8d;
    }
    .red {color: red;}
    .title {
      height: 80px;
      line-height: 100px;
      text-align: center;
      color: #ffb148;
      font-weight: 600;
      font-size: 18px;
    }
    .regbtn {
      width: 220px;
      height: 40px;
      font-size: 17px;
      margin-left: 80px;
    }
    .steptitle {
      padding-bottom: 20px;
    }
    .step {
      background-color: #f8f8f8;
      height: 60px;
      border-radius: 2px;
      .circle {
        position: absolute;
        width: 26px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        color: #fff;
        font-size: 18px;
        margin-top: 17px;
        border-radius: 50%;
        background-color: #ffb148;
        z-index: 100;
        &:before {
          content: '';
          position: absolute;
          left: -7px;
          top: -7px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 177, 72, .4);
        }
      }
      .gray {
        margin-top: 10px;
        margin-left: -20px !important;
        width: 40px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        background-color: #ebe7de;
        z-index: 100;
        &:before {
          content: '';
          width: 0;
          height: 0;
        }
      }
      .c1 {
        left: 27px;
      }
      .c2 {
        left: 50%;
        margin-left: -12.5px;
      }
      .c3 {
        right: 27px;
      }
      .line {
        position: absolute;
        width: 530px;
        height: 5px;
        top: 50%;
        margin-top: -2.5px;
        background-color: #ffb148;
      }
      .line1 {
        left: 58px;
      }
      .line2 {
        left: 612px;
        background-color: #ebe7de;
      }
      .lineActive {
        background-color: #ffb148 !important;
      }
      .stepbox {
        text-align: center;
      }
    }
    .step0 {
      text-align: center;
      border: 1px solid #e3e3e3;
      border-radius: 5px;
      margin-top: 20px;
      height: 500px;
      margin-bottom: 40px;
      .regqrcode {
        margin-top: 80px;
      }
    }
    .phoneCode {
      min-height: 520px;
      border: 1px solid #e3e3e3;
      margin-bottom: 40px;
      padding-bottom: 30px;
      .eyes {
        position: absolute;
        display: inline-block;
        width: 22px;
        height: 15px;
        right: 10px;
        bottom:10px;
        font-size: 20px;
        cursor: pointer;
      }
      .cleanUp {
        background: url('https://oss.in-hope.cn/xiaoan/web_static/off.png') no-repeat
      }
      .reginfo {
        margin-left: 400px;
        width: 390px;
        .sendMCode {
          color: #ffb148;
          display: block;
          float: right;
          position: relative;
          margin-top: -30px;
          cursor: pointer;
        }
        .agree {
          font-size: 14px;
          padding-top: 30px;
          .check-roadshow {
            display: flex;
            margin-top: 10px;
            .row {
              flex: 1;
              &.left {
                flex: inherit;
              }
              &.right {
                padding-left: 3px;
              }
            }
          }
        }
      }
    }
    .step2 {
      /*height: 710px;*/
      border: 1px solid #e3e3e3;
      margin-bottom: 40px;
      .reginfo {
        margin-left: 350px;
        margin-top: 20px;
        width: 390px;
      }
    }
    .step3 {
      height: 400px;
      border: 1px solid #e3e3e3;
      padding: 40px;
      margin-bottom: 40px;
      .reginfo {
        text-align: center;
      }
      p {
        padding: 5px;
      }
      .regbtn {
        margin-left: 0 !important;
        margin-top: 20px;
      }
    }
    .el-col-2, .el-col-20 {
      text-align: center;
      margin-top: 15px;
    }
  }
</style>
