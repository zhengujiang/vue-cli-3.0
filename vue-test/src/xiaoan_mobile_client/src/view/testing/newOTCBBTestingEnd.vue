<template>
  <transition name="bounce">
    <div id="testingEnd" class="newOTBCCTestingEnd">
      <div class="testingEnd-title">
        <div class="testingEnd-title-left">
          <div class="testingEnd-title-img"><img v-lazy="userConsumer.weixinAvatar" alt=""></div>
          <div class="testingEnd-title-name">
            <div class="testingEnd-title-medal"><span>{{username}}</span></div>
            <!--//付费-->
            <div class="testingEnd-title-type">
              {{userConsumer.type}}<span><span
              v-show="payMode == 1">{{"(剩余"+userConsumer.date+"天)"}}</span></span>
            </div>
          </div>
        </div>
        <span class="rightBox"></span>
        <div class="testingEnd-title-right">
          <div class="testingEnd-title-charm">
            <div>魅力值</div>
            <div class="testingEnd-title-charm-icon">
            <span class="testingEnd-title-charm-star">
                <img v-lazy="str" alt="" v-if="charms > 5">
                <img v-lazy="str" alt="" v-else-if="charms == 5">
                <img v-lazy="str05" alt="" v-else-if="charms < 5">
            </span>
              <span class="testingEnd-title-charm-star">
                  <img v-lazy="str05" alt="" v-if="charms > 5 && charms < 10"/>
                  <img v-lazy="str1" alt="" v-else-if=" charms < 10"/>
                  <img v-lazy="str" alt="" v-else-if="charms == 10"/>
              </span>
              <span class="testingEnd-title-charm-star">
                <img v-lazy="str05" alt="" v-if="charms > 10 && charms <15"/>
                <img v-lazy="str1" alt="" v-else-if="charms < 15"/>
                <img v-lazy="str" alt="" v-else-if="charms == 15"/>
            </span>
              <span class="testingEnd-title-charm-star">
                <img v-lazy="str05" alt="" v-if="charms > 15 && charms < 20"/>
                <img v-lazy="str1" alt="" v-else-if="charms < 20"/>
                <img v-lazy="str" alt="" v-else-if="charms == 20"/>
            </span>
              <span class="testingEnd-title-charm-star">
                  <img v-lazy="str05" alt="" v-if="charms > 20 && charms < 25"/>
                  <img v-lazy="str1" alt="" v-else-if="charms < 25"/>
                  <img v-lazy="str" alt="" v-else-if="charms == 25"/>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div id="testingEnd-hidden">
        <div id="testingEnd-scroll">
          <!--图表-->
          <mt-swipe :auto="0" :show-indicators="false">
            <mt-swipe-item class="slide1">
              <div class="testingEnd-EChart-radar-show">
                <div class="testingEnd-EChart-radar-link">
                  <div class="testingEnd-EChart-radar-topRight">
                    <span class="testingEnd-EChart-radar-topRightIcon"></span>&ensp;<span>超过<span
                    class="fontFm">{{testPopupJies}}</span>%的用户</span>
                  </div>
                  <div class="testingEnd-EChart-radar-topLeft">
                    <span class="testingEnd-EChart-radar-topLeftIcon"></span>
                    &ensp;<span>用时<span
                    class="fontFm">{{useTime.hour+":"}}{{useTime.minute+":"}}{{useTime.second}}</span></span>
                  </div>

                  <button class="testingEnd-EChart-radar-bottomRight" v-show="contentDetailsTop"
                          @click="contentDetailsBtn()">
                    <span class="testingEnd-EChart-radar-bottomRightIcon">展开成绩单&ensp;</span>
                    <i class="icon iconfont icon-xiangxiajiantou"></i>
                  </button>
                  <!---->
                  <div class="testingEnd-EChart-radar-middleA">
                    <span v-if="total<60">{{epithet[0]}}</span>
                    <span v-else-if="60 <= total && 80 > total">{{epithet[1]}}</span>
                    <span v-else>{{epithet[2]}}</span>
                  </div>
                  <div class="testingEnd-EChart-radar-middleB">
                    <span>{{total}}<span class="radar-middleBfen">分</span></span>
                  </div>
                  <div class="testingEnd-EChart-radar-middleC">
                    <span>{{designation}}</span>
                  </div>
                </div>
                <div class="testingEnd-EChart-radar" id="testingEnd-EChart-radar"></div>
              </div>
            </mt-swipe-item>
          </mt-swipe>
          <div class="testingEnd-content-details" v-show="contentDetails">
            <button class="testingEnd-content-detailsTop">
              <span class="to-icon"><i class="testingEnd-content-detailsTopICon"></i></span>
              <span v-if="total<= 60">稳住，新三板董秘我们能赢！<span class="Redcolor">再战一次！</span></span>
              <span v-else-if="total < 80 && total > 60">很好，新三板春天的<span
                class="Redcolor">中流砥柱！</span></span>
              <span v-else>你的成绩碾压学渣，新三板<span class="Redcolor">学霸！</span></span>
            </button>
            <div style="border-top: 0.5px solid rgba(255,255,255,0.2)"></div>
            <div class="testingEnd-content-detailsLine">
              <div class="testingEnd-content-line" v-for="list in selectedReport.moduleList">
                <label class="detailsLine-txt">{{list.name}}&ensp;</label>
                <div class="detailsLine-line">
                  <div class="testingList-trends">
                    <div class="testingList-item" :style="{width:coll(list.rightLv)}"></div>
                  </div>
                </div>
                <span class="detailsLine-shu">{{list.rightCount}}/{{list.total}}</span>
              </div>
            </div>
            <button class="testingEnd-content-detailsTop">
              <span class="to-icon"><i class="testingEnd-content-detailsTopICon"></i></span>
              <span><span class="Redcolor">{{moduleList}}<b class="at">专题残杀了你的战斗力</b></span></span>
            </button>
            <div style="border-top: 0.5px solid rgba(255,255,255,0.2)"></div>
            <div class="detailsLine-pre">
              <ul>
                <li v-for="(list,index) in typeList">
                  <div class="detailsLine-pie-text">
                    <p class="detailsLine-pie-textSess">{{numberTwo(list.rightCount)}}</p>
                    <i class="detailsLine-pie-textSold"></i>
                    <p class="detailsLine-pie-textCancel">{{list.total}}</p>
                  </div>
                  <div class="detailsLine-Pie" :id="'detailsLine-Pie'+index"></div>
                </li>
              </ul>
              <ul class="detailsLine-pre-text">
                <li v-for="list in typeList">{{list.name}}</li>
              </ul>
            </div>
            <button class="testingEnd-content-detailsTop bottom-details">
              <span class="to-icon"><i class="testingEnd-content-detailsTopICon"></i></span>
              <span>你的新三板题库智商税交给了<span class="Redcolor">{{typeLists}}</span></span>
            </button>
            <!---->
            <div class="detailsLine-Hide" @click="contentDetailsBtn()">
              <button>收起成绩单<i class="icon iconfont icon-xiangshangjiantou"></i></button>
            </div>
          </div>
          <div class="testingEnd-content">
            <div class="testingEnd-content-list" @click="seeError()">
              <div class="testingEnd-content-list-it" style="width: 11%">
                <img class="testingEnd-content-list-itIcon" :src="contentSets[0].imgUrl" alt="">
              </div>
              <div class="testingEnd-content-list-it">
                <p class="">{{contentSets[0].title}}</p>
                <p class="testingEnd-content-list-itDoc">本次做错<span
                  class="testingEnd-content-list-itColor">{{contentSets[0].errorCount}}</span>道题，做对{{contentSets[0].rightCount}}道题
                </p>
              </div>
              <i class="icon iconfont icon-xiangyoujiantou testingEnd-content-list-itRight"></i>
            </div>
            <!--1-->
            <div class="testingEnd-content-list" @click="seeCollectError()">
              <div class="testingEnd-content-list-it" style="width: 11%">
                <img class="testingEnd-content-list-itIcon" :src="contentSets[1].imgUrl" alt="">
              </div>
              <div class="testingEnd-content-list-it">
                <p class="">{{contentSets[1].title}}</p>
                <p class="testingEnd-content-list-itDoc" v-if="payMode === 0">{{contentSets[1].doc}}</p>
                <p class="testingEnd-content-list-itDoc" v-else>
                  共收藏<span class="list-itDocColor">{{contentSets[1].collectCount}}</span>题，共参加<span>{{contentSets[1].globalCount}}</span>次测试
                </p>
              </div>
              <i class="icon iconfont icon-xiangyoujiantou testingEnd-content-list-itRight"></i>
            </div>
            <!--2-->
            <!-- <div class="testingEnd-content-list" @click="seeReceive">
                 <div class="testingEnd-content-list-it" style="width: 11%">
                     &lt;!&ndash;<img class="testingEnd-content-list-itIcon" :src="contentSets[2].imgUrl" alt="">&ndash;&gt;
                 </div>
                 <div class="testingEnd-content-list-it">
                     <p class="">{{contentSets[2].title}}</p>
                     <p class="testingEnd-content-list-itDoc"><span
                         class="testingEnd-content-list-itColor">{{contentSets[2].date}}</span>
                     </p>
                 </div>
                 &lt;!&ndash;<i class="icon iconfont icon-xiangyoujiantou testingEnd-content-list-itRight"></i>&ndash;&gt;
             </div>-->
          </div>
        </div>
      </div>
      <!--底部显示-->
      <div class="testingEnd-footer" v-if="payMode == 0">
        <div class="testingEnd-footer-left" @click="testEndFenXiang()">
          <button class="leftIcon">再次测试</button>
        </div>
        <div class="testingEnd-footer-right" @click="testEndGODoc()">
          <button class="leftIcon">仿真测试</button>
        </div>
      </div>
      <div class="testingEnd-footer" v-else>
        <div class="testingEnd-footer-left" @click="testEndMy()">
          <button class="leftIcon">进入小安</button>
        </div>
        <div class="testingEnd-footer-right" @click="testEndGOList()">
          <button class="leftIcon">再次测试</button>
        </div>
      </div>
      <!--分享-->
      <div class="testEndFenXiang" @click="testEndFenXiangs = false" v-show="testEndFenXiangs">
        <div></div>
      </div>
      <!--弹出级别-->
      <div class="testPopup" v-show="testPopupes">
        <div class="testPopupBoxL">
          <div class="testPopupBox">
            <div class="testPopupIcon"></div>
            <div class="testTouxiang"><img v-lazy="userConsumer.weixinAvatar" alt=""></div>
            <div class="testPopupText">恭喜您，获得</div>
            <p><i>{{total}}</i><span>&ensp;分！</span></p>
            <div class="testPopupJie">您此次超越了<span>{{testPopupJies+'%'}}</span>的用户！</div>
          </div>
        </div>
        <button class="testPopupBtn" @click="testPopupShow">查看成绩详情</button>
      </div>
      <!--回到主页-->
      <div class="goCustomer goHome" @click="goLaw">
        <div class="ans-homeIcon"></div>
        <div class="ans-homeText">主页</div>
      </div>
      <xiaoan-error v-show="error"></xiaoan-error>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'testingEnd',
    data() {
      return {
        error: false,
        contentDetails: false,
        contentDetailsTop: false,
        bankuai: '',
        leftIcon: true,
        textLeft: '进入小安',
        str: this.$image.testing.star5,
        str1: this.$image.testing.star6,
        str05: this.$image.testing.star05,
        headerTouxiang: '',
        username: '',
        user_id: '',
        testPopupJies: '',
        // fenxiang: '../../static/img/share/fengxiang.jpg',
        touxiang: this.$image.testing.toyxiang9,
        testEndFenXiangs: false,
        testPopupes: true,
        testItem: [],
        designation: '',//称号
        ranks: '',
        charms: '',//魅力点数
        rulTime: '',
        /*图表映入参数*/
        datasss: [],
        secCounts: "",//已用次数
        newNun: 3,//月一共能测得次数
        LastCount: "",//剩余次数
        markets: '',
        /**//**//**//**/
        contentSets: [
          {
            id: "",
            type: "",
            title: "查看错题",
            errorCount: "",
            rightCount: "",
            imgUrl: this.$image.testing.testMistake
          }, {
            id: "",
            type: "",
            title: "查看收藏错题",
            doc: "付费开启该功能",
            collectCount: "",
            globalCount: "",
            status: "",
            imgUrl: this.$image.testing.testCollectMistake
          }, {
            id: "",
            type: "",
            title: "",
            status: "",
            date: '',
            imgUrl: ''
          },
        ],
        userConsumer: {userName: "", type: "免费用户", date: "", newDate: "", weixinAvatar: ""},
        /**/
        useTime: "",
        epithet: ["勤加练习", "再接再厉", "董秘达人"],
        payMode: "",
        nowPayMode: "",
        userName: Object,
        examCount: "",
        expirationTime: "",
        shareuserTestInfo: "",
        rightCount: "",
        errorCount: "",
        testId: "",
        collectTotal: Array,
        selectedReport: Object,
        typeList: [],
        moduleList: "",
        typeLists: "",
        userPayMode: "",
        total: "",
        hasNoDone: '',
        seeReceiveUrl: "https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/coupon/get/cou_5a090c60de600-SS50cI?from=singlemessage&isappinstalled=0",

      }
    },
    components: {},
    watch: {
      "nowPayMode": function () {
        if (this.nowPayMode == 0) {
          this.contentDetailsTop = false;
        } else {
          this.contentDetailsTop = true;
        }
      },
      "payMode": function () {
        if (this.payMode == 0) {

        } else {

        }
      }
    },
    //离开当前页面后
    destroyed: function () {
      window.sessionStorage.removeItem("timeCode");
    },
    //页面加载完成后调用updated方法
    updated() {
      this.dataHeight();//
    },
    created() {
    },
    mounted() {
      let userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      this.userHome();
      console.log(this.user_id);
      if (!this.$cookie.isLogin()) {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      } else {
        this.userTestInfo();
        /**********************************/
        this.xsbSelectResult();//详情
      }
      /*控制首次进入后的结果也弹出框*/
      if (window.sessionStorage.getItem("timeCode") == null) {
        this.testPopupes = false;
      } else {
        this.testPopupes = true;
        window.sessionStorage.removeItem("timeCode");
      }
      window.sessionStorage.removeItem("closeState");
    },
    methods: {
      numberTwo(value) {
        value < 10 ? value = "0" + value : value;
        return value
      },
      shareSuccess() {
        this.$axios.testing.shareSuccess().then(res => {
          this.$vux.toast.show({text: '分享成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
          this.userTestInfo();
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '分享失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      coll(value) {
        let val = (value * 100) + "%";
        return val;
      },
      /**/
      selectReport(testId) {
        let params = {
          testId: testId,
        }
        this.$axios.testing.selectReport(params).then(res => {
          console.log(res);
          /**/
          this.selectedReport = res.data.returnObject;
          let typeList = res.data.returnObject.typeList;
          this.typeList.push(typeList[1]);
          this.typeList.push(typeList[2]);
          this.typeList.push(typeList[0]);
          console.log("123456", this.typeList, this.typeList[0].name);
          this.$nextTick(() => {
            function coll(number) {
              return (number * 100)
            }

            this.detailsLinePie1(coll(this.typeList[0].rightLv), 'detailsLine-Pie0');
            this.detailsLinePie2(coll(this.typeList[1].rightLv), 'detailsLine-Pie1');
            this.detailsLinePie3(coll(this.typeList[2].rightLv), 'detailsLine-Pie2');

            console.log("123213213=====213");
          });

          let moduleMin = res.data.returnObject.moduleMin;
          let typeMin = res.data.returnObject.typeMin;
          //  this.moduleList = this.selectedReport.moduleList;
          // this.typeLists = this.typeList;
          let arr = [];
          for (let i = 0; i < this.selectedReport.moduleList.length; i++) {
            if (this.selectedReport.moduleList[i].rightLv == moduleMin) {
              arr.push(this.selectedReport.moduleList[i].name);
            }
          }

          this.moduleList = arr.join(",");
          console.log("=====>", arr);
          let arr1 = [];
          for (let i = 0; i < this.selectedReport.typeList.length; i++) {
            if (this.selectedReport.typeList[i].rightLv == typeMin) {
              arr1.push(this.selectedReport.typeList[i].name);
            }
          }
          this.typeLists = arr1.join(",");
          console.log("<=====", arr1);

        }).catch((err) => {
          console.error(err);
          console.log(err);
        })
      },
      userTestInfo() {
        this.$axios.testing.userTestInfo().then(res => {
          console.log(res);
          if (res.data.returnCode === 1) {
            this.userPayMode = res.data.returnObject.userPayMode;
            this.payMode = res.data.returnObject.userPayMode.payMode;//免费 0 和付费 1
            this.examCount = res.data.returnObject.userPayMode.examCount;//免费 cishu
            this.expirationTime = res.data.returnObject.userPayMode.expirationTime;//到期时间 cishu
            this.shareuserTestInfo = res.data.returnObject.userPayMode.share;//免费分享次数 cishu
            this.nowDate = res.data.returnObject.nowDate;//服务器当前时间
            this.contentSets[1].collectCount = res.data.returnObject.collectTotal; //收藏题
            this.contentSets[1].globalCount = res.data.returnObject.totalTest;// //共参加次数
            this.hasNoDone = res.data.returnObject.hasNoDone;
            /*计算剩余天数*/
            if (this.expirationTime > this.nowDate) {
              this.userConsumer.date = Math.floor((this.expirationTime - this.nowDate) / 86400000);
              //console.log("------", (this.expirationTime - this.nowDate) / 86400000);
              //console.log("----this.nowDate--", this.$const.format(this.nowDate));
              //console.log("---this.expirationTime---", this.$const.format(this.expirationTime));
              console.log("------", (this.expirationTime - this.nowDate) / 86400000);
            } else {
              this.userConsumer.date = "0";
            }
            /*判断是否免费*/
            if (this.payMode == 1) {
              this.userConsumer.type = "付费用户";
            } else {
              this.userConsumer.type = "普通用户";
            }
          } else {
            this.$router.push({path: "/testing"});
          }
        }).catch((err) => {
          console.error(err);
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
          setTimeout(() => {
            this.userTestInfo();
            //一旦接口出错将自动跳转到testing
          }, 3000)
        })
      },
      ///
      userHome() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome().then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            this.levels = res.data.returnObject.level;
            if (res.data.returnObject.weixinAvatar == null) {
              this.headerTouxiang = this.$image.personal.timg;
            } else {
              this.headerTouxiang = res.data.returnObject.weixinAvatar;
            }
            this.username = res.data.returnObject.userName;
            console.log(this.username, this.mobiles, this.companycode);
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      contentDetailsBtn() {
        if (this.contentDetails == true) {
          this.contentDetailsTop = true;
          this.contentDetails = false;
        } else {
          this.contentDetailsTop = false;
          this.contentDetails = true;
        }
      },
      // 处理计时 （秒）
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
        var result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
          result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
          result = "" + parseInt(theTime2) + "时" + result;
        }
        return ({
          hour: (theTime2 < 10 ? ('0' + theTime2) : theTime2),
          minute: (theTime1 < 10 ? ('0' + theTime1) : theTime1),
          second: (theTime < 10 ? ('0' + theTime) : theTime),
        })
      },
      /**/
      xsbSelectResult() {
        this.$axios.testing.xsbSelectResult().then(res => {
          console.log("===============>", res);
          this.designation = res.data.returnObject.sec.secTitle;//称号
          this.charms = res.data.returnObject.sec.charm;
          //console.log(this.charms);
          //this.charms = 20;
          this.testItem = res.data.returnObject.statuteList;
          this.useTime = this.formatSeconds(res.data.returnObject.sec.useTime); //用时
          console.log(this.useTime);
          /**/
          let userName = res.data.returnObject.sec.user;
          this.userConsumer.userName = userName.userName; //取到用户名
          this.userConsumer.weixinAvatar = userName.weixinAvatar; //取到用户头像
          /**/
          this.contentSets[0].errorCount = res.data.returnObject.errorCount;//错多少题
          this.contentSets[0].rightCount = res.data.returnObject.rightCount;//对多少题
          /**/
          this.testPopupJies = res.data.returnObject.sec.rank;//超越的%
          this.nowPayMode = res.data.returnObject.sec.payMode;//当前数据的付费状态
          this.testId = res.data.returnObject.sec.testId;// 一次测试题目id
          let total = res.data.returnObject.sec.totalScore;//综合指数
          /**/
          this.total = parseFloat(total).toFixed(1); //保留1位小数
          /**/
          this.records = res.data.returnObject.secList;//历史记录
          this.secCounts = res.data.returnObject.secCount;//本月已用次数
          this.markets = res.data.returnObject.sec.market;
          this.selectReport(this.testId);
          /**/
          this.radarEChart(this.total);
          /**/
          /**/
          //var shareTitle = "您已击败" + this.testPopupJies + "%"; // 分享标题
          let url = decodeURI(window.location.href).split('#/')[0];  //当前网页的URL，不包含#及其后面部分
          let shareTitle = "我在新三板董秘模拟考试中领先了" + this.testPopupJies + "%参与者！"; // 分享标题
          let sharedesc = "我击败了" + this.testPopupJies + "%的人，敢不敢挑战TA？"; // 分享描述
          let sharelink = url + "#/testing?CKTAG=mta_share.wechat_moments&userId=" + this.user_id; // 分享链接
          let sharelink2 = url + "#/testing?CKTAG=mta_share.wechat_friend&userId=" + this.user_id; // 分享链接
          let sharelink3 = url + "#/testing?CKTAG=mta_share.qq&userId=" + this.user_id; // 分享链接
          let sharelink4 = url + "#/testing?CKTAG=mta_share.qzone&userId=" + this.user_id; // 分享链接
          let shareimgUrl = this.$api.share.testingImg; // 分享图标
          let sharebot = this.testPopupJies;
          let that = this;
          wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: shareTitle, // 分享标题
              desc: sharedesc, // 分享描述
              link: sharelink2, // 分享链接
              imgUrl: shareimgUrl, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function (res) {
                //用户确认分享后执行的回调函数
                //这里加上h5分享代码*/
                that.$MTAmethod.mtaShare('wechat_friend');
                that.shareSuccess();
                console.log("成功分享好友");
              },
              cancel: function (err) {
                //用户取消分享后执行的回调函数
                console.log(err)
              },
              complete: function () {
                console.log('已调用该方法！');
                //that.shareSuccess();
              }
            });
            wx.onMenuShareTimeline({
              title: "模拟考 | 我打败了" + sharebot + "%的新三板董秘，不服来战！", // 分享标题
              desc: sharedesc, // 分享描述
              link: sharelink, // 分享链接
              imgUrl: shareimgUrl, // 分享图标
              success: function (res) {
                // 用户确认分享后执行的回调函数
                that.shareSuccess();
                that.$MTAmethod.mtaShare('wechat_moments');
                console.log(res);
                console.log("成功分享朋友圈");
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              },
              complete: function () {
                console.log('已调用该方法！');
              }
            });
            wx.onMenuShareQQ({
              title: shareTitle, // 分享标题
              desc: sharedesc, // 分享描述
              link: sharelink3, // 分享链接
              imgUrl: shareimgUrl, // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
                console.log("成功分享QQ好友");
                that.$MTAmethod.mtaShare('qq');
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
                console.log('已调用方法！');
              }
            });
            wx.onMenuShareQZone({
              title: shareTitle, // 分享标题
              desc: sharedesc, // 分享描述
              link: sharelink4, // 分享链接
              imgUrl: shareimgUrl, // 分享图标
              success: function () {
                //用户确认分享后执行的回调函数
                console.log("成功分享QQ空间");
                that.$MTAmethod.mtaShare('qzone');
              },
              cancel: function () {
                //用户取消分享后执行的回调函数
                console.log('已调用方法！');
              }
            })
          });
        }).catch((err) => {
          this.error = true;
          console.error("sectest/selectResult", err);
        })
        /*判断还能进入*/
        this.LastCount = this.newNun - this.secCounts;
        console.log("=========================", this.secCounts, this.LastCount);
      },
      /**/
      seeCollectError() {
        if (this.payMode == 0) {
          window.location.href = window.location.href.split("#/")[0] + "?#/newOTCBBTestDescribe";
        } else {
          if (this.contentSets[1].collectCount == 0) {
            this.$vux.toast.show({text: '暂无收藏', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$router.push({path: "/newOTCBBTestCollect"});
          }
        }
      },
      /*收藏错题*/
      seeError() {
        if (this.payMode == 0) {
          if (this.contentSets[0].errorCount == 0) {
            this.$vux.toast.show({text: '没有错题哦，你真棒👍！', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$router.push({path: "/newOTCBBTestWrongList", query: {testId: this.testId}});
          }
        } else {
          this.$router.push({path: "/newOTCBBTestWrong", query: {testId: this.testId}});
        }
      },
      /**/
      seeReceive() {
        //  window.location.href = this.seeReceiveUrl;
      },
      /* 回到主页 */
      goLaw() {
        this.$router.push({path: "/rule"});
      },
      //防止微信滚动
      prevent(scrollId) {
        document.body.ontouchmove = function (e) {
          e.preventDefault();
        };
        var startX = 0, startY = 0;

        //touchstart事件
        function touchSatrtFunc(evt) {
          try {
            //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
            var touch = evt.touches[0]; //获取第一个触点
            var x = Number(touch.pageX); //页面触点X坐标
            var y = Number(touch.pageY); //页面触点Y坐标
            //记录触点初始位置
            startX = x;
            startY = y;
          } catch (e) {
            // alert('touchSatrtFunc：' + e.message);
          }
        }

        document.addEventListener('touchstart', touchSatrtFunc, false);
        var _ss = document.getElementById(scrollId);
        _ss.ontouchmove = function (ev) {
          var _point = ev.touches[0],
            _top = _ss.scrollTop;
          // 什么时候到底部
          var _bottomFaVal = _ss.scrollHeight - _ss.offsetHeight;
          // 到达顶端
          if (_top === 0) {
            // 阻止向下滑动
            if (_point.clientY > startY) {
              ev.preventDefault();
            } else {
              // 阻止冒泡
              // 正常执行
              ev.stopPropagation();
            }
          } else if (_top === _bottomFaVal) {
            // 到达底部
            // 阻止向上滑动
            if (_point.clientY < startY) {
              ev.preventDefault();
            } else {
              // 阻止冒泡
              // 正常执行
              ev.stopPropagation();
            }
          } else if (_top > 0 && _top < _bottomFaVal) {
            ev.stopPropagation();
          } else {
            ev.preventDefault();
          }
        };
      },
      //码表
      radarEChart(percentage) {
        this.$nextTick(() => {
          var myChart = echarts.init(document.getElementById('testingEnd-EChart-radar'));
          // percentage = "50"; //中间显示的文字
          let widthValue = (percentage) / 100; //百分比转小数
          let width = "20";// 线宽
          let widthColor = "rgba(240,207,141,0.3)"; //变化的刻度颜色
          let scaleColor = 'rgba(240,241,245,0.2)'; //默认的刻度底色
          let option = {
            backgroundColor: 'rgba(0,0,0,0)',
            tooltip: {
              formatter: "{a} <br/>{b} : {c}%"
            },
            series: [{
              startAngle: 359.9,
              endAngle: 0,
              name: '实际完成',
              type: 'gauge',
              center: ['50%', '50%'], // 默认全局居中
              radius: 98,
              min: 0,
              max: 100,
              splitNumber: 0,
              axisLine: { // 坐标轴线
                lineStyle: {
                  color: [
                    [0, 'rgba(240,207,141,1)'],
                    [1, 'rgba(240,207,141,0.8)']
                  ], // 属性lineStyle控制线条样式
                  width: 1
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: { // 坐标轴小标记
                textStyle: { // 属性lineStyle控制线条样式
                  fontWeight: 'bolder',
                  fontSize: 16,
                  color: 'rgba(30,144,255,0)',
                }
              },
              splitLine: { // 分隔线
                length: 10, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                  width: 0,
                  color: '#444'
                }
              },
              pointer: { // 分隔线 指针
                color: '#666666',
                width: 0,
                length: 230
              },
              detail: {
                show: false
              },
            }, {
              name: "仪盘表",
              type: "gauge",
              splitNumber: 180,
              startAngle: 269.9,
              endAngle: -90,
              radius: 93,
              axisLine: {
                lineStyle: {
                  color: [
                    [widthValue, widthColor], //%变化的颜色
                    [1, "rgba(0,0,0,0)"] //剩下%的颜色
                  ],
                  backgroundColor: widthColor,
                  width: width
                },
              },
              axisTick: {
                lineStyle: {
                  color: scaleColor,  //控制每一个刻度条纹 的颜色
                  width: 0.5
                },
                length: width,
                splitNumber: 1
              },
              pointer: {           // 分隔线
                shadowColor: 'rgba(255,255,255,0)', //默认透明
                shadowBlur: 5,
                show: false,
              },
              axisLabel: {
                distance: 11,
                textStyle: {
                  color: "#fff"
                },
                show: false,
              },
              splitLine: {
                "show": false
              },
              itemStyle: {
                normal: {
                  color: "#fff"
                }
              },
              detail: {
                formatter: percentage,
                offsetCenter: [0, 0],
                textStyle: {
                  fontSize: 30,
                  color: "rgba(0,0,0,0)"
                }
              },
              title: {
                offsetCenter: [0, percentage]
              },
            }]
          };
          myChart.setOption(option, true);
        })
      },
      /*点击仿真测试*/
      testEndGODoc() {
        console.log("123===>仿真测试", window.location);
        window.location.href = window.location.href.split("#/")[0] + "?#/newOTCBBTestDescribe";
      },
      /*点击分享*/
      testEndFenXiang() {
        if (this.payMode == 0) {
          if (this.examCount == 0 && this.shareuserTestInfo == false) {
            this.testEndFenXiangs = true;
          } else if (this.examCount == 0 && this.shareuserTestInfo == true) {
            this.$vux.toast.show({text: '免费用户本月次数已用完', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$router.push({path: "/newOTCBBTestingList", query: {entrance: 1}});
          }
        }
      },
      testPopupShow() {
        this.testPopupes = false;
      },
      testEndMy() {
        this.$router.push({path: "/my"});
      },
      testEndGOList() {
        if (this.hasNoDone == 'y') {
          this.$router.push({path: "/newOTCBBTestingList", query: {entrance: 1}});
        } else {
          this.$router.push({path: "/newTestPlate"});
        }
        this.$MTAmethod.mtaShare('1nqtsh7p01f3zo4g', {"ivb2ijivs074ivl2": true});
      },
      //动态调整高度
      dataHeight() {
        let hei = window.document.body.clientHeight;
        let head = document.querySelector(".testingEnd-title").clientHeight;
        let foot = document.querySelector(".testingEnd-footer").clientHeight;
        let scrollHeight = (hei - foot - head) + 'px';
        let scrollHeight1 = (hei - foot - head) + 'px';
        let EChart = document.querySelector(".testingEnd-EChart-radar-show").clientHeight;
        // document.querySelector(".testingEnd-content").style.height = (hei - foot - EChart - head) + 'px';
        document.querySelector("#testingEnd-hidden").style.height = scrollHeight;
        document.querySelector("#testingEnd-scroll").style.height = scrollHeight1;
        console.log("234234erdwasdasd", head, foot, hei, scrollHeight);
      },
      /*********************************/
      detailsLinePie1(index, id) {
        let myChart = echarts.init(document.getElementById(id));
        let dataStyle = {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            shadowBlur: 10,
            shadowColor: 'rgba(40, 40, 40, 0)',
          }
        };
        let placeHolderStyle = {
          normal: {
            color: 'rgba(44,59,70,0)', //未完成的圆环的颜色
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            color: 'rgba(44,59,70,0)' //未完成的圆环的颜色
          }
        };
        let option = {
          backgroundColor: 'rgba(255,255,255,0)',
          color: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.2)', '#fff'],
          series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: [30, 35],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [{
              value: index,
              name: '01',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(240,207,141,0.2)'
                  }, {
                    offset: 1,
                    color: '#f0cf8d'
                  }])
                }
              }
            }, {
              value: (100 - index),
              name: 'invisible',
              itemStyle: placeHolderStyle
            }]
          }, {
            name: 'Line 2',
            type: 'pie',
            animation: false,
            clockWise: false,
            radius: [35, 36],
            itemStyle: dataStyle,
            hoverAnimation: false,
            tooltip: {
              show: false
            },
            data: [{
              value: 100,
              name: '02',
              itemStyle: {
                emphasis: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            }, {
              value: 0,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }]
          }]
        };
        myChart.setOption(option, true);
      },
      detailsLinePie2(index, id) {
        let myChart = echarts.init(document.getElementById(id));
        let dataStyle = {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            shadowBlur: 10,
            shadowColor: 'rgba(40, 40, 40, 0)',
          }
        };
        let placeHolderStyle = {
          normal: {
            color: 'rgba(44,59,70,0)', //未完成的圆环的颜色
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            color: 'rgba(44,59,70,0)' //未完成的圆环的颜色
          }
        };
        let option = {
          backgroundColor: 'rgba(255,255,255,0)',
          color: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.2)', '#fff'],
          series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: [30, 35],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [{
              value: index,
              name: '01',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(240,207,141,0.2)'
                  }, {
                    offset: 1,
                    color: '#f0cf8d'
                  }])
                }
              }
            }, {
              value: (100 - index),
              name: 'invisible',
              itemStyle: placeHolderStyle
            }]
          }, {
            name: 'Line 2',
            type: 'pie',
            animation: false,
            clockWise: false,
            radius: [35, 36],
            itemStyle: dataStyle,
            hoverAnimation: false,
            tooltip: {
              show: false
            },
            data: [{
              value: 100,
              name: '02',
              itemStyle: {
                emphasis: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            }, {
              value: 0,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }]
          }]
        };
        myChart.setOption(option, true);
      },
      detailsLinePie3(index, id) {
        let myChart = echarts.init(document.getElementById(id));
        let dataStyle = {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            shadowBlur: 10,
            shadowColor: 'rgba(40, 40, 40, 0)',
          }
        };
        let placeHolderStyle = {
          normal: {
            color: 'rgba(44,59,70,0)', //未完成的圆环的颜色
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            color: 'rgba(44,59,70,0)' //未完成的圆环的颜色
          }
        };
        let option = {
          backgroundColor: 'rgba(255,255,255,0)',
          color: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.2)', '#fff'],
          series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: [30, 35],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [{
              value: index,
              name: '01',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(240,207,141,0.2)'
                  }, {
                    offset: 1,
                    color: '#f0cf8d'
                  }])
                }
              }
            }, {
              value: (100 - index),
              name: 'invisible',
              itemStyle: placeHolderStyle
            }]
          }, {
            name: 'Line 2',
            type: 'pie',
            animation: false,
            clockWise: false,
            radius: [35, 36],
            itemStyle: dataStyle,
            hoverAnimation: false,
            tooltip: {
              show: false
            },
            data: [{
              value: 100,
              name: '02',
              itemStyle: {
                emphasis: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            }, {
              value: 0,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }]
          }]
        };
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss">
  .newOTBCCTestingEnd {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-size: 100% 100%;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    .testingEnd-title {
      height: 75px;
      width: 100%;
      position: relative;
      .testingEnd-title-left {
        display: inline-block;
        width: 50%;
        height: 75px;
        float: left;
        .testingEnd-title-img {
          height: 45px;
          width: 45px;
          display: inline-block;
          border: 1px solid #f0cf8d;
          border-radius: 50%;
          position: absolute;
          background-color: #dbdee3;
          bottom: 50%;
          left: 12px;
          margin-bottom: -22.5px;
          img {
            height: 45px;
            width: 45px;
            border-radius: 50%;
          }
        }
        .testingEnd-title-name {
          display: inline-block;
          position: absolute;
          left: 67px;
          top: 50%;
          margin-top: -18px;
          font-size: 15px;
          color: #f0cf8d;
          .testingEnd-title-medal {
            background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/medal@3x.png");
            background-size: contain;
            background-repeat: no-repeat;
            height: 16.5px;
            width: 14px;
            span {
              margin-left: 16.5px;
              display: inline-block;
              width: 130px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
          .testingEnd-title-type {
            font-size: 10px;
            color: #f0cf8d;
            margin-top: 4px;
            padding: 0 5px 0 2px;
            background-color: rgba(240, 207, 141, 0.12);
          }
        }
      }
      .rightBox {
        border-right: 0.5px solid rgba(238, 205, 140, 0.26);
        display: inline-block;
        height: 25px;
        position: absolute;
        margin: 25px 0;
      }
      .testingEnd-title-right {
        display: inline-block;
        height: 75px;
        width: 50%;
        float: left;
        text-align: center;
        .testingEnd-title-charm {
          font-size: 15px;
          color: #f0cf8d;
          position: relative;
          top: 50%;
          margin-top: -18px;
          div {
          }
          .testingEnd-title-charm-icon {
            height: 26px;
            .testingEnd-title-charm-star {
              /* background-image: url("/static/img/testing/star-6@3x.png");*/
              background-repeat: no-repeat;
              background-size: 100% 100%;
              display: inline-block;
              height: 13px;
              width: 13.5px;
              img {
                height: 13px;
                width: 13.5px;
              }
            }
          }
        }
      }
    }
    #testingEnd-hidden {
      overflow: hidden;
      #testingEnd-scroll {
        overflow-y: scroll;
        overflow-x: hidden;
        box-sizing: border-box;
        -webkit-overflow-scrolling: touch;
        .mint-swipe {
          height: 260px !important;
          color: #fff;
          font-size: 30px;
          text-align: center;
          margin-bottom: 0;
          .mint-swipe-items-wrap {
            .mint-swipe-item {
              .testingEnd-EChart-radar {
                height: 260px;
              }
              /*line-height: 255px!important;*/
              .testingEnd-EChart-radar-show {
                height: 260px;
                background-color: rgba(0, 0, 0, 0.37);
                position: relative;
                z-index: 1000;
                .testingEnd-EChart-radar-link {
                  font-size: 15px;
                  color: #f0cf8d;
                  z-index: 2000;
                  .testingEnd-EChart-radar-topRight {
                    position: absolute;
                    top: 4%;
                    right: 10px;
                    font-size: 12px;
                    display: table;
                    .testingEnd-EChart-radar-topRightIcon {
                      width: 16px;
                      background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/testEndPlace@3x.png") no-repeat;
                      background-size: contain;
                      display: table-cell;
                    }
                  }
                  .testingEnd-EChart-radar-topLeft {
                    position: absolute;
                    top: 4%;
                    left: 10px;
                    font-size: 12px;
                    display: table;
                    .testingEnd-EChart-radar-topLeftIcon {
                      width: 16px;
                      background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/testEndTime@3x.png") no-repeat;
                      background-size: contain;
                      display: table-cell;
                    }
                    .span {
                      .fontFm {
                        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
                      }
                    }
                  }
                  .testingEnd-EChart-radar-bottomRight {
                    position: absolute;
                    bottom: 4%;
                    font-size: 10px;
                    right: 10px;
                    display: table;
                    border: none;
                    background-color: rgba(240, 207, 141, 0.12);
                    box-sizing: border-box;
                    height: 20px;
                    padding: 0 8px;
                    border-radius: 20px;
                    z-index: 2000;
                    .testingEnd-EChart-radar-bottomRightIcon {
                      display: table-cell;
                      color: #f0cf8d;
                      font-size: 12px;
                    }
                    i {
                      display: table-cell;
                      color: #f0cf8d;
                      font-size: 10px;
                      font-weight: 600;
                    }
                  }
                  .testingEnd-EChart-radar-middleA {
                    position: absolute;
                    top: 31%;
                    font-size: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: #fff;
                    span {
                    }
                  }
                  .testingEnd-EChart-radar-middleB {
                    position: absolute;
                    top: 51%;
                    font-size: 35px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    font-family: PingFangSC-Semibold, sans-serif, Microsoft Yahei, Helvetica;
                    .radar-middleBfen {
                      position: absolute;
                      font-size: 10px;
                    }
                    span {
                    }
                  }
                  .testingEnd-EChart-radar-middleC {
                    position: absolute;
                    top: 63%;
                    font-size: 13px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: #fff;
                    span {
                    }
                  }
                }
              }
            }
          }
          .mint-swipe-indicators {
            bottom: 0 !important;
            .mint-swipe-indicator {
              border-radius: 0px !important;
              width: 12.5px !important;
              height: 2px !important;
              background: #eecd8c !important;
              opacity: 0.2 !important;
            }
            .is-active {
              background: #fff;
              opacity: 1 !important;
            }
          }
        }
        .testingEnd-content-details {
          box-sizing: border-box; /**/
          padding: 0 12px;
          background-color: rgba(0, 0, 0, 0.37);
          .testingEnd-content-detailsTop {
            background-color: rgba(240, 207, 141, 0.12);
            color: #f0cf8d;
            border: 0;
            font-size: 12px;
            padding: 0 8px 0 0;
            border-radius: 18px;
            margin: 0 0 20px 0;
            display: table;
            box-sizing: border-box;
            position: relative;
            vertical-align: middle;
            .to-icon {
              width: 25px;
            }
            span {
              display: table-cell;
              vertical-align: middle;
              text-align: left;
              .testingEnd-content-detailsTopICon {
                background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/testTopmiddle@3x.png") no-repeat;
                background-size: contain;
                height: 20px;
                width: 20px;
                display: table-cell;
                vertical-align: middle;
              }
              .Redcolor {
                display: inline-block;
                padding: 0;
                color: #ff6c00;
                font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
                .at {
                  color: #f0cf8d;
                  font-weight: normal;
                }
              }
            }
          }
          .bottom-details {
            margin-top: 20px;
          }
          .testingEnd-content-detailsLine {
            width: 100%;
            color: #f0cf8d;
            padding: 15px 0 15px 0;
            .testingEnd-content-line {
              display: table;
              color: #f0cf8d;
              height: 30px;
              width: 100%;
              .detailsLine-txt {
                display: table-cell;
                vertical-align: middle;
                text-align: right;
                width: 36%;
              }
              .detailsLine-line {
                width: 51%;
                display: table-cell;
                vertical-align: middle;
                .testingList-trends {
                  height: 6px;
                  width: 100%;
                  background-color: rgba(240, 207, 141, 0.15);
                  border-radius: 10px;
                  position: relative;
                  .testingList-item {
                    display: inline-block;
                    height: 6px;
                    width: 58%;
                    position: absolute;
                    top: 0;
                    transition: width 3s;
                    border-radius: 4px;
                    background: -webkit-gradient(linear, 100% 0%, 20% 0%, from(#9e7e40), to(#9a8968));
                  }
                }
              }
              .detailsLine-shu {
                display: table-cell;
                vertical-align: middle;
                text-align: right;
                padding: 0 0 0 8px;
              }
            }
          }
          .detailsLine-pre {
            ul {
              display: table;
              height: 80px;
              width: 100%;
              box-sizing: border-box;
              font-size: 0;
              margin: 10px 0 0 0;
              li {
                display: table-cell;
                width: 33.33%;
                box-sizing: border-box;
                position: relative;
                .detailsLine-pie-text {
                  height: 100%;
                  width: 100%;
                  position: absolute;
                  z-index: 2000;
                  p {
                    position: relative;
                    color: #f0cf8d;
                    display: inline-block;
                  }
                  .detailsLine-pie-textSess {
                    top: 27%;
                    left: 37%;
                    font-size: 18px;
                    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
                  }
                  .detailsLine-pie-textSold {
                    position: relative;
                    top: 35%;
                    left: 17%;
                    display: inline-block;
                    width: 37px;
                    border-top: 0.5px solid #f0cf8d;
                    transform: rotate(-35deg);
                    /*-ms-transform:rotate(45deg); !* Internet Explorer *!
                    -moz-transform:rotate(45deg); !* Firefox *!
                    -webkit-transform:rotate(45deg); !* Safari 和 Chrome *!
                    -o-transform:rotate(45deg); !* Opera *!*/
                  }
                  .detailsLine-pie-textCancel {
                    top: 45%;
                    left: 2%;
                    font-size: 12px;
                  }
                }
                .detailsLine-Pie {
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                  position: relative;
                }
              }
            }
            .detailsLine-pre-text {
              height: 20px;
              margin: 0 0 10px 0;
              li {
                font-size: 12px;
                color: #f0cf8d;
                text-align: center;
              }
            }
          }
          .detailsLine-Hide {
            width: 100%;
            text-align: center;
            button {
              color: #f0cf8d;
              border: 0;
              padding: 2px 10px;
              border-radius: 20px;
              font-size: 12px;
              background-color: rgba(240, 207, 141, 0.12);
              margin: 5px 0 20px 0;
              text-align: center;
              vertical-align: middle;
              i {
                font-weight: 600;
                color: #f0cf8d;
                font-size: 12px;
                padding-left: 4px;
                transform: rotate(90deg);
              }
            }
          }
        }
        .testingEnd-content {
          padding: 0 12px;
          font-size: 15px;
          width: 100%;
          box-sizing: border-box;
          .testingEnd-content-list {
            height: 69px;
            width: 100%;
            /*padding: 10px 0;*/
            box-sizing: border-box;
            color: #f0cf8d;
            border-bottom: 0.5px solid rgba(240, 241, 245, 0.2);
            display: table;
            .testingEnd-content-list-it {
              display: table-cell;
              vertical-align: middle;
              color: #f0cf8d;
              p {
              }
              .testingEnd-content-list-itIcon {
                width: 24px;
                vertical-align: middle;
              }
              .testingEnd-content-list-itDoc {
                color: rgba(240, 241, 245, 0.5);
                font-size: 12px;
                .testingEnd-content-list-itColor {
                  color: #ff6c00;
                  font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
                }
                .list-itDocColor {
                  color: #ff6c00;
                  font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
                }
              }
            }
            i {
              display: table-cell;
              vertical-align: middle;
              color: #f0cf8d;
              text-align: right;
            }
          }
          .testingEnd-content-list:last-child {
            /*border-bottom: none;*/
          }
        }
      }
    }
    .testingEnd-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60px;
      background-color: rgba(0, 0, 0, 0.37);
      font-size: 0;
      .testingEnd-footer-left {
        display: inline-block;
        width: 50%;
        height: 60px;
        text-align: center;
        .leftIcon {
          padding: 0;
          display: inline-block;
          height: 66.666%;
          width: 80%;
          border: 0;
          border-radius: 20px;
          background-color: #f0cf8d;
          color: white;
          font-size: 21px;
          margin: 10px 0;
          text-align: center;
          line-height: 66.666%;
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        }
        .leftIcon:active {
          background-color: #e4c077;
        }
      }
      .testingEnd-footer-right {
        display: inline-block;
        width: 50%;
        height: 60px;
        text-align: center;
        .leftIcon {
          padding: 0;
          display: inline-block;
          height: 66.666%;
          width: 80%;
          border: 0;
          border-radius: 20px;
          background-color: #f0cf8d;
          color: white;
          font-size: 21px;
          margin: 10px 0;
          text-align: center;
          line-height: 66.666%;
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        }
        .leftIcon:active {
          background-color: #e4c077;
        }
      }
    }
    .testEndFenXiang {
      z-index: 2000;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      background: rgba(0, 0, 0, 0.8);
      div {
        background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/fenxiangOTCBB@3x.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 276.097px;
        height: 270px;
        margin: 35px auto 0 auto;
        margin-right: 25px;
      }
    }
    .testPopup {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.9);
      .testPopupBoxL {
        background-color: rgba(0, 0, 0, 0.8);
        .testPopupBox {
          width: 260px;
          height: 237.5px;
          background: rgba(240, 207, 141, 0.12);
          margin: 35.2% auto 20px auto;
          border-radius: 16px;
          position: relative;
          .testPopupIcon {
            background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/touxiang@3x.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            width: 130px;
            height: 123.36px;
            position: absolute;
            top: -80px;
            left: 50%;
            margin-left: -65px;
          }
          .testTouxiang {
            justify-content: center;
            width: 64px;
            height: 64px;
            position: absolute;
            top: -46px;
            left: 38%;
            img {
              width: 64.5px;
              height: 64.5px;
              border-radius: 50%;
              padding: 0;
              margin: 0;
            }
          }
          .testPopupText {
            text-align: center;
            color: #f0cf8d;
            line-height: 30px;
            padding-top: 60px;
            font-size: 17px;
          }
          p {
            text-align: center;
            display: inherit;
            margin: 15px 0 0 0;
            color: #f0cf8d;
            font-size: 40px;
            font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
            i {
              font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
            }
            span {
              font-size: 15px;
              font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
            }
          }
          .testPopupJie {
            position: absolute;
            bottom: 35px;
            left: 10%;
            font-size: 17px;
            text-align: center;
            color: white;
            span {
              font-size: 25px;
              color: #f0cf8d;
              font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
              font-style: italic;
              padding-right: 2px;
            }
          }
        }
      }
      .testPopupBtn {
        width: 150px;
        height: 40px;
        border-radius: 20px;
        background: rgba(240, 207, 141, 0.12);
        border: 0;
        display: -webkit-box;
        margin: 0 auto;
        color: #f0cf8d;
        font-size: 15px;
      }
      .testPopupBtn:active {
        background-color: rgba(240, 207, 141, 0.12);
      }
    }
    .goCustomer {
      height: 45px;
      width: 45px;
      border: 0;
      box-sizing: border-box;
      display: inline-block;
      background-color: rgba(255, 177, 72, 0.5);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      position: absolute;
      bottom: 12%;
      right: 10%;
      color: white;
      font-size: 12px;
      padding: 9px;
      text-align: center;
      line-height: 14px;
      .ans-homeIcon {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA7CAYAAAAtpUeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVGRjIwM0ZCNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVGRjIwM0ZDNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUZGMjAzRjk2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUZGMjAzRkE2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qSSpMAAADTUlEQVR42uyaWWgTQRjHN6GtWsWzFvVBgg/BIhEaES+kD634ICLWE1ErYh88gihIRRAUqQf0QRGlHlQEDxAULbaIiD6IQsUWRERUCipWpVC1BVvRNut/cBaWsDOzNXvMJPPBD5LM7uw3PzLH7mzENE0j5BgJLoO19PstUAu+hZVQJGQpU8B9kMj4/T1YCt6GkVQ0RCFJ8MJBCIkYaAcL8knKEtAGSjnHjAFPwLJ8kLKedpkCN90b3AVbclnKbnCdUTYEBhlll0BdYFmSgTYgjprs6AdlYCb4yTnuZBC5BiWkidPQzyBhO3YW+Mg5/obqUgpBK6eBHaDU4bwJoI1z3mMwTkUpk2mjWdFCpbHOj4JmzvmdIKaSlATtFqy4OIy6Gjn19ICkClIW04GTFfX/UedhTn2/QZXMUqpNfqSyqHuHoO4NMkrZLkh6nQfXWC24xl6ZpBziJDoAKj2UXwF6OddrkEEKbyDsyliDeEWczj6suBaWFDJl3uEk1g5KfJzyyTrlKef6j0BxkFImgeechFoFaxAvuc3J4w2YFoSUuGAZ3hTg/ZTFOU4+X+itg29S5oE+TgLHQxBicURww1nhh5TlgulwT4hCLFKCHNd4KWWrj4syr6nNNlc3FzlgiiMmkZSpLvI9xqtD9OTtNKh3+VRelnCTy366rTLsx5E3wS4jd2MzeOD0rNhJynjwDFQbuR+VoAOU8KRY+y1zGZVcAS8VbPxrcJVRlqBtjjtJSdLCGYyTD4JNoEhBKaPBRrCPUT6dtn2h/Wn+IjDEGa3rbKNzt0P5fIlmn3KH/H6AIlq+UzAzVVn/lLOcQZcYPmEzPqjgP4XsKY2ln8+AFfQ3p2iM2hqbGQN0ILL3RVPhQTVt+9xMu8p3h+NGWFLI1PvHVvAOzAEPc3jmITNsOXiV8XvKmqPvgTKwEvSDCxmScjU+gNlgG+1eLWSmsi9cOkGDkX9ButV5Wd5PkTa0FC1FS9FStBQtRUvRUrQULUVL0VK0FC1Fh5aipWgp0khJS9SmtCxSuiSS8snIciumwKNEToFuUBiyELJRNzHbSrySskqBoSLiZ/cpVnDsHOXnmPIL9CkohWzw9folhYzsNeCrQkJ6jH+vkLh+MeCvAAMAf1XzDjMmclkAAAAASUVORK5CYII=");
        background-repeat: no-repeat;
        background-size: contain;
        height: 18px;
        width: 21px;
        /*margin: 5px auto 0 auto;*/
        margin: 0 auto;
      }
      .ans-homeText {
      }
    }
    a {
      text-decoration: none;
    }
    #detailsLine-Pie0 > div, #detailsLine-Pie1 > div, #detailsLine-Pie2 > div {
      margin: 0 auto !important;
    }
  }
</style>
