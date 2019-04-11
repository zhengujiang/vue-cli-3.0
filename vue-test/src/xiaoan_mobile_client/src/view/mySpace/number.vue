<template>
  <div class="number" id="number">
    <div class="header">
      <div class="user">
        <div class="back">
          <img :src="userHome.headImgUrl" alt="">
        </div>
        <span>{{userHome.nickname}}</span>
      </div>
    </div>
    <p class="prompt">{{numberText.prompt}}</p>
    <div class="phone">
      <form action="" onsubmit=" return false;">
        <div class="enter" :class="{borderEnter:borderColor}">
          <span>{{numberText.phone}}</span>
          <input type="tel" :placeholder="numberText.placeholder" v-model="phoneNumber"
                 @keyup.13="phoneNext" @input="inputChange" @focus="inputFocus"/>
          <i @click="clearVal()" v-show="clearBtn" class="icon iconfont  icon-X bbb"></i>
        </div>
      </form>
      <p class="error" v-show="errorI">{{errorText}}</p>
    </div>
    <div class="next">
      <button type="button" class="pass" @click="phoneNext">{{numberText.button}}</button>
    </div>
    <p class="note">
      <span>*</span>
      <span>{{numberText.note}}</span>
    </p>
    <xiaoan-loading v-show="matterShow" :bgColor="'rgba(0,0,0,0.5)'"></xiaoan-loading>
  </div>
</template>

