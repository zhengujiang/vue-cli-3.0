<template>
  <div id="problem">
    <div class="contentLeft">
      <div class="one"></div>
      <div class="startAnswer">
        <span></span><span>开始答题</span><span></span>
      </div>
      <div class="pagesTitle" v-if="!invitation">
        <div>当前得分：<span class="score">{{currentScore}}</span></div><div><span>{{questionIndex}}</span>/20 (题)</div><div id="timeInfo">倒计时：{{minutes}}:{{seconds}}</div>
      </div>
      <div class="titleBox">
        <p class="titleInner">{{questionIndex}}、 {{questionDetail}}</p>
        <div class="answerInner">        
          <p v-for="(item, index) in answerList" @click="choice(item, index)">{{item.answerType}}: {{item.answer}}<img v-show="item.answerError" src="/static/img/competition/error.png">
          <img v-show="item.answerRight" src="/static/img/competition/correct.png"></p>
        </div>
      </div>
      <div class="button-box">
        <el-button type="primary" size="mini" @click="testFriend">考朋友</el-button>
        <template v-if="!invitation">
          <el-button v-if="questionIndex < 20" type="primary" size="mini" @click="changeNextQuestion">下一题</el-button>
          <el-button v-if="questionIndex >= 20" type="primary" size="mini" @click="submit">提交</el-button>
        </template>
        <el-button v-else type="primary" size="mini" @click="returnHome">我也要玩</el-button>
        
      </div>
    </div>
    <link-dialog v-if="linkValue" @upAdd="upTitle($event)" :questionId="questionId" :title="title" :linkValue="linkValue"></link-dialog>
  </div>
</template>

