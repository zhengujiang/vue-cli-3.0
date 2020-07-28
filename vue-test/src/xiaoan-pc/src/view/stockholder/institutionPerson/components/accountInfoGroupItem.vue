<template>
  <el-card v-if="tableData.length > 0" v-loading="tableLoading" id="onePerson" class="box-info-card box-three" shadow="never" body-style="padding:0 16px">
    <div class="info-header vxa-flax-box align vux-1px-b">
      <div class="col t-left shareholder">一致行动人持股变动情况</div>
      <div v-if="timeSelect.length > 5" class="col t-right button-group vxa-flax-box align" style="justify-content: flex-end">
        <el-pagination @prev-click="addLeft" @next-click="addRight" class="primary-small" small background layout="prev, next" :total="page.total"></el-pagination>
        <!-- <el-pagination @prev-click="addLeft('nature')" @next-click="addRight('nature')" class="primary-small" small background layout="prev, next" :total="(timeSelect.length-4)*10"></el-pagination> -->
      </div>
    </div>
    <!-- <el-table v-loading="tableLoading" class="el-data" :data="tableData" stripe -->
    <div v-if="tableData.length > 0">
      <el-table :header-cell-class-name="getHeadClass" v-loading="tableLoading" class="el-data" :data="tableData" stripe
        :span-method="arraySpanMethod" style="width:100%;margin-top:16px">
        <el-table-column prop="groupName" label="股东所属组" align="center" width="100">
          <template style="width: 100%;cursor:pointer" slot-scope="scope">
            <el-row>
              <el-col :span="2" class="item1">
                <span class="pointer" @click="showItemInfo(scope.row,scope.$index)">{{scope.row.groupName}}
                  <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                  <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                </span>
              </el-col>
              <el-col v-if="timeSelect.length >= 5" :span="4" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" :class="['el-right', {'colFive': index == 0}]">
                {{scope.row[item].count}}
              </el-col>
              <el-col v-if="timeSelect.length == 4" :span="5" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right">
                {{scope.row[item].count}}
              </el-col>
              <el-col v-if="timeSelect.length == 3" style="width: 322px" :span="6" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right data-col colThree">
                <span>{{scope.row[item].count}}</span>
              </el-col>
              <el-col v-if="timeSelect.length == 2" :span="10" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right data-col colTwo">
                <span>{{scope.row[item].count}}</span>
              </el-col>
              <el-col v-if="timeSelect.length == 1" :span="20" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right data-col colOne">
                <span>{{scope.row[item].count}}</span>
              </el-col>
              <el-col :span="2" :class="{'colBox': timeSelect.length >= 5}">
                <el-checkbox @change="echartsChange(scope.$index, scope.row.groupId)" v-model="scope.row.checkBox"></el-checkbox>
              </el-col>
            </el-row>
            <div class="group-info" v-show="scope.row.showList">
              <el-row v-for="(item,index) in scope.row[timeSelect[0]].list" :key="index">
                <el-col show-overflow-tooltip :span="2" class="item1" style="padding:0 12px">
                  <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+item.id" target="_blank">
                    <div class="possessorname" :title="item.possessorName">{{ item.possessorName}}</div>
                  </router-link>
                </el-col>
                <el-col v-if="timeSelect.length >= 5" :span="4" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right">
                  {{scope.row[item].count}}
                </el-col>
                <el-col v-if="timeSelect.length == 4" :span="5" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right">
                  {{scope.row[item].count}}
                </el-col>
                <el-col v-if="timeSelect.length == 3" style="width: 322px" :span="6" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right data-col colThree">
                  <span>{{scope.row[item].count}}</span>
                </el-col>
                <el-col v-if="timeSelect.length == 2" :span="10" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right data-col colTwo">
                  <span>{{scope.row[item].count}}</span>
                </el-col>
                <el-col v-if="timeSelect.length == 1" :span="20" v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" class="el-right data-col colOne">
                  <span>{{scope.row[item].count}}</span>
                </el-col>
                <el-col :span="2" :class="['el-right', {'colBox': timeSelect.length >= 5}]">&nbsp;</el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" :prop="item" :label="item + ' 持股数量(股)'" align="right">
          <template slot-scope="scope">
            {{scope.row[item].count}}
          </template>
        </el-table-column>
        <el-table-column label="添加到持股变动图" align="center" width="100">
          <template slot-scope="scope">
            <el-checkbox @change="echartsChange(scope.$index, scope.row.groupId)" v-model="scope.row.checkBox"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-table__footer-wrapper el-table" style="">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__footer" style="width: 1166px;">
          <tbody class="has-gutter">
            <tr>
              <td colspan="1" rowspan="1" style="width: 100px" class="el-table_6_column_10000 is-center is-leaf">
                <div class="cell">合计</div>
              </td>
              <td v-for="(item, index) in timeSelect.slice(numIndex, numIndex + 5)" :key="index" colspan="1" rowspan="2" :class="['el-table_6_column_39', 'is-center', 'is-leaf',{'data-col': timeSelect.length == 3 || timeSelect.length == 2,'colOne': timeSelect.length == 1}]">
                <div :class="['cell',{'colOne': timeSelect.length == 1, 'colTwo': timeSelect.length == 2, 'colThree': timeSelect.length == 3}]"><span>{{amountAbs(totalList[item])}}</span></div>
              </td>
              <td colspan="1" rowspan="1" style="width: 100px" class="el-table_6_column_10001 is-center is-leaf">
                <div class="cell"></div>
              </td>
              <th class="gutter" style="width: 0px; display: none;"></th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="box" v-else>
      <span class="el-table__empty-text">暂无数据</span>
    </div>
    <div v-show="groupIds.length > 0" v-loading="chartLoading">
      <p class="picture">持股变动图</p>
      <div class="echart-overview" id="echart-picture" style="height: 360px" v-loading="companySummaryLading"></div>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "accountInfoGroupItem",
    components: {},
    data() {
      return {
        companySummaryLading: false,
        tableData: [],
        checked: false,
        page: {
          index: 1,
          size: 10,
          total: 100
        },
        timeSelect: [],
        numIndex: 0,
        chartData: {},
        groupIds: [],
        colIndex: 0,
        tableLoading: false,
        chartLoading: false,
        totalList: {}
      }
    },
    computed: {
      shareholderDates: function () {
        console.log(this.$store.state.shareholderDates);
        console.log(this.$store.state.shareholderDates)
        return this.$store.state.shareholderDates
      }
    },
    created() {
    },
    // beforeRouteEnter(to, form, next) {
    //   next(vm => {
    //     console.log(11111);
    //   })
    // },
    mounted() {
      setTimeout(_ => {
        this.$nextTick(() => {
          this.getConcertedShareChanges();
        })
      }, 1000)
    },
    methods: {
      getHeadClass({row, column, rowIndex, columnIndex}) {
        if (this.timeSelect.length == 1 && columnIndex == 1) {
          return 'colOne'
        }
        if (this.timeSelect.length == 2 && (columnIndex == 1 || columnIndex == 2)) {
          return 'colTwo'
        }
        if (this.timeSelect.length == 3 && (columnIndex == 1 || columnIndex == 2 || columnIndex == 3)) {
          return 'colThree'
        }
      },
      amountAbs(val, type) {
        if (val == null || val == '--') {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, type);
        }
      },
      addRight(val) {
        if (this.numIndex + 5 >= this.timeSelect.length) {
            return false
          } else {
            this.numIndex++;
          }
      },
      addLeft(val) {
        if (this.numIndex == 0) {
            return false
          } else {
            this.numIndex--;
          }
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (this.timeSelect.length >= 5) {
          if (columnIndex === 0) {
            return [1, 7];
          } else {
            return [0, 0];
          }
        } else if (this.timeSelect.length == 4) {
          if (columnIndex === 0) {
            return [1, 6];
          } else {
            return [0, 0];
          }
        } else if (this.timeSelect.length == 3) {
          if (columnIndex === 0) {
            return [1, 5];
          } else {
            return [0, 0];
          }
        } else if (this.timeSelect.length == 2) {
          if (columnIndex === 0) {
            return [1, 4];
          } else {
            return [0, 0];
          }
        } else if (this.timeSelect.length == 1) {
          if (columnIndex === 0) {
            return [1, 3];
          } else {
            return [0, 0];
          }
        }

      },
      showItemInfo (row, index) {
        row.showList = !row.showList
        this.tableData = Object.assign([], this.tableData)
      },
      isShowChange(scope) {
       //  console.log(scope);
        let index = scope.$index;
        this.tableData1[index].isActive = !this.tableData1[index].isActive
      },
      getConcertedShareChanges() {
        this.tableLoading = true;
        let time = this.shareholderDates.slice(this.shareholderDates.length - 12, this.shareholderDates.length);
        let shareholderDates = time.map((e, i) => {
          return this.$array.getTimestamps(e);
        });
        // let tmpArray = [];
        // if (shareholderDates.length > 12) {
          // tmpArray = shareholderDates.slice(0, 12);
        // }
        // console.log(tmpArray, shareholderDates);
        let params = {
          recordDates: shareholderDates.toString(),
          possessorAmountOrder: 'DESC',
          id: this.$route.query.id,
          userId: this.$cookie.get('userId')
          // pageNum: this.page.index,
          // pageSize: this.page.size
        };
        this.$axios.gxfApi.getConcertedShareChanges(params).then(res => {
          this.tableLoading = false;
          if (res.data.returnCode == 200) {
            this.tableData = res.data.returnObject;
            // for (let i = 0; i < 3; i++) {
            //   this.tableData.push(res.data.returnObject[0]);
            // }
            let getTime = [];
            for (let key in this.tableData[0]) {
              if (key != 'groupId' && key != 'groupName') {
                let time = this.$common.getTimestampms(key);
                getTime.push(time);
              }
            }
            this.timeSelect = getTime.sort().map(e => {
              return this.$common.transTime(e)[1];
            })
            this.timeSelect = this.timeSelect.reverse();
            this.getTotal();
            this.groupIds = [];
            this.tableData.forEach((e, index) => {
              e.showList = false;
              if (index == 0 || index == 1 || index == 2) {
                e.checkBox = true;
                this.groupIds.push(e.groupId);
              } else {
                e.checkBox = false;
              }
              for (let key of this.timeSelect) {
                e[key].count = this.amountAbs(e[key].count);
              }
            })
            this.page.total = (this.timeSelect.length - 4) * 10;
            this.getGroupComparisonChart();
          }
        }).catch(err => {
          this.tableLoading = false;
        })
      },
      // 获取分组对比变动图
      getGroupComparisonChart() {
        this.chartLoading = true;
        let time = this.shareholderDates.slice(this.shareholderDates.length - 12, this.shareholderDates.length);
        let shareholderDates = time.map((e, i) => {
          return this.$array.getTimestamps(e);
        });
        // let tmpArray = [];
        // if (shareholderDates.length > 12) {
          // tmpArray = shareholderDates.slice(0, 12);
        // }
        let params = {
          recordDates: shareholderDates.toString(),
          groupIds: this.groupIds.join(','),
          userId: this.$cookie.get('userId')
        }
        this.$axios.gxfApi.getGroupComparisonChart(params).then(res => {
          this.chartLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject;
            this.chartData.dateTime = data.map(e => {
              // return this.$common.transTime(e.date)[1]
              return e.date
            });
            this.chartData.stockPrice = data.map(e => {
              return e.stockPrice
            })
            this.chartData.groupName = data[0].gxfGroupInfolist.map(e => {
              return e.groupName
            })
            this.chartData.groupName.push('股价');
            let amountData = []
            data[0].gxfGroupInfolist.forEach((item, index) => {
              let groupName = item.groupName
              let amount = []
              data.forEach((item2, index2) => {
                amount.push(item2.gxfGroupInfolist[index].groupHolderShareAmount)
              })
              amountData.push({'groupName': groupName, 'amount': amount})
            })
            this.chartData.amountData = amountData;
            this.echartOverviewOne('echart-picture', this.chartData);
          }
        }).catch(err => {

        })
      },
      echartsChange(rowIndex, val) {
        this.tableData = Object.assign([], this.tableData);
        const row = this.tableData[rowIndex];
        if (this.groupIds.length < 3) {
          if (row.checkBox) {
            this.groupIds.push(this.tableData[rowIndex].groupId);
          } else {
            let index = this.groupIds.findIndex(e => e == row.groupId);
            this.groupIds.splice(index, 1);
          }
        } else {
          if (row.checkBox) {
            this.$message({showClose: true, type: "error", duration: 3000, message: '最多三个选项'});
            this.$set(row, "checkBox", false);
          } else {
            let index = this.groupIds.findIndex(e => e == row.groupId);
            this.groupIds.splice(index, 1);
          }
        }
        this.getGroupComparisonChart();
      },
      getMarketSummaryByEnumOne() {
        this.companySummaryLading = false;
        // this.echartOverviewOne('echart-picture', this.actionGroupData);
      },
      // 合计
      getTotal() {
        this.totalList = {};
        for (let i = 0; i < this.tableData.length; i++) {
          for (let key of this.timeSelect) {
            if (i == 0) {
              this.totalList[key] = 0;
            }
            this.totalList[key] += this.tableData[i][key].count;
          }
        }
      },
      // getSummaries(param) {
      //   const {columns, data} = param;
      //   const sums = [];
      //   columns.forEach((column, index) => {
      //     if (index === 0) {
      //       sums[index] = '合计';
      //       return;
      //     }
      //     const values = data.map(item => {
      //       var num = /\D+/g;
      //       if (item[column.property] == undefined) {
      //         return false
      //       } else {
      //         return Number(item[column.property].replace(num, ''));
      //       }
      //     });
      //     if (index > 0 && index < 6) {
      //       sums[index] = values.reduce((prev, curr) => {
      //         return prev + curr;
      //       }, 0);
      //     }
      //   });
      //   for (var i = 0; i < sums.length; i++) {
      //     if (!isNaN(sums[i])) {
      //       var num = String(sums[i]).split('').reverse().join('');
      //       sums[i] = num.match(/\d{1,3}/g).join(',').split('').reverse().join('')
      //     }
      //   }
      //   return sums;
      // },
      arrayAbs(value) {
        return this.$array.abs(value, true)
      },
      echartOverviewOne(id, data) {
        console.log(data);
        if (!!!document.getElementById(id)) {
          return false
        }
        let that = this;
        var myChart = echarts.init(document.getElementById(id));
        myChart.clear();
        var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'];
        let seriesData = []
        data.amountData.forEach((item, index) => {
          seriesData.push({
            name: item.groupName,
            type: 'bar',
            itemStyle: {normal: {color: color[index]}},
            barWidth: 10,
            // barMinHeight: 10,
            barGap: '30%',
            // stack: '数量',
            data: item.amount.reverse()
          })
        })
        seriesData.push({
          name: '股价',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {normal: {color: '#C0BAA7'}},
          symbol: "circle",
          symbolSize: 7,
          data: data.stockPrice.reverse()
        })
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
                  if (item.seriesName == '股价') {
                    html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${that.amountAbs(item.value, true)}</span></div>`
                  } else {
                    html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${that.amountAbs(item.value, false)}</span></div>`
                  }

              });
              return html
            }
          },
          grid: {
            top: "15%",
            left: "0%",
            right: "0%",
            bottom: "10%",
            containLabel: true
          },

          legend: {
            selectedMode: true,
            align: 'left',
            top: 0,
            left: 0,
            textStyle: {
              fontSize: 10,
              color: 'rgba(174,174,174,1)'
            },
            data: data.groupName
            // data: ['一致行动人组1(股)', '一致行动人组2(股)', '一致行动人组3(股)', '股价(元)']
          },
          // xAxis: [{
          //   type: "category",
          //   axisLabel: {
          //     rotate: 30,
          //     margin: 10,
          //     textStyle: {
          //       color: "#8d8d8d",
          //       fontSize: 10
          //     }
          //   },
          //   axisTick: {
          //     length: 0
          //   },
          //   axisLine: {
          //     lineStyle: {
          //       color: "#ccc"
          //     }
          //   },
          //   data: data.dateTime.reverse()
          // }],
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 90,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            boundaryGap: true,
            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: data.dateTime.reverse()
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
              // min: 0,
              // max: 900000000,
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
              // max: 30,
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
          dataZoom: [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: 100,
              top: 325,
              height: 15,
              backgroundColor: '#FFE0B7',
              fillerColor: '#DFCCAF',
              showDataShadow: true,
              showDetail: true,
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
          series: seriesData
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang='scss'>
#onePerson {
  .group-info {
    border-top: 1px solid #e3e3e3;
    margin-top: 10px;
  }
  .item1 {
    .possessorname {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .box {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .el-center{
    text-align: center;
  }
  .el-right {
    text-align: right;
  }
  .el-center {
    text-align: center;
  }
  .el-table {
    .colOne {
      text-align: center;
      span {
        padding-right: 9px;
      }
    }
    .colFive {
      width: 195px;
    }
    .colBox {
      width: 95px;
    }
    .colTwo {
      text-align: center;
      span {
        padding-right: 7px;
      }
    }
    .colThree {
      text-align: center;
      span {
        padding-right: 3px
      }
    }
    .cell {
      padding: 0 !important;
    }
    th {
      .cell {
        width: 70px
      }
    }
    .el-table__footer {
      td {
        &:first-child {
          .cell {
            text-align: center;
          }
        }
      }

      .cell {
        text-align: right;
      }
      .colOne {
        text-align: center;
      }
      .colTwo {
        text-align: center;
      }
      .colThree {
        text-align: center;
        span {
          padding-right: 9px;
        }
      }
    }
  }
}

</style>
