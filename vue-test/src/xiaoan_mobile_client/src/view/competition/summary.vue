<template>
  <div id="comp-summary">
    <div v-if="isApply">
      <div class="summary-title"></div>
      <div class="summary">
        <p class="name">哇！<span class="username vxa-ellipsis">{{userName}}</span>的战绩不错啊啊！小安佩服</p>
        <p class="points">
          恭喜您获得积分<span>{{rankingData.totalScore}}</span>分！位列第<span>{{rankingData.totalScoreIndexNo}}</span>名！</p>
        <p class="score">
          恭喜您答题得分<span>{{rankingData.answerScore}}</span>分！位列第<span>{{rankingData.answerScoreIndexNo}}</span>名</p>
        <p class="share">
          恭喜您获得邀请好友积分<span>{{rankingData.inviteScore}}</span>分！位列第<span>{{rankingData.inviteScoreIndexNo}}</span>名</p>
      </div>
      <div class="get"><span class="border">您的奖励:</span></div>
      <div class="getInner">
        <p class="flex-box" v-if="set.a"><span>物质犒劳一份:</span><span class="col">500元的奖励</span></p>
        <p class="flex-box" v-if="set.b"><span>精神食粮一袋:</span><span class="col">信公小安2019年全年出版物</span></p>
        <p class="flex-box" v-if="set.c"><span>得力帮手一枚:</span><span class="col">价值9999元的信公小安企业版会员一年</span></p>
        <p class="flex-box" v-if="set.d"><span>通关钥匙:</span><span
          class="col last">您将有资格参与本次竞赛的区域赛，赢取高达50000元的奖金！我们不见不散！</span>
        </p>
        <p class="flex-box" v-if="!set.c"><span>阳光普照奖:</span><span>信公小安企业版三个月试用权</span></p>
      </div>
      <div class="share-button" v-if="isShare"><img :src="$image.competition.summary_qrcode" alt=""></div>
      <div class="share-button result" @click="goMyinvite" v-else></div>
    </div>
    <!---->
    <div v-else>
      <div class="back-img car1"></div>
      <div class="back-img set3"></div>
      <div class="back-img set1"></div>
      <div class="back-img set2"></div>
      <div class="back-img qrcode" v-if="isShare"><img :src="$image.competition.summary_qrcode2" alt=""></div>
      <div class="back-img qrcode result" v-else @click="goMyinvite"></div>
    </div>
    <!------------------------------------------------------------------>
    <div id="shareDialog" v-transfer-dom>
      <x-dialog hide-on-blur v-model="shareShadow" mask-z-index="5000">
        <div class="share-box" @click.prevent="shareShadow = false">
          <img :src="$image.competition.share" alt="">
        </div>
      </x-dialog>
    </div>
    <!------------------------------------------------------------------>
  </div>
</template>

