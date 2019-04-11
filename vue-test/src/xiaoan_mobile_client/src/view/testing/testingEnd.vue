<template>
  <transition name="bounce">
    <div id="testingEnd">
      <div class="testingEnd-title">
        <div class="testingEnd-title-left">
          <div class="testingEnd-title-img"><img v-lazy="headerTouxiang" alt=""></div>
          <div class="testingEnd-title-name">
            <div class="testingEnd-title-medal"><span>{{usernames}}</span></div>
            <div>{{designation}}</div>
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
              <span class="testingEnd-title-charm-star">
                            <img v-lazy="str05" alt="" v-if="charms > 25 && charms < 30"/>
                            <img v-lazy="str1" alt="" v-else-if="charms < 30"/>
                            <img v-lazy="str" alt="" v-else-if="charms == 30"/>
                        </span>
            </div>
          </div>
        </div>
      </div>
      <div style="overflow: hidden;" id="testingEnd-hidden">
        <div id="testingEnd-scroll">
          <!--图表-->
          <mt-swipe :auto="0">
            <mt-swipe-item class="slide1">
              <div style="position: relative;z-index: 1000;"
                   class="testingEnd-EChart-radar-show">
                <div class="testingEnd-EChart-radar-link">
                  <div class="testingEnd-radar-title" v-if="markets == '1'">沪市主板</div>
                  <div class="testingEnd-radar-title" v-else-if="markets == '2'">深市主板</div>
                  <div class="testingEnd-radar-title" v-else-if="markets == '3'">深市中小板</div>
                  <div class="testingEnd-radar-title" v-else-if="markets == '4'">深市创业板</div>
                  <div class="testingEnd-EChart-radar-1">
                            <span v-if="operating == 100">
                                <span style="color: red;font-size: 13px">{{operating}}</span>分
                            </span>
                    <span v-if="operating != 100">
                                <span>{{operating}}</span>分
                            </span>
                  </div>
                  <div class="testingEnd-EChart-radar-2">
                            <span v-if="ownerChange == 100">
                                <span style="color: red;font-size: 13px">{{ownerChange}}</span>分
                            </span>
                    <span v-if="ownerChange != 100">
                                <span>{{ownerChange}}</span>分
                            </span>
                  </div>
                  <div class="testingEnd-EChart-radar-3">
                            <span v-if="disclosure == 100">
                                <span style="color: red;font-size: 13px">{{disclosure}}</span>分
                            </span>
                    <span v-if="disclosure != 100">
                                <span>{{disclosure}}</span>分
                            </span>
                  </div>
                  <div class="testingEnd-EChart-radar-4">
                            <span v-if="merge == 100">
                                <span style="color: red;font-size: 13px">{{merge}}</span>分
                            </span>
                    <span v-if="merge != 100">
                                <span>{{merge}}</span>分
                            </span>
                  </div>
                  <div class="testingEnd-EChart-radar-5">
                            <span v-if="report == 100">
                                <span style="color: red;font-size: 13px">{{report}}</span>分
                            </span>
                    <span v-if="report != 100">
                                <span>{{report}}</span>分
                            </span>
                  </div>
                  <div class="testingEnd-EChart-radar-6">
                    <span>综合指数:{{total}}</span>
                  </div>
                </div>
                <div class="testingEnd-EChart-radar" id="testingEnd-EChart-radar"></div>
              </div>
            </mt-swipe-item>
            <mt-swipe-item class="slide2">
              <div style="" class="testingEnd-EChart-line-show">
                <div class="testingEnd-EChart-line-link">
                  <div class="testingEnd-line-title">历史成绩</div>
                </div>
                <div class="testingEnd-EChart-line" id="testingEnd-EChart-line"></div>
              </div>
            </mt-swipe-item>
          </mt-swipe>
          <!--内容-->
          <div class="testingEnd-content">
            <div class="testingEnd-content-top">
              <div class="testingEnd-content-left">
                <div class="testingEnd-content-leftL">本次测评排名：</div>
                <div class="testingEnd-leftL-cont">您已超越<span>{{testPopupJies+'%'}}</span>的测评用户</div>
              </div>
              <span class="rightBox rightBoxX"></span>
              <div class="testingEnd-content-right">
                <div class="testingEnd-content-rightL">下次可参与时间：</div>
                <div class="testingEnd-reghtL-cont" v-if="LastCount > '0'">本月还有
                  <span class="testingEnd-content-rightTime">{{LastCount}}</span>次测试机会
                </div>
                <div class="testingEnd-reghtL-cont" v-else-if="LastCount == 0">
                  <span class="testingEnd-content-rightTime">{{rulTime}}</span>
                </div>
              </div>
            </div>
            <div class="testingEnd-content-middle">
              <div class="testingEnd-content-middle-item">
                <span class="testingEnd-content-middle1"><div></div></span>
                <span class="testingEnd-content-middle-text">推荐读物</span>
                <span class="testingEnd-content-middle2"><div></div></span>
              </div>
            </div>
            <div class="testingEnd-content-list">
              <div v-for="(list,index) in testItem">
                <router-link :to="'/rule/details?id='+list.statuteLink">
                  <div class="testingEnd-content-list-st">{{list.statuteName}}</div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--底部显示-->
      <div class="testingEnd-footer">
        <div class="testingEnd-footer-left" @click="testEndGOHome()">
          <button class="leftIcon" v-if="leftIcon == false">进入小安</button>
          <button class="leftIcon" v-else>再次测试</button>
        </div>
        <div class="testingEnd-footer-right" @click="testEndFenXiang()">
          <button class="leftIcon">分享</button>
        </div>
      </div>
      <!--分享-->
      <div class="testEndFenXiang" @click="testEndFen()" v-show="testEndFenXiangs">
        <div></div>
      </div>
      <!--弹出级别-->
      <div class="testPopup" v-show="testPopupes">
        <div class="testPopupBoxL">
          <div class="testPopupBox">
            <div class="testPopupIcon"></div>
            <div class="testTouxiang"><img v-lazy="headerTouxiang" alt=""></div>
            <div class="testPopupLine">
              <div>{{designation}}</div>
            </div>
            <div class="testPopupText">恭喜您，获得<i>{{'“'+ designation +'”'}}</i>称号！</div>
            <div class="testPopupJie">您此次超越了<span>{{testPopupJies+'%'}}</span>的用户！</div>
          </div>
        </div>
        <button class="testPopupBtn" @click="testPopupShow()">查看成绩详情</button>
      </div>
      <!--回到主页-->
      <div class="goCustomer goHome" @click="goLaw()">
        <div class="ans-homeIcon"></div>
        <div class="ans-homeText">主页</div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'testingEnd',
    data() {
      return {
        bankuai: '',
        leftIcon: false,
        textLeft: '进入小安',
        str: this.$image.testing.star5,
        str1: this.$image.testing.star6,
        str05: this.$image.testing.star05,
        headerTouxiang: '',
        username: '',
        usernames: '',
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
        operating: "",//三会
        ownerChange: "",//权益变动
        disclosure: "", //交易披露
        merge: "",//并购融资
        report: "",//定期报告
        total: '',//综合指数
        radarArr: [],//雷达图数据
        records: [],//历史记录
        strtotal: [],//分数数组
        startTime: [],//时间数组
        datasss: [],
        secCounts: "",//已用次数
        newNun: 3,//月一共能测得次数
        LastCount: "",//剩余次数
        markets: '',
      }
    },
    //离开当前页面后
    destroyed: function () {
      window.sessionStorage.removeItem("timeCode");
    },
    //页面加载完成后调用updated方法
    updated() {
      //动态调整高度方法
      var wid = window.document.body.clientWidth;
      $("#testingEnd-EChart-line").css({'width': wid});
      this.dataHeight();//
    },
    created() {
      let wid = window.document.body.clientWidth;
      $("#testingEnd-EChart-line").css({'width': wid});

      this.userGlobal();
    },
    mounted() {
      //this.prevent();
      var wid = window.document.body.clientWidth;
      $("#testingEnd-EChart-line").css({'width': wid});

      // var userId = this.$cookie.getCookie("userId");
      // this.user_id = userId;
      console.log(this.user_id);
      /**&********************************/

      //
      this.selectResult();
      // 控制首次进入后的结果也弹出框
      if (window.sessionStorage.getItem("timeCode") == null) {
        $(".testPopup").hide();
      } else {
        $(".testPopup").show();
        window.sessionStorage.removeItem("timeCode");
      }
      /*判断还能进入*/
      this.LastCount = this.newNun - this.secCounts;
      console.log("=========================", this.secCounts, this.LastCount);
      this.linkTest();
    },

    methods: {
      selectResult() {
       this.$axios.testing.selectResult().then(res => {
          console.log(res);
          this.designation = res.data.returnObject.sec.secTitle;//称号
          this.charms = res.data.returnObject.sec.charm;
          console.log(this.charms);
          //this.charms = 20;
          this.testItem = res.data.returnObject.statuteList;
          this.testPopupJies = res.data.returnObject.sec.rank;//超越的%
          /**/
          this.operating = res.data.returnObject.sec.operatingScore;//三会
          this.ownerChange = res.data.returnObject.sec.ownerChangeScore;//权益变动
          this.disclosure = res.data.returnObject.sec.disclosureScore; //交易披露
          this.merge = res.data.returnObject.sec.mergeScore;//并购融资
          this.report = res.data.returnObject.sec.reportScore;//定期报告
          this.total = res.data.returnObject.sec.totalScore;//综合指数
          this.records = res.data.returnObject.secList;//历史记录
          this.secCounts = res.data.returnObject.secCount;//本月已用次数
          this.markets = res.data.returnObject.sec.market;
          console.log("asdsadsad", this.secCounts, this.markets);
          /**/
          this.LastCount = this.newNun - this.secCounts;
          console.log(this.LastCount, this.testPopupJies);
          if (this.LastCount == 0) {
            this.leftIcon = false
          } else {
            this.leftIcon = true
          }
          var arr = [];
          var arra = [];
          $.each(this.records, function (idx, obj) {
            arr.unshift(obj.totalScore);
            arra.unshift(obj.startTimeChange);
          });
          /*********************************/
          this.strtotal = arr;
          this.strtotal.unshift("61.8");
          console.log(arr, this.strtotal);
          /****************************/
          this.startTime = arra;
          this.startTime.unshift("");
          console.log(arra, this.startTime);
          /******************************/
          this.operating = Math.ceil(parseInt(this.operating));
          this.ownerChange = Math.ceil(parseInt(this.ownerChange));
          this.disclosure = Math.ceil(parseInt(this.disclosure));
          this.merge = Math.ceil(parseInt(this.merge));
          this.report = Math.ceil(parseInt(this.report));
          var radarArray = this.operating + "," + this.ownerChange + "," + this.disclosure + "," + this.merge + "," + this.report;
          console.log(radarArray);
          this.radarArr = radarArray.split(",");
          console.log(this.radarArr);
          this.radarEChart();
          this.lineEChart();
          //
          //var shareTitle = "您已击败" + this.testPopupJies + "%"; // 分享标题
          var url = this.$api.CURRENTIP.IP;  //当前网页的URL，不包含#及其后面部分
          var shareTitle = this.username + "在董秘专业能力测试中领先" + this.testPopupJies + "%参与者！"; // 分享标题
          var sharedesc = "获得" + this.designation + "称号，敢不敢挑战TA？"; // 分享描述
          var sharelink = url + "#/testing?CKTAG=mta_share.wechat_moments&fromUserId=" + this.user_id; // 分享链接
          var sharelink2 = url + "#/testing?CKTAG=mta_share.wechat_friend&fromUserId=" + this.user_id; // 分享链接
          var sharelink3 = url + "#/testing?CKTAG=mta_share.qq&fromUserId=" + this.user_id; // 分享链接
          var sharelink4 = url + "#/testing?CKTAG=mta_share.qzone&fromUserId=" + this.user_id; // 分享链接
          var shareimgUrl = this.$api.share.testingImg; // 分享图标
          var sharebot = this.testPopupJies;
          var that = this;
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
                /*MtaH5.clickShare('wechat_friend');  //这里加上h5分享代码*/
                that.$MTAmethod.mtaShare('wechat_friend')
                console.log("成功分享好友");
              },
              cancel: function (err) {
                //用户取消分享后执行的回调函数
                console.log(err)
              },
              complete: function () {
                console.log('已调用该方法！');
              }
            });
            wx.onMenuShareTimeline({
              title: "测试|我打败了" + sharebot + "%的董秘，不服来战！", // 分享标题
              desc: sharedesc, // 分享描述
              link: sharelink, // 分享链接
              imgUrl: shareimgUrl, // 分享图标
              success: function (res) {
                // 用户确认分享后执行的回调函数
                /*MtaH5.clickShare('wechat_moments');*/
                that.$MTAmethod.mtaShare('wechat_moments')
                console.log(res)
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
                /*MtaH5.clickShare('qq');*/
                that.$MTAmethod.mtaShare('qq')
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
                //MtaH5.clickShare('qzone');
                that.$MTAmethod.mtaShare('qzone')
              },
              cancel: function () {
                //用户取消分享后执行的回调函数
                console.log('已调用方法！');
              }
            })
          });
        }).catch((err) => {
          console.error("sectest/selectResult", err);
        })
      },
      /* 回到主页 */
      goLaw() {
        this.$router.push({path: "/rule"});
      },
      /**/
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
      /**/
      linkTest() {
        if (this.user_id == "") {
          console.log("没登陆");
        } else {
          this.$axios.testing.myTest().then(res => {
            this.results = res.data.result;
            if (this.results = 3) {
              this.rulTime = res.data.time;
            }
            console.log("=========================", res);
          }).catch((err) => {
            console.error(err);
          });
        }
      },
      //获取头像和名称
      userGlobal() {
        /*this.$http({
          method: "GET",
          url: this.$api.userHome.userhome
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1) {
            console.log("用户是", res);
            this.user_id = res.data.returnObject.id;
            this.headerTouxiang = res.data.returnObject.weixinAvatar;
            this.usernames = res.data.returnObject.userName;
            this.username = res.data.returnObject.weixinUsername;
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      //雷达图
      radarEChart() {
        var myChart = echarts.init(document.getElementById('testingEnd-EChart-radar'));
        myChart.setOption({
          legend: {
            top: 20,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {
              color: '#fff'
            }
          },
          radar: {
            radius: '60%',
            splitNumber: 4,
            axisLine: {
              lineStyle: {
                color: '#f0cf8d',
                opacity: 0.26
              }
            },
            splitLine: {
              lineStyle: {
                color: '#f0cf8d',
                opacity: 0.26
              }
            },
            splitArea: {
              areaStyle: {
                color: 'rgba(255,255,255,0)',
                opacity: 1,
                shadowBlur: 45,
                shadowColor: 'rgba(0,0,0,.5)',
                shadowOffsetX: 0,
                shadowOffsetY: 15,
              }
            },
            indicator: [{
              name: "三会运作",
              max: 100
            }, {
              name: '权益变动',
              max: 100
            }, {
              name: '交易披露',
              max: 100
            }, {
              name: '并购融资',
              max: 100
            }, {
              name: '定期报告',
              max: 100
            }]
          },
          series: [{
            // name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            symbolSize: 0,
            areaStyle: {
              normal: {
                shadowBlur: 13,
                shadowColor: 'rgba(0,0,0,.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                opacity: 1
              },
              itemStyle: {
                width: '1px',
                color: 'rgba(255,255,255,0)',
              },
            },
            //控制图形
            data: [{
              value: this.radarArr,
              //name: '预算分配（Allocated Budget）',
              symbol: 'circle',
              symbolSize: 5,
              lineStyle: {
                normal: {
                  width: '1',
                  color: '#f0cf8d',
                  background: '#focf8d',
                }
              },
            }
            ]
          }],
          color: ['rgba(240,207,141,0.26)'],
          /*backgroundColor: {
            type: 'radial',
            x: 1,
            y: 0.4,
            r: 0.35,
            colorStops: [{
              offset: 0,
              color: '#895355' // 0% 处的颜色
            }, {
              offset: .4,
              color: '#593640' // 100% 处的颜色
            }, {
              offset: 1,
              color: '#39273d' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          }*/
        });
      },
      //折线图
      lineEChart() {
        console.log(this.strtotal)
        //var strtotal = [this.strtotal];
        var colorsl = ["rgba(240,207,141,0.26)"];
        var colors = ['#f0cf8d'];
        var myCharts = echarts.init(document.getElementById('testingEnd-EChart-line'));
        myCharts.setOption({
          color: colors,
          //控制距离
          grid: {
            left: 40,
            top: 40,
            bottom: 40,
            right: 30,
            containLabel: false
          },
          series: [{
            data: this.strtotal,//分数
            name: '',
            type: 'line',
            smooth: true,
            markPoint: {
              silent: true,
              //symbol: '',
              //  symbolSize: 10,
              //  symbolOffset: '150%,100%',
              /*data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'},
              ],*/
            },
          }],
          xAxis: [{
            data: this.startTime,//时间
            type: 'category',
            boundaryGap: false,
            nameTextStyle: {
              color: "rgba(240,207,141,0.26)",
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: "rgba(240,207,141,0.26)",
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(240,207,141,0.26)",
              }
            }
          }],
          yAxis: [{
            min: 0,
            max: 100,
            type: 'value',
            nameTextStyle: {
              color: "rgba(240,207,141,0.26)",
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: "rgba(240,207,141,0.26)",
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(240,207,141,0.26)",
              }
            },
          }]
        })
      },
      testEndGOHome() {
        if (this.leftIcon == true) {
          this.$router.push({path: '/testPlate'});
        } else {
          this.$router.push({path: '/home'});
        }
      },
      testEndFenXiang() {
        this.testEndFenXiangs = true
      },
      testEndFen() {
        this.testEndFenXiangs = false;
      },
      testPopupShow() {
        this.testPopupes = false;
      },
      //动态调整高度
      dataHeight() {
        var hei = window.document.body.clientHeight;
        var wid = window.document.body.clientWidth;
        document.getElementById("testingEnd-EChart-line").style.width = wid;
        var head = document.querySelector(".testingEnd-title").clientHeight;
        var foot = document.querySelector(".testingEnd-footer").clientHeight;
        var scrollHeight = (hei - foot - head) + 'px';
        var scrollHeight1 = (hei - foot - head) + 'px';
        console.log("234234erdwasdasd", head, foot, hei, scrollHeight);
        document.querySelector("#testingEnd-hidden").style.height = scrollHeight;
        document.querySelector("#testingEnd-scroll").style.height = scrollHeight1;
      }
    }
  }
