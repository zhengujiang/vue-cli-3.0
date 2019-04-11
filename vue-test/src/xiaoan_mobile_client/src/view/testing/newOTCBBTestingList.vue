<template>
  <div id="testingList" class="testingListOTCBB">
    <div class="testingList-trends">
      <div class="testingList-item" :style="{width:testingListItem}">
        <i class="testingList-itemG">
                    <span class="testing-pal-icon">
                        <span class="testingList-text">
                            <span>第{{primo}}题</span>
                        </span>
                    </span>
        </i>
      </div>
      <div class="testingList-zong" v-show="testingListGlobal">共{{marketAll}}题</div>
    </div>
    <div class="testingList-content">
      <div class="testingList-TiMu">
        <div class="testingList-TiMuScroll">
          <div class="testPlate-number" v-show="primo">{{ primo +"、"}}</div>
          <div class="testPlate-wenti" v-if="ScoType =='2'">{{QaText+"（单选）"}}</div>
          <div class="testPlate-wenti" v-else-if="ScoType =='1'">{{QaText+"（判断）"}}</div>
          <div class="testPlate-wenti" v-else>{{QaText+"（多选）"}}</div>
        </div>
      </div>
      <div class="testPlate-cont-scroll">
        <div class="testPlate-tianxie">
          <div class="testPlate-units" v-for="(list,index) in candidate" @click="xuanzhe(index)">
            <div class="testPlate-number testPlate-numberFoo">{{ primo +"、"}}</div>
            <div class="testPlate-units-TitleS">
              <div class="testPlate-units-Title" v-show="list.flag == true">
                <div class="unitsIcon"></div>
              </div>
              <div class="testPlate-units-Title" v-show="list.flag != true"></div>
            </div>
            <div class="testPlate-units-Cont">
              {{list.questionOption}}<!--==={{list.isCorrect}}-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="bounce">
      <div class="xa-popup" v-show="popuper">
        <p>{{text[0]}}{{surplus}}{{text[1]}}</p>
        <footer>
          <button v-for="(list, index) in popupButton" @click="popupClick(index)">{{list}}</button>
        </footer>
      </div>
    </transition>
    <xa-shadow v-show="popuper" backgroundColor="rgba(0,0,0,0.8)" @click="popupClick(100)"></xa-shadow>
    <!---->
    <!--<div class="testPlate-toButton" v-show="toButton"></div>-->
    <!---->
    <footer class="testPlate-cont-submit">
      <button @click="testSubmit(0)">
        <i class="icon iconfont icon-jiantou-copy-copy icon-leftallright"></i>
        <p>{{btnSub[0].name}}</p>
      </button>
      <button @click="testClose()" v-if="payMode == 1">
        <i class="icon-middleCollect">
          <img :src="$image.testing.testClose" alt=""/>
        </i>
        <p v-show="true">退出</p>
      </button>
      <button v-else></button>
      <button @click="testSubmit(1)">
        <i class="icon iconfont icon-jiantou2 icon-leftallright"></i>
        <p>{{btnSub[1].name}}</p>
      </button>
    </footer>
    <xa-loading v-show="loading" bgColor="#5B5C64"></xa-loading>
  </div>
</template>

