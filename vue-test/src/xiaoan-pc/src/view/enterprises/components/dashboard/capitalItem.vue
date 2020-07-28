<template>
  <div id="capital-item">
    <ul class="chart">
      <li class="e-chart" style="padding-right:20px">
        <div>主力净流入<span>{{inflow}}</span></div>
        <div id="pei"></div>
        <el-table :data="info" stripe size="mini" header-row-class-name="table-header">
          <el-table-column width="70" header-align="center" align="center" prop="name" label=" "></el-table-column>
          <el-table-column header-align="right" align="right" prop="netinflow" label="净流入">
            <template slot-scope="scope">
              <span :class="{'up': scope.row.netinflow>0, 'down': scope.row.netinflow<0}">
                {{$common.wanUnit(String(scope.row.netinflow))}}
              </span>
            </template>
          </el-table-column>
          <el-table-column header-align="right" align="right" prop="inflow" label="流入">
            <template slot-scope="scope">
              <!--<span :class="{'up': scope.row.inflow>0, 'down': scope.row.inflow<0}">-->
              {{$common.wanUnit(String(scope.row.inflow))}}
              <!--</span>-->
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li class="e-chart" style="margin-left:15px">
        <div>近十日主力资金流向</div>
        <div id="bar"></div>
        <el-table :data="rightInfo" stripe size="mini" header-row-class-name="table-header">
          <el-table-column width="70" header-align="center" align="center" prop="day" label="天数"></el-table-column>
          <el-table-column header-align="right" align="right" prop="periodinflowdays" label="净流天">
          </el-table-column>
          <el-table-column header-align="right" align="right" prop="periodnetinflow" label="净流额">
            <template slot-scope="scope">
              <span :class="{'up': scope.row.periodnetinflow>0, 'down': scope.row.periodnetinflow<0}">
                {{$common.wanUnit(String(scope.row.periodnetinflow))}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "capital-item",
  data() {
    return {
      inflow: '',
      companyFullCode: '',
      info: [],
      rightInfo: [],
      eChartPie: [],
      eChartBar: [],
      interval: null
    }
  },
  props: {
    companyCode: String
  },
  created() {
    this.companyFullCode = this.companyCode.toString().substr(2) + "." + this.companyCode.toString().substr(0, 2)
    this.getCompanyCapitalByToday()
    this.reData()
  },
  watch: {
    companyCode() {
      this.companyFullCode = this.companyCode.toString().substr(2) + "." + this.companyCode.toString().substr(0, 2)
      this.getCompanyCapitalByToday()
      this.reData()
    }
  },
  mounted() {
    // this.pieData();
    // this.barData();
  },
  destroyed() {
    window.clearInterval(this.interval)
  },
  methods: {
    // 实时刷新
    reData() {
      console.log("实时刷新-------------")
      this.getCompanyCapitalTenDay()
      window.clearInterval(this.interval)
      this.interval = setInterval(() => {
        if (this.$common.checkMarkTime()) {
          this.getCompanyCapitalByToday()
        }
      }, 10000)
    },

    // 10日
    getCompanyCapitalTenDay() {
      this.$http({
        method: 'GET',
        url: this.$api.capital.getCompanyCapitalTenDay,
        params: {
          companyCode: this.companyFullCode
        }
      }).then((res) => {
        // this.info = []
        this.rightInfo = []
        // this.eChartPie = []
        this.eChartBar = []
        let data = res.data.returnObject;
        let dataData = res.data.returnObject;
        this.rightInfo = data.capitalSummaryJson;
        dataData.capitalTenDayJson.forEach((item) => {
          if (item.periodnetinflow == null) {
            item.periodnetinflow = 0
          }
          let dateArary = item.date.split('-')
          this.eChartBar.push({ value: item.periodnetinflow, label: dateArary[1] + '/' + dateArary[2] })
        });
        this.barData();
        this.rightInfo.forEach((item) => {
          if (item.periodnetinflow == null) {
            item.periodnetinflow = 0
          }
        });
      }).catch((err) => {

      })
    },
    // 当日
    getCompanyCapitalByToday() {
      this.$http({
        method: 'GET',
        url: this.$api.capital.getCompanyCapitalToday,
        params: {
          companyCode: this.companyFullCode
        }
      }).then((res) => {
        this.info = []
        this.eChartPie = []
        // this.eChartBar = []
        let data = res.data.returnObject;
        let dataData = res.data.returnObject;
        this.info = data.capitalToday;
        /**/
        let inflowArray = []
        let outflowArray = []
        let _this = this

        dataData.capitalToday.forEach((item) => {
          console.log(item.netinflow);
          if (item.netinflow == null) {
            item.netinflow = 0
          }

          let inflow = _this.$common.wanUnit(item.inflow.toString())
          let outflow = _this.$common.wanUnit(item.outflow.toString())
          inflowArray.push({
            value: Math.abs(Number(item.inflow / 10000).toFixed(2)),
            name: item.name + '流入',
            label: inflow
          })
          outflowArray.push({
            value: Math.abs(Number(item.outflow / 10000).toFixed(2)),
            name: item.name + '流出',
            label: outflow
          })
        });

        this.eChartPie = inflowArray.concat(outflowArray.reverse())
        this.pieData();
        //
        this.info.forEach((item) => {
          if (item.netinflow == null) {
            item.netinflow = 0
          }
          if (item.inflow == null) {
            item.inflow = 0
          }
        })
      }).catch((err) => {

      })
    },
    pieData() {
      var myChart = echarts.init(document.getElementById('pei'));
      // app.title = '嵌套环形图';
      let data = this.eChartPie;
      var option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#e3e3e3',
          axisPointer: {
            type: 'line',
            lineStyle: {
              opacity: 0
            }
          },
          formatter: function(item) {
            let name = item.name
            let value = item.data.label + "元(" + item.percent + "%)"
            return '<div style="border-bottom:1px solid #e3e3e3; text-align: center">' + name + '</div>' + value
          },
          textStyle: {
            color: "#aeaeae"
          }
        },
        color: ['#fa4319', '#fb7c5e', '#ffaa97', '#fac2b5', '#b4ecd2', '#87ebbd', '#64dda5', '#20cc7d'],
        legend: {
          orient: 'vertical',
          show: false,
          x: 'left'
          // data: ['视频广告', '百度', '谷歌', '必应', '其他']
        },
        series: [{
          name: '净流入',
          type: 'pie',
          radius: ['20%', '50%'],
          labelLine: {
            normal: {
              length: 15,
              length2: 20,
              lineStyle: {
                color: '#333'
              }
            }
          },
          label: {
            normal: {
              // formatter: '{a|{d}%}',
              borderWidth: 0,
              borderRadius: 4,
              shadowBlur: 3,
              shadowOffsetX: 1,
              shadowOffsetY: 1,
              shadowColor: '#999',
              // padding: [0, 0],
              rich: {
                a: {
                  color: '#333',
                  fontSize: 12,
                  lineHeight: 10
                },
                hr: {
                  borderColor: '#333',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 12,
                  lineHeight: 15,
                  color: '#333'
                }
              }
            }
          },
          data: data
        }]
      };
      myChart.setOption(option, true);
    },
    //
    barData() {
      var myChart = echarts.init(document.getElementById('bar'));
      var labelRight = {
        normal: {
          position: 'right'
        }
      };
      let that = this;
      var data = this.eChartBar;
      var name = [];
      this.eChartBar.forEach((item) => {
        name.push(item.label)
      })
      var option = {
        title: {
          text: '',
          subtext: '',
          sublink: ''
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#e3e3e3',
          axisPointer: {
            type: 'line',
            lineStyle: {
              opacity: 0.5
            }
          },
          formatter: function(params) {
            let value = params[0].value
            value = that.$common.wanUnit(String(value))
            return '<div style="border-bottom:1px solid #e3e3e3; text-align: center">净流额</div><div style="text-align: center">' + value + '</div>'
          },
          textStyle: {
            color: "#aeaeae"
          }
        },
        grid: {
          top: 80,
          bottom: 40,
          left: 40
        },
        label: {
          show: false,
          normal: {
            formatter: function(param) {
              // console.log('1234567890', param.percent, Math.round(param.percent));
              return (param.percent / 10000).toFixed(2) + '%';
            }
          }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            interval: 0,
            lineStyle: {
              color: '#aeaeae'
            }
          },
          axisLabel: { // 坐标轴刻度标签的相关设置
            rotate: 50,
            interval: 0
          },
          // axisLine: {show: false},
          // axisLabel: {show: false},
          // axisTick: {show: false},
          // splitLine: {show: false},
          data: name
        },
        yAxis: {
          name: '总价(万元)',
          type: 'value', // ,
          show: false,
          splitLine: {
            show: false,
            lineStyle: {
              color: '#e3e3e3'
            }
          },
          nameTextStyle: {
            color: '#aeaeae'
          },
          axisLine: {
            lineStyle: {
              color: '#aeaeae'
            }
          }
          // position: 'top',
          // splitLine: {lineStyle:{type:'dashed'}},
        },
        series: [{
          name: '净流额',
          type: 'bar',
          stack: '总量',
          barWidth: '15',
          barMinHeight: 5,
          label: {
            normal: {
              show: false
              // formatter: '{b}'
            }
          },
          itemStyle: {
            normal: {
              // barBorderRadius: [15, 15, 0, 0],
              color: function(params) {
                console.log(params.value);
                if (params.value > 0) {
                  return '#fa4319'
                } else if (params.value == 0) {
                  return '#e3e3e3'
                } else {
                  return '#20cc7d'
                }
              }
            }
          },
          data: data
        }]
      };
      myChart.setOption(option, true);
    }
  }
}
</script>
<style lang="scss">
#capital-item {
  height: 100%;
  width: 100%;
  .table-header th{
    background: #eee;
    font-weight: 400;
    color:#5d5d5d !important
  }
  li {
    flex: 1;
    &:last-child {
      text-align: left;
    }
  }
  .head {
    display: flex;
  }
  .chart {
    display: flex;
    .e-chart {
      flex: 1;
      padding: 0 5px;
      width: auto;
      border-right: 1px solid #e3e3e3;
      &:last-child {
        border-right: 0;
      }
      #pei,
      #bar {
        height: 280px;
      }
    }
    th {
      //  text-align: center;
    }
    td {
      // text-align: center;
    }
    .el-table th>.cell {
      color: #909399 !important;
    }
    .up {
      color: #fa4319;
    }
    .down {
      color: #29da89;
    }
  }
}
</style>
