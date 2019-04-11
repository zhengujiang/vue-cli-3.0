<template>
  <div id="yearHanqin">
    <div class="year-user-info">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <div class="user">
        <p class="user-nick">{{userInfo.userName}}</p>
        <p class="user-code">{{companyName + ' ' + companyCode}}</p>
      </div>
    </div>
    <div class="year-content">
      <img class="bgimg" :src="$image.year2018.hanqinbg"/>
      <div class="year-info">
        <div class="year-data">
          <div class="chart-box animated y-zoomIn">
            <div id="chart-year1"></div>
            <div id="chart-year2"></div>
          </div>
          <div class="chart-title">
            <div class="title">
              <p class="p1">总股本(股)</p>
              <p class="p2" v-if="data.dataMap.status===0">{{stockValueDesc}}</p>
            </div>
            <div class="title">
              <p class="p1">总市值(元)</p>
              <p class="p2" v-if="data.dataMap.status===0">{{marketValueDesc}}</p>
            </div>
          </div>
        </div>
        <div class="hanqin-up" v-if="data.dataMap.status===0">
          <div class="yinli-img animated y-inLeft">
            <img :src="$image.year2018.hanqin_yinli"/>
          </div>
          <div class="year-amonut animated y-zoomIn">
            <p class="p1">
              <span class="y-scale">{{accumulateDealValue}}</span>{{unit}}元
            </p>
            <p class="p2">2018年累计成交金额</p>
            <div class="hanqin-progress">
              <div class="present" :style="'width:'+data.dataMap.accumulateDealValueRatio+'%'"></div>
            </div>
            <p class="p3">超过{{data.dataMap.accumulateDealValueRatio}}%的上市公司</p>
          </div>
        </div>
        <div class="hanqin-low vux-1px-t animated y-zoomIn" v-else>
          <p class="p1">累计成交金额：
            <span class="red-big y-scale">{{accumulateDealValue}}</span>
            <span class="red-small">{{unit}}元</span>
          </p>
          <p class="p2">超过{{data.dataMap.accumulateDealValueRatio|toNum}}%的上市公司</p>
          <!--<p class="p2 p3">数据截止至2018年12月31日</p>-->
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        accumulateDealValue: '',
        unit: '',
        stockValueDesc: '',
        marketValueDesc: ''
      }
    },
    props: ['userInfo', 'companyCode', 'companyName', 'data'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    filters: {
      toNum: function (value) {
        return value ? value : 0
      }
    },
    // 生命周期函数
    created() {
      // this.data.dataMap.status = 0
      let valueArray = this.$array.autoPriceUnit(this.data.dataMap.accumulateDealValue, true)
      this.accumulateDealValue = valueArray[0]
      this.unit = valueArray[1]
    },
    mounted() {
      this.initData()
      // this.opinionLines([], 'chart-year')
    },
    // 方法
    methods: {
      initData() {
        let stockAmountChart = this.data.dataMap.stockAmountChart
        let stockAdd = stockAmountChart[1].yName - stockAmountChart[0].yName
        if (stockAdd > 0) {
          this.stockValueDesc = '(较年初增加了' + this.data.dataMap.stockAmountChartRatio +'%)'
        } else if (stockAdd == 0) {
          this.stockValueDesc = '(较年初没有变化哦)'
        } else {
          this.stockValueDesc = '(较年初减少了' + this.data.dataMap.stockAmountChartRatio +'%)'
        }

        let marketValueChart = this.data.dataMap.marketValueChart
        let marketAdd = marketValueChart[1].yName - marketValueChart[0].yName
        if (marketAdd > 0) {
          this.marketValueDesc = '(较年初增加了' + this.data.dataMap.marketValueChartRatio +'%)'
        } else if (marketAdd == 0) {
          this.marketValueDesc = '(较年初没有变化哦)'
        } else {
          this.marketValueDesc = '(较年初减少了' + this.data.dataMap.marketValueChartRatio +'%)'
        }
        if (marketValueChart[0].yName === 0) {
          this.marketValueDesc = '开启资本市场新征程'
        }

        let dataName = stockAmountChart.map(e => { return e.xName })
        let dateValue = stockAmountChart.map(e => { return e.yName })

        let dataName2 = marketValueChart.map(e => { return e.xName })
        let dateValue2 = marketValueChart.map(e => { return e.yName })

        this.chart(dataName, dateValue, 'chart-year1')

        this.chart(dataName2, dateValue2, 'chart-year2')
      },
      chart(dataName, dateValue, id) {
        let _this = this
        let myChart = echarts.init(document.getElementById(id));
//        let dataName = ['2017', '2018']
//        let dateValue = [1543, 1785];

        let color = ['#FF8143'];
        let unit = '股'
        if (id == 'chart-year2') {
          color = ['#A0B9FF']
          unit = '元'
        }
        let option = {
          color: color,
          grid: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 30,
            show: false
          },
          xAxis: {
            type: 'category',
            data: dataName,
            axisLine: {
              lineStyle: {
                color: color[0]
              }
            },
            axisTick: {
              show: false
            },
            splitNumber: 6,
            minInterval: 6,
            maxInterval: 6,
            interval: 6
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: color[0]
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          series: [{
            data: dateValue,
            type: 'bar',
            barWidth: 10,
            barGap: 60,
            label: {
              normal: {
                show: true,
                fontSize: 11,
                position: 'top',
                color: '#333333',
                formatter: function (data) {
                  return _this.$array.autoPriceUnit(data.value) // + unit
                }
              }

            }
          }]
        };
        myChart.setOption(option);
      }
    }
  }
