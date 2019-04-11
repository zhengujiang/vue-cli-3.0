<template>
  <div class="my-year-two">
    <div v-show="activeIndex == 1" class="my-scale">
      <header class="animated" :class="{fadeInDown : activeIndex == 1}">
        <div class="header-str animated">
                <span class="name-seen">
                    <span class="fix">
                    <i>
                       <img :src="myHome.Avatar" alt="">
                    </i>
                    </span>
                    <span class="fix">
                        <span class="fix-title" :style="{width: titleWidth+'px'}">{{myHome.name}}</span>
                        <span class="fix-doc" ref="fixCell">{{myHome.codeName}}【{{myHome.code}}】</span>
                    </span>
                </span>
        </div>
      </header>
      <div class="m-y-two-middle">
        <div class="two-middle-content">
          <img :src="$image.myYear.y2_2" alt="" class="imgbigZoom animated"
               :class="{zoomIn : activeIndex == 1}">
          <div class="time-top animated" :class="{zoomIn : activeIndex == 1}"><span>{{$const.formatText(myYearData.firstTime).split("年")[1]}}</span>发布了第一份公告
          </div>
          <div class="time-middle animated" :class="{zoomIn : activeIndex == 1}">
            <img class="smicon" :src="$image.myYear.y2_121" alt="">
            <img class="shou animated" :class="{fadeInRight:activeIndex == 1}"
                 :src="$image.myYear.y2_900" alt="">
            <div class="time-middle-text">
              <p class="ti-mid-title animated" :class="{fadeIn : activeIndex == 1}">
                期间发布公告和上网文件
              </p>
              <p class="ti-mid-number animated" :class="{fadeIn : activeIndex == 1}">
                <span class="">{{myYearData.announcementCount}}</span>&ensp;份
              </p>
              <p class="ti-mid-fix animated ti-fix" :class="{fadeIn : activeIndex == 1}">
                全年发布公告的累计字数<span>{{$array.unitWan(myYearData.wordCount)[0]}}</span>{{$array.unitWan(myYearData.wordCount)[1]}}字，相当于抄写了<span>{{myYearData.likeLawCount}}</span>本上市规则。
              </p>
              <!--<p class="ti-mid-fix animated" :class="{fadeIn : activeIndex == 1}">-->
              <!--</p>-->
              <!--<p class="ti-mid-fix animated" :class="{fadeIn : activeIndex == 1}">-->
              <!---->
              <!--</p>-->
            </div>
          </div>
          <div class="time-bottom animated" :class="{zoomIn : activeIndex == 1}">
            <span>{{$const.formatText(myYearData.lastTime).split("年")[1]}}</span>发布了最后一份公告
          </div>
        </div>
        <div class="news-right animated" :class="{fadeInRight : activeIndex == 1}">
          <img :src="$image.myYear.news" alt="">
        </div>
      </div>
      <p class="icons-jiantou animated" :class="{fadeInUp : activeIndex == 1}">
        <img class="arrow" :src="$image.myYear.y12_3" alt="">
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
        activeIndex: 0,
        titleWidth: ''
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
          console.log(this.activeIndex);
        }, 500)
      }
    },
    mounted() {
      if (this.android) {
        // 是安卓机
        $('.my-year-two .header-str').css({marginTop: '10px'});
        $('.my-year-two .m-y-two-middle').css({marginTop: '3%'});
        $('.my-year-two .m-y-o-ba').css({padding: '2% 6% 0 8%'})
      }
    }
  }
</script>

<style lang="scss">
  .my-year-two {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/2@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    * {
      box-sizing: border-box;
      font-family: PingFangSC-Medium, sans-serif;
    }
    .icons-jiantou {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      img {
        width: 25px;
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
      * {
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;

      }
      .header-str {
        display: inline-block;
        padding: 5px 10px;
        border: 2px solid rgba(255, 255, 255, 0.5);
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
              text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
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
      width: 100%;
      padding: 0 3% 0 3%;
      margin-top: 5%;
      box-sizing: border-box;
      position: relative;
      img {
        width: 100%;
        box-sizing: border-box;

      }
      .news-right {
        position: absolute;
        top: -13%;
        right: 0;
        text-align: right;
        z-index: 100;
        img {
          width: 30%;
          box-sizing: border-box;
        }
      }
      .two-middle-content {
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        position: relative;
        .imgbigZoom {
          animation-duration: 1s;
        }
        .time-top {
          position: absolute;
          top: 21.5%;
          left: 23%;
          color: #8d8d8d;
          font-size: 14px;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          span {
            font-size: 14px;
            color: #ffb148;
            font-family: PingFangSC-Medium, sans-serif;
          }
        }

        .time-middle {
          width: 188px;
          box-sizing: border-box;
          position: absolute;
          top: 30%;
          left: 27%;
          // animation-duration: 1.5s;
          // transform: translate3d(-50%, -50%, 0);
          font-size: 13.5px;
          text-align: center;
          color: #8d8d8d;
          .shou {
            width: 40px;
            position: absolute;
            bottom: 0;
            right: -10px;
            animation-duration: 2s;
          }
          .time-middle-text {
            position: absolute;
            top: 0;
            left: 0;
            padding: 2%;
            span {
              font-size: 14px;
              color: #ffb148;
            }
            .ti-mid-title {
              text-align: left;
              padding-left: 15px;
              margin-top: 30px;
              margin-bottom: 7px;
              font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
            }
            .ti-mid-title, .ti-mid-number {
              color: #545454;
              animation-duration: 1s;
              span {
                font-size: 35px;
                font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
              }
            }
            .ti-mid-fix {
              font-size: 13px;
              color: #b1b1b1;
              padding-left: 15px;
              text-align: justify;
              padding-right: 20px;
            }
            .ti-fix {
              margin-top: 20px;
            }
          }
        }
        .time-bottom {
          position: absolute;
          top: 78.5%;
          left: 23%;
          color: #8d8d8d;
          font-size: 14px;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          span {
            font-size: 14px;
            color: #ffb148;
            font-family: PingFangSC-Medium, sans-serif;
          }
        }

      }
    }
  }
</style>