</script>

<style>
  #testingEnd .goCustomer {
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
    right: 5%;
    color: white;
    font-size: 12px;
    padding: 9px;
    text-align: center;
    line-height: 14px;
  }
  #testingEnd .ans-homeIcon {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA7CAYAAAAtpUeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVGRjIwM0ZCNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVGRjIwM0ZDNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUZGMjAzRjk2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUZGMjAzRkE2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qSSpMAAADTUlEQVR42uyaWWgTQRjHN6GtWsWzFvVBgg/BIhEaES+kD634ICLWE1ErYh88gihIRRAUqQf0QRGlHlQEDxAULbaIiD6IQsUWRERUCipWpVC1BVvRNut/cBaWsDOzNXvMJPPBD5LM7uw3PzLH7mzENE0j5BgJLoO19PstUAu+hZVQJGQpU8B9kMj4/T1YCt6GkVQ0RCFJ8MJBCIkYaAcL8knKEtAGSjnHjAFPwLJ8kLKedpkCN90b3AVbclnKbnCdUTYEBhlll0BdYFmSgTYgjprs6AdlYCb4yTnuZBC5BiWkidPQzyBhO3YW+Mg5/obqUgpBK6eBHaDU4bwJoI1z3mMwTkUpk2mjWdFCpbHOj4JmzvmdIKaSlATtFqy4OIy6Gjn19ICkClIW04GTFfX/UedhTn2/QZXMUqpNfqSyqHuHoO4NMkrZLkh6nQfXWC24xl6ZpBziJDoAKj2UXwF6OddrkEEKbyDsyliDeEWczj6suBaWFDJl3uEk1g5KfJzyyTrlKef6j0BxkFImgeechFoFaxAvuc3J4w2YFoSUuGAZ3hTg/ZTFOU4+X+itg29S5oE+TgLHQxBicURww1nhh5TlgulwT4hCLFKCHNd4KWWrj4syr6nNNlc3FzlgiiMmkZSpLvI9xqtD9OTtNKh3+VRelnCTy366rTLsx5E3wS4jd2MzeOD0rNhJynjwDFQbuR+VoAOU8KRY+y1zGZVcAS8VbPxrcJVRlqBtjjtJSdLCGYyTD4JNoEhBKaPBRrCPUT6dtn2h/Wn+IjDEGa3rbKNzt0P5fIlmn3KH/H6AIlq+UzAzVVn/lLOcQZcYPmEzPqjgP4XsKY2ln8+AFfQ3p2iM2hqbGQN0ILL3RVPhQTVt+9xMu8p3h+NGWFLI1PvHVvAOzAEPc3jmITNsOXiV8XvKmqPvgTKwEvSDCxmScjU+gNlgG+1eLWSmsi9cOkGDkX9ButV5Wd5PkTa0FC1FS9FStBQtRUvRUrQULUVL0VK0FC1Fh5aipWgp0khJS9SmtCxSuiSS8snIciumwKNEToFuUBiyELJRNzHbSrySskqBoSLiZ/cpVnDsHOXnmPIL9CkohWzw9folhYzsNeCrQkJ6jH+vkLh+MeCvAAMAf1XzDjMmclkAAAAASUVORK5CYII=");
    background-repeat: no-repeat;
    background-size: contain;
    height: 18px;
    width: 21px;
    /*margin: 5px auto 0 auto;*/
    margin: 0 auto;
  }
  #testingEnd a {
    text-decoration: none;
  }
  #testingEnd .testingEnd-EChart-line {
    width: 100%;
    height: 245px;
    margin: auto;
  }
  #testingEnd .testingEnd-EChart-line canvas {
    bottom: 0 !important;
    top: 10px !important;
  }
  #testingEnd .testingEnd-EChart-line > div {
    margin: auto !important;
  }
  #testingEnd .testingEnd-EChart-radar {
    width: 100%;
    margin: 0 auto;
    height: 255px;
    position: absolute;
    top: 0;
    z-index: 800;
    /*color: #f0cf8d;*/
    /*background: rgba(240,207,141,0.26);*/
    overflow: hidden;
  }
  #testingEnd .testingEnd-EChart-line-show {
    position: relative;
    height: 255px;
    z-index: 1000;
  }
  .mint-swipe {
    height: 255px !important;
    color: #fff;
    font-size: 30px;
    text-align: center;
    margin-bottom: 0px;
    background-color: rgba(0, 0, 0, 0.37);
  }
  .testingEnd-EChart-radar-show {
    height: 255px;
  }
  .mint-swipe-item {
    /*line-height: 255px!important;*/
  }
  .mint-swipe-indicators {
    bottom: 0 !important;
  }
  .mint-swipe-indicator {
    border-radius: 0px !important;
    width: 12.5px !important;
    height: 2px !important;
    background: #eecd8c !important;
    opacity: 0.2 !important;
  }
  .mint-swipe-indicator.is-active {
    background: #fff;
    opacity: 1 !important;
  }
  #testingEnd .rightBox {
    border-right: 0.5px solid rgba(238, 205, 140, 0.26);
    display: inline-block;
    height: 25px;
    position: absolute;
    margin: 25px 0;
  }
  #testingEnd .rightBoxX {
    margin: 17.5px 0;
  }
