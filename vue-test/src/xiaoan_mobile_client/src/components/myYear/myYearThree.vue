<template>
  <div class="my-year-three">
    <div v-show="activeIndex == 2" class="my-scale">
      <header class="animated" :class="{fadeInDown : activeIndex == 2}">
        <div class="header-str">
                <span class="name-seen animated" :class="{fadeIn : activeIndex == 2}">
                <span class="fix animated">
                    <i>
                       <img :src="myHome.Avatar" alt="">
                    </i>
                </span>
                <span class="fix">
                    <span class="fix-title">{{myHome.name}}</span>
                    <span class="fix-doc">{{myHome.codeName}}【{{myHome.code}}】</span>
                </span>
            </span>
        </div>
      </header>
      <div class="m-y-two-middle-two" v-show="isActive">
        <div class="news-right animated" :class="{fadeInRight : activeIndex == 2}">
          <img :src="$image.myYear.y3_5" alt="">
        </div>

        <div class="two-middle-content animated" :class="{fadeIn : activeIndex == 2}">
          <img :src="$image.myYear.y3_2" alt="" class="animated"
               :class="{fadeIn : activeIndex == 2}">
          <div class="new-left-title animated" :class="{fadeInRight : activeIndex == 2}">
            <img :src="$image.myYear.y3_12" alt="">
          </div>
          <div class="time-top animated" :class="{fadeIn : activeIndex == 2}">
            <div class=" imgFlex">
              <img :src="$image.myYear.y3_5_1" alt="">
            </div>
            <div class="tap-flex">
              <p class="swing animated" :class="{zoomIn : activeIndex == 2}">
                共召开<span>{{myYearData.gddhCount}}</span>次股东大会</p>
              <p class="two">超过{{myYearData.gddhCountRaise}}%的上市公司</p>
              <p class="two" v-if="myYearData.gddhCount >= 4">Meeting Queen</p>
            </div>
          </div>
          <div class="time-bottom animated" :class="{fadeIn : activeIndex == 2}">
            <div class=" imgFlex">
              <img :src="$image.myYear.y3_5_1" alt="">
            </div>
            <div class="tap-flex">
              <p class="swing animated" :class="{zoomIn : activeIndex == 2}">
                共回答<span>{{myYearData.qaCount}}</span>次投资者问题
              </p>
              <p class="two">超过{{myYearData.qaCountRaise}}%的上市公司</p>
              <p class="two" v-if="myYearData.qaCount >= 100">投资者的小棉袄</p>
            </div>
          </div>
          <div class="time-foo animated" :class="{fadeIn : activeIndex == 2}">
            <p>
              <b v-show="myYearData.shzrbgFirstTime">于{{$const.formatText(myYearData.shzrbgFirstTime)}}披露了
                <span>社会责任报告</span>。
              </b>
              <b v-show="myYearData.hgt == true || myYearData.sgt == true || myYearData.rzrqbd == true">入选了</b>
              <span v-show="myYearData.hgt == true">沪港通标的</span>
              <b v-show="myYearData.hgt == true && (myYearData.sgt == true || myYearData.rzrqbd == true)">、</b>
              <span v-show="myYearData.sgt == true">深港通标的</span>
              <b v-show="myYearData.sgt == true && myYearData.rzrqbd == true">、</b>
              <span v-show="myYearData.rzrqbd == true">融资融券标的</span>
              <b v-show="myYearData.hgt == true || myYearData.sgt == true || myYearData.rzrqbd == true">。</b>
            </p>
          </div>
        </div>
      </div>
      <div class="m-y-two-middle" v-show="!isActive">
        <div class="news-right animated" :class="{fadeInRight : activeIndex == 2}">
          <img :src="$image.myYear.y3_5" alt="">
        </div>
        <div class="two-middle-content">
          <img :src="$image.myYear.y3_2_2" alt="" class="animated"
               :class="{fadeIn : activeIndex == 2}">
          <div class="time-top animated" :class="{fadeIn : activeIndex == 2}">
            <div class=" imgFlex">
              <img :src="$image.myYear.y3_5_1" alt="">
            </div>
            <div class="tap-flex">
              <p class="swing animated" :class="{zoomIn : activeIndex == 2}">
                共召开<span>{{myYearData.gddhCount}}</span>次股东大会</p>
              <p class="two">超过{{myYearData.gddhCountRaise}}%的上市公司</p>
              <p class="two" v-if="myYearData.gddhCount >= 4">Meeting Queen</p>
            </div>
          </div>
          <div class="time-bottom animated" :class="{fadeIn : activeIndex == 2}">
            <div class="imgFlex">
              <img :src="$image.myYear.y3_5_1_" alt="">
            </div>
            <div class="tap-flex">
              <p class="swing animated" :class="{zoomIn : activeIndex == 2}">
                共回答<span>{{myYearData.qaCount}}</span>次投资者问题
              </p>
              <p class="two">超过{{myYearData.qaCountRaise}}%的上市公司</p>
              <p class="two" v-if="myYearData.qaCount >= 100">投资者的小棉袄</p>
            </div>
          </div>
        </div>
      </div>
      <p class="icons-jiantou animated" :class="{fadeInUp : activeIndex == 2}">
        <img class="arrow" :src="$image.myYear.y12_3" alt="">
        <!--<i class="icon iconfont icon-xiangshangjiantou"></i>-->
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "my-year-one",
    data() {
      return {
        headerTouxiang: this.$image.personal.timg,
        isActive: true,
        activeIndex: ''
      }
    },
    props: {
      myHome: {
        type: Object,
        required: false
      },
      active: {
        type: Number,
        required: false,
        default: 0
      },
      myYearData: {
        type: Object,
        required: false
      },
      android: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    watch: {
      'active': function () {
        setTimeout(() => {
          this.activeIndex = this.active;
          if (this.myYearData.shzrbgFirstTime != '' && this.myYearData.shzrbgFirstTime != null ||
            this.myYearData.hgt == true || this.myYearData.sgt == true || this.myYearData.rzrqbd == true) {
            this.isActive = true;
          } else {
            this.isActive = false;
            console.log(2132331 + '23123213213132');
          }
          console.log(this.isActive, 2132331, this.myYearData.shzrbgFirstTime, '===', this.myYearData.hgt, this.myYearData.sgt, this.myYearData.rzrqbd);
        }, 500);
        // this.isActive = this.myYearData.rzrqbd;
      }
    },
    mounted() {
      if (this.android) {
        // 是安卓机
        $('.my-year-three .header-str').css({marginTop: '10px'});
        $('.my-year-three .m-y-two-middle').css({marginTop: '3%', padding: '0 7%'});
        $('.my-year-three .m-y-two-middle-two').css({marginTop: '3%', padding: '0 8%'});
        // $('.my-year-two .m-y-o-ba').css({padding: '2% 6% 0 8%'})
      }
      // this.activeIndex = 2;
    }
  }
