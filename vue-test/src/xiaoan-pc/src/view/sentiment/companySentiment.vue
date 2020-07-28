<template>
  <div id="companySentiment">
    <div id="company-header">
      <div class="content">
        <div class="company-title">
          <h2>公司舆情</h2>
          <p>{{companyName}}&nbsp;&nbsp;{{companyCode}}</p>
        </div>
        <div class="company-tools row2">
          <div class="company-tools-row">
            <span><a href="#" class="company-btn active">概况</a></span>
            <span><a :href="listUrl" class="company-btn">列表</a></span>
          </div>
          <div class="company-tools-row">
            <span><a @click="subscribeSettings = true"><i class="iconfont web-dingyueshezhi"></i>订阅设置</a></span>
            <span><a :href="reportUrl" target="_blank"><i class="iconfont web-dingyueshezhi"></i>生成报告</a></span>
          </div>
        </div>
      </div>
    </div>
    <div id="company-body">
      <div class="content">
        <div class="el-row">

          <div class="el-col el-col-6" v-for="card in cardInfo" v-loading="countSentimentsLading">
            <div class="el-card company-card">
              <div class="company-card-header">
                <div class="company-card-title">{{card.title}}</div>
                <div v-if="card.more" class="company-card-link"><a :href="card.path" target="_blank">更多 <i
                  class="el-icon-arrow-right"></i></a></div>
              </div>
              <div class="company-card-body">
                <div class="card-body-left">
                  <div v-if="card.title == '负面占比'" class="card-body-number">
                    <div v-if="card.num > 20" style="color: red">
                      {{card.num}}%
                    </div>
                    <div v-else>
                      {{card.num}}%
                    </div>
                  </div>
                  <div v-else class="card-body-number">
                    <div v-if="card.length < 5">
                      {{getNumS(card.num)}}
                    </div>
                    <div v-if="card.length > 4 && card.length < 9">
                      {{getNumS(card.num)}}<span class="numUnit">万</span>
                    </div>
                    <div v-if="card.length > 11">
                      {{getNumS(card.num)}}<span class="numUnit">万+</span>
                    </div>
                  </div>
                  <div class="card-body-date">更新于{{ dateFormat(card.datetime)}}
                  </div>
                </div>
                <div v-if="card.title != '负面占比'" class="">
                  <div class="card-body-right">
                    <div v-if="card.proportion >= 0" class="card-body-change rise">
                      <i class="iconfont web-rise"></i>
                      {{getZero(card.proportion)}}%
                    </div>

                    <div v-else-if="card.proportion < 0" class="card-body-change fall">
                      <i class="iconfont web-fall"></i>
                      {{getZero(card.proportion)}}%
                    </div>
                    <div class="card-body-tips">较7日均值</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="el-row">
          <div class="el-col el-col-12" v-loading="companySummaryLading">
            <div class="el-card company-card">
              <div class="company-card-header">
                <div class="company-card-title">舆情走势</div>
                <div class="company-card-select">
                  <div class="senior-row seniorDate seniorPanel">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="startDate" type="date" @input="changeHandler"
                                    placeholder="选择日期"
                                    :editable="false" :clearable="false"
                                    :picker-options="pickerOptions1"></el-date-picker>
                  </div>
                </div>
              </div>
              <div id="brokenLineBox">
                <div class="company-card-body" id="brokenLine" style="height:310px;">
                  <div class="chart-right"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="el-col el-col-12" v-loading="chartSentimentLading">
            <div class="el-card company-card">
              <div class="company-card-header">
                <div class="company-card-title">公司舆情热点关键词</div>
                <div class="company-card-select">
                  <el-select size="mini" v-model="keywordVal" @change="getKeywordChart" placeholder="请选择">
                    <el-option v-for="item in keywordDate"
                               :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div id="brokenKeywordBox">
                <div class="company-card-body" id="brokenKeyword" style="height:310px;">
                  <div class="echart-word"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="el-col el-col-12" v-loading="chartSourceLading">
            <div class="el-card company-card">
              <div class="company-card-header">
                <div class="company-card-title">来源统计</div>
                <div class="company-card-select">
                  <el-select size="mini" v-model="sourceVal" @change="getChannelChart" placeholder="请选择">
                    <el-option v-for="item in sourceDate" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div id="brokenSourceBox">
                <div class="company-card-body" v-show="brokenSourceInfo" id="brokenSource" style="height:300px;">
                  <div class="echart-word"></div>
                </div>
                <div class="company-card-body" v-show="brokenSourceNoInfo" style="height:300px;">
                  <no-info></no-info>
                </div>
              </div>
            </div>
          </div>

          <div class="el-col el-col-12" v-loading="chartChannelLading">
            <div class="el-card company-card">
              <div class="company-card-header">
                <div class="company-card-title">渠道分析</div>
                <div class="company-card-select">
                  <el-select size="mini" v-model="channelVal" @change="getBrokenChart" placeholder="请选择">
                    <el-option v-for="item in channelDate" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div id="brokenChannelBox">
                <div class="company-card-body" v-show="brokenChannelInfo" id="brokenChannel" style="height:300px;">
                  <div class="chart-right"></div>
                </div>
                <div class="company-card-body" v-show="brokenChannelNoInfo" style="height:300px;">
                  <no-info></no-info>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <subscribe v-model="subscribeSettings" @close="closeSubscribe" @resetSubscribe="resetSubscribes"></subscribe>
  </div>
