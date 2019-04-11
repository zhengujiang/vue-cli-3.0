<template>
  <div class="my-year-eight">
    <div v-show="activeIndex == 7" class="my-scale">
      <header class="animated" :class="{fadeInDown : activeIndex == 7}">
        <div class="header-str">
                 <span class="name-seen">
                <span class="fixname animated" :class="{fadeIn : activeIndex == 7}">
                    <i>
                       <img :src="myHome.Avatar" alt="">
                    </i>
                </span>
                <span class="fix animated" :class="{fadeIn : activeIndex == 7}">
                    <span class="fix-title">{{myHome.name}}</span>
                    <span class="fix-doc"><i
                      class="icon iconfont icon-huoyuedu"></i>董办活跃指数：{{myYearData.activeScore}}</span>
                </span>
            </span>
        </div>
      </header>
      <div class="my-year-middle">
        <p>
          <button class="animated" :class="{fadeIn : activeIndex == 7}">
            <img class="img" :src="$image.myYear.y8_3" alt="">
          </button>
        </p>
        <p>
          <button class="textTool">
            <img class="text" :src="$image.myYear.y8_4" alt="">
          </button>
        </p>
        <p v-show="this.$route.query.name">
          <button class="new animated" :class="{fadeIn : activeIndex == 7}" @click="earth()">
            生成我在董办的2017
          </button>
        </p>
        <p v-show="this.$route.query.name">
          <button class="share animated" :class="{fadeIn : activeIndex == 7}" @click="hintButton()">
            分享给朋友<i></i></button>
        </p>
        <p v-show="!this.$route.query.name">
          <button class="new animated" :class="{fadeIn : activeIndex == 7}" @click="hintButton()">
            分享给朋友<i></i></button>
        </p>
      </div>
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
        required: false,
        default: {}
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
      // this.activeIndex = 7;
    },
    methods: {
      //this.$emit('event'); $emit 将事件发射出去  子组件dom中@event=“gohome” gohome为methods里面的方法名
      hintButton() {
        this.$emit('share-click');
      },
      earth() {
        this.$emit('click');
      }
    }
  }
</script>

<style lang="scss">
  .my-year-eight {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/8@3x.jpg");
    // background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
    * {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    header {
      .header-str {
        display: inline-block;
        padding: 5px 10px;
        border: 1.8px solid rgba(255, 255, 255, 0.5);
        border-radius: 60px;
        margin-top: 25px;
        margin-left: 20px;
        background-color: rgba(255, 177, 72, 0.1);
        box-shadow: 2px 2px 1px rgba(255, 177, 72, 0.15);
        .name-seen {
          display: table;
          .fixname {
            display: table-cell;
            vertical-align: middle;
            i {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: rgba(255, 255, 255, 0.3);
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
          }
          .fix {
            display: table-cell;
            vertical-align: middle;
            i {
              margin-right: 3px;
              color: white;
            }
            .fix-title {
              height: 100%;
              display: block;
              font-size: 15px;
              padding-left: 10px;
              color: rgba(255, 255, 255, 1);
              width: 138px;
              word-break: keep-all; /* 不换行 */
              white-space: nowrap; /* 不换行 */
              overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
              text-overflow: ellipsis;
            }
            .fix-doc {
              font-size: 14px;
              padding-left: 10px;
              color: rgba(255, 255, 255, 1);
              vertical-align: middle;
            }
          }
        }
      }
    }
    .my-year-middle {
      font-size: 20px;
      text-align: center;
      button {
        margin-top: 21%;
        box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2);
        font-size: 0;
        .img {
          width: 145px;
          box-sizing: border-box;
        }

      }
      .textTool {
        margin: 0;
        padding: 0;
        background-color: transparent;
        border: 0;
        margin-top: 15px;
        box-shadow: none;
        .text {
          width: 175px;
          box-sizing: border-box;
          box-shadow: none;
        }
      }
      p {
        text-align: center;
        .new {
          font-family: PingFangSC-Medium, sans-serif;
          margin-top: 30px;
          font-size: 16px;
          width: 185px;
          height: 45px;
          background-color: #ffb431;
          color: white;
          border-color: rgba(0, 0, 0, 0);
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
          -webkit-transition: background-color 50ms cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 50ms cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .share {
          font-family: PingFangSC-Medium, sans-serif;
          margin-top: 17px;
          font-size: 16px;
          width: 185px;
          height: 45px;
          background-color: #fd5543;
          color: white;
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
          border-color: rgba(0, 0, 0, 0);
          -webkit-transition: background-color 50ms cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 50ms cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .share:active {
          background-color: rgba(0, 0, 0, 0.1);
          -webkit-transition: background-color 50ms cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 50ms cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .new:active {
          background-color: rgba(255, 180, 49, 0.9);
        }
      }

    }
  }
</style>
