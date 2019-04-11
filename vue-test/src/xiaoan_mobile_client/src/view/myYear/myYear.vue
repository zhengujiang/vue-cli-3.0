<template>
  <div class="myYear">
    <audio id="myMusic" :src="audioUrl" preload autoplay loop></audio>
    <!--<header class="my-header">{{this.$route.meta.title}}</header>-->
    <transition name="bounce">
      <div class="pop-middle" v-show="popupVisible1"></div>
    </transition>
    <transition name="bounce">
      <div class="testEndFenXiang" @click="testEndFen" v-show="shareDom">
        <div></div>
      </div>
    </transition>
    <div class="xiaoan-audio" @click="removeAudio">
      <img class="" :class="{circle: !circlePlay}" :src="$image.myYear.yinyue"/>
    </div>
    <mt-popup v-model="popupVisible" class="xa-pop" :modal="false">
      <div class="xa-pop-icon">
        <p>获取我的董办2017数据！</p>
        <p>仅支持沪深两市上市公司。</p>
      </div>
      <div class="xa-pop-footer">
        <form action="" onsubmit=" return false">
          <div>
            <input type="text" v-model="code" placeholder="输入股票代码">
          </div>
          <button @click="addCode">提 交</button>
        </form>
      </div>
    </mt-popup>
    <div class="xa-swiper">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide>
          <xiaoan-myYearOne :android="android" :myYearData="myYearData" :myHome="myHome"></xiaoan-myYearOne>
        </swiper-slide>
        <swiper-slide>
          <xiaoan-myYearTwo :android="android" :myYearData="myYearData" :myHome="myHome"
                            :active="swIndex"></xiaoan-myYearTwo>
        </swiper-slide>
        <swiper-slide>
          <xiaoan-myYearThree :android="android" :myYearData="myYearData" :myHome="myHome"
                              :active="swIndex"></xiaoan-myYearThree>
        </swiper-slide>
        <swiper-slide>
          <xiaoan-myYearFour :android="android" :myYearData="myYearData" :myHome="myHome" :data="data"
                             :active="swIndex"></xiaoan-myYearFour>
        </swiper-slide>
        <swiper-slide>
          <xiaoan-myYearFive :android="android" :gszs="gszs" :myYearData="myYearData" :myHome="myHome"
                             :active="swIndex"></xiaoan-myYearFive>
        </swiper-slide>
        <swiper-slide v-if="zbyz != 0"> <!--// "fgkfxhpw": false,// 非公开发行获批文  -->
          <xiaoan-myYearSix :android="android" :zbyz="zbyz" :myYearData="myYearData" :myHome="myHome"
                            :active="swIndex"></xiaoan-myYearSix>
        </swiper-slide>
        <swiper-slide>
          <xiaoan-myYearSeven :android="android" :zbyz="zbyz" :myYearData="myYearData" :myHome="myHome"
                              :active="swIndex"></xiaoan-myYearSeven>
        </swiper-slide>
        <swiper-slide>
          <xiaoan-myYearEight :android="android" :zbyz="zbyz" :myYearData="myYearData" :active="swIndex"
                              :myHome="myHome" @click="add" v-on:share-click="addshare"></xiaoan-myYearEight>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <xiaoan-loading v-show="loading" bg-color="rgba(0,0,0,0.5)"></xiaoan-loading>
    <xiaoan-warning v-show="warning"></xiaoan-warning>
  </div>
</template>

