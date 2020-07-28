<template>
  <div id="end" class="content">
    <div class="contentLeft">
      <div class="one"></div>
      <div class="choose">
        <span></span><span>你的战绩</span><span></span>
      </div>
      <p class="scoreInner">哇！您的战绩不错啊！小安佩服！</p>
      <table class="table">
        <tr>
          <td></td>
          <td>得分</td>
          <td>排名</td>
          <td class="last">奖励</td>
        </tr>
        <tr>
          <td>总积分</td>
          <td>{{rankList.totalScore}}</td>
          <td>{{rankList.totalScoreIndexNo}}</td>
          <td rowspan="3" class="awardInner">
            <!-- <span>物质犒劳一份： 精神食粮一袋： 工作得力帮手 一枚： <br/>通关钥匙一把：</span>
            <span>500元的奖励 <br/>信公小安2019年全年出版物 <br/><br/>价值9999元的信公小安企业版会员一年 <br/>您将有资格参与本次竞赛的线下场，赢取高达50000元的奖金！我们不见不散！ </span> -->
            <!-- <p v-if="sun"><span>阳光普照奖！信公小安企业版三个月试用权。</span></p> -->
            <p v-if="totalScoreNo"><span>物质犒劳一份 : 500元的奖励 </span></p>
            <p v-if="answerScoreNo"><span>精神食粮一袋 : 信公小安2019年全年出版物 </span></p>
            <p v-if="inviteScoreNo"><span>得力帮手一枚 : 价值9999元的信公小安企业版会员一年</span></p>
            <p v-if="key"><span>通关钥匙一把 : 您将有资格参与本次竞赛的线下场，赢取高达50000元的奖金！我们不见不散！</span></p>
            <p><span v-if="sunshine">阳光普照奖 :&nbsp;&nbsp;&nbsp;&nbsp; 信公小安企业版三个月试用权 </span></p>
          </td>
        </tr>
        <tr>
          <td>答题得分</td>
          <td>{{rankList.answerScore}}</td>
          <td>{{rankList.answerScoreIndexNo}}</td>
        </tr>
        <tr>
          <td>邀请好友积分</td>
          <td>{{rankList.inviteScore}}</td>
          <td>{{rankList.inviteScoreIndexNo}}</td>
        </tr>
      </table>
      <p class="peroration">本次活动已结束，感谢您的参与，期待与您的下一次相遇！</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "end",
    components: {
    },
    created() {
      this.userId = this.$cookie.get('userId');
      this.getRankingList();
    },
    data () {
      return {
        userId: '',
        rankList: [],
        totalScoreNo: false,
        answerScoreNo: false,
        inviteScoreNo: false,
        key: false,
        sun: false,
        sunshine: true
      }
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
            if (this.rankList.totalScoreIndexNo <= 10) {
              this.totalScoreNo = true;
            }
            if (this.rankList.totalScoreIndexNo <= 100) {
              this.key = true;
            }
            // if (this.rankList.totalScoreIndexNo > 10) {
            //   this.sun = true;
            // }
            if (this.rankList.answerScoreIndexNo <= 10) {
              this.answerScoreNo = true;
            }
            if (this.rankList.inviteScoreIndexNo <= 10) {
              this.inviteScoreNo = true;
              this.sunshine = false;
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #end {
    .choose {
      color: #FFFFFF;
      font-size: 16px;
      width: 183px;
      text-align: center;
      margin: 0 auto 5px;
      clear: both;
      height: 25px;
      span {
        display: block;
        float: left;
        width: 95px;
        font-weight:600;
      }
      span:first-child, span:last-child {
        height: 2px;
        background: #F7CE35;
        width: 44px;
        margin-top: 10px;
      }
    }
    .contentLeft {
      margin-left: 150px;
      height: 513px;
      .one {
        width: 400px;
        height: 164px;
      }
      .peroration {
        height:14px;
        font-size:14px;
        font-weight:400;
        color:rgba(141,141,141,1);
        margin-left: 19px;
        // line-height:69px;
      }
      .scoreInner {
        font-size:14px;
        font-weight:400;
        color:rgba(255,206,4,1);
        text-align: center;
      }
      .table {
        width: 858px;
        height: 162px;
        margin: 20px auto 11px;
        font-size:14px;
        font-weight:600;
        color:rgba(255,255,255,1);
        td {
          border:1px solid rgba(84,84,84,1);
        }
        td:first-child {
          width: 120px;
          padding: 14px;
        }
        td:nth-child(2), td:nth-child(3) {
          width: 50px;
          text-align: center;
        }
        .last {
          padding-left: 14px;
        }
        .awardInner {
          color: #FFFFFF;
          font-weight: 400;
          padding-left: 14px;
          line-height: 22px;
        }
      }
    }
  }
</style>
