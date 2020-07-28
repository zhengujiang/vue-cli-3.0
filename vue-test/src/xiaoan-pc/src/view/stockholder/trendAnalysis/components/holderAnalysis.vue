<template>
  <div id="holderAnalysis">
    <div class="compare" v-loading="dataLoading">
      <div class="title">
        <p>股东户数及平均持股情况分析</p>
        <el-radio-group @change="changeRadio" v-model="radioList.flag" size="mini">
          <el-radio-button v-for="(item, index) in radioList.list" :key="index" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <div style="position: relative">
        <div v-if="radioList.flag == 1 && chartData.xAxis.length > 0" class="echart-holder" :key='2' id="echart-holder2"></div>
        <div style="height: 60px" v-if="chartData.xAxis.length == 0 && radioList.flag == 1 && !dataLoading">
          <vxa-not-info><span style="font-size: 14px">暂无数据</span></vxa-not-info>
        </div>
        <el-table @sort-change="sortChange" :default-sort = "{prop: 'date', order: 'descending'}" v-if="radioList.flag == 2" :data="tableData.row" stripe max-height="420" style="width: 100%;">
          <el-table-column prop="date" sortable label="截止日期"></el-table-column>
          <el-table-column prop="holderNum" sortable="custom" label="股东户数(户)">
            <template slot-scope="scope">{{amountAbs(scope.row.holderNum)}}</template>
          </el-table-column>
          <el-table-column class-name="headNameTop" prop="holike" label="剔除前十大股东">
            <el-table-column prop="nonBigAveHolderSharePercents" sortable="custom" class-name="headName" label="每户持股比例(‰)"></el-table-column>
            <el-table-column prop="nonBigAveHolderShareAmounts" sortable="custom" class-name="headName" label="每户持有市值(元)">
              <template slot-scope="scope">{{$array.abs(scope.row.nonBigAveHolderShareAmounts, true)}}</template>
              <!-- <template slot-scope="scope">{{scope.row.nonBigAveHolderShareAmounts}}</template> -->
            </el-table-column>
          </el-table-column>
          <el-table-column class-name="headNameTop" prop="holike" align="center" label="剔除前十大流通股东">
            <el-table-column prop="nonLiuTongAveHolderSharePercents" sortable="custom" class-name="headName" align="right" label="每户持股比例(‰)"></el-table-column>
            <el-table-column prop="nonLiuTongAveHolderShareAmounts" sortable="custom" class-name="headName" align="right" label="每户持有市值(元)">
              <template slot-scope="scope">{{$array.abs(scope.row.nonLiuTongAveHolderShareAmounts, true)}}</template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--<div class="compare" v-loading="dataLoading">
      <div class="title">
        <p>股东户数与股价情况分析</p>
      </div>
      <div style="position: relative">
        <div v-if="chartData.xAxis.length > 0" class="tip">* 报告期末若为非交易日，股价显示为前一交易日股价</div>
        <div v-if="chartData.xAxis.length > 0" class="echart-holder"  id="echart-stockprice"></div>
        <div style="height: 60px" v-if="chartData.xAxis.length == 0 && !dataLoading">
          <vxa-not-info><span style="font-size: 14px">暂无数据</span></vxa-not-info>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