<script>
  import CompBanner from './banner.vue'
  import linkDialog from './linkDialog.vue'

  export default {
    name: "upload",
    data() {
      return {
        linkValue: false,
        userId: '',
        answerRight: false,
        answerError: false,
        questionIndex: 1,
        answerList: [],
        questionDetail: '',
        correctlyAnswerId: '',
        title: '',
        questionId: '',
        isCorrect: false, // 是否答对
        resultId: '',
        testPaperId: '',
        currentScore: 0, // 总得分
        ifClick: false,
        minutes: '00',
        seconds: '00',
        notFinished: false,
        createTime: '',
        maxtime: 1800,
        obj: {},
        invitation: false,
        ifAnswer: false,
        number: 0
      }
    },
    created() {
      this.userId = this.$cookie.get('userId');
      // if (sessionStorage.getItem('questionId')) {
      //   this.invitation = true;
      //   this.questionId = JSON.parse(sessionStorage.getItem('questionId'));
      //   this.getQuestionById();
      // }
    },
    mounted() {
      if (sessionStorage.getItem('testPaperId')) {
        this.testPaperId = JSON.parse(sessionStorage.getItem('testPaperId'));
        this.startTest();
        this.countTime();
        sessionStorage.removeItem('testPaperId');
      } else if (sessionStorage.getItem('questionId')) {
        this.invitation = true;
        this.questionId = JSON.parse(sessionStorage.getItem('questionId'));
        this.getQuestionById();
        sessionStorage.removeItem('questionId');
      } else if (sessionStorage.getItem('status')) {
        this.$nextTick(() => {
          this.obj = JSON.parse(sessionStorage.getItem("question"));
          this.currentScore = this.obj.currentScore;
          this.questionId = this.obj.question.id;
          this.testPaperId = this.obj.question.testPaperId;
          this.answerList = this.obj.question.answerList;
          this.answerList.forEach((item, index) => {
            item.answerRight = false;
            item.answerError = false;
          })
          this.questionDetail = this.obj.question.question;
          this.correctlyAnswerId = this.obj.question.correctlyAnswerId;
          // 
          this.resultId = this.obj.notFinishTest.resultId;
          this.createTime = this.obj.notFinishTest.createTime;
          this.questionIndex = this.obj.notFinishTest.indexNo + 1;
          sessionStorage.removeItem('status');
          this.countLastTime();
        })
      } else {
        this.getNotFinishTest();
      }
      // this.countTime();
    },
    beforeDestroy() {
      window.clearInterval(window.timer);
      sessionStorage.removeItem('questionId');
      sessionStorage.removeItem('question');
    },
    components: {
      CompBanner,
      linkDialog
    },
    methods: {
      returnHome() {
        sessionStorage.removeItem('questionId');
        sessionStorage.removeItem('question');
        this.$router.push('/competition/home');
      },
      testFriend () {
        this.title = '考朋友';
        this.linkValue = true;
      },
      getQuestionById() {
        let params = {
          questionId: this.questionId
        }
        this.$axios.mobApi.getQuestionById(params).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.questionId = res.data.returnObject.id;
          this.testPaperId = res.data.returnObject.testPaperId;
          this.answerList = res.data.returnObject.answerList;
          this.answerList.forEach((item, index) => {
            item.answerRight = false;
            item.answerError = false;
          })
          this.questionDetail = res.data.returnObject.question;
          this.correctlyAnswerId = res.data.returnObject.correctlyAnswerId;
          // sessionStorage.removeItem('questionId');
        }
        }).catch(err => {
      })
      },
      startTest() {
        let params = {
          userId: this.userId,
          testPaperId: this.testPaperId
          // testPaperId: '3473375fb9024229b7541d3944186bc6'
        }
        this.$axios.mobApi.startTest(params).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.questionId = res.data.returnObject.question.id;
          this.testPaperId = res.data.returnObject.question.testPaperId;
          this.answerList = res.data.returnObject.question.answerList;
          this.answerList.forEach((item, index) => {
            item.answerRight = false;
            item.answerError = false;
          })
          this.questionDetail = res.data.returnObject.question.question;
          this.correctlyAnswerId = res.data.returnObject.question.correctlyAnswerId;
          this.resultId = res.data.returnObject.resultId;
        }
        }).catch(err => {
      })
      },
      countLastTime () {
        let time = (new Date().getTime() - this.createTime) / 1000;
        console.log(time);
        if (time <= 1800) {
          this.maxtime = this.maxtime - time;
          console.log(this.maxtime);
          this.countTime();
        } else {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '答题时间到！'});
          this.endTest();
        }
      },
      getNotFinishTest () {
        let params = {
          userId: this.userId
        }
        this.$axios.mobApi.getNotFinishTest(params).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.currentScore = res.data.returnObject.currentScore;
                // 
              this.questionId = res.data.returnObject.question.id;
              this.testPaperId = res.data.returnObject.question.testPaperId;
              this.answerList = res.data.returnObject.question.answerList;
              this.answerList.forEach((item, index) => {
                item.answerRight = false;
                item.answerError = false;
              })
              this.questionDetail = res.data.returnObject.question.question;
              this.correctlyAnswerId = res.data.returnObject.question.correctlyAnswerId;
              // 
              this.resultId = res.data.returnObject.notFinishTest.resultId;
              this.createTime = res.data.returnObject.notFinishTest.createTime;
              this.questionIndex = res.data.returnObject.notFinishTest.indexNo + 1;
              this.countLastTime();
            }
          }
        }).catch(err => {
        })
      },
      changeNextQuestion() {
        if (this.ifAnswer) {
          // this.questionIndex ++;
          if (this.questionIndex <= 20) {
            this.nextQuestion();
          }
        } else {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '请先选择答案，再进行下一题'});
        }
      },
      nextQuestion () {
        let params = {
          userId: this.userId,
          testPaperId: this.testPaperId,
          questionId: this.questionId,
          answerId: this.correctlyAnswerId,
          isCorrect: this.isCorrect,
          indexNo: this.questionIndex,
          resultId: this.resultId
        }
          this.$axios.mobApi.nextQuestion(params).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.ifAnswer = false;
            this.ifClick = false;
            this.isCorrect = false;
            this.currentScore = res.data.returnObject.currentScore;
            this.questionId = res.data.returnObject.question.id;
            this.questionIndex = res.data.returnObject.indexNo + 1;
            console.log(this.questionIndex);
            console.log(321);
            this.testPaperId = res.data.returnObject.question.testPaperId;
            this.answerList = res.data.returnObject.question.answerList;
            this.answerList.forEach((item, index) => {
              item.answerRight = false;
              item.answerError = false;
            })
            this.questionDetail = res.data.returnObject.question.question;
            this.correctlyAnswerId = res.data.returnObject.question.correctlyAnswerId;
            this.resultId = res.data.returnObject.resultId;
          }
        })
      },
      choice(item, index) {
        this.ifAnswer = true;
        if (this.ifClick) {
          return false;
        }
        if (item.id == this.correctlyAnswerId) {
          this.answerList[index].answerRight = true;
          this.isCorrect = true;
          this.ifClick = true;
          this.answerList = Object.assign([], this.answerList);
        } else {
          this.answerList[index].answerError = true;
          this.isCorrect = false;
          this.ifClick = true;
          this.answerList = Object.assign([], this.answerList);
        }
        // else {
        //   this.answerList[index].answerError = true;
        //     this.answerList.forEach((item, index) => {
        //       if (item.id == this.correctlyAnswerId) {
        //       this.answerList[index].answerRight = true;
        //     }
        //   }) 
        //   this.isCorrect = false;
        //   this.ifClick = true;
        //   this.answerList = Object.assign([], this.answerList);
        // }
      },
      countTime () {
        console.log(this.number)
        window.clearInterval(window.timer);

        if (!this.number) {
          this.number = 1;
          window.timer = window.setInterval(_ => {
          this.minutes = Math.floor(this.maxtime / 60);
          this.seconds = Math.floor(this.maxtime % 60);
          if (this.seconds < 10) {
            this.seconds = `0${this.seconds}`;
          }
            this.maxtime--;
          if (this.maxtime <= 0) {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '答题时间到！'});
            this.endTest();
          }
        }, 1000); 
        }
      },
      upTitle (item) {
        this.linkValue = item;
      },
      endTest () {
        window.clearInterval(window.timer);
        sessionStorage.removeItem('questionId');
        sessionStorage.removeItem('question');
        let params = {
          userId: this.userId,
          testPaperId: this.testPaperId,
          questionId: this.questionId,
          answerId: this.correctlyAnswerId,
          isCorrect: this.isCorrect,
          indexNo: this.questionIndex,
          resultId: this.resultId
        }
        this.$axios.mobApi.endTest(params).then(res => {
           if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.currentScore = res.data.returnObject.totalScore
            } else {
              this.currentScore = 0;
            }
            if (sessionStorage.getItem('socreTotal')) {
              let num = JSON.parse(sessionStorage.getItem('socreTotal'));
              num++
              sessionStorage.setItem('socreTotal', JSON.stringify(num));
            } else {
              sessionStorage.setItem('socreTotal', JSON.stringify(1));
            }
            this.$router.push({path: '/competition/home', query: {'currentScore': this.currentScore}});
          }
        })
      },
      submit () {
        if (this.ifAnswer) {
          this.endTest();
        } else {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '请先选择答案，再进行提交'});
        }
      }
    }
  }
