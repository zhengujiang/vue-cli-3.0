<template>
  <div id="yearFenHong">
    <div class="year-user-info">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <div class="user">
        <p class="user-nick">{{userInfo.userName}}</p>
        <p class="user-code">{{companyName + ' ' + companyCode}}</p>
      </div>
    </div>
    <div class="year-content">
      <img class="bgimg" :src="$image.year2018.zibenbg"/>
      <div class="year-info">
        <div class="year-data animated y-zoomIn">
          <p class="title">公司分派现金红利合计</p>
          <div class="progress-box">
            <div class="year-progress">
              <div class="present":style="'width:'+data.dataMap.dividendValueRatio+'%'"></div>
            </div>
            <p><span class="y-scale">{{dividendValue}}</span> {{unit}}元</p>
          </div>
          <p class="present">超过<span class="cred">{{data.dataMap.dividendValueRatio|toNum}}%</span>的上市公司</p>
        </div>
        <div class="year-data vux-1px-t">
          <div class="animated y-zoomIn">
            <p class="title">每股分红</p>
            <div class="progress-box">
              <div class="year-progress">
                <div class="present" :style="'width:'+data.dataMap.perDividendValueRatio+'%'"></div>
              </div>
              <p><span class="y-scale">{{data.dataMap.perDividendValue}}</span> 元</p>
            </div>
            <p class="present">超过<span class="cred">{{data.dataMap.perDividendValueRatio|toNum}}%</span>的上市公司</p>
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
        dividendValue: '',
        unit: ''
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
      let valueArray = this.$array.autoPriceUnit(this.data.dataMap.dividendValue, true)
      this.dividendValue = valueArray[0]
      this.unit = valueArray[1]
    },
    mounted() {
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  #yearFenHong {
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
        top:130px;
        padding-left: 16px;
        .year-data {
          padding: 20px 0;
          .title {
            color: #333333;
            font-size: 16px;
            font-weight: 600;
            position: relative;
            padding-left: 6px;
            &:before {
              position: absolute;
              content: '';
              background-color: #ff5400;
              width: 3px;
              height: 72%;
              top: 12%;
              left:0;
            }
          }
          .present {
            color: #333333;
            font-size: 13px;
            padding-top: 7px;
            .cred {
              color:#FF5400;
            }
          }
          .top10 {
            margin-top: 10px;
          }
        }
        .progress-box {
          display: flex;
          align-items: center;
          /*justify-content: space-between;*/
          margin-top: 7px;
          p {
            padding-left: 10px;
            font-size: 11px;
            color: #ff5400;
            span {
              font-size: 24px;
              font-weight: 600;
              display: inline-block;
            }

          }
        }
        .year-progress {
          width: 120px;
          height: 12px;
          /*margin-top: 14px;*/
          background-color: #e7e7e7;
          border-radius: 0 9px 9px 0;
          padding: 1px 0;
          .present {
            width:1%;
            height:100%;
            background:linear-gradient(-90deg,rgba(255,84,0,1) 0%,rgba(255,150,98,1) 100%);
            border-radius:0px 9px 9px 0px;
          }
        }
        .vux-1px-t:before {
          border-top-color: #FF6029;
        }
      }
    }
  }
</style>
