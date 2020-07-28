<template>
  <el-card shadow="never" class="box-card mtop16" id="regulatorChartLine">
    <div slot="header">
      <span>公司市值</span>
      <el-select class="select-time" @change="selectChange" size="mini" v-model="dateType"
                 placeholder="季度">
        <el-option v-for="item in dateTypeData" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="echart-overview" id="echart-overview" style="height: 350px;"></div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        dateType: '2',
        dateTypeData: [
          {
            value: '2',
            label: '月度'
          }, {
            value: '3',
            label: '季度'
          }, {
            value: '4',
            label: '年度'
          }
        ],
        loading: false,
        chartData: {}
      }
    },
    props: {
      companyCodes: String
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      companyCodes: function (val) {
        this.getData()
      }
    },
    // 生命周期函数
    created() {
    },
    mounted() {
      //
      // this.getData()
    },
    // 方法
    methods: {
      selectChange() {
        this.getData()
      },
      getData() {
        this.companySummaryLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.superviseCompany.companyMV,
          params: {
            dateType: this.dateType,
            companyCodes: this.companyCodes
          }
        }).then((res) => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              let data = res.data.returnObject;
              this.chartData.dateTime = data.map(e => {
                return e.viewValue;
              })
              // this.chartData.dateTime = this.companySummaryData.dateTime.reverse();
              //
              this.chartData.areaMarketValue = data.map(e => {
                return e.areaMarketValue;
              })
              // this.chartData.question = this.companySummaryData.question.reverse();
              //
              this.chartData.companyMarketValue = data.map(e => {
                return e.companyMarketValue;
              })
              // this.chartData.rate = this.companySummaryData.answer.reverse();
              //
              this.chartData.rate = data.map(e => {
                return ((e.companyMarketValue / e.areaMarketValue) * 100).toFixed(2)
              });
              // this.chartData.answerRate = this.companySummaryData.answerRate.reverse();

              this.echartOverview('echart-overview', this.chartData)
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        })
      },
      echartOverview(id, data) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#738bff', '#ffac25', '#FF7844'];
        var option = {
          title: {
            text: '市值： (亿元)',
            textStyle: {
              color: '#323232',
              fontWeight: 400,
              fontSize: 14
            },
            top: 10,
            left: 40
          },
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
              color: "#aeaeae"
            },
            formatter: function (data) {
              return `
                      <div style="display:flex;justify-content:center;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                      <span>${data[0].name}</span>
                      </div>
                      <div style="display:flex;justify-content:space-between">
                        <span>辖区总市值：</span><span style="color: #738bff">${data[0].value}</span>
                      </div>
                      <div style="display:flex;justify-content:space-between">
                        <span>监管公司市值：</span><span style="color: #ffac25">${data[1].value}</span>
                      </div>
                      <div style="display:flex;justify-content:space-between">
                        <span>监管公司市值占比：</span><span style="color: #90B8F5">${data[2].value + '%'}</span>
                      </div>
                     `
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
            selectedMode: false,
            align: 'left',
            top: 10,
            left: 150,
            data: ['辖区总市值', '监管公司市值', '监管公司市值占比']
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
              // max: 100,
              max: function(value) {
                let max = parseInt(value.max * 2)
                if (max == 0) {
                  max = 1
                }
                return max
              },
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
              name: '辖区总市值',
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              barMinHeight: 8,
              barWidth: 14,
              barGap: 0,
              data: data.areaMarketValue
            },
            {
              name: '监管公司市值',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              barMinHeight: 8,
              barWidth: 14,
              barGap: 0,
              data: data.companyMarketValue
            },
            {
              name: '监管公司市值占比',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: color[2]}},
              symbol: "circle",
              symbolSize: 7,
              data: data.rate
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss">
  #regulatorChartLine {
    .select-time {
      position: relative;
      top: -4px;
      float: right;
      width:100px;
    }
    .el-card__body {
      padding: 0 38px 54px 38px;
    }
  }
</style>