</style>

<style scoped>
  #testingEnd {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-size: 100% 100%;
    font-family: PingFangSC-Regular, sans-serif, "Microsoft Yahei", "Helvetica";
  }
  #testingEnd #testingEnd-scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }
  #testingEnd .testingEnd-title {
    height: 75px;
    width: 100%;
    position: relative;
  }
  #testingEnd .testingEnd-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: #2e2f33;
    font-size: 0;
  }
  /*头像*/
  #testingEnd .testingEnd-title .testingEnd-title-img {
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
  }
  #testingEnd .testingEnd-title .testingEnd-title-img img {
    height: 45px;
    width: 45px;
    border-radius: 50%;
  }
  #testingEnd .testingEnd-title-medal {
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/medal@3x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 16.5px;
    width: 14px;
  }
  #testingEnd .testingEnd-title-medal span {
    margin-left: 16.5px;
    display: inline-block;
    width: 130px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  #testingEnd .testingEnd-title-name {
    display: inline-block;
    position: absolute;
    left: 67px;
    top: 50%;
    margin-top: -18px;
    font-size: 15px;
    color: #f0cf8d;
  }
  #testingEnd .testingEnd-title-charm {
    font-size: 15px;
    color: #f0cf8d;
    position: relative;
    top: 50%;
    margin-top: -18px;
  }
  #testingEnd .testingEnd-title-charm-icon {
    height: 26px;
  }
  #testingEnd .testingEnd-title-charm-star {
    /* background-image: url("/static/img/testing/star-6@3x.png");*/
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    height: 13px;
    width: 13.5px;
  }
  #testingEnd .testingEnd-title-charm-star img {
    height: 13px;
    width: 13.5px;
  }
  #testingEnd .testingEnd-title-left {
    display: inline-block;
    width: 59%;
    height: 75px;
    float: left;
  }
  #testingEnd .testingEnd-title-right {
    display: inline-block;
    height: 75px;
    width: 41%;
    float: left;
    text-align: center;
  }
  /*content*/
  #testingEnd .testingEnd-content {
    padding: 0 12px;
    font-size: 15px;
  }
  #testingEnd .testingEnd-content-top {
    height: 60px;
    color: #f0cf8d;
    border-bottom: 0.5px solid #756e6e;
    font-size: 14px;
    position: relative;
  }
  #testingEnd .testingEnd-content-left {
    float: left;
    width: 50%;
    display: inline-block;
    margin-top: 10px;
  }
  #testingEnd .testingEnd-reghtL-cont {
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /*内容超出宽度时隐藏超出部分的内容*/
    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
  }
  #testingEnd .testingEnd-content-left .testingEnd-leftL-cont {
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /*内容超出宽度时隐藏超出部分的内容*/
    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
  }
  #testingEnd .testingEnd-content-leftL {
    display: inline;
    background-color: rgba(0, 0, 0, 0.37);
  }
  #testingEnd .testingEnd-content-right {
    float: left;
    display: inline-block;
    width: 50%;
    margin-top: 10px;
  }
  #testingEnd .testingEnd-content-left span {
    color: white;
    font-size: 17px;
    padding: 0 3px 0 0;
    font-family: "PingFangSC-Regular, sans-serif;", Microsoft Yahei, Helvetica;
  }
  #testingEnd .testingEnd-content-right .testingEnd-content-rightTime {
    color: white;
    font-size: 14px;
    font-family: "PingFangSC-Regular, sans-serif;", Microsoft Yahei, Helvetica;
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/

  }
  #testingEnd .testingEnd-content-rightL {
    display: inline;
    background-color: rgba(0, 0, 0, 0.37);
  }
  #testingEnd .testingEnd-content-right div {
    margin-left: 15px;
    margin-top: 4px;
  }
  /*推荐阅读*/
  #testingEnd .testingEnd-content-middle {
    height: 50px;
    line-height: 50px;
    border-bottom: 0.5px solid #756e6e;
  }
  #testingEnd .testingEnd-content-middle-item {
    text-align: center;
    color: #f0cf8d;
  }
  #testingEnd .testingEnd-content-middle-text {
    padding: 0 24px;
  }
  #testingEnd .testingEnd-content-middle1, #testingEnd .testingEnd-content-middle2 {
    width: 60px;
    height: 1px;
    display: inline-block;
    border-bottom: 0.5px solid #f0cf8d;
    position: relative;
    top: -5px;
  }
  #testingEnd .testingEnd-content-middle1 div {
    height: 3px;
    width: 3px;
    background-color: #f0cf8d;
    position: absolute;
    border-radius: 50%;
    right: 0;
    top: 0;
  }
  #testingEnd .testingEnd-content-middle2 div {
    height: 3px;
    width: 3px;
    background-color: #f0cf8d;
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
  }
  /**/
  #testingEnd .testingEnd-content-list-st {
    font-size: 15px;
    padding: 12px 0;
    text-align: justify;
    color: #f0cf8d;
    border-bottom: 0.5px solid #756e6e;
    line-height: 20px;
  }
  /*雷达图样式调整*/
  #testingEnd .testingEnd-EChart-line {
    top: 0;
  }
  #testingEnd .testingEnd-EChart-radar-link, #testingEnd .testingEnd-EChart-line-link {
    font-size: 15px;
    color: #f0cf8d;
  }
  #testingEnd .testingEnd-radar-title, #testingEnd .testingEnd-line-title {
    position: absolute;
    top: 12px;
    left: 12px;
    background-color: rgba(240, 207, 141, 0.26);
    color: #f0cf8d;
    font-size: 15px;
    padding: 0 3px 0 2.5px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #testingEnd .testingEnd-EChart-radar-1 {
    position: absolute;
    top: 36px;
    left: 46%;
    font-size: 12px;
  }
  #testingEnd .testingEnd-EChart-radar-2 {
    position: absolute;
    top: 110px;
    font-size: 12px;
    left: 16.5%;
  }
  #testingEnd .testingEnd-EChart-radar-3 {
    position: absolute;
    bottom: 25px;
    left: 25.5%;
    font-size: 12px;
  }
  #testingEnd .testingEnd-EChart-radar-4 {
    position: absolute;
    bottom: 25px;
    left: 66%;
    font-size: 12px;
  }
  #testingEnd .testingEnd-EChart-radar-5 {
    position: absolute;
    top: 110px;
    font-size: 12px;
    left: 76%;
  }
  #testingEnd .testingEnd-EChart-radar-6 {
    position: absolute;
    top: 45%;
    width: 100%;
    display: inherit;
    margin: 0 auto;
    font-size: 13px
  }
  #testingEnd .testingEnd-EChart-radar-6 span {
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  /*折线图样式调整*/
  #testingEnd .testingEnd-footer-left {
    display: inline-block;
    width: 50%;
    height: 60px;
    text-align: center;
  }
  #testingEnd .leftIcon {
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
  #testLoading .leftIcon:active {
    background-color: #e4c077;
  }
  #testingEnd .testingEnd-footer-right {
    display: inline-block;
    width: 50%;
    height: 60px;
    text-align: center;
  }
  /**/
  #testingEnd .testEndFenXiang {
    z-index: 2000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    background: rgba(0, 0, 0, 0.8);
  }
  #testingEnd .testEndFenXiang div {
    background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/fenxiangT@3x.png");
    background-repeat: no-repeat;
    background-size: contain;
    width: 276.097px;
    height: 270px;
    margin: 35px auto 0 auto;
    margin-right: 25px;
  }
  #testingEnd .testPopup {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.9);

  }
  #testingEnd .testPopupBox {
    width: 260px;
    height: 237.5px;
    background: rgba(240, 207, 141, 0.24);
    margin: 35.2% auto 20px auto;
    border-radius: 16px;
    position: relative;
  }
  #testingEnd .testPopupBoxL {
    background-color: rgba(0, 0, 0, 0.8);
  }
  #testingEnd .testPopupIcon {
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
  #testingEnd .testTouxiang {
    justify-content: center;
    width: 64px;
    height: 64px;
    position: absolute;
    top: -46px;
    left: 38%;
  }
  #testingEnd .testTouxiang img {
    width: 64.5px;
    height: 64.5px;
    border-radius: 50%;
    padding: 0;
    margin: 0;
  }
  #testingEnd .testPopupLine {
    background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/touxiang12@3x_96.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 165px;
    height: 23.8594px;
    position: absolute;
    top: 8px;
    left: 19%;
  }
  #testingEnd .testPopupLine div {
    font-size: 14px;
    color: white;
    text-align: center;
  }
  #testingEnd .testPopupText {
    text-align: center;
    color: #f0cf8d;
    line-height: 30px;
    padding-top: 60px;
    font-size: 17px;
  }
  #testingEnd .testPopupText i {
    display: inherit;
    font-size: 20px;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  #testingEnd .testPopupJie {
    position: absolute;
    bottom: 35px;
    left: 10%;
    font-size: 17px;
    text-align: center;
    color: white;
  }
  #testingEnd .testPopupJie span {
    font-size: 25px;
    color: #f0cf8d;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    font-style: italic;
    padding-right: 2px;
  }
  #testingEnd .testPopupBtn {
    width: 150px;
    height: 40px;
    border-radius: 20px;
    background: rgba(240, 207, 141, 0.24);
    border: 0;
    display: -webkit-box;
    margin: 0 auto;
    color: #f0cf8d;
    font-size: 15px;

  }
  #testingEnd .testPopupBtn:active {
    background-color: rgba(240, 207, 141, 0.44);
  }
  /* @media (min-device-width: 375px)and (max-device-width: 667px)and (-webkit-min-device-pixel-ratio: 2){
       !*iphone6*!
       #testingEnd .testingEnd-title{
           height: 75px;
           width: 100%;
           position: relative;
       }
       #testingEnd .testingEnd-footer{
           position: absolute;
           bottom: 0;
           width: 100%;
           height: 60px;
           background-color: #2e2f33;
           font-size: 0;
       }
       !*头像*!
       #testingEnd .testingEnd-title .testingEnd-title-img{
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
       }
       #testingEnd .testingEnd-title-medal{
           background-image: url("/static/img/testing/medal@3x.png");
           background-size: 100% 100%;
           background-repeat: no-repeat;
           height: 16.5px;
           width: 14px;
       }
       #testingEnd .testingEnd-title-medal span{
           margin-left: 16.5px;
           display: inline-block;
           width: 130px;
           text-overflow: ellipsis;
           overflow: hidden;
           white-space: nowrap;
       }
       #testingEnd .testingEnd-title-name{
           display: inline-block;
           position: absolute;
           left: 67px;
           top: 50%;
           margin-top: -18px;
           font-size: 15px;
           color: #f0cf8d;
       }
       #testingEnd .testingEnd-title-charm{
           font-size: 15px;
           color: #f0cf8d;
           position: relative;
           top: 50%;
           margin-top: -18px;
       }
       #testingEnd .testingEnd-title-charm-icon{
           height: 26px;
       }
       #testingEnd .testingEnd-title-charm-star{
           background-repeat: no-repeat;
           background-size: 100% 100%;
           display: inline-block;
           height: 13px;
           width: 13.5px;
       }
       #testingEnd .testingEnd-title-left{
           display: inline-block;
           width: 59%;
           height: 75px;
           float: left;
       }
       #testingEnd .testingEnd-title-right{
           display: inline-block;
           height: 75px;
           width: 41%;
           float: left;
           text-align: center;
       }
       !*content*!
       #testingEnd .testingEnd-content{
           padding: 0 12px;
           font-size: 15px;
       }
       #testingEnd .testingEnd-content-top{
           height: 60px;
           color: #f0cf8d;
           font-size: 14px;
           position: relative;
       }
       #testingEnd .testingEnd-content-left{
           float: left;
           width: 50%;
           display: inline-block;
           margin-top: 10px;
       }
       #testingEnd .testingEnd-content-leftL{
           display: inline;
           background-color: rgba(0, 0, 0, 0.37);
       }
       #testingEnd .testingEnd-content-right{
           float: left;
           display: inline-block;
           width: 50%;
           margin-top: 10px;
       }
       #testingEnd .testingEnd-content-left span{
           color: white;
           font-size: 17px;
       }
       #testingEnd .testingEnd-content-right .testingEnd-content-rightTime{
           color: white;
           font-size: 14px;
       }
       #testingEnd .testingEnd-content-rightL{
           display: inline;
           background-color: rgba(0, 0, 0, 0.37);
       }
       #testingEnd .testingEnd-content-right div{
           margin-left: 15px;
           margin-top: 4px;
       }
       !*推荐阅读*!
       #testingEnd .testingEnd-content-middle{
           height: 50px;
           line-height: 50px;
           border-bottom: 0.5px solid #756e6e;
           border-top: 0.5px solid #756e6e;
       }
       #testingEnd .testingEnd-content-middle-item{
           text-align: center;
           color: #f0cf8d;
       }
       #testingEnd .testingEnd-content-middle-text{
           padding: 0 24px;
       }
       #testingEnd .testingEnd-content-middle1, #testingEnd .testingEnd-content-middle2{
           width: 60px;
           height: 1px;
           display: inline-block;
           border-bottom: 0.5px solid #f0cf8d;
           position: relative;
           top: -5px;
       }
       #testingEnd .testingEnd-content-middle1 div{
           height: 3px;
           width: 3px;
           background-color: #f0cf8d;
           position: absolute;
           border-radius: 50%;
           right: 0;
           top: 0;
       }
       #testingEnd .testingEnd-content-middle2 div{
           height: 3px;
           width: 3px;
           background-color: #f0cf8d;
           position: absolute;
           border-radius: 50%;
           left: 0;
           top: 0;
       }
       !**!
       #testingEnd .testingEnd-content-list-st{
           font-size: 15px;
           padding: 12px 0;
           text-align: justify;
           color: #f0cf8d;
           border-bottom: 0.5px solid #756e6e;
           line-height: 20px;
       }
       !*雷达图样式调整*!
       #testingEnd .testingEnd-EChart-radar, #testingEnd .testingEnd-EChart-line{
           width: 375px;
           margin: 0 auto;
           height: 255px;
           position: absolute;
           top: 0px;
           z-index: 800;
           !*color: #f0cf8d;*!
           !*background: rgba(240,207,141,0.26);*!
           overflow: hidden;
       }
       #testingEnd .testingEnd-EChart-line{
           top: 0;
       }
       #testingEnd .testingEnd-EChart-radar-link, #testingEnd .testingEnd-EChart-line-link{
           font-size: 15px;
           color: #f0cf8d;
       }
       #testingEnd .testingEnd-radar-title, #testingEnd .testingEnd-line-title{
           position: absolute;
           top: 12px;
           left: 12px;
           background-color: rgba(240, 207, 141, 0.26);
           color: #f0cf8d;
           font-size: 15px;
           padding: 0 3px 0 2.5px;
           font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
       }
       #testingEnd .testingEnd-EChart-radar-1{
           position: absolute;
           top: 36px;
           left: 46%;
           font-size: 12px;
       }
       #testingEnd .testingEnd-EChart-radar-2{
           position: absolute;
           top: 105px;
           font-size: 12px;
           left: 16.5%;
       }
       #testingEnd .testingEnd-EChart-radar-3{
           position: absolute;
           bottom: 31px;
           left: 25.5%;
           font-size: 12px;
       }
       #testingEnd .testingEnd-EChart-radar-4{
           position: absolute;
           bottom: 30px;
           right: 26%;
           font-size: 12px;
       }
       #testingEnd .testingEnd-EChart-radar-5{
           position: absolute;
           top: 105px;
           font-size: 12px;
           right: 17%;
       }
       !*折线图样式调整*!
       #testingEnd .testingEnd-footer-left{
           display: inline-block;
           width: 50%;
           height: 60px;
       }
       #testingEnd .testingEnd-footer-right{
           display: inline-block;
           width: 50%;
           height: 60px;
       }
       !**!
       #testingEnd .testEndFenXiang{
           z-index: 2000;
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           overflow: hidden;
           -webkit-overflow-scrolling: touch;
           background: rgba(0, 0, 0, 0.8);
       }
       #testingEnd .testEndFenXiang div{
           background: url("/static/img/testing/fenxiangT@3x.png");
           background-repeat: no-repeat;
           background-size: 100% 100%;
           width: 276.097px;
           height: 270px;
           margin: 35px 0 0 16%;
       }
   }
   @media (min-device-width: 414px)and (max-device-width: 736px)and (-webkit-min-device-pixel-ratio: 3){
       !*iphone6 plus*!
       #testingEnd .testingEnd-EChart-radar, #testingEnd .testingEnd-EChart-line{
           width: 414px;
           margin: 0 auto;
           height: 255px;
           position: absolute;
           top: 0;
           z-index: 800;
           !*color: #f0cf8d;*!
           !*background: rgba(240,207,141,0.26);*!
           overflow: hidden;
       }
       #testingEnd .testingEnd-EChart-radar-1{
           position: absolute;
           top: 36px;
           left: 46.5%;
           font-size: 12px;

       }
       #testingEnd .testingEnd-EChart-radar-2{
           position: absolute;
           top: 105px;
           font-size: 12px;
           left: 20%;
       }
       #testingEnd .testingEnd-EChart-radar-3{
           position: absolute;
           bottom: 31px;
           left: 28.5%;
           font-size: 12px;
       }
       #testingEnd .testingEnd-EChart-radar-4{
           position: absolute;
           bottom: 31px;
           right: 27%;
           font-size: 12px;
       }
       #testingEnd .testingEnd-EChart-radar-5{
           position: absolute;
           top: 105px;
           font-size: 12px;
           right: 20%;
       }
   }*/
</style>
