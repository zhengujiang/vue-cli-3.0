<template>
  <div class="my-year-one">
    <div class="my-scale">
      <header class="">
        <div class="my-year-header">
          <ul class="">
            <li><i class="icon iconfont icon-huoyuedu"></i>&ensp;</li>
            <li><span>董办活跃指数: </span></li>
            <li>&ensp;<span>{{myYearData.activeScore}}</span></li>
          </ul>
        </div>
      </header>
      <p class="m-y-o-ba animated fadeInDownBig">
        <img :src="$image.myYear.y1_1"/>
      </p>
      <p class="my-year-name animated fadeInDownBig">
            <span class="name-seen">
                <span class="fix">
                    <i>
                       <img :src="myHome.Avatar" alt="">
                    </i>
                </span>
                <span class="fix">
                    <span class="fix-title">{{myHome.name}}</span>
                    <span class="fix-doc">{{myHome.codeName}}<span v-show="myHome.code">【{{myHome.code}}】</span></span>
                </span>
            </span>
      </p>
      <p class="m-y-o-bottom animated bounceInUp">
        <img class="shake shake-vertical shake-constant" :src="$image.myYear.y1_11" alt="">
      </p>
      <p class="icons-jiantou animated fadeInUp">
        <img class="arrow" :src="$image.myYear.y12_4" alt="">
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
        popupVisible: true,
      }
    },
    props: {
      myHome: {
        type: Object,
        required: false,
        default: {}
      },
      myYearData: {
        type: null,
        required: false,
        default: {}
      },
      android: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    mounted() {
      if (this.android) {
        $('.my-year-one .my-year-header').css({marginTop: '10px'});
        $('.my-year-one .m-y-o-bottom').css({paddingTop: '3%'});
        $('.m-y-o-ba').css({padding: '2% 8% 0 10%'})
      }
    }
  }
</script>

<style lang="scss">
  .my-year-one {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/1@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
    position: relative;
    * {
      box-sizing: border-box;
    }
    .icons-jiantou {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      img {
        animation-duration: 10s;
        width: 25px;
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
      .my-year-header {
        margin-top: 18px;
        display: inline-block;
        background: rgba(240, 102, 32, 0.9);
        border: 1.4px solid #ffb148;
        border-left-width: 0;
        -webkit-border-top-right-radius: 15px;
        border-top-right-radius: 15px;
        -webkit-border-bottom-right-radius: 15px;
        border-bottom-right-radius: 15px;
        ul {

          height: 30px;
          padding: 0 0 0 20px;
          box-sizing: border-box;
          border-left-width: 0;
          -webkit-border-top-right-radius: 15px;
          border-top-right-radius: 15px;
          -webkit-border-bottom-right-radius: 15px;
          border-bottom-right-radius: 15px;
          display: table;
          font-size: 0;
          li {
            display: table-cell;
            font-size: 15px;
            color: white;
            vertical-align: middle;
            i {
              font-size: 18px;
              color: white;
              vertical-align: middle;
            }
          }
          li:last-child {
            padding-right: 10px;
          }
        }
      }
    }
    .m-y-o-ba {
      width: 100%;
      padding: 10% 8% 0 10%;
      box-sizing: border-box;
      img {
        width: 100%;
      }
    }
    .my-year-name {
      width: 100%;
      box-sizing: border-box;
      display: table;
      padding: 0 0 0 30%;
      .name-seen {
        display: table;
        .fix {
          display: table-cell;
          vertical-align: middle;
          i {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 1.8px solid #f29a76;
            display: inline-block;
            box-shadow: 2px 2px 2px rgba(167, 22, 31, 0.48);
            img {
              height: 100%;
              width: 100%;
              border-radius: 50%;
              box-sizing: border-box;
            }
          }
          .fix-title {
            height: 100%;
            display: block;
            font-size: 15px;
            padding-left: 10px;
            color: white;
            width: 138px;
            word-break: keep-all; /* 不换行 */
            white-space: nowrap; /* 不换行 */
            overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
            text-overflow: ellipsis;
          }
          .fix-doc {
            font-size: 12px;
            padding-left: 10px;
            color: white;
          }
        }
      }
    }
    .m-y-o-bottom {
      width: 100%;
      padding: 6% 21% 0 21%;
      text-align: center;
      img {
        width: 100%;
        padding: 0 19% 0 19%;
        box-sizing: border-box;
        animation-duration: 15s;
      }
    }
  }
</style>
