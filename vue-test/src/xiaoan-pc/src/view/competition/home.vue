<template>
  <div id="competition-home" class="content">
    <div class="contentLeft">
      <template v-if="!isScore">
        <div class="one"></div>
        <div class="choose">
          <span></span><span>选择试卷</span><span></span>
        </div>
        <div class="opportunity">您还有<span>{{competition.chanceNum}}</span>次答题机会，邀请好友可增加答题机会哦！</div>
        <div class="paperName">
          <div @mouseenter="enter(item)" @mouseleave="leave(item)" class="paperInner" v-for="(item, index) in list" :key="index">
            <template v-if="item.show">
              <p>{{item.name}}</p>
              <template v-if="item.maxScore !== null">
                <p>已开放</p>
                <p>{{item.maxScore}}</p>
                <p>当前试卷最高分</p>
              </template>
              <template v-else>
                <p>{{getTime(item.openTime)}}</p>
              </template>
              <p v-if="item.maxScore === null">
                <img class="open" v-if="compare(item)" src="/static/img/competition/icon_open.png" alt="">
                <img class="open" v-else src="/static/img/competition/icon_close.png" alt="">
              </p>
            </template>
            <template v-else>
              <p>{{item.name}}</p>
              <p>已开放</p>
              <el-button type="primary" size="mini" @click="startTest(item)">答题</el-button>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="result one"></div>
        <div class="choose">
          <span></span><span>答题积分</span><span></span>
        </div>
        <div class="border">
          <p>您本次得分：</p>
          <p>{{currentScore}}</p>
        </div>
        <p class="shareInner">邀请好友来参加，增加答题机会还能赢大奖！</p>
        <div class="button-box">
          <el-button type="primary" size="mini" @click="returnBack">返回首页</el-button>
          <el-button type="primary" size="mini" @click="inviteJoin">邀请好友</el-button>
        </div>
      </template>
    </div>
    <integral v-if="isHeart"></integral>
    <rankingList v-if="isHeart"></rankingList>
    <linkDialog v-if="linkValue" @upAdd="upTitle($event)" :title="title" :linkValue="linkValue" :type="1"></linkDialog>
    <banner v-if="event" :show="event" @getShow="getShow"></banner>
    <advertisement v-if="isHeart"></advertisement>
  </div>
</template>