<script>
  import myYearOne from '@/components/myYear/myYearOne'
  import myYearTwo from '@/components/myYear/myYearTwo'
  import myYearThree from '@/components/myYear/myYearThree'
  import myYearFour from '@/components/myYear/myYearFour'
  import myYearFive from '@/components/myYear/myYearFive'
  import myYearSix from '@/components/myYear/myYearSix'
  import myYearSeven from '@/components/myYear/myYearSeven'
  import myYearEight from '@/components/myYear/myYearEight'
  import XiananLoaing from '@/components/warning/loading'
  import xiaoanWarning from '@/components/warning/error'

  export default {
    name: "my-year",
    data() {
      return {
        audioUrl: `https://oss.in-hope.cn/xiaoan/audio/Free-Converter.com-20171225012043-1843765196.mp3?${Math.random()}`,
        loading: true,
        swiperOption: {
          // autoplay: 3000,
          direction: 'vertical',
          slidesPerView: 1,
          spaceBetween: 0,
          mousewheel: true,
          longSwipesMs: 1500,
          longSwipes: false,
          onTransitionStart: (swiper) => {
            this.swIndex = swiper.activeIndex;
          }
        },
        circlePlay: false,
        warning: false,
        zbyz: 0, // 判断 资本信息显示 //
        swIndex: 0,
        gszs: 0,
        myHome: {
          name: '',
          codeName: '信公咨询',
          code: '',
          Avatar: this.$image.personal.timg,
        },
        user_Id: '',
        code: '',
        shareDom: false,
        popupVisible: false,
        popupVisible1: false,
        data: {
          zsz: [
            {name: '2016', value: '0'},
            {name: '2017', value: '0'}
          ],
          zgb: [
            {name: '2016', value: '0'},
            {name: '2017', value: '0'}
          ]
        },
        myYearData: {},
        android: false
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      }
    },
    watch: {
      'swIndex': function () {
        //  console.log('232', this.swiper.activeIndex);
      },
      'popupVisible': function () {
        setTimeout(() => {
          this.popupVisible1 = this.popupVisible;
        }, 500);
      },
      '$route': function () {
        this.code = this.$route.query.code;
        // console.log('1', this.$route.query.code);
      }
    },
    components: {
      'xiaoan-warning': xiaoanWarning,
      'xiaoan-loading': XiananLoaing,
      'xiaoan-myYearOne': myYearOne,
      'xiaoan-myYearTwo': myYearTwo,
      'xiaoan-myYearThree': myYearThree,
      'xiaoan-myYearFour': myYearFour,
      'xiaoan-myYearFive': myYearFive,
      'xiaoan-myYearSix': myYearSix,
      'xiaoan-myYearSeven': myYearSeven,
      'xiaoan-myYearEight': myYearEight,
    },
    beforeDestroy() {
      // alert(',' + 33113);
    },
    destroyed() {
      this.circlePlay = true;
      this.musicPlay(!this.circlePlay);
    },
    beforeCreate() {
    },
    created() {
      this.user_Id = this.$cookie.getCookie("userId");
      if (!this.$cookie.isLogin()) {
        this.$nextTick(() => {
          this.$storage.loginStatus(this, '我在董办2017', window.location.href, 'number');
        })
      }
      this.android = this.$const.userAgent().android;
      // this.getWxInfo();
      this.getCompanyCount();
      if (this.$route.query.code && this.$route.query.name) {
        // url有 name ,
        this.myHome.name = decodeURI(this.$route.query.name);
        // this.myHome.codeName = decodeURI(this.$route.query.name);
        this.myHome.code = decodeURI(this.$route.query.code);
        this.myHome.Avatar = decodeURI(this.$route.query.Avatar);
        this.getYearSummaryByCode(this.$route.query.code);
        console.log(2132, '有 name', '执行URL上获取信息');
      } else {
        this.userHome();
        setTimeout(() => {
          this.loading = false;
        }, 1500)
        console.log(2132, '没有 name', '执行this.userHome获取信息');
      }
    },
    mounted() {
      // console.log('', this.$array.unitWan(100000000000));
      function audioAutoPlay(id) {
        let audio = document.getElementById(id),
          play = function () {
            audio.play();
            document.removeEventListener("touchstart", play, false);
          };
        audio.play();
        document.addEventListener("WeixinJSBridgeReady", function () { // 微信
          play();
        }, false);
        document.addEventListener("touchstart", play, false);
      }

      audioAutoPlay("myMusic");
      //
      let adverttitle = '数据告诉你，2017年我在董办工作有多拼！';
      let shareLink = decodeURI(this.$api.CURRENTIP.IP + '#/myYear?code=' +
        this.myHome.code + '&name=' + this.myHome.name + '&Avatar=' + this.myHome.Avatar); // 分享链接
      let shareDesc = "见证喧闹纷繁的2017年股市，我欠自己一份图文总结。";//描述
      this.$weixin.wxshare(adverttitle, shareDesc, shareLink, this.$api.share.myYearImg, true);
      // 处理安卓机太小屏幕问题
      //  this.swiper.scrollTo(2, 1000);
      //  this.swiper.slideTo(3, 1000, false);
    },
    methods: {
      removeAudio() {
        console.log(this.circlePlay);
        this.circlePlay == true ? this.circlePlay = false : this.circlePlay = true;
        this.musicPlay(!this.circlePlay);
        console.log(this.circlePlay);
      },
      musicPlay(isPlay) {
        let media = document.getElementById('myMusic');
        if (isPlay && media.paused) {
          media.play();
        }
        if (!isPlay && !media.paused) {
          media.pause();
        }
        document.addEventListener("WeixinJSBridgeReady", function () {
          if (isPlay && media.paused) {
            media.play();
          }
          if (!isPlay && !media.paused) {
            media.pause();
          }
        }, false);
      },
      //
      userHome() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome().then((res) => {
          // this.loading = false;
          if (res.data.returnCode == 1) {
            this.myHome.name = res.data.returnObject.weixinUsername;
            this.myHome.Avatar = res.data.returnObject.weixinAvatar;
            if (res.data.returnObject.companyCode == null || res.data.returnObject.companyCode == '') {
              if (this.$route.query.code) {
                this.getYearSummaryByCode(this.$route.query.code);
              } else {
                this.popupVisible = true;
              }
            } else {
              this.popupVisible = false;
              let regExpCode = /^(((002|000|300|600|601|603|900|200)[\d]{3})|60[\d]{4})$/;
              let isCode = regExpCode.test(res.data.returnObject.companyCode);
              if (isCode) {
                // true
                console.log('213123123');
                this.getYearSummaryByCode(res.data.returnObject.companyCode);
              } else {
                console.log('wq234324234');
                // false
                this.popupVisible = true;
              }
            }
          } else if (res.data.returnCode == -1) {
            this.$nextTick(() => {
              this.$storage.loginStatus(this, '我在董办2017', window.location.href, 'number');
            })
          }

        }).catch((err) => {
          this.warning = true;
          alert(err.message);
        })
      },

      getYearSummaryByCode(code) {
        let params = {
          code: code
        }
        this.$axios.common.getYearSummaryByCode(params).then(res => {
          this.popupVisible = false
          if (res.data.returnCode == 1) {
            this.myHome.codeName = res.data.returnObject.name;
            this.myHome.code = res.data.returnObject.code;
            this.myYearData = res.data.returnObject;
            this.data.zsz[0].value = res.data.returnObject.zsz2016 // 16
            this.data.zsz[1].value = res.data.returnObject.zsz2017 // 17
            this.data.zgb[0].value = res.data.returnObject.zgb2016 // 16
            this.data.zgb[1].value = res.data.returnObject.zgb2017 // 17
            if (res.data.returnObject.zdzcczpw) {
              this.zbyz += 1;
            }
            if (res.data.returnObject.fgkfxhpw) {
              this.zbyz += 1;
            }
            if (res.data.returnObject.ipohpw) {
              this.zbyz += 1;
            }
            if (res.data.returnObject.kzhgszqhpw) {
              this.zbyz += 1;
            }
            if (res.data.returnObject.pghpw) {
              this.zbyz += 1;
            }
            if (this.myYearData.new) {
              // true
              this.data.zsz[0].name = '上市日';
            } else {
              // false
            }
            console.log('this.zbyz', this.zbyz);
            setTimeout(() => {
              this.loading = false;
            }, 1500);
            this.popupVisible = false;
            if (this.myYearData.zsz2017 == 0 || this.myYearData.zsz2017 == null) {
              this.$toast({message: '暂无该公司数据', position: 'center', duration: 1500});
              setTimeout(() => {
                this.popupVisible = true;
              }, 1600)
            }
            /**************************************************/
            let adverttitle = "数据告诉你，2017年我在董办工作有多拼！";
            let shareLink = this.$api.CURRENTIP.IP + '#/myYear?code=' +
              this.myHome.code + '&name=' + this.myHome.name + '&Avatar=' + this.myHome.Avatar; // 分享链接
            let shareDesc = "见证喧闹纷繁的2017年股市，我欠自己一份图文总结。";//描述
            this.$weixin.wxshare(adverttitle, shareDesc, shareLink, this.$api.share.myYearImg, true);
            /**************************************************/
          } else if (res.data.returnCode == -1) {
            //  this.$toast({message: '请输入合法股票信息', position: 'center', duration: 1500});
            this.$toast({message: '亲！请输入正确股票代码', position: 'center', duration: 1500});
            setTimeout(() => {
              this.popupVisible = true;
            }, 1600)
          }
        }).catch((err) => {
          this.warning = true;
          alert(err.message);
        })
      },
      testEndFen() {
        this.shareDom = false
      },
      addshare() {
        this.shareDom = true;
        console.log('addshare');
        // this.$MTAmethod.mtaClick('u9BeM4VzCNww3aTf', {'6589drua65pt7pwb': "true"})
      },
      add() {
        this.loading = true;
        this.userHome();
        this.swiper.slideTo(0, 0, false);
        // 生成我的董办2017
        console.log(23);
        this.$toast({message: '正在生成我在董办的2017', position: 'center', duration: 2000});
        this.$router.replace({path: '', query: {}});
        setTimeout(() => {
          this.loading = false;
        }, 3000);
        // 最后放出来 cai for 2017
        // this.$MTAmethod.mtaClick('u9BeM4VzCNww3aTf', {'wpr8mw5t92e9qv28': "true"})

      },
      getCompanyCount() {
        let params = {}
        this.$axios.common.getCompanyCount(params).then(res => {
          this.gszs = res.data.returnObject;
        }).catch((err) => {
        });
      },
      addCode() {
        this.loading = true;
        let regExpCode = /^(((002|000|300|600|601|603|900|200)[\d]{3})|60[\d]{4})$/;
        let isCode = regExpCode.test(this.code);
        if (isCode) {
          this.$nextTick(() => {
            this.$router.replace({query: {code: this.code}});
            this.getYearSummaryByCode(this.$route.query.code);
          });
          setTimeout(() => {
            this.loading = false;
          }, 300)
          this.popupVisible = false;
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 300)
          this.$toast({message: '亲！请输入正确股票代码', position: 'center', duration: 1500});
          this.popupVisible = true;
        }

      }
    }
  }
