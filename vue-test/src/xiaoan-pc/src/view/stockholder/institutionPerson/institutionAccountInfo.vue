<template>
  <div id="institutionAccountInfo">
    <div class="basicInfo">
      <el-card class="box-info-card" shadow="never" body-style="padding:0 16px">
        <div class="info-header">
          <p class="shareholder">股东基本信息（截至{{institutionAccountInfo.recordDate}}期）</p>
        </div>
        <table class="table possessor">
          <tr>
            <td class="one">股东名称</td>
            <td class="two">{{institutionAccountInfo.possessorName}}</td>
            <td class="one">证件号码</td>
            <td class="three">{{institutionAccountInfo.idNumber}}</td>
            <td class="four">一码通账户号码</td>
            <td>{{institutionAccountInfo.onePasswordAccount}}</td>
          </tr>
          <tr>
            <td class="odd">股东性质</td>
            <td>{{institutionAccountInfo.possessorTypeName}}</td>
            <td class="odd">股东持股总数</td>
            <td>{{amountAbs(institutionAccountInfo.possessorAmount)}}</td>
            <td class="odd">持股比例</td>
            <td>{{institutionAccountInfo.possessorRatio}}%</td>
          </tr>
          <tr>
            <td class="odd">普通证券账户持股</td>
            <td>{{amountAbs(institutionAccountInfo.normalSecurityPossessorAmount)}}</td>
            <td class="odd">信用证券账户持股</td>
            <td>{{amountAbs(institutionAccountInfo.investorCreditPossessorAmount)}}</td>
            <td class="odd">限售股</td>
            <td>
              <div class="" v-if="institutionAccountInfo.shareRestrictAmount == null">
                <span>--</span>
              </div>
              <div v-else-if="institutionAccountInfo.shareRestrictAmount == 0">
                <span>--</span>
              </div>
              <div v-else>
                <span>{{amountAbs(institutionAccountInfo.shareRestrictAmount)}}</span>
                <!-- <span class="seeDetails" @click="amountClick">(查看详情)</span> -->
              </div>
            </td>
          </tr>
          <tr>
            <td class="odd">流通股</td>
            <td>{{amountAbs(institutionAccountInfo.shareCirculateAmount)}}</td>
            <td class="odd">质押/冻结数量</td>
            <td>{{amountAbs(institutionAccountInfo.pledgeFreezeAmount)}}</td>
            <td class="odd">电话</td>
            <td>{{institutionAccountInfo.messagePhone}}</td>
          </tr>
          <tr>
            <td class="odd">邮编</td>
            <td>{{institutionAccountInfo.postCode}}</td>
            <td class="odd">股东地址</td>
            <td colspan="3">{{institutionAccountInfo.messageAddress}}</td>
          </tr>
        </table>
      </el-card>
      <!---->
      <account-info-item></account-info-item>
      <!---->
      <account-info-group-item></account-info-group-item>
      <!---->
    </div>
    <el-dialog class="dialog-class" title="限售股解禁时间表" :visible.sync="liftAban" width="900px" top="30vh">
      <div class="liftAban-table">
        <el-table class="el-data" show-summary size="mini" :summary-method="getSum" :data="liftAbanData" stripe>
          <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
          <el-table-column prop="time" label="解禁时间" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="number" label="解禁股份数量(股)" align="center" sortable width="180"></el-table-column>
          <el-table-column prop="type" label="限售类型" align="center" width="130"></el-table-column>
          <el-table-column prop="proportion" label="占解禁前流通股数量比例(%)" align="center" sortable
                           width="200"></el-table-column>
          <el-table-column prop="radio" label="占总股本数量比例(%)" align="center" sortable></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import AccountInfoItem from './components/accountInfoItem.vue'
  import AccountInfoGroupItem from './components/accountInfoGroupItem.vue'
  export default {
    data() {
      return {
        tableData: [
          {
            period: "2018-08-31", number: "234,234,345", sort: "3", limit: "265,409,503", circulation: "265,409,503",
            ordinary: "364,678", credit: "364,678", pledge: "0"
          }
        ],
        liftAbanData: [
          {time: "2020-08-22", number: "210,676.6", type: "股权激励限售股份", proportion: "0.05", radio: "0.05"},
          {time: "2020-08-22", number: "210,676.6", type: "股权激励限售股份", proportion: "0.05", radio: "0.05"},
          {time: "2020-08-22", number: "210,676.6", type: "股权激励限售股份", proportion: "0.05", radio: "0.05"},
          {time: "2020-08-22", number: "210,676.6", type: "股权激励限售股份", proportion: "0.05", radio: "0.05"},
          {time: "2020-08-22", number: "210,676.6", type: "股权激励限售股份", proportion: "0.05", radio: "0.05"}
        ],
        companySummaryLading: false,
        companySummaryLadingOne: false,
        companySummaryData: {
          dateTime: ['2018-8-27', '2018-8-27', '2018-8-27', '2018-8-27', '2018-8-27'],
          question: [700000000, 700000000, 700000000, 700000000, 700000000],
          answer: [300000000, 300000000, 300000000, 300000000, 300000000],
          answerRate: [100000000, 100000000, 100000000, 100000000, 100000000],
          price: [5, 10, 25, 20, 17]
        },
        selectAll: 'LASTMONTH', // 1图的 时间 select
        actionGroupData: {
          dateTime: ['2018-8-27', '2018-8-27', '2018-8-27', '2018-8-27', '2018-8-27'],
          actionGroupOne: [200000000, 200000000, 200000000, 200000000, 200000000],
          actionGroupTwo: [200000000, 200000000, 200000000, 200000000, 200000000],
          actionGroupThree: [300000000, 300000000, 300000000, 300000000, 300000000],
          price: [5, 10, 25, 20, 17]
        },
        checked: true,
        liftAban: false,
        restrictionDetails: []
      }
    },
    // 使用其它组件
    components: {
      AccountInfoItem,
      AccountInfoGroupItem
    },
    computed: {
      institutionAccountInfo: function () {
        return this.$store.state.institutionAccountInfo
      }
    },
    watch: {
      institutionAccountInfo: function (val) {
        console.log(123123, val)
      }
    },
    // 生命周期函数
    created() {
      for (let index = 0; index < 3; index++) {
        this.tableData = this.tableData.concat(this.tableData);
      }
    },
    mounted() {
      // 图表的方法
      this.getMarketSummaryByEnum();
      // this.getMarketSummaryByEnumOne();
    },
    // 方法
    methods: {
      amountAbs(val) {
        if (val == null) {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      //
      getMarketSummaryByEnumOne() {
        this.companySummaryLading = false;
        this.echartOverviewOne('echart-picture', this.actionGroupData);
      },
      getRestrictionDetails() {
        let params = {
          id: this.$route.query.id,
          userId: this.$cookie.get('userId')
        };
        this.liftAban = true;
        this.$axios.gxfApi.getRestrictionDetails(params).then((res) => {
          if (res.data.returnCode == 200) {
            // console.log(res);
            this.restrictionDetails = res.data.returnObject;
          }
        }).catch((err) => {

        })
      },
      amountClick() {
        this.getRestrictionDetails();
        this.liftAban = true;
      },
      //
      getMarketSummaryByEnum() {
        this.companySummaryLading = false;
        this.echartOverview('echart-overview', this.companySummaryData);
      },
      echartOverview(id, data) {
        if (!!!document.getElementById(id)) {
          return false
        }
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'];
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
            data: ['持股数量(股)', '限售股(股)', '质押/冻结(股)', '股价(元)']
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
          series: [
            {
              name: '持股数量(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              barWidth: 10,
              barGap: "63%",
              data: data.question
            },
            {
              name: '限售股(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              barWidth: 10,
              barGap: "63%",
              data: data.answer
            },
            {
              name: '质押/冻结(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[2]}},
              barWidth: 10,
              barGap: "63%",
              data: data.answerRate
            },
            {
              name: '股价(元)',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: color[3]}},
              symbol: "circle",
              symbolSize: 7,
              data: data.price
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },

      // echartOverviewOne(id, data) {
      //   if (!!!document.getElementById(id)) {
      //     return false
      //   }
      //   var myChart = echarts.init(document.getElementById(id));
      //   var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'];
      //   var option = {
      //     tooltip: {
      //       // 提示框
      //       trigger: 'axis',
      //       position: function (pt) {
      //         return [pt[0], '10%'];
      //       },
      //       backgroundColor: '#fff',
      //       borderWidth: 1,
      //       borderColor: '#e3e3e3',
      //       confine: true,
      //       axisPointer: { // 坐标轴指示器配置项
      //         label: {
      //           show: false
      //         },
      //         type: 'cross', // 指示器类型，十字准星
      //         crossStyle: {
      //           type: 'solid',
      //           color: '#e3e3e3'
      //         },
      //         lineStyle: {
      //           color: '#e3e3e3'
      //         }
      //       },
      //       textStyle: {
      //         color: "#aeaeae",
      //         fontSize: 12
      //       },
      //       formatter: function (data) {
      //         var html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
      //                       <span>${data[0].name}</span>
      //                     </div>`;
      //         data.forEach((item) => {
      //           if (item.seriesName.indexOf('率') > -1) {
      //             html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}%</span></div>`
      //           } else {
      //             html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}</span></div>`
      //           }
      //         });
      //         return html
      //       }
      //     },
      //     grid: {
      //       top: "15%",
      //       left: "0%",
      //       right: "0%",
      //       bottom: "0%",
      //       containLabel: true
      //     },
      //     legend: {
      //       selectedMode: true,
      //       align: 'left',
      //       top: 0,
      //       left: 0,
      //       textStyle: {
      //         fontSize: 10,
      //         color: 'rgba(174,174,174,1)'
      //       },
      //       data: ['一致行动人组1(股)', '一致行动人组2(股)', '一致行动人组3(股)', '股价(元)']
      //     },
      //     xAxis: [{
      //       type: "category",
      //       axisLabel: {
      //         rotate: 30,
      //         margin: 10,
      //         textStyle: {
      //           color: "#8d8d8d",
      //           fontSize: 10
      //         }
      //       },
      //       axisTick: {
      //         length: 0
      //       },
      //       axisLine: {
      //         lineStyle: {
      //           color: "#ccc"
      //         }
      //       },
      //       data: data.dateTime
      //     }],
      //     yAxis: [
      //       {
      //         type: "value",
      //         name: "",
      //         axisLabel: {
      //           textStyle: {
      //             color: "#8d8d8d",
      //             fontSize: 10
      //           }
      //         },
      //         splitLine: {
      //           show: false
      //         },
      //         axisTick: {
      //           length: 0
      //         },
      //         // min: 0,
      //         // max: 900000000,
      //         axisLine: {
      //           symbolSize: [0, 0],
      //           lineStyle: {
      //             color: "#ccc"
      //           }
      //         }
      //       },
      //       {
      //         type: "value",
      //         name: "",
      //         axisLabel: {
      //           textStyle: {
      //             color: "#8d8d8d",
      //             fontSize: 10
      //           },
      //           formatter: '{value}'
      //         },
      //         // min: 0,
      //         // max: 30,
      //         position: 'right',
      //         axisTick: {
      //           length: 0
      //         },
      //         axisLine: {
      //           symbolSize: [0, 0],
      //           lineStyle: {
      //             color: "#ccc"
      //           }
      //         }
      //       }
      //     ],
      //     series: [
      //       {
      //         name: '一致行动人组1(股)',
      //         type: 'bar',
      //         stack: '总量',
      //         itemStyle: {normal: {color: color[0]}},
      //         barWidth: 19,
      //         data: data.actionGroupOne
      //       },
      //       {
      //         name: '一致行动人组2(股)',
      //         type: 'bar',
      //         stack: '总量',
      //         itemStyle: {normal: {color: color[1]}},
      //         barWidth: 19,
      //         // barGap: "63%",
      //         data: data.actionGroupTwo
      //       },
      //       {
      //         name: '一致行动人组3(股)',
      //         type: 'bar',
      //         stack: '总量',
      //         itemStyle: {normal: {color: color[2]}},
      //         barWidth: 19,
      //         // barGap: "63%",
      //         data: data.actionGroupThree
      //       },
      //       {
      //         name: '股价(元)',
      //         type: 'line',
      //         yAxisIndex: 1,
      //         itemStyle: {normal: {color: color[3]}},
      //         symbol: "circle",
      //         symbolSize: 7,
      //         data: data.price
      //       }
      //     ]
      //   };
      //   // 使用刚指定的配置项和数据显示图表
      //   myChart.setOption(option, true);
      // },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => {
            var num = /\D+/g;
            if (item[column.property] == undefined) {
              return false
            } else {
              return Number(item[column.property].replace(num, ''));
            }
          });
          if (index > 1 && index < 7) {
            sums[index] = values.reduce((prev, curr) => {
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
      getSum(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property].replace(/,/g, "")));
          if (index == 2 || index == 4 || index == 5) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        });
        sums[2] = this.compute(sums[2]);
        return sums;
      },
      // 数字每3位加一个逗号
      compute(number) {
        var num = (number || 0).toString();
        var result = '';
        while (num.length > 3) {
          result = ',' + num.slice(-3) + result;
          num = num.slice(0, num.length - 3);
        }
        if (num) {
          result = num + result;
        }
        return result;
      }
    }
  };
</script>

<style lang="scss">
  #institutionAccountInfo {
    min-height: 600px;
    .dialog-class {
      .has-gutter td .cell {
        background: rgba(248, 248, 248, 1);
      }
      .el-dialog__header {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 14px;
        .el-dialog__title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 177, 72, 1);
        }
        .el-dialog__headerbtn {
          top: 18px;
        }
      }
      .liftAban-table {
        border-top: 1px solid #E3E3E3;
        height: 289px;
        .el-table {
          font-size: 12px;
          font-weight: 400;
          color: #323232;
          padding: 12px 16px 14px 16px;
          tr {
            th {
              background-color: #F0F0F0;
            }
          }
        }
      }
      .el-dialog__body {
        padding: 0;
      }
    }
    .el-data {
      th {
        border: none;
        background-color: #F0F0F0;
      }
      td {
        border: none;
      }
    }
    .el-table::before {
      height: 0;
    }
    .el-table__footer-wrapper {
      background-color: #F8F8F8;
    }
  }
</style>