</template>
<script>
  import Subscribe from './components/subscribe';
  import NoInfo from "../../components/noInfo.vue";
  export default {
    name: "companySentiment",
    components: {
      Subscribe,
      NoInfo
    },
    data() {
      return {
        companySummaryLading: false,
        chartSentimentLading: false,
        chartChannelLading: false,
        chartSourceLading: false,
        countSentimentsLading: false,
        brokenChannelNoInfo: false,
        brokenChannelInfo: true,
        brokenSourceNoInfo: false,
        brokenSourceInfo: true,
        industry: "industry",
        startDate: '',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          }, {
            text: '一月前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }]
        },
        eName: "舆情监控",
        userId: "",
        userInfo: {},
        companyName: "",
        companyCode: "",
        subscribeSettings: false,
        overviewUrl: '/sentiment/companySentiment',
        listUrl: '/sentiment/companySentimentList',
        reportUrl: '/sentiment/sentimentMonitorReport',
        ChannelX: [],
        ChannelSeriesZ: [],
        ChannelSeriesS: [],
        ChannelSeriesF: [],
        LineX: [],
        LineSeriesZ: [],
        LineSeriesS: [],
        LineSeriesF: [],
        BrokenX: [],
        BrokenY: [],
        cardInfo: [
          {
            title: '实时舆情',
            path: '',
            num: '',
            proportion: '',
            datetime: '',
            change: 'rise',
            length: '',
            more: true
          },
          {
            title: '负面舆情',
            path: '',
            num: '',
            proportion: '',
            datetime: '',
            change: 'fall',
            length: '',
            more: true
          },
          {
            title: '媒体声量',
            path: '#',
            num: '',
            proportion: '',
            datetime: '',
            change: 'rise',
            length: '',
            more: false
          },
          {
            title: '负面占比',
            path: '#',
            num: '',
            proportion: '',
            datetime: '',
            change: 'rise',
            length: '',
            more: false
          }],
        keywordVal: '30',
        keywordDate: [{
          value: '30',
          label: '近30日'
        }, {
          value: '90',
          label: '近90日'
        }, {
          value: '365',
          label: '今年'
        }],
        sourceVal: 'Seven_days',
        sourceDate: [{
          value: 'Now',
          label: '今日'
        }, {
          value: 'Seven_days',
          label: '近7日'
        }, {
          value: 'Thirty_days',
          label: '近30日'
        }],
        channelVal: 'Seven_days',
        channelDate: [{
          value: 'Now',
          label: '今日'
        }, {
          value: 'Seven_days',
          label: '近7日'
        }, {
          value: 'Thirty_days',
          label: '近30日'
        }]

      }
    },
    created() {
      this.userId = this.$cookie.get("userId");
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      if (this.userInfo.enterpriseUser) {
        this.companyCode = this.userInfo.enterpriseCompanyCode;
        this.companyName = this.userInfo.enterpriseCompanyName;
      } else {
        this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
      }

      this.getCardInfo();
      var todoy = new Date();
      this.startDate = this.getNowFormatDate(todoy);
      console.log(this.startDate);

      this.cardInfo[0].path = "/sentiment/companySentimentList?startDate=" + this.startDate + "&endDate=" + this.startDate;
      this.cardInfo[1].path = decodeURIComponent("/sentiment/companySentimentList?tendency=" + encodeURI(encodeURI("负面")) + "&startDate=" + this.startDate + "&endDate=" + this.startDate);
    },
    mounted() {
      this.getChannelChart()
      this.getLineChart()
      this.getBrokenChart()
      this.getKeywordChart()
    },
    methods: {
      changeHandler() {
        this.getLineChart();
      },
      initData() {
        if (this.userInfo.companyId === null || this.userInfo.companyId === "") {
          this.$message({
            showClose: true,
            type: "error",
            message: "非公司用户！"
          });
        } else {
          this.newsData = {
            currentPage: 1,
            list: []
          };
          this.bbsData = {currentPage: 1, list: []};
          this.announcementData = {currentPage: 1, list: []};
          this.reportData = {currentPage: 1, list: []};
          this.interactData = {currentPage: 1, list: []};
          this.distributedDateType = "1";
          this.countDateType = "7";
          this.$http({
            method: "GET",
            url: this.$api.manage.companyInfo,
            params: {
              companyId: this.userInfo.companyId
            }
          }).then(res => {
            if (res.data.returnCode === 1) {
              let {companyCode} = res.data.returnObject;
              let {companyName} = res.data.returnObject;
              // console.log("用户",res.data.returnObject)
              this.companyCode = companyCode;
              this.companyName = companyName;
            }
          });
        }
      },
      closeSubscribe() {
        this.subscribeSettings = false;
      },
      resetSubscribes() {
        this.subscribeSettings = false;
      },
      initLineChart() {
        var brokenLineOption;
        var brokenLineMyChart = document.getElementById('brokenLine');

        // 自适应宽高
        var myChartContainer = function () {
          brokenLineMyChart.width = document.getElementById("brokenLineBox").offsetWidth + 'px';
        };

        myChartContainer();

        brokenLineMyChart = echarts.init(brokenLineMyChart);
        let option = {
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            fontSize: 12,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: true,
                precision: 0
              },
//                            type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (params, ticket, callback) {
              var htmlStr = '';
              for (var i = 0; i < params.length; i++) {
                var param = params[i];
                var xName = param.name;
                var seriesName = param.seriesName;
                var value = param.value;
                var color = param.color;

                if (i === 0) {
                  htmlStr += xName + '<br/>';
                }
                htmlStr += '<div>';
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';

                htmlStr += seriesName + '：' + Math.abs(value);

                htmlStr += '</div>';
              }
              return htmlStr;
            }
          },
          legend: {
            x: 'left',
            left: '6%',
            data: ['正面', '中性', '负面']
          },
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              axisTick: {
                show: false,
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                show: false,
                lineStyle: {
                  color: "#323232"
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#f6f6f6"
                }
              },
              boundaryGap: false,
              data: this.LineX
            }
          ],
          color: ['#ffe0b6', '#ffb148', '#d96d24'],
          grid: {
            top: 40,
            left: '7%',
            right: 15,
            bottom: '10%',
            containLabel: false
          },
          yAxis: [
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: (val) => {
                  var count = Math.abs(val)
                  var leng = count.toString().length;
                  var res
                  var i
                  var decimal
                  if (leng > 4 && leng < 9) {
                    i = count / 10000;
                    i = String(i).split(".")[0]

                    decimal = count % 10000 / 1000;
                    decimal = String(decimal).substring(0, 1);

                    res = parseFloat(i + '.' + decimal) + '万';
                  }
                  if (leng > 8) {
                    i = count / 100000000;
                    i = String(i).split(".")[0]
                    console.log('count-i', i)

                    var a = count % 100000000 / 10000000;
                    decimal = String(a).substring(0, 1);
                    console.log('count-decimal', decimal)

                    res = parseFloat(i + '.' + decimal) + '亿';
                  }
                  if (leng < 5) {
                    res = count
                  }

                  return res
                }
              },
              axisTick: {
                length: 0,
                show: false
              },
              axisLine: {
                symbolSize: [0, 0],
                show: false,
                lineStyle: {
                  color: "#f6f6f6"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#f6f6f6"
                }
              }
            }
          ],
          series: [
            {
              name: '正面',
              type: 'line',
//                            symbol: "none",
              smooth: true,
              stack: '总量',
              areaStyle: {},
              data: this.LineSeriesZ
            },
            {
              name: '中性',
              type: 'line',
//                            symbol: "none",
              smooth: true,
              stack: '总量',
              areaStyle: {},
              data: this.LineSeriesS
            },
            {
              name: '负面',
              type: 'line',
//                            symbol: "none",
              smooth: true,
              stack: '总量',
              areaStyle: {},
              data: this.LineSeriesF
            }
          ]
        };
        brokenLineOption = option;
        brokenLineMyChart.setOption(brokenLineOption);

        brokenLineMyChart.on('click', (item) => {
          console.log(item.name);
          var str = item.name;
          var todoy = new Date();
          var endDate = '2018-' + str.replace(/\//g, "-");
//                    var startDate = this.getSevenDay(endDate);
          var startDate = endDate;
          window.open('_blank').location = decodeURIComponent("/sentiment/companySentimentList?tendency=" + encodeURI(encodeURI(item.seriesName)) + "&startDate=" + startDate + "&endDate=" + endDate);
        });

        window.onresize = function () {
          myChartContainer();
          brokenLineMyChart.resize();
        };
      },
      initChannelChart() {
        var _this = this;
        var brokenLineOption;
        var brokenLineMyChart = document.getElementById('brokenChannel');

        // 自适应宽高
//                var myChartContainer = function () {
//                    brokenLineMyChart.width = document.getElementById("brokenChannelBox").offsetWidth + 'px';
//                };
//
//                myChartContainer();

        brokenLineMyChart = echarts.init(brokenLineMyChart);
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
//                            type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            top: '20%',
            // align:'auto',
            left: '74%',
            itemGap: 30,
            series: [
              {
                showVal: true

              }],
            data: this.BrokenX,
            formatter: function (val) {
              var arr = _this.BrokenY;
              var valueArr;
              arr.forEach((arr) => {
                if (arr.name == val) {
                  valueArr = arr.value;
                }
              })
              console.log(val, arr)
              return val + ':  ' + valueArr + '%'
            }
          },
          color: ['#ffe0b6', '#ffb148', '#d96d24', '#4A4961'],
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '60%'],
              center: ['38%', '60%'],
              labelLine: {
                normal: {
                  lineStyle: {
                    color: '#999'
                  },
                  length: 20,
                  length2: 60
                }
              },
              label: {
                normal: {
                  formatter: '{b|{d}%} {a|{b}}\n\n',
                  color: "#000000",
                  fontSize: 15,
                  borderWidth: 20,
                  borderRadius: 4,
                  padding: [5, -70, 1],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    b: {
                      color: '#000000',
                      align: 'right',
                      lineHeight: 12,
                      fontSize: 12
                    }
                  }
                }
              },
              data: this.BrokenY
            }
          ]
        };
        brokenLineOption = option;
        brokenLineMyChart.setOption(brokenLineOption);
        brokenLineMyChart.on('click', (item) => {
          var dateStr = this.channelVal;
          console.log(dateStr)
          var todoy = new Date();
          var nowdate;
          if (dateStr == 'Seven_days') {
            nowdate = new Date(todoy - 7 * 24 * 3600 * 1000);
          } else if (dateStr == 'Thirty_days') {
            nowdate = new Date(todoy - 30 * 24 * 3600 * 1000);
          } else if (dateStr == 'Now') {
            nowdate = new Date();
          }
          var startDate = this.getNowFormatDate(nowdate);
          var endDate = this.getNowFormatDate(todoy);
          window.open('_blank').location = decodeURIComponent("/sentiment/companySentimentList?mediaType=" + encodeURI(encodeURI(item.name)) + "&startDate=" + startDate + "&endDate=" + endDate);
        });
        window.onresize = function () {
//                    myChartContainer();
          brokenLineMyChart.resize();
        };
      },
      initBrokenSource() {
        var brokenLineOption;
        var brokenLineMyChart = document.getElementById('brokenSource');

        // 自适应宽高
        var myChartContainer = function () {
          brokenLineMyChart.width = document.getElementById("brokenSourceBox").offsetWidth + 'px';
        };

        myChartContainer();

        brokenLineMyChart = echarts.init(brokenLineMyChart);
//                var color = ['#FFB148', '#FFD091', '#D96D24'];
        let option = {
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            fontSize: 12,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: true,
                precision: 0
              },
//                            type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (params, ticket, callback) {
              var htmlStr = '';
              for (var i = 0; i < params.length; i++) {
                var param = params[i];
                var xName = param.name;
                var seriesName = param.seriesName;
                var value = param.value;
                var color = param.color;

                if (i === 0) {
                  htmlStr += xName + '<br/>';
                }
                htmlStr += '<div>';
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';

                htmlStr += seriesName + '：' + Math.abs(value);

                htmlStr += '</div>';
              }
              return htmlStr;
            }
          },
          legend: {
            top: 6,
            x: 'left',
            left: '6%',
            data: ['正面', '中性', '负面']
//                        data: ['负面', '中性', '正面']
          },
          grid: {
            top: 40,
            left: '7%',
            right: 15,
            bottom: '25%',
            containLabel: false
          },
          yAxis: [
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: (val) => {
                  var count = Math.abs(val)
                  var leng = count.toString().length;
                  var res
                  var i
                  var decimal
                  if (leng > 4 && leng < 9) {
                    i = count / 10000;
                    i = String(i).split(".")[0]

                    decimal = count % 10000 / 1000;
                    decimal = String(decimal).substring(0, 1);

                    res = parseFloat(i + '.' + decimal) + '万';
                  }
                  if (leng > 8) {
                    i = count / 100000000;
                    i = String(i).split(".")[0]
                    console.log('count-i', i)

                    var a = count % 100000000 / 10000000;
                    decimal = String(a).substring(0, 1);
                    console.log('count-decimal', decimal)

                    res = parseFloat(i + '.' + decimal) + '亿';
                  }
                  if (leng < 5) {
                    res = count
                  }

                  return res
                }
              },
              axisTick: {
                show: false,
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                show: false,
                lineStyle: {
                  color: "#f6f6f6"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#f6f6f6"
                }
              }
            }
          ],
          color: ['#d96d24', '#ffb148', '#ffe0b6'],
          xAxis: {
            type: 'category',
            axisLabel: {
              rotate: 45,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            axisTick: {
              show: false,
              length: 0
            },
            axisLine: {
              symbolSize: [0, 0],
              show: false,
              lineStyle: {
                color: "#323232"
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#f6f6f6"
              }
            },
            data: this.ChannelX
          },
          series: [
            {
              name: '负面',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 0,
                  borderWidth: 0
                }
              },
              data: this.ChannelSeriesF
            },
            {
              name: '中性',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 0,
                  borderWidth: 0
                }
              },
              data: this.ChannelSeriesS
            },
            {
              name: '正面',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 0,
                  borderWidth: 0
                }
              },
              data: this.ChannelSeriesZ
            }
          ]
        };
        brokenLineOption = option;
        brokenLineMyChart.setOption(brokenLineOption);
        brokenLineMyChart.on('click', (item) => {
          var dateStr = this.sourceVal;
          var todoy = new Date();
          var nowdate;
          if (dateStr == 'Seven_days') {
            nowdate = new Date(todoy - 7 * 24 * 3600 * 1000);
          } else if (dateStr == 'Thirty_days') {
            nowdate = new Date(todoy - 30 * 24 * 3600 * 1000);
          } else if (dateStr == 'Now') {
            nowdate = new Date();
          }
          var startDate = this.getNowFormatDate(nowdate);
          var endDate = this.getNowFormatDate(todoy);
          window.open('_blank').location = decodeURIComponent("/sentiment/companySentimentList?media=" + encodeURI(encodeURI(item.name)) + "&tendency=" + encodeURI(encodeURI(item.seriesName)) + "&startDate=" + startDate + "&endDate=" + endDate);
        });
        window.onresize = function () {
          myChartContainer();
          brokenLineMyChart.resize();
        };
      },
      initKeywordChart(datas) {
        var that = this;
        var brokenLineOption;
        var brokenLineMyChart = document.getElementById('brokenKeyword');

        // 自适应宽高
        var myChartContainer = function () {
          brokenLineMyChart.width = document.getElementById("brokenKeywordBox").offsetWidth + 'px';
        };

        myChartContainer();

        brokenLineMyChart = echarts.init(brokenLineMyChart);
        var color = ['#738BFF', '#FFB164', '#FFB09C', '#5A587F'];
        let option = {
          background: '#fff',
          series: [{
            type: 'wordCloud',
            left: 'center',
            top: '5%',
            width: '90%',
            height: '90%',
            right: 'center',
            bottom: '5%',
            sizeRange: [18, 36],
            rotationRange: [0, 45],
            gridSize: 12,
            drawOutOfBound: false,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: '400',
                color: () => {
                  return color[parseInt(Math.random() * 4)];
                }
              },
              emphasis: {
                fontSize: 40,
                shadowBlur: 20,
//                                backgroundColor: 'transparent',
                shadowColor: '#f8f8f8',
                shadowOffsetX: 0,
                shadowOffsetY: 0
              }
            },
            data: datas
          }]
        };
        brokenLineOption = option;
        brokenLineMyChart.setOption(brokenLineOption);

        brokenLineMyChart.on('click', (item) => {
          var dateStr = this.keywordVal;
          var todoy = new Date();
          var nowdate;
          if (dateStr == '30') {
            nowdate = new Date(todoy - 30 * 24 * 3600 * 1000);
          } else if (dateStr == '90') {
            nowdate = new Date(todoy - 90 * 24 * 3600 * 1000);
          } else if (dateStr == '365') {
            nowdate = new Date(todoy - 365 * 24 * 3600 * 1000);
          }
          var startDate = this.getNowFormatDate(nowdate);
          var endDate = this.getNowFormatDate(todoy);
          window.open('_blank').location = decodeURIComponent("/sentiment/companySentimentList?inputKeyword=" + encodeURI(encodeURI(item.name)) + "&startDate=" + startDate + "&endDate=" + endDate);
        });

        window.onresize = function () {
          myChartContainer();
          brokenLineMyChart.resize();
        };
      },
      getChannelChart() {
        var _this = this;
        _this.chartSourceLading = true;
        _this.$axios.sentiment.chartSourceStatistics({
          daysEnum: String(this.sourceVal),
          companyId: String(this.userInfo.companyId)
        }).then(function (res) {
          setTimeout(() => {
            _this.chartSourceLading = false;
          }, 300);
          if (res.data.returnMsg == "success") {
            if (res.data.returnObject.xAxis.length > 0 || res.data.returnObject.series.length > 0) {
              _this.brokenSourceInfo = true
              _this.brokenSourceNoInfo = false
              var negative = [];
              var arr = res.data.returnObject.series['负面'];
              for (var i = 0; i < arr.length; i++) {
                negative.push(-(arr[i]));
              }
              _this.ChannelX = res.data.returnObject.xAxis;
              _this.ChannelSeriesZ = res.data.returnObject.series['正面'];
              _this.ChannelSeriesS = res.data.returnObject.series['中性'];
              _this.ChannelSeriesF = negative;
              _this.initBrokenSource();
            } else {
              _this.brokenSourceInfo = false
              _this.brokenSourceNoInfo = true
            }
          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }

        }, function (response) {
        })
      },
      getLineChart() {
        var _this = this;
        _this.companySummaryLading = true;
        _this.$axios.sentiment.chartSentimentTrend({
          endDate: String(this.startDate),
          companyId: String(this.userInfo.companyId)
        }).then(function (res) {
          setTimeout(() => {
            _this.companySummaryLading = false;
          }, 300);
          if (res.data.returnCode == -1) {
            console.log(res.data.returnCode)
          } else if (res.data.returnCode == 1) {
            _this.LineX = res.data.returnObject.lineData.xAxis;
            _this.LineSeriesZ = res.data.returnObject.lineData.series['正面'];
            _this.LineSeriesS = res.data.returnObject.lineData.series['中性'];
            _this.LineSeriesF = res.data.returnObject.lineData.series['负面'];
            _this.initLineChart();
          }

        }, function (response) {
        })
      },
      getBrokenChart() {
        var _this = this;
        _this.chartChannelLading = true;
        console.log(this.channelVal)
        _this.$axios.sentiment.chartChannelAnalysis({
          daysEnum: String(this.channelVal),
          companyId: String(this.userInfo.companyId)
        }).then(function (res) {
          setTimeout(() => {
            _this.chartChannelLading = false;
          }, 300);
          var data = res.data.returnObject;
          var arri = Object.keys(data);
          if (arri.length != 0) {
            _this.brokenChannelInfo = true
            _this.brokenChannelNoInfo = false
            var obj = res.data.returnObject;
            var arr = [];
            var name = [];
            Object.keys(obj).forEach(function (key, i, v) {
              arr.push({"value": obj[key], "name": key});
              name.push(key);
            })
            console.log('name', name)
            console.log('arr', arr)
            _this.BrokenX = name;
            _this.BrokenY = arr;
            _this.initChannelChart();
          } else {
            _this.brokenChannelInfo = false
            _this.brokenChannelNoInfo = true
          }
        }, function (response) {
        })
      },
      getKeywordChart() {
        var _this = this;
        _this.chartSentimentLading = true;
        _this.$axios.sentiment.hotWords({
          type: String(this.industry),
          companyId: String(this.userInfo.companyId),
          scope: String(this.keywordVal)
        }).then(function (res) {
          setTimeout(() => {
            _this.chartSentimentLading = false;
          }, 300);
          var obj = res.data.returnObject;
          var arr = [];
          var name = [];
          Object.keys(obj).forEach(function (key, i, v) {
            arr.push({name: obj[i]['word'], value: obj[i]['num']});
            name.push(key);
          })
          _this.initKeywordChart(arr)
        }, function (response) {
        })
      },
      getNowFormatDate(date) {
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      dateFormat(time) {
        var date = new Date(time);
        var year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds;
      },
      getCardInfo() {
        var _this = this;
        _this.countSentimentsLading = true;
        _this.$axios.sentiment.countSentiments({
          companyId: String(this.userInfo.companyId)
        }).then(function (res) {
          setTimeout(() => {
            _this.countSentimentsLading = false;
          }, 300);

          _this.cardInfo[0].num = res.data.returnObject.realTimeSentiment.realTimeCount;
          _this.cardInfo[0].proportion = res.data.returnObject.realTimeSentiment.realRingRatio;
          _this.cardInfo[0].datetime = res.data.returnObject.realTimeSentiment.updateTime;
          _this.cardInfo[0].length = res.data.returnObject.realTimeSentiment.realTimeCount.toString().length;

          _this.cardInfo[1].num = res.data.returnObject.negativeSentiment.negativeCount;
          _this.cardInfo[1].proportion = res.data.returnObject.negativeSentiment.negativeRingRatio;
          _this.cardInfo[1].datetime = res.data.returnObject.negativeSentiment.updateTime;
          _this.cardInfo[1].length = res.data.returnObject.negativeSentiment.negativeCount.toString().length;

          _this.cardInfo[2].num = res.data.returnObject.mediaVolumeSentiment.mediaVolumeJsonCount;
          _this.cardInfo[2].proportion = res.data.returnObject.mediaVolumeSentiment.mediaVolumeJsonRatio;
          _this.cardInfo[2].datetime = res.data.returnObject.mediaVolumeSentiment.updateTime;
          _this.cardInfo[2].length = res.data.returnObject.mediaVolumeSentiment.mediaVolumeJsonCount.toString().length;

          _this.cardInfo[3].num = res.data.returnObject.changeIndexSentiment.changeIndex;
          _this.cardInfo[3].datetime = res.data.returnObject.mediaVolumeSentiment.updateTime;
          _this.cardInfo[3].length = res.data.returnObject.changeIndexSentiment.changeIndex.toString().length;
          console.log(_this.cardInfo)
        }, function (response) {
        })
      },
      getSevenDay(str) {
        var date = new Date(str);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        if (day <= 7) {
          if (month > 1) {
            month = month - 1;
          } else {
            year = year - 1;
            month = 12;
          }
        }
        date.setDate(date.getDate() - 7);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        return year + "-" + month + "-" + day;
      },
      getNumS(count) {
        var leng = count.toString().length;
        var res
        var i
        var decimal

        if (leng > 11) {
          res = '9999999';
        } else if (leng > 4 && leng < 9) {
          i = count / 10000;
          i = String(i).split(".")[0]

          decimal = count % 10000 / 1000;
          decimal = String(decimal).substring(0, 1);

          res = parseFloat(i + '.' + decimal);
        } else if (leng < 5) {
          res = count
        }

        return res
      },
      getZero(num) {
        if (num == '' || num == null) {
          num = 0;
        }
        return num;
      }
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>

  #company-header {
    background: url(../../assets/image/sentiment/company-slogan@2x.png) no-repeat center;
    width: 100%;
    height: 150px;
    color: #fff;
    font-size: 16px;
    background-size: 100% 100%;
    .company-title {
      display: table-cell;
      vertical-align: middle;
      float: left;
      height: 64px;
      margin: 43px 0;
      h2 {
        margin: 0;
        font-size: 30px;
        line-height: 42px;
      }
    }
    .company-title-only {
      display: table-cell;
      vertical-align: middle;
      float: left;
      height: 42px;
      margin: 54px 0;
      h2 {
        margin: 0;
        font-size: 30px;
        line-height: 42px;
      }
    }
    .company-title p {
      margin: 0;
      font-size: 16px;
      line-height: 22px;
    }
    .company-tools {
      display: table-cell;
      vertical-align: middle;
      text-align: right;
      float: right;
      &.row1 {
        height: 26px;
        margin: 62px 0;
      }
      &.row2 {
        height: 50px;
        margin: 50px 0;
      }
      .company-tools-row {
        height: 24px;
        margin-bottom: 5px;
      }
      a {
        color: #fff;
        cursor: pointer;
      }
      span:first-child {
        margin-right: 10px;
      }
      .iconfont {
        margin-right: 6px;
      }
      .company-btn {
        display: inline-block;
        width: 60px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        font-size: 14px;
        border-radius: 4px;
        background-color: rgba(255, 177, 72, 0.2);
        border: 1px solid #FFB148;
        color: #FFB148;
        &.active {
          background-color: #FFB148;
          border: 1px solid transparent;
          color: #fff;
        }
      }
    }
  }
  .icon-dingyueshezhi {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    background: url(../../assets/image/sentiment/icon/icon-dingyueshezhi.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-shengchengbiaoge {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    background: url(../../assets/image/sentiment/icon/icon-shengchengbiaoge.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-rise {
    display: inline-block;
    width: 3px;
    height: 12px;
    position: relative;
    right: 3px;
    background: url(../../assets/image/sentiment/icon/icon-rise.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-fall {
    display: inline-block;
    width: 3px;
    height: 12px;
    position: relative;
    top: 1px;
    right: 3px;
    background: url(../../assets/image/sentiment/icon/icon-fall.svg) no-repeat center;
    background-size: 100%;
  }
  #company-body {
    padding: 10px 0;
    overflow: hidden;
    .el-row {
      margin: 0 -10px;
    }
    .company-card {
      margin: 10px;
      padding: 10px 15px 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 2px 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 2px 20px rgba(50, 50, 50, 0.1);
      }
    }
    .company-card-nopadding {
      margin: 10px;
      padding: 10px 0 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 2px 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 2px 20px rgba(50, 50, 50, 0.1);
      }
    }
    .company-card-header {
      border-bottom: 1px solid #E3E3E3;
      padding-bottom: 8px;
      overflow: hidden;
    }
    .company-card-nopadding .company-card-header {
      padding: 0 15px 10px;
    }
    .company-card-header {
      .company-card-title {
        float: left;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        font-weight: 800;
        color: #323232;
      }
      .company-card-link {
        float: right;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
      .company-card-select {
        float: right;
        height: 28px;
      }
    }
    .company-card-body {
      overflow: hidden;
      padding-top: 10px;
    }
    .company-card-nopadding .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
    .company-card-body {
      .card-body-left {
        float: left;
        height: 60px;
        text-align: left;
        .numUnit {
          font-size: 16px;
          font-weight: 400;
          padding-left: 5px;
          color: #323232;
        }
      }
      .card-body-right {
        float: right;
        height: 60px;
        text-align: right;
      }
      .card-body-number {
        font-size: 30px;
        font-weight: 800;
        color: #323232;
        height: 42px;
        line-height: 42px;
        &.card-body-number-big {
          padding: 10px 0 20px;
          font-size: 50px;
          color: #FB4319;
        }
      }
      .card-body-name {
        font-size: 16px;
        font-weight: 400;
        color: #323232;
        padding: 5px 0;
      }
      .card-body-date {
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
      .card-body-change {
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        font-weight: 400;
        &.rise {
          color: #FFB148;
        }
        &.fall {
          color: #64A1FF;
        }
      }
      .card-body-tips {
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
      overflow: hidden;
      padding-top: 10px;
    }
    .company-card-nopadding .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
    .company-card-body {
      .card-body-left {
        float: left;
        height: 60px;
        text-align: left;
      }
      .card-body-right {
        float: right;
        height: 60px;
        text-align: right;
      }
      .card-body-number {
        font-size: 30px;
        font-weight: 800;
        color: #323232;
        &.card-body-number-big {
          padding: 10px 0 20px;
          font-size: 50px;
          color: #FB4319;
        }
      }
      .card-body-name {
        font-size: 16px;
        font-weight: 400;
        color: #323232;
        padding: 5px 0;
      }
      .card-body-date {
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
      .card-body-change {
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        font-weight: 400;
        &.rise {
          color: #FFB148;
        }
        &.fall {
          color: #64A1FF;
        }
      }
      .card-body-tips {
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
    }
  }
</style>
<style lang="scss">
  .company-tools-row .el-button--text {
    color: #dcdfe6;
    font-size: 16px;
  }
  .company-card-header input.el-input__inner {
    height: 28px;
    line-height: 26px;
  }
</style>