</script>

<style lang="scss">
  @import "../../styles/transition.css";
  .myYear {
    position: relative;
    #my-header {
      position: relative;
      height: 40px;
      width: 100%;
      background-color: #323232;
      text-align: center;
      color: white;
      box-sizing: border-box;
    }
    .xiaoan-audio {
      position: absolute;
      right: 20px;
      top: 15px;
      z-index: 1900;
      font-size: 0;
      img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.1);
      }
      .circlePlay {
        -o-animation-play-state: paused !important;
        -moz-animation-play-state: paused !important;
        -webkit-animation-play-state: paused !important;
        animation-play-state: paused !important;
      }
      .circle {
        display: inline-block;
        -webkit-animation: circle 1.2s infinite linear; /*匀速 循环*/
        animation: circle 1.2s linear infinite;
        animation-play-state: running;
      }
      @-webkit-keyframes circle {
        100% {
          transform: rotate(1turn);
        }
      }
    }
    .xa-swiper {
      height: 100%;
      width: 100%;
    }
    .testEndFenXiang {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      background: rgba(0, 0, 0, 0.8);
      z-index: 3000;
      div {
        background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/fenxiangT@3x.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 276.097px;
        height: 270px;
        margin: 35px auto 0 auto;
        margin-right: 25px;
      }
    }
    .pop-middle {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2;
    }
    .xa-pop {
      width: 240px;
      height: 250px;
      background: white;
      border-radius: 12px;
      .xa-pop-icon {
        background: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/1-18@3x.png");
        width: 100%;
        height: 85px;
        background-repeat: no-repeat;
        background-size: cover;
        -moz-background-size: cover;
        overflow: hidden;
        border-top-right-radius: 12px;
        border-top-left-radius: 12px;
        padding: 25px 0 0 0;
        box-sizing: border-box;
        text-align: center;
        p {
          font-size: 15px;
          color: white;
        }
      }
      .xa-pop-footer {
        box-sizing: border-box;
        padding: 30px 33px 0 33px;
        form {
          font-size: 0;
          width: 100%;
          height: 100%;
          text-align: center;
          div {
            input {
              width: 100%;
              height: 40px;
              background-color: #f0f1f5;
              border-radius: 2px;
              border: 1px solid #e3e3e3;
              font-size: 15px;
              // line-height: 15px;
              box-sizing: border-box;
              padding: 0 10px;
              outline: none;
              color: #323232;
              -webkit-transition: border-color 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: border-color 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
            input::placeholder {
              color: #aeaeae;
            }
            input:focus {
              border-color: #ffb148;
              -webkit-transition: border-color 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: border-color 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
          }
          button {
            margin-top: 30px;
            width: 95px;
            height: 30px;
            vertical-align: middle;
            text-align: center;
            border: none;
            background-color: #e71647;
            color: white;
            font-size: 15px;
            font-family: PingFangSC-Medium sans-serif;
            -moz-box-shadow: 2px 2px 0px rgba(231, 22, 71, 0.2);
            -webkit-box-shadow: 2px 2px 0px rgba(231, 22, 71, 0.2);
            box-shadow: 2px 2px 0px rgba(231, 22, 71, 0.2);
            //  -webkit-transition: background-color 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
            //  transition: background-color 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
            -webkit-transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
          button:active {
            background-color: rgba(0, 0, 0, 0.5);
            -webkit-transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        }
      }
    }
  }
</style>

<style scoped>
  .myYear {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .myYear .swiper-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-size: 0;
  }
  .swiper-pagination-bullet-active {
    background-color: #f0f1f5;
  }
</style>
