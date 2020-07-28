<template>
  <el-card class=" vxa-card-box censusItem" shadow="hover" body-style="padding:0 10px 10px">
    <div class="vxa-card_head vux-1px-b">户数数据统计<span class="time">（{{timeDateFun}}期）</span></div>
    <div class="vux-card_content">
      <div id="cardBox__Id"></div>
      <vxa-not-info v-if="notData"></vxa-not-info>
    </div>
    <p class="vxa-card__about">*该总户数数据未经信用担保账户拆分合并</p>
  </el-card>
</template>

<script>
  export default {
    name: "namedItem",
    components: {},
    data() {
      return {
        notData: false
      }
    },
    props: {
      timeDate: {
        type: [String, Number],
        default: '0000-00-00'
      },
      type: {
        type: [String, Number],
        default: 0
      }
    },
    created() {

    },
    watch: {
      'timeDate': function () {
        this.getShareStatistics();
      }
    },
    mounted() {
      this.getShareStatistics();
    },
    computed: {
      timeDateFun: function () {
        return this.$common.transTime(this.timeDate)[1]
      }
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
      getShareStatistics() {
        let params = {
          userId: this.$cookie.get('userId'),
          recordDate: this.timeDate
        };
        this.$axios.gxfApi.getShareholderStatistics(params).then(res => {
          if (res.data.returnCode == 200) {
            this.notData = false;
            let dataObject = res.data.returnObject;
            if (dataObject.registerInstitutionAmount == null) {
              dataObject.registerInstitutionAmount = 0
            }
            if (dataObject.circulateRegisterInstitutionAmount == null) {
              dataObject.circulateRegisterInstitutionAmount = 0
            }
            if (dataObject.circulateRegisterPersonAmount == null) {
              dataObject.circulateRegisterPersonAmount = 0
            }
            if (dataObject.registerPersonAmount == null) {
              dataObject.registerPersonAmount = 0
            }
            if (dataObject.circulateRegisterAllAmount == null) {
              dataObject.circulateRegisterAllAmount = 0
            }
            if (dataObject.registerAllAmount == null) {
              dataObject.registerAllAmount = 0
            }
            let data = {};
            if (dataObject.circulateRegisterInstitutionAmount == 0 && dataObject.circulateRegisterInstitutionAmount == 0) {
              data = {
                name: ['户数'],
                ge: [dataObject.registerPersonAmount],
                ji: [dataObject.registerInstitutionAmount],
                all: `(总户数:${this.$array.abs(dataObject.registerAllAmount, false)}  流通总户数:${this.$array.abs(dataObject.circulateRegisterAllAmount, false)})`
              };
            } else {
              data = {
                name: ['户数', '流通户数'],
                ge: [dataObject.registerPersonAmount, dataObject.circulateRegisterPersonAmount],
                ji: [dataObject.registerInstitutionAmount, dataObject.circulateRegisterInstitutionAmount],
                all: `(总户数:${this.$array.abs(dataObject.registerAllAmount, false)}  流通总户数:${this.$array.abs(dataObject.circulateRegisterAllAmount, false)})`
              };
            }
            if (dataObject.circulateRegisterAllAmount == 0) {
              data.all = `(总户数:${this.$array.abs(dataObject.registerAllAmount, false)})`
            }
            console.log(data);
            this.echartBars('cardBox__Id', data);
            // // console.log(res.data);
          } else {
            this.notData = true;
          }
        }).catch(err => {
          this.notData = true;
        })
      },
      //
      echartBars(id, data) {
        var myChart = echarts.init(document.getElementById(id));
        // myChart.title = '堆叠条形图';
        let that = this;
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
                show: false,
                precision: 0
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
              var html = ``;
              let total = 0;
              data.forEach((item) => {
                total += item.value
                if (item.seriesName.indexOf('率') > -1) {
                  html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: #AEAEAE">${item.value}%</span></div>`
                } else {
                  html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: #AEAEAE">${that.amountAbs(item.value)}</span></div>`
                }
              })
              // html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>总户数(户)：</span><span style="color: #AEAEAE">${total}</span></div>`
              return html
            }
          },
          legend: {
            x: 'left',
            top: 25
          },
          title: {
            text: data.all,
            left: 'left',
            top: 5,
            textStyle: {
              align: 'center',
              color: 'rgba(84,84,84,1)',
              fontSize: 12,
              lineHeight: 60
            }
          },
          grid: {
            top: 60,
            left: 0,
            right: 2,
            bottom: 1,
            containLabel: true
          },
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
              max: function (value) {
                return value.max * 1.5;
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
                formatter: ''
              },
              min: 0,
              max: 100,
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
          color: ["#602221", "#FFB148"],
          xAxis: {
            type: "category",
            axisLabel: {
              // rotate: 30,
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
            data: data.name
          },
          series: [
            {
              name: '个人(户)',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              barMinHeight: 10,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 0,
                  borderWidth: 0
                }
              },
              data: data.ge
            },
            {
              name: '机构(户)',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              barMinHeight: 10,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 0,
                  borderWidth: 0
                }
              },
              data: data.ji
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
  .censusItem {
    #cardBox__Id {
      height: 220px;
    }
    .vxa-card__about {
      padding-top: 10px;
      text-align: justify;
    }
  }
</style>
