<template>
  <div class="my-year-five">
    <div v-show="activeIndex == 4" class="my-scale">
      <header class="animated" :class="{fadeInDown : activeIndex == 4}">
        <div class="header-str animated" :class="{fadeIn : activeIndex == 4}">
                <span class="name-seen">
                    <span class="fix">
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
      <div class="m-y-four-middle">
        <div class="two-middle-content">
          <img :src="$image.myYear.y5_2" alt="" class="animated"
               :class="{fadeIn : activeIndex == 4}">
          <div class="five-middle animated" :class="{fadeIn : activeIndex == 4}">
            <div class="five-cont-title animated" :class="{zoomIn:activeIndex == 4}">
              <p>排名</p>
              <p><span>{{myYearData.qjcjeIndex}}</span>位</p>
            </div>
            <img v-show="isImg" class="animated" :class="{zoomIn:activeIndex == 4}"
                 :src="$image.myYear.y5_80" alt="">
            <img v-show="!isImg" class="animated" :class="{zoomIn:activeIndex == 4}"
                 :src="$image.myYear.y5_20" alt="">
            <div class="five-text">
              <p class="five-sm">在{{gszs}}家上市公司排名第<span>{{myYearData.qjcjeIndex}}</span>名</p>
              <p class="five-txt">2017年累计成交金额为：</p>
              <p class="five-number animated" :class="{zoomIn:activeIndex == 4}"><span>{{$array.unitWan(myYearData.qjcje)[0]}}</span>&ensp;
                {{$array.unitWan(myYearData.qjcje)[1]}}元
              </p>
            </div>
          </div>
        </div>
      </div>
      <p class="icons-jiantou animated" :class="{fadeInUp : activeIndex == 4}">
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
        isImg: true,
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
      gszs: {
        type: Number,
        required: false,
        default: 0
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
          console.log(',,', this.gszs, this.gszs * 0.2);
          if (this.myYearData.qjcjeIndex >= (this.gszs * 0.2)) {
            this.isImg = true;
          } else {
            this.isImg = false;
          }
        }, 500)
      }
    },
    mounted() {
      if (this.android) {
        // 是安卓机
        $('.my-year-five .header-str').css({marginTop: '10px'});
        $('.my-year-five .m-y-four-middle').css({marginTop: '3%', padding: '0 13%'});
        $('.my-year-five .bar-echart').css({paddingTop: '0'});
        // $('.my-year-two .m-y-o-ba').css({padding: '2% 6% 0 8%'})
      }
      // if (this.myYearData.zszIndex >= (3460 * 0.2)) {
      //     this.isImg = true;
      // } else {
      //     this.isImg = false;
      // }
      // this.activeIndex = 4;
    }
  }
</script>

<style lang="scss">
  .my-year-five {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/2@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
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
        border: 1.8px solid rgba(255, 255, 255, 0.5);
        border-radius: 60px;
        margin-top: 25px;
        margin-left: 20px;
        background-color: rgba(252, 151, 131, 0.1);
        box-shadow: 2px 2px 1px rgba(252, 151, 131, 0.15);
        .name-seen {
          display: table;
          .fix {
            display: table-cell;
            vertical-align: middle;
            i {
              font-size: 0;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: rgba(252, 151, 131, 1);
              display: inline-block;
              box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
              box-sizing: border-box;
              text-align: center;
              vertical-align: middle;
              img {
                font-size: 0;
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
              color: rgba(252, 151, 131, 1);
              width: 138px;
              word-break: keep-all; /* 不换行 */
              white-space: nowrap; /* 不换行 */
              overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
              text-overflow: ellipsis;
            }
            .fix-doc {
              font-size: 14px;
              padding-left: 10px;
              color: rgba(252, 151, 131, 1);
            }
          }
        }
      }
    }
    .m-y-four-middle {
      width: 100%;
      padding: 6% 11% 0 11%;
      box-sizing: border-box;
      > div {
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          box-sizing: border-box;
        }

        .five-middle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          font-size: 15px;
          box-sizing: border-box;
          padding: 0 20px 0 20px;
          line-height: 1;
          text-align: center;
          .five-cont-title {
            width: 100%;
            font-size: 15px;
            color: white;
            position: absolute;
            top: 47%;
            left: 0;
            z-index: 1000;
            text-align: center;
            box-sizing: border-box;
            p {
              margin-bottom: 5px;
              span {
                font-size: 30px;
              }
            }
          }
          img {
            width: 200px;
            margin-top: 32%;
            font-size: 0;
          }
          .five-text {
            text-align: left;
            margin: 0;
            padding: 0;
            .five-sm {
              font-size: 13px;
              color: #b1b1b1;
              text-align: center;
              span {
                color: #ffb148;
              }
            }
            .five-txt {
              font-size: 14px;
              color: #545454;
              margin-top: 30px;
              text-align: left;
              padding: 0 0 0 5px;
              font-family: PingFangSC-Medium, sans-serif;
            }
            .five-number {
              font-size: 14px;
              color: #545454;
              margin-top: 20px;
              text-align: center;
              font-family: PingFangSC-Medium, sans-serif;
              span {
                font-size: 30px;
                color: #ffb148;
              }
            }
          }
        }
      }
    }
  }
</style>
