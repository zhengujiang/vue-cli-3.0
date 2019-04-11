<template>
  <transition name="bounce">
    <div id="newOTCBBTestWrong" class="newOTCBBTestWrong">
      <div class="newOTCWrong-now">
        <div class="newOTCWrong-nowIcon">
          <img :src="testing[0].imgUrl" alt="" class="newOTCWrong-nowImg">
        </div>
        <div class="newOTCWrong-nowText">
          <p class="newOTCWrong-nowTitle">{{testing[0].title}}</p>
          <p class="newOTCWrong-nowDoc">本次做错<span
            class="newOTCWrong-nowDocColor">{{testing[0].list.errorCount}}</span>题，总得分
            <span>{{toFixed(testing[0].list.totalScore)}}</span>，总题数{{testing[0].list.payExamType}}
          </p>
        </div>
        <i class="newOTCWrong-nowBtn">
          <button @click="newOTCWrongNow()">{{testing[0].doc}}</button>
        </i>
      </div>
      <div class="newOTCWrong-nowFoo">
        <div class="newOTCWrong-nowBorder"></div>
      </div>
      <div class="newOTCWrong-before">
        <div class="newOTCWrong-nowIcon">
          <img :src="testing[1].imgUrl" alt="" class="newOTCWrong-nowImg">
        </div>
        <div class="newOTCWrong-beforeText">
          <p class="newOTCWrong-nowTitle">{{testing[1].title}}</p>
          <p class="newOTCWrong-nowDoc">共参加{{testing[1].testCount}}次测试</p>
        </div>
      </div>
      <!---->
      <div class="newOTCWrong-content">
        <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="0">
          <li class="newOTCWrong-contentList" v-for="(list,index) in testing[1].list">
            <div class="Wrong-contListIcon">
              <button class="Wrong-contListIconBig">
                <button class="Wrong-contListIconSm"></button>
                <span class="Wrong-contListIconSold"></span>
              </button>
            </div>
            <div class="Wrong-contListTitle" @click="newOTCWrongBefore(index)">
              <p class="">{{formatDate(list.startTimeChange+"000")}}</p>
              <p class="Wrong-contListDoc">错
                <span style="color:#ff6c00;">{{list.errorCount}}</span>
                道，总得分{{toFixed(list.totalScore)}}，总题数{{list.payExamType}}
              </p>
            </div>
            <i class="Wrong-contListBtn" @click="newOTCWrongBefore(index)">
              <button>{{testing[1].doc}}</button>
            </i>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
        </p>
      </div>
      <xiaoan-error v-show="isError"></xiaoan-error>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'newOTCBBTestWrong',
    data() {
      return {
        infLoading: true,
        loading: false,
        allLoaded: true,
        testing: [
          {
            id: "",
            title: "本次考试错题",
            imgUrl: this.$image.testing.nowTestWrong,
            doc: "查看",
            list: "",
            payExamType: '',
          }, {
            id: "",
            title: "历次考试错题",
            imgUrl: this.$image.testing.beforeTestWrong,
            doc: "查看",
            testCount: "",
            list: []
          }
        ],
        isError: false,
        page: 1,
        shuliang: "",
      }
    },
    components: {},
    watch: {
      "$route": function () {
        window.location.reload();
      }

    },
    mounted: function () {
      this.lineHeight();
      //触发接口
      this.getPayUserErrorQuestion();
      var adverttitle = "专业董秘才敢做的测试题！";
      var sharelink2 = decodeURI(window.location.href.split("#/")[0] + "#/testing");//分享链接
      var shareDesc = "";//描述
      /**/
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.testingImg, true);
      //var   d=new   Date(1230999938);
    },
    methods: {
      toFixed(total) {
        return parseFloat(total).toFixed(1);
      },
      loadMore() {
        let lastValue = this.page;
        if (lastValue < this.shuliang) {
          this.loading = true;
        } else {
          this.loading = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.shuliang) {
            this.page += 1;
            this.getPayUserErrorQuestion();
          }
          setTimeout(() => {
            this.allLoaded = false;
            this.loading = false;
          }, 5000)
        }, 300);
      },
      getPayUserErrorQuestion() {
        let params = {
            testId: this.$route.query.testId,
            page: this.page,
          }
        this.$axios.testing.getPayUserErrorQuestion(params).then(res => {
          this.testing[0].list = res.data.returnObject.secTest;
          this.testing[1].testCount = res.data.returnObject.testCount;
          /*this.testing[1].payExamType = res.data.returnObject.payExamType;*/
          /**/
          this.shuliang = this.$array.totalPage((this.testing[1].testCount), 10);//获取页数
          //控制下拉刷新
          var rat = res.data.returnObject.list;
          this.testing[1].list = this.$array.loadMore(this.testing[1].list, rat);
          console.log("======>", res, this.shuliang);
        }).catch((err) => {
          console.error(err);
          this.isError = true;
        })
      },
      formatDate(now) {
        let time = new Date(parseInt(now));
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();
        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();
        return year + "年" + month + "月" + date + "号" + hour + "点" + minute + "分";
      },
      newOTCWrongNow() {
        if (this.testing[0].list.errorCount == 0) {
          this.$vux.toast.show({text: '您本次全对了，太棒了！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.$router.push({
            path: "/newOTCBBTestWrongList",
            query: {testId: this.$route.query.testId}
          });
        }
      },
      newOTCWrongBefore(index) {
        if (this.testing[1].list[index].errorCount == 0) {
          this.$vux.toast.show({text: '您本次全对了，太棒了！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.$router.push({
            path: "/newOTCBBTestWrongList",
            query: {testId: this.testing[1].list[index].testId}
          });
        }
      },
      lineHeight() {
        let hei = document.body.clientHeight;
        let newOTCWrong = document.querySelector(".newOTCWrong-now").clientHeight;
        document.querySelector(".newOTCWrong-content").style.height = (hei - newOTCWrong - newOTCWrong - 1) + "px";
      }
    }
  }
