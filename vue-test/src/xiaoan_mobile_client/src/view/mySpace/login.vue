<template>
  <div class="xa-userLogin">
    <div class="header">
      <div class="user">
        <div class="back">
          <img v-lazy="imgSrc" alt=""></div>
        <div class="spanBox"><span>{{phone}}已注册，请登录</span></div>
      </div>
    </div>
    <div class="phone">
      <div class="enter" :class="{borderColor: enterColor}">
        <span>密&emsp;码</span>
        <input id="inputDom" ref="inputDom" type="password" placeholder="请输入6-20位密码" v-model="password"
               @input="inputPassword"
               @focus="focusPassword" @blur="blurPassword">
        <i @click="()=>{this.password = '';this.showErr = false}" v-show="this.password.length > 0"
           class="icon iconfont icon-X bbb"></i>
      </div>
      <p class="error passerror" v-show="showErr">{{errorText[0]}}</p>
    </div>
    <div class="regnum">
      <div class="regbox" :class="{borderColor:regColor}">
        <span>验证码</span>
        <input ref="regDom" type="tel" v-model="regnumber" @input="regInput" @focus="focusReg" @blur="blurReg"
               placeholder="请输入验证码">
        <img :src="ImageCode" alt="验证码" @click="changeReg" id="changeRegImg">
      </div>
      <p class="error regerr" v-show="regError">{{errorText[1]}}</p>
    </div>
    <div class="next">
      <button @click="mobileLogin()" class="pass">{{errorText[2]}}</button>
    </div>
    <p class="forgetPass" @click="forget">
      <span></span><span class="fa-add">{{errorText[3]}}</span><span></span>
    </p>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        phone: "",
        phones: "", //未处理手机号码
        password: "",
        regnumber: "",
        imgSrc: this.$image.personal.timg,
        ImageCode: "",
        showErr: false,
        showregErr: true,
        regError: false,
        errorText: ['请输入6-20位密码！', '验证码输入有误！', '登录', '找回密码'],
        userHome: {},
        enterColor: false,
        regColor: false,
      }
    },
    watch: {
      'password': function (val) {
        console.log(val);
      },
      'regnumber': function (val) {
        if (val.length < 4) {
          this.regError = true;
          this.showregErr = this.regError;
        } else {
          this.regError = false;
          this.showregErr = this.regError;
        }
        console.log('234324', val, this.regError);
      }
    },
    created() {
      let mobile = this.$route.query.mobile;
      this.phones = mobile;
      this.phone = mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
      let user_id = this.$cookie.getCookie("userId");
      if (user_id) {
        this.userHome = window.JSON.parse(window.localStorage.getItem('wx-auth'));
        this.imgSrc = this.userHome.headImgUrl;
        this.$router.replace({path: '/my'});
      } else {
        this.userHome = window.JSON.parse(window.localStorage.getItem('wx-auth'));
        this.imgSrc = this.userHome.headImgUrl;
      }
    },
    mounted() {
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/my'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      inputPassword() {
        this.password = this.$array.trim(this.password);
      },
      // 密码框 focus
      focusPassword() {
        this.enterColor = true;
        this.showErr = false;
      },
      //密码框 blur
      blurPassword() {
        this.enterColor = false;
        let regExp = /^([a-z0-9\，\。\,\.\@\!\#\$\%\^\&\-\_\=\+\<\>\/\*\(\)]){6,20}$/i;
        this.showErr = !regExp.test(this.password);
        console.log('showErr' + this.showErr);
      },
      // 验证码框 focus
      focusReg() {
        this.regColor = true;
        this.regError = false;
      },
      // 验证码框 blur
      blurReg() {
        this.regColor = false;
        if (this.regnumber.length == 0) {
          this.regError = true;
          this.errorText[1] = '请输入验证码！';
        } else if (this.regnumber.length < 4 || this.regnumber.length > 4) {
          this.regError = true;
          this.errorText[1] = '验证码输入有误！';
          this.changeReg();
        }
      },
      // 点击切换验证码
      changeReg() {
        this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
      },
      //  验证码框 change
      regInput() {
        this.regnumber = this.$array.trim(this.regnumber);
        this.regnumber = this.regnumber.substring(0, 4);
        if (this.regnumber.length == 0) {
          this.errorText[1] = '请输入验证码！';
        } else if (this.regnumber.length >= 4) {
          this.errorText[1] = '验证码输入有误！';
          this.apiImgCodeCheck();
        }
      },
      // 验证码 验证方法
      apiImgCodeCheck() {
        let params = {code: this.regnumber}
        this.$axios.user.imgCodeCheck(params).then(res => {
          console.log(res);
          if (res.data.returnCode == -1) {
            this.errorText[1] = '验证码不正确！';
            this.regnumber = '';
            this.changeReg();
            this.regError = true;
          } else if (res.data.returnCode == 1 && this.showErr == false) {
            this.regError = false;
            this.$refs.regDom.blur();
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      // 提交 登陆
      mobileLogin() {
        if (this.showregErr) {
          if (this.password.length < 6) {
            this.showErr = true;
          }
          if (this.regnumber.length < 4) {
            this.regError = true;
          }
          console.log('1234567890', this.password);
        } else {
          let params = {
             mobile: this.phones,
             password: this.password,
          }
          this.$axios.user.mobileLogin(params).then(res => {
            console.log('mobileLogin', res);
            if (res.data.returnCode == 1) {
              let data = res.data.returnObject;
              this.$cookie.setAuth(data);
              // window.localStorage.setItem("token", res.data.returnObject.token);
              // window.localStorage.setItem("weixinId", res.data.returnObject.weixinId);
              // let wx = window.JSON.stringify(res.data.returnObject);
              // window.localStorage.setItem('wx-my-home', wx);
              window.sessionStorage.setItem('register', 1);
              this.$router.push({path: '/loadPass'});
            } else if (res.data.returnCode == -1) {
              this.errorText[0] = res.data.returnMsg;
              this.errorText[1] = '请重新输入验证码！';
              this.showErr = true;
              // 验证码重置
              this.regnumber = '';
              this.password = '';
              this.changeReg();
              // this.$nextTick(() => {
              //     this.$refs.inputDom.focus();
              //     document.querySelector('#inputDom').focus();
              // })
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
        }
      },
      //
      forget() {
        this.$router.push({path: '/reset', query: {phone: this.phones}})
      }
    }
  }
</script>
<style lang="scss">
  .xa-userLogin {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    .header {
      width: 100%;
      height: 100px;
      background: linear-gradient(#ffc155, #ffb048);
      font-family: PingFangSC-Regular, sans-serif;
      color: #fff;
      font-size: 15px;
      position: relative;
      .user {
        width: 100%;
        height: 100%;
        line-height: 65px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        .back {
          width: 54px;
          height: 54px;
          background: #ffd998;
          border-radius: 50%;
          position: absolute;
          left: 0;
          right: 0;
          top: 10px;
          margin: auto;
          z-index: 11;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            /*position: absolute;left:0;right:0;top:12.5px;margin:auto;z-index: 22;*/
          }
        }
        .spanBox {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 10px;
          margin: auto;
          line-height: initial;
          span {
            margin-left: 5px;
          }
        }
      }
    }
    .phone, .regnum {
      width: 100%;
      height: auto;
      font-size: 0;
      padding: 15px 15px 7.5px;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      .enter.borderColor, .regbox.borderColor {
        border: 1px solid #ffb148;
      }

      .enter span, .regbox span {
        display: inline-block;
        height: 38px;
        line-height: 38px;
        box-sizing: border-box;
        padding-left: 8px;
        float: left;
        width: 20%;
        font-size: 15px;
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      }
      .enter input, .regbox input {
        height: 38px;
        background: #f0f1f5;
        font-size: 15px;
        color: #8d8d8d;
        margin: 0;
        padding: 0;
        border: 0;
        outline: none;
      }
    }
    .phone {
      .enter {
        width: 100%;
        height: 40px;
        font-size: 0;
        border-radius: 2px;
        box-sizing: border-box;
        position: relative;
        background: #f0f1f5;
        border: 1px solid #f0f1f5;
        display: inline-block;
        input {
          width: 70%;
          height: 38px;
          background: #f0f1f5;
          font-size: 15px;
          color: #8d8d8d;
          margin: 0;
          padding: 0;
          border: 0;
          outline: none;
        }
      }
      .error {
        display: block;
        color: #fb4319;
        margin: 8px 0 -3px 0;
        font-size: 13px;
      }
      .passerror {
        margin: 6px 0 -2px 0;
      }
    }
    .regnum {
      padding: 0 15px 7.5px;
      .regbox {
        width: 100%;
        height: 40px;
        font-size: 0;
        border-radius: 2px;
        box-sizing: border-box;
        position: relative;
        background: #f0f1f5;
        border: 1px solid #f0f1f5;
        display: inline-block;
        input {
          width: 50%;
          font-size: 15px;
          display: inline-block;
        }
        img {
          height: 36px;
          display: inline-block;
          border: none;
          position: absolute;
          right: 2px;
          top: 0;
          bottom: 0;
          margin: auto;
        }
        i {
          right: 34%
        }
      }
      .error {
        display: block;
        color: #fb4319;
        margin: 8px 0 -3px 0;
        font-size: 13px;
      }
      .regerr {
        margin: 6px 0 -2px 0;
      }
    }
    .next {
      width: 100%;
      height: 65px;
      text-align: center;
      padding: 0 15px 15px;
      box-sizing: border-box;
      button {
        width: 100%;
        height: 100%;
        line-height: 50px;
        color: #fff;
        font-family: PingFangSC-Medium, sans-serif;
        font-size: 18px;
        background: #ffd59c;
        border: 0;
        outline: none;
        border-radius: 2px !important;
      }
      button.pass {
        background: #ffb148;
      }
    }
    .forgetPass {
      width: 100%;
      height: 15px;
      margin: 0;
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 13px;
      color: #ffb249;
      -webkit-box-sizing: border-box;
      display: -webkit-box;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      align-items: center;
      span:nth-of-type(1), span:nth-of-type(3) {
        width: 40%;
        height: 1px;
        box-sizing: border-box;
        background: linear-gradient(to right, #fef7ee, #f8a234);
      }
      span:nth-of-type(3) {
        background: linear-gradient(to left, #fef7ee, #f8a234);
      }
      .fa-add {
        font-size: 14px;
      }
    }
    .bbb, .bbb2 {
      position: absolute;
      right: 10px;
      top: 50%;
      color: #c1c1c1;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }
</style>