<script>
  import {XDialog, TransferDomDirective as TransferDom} from 'vux'
  export default {
    name: "summary",
    components: {
      XDialog
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        isShare: false,
        competitionData: {},
        rankingData: {
          "inviteScore": 0,
          "totalScoreIndexNo": 0,
          "inviteScoreIndexNo": 0,
          "answerScore": 0,
          "userName": "XXX",
          "totalScore": 0,
          "answerScoreIndexNo": 0
        },
        userInfo: {
          userName: ''
        },
        userId: '',
        userName: '',
        shareShadow: false,
        set: {
          a: false,
          b: false,
          c: false,
          d: false
        },
        isApply: false
      }
    },
    created() {
      if (this.$route.query.id) {
        // 来源于分享
        this.userId = this.$route.query.id;
        if (this.$cookie.isLogin()) {
          this.userInfo = this.$cookie.getUserInfo();
          if (this.userId == this.userInfo.id) {
            this.isShare = true;
          } else {
            this.isShare = false;
          }
        }
        //
        this.checkUserApply();
      } else {
        // 没有id 看自己的
        if (this.$cookie.isLogin()) {
          this.userInfo = this.$cookie.getUserInfo();
          this.userId = this.userInfo.id;
          this.$router.replace({query: {id: this.userId}});
          this.isShare = true;
          this.checkUserApply();
        } else {
          this.isShare = false;
          this.$storage.loginStatus(this, '知识竞赛', window.location.href);
        }
      }
    },
    watch: {},
    mounted() {
      let shareTitle = '我的“董办知识大赛”成绩单，速来查看';
      let shareLink = decodeURI(`${this.$api.CURRENTIP.IP}#/competition/summary?id=${this.userId}`); // 分享链接
      let shareDesc = "信公杯·董办知识大赛海选阶段现已圆满结束！"; // 描述
      this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
    },
    methods: {
      goMyinvite() {
        if (this.$cookie.isLogin()) {
          this.userInfo = this.$cookie.getUserInfo();
          this.userId = this.userInfo.id;
          this.$router.replace({query: {id: this.userId}});
          this.isShare = true;
          this.checkUserApply();
        } else {
          this.isShare = false;
          this.$storage.loginStatus(this, '知识竞赛', window.location.href);
        }
      },
      //
      checkUserApply() {
        let params = {
          userId: this.userId,
          token: ''
        };
        this.$axios.competition.checkUserApply(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log(res);
            let data = res.data.returnObject;
            this.isApply = data;
            if (data) {
              this.set = {
                a: false,
                b: false,
                c: false,
                d: false
              }
              this.getRankingList();
            }
            this.$nextTick(() => {
              let shareTitle = '我的“董办知识大赛”成绩单，速来查看';
              let shareLink = decodeURI(`${this.$api.CURRENTIP.IP}#/competition/summary?id=${this.userId}`); // 分享链接
              let shareDesc = "信公杯·董办知识大赛海选阶段现已圆满结束！"; // 描述
              this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
            })
          }
        }).catch(err => {

        })
      },
      //
      getRankingList() {
        let params = {
          userId: this.userId,
          token: ''
        };
        this.$nextTick(() => {
          let shareTitle = '我的“董办知识大赛”成绩单，速来查看';
          let shareLink = decodeURI(`${this.$api.CURRENTIP.IP}#/competition/summary?id=${this.userId}`); // 分享链接
          let shareDesc = "信公杯·董办知识大赛海选阶段现已圆满结束！"; // 描述
          this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
        })
        this.$axios.competition.getRankingList(params).then(res => {
          if (res.data.returnCode == 200) {
            this.rankingData = res.data.returnObject;
            this.userName = this.rankingData.userName;
            if (this.rankingData.totalScoreIndexNo <= 10) {
              this.set.a = true;
            }
            if (this.rankingData.answerScoreIndexNo <= 10) {
              this.set.b = true;
            }
            if (this.rankingData.inviteScoreIndexNo <= 10) {
              this.set.c = true;
            }
            if (this.rankingData.totalScoreIndexNo <= 100) {
              this.set.d = true;
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #comp-summary {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .summary-title {
      width: 100%;
      height: 85px;
      margin: 0 auto;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_title.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .back-img {
      /*width: 232px;*/
      /*height: 76px;*/
      /*margin: 14px auto;*/
      /*background: url(/static/img/competition/summary_Button_share.png) no-repeat;*/
      /*background-size: contain;*/
      /*background-origin: padding-box;*/
      &.car1 {
        height: 50px;
        width: 138.5px;
        margin: 44px auto auto;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_car1.png) no-repeat;
        background-size: contain;
      }
      &.set3 {
        height: 40px;
        width: 292px;
        margin: 23px auto auto;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_set3.png) no-repeat;
        background-size: contain;
      }
      &.set1 {
        height: 92px;
        width: 278px;
        margin: 43px auto auto;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_set1.png) no-repeat;
        background-size: contain;
      }
      &.set2 {
        height: 35px;
        width: 260px;
        margin: 25px auto auto;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_set2.png) no-repeat;
        background-size: contain;
      }
      &.qrcode {
        /*height: 114px;*/
        width: 165px;
        margin: 60px auto auto;
        /*background: url(/static/img/competition/summary_qrcode2.png) no-repeat;*/
        /*background-size: contain;*/
        /*background-origin: padding-box;*/
        img {
          width: 100%;
          height: auto;
        }
        &.result {
          height: 66px;
          width: 254px;
          margin: 83px auto auto;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_go_answer.png) no-repeat;
          background-size: contain;
        }
      }
    }
    .summary {
      width: 343px;
      height: 217px;
      margin: 10px auto 13px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_score-border.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
      position: relative;
      p {
        margin-left: 14px;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 1;
        padding-top: 8px;
        &.score {
          padding-top: 10px;
        }
        &.share {
          padding-top: 11px;
        }
        span {
          color: #FFCE04;
          font-size: 26px;
          font-weight: 600;
          margin: 0 5px;
        }
      }
      .name {
        font-size: 9px;
        padding-top: 82px;
        .username {
          font-size: 9px;
          display: inline-block;max-width: 120px;
          vertical-align: middle;
          color: #FFCD04;
        }
      }
      .points {
      }
    }
    .get {
      margin: 0 0 13px 32px;
      line-height: 21px;
      font-size: 16px;
      color: #141419;
      .border {
        display: inline-block;
        padding-left: 15px;
        color: #FDCE04;
        line-height: 21px;
        vertical-align: middle;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          height: 15px;
          width: 4px;
          background-color: #fdce04;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .getInner {
      margin-left: 32px;
      padding-right: 18px;
      p {
        font-size: 13px;
        color: #FFFFFF;
        margin-bottom: 10px;
        span:first-child {
          display: inline-block;
          width: 90px;
          float: left;
        }
        .last {
          line-height: 23px;
          text-align: justify;
        }
      }
    }
    .share-button {
      width: 107px;
      /*height: 84px;*/
      margin: 28px auto;
      /*background: url(/static/img/competition/summary_qrcode.png) no-repeat;*/
      /*background-size: contain;*/
      /*background-origin: padding-box;*/
      img {
        width: 100%;
        height: auto;
      }
      &.result {
        height: 66px;
        width: 254px;
        margin: 30px auto;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/summary_go_answer.png) no-repeat;
        background-size: contain;
      }
    }
  }
</style>
