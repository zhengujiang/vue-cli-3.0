<template>
  <div class="xiaoan-box findLogin-reset">
    <form>
      <div class="phone">
        <span>手机号</span>
        <input  @focus="resetPhone" @blur="blurPhone" @input="checkPhone" maxlength="11" type="text" placeholder="请输入手机号码" v-model="phone">
        <b @click="phone='';" v-show="phone.length>0"
           class="bbb"></b>
      </div>
      <p class="passErr" v-show="alreadyRegister">该手机号未注册,请先注册</p>
      <p class="passErr" v-show="phoneErr">手机号输入错误</p>
      <p class="passErr" v-show="nophone">请输入手机号</p>
      <div class="password">
        <span>新密码</span>
        <input type="password" placeholder="请输入6-20位密码" maxlength="20" v-model="password" @input="entry" @focus="show"
               @blur="hide">
        <b @click="()=>{this.password='';this.passvalid=false;}" v-show="this.password.length>0"
           class="bbb"></b>
      </div>
      <p class="passErr" v-show="!passvalid">
        密码错误，6-20位密码！
      </p>
      <div class="again" :class="{focus:this.apassword.length>0}">
        <span>再次输入</span>
        <input type="password" placeholder="请确认登录密码" maxlength="20" v-model="apassword" @input="regpassword" @focus="show1"
               @blur="hide1">
        <b @click="()=>{this.apassword='';this.apassvalid=false;}" v-show="apassword.length>0"
           class="bbb2"></b>
      </div>
      <p class="apassErr" v-show="!apassvalid">
        两次输入不一致！
      </p>

      <div class="regbox">
        <div class="regsitor">
          <span>验证码</span>
          <input type="text" placeholder="请输入验证码" v-model="regNum" @input="Regnum" @focus="show2"
                maxlength="4" @blur="hide2">
          <b @click="regNum=''" v-show="regNum.length>0" style="right:37%" class="bbb3"></b>
          <p class="regnum" @click="getVerificationCode" ref="regNum">
            {{ getNumber }}
          <div class="shadow" style="display: none"></div>
          </p>
        </div>
        <p class="regErr" v-show="isReg">
          验证码输入有误！
        </p>
      </div>
      <p class="next" @click="next" style="margin:0" :class="{pass: apassword.length>0 && password.length>0 && passvalid && apassvalid && regNum.length == 4 && noRegister}">重置</p>
    </form>
  </div>
</template>