</script>

<style lang="scss">
  #yearHanqin {
    /*margin-top: 24px;*/
    .year-content {
      position: relative;
      padding:20px 11px 0 0;
      .bgimg {
        width: 100%;
      }
      .year-info {
        /*border: 1px solid red;*/
        position: absolute;
        left:54px;
        top:120px;
        .first{
          padding: 5px 0;
        }
        .yinli-img {
          margin-top: 14px;
          text-align: center;
          img {
            width: 192px;
          }
        }
        .year-data {
          margin-left: 8px;
          .chart-title {
            display: flex;
            justify-content: space-between;
            width: 260px;
            .title {
              width:50%;
              .p1 {
                font-size: 12px;
                color: #333333;
                text-align: center;
              }
              .p2 {
                text-align: center;
                font-size: 10px;
                color: #666666;
                transform: scale(.9);
                white-space: nowrap;
              }
            }
          }
          .chart-box {
            display: flex;
            justify-content:space-between;
            width: 260px;
            margin-top: 5px;
            #chart-year1, #chart-year2 {
              width:50%;
              height: 110px;
            }
          }
          p {
            color: #333333;
            font-size: 13px;
            .red-big {
              color:#FF5400;
              font-size: 25px;
              font-weight: 600;
              display: inline-block;
              padding: 0 5px;
            }
            .red-small {
              color:#FF5400;
              font-size: 16px;
              font-weight: 600;
            }
            .font-mini {
              font-size: 11px;
            }
          }
          .top10 {
            margin-top: 10px;
          }
        }
        .hanqin-progress {
          width: 190px;
          height: 9px;
          background-color: #e7e7e7;
          border-radius: 0 9px 9px 0;
          padding: 1px 0;
          .present {
            width:50%;
            height:100%;
            background:linear-gradient(-90deg,rgba(255,84,0,1) 0%,rgba(255,150,98,1) 100%);
            border-radius:0px 9px 9px 0px;
          }
        }
        .year-amonut {
          padding-left: 16px;
          .p1 {
            color: #FF5400;
            font-size:11px;
            span {
              font-size: 25px;
              font-weight: 600;
            }
          }
          .p2 {
            font-size:11px;
            color: #666666;
            padding-bottom: 5px;
          }
          .p3 {
            font-size: 10px;
            color: #666666;
            padding-top: 5px;
          }
        }

        .hanqin-low {
          margin: 25px 15px 0 15px;
          padding-top: 25px;
          .p1 {
            color: #000000;
            font-size: 13px;
            .red-big {
              display: inline-block;
              color: #ff5400;
              font-size: 25px;
              font-weight: 600;
            }
            .red-small {
              color: #ff5400;
              font-size: 11px;
              font-weight: 600;
            }
          }
          .p2 {
            font-size: 10px;
            color: #999999;
          }
          .p3 {
            text-align: center;
            margin-top: 30px;
          }
        }
        .vux-1px-t:before {
          border-top-color: #FF6029;
        }
      }
    }
  }
</style>
