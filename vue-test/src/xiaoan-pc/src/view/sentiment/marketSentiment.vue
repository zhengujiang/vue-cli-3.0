<template>
  <div id="marketSentiment">
    <div id="company-page">
      <div id="company-header">
        <div class="content">
          <div class="company-title-only">
            <h2>市场舆情</h2>
          </div>
        </div>
      </div>
      <div id="company-body">
        <div class="content">
          <div class="el-row">
            <div class="el-col el-col-18">
              <div class="el-col el-col-12">
                <div class="el-card company-card" v-loading="chartMarketSentimentLading">
                  <div class="company-card-header">
                    <div class="company-card-title">市场舆情概览</div>
                    <div class="company-card-select">
                      <el-date-picker value-format="yyyy-MM-dd" v-model="startDate" type="date" @input="changeHandler"
                                      placeholder="选择日期"
                                      :editable="false" :clearable="false"
                                      :picker-options="pickerOptions1"></el-date-picker>
                    </div>
                  </div>
                  <div id="brokenLineBox">
                    <div class="company-card-body" id="brokenLine" style="height:369px;">
                      <div class="chart-right"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="el-col el-col-12">
                <div class="el-card company-card" v-loading="chartIndustrySentimentLading">
                  <div class="company-card-header">
                    <div class="company-card-title">行业舆情 TOP 5</div>
                    <div class="company-card-select">
                      <el-select size="mini" v-model="selectIndustry" @change="getSelectIndustry" placeholder="请选择">
                        <el-option v-for="item in options2"
                                   :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div id="selectIndustryBox">
                    <div class="company-card-body" v-show="selectIndustryInfo" id="selectIndustry"
                         style="height:369px;">
                      <div class="echart-word"></div>
                    </div>
                    <div class="company-card-body" v-show="selectIndustryNoInfo" style="height:369px;">
                      <no-info></no-info>
                    </div>
                  </div>
                </div>
              </div>

              <div class="el-col el-col-24">
                <sentiment-simple-list :listTitle="marketTitle" @openTimeAsise='openTimeAsis' :listInfo="marketListInfo"
                                       :noInfo="marketNoInfo"
                                       :page="pageMarket" :sort="sortMarket" v-if="pageMarket && sortMarket"
                                       v-on:changePage="changeMarketPage" v-on:changeSort="changeMarketSort"
                                       v-loading="marketLoading">
                </sentiment-simple-list>
              </div>

              <div class="el-col el-col-24" v-loading="chartIndustryHeatCompanyLading">
                <div class="el-card company-card">
                  <div class="company-card-header">
                    <div class="company-card-title">行业热门公司</div>
                    <div class="company-card-select">
                      <el-select size="mini" v-model="sourceVal" @change="getChannelChart" placeholder="请选择">
                        <el-option v-for="item in sourceDate" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div id="brokenSourceBox">
                    <div class="company-card-body" id="brokenSource" v-show="brokenSourceInfo" style="height:240px;">
                      <div class="echart-word"></div>
                    </div>
                    <div class="company-card-body" v-show="brokenSourceNoInfo" style="height:240px;">
                      <no-info></no-info>
                    </div>
                  </div>
                </div>
              </div>

              <div class="el-col el-col-24">
                <sentiment-simple-list :listTitle="industryTitle" @openTimeAsise='openTimeAsis'
                                       :listInfo="industryListInfo" :noInfo="industryNoInfo"
                                       :page="pageIndustry" :sort="sortIndustry" v-if="pageIndustry && sortIndustry"
                                       v-on:changePage="changeIndustryPage" v-on:changeSort="changeIndustrySort"
                                       v-loading="industryLoading">
                </sentiment-simple-list>
              </div>
            </div>

            <!--右边栏-->
            <div class="el-col el-col-6">
              <div class="el-col el-col-24">
                <sentiment-banner></sentiment-banner>
              </div>
              <div class="el-col el-col-24" v-loading="superviseLoading">
                <div class="el-card company-card">
                  <div class="company-card-header">
                    <div class="company-card-title">监管动态</div>
                    <div class="company-card-link">
                      <router-link tag="a" target="_blank" :to="{path:'/activities',query: {index: 0}}">更多 <i
                        class="el-icon-arrow-right"></i></router-link>
                    </div>
                  </div>
                  <div class="company-card-body">
                    <div class="card-aside-list">
                      <ul>
                        <li v-for="(item,index) in superviseList" :key="index">
                          <a :href="item.sourceUrl" target="_blank">
                            <p class="aside-list-title">{{item.title}}</p>
                            <p class="aside-list-subtitle">{{item.source}} |
                              {{$common.transTime(item.releaseDate)[1]}}</p>
                          </a>
                        </li>
                      </ul>
                      <no-info v-show="superviseNoInfo"></no-info>
                    </div>
                  </div>
                </div>
              </div>
              <!--同行业对比-->
              <div class="el-col el-col-24">
                <sentiment-aside-rinking :industryComparisonInfo="industryComparisonInfo"
                                         :noInfo="industryComparisonNoInfo" :updateTime="industryUpdateTime"
                                         v-loading="industryComparisonLoading"></sentiment-aside-rinking>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <time-axis v-model="timeAsis" @close="closeTimeAsis" :dialogVisibleii="timeAsis"
               @resetSubscribe="resetTimeAsis"></time-axis>
  </div>