export default {
  name: 'holderAnalysis',
  data() {
    return {
      radioList: {
        flag: 1,
        list: [
          {label: '图表分析', value: '1'},
          {label: '数据表格', value: '2'}
        ]
      },
      radio: '图表分析',
      tableData: {
        column: [],
        row: []
      },
      chartData: {
        legend: [],
        line: {},
        xAxis: []
      },
      dataLoading: false
    }
  },
  props: ['companyCode'],
  watch: {
    'companyCode': function() {
      this.radioList.flag = 1;
      this.getStockHolderAndShareInfoByStockCode();
    }
  },
  created() {
    if (this.companyCode) {
      this.getStockHolderAndShareInfoByStockCode();
    }
  },
  mounted() {
    // this.getMarketSummaryByEnum(this.chartData);
    // this.getStockHolderAndShareInfoByStockCode();

  },
  methods: {
    sortChange(row) {
      let that = this;
      if (row.order == 'ascending') {
        this.tableData.row = this.tableData.row.sort(function(a, b) {
          return a[row.prop] - b[row.prop]
        });
      } else if (row.order == 'descending') {
        this.tableData.row = this.tableData.row.sort(function(a, b) {
          return b[row.prop] - a[row.prop]
        });
      } else {
        this.tableData.row = this.tableData.row.sort(function(a, b) {
          return that.$common.getTimestampms(b.date) - that.$common.getTimestampms(a.date)
        });
      }
    },
    amountAbs(val) {
      if (val == null || val == '--') {
        return '--'
      } else if (val == 0) {
        return 0;
      } else {
        return this.$array.abs(val, false);
      }
    },
    changeRadio(val) {
      if (val == 1) {
        this.getMarketSummaryByEnum(this.chartData);
      }
    },
    getStockHolderAndShareInfoByStockCode() {
      this.dataLoading = true;
      let params = {
        stockCode: this.companyCode
      }
      this.$axios.gxfApi.getStockHolderAndShareInfoByStockCode(params).then(res => {
        this.dataLoading = false;
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.chartData = res.data.returnObject.chart;
          this.chartData.xAxis = this.chartData.xAxis.reverse();
          this.chartData.line.guJia = this.chartData.line.guJia.reverse();
          this.chartData.line.holderNum = this.chartData.line.holderNum.reverse();
          this.chartData.line.nonBigAveHolderSharePercents = this.chartData.line.nonBigAveHolderSharePercents.reverse();
          this.chartData.line.nonLiuTongAveHolderSharePercents = this.chartData.line.nonLiuTongAveHolderSharePercents.reverse();
          let data = res.data.returnObject.data;
          for (let item of data.row) {
            for (let key in item) {
              if (key == 'nonBigAveHolderSharePercents' || key == 'nonLiuTongAveHolderSharePercents') {
                // item[key] = item[key].toFixed(4)
                if (item[key] >= 1) {
                  item[key] = item[key].toFixed(2)
                } else {
                  if (item[key] != 0) {
                    item[key] = item[key].toPrecision(2)
                  }
                }
              }
              if (key == 'nonBigAveHolderShareAmounts' || key == 'nonLiuTongAveHolderShareAmounts') {
                item[key] = item[key].toFixed(2);
              }
            }
          }
          this.tableData = res.data.returnObject.data;
          this.getMarketSummaryByEnum(this.chartData);
        }
      }).catch(err => {
        this.dataLoading = false;
        this.tableData.row = [];
        this.chartData.xAxis = [];
      })
    },
    getMarketSummaryByEnum(data) {
      this.$nextTick(() => {
        this.echartOverview('echart-holder2', data);
        // this.echartOverviewPrice('echart-stockprice', data);
      })
    },
    echartOverview(id, data) {
      if (!!!document.getElementById(id)) {
        return false
      }
      let myChart = echarts.init(document.getElementById(id));
      let color = ['#FFB148', '#602221', '#C0BAA7'];
      let that = this;
      let option = {
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
            lable: {
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
            let html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                          <span>${data[0].name}</span>
                        </div>`;
            data.forEach((item) => {
              if (item.componentSubType == 'bar') {
                html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${that.amountAbs(item.value)}</span></div>`
              } else {
                html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${item.value}</span></div>`
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
          data: ['股东户数(户)', '每户持股比例(剔除前十大股东)', '每户持股比例(剔除前十大流通股东)']
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
          data: data.xAxis
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
              formatter: '{value}‰'
            },
            // min: 0,
            // max: function(val) {
            //   return val.max * 2
            // },
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
            name: '股东户数(户)',
            type: 'bar',
            itemStyle: {normal: {color: color[0]}},
            barWidth: 14,
            barGap: '63%',
            data: data.line.holderNum
          },
          {
            name: '每户持股比例(剔除前十大股东)',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {normal: {color: color[1]}},
            symbol: "circle",
            symbolSize: 7,
            data: data.line.nonBigAveHolderSharePercents
          },
          {
            name: '每户持股比例(剔除前十大流通股东)',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {normal: {color: color[2]}},
            symbol: "circle",
            symbolSize: 7,
            data: data.line.nonLiuTongAveHolderSharePercents
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option, true);
    },
    echartOverviewPrice(id, data) {
      if (!!!document.getElementById(id)) {
        return false
      }
      let myChart = echarts.init(document.getElementById(id));
      let color = ['#FFB148', '#602221', '#C0BAA7'];
      let that = this;
      let option = {
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
            lable: {
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
            let html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                          <span>${data[0].name}</span>
                        </div>`;
            data.forEach((item) => {
              if (item.componentSubType == 'bar') {
                html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${that.amountAbs(item.value)}</span></div>`
              } else {
                html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${item.value.toFixed(2)}</span></div>`
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
          data: ['股东户数(户)', '收盘价(元)']
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
          data: data.xAxis
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
              formatter: '{value}'
            },
            // min: 0,
            // max: function(val) {
            //   return val.max * 2
            // },
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
            name: '股东户数(户)',
            type: 'bar',
            itemStyle: {normal: {color: color[0]}},
            barWidth: 14,
            barGap: '63%',
            data: data.line.holderNum
          },
          {
            name: '收盘价(元)',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {normal: {color: color[1]}},
            symbol: "circle",
            symbolSize: 7,
            data: data.line.guJia
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
  #holderAnalysis {

    .el-table {
      &::before {
        height: 0;
      }
      th {
        padding: 0 30px;
        height: 35px;
        border: none;
        background:rgba(240,240,240,1);
        .cell {
          font-size:12px;
          font-weight:400;
          text-align: right;
          color:rgba(50,50,50,1);
        }
      }
      td {
        border: none;
        padding: 0 38px;
        height: 35px;
        .cell {
          font-size:12px;
          font-weight:400;
          height: 35px;
          line-height: 35px;
          text-align: right;
          color:rgba(0,0,0,1);
        }
      }
      tr:nth-child(even) {
        background:rgba(248,248,248,1);
      }
      th.headName {
        padding: 0 20px !important;
        .cell {
          color: #8D8D8D !important;
          font-size: 10px !important;
        }
      }
      td.headName {
        .cell {
          padding-right: 0;
          color: black;
        }
      }
      .headNameTop {
        .cell {
          text-align: center !important;
        }
      }
    }
    .echart-holder {
      height: 385px;
      width: 100%;
    }
  }
</style>

<style lang="scss">
  #holderAnalysis {
    .compare {
      // height:500px;
      min-height: 300px;
      border-radius:4px;
      border:1px solid rgba(227,227,227,1);
      padding: 0 15px 16px 16px;
      margin-bottom: 16px;
      .dataNull {
        display: inline-block;
        height: 385px;
        line-height: 385px;
        text-align: center;
        width: 100%;
        color: #909399;
        font-size: 14px;
      }
      .title {
        height: 45px;
        border-bottom:1px solid rgba(227,227,227,1);
        margin-top: 2px;
        margin-bottom: 10px;
        p {
          float: left;
          font-size:14px;
          font-weight:600;
          color:rgba(50,50,50,1);
          margin-top: 13px;
        }
        .el-radio-group {
          float: right;
          margin-top: 8px;
        }
      }
      .tip {
        font-size: 12px;
        font-weight: 400;
        color: #8d8d8d;
        line-height: 16px;
      }
    }
  }
</style>
