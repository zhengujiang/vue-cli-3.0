<template>
  <!--dashboard调用-->
  <div v-loading="vLoading">
    <div>
      <ul class="chartContent">
        <li class="echartPicData" v-for="(item,index) in echartPicData" :key="index"
            :class="{echartPicBottomShow:item.bottomShow}" @click="echartPicDataTityle(index)">
          {{item.title}}
        </li>
      </ul>
      <ul class="titleContent">
        <li class="subtitleData" v-for="(item,index) in subtitleData" :key="index"
            :class="{subtitleColor:item.subtitleShow}" @click=" subtitleColorData(index)">
          {{item.title}}
        </li>
      </ul>
    </div>
    <div id="marketData" class="marketData"></div>
    <!--<div id="marketData" class="marketData" :class="{'marketData-big':isBigChart}">行情数据</div>-->
  </div>
</template>
<script>
  export default {
    name: "market-item",
    data() {
      return {
        vLoading: true,
        companyCode: "SZ000001",
        period: 'DAY',
        periodNum: "1",
        subtitleIndex: 0,
        xyaxiData: [],
        xyaxiDataLow: "",
        startDate: '',
        endDate: '',
        isHistory: false,
        optionDate: [],
        // echartsTopListData: [{
        //   'title': '开盘价',
        //   'con': '22'
        // }, {
        //   'title': '开盘价',
        //   'con': '22'
        // }, {
        //   'title': '开盘价',
        //   'con': '22'
        // }, {
        //   'title': '开盘价',
        //   'con': '22'
        // }, {
        //   'title': '开盘价',
        //   'con': '22'
        // }, {
        //   'title': '开盘价',
        //   'con': '22'
        // }],
        // echarts图标
        echartPicData: [{
          "title": "1日",
          "bottomShow": "true"
        }, {
          "title": "1个月",
          "bottomShow": ""
        }, {
          "title": "3个月",
          "bottomShow": ""
        }, {
          "title": "6个月",
          "bottomShow": ""
        }, {
          "title": "本年至今",
          "bottomShow": ""
        }, {
          "title": "1年",
          "bottomShow": ""
        }, {
          "title": "2年",
          "bottomShow": ""
        }, {
          "title": "5年",
          "bottomShow": ""
        }, {
          "title": "10年",
          "bottomShow": ""
        }],
        subtitleData: [{'title': '1分钟', 'subtitleShow': 'true'}],
        interval: null
      }
    },
    props: {
      componyCodeR: {type: String, default: ''},
      isBigChart: {type: Boolean, default: true}
    },
    created() {
      this.startDate = this.$common.getLastOfMonth(0)
      this.endDate = this.$common.getLastOfMonth(0)
      this.optionDate = this.$common.getTimeMinuteDate(1)
      this.getStockTimeKLineData()
      this.realTime()
    },
    destroyed() {
      window.clearInterval(this.interval)
    },
    mounted() {

    },
    watch: {
      componyCodeR(val) {
        console.log('componyCodeR=============>', val);
        this.startDate = this.$common.getLastOfMonth(0)
        this.endDate = this.$common.getLastOfMonth(0)
        this.optionDate = this.$common.getTimeMinuteDate(1)
        this.getStockTimeKLineData()
        this.realTime()
      }
    },
    methods: {
      // 实时刷新
      realTime() {
        // var _this = this
        this.interval = setInterval(() => {
          // console.log('this.checkMarkTime():' + this.checkMarkTime())
          if (this.$common.checkMarkTime()) {
            this.periodNum = 1
            this.isHistory = false
            this.getStockTimeKLineData()
          }
        }, 60000)
      },
      // 获取K线图
      getStockKLineData() {
        this.vLoading = true
        this.$http({
          method: 'GET',
          url: this.$api.stock.getStockKLineData,

          params: {
            fullCode: this.componyCodeR,
            startDate: this.startDate,
            endDate: this.endDate,
            period: this.period
          }
        }).then((res) => {
          this.vLoading = false
          if (res.data.returnCode == 1 || res.data.returnObject) {
            this.xyaxiData = res.data.returnObject.Data
            this.echartData(1)
          } else {
            this.xyaxiData = []
            this.echartData(1)
          }
        }).catch((err) => {
          this.vLoading = false
        })
      },
      // 获取K线图分钟
      getStockTimeKLineData() {
        this.vLoading = false
        // console.log(this.componyCodeR)
        this.$http({
          method: 'GET',
          url: this.$api.stock.getStockTimeKLineData,
          params: {
            fullCode: this.componyCodeR,
            startDate: this.startDate,
            endDate: this.endDate,
            period: this.periodNum,
            isHistory: this.isHistory
          }
        }).then((res) => {
          this.vLoading = false
          if (res.data.returnCode == 1 || res.data.returnObject) {
            this.xyaxiData = res.data.returnObject.Data
            let dateTime0 = new Date(this.xyaxiData[0].dateTime)
            this.optionDate = this.$common.getTimeMinuteDate(dateTime0.getHours() + ':' + dateTime0.getMinutes())
            this.echartData(0)
          } else {
            this.xyaxiData = []
            this.echartData(0)
          }
        }).catch((err) => {
          this.vLoading = false
        })
      },
      echartPicDataTityle(index) {
        for (let i = 0; i < this.echartPicData.length; i++) {
          this.echartPicData[i].bottomShow = false
        }
        this.echartPicData[index].bottomShow = true
        if (index == 0) {
          // this.optionDate = this.$common.getTimeMinuteDate(1)
          this.subtitleIndex = index
          this.periodNum = 1
          this.isHistory = false
          this.startDate = this.$common.getLastOfMonth(0)
          this.endDate = this.$common.getLastOfMonth(0)
          this.subtitleData = [{'title': '1分钟', 'subtitleShow': 'true'}]
          this.realTime()
          this.getStockTimeKLineData()
        } else if (index) {
          window.clearInterval(this.interval)
          this.subtitleIndex = index
          this.startDate = this.$common.getLastOfMonth(index)
          this.endDate = this.$common.getLastOfMonth(0)
          if (index == 1) {
            this.period = 'DAY'
            this.subtitleData = [{'title': '日线图', 'subtitleShow': true}]
          } else if (index == 2 || index == 3) {
            this.period = 'DAY'
            this.subtitleData = [
              {'title': '日线图', 'subtitleShow': true},
              {'title': '周线图', 'subtitleShow': ''}
            ]
          } else if (index == 4 || index == 5 || index == 6) {
            this.period = 'DAY'
            this.subtitleData = [
              {'title': '日线图', 'subtitleShow': true},
              {'title': '周线图', 'subtitleShow': ''},
              {'title': '月线图', 'subtitleShow': ''}
            ]
          } else {
            this.period = 'WEEK'
            this.subtitleData = [
              {'title': '周线图', 'subtitleShow': true},
              {'title': '月线图', 'subtitleShow': ''}
            ]
          }
          this.getStockKLineData()
        }
      },
      subtitleColorData(index) {
        for (let i = 0; i < this.subtitleData.length; i++) {
          this.subtitleData[i].subtitleShow = false
        }
        this.subtitleData[index].subtitleShow = true
        if (this.subtitleIndex == 0) {
          this.startDate = this.$common.getLastOfMonth(0)
          this.endDate = this.$common.getLastOfMonth(0)
          if (index == 0) {
            this.periodNum = 1
            this.isHistory = false
            // this.optionDate = this.$common.getTimeMinuteDate(1)
          }
          // else if (index == 1) {
          //   console.log("111")
          //   this.isHistory = true
          //   this.periodNum = 5
          //   this.optionDate = this.$common.getTimeMinuteDate(5)
          // } else if (index == 2) {
          //   this.isHistory = true
          //   this.periodNum = 15
          //   this.optionDate = this.$common.getTimeMinuteDate(15)
          // } else if (index == 3) {
          //   this.isHistory = true
          //   this.periodNum = 60
          //   this.optionDate = this.$common.getTimeMinuteDate(60)
          // }
          this.getStockTimeKLineData()
        } else if (this.subtitleIndex == 1) {
          this.startDate = this.$common.getLastOfMonth(this.subtitleIndex)
          this.endDate = this.$common.getLastOfMonth(0)
          this.getStockKLineData()
        } else if (this.subtitleIndex == 2 || this.subtitleIndex == 3) {
          this.startDate = this.$common.getLastOfMonth(this.subtitleIndex)
          this.endDate = this.$common.getLastOfMonth(0)
          if (index == 0) {
            this.period = 'DAY'
          } else if (index == 1) {
            this.period = ' WEEK'
          }
          this.getStockKLineData()
        } else if (this.subtitleIndex == 4 || this.subtitleIndex == 5 || this.subtitleIndex == 6) {
          this.startDate = this.$common.getLastOfMonth(this.subtitleIndex)
          this.endDate = this.$common.getLastOfMonth(0)
          if (index == 0) {
            this.period = 'DAY'
          } else if (index == 1) {
            this.period = 'WEEK'
          } else if (index == 2) {
            this.period = 'MONTH'
          }
          this.getStockKLineData()
        } else if (this.subtitleIndex == 7 || this.subtitleIndex == 8) {
          this.startDate = this.$common.getLastOfMonth(this.subtitleIndex)
          this.endDate = this.$common.getLastOfMonth(0)
          if (index == 0) {
            this.period = 'WEEK'
          } else if (index == 1) {
            this.period = 'MONTH'
          }
          this.getStockKLineData()
        }
      },
      // type 0(分钟实时，1K线）
      echartData(type) {
        var myChart = echarts.init(document.getElementById('marketData'));
        var date = []
        var data = []
        var volume = []
        if (type == 0) {
          date = this.optionDate
        }
        for (let i = 0; i < this.xyaxiData.length; i++) {
          if (type == 1) {
            date.push(this.xyaxiData[i].date)
          }
          if (this.xyaxiData[i].close == undefined) {
            data.push({
              value: 0,
              change: 0,
              pctChange: 0,
              volume: 0,
              aveRage: 0
            })
          } else {
            data.push({
              value: this.xyaxiData[i].close,
              close: this.xyaxiData[i].close,
              change: this.xyaxiData[i].change,
              pctChange: this.xyaxiData[i].pctChange,
              volume: this.xyaxiData[i].volume,
              aveRage: this.xyaxiData[i].aveRage
            })
          }
          if (this.xyaxiData[i].volume == undefined) {
            volume.push({value: 0, change: 0})
          } else {
            volume.push({value: this.xyaxiData[i].volume, change: this.xyaxiData[i].change})
          }
        }
        let _this = this
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
            formatter: function (data) {
              let time = data[0].axisValue
              let dataNow = data[0]
              let change = ''
              let changeValue = dataNow.data.change ? dataNow.data.change : '--'
              if (dataNow.data.change > 0) {
                change = '<div style="display:flex;justify-content:space-between"><span>涨跌额：</span><span style="color:#fa4319;">' + changeValue + '</span></div>'
              } else if (dataNow.data.change == 0) {
                change = '<div style="display:flex;justify-content:space-between"><span>涨跌额：</span><span>' + changeValue + '</span></div>'
              } else {
                change = '<div style="display:flex;justify-content:space-between">涨跌额：<span style="color:#29da89;">' + changeValue + '</span></div>'
              }
              let pctChange = ''
              let pctChangeValue = dataNow.data.pctChange ? dataNow.data.pctChange + '%' : '--'
              if (dataNow.data.pctChange > 0) {
                pctChange = '<div style="display:flex;justify-content:space-between">涨跌幅：<span style="color:#fa4319;">' + pctChangeValue + '</span></div>'
              } else if (dataNow.data.change == 0) {
                pctChange = '<div style="display:flex;justify-content:space-between">涨跌幅：<span>' + pctChangeValue + '</span></div>'
              } else {
                pctChange = '<div style="display:flex;justify-content:space-between">涨跌幅：<span style="color:#29da89;">' + pctChangeValue + '</span></div>'
              }
              let aveRage = ''
              if (dataNow.data.aveRage) {
                aveRage = '<div style="display:flex;justify-content:space-between">均　价：<span>' + dataNow.data.aveRage + '</span></div>'
              }
              // 成交量
              let volume = 0;
              if (dataNow.data.volume) {
                let vol = parseInt(dataNow.data.volume) / 100
                volume = _this.$common.wanUnit(vol.toString()) + '手'
              } else {
                volume = '--'
              }
              // 当前价
              let close = 0;
              if (dataNow.data.close) {
                close = dataNow.data.close
              } else {
                close = '--'
              }

              return `<div style="border-bottom:1px solid #e3e3e3; text-align: center;">${time}</div>
                      <div style="display:flex;justify-content:space-between"><span>当前价：</span><span>${close}</span></div>
                      ${change}
                      ${pctChange}
                      <div style="display:flex;justify-content:space-between"><span>成交量：</span><span>${volume}</span></div>
                      ${aveRage}
                     `
            },
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid'
              }
            },
            textStyle: {
              color: "#aeaeae"
            }
          },
          legend: {
            top: 'bottom',
            data: []
          },
          toolbox: {},
          grid: {
            left: '2%',
            right: '1%',
            bottom: '0',
            top: '6%',
            containLabel: true
          },
          xAxis: {
            show: true,
            type: 'category',
            boundaryGap: false,
            data: date,
            interval: 10,
            axisLabel: { // 坐标轴刻度标签的相关设置
              showMaxLabel: true,
              rotate: 50,
              fontSize: 10,
              interval: 'auto',
              //              align: 'left',
              formatter: function (value, index) { // 使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
                // console.log('index', index, date.length)

                //                  if (index % parseInt(date.length / 10) == 0) {
                //                    console.log('index', index, date.length)
                //                   return value
                //                  }
                //                if (index == 0 || index == date.length - 1) {
                //                  console.log('index', index, date.length)
                //                  return value
                //                }
                return value
              }
            },
            nameTextStyle: {
              color: '#aeaeae'
            },
            axisLine: {
              lineStyle: {
                color: '#aeaeae'
              }
            }
          },
          // y轴
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (value, index) {
                return value.toFixed(2)
              }
            },
            boundaryGap: [0, '100%'],
            //            min: 'dataMin',
            //            max: 'dataMax',
            min: function(value) {
              return (value.min * 0.99).toFixed(2)
            },
            max: function(value) {
              return (value.max * 1.01).toFixed(2)
            },
            axisLine: {
              lineStyle: {
                color: '#aeaeae'
              }
            },
            // 分隔线
            splitLine: {
              lineStyle: {
                color: '#e3e3e3'
              },
              interval: 8
            }
          },
          dataZoom: [{
            type: 'inside'
          }],
          series: [{
            // name: "数据",
            type: 'line',
            // smooth: true,
            // symbol: 'none',
            // hoverAnimation: true,
            sampling: 'average',
            // 线条颜色
            itemStyle: {
              normal: {
                color: '#ffb148',
                borderWidth: 0.1
                // borderColor: 'red'  // 拐点边框颜色
              }
            },
            // 填充颜色
            areaStyle: {
              normal: {
                // color: 'rgba(255, 239, 217, 0.75)'
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#ffefd9'
                }, {
                  offset: 0.8,
                  color: '#fffefe'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.01)',
                shadowBlur: 10
              }
            },
            symbol: 'circle',
            smooth: false, // 是否平滑曲线显示。
            showSymbol: false,
            data: data
          }]
        };

        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }
    }

  }
</script>
<style scoped lang="scss">
  .echartsContentTopTitle {
    width: 100%;
    > ul {
      display: flex;
      li {
        flex: 1;
      }
    }
  }
  .chartContent {
    width: 100%;
    height: 35px;
    line-height: 35px;
    background-color: #f0f1f5;
    border-radius: 5px;
    .echartPicData {
      float: left;
      height: 35px;
      margin: 0 7px;
      cursor: pointer;
      color: #8d8d8d;
      font-size: 14px;
      &:hover {
        border-bottom: 2px solid #ffb148;
      }
    }
    .echartPicBottomShow {
      border-bottom: 2px solid #ffb148;
      color: #ffb148;
    }
  }
  .titleContent {
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-top: 6px;
    .subtitleData {
      float: left;
      height: 28px;
      line-height: 28px;
      background-color: #f0f1f5;
      border-radius: 3px;
      padding: 0 10px;
      color: #8d8d8d;
      font-size: 14px;
      margin-right: 5px;
      cursor: pointer;
    }
    .subtitleColor {
      color: #ffb148;
      font-size: 14px;
    }
  }
  .marketData {
    height: 300px;
    width: 100%;
  }
  .marketData-big {
    height: 400px;
    width: 100%;
  }
</style>
