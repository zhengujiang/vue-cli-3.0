<template>
  <div class="my-year-seven">
    <div v-show="activeIndex == 6" class="my-scale">
      <header class="animated" :class="{fadeInDown : activeIndex == 6}">
        <div class="header-str">
                 <span class="name-seen animated" :class="{fadeIn : activeIndex == 6}">
                <span class="fix animated" :class="{fadeIn : activeIndex == 6}">
                    <i>
                       <img :src="myHome.Avatar" alt="">
                    </i>
                </span>
                <span class="fix animated" :class="{fadeIn : activeIndex == 6}">
                    <span class="fix-title animated" :class="{fadeIn : activeIndex == 6}">{{myHome.name}}</span>
                    <span class="fix-doc animated" :class="{fadeIn : activeIndex == 6}">{{myHome.codeName}}【{{myHome.code}}】</span>
                </span>
            </span>
        </div>
      </header>
      <div class="m-y-four-middle">
        <div class="two-middle-content">
          <img :src="$image.myYear.y7_2" alt="" class="animated"
               :class="{fadeIn : activeIndex == 6}"/>
          <div class="my-seven-middle animated" :class="{fadeIn : activeIndex == 6}">
            <p class="seven-mai animated" :class="{fadeIn : activeIndex == 6}">2017年，公司分派现金红利合计</p>
            <p class="seven-num animated" :class="{zoomIn : activeIndex == 6}">
              <span>{{$array.unitWan(myYearData.fhze)[0]}}</span>{{$array.unitWan(myYearData.fhze)[1]}}元
            </p>
            <p class="seven-foot animated" :class="{fadeIn : activeIndex == 6}" v-if="myYearData.fhze == 0">
              呀！还要继续努力哟！
            </p>
            <p class="seven-foot animated" :class="{fadeIn : activeIndex == 6}" v-else>
              超过<span>{{myYearData.fhbl}}%</span>的上市公司
            </p>
          </div>
        </div>
      </div>
      <p class="icons-jiantou animated" :class="{fadeInUp : activeIndex == 6}">
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
      zbyz: {
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
          if (this.zbyz == 0) {
            this.activeIndex = this.active + 1;
            console.log('23232312321312123', this.zbyz, this.activeIndex);
          } else {
            this.activeIndex = this.active;
          }
        }, 500)
      }
    },
    mounted() {
      if (this.android) {
        // 是安卓机
        $('.my-year-seven .header-str').css({marginTop: '10px'});
        $('.my-year-seven .m-y-four-middle').css({marginTop: '3%', padding: '0 8%'});
      }
    }
  }
</script>

<style lang="scss">
  .my-year-seven {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/2@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
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
      .header-str {
        display: inline-block;
        padding: 5px 10px;
        border: 1.8px solid rgba(255, 255, 255, 0.5);
        border-radius: 60px;
        margin-top: 25px;
        margin-left: 20px;
        background-color: rgba(190, 172, 132, 0.2);
        box-shadow: 2px 2px 1px rgba(190, 172, 132, 0.15);
        .name-seen {
          display: table;
          .fix {
            display: table-cell;
            vertical-align: middle;
            i {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: #bfac82;
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
              color: #9f8d66;
              width: 138px;
              word-break: keep-all; /* 不换行 */
              white-space: nowrap; /* 不换行 */
              overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
              text-overflow: ellipsis;
            }
            .fix-doc {
              font-size: 14px;
              padding-left: 10px;
              color: #9f8d66;
            }
          }
        }
      }
    }
    .m-y-four-middle {
      width: 100%;
      padding: 6% 6% 0 6%;
      box-sizing: border-box;
      font-family: PingFangSC-Medium, sans-serif;
      > div {
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          box-sizing: border-box;
        }
        .my-seven-middle {
          position: absolute;
          left: 0;
          top: 34%;
          width: 100%;
          text-align: center;
          .seven-mai {
            font-size: 14px;
            color: #545454;
          }
          .seven-num {
            margin-top: 15px;
            font-size: 14px;
            color: #545454;
            span {
              font-size: 50px;
              color: #ffb148;
            }
          }
          .seven-foot {
            margin-top: 15px;
            font-size: 14px;
            color: #b1b1b1;
            span {
              color: #ffb148;
            }
          }
        }
      }
    }
  }
</style>