</template>

<script>
  import SentimentBanner from "./components/sentimentBanner";
  import SentimentAsideRinking from "./components/sentimentAsideRinking";
  import NoInfo from "../../components/noInfo.vue";
  import mixins from '@/service/sensitiveWord'
  import VPage from '@/components/customPage.vue'
  import SentimentSimpleList from "./components/sentimentSimpleList.vue";
  import TimeAxis from "./components/timeAxis.vue";

  export default {
    components: {
      TimeAxis,
      SentimentSimpleList,
      NoInfo,
      SentimentAsideRinking,
      SentimentBanner,
      VPage
    },
    name: "marketSentiment",
    data() {
      return {
        activitiesUrl: '/activities',
        chartIndustrySentimentLading: false,
        chartIndustryHeatCompanyLading: false,
        chartMarketSentimentLading: false,
        selectIndustryNoInfo: false,
        selectIndustryInfo: true,
        brokenSourceNoInfo: false,
        brokenSourceInfo: true,
        startDate: '',
        timeAsis: {
          "dataInfo": '',
          "dataType": false
        },
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
        userId: "",
        userInfo: {},
        companyName: "",
        companyCode: "",
        flip: 1, // 默认页码
        total: '', // 总页数
        pageSize: 10, // 每页10条
        LineX: [],
        LineSeriesZ: [],
        LineSeriesS: [],
        LineSeriesF: [],
        SelectX: [],
        SelectIndustryZ: [],
        SelectIndustryS: [],
        SelectIndustryF: [],
        selectOverview: '今日',
        options1: [{
          value: '选项1',
          label: '今日'
        }, {
          value: '选项2',
          label: '近2日'
        }, {
          value: '选项3',
          label: '近3日'
        }, {
          value: '选项3',
          label: '近4日'
        }, {
          value: '选项3',
          label: '近5日'
        }, {
          value: '选项3',
          label: '近6日'
        }, {
          value: '选项3',
          label: '近7日'
        }],
        selectIndustry: 'Now',
        options2: [{
          value: 'Now',
          label: '今日'
        }, {
          value: 'Seven_days',
          label: '近7日'
        }, {
          value: 'Thirty_days',
          label: '近30日'
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
        selectCompany: '今日',
        options3: [{
          value: '选项1',
          label: '今日'
        }, {
          value: '选项2',
          label: '近7日'
        }, {
          value: '选项3',
          label: '近30日'
        }],
        marketTitle: '市场舆情',
        marketListInfo: [],
        marketNoInfo: false,
        marketLoading: false,
        sortMarket: {
          sortList: [
            {id: '0', name: '日期', type: 'date', mode: 'desc', isShow: true},
            {id: '1', name: '热度', type: 'heat', mode: '', isShow: true}
          ],
          sortType: '日期',
          sortMode: 'desc'
        },
        pageMarket: {
          flip: 1,
          total: 50,
          pageSize: 10
        },

        industryTitle: '行业舆情',
        industryListInfo: [],
        industryNoInfo: false,
        industryLoading: false,
        sortIndustry: {
          sortList: [
            {id: '0', name: '日期', type: 'date', mode: 'desc', isShow: true},
            {id: '1', name: '热度', type: 'heat', mode: '', isShow: true}
          ],
          sortType: '日期',
          sortMode: 'desc'
        },
        pageIndustry: {
          flip: 1,
          total: 50,
          pageSize: 10
        },
        superviseList: [],
        superviseNoInfo: false,
        superviseLoading: false,
        industryComparisonNoInfo: false,
        industryComparisonLoading: false,
        industryUpdateTime: '',
        industryComparisonInfo: []
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

      this.getMarketListInfo();
      this.getIndustryListInfo();
      this.getSuperviseInfo();
      var todoy = new Date();
      this.startDate = this.getNowFormatDate(todoy);
      this.getIndustryComparison();
    },
    watch: {
      pageMarket: {
        handler() {
          this.getMarketListInfo();
        },
        deep: true
      },
      sortMarket: {
        handler() {
          this.getMarketListInfo();
        },
        deep: true
      },
      pageIndustry: {
        handler() {
          this.getIndustryListInfo();
        },
        deep: true
      },
      sortIndustry: {
        handler() {
          this.getIndustryListInfo();
        },
        deep: true
      }
    },
    mounted() {
      this.getLineChart()
      this.getChannelChart()
      this.getSelectIndustry()
    },
    methods: {
      openTimeAsis(res) {
        console.log('这是列表', res)
        var _this = this;
        this.$axios.sentiment.newsDir({
          title: res
        }).then(function (res) {
          console.log('这是列表seccess', res);
          if (res.data.returnMsg == "success") {
            _this.timeAsis.dataInfo = res.data.returnObject;
            _this.timeAsis.dataType = true;
          }
        }, function (response) {
        })
      },
      closeTimeAsis() {
        this.timeAsis = false;
      },
      resetTimeAsis() {
        this.timeAsis = false;
      },
      changeHandler() {
        console.log(this.startDate);
        this.getLineChart();
      },
      changeMarketPage(page) {
        this.pageMarket.flip = page;
      },
      changeIndustryPage(page) {
        this.pageIndustry.flip = page;
      },
      changeMarketSort(type, mode) {
        this.sortMarket.sortType = type;
        this.sortMarket.sortMode = mode;
      },
      changeIndustrySort(type, mode) {
        this.sortIndustry.sortType = type;
        this.sortIndustry.sortMode = mode;
      },
      initSelectIndustry() {
        var brokenLineOption;
        var brokenLineMyChart = document.getElementById('selectIndustry');

        // 自适应宽高
        var myChartContainer = function () {
          brokenLineMyChart.width = document.getElementById("selectIndustryBox").offsetWidth + 'px';
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
            left: '16%',
            data: ['正面', '中性', '负面']
          },
          grid: {
            left: '20%',
            right: '4%',
            bottom: '10%',
            containLabel: false
          },
          xAxis: [
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
          yAxis: [
            {
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
                  color: "#e3e3e3"
                }
              },
              data: this.SelectX
            }
          ],
          series: [
            {
              name: '负面',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              data: this.SelectIndustryF
            },
            {
              name: '中性',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              data: this.SelectIndustryS
            },
            {
              name: '正面',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              data: this.SelectIndustryZ
            }

          ]
        };
        brokenLineOption = option;
        brokenLineMyChart.setOption(brokenLineOption);
        brokenLineMyChart.on('click', (item) => {
          var dateStr = this.selectIndustry;
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
          window.open('_blank').location = decodeURIComponent("/sentiment/sentimentSearch?inputKeyword=" + encodeURI(encodeURI(item.name)) + "&tendency=" + encodeURI(encodeURI(item.seriesName)) + "&startDate=" + startDate + "&endDate=" + endDate);
        });
        window.onresize = function () {
          myChartContainer();
          brokenLineMyChart.resize();
        };
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
            left: '28',
            data: ['正面', '中性', '负面']
          },
          grid: {
            top: 40,
            left: '8%',
            right: 15,
            bottom: '10%',
            containLabel: false
          },
          color: ['#ffe0b6', '#ffb148', '#d96d24'],
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

                    var a = count % 100000000 / 10000000;
                    decimal = String(a).substring(0, 1);

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
          var todoy = new Date();
          var str = item.name;
          var endDate = '2018-' + str.replace(/\//g, "-");
          var startDate = endDate;
          window.open('_blank').location = decodeURIComponent("/sentiment/sentimentSearch?tendency=" + encodeURI(encodeURI(item.seriesName)) + "&startDate=" + startDate + "&endDate=" + endDate);
        });
        window.onresize = function () {
          myChartContainer();
          brokenLineMyChart.resize();
        };
      },
      getLineChart() {
        var _this = this;
        _this.chartMarketSentimentLading = true;
        console.log(this.startDate)
        _this.$axios.sentiment.chartMarketSentiment({
          endDate: String(this.startDate),
          stockCode: String(this.companyCode)
        }).then(function (res) {
          console.log(res)
          setTimeout(() => {
            _this.chartMarketSentimentLading = false;
          }, 300);
          _this.LineX = res.data.returnObject.lineData.xAxis;
          _this.LineSeriesZ = res.data.returnObject.lineData.series['正面'];
          _this.LineSeriesS = res.data.returnObject.lineData.series['中性'];
          _this.LineSeriesF = res.data.returnObject.lineData.series['负面'];
          _this.initLineChart();
        }, function (response) {
        })
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
            left: '37',
            data: ['正面', '中性', '负面']
          },
          grid: {
            top: 40,
            left: "1%",
            right: 2,
            bottom: 1,
            containLabel: true
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
//                    console.log(this.sourceVal);
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
          window.open('_blank').location = decodeURIComponent("/sentiment/sentimentSearch?stockName=" + encodeURI(encodeURI(item.name)) + "&tendency=" + encodeURI(encodeURI(item.seriesName)) + "&startDate=" + startDate + "&endDate=" + endDate);
        });
        window.onresize = function () {
          myChartContainer();
          brokenLineMyChart.resize();
        };
      },
      getChannelChart() {
        var _this = this;
        _this.chartIndustryHeatCompanyLading = true;
        _this.$axios.sentiment.chartIndustryHeatCompanyTop10({
          daysEnum: String(this.sourceVal),
          companyId: String(this.userInfo.companyId)
        }).then(function (res) {
          setTimeout(() => {
            _this.chartIndustryHeatCompanyLading = false;
          }, 300);
          if (res.data.returnMsg == "success") {
            if (res.data.returnObject.xAxis.length > 0 || res.data.returnObject.series.length > 0) {
              _this.brokenSourceNoInfo = false
              _this.brokenSourceInfo = true
              console.log('789654')
              var negative = [];
              var arr = res.data.returnObject.series['负面'];
              for (var i = 0; i < arr.length; i++) {
                negative.push(-(arr[i]));
              }
              _this.ChannelX = res.data.returnObject.xAxis;
              _this.ChannelSeriesZ = res.data.returnObject.series['正面'];
              _this.ChannelSeriesS = res.data.returnObject.series['中性'];
              _this.ChannelSeriesF = negative;
            } else {
              _this.brokenSourceNoInfo = true
              _this.brokenSourceInfo = false
            }
            _this.initBrokenSource();
          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }

        }, function (response) {
        })
      },
      getSelectIndustry() {
        var _this = this;
        _this.chartIndustrySentimentLading = true;
        _this.$axios.sentiment.chartIndustrySentimentTop5({
          daysEnum: String(this.selectIndustry)
        }).then(function (res) {
          console.log(res)
          setTimeout(() => {
            _this.chartIndustrySentimentLading = false;
          }, 300);
          if (res.data.returnMsg == "success") {
            if (res.data.returnObject.xAxis.length > 0 || res.data.returnObject.series.length > 0) {
              _this.selectIndustryNoInfo = false
              _this.selectIndustryInfo = true
              console.log('log')
              var negative = [];
              var arr = res.data.returnObject.series['负面'];
              for (var i = 0; i < arr.length; i++) {
                negative.push(-(arr[i]));
              }
              _this.SelectX = res.data.returnObject.xAxis;
              _this.SelectIndustryZ = res.data.returnObject.series['正面'];
              _this.SelectIndustryS = res.data.returnObject.series['中性'];
              _this.SelectIndustryF = negative;
            } else {
              _this.selectIndustryNoInfo = true
              _this.selectIndustryInfo = false
            }
            _this.initSelectIndustry();
          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }

        }, function (response) {
        })
      },
      getMarketListInfo() {
        var _this = this;
        _this.marketLoading = true;
        _this.$axios.sentiment.listMarketSentiment({
          sortField: this.sortMarket.sortType,
          sortOrder: this.sortMarket.sortMode,
          pageNum: this.pageMarket.flip,
          pageSize: this.pageMarket.pageSize
        }).then(function (res) {

          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            _this.marketLoading = false;
            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.marketNoInfo = true;
              _this.marketListInfo = [];
            } else {

              // console.log('市场舆情', res.data.returnObject);
              var arr = res.data.returnObject;
              for (let i in arr) {
                arr[i].isDescribe = false
              }
              _this.marketListInfo = arr;
              _this.pageMarket.total = Math.ceil(res.data.total / _this.pageMarket.pageSize);

            }

          } else if (res.data.returnCode == 500) {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }
        }, function (response) {
        })
      },
      getIndustryListInfo() {
        var _this = this;
        _this.industryLoading = true;
        _this.$axios.sentiment.listIndustrySentiment({
          companyId: this.userInfo.companyId,
          sortField: this.sortIndustry.sortType,
          sortOrder: this.sortIndustry.sortMode,
          pageNum: this.pageIndustry.flip,
          pageSize: this.pageIndustry.pageSize
        }).then(function (res) {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            _this.industryLoading = false;
            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.industryNoInfo = true;
              _this.industryListInfo = [];
            } else {
              // console.log('行业舆情', res.data.returnObject);
              var arr = res.data.returnObject;
              for (let i in arr) {
                arr[i].isDescribe = false
              }
              _this.industryNoInfo = false;
              _this.industryListInfo = arr;
              _this.pageIndustry.total = Math.ceil(res.data.total / _this.pageIndustry.pageSize);
            }

          } else if (res.data.returnCode == 500) {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }

        }, function (response) {
        })
      },
      getSuperviseInfo() {
        var _this = this;
        _this.superviseLoading = true;
        _this.$axios.sentiment.listSuperviseDynamic({
          pageNo: 1,
          pageSize: 5
        }).then(function (res) {

          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            _this.superviseLoading = false;
            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.superviseNoInfo = true;
              _this.superviseList = '';
            } else {
              _this.superviseNoInfo = false;
              _this.superviseList = res.data.returnObject.superviseDynamicList;
            }

          } else if (res.data.returnCode == 500) {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }
        }, function (response) {
        })
      },
      // 获取可比公司信息
      getIndustryComparison() {
        var _this = this;
        // console.log("我", this.companyCode)
        _this.industryComparisonLoading = true;
        _this.$axios.sentiment.listComparisonWithIndustry({
          companyId: this.userInfo.companyId
        }).then(function (res) {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            _this.industryComparisonLoading = false;
            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.industryComparisonNoInfo = true;
              _this.industryComparisonInfo = '';
            } else {
              // console.log("我", res.data.returnObject.updateTime)
              _this.industryUpdateTime = res.data.returnObject.updateTime;
              _this.industryComparisonNoInfo = false;
              _this.industryComparisonInfo = res.data.returnObject.data;
            }
          } else if (res.data.returnCode == 500) {
            this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }

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
      getArrLength(arr) {
        var num = arr.length;
        if (num < 8) {
          for (var i = 0; i < (7 - num); i++) {
            arr.push('0');
          }
        }
        return arr;
      }
    }
  }
