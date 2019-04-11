<template>
  <div id="electron">
    <div class="scroll">
      <div class="header bg"></div>
      <div class="warningHt" v-if="$cookie.isLogin()">
        <div class="headIcon bg"><img :src="headImg" alt=""></div>
        <p class="bg text">{{userInfo.userName}}</p>
      </div>
      <div class="warningHt" v-else>
        <div class="warningHt-box">
          <b class="iconfont icon-cha"></b>
          <p>您还未登录信公小安，无法使用该服务</p>
        </div>
      </div>
      <div class="bg bty">
        <div class="cr"></div>
        <div class="el"></div>
        <div class="hj animated " :class="outUp?'fadeOutUpBig':''"></div>
        <button class="btn" v-if="$cookie.isLogin()" @click="itTo">开始测试</button>
        <button class="btn" v-else @click="goLogin">去登录</button>
      </div>
      <div class="bg warn">本程序仅供娱乐，不为实践操作提供任何参考依据</div>
    </div>

    <div class="vxa-x-dialog-code" v-transfer-dom>
      <x-dialog v-model="show" class="dialog-box" hide-on-blur>
        <div class="img-box">
          <div class="img"><img src="https://oss.in-hope.cn/xiaoan/h5_static/electron/headicon.png" alt=""></div>
          <div class="put"><input type="text" v-model="comVal" @blur="inputBlur" placeholder="请输入公司名称">
          </div>
          <p class="text">输入您要测的公司名称</p>
          <div class="btn">
            <button @click="toTest">确定</button>
          </div>
        </div>
      </x-dialog>
    </div>

  </div>
</template>

<script>
  import {Swiper, SwiperItem, XDialog, XButton, TransferDomDirective as TransferDom} from 'vux'
  export default {
    name: "electron",
    directives: {
      TransferDom
    },
    components: {
      XDialog, XButton, Swiper, SwiperItem
    },
    data() {
      return {
        outUp: false,
        show: false,
        comVal: '',
        userInfo: {
          weixinAvatar: '',
          userName: '信公小安'
        },
        headImg: 'https://oss.in-hope.cn/xiaoan/h5_static/electron/headicon.png'
      }
    },
    watch: {
      comVal: function (val) {
        this.comVal = val.trim();
      }
    },
    computed: {},
    created() {
      if (this.$cookie.isLogin()) {
        this.userInfo = this.$cookie.getUserInfo();
        if (this.userInfo.weixinAvatar) {
          this.headImg = this.userInfo.weixinAvatar;
        }
      } else {

      }
    },
    mounted() {
      let shareTitle = "测一测，你有多少科创板基因？";
      let shareDesc = "科创板原来离我这么近"; // 描述
      let shareLink = window.location.href; // 分享链接
      this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);

    },
    methods: {
      itTo() {
        this.outUp = true;
        setTimeout(() => {
          this.show = true;
        }, 500)
      },
      inputBlur() {
        window.scrollTo(0, 0)
        this.resolveBug();
      },
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
      goLogin() {
        this.$storage.loginStatus(this, '科创板', window.location.href);
      },
      toTest() {
        if (this.comVal.trim()) {
          this.$vux.loading.show({text: '加载中'})
          setTimeout(() => {
            this.$router.push({path: '/electron/test', query: {name: this.comVal}});
            this.$vux.loading.hide();
          }, 1000)
        } else {
          this.$vux.toast.show({text: '请输入公司名称', position: 'middle', type: 'text', width: 'auto', time: 1500});

        }
      }
    }
  }
</script>

<style lang="scss">
  .vxa-x-dialog-code {
    .dialog-box {
      .img-box {
        width: 100%;
        height: 218px;
        .img {
          text-align: center;
          img {
            height: 40px;
            width: 40px;
            margin: 14px 0;
            background-color: #ffb148;
            border-radius: 50%;
          }
        }
        .put {
          input {
            width: 254px;
            height: 44px;
            background-color: #f6f6f6;
            padding: 0 10px;
            font-size: 16px;
            &::placeholder {
              color: #8d8d8d;
              font-size: 16px;
            }
          }
        }
        .text {
          font-size: 13px;
          font-weight: 400;
          color: rgba(174, 174, 174, 1);
          line-height: 18px;
          text-align: left;
          padding: 0 22px;
          margin-top: 10px;
        }
        .btn {
          button {
            width: 168px;
            height: 44px;
            color: white;
            font-size: 16px;
            margin-top: 10px;
            background: rgba(255, 177, 72, 1);
          }
        }
      }
    }
  }
  #electron {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/bg%402x.png?213213");
    background-repeat: no-repeat;
    background-size: cover;
    background-origin: padding-box;
    .scroll {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .vux-slider {
      height: 100%;
    }
    .warningHt {
      height: 127px;
      .warningHt-box {
        width: 275px;
        height: 100%;
        margin: 29px auto 0 auto;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        text-align: center;
        b {
          font-size: 35px;
          color: rgba(255, 111, 72, 1);
          margin-top: 19px;
          margin-bottom: 10px;
          display: inline-block;
        }
        p {
          padding: 0 15%;
          font-size: 15px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 21px;
        }
      }
    }
    .bg {
      &.header {
        height: 89px;
        width: 310px;
        margin: 32px auto auto;
        background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/title.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-origin: padding-box;
      }
      &.headIcon {
        height: 60px;
        width: 60px;
        margin: 29px auto auto;
        /*background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/headicon.png");*/
        /*background-repeat: no-repeat;*/
        /*background-size: cover;*/
        /*background-origin: padding-box;*/
        img {
          height: 60px;
          width: 60px;
          vertical-align: middle;
          border-radius: 50%;
        }
      }
      &.text {
        margin: 6px auto auto;
        font-size: 16px;
        text-align: center;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
      }
      &.bty {
        position: relative;
        text-align: center;
        height: 233px;
        .cr {
          width: 240px;
          height: 134px;
          margin: 10px auto auto;
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/zs%402x.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-origin: padding-box;
        }
        .el {
          width: 219px;
          height: 200px;
          margin: 0 auto auto;
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/footer%402x.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-origin: padding-box;
          position: absolute;
          top: 39px;
          left: 50%;
          transform: translateX(-53%);
        }
        .hj {
          width: 47px;
          height: 114px;
          margin: 0 auto auto;
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/hj%402x.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-origin: padding-box;
          position: absolute;
          top: 56px;
          left: 50%;
          transform: translateX(-55%);
        }
        .btn {
          width: 288px;
          height: 50px;
          color: white;
          font-size: 16px;
          border: rgba(146, 213, 255, 1);
          background: rgba(146, 213, 255, 1);
          box-shadow: 0px 0px 12px 0px rgba(42, 148, 255, 0.15);
          position: absolute;
          top: 180px;
          border-radius: 2px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      &.warn {
        margin: 21px 0;
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 14px;
        text-align: center;
      }
    }
  }
</style>
