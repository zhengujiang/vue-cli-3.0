<template>
  <div class="xiaoan-vue-focus">
    <div class="xiaoan-vue-focus-scroll" ref="focusDom">
      <div class="tab-box vux-1px-b " ref="tabDom">
        <tab :scroll-threshold=6 :line-width=2 :active-color="'#ffb148'" v-model="active" custom-bar-width="30px">
          <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index" v-if="item.show">
            {{item.name}}
          </tab-item>
        </tab>
      </div>
      <div class="tab-container" :style="{height:tabHeight+'px'}">
        <swiper v-model="active" loop :min-moving-distance="1200" :height="'100%'" :show-dots="false">
          <swiper-item>
            <focus-stock :height="tabHeight" :active="tabData[active].type"></focus-stock>
          </swiper-item>
          <swiper-item>
            <new-notice :height="tabHeight" :active="tabData[active].type"></new-notice>
          </swiper-item>
          <swiper-item>
            <focus-problem :height="tabHeight" :active="tabData[active].type"></focus-problem>
          </swiper-item>
          <swiper-item>
            <focus-topic :height="tabHeight" :active="tabData[active].type"></focus-topic>
          </swiper-item>
          <swiper-item>
            <focus-customer :height="tabHeight" :active="tabData[active].type"></focus-customer>
          </swiper-item>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
  import VReturnHome from "@/components/warning/returnHome.vue"
  import FocusStock from './components/focus/focusStock'
  import NewNotice from './components/focus/newNotice'
  import FocusProblem from './components/focus/focusProblem'
  import FocusTopic from './components/focus/focusTopic'
  import FocusCustomer from './components/focus/focusCustomer'
  import XiaoanLoading from '@/components/warning/loading'
  import {Swiper, SwiperItem, Tab, TabItem} from 'vux'
  import {mapState} from 'vuex'

  export default {
    components: {
      VReturnHome, XiaoanLoading,
      FocusStock, NewNotice, FocusProblem, FocusTopic, FocusCustomer,
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    computed: {
      ...mapState({
        footerHeight: state => state.mutations.footerHeight
      })
    },
    name: 'focus',
    watch: {
      active: function (val) {
        console.log('this.active', val);
        this.$router.replace({path: '/focus', query: {active: this.tabData[val].type}});
      }
    },
    data() {
      return {
        tabHeight: 0,
        active: 0,
        tabData: [
          {show: true, type: 'stock', name: '股票', value: '', active: ''},
          {show: true, type: 'notice', name: '公告', value: '', active: ''},
          {show: true, type: 'problem', name: '问题', value: '', active: ''},
          {show: true, type: 'topic', name: '话题', value: '', active: ''},
          {show: true, type: 'customer', name: '用户', value: '', active: ''}
        ]
      }
    },
    updated() {
    },
    created() {
      this.userId = this.$cookie.getCookie("userId");
      // userHome
      // 我的关注获取用户信息判断是否填写个人信息  若是没有则跳转填写个人信息页面
      if (this.$cookie.isLogin()) {
        // this.apiUserHome();
        if (this.$route.query.active) {
          this.tabData.forEach((item, index) => {
            if (item.type == this.$route.query.active) {
              this.active = index;
            }
          })
        } else {
          this.$router.replace({query: {active: this.tabData[this.active].type}});
        }
      } else {
        this.$storage.loginStatus(this, '我的关注', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        console.log(this.$refs.focusDom.clientHeight);
        console.log(this.$refs.tabDom.clientHeight);
        this.tabHeight = this.$refs.focusDom.clientHeight - this.$refs.tabDom.clientHeight - 1;
        console.log('32432', this.tabHeight);
      });
      /*
       * todo
       * 微信分享
       */
      var adverttitle = window.document.title;
      var sharelink2 = this.$api.CURRENTIP.IP + '#/focus'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      // 获取登录信息
      apiUserHome() {
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            let isTestUser = data.testUser;
            if (isTestUser == false) {
              // 非测试用户
              this.tabData.forEach((item) => {
                if (item.type == 'problem' || item.type == 'topic' || item.type == 'customer') {
                  item.show = false;
                }
              })
              // this.$router.replace({path: '/error', query: {img: '', text: ''}});
            }
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({
              text: res.data.returnCode + res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .xiaoan-vue-focus {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f0f1f5;
    padding-bottom: 50px;
    .xiaoan-vue-focus-scroll {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .tab-box {
        .vux-tab-warp {
          .vux-tab-container {
            .vux-tab {
              .vux-tab-item.vux-center {
              }
              .vux-tab-selected {
                font-family: PingFangSC-Medium, sans-serif;
                -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              }
            }
          }
        }
      }
      .tab-container {
        width: 100%;
        height: 100%;
        .vux-slider {
          height: 100%;
          width: 100%;
          .vux-swiper {
          }
        }
      }
    }
  }
  .focus {
    width: 100%;
    height: 100%;
    /*background-color: #f0f1f5;*/
    overflow: hidden;
    .focus-header-search {
      width: 100%;
      height: 48px;
      background-color: #f0f1f5;
      padding: 7.5px 12px;
      box-sizing: border-box;
      button.focus-body {
        border: none;
        border: 0;
        background-color: white;
        height: 100%;
        width: 100%;
        border-radius: 2px;
        text-align: left;
        padding: 0 10px;
        i {
          font-size: 18px;
          font-weight: 500;
          color: #8d8d8d;
          vertical-align: middle;
        }
        span {
          font-size: 15px;
          color: #8d8d8d;
          padding-left: 3px;
          vertical-align: middle;
          display: inline-block;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          //  line-height: 1;
        }
      }
    }
    .focTitle {
      height: 40px;
      width: 100%;
      box-sizing: border-box;
      background-color: #ffefda;
      padding: 0 12px;
      color: #ffb148;
      display: table;
      position: relative;
      .focus-li {
        display: table-cell;
        i {
          color: #ffb148;
        }
      }
      .focName {
        text-align: left;
        vertical-align: middle;
        box-sizing: border-box;
      }
      .imgIon {
        height: 15px;
        float: right;
        text-align: center;
        padding: 11.5px 0 0 5px;
        line-height: 40px;
      }
      .focName, .focPic, .focG, .focUp {
        width: 25%;
        font-size: 15px;
        vertical-align: middle;
        box-sizing: border-box;
      }
      .focPic, .focG {
        text-align: right;
        vertical-align: middle;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        padding-right: 15px;
        i {
          color: #ffb148;
        }
      }
      .focUp {
        text-align: right;
        vertical-align: middle;
        box-sizing: border-box;
      }
      .icon-arrowDown, .icon-icon-jiantou {
        color: #ffb148;
      }
    }
    .box-scroll {
      position: relative;
    }
    ul.foclist {
      height: 100%; /*85.145*/
      width: 100%;
      overflow: scroll;
      border: 0 !important;
      -webkit-overflow-scrolling: touch;
      /*background-color: #f0f1f5;*/
      li.btnFoo {
        height: 50px;
        width: 100%;
        background: white;
        text-align: center;
        vertical-align: middle;
        .foo-text {
          font-size: 14px;
          line-height: 50px;
          color: #aeaeae;
        }
      }
      /*li.foclistglobal:after{
          content: " ";
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px solid #D9D9D9;
          color: #D9D9D9;
          -webkit-transform-origin: 0 100%;
          transform-origin: 0 100%;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
      }*/
      li.foclistglobal {
        border-bottom: 0.5px solid #e3e3e3;
        width: 100%;
        position: relative;
        box-sizing: border-box;
        height: 60px !important;
        min-height: 60px !important;
        .mint-cell {
          height: 100% !important;
        }
        .mint-cell:last-child {
          background-size: 100% 0;
        }
        .mint-cell-swipe {
          .mint-cell-wrapper {
            padding: 0 12px;
            background-size: 120% 0.5px !important;
            height: 100% !important;
            .mint-cell-title {
              width: 0 !important;
              .mint-cell-text {
              }
            }
            .mint-cell-value {
              display: block !important;
              width: 100% !important;
              background-color: white !important;
              .focNum {
                height: 100%;
                width: 100%;
                font-size: 0;
                display: table;
                box-sizing: border-box;
                .foccolor {
                  display: table-cell;
                  font-size: 15px;
                  vertical-align: middle;
                  .focNumNome {
                    font-size: 15px;
                    color: #323232;
                    margin-bottom: 5px;
                    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
                    word-break: keep-all; /*不换行*/
                    white-space: nowrap; /*不换行*/
                    /*overflow: hidden;*/
                    /*内容超出宽度时隐藏超出部分的内容*/
                    /*text-overflow: ellipsis;*/
                  }
                  .focNumCode {
                    font-size: 0;
                    color: #aeaeae;
                    margin: 0;
                    padding: 0;
                    text-align: left;
                    span {
                      vertical-align: middle;
                      font-size: 0;
                      line-height: 1;
                      display: inline-block;
                      .showSH {
                        width: 18px;
                        margin-right: 2px;
                      }
                    }
                    .focus-obj-code {
                      display: inline-block;
                      line-height: 1;
                      vertical-align: middle;
                      font-size: 12px;
                    }
                  }
                }
                .focNum0 {
                  overflow: hidden;
                  width: 20%;
                  -webkit-box-sizing: border-box;
                  -moz-box-sizing: border-box;
                  box-sizing: border-box;
                }
                .focNum .focNum1, .focNum2, .focNum3 {
                  color: #fc7253;
                }
                .focNum1, .focNum2 {
                  width: 25%;
                  text-align: right;
                }
                .focNum3 {
                  width: 30%;
                  text-align: right;
                }
              }
            }
          }
          .mint-cell-right {
            .mint-cell-swipe-button {
              line-height: 60px !important;
              padding: 0 10px !important;
            }
          }
        }
      }
    }
    .focus-animate-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1000;
      height: 50px;
      width: 100%;
      background: rgba(255, 177, 72, 0.9);
      color: white;
      line-height: 50px;
      p {
        width: 100%;
        text-align: center;
        font-size: 15px;
      }
    }
    .link-button {
      width: 45px;
      height: 45px;
      position: absolute;
      bottom: 10%;
      right: 5%;
      z-index: 10;
      text-align: center;
      padding: 5px 10px 0 10px;
      font-size: 0;
      box-sizing: border-box;
      border-radius: 50%;
      background: rgba(255, 177, 72, .65);
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
      color: #fff;
      overflow: hidden;
      i {
        color: white;
        font-weight: normal;
        font-size: 18px;
        margin-top: 5px;
      }
      p {
        font-size: 12px;
      }
    }
  }
</style>

<style scoped lang="scss">
  // *warning页面*/
  #focus-warning {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    z-index: 3000;
    overflow: hidden;
    text-align: center;
    display: none;
    > .focus-waringImg {
      height: 110px;
      width: 118.25px;
      margin: 38.2% auto 0 auto;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/toFocus.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .focus-waringText {
      font-size: 15px;
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      color: #ffb148;
      padding: 20px 0 0 0;
      text-align: center;
    }
    .focus-waringBtn {
      box-shadow: none;
      color: white;
      border: 0;
      width: 90px;
      margin-top: 20px;
      font-family: PingFangSC-Regular, sans-serif, "Microsoft Yahei", "Helvetica";
      height: 30px;
      background: #ffb148;
    }
  }
  @media screen and (max-width: 360px) {
    /*//引入rem布局*/
    .focus .focAdd {
      bottom: 17%;
    }
  }
  .focAdd span {
    height: 50px;
    width: 50px;
    display: inline-block;
    position: relative;
  }
  /**/
  #focus .law-show {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 3200;
    .focus-1 {
      width: 100%;
      img {
        width: 50%;
        padding-top: 41%;
        float: right;
      }
    }
    .GuidePagesFocus1 {
      z-index: 200;
      position: absolute;
      padding-top: 14%;
      img {
        position: relative;
        width: 67%;
        right: 12px;
        float: right;
      }
      div {
        position: absolute;
        bottom: -25px;
        font-size: 15px;
        color: white;
        right: 31%;
      }
    }
    .law-show-sh {
      height: 32.5px;
      width: 100px;
      background-color: rgba(0, 0, 0, 0.01);
      color: #ffb148;
      font-size: 15px;
      position: absolute;
      bottom: 17%;
      left: 50%;
      margin-left: -50px;
      text-align: center;
      line-height: 32.5px;
      border: 2px dashed #ffb148;
      z-index: 1000;
    }
  }
</style>
