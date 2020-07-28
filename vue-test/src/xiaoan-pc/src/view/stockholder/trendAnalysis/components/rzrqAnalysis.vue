<template>
  <div id="rzrqAnalysis" v-if="tableData.length>0">
    <div class="title">
      <p>融资融券情况分析</p>
      <div class="inner">
        <el-radio-group v-model="rdoShow" size="mini">
          <el-radio-button label="table">数据表格</el-radio-button>
          <el-radio-button label="chart">图表分析</el-radio-button>
        </el-radio-group>
        <el-select v-model="slelecValue" placeholder="请选择" size="mini"  @change="getData">
          <el-option
            v-for="item in selectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%;" height="395" size="mini" :default-sort="{prop:'tradeDate', order: 'descending'}" v-show="rdoShow=='table'"  @sort-change="sortChange">
      <el-table-column prop="tradeDate" sortable="custom" label="日期" class-name="first" width="90"></el-table-column>
      <el-table-column prop="finpurch" sortable="custom" label="买入额(元)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.finpurch)}}</template>
      </el-table-column>
      <el-table-column prop="finpmt" sortable="custom" label="偿还额(元) ">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.finpmt)}}</template>
      </el-table-column>
      <el-table-column prop="buy" sortable="custom" label="净买入额(元)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.buy)}}</template>
      </el-table-column>
      <el-table-column prop="finbalance" sortable="custom" label="融资余额(元)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.finbalance)}}</template>
      </el-table-column>
      <el-table-column prop="finbalancetoliqmu" sortable="custom" label="融资余额/流通市值(%)"></el-table-column>
      <el-table-column prop="secsold" sortable="custom" label="卖出量(股)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.secsold)}}</template>
      </el-table-column>
      <el-table-column prop="secpmt" sortable="custom" label="偿还量(股)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.secpmt)}}</template>
      </el-table-column>
      <el-table-column prop="sales" sortable="custom" label="净卖出量(股)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.sales)}}</template>
      </el-table-column>
      <el-table-column prop="secbalancevol" sortable="custom" label="融券余量(股)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.secbalancevol)}}</template>
      </el-table-column>
      <el-table-column prop="secbalance" sortable="custom" label="融券余额(元)">
        <template slot-scope="scope">{{$common.autoPriceUnit(scope.row.secbalance)}}</template>
      </el-table-column>
      <el-table-column prop="secbalancetoliqmu" sortable="custom" label="融券余额/流通市值(%)">
      </el-table-column>
    </el-table>
    <div id="rzrqAnalysisChart1" class="rzrqAnalysisChart" v-show="rdoShow=='chart'"></div>
    <div id="rzrqAnalysisChart2" class="rzrqAnalysisChart" v-show="rdoShow=='chart'"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rdoShow: 'table',
        slelecValue: 'Year',
        selectList: [
          {label: '过去30天', value: 'Thirty_days'},
          {label: '过去90天', value: 'Ninety_days'},
          {label: '过去一年', value: 'Year'}
        ],
        tableData: []
      }
    },
    props: ['companyCode'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      companyCode: function (val) {
        if (val) {
          this.getData()
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')

    },
    mounted() {
      this.getData()
    },
    // 方法
    methods: {
      sortChange(row) {
        console.log(row)
        let that = this;
        if (row.order == 'ascending') {
          this.tableData = this.tableData.sort(function(a, b) {
            return that.sortFiter(a[row.prop], row.prop) - that.sortFiter(b[row.prop], row.prop)
          });
        } else if (row.order == 'descending') {
          this.tableData = this.tableData.sort(function(a, b) {
            return that.sortFiter(b[row.prop], row.prop) - that.sortFiter(a[row.prop], row.prop)
          });
        } else {
          this.tableData = this.tableData.sort(function(a, b) {
            return new Date(b.tradeDate) - new Date(a.tradeDate)
          });
        }
      },
      sortFiter(value, type) {
        if (type == 'tradeDate') {
          return new Date(value)
        } else if (value == '--') {
          return 0
        } else {
          return value
        }
      },
      getData () {
        if (!this.companyCode) {
          return false
        }
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.listAndChartRZRQAnalysis,
          params: {
            userId: this.userId,
            daysEnum: this.slelecValue,
            code: this.companyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject
            this.tableData = data.data || []
            if (this.tableData.length > 0) {
              this.tableData.forEach((item, index) => {
                for (let key in item) {
                  if (item[key] == null || item[key] == '') {
                    // item[key] = '--'
                    item[key] = 0
                  }
                  if (key == 'secbalancetoliqmu' && item[key] != '--') {
                    if (parseFloat(item[key]) >= 1) {
                      item[key] = parseFloat(item[key]).toFixed(2)
                    } else {
                      item[key] = parseFloat(item[key]).toPrecision(2)
                    }
                  }
                }
              })
              let buy = data.chartOne.buy.reverse()
              let dateList = data.chartOne.dateList.reverse()
              let finbalance = data.chartOne.finbalance.reverse()
              let finpmt = data.chartOne.finpmt.reverse()
              let finpurch = data.chartOne.finpurch.reverse()
              let chartOne = {
                buy: buy,
                dateList: dateList,
                finbalance: finbalance,
                finpmt: finpmt,
                finpurch: finpurch
              }

              let sales = data.charTwo.sales.reverse()
              let dateList2 = data.charTwo.dateList.reverse()
              let secbalance = data.charTwo.secbalance.reverse()
              let secpmt = data.charTwo.secpmt.reverse()
              let secsold = data.charTwo.secsold.reverse()
              let chartTwo = {
                buy: sales,
                dateList: dateList2,
                finbalance: secbalance,
                finpmt: secpmt,
                finpurch: secsold
              }

              this.$nextTick(() => {
                let legendData = ['买入额(元)', '偿还额(元)', '净买入额(元)', '融资余额(元)']
                this.chartLine('rzrqAnalysisChart1', chartOne, legendData)

                let legendData2 = ['卖出量(股)', '偿还量(股)', '净卖出量(股)', '融券余额(元)']
                this.chartLine('rzrqAnalysisChart2', chartTwo, legendData2)
              })
            }
          }
        })
      },
      chartLine(id, data, legendData) {
        let that = this
        console.log(data)
        var myChart = echarts.init(document.getElementById(id));
        myChart.clear();
        var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'];
        let dataZoomStart = parseInt((1 - 30 / data.dateList.length) * 100)
        dataZoomStart = dataZoomStart > 0 ? dataZoomStart : 1
        var option = {
          title: {
            text: '',
            show: false,
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
              let html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                      <span>${data[0].name}</span>
                      </div>`
              data.forEach((item, index) => {
                let value = item.value
                if (value == null || value == undefined || value == '') {
                  value = '--'
                } else {
                  value = that.$array.abs(value, true)
                }
                html += `
                  <div style="display:flex;justify-content:space-between">
                    <span>${item.seriesName}：</span><span>${value}</span>
                  </div>
                `
              })
              return html
            }
          },
          grid: {
            show: true,
            top: "15%",
            left: "0%",
            right: "0%",
            bottom: "6%",
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              start: dataZoomStart,
              end: 99,
              top: 400,
              height: 15,
              backgroundColor: '#FFE0B7',
              fillerColor: '#DFCCAF',
              showDataShadow: false,
              showDetail: false,
              handleIcon: 'image://https://oss.in-hope.cn/xiaoan/web_static/echart_circle.png',
              handleSize: '130%'
            },
            {
              type: 'inside',
              show: true,
              start: 0,
              end: 100,
              handleSize: 8
            }
          ],
          legend: {
            selectedMode: true,
            align: 'left',
            top: 10,
            left: 5,
            // data: ['买入额(元)', '偿还额(元)', '净买入额(元)', '融资余额(元)']
            data: legendData
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 90,
              margin: 10,
//              formatter: function (data) {
//                let value = data.toString()
//                if (value.length > 11) {
//                  value = value.substring(0, 12) + '...'
//                }
//                if (value.length > 6) {
//                  value = value.substring(0, 6) + '\n' + value.substring(7, value.length)
//                }
//                return value
//              },
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            minInterval: 1,
            maxInterval: 11,
            interval: 11,
            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: data.dateList
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
              // max: function(value) {
              //   let max = parseInt(value.max * 1.2)
              //   if (max == 0) {
              //     max = 1
              //   }
              //   return max
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
              name: legendData[0],
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              // barMinHeight: 8,
              barWidth: 4,
              barGap: '50%',
              data: data.finpurch
            },
            {
              name: legendData[1],
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              // barMinHeight: 8,
              barWidth: 4,
              barGap: '50%',
              data: data.finpmt
            },
            {
              name: legendData[2],
              type: 'bar',
              itemStyle: {normal: {color: color[2]}},
              // barMinHeight: 8,
              barWidth: 4,
              barGap: '50%',
              data: data.buy
            },
            {
              name: legendData[3],
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: color[3]}},
              symbol: "circle",
              symbolSize: 7,
              data: data.finbalance
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
  #rzrqAnalysis {
    border-radius:4px;
    /*height: 474px;*/
    border:1px solid rgba(227,227,227,1);
    padding: 0 14px 16px 16px;
    margin-bottom: 16px;
    width: 100%;
    .rzrqAnalysisChart {
      height: 420px;
      width: 1168px;
    }
    .title {
      height: 45px;
      border-bottom: 1px solid rgba(227, 227, 227, 1);
      margin-top: 2px;
      margin-bottom: 10px;
      p {
        float: left;
        font-size: 14px;
        font-weight: 600;
        color: rgba(50, 50, 50, 1);
        margin-top: 13px;
      }
      .inner {
        float: right;
        margin-top: 8px;
        .el-select {
          margin-left: 5px;
          .el-input__inner {
            width:93px;
          }
        }

      }
    }
    .el-table {
      &::before {
        height: 0;
      }
      th {
        height: 45px;
        padding: 0;
        text-align: center;
        background:rgba(240,240,240,1);
        .cell {
          padding: 0;
          font-size:12px;
          font-weight:400;
          color:rgba(50,50,50,1);
          line-height: 17px;
        }
      }
      th:nth-child(6), th:nth-child(12) {
        .cell {
          text-align: left;
          width:77px;
          padding-right: 5px;
          height:34px;
          line-height: 17px;
          span {
            position: relative;
            right: -60px;
            top: -34px;
          }
        }
      }
      .first {
        text-align: center;
      }
      td {
        padding: 0;
        height: 35px;
        text-align: right;
        .cell {
          font-size:12px;
          height: 35px;
          line-height: 35px;
          font-weight:400;
          color:rgba(0,0,0,1);
        }
      }
      tr:nth-child(even) {
        background:rgba(248,248,248,1);
      }
    }
  }
</style>
