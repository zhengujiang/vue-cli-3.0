<template>
  <div id="integral">
    <div class="contentRight">
      <comp-banner></comp-banner>
      <div class="integration">
        <div class="title">
          <div class="score">
            <span>我的积分</span>
            <span class="activity" @click="activity">活动条款&nbsp; ></span>
          </div>
        </div>
        <div @mouseover="enterIn" @mouseout="leaveOut">
          <div v-if="socreDetail" id="textInner">
            <div><p>{{competition.totalScore}}</p><p>总积分</p></div>
            <div><p>{{competition.testFinishScore}}</p><p>答题积分</p></div>
            <div><p>{{competition.inviteScore}}</p><p>邀请积分</p></div>
          </div>
          <div v-else id="detailView">
            <el-button @click="getIntegralDetails" type="primary" size="medium">查看积分详情</el-button>
          </div>
        </div>
        
      </div>
      <div class="signIn">
        <span>每日签到</span><span :class="{'scale': isCheck}">+1</span>
        <div v-if="!signState" @click="checkIn">
          <el-button type="primary" size="mini">签到</el-button>
        </div>
        <div v-else>
          <el-button type="info" size="mini" class="info">已签到</el-button>
        </div>
      </div>
      <div class="call">
        <span>邀请董秘打Call</span><span>+30</span>
        <div v-if="!isInvite" @click="inviteCall">
          <el-button type="primary" size="mini">邀请</el-button>
        </div>
        <div v-else>
          <el-button type="info" size="mini" class="info">已邀请</el-button>
        </div>
      </div>
      <div class="share">
        <span>邀请好友</span><span>+5</span><el-button type="primary" size="mini" @click="inviteJoin">邀请</el-button>
        <!-- <span>邀请好友</span><span>+5</span><el-button type="primary" size="mini" @click="callDialog=true">邀请</el-button> -->
      </div>
    </div>
    <!-- <el-dialog @close="close" :visible.sync="callDialog" :show-close="false" custom-class="callDialog" width="695px">
      <div class="close-button" @click="callDialog=false"><img src="/static/img/competition/close.png" alt=""></div>
      <div class="name">
        <span class="user">{{name}}</span>
        <span class="info">正在参加董办知识大赛</span>
      </div>
      <div class="dialogImage"></div>
      <div class="button-group">
        <div><el-button class="btn" type="primary" size="medium" @click="checkCanInviteSecretart">打call</el-button></div>
        <div><el-button class="btn" type="primary" size="medium" @click="join">我要参加</el-button></div>
      </div>
    </el-dialog> -->
    <el-dialog :visible.sync="openScore" :show-close="false" custom-class="openScore" width="695px">
      <div class="close-button" @click="openScore=false"><img src="/static/img/competition/close.png" alt=""></div>
      <div class="titleInfo"><span>积分详情</span></div>
      <div class="scoreInfo">
        <ul>
          <li v-for="(item, index) in detailList" :key="index">
            <span class="classify" v-if="item.notice">{{item.notice}}</span>
            <span class="classify" v-else>{{detailObj[item.type]}}</span>
            <span class="date">{{transTime(item.sortTime)}}</span>
            <span class="account" v-if="item.type == 'answerScore'">+{{item.correctNum}}</span>
            <span class="account" v-if="item.type == 'signScore'">+1</span>
            <span class="account" v-if="item.type == 'inviteScore'">+5</span>
            <span class="account" v-if="item.type == 'inviteeScore'">+3</span>
            <span class="account" v-if="item.type == 'secretary'">+30</span>
          </li>
        </ul>
      </div>
    </el-dialog>
    <link-dialog v-if="linkValue" @upAdd="upTitle($event)" :name='name' :userId="userId" :type="type" :title="title" :linkValue="linkValue"></link-dialog>
  </div>
</template>

