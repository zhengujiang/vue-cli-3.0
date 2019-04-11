<template>
  <div class="my-year-four">
    <div class="my-scale">
      <header class="animated" :class="{fadeInDown : activeIndex == 3}">
        <div class="header-str animated" :class="{fadeIn : activeIndex == 3}">
                <span class="name-seen">
                    <span class="fix">
                    <i>
                       <img :src="myHome.Avatar" alt="">
                    </i>
                    </span>
                    <span class="fix">
                        <span class="fix-title">{{myHome.name}}</span>
                        <span class="fix-doc">{{myHome.codeName}}【{{myHome.code}}】</span>
                    </span>
                </span>
        </div>
      </header>
      <div class="m-y-four-middle">
        <div class="two-middle-content">
          <img :src="$image.myYear.y4_2" alt="" class="animated"
               :class="{fadeIn : activeIndex == 3}">
          <div class="EChart-bar">
            <div class="bar-ect animated" :class="{fadeIn : activeIndex == 3}">
              <span><i class="echart-color1"></i>总股本</span>
              <span><i class="echart-color2"></i>总市值</span>
            </div>
            <div class="bar-echart animated">
              <div class="echart-y">
                <div class="EChart-one" id="EChart-one"></div>
              </div>
              <div class="echart-y">
                <div class="EChart-two" id="EChart-two"></div>
              </div>
            </div>
            <div class="bar-content animated" :class="{fadeIn : activeIndex == 3}">
              <h2>截止2017年12月31日</h2>
              <div class="tool-doc">
                <p class="swing animated" :class="{zoomIn : activeIndex == 3}">公司总股本为
                  <span>{{ $array.unitWan(myYearData.zgb2017)[0] }}</span>
                  {{$array.unitWan(myYearData.zgb2017)[1]+'股'}}
                </p>
                <p class="doc-o" v-if="myYearData.zgbRaise == 0">较去年没有变化</p>
                <p class="doc-o" v-else-if="myYearData.zgbRaise < 0">
                  较去年减少了{{Math.abs(myYearData.zgbRaise)}}%。</p> <!--取绝对值-->
                <p class="doc-o" v-else>较去年增加了{{myYearData.zgbRaise}}%。</p>
              </div>
              <div class="tool-doc">
                <p class="swing animated" :class="{zoomIn : activeIndex == 3}">
                  公司总市值<span>{{$array.unitWan(myYearData.zsz2017)[0]}}</span>
                  {{$array.unitWan(myYearData.zsz2017)[1]}}元</p>
                <p class="doc-o">总市值排名：{{myYearData.zszIndex}}位</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bi-icon-img">
        <img :src="$image.myYear.y4_9" alt="">
      </div>
      <p class="icons-jiantou animated" :class="{fadeInUp : activeIndex == 3}">
        <img class="arrow" :src="$image.myYear.y12_3" alt="">
        <!--<i class="icon iconfont icon-xiangshangjiantou"></i>-->
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "my-year-one",
    data() {
      return {
        headerTouxiang: this.$image.personal.timg,
        activeIndex: ''
      }

    },
    props: {
      myHome: {
        type: Object,
        required: false,
        default: {}
      },
      active: {
        type: Number,
        required: false,
        default: 0
      },
      data: {
        type: Object,
        required: false,
      },
      myYearData: {
        type: Object,
        required: false
      },
      android: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    watch: {
      'active': function () {
        setTimeout(() => {
          this.activeIndex = this.active;
          if (this.activeIndex == 3) {
            console.log(this.data);
            setTimeout(() => {
              this.barEChartEquity(this, this.data.zgb);
              this.barEChartMarket(this, this.data.zsz);
            }, 1000)
          }
        })
      }
    },
    updated() {

    },
    //页面构建前准备
    created() {

    },

    mounted() {
      if (this.android) {
        // 是安卓机
        $('.my-year-four .header-str').css({marginTop: '10px'});
        $('.my-year-four .m-y-four-middle').css({marginTop: '3%', padding: '0 12%'});
        $('.my-year-four .bar-echart').css({paddingTop: '0'});
        $('.my-year-four .bi-icon-img').css({top: '70%'});
        // $('.my-year-two .m-y-o-ba').css({padding: '2% 6% 0 8%'})
      }
    },
    methods: {
      //
      barEChartEquity(that, data) {
        let Equity = echarts.init(document.getElementById('EChart-one'));
        let dataName = [], dateValue = [];
        for (let i in data) {
          dataName.push(data[i].name);
          dateValue.push(data[i].value);
        }
        let color = ['#ffb247'];
        let option = {
          color: color,
          grid: {
            bottom: '14%',
            top: '13%',
          },
          xAxis: [{
            show: true,
            type: 'category',
            data: dataName,
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: color[0]
              }
            },
            nameGap: 0,
            axisLabel: {
              show: true,
            },
            nameTextStyle: {
              color: color[0],
              fontSize: '10'
            },
            /*splitLine: {
                show: false,
                lineStyle: {},
            }*/
          }],
          yAxis: [{
            show: true,
            type: 'value',
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {},
            }
          }],
          series: [{
            data: dateValue,
            name: '',
            type: 'bar',
            barWidth: '20',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: function (obj) {
                  // console.log('q33242432', obj);
                  if (obj.value === 0) {
                    return '';
                  } else {
                    return (that.$array.unitQianYi(obj.value)[0] + that.$array.unitQianYi(obj.value)[1]);
                  }
                }
              }
            }
          }]
        };
        Equity.setOption(option);
      },
      //
      barEChartMarket(that, data) {
        let Equity = echarts.init(document.getElementById('EChart-two'));
        let dataName = [], dateValue = [];
        for (let i in data) {
          dataName.push(data[i].name);
          dateValue.push(data[i].value);
        }
        let color = ['#7ecafa'];
        let option = {
          color: color,
          grid: {
            bottom: '14%',
            top: '13%',
            containLabel: false
          },
          xAxis: [{
            show: true,
            type: 'category',
            data: dataName,
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: color[0]
              }
            },
            boundaryGap: true,
            axisLabel: {
              show: true,
              color: color[0]
            },
            nameTextStyle: {
              color: color[0],
              fontSize: '10'
            },
            /*splitLine: {
                show: false,
                lineStyle: {},
            }*/
          }],
          yAxis: [{
            show: true,
            type: 'value',
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {},
            }
          }],
          series: [{
            data: dateValue,
            name: '',
            type: 'bar',
            barWidth: '20',
            // barGap:'40%',
            // barCategoryGap: '50%',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: function (obj) {
                  //  console.log('qa', obj);
                  if (obj.value === 0) {
                    return '';
                  } else {
                    return (that.$array.unitQianYi(obj.value)[0] + that.$array.unitQianYi(obj.value)[1]);
                  }
                }
              }
            }
          }]
        };
        Equity.setOption(option);
      }
    }
  }
