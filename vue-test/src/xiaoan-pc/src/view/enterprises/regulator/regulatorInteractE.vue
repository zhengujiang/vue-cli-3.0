<template>
  <el-card shadow="never" class="box-card mtop16" id="regulatorInteractE">
    <div slot="header">
      <span>监管公司互动易/e互动统计 Top10</span>
      <div class="select-time">
        <el-select  class="select-daycount" @change="selectChange" size="mini" v-model="typeValue"
                   placeholder="">
          <el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="select-daycount" @change="selectChange" size="mini" v-model="dayCountValue"
                   placeholder="">
          <el-option v-for="item in dayCountData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

    </div>
    <div class="echart-overview" id="echart-InteractE" style="height: 300px;" v-loading="loading"></div>
    <!--<v-noInfo></v-noInfo>-->
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        typeValue: 1,
        typeData: [
          {
            value: 1,
            label: '提问数'
          }, {
            value: 2,
            label: '回答数'
          }, {
            value: 3,
            label: '回复率'
          }
        ],
        dayCountValue: 30,
        dayCountData: [
          {
            value: 30,
            label: '最近30天'
          }, {
            value: 90,
            label: '最近90天'
          }, {
            value: 365,
            label: '最近1年'
          }
        ],
        loading: false,
        chartData: []
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
        this.eInteractInfo()
      }
    },
    // 生命周期函数
    created() {
    },
    mounted() {
      this.eInteractInfo()
    },
    // 方法
    methods: {
      initData() {
        this.eInteractInfo()
      },
      selectChange() {
        this.eInteractInfo()
      },
      eInteractInfo() {
        this.loading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.superviseCompany.eInteractInfo,
          params: {
            type: this.typeValue,
            dayCount: this.dayCountValue,
            companyCodes: this.companyCodes
          }
        }).then((res) => {
          this.loading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject && res.data.returnObject.toString() != '') {
              // console.log(res.data.returnObject);
              let data = res.data.returnObject;
              this.chartData.companyName = data.map(e => {
                return e.companyName;
              })
              // this.companySummaryData.dateTime = this.companySummaryData.dateTime.reverse();
              //
              let tooltipText = ''
              this.chartData.count = data.map(e => {
                console.log(this.typeValue)
                if (this.typeValue == 1) {
                  tooltipText = this.typeData[0].label
                  return e.questionCount;
                } else if (this.typeValue == 2) {
                  tooltipText = this.typeData[1].label
                  return e.answerCount;
                } else if (this.typeValue == 3) {
                  tooltipText = this.typeData[2].label
                  return e.answerRate;
                }
              })

              console.log(this.chartData)

              this.echartOverview('echart-InteractE', this.chartData, tooltipText)
            }
          } else {
            // this.echartOverview('echart-InteractE', {companyName: [], count: []})
          }
        }).catch((err) => {
          this.loading = false;
        })
      },
      echartOverview(id, data, tooltipText) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#738bff', '#ffac25', '#90B8F5'];
        var option = {
          title: {
            show: false,
            text: '',
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
              let value = data[0].value
              if (tooltipText == '回复率') {
                value = data[0].value + '%'
              }
              return `

                      <div style="display:flex;justify-content:space-between">
                        <span>${tooltipText}：</span><span style="color: #738bff">${value}</span>
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
            show: false,
            align: 'left',
            top: 10,
            left: 150,
            data: ['提问数']
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
            data: data.companyName
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
                formatter: ''
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
              data: data.count
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
  #regulatorInteractE {
    .select-time {
      float: right;
      .select-type {
        position: relative;
        top: -4px;
        width:150px;
      }
      .select-daycount {
        position: relative;
        top: -4px;
        width:100px;
      }
    }
    .el-card__body {
      padding: 0 20px 30px 20px;
    }
  }
</style>