<script>
  import loading from '@/components/warning/loading'

  export default {
    name: "number",
    data() {
      return {
        numberText: {
          prompt: '您的个人信息不完善，请输入您的手机号码：',
          note: '如果您之前注册过信公小安，请使用相同手机号，系统会同步您的记录。',
          button: '下一步',
          phone: '手机号',
          placeholder: '请输入大陆手机号'
        },
        username: '',
        imgsrc: "",
        phoneNumber: '',
        valid: false,
        displayClear: false,
        user_Id: "",
        matterShow: false,
        errorI: false,
        errorText: '输入的手机号格式不正确',
        clearBtn: false,
        userHome: {},
        borderColor: false
      }
    },
    watch: {
      '$route': function (to, form, next) {
        if (to.name != 'number') {
          window.localStorage.removeItem('SUBSCRIBE');
        }
      },
      'phoneNumber': function () {
        if (this.phoneNumber) {
          this.clearBtn = true;
        } else {
          this.clearBtn = false;
        }
      }
    },
    components: {
      'xiaoan-loading': loading
    },
    destroyed() {
      // 离开页面清除判断 授权操作
      window.localStorage.removeItem('SUBSCRIBE');
    },
    created() {
      // 进入number 页面 必定执行 程序
      let userId = this.$cookie.getCookie("userId");
      // 退出 2018.6.12 清除操作去除
      // this.$cookie.apiUserZlear(this);
      //
      if (window.localStorage.getItem('SUBSCRIBE')) {
        // you
        window.localStorage.removeItem('SUBSCRIBE');
        this.matterShow = false;
        window.localStorage.removeItem('exit');
      } else {
        // meiyou
        window.localStorage.setItem('SUBSCRIBE', true);
        this.$weixin.wxAuthRedirect(this, 'SUBSCRIBE');
      }
      this.userHome = this.$weixin.wxAuthLink(this, 'SUBSCRIBE');
      this.wexAccredit();
    },
    mounted() {
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/my'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      clearVal() {
        this.phoneNumber = '';
        this.valid = false;
      },
      //
      inputChange() {
        this.phoneNumber = this.$array.trim(this.phoneNumber);
        this.borderColor = false;
        if (this.phoneNumber.length == 0) {
          this.errorText = '请输入手机号！';
          this.errorI = true;
        } else {
          this.errorText = '输入的手机号格式不正确！';
          this.displayClear = true;
          // let regExp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
          let isReg = this.$regExp.mobile(this.phoneNumber);
          this.valid = isReg;
          if (this.valid == false && this.phoneNumber.length !== 0) {
            this.errorI = true;
          } else {
            this.errorI = false;
          }
        }
      },
      //
      wexAccredit() {
        let user_id = this.$cookie.getCookie("userId");
        this.user_Id = user_id;
        //
        if (this.user_Id.length == 0 || this.user_Id == '') {
          console.log("没有userId");
        } else {
          this.refer_url();
        }
      },
      //
      refer_url() {
        let that = this;
        if (window.sessionStorage.getItem('refer_url') !== null) {
          window.location.href = window.sessionStorage.getItem('refer_url');
          return
        } else if (window.sessionStorage.getItem('manage') !== null) {
          that.gototi = '个人中心';
          that.$router.replace({path: '/my'});
          return
        } else if (window.sessionStorage.getItem('collect') !== null) {
          that.gototi = '我的收藏';
          that.$router.replace("/collect");
          return;
        } else if (window.sessionStorage.getItem('collectDetails') !== null) {
          that.gototi = '我的收藏夹';
          window.location.href = window.sessionStorage.getItem('collectDetails');
          return;
        } else if (window.sessionStorage.getItem('track') !== null) {
          that.gototi = '我的足迹';
          that.$router.replace('/track');
          return;
        } else if (window.sessionStorage.getItem('lookupTables') !== null) {
          that.gototi = '我的权限速查表';
          that.$router.replace('/lookupTables');
          return;
        } else if (window.sessionStorage.getItem('customerTables') !== null) {
          that.gototi = '我的权限速查表';
          that.$router.replace('/lookupTables');
          return;
        } else if (window.sessionStorage.getItem('focus') !== null) {
          that.gototi = '我的关注';
          that.$router.replace('/focus');
          return;
        } else if (window.sessionStorage.getItem('answersDetails') !== null) {
          that.gototi = '问答详情';
          var pa = window.sessionStorage.getItem('answersDetails').split("@#");
          that.$router.replace({path: '/answersDetails?question=' + pa[0] + "&scopeId=" + pa[1]});
          return;
        } else if (window.sessionStorage.getItem('testing') !== null) {
          that.gototi = '董秘测评';
          that.$router.replace('/testing');
          return;
        } else if (window.sessionStorage.getItem('afficheContentId') !== null) {
          that.gototi = '公告详情';
          var id = window.sessionStorage.getItem("afficheContentId");
          console.log('-------', id, '-------------');
          window.sessionStorage.setItem("afficheContentId", id);
          that.$router.replace({path: "/afficheContent"});
          return;
        } else if (window.sessionStorage.getItem('collectGroom') !== null) {
          that.gototi = '推荐收藏';
          var titex = window.sessionStorage.getItem("collectGroom").split("$#");
          console.log('-------', id, '-------------');
          that.$router.replace({path: "/collectGroom", query: {id: titex[0], title: titex[1]}});
          return;
        } else {
          that.gototi = '个人中心';
          that.$router.replace("/my");
        }
      },
      //
      inputFocus() {
        this.errorI = false;
        this.borderColor = true;
        if (this.valid == false && this.phoneNumber.length !== 0) {
          console.log('show=' + this.valid);
          this.errorI = false;
        }
      },
      //
      phoneNext() {
        if (this.valid) {
          let params = {
            mobile: this.phoneNumber,
          }
          this.$axios.user.checkMobileExist(params).then(res => {
            if (res.data.returnCode == -1) {
              console.log("已注册");
              this.$router.replace({path: '/login', query: {mobile: this.phoneNumber}});
            } else if (res.data.returnCode == 1) {
              console.log("未注册");
              this.$router.replace({path: '/personal-info', query: {mobile: this.phoneNumber}});
              this.$MTAmethod.mtaShare('dongminenglicep-2', {regmobile: true});
            }
          }).catch((err) => {
            console.error(err);
            this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
          });
        } else {
          this.$vux.toast.show({text: '网络连接失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
      }
    }
  }
</script>

<style lang="scss">
  #number.number {
    font-size: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    background-color: #FFFFFF;
    .header {
      width: 100%;
      height: 100px;
      background: linear-gradient(#ffc155, #ffb048);
      position: relative;
      left: 0;
      top: 0;
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
        }
        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          z-index: 22;
        }
        span {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 10px;
          margin: auto;
          display: block;
          font-size: 15px;
          line-height: initial;
        }
      }
    }
    .prompt {
      font-size: 15px;
      color: #323232;
      padding: 15px;
    }
    .phone {
      width: 100%;
      font-size: 0;
      height: auto;
      padding: 0 15px;
      box-sizing: border-box;
      form {
        .enter {
          width: 100%;
          font-size: 0;
          border-radius: 2px;
          overflow: hidden;
          padding: 10px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          position: relative;
          background: #f0f1f5;
          border: 1px solid #f0f1f5;
          display: inline-block;
          span {
            width: 20%;
            font-size: 15px;
            display: inline-block;
            font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          }
          input {
            border: 0;
            width: 80%;
            height: auto;
            font-size: 15px;
            padding: 0;
            outline: none;
            line-height: 20px;
            font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
            -webkit-appearance: none;
            background: #f0f1f5;
            box-sizing: border-box;
          }
          i.bbb {
            position: absolute;
            right: 10px;
            top: 50%;
            color: #c1c1c1;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
          }
        }
        .borderEnter {
          border: 1px solid #ffb148;
        }
      }
      .error {
        display: block;
        color: #fb4319;
        font-size: 13px;
        margin: 6px 0 -2px 0;
      }
    }
    .next {
      width: 100%;
      height: 80px;
      text-align: center;
      padding: 7.5px 15px 15px 15px;
      box-sizing: border-box;
      button {
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #fff;
        font-family: PingFangSC-Medium, sans-serif;
        font-size: 18px;
        background: #ffd59c;
        border: 0;
        outline: none;
        border-radius: 2px;
        -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      button.pass {
        background: #ffb148;
      }
      button:active {
        background-color: rgba(255, 177, 72, 0.8);
        -webkit-transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
    .note {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 0 15px;
      box-sizing: border-box;
      color: #ffb149;
      font-size: 13px;
      letter-spacing: 0.3px;
      margin: -5px 0 0 0;
      span:nth-of-type(1) {
        margin-right: 5px;
      }
    }
  }
</style>
