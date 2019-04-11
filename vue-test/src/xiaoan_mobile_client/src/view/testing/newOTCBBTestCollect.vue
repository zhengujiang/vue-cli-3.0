<template>
  <transition name="bounce">
    <div id="newOTCBBTestWrongList" class="newOTCBBTestWrongList">
      <div class="newOTCBBTestCont" ref="newOTCTTT">
        <h3 class="newOTCBBTestTitle" ref="newOTCT"><span>{{page+"、"}}</span>{{WrongDetails.questionText}}</h3>
        <div class="newOTCBBTestItem" ref="newOTCItem">
          <div class="testPlate-tianxie">
            <div class="testPlate-units" v-for="(list,index) in WrongList.secQuestionOptions">
              <div class="testPlate-units-TitleS">
                <div class="testPlate-units-Title" :class="{unitsIcon:list.isCorrect == 1}"></div>
              </div>
              <div class="testPlate-units-Cont">{{list.questionOption}}</div>
            </div>
          </div>
        </div>
        <h3 class="newOTCBBTestTxt" ref="newOTCTTEXT">
          <span class="newOTCBBTestTxtI"><i></i></span><span
          class="newOTCBBTestTxtC">{{newOTCBBTestTxtC}}</span>
        </h3>
        <div class="newOTCBBTestReason" :style="{ height: toheight}" ref="newOTCReason">
          <p>{{WrongList.analysis}}</p>
        </div>
      </div>
      <!--================-->
      <footer class="newOTCBBTestFooter" ref="newOTCTFoot">
        <button @click="questionBefore">
          <i class="icon iconfont icon-jiantou-copy-copy icon-leftallright"></i>
          <p>{{before}}</p>
        </button>
        <button @click="questionCollect">
          <i class="icon-middleCollect">
            <img :src="$image.testing.testWrongCollectClose" alt=""/>
          </i>
          <p v-show="false">收藏</p>
          <p v-show="true">移除</p>
        </button>
        <button @click="questionNext">
          <i class="icon iconfont icon-jiantou2 icon-leftallright"></i>
          <p>{{next}}</p>
        </button>
      </footer>
      <xiaoan-error v-show="isError"></xiaoan-error>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'newOTCBBTestWrongList',
    data() {
      return {
        WrongList: Object,
        WrongDetails: Object,
        candidate: [],
        newOTCBBTestTxtC: "答题解析",
        before: "上一题",
        next: "下一题",
        page: 1,
        total: "",
        payMode: "",
        isCount: "",
        isError: false,
        toheight: ''
      }
    },
    watch: {
      "$route": function () {
        window.location.reload();
      },
      page: function () {
        this.page = parseInt(this.page);
        /*this.$nextTick(() => {
            let newOTCTTT = this.$refs.newOTCTTT.getBoundingClientRect().height;
            let newOTCT = this.$refs.newOTCT.getBoundingClientRect().height;
            let newOTCItem = this.$refs.newOTCItem.getBoundingClientRect().height;
            let newOTCTTEXT = this.$refs.newOTCTTEXT.getBoundingClientRect().height;
            let newOTCTFoot = this.$refs.newOTCTFoot.getBoundingClientRect().height;
            let newOTCReason = this.$refs.newOTCReason.getBoundingClientRect().height;
            let toheight = newOTCTTT - newOTCT - newOTCItem - newOTCTTEXT - newOTCTFoot;
            console.log(newOTCReason, toheight);
            this.toheight =  + 'px';
            if (newOTCReason < toheight) {
                this.toheight = toheight + 'px';
            }
        })*/
      }
    },
    components: {},
    mounted: function () {
      if (window.localStorage.getItem("NewOTCBBPage") == null || window.localStorage.getItem("NewOTCBBPage") == undefined) {
        this.page = 1;
        console.log("33333123123");
        this.getErrorQuestion(this.page);
      } else {
        this.page = window.localStorage.getItem("NewOTCBBPage");
        console.log("123123");
        this.getErrorQuestion(this.page);
        window.localStorage.removeItem("NewOTCBBPage")
      }
      this.lineHeight();
      var adverttitle = "专业董秘才敢做的测试题！";
      var sharelink2 = decodeURI(window.location.href.split("#/")[0] + "#/testing");//分享链接
      var shareDesc = "";//描述
      /**/
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.testingImg, true);
    },
    methods: {
      userTestInfo() {
       this.$axios.testing.userTestInfo().then(res => {
          console.log(res);
          if (res.data.returnCode === 1) {
            this.payMode = res.data.returnObject.userPayMode.payMode;//免费 0 和付费 1
          } else {
            this.$router.push({path: "/testing"});
          }
        }).catch((err) => {
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
          setTimeout(() => {
            this.userTestInfo();
            //一旦接口出错将自动跳转到testing
          }, 3000)
        })
      },
      /**/
      getErrorQuestion(questionPage) {
        let params = {
            page: questionPage,
          }
        this.$axios.testing.selectCollect(params).then(res => {
          if (res.data.returnCode == 1) {
            this.WrongList = res.data.returnObject.question;
            this.WrongDetails = res.data.returnObject.question;
            this.total = res.data.returnObject.count;
            window.document.title = "收藏错题" + questionPage + "/" + this.total;
          } else {
            this.$router.push({path: "/newOTCBBTestingEnd"});
          }
          /*this.$nextTick(() => {
              let newOTCTTT = this.$refs.newOTCTTT.getBoundingClientRect().height;
              let newOTCT = this.$refs.newOTCT.getBoundingClientRect().height;
              let newOTCItem = this.$refs.newOTCItem.getBoundingClientRect().height;
              let newOTCTTEXT = this.$refs.newOTCTTEXT.getBoundingClientRect().height;
              let newOTCTFoot = this.$refs.newOTCTFoot.getBoundingClientRect().height;
              let newOTCReason = this.$refs.newOTCReason.getBoundingClientRect().height;
              let toheight = newOTCTTT - newOTCT - newOTCItem - newOTCTTEXT - newOTCTFoot;
              console.log(newOTCReason, toheight);
              if (newOTCReason < toheight) {
                  this.toheight = toheight + 'px';
              }
          })*/
          console.log("======>", res);
        }).catch((err) => {
          console.error(err);
          this.isError = true;
        })
      },
      questionBefore() {
        this.page -= 1;
        if (this.page < 1) {
          this.page = 1;
          this.$vux.toast.show({text: '该题已经是第一题了，无上一题', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.getErrorQuestion(this.page);
          console.log("111", this.page);
        }
      },
      questionNext() {
        this.page += 1;
        if (this.page > this.total) {
          this.page = this.total;
          this.$vux.toast.show({text: '该题已经是最后一题了，无下一题', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.getErrorQuestion(this.page);
          console.log("222", this.page);
        }
      },
      questionCollect() {
        if (this.payMode == 1) {
          window.localStorage.setItem("NewOTCBBPage", this.page);
          window.location.href = window.location.href.split("#/")[0] + "?#/newOTCBBTestDescribe";
          //免费
        } else {
          //付费
          this.remQuestion(this.WrongList.questionId);
        }
      },
      remQuestion(questionID) {
        let params = {
            questionId: questionID,
          }
       this.$axios.testing.deleteCollectQuestion(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.page -= 1;
            if (this.page < 1) {
              this.page = 1;
              this.getErrorQuestion(this.page);
            } else {
              this.getErrorQuestion(this.page);
            }
            this.$vux.toast.show({text: '移除收藏成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$vux.toast.show({text: '不好了，遇见未知错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '移除收藏失败，请稍后尝试', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      lineHeight() {
        let hei = document.body.clientHeight;
        let footer = document.querySelector(".newOTCBBTestFooter").clientHeight;
        document.querySelector(".newOTCBBTestCont").style.height = (hei - footer) + "px";
      },
    }
  }
</script>

<style lang="scss">
  .newOTCBBTestWrongList {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    .newOTCBBTestCont {
      background-color: rgba(0, 0, 0, 0.2);
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .newOTCBBTestTitle {
        background-color: rgba(255, 255, 255, 0.07);
        box-sizing: border-box;
        padding: 20px 17.5px;
        width: 100%;
        color: #f0cf8d;
        font-size: 15px;
      }
      .newOTCBBTestItem {
        // background-color: rgba(0, 0, 0, 0.2);
        padding: 25px 0;
        .testPlate-tianxie {
          padding: 0 17.5px 0 17.5px;
          .testPlate-units {
            display: table;
            vertical-align: middle;
            padding-bottom: 20px;
            .testPlate-units-TitleS {
              display: table-cell;
              .testPlate-units-Title {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(240, 207, 141, 0.26);
                margin-right: 8px;
              }
              .unitsIcon {
                height: 20px;
                width: 20px;
                background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/clickd@3x.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
              }
            }
            .testPlate-units-Cont {
              color: #f0cf8d;
              width: 93.5%;
              height: auto;
              text-align: justify;
              font-size: 15px;
              display: table-cell;
              vertical-align: top;
            }
          }
        }
      }
      .newOTCBBTestTxt {
        width: 100%;
        box-sizing: border-box;
        display: table;
        padding: 0 17.5px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.07);
        .newOTCBBTestTxtI {
          width: 3px;
          display: table-cell;
          vertical-align: middle;
          i {
            width: 0;
            height: 13px;
            display: table-cell;
            border-left: 3px solid #f0cf8d;
            vertical-align: middle;
          }
        }
        .newOTCBBTestTxtC {
          display: table-cell;
          vertical-align: middle;
          color: #f0cf8d;
          padding-left: 5px;
        }
      }
      .newOTCBBTestReason {
        // background-color: rgba(0, 0, 0, 0.2);
        padding: 18px 17.5px 30px 17.5px;
        color: #f0cf8d;
        font-size: 15px;
        white-space: pre-wrap;
        p {
        }
      }
    }
    .newOTCBBTestFooter {
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 0;
      line-height: normal;
      box-sizing: border-box;
      width: 100%;
      display: table;
      height: 50px;
      color: #f0cf8d;
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
        p {
        }
      }
      button:active {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
</style>

<style scoped>
  #newOTCBBTestWrongList .icon-middleClose {
    height: 20px;
    width: 20px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/testWrongclose@3x.png");
    background-repeat: no-repeat;
    background-size: contain;
  }
  #newOTCBBTestWrongList .testPlate-number {
    font-size: 16px;
    display: table-cell;
  }
  #newOTCBBTestWrongList .testPlate-numberFoo {
    opacity: 0;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0);
  }
  #newOTCBBTestWrongList .newOTCBBTestDoc {
    padding: 25px 17.5px 25px 17.5px;
    font-size: 15px;
    color: #f0cf8d;
  }
  #newOTCBBTestWrongList .newOTCBBTestDocFoo {
    padding: 0 17.5px;
    box-sizing: border-box;
  }
  #newOTCBBTestWrongList .newOTCBBTestDocFoo p {
    border-top: 0.5px solid rgba(250, 250, 250, 0.2);
  }
  .noCollect {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .noCollectImg {
    height: 110px;
    width: 127.40px;
    margin: 38.2% auto 0 auto;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/warning/warning3.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

</style>