<script>
  import CompBanner from './banner.vue'
  import linkDialog from './linkDialog.vue'

  export default {
    name: "integral",
    components: {
      CompBanner,
      linkDialog
    },
    data () {
      return {
        callDialog: false,
        title: '',
        linkValue: false,
        userId: '',
        signState: false,
        competition: {},
        isCheck: false,
        type: '',
        isInvite: false,
        userInfo: {},
        name: '',
        openScore: false,
        detailList: [],
        detailObj: {
          answerScore: '答题',
          signScore: '签到',
          inviteScore: '邀请',
          inviteeScore: '接收邀请',
          secretary: '董秘打Call'
        },
        socreDetail: true
      }
    },
    // props: ['competition'],
    created() {
      if (sessionStorage.getItem('id')) {
        this.inviteId = JSON.parse(sessionStorage.getItem('id'));
        this.name = JSON.parse(sessionStorage.getItem('name'));
        this.callDialog = true;
      }
      this.userId = this.$cookie.get('userId');
      if (this.$cookie.get('userInfo')) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'));
      }
      if (this.$route.query.call && this.$route.query.call == 'myself') {
        this.inviteCall();
      }
      this.getUserCheckStatus();
      this.getAllTestPaper();
      this.checkInviteSecretary();
    },
    methods: {
      enterIn() {
        this.socreDetail = false;
      },
      leaveOut() {
        this.socreDetail = true;
      },
      transTime(val) {
        return this.$common.transTime(val)[1]
      },
      getIntegralDetails () {
        this.openScore = true;
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.getIntegralDetails(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.detailList = res.data.returnObject;
          }
        })
      },
      activity () {
        this.$router.push({
          path: '/competition/term', query: {
            content: 1 
          }
        })
      },
      close () {
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('name');
      },
      join () {
        this.$router.push("/competition/home");
        this.callDialog = false;
      },
      upTitle (item) {
        this.linkValue = item;
      },
      inviteCall () {
        this.linkValue = true;
        this.title = '请董秘为我打Call';
        this.type = 2;
        this.name = this.userInfo.userName;
        console.log(this.name);
      },
      inviteJoin () {
        this.linkValue = true;
        this.title = '邀请好友';
        this.type = 1;
      },
      getUserCheckStatus () {
        let params = {
          userId: this.userId
        }
        this.$axios.mobApi.getUserCheckStatus(params).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.signState = res.data.returnObject;
        }
        }).catch(err => {
      })
      },
      getAllTestPaper() {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.getAllTestPaper(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              res.data.returnObject.testPaperList.forEach(e => {
                e.show = true;
              })
              this.competition = res.data.returnObject.competition;
            }
          }
        })
      },
      checkIn() {
        let params = {
          userId: this.$cookie.get('userId'),
          inviteId: this.inviteId
        }
        this.isCheck = true;
        this.$axios.mobApi.checkIn(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.signState = true;
            this.getAllTestPaper();
          }
        })
      },
      checkInviteSecretary() {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.checkInviteSecretary(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.isInvite = true;
            } else {
              this.isInvite = false
            }
          }
        })
      }
      // 是否已帮用户打CALL
      // checkCanInviteSecretart() {
      //   let params = {
      //     userId: this.$cookie.get('userId'),
      //     inviteId: this.inviteId
      //   }
      //   this.$axios.mobApi.checkCanInviteSecretart(params).then((res) => {
      //     if (res.data.returnCode == 200 || res.data.returnCode == 1) {
      //       if (res.data.returnObject) {
      //         this.$message({showClose: true, message: '您已为好友打CALL！', type: 'error'});
      //         this.callDialog = false;
      //         sessionStorage.removeItem('userId');
      //         sessionStorage.removeItem('name');
      //       } else {
      //         this.increaseSecretaryRecord();
      //       }
      //     }
      //   })
      // },
      // // 增加董秘打CALL记录
      // increaseSecretaryRecord() {
      //   let params = {
      //     userId: this.$cookie.get('userId'),
      //     inviteId: this.inviteId
      //   }
      //   this.$axios.mobApi.increaseSecretaryRecord(params).then((res) => {
      //     if (res.data.returnCode == 200 || res.data.returnCode == 1) {
      //       this.$message({showClose: true, message: '您已成功为好友打CALL！', type: 'success'});
      //       this.callDialog = false;
      //       sessionStorage.removeItem('userId');
      //       sessionStorage.removeItem('name');
      //     }
      //   })
      // }
    }
  }
