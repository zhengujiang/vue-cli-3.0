<template>
  <div id="competitionCall">
    <el-dialog :before-close="closeDialog" :visible.sync="callDialog" :show-close="false" custom-class="callDialog" width="695px">
      <div class="name">
        <span class="user userName">{{name}}</span>
        <span class="info">正在参加董办知识大赛</span>
      </div>
      <div class="dialogImage"></div>
      <div class="button-group">
        <div><el-button class="btn" type="primary" size="medium" @click="getCall">打call</el-button></div>
        <!-- <div><el-button class="btn" type="primary" size="medium" @click="join">我要参加</el-button></div> -->
      </div>
    </el-dialog>
    <el-dialog :before-close="closeDialog" :visible.sync="callValue" :show-close="false" top="30vh" custom-class="dialogTurn" width="695px">
      <div class="name">
        <p class="user">您已为 <span class="nameAge"> {{name}} </span> 成功打Call!</p>
        <p class="turn"><span class="time">{{time}} </span> 秒后跳转到首页 <span class="turnNow" @click="turnNow"> 立即跳转</span></p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "competitionCall",
      data() {
        return {
          name: '',
          callDialog: false,
          inviteId: '',
          callValue: false,
          time: 3,
          timer: '',
          userId: ''
        }
      },
      created() {
        this.userId = this.$cookie.get('userId');
        this.inviteId = JSON.parse(sessionStorage.getItem('id'));
        this.name = JSON.parse(sessionStorage.getItem('name'));
        this.callDialog = true;
        if (this.userId == this.inviteId) {
          this.$router.push('/competition/home?call=myself')
        }
      },
      destroyed () {
        clearInterval(this.timer);
      },
      methods: {
        callBtn () {
          this.callValue = true;
          this.callDialog = false;
          this.timer = setInterval(() => {
            this.time --;
            if (this.time == 0) {
              clearInterval(this.timer);
              if (sessionStorage.getItem('isJoin')) {
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('type');
              }
              this.$router.push('/competition');
            }
          }, 1000) 
        },
        turnNow () {
          clearInterval(this.timer);
        
          if (sessionStorage.getItem('isJoin')) {
            sessionStorage.removeItem('type');
            sessionStorage.removeItem('id');
          }
          this.$router.push('/competition');
        },
        getCall() {
          if (!this.userId) {
            this.$router.push(`/login?redirect_url=competition/call?type=2&id=${this.inviteId}&name=${this.name}`)
          } else {
            this.checkUserCaseUpload();
          }
        },
        checkCanInviteSecretart() {
          let params = {
            userId: this.userId,
            inviteId: this.inviteId
          }
          this.$axios.mobApi.checkCanInviteSecretart(params).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              if (res.data.returnObject) {
                this.callBtn();
              } else {
                this.callDialog = true;
                this.increaseSecretaryRecord();
              }
            }
          })
        },
        // 增加董秘打CALL记录
        increaseSecretaryRecord() {
          let params = {
            userId: this.userId,
            inviteId: this.inviteId
          }
          this.$axios.mobApi.increaseSecretaryRecord(params).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.callBtn();
              sessionStorage.removeItem('id');
              sessionStorage.removeItem('name');
              sessionStorage.removeItem('type');
            }
          })
        },
        join () {
          this.$router.push("/competition/home");
          this.callDialog = false;
        },
        // 是否上传名片
        checkUserCaseUpload () {
          let params = {
            userId: this.$cookie.get('userId')
          }
          this.$axios.mobApi.checkUserCaseUpload(params).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              if (res.data.returnObject) {
                if (this.userId == this.inviteId) {
                  this.$router.push('/competition/home?call=myself')
                } else {
                  this.checkCanInviteSecretart();
                }
              } else {
                this.$router.push('/competition/upload?iscall=true');
              }
            }
          })
        },
        closeDialog () {
        }
      }
    }
</script>

<style lang="scss">
  #competitionCall {
    min-height: 800px;
    background: url(/static/img/competition/backG.jpg) no-repeat;
    .userName {
      display: inline-block;
      width: 145px;
      overflow: hidden;
      height: 30px;
      vertical-align: middle;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .callDialog {
      padding: 0 54px;
      height: 570px;
      width: 695px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      .name {
        font-size: 24px;
        height: 30px;
        line-height: 30px;
        margin-top: 50px;
        text-align: center;
        .user {
          color: #FFFFFF;
        }
        .info {
          display: inline-block;
          color: #FFCE04;
          vertical-align: middle;
        }
      }
      .el-dialog__header {
        padding: 0px;
      }
      .close-button {
        cursor: pointer;
        position: absolute;
        top: 52px;
        right: 40px;
        img {
          width: 33px;
          height: 33px;
        }
      }
      .dialogImage {
        width: 389px;
        height: 322px;
        margin: 10px auto 0px;
        background: url(/static/img/competition/callPage.png) no-repeat;
        background-size: contain;
      }
      .button-group {
        width: 100%;
        display: flex;
        justify-content:center;
        flex-direction:column;
        align-items:center;
        button:first-child {
          margin-bottom: 6px;
        }
        .btn {
          padding: 0;
          width: 164px;
          height: 35px;
          background:rgba(251,203,5,1);
          border-radius:4px;
          span {
            font-size:16px;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
        }
      }
    }
    .dialogTurn {
      padding-top: 10px 0;
      height: 160px;
      width: 695px;
      // border: 1px solid rgba(251,203,5,1);
      background: url(/static/img/competition/dialogTurn.png) no-repeat;
      background-size: 100% 100%;
      .el-dialog__header {
        padding: 0px;
      }
      .el-dialog__body {
        padding-top: 32px;
      }
      .name {
        font-size: 24px;
        height: 30px;
        line-height: 30px;
        margin-top: 17px;
        text-align: center;
        .user {
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 600;
          .nameAge {
            color: #F1C600;
          }
        }
        .turn {
          font-size: 12px;
          color: #D1D1D1;
          .turnNow {
            cursor: pointer;
            text-decoration: underline;
          }
          .time {
            color: #F1C600;
          }
        }
      }
    }
  }
</style>