</script>

<style lang="scss">
  .my-year-four {
    width: 100%;
    height: 100%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/myYear/2@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
    overflow: hidden;
    font-family: PingFangSC-Medium, sans-serif;
    div {
      .icons-jiantou {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        img {
          animation-duration: 10s;
          width: 25px;
        }
        .arrow {
          -webkit-transform: rotate(0deg);
          -webkit-animation: arrow 1.5s infinite ease-in-out;
        }
        @-webkit-keyframes arrow {
          0% {
            opacity: 0;
            -webkit-transform: translate(0, 0px) rotate(0deg)
          }
          50% {
            opacity: 1;
            -webkit-transform: translate(0, -15px) rotate(0deg)
          }
          100% {
            opacity: 0;
            -webkit-transform: translate(0, -20px) rotate(0deg)
          }
        }

      }
      .bi-icon-img {
        position: absolute;
        right: 2%;
        top: 78%;
        img {
          width: 115px;
        }
      }
      header {
        * {
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        }
        .header-str {
          display: inline-block;
          padding: 5px 10px;
          border: 1.8px solid rgba(255, 255, 255, 0.5);
          border-radius: 60px;
          margin-top: 25px;
          margin-left: 20px;
          background-color: rgba(252, 151, 131, 0.1);
          box-shadow: 2px 2px 1px rgba(252, 151, 131, 0.15);
          .name-seen {
            display: table;
            .fix {
              display: table-cell;
              vertical-align: middle;
              i {
                background-color: rgba(252, 151, 131, 1);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
                box-sizing: border-box;
                text-align: center;
                vertical-align: middle;
                img {
                  padding: 1.8px;
                  border-radius: 50%;
                  height: 100%;
                  width: 100%;
                  box-sizing: border-box;
                }
              }
              .fix-title {
                height: 100%;
                display: block;
                font-size: 15px;
                padding-left: 10px;
                color: rgba(252, 151, 131, 1);
                width: 138px;
                word-break: keep-all; /* 不换行 */
                white-space: nowrap; /* 不换行 */
                overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
                text-overflow: ellipsis;
              }
              .fix-doc {
                font-size: 14px;
                padding-left: 10px;
                color: rgba(252, 151, 131, 1);
              }
            }
          }
        }
      }
      .m-y-four-middle {
        width: 100%;
        padding: 0 10% 0 10%;
        margin-top: 5%;
        box-sizing: border-box;
        > div {
          box-sizing: border-box;
          width: 100%;
          overflow: hidden;
          position: relative;
          img {
            width: 100%;
            box-sizing: border-box;
          }
          .EChart-bar {
            position: absolute;
            top: 18.5%;
            left: 0;
            width: 100%;
            height: 160px;
            box-sizing: border-box;
            font-size: 0;
            display: table;
            padding: 0 0 0 0;
            .bar-ect {
              display: table;
              padding: 0 0 0 25px;
              span {
                display: table-cell;
                vertical-align: middle;
                line-height: 1;
                font-size: 10px;
                padding-right: 10px;
                color: #8d8d8d;
                font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                .echart-color1 {
                  display: inline-block;
                  height: 10px;
                  width: 10px;
                  border-radius: 1px;
                  background-color: #ffb247;
                  margin-right: 5px;
                  vertical-align: top;
                }
                .echart-color2 {
                  display: inline-block;
                  height: 10px;
                  width: 10px;
                  border-radius: 1px;
                  background-color: #7ecafa;
                  margin-right: 5px;
                  vertical-align: top;
                }
              }
            }
            .bar-echart {
              height: 160px;
              display: table;
              width: 100%;
              padding-left: 15px;
              padding-right: 15px;
              padding-top: 10px;
              .echart-y {
                height: 100%;
                padding-top: 10px;
                width: 50%;
                display: table-cell;
                box-sizing: border-box;
                .EChart-one {
                  height: 150px;
                }
                .EChart-two {
                  height: 150px;
                }
              }
            }
            .bar-content {
              font-size: 15px;
              box-sizing: border-box;
              padding: 20px 0 0 25px;
              h2 {
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                color: #545454;
                font-family: PingFangSC-Medium, sans-serif;
              }
              .tool-doc {
                font-size: 14px;
                color: #545454;
                margin-bottom: 10px;
                .swing {
                  font-family: PingFangSC-Medium, sans-serif;
                  color: #545454;
                }
                span {
                  font-size: 25px;
                  color: #ffb148;
                }
                .doc-o {
                  font-size: 13px;
                  color: #b1b1b1;
                }
              }
            }
          }
        }
      }
    }
    * {
      box-sizing: border-box;
    }

  }
</style>
