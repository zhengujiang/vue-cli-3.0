<template>
  <div class="ts xn-input" :class="{'xn-input-active':isinput || value !==''}">
    <div class="ts lbl" @click="oninput()">{{text}}</div>
    <input :id="id" class="txt ts" :class="[isErr?'txterr':'',tip?'txterr':'', isinput?'txtinput':'']"
           :type="type"
           ref="input"
           :value="value"
           @click="oninput()"
           @blur="onblur()"
           @focus="onfocus()"
           @input="$emit('input', $event.target.value)"
           spellcheck="false"
           autocomplete="new-password"
           :maxlength="maxlength">
    <i v-if="regx == 'password'" class="eyes" :class="{'show': showPass, 'hide': !showPass, 'forget': forget}" @click="showHide"></i>
    <i v-if="regx == 'mobile'" class="eyes" :class="{'cleanUp':value.length > 0}" @click="cleanUp"></i>
    <div v-show="isErr && !isinput" class="errmsg">{{msg}}</div>
    <div v-show="isRegister" class="errmsg" :class="{'wxBind': wxBind}">{{msg}}</div>
    <div v-show="codeErrmsg" class="errmsg">{{codeErrmsg}}</div>
    <div v-show="!isErr && tip!=='' && tip !==undefined" class="errmsg">{{tip}}</div>
    <div class="mask" v-show="account"></div>
  </div>
</template>
<script>
  export default {
    name: 'input',
    props: ['id', 'text', 'value', 'regx', 'errmsg', 'tip', 'maxlength', 'codeErrmsg', 'noneValue', 'account', 'forget'],
    data () {
      return {
        isinput: '',
        isErr: false,
        type: this.regx == 'password' ? 'password' : 'text',
        showPass: false,
        msg: '',
        isRegister: false,
        wxBind: false
      }
    },
    watch: {
      'value': function() {
        if (this.id == 'regmobile' || this.id == 'txtmobile' || this.id == 'txtbindMobile') {
          if (this.value.length == 11) {
            if (this.id == 'regmobile') {
              this.checkmobileexist();
            } else if (this.id == 'txtmobile' || this.id == 'txtbindMobile') {
              this.checkmobileLogin();
            }
          } else {
            this.isRegister = false;
            this.wxBind = false;
            this.$emit('checkMobile', false)
          }
        }
      },
      'noneValue': function() {
        this.onblur();
      },
      'account': function() {
        this.isErr = false;
      }
    },
    created() {
      this.msg = this.errmsg;
      this.num = this.value;
      setTimeout(e => {
        if (this.value) {
          this.onblur();
        }
      }, 300)
    },
    methods: {
      cleanUp() {
        this.$emit('cleanNum');
      },
      showHide() {
        this.showPass = !this.showPass;
        this.showPass ? this.type = 'text' : this.type = 'password'
      },
      onblur () {
        setTimeout(e => {
          this.isinput = false;
          if (this.regx === 'mobile') {
            this.isErr = !this.$regx.telphone(this.value)
            if (!this.isRegister) {
              this.value ? this.msg = '手机号输入错误' : this.msg = '请输入手机号'
            }
          } else if (this.regx === 'password') {
            this.isErr = !this.$regx.password(this.value)
            this.value ? this.msg = '密码6-20位' : this.msg = '请输入密码'
          } else if (this.regx === 'imgcode') {
            this.isErr = !this.$regx.imgCode(this.value)
            this.value ? this.msg = '验证码错误' : this.msg = '请输入验证码'
            this.$emit('codeMsg');
          } else if (this.regx === 'email') {
            this.isErr = !this.$regx.mail(this.value)
          }
          if (!this.isErr) {
            this.$emit('blur', this.id)
          }
        }, 100)

      },
      onfocus () {
        // this.$emit('focus', this.id);
        this.msg = "";
        if (this.regx === 'imgcode') {
          this.$emit('codeMsg')
        }
      },
      oninput() {
        this.isinput = true
        document.querySelector('#' + this.id).focus()
      },
      checkmobileexist() {
        let params = {
          mobile: this.value
        };
        this.$axios.user.checkmobileexist(params).then(res => {
          if (res.data.returnCode == 1) {
            this.$emit('checkMobile', false);
            this.isRegister = false;
          } else {
            this.$emit('checkMobile', true);
            this.msg = '该手机号已注册，请登录';
            this.isRegister = true;
          }
        })
      },
      checkmobileLogin() {
        this.isErr = !this.$regx.telphone(this.value)
        let params = {
          mobile: this.value
        };
        this.$axios.user.checkmobileexist(params).then(res => {
          if (res.data.returnCode == 1) {
            this.$emit('checkMobile', true);
            this.isRegister = true;
            this.msg = '该手机号未注册，请先注册';
          } else {
            this.$emit('checkMobile', false);
            this.isRegister = false;
            if (this.id == 'txtbindMobile') {
              this.checkMobileBindWeixin();
            }
          }
        })
      },
      checkMobileBindWeixin() {
        let params = {
          mobile: this.value
        };
        this.$axios.user.checkMobileBindWeixin(params).then(res => {
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.msg = '该手机号已和其他微信号绑定，请先登录，登录后可以在个人中心更改绑定微信';
              this.wxBind = true
              this.isRegister = true;
              this.$emit('checkMobile', true, 'wxBind');
            }
          }
          // if (res.data.returnCode == 1) {
          //   this.$emit('checkMobile', true);
          //   this.isRegister = true;
          //   this.msg = '该手机号未注册，请先注册';
          //   console.log(this.isRegister)
          // } else {
          //   this.$emit('checkMobile', false);
          //   this.isRegister = false;
          // }
        })
      }
    }
  }
</script>
<style lang="scss">
  .ts {
    transition: all .3s;
  }
  .xn-input {
    position: relative;
    height: 80px;
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
    .show {
      background: url('https://oss.in-hope.cn/xiaoan/web_static/show.png') no-repeat
    }
    .hide {
      background: url('https://oss.in-hope.cn/xiaoan/web_static/hide.png') no-repeat
    }
    .cleanUp {
      background: url('https://oss.in-hope.cn/xiaoan/web_static/off.png') no-repeat
    }
    .forget {
      right: 70px;
    }
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
      line-height: 18px;
      font-size: 14px;

    }
    .wxBind {
      text-align: left;
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
  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 1;
    cursor: not-allowed;
  }
</style>