<script>
  import banner from './components/bannerShow.vue'
  import rankingList from './components/rankingList.vue'
  import integral from './components/integral.vue'
  import linkDialog from './components/linkDialog.vue'
  import advertisement from './components/advertisement.vue'
  export default {
    name: "home",
    components: {
      banner,
      rankingList,
      integral,
      linkDialog,
      advertisement
    },
    data() {
      return {
        list: [],
        competition: {},
        linkValue: false,
        title: '',
        currentScore: '',
        event: false,
        isScore: false,
        type: '',
        isHeart: true,
        userInfo: {level: -1}
      }
    },
    watch:{
      $route(to, from) {
        if (to.path == '/competition/home') {
          this.currentScore = '';
          this.isScore = false
        }
      }
    },
    created() {
      if (this.$cookie.get('userInfo')) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'));
      }
      if (!this.$cookie.get('userId')) {
        this.$router.push(`/login?redirect_url=competition/heart`)
      } else {
        this.$router.replace({path: '/competition/heart'});
      }

      // let time = new Date().getTime();
      // if (time < 1542816000000) {
      //   this.isHeart = false;
      //   this.$router.replace({path: '/competition/heart'});
      // } else if (time > 1544025600000) {
      //   this.isHeart = false;
      //   this.checkUserApply();
      // } else {
      //   this.getAllTestPaper();
      //   if (this.$route.query.currentScore || this.$route.query.currentScore === 0) { // 答题完成
      //     this.currentScore = this.$route.query.currentScore;
      //     this.event = true;
      //     this.isScore = true;
      //   } 
      //   if (sessionStorage.getItem('questionId')) { // 有未完成的测试
      //     this.$router.push('/competition/activityAnswer');
      //   } else {
      //     this.getNotFinishTest();
      //   }
      //   this.type = JSON.parse(sessionStorage.getItem('type'));
      //   let isJoin = JSON.parse(sessionStorage.getItem('isJoin'));
      //   if (this.type == 1 && (this.$cookie.get('userId') == JSON.parse(sessionStorage.getItem('id')))) {
      //     this.inviteJoin();
      //     sessionStorage.removeItem('id');
      //     sessionStorage.removeItem('type');
      //   }
      // }

    },
    methods: {
      returnBack() {
        this.currentScore = '';
        this.isScore = false
        this.$router.push('/competition/home');
      },
      getNotFinishTest () {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.getNotFinishTest(params).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              sessionStorage.setItem('question', JSON.stringify(res.data.returnObject));
              sessionStorage.setItem('status', JSON.stringify(1));
              this.$router.push({path: '/competition/activityAnswer'});
            } 
          }
        }).catch(err => {

        })
      },
      getShow(type) {
        this.event = type;
      },
      inviteJoin() {
        this.linkValue = true;
        this.title = '邀请好友';
      },
      upTitle (item) {
        this.linkValue = item;
      },
      getAllTestPaper() {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.getAllTestPaper(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let time = new Date().getTime();
            if (res.data.returnObject) {
              res.data.returnObject.testPaperList.forEach(e => {
                e.show = true;
              })
              this.list = res.data.returnObject.testPaperList;
              console.log(this.list)
              this.competition = res.data.returnObject.competition;
            } else {
              this.$router.push('/competition/join');
            }
          }
        })
      },
      enter(item) {
        if (item.openTime < new Date().getTime()) {
          item.show = false;
        }
      },
      leave(item) {
        item.show = true;
      },
      getTime(time) {
        return this.$common.transTime(time)[1];
      },
      compare(item) {
        if (item.openTime < new Date().getTime()) {
          return true
        } else {
          return false
        }
      },
      startTest(item) {
        if (this.competition.chanceNum == 0) {
          this.$message({showClose: true, message: '您的答题次数为0，邀请好友可增加答题机会！', type: 'error'});
        } else {
          sessionStorage.setItem('testPaperId', JSON.stringify(item.id));
          this.$router.push({path: '/competition/activityAnswer'});
        }
      },
      // 是否已经报名
      checkUserApply () {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.checkUserApply(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let time = new Date().getTime();
            if (res.data.returnObject) {
              // this.getAllTestPaper();
              sessionStorage.setItem('isJoin', true); 
              if (time > 1544025600000) {
                this.$router.replace({path: '/competition/activityAnswer', query: {endInfo: 2}});
              }
            } else {
              if (time > 1544025600000) {
                this.$router.replace('/competition/endPage');
              } else {
                this.$router.push('/competition/join');
              }
            }
          }
        })
      },
      // 是否上传名片
      checkUserCaseUpload () {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.checkUserCaseUpload(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.checkUserApply();
            } else {
              this.$router.push('/competition/join');
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  #competition-home {
    .el-button {
      width:72px;
      margin-top: 10px;
      background:rgba(254,205,4,1);
      border-radius:4px;
      span {
        font-size:14px;
        font-weight:400;
        color:rgba(34,32,39,1);
      }
    }
  }
</style>

<style lang="scss" scoped>
  #competition-home {
    .contentLeft {
      position: relative;
      height: 513px;
      .result {
        width: 425px;
        height: 175px;
      }
      .choose {
        color: #FFFFFF;
        font-size: 16px;
        width: 183px;
        text-align: center;
        margin: 0 auto 9px;
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
      .choose {
        color: #FFFFFF;
        font-size: 16px;
        width: 183px;
        text-align: center;
        margin: 0 auto 9px;
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
      .border  {
        width: 269px;
        height: 100px;
        margin: 30px auto 5px;
        background: url(/static/img/competition/border.png) no-repeat;
        background-size: contain;
        p:first-child {
          padding: 10px 0 0 12px;
          font-size:12px;
          font-weight:400;
          color:rgba(204,204,204,1);
        }
        p:last-child {
          text-align: center;
          font-size:49px;
          font-weight:600;
          color:rgba(255,204,0,1);
        }
      }
      .shareInner {
        text-align: center;
        font-size:12px;
        font-weight:400;
        color:rgba(204,204,204,1);
      }
      .button-box {
        text-align: center;
        height: 24px;
        margin-top: 31px;
        .el-button {
          width:146px;
          background:rgba(254,205,4,1);
          border-radius:4px;
          span {
            font-size:14px;
            font-weight:400;
            color:rgba(34,32,39,1);
          }
        }
      }
      .opportunity {
        clear: both;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(204,204,204,1);
        text-align: center;
        margin: 0 auto 30px;
        span {
          color:rgba(255,204,0,1);
          margin: 0 10px;
        }
      }
      .paperName {
        display: flex;
        justify-content: center;
        // .second {
        //   margin: 0 40px;
        // }
        .paperInner {
          width:126px;
          height:108px;
          border:1px solid rgba(204,204,204,1);
          border-radius:4px;
          text-align: center;
          &:nth-child(2) {
            margin: 0 40px;
          }
          p {
            text-align: center;
            color: #cccccc;
            img {
              margin-top: 10px;
            }
          }
          p:first-child {
            font-size:16px;
            font-weight:600;
            margin: 11px auto 4px;
          }
          p:nth-child(2), p:nth-child(4) {
            font-size:12px;
            font-weight:400;
          }
          p:nth-child(3) {
            font-size:24px;
            font-weight:600;
            color:rgba(255,201,0,1);
          }
          .open {
            width: 35px;
            height: 29px;
          }
          .close {
            width: 24px;
            height: 29px;
          }
        }
        // .el-button {
        //   width:72px;
        //   margin-top: 10px;
        //   background:rgba(254,205,4,1);
        //   border-radius:4px;
        //   span {
        //     font-size:14px;
        //     font-weight:400;
        //     color:rgba(34,32,39,1);
        //     margin: 0 auto;
        //   }
        // }
      }
      .opacity {
        position: absolute;
        bottom: 30px;
        left: -100px;
        width:126px;
        height:108px;
        background:rgba(204,204,204,0.5);
        border-radius:4px;
        text-align: center;
        p {
          text-align: center;
        }
        p:first-child {
          font-size:16px;
          font-weight:600;
          color:rgba(22,20,26,1);
          margin: 11px 0 2px;
        }
        p:nth-child(2) {
          font-size:12px;
          font-weight:400;
          color:rgba(84,84,84,1);
        }
        .el-button {
          width:72px;
          margin-top: 10px;
          background:rgba(254,205,4,1);
          border-radius:4px;
          span {
            font-size:14px;
            font-weight:400;
            color:rgba(34,32,39,1);
          }
        }
      }
    }
    // .contentRight {
    //   .integration {
    //     height:148px;
    //     border:1px solid rgba(84,84,84,1);
    //     border-radius:4px;
    //     padding: 0 17px;
    //     margin-bottom: 16px;
    //     .title {
    //       height: 45px;
    //       line-height: 45px;
    //       text-align: left;
    //       font-size:14px;
    //       font-weight:600;
    //       color:rgba(255,255,255,1);
    //       border-bottom: 1px solid #545454;
    //     }
    //     .textInner {
    //       display: flex;
    //       height: 102px;
    //       justify-content: center;
    //       align-items: center;
    //       div {
    //         width: 87px;
    //         height: 22px;
    //         text-align: center;
    //         border-right: 1px solid rgba(84,84,84,1);
    //         p {
    //           position: relative;
    //           top: -5px;
    //         }
    //         p:first-child {
    //           font-size:16px;
    //           font-weight:600;
    //           color:rgba(255,255,255,1);
    //           margin-bottom: 3px;
    //         }
    //         p:last-child {
    //           font-size:12px;
    //           font-weight:400;
    //           color:rgba(141,141,141,1);
    //         }
    //       }
    //       div:last-child {
    //         border: none;
    //       }
    //     }
    //   }
    //   .signIn, .call, .share {
    //     height:46px;
    //     margin-bottom: 16px;
    //     border:1px solid rgba(84,84,84,1);
    //     border-radius:4px;
    //     padding: 0 17px;
    //     line-height: 46px;
    //     span {
    //       display: block;
    //       float: left;
    //     }
    //     span:first-child {
    //       text-align: left;
    //       width: 95px;
    //       font-size:14px;
    //       font-weight:600;
    //       color:rgba(255,255,255,1);
    //     }
    //     span:nth-child(2) {
    //       font-size:14px;
    //       width: 85px;
    //       font-weight:600;
    //       text-align: center;
    //       color:rgba(254,205,4,1);
    //     }
    //     .el-button {
    //       float: right;
    //       width:72px;
    //       height: 24px;
    //       margin-top: 10px;
    //       background:rgba(254,205,4,1);
    //       border-radius:4px;
    //       position: relative;
    //       span {
    //         display: inline-block;
    //         position: absolute;
    //         left: 0;
    //         top: 0;
    //         height: 24px;
    //         width: 72px;
    //         line-height: 24px;
    //         text-align: center;
    //         font-size:14px;
    //         font-weight:400;
    //         color:rgba(34,32,39,1);
    //       }
    //     }
    //   }
    // }
    // .contentBottom {
    //   clear: both;
    //   display: flex;
    //   justify-content: space-between;
    //   height: 465px;
    //   margin-bottom: 50px;
    //   .ranking {
    //     width:286px;
    //     height:465px;
    //     border:1px solid rgba(84,84,84,1);
    //     border-radius:4px;
    //     padding: 0 14px;
    //     li:first-child {
    //       height: 45px;
    //       line-height: 45px;
    //       text-align: left;
    //       font-size:14px;
    //       font-weight:bold;
    //       color:rgba(255,255,255,1);
    //     }
    //     li {
    //       border-bottom: 1px solid #545454;
    //       height: 34px;
    //       span {
    //         font-size:12px;
    //         float: left;
    //         display: block;
    //         height: 34px;
    //         line-height: 34px;
    //         text-align: center;
    //         font-weight:bold;
    //         color:rgba(255,255,255,1);
    //       }
    //       span:first-child {
    //         width: 20px;
    //         img {
    //           width: 16px;
    //           height: 15px;
    //           margin-top: 9px;
    //         }
    //       }
    //       img {
    //         float: left;
    //         width: 32px;
    //         height: 32px;
    //         margin: 1px 17px 0 0;
    //       }
    //       span:last-child{
    //         float: right;
    //       }
    //     }
    //     .color {
    //       color:rgba(254,205,4,1);
    //     }
    //   }
    //   .ranking:last-child {
    //     li {
    //       span:nth-of-type(2) {
    //         width: 80px;
    //         text-align: left;
    //       }
    //       span:nth-of-type(3) {
    //         width: 60px;
    //         text-align: center;
    //       }
    //     }
    //   }
    // }
  }
</style>
