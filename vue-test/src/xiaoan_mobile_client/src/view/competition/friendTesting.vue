<template>
  <div id="comp-friendTesting">
    <div class="pic-title"></div>
    <div class="question">{{dataObject.question}}</div>
    <div class="answer">
      <div class="answerInner" v-for="(item, index) in answerList" @click="selectChange(index)">
        <p>{{item.answerType}}：{{item.answer}}</p>
        <template v-if="item.selected">
          <img v-if="item.isCorrect" :src="correctImg" alt=""/>
          <img v-else :src="errorImg" alt=""/>
        </template>
      </div>
    </div>
    <div class="friendTestingBtn" @click="friendTestingClick"></div>
  </div>
</template>

<script>
  import {XButton} from 'vux'
  export default {
    name: "comp-tanking",
    components: {XButton},
    data() {
      return {
        testId: '',
        errorImg: this.$image.competition.testing_error,
        correctImg: this.$image.competition.testing_correct,
        dataObject: {
          currentScore: 0,
          "resultId": "",
          "id": "",
          "correctlyAnswerId": "",
          "indexNo": 1,
          "isDelete": false,
          "type": null,
          "testPaperId": "",
          "question": "",
          "description": null
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
        isNext: true
      }
    },
    created() {
      if (this.$route.query.id) {
        this.getQuestionById();
      }
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    methods: {
      friendTestingClick() {
        this.$router.push({path: '/competition/home'});
      },
      // GET /competition/getQuestionById
      getQuestionById() {
        let params = {
          questionId: this.$route.query.id
        };
        this.$axios.competition.getQuestionById(params).then(res => {
          if (res.data.returnCode == 200) {
            this.dataObject = res.data.returnObject;
            this.answerList = this.dataObject.answerList;
            this.answerList.forEach(e => {
              this.$set(e, 'isCorrect', false);
              if (e.id.trim() == this.dataObject.correctlyAnswerId.trim()) {
                this.$set(e, 'isCorrect', true);
              }
              this.$set(e, 'selected', false);
            });
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
      }
    }
  }
</script>

<style lang="scss">
  #comp-friendTesting {
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
      margin-top: 20px;
    }
    .answer {
      width: 306px;
      margin: 0 auto 33px;
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
    .friendTestingBtn {
      // static/img/competition/testing_friendTestingBtn.png
      width: 231px;
      height: 66px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/testing_friendTestingBtn.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
      margin: auto;
    }
    .button {
      width: 255px;
      height: 35px;
      margin: 0 auto;
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
