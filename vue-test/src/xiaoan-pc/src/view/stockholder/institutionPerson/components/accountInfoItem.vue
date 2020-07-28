<template>
  <el-card v-if="shareChangesData.length > 0" class="box-info-card box-two" shadow="never" body-style="padding:0 16px">
    <div class="info-header vux-1px-b">
      <p class="shareholder">持股变动情况</p>
    </div>
    <el-table key="companySummary" class="el-data" max-height="385" :data="shareChangesData" stripe style="width:100%;margin-top:16px"
              v-loading="companySummaryLading">
      <el-table-column prop="recordDate" sortable label="期数" align="center" width="110"></el-table-column>
      <el-table-column prop="possessorAmount" sortable label="持股数量(股)" align="right" header-align="right"
                       width="130">
        <template slot-scope="scope">
          <div style="padding-right: 10px">{{amountAbs(scope.row.possessorAmount)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="orderNumber" sortable label="持股数量排名" align="right" header-align="right"
                       width="140">
        <template slot-scope="scope">
          <div style="padding-right: 10px">{{scope.row.orderNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="shareRestrictAmount" sortable label="限售股(股)" align="right" header-align="right"
                       width="130">
        <template slot-scope="scope">
          <div style="padding-right: 10px" v-if="scope.row.shareRestrictAmount">{{amountAbs(scope.row.shareRestrictAmount)}}</div>
          <div style="padding-right: 10px" v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column prop="shareCirculateAmount" sortable label="流通股(股)" align="right" header-align="right"
                       width="130">
        <template slot-scope="scope">
          <div style="padding-right: 10px">{{amountAbs(scope.row.shareCirculateAmount)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="normalSecurityPossessorAmount" sortable label="普通证券账户持股(股)" align="right"
                       header-align="right">
        <template slot-scope="scope">
          <div style="padding-right: 10px">{{amountAbs(scope.row.normalSecurityPossessorAmount)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="investorCreditPossessorAmount" sortable label="信用证券账户持股(股)" align="right"
                       header-align="right">
        <template slot-scope="scope">
          <div style="padding-right: 10px">{{amountAbs(scope.row.investorCreditPossessorAmount)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pledgeFreezeAmount" sortable label="质押/冻结(股)" align="right"
                       header-align="right" width="130">
        <template slot-scope="scope">
          <div style="padding-right: 10px">{{amountAbs(scope.row.pledgeFreezeAmount)}}</div>
        </template>
      </el-table-column>
    </el-table>
    <p class="limited">限售股：“--”表示该股东不持有限售股或因股东名册数据缺失无法匹配</p>
    <p class="picture">持股变动图</p>
    <div class="" style="position: relative">
      <div class="echart-overview" id="echart-overview" v-loading="companySummaryLading"></div>
      <vxa-not-info v-if="shareChangesData.length == 0"><span style="font-size: 14px">暂无数据</span></vxa-not-info>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "accountInfoItem",
    components: {},
    data() {
      return {
        shareChangesData: [],
        companySummaryLading: true,
        companySummaryData: {
          dateTime: [],
          possessorAmount: [],
          shareRestrictAmount: [],
          pledgeFreezeAmount: [],
          priceAmount: []
        }
      }
    },
    created() {
      this.getShareChanges()
    },
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
      echartOverview(id, data) {
        if (!!!document.getElementById(id)) {
          return false
        }
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'];
        let that = this;
        const option = {
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
                show: true
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
                if (item.seriesName.indexOf('元') > -1) {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${that.$array.abs(item.value, true)}</span></div>`
                } else {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${that.amountAbs(item.value)}</span></div>`
                }
              });
              return html
            }
          },
          grid: {
            top: "15%",
            left: "0%",
            right: "2%",
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
              // max: 100,
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
              data: data.possessorAmount.reverse()
            },
            {
              name: '限售股(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              barWidth: 10,
              barGap: "63%",
              data: data.shareRestrictAmount.reverse()
            },
            {
              name: '质押/冻结(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[2]}},
              barWidth: 10,
              barGap: "63%",
              data: data.pledgeFreezeAmount.reverse()
            },
            {
              name: '股价(元)',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: color[3]}},
              symbol: "circle",
              symbolSize: 7,
              data: data.priceAmount.reverse()
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      //
      getShareChanges() {
        this.companySummaryLading = true;
        let params = {
          id: this.$route.query.id,
          userId: this.$cookie.get('userId'),
          pageNum: 1,
          pageSize: 12
        };
        this.$axios.gxfApi.getShareChanges(params).then(res => {
          this.companySummaryLading = false;
          if (res.data.returnCode == 200 && res.data.returnObject) {
            // console.log(res.data.returnObject);
            this.shareChangesData = res.data.returnObject;
            //
            this.companySummaryData.dateTime = this.shareChangesData.map((e) => {
              return e.recordDate
            });
            this.companySummaryData.dateTime.reverse()
            //
            this.companySummaryData.possessorAmount = this.shareChangesData.map((e) => {
              return e.possessorAmount
            });
            this.companySummaryData.possessorAmount.reverse()
            //
            this.companySummaryData.shareRestrictAmount = this.shareChangesData.map((e) => {
              return e.shareRestrictAmount
            });
            this.companySummaryData.shareRestrictAmount.reverse()
            //
            this.companySummaryData.pledgeFreezeAmount = this.shareChangesData.map((e) => {
              return e.pledgeFreezeAmount
            });
            this.companySummaryData.pledgeFreezeAmount.reverse()
            //
            this.companySummaryData.priceAmount = this.shareChangesData.map((e) => {
              return e.priceAmount
            });
            this.companySummaryData.pledgeFreezeAmount.reverse()
            //
            this.$nextTick(() => {
              this.echartOverview('echart-overview', this.companySummaryData);
            })
          }
        }).catch(err => {
          this.shareChangesData = [];
          this.companySummaryLading = false;
        })
      }
    }
  }
</script>

<style scoped>

</style>
