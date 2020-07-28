<template>
  <div id="rankingList">
    <div class="contentBottom">
      <div class="ranking">
        <ul>
          <li>总积分榜</li>
          <li><span class="color rankNo">{{rankList.totalScoreIndexNo}}</span><img :src="userInfo.weixinAvatar" alt=""><span class="color nameInfo">{{userInfo.userName}}</span><span class="color">{{rankList.totalScore}}</span></li>
          <li v-for="(item, index) in rankList.totalScoreRank" :key="index">
            <span class="rankNo">{{index + 1}}</span>
            <img :src="item.weixinAvatar" alt="">
            <span class="nameInfo">{{item.userName}}</span>
            <span>{{item.totalScore}}</span>
          </li>
        </ul>
      </div>
      <div class="ranking">
        <ul>
          <li>答题得分榜</li>
          <li><span class="color rankNo">{{rankList.answerScoreIndexNo}}</span><img :src="userInfo.weixinAvatar" alt=""><span class="color nameInfo">{{userInfo.userName}}</span><span class="color">{{rankList.answerScore}}</span></li>
          <li v-for="(item, index) in rankList.answerScoreRank" :key="index">
            <span class="rankNo">{{index + 1}}</span>
            <img :src="item.weixinAvatar" alt="">
            <span class="nameInfo">{{item.userName}}</span>
            <span>{{item.answerScore}}</span>
          </li>
        </ul>
      </div>
      <div class="ranking">
        <ul>
          <li>邀请好友积分榜</li>
          <li><span class="color rankNo">{{rankList.inviteScoreIndexNo}}</span><img :src="userInfo.weixinAvatar" alt=""><span class="color nameInfo">{{userInfo.userName}}</span><span class="color">{{rankList.inviteScore}}</span></li>
          <li v-for="(item, index) in rankList.inviteScoreRank" :key="index">
            <span class="rankNo">{{index + 1}}</span>
            <img :src="item.weixinAvatar" alt="">
            <span class="nameInfo">{{item.userName}}</span>
            <span>{{item.inviteScore}}</span>
          </li>
        </ul>
      </div>
      <div class="ranking">
        <ul>
          <li>我的邀请</li>
          <!-- <li><span><img src="/static/img/competition/call.png" alt=""></span><img :src="userInfo.weixinAvatar" alt=""><span>{{userInfo.userName}}</span><span class="color">已打call</span><span class="color">+30</span></li> -->
          <div class="info">
          <li v-for="(item, index) in inviteList" :key="index">
            <span class="invitation" v-if="index == 0"><img src="/static/img/competition/call.png" alt=""></span>
            <span class="invitation" v-else>{{index}}</span>
            <img :src="item.weixinAvatar" alt="">
            <span class="nameInfo">{{item.userName}}</span>
            <span>
              <span class="color" v-if="item.inviteType == 2">已打call</span>
              <span class="color" v-else>已参与</span>
            </span>
            <span :class="{'color': item.inviteScore > 0}">+{{item.inviteScore}}</span>
          </li>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // answerScoreRank: [],
      // inviteScoreRank: [],
      // totalScoreRank: []
      rankList: [],
      inviteList: [],
      userInfo: {}
    };
  },
  created() {
    if (this.$cookie.get('userInfo')) {
      this.userInfo = JSON.parse(this.$cookie.get('userInfo'));
    }
    this.getRankingList();
    this.getMineInvite();
  },
  methods: {
    // 获取排行榜
    getRankingList() {
      let params = {
        userId: this.$cookie.get('userId')
      }
      this.$axios.mobApi.getRankingList(params).then((res) => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.rankList = res.data.returnObject;
          // this.rankList.answerScoreRank.forEach(e => {
          //   for (let i = 0; i < 5; i++) {
          //     e.userName = decodeURIComponent(e.userName);
          //   }
          // })
          // this.rankList.inviteScoreRank.forEach(e => {
          //   for (let i = 0; i < 5; i++) {
          //     e.userName = decodeURIComponent(e.userName);
          //   }
          // })
          // this.rankList.totalScoreRank.forEach(e => {
          //   for (let i = 0; i < 5; i++) {
          //     e.userName = decodeURIComponent(e.userName);
          //   }
          // })
        }
      })
    },
    // 获取我的邀请
    getMineInvite() {
      let params = {
        userId: this.$cookie.get('userId')
      }
      this.$axios.mobApi.getMineInvite(params).then((res) => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          let list = res.data.returnObject;
          for (let i = 0; i < list.length; i++) {
            if ((list[i].inviteType == 2 && list[i].isSecretary != false) || list[i].inviteType != 2) {
              this.inviteList.push(list[i]);
            }
            for (let j = 0; j < 5; j++) {
              list[i].userName = decodeURIComponent(list[i].userName);
            }
          }
        }
      })
    }
    
  }
}
</script>
<style lang='scss' scoped>
  #rankingList {
    .contentBottom {
      clear: both;
      display: flex;
      justify-content: space-between;
      height: 465px;
      margin-bottom: 30px;
      .ranking {
        .info {
          height: 385px;
          overflow: auto;
          // overflow-y: scroll;
          .color {
            margin-right: 5px;
          }
        }
        width:291px;
        height:465px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        padding: 0 14px;
        li:first-child {
          height: 45px;
          line-height: 45px;
          text-align: left;
          font-size:14px;
          font-weight:bold;
          color:rgba(255,255,255,1);
        }
        li {
          border-bottom: 1px solid #545454;
          height: 34px;
          span {
            font-size:12px;
            float: left;
            display: block;
            height: 34px;
            line-height: 34px;
            text-align: center;
            font-weight:bold;
            color:rgba(255,255,255,1);
          }
          .nameInfo {
            width: 150px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-align: left;
          }
          .rankNo {
            width: 36px;
          }
          span:first-child {
            // width: 20px;
            img {
              width: 16px;
              height: 15px;
              margin-top: 8px;
              margin-left: 5px;
            }
          }
          img {
            float: left;
            width: 32px;
            height: 32px;
            margin: 1px 10px 0 0;
          }
          span:last-child{
            float: right;
          }
          .invitation {
            width: 26px;
          }
        }
        .color {
          color:rgba(254,205,4,1);
        }
      }
      .ranking:last-child {
        li {
          span:nth-of-type(2) {
            width: 80px;
            text-align: left;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          span:nth-of-type(3) {
            span {
              width: 60px;
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>