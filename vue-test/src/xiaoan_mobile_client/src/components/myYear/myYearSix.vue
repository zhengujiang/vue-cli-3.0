<template>
  <div class="my-year-six">
    <div v-show="activeIndex == 5" class="my-scale">
      <header class="animated" :class="{fadeInDown : activeIndex == 5}">
        <div class="header-str">
                 <span class="name-seen animated" :class="{fadeIn : activeIndex == 5}">
                <span class="fix animated" :class="{fadeIn : activeIndex == 5}">
                    <i>
                       <img :src="myHome.Avatar" alt="">
                    </i>
                </span>
                <span class="fix animated" :class="{fadeIn : activeIndex == 5}">
                    <span class="fix-title animated" :class="{fadeIn : activeIndex == 5}">{{myHome.name}}</span>
                    <span class="fix-doc animated" :class="{fadeIn : activeIndex == 5}">{{myHome.codeName}}【{{myHome.code}}】</span>
                </span>
            </span>
        </div>
      </header>
      <div class="m-y-four-middle" v-show="!middle">
        <div class="two-middle-content">
          <img :src="$image.myYear.y6_2" alt="" class="animated"
               :class="{fadeIn : activeIndex == 5}">
          <div class="six-middle animated" :class="{fadeIn : activeIndex == 5}">
            <div class="six-wenzi" v-if="myYearData.zdzcczpw">
              <p class="date animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.zdzcczpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">重大资产重组</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.fgkfxhpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.fgkfxhpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">非公开发行</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.ipohpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.ipohpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">首次公开发行</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.kzhgszqhpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.kzhgszqhpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">可转换公司债</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.pghpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.pghpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">配股</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
          </div>
        </div>
      </div>
      <div class="m-y-four-middle2" v-show="middle">
        <div class="">
          <img :src="$image.myYear.y6_2_2" alt="" class="animated"
               :class="{fadeIn : activeIndex == 5}">
          <div class="six-middle animated" :class="{fadeIn : activeIndex == 5}">
            <div class="six-wenzi" v-if="myYearData.zdzcczpw">
              <p class="date animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.zdzcczpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">重大资产重组</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.fgkfxhpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.fgkfxhpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">非公开发行</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.ipohpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.ipohpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">IPO</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.kzhgszqhpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.kzhgszqhpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">可转换公司债</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
            <div class="six-wenzi" v-if="myYearData.pghpw">
              <p class="date data-tow animated" :class="{fadeIn : activeIndex == 5}">
                {{$const.formatText(myYearData.pghpwDate)}}
              </p>
              <p class="lineHeight animated" :class="{zoomIn : activeIndex == 5}">配股</p>
              <p class="epithet animated" :class="{fadeIn : activeIndex == 5}">获得证监会发行审核委员会审核通过。</p>
            </div>
          </div>
        </div>
      </div>
      <p class="icons-jiantou animated" :class="{fadeInUp : activeIndex == 5}">
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
        middle: true,
        activeIndex: '',
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
          this.activeIndex = this.active;
        }, 500);
        if (this.zbyz > 1) {
          this.middle = true;
        } else {
          this.middle = false;
        }
      }
    },
    mounted() {
      if (this.android) {
        // 是安卓机
        $('.my-year-six .header-str').css({marginTop: '10px'});
        $('.my-year-six .m-y-four-middle').css({marginTop: '3%', padding: '0 7%'});
        $('.my-year-six .m-y-four-middle2').css({marginTop: '3%', padding: '0 8%'});
        // $('.my-year-five .bar-echart').css({paddingTop: '0'});
        // $('.my-year-two .m-y-o-ba').css({padding: '2% 6% 0 8%'})
      }
    }
  }
</script>

<style lang="scss">
  .my-year-six {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/2@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
    * {
      font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
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
        background-color: rgba(190, 173, 132, 0.15);
        box-shadow: 2px 2px 1px rgba(190, 173, 132, 0.15);
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
              font-size: 0;
              text-align: center;
              vertical-align: middle;
              img {
                font-size: 0;
                border-radius: 50%;
                padding: 1.8px;
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
              color: rgba(190, 172, 132, 1);
              width: 138px;
              word-break: keep-all; /* 不换行 */
              white-space: nowrap; /* 不换行 */
              overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
              text-overflow: ellipsis;
            }
            .fix-doc {
              font-size: 14px;
              padding-left: 10px;
              color: rgba(190, 172, 132, 1);
            }
          }
        }
      }
    }
    .m-y-four-middle {
      width: 100%;
      padding: 6% 4% 0 6%;
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
        .six-middle {
          width: 100%;
          position: absolute;
          top: 38%;
          font-size: 15px;
          box-sizing: border-box;
          padding: 1% 14% 0 25%;
          .six-wenzi {
            .date {
              font-size: 14px;
              color: #545454;
            }

            .lineHeight {
              font-size: 22.5px;
              color: #ffb148;
              margin-top: 15px;
            }
            .epithet {
              margin-top: 15px;
              font-size: 14px;
              color: #545454;
              box-sizing: border-box;
              padding-right: 30px;
            }
          }
        }
      }
    }
    .m-y-four-middle2 {
      width: 100%;
      padding: 6% 4% 0 6%;
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
        .six-middle {
          width: 100%;
          position: absolute;
          top: 29%;
          font-size: 15px;
          box-sizing: border-box;
          padding: 0 14% 0 24%;
          .six-wenzi {
            .date {
              font-size: 14px;
              color: #545454;
            }
            .data-tow {
              margin-top: 20px;
            }
            .lineHeight {
              font-size: 22.5px;
              color: #ffb148;
              margin-top: 5px;
            }
            .epithet {
              margin-top: 5px;
              font-size: 14px;
              color: #545454;
              box-sizing: border-box;
              padding-right: 30px;
            }
          }
        }
      }
    }
  }
</style>