<script>
  export default {
    name: "reset",
    data() {
      return {
        phoneErr: false,
        noRegister: false,
        nophone: false,
        alreadyRegister: false,
        phone: "",
        password: "",
        passvalid: true,
        apassword: "",
        apassvalid: true,
        regNum: "",
        getNumber: "获取验证码",
        isReg: false
      }
    },
    created() {
    },
    methods: {
      getVerificationCode () {
        if (this.phone.length == 0) {
          this.nophone = true;
        } else {
          if (this.noRegister && !this.phoneErr) {
            console.log(this.phone);
            this.getNum();
          }
        }
      },
      resetPhone() {
        console.log(this.phone.length);

        $(".phone").css("border", "1px solid #ffb148");
        this.passvalid = true;
        if (this.phone.length > 0) {
          $(".bbb").show();
        }
        this.alreadyRegister = false;
        this.phoneErr = false;
        this.nophone = false;
      },
      blurPhone () {
        $(".phone").css("border", "0");
        if (this.phone.length == 0) {
          this.nophone = true;
        } else {
          this.phoneErr = !this.isPoneAvailable(this.phone);
          if (this.phone.length == 11) {
            this.checkMobileExist();
          }
        }
      },
      checkPhone () {
        this.noRegister = false;
        this.alreadyRegister = false;
        this.phone = this.phone.trim();
        if (this.phone.length == 11) {
          this.phoneErr = !this.isPoneAvailable(this.phone)
          if (!this.phoneErr) {
            this.checkMobileExist();
          }
        } else if (this.phone.length > 11) {
          this.phoneErr = true;
        } else {
          this.phoneErr = false;
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
          mobile: this.phone,
        }
        this.$axios.user.checkMobileExist(params).then(res => {
          if (res.data.returnCode == -1) {
            this.noRegister = true;
            console.log("已注册");
            // this.$router.replace({path: '/login', query: {mobile: this.phone}});
          } else if (res.data.returnCode == 1) {
            this.alreadyRegister = true
            console.log("未注册");
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      getNum() {
        $('.shadow').show();
        console.log('123');
        let _this = this;
        let params = {
           mobile: this.phone,
           type: 'findPwd'
        }
        this.$axios.user.sendSmsCode('GET',params).then(res => {
          if (res.data.returnCode == -1) {
            $(".regErr").text(res.data.returnMsg).show();
            $('.shadow').show();
          } else if (res.data.returnCode == 1) {
            $(".regErr").hide();
            let countDown = 60;
            for (let i = 0; i <= 60; i++) {
              window.setTimeout(function () {
                if (countDown != 0) {
                  _this.getNumber = countDown + "s";
                  countDown--;
                } else {
                  countDown = 60;//如果倒计时结束就让  获取验证码显示出来
                  _this.getNumber = "重新获取"
                  $('.shadow').hide();
                }
              }, i * 1000)
            }
          }
          console.log(res)
        }).catch((err) => {
          console.error(err);
        })
      },
      Regnum() {
        this.regNum = this.regNum.trim();
        this.isReg = false;
      },
      entry() {
        // $(".bbb").css('display', 'none')
        if (this.password == this.apassword) {
          this.passvalid = true;
        }
      },
      regpassword() {
        if (this.apassword == this.password) {
          this.apassvalid = true;
        }
      },
      show() {
        $(".password").css("border", "1px solid #ffb148");
        this.passvalid = true;
      },
      hide() {
        $(".password").css("border", "0");
        let regExp = /^([a-z0-9\，\。\,\.\@\!\#\$\%\^\&\-\_\=\+\<\>\/\*\(\)]){6,20}$/i;
        let regshow = regExp.test(this.password);
        console.log("regshow" + regshow)
        if (this.password.length !== 0) {
          this.passvalid = regshow;
          console.log('passvalid:' + this.passvalid)
        } else if (this.password.length == 0) {
          this.passvalid = false;
        }
        let _this = this;
        if (_this.apassword !== this.password && this.apassword.length !== 0) {
          _this.apassvalid = false;
        } else if (_this.apassword == this.password && this.apassword.length !== 0) {
          _this.apassvalid = true;
        }
      },
      show1() {
        $(".again").css("border", "1px solid #ffb148");
        this.apassvalid = true;
      },
      hide1() {
        $(".again").css("border", "0");
        if (this.apassword !== this.password && this.password.length !== 0) {
          this.apassvalid = false;
        } else if (this.apassword == this.password && this.password.length !== 0) {
          this.apassvalid = true;
        } else if (this.apassword.length == 0) {
          this.apassvalid = false;
        }
      },
      show2() {
        $(".regsitor").css("border", "1px solid #ffb148");
      },
      hide2() {
        $(".regsitor").css("border", "0");
        console.log('regNum:' + this.regNum, 'isReg:' + this.isReg)
        if (this.regNum.length == 4) {
          this.isReg = false;
        } else if (this.regNum.length == 0 || this.regNum.length < 4) {
          this.isReg = true;
        }
      },
      next() {
        if (this.password.length == 0) {
          this.passvalid = false;
        }
        if (this.apassword.length == 0) {
          this.apassvalid = false;
        }
        if (this.phone.length == 0) {
          this.nophone = true;
        }
        if (this.regNum.length == 0) {
          this.isReg = true;
        }
        if (this.password.length !== 0 && this.apassword.length !== 0 && this.passvalid == true && this.apassvalid == true && this.regNum.length == 4 && this.isReg == false
          && this.noRegister && !this.phoneErr) {
          let params = {
             mobile: this.phone,
             code: this.regNum,
             password: this.apassword
          }
          this.$axios.user.findLoginPassword(params).then(res => {
            console.log(res.data)
            if (res.data.returnCode == -1) {
              this.regNum = "";
              this.isReg = true;
            } else if (res.data.returnCode == 1) {
              console.log("密码修改成功！");
              window.sessionStorage.removeItem('refer_title');
              window.sessionStorage.removeItem('refer_url');
              window.sessionStorage.setItem("loginPage", 1);
              window.sessionStorage.setItem("register", 2);
              this.$router.replace('/loadPass');
            }
          }).catch((err) => {
            console.error(err);
          })
        } else {
          console.log("no info")
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .findLogin-reset {
    background-color: white;
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
  .phone {
    width: 100%;
    height: 50px;
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif;
    color: #323232;
    margin: 0;
    display: flex;
    align-items: center;
  }
  form {
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
  }
  .password, .again, .phone {
    width: 100%;
    height: auto;
    background: #f0f1f5;
    border-radius: 2px;
    margin-bottom: 7.5px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .password span, .again span, .regsitor span, .phone span {
    width: 22%;
    height: 40px;
    font-size: 15px;
    color: #323232;
    padding-left: 7.5px;
    display: block;
    line-height: 40px;
    /*box-sizing: border-box;*/
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
  .focus {
    border: 1px solid #ffb148;
  }
  .password input, .again input, .phone input {
    width: 78%;
    height: 40px;
    background: #f0f1f5;
    font-size: 15px;
    color: #8d8d8d;
    line-height: 20px;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
  }
  .passErr, .apassErr {
    margin: 5px 0;
    color: #fb4319;
    font-size: 13px;
  }
  .regbox {
    width: 100%;
    height: auto;
    position: relative;
  }
  .regsitor {
    width: 100%;
    height: auto;
    background: #f0f1f5;
    border-radius: 2px;
    margin-bottom: 7.5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .regsitor span {
    width: 22%;
    height: 40px;
    font-size: 15px;
    color: #323232;
    padding-left: 7.5px;
    display: block;
    line-height: 40px;
  }
  .regsitor input {
    width: 43%;
    height: 40px;
    background: #f0f1f5;
    font-size: 15px;
    color: #8d8d8d;
    line-height: 20px;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
  }
  .regnum {
    width: 35%;
    border-left: 1px solid #ffb249;
    margin: 0;
    padding: 0;
    padding-left: 7.5px;
    box-sizing: border-box;
    text-align: center;
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
  .regErr {
    margin: 0;
    color: #fb4319;
    font-size: 13px;
    margin-top: -2px;
    margin-bottom: 7.5px;
  }
  .next {
    width: 100%;
    height: 50px;
    background: #ffd59c;
    text-align: center;
    line-height: 50px;
    border: 0;
    color: #fff;
    font-size: 18px;
    border-radius: 2px;
    font-family: PingFangSC-Medium, sans-serif;
  }
  .pass {
    background: #ffb148;
  }
  .regsitor {
    position: relative;
  }
  .shadow {
    width: 34%;
    height: 80%;
    background: rgba(0, 0, 0, 0);
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  input {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica !important;
    color: #323232 !important;
    line-height: 20px;
  }
</style>
