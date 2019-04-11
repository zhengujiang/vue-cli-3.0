<template>
  <transition name="bounce">
    <div id="manage" class="xiaoan-box manage">
      <div class="manage-scroll">
        <group gutter="0" class="cell-global header">
          <cell-box>
            <div class="line1"><span>小安头像</span>
              <img v-if='userHomeData.weixinAvatar' :src="userHomeData.weixinAvatar" alt="">
              <img v-else :src="$image.personal.timg" alt="">
            </div>
          </cell-box>
        </group>
        <group gutter="0" class="cell-global">
          <cell-box v-for="(item,index) in itemList" :key="index" :link="item.link" is-link>
            <span class="title">{{item.title}}</span>
          </cell-box>
          <x-switch class="vxa-switch" :title="'微信'" v-model="totalVal"
                    @on-change="switchTotalChange(totalVal)"></x-switch>
          <span v-if="!bindInfo" class="unbind">未绑定</span>
          <span v-else class="unbind">{{userHomeData.weixinUsername}}</span>
        </group>
      </div>
      <footer class="exit">
        <button class="exitbox" @click="apiUserClear">退出登录</button>
      </footer>
    </div>
  </transition>
</template>

<script>
  import {Cell, CellBox, Group, XSwitch} from 'vux'

  export default {
    name: "manage",
    components: {
      Group,
      Cell,
      CellBox,
      XSwitch
    },
    data() {
      return {
        totalVal: false,
        userHomeData: {
          weixinAvatar: this.$image.personal.timg,
          weixinUsername: ''
        },
        headerImg: "",
        toRightImg: this.$image.personal.Toleft,
        itemList: [
          {
            title: "修改个人信息",
            link: "manage/reviseInfo"
          },
          {
            title: "修改绑定手机",
            link: "manage/revisePhone"
          },
          {
            title: "修改登录密码",
            link: "manage/revisePassword"
          }
        ],
        userId: "",
        binding: false,
        bindInfo: false,
        userIdInfo: ''
      }
    },
    created() {
      this.userId = this.$cookie.getCookie("userId");
      if (this.$cookie.isLogin()) {
        console.log("有userId");
        if (this.$cookie.getUserInfo()) {
          this.userHomeData = this.$cookie.getUserInfo();
          console.log(this.userHomeData)
          this.userIdInfo = this.userHomeData.id;
          console.log(this.userHomeData);
          if (this.userHomeData.weixinId === '' || this.userHomeData.weixinId === null) {
            this.bindInfo = this.totalVal = false;
          } else {
            this.bindInfo = this.totalVal = true;
          }
        } else {
          this.apiUserHome();
        }
      } else {
        console.log("没有userId");
        this.$router.replace({path: '/login'});
      }
      // let code = this.$const.getQueryString('code');
      // let state = this.$const.getQueryString('state');
      // if (code || state) {
      //   this.wxOauthByCode(code, state);
      // }
    },
    mounted() {
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/my'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      switchTotalChange(totalVal) {
        if (totalVal) {
          this.wxAuthRedirect(totalVal);
        } else {
          this.bindingWxInfo(totalVal);
        }
      },
      wxAuthRedirect(state) {
        var redirect_uri = encodeURIComponent(this.$api.CURRENTIP.IP + '#/loginWeixin');
        var protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
        var wxUrl = protocol + '//open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$api.appId + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect'
        location.replace(wxUrl);
      },
      // 获得微信授权
      wxOauthByCode(code, state) {
        let params = {
          code: code
        }
        this.$axios.wxAuth.wxAuthByCode(params).then(res => {
          if (res.data.returnCode === 1) {
            this.bindingWxInfo();
            // this.linkPage(state, res.data.returnObject.openId);
            let wxxinxi = window.JSON.stringify(res.data.returnObject);
            window.localStorage.setItem('wx-auth', wxxinxi);
          } else {
            setTimeout(() => {
              this.$vux.toast.show({text: '上传微信授权信息失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
              this.$router.replace({path: '/rule'});
            }, 1000);
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '获取微信授权信息失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          setTimeout(() => {
            this.$router.replace({path: '/rule'});
          }, 1000)
        })
      },
      // 绑定或解除微信信息
      bindingWxInfo(totalVal) {
        let params = {
          userId: this.userIdInfo,
          binding: totalVal
        }
        this.$axios.user.bindingWxInfo(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log(res.data);
            this.bindInfo = this.totalVal = false;
            this.apiUserHome();
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      apiUserHome() {
        this.$axios.userHome.userhome({}).then(res => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            this.$cookie.setAuth(data);
            this.$cookie.set('userInfo', window.JSON.stringify(data));
            window.localStorage.setItem('wx-my-home', window.JSON.stringify(data));
          }
        })
      },
      // 退出登录
      apiUserClear() {
        this.$cookie.apiUserClear(this, '/my');
      }
    }
  }
</script>

<style lang="scss">
  .manage {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    padding-bottom: 50px;
    .manage-scroll {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .cell-global {
      .weui-cells {
        position: relative;
        .vux-cell-box.weui-cell {
          .title {
            font-size: 15px;
          }
        }
      }
    }
    .cell-global.header {
      .weui-cells {
        &:after {
          border: 0;
        }
      }
      .line1 {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #323232;
        font-size: 15px;
        font-family: PingFangSC-Regular, sans-serif;
        img {
          width: 45px;
          height: 45px;
          display: block;
          border-radius: 50%;
          border: 1px solid #ffb149;
        }
        span {
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          font-size: 15px;
          color: #323232;
        }
      }
    }
    .exit {
      width: 100%;
      height: 50px;
      position: absolute;
      left: 0;
      bottom: 0;
      .exitbox {
        border: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 50px;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        font-size: 18px;
        color: #fff;
        background: #ffc051;
        &:active {
          background-color: rgba(255, 192, 81, 0.9);
        }
      }
    }
    .vxa-switch {
      &.vux-x-switch {
        padding: 10px 15px;
      }
      .weui-label {
        font-weight: normal;
      }
    }
    .unbind {
      position: absolute;
      bottom: 9px;
      right: 75px;
      color: rgba(174, 174, 174, 1);
    }
  }
</style>
