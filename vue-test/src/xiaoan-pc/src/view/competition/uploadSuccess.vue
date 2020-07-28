<template>
  <div id="uploadSuccess" class="content">
    <div class="contentLeft">
      <div class="success-image"></div>
      <div class="time"><span>{{time}}</span>秒后自动跳转到活动首页。</div>
      <div class="button-href" @click="back"></div>
    </div>
    <div class="contentRight">
      <comp-banner></comp-banner>
      <reward></reward>
      <!-- <div class="reward">
        <div class="title">活动奖励</div>
        <p>本次活动设置网络海选、区域赛、决赛三个阶段。</p>
        <p>网络海选（2018.11.22-12.05）</p>
        <p>
          参加网络海选赚积分，赢奖励！
          1、拼综合实力！积分总数排名前十的选手，每人将获得500元的奖励；<br/>
          2、拼脑力！全部完成本次知识竞赛三套题，平均得分排名前十的选手（分数相同的以完成时间快的为优先），每人将获得信公小安2019年全年出版物；<br/>
          3、拼人缘！通过邀请好友获得积分排名前十的选手，每人将获得价值9999元的信公小安企业版会员一年；<br/>
          4、阳光普照奖！所有参赛者将获得信公小安企业版三个月试用权。
        </p>
        <p>区域赛-决赛</p>
        <p>
          冠军奖金-5万元<br/>
          最具人气奖-2万元<br/>
          最具表现奖-2万元<br/>
          最具机智奖-2万元
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>
  import CompBanner from './components/banner.vue'
  import reward from './components/reward.vue'
  export default {
    name: "uploadSuccess",
    components: {
      CompBanner,
      reward
    },
    data() {
      return {
        time: 3,
        timer: null,
        type: ''
      }
    },
    created() {
      this.type = JSON.parse(sessionStorage.getItem('type'));
      this.changeTime();
    },  
    methods: {
      back() {
        if (this.type == 2) {
          this.$router.push('/competition/call');
        } else {
          this.$router.push('/competition/home');
        }
      },
      changeTime() {
        this.timer = setInterval(e => {
          this.time--
          if (this.time == 0) {
            if (this.type == 2) {
              this.$router.push('/competition/call');
            } else {
              this.$router.push('/competition/home');
            }
          }
        }, 1000)
      }
    },
    destroyed() {
      clearInterval(this.timer);
    }
  }
</script>

<style lang="scss">
  #uploadSuccess {
    min-height: 800px;
    .contentLeft {
      height: 466px;
      .success-image {
        width: 358px;
        height: 147px;
        margin: 59px auto 20px;
        background: url(/static/img/competition/uploadSuccess.png) no-repeat;
        background-size: contain;
      }
      .time {
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
        span {
          color: #FFCE04;
          margin-right: 5px;
        }
      }
      .button-href {
        width: 181px;
        height: 52px;
        margin: 64px auto 110px;
        background: url(/static/img/competition/Button_href.png) no-repeat;
        background-size: contain;
        cursor: pointer;
      }
    }
    .contentRight {
      .reward {
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
        p:nth-child(2) {
          font-size: 14px;
          color: #FFFFFF;
          margin-top: 10px;
          line-height: 18px;
        }
        p:nth-child(3), p:nth-child(5) {
          font-size: 14px;
          color: #FFFFFF;
          margin-top: 15px;
          line-height: 18px;
        }
        p:nth-child(4), p:last-child {
          font-size: 12px;
          color: #E3E3E3;
          line-height: 18px;
        }
      }
    }
  }
</style>
