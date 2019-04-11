<template>
  <div id="xinpiTwo">
    <div class="year-user-info">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <div class="user">
        <p class="user-nick">{{userInfo.userName}}</p>
        <p class="user-code">{{companyName + ' ' + companyCode}}</p>
      </div>
    </div>
    <div class="xinpi-content">
      <img class="bgimg" :src="$image.year2018.xipibg"/>
      <div class="xinpi-info">
        <img class="xinpi-line-img" :src="$image.year2018.xinpiline2"/>
        <div class="xinpi-data">
          <p class="chart-title">每月发布公告数量</p>
          <div id="chart-xinpi"></div>
          <div class="animated y-fadeInUp fast">
            <p class="top10"><span class="red-big y-scale">{{data.dataMap.topAnnouncementAmountMonth}}</span>月公告数量最多</p>
            <p class="font-mini">{{data.dataMap.topAnnouncementAmountMonth}}月份可忙坏了，小安给你揉揉肩!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: ['userInfo', 'companyCode', 'companyName', 'data'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
      this.initData()
    },
    // 方法
    methods: {
      initData() {
        let monthAnnouncementAmountChart = this.data.dataMap.monthAnnouncementAmountChart
        let topAnnouncementAmountMonth = this.data.dataMap.topAnnouncementAmountMonth

        let dataName = monthAnnouncementAmountChart.map(e => {
          return e.xName
        })
        let dateValue = monthAnnouncementAmountChart.map(e => {
          return e.yName
        })
        console.log(dataName)
        this.chart(dataName, dateValue, 'chart-xinpi')
      },
      chart(dataName, dateValue, id) {
        let myChart = echarts.init(document.getElementById(id));
//        let dataName = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
//        let dateValue = [3, 5, 7, 16, 8, 7, 3, 2, 7, 10, 5, 7];
        let color = ['#FF8143'];
        let option = {
          color: color,
          grid: {
            left: 28,
            right: 25,
            top: 20,
            bottom: 30,
            show: false
          },
          xAxis: {
            type: 'category',
            data: dataName,
//            nameLocation: 'start',
            axisLine: {
              lineStyle: {
                color: color[0]
              }
            },
            axisTick: {
              // interval: 4,
              alignWithLabel:true
            },
            axisLabel: {
              interval: 0,
              formatter: function (value, index) {
                if(value == '1月' || value == '6月' || value == '12月') {
                  return value
                } else {
                  return ''
                }
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: color[0]
              }
            },
            splitLine: {
              show: false
            }
          },
          series: [{
            data: dateValue,
            symbol: 'circle',
            symbolSize: 5,
            lineStyle: {
              width: 1
            },
            markPoint: {
              symbolSize: 1,
              label: {
                color: '#FF8143',
                offset:[0, -10],
                formatter: function(data) {
                  return data.value +'份'
                }
              },
              data: [
                {type: 'max', name: '最大值'}
                // {type: 'min', name: '最小值'}
              ]
            },
            type: 'line'
          }]
        };
        myChart.setOption(option);
      }
    }
  }
</script>

<style lang="scss">
  #xinpiTwo {
    /*margin-top: 24px;*/
    .xinpi-content {
      position: relative;
      padding:20px 11px 0 0;
      .bgimg {
        width: 100%;
      }
      .xinpi-info {
        /*border: 1px solid red;*/
        position: absolute;
        left:64px;
        top:120px;
        .first{
          padding: 5px 0;
        }
        .xinpi-line-img {
          width: 10px;
          margin-top: 40px;
          float:left;
        }
        .xinpi-data {
          float: left;
          margin-left: 8px;
          .chart-title {
            color: #333333;
            font-size: 16px;
            font-weight: 600;
            margin-top: 32px;
          }

          #chart-xinpi {
            width:220px;
            height: 120px;
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
            }
            .font-mini {
              font-size: 11px;
            }
          }
          .top10 {
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