</script>
<style>
  .scale {
    animation: identifier 1s;
  }
  @keyframes identifier {
    0% {transform: scale(1)}
    50% {transform: scale(2)}
    100% {transform: scale(1)}
  }
</style>

<style lang="scss">
  #integral {
    .contentRight {
      .integration {
        height:147px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        // padding: 0 17px;
        margin-bottom: 16px;
        .title {
          padding: 0 17px;
          height: 45px;
          line-height: 45px;
          text-align: left;
          font-size:14px;
          font-weight:600;
          color:rgba(255,255,255,1);
          .score {
            border-bottom: 1px solid #545454;
          }
          .activity {
            cursor: pointer;
            margin-left: 120px;
            color: #FCCD05;
          }
        }
        #textInner {
          display: flex;
          height: 102px;
          justify-content: center;
          align-items: center;
          div {
            width: 87px;
            height: 22px;
            text-align: center;
            border-right: 1px solid rgba(84,84,84,1);
            p {
              position: relative;
              top: -5px;
            }
            p:first-child {
              font-size:16px;
              font-weight:600;
              color:rgba(255,255,255,1);
              margin-bottom: 3px;
            }
            p:last-child {
              font-size:12px;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
          }
          div:last-child {
            border: none;
          }
        }
        #detailView {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          background-color: #47474B;
          button {
            background-color: rgba(254,205,4,1);
            color: #222027;
            font-weight:400;
            font-size: 14px;
            width:123px;
          }
        }
      }
      .signIn, .call, .share {
        height:46px;
        margin-bottom: 16px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        padding: 0 17px;
        line-height: 46px;
        span {
          display: block;
          float: left;
        }
        span:first-child {
          text-align: left;
          width: 98px;
          font-size:14px;
          font-weight:600;
          color:rgba(255,255,255,1);
        }
        span:nth-child(2) {
          font-size:14px;
          width: 85px;
          font-weight:600;
          text-align: center;
          color:rgba(254,205,4,1);
        }
        .el-button {
          float: right;
          width:72px;
          height: 24px;
          margin-top: 10px;
          background:rgba(254,205,4,1);
          border-radius:4px;
          position: relative;
          span {
            display: inline-block;
            position: absolute;
            left: 0;
            top: 0;
            height: 24px;
            width: 72px;
            line-height: 24px;
            text-align: center;
            font-size:14px;
            font-weight:400;
            color:rgba(34,32,39,1);
          }
        }
        .info {
          background: #909399;
        }
      }
    }
    .openScore {
      padding: 0 54px;
      height: 465px;
      width: 695px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      .el-dialog__body {
        padding: 10px 5px;
      }
      .close-button {
        cursor: pointer;
        position: absolute;
        top: 40px;
        right: 39px;
        img {
          width: 33px;
          height: 33px;
        }
      }
      .titleInfo {
        text-align: center;
        line-height:50px;
        font-size:16px;
        font-weight:600;
        color:rgba(255,201,1,1);
        border-bottom: 1px solid #545454;
      }
      .scoreInfo {
        height: 320px;
        width: 100%;
        padding-top: 10px;
        overflow: auto;
        .classify, .account{
          font-size:16px;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:28px;
        }
        .classify {
          display: inline-block;
          width: 300px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          vertical-align: middle
        }
        li {
          margin-bottom: 5px;
        }
        .date {
          font-size:14px;
          font-weight:400;
          color:rgba(204,204,204,1);
          line-height:28px;
          display: inline-block;
          width: 200px;
          // margin-left: 52px;
        }
        .account {
          float: right;
        }
        .classify {
          text-align: left;
        }
      }
    }
    .callDialog {
      padding: 0 54px;
      height: 620px;
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
          display: inline-block;
          width: 137px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          vertical-align: middle;
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
  }
</style>
