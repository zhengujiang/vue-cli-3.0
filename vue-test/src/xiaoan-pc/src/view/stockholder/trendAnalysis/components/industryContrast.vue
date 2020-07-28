<template>
  <div id="industryContrast">
    <div class="compare" v-loading="dataLoading">
      <div class="title">
        <p>同行业股东户数对比</p>
        <div style="display: flex; align-items: center">
          <span class="set-company-btn" @click="setCompnay">设置同行业公司</span>
          <el-radio-group @change="changeRadio" v-model="radioList.flag" size="mini">
            <el-radio-button v-for="(item, index) in radioList.list" :key="index" :label="item.value">{{item.label}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div style="position: relative">
        <div v-if="radioList.flag == 1 && chartData.xAxis.length > 0" class="echart-holder" :key='2' id="echart-industry"></div>
        <div style="height: 60px" v-if="chartData.xAxis.length == 0 && radioList.flag == 1">
          <vxa-not-info><span style="font-size: 14px">暂无数据</span></vxa-not-info>
        </div>
        <template v-if="radioList.flag == 2 && tableData.row.length > 0">
          <el-table @sort-change="sortChange" :default-sort = "{prop: 'date', order: 'descending'}" v-if="radioList.flag == 2" :data="tableData.row" stripe max-height="385" style="width: 100%;">
            <el-table-column align="center" prop="date" sortable label="截止日期"></el-table-column>
            <el-table-column align="right" :prop="item.key" sortable="custom" :label="`${item.name}(户)`" v-for="(item, index) in tableData.column" :key="index">
              <template slot-scope="scope">
                {{amountAbs(scope.row[item.key])}}
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="radioList.flag == 2 && tableData.row.length == 0">
          <div class="noData">
            <span>暂无数据</span>
          </div>
        </template>
      </div>
    </div>
    <industry-company v-if="displayState" :companyCode="companyCode" :setDialogInfo="setDialogInfo" @upAdd="upTitle($event)"></industry-company>
  </div>
</template>
<script>
  import industryCompany from './industryCompany'
export default {
  name: 'holderAnalysis',
  data() {
    return {
      displayState: false,
      setDialogInfo: false, // 设置同行业公司弹框的状态
      radioList: {
        flag: 2,
        list: [
          {label: '图表分析', value: '1'},
          {label: '数据表格', value: '2'}
        ]
      },
      radio: '图表分析',
      tableData: {
        row: [],
        column: []
      },
      dataLoading: false,
      chartData: {
        legend: [],
        line: {},
        xAxis: []
      },
      seriesData: [],
      chartName: []
    }
  },
  props: ['companyCode'],
  watch: {
    'companyCode': function() {
      this.listSameIndustryShareholderss();
    },
    '$store.state.setDialogInfo': function(val) {
      if (val) {
        this.listSameIndustryShareholderss();
      }
    }
  },
  created() {
    if (this.companyCode) {
      this.listSameIndustryShareholderss();
    }
  },
  components: {
    industryCompany
  },
  methods: {
    upTitle (item) {
      this.setDialogInfo = item;
    },
    setCompnay() {
      this.$store.commit('setDialogInfo', false);
      this.setDialogInfo = true;
    },
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
        return '--';
      } else {
        return this.$array.abs(val, false);
      }
    },
    changeRadio(val) {
      if (val == 1) {
        this.echartOverview('echart-industry', this.chartData, this.chartName, this.seriesData);
      }
    },
    listSameIndustryShareholderss() {
      this.displayState = true;
      this.dataLoading = true;
      let params = {
        code: this.companyCode,
        userId: this.$cookie.get('userId')
      }
        this.$axios.gxfApi.listSameIndustryShareholderss(params).then(res => {
          this.dataLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.tableData = res.data.returnObject.data;
            this.chartData = res.data.returnObject.chart;
            this.chartData.xAxis = this.chartData.xAxis.reverse();
            this.seriesData = [];
            this.chartName = [];
            let color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7', '#BB2740'];
            this.chartData.legend.forEach((e, index) => {
              this.chartName.push(e.name);
              for (let item in this.chartData.line) {
                if (e.key == item) {
                  this.seriesData.push({
                    name: e.name,
                    type: 'line',
                    yAxisIndex: 1,
                    itemStyle: {normal: {color: color[index]}},
                    symbol: "circle",
                    symbolSize: 7,
                    data: this.chartData.line[item].reverse()
                  })
                }
              }
            })
            // for (let item of this.tableData.row) {
            //   for (let key in item) {
            //     if (key != 'date') {
            //       item[key] = this.amountAbs(item[key]);
            //     }
            //   }
            // }
          } else {
            this.tableData.row = [];
            this.chartData.xAxis = [];
          }
        }).catch(err => {
          this.dataLoading = false;
          this.tableData.row = [];
          this.chartData.xAxis = [];
        })
    },
    echartOverview(id, data, chartName, seriesData) {
      var myChart = echarts.init(document.getElementById(id));
      var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7', '#BB2740'];
      let that = this;
      // let name = [],
      //     that = this,
      //     seriesData = [];
      // data.legend.forEach((e, index) => {
      //   name.push(e.name);
      //   for (let item in data.line) {
      //     if (e.key == item) {
      //       seriesData.push({
      //         name: e.name,
      //         type: 'line',
      //         yAxisIndex: 1,
      //         itemStyle: {normal: {color: color[index]}},
      //         symbol: "circle",
      //         symbolSize: 7,
      //         data: data.line[item]
      //       })
      //     }
      //   }
      // })
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
            var html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                          <span>${data[0].name}</span>
                        </div>`;
            data.forEach((item) => {
              html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${that.amountAbs(item.value)}</span></div>`
            });
            return html
          }
        },
        grid: {
          top: "15%",
          left: "0%",
          right: "1%",
          bottom: "0%",
          containLabel: true
        },
        legend: {
          selectedMode: true,
          align: 'left',
          top: 10,
          left: 0,
          data: chartName
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
              },
              formatter: '{value}'
            },
            position: 'right',
            splitLine: {
              show: true
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
              }
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
          }
        ],
        series: seriesData
        // series: [
        //   {
        //     name: '广州珠江实业集团有限公司(股)',
        //     type: 'bar',
        //     itemStyle: {normal: {color: color[0]}},
        //     barWidth: 14,
        //     barGap: '63%',
        //     data: data.question
        //   },
        //   {
        //     name: 'b股东(股)',
        //     type: 'bar',
        //     itemStyle: {normal: {color: color[1]}},
        //     barWidth: 14,
        //     barGap: '63%',
        //     data: data.answer
        //   },
        //   {
        //     name: 'c股东(股)',
        //     type: 'bar',
        //     itemStyle: {normal: {color: color[2]}},
        //     barWidth: 14,
        //     barGap: '63%',
        //     data: data.answer
        //   },
        //   {
        //     name: '股价(元)',
        //     type: 'line',
        //     yAxisIndex: 1,
        //     itemStyle: {normal: {color: color[3]}},
        //     symbol: "circle",
        //     symbolSize: 7,
        //     data: data.answerRate
        //   }
        // ]
      };
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option, true);
    }

  }
}
</script>
<style lang="scss">
  #industryContrast {
    .el-table {
      border: none;
      .headName {
        padding: 0 20px !important;
        .cell {
          color: #8D8D8D !important;
          font-size: 10px !important;
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
    .manage-btn {
      width:60px;
      height:20px;
      font-size:14px;
      font-weight:400;
      color:#FFB148;
      line-height:20px;
      text-decoration: underline;
      cursor: pointer;
    }
  }
</style>

<style lang="scss">
  #industryContrast {
    .noData {
      display: flex;
      justify-content:center;  //水平居中
      align-items:Center;      //垂直居中
      color: #8d8d8d;
      font-size: 14px;
    }
    .compare {
      min-height: 300px;
      border-radius:4px;
      border:1px solid rgba(227,227,227,1);
      padding: 0 15px 16px 16px;
      margin-bottom: 16px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
      }
    }
    .set-company-btn {
      height:20px;
      font-size:14px;
      font-weight:400;
      color:#FFB148;
      line-height:20px;
      text-decoration: underline;
      cursor: pointer;
      margin: 5px 15px 0 0;
    }
  }
</style>
