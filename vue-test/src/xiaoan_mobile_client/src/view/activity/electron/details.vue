<template>
  <div id="electron-details">
    <div class="scroller">
      <e-head :show="false" :name="companyName"></e-head>
      <div class="electron-chart">
        <div id="pie-chart"></div>
        <div class="num">{{score}}<span class="pic">%</span></div>
      </div>
      <div class="asw" v-if="score>=50">
        <p>你有<span class="num">{{score}}</span>%的科创板基因呢</p>
        <p>爱因斯坦在你们公司吗？</p>
      </div>
      <div class="asw" v-else>
        <p>你有<span class="num">{{score}}</span>%的科创板基因</p>
        <p>加油！科创板并不遥远</p>
      </div>
      <div class="btn flex-box">
        <div class="col t-right">
          <button class="next" @click="$router.push({path:'/electron/home'})">再测一遍</button>
        </div>
        <div class="col t-left">
          <button class="share" @click="shareChange">分享</button>
        </div>
      </div>
      <p class="text">你想知道关于科创板的一切吗？</p>
      <!---->
      <div class="tis">
        <div class="li" v-for="(list, index) in writing" @click="tolink(index)">
          <div class="title">{{list.title}}</div>
          <div class="doc vxa-ellipsis3">{{list.doc}}</div>
          <div class="time">{{list.time}}</div>
        </div>
      </div>
    </div>
    <share :share="share" @change="shareChanges"></share>
    <vxa-loading v-show="loading"></vxa-loading>
    <!--<x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="show = true">iOS Gradients</x-button>-->
  </div>
</template>

