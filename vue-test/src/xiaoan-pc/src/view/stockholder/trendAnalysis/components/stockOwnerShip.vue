<template>
  <div id="stockOwnerShip" v-if="tableData.length>0">
    <div class="title">
      <p>沪、深股通持股情况分析</p>
      <div class="inner">
        <el-radio-group v-model="rdoShow" size="mini">
          <el-radio-button label="table">数据表格</el-radio-button>
          <el-radio-button label="chart">图表分析</el-radio-button>
        </el-radio-group>
        <el-select v-model="slelecValue" placeholder="请选择" size="mini" @change="getData">
          <el-option
            v-for="item in selectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table @sort-change="sortChange" :data="tableData" stripe style="width: 100%;" height="395" size="mini" :default-sort="{prop:'tradeDate', order: 'descending'}" v-show="rdoShow=='table'">
      <el-table-column prop="tradeDate" sortable="custom" label="日期"  width="100" align="center"></el-table-column>
      <el-table-column prop="closePrice" sortable="custom" label="收盘价(元)" align="right">
      </el-table-column>
      <el-table-column prop="sharehdNum" sortable="custom" label="系统持股量(股)" align="right">
        <template slot-scope="scope">{{$array.amountAbs(scope.row.sharehdNum)}}</template>
      </el-table-column>
      <el-table-column prop="plusMinusSharesNum" sortable="custom" label="增减持数量(股)" align="right">
        <template slot-scope="scope">{{$array.amountAbs(scope.row.plusMinusSharesNum)}}</template>
      </el-table-column>
      <el-table-column prop="marketCapitalisation" sortable="custom" label="系统持股市值(元)" align="right">
        <template slot-scope="scope">{{$array.abs(scope.row.marketCapitalisation, true)}}</template>
      </el-table-column>
      <el-table-column prop="sharehdpct" sortable="custom" label="占流通A股(公布)(%)" align="right"></el-table-column>
    </el-table>
    <div id="stockOwnerShipChart" v-show="rdoShow=='chart'"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rdoShow: 'chart',
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
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.listAndChartSHSZGTStockOwnershipAnalysis,
          params: {
            userId: this.userId,
            daysEnum: this.slelecValue,
            code: this.companyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject
            this.tableData = data.data
            if (this.tableData.length > 0) {
              this.tableData.forEach((item, index) => {
                for (let key in item) {
                  if (item[key] == null || item[key] == '') {
                     item[key] = '--'
                  }
                  if ((key == 'closePrice' || key == 'sharehdpct') && item[key] != '--') {
                    item[key] = item[key].toFixed(2)
                  }
                }
              })
              let closePriceList = data.chart.closePriceList.reverse()
              let dateList = data.chart.dateList.reverse()
              let sharehdpct = data.chart.sharehdpct.reverse()
              sharehdpct.forEach((item, index) => {
                if (typeof item == 'number') {
                  sharehdpct[index] = item.toFixed(2)
                } else {
                  sharehdpct[index] = '--'
                }
              })
              let dataChart = {
                closePriceList, dateList, sharehdpct
              }
              this.$nextTick(() => {
                this.chartLine('stockOwnerShipChart', dataChart)
              })
            }

          }
        })
      },
      chartLine(id, data) {
        console.log(data)
        var myChart = echarts.init(document.getElementById(id));
        myChart.clear();
        var color = ['#602221', '#FFB148', '#FFE0B7'];
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
                if ((value == null || value == undefined || value == '') && value != 0) {
                  value = '--'
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
              start: 0,
              end: 99,
              top: 340,
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
            data: ['收盘价(元)', '占流通A股(公开)(%)']
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
                formatter: '{value}%'
              },
              // min: 0,
              // max: function(value) {
              //   let max = parseInt(value.max * 2)
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
              name: '收盘价(元)',
              type: 'line',
              yAxisIndex: 0,
              itemStyle: {normal: {color: color[0]}},
              symbol: "circle",
              symbolSize: 7,
              data: data.closePriceList
            },
            {
              name: '占流通A股(公开)(%)',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: color[1]}},
              symbol: "circle",
              symbolSize: 7,
              data: data.sharehdpct
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
  #stockOwnerShip {
    border-radius:4px;
    /*height: 413px;*/
    border:1px solid rgba(227,227,227,1);
    padding: 0 14px 16px 16px;
    margin-bottom: 16px;
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
    }
    #stockOwnerShipChart {
      height: 360px;
      width: 100%;
    }
  }
</style>
