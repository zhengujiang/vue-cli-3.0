<template>
  <transition name="bounce">
    <div id="testLoading">
      <div class="testLoad-icon" v-show="this.status == 0 || this.status == 3 || this.status == 2"></div>
      <div class="testLoad-iconClose" v-show="this.status != 0 && this.status != 3 && this.status != 2"></div>
      <div class="testLoad-text">{{loadText}}</div>
      <div class="testLoad-date">考试总用时：
        <span class="testLoad-time" v-show="timekeeping.hour">{{timekeeping.hour}}</span>
        <span v-show="timekeeping.hour">时</span>
        <span class="testLoad-time" v-show="timekeeping.minute">{{timekeeping.minute}}</span>
        <span v-show="timekeeping.minute">分</span>
        <span class="testLoad-time" v-show="timekeeping.second">{{timekeeping.second}}</span>
        <span v-show="timekeeping.second">秒</span>
      </div>
      <p class="testLoad-Prompt" v-show="this.status == 0">{{testingPrompt[1]}}</p>
      <p class="testLoad-Prompt" v-show="this.status == 1 && timeDate >= afterTime">{{testingPrompt[0]}}</p>
      <div class="testLoad-submit" @click="testLoadSub()">
        <button class="leftIcon">查看结果</button>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'testLoading',
    data() {
      return {
        loadText: '恭喜您，已完成测试！',
        timeDate: "",
        timekeeping: {},
        testingIcon: true,
        testingPrompt: [
          '挂牌公司董事会秘书资格考试时长限制为120分钟！',
          '挂牌公司董事会秘书资格考试题数为200题，时长限制为120分钟！'
        ],
        testLoadPrompt: false,
        afterTime: 7200,
        market: false,
        TestInfo: '',
        marketAll: '',
        status: '',
        payMode: ''
      }
    },
    updated() {

    },
    created() {
      this.timeDate = window.sessionStorage.getItem("timeDateTime");
      console.log('=======', this.timeDate);
      if (this.$route.query.market != undefined || this.$route.query.market != null) {
        this.market = true;// sanban
      } else {
        this.market = false;
      }
      if (this.$route.query.marketAll != undefined || this.$route.query.marketAll != null) {
        this.marketAll = this.$route.query.marketAll;
      } else {
        this.marketAll = '25';
      }
      if (this.$route.query.payMode != undefined || this.$route.query.payMode != null) {
        this.payMode = this.$route.query.payMode;
      } else {
        this.payMode = '2';
      }
      this.timekeeping = this.formatSeconds(this.timeDate);
    },
    mounted() {
      /**/
      if (this.payMode == 1 && this.marketAll != '200' && this.market == true) {
        // 付费 && 不是200 题 三板的
        this.status = 0;
      } else if (this.payMode == 1 && this.marketAll == '200' && this.market == true) {
        // 付费 && 是200 题 三板的
        this.status = 1;
      } else if (this.payMode == 0 && this.market == true) {
        // 免费 三板的
        this.status = 2;
      } else if (this.market == false) {
        // 不是三板的
        this.status = 3;
      }
    },
    methods: {
      testLoadSub() {
        if (this.$route.query.market != undefined || this.$route.query.market != null) {
          // 新三板
          this.$router.replace({path: '/newOTCBBTestingEnd'});
        } else {
          // 沪深
          this.$router.replace({path: '/testingEnd'});
        }
      },
      //处理计时 （秒）
      formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60);
          theTime = parseInt(theTime % 60);
          if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
          }
        }
        let result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
          result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
          result = "" + parseInt(theTime2) + "时" + result;
        }
        // return result;
        return ({
          hour: parseInt(theTime2), minute: parseInt(theTime1), second: parseInt(theTime),
        })
      },
    },
    //离开当前页面后
    destroyed: function () {
      window.sessionStorage.removeItem("timeDateTime");
    }
  }
</script>

<style scoped>
  #testLoading {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-size: 100% 100%;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #testLoading .testLoad-icon {
    height: 65px;
    width: 65px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/done@3x.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 105px auto 0 auto;
  }
  #testLoading .testLoad-iconClose {
    height: 65px;
    width: 65px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/testingLoading@3x.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 105px auto 0 auto;
  }
  #testLoading .testLoad-text {
    font-size: 24px;
    color: white;
    padding-top: 62.5px;
    text-align: center;

  }
  #testLoading .testLoad-date {
    font-size: 15px;
    color: white;
    display: table;
    margin: 20px auto 0 auto;
  }
  #testLoading .testLoad-Prompt {
    color: #fc4949;
    box-sizing: border-box;
    padding: 20px 23% 0 23%;
    text-align: center;
    font-size: 13px;
    line-height: 18px;
  }
  #testLoading .testLoad-time {
    font-size: 25px;
    color: #f0cf8d;
    padding-right: 2px;
  }
  #testLoading .leftIcon {
    width: 195px;
    height: 40px;
    border: none;
    background-color: #f0cf8d;
    color: white;
    font-size: 19px;
    text-align: center;
    line-height: 41px;
    padding: 0;
    border-radius: 30px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #testLoading .leftIcon:active {
    background-color: #e4c077;
  }
  #testLoading .testLoad-submit {
    position: absolute;
    bottom: 77.5px;
    left: 50%;
    margin-left: -97.5px;
  }
  @media (min-device-width: 375px)and (max-device-width: 667px)and (-webkit-min-device-pixel-ratio: 2) {
    /*iphone6*/
    #testLoading {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
      background-size: 100% 100%;
    }
    #testLoading .testLoad-icon {
      height: 65px;
      width: 65px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/done@3x.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: 105px auto 0 auto;
    }
    #testLoading .testLoad-text {

    }
    #testLoading .testLoad-date {
      font-size: 15px;
      color: white;
      display: table;
      margin: 20px auto 0 auto;
    }
    #testLoading .testLoad-time {
      font-size: 25px;
      color: #f0cf8d;
      padding-right: 2px;
    }
  }
  @media (min-device-width: 414px)and (max-device-width: 736px)and (-webkit-min-device-pixel-ratio: 3) {
    /*iphone6 plus*/
  }
</style>