<script>
  import share from '@/view/activity/electron/components/share.vue'
  import VxaLoading from "@/components/warning/loading.vue";
  import EHead from './components/head'
  import {Swiper, SwiperItem, XDialog, XButton, TransferDomDirective as TransferDom} from 'vux'
  export default {
    name: "electron",
    directives: {
      TransferDom
    },
    components: {
      XDialog, XButton, Swiper, SwiperItem, EHead, VxaLoading, share
    },
    data() {
      return {
        loading: true,
        show: false,
        share: false,
        score: 100,
        companyName: '信公小安',
        writing: [
          {
            title: '科创板相关规则法规汇编',
            doc: '2019年1月30日，证监会发布《关于在上海证券交易所设立科创板并试点注册制的实施意见》，备受瞩目的科创板将正式落地。本法规汇编收录《上海证券交易所科创板股票上市规则（征求意见稿） 》等相关法规，有利于上市公司快速全面地了解与科创板相关的法规。',
            time: '2019-01-31',
            url: 'https://wx.in-hope.cn/#/collectGroom?id=c8b5325246394876a963c972409d2e40&title=科创版相关法规汇编'
          },
          {
            title: '一份让你看懂科创板全部要点的PPT',
            doc: '',
            time: '2019-02-01',
            url: 'https://mp.weixin.qq.com/s/ahr-ZYPgyChL1hTovrM7Pg'
          }
        ]
        // https://wx.in-hope.cn/#/collectGroom?id=c8b5325246394876a963c972409d2e40&title=科创版相关法规汇编
      }
    },
    created() {
      this.getUserCotrunRecord();
    },
    mounted() {
      //
      setTimeout(() => {
        this.loading = false
      }, 3000)
      let shareTitle = "测一测，你有多少科创板基因？";
      let shareDesc = "科创板原来离我这么近"; // 描述
      let shareLink = window.location.href; // 分享链接
      this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
    },
    methods: {
      getUserCotrunRecord() {
        this.$axios.cotrun.getUserCotrunRecord().then(res => {
          console.log(res.data.returnCode);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.loading = false;
              let data = res.data.returnObject;
              this.score = data.score;
              this.companyName = data.companyName;
              this.$nextTick(() => {
                setTimeout(_ => {
                  this.echart(this.score);
                }, 500)
                let shareTitle = "测一测，你有多少科创板基因？";
                let shareDesc = "科创板原来离我这么近"; // 描述
                let shareLink = `${this.$api.CURRENTIP.IP}#/electron/share?id=${this.$cookie.get('userId')}`; // 分享链接
                this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
              })
            } else {
              this.$router.replace({path: '/electron/home'})
            }
          }
        })
      },
      tolink(index) {
        location.href = this.writing[index].url;
      },
      //
      echart(percentage) {
        var myChart = echarts.init(document.getElementById('pie-chart'));
        let widthValue = (percentage) / 100; //百分比转小数
        let width = "20";// 线宽
        let widthColor = "rgba(240,207,141,1)"; //变化的刻度颜色
        let scaleColor = 'rgba(240,241,245,1)'; //默认的刻度底色
        let option = {
          backgroundColor: 'rgba(0,0,0,0)',
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          series: [
            {
              startAngle: 359.9,
              endAngle: 0,
              name: '1',
              type: 'gauge',
              center: ['50%', '50%'], // 默认全局居中
              radius: 120,
              min: 0,
              max: 100,
              splitNumber: 0,
              axisLine: { // 坐标轴线
                lineStyle: {
                  color: [
                    [0, 'rgba(255,255,255,0.2)'],
                    [1, 'rgba(255,255,255,0.2)']
                  ], // 属性lineStyle控制线条样式
                  width: 4
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: { // 坐标轴小标记
                textStyle: { // 属性lineStyle控制线条样式
                  fontWeight: 'bolder',
                  fontSize: 16,
                  color: 'rgba(30,144,255,0)',
                }
              },
              splitLine: { // 分隔线
                show: false
              },
              detail: {
                show: false
              },
            },
            {
              name: '2',
              type: 'pie',
              radius: [0, "85%"],
              zlevel: 100,
              avoidLabelOverlap: false,
              animationType: 'scale',
              silent: true,
              color: ['rgba(255, 255, 255, 0.3)'],
              tooltip: {
                show: false,
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [{
                value: 1,
                itemStyle: {
                  normal: {
                    color: "rgba(255, 255, 255, 0.3)"
                  }
                }
              },]
            },
            {
              startAngle: 359.9,
              endAngle: 0,
              name: '3',
              type: 'gauge',
              center: ['50%', '50%'], // 默认全局居中
              radius: 96,
              min: 0,
              max: 100,
              splitNumber: 0,
              axisLine: { // 坐标轴线
                lineStyle: {
                  color: [
                    [0, 'rgba(255,255,255,0.8)'],
                    [1, 'rgba(255,255,255,0.8)']
                  ], // 属性lineStyle控制线条样式
                  width: 1
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: { // 坐标轴小标记
                textStyle: { // 属性lineStyle控制线条样式
                  fontWeight: 'bolder',
                  fontSize: 16,
                  color: 'rgba(30,144,255,0)',
                }
              },
              splitLine: { // 分隔线
                show: false
              },
              detail: {
                show: false
              },
            },
            {
              name: "数据",
              type: "gauge",
              splitNumber: 180,
              startAngle: 269.9,
              endAngle: -90,
              radius: 89,
              zlevel: 200,
              axisLine: {
                lineStyle: {
                  color: [
                    [widthValue, widthColor], //%变化的颜色
                    [1, "rgba(0,0,0,0)"] //剩下%的颜色
                  ],
                  backgroundColor: widthColor,
                  width: width
                },
              },
              axisTick: {
                lineStyle: {
                  color: scaleColor,  //控制每一个刻度条纹 的颜色
                  width: 0.5
                },
                length: width,
                splitNumber: 1
              },
              pointer: {           // 分隔线
                shadowColor: 'rgba(255,255,255,0)', //默认透明
                shadowBlur: 5,
                show: false,
              },
              axisLabel: {
                distance: 11,
                textStyle: {
                  color: "#fff"
                },
                show: false,
              },
              splitLine: {
                "show": false
              },
              itemStyle: {
                normal: {
                  color: "#fff"
                }
              },
              detail: {
                formatter: percentage,
                offsetCenter: [0, 0],
                textStyle: {
                  fontSize: 30,
                  color: "rgba(0,0,0,0)"
                }
              },
              title: {
                offsetCenter: [0, percentage]
              },
            }
          ]
        };
        myChart.setOption(option, true);
      },
      //
      shareChange() {
        this.share = true
      },
      shareChanges(val) {
        this.share = val
      }
    }
  }
</script>

<style lang="scss">
  #electron-details {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/bg%402x.png?213213");
    background-repeat: no-repeat;
    background-size: cover;
    background-origin: padding-box;
    .scroller {
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .electron-chart {
      height: 245px;
      position: relative;
      margin-top: 10px;
      #pie-chart {
        width: 245px;
        height: 100%;
        margin: 0 auto;
      }
      .num {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 44px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        .pic {
          font-size: 14px;
        }
      }
    }
    .asw {
      text-align: center;
      margin-top: 20px;
      padding: 0 17%;
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
      .num {
        font-size: 28px;
        color: #ffb148;
        font-weight: 700;
      }
    }
    .text {
      text-align: center;
      font-size: 15px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 21px;
      padding: 15px 0;
    }
    .btn {
      margin-top: 34px;
      .t-right {
        margin-right: 20px
      }
      .next {
        width: 153px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        font-size: 16px;
        border: 2px solid rgba(146, 213, 255, 1);
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
      }
      .share {
        width: 153px;
        height: 50px;
        background: rgba(146, 213, 255, 1);
        font-size: 16px;
        border: 2px solid rgba(146, 213, 255, 1);
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
      }
    }
    .tis {
      width: 100%;
      padding: 15px 18px 37px;
      .li {
        background: rgba(255, 255, 255, 0.2);
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 10px;
        .title {
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 25px;
        }
        .doc {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
        }
        .time {
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 17px;
        }
      }
    }
  }
</style>
