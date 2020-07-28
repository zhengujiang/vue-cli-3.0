<template>
  <div id="company-overview-item">
    <!--本公司投资者问答情况总览-->
    <el-card class="box-overview-card overview" shadow="never" body-style="padding:0 16px"
             v-loading="companySummaryLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">本公司投资者问答情况总览</div>
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
    <el-card class="box-overview-card comparison" shadow="never" body-style="padding:0px 16px"
             v-loading="industryIndexLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">同行业投资者问答情况及公司排名</div>
        <div class="row select">
          <el-select class="select-item number" @change="industryIndexNumberChange" size="mini"
                     v-model="industryIndexNumber" placeholder="数量">
            <el-option v-for="item in optionNumbersData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          &ensp;
          <el-select class="select-item numberPev" @change="industryIndexChange" size="mini" v-model="industryIndexVal"
                     placeholder="时间">
            <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-comparison" id="echart-comparison"></div>
    </el-card>
    <!---->
    <el-row :gutter="16">
      <el-col :span="12">
        <!--本公司与本行业对比图-->
        <el-card class="box-overview-card ratio" shadow="never" body-style="padding:0px 16px"
                 v-loading="companyMarketCompareLading">
          <div class="overview-header vux-1px-b">
            <div class="row title">本公司与本行业对比图</div>
            <div class="row select">
              <el-select class="select-item numberPev" size="mini" @change="companyMarketCompareChange"
                         v-model="companyMarketCompareVal" placeholder="时间">
                <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <el-row :gutter="20">
            <el-col :span="14">
              <div class="echart-comparison" id="echart-leftRatio"></div>
            </el-col>
            <el-col :span="10">
              <div class="echart-comparison" id="echart-Ratio"></div>
            </el-col>
          </el-row>

        </el-card>
      </el-col>
      <el-col :span="12">
        <!--本公司市场排名-->
        <el-card class="box-overview-card ratio" shadow="never" body-style="padding:0px 16px"
                 v-loading="companyIndexFromMarketLading">
          <div class="overview-header vux-1px-b">
            <div class="row title">本公司市场排名</div>
            <div class="row select">
              <el-select class="select-item numberPev" size="mini" @change="companyIndexFromMarketChange"
                         v-model="companyIndexFromMarketVal" placeholder="时间">
                <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="echart-comparison" id="echart-rightRatio">
            <div class="right-ratio">
              <div class="row">
                <div class="echart-td" id="question-ratio"></div>
                <div class="text">
                  <p class="number">{{companyIndexFromMarketData.question}}</p>
                  <p class="desc">提问数</p>
                </div>
              </div>
              <div class="row middle">
                <div class="echart-td" id="answer-ratio"></div>
                <div class="text">
                  <p class="number">{{companyIndexFromMarketData.answer}}</p>
                  <p class="desc">回答数</p>
                </div>
              </div>
              <div class="row">
                <div class="echart-td" id="recover-rate"></div>
                <div class="text">
                  <p class="number">{{companyIndexFromMarketData.answerRate+'%'}}</p>
                  <p class="desc">回复率</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--问题关键词-->
    <el-card class="box-overview-card word" shadow="never" body-style="padding:0px 16px" v-loading="keyWordLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">本公司问题关键词</div>
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
    <!---->
    <el-card class="box-overview-card last" shadow="never" body-style="padding:0px 16px" v-loading="maxQuestionLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">提问数最多的投资者</div>
        <div class="row select">
          <el-select class="select-item numberPev" size="mini" @change="maxQuestionChange" v-model="maxQuestionVal"
                     placeholder="时间">
            <el-option v-for="item in optionRatioData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="echart-last" id="echart-last">
        <ul class="questionUser">
          <li class="" v-for="(list,i) in maxQuestionData">
            <router-link target="_blank"
                         :to="'/investor/personal?market='+marketFun(list.marketType)+'&name='+ encodeURI(list.user_name)">
              <div class="border">
                <!--<router-link to="">-->
                <span class="border-list" :class="list.color">
                <span class="text">{{list.questionCount}}</span>
              </span>
                <img v-if="i == 0" :src="$image.investor.investorone" alt="">
                <img v-else-if="i == 1" :src="$image.investor.investortwo" alt="">
                <img v-else-if="i == 2" :src="$image.investor.investorthree" alt="">
                <!--</router-link>-->
              </div>
              <p class="textUser">{{list.user_name}}</p>
            </router-link>
          </li>
        </ul>
        <div class="no-data" v-if="maxQuestionData.length == 0">
          <div class="text"><span>暂无数据</span></div>
        </div>
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
        companyCode: '',
        marketData: [
          {id: 0, name: '沪市主板', type: '沪'},
          {id: 1, name: '深市主板', type: '深'},
          {id: 2, name: '深市中小板', type: '深'},
          {id: 3, name: '深市创业板', type: '深'}
        ],
        //
        optionNumbersData: [
          {
            value: 'QUESTION',
            label: '提问数'
          }, {
            value: 'ANSWER',
            label: '回答数'
          }, {
            value: 'ANSWERRATE',
            label: '回复率'
          }
        ],
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
        maxQuestionVal: 'LASTMONTH',
        maxQuestionData: [],
        maxQuestionLading: false,
        //
        keyWordVal: 'LASTMONTH',
        keyWordData: [],
        keyWordLading: false,
        //
        companyMarketCompareVal: 'LASTMONTH',
        companyMarketCompareData: {
          company: [],
          industry: []
        },
        companyMarketCompareLading: false,
        //
        companyIndexFromMarketVal: 'LASTMONTH',
        companyIndexFromMarketData: {
          answerRate: '',
          question: '',
          answer: ''
        },
        companyIndexFromMarketLading: false,
        //
        industryIndexVal: 'LASTMONTH',
        industryIndexNumber: 'QUESTION',
        industryIndexData: [],
        industryIndexLading: false,
        //
        companySummaryVal: 'LASTMONTH',
        companySummaryData: {
          dateTime: '',
          question: [],
          answer: [],
          answerRate: []
        },
        companySummaryLading: false,
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
        userInfo: {}
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      // this.companyCode = this.userInfo.enterpriseCompanyCode;
      if (this.userInfo.enterpriseUser) {
        this.companyCode = this.userInfo.enterpriseCompanyCode;
      } else {
        if (this.$route.query.companyCode) {
          this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
        }
      }
      this.getMaxQuestionCountUser(this.maxQuestionVal);
      this.getKeywordByCompanyCode(this.keyWordVal);
      this.getCompanyMarketCompareData(this.companyMarketCompareVal);
      this.getCompanyIndexFromMarket(this.companyIndexFromMarketVal);
      this.getCompanySummaryByEnum(this.companySummaryVal);
      this.getIndustryIndexData();
    },
    watch: {
      $route: function (val) {
        this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
        this.companyCode = this.userInfo.enterpriseCompanyCode;
        this.getMaxQuestionCountUser(this.maxQuestionVal);
        this.getKeywordByCompanyCode(this.keyWordVal);
        this.getCompanyMarketCompareData(this.companyMarketCompareVal);
        this.getCompanyIndexFromMarket(this.companyIndexFromMarketVal);
        this.getCompanySummaryByEnum(this.companySummaryVal);
        this.getIndustryIndexData();
      }
    },
    mounted() {
    },
    methods: {
      marketFun(type) {
        let data = '';
        this.marketData.forEach((item) => {
          if (type.indexOf(item.name) > -1) {
            data = item.id
          }
        })
        //  console.log('213123', data);
        return data
      },
      //
      // 获取提问数最多的投资者
      maxQuestionChange(val) {
        this.getMaxQuestionCountUser(val);
      },
      getMaxQuestionCountUser(type) {
        this.maxQuestionLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getMaxQuestionCountUser,
          params: {
            interactCycleEnum: type,
            companyCode: this.companyCode
          }
        }).then((res) => {
          // console.log(res);
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let maxQuestionData = res.data.returnObject;
            if (maxQuestionData.length > 6) {
              this.maxQuestionData = maxQuestionData.splice(0, 6)
            } else {
              this.maxQuestionData = maxQuestionData;
            }
            this.maxQuestionData.forEach((item, i) => {
              this.$set(item, 'color', 'color' + i);
            })
          } else {
            this.maxQuestionData = [];
          }
          setTimeout(() => {
            this.maxQuestionLading = false;
          }, 300)
        }).catch((err) => {
          setTimeout(() => {
            this.maxQuestionLading = false;
          }, 1000)
        })
      },
      //
      // 获取公司词云
      keyWordChange(val) {
          console.log(val);
        this.getKeywordByCompanyCode(val);
      },
      getKeywordByCompanyCode(type) {
        this.keyWordLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getKeywordByCompanyCode,
          params: {
            companyCode: this.companyCode,
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
//          console.log('1');
//          console.log(datas);
//          console.log('1');
        var that = this;
        var myChart = echarts.init(document.getElementById('echartWordCloud'));
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
            sizeRange: [18, 35],
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
                color: function () {
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
          var tempWindow = window.open('_blank');
          tempWindow.location = newHost + 'investor/company/list?mustTitle=' + encodeURI(item.data.name); // 后更改页面地址
        });
      },
      //
      // 公司与行业对比数据接口
      companyMarketCompareChange(val) {
        this.getCompanyMarketCompareData(val)
      },
      //
      getCompanyMarketCompareData(type) {
        this.companyMarketCompareLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getCompanyMarketCompareData,
          params: {
            interactCycleEnum: type,
            companyCode: this.companyCode
          }
        }).then((res) => {
          setTimeout(() => {
            this.companyMarketCompareLading = false;
          }, 300)
          if (res.data.returnCode == 200) {

            if (res.data.returnObject) {
              // console.log(res.data.returnObject);
              let data = res.data.returnObject;
              //
              let companyQuestion = data.questionSummary.map((item) => {
                return item.questionCount;
              });
              if (companyQuestion.length == 0) {
                companyQuestion = [0]
              }
              let companyAnswer = data.answerSummary.map((item) => {
                return item.answerCount;
              });
              if (companyAnswer.length == 0) {
                companyAnswer = [0]
              }
              let companyRate = data.answerRateSummary.map((item) => {
                return item.answerRate;
              });
              if (companyRate.length == 0) {
                companyRate = [0]
              }
              let rate = {
                company: [],
                industry: []
              };
              rate.company = companyRate;
              this.companyMarketCompareData.company = companyQuestion.concat(companyAnswer);
              // console.log('2342432423===>', companyQuestion);
              // console.log('2342432423===>', companyAnswer);
              // console.log('2342432423===>', companyRate);
              //
              let industryQuestion = [data.industryQuestionSummary.questionCount];
              if (industryQuestion == null) {
                industryQuestion = [0];
              }
              let industryAnswer = [data.industryAnswerSummary.answerCount];
              if (industryAnswer == null) {
                industryAnswer = [0];
              }
              let industryRate = [data.industryAnswerRateSummary.answerRate];
              if (industryRate == null) {
                industryRate = [0];
              }
              rate.industry = industryRate;
              // console.log('2342432423===>', industryQuestion);
              // console.log('2342432423===>', industryAnswer);
              // console.log('2342432423===>', industryRate);
              this.companyMarketCompareData.industry = industryQuestion.concat(industryAnswer);
              this.echartLeftRatio('echart-leftRatio', this.companyMarketCompareData, 0);
              this.echartLeftRatio('echart-Ratio', rate, 1);
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.companyMarketCompareLading = false;
          }, 1000)
        })
      },
      // =>渲染
      echartLeftRatio(id, data, type) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#738bff', '#ffac25', '#90B8F5'];
        let Xdata = ['提问数', '回答数'];
        let formatterText = '{value}';
        var YAxisS = [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              },
              formatter: '{value}'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#e3e3e3"
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: "#e3e3e3"
              }
            },
            nameTextStyle: {
              color: "#e3e3e3"
            }
          }, {
            type: "value",
            min: 0,
            axisLabel: {
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              },
              formatter: '{value}'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#e3e3e3"
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: "#e3e3e3"
              }
            },
            nameTextStyle: {
              color: "#e3e3e3"
            }
          }
        ];

        if (type == 1) {
          Xdata = ['回复率'];
          this.$set(YAxisS[0], 'min', 0);
          this.$set(YAxisS[0], 'max', 100);
          YAxisS[0].axisLabel.formatter = '{value}%';
        }
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
                color: "#aeaeae"
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
            right: 2,
            bottom: "5%",
            containLabel: true
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 0,
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
              lineStyle: {
                color: "#e3e3e3"
              }
            },
            data: Xdata
          }],
          yAxis: YAxisS,
          series: [
            {
              name: '本公司',
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              barWidth: 14,
              barGap: 0,
              barMinHeight: 5,
              data: data.company
            }, {
              name: '同行业',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              barWidth: 14,
              barGap: 0,
              barMinHeight: 5,
              data: data.industry
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      // 获取公司市场排名
      companyIndexFromMarketChange(val) {
        this.getCompanyIndexFromMarket(val);
      },
      //
      getCompanyIndexFromMarket(type) {
        this.companyIndexFromMarketLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getCompanyIndexFromMarket,
          params: {
            interactCycleEnum: type,
            companyCode: this.companyCode
          }
        }).then((res) => {
          setTimeout(() => {
            this.companyIndexFromMarketLading = false;
          }, 300);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              let data = res.data.returnObject;
              let companyCount = data.companyCount;
              //
              let dataNo = [
                {id: 'question-ratio', index: 60, type: 0, number: 0},
                {id: 'answer-ratio', index: 70, type: 1, number: 0},
                {id: 'recover-rate', index: 30, type: 2, number: 0}
              ];
              //
              if (data.questionIndexInfo) {
                this.companyIndexFromMarketData.question = data.questionIndexInfo.questionCount;
                dataNo[0].number = data.questionIndexInfo.indexNo;
                dataNo[0].index = dataNo[0].number / companyCount * 100;
                this.companyIndexFromMarketData.questionNo = data.questionIndexInfo.indexNo;
              }
              //
              if (data.answerIndexInfo) {
                this.companyIndexFromMarketData.answer = data.answerIndexInfo.answerCount;
                this.companyIndexFromMarketData.answerNo = data.answerIndexInfo.indexNo;
                dataNo[1].number = data.answerIndexInfo.indexNo;
                dataNo[1].index = dataNo[1].number / companyCount * 100;
              }
              //
              if (data.answerRateIndexInfo) {
                this.companyIndexFromMarketData.answerRate = data.answerRateIndexInfo.answerRate;
                dataNo[2].number = data.answerRateIndexInfo.indexNo;
                this.companyIndexFromMarketData.answerRateNo = data.answerRateIndexInfo.indexNo;
                dataNo[2].index = dataNo[2].number / companyCount * 100;
              }
              //
              console.log('parseFloat()', dataNo);
              // console.log('parseFloat()=====>', this.companyIndexFromMarketData);
              setTimeout(() => {
                this.$nextTick(() => {
                  dataNo.forEach((item) => {
                    // console.log('234234=========================>', item);
                    this.echartRightRatio(item);
                  })
                })
              }, 1000)
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.companyIndexFromMarketLading = false;
          }, 1000)
        })
      },
      // =>渲染
      echartRightRatio(data) {
        // console.log('==============>', data);
        var myChart = echarts.init(document.getElementById(data.id));
        // var color = ['#738bff', '#ffac25', '#90B8F5'];
        var colorArr = [
          ['#FF6B6B', '#FF9494'],
          ['#738BFF', '#9AB9FB'],
          ['#FFB148', '#FFCD91']
        ];

        var color = colorArr[data.type];
        var option = {
          grid: {
            top: "0",
            left: "0%",
            right: "0%",
            bottom: "0%",
            containLabel: true
          },
          title: {
            text: '第' + data.number + '名',
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              color: '#323232',
              fontSize: '14'
            }
          },
          color: ['rgba(176, 212, 251, 1)'],
          visualMap: [{
            show: false,
            dimension: 1,
            seriesIndex: 2,
            min: 0,
            max: 100,
            inRange: {
              colorAlpha: [0, 1]
            }
          }],
          series: [{
            name: '0',
            type: 'pie',
            radius: [0, '70%'],
            hoverAnimation: false,
            label: {
              normal: {
                position: 'inner'
              }
            },
            itemStyle: {
              color: '#fff',
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 100,
              name: ''
            }]
          }, {
            name: '1',
            type: 'pie',
            clockWise: false,
            radius: ['90%', '100%'],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            data: [{
              value: data.index,
              name: '01',
              itemStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    // 完成的圆环的颜色
                    colorStops: [{
                      offset: 0,
                      color: color[0] // 100% 处的颜色
                    }, {
                      offset: 1,
                      color: color[1] // 0% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  },
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              }
            }, {
              name: '02',
              value: 100 - parseFloat(data.index),
              itemStyle: {
                normal: {
                  color: '#f0f1f5',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              }
            }]
          }]
        }
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      //
      // 获取同行业问答情况及公司排名
      industryIndexNumberChange(val) {
        this.getIndustryIndexData();
      },
      industryIndexChange(val) {
        this.getIndustryIndexData();
      },
      getIndustryIndexData() {
        this.industryIndexLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getIndustryIndexData,
          params: {
            interactCycleEnum: this.industryIndexVal,
            companyCode: this.companyCode,
            interactTypeEnum: this.industryIndexNumber
          }
        }).then((res) => {
          setTimeout(() => {
            this.industryIndexLading = false;
          }, 300);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              let data = res.data.returnObject;
              console.log(res.data.returnObject);
              let industryListInfo = data.industryListInfo;
              let set = 0;
              industryListInfo.forEach((item) => {
                if (item.companyCode == this.companyCode) {
                  set += 1;
                }
              });
              //
              if (set == 0) {
                // alert(set);
                industryListInfo.push(data.companyIndexInfo);
              }
              //
              let text = '';
              if (this.industryIndexNumber == 'QUESTION') {
                text = '提问数'
                this.industryIndexData = industryListInfo.map((e) => {
                  return {
                    name: e.companyName,
                    value: e.questionCount, // 同行业总数
                    companyCode: e.companyCode
                  }
                });
              } else if (this.industryIndexNumber == 'ANSWER') {
                text = '回答数'
                this.industryIndexData = industryListInfo.map((e) => {
                  return {
                    name: e.companyName,
                    value: e.answerCount, // 同行业总数
                    companyCode: e.companyCode
                  }
                });
              } else if (this.industryIndexNumber == 'ANSWERRATE') {
                text = '回复率'
                this.industryIndexData = industryListInfo.map((e) => {
                  return {
                    name: e.companyName,
                    value: e.answerRate, // 同行业总数
                    companyCode: e.companyCode
                  }
                });
              }

              console.log('this.industryIndexData', this.industryIndexData, text);
              // itemStyle: {
              // color: '#ffac25'
              //  }
              this.industryIndexData.forEach((item) => {
                if (item.companyCode == this.companyCode) {
                  this.$set(item, 'itemStyle', {color: '#ffac25'});
                }
              });
              //
              console.log('this.industryIndexData=====>', this.industryIndexData);
              // console.log('this.industryIndexData=====>', data.companyIndexInfo.companyCode);
              this.echartComparison('echart-comparison', this.industryIndexData, text);
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.industryIndexLading = false;
          }, 1000)
        })
      },
      //
      companySummaryChange(val) {
        this.getCompanySummaryByEnum(val);
      },
      getCompanySummaryByEnum(type) {
        this.companySummaryLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getCompanySummaryByEnum,
          params: {
            interactCycleEnum: type,
            companyCode: this.companyCode
          }
        }).then((res) => {
          setTimeout(() => {
            this.companySummaryLading = false;
          }, 300);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              // console.log(res.data.returnObject);
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
      },
      //
      echartOverview(id, data) {
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
            right: 2,
            bottom: "0%",
            containLabel: true
          },
          legend: {
            selectedMode: false,
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
                color: "#e3e3e3"
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
                  color: "#e3e3e3"
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
              splitLine: {
                lineStyle: {
                  color: "#e3e3e3"
                }
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#e3e3e3"
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
              barMinHeight: 5,
              data: data.question
            },
            {
              name: '回答数',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              barWidth: 14,
              barGap: 0,
              barMinHeight: 5,
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
      //
      echartComparison(id, data, text) {
        var xData = data.map(e => {
          return e.name;
        })
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
            top: "10%",
            left: "0%",
            right: 2,
            bottom: "0%",
            containLabel: true
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
                color: "#e3e3e3"
              }
            },
            data: xData
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
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#e3e3e3"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#e3e3e3"
                }
              }
            }, {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#e3e3e3"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#e3e3e3"
                }
              }
            }
          ],
          series: [
            {
              name: text,
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              barWidth: 14,
              barGap: 0,
              barMinHeight: 5,
              data: data
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss" scoped>
  #company-overview-item {
    .box-overview-card {
      width: 100%;
      background-color: white;
      margin-top: 16px;
      border-color: #e3e3e3;
      &.overview {
        min-height: 360px;
        position: relative;
      }
      &.comparison {
        min-height: 310px;
        position: relative;
      }
      &.ratio {
        min-height: 310px;
        position: relative;
      }
      &.word {
        min-height: 250px;
        position: relative;
      }
      &.last {
        min-height: 210px;
        position: relative;
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
      .echart-overview {
        height: 315px;
        width: 100%;
        position: relative;
      }
      .echart-word {
        height: 200px;
        width: 100%;
        position: relative;
      }
      .no-data {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: white;
        .text {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          text-align: center;
          color: #aeaeae;
          span {
            flex: 1;
            text-align: center;
          }
        }
      }
      .echart-last {
        height: 165px;
        width: 100%;
        position: relative;
        .questionUser {
          display: flex;
          text-align: center;
          align-items: center;
          height: 100%;
          li {
            flex: 1;
            margin-right: 20px;
            text-align: center;
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
