<template>
  <div id="reward">
    <div class="title">活动奖励</div>
    <p class="one">本次活动设置网络海选、区域赛、决赛三个阶段。</p>
    <p class="time">网络海选（2018.11.22-12.05）</p>
    <p class="two">网络海选奖品：</p>
    <p class="three">
        1、拼综合实力！总积分排名前十的选手，每人将获得500元的奖励；<br/>
        2、拼脑力！答题得分排名前十的选手（答题得分相同的以完成时间快的为优先），每人将获得信公2019年全年出版物；<br/>
        3、拼人缘！邀请好友获得积分排名前十的选手，每人将获得价值9999元的信公小安企业版会员一年；<br/>
        4、阳光普照奖！所有参赛者将获得信公小安企业版三个月试用权。
    </p>
    <p class="two">区域赛-决赛</p>
    <p class="three">冠军奖金-5万元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;决赛入围选手-1万元/人</p>
    <div class="btn">
        <el-button type="primary" size="medium" @click="showTerm">查看活动条款</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      
    };
  },
  methods: {
    showTerm() {
      this.$router.push({path: '/competition/term', query: {content: 1}});
    }
  }
}
</script>
<style lang='scss' scoped>
    #reward {
      width:292px;
      height:465px;
      border:1px solid rgba(84,84,84,1);
      border-radius:4px;
      padding: 0 17px 15px;
      .title {
        height: 45px;
        line-height: 45px;
        text-align: left;
        font-size: 14px;
        color: #FFFFFF;
        border-bottom: 1px solid rgba(84,84,84,1);
      }
      .one {
        font-size: 14px;
        color: #FFFFFF;
        margin-top: 10px;
        line-height: 18px;
      }
      .two {
        font-size: 14px;
        color: #FFFFFF;
        margin-top: 15px;
        line-height: 18px;
      }
      .three {
        font-size: 12px;
        color: #E3E3E3;
        line-height: 18px;
      }
      .time {
        font-size: 14px;
        color: #FFFFFF;
        margin-top: 15px;
        line-height: 18px;
      }
      .btn {
        margin-top: 20px;
        .el-button {
          margin: 0 auto;
          display: inherit;
          background-color: #FFCE04;
          color: #545454
        }
      }
    }
</style>