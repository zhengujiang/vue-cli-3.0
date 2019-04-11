<template>
  <transition name="bounce">
    <div class="xiaoan-box revisePassword">
      <div class="revise-password-scroll">
        <form action="" onsubmit=" return false">
          <!---->
          <div class="oldPassword">
            <span>旧密码</span>
            <input type="password" placeholder="请输入旧密码" v-model="oldPassword" @focus="show1" @blur="hide1"
                   @change="b1"><!---->
            <b @click="()=>{this.oldPassword=''}" v-show="this.oldPassword.length>0" class="bbb"></b>
          </div>
          <p class="passErr oldpassErr" v-show="!oldPasswordvalid && oldPassword.length>0">旧密码输入有误！</p>
          <p class="passErr1">请输入旧密码！</p>
          <!---->
          <div class="password">
            <span>新密码</span>
            <input type="password" placeholder="请输入6-20位新密码" v-model="password" @focus="show2" @blur="hide2"
                   @change="b2">
            <b @click="()=>{this.password=''}" v-show="this.password.length>0" class="bbb2"></b>
          </div>
          <p class="passErr newPassErr" v-show="!passvalid && password.length>0">请输入6-20位密码！</p>
          <p class="repeat" v-show="isRepeat">不要使用近期使用过的密码！</p>
          <!---->
          <div class="again">
            <span>再次输入</span>
            <input type="password" placeholder="请再次输入新密码" v-model="apassword" @focus="show3" @blur="hide3"
                   @change="b3">
            <b @click="()=>{this.apassword=''}" v-show="this.apassword.length>0" class="bbb3"></b>
          </div>
          <p class="apassErr" v-show="!apassvalid && apassword.length>0">两次输入不一致！</p>
          <!---->
          <div class="regnum">
            <div class="regbox">
              <span>验证码</span>
              <input type="text" v-model="regnumber" @input="regNumA" placeholder="请输入验证码" @focus="show4"
                     @blur="hide4" @change="b4">
              <img v-lazy="ImageCode" alt="验证码" @click="changeReg()" id="changeRegimg">
              <b @click="()=>{this.regnumber=''}" v-show="this.regnumber.length>0" style="right:37%" class="bbb4"></b>
            </div>
          </div>
          <p class="error regerr" style="display: none">验证码输入有误！</p>
          <p class="next pass" @click="next()">
            <button type="button">保&emsp;存</button>
          </p>
        </form>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: "revisePassword",
    data() {
      return {
        phoneNumber: "",
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
        showregErr: false
      }
    },
    created() {
      this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();;
    },
    mounted: function () {
      var user_id = this.$cookie.getCookie("userId");
      if (user_id) {
        this.userHome();
      }
      this.$nextTick(() => {
        this.iosInput();
      })
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/my'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      regNumA () {
        console.log('121');

      },
      userHome() {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome().then((res) => {
          console.log(res.data.returnObject.mobile)
          this.phoneNumber = res.data.returnObject.mobile;
        }).catch((err) => {
          console.error(err)
        })
      },
      /**/
      iosInput() {
        console.log('65463515165', $("input").length)
        var user = "";
        if (/android/i.test(navigator.userAgent)) {
          //  android
          user = "1";
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          //  ios
          user = "0";
          $("input").css('line-height', '20px')
        }

      },
      changeReg() {
        this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
        $("#changeRegimg").attr({src: this.ImageCode, alt: "验证码"});
      },
      regNum: function () {
        if (this.regnumber.length == 4) {
          this.showregErr = false;
        } else {
          this.showregErr == true;
        }
        console.log(this.showregErr)
        console.log(this.regnumber);

      },
      next() {
        if (this.oldPassword.length == 0 || this.password.length == 0 || this.apassword.length == 0 || this.regnumber.length == 0) {
          return false
        }
        if (this.passvalid == true && this.apassvalid == true && this.showregErr == false && this.isRepeat == false) {
          if (this.oldPassword.length == 0) {
            $(".passErr1").show();
          } else if (this.oldPassword.length !== 0 && this.oldPasswordvalid == true && this.isRepeat == false) {
            $(".passErr1").hide();
            $(".next").css("background", "#ffb148");
            let params = {
                oldPassword: this.oldPassword,
                newPassword: this.password,
                code: this.regnumber
            }
            this.$axios.user.modifyLoginPassword(params).then(res => {
              console.log(res)
              if (res.data.returnCode == '1') {
                window.sessionStorage.setItem("register", 2);
                this.$router.replace('/loadPass');
              } else if (res.data.returnCode == '-1') {
                this.regvalid = true;
                if (res.data.returnMsg == "验证码不正确！") {
                  $(".regerr").text(res.data.returnMsg).show();
                } else if (res.data.returnMsg == "验证码不正确！") {
                  $(".regerr").text(res.data.returnMsg).show();
                } else {
                  $('.oldpassErr').text(res.data.returnMsg).show();
                }
              }
            }).catch((err) => {
              console.error(err)
            })
          }
        } else {
          /*console.log("no submit");*/
        }
      },
      show4() {
        $('.regnum').css('border', '1px solid #ffb148');
        if (this.regnumber.length > 0) {
          $(".bbb4").show();
        }
        $(".regerr").text('验证码输入有误！').hide();
      },
      b4() {
        console.log('222');

        $(".bbb4").hide();
      },
      hide4() {
        $('.regnum').css('border', '1px solid #f0f1f5');
        if (this.regnumber.length == 0) {
          $(".regerr").text('请输入验证码！').show();
        }
      },
      show3() {
        $('.again').css('border', '1px solid #ffb148');
        this.apassvalid = true;
        if (this.apassword.length > 0) {
          $(".bbb3").show();
        }
        $(".apassErr").text('两次输入不一致！').hide();
      },
      b3() {
        $(".bbb3").hide();
      },
      hide3() {
        $('.again').css('border', '1px solid #f0f1f5');

        if (this.apassword.length == 0) {
          $(".apassErr").text('请再次输入新密码！').show();
        } else if (this.apassword.length !== 0) {
          let _this = this;
          if (_this.apassword !== this.password) {
            _this.apassvalid = false;
            /* console.log(_this.apassvalid)*/
          } else {
            _this.apassvalid = true;
            this.password = this.apassword;
          }
        }
      },
      show1() {
        $('.oldPassword').css('border', '1px solid #ffb148');
        this.oldPasswordvalid = true;
        if (this.oldPassword.length > 0) {
          $(".bbb").show();
        }
        $(".passErr1").text('旧密码输入有误！').hide();
        $('.oldpassErr').hide();
      },
      b1() {
        $(".bbb").hide();
      },
      hide1() {
        if (this.oldPassword.length == 0) {
          $(".passErr1").text('请输入旧密码！').show();
        } else if (this.oldPassword.length !== 0) {
          $(".passErr1").text('旧密码输入有误！')
          let regExp1 = /^([a-z0-9\，\。\,\.\@\!\#\$\%\^\&\-\_\=\+\<\>\/\*\(\)]){6,20}$/i;
          this.oldPasswordvalid = regExp1.test(this.oldPassword);
          console.log(this.oldPasswordvalid)
          if (this.password == this.oldPassword && this.oldPassword.length !== 0) {
            this.isRepeat = true;
            console.log(this.isRepeat)
          } else {
            this.isRepeat = false;
          }
        }

        $('.oldPassword').css('border', '1px solid #f0f1f5');

      },
      show2() {
        $('.password').css('border', '1px solid #ffb148');
        this.passvalid = true;
        if (this.password.length > 0) {
          $(".bbb2").show();
        }
        $(".newPassErr").text('请输入6-20位密码！').hide();
        $(".repeat").hide();
      },
      b2() {
        $(".bbb2").hide();
      },
      hide2() {
        $('.password').css('border', '1px solid #f0f1f5');

        if (this.password.length == 0) {
          $(".newPassErr").text('请输入新密码！').show();
          $(".repeat").hide();
        } else if (this.password.length !== 0) {
          console.log(this.password, this.oldPassword)
          if (this.password == this.oldPassword && this.oldPassword.length !== 0) {
            this.isRepeat = true;
            console.log(this.isRepeat)
            /*$(".repeat").show()*/
          } else {
            this.isRepeat = false;
          }
          let regExp = /^([a-z0-9\，\。\,\.\@\!\#\$\%\^\&\-\_\=\+\<\>\/\*\(\)]){6,20}$/i;
          this.passvalid = regExp.test(this.password);
          /*console.log(this.passvalid)*/
          console.log(this.isRepeat)
          let _this = this;
          if (_this.apassword !== this.password) {
            _this.apassvalid = false;
            /* console.log(_this.apassvalid)*/
          } else {
            _this.apassvalid = true;
            this.password = this.apassword;
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .revisePassword {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    position: relative;
    .revise-password-scroll {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      form {
        padding: 15px;
      }
    }
  }
  b {
    width: 15px;
    height: 15px;
    color: #fff;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close.png");
    background-size: contain;
  }
  .oldPassword, .password, .again, .regnum {
    width: 100%;
    height: auto;
    background: #f0f1f5;
    font-size: 0;
    border-radius: 2px;
    margin-bottom: 7.5px;
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #f0f1f5;
  }
  .oldPassword span, .password span, .again span, .regsitor span, .regnum span {
    width: 22%;
    font-size: 0;
    height: 40px;
    font-size: 15px;
    color: #323232;
    box-sizing: border-box;
    padding-left: 7.5px;
    display: inline-block;
    line-height: 40px;
  }
  .password input, .again input, .oldPassword input {
    width: 78%;
    font-size: 0;
    height: 38px;
    background: #f0f1f5;
    font-size: 15px;
    color: #8d8d8d;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .passErr, .apassErr, .passErr1, .repeat {
    margin: 5px 0;
    color: #fb4319;
    font-size: 13px;
  }
  .passErr1 {
    display: none;
  }
  .error {
    margin: -2px 0 5px 0;
    color: #fb4319;
    font-size: 13px;
  }
  .passErr, .apassErr {
    margin-top: -3px;
  }
  .regsitor input {
    width: 43%;
    height: 40px;
    background: #f0f1f5;
    font-size: 15px;
    color: #8d8d8d;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
  }
  .regnum {
    width: 35%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: block;
    font-size: 15px;
    color: #ffb249;
  }
  input[type=checkbox] {
    width: 15px;
    height: 15px;
    border: 0.5px solid #8d8d8d;
    background-color: #f0f1f5;
  }
  .next {
    width: 100%;
    height: 50px;
    margin: 0;
    background: #ffd59c;
    text-align: center;
    border-radius: 2px;
    font-family: PingFangSC-Medium, sans-serif;
    button {
      border: 0;
      height: 100%;
      width: 100%;
      background: #ffb148;
      color: #FFFFFF;
      font-size: 18px;
      border-radius: 2px;
    }
  }
  .pass {
    background: #ffb148;
  }
  .regnum {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    margin-bottom: 7.5px;
  }
  .regbox {
    width: 100%;
    height: 40px;
    border-radius: 2px;
    padding: 10px 10px 10px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    background: #f0f1f5;
    border: 1px solid #f0f1f5;
  }
  .regbox span {
  }
  .enter span, .regnum span {
    width: 22%;
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .enter input, .regnum input {
    border: 0;
    width: 80%;
    height: 38px;
    padding: 0;
    padding-left: 2px;
    outline: none;
    background: #f0f1f5;
    box-sizing: border-box;
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, "Microsoft Yahei", "Helvetica";
  }
  .regnum input {
    width: 48%;
    hieght: 38px !important;
  }
  .regnum img {
    width: 30%;
    height: 36px;
    display: block;
    border: 0;
    position: absolute;
    right: 2px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  input {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica !important;
    color: #323232;
  }

</style>
