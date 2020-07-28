<template>
  <div id="investorLeaderboardOverview">
    <!--本公司投资者问答情况总览-->
    <el-card class="box-overview-card overview" shadow="never" body-style="padding:0 16px"
             v-loading="companySummaryLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">投资者问答情况总览</div>
        <div class="row select">
          <el-select class="select-item" size="mini" @change="companySummaryChange" v-model="companySummaryVal"
                     placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-overview" id="echart-overview"></div>
    </el-card>
    <!--同行业投资者问答情况及公司排名-->
    <!--投资者问答平均数据-->
    <el-card class="box-overview-card last" shadow="never" body-style="padding:0px 16px"
             v-loading="marketAverageLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">投资者问答平均数据</div>
        <div class="row select">
          <el-select class="select-item numberPev" size="mini" @change="ratioChange" v-model="selectRatioVal"
                     placeholder="时间">
            <el-option v-for="item in optionKeyWordData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!--平均数据-->
      <div class="overview-average">
        <ul class="average-box">
          <li class="row circle">
            <div class="circular">
              <div class="middle">
                <div class="row">
                  <p class="number">{{marketAverageData.questionAverage}}</p>
                  <p class="text">公司平均提问数</p>
                </div>
              </div>
            </div>
          </li>
          <li class="row line">
            <span></span>
          </li>
          <li class="row circle">
            <div class="circular colorAnswer">
              <div class="middle">
                <div class="row">
                  <p class="number">{{marketAverageData.answerAverage}}</p>
                  <p class="text">公司平均回答数</p>
                </div>
              </div>
            </div>
          </li>
          <li class="row line">
            <span></span>
          </li>
          <li class="row circle">
            <div class="circular colorRate">
              <div class="middle">
                <div class="row">
                  <p class="number">{{marketAverageData.answerRateAverage}}</p>
                  <p class="text">公司平均回复率</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
    <!--问题关键词-->
    <el-card class="box-overview-card word" shadow="never" body-style="padding:0px 16px" v-loading="keyWordLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">全市场问题关键词1</div>
        <div class="row select">
          <el-select class="select-item numberPev" @change="keyWordChange" size="mini" v-model="keyWordVal"
                     placeholder="词云">
            <el-option v-for="item in optionKeyWordData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-word">
        <div style="height: 100%" id="echartWordCloud"></div>
        <div class="no-data" v-if="keyWordData.length == 0">
          <div class="text"><span>暂无数据</span></div>
        </div>
      </div>
    </el-card>
    <!--提问数最多公司-->
    <el-card class="box-overview-card last" shadow="never" body-style="padding:0px 16px" v-loading="interactQLoading">
      <div class="overview-header vux-1px-b">
        <div class="row title">提问数最多公司</div>
        <div class="row select">
          <el-select class="select-item numberPev" size="mini" @change="interactQChange" v-model="interactQVal"
                     placeholder="时间">
            <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-last">
        <ul class="questionUser">
          <li class="" v-for="(list, i) in tableDataQ">
            <div class="border">
              <span class="border-list" :class="list.color">
                <span class="text">{{list.questionCount}}</span>
              </span>
              <img v-if="i == 0" :src="$image.investor.investorone" alt="">
              <img v-else-if="i == 1" :src="$image.investor.investortwo" alt="">
              <img v-else-if="i == 2" :src="$image.investor.investorthree" alt="">
            </div>
            <p class="textUser">{{list.companyName}}</p>
          </li>
        </ul>
      </div>
    </el-card>
    <!--回答数最多的公司-->
    <el-card class="box-overview-card last" shadow="never" body-style="padding:0px 16px" v-loading="interactALoading">
      <div class="overview-header vux-1px-b">
        <div class="row title">回答数最多的公司</div>
        <div class="row select">
          <el-select class="select-item numberPev" size="mini" @change="interactAChange" v-model="interactAVal"
                     placeholder="时间">
            <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-last">
        <ul class="questionUser">
          <li class="" v-for="(list, i) in tableDataA">
            <div class="border">
              <span class="border-list" :class="list.color">
                <span class="text">{{list.answerCount}}</span>
              </span>
              <img v-if="i == 0" :src="$image.investor.investorone" alt="">
              <img v-else-if="i == 1" :src="$image.investor.investortwo" alt="">
              <img v-else-if="i == 2" :src="$image.investor.investorthree" alt="">
            </div>
            <p class="textUser">{{list.companyName}}</p>
          </li>
        </ul>
      </div>
    </el-card>
    <!--回复率最高的公司-->
    <el-card class="box-overview-card last" shadow="never" body-style="padding:0px 16px" v-loading="interactRLoading">
      <div class="overview-header vux-1px-b">
        <div class="row title">回复率最高的公司</div>
        <div class="row select">
          <el-select class="select-item numberPev" size="mini" @change="interactRChange" v-model="interactRVal"
                     placeholder="时间">
            <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-last">
        <ul class="questionUser">
          <li class="" v-for="(list, i) in tableDataR">
            <div class="border">
                <span class="border-list" :class="list.color">
                  <span class="text">{{list.answerRate+'%'}}</span>
                </span>
              <img v-if="i == 0" :src="$image.investor.investorone" alt="">
              <img v-else-if="i == 1" :src="$image.investor.investortwo" alt="">
              <img v-else-if="i == 2" :src="$image.investor.investorthree" alt="">
            </div>
            <p class="textUser">{{list.companyName}}</p>
          </li>
        </ul>
      </div>
    </el-card>
    <!---->
    <el-card class="box-overview-card last" shadow="never" body-style="padding:0px 16px" v-loading="interactMLoading">
      <div class="overview-header vux-1px-b">
        <div class="row title">提问数最多的投资者</div>
        <div class="row select">
          <el-select class="select-item numberPev" size="mini" @change="interactMChange" v-model="interactMVal"
                     placeholder="时间">
            <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-last">
        <ul class="questionUser cursor" v-if="userInfo.enterpriseUser">
          <li class="" v-for="(list, i) in tableDataM">
            <router-link target="_blank"
                         :to="'/investor/personal?market='+marketFun(list.marketType)+'&name='+ encodeURI(list.userName)">
              <div class="border">
                <span class="border-list" :class="list.color">
                  <span class="text">{{list.questionCount}}</span>
                </span>
                <img v-if="i == 0" :src="$image.investor.investorone" alt="">
                <img v-else-if="i == 1" :src="$image.investor.investortwo" alt="">
                <img v-else-if="i == 2" :src="$image.investor.investorthree" alt="">
              </div>
              <p class="textUser">{{list.userName}}</p>
            </router-link>
          </li>
        </ul>
        <ul class="questionUser" v-else>
          <li class="" v-for="(list, i) in tableDataM">
            <div class="border">
                <span class="border-list" :class="list.color">
                  <span class="text">{{list.questionCount}}</span>
                </span>
              <img v-if="i == 0" :src="$image.investor.investorone" alt="">
              <img v-else-if="i == 1" :src="$image.investor.investortwo" alt="">
              <img v-else-if="i == 2" :src="$image.investor.investorthree" alt="">
            </div>
            <p class="textUser">{{list.userName}}</p>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "company-overview-item",
    components: {},
    data() {
      return {
        marketData: [
          {id: 0, name: '沪市主板', type: '沪'},
          {id: 1, name: '深市主板', type: '深'},
          {id: 2, name: '深市中小板', type: '深'},
          {id: 3, name: '深市创业板', type: '深'}
        ],
        //
        selectNumber: 'LASTMONTH', // 2图的 提问 回答 select
        selectAll: 'LASTMONTH', // 1图的 时间 select
        //
        marketAverageData: {},
        marketAverageLading: false,
        selectRatioVal: 'LASTMONTH',
        //
        selectRatioR: 'LASTMONTH',
        //
        selectRatioL: 'LASTMONTH',
        //
        // 过去30天，过去90天，过去1年
        optionRatioData: [
          {
            value: 'LASTMONTH',
            label: '过去30天'
          }, {
            value: 'LASTQUARTER',
            label: '过去90天'
          }, {
            value: 'LASTYEAR',
            label: '过去1年'
          }
        ],
        optionKeyWordData: [
          {
            value: 'LASTMONTH',
            label: '过去30天'
          }, {
            value: 'LASTQUARTER',
            label: '过去90天'
          }, {
            value: 'LASTYEAR',
            label: '过去1年'
          }
        ],
        companySummaryVal: 'LASTMONTH',
        companySummaryData: {
          dateTime: '',
          question: [],
          answer: [],
          answerRate: []
        },
        companySummaryLading: false,
        //
        tableDataQ: [],
        interactQVal: 'LASTMONTH',
        interactQLoading: false,
        tableDataA: [],
        interactAVal: 'LASTMONTH',
        interactALoading: false,
        tableDataR: [],
        interactRVal: 'LASTMONTH',
        interactRLoading: false,
        tableDataM: [],
        interactMVal: 'LASTMONTH',
        interactMLoading: false,
        //
        options: [
          {
            value: 'LASTMONTH',
            label: '按月'
          }, {
            value: 'LASTQUARTER',
            label: '按季'
          }, {
            value: 'LASTYEAR',
            label: '按年'
          }
        ],
        //
        keyWordVal: 'LASTMONTH',
        keyWordData: [],
        keyWordLading: false,
        userInfo: {}
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      this.getMarketAverageSummary(this.selectRatioVal);
      this.getMarketSummaryByEnum(this.selectAll);
      this.getKeywordByCompanyCode(this.keyWordVal);
      this.getInteractTopTenRank('QUESTION', this.interactQVal);
      this.getInteractTopTenRank('ANSWER', this.interactAVal);
      this.getInteractTopTenRank('ANSWERRATE', this.interactRVal);
      this.getInteractTopTenRank('MAXQUESTIONUSER', this.interactMVal);
    },
    mounted() {

    },
    methods: {
      marketFun(type) {
        let data = '';
        this.marketData.forEach((item) => {
          if (item.name.indexOf(type) > -1) {
            data = item.id
          }
        })
        // console.log('213123', data);
        return data
      },
      //
      interactQChange(val) {
        this.getInteractTopTenRank('QUESTION', val);
      },
      //
      interactAChange(val) {
        this.getInteractTopTenRank('ANSWER', val);
      },
      //
      interactRChange(val) {
        this.getInteractTopTenRank('ANSWERRATE', val);
      },
      //
      interactMChange(val) {
        this.getInteractTopTenRank('MAXQUESTIONUSER', val);
      },
      //
      companySummaryChange(val) {
        this.getMarketSummaryByEnum(val);
      },
      //
      getInteractTopTenRank(index, interact) {
        if (index == 'QUESTION') {
          this.interactQLoading = true;
        } else if (index == 'ANSWER') {
          this.interactALoading = true;
        } else if (index == 'ANSWERRATE') {
          this.interactRLoading = true;
        } else if (index == 'MAXQUESTIONUSER') {
          this.interactMLoading = true;
        }
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getInteractTopTenRank,
          params: {
            interactTypeEnum: index,
            interactCycleEnum: interact
          }
        }).then((res) => {
          setTimeout(() => {
            if (index == 'QUESTION') {
              this.interactQLoading = false;
            } else if (index == 'ANSWER') {
              this.interactALoading = false;
            } else if (index == 'ANSWERRATE') {
              this.interactRLoading = false;
            } else if (index == 'MAXQUESTIONUSER') {
              this.interactMLoading = false;
            }
          }, 300)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              let maxQuestionData = res.data.returnObject;
              if (maxQuestionData.length > 6) {
                maxQuestionData = maxQuestionData.splice(0, 6)
              }
              maxQuestionData.forEach((item, i) => {
                this.$set(item, 'color', 'color' + i);
              })
              let data = maxQuestionData
              if (index == 'QUESTION') {
                this.tableDataQ = data;
              } else if (index == 'ANSWER') {
                this.tableDataA = data;
              } else if (index == 'ANSWERRATE') {
                this.tableDataR = data;
              } else if (index == 'MAXQUESTIONUSER') {
                this.tableDataM = data;
              }
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            if (index == 'QUESTION') {
              this.interactQLoading = false;
            } else if (index == 'ANSWER') {
              this.interactALoading = false;
            } else if (index == 'ANSWERRATE') {
              this.interactRLoading = false;
            } else if (index == 'MAXQUESTIONUSER') {
              this.interactMLoading = false;
            }
          }, 1000)
        })
      },
      //
      ratioChange(val) {
        console.log(val);
        this.getMarketAverageSummary(val);
      },
      // 投资者问答平均数据
      getMarketAverageSummary(type) {
        this.marketAverageLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getMarketAverageSummary,
          params: {
            interactCycleEnum: type
          }
        }).then((res) => {
          // console.log(res);
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.marketAverageData = res.data.returnObject;
          }
          this.marketAverageLading = false;
        }).catch((err) => {
          this.marketAverageLading = false;
        })
      },
      //
      echartOverview(id, data) {
        console.log(JSON.stringify(data))
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#738bff', '#ffac25', '#90B8F5'];
        var option = {
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
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
            formatter: function (data) {
              var html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data[0].name}</span>
                          </div>`;
              data.forEach((item) => {
                if (item.seriesName.indexOf('率') > -1) {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}%</span></div>`
                } else {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}</span></div>`
                }
              });
              return html
            }
          },
          grid: {
            top: "15%",
            left: "0%",
            right: "0%",
            bottom: "0%",
            containLabel: true
          },
          legend: {
            selectedMode: true,
            align: 'left',
            top: 10,
            left: 0,
            data: ['提问数', '回答数', '回复率']
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 30,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },

            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: data.dateTime
          }],
          yAxis: [
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            },
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: '{value}%'
              },
              min: 0,
              max: 100,
              position: 'right',
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            }
          ],
          series: [
            {
              name: '提问数',
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              barWidth: 14,
              barGap: 0,
              data: data.question
            },
            {
              name: '回答数',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              barWidth: 14,
              barGap: 0,
              data: data.answer
            },
            {
              name: '回复率',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: color[2]}},
              symbol: "circle",
              symbolSize: 7,
              data: data.answerRate
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      // 获取公司词云
      keyWordChange(val) {
        this.getKeywordByCompanyCode(val);
      },
      //
      getKeywordByCompanyCode(type) {
        this.keyWordLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getKeywordByMarket,
          params: {
            interactCycleEnum: type
          }
        }).then((res) => {
          this.keyWordLading = false;
          // console.log(res);
          if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            // data = data.slice(0, 20);
            this.keyWordData = data.map(e => {
              return {name: e.hot_word, value: e.freq}
            })
            this.wordCloud(this.keyWordData);
          }
        }).catch((err) => {
          setTimeout(e => {
            this.keyWordLading = false;
          }, 1000)
        })
      },
      // =>渲染
      wordCloud(datas) {
        console.log(datas)
        var myChart = echarts.init(document.getElementById('echartWordCloud'));
        var that = this;
        var color = ['#738BFF', '#FFB164', '#FFB09C', '#BBBBBB'];
        var option = {
          background: '#fff',
          series: [{
            type: 'wordCloud',
            // shape: 'circle',
            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.
            // maskImage: maskImage,
            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.
            left: 'center',
            top: '5%',
            width: '90%',
            height: '90%',
            right: 'center',
            bottom: '5%',
            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.
            sizeRange: [18, 36],
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
            rotationRange: [0, 45],
            // rotationStep: 45,
            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.
            gridSize: 12,
            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
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
                fontSize: 36,
                shadowBlur: 20,
                backgroundColor: '#f8f8f8',
                shadowColor: '#f8f8f8',
                shadowOffsetX: 0,
                shadowOffsetY: 0
              }
            },
            data: datas
            // data: data
          }]
        }
        myChart.setOption(option, true);
        myChart.on('click', (item) => {
          let newHost = that.$api.host;
          if (that.userInfo.enterpriseUser) {
            var tempWindow = window.open('_blank');
            tempWindow.location = newHost + 'investor/search?mustTitle=' + encodeURI(item.data.name); // 后更改页面地址
          }
        });
      },
      //
      getMarketSummaryByEnum(type) {
        this.companySummaryLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getMarketSummaryByEnum,
          params: {
            interactCycleEnum: type
          }
        }).then((res) => {
          setTimeout(() => {
            this.companySummaryLading = false;
          }, 300);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              console.log(res.data.returnObject);
              let data = res.data.returnObject;
              this.companySummaryData.dateTime = data.questionSummaryList.map(e => {
                return e.summaryDate;
              })
              this.companySummaryData.dateTime = this.companySummaryData.dateTime.reverse();
              //
              this.companySummaryData.question = data.questionSummaryList.map(e => {
                return e.questionCount;
              })
              this.companySummaryData.question = this.companySummaryData.question.reverse();
              //
              this.companySummaryData.answer = data.answerSummaryList.map(e => {
                return e.answerCount;
              })
              this.companySummaryData.answer = this.companySummaryData.answer.reverse();
              //
              this.companySummaryData.answerRate = data.answerRateSummaryList.map(e => {
                return e.answerRate;
              });
              this.companySummaryData.answerRate = this.companySummaryData.answerRate.reverse();
              // console.log('==========>', this.companySummaryData);
              this.echartOverview('echart-overview', this.companySummaryData)
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.companySummaryLading = false;
          }, 1000)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #investorLeaderboardOverview {
    .box-overview-card {
      width: 100%;
      background-color: white;
      margin-top: 16px;
      border-color: #e3e3e3;
      &.overview {
        min-height: 360px;
      }
      &.comparison {
        min-height: 310px;
      }
      &.ratio {
        min-height: 310px;
      }
      &.word {
        min-height: 250px;
      }
      &.last {
        min-height: 210px;
      }
      .overview-header {
        display: flex;
        height: 45px;
        align-items: center;
        .row {
          flex: 1;
          &.title {
            font-size: 14px;
            color: #323232;
            font-weight: 600;
          }
          &.select {
            text-align: right;
            .select-item {
              width: 75px;
              &.number {
                width: 85px;
              }
              &.numberPev {
                width: 100px;
              }
            }
          }
        }
      }
      /*
      var colorArr = [
          ['#FF6B6B', '#FF9494'],
          ['#738BFF', '#9AB9FB'],
          ['#FFB148', '#FFCD91']
        ];*/
      .echart-overview {
        height: 315px;
        width: 100%;
      }
      .overview-average {
        height: 190px;
        width: 100%;
        .average-box {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 60px;
          cursor: default;
          width: 100%;
          .row {
            cursor: default;
            flex: 1;
            width: 100%;
            // border: 1px solid #8d8d8d;
            &.line {
              text-align: center;
              line-height: 1;
              vertical-align: middle;
              span {
                display: inline-block;
                line-height: 1;
                height: 2px;
                background: #E3E3E3;
                border-radius: 2px;
                width: 80px;
                vertical-align: middle;
              }
            }
            &.circle {
              text-align: center;
              .circular {
                line-height: 1;
                display: inline-block;
                vertical-align: middle;
                height: 104px;
                width: 104px;
                border: 5px solid #FEA690;
                border-radius: 50%;
                position: relative;
                &::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  height: 88px;
                  width: 88px;
                  border: 3px solid rgba(254, 166, 144, 0.5);
                  border-radius: 50%;
                }
                &.colorAnswer {
                  border-color: rgba(144, 184, 245, 1);
                  &::before {
                    border-color: rgba(144, 184, 245, 0.5);
                  }
                }
                &.colorRate {
                  border-color: rgba(255, 227, 151, 1);
                  &::before {
                    border-color: rgba(255, 227, 151, 0.5);;
                  }
                }
                .middle {
                  display: flex;
                  height: 100%;
                  padding: 0 5px;
                  align-items: center;
                  .number {
                    font-size: 18px;
                    color: #323232;
                    text-align: center;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #F0F1F5;
                    margin: 0 15px;
                  }
                  .text {
                    padding-top: 5px;
                    font-size: 12px;
                    color: #AEAEAE;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 14px;
                    margin: 0 8px;
                  }
                }
              }
            }
          }
        }
      }
      .echart-word {
        height: 200px;
        width: 100%;
      }
      .echart-last {
        height: 165px;
        width: 100%;
        .questionUser {
          display: flex;
          text-align: center;
          align-items: center;
          height: 100%;
          cursor: default;
          &.cursor {
            cursor: pointer;
            li {
              cursor: pointer;
            }
          }
          li {
            flex: 1;
            margin-right: 20px;
            text-align: center;
            cursor: default;
            &:last-child {
              margin-right: 0;
            }
            .border {
              position: relative;
              height: 95px;
              width: 95px;
              margin: 0 auto;
              .border-list {
                display: inline-block;
                height: 100%;
                width: 100%;
                border: 3px solid #E3E3E3;
                border-radius: 50%;
                margin: 0 auto;
                position: relative;
                &.color0 {
                  border-color: #ffc952;
                }
                &.color1 {
                  border-color: #BBDDED;
                }
                &.color2 {
                  border-color: #F5BE95;
                }
                .text {
                  text-align: center;
                  position: absolute;
                  top: 50%;left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 18px;
                  color: #545454;
                }
              }
              img {
                position: absolute;
                right: 6px;
                top: -15px;
                width: 30px;
              }
            }
            .textUser {
              margin-top: 10px;
              font-size: 14px;
              color: #8D8D8D;
              overflow: hidden;
              white-space: nowrap;
              width: 127px;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .echart-comparison {
        height: 265px;
        width: 100%;
        .right-ratio {
          height: 100%;
          display: flex;
          align-items: center;
          .row {
            flex: 1;
            &.middle {
              text-align: center;
              .echart-td {
                margin: 0 auto;
              }
            }
            .echart-td {
              height: 102px;
              width: 102px;
              margin: 0 auto;
            }
            .text {
              padding-top: 10px;
              text-align: center;
              .number {
                font-size: 14px;
                color: #323232;
              }
              .desc {
                font-size: 12px;
                color: #AEAEAE;
              }
            }
          }
        }
      }
    }
  }
</style>
