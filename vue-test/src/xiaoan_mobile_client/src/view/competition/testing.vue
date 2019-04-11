<template>
  <div id="comp-tanking">
    <div class="pic-title"></div>
    <div class="inner">
      <p class="nowScore">当前得分:<span>{{dataObject.currentScore}}</span></p>
      <p class="total"><span>{{indexNo+1}}</span>/20（题）</p>
      <p class="time">倒计时：{{setTimeFun}}</p>
    </div>
    <div class="question">{{dataObject.question.question}}</div>
    <div class="answer">
      <div class="answerInner" v-for="(item, index) in answerList" @click="selectChange(index)">
        <p>{{item.answerType}}：{{item.answer}}</p>
        <template v-if="item.selected">
          <img v-if="item.isCorrect" :src="correctImg" alt=""/>
          <img v-else :src="errorImg" alt=""/>
        </template>

      </div>
    </div>
    <div class="button flex-box">
      <div class="col align-l">
        <x-button @click.native="friendTestingCheck">考朋友</x-button>
      </div>
      <div class="col align-r">
        <x-button @click.native="nextQuestionHandle">{{indexNo >= 19?'完成':'下一题'}}</x-button>
      </div>
    </div>
    <!---->
    <div id="shareDialog" v-transfer-dom>
      <x-dialog hide-on-blur v-model="shareShadow" mask-z-index="5000">
        <div class="share-box" @click.prevent="shareShadow = false">
          <img :src="$image.competition.share" alt="">
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {secToTime} from '../../common/utils'
  import {XButton, TransferDom, XDialog} from 'vux'
  export default {
    name: "comp-tanking",
    components: {XButton, XDialog},
    directives: {
      TransferDom
    },
    data() {
      return {
        testId: '',
        errorImg: this.$image.competition.testing_error,
        correctImg: this.$image.competition.testing_correct,
        dataObject: {
          currentScore: 0,
          "resultId": "",
          question: {
            "id": "",
            "correctlyAnswerId": "",
            "indexNo": 1,
            "isDelete": false,
            "type": null,
            "testPaperId": "",
            "question": "",
            "description": null
          }
        },
        answerList: [],
        selectData: {
          "id": "",
          "questionId": "",
          "answerNo": 1,
          "answerType": "",
          "selected": false,
          "answer": ""
        },
        nowScore: 0,
        isClick: false,
        isNext: true,
        shareShadow: false,
        time: 60 * 30,
        indexNo: 0
      }
    },
    computed: {
      setTimeFun: function () {
        // this.time
        return secToTime(this.time)
      }
    },
    created() {
      if (this.$route.query.id) {
        this.testId = this.$route.query.id;
      } else {
        // this.$router.replace({path: '/competition/home'});
      }
      console.log(this.$route.query.id);
      //
      //this.startTest();
      this.getNotFinishTest();
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    methods: {
      getNotFinishTest() {
        let params = {};
        this.$axios.competition.getNotFinishTest(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log(res.data);
            if (res.data.returnObject) {
              if (!!!this.$route.query.id) {
                this.$router.replace({query: {id: res.data.returnObject.question.testPaperId}});
                this.testId = this.$route.query.id;
              }
              this.$vux.loading.hide();
              this.isClick = false;
              this.selectData = {};
              this.dataObject = res.data.returnObject;
              this.$set(this.dataObject, 'resultId', this.dataObject.notFinishTest.resultId)
              this.indexNo = this.dataObject.notFinishTest.indexNo
              this.answerList = this.dataObject.question.answerList;
              this.answerList.forEach(e => {
                this.$set(e, 'isCorrect', false);
                if (e.id.trim() == this.dataObject.question.correctlyAnswerId.trim()) {
                  this.$set(e, 'isCorrect', true);
                }
                this.$set(e, 'selected', false);
              });
              if (this.indexNo >= 19) {
                this.isNext = false
              }
              let newDate = new Date().getTime();
              this.time = (60 * 30) - ((newDate - res.data.returnObject.notFinishTest.createTime) / 1000);
              // console.log(this.time);
              this.setInv = setInterval(() => {
                this.time--
                if (this.time <= 1) {
                  this.$vux.toast.show({
                    text: '您的答题时间已超时！',
                    position: 'middle',
                    type: 'text',
                    width: 'auto',
                    time: 2500
                  });
                  this.time = 0;
                  this.selectData.id = '';
                  this.selectData.isCorrect = false
                  this.selectData.selected = true
                  this.endTest();
                  clearInterval(this.setInv);
                }
              }, 1000)

            } else {
              this.startTest();
            }
          } else {
            this.startTest();
          }
        }).catch(err => {

        })
      },
      startTest() {
        let params = {
          testPaperId: this.testId
        };
        this.$axios.competition.startTest(params).then(res => {
          if (res.data.returnCode == 200) {
            console.log(res.data);
            this.$nextTick(() => {
              this.dataObject = res.data.returnObject;
              this.dataObject.question.indexNo = 0;
              this.$set(this.dataObject, 'currentScore', 0)
              this.answerList = this.dataObject.question.answerList;
              this.answerList.forEach(e => {
                this.$set(e, 'isCorrect', false);
                if (e.id.trim() == this.dataObject.question.correctlyAnswerId.trim()) {
                  this.$set(e, 'isCorrect', true);
                }
                this.$set(e, 'selected', false);
              });
              this.indexNo = 0;
              //
              this.time = 30 * 60;
              this.setInv = setInterval(() => {
                this.time--
                if (this.time <= 1) {
                  this.time = 0;
                  this.$vux.toast.show({
                    text: '您的答题时间已超时！',
                    position: 'middle',
                    type: 'text',
                    width: 'auto',
                    time: 2500
                  });
                  this.selectData.id = ''
                  this.selectData.selected = true
                  this.selectData.isCorrect = false
                  this.endTest();
                  clearInterval(this.setInv);
                }
              }, 1000)
            })
          }
        }).catch(err => {

        })
      },
      selectChange(index) {
        if (this.isClick) {
          return false
        }
        this.answerList[index].selected = true;
        this.isClick = true;
        this.selectData = this.answerList[index];
        console.log(this.selectData);
      },
      nextQuestion() {
        if (!this.selectData.selected) {
          this.$vux.toast.show({text: '请先选择答案，再进行下一题', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return
        }
        this.indexNo += 1;
        this.$vux.loading.show({text: '获取下一题'});
        let params = {
          testPaperId: this.testId,
          questionId: this.dataObject.question.id,
          answerId: this.selectData.id,
          isCorrect: this.selectData.isCorrect,
          indexNo: this.indexNo,
          resultId: this.dataObject.resultId
        };
        this.$axios.competition.nextQuestion(params).then(res => {
          if (res.data.returnCode == 200) {
            this.$vux.loading.hide();
            this.isClick = false;
            this.selectData = {};
            this.dataObject = res.data.returnObject;
            this.answerList = this.dataObject.question.answerList;
            this.indexNo = res.data.returnObject.indexNo
            this.answerList.forEach(e => {
              this.$set(e, 'isCorrect', false);
              if (e.id.trim() == this.dataObject.question.correctlyAnswerId.trim()) {
                this.$set(e, 'isCorrect', true);
              }
              this.$set(e, 'selected', false);
            });
            if (this.indexNo >= 19) {
              this.isNext = false
            }
          }
        }).catch(err => {

        })
      },
      //
      endTest() {
        if (!this.selectData.selected) {
          this.$vux.toast.show({text: '请先选择答案，再进行下一题', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return
        }
        this.$vux.loading.show({text: '获取结果'});
        this.indexNo += 1;
        let params = {
          testPaperId: this.testId,
          questionId: this.dataObject.question.id,
          answerId: this.selectData.id,
          isCorrect: this.selectData.isCorrect,
          indexNo: this.indexNo,
          resultId: this.dataObject.resultId
        };
        this.$axios.competition.endTest(params).then(res => {
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.isClick = false;
              this.selectData = {};
              this.$vux.loading.hide();
              this.$router.replace({
                path: '/competition/result',
                query: {score: res.data.returnObject.totalScore}
              });
            } else {
              this.$vux.toast.show({text: '你已结束试题', position: 'middle', type: 'text', width: 'auto', time: 2500});
              this.$router.replace({path: '/competition/home'});
            }
          }
        }).catch(err => {

        })
      },
      //
      nextQuestionHandle() {
        console.log(this.indexNo);
        if (this.indexNo < 19) {
          this.nextQuestion();
        } else {
          // 完成
          this.endTest();
        }
      },
      //
      share(type) {
        this.$nextTick(() => {
          // console.log(this.userInfo);
          let shareTitle = '惊！正确答案竟然是这个，你能答对吗？';
          let shareLink = decodeURI(`${this.$api.CURRENTIP.IP}#/competition/friendTesting?id=${this.dataObject.question.id}`); // 分享链接
          let shareDesc = "这道题目有点意思，你也来试试？"; // 描述
          this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
        })
      },
      friendTestingCheck() {
        this.share();
        this.shareShadow = true;
      }
    },
    destroyed() {
      clearInterval(this.setInv);
    }
  }
</script>

<style lang="scss">
  #comp-tanking {
    .pic-title {
      width: 100%;
      height: 79px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/testing_pic_title.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .inner {
      width: 324px;
      height: 64px;
      margin: 0 auto;
      line-height: 64px;
      p {
        float: left;
        color: #FFFFFF;
        font-size: 12px;
      }
      p:first-child {
        padding-right: 19px;
      }
      p:last-child {
        float: right;
      }
      .nowScore {
        span {
          clear: both;
          font-size: 40px;
          font-weight: 600;
          color: #FFDA01;
          line-height: 10px;
        }
      }
    }
    .question {
      width: 324px;
      margin: 0 auto 28px;
      font-size: 16px;
      color: #FCFFFE;
      font-weight: 400;
      text-indent: 2em;
      line-height: 25px;
      text-align: justify;
      transition: all .3s;
    }
    .answer {
      width: 306px;
      margin: 0 auto 33px;
      transition: all .3s;
      .answerInner {
        width: 306px;
        height: 43px;
        margin-bottom: 16px;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/testing_backGround.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
        position: relative;
        p {
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 43px;
          font-size: 16px;
          color: #000;
        }
        img {
          position: absolute;
          left: 110px;
          top: 0;
        }
      }
    }
    .button {
      width: 255px;
      height: 35px;
      margin: 0 auto;
      font-weight: bold;
      button {
        border-radius: 18px;
        height: 35px;
        width: 120px;
        text-align: center;
        line-height: 35px;
        color: #000;
        font-size: 14px;
        background: #FFCC00;
        border: none;
        display: inline-block;
      }
    }
  }
</style>