<script>
  import loading from '../../components/warning/loading'
  import shadow from '../../components/warning/shadow'

  export default {
    name: 'newOTCBBTestingList',
    data() {
      return {
        text: ['剩余', '道题未做，退出本次考试数据将不保留，确定退出？'],
        popupButton: ['退出考试', '继续考试'],
        toButton: false,//提示滚动向下滑动
        XIAO: this.$image.testing.xiaodian,
        user_id: '',
        market: '',
        ScoType: '',//（单选还是选）
        primo: '1',//问题
        QaText: "",
        candidate: [],
        isNexts: '',
        TestId: '',
        nextQa: '',
        tiarr: [],
        strQa: "",
        testCloseS: true,
        btnSub: [
          {id: 0, name: "上一题"},
          {id: 1, name: "下一题"},
        ],
        payMode: "",//判断付费 还是免费
        submit: false,
        marketAll: "",
        answerOption: false,
        scrollXY: Number,
        scrollXYArr: [],
        testingListGlobal: true,
        testingListItem: '',
        surplus: '',
        popuper: false,
        loading: true
      }
    },
    components: {
      'xa-shadow': shadow,
      'xa-loading': loading
    },
    watch: {
      "payMode": function () {
        //console.log("----", this.payMode);
      },
      'primo': function () {
        this.surplus = (this.marketAll - this.primo) + 1;
        console.log('剩余', this.surplus);
      },
      "scrollXY": function () {
        if (this.scrollXYArr[0] > this.scrollXYArr[1]) {
          //有滚动区域
          $('.testPlate-cont-scroll').scrollTop(0);
          this.toButton = true;
          $("#testingList .testPlate-toButton").css({"bottom": "18%", "opacity": "1"});
          setTimeout(() => {
            $('.testPlate-toButton').animate({bottom: "100px", opacity: 0});
          }, 2000);
        } else {
          //无滚动区域
          this.toButton = false;
        }
      }
    },
    //页面执行前调用
    created() {
      let userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      this.entrance = this.$route.query.entrance;

      if (this.$route.query.total == undefined) {
        this.marketAll = 200;
      } else {
        this.marketAll = this.$route.query.total;
      }
      /*判断使用那一条方法*/
      if (this.$route.query.entrance == undefined) {
        this.$router.push({path: "/my"})
      } else {
        this.startQa();
      }
      /*判断是第几题 进度条显示*/
      this.loaded();
    },
    //页面加载完成后调用
    updated() {
      this.loaded();
      this.maxsHeight();
    },
    //页面执行时调用
    mounted() {
      document.body.addEventListener('touchstart', function () {
      }, false);
      let adverttitle = "专业董秘才敢做的测试题！";
      let sharelink2 = decodeURI(window.location.href.split("#/")[0] + "#/testing");//分享链接
      let shareDesc = "";//描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.testingImg, true);
    },
    methods: {
      exitTest() {
        let params = {
            testId: this.TestId,
          }
        this.$axios.testing.exitTest(params).then(res => {
          if (res.data.returnCode == 1) {
            this.$router.replace({path: '/newOTCBBTestingEnd'});
          } else {
            this.$router.replace({path: '/newOTCBBTestingEnd'});
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({
            text: '遇到未知错误，无法退出，将返回主页',
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
          this.$router.replace({path: '/my'});
        })
      },
      popupClick(index) {
        console.log(index);
        if (index == 0) {
          this.exitTest();
        } else if (index == 1) {
          this.popuper = false;
        } else {
          console.log(21321321321);
          this.popuper = false;
        }
      },
      testClose() {
        this.popuper = true;
        // 退出测试
      },
      /*选择*/
      xuanzhe(index) {
        if (this.ScoType == 3) {
          this.tiarr = [];
          if (this.candidate[index].flag == true) {
            this.candidate[index].flag = false;
          } else {
            this.candidate[index].flag = true;
          }
          for (let i = 0; i < this.candidate.length; i++) {
            if (this.candidate[i].flag === true) {
              this.tiarr.push(this.candidate[i].optionId);
            }
          }
        } else {
          this.tiarr = [];
          /**/
          for (let i = 0; i < this.candidate.length; i++) {
            this.candidate[i].flag = false;
          }
          this.candidate[index].flag = true;
          this.tiarr.push(this.candidate[index].optionId);
        }
        this.strQa = this.tiarr.join(",");
      },
      //答题开始
      startQa() {
        this.submit = false;
        console.log('=============>', this.marketAll);
        let params = {
            entrance: this.entrance,
            payExamType: this.marketAll
          }
       this.$axios.testing.xsbStart(params).then(res => {
          if (res.data.returnCode == 2) {
            this.loading = false;
            this.ScoType = res.data.returnObject.question.questionType;
            this.QaText = res.data.returnObject.question.questionText;
            this.primo = res.data.returnObject.question.questionNum;//
            let candidate = res.data.returnObject.question.secQuestionOptions;//答案选象
            for (let i = 0; i < candidate.length; i++) {
              candidate[i].flag = false;
            }
            this.candidate = candidate;
            this.QaIdS = res.data.returnObject.question.questionId;//题目id
            this.TestId = res.data.returnObject.secTest.testId; //timu id
            this.payMode = res.data.returnObject.secTest.payMode; //当前用户是免费还是付费
            this.marketAll = res.data.returnObject.secTest.payExamType; //总题数
            this.submit = true;
            if (this.payMode == 0) {
              this.marketAll = 25;
            }
            if (this.primo == this.marketAll) {
              this.btnSub[1].name = '交卷';
            } else {
              this.btnSub[1].name = '下一题';
            }
            this.$nextTick(() => {
              this.maxsHeight();
            });
          } else if (res.data.returnCode == 1) {
            setTimeout(() => {
              this.$nextTick(() => {
                this.$router.replace({path: "/newOTCBBTestingEnd",});
              })
            }, 500)
          } else {

          }
        }).catch((err) => {
          console.error(err);
          this.$router.replace({path: "/newOTCBBTestingEnd"});
        })
      },
      /*安卓机兼容*/
      maxsHeight() {
        let hei = document.body.clientHeight;
        let testingListContent = ($(".testingList-content").offset().top);
        let testPlateContSubmit = (document.querySelector(".testPlate-cont-submit").clientHeight);
        document.querySelector('.testingList-content').style.height = (hei - testingListContent - testPlateContSubmit) + 'px';
      },
      /*控制进度条长度*/
      loaded() {
        let width = 84; // %进度
        // this.marketAll; // 总的题目数
        let divider = (width / this.marketAll);
        let addWidth = (((this.primo - 1) * divider) + 8) + "%";
        if ((((this.primo - 1) * divider) + 8) > 75) {
          setTimeout(() => {
            this.testingListGlobal = false;
          }, 1000);
        } else {
          setTimeout(() => {
            this.testingListGlobal = true;
          }, 1000);
        }
        if (this.primo > 1) {
          this.testingListItem = addWidth;
        }
      },
      //
      commit() {
        this.submit = false;
        this.nextQa = this.strQa;
        let params = {
            testId: this.TestId,
            questionId: this.QaIdS,
            choseIds: this.nextQa,
            questionNum: this.primo,
          }
        this.$axios.testing.xsbCommit(params).then(res => {
          this.submit = true;
          let data = res.data.returnObject;
          //console.log("123", res);
          window.sessionStorage.setItem("timeDateTime", data);
          /*todo
          * */
          this.$router.replace({
            path: '/testLoading',
            query: {
              marketAll: this.marketAll,
              timeDateTime: data,
              market: "newOTCBB",
              payMode: this.payMode
            }
          });
          this.$MTAmethod.mtaShare('dongminenglicep-2', {testsubmit: true});
        }).catch((err) => {
          console.error(err);
          //console.log(err);
        });
      },
      toNext() {
        this.nextQa = this.strQa;
        let params= {
            testId: this.TestId,
            questionId: this.QaIdS,
            choseIds: this.nextQa,
            questionNum: this.primo,
          }
        //请求
       this.$axios.testing.getNextQuestion(params).then(res => {
          if (res.data.returnCode == 1) {
            this.tiarr = [];//请求成功后清空数组;
            if (res.data.returnObject.isDo == 0) {
              this.ScoType = res.data.returnObject.question.questionType;
              this.QaText = res.data.returnObject.question.questionText;
              this.primo = res.data.returnObject.question.questionNum;//
              this.QaIdS = res.data.returnObject.question.questionId;//题目id
              this.TestId = res.data.returnObject.secTest.testId;
              this.payMode = res.data.returnObject.secTest.payMode;
              this.marketAll = res.data.returnObject.secTest.payExamType;
              let candidate = res.data.returnObject.question.secQuestionOptions;//答案选象
              /**/
              for (let i = 0; i < candidate.length; i++) {
                candidate[i].flag = false;
              }
              this.candidate = candidate;
              if (this.payMode == 0) {
                this.marketAll = 25;
              }
              if (this.primo == this.marketAll) {
                this.btnSub[1].name = '交卷';
              } else {
                this.btnSub[1].name = '下一题';
              }

              //console.log("res.data.returnObject", this.candidate, res.data.returnObject);
              window.localStorage.setItem("testId", this.TestId);
            } else {
              this.tiarr = [];//请求成功后清空数组;
              this.ScoType = res.data.returnObject.details.secTestQuestion.questionType;
              this.QaText = res.data.returnObject.details.secTestQuestion.questionText;
              this.primo = res.data.returnObject.details.questionNum;//
              let candidate = res.data.returnObject.details.secTestQuestion.secQuestionOptions;//答案选象
              this.answerOption = res.data.returnObject.details.answerOption;
              this.QaIdS = res.data.returnObject.details.secTestQuestion.questionId;//题目id
              this.TestId = res.data.returnObject.secTest.testId;
              this.payMode = res.data.returnObject.secTest.payMode;
              window.localStorage.setItem("testId", this.TestId);
              this.submit = true;
              /**/
              if (this.ScoType == 3) {
                let ans = this.answerOption.split(" ");
                ans = this.$array.ImpArr(ans);
                for (let i = 0; i < candidate.length; i++) {
                  candidate[i].flag = false;
                  ////console.log("=======================", candidate);
                  for (let j = 0; j < ans.length; j++) {
                    if (candidate[i].optionNo == ans[j]) {
                      candidate[i].flag = true;
                      this.tiarr.push(candidate[i].optionId);
                    }
                  }
                }
                this.strQa = this.tiarr.join(",");
                this.candidate = candidate;
                //console.log("=====121", candidate);
              } else {
                for (let i = 0; i < candidate.length; i++) {
                  if (candidate[i].optionNo == this.answerOption) {
                    candidate[i].flag = true;
                    this.tiarr.push(candidate[i].optionId);
                  } else {
                    candidate[i].flag = false;
                  }
                }
                this.candidate = candidate;
                this.strQa = this.tiarr.join(",");
                //console.log(this.tiarr, this.strQa, this.candidate);
              }
            }
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
          this.submit = true;
        }).catch((err) => {
          console.error(err);
        })
      },
      /**/
      beforeSubmit() {
        //请求
        let params= {
            testId: this.TestId,
            questionNum: this.primo,
          }
        this.$axios.testing.getLastQuestion(params).then(res => {
          this.tiarr = [];//请求成功后清空数组;
          this.answerOption = res.data.returnObject.details.answerOption;
          this.ScoType = res.data.returnObject.details.secTestQuestion.questionType;
          this.QaText = res.data.returnObject.details.secTestQuestion.questionText;
          this.primo = res.data.returnObject.details.questionNum;//
          let candidate = res.data.returnObject.details.secTestQuestion.secQuestionOptions;//答案选象
          if (this.primo == this.marketAll) {
            this.btnSub[1].name = '交卷';
          } else {
            this.btnSub[1].name = '下一题';
          }
          this.QaIdS = res.data.returnObject.details.secTestQuestion.questionId;//题目id
          this.TestId = res.data.returnObject.secTest.testId;
          this.payMode = res.data.returnObject.secTest.payMode;
          window.localStorage.setItem("testId", this.TestId);
          this.submit = true;
          if (this.ScoType == 3) {
            let ans = this.answerOption.split(" ");
            //console.log("154858", ans);
            ans = this.$array.ImpArr(ans);
            //console.log("15485822", ans);
            for (let i = 0; i < candidate.length; i++) {
              candidate[i].flag = false;
              for (let j = 0; j < ans.length; j++) {
                if (ans[j] == candidate[i].optionNo) {
                  candidate[i].flag = true;
                  this.tiarr.push(candidate[i].optionId);
                }
              }
            }
            this.strQa = this.tiarr.join(",");
            this.candidate = candidate;
            //console.log("=====121", candidate);
          } else {
            for (let i = 0; i < candidate.length; i++) {
              if (candidate[i].optionNo == this.answerOption) {
                candidate[i].flag = true;
                this.tiarr.push(candidate[i].optionId);
              } else {
                candidate[i].flag = false;
              }
            }
            this.candidate = candidate;
            this.strQa = this.tiarr.join(",");
            //console.log(this.tiarr, this.strQa, this.candidate);
          }
        }).catch((err) => {
          console.error(err);
        })
        //上一题
      },
      //提交下一题 、、或者退回到上一题
      testSubmit(index) {
        if (this.submit == true) {
          if (index == 0) {
            console.log(index);
            // 返回上一题
            if (this.primo == 1) {
              this.$vux.toast.show({text: '没有上一题了', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else {
              this.beforeSubmit();
            }
          } else if (index == 1) {
            console.log(index);
            // 进行下一题
            if (this.primo < this.marketAll) {
              //题小于25到
              if (this.ScoType == 3) {
                //duoxuan
                if (this.tiarr.length > 1) {
                  this.submit = false;
                  this.toNext();
                } else {
                  this.$vux.toast.show({text: '请至少勾选两项', position: 'middle', type: 'text', width: 'auto', time: 2500});
                }
              } else {
                //danxuanhuoz panduan
                if (this.tiarr == null || this.tiarr.length === 0) {
                  this.$vux.toast.show({text: '请勾选选项', position: 'middle', type: 'text', width: 'auto', time: 2500});
                } else {
                  this.submit = false;
                  this.toNext();
                  this.$MTAmethod.mtaShare('dongminenglicep-2', {testnextstep: true})
                }
              }
            } else if (this.primo == this.marketAll) {
              if (this.ScoType == 3) {
                //duoxuan
                if (this.tiarr.length > 1) {
                  this.submit = false;
                  this.commit();
                } else {
                  this.$vux.toast.show({text: '请至少勾选两项', position: 'middle', type: 'text', width: 'auto', time: 2500});
                }
              } else {
                //danxuanhuoz panduan
                if (this.tiarr == null || this.tiarr.length === 0) {
                  this.$vux.toast.show({text: '请勾选选项', position: 'middle', type: 'text', width: 'auto', time: 2500});
                } else {
                  this.submit = false;
                  this.commit();
                  this.$MTAmethod.mtaShare('dongminenglicep-2', {testnextstep: true})
                }
              }
            } else {
              this.$vux.toast.show({text: '出现未知错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          } else {
            console.log('NAN');
          }
        } else {
          this.$vux.toast.show({text: '网络不稳定', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
      },
    }
  }
</script>
<style lang="scss">
  .testingListOTCBB {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-size: 100% 100%;
    .testingList-trends {
      height: 4px;
      width: 100%;
      margin-top: 19px;
      margin-bottom: 30px;
      background-color: #5e6566;
      .testingList-item {
        height: 4px;
        width: 8%;
        transition: width 2s;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        background: -webkit-gradient(linear, 100% 0%, 20% 0%, from(#F9F9D0), to(#6498A0));
        position: relative;
        .testingList-itemG {
          background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/xiaodian.png");
          background-size: contain;
          background-repeat: no-repeat;
          width: 13px;
          height: 13px;
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          font-style: normal;
          .testing-pal-icon {
            display: block;
            text-align: center;
            height: 6px;
            color: #f0cf8d;
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;

            .testingList-text {
              position: absolute;
              right: 50%;
              transform: translateX(50%);
              background-color: #323232;
              border-radius: 2px;
              width: 51px;
              height: auto;
              box-sizing: border-box;
              color: white;
              font-size: 11px;
              text-align: center;
            }
          }
          .testing-pal-icon:before {
            content: '';
            height: 0;
            width: 0;
            display: block;
            border: 6px transparent solid;
            border-left-width: 5px;
            border-right-width: 5px;
            border-top-width: 0;
            border-bottom-color: rgba(0, 0, 0, 0.5);
          }
        }
      }
      .testingList-zong {
        position: absolute;
        top: 30px;
        font-size: 11px;
        color: white;
        right: 12px;
      }
    }
    .testingList-content {
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .testingList-TiMu {
        padding: 20.5px 21px 0 21px;
        font-size: 16px;
        color: #f0cf8d;
        line-height: 21px;
        display: table;
        text-align: justify;
        box-sizing: border-box;
        width: 100%;
        .testingList-TiMuScroll {
          /*max-height: 200px;*/
          overflow-y: scroll;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          .testPlate-wenti {
            font-size: 17px;
            letter-spacing: -1px;
            line-height: 24px;
            display: table-cell;
          }
          .testPlate-number {
            font-size: 16px;
            display: table-cell;
          }
        }
      }
      .testPlate-cont-scroll {
        overflow-y: scroll;
        overflow-x: hidden;
        margin-top: 6%;
        -webkit-overflow-scrolling: touch;
        .testPlate-tianxie {
          padding: 0 21px 0 21px;
          box-sizing: border-box;
          .testPlate-units {
            display: table;
            vertical-align: middle;
            padding-bottom: 20px;
            .testPlate-number {
              font-size: 16px;
              display: table-cell;
            }
            .testPlate-numberFoo {
              opacity: 0;
              background-color: rgba(0, 0, 0, 0);
              color: rgba(0, 0, 0, 0);
            }
            .testPlate-units-TitleS {
              display: table-cell;
              .testPlate-units-Title {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(240, 207, 141, 0.26);
                margin-right: 8px;
                position: relative;
                .unitsIcon {
                  position: absolute;
                  left: 0;
                  top: 0;
                  height: 20px;
                  width: 20px;
                  background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/clickd@3x.png");
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                }
              }
            }
            .testPlate-units-Cont {
              color: white;
              width: auto;
              height: auto;
              text-align: justify;
              font-size: 15px;
              display: table-cell;
              vertical-align: top;
            }
          }
        }
      }
    }
    .testPlate-toButton {
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/toButtom.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 20px;
      width: 32.76px;
      margin: auto;
      position: absolute;
      bottom: 18%;
      left: 50%;
      margin-left: -16.3px;
    }
    footer, .testPlate-cont-submit {
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 0;
      line-height: normal;
      box-sizing: border-box;
      width: 100%;
      display: table;
      height: 50px;
      background-color: rgba(255, 255, 255, 0.2);
      color: #f0cf8d;
      .testSubmitt {
        width: 50% !important;
      }
      button {
        width: 33.33%;
        display: table-cell;
        vertical-align: middle;
        height: 100%;
        border: none;
        background-color: rgba(255, 255, 255, 0);
        color: #f0cf8d;
        .icon-leftallright {
          font-size: 20px;
          color: #f0cf8d;
        }
        .icon-middleCollect {
          font-weight: normal;
          img {
            height: 19px;
            margin-top: 2px;
          }
        }
      }
      button:active {
        background-color: rgba(255, 255, 255, 0.2);
        /*border-radius: 50%;*/
      }
    }
    .xa-popup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      border-radius: 12px;
      min-height: 160px;
      width: 260px;
      background: rgba(240, 207, 141, 0.33);
      z-index: 3000;
      -webkit-filter: blur(0px);
      filter: blur(0px);
      box-sizing: border-box;
      p {
        display: block;
        height: 100%;
        width: 100%;
        color: rgba(240, 207, 141, 1);
        font-size: 14px;
        padding: 35px 20px 35px 20px;
        box-sizing: border-box;
        text-align: justify;
      }
      footer {
        font-size: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 40px;
        border-bottom-right-radius: 12px;
        border-bottom-left-radius: 12px;

        button {
          box-sizing: border-box;
          height: 100%;
          width: 50%;
          font-size: 15px;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0);
          color: white;
        }
        button:active {
          border-bottom-left-radius: 12px;
        }
        button:first-child {
          background-color: rgba(240, 207, 141, 0.1);
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 0;
        }
        button:first-child:active {
          background-color: rgba(240, 207, 141, 0.2);
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 0;
        }
        button:last-child {
          background-color: rgba(240, 207, 141, 0.8);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 12px;
        }
        button:last-child:active {
          background-color: rgba(240, 207, 141, 0.6);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 12px;
        }
      }
    }
  }
</style>