</script>

<style lang="scss">
  .newOTCBBTestWrong {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    .newOTCWrong-now {
      display: table;
      width: 100%;
      box-sizing: border-box;
      padding: 0 30px 0 20px;
      height: 80px;
      background-color: rgba(240, 241, 245, 0.05);
      .newOTCWrong-nowIcon {
        display: table-cell;
        vertical-align: middle;
        width: 11%;
        .newOTCWrong-nowImg {
          vertical-align: middle;
          width: 24px;
        }
      }
      .newOTCWrong-nowText {
        display: table-cell;
        vertical-align: middle;
        .newOTCWrong-nowTitle {
          color: #f0cf8d;
          font-size: 15px;
        }
        .newOTCWrong-nowDoc {
          color: #a9a9aa;
          font-size: 12px;
          .newOTCWrong-nowDocColor {
            color: #ff6c00;
          }
        }
      }
      .newOTCWrong-nowBtn {
        display: table-cell;
        vertical-align: middle;
        text-align: right;
        button {
          width: 60px;
          height: 30px;
          border-radius: 30px;
          background-color: rgba(240, 207, 141, 0.26);
          border: none;
          color: #f0cf8d;
          font-size: 13px;
        }
      }
    }
    .newOTCWrong-nowFoo {
      display: table;
      width: 100%;
      box-sizing: border-box;
      padding: 0 12px;
      background-color: rgba(240, 241, 245, 0.08);
      .newOTCWrong-nowBorder {
        border-top: 0.5px solid rgba(240, 241, 245, 0.2);
        color: #f0f1f5;
      }
    }
    .newOTCWrong-before {
      display: table;
      width: 100%;
      box-sizing: border-box;
      padding: 0 30px 0 20px;
      height: 80px;
      background-color: rgba(240, 241, 245, 0.05);
      .newOTCWrong-nowIcon {
        display: table-cell;
        vertical-align: middle;
        width: 11%;
        .newOTCWrong-nowImg {
          vertical-align: middle;
          width: 24px;
        }
      }
      .newOTCWrong-beforeText {
        display: table-cell;
        vertical-align: middle;
        .newOTCWrong-nowTitle {
          color: #f0cf8d;
          font-size: 15px;
        }
        .newOTCWrong-nowDoc {
          color: #a9a9aa;
          font-size: 13px;
        }
      }
    }
    .newOTCWrong-content {
      background-color: rgba(0, 0, 0, 0.2);
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .infinite-list {
        .newOTCWrong-contentList {
          width: 100%;
          box-sizing: border-box;
          padding: 0 30px 0 40px;
          display: table;
          color: #f0cf8d;
          margin-top: 28px;
          font-size: 0;
          .Wrong-contListTitle, .Wrong-contListIcon, .Wrong-contListBtn {
            display: table-cell;
            font-size: 15px;
          }
          .Wrong-contListIcon {
            .Wrong-contListIconBig {
              border: none;
              height: 10px;
              width: 10px;
              border-radius: 50%;
              background-color: rgba(240, 207, 141, 0.26);
              vertical-align: middle;
              position: relative;
              z-index: 1000;
              .Wrong-contListIconSm {
                border: none;
                height: 5px;
                width: 5px;
                border-radius: 50%;
                background-color: #F0CF8D;
                text-align: center;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
              }
              .Wrong-contListIconSold {
                width: 1px;
                height: 80px;
                border-left: 0.5px solid rgba(255, 255, 255, 0.23);
                position: absolute;
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
              }
            }
          }
          .Wrong-contListTitle {
            p {
            }
            .Wrong-contListDoc {
              color: rgba(255, 255, 255, 0.23);
              font-size: 13px;
            }
          }
          .Wrong-contListBtn {
            text-align: right;
            font-size: 15px;
            button {
              width: 60px;
              height: 30px;
              border-radius: 30px;
              background-color: rgba(240, 207, 141, 0.26);
              border: none;
              color: #f0cf8d;
              font-size: 13px;
            }
          }
        }
        .newOTCWrong-contentList:last-child {
          padding-bottom: 30px;
        }
      }
      .infinite-loading {
        text-align: center;
        height: 45px;
        line-height: 45px;
      }
    }
  }
</style>