</script>

<style lang="scss">
  #problem {
    .contentLeft {
      height: 513px;
      .one {
        width: 446px;
        height: 182px;
      }
      .startAnswer {
        color: #FFFFFF;
        font-size: 16px;
        width: 183px;
        text-align: center;
        margin: 0 auto;
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
      .pagesTitle {
        margin: 19px 0 0;
        padding: 0 16px;
        height: 30px;
        clear: both;
        div {
          font-size:12px;
          float: left;
          font-weight:400;
          color:rgba(204,204,204,1)
        }
        div:first-child {
          margin-right: 60px;
        }
        .score {
          font-size:20px;
          font-weight:400;
          color:rgba(255,204,0,1);
        }
        div:nth-child(2), div:last-child {
          line-height: 30px;
        }
        div:last-child {
          float: right;
        }
      }
      .titleBox {
        height: 150px;
        padding: 0 14px;
        margin-top: 5px;
        .titleInner {
          font-size:16px;
          line-height:22px;
          height: 44px;
          font-weight:bold;
          color:rgba(252,255,254,1);
          margin-bottom: 5px;
          overflow: hidden;
        }
        .answerInner {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          cursor: pointer;
          p {
            // min-width: 250px;
            // max-width: 380px;
            width: 380px;
            height: 30px;
            float: left;
            margin-left: 20px;
            margin-right: 30px;
            padding: 0 25px;
            margin-bottom: 21px;
            line-height: 30px;
            text-align: center;
            overflow: hidden;
            background: url(/static/img/competition/backGround.png) no-repeat;
            background-size: 100% 100%;
            position: relative;
            img {
              position: absolute;
              width: 30px;
              height: 30px;
              left: 200px;
            }
          }
        }
      }
      .button-box {
        display: flex;
        justify-content:center;
        align-items: center;
        .el-button {
          cursor: pointer;
          width:146px;
          background:rgba(254,205,4,1);
          border-radius:4px;
        }
        button:first-child {
          margin-right: 5px;
        }
        .el-button--primary {
          color:rgba(34,32,39,1);
          font-size: 14px;
          font-weight:400;
        }
      }
    }
  }
</style>