</script>

<style lang="scss">
  .my-year-three {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/2@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
    * {
      box-sizing: border-box;
    }
    .icons-jiantou {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      img {
        width: 26px;
        animation-duration: 10s;
      }
      .arrow {
        -webkit-transform: rotate(0deg);
        -webkit-animation: arrow 1.5s infinite ease-in-out;
      }
      @-webkit-keyframes arrow {
        0% {
          opacity: 0;
          -webkit-transform: translate(0, 0px) rotate(0deg)
        }
        50% {
          opacity: 1;
          -webkit-transform: translate(0, -15px) rotate(0deg)
        }
        100% {
          opacity: 0;
          -webkit-transform: translate(0, -20px) rotate(0deg)
        }
      }
    }
    header {
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      .header-str {
        display: inline-block;
        padding: 5px 10px;
        border: 1.8px solid rgba(255, 255, 255, 0.5);
        border-radius: 60px;
        margin-top: 25px;
        margin-left: 20px;
        box-sizing: border-box;
        background-color: rgba(255, 161, 33, 0.25);
        box-shadow: 2px 2px 1px rgba(255, 162, 32, 0.15);
        .name-seen {
          display: table;
          .fix {
            display: table-cell;
            vertical-align: middle;
            i {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: #ffb148;
              display: inline-block;
              box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
              box-sizing: border-box;
              text-align: center;
              vertical-align: middle;
              img {
                padding: 1.8px;
                border-radius: 50%;
                height: 100%;
                width: 100%;
                box-sizing: border-box;
              }
            }
            .fix-title {
              height: 100%;
              display: block;
              font-size: 15px;
              padding-left: 10px;
              color: #ffa220;
              width: 138px;
              word-break: keep-all; /* 不换行 */
              white-space: nowrap; /* 不换行 */
              overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
              text-overflow: ellipsis;
            }
            .fix-doc {
              font-size: 14px;
              padding-left: 10px;
              color: #ffa220;
            }
          }
        }
      }
    }
    .m-y-two-middle {
      * {
        font-family: PingFangSC-Medium, sans-serif;
      }
      width: 100%;
      padding: 0 5% 0 5%;
      margin-top: 20px;
      box-sizing: border-box;
      .news-right {
        position: absolute;
        top: 13%;
        right: 0;
        text-align: right;
        z-index: 100;
        img {
          width: 50%;
          box-sizing: border-box;
        }
      }
      img {
        width: 100%;
        box-sizing: border-box;
      }
      > div {
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        position: relative;
        .time-top {
          position: absolute;
          top: 38%;
          left: 0;
          color: #545454;
          font-size: 14px;
          width: 100%;
          display: table;
          padding: 0 0 0 14%;
          box-sizing: border-box;
          .imgFlex {
            width: 70px;
            display: table-cell;
            vertical-align: middle;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
          }
          .tap-flex {
            display: table-cell;
            vertical-align: top;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
            .swing {
              color: #545454;
              font-family: PingFangSC-Medium, sans-serif;
            }
            p {
              line-height: 1;
              span {
                font-size: 40px;
                color: #ffb148;
                line-height: 32px;
              }
            }
            .two {
              color: #b1b1b1;
              font-size: 13px;
              margin-top: 5px;
            }
          }
        }
        .time-bottom {
          position: absolute;
          top: 57%;
          left: 0;
          font-size: 14px;
          color: #545454;
          display: table;
          width: 100%;
          padding: 0 0 0 14%;
          box-sizing: border-box;
          .imgFlex {
            width: 70px;
            display: table-cell;
            vertical-align: middle;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
          }
          .tap-flex {
            display: table-cell;
            vertical-align: top;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
            .swing {
              color: #545454;
              font-family: PingFangSC-Medium, sans-serif;
            }
            p {
              line-height: 1;
              span {
                font-size: 40px;
                color: #ffb148;
                line-height: 32px;
              }
            }
            .two {
              font-size: 13px;
              margin-top: 5px;
              color: #b1b1b1;
            }
          }
        }
      }
    }
    .m-y-two-middle-two {
      * {
        font-family: PingFangSC-Medium, sans-serif;
      }
      width: 100%;
      height: 78%;
      padding: 0 5% 0 3%;
      margin-top: 15px;
      box-sizing: border-box;

      .news-right {
        position: absolute;
        top: 9%;
        right: 0;
        text-align: right;
        z-index: 100;
        img {
          width: 50%;
          box-sizing: border-box;
        }
      }
      img {
        width: 100%;
        box-sizing: border-box;
      }
      > div {
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        position: relative;
        .new-left-title {
          position: absolute;
          top: 11%;
          left: 0;
          padding-left: 14%;
          z-index: 100;
          img {
            width: 200px;
          }
        }
        .time-top {
          position: absolute;
          top: 27%;
          left: 0;
          color: #b1b1b1;
          font-size: 14px;
          width: 100%;
          padding: 0 0 0 14%;
          box-sizing: border-box;
          display: table;
          .imgFlex {
            width: 70px;
            display: table-cell;
            vertical-align: middle;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
          }
          .tap-flex {
            display: table-cell;
            vertical-align: top;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
            .swing {
              color: #545454;
              font-family: PingFangSC-Medium, sans-serif;
            }
            p {
              line-height: 1;
              span {
                font-size: 40px;
                color: #ffb148;
                line-height: 32px;
              }
            }
            .two {
              font-size: 13px;
              margin-top: 5px;
            }
          }
        }
        .time-bottom {
          position: absolute;
          top: 47%;
          left: 0;
          color: #b1b1b1;
          font-size: 14px;
          display: table;
          width: 100%;
          padding: 0 0 0 14%;
          box-sizing: border-box;
          .imgFlex {
            width: 70px;
            display: table-cell;
            vertical-align: middle;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
          }
          .tap-flex {
            flex: 1;
            vertical-align: top;
            display: table-cell;
            img {
              height: 60px;
              width: 60px;
              vertical-align: middle;
            }
            .swing {
              color: #545454;
              font-family: PingFangSC-Medium, sans-serif;
            }
            p {
              line-height: 1;
              span {
                font-size: 40px;
                color: #ffb148;
                line-height: 32px;
              }
            }
            .two {
              font-size: 13px;
              margin-top: 5px;
            }
          }

        }
        .time-foo {
          width: 100%;
          position: absolute;
          top: 73%;
          left: 5%;
          font-size: 14px;
          p {
            box-sizing: border-box;
            padding: 0 13% 0 9%;
            color: #545454;
            b {
              font-weight: normal;
            }
            span {
              color: #ffb148;
            }
          }
        }
      }
    }
  }
</style>