</script>

<style lang="scss" scoped>
  #company-header {
    background: url(../../assets/image/sentiment/company-slogan.png) no-repeat center;
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
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      }
    }
    .company-card-nopadding {
      margin: 10px;
      padding: 10px 0 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
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
        height: 24px;
        line-height: 24px;
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
  }
  .company-card-body {
    .card-aside-list {
      li {
        overflow: hidden;
        padding: 9px 0;
        border-bottom: 1px solid #E3E3E3;
        &:last-child {
          border-bottom: none;
        }
      }
      .aside-list-title {
        font-size: 14px;
        color: #323232;
      }
      .aside-list-subtitle {
        font-size: 12px;
        color: #8D8D8D;
      }
    }
    .card-fold-list {
      ul {
        padding: 0 15px;
      }
      .fold-list-header {
        background-color: #F8F8F8;
        margin-top: 0;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        color: #8D8D8D;
        padding: 0 15px;
      }
    }
  }
  .card-fold-list {
    .fold-list-header .list-header-page {
      float: right;
      margin-right: 12px;
      span {
        color: #545454;
        margin: 0 6px;
        font-size: 14px;
        position: relative;
        top: 1px;
      }
    }
    li {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #D8D8D8;
      &:last-child {
        border-bottom: none;
      }
    }
    .list-content-block {
      float: left;
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
    .list-title-sm {
      width: 80px;
      text-align: center;
    }
    .list-content-sm {
      width: calc(100% - 80px);
      padding-right: 160px;
    }
    .fold-list-title {
      float: left;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 5px;
      overflow: hidden;
    }
    .fold-list-subtitle {
      display: none;
      float: left;
      width: 100%;
      padding: 0 5px;
      color: #8D8D8D;
      font-size: 12px;
      max-height: 40px;
      overflow: hidden;
    }
    .fold-list-tips {
      position: relative;
      padding-left: 5px;
      color: #AEAEAE;
      font-size: 12px;
      a {
        font-size: 14px;
        color: #FFB148;
        margin-left: 5px;
        text-decoration: underline;
      }
      .list-tips-left {
        display: none;
      }
      .list-tips-right {
        display: inline-block;
        line-height: 40px;
        float: right;
        position: absolute;
        right: -160px;
        a {
          text-decoration: none;
          font-size: 12px;
          color: #AEAEAE;
          margin-left: 0;
        }
      }
    }
    .list-content-highlight {
      color: #FF7844;
    }
    li.active {
      height: 100px;
      padding: 10px 0;
      .list-content-block {
        height: 20px;
        line-height: 20px;
      }
      .fold-list-title {
        font-weight: 800;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        margin-bottom: 5px;
      }
      .list-content-sm {
        padding-right: 0;
      }
      .fold-list-subtitle, .fold-list-tips {
        display: block;
      }
      .list-tips-left {
        display: inline-block;
      }
      .list-tips-right {
        line-height: 20px;
        right: 0;
      }
    }
  }
  .sort {
    div {
      display: inline-block;
    }
    .el-dropdown-link {
      margin-right: 40px;
      cursor: pointer;
      float: left;
    }
    div i {
      display: inline-block;
      color: #a6a6a6;
      margin-left: 8px;
      font-size: 8px;
    }
  }
  .icon-sort {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../assets/image/sentiment/icon/icon-sort.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-sort-desc {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../assets/image/sentiment/icon/icon-sort-desc.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-sort-asc {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../assets/image/sentiment/icon/icon-sort-asc.svg) no-repeat center;
    background-size: 100%;
  }
  .showDescribe {
    margin-right: 15px;
    color: #8d8d8d;
    float: right;
    font-size: 12px;
  }
  .showDescribeText, .hideDescribeText {
    display: block;
  }
  .showDescribe:hover {
    .showDescribeNum, .hideDescribeNum {
      display: block;
    }
  }
  .showDescribeNum, .hideDescribeNum {
    display: none;
  }
  .showDescribe:hover {
    .showDescribeText, .hideDescribeText {
      display: none;
    }
  }
  .showDescribeNum i:hover, #hideDescribeNum i:hover {
    color: #ffb148;
  }
</style>
<style lang="scss">
  .company-card-header input.el-input__inner {
    height: 28px;
  }
</style>
