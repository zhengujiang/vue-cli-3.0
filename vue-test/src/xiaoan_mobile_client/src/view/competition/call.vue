<template>
  <div id="comp-call">
    <div class="one"></div>
    <div class="call"></div>
    <div class="verse"></div>
    <div class="call-image" @click="onCallCheck"></div>
    <div class="join" @click="onoff"></div>
    <div v-transfer-dom>
      <x-dialog v-model="showToast">
        <div class="dialog-box">
          <div class="dialogInner">
            <div class="activity"></div>
            <div class="award"></div>
            <div class="joinUs"></div>
            <div class="refuse"></div>
            <div class="close"><img :src="$image.competition.dialog_icon_close"/></div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {XDialog} from 'vux'
  export default {
    name: "comp-call",
    components: {
      XDialog
    },
    data() {
      return {
        isCall: false,
        showToast: false,
        inviteId: '',
        userInfo: ''
      }
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    created() {
      if (this.$route.query.id) {
        this.inviteId = this.$route.query.id;
        window.sessionStorage.setItem('competition_user',
          window.JSON.stringify(Object.assign({}, this.$route.query, {isJoin: false})));
      }
      if (this.$cookie.isLogin()) {
        this.userInfo = this.$cookie.getUserInfo();
        if (this.userInfo.id == this.inviteId) {
          this.$router.replace({
            path: '/competition/home',
            query: Object.assign({}, this.$route.query, {source: 'call'})
          });
          window.sessionStorage.removeItem('competition_user');
        }
      }
    },
    methods: {
      checkUserCaseUpload() {
        let params = {}
        this.$axios.competition.checkUserCaseUpload(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log(res);
            let data = res.data.returnObject;
            if (data) {
              this.increaseSecretaryRecord();
            } else {
              this.$router.push({path: '/competition/upload'});
            }
          } else {
            this.$router.push({path: '/competition/upload'});
          }
        })
      },
      //
      checkCanInviteSecretart() {
        let params = {inviteId: this.inviteId};
        this.$axios.competition.checkCanInviteSecretart(params).then(res => {
          if (res.data.returnCode == 200) {
            this.isCall = res.data.returnObject;
            if (this.isCall) {
              window.sessionStorage.removeItem('competition_user');
              this.$vux.toast.show({text: '您已为好友打Call！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else {
              this.checkUserCaseUpload();
            }
          }
        })
      },
      // GET /competition/increaseSecretaryRecord
      increaseSecretaryRecord() {
        let params = {inviteId: this.inviteId};
        this.$axios.competition.increaseSecretaryRecord(params).then(res => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '打Call成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            window.sessionStorage.removeItem('competition_user');
          }
        })
      },
      onoff() {
        if (this.userInfo.id == this.inviteId) {
          this.$router.replace({path: '/competition/home', query: {source: 'call'}});
        } else {
          this.$router.replace({path: '/competition/home'});
        }
      },
      onCallCheck() {
        if (this.$cookie.isLogin()) {
          this.checkCanInviteSecretart();
        } else {
          this.$storage.loginStatus(this, '董秘打Call', `${window.location.href}&call=1`);
        }
      }
    }
  }
</script>

<style lang="scss">
  #comp-call {
    .call {
      width: 263px;
      height: 139px;
      margin: 24px auto 25px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/call_call.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .verse {
      width: 193px;
      height: 53px;
      margin: 0 auto;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/call_verse.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .call-image {
      width: 232px;
      height: 66px;
      margin: 24px auto 19px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/call_image.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .join {
      width: 232px;
      height: 66px;
      margin: 0 auto;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/call_join.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .vux-x-dialog {
      .weui-dialog {
        width: 100%;
        .dialog-box {
        }
        .dialogInner {
          position: relative;
          height: 462px;
          border: 2px solid #FFD020;
          border-radius: 2px;
          background: #1F1B1F;
          .activity {
            height: 56px;
            width: 278px;
            margin: 28px auto 13px;
            background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/dialog_activity.png) no-repeat;
            background-size: contain;
            background-origin: padding-box;
          }
          .award {
            height: 177px;
            width: 280px;
            margin: 0 auto 14px;
            background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/dialog_two.png) no-repeat;
            background-size: contain;
            background-origin: padding-box;
          }
          .joinUs {
            height: 66px;
            width: 232px;
            margin: 0 auto 14px;
            background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/dialog_joinUs.png) no-repeat;
            background-size: contain;
            background-origin: padding-box;
          }
          .refuse {
            height: 66px;
            width: 232px;
            margin: 0 auto;
            background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/dialog_refuse.png) no-repeat;
            background-size: contain;
            background-origin: padding-box;
          }
        }
        .close {
          position: absolute;
          right: -13px;
          top: -13px;
          width: 26px;
          height: 26px;
          img {
            width: 26px;
            height: 26px;
          }
        }
      }

    }
  }
</style>
