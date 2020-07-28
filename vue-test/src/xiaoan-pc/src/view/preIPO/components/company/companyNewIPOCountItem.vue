<template>
  <el-card shadow="never" class="box-card" body-style="padding:0 16px" id="company-new-ipo-count-item"
           v-loading="auditStatusFromAuditingLoading">
    <div class="head-flex vux-1px-b">
      <div class="row title">最新IPO在审公司统计</div>
      <div class="row r-pagination text">
        <router-link to="/ipo/retrial/overview" target="_blank">
          查看更多<i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
    </div>
    <div class="e-chart-box">
      <div id="echart-bar"></div>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "company-new-ipo-count-item",
    components: {},
    data() {
      return {
        auditStatusFromAuditingLoading: true,
        auditStatusFromAuditingData: []
      }
    },
    created() {
      this.getAuditStatusFromAuditing(new Date().getTime())
    },
    mounted() {
      this.$nextTick(() => {
        var dataArr = [
          {value: '231', name: '地素时尚'},
          {value: '213', name: '地素时尚'},
          {value: '213', name: '地素时尚'},
          {value: '218', name: '地素时尚'},
          {value: '123', name: '地素时尚'},
          {value: '23', name: '地素时尚'}
        ];

      })
    },
    methods: {
      // / publishDocketSearch/getAuditStatusFromAuditing
      getAuditStatusFromAuditing(time) {
        this.auditStatusFromAuditingLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.publish.getAuditStatusFromAuditing,
          params: {
            releaseTime: time
          }
        }).then((res) => {
          this.auditStatusFromAuditingLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            console.log(res.data.returnObject);
            let data = res.data.returnObject.list[0].statusList;
            //
            this.auditStatusFromAuditingData = data.map((item) => {
              return {name: item.statusName, value: item.count}
            });
            console.log('=============>', this.auditStatusFromAuditingData);
            this.$nextTick(() => {
              this.echartComparison('echart-bar', this.auditStatusFromAuditingData);
            })
          }
        }).catch(() => {
          setTimeout(() => {
            this.auditStatusFromAuditingLoading = false;
          }, 3000)
        })
      },
      echartComparison(id, data, text) {
        var xData = data.map(e => {
          return e.name;
        })
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#FFB148', '#ffac25', '#90B8F5'];
        var option = {
          tooltip: {
            show: true,
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
              // console.log(data);
              var html = ``;
              data.forEach((item) => {
                if (item.seriesName.indexOf('率') > -1) {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.name}：</span><span>${item.value}%</span></div>`
                } else {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.name}：</span><span>${item.value}</span></div>`
                }
              });
              return html
            }
          },
          grid: {
            top: "10%",
            left: "0%",
            right: 2,
            bottom: "0%",
            containLabel: true
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
                color: "#e3e3e3"
              }
            },
            data: xData
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
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#e3e3e3"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#e3e3e3"
                }
              }
            }, {
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
                  color: "#e3e3e3"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#e3e3e3"
                }
              }
            }
          ],
          series: [
            {
              name: text,
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              barWidth: 14,
              barGap: 0,
              barMinHeight: 5,
              data: data
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss" scoped>
  #company-new-ipo-count-item {
    .head-flex {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .row {
        flex: 1;
        &.title {
          font-size: 14px;
          color: #323232;
          font-weight: bold;
        }
        &.r-pagination {
          flex: inherit;
          text-align: right;
          &.text {
            font-size: 12px;
            color: #8d8d8d;
            cursor: pointer;
            i {
              font-size: 12px;
            }
          }
        }
      }
    }
    .e-chart-box {
      padding: 0 0;
      width: 100%;
      #echart-bar {
        height: 230px;
        width: 100%;
      }
    }
  }
</style>
