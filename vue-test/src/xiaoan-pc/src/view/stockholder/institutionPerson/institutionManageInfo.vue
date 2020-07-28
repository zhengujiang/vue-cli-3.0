<template>
  <div id="institutionManageInfo">
    <div class="basicInfo">
      <el-card v-loading='infoLoading' class="box-info-card" shadow="never" body-style="padding:0 16px">
        <div class="info-header">
          <p class="shareholder">管理人信息</p>
        </div>
        <table class="table possessor">
          <tr>
            <td class="one">统一社会信用代码</td>
            <td class="two">{{infoData['统一社会信用代码']}}</td>
            <td class="one">注册号</td>
            <td class="three">{{infoData['注册号']}}</td>
          </tr>
          <tr>
            <td class="odd">名称</td>
            <td>{{infoData['名称']}}</td>
            <td class="odd">类型</td>
            <td>{{infoData['类型']}}</td>
          </tr>
          <tr>
            <td class="odd">法定代表人</td>
            <td>{{infoData['法定代表人']}}</td>
            <td class="odd">注册资本</td>
            <td v-if="infoData['注册资本']">{{infoData['注册资本']}}万{{infoData['注册资本币种']}}</td>
            <td v-else>--</td>
          </tr>
          <tr>
            <td class="odd">成立日期</td>
            <td>{{infoData['成立日期']}}</td>
            <td class="odd">经营期限自</td>
            <td>{{infoData['经营期限自']}}</td>
          </tr>
          <tr>
            <td class="odd">登记机关</td>
            <td>{{infoData['登记机关']}}</td>
            <td class="odd">核准日期</td>
            <td>{{infoData['核准日期']}}</td>
          </tr>
          <tr>
            <td class="odd">登记状态</td>
            <td>{{infoData['登记状态']}}</td>
            <td class="odd">地址</td>
            <td>{{infoData['地址']}}</td>
          </tr>
          <tr>
            <td class="odd">经营范围</td>
            <td colspan="3" class="last">
              <div style="padding: 10px 0">
                {{infoData['经营范围']}}
              </div>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card v-if="tableData.length > 0" class="box-info-card card-sencond" shadow="never" body-style="padding:0 16px">
        <div class="info-header vux-1px-b flex-box">
          <div class="col">
            <p class="shareholder">旗下产品持有公司股份的情况</p>
          </div>
          <div class="col t-right">
            <span class="page-img" v-if="timeSelect.length>5">
              <el-pagination @prev-click="addLeft()" @next-click="addRight()" class="primary-small" small background layout="prev, next" :total="(timeSelect.length-4)*10"></el-pagination>
            </span>
          </div>
        </div>
        <el-table show-summary :summary-method="getSummaries" :data="tableData" stripe
                  style="width:100%;margin-top:16px">
          <el-table-column align="center" show-overflow-tooltip prop="possessorName" label="股东名称"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="type" label="股东性质">
            <template slot-scope="scope">
              {{holderOptions[scope.row.type]}}
            </template>
          </el-table-column>
          <el-table-column align="right" class-name="data-sort" prop="orderNum" label="最新持股数量排名" width="160" sortable></el-table-column>
          <el-table-column v-for="(item, index) in timeData" class-name="data-num" :key="index" align="right" :prop="item" :label="item + '持股数量(股)'">
            <!-- <template slot-scope="scope">
              {{amountAbs(scope.row[item])}}
              {{aa(scope.row)}}
            </template> -->
          </el-table-column>
          <!-- <el-table-column align="right" prop="number7" label="2018-07-31 持股数量(股)"></el-table-column>
          <el-table-column align="right" prop="number6" label="2018-06-31 持股数量(股)"></el-table-column>
          <el-table-column align="right" prop="number5" label="2018-05-31 持股数量(股)"></el-table-column>
          <el-table-column align="right" prop="number4" label="2018-04-31 持股数量(股)"></el-table-column> -->
          <el-table-column align="center" class-name="data-box" label="添加到持股变动图">
            <!-- <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template> -->
            <template slot-scope="scope">
              <el-checkbox @change="echartsChange(scope.$index, scope.row.onePassAccount)" v-model="scope.row.checked"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="onePassAccount.length > 0">
          <p class="picture">持股变动图</p>
          <div class="echart-overview" id="echart-picture"></div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        manageInfoData: [
          {
            'tab': '账户信息', 'tabShow': ''
          }, {
            'tab': '产品基本信息', 'tabShow': ''
          }, {
            'tab': '管理人信息', 'tabShow': true
          }, {
            'tab': '其他持股情况', 'tabShow': ''
          }],
        tableData: [],
        checked: true,
        companySummaryLadingOne: false,
        actionGroupData: {
          dateTime: ['2018-8-27', '2018-8-27', '2018-8-27', '2018-8-27', '2018-8-27'],
          actionGroupOne: [200000000, 200000000, 200000000, 200000000, 200000000],
          actionGroupTwo: [200000000, 200000000, 200000000, 200000000, 200000000],
          actionGroupThree: [300000000, 300000000, 300000000, 300000000, 300000000],
          price: [5, 10, 25, 20, 17]
        },
        infoData: {},
        infoLoading: false,
        recordDate: '',
        timeSelect: [],
        holderOptions: {},
        indexNum: 0,
        timeData: [],
        onePassAccount: []
      }
    },
    // 使用其它组件
    components: {},
    computed: {
      institutionAccountInfo: function () {
        return this.$store.state.institutionAccountInfo
      }
    },
    watch: {
      institutionAccountInfo: function (val) {
        // this.riskstorm(val.possessorName);
      }
    },
    // 生命周期函数
    created() {
      // this.holderOptions = this.$config.gxfType;
      // let val = this.$store.state.institutionAccountInfo;
      // this.riskstorm(val.possessorName);
      // this.getOtherProductsShareChanges();
    },
    mounted() {
      // this.getMarketSummaryByEnumOne();
      this.holderOptions = this.$config.gxfType;
      let val = this.$store.state.institutionAccountInfo;
      if (val.possessorName) {
        // this.riskstorm(val.possessorName);
      }
      this.getGroupListInfo();
      this.getManageInfo();
    },
    // 方法
    methods: {
      amountAbs(val) {
        if (val == null || val == '--') {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      addRight() {
        if (this.indexNum + 5 >= this.timeSelect.length) {
          return false
        } else {
          this.indexNum++;
        }
        this.timeData = this.timeSelect.slice(this.indexNum, this.indexNum + 5)
        this.timeData = Object.assign([], this.timeData)
      },
      addLeft() {
        if (this.indexNum == 0) {
          return false
        } else {
          this.indexNum--;
        }
        this.timeData = this.timeSelect.slice(this.indexNum, this.indexNum + 5)
        this.timeData = Object.assign([], this.timeData)
      },
      echartsChange(rowIndex, val) {
        this.tableData = Object.assign([], this.tableData);
        const row = this.tableData[rowIndex];
        if (this.onePassAccount.length < 3) {
          if (row.checked) {
            this.onePassAccount.push(this.tableData[rowIndex].onePassAccount);
          } else {
            let index = this.onePassAccount.findIndex(e => e == row.onePassAccount);
            this.onePassAccount.splice(index, 1);
          }
        } else {
          if (row.checked) {
            this.$message({showClose: true, type: "error", duration: 3000, message: '最多三个选项'});
            this.$set(row, "checked", false);
          } else {
            let index = this.onePassAccount.findIndex(e => e == row.onePassAccount);
            this.onePassAccount.splice(index, 1);
          }
        }
        this.getOtherProductsShareChangesTu();
      },
      // 持股变动图
      getOtherProductsShareChangesTu() {
        let shareholderDates = this.recordDate.map((e, i) => {
          return this.$array.getTimestamps(e);
        });
        let params = {
          id: this.$route.query.id,
          // id: 123,
          userId: this.$cookie.get('userId'),
          recordDates: shareholderDates.join(','),
          onePassAccounts: this.onePassAccount.join(',')
        }
        this.$axios.gxfApi.getOtherProductsShareChangesTu(params).then(res => {
          if (res.data.returnObject) {
            let data = res.data.returnObject;
            let chartData = {};
            chartData.dateTime = data.map(e => {
              return e.record
            })
            chartData.stockPrice = data.map(e => {
              return e.price
            })
            chartData.possessorName = data[0].list.map(e => {
              return e.possessorName
            })
            chartData.possessorName.push('股价')

            let amountData = []
            data[0].list.forEach((item, index) => {
              let possessorName = item.possessorName
              let amount = []
              data.forEach((item2, index2) => {
                amount.push(item2.list[index].possessorAmount)
              })
              amountData.push({'possessorName': possessorName, 'amount': amount})
            })
            chartData.amountData = amountData

            this.echartOverviewOne('echart-picture', chartData);
          }
        })
      },
      getGroupListInfo() {
        let params = {
          userId: this.$cookie.get('userId')
        };
        this.$axios.gxfApi.getLastedRecordDate(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.recordDate = res.data.returnObject;
            this.recordDate.reverse();
            this.getOtherProductsShareChanges();
          }
        }).catch(() => {

        })
      },
      getManageInfo() {
        this.infoLoading = true
        let params = {
          id: this.$route.query.id,
          userId: this.$cookie.get('userId')
        }
        this.$axios.gxfApi.getManageInfo(params).then(res => {
          this.infoData = res.data.returnObject;
          this.infoLoading = false;
        }).catch(err => {
          this.infoLoading = false;
        })
      },
      //  POST /rollOfficialData/getOtherProductsShareChanges
      getOtherProductsShareChanges() {
        let shareholderDates = this.recordDate.map((e, i) => {
          return this.$array.getTimestamps(e);
        });
        let params = {
          id: this.$route.query.id,
          // id: 123,
          userId: this.$cookie.get('userId'),
          recordDates:shareholderDates.join(',')
        };
        this.$axios.gxfApi.getOtherProductsShareChanges(params).then(res => {
          if (res.data.returnCode == 200) {
            // res.data.returnObject.forEach(item => {
            //   item['2017-11-10'] = 5847385741;
            //   item['2017-08-10'] = 5844334734;
            //   item['2017-10-10'] = 6847385002;
            //   item['2017-09-10'] = 5845385226;
            //   item['2017-06-10'] = 5847386444;
            //   item['2017-05-10'] = 2247335611;
            //   item['2017-07-10'] = 5847333257;
            // })
            if (res.data.returnObject) {
              this.indexNum = 0;
              this.onePassAccount = [];
              for (let i = 0; i < res.data.returnObject.length; i++) {
                if (i == 0 || i == 1 || i == 2) {
                  res.data.returnObject[i].checked = true;
                  this.onePassAccount.push(res.data.returnObject[i].onePassAccount);
                } else {
                  res.data.returnObject[i].checked = false;
                }
              }
              this.tableData = res.data.returnObject;
              this.timeSelect = [];
              for (let key in this.tableData[0]) {
                if (key != 'orderNum' && key != 'possessorName' && key != 'type' && key != 'checked' && key != 'onePassAccount') {
                  this.timeSelect.push(key);
                }
              }
              let date = this.timeSelect.map(item => {
                return new Date(Date.parse(item.replace(/-/g, '/'))).getTime();
              })
              this.timeSelect = date.sort();
              let time = this.timeSelect.map(item => {
                return this.$common.transTime(item)[1];
              })
              this.timeSelect = time.reverse();
              this.timeSelect.forEach(item => {
                this.tableData.forEach(data => {
                  data[item] = this.amountAbs(data[item]);
                })
              })
              this.actionGroupData.dataTime = this.timeSelect;
              this.timeData = this.timeSelect.slice(this.indexNum, this.indexNum + 5);
            }
            this.getOtherProductsShareChangesTu();
          }
        }).catch(err => {

        })
      },
      // 求和
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        let reg = new RegExp(",", "g");
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => {
            var box = /\D+/g;
            if (item[column.property] == undefined) {
              return false
            } else {
              let val = item[column.property].replace(reg, '');
              return Number(val);
            }
          });
          if (this.timeSelect.length > 5) {
            if (index > 2 && index < 8) {
              sums[index] = values.reduce((prev, curr) => {
                if (!prev) prev = 0; 
                if (!curr) curr = 0; 
                return prev + curr;
              }, 0);
            }
          } else if (index > 2 && index < this.timeSelect.length + 3) {
            sums[index] = values.reduce((prev, curr) => {
              if (!prev) prev = 0; 
              if (!curr) curr = 0; 
              return prev + curr;
            }, 0);
          }
        });
        for (var i = 0; i < sums.length; i++) {
          if (!isNaN(sums[i])) {
            var num = String(sums[i]).split('').reverse().join('');
            sums[i] = num.match(/\d{1,3}/g).join(',').split('').reverse().join('')
          }
        }
        return sums;
      },
      // getMarketSummaryByEnumOne() {
      //   this.companySummaryLadingOne = false;
      //   this.echartOverviewOne('echart-picture', this.actionGroupData);
      // },
      echartOverviewOne(id, data) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'];
        let seriesData = [];
        let that = this;
        data.amountData.forEach((item, index) => {
          seriesData.push({
            name: item.possessorName,
            type: 'bar',
            itemStyle: {normal: {color: color[index]}},
            barMinHeight: 10,
            barWidth: 19,
            barGap: '40%',
            stack: 'num',
            data: item.amount
          })
        })
        seriesData.push({
          name: '股价',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {normal: {color: '#C0BAA7'}},
          symbol: "circle",
          symbolSize: 7,
          data: data.stockPrice
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
              // label: {
              //   show: false
              // },
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
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${that.amountAbs(item.value)}%</span></div>`
                } else {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${that.amountAbs(item.value)}</span></div>`
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
            top: 0,
            left: 0,
            textStyle: {
              fontSize: 10,
              color: 'rgba(174,174,174,1)'
            },
            data: ['汇添富1号(股)', '汇添富2号(股)', '汇添富3号(股)', '股价(元)']
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
          series: seriesData
          // series: [
          //   {
          //     name: '汇添富1号(股)',
          //     type: 'bar',
          //     stack: '总量',
          //     itemStyle: {normal: {color: color[0]}},
          //     barWidth: 19,
          //     data: data.actionGroupOne
          //   },
          //   {
          //     name: '汇添富2号(股)',
          //     type: 'bar',
          //     stack: '总量',
          //     itemStyle: {normal: {color: color[1]}},
          //     barWidth: 19,
          //     // barGap: "63%",
          //     data: data.actionGroupTwo
          //   },
          //   {
          //     name: '汇添富3号(股)',
          //     type: 'bar',
          //     stack: '总量',
          //     itemStyle: {normal: {color: color[2]}},
          //     barWidth: 19,
          //     // barGap: "63%",
          //     data: data.actionGroupThree
          //   },
          //   {
          //     name: '股价(元)',
          //     type: 'line',
          //     yAxisIndex: 1,
          //     itemStyle: {normal: {color: color[3]}},
          //     symbol: "circle",
          //     symbolSize: 7,
          //     data: data.price
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
  #institutionManageInfo {
    .header {
      width: 100%;
      height: 100px;
      box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.09);
      .title {
        display: flex;
        align-items: center;
        height: 100px;
        .details {
          font-size: 20px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
        }
      }
    }
    .el-table {
      th.data-sort {
        .cell {
          width: 75px;
          height: 34px;
          padding: 0;
          line-height: 17px;
          padding-right: 18px;
          .caret-wrapper {
            position: relative;
            top: -34px;
            right: -20px;
          }
        }
      }
      th.data-num {
        .cell {
          width: 90px;
        }
      }
      th.data-box{
        .cell {
          width: 85px;
          text-align: left;
        }
      }
    }
    .content {
      .manage {
        height: 68px;
        border-bottom: 1px solid rgba(227, 227, 227, 1);
        .manageInfoList {
          height: 100%;
          float: left;
          font-size: 16px;
          padding: 0;
          margin: 30px 45px 16px 0;
          cursor: pointer;
          &:hover {
            color: #FFAC38;
          }
        }
        .manageInfoListVisted {
          padding-bottom: 15px;
          border-bottom: 2px solid #FFAC38;
          color: #FFAC38;
        }
      }
      .box-info-card {
        width: 100%;
        background: white;
        margin-top: 16px;
        border-color: #e3e3e3;
        .info-header {
          display: flex;
          height: 45px;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 20px;
        }
        .table {
          width: 100%;
          font-size: 12px;
          font-weight: 400;
          color: rgba(50, 50, 50, 1);
          margin-bottom: 16px;
          border-top: 1px solid rgba(227, 227, 227, 1);
          tr {
            border-bottom: 1px solid rgba(227, 227, 227, 1);
          }
          td {
            padding: 9px;
          }
          td:nth-child(odd) {
            width: 136px;
            text-align: right;
            padding-right: 16px;
            background: rgba(248, 248, 248, 1);
          }
          td:nth-child(even) {
            padding-left: 16px;
          }
          td:nth-child(2) {
            width: 449px;
          }
          td:nth-child(4) {
            width: 463px;
          }
          .last {
            line-height: 17px;
          }
        }
      }
    }
    .flex-box {
      display: flex;
      .col {
        flex: 1;
      }
    }
    .el-table {
      th {
        .cell {
          padding: 0
        }
      }
    }
    .echart-overview {
      height: 315px;
      width: 100%;
    }
    .picture {
      font-size: 14px;
      font-weight: 600;
      color: rgba(50, 50, 50, 1);
      line-height: 20px;
      margin: 16px auto;
    }
  }
</style>
