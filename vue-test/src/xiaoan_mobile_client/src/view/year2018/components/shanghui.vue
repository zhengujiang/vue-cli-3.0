<template>
  <div id="yearShangHui">
    <div class="year-user-info">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <div class="user">
        <p class="user-nick">{{userInfo.userName}}</p>
        <p class="user-code">{{companyName + ' ' + companyCode}}</p>
      </div>
    </div>
    <div class="year-content">
      <img class="bgimg" :src="$image.year2018.shanhuibg"/>
      <div class="year-info">
        <div class="year-line-img"></div>
        <div class="year-data">
          <div class="animated y-fadeInUp">
            <p class="first">共召开<span class="red-big y-scale">{{data.dataMap.stockholderMeetingAmount|toNum}}</span>次股东大会</p>
            <p class="font-mini" :class="{'vhide': !data.dataMap.stockholderMeetingAmount}">超过{{data.dataMap.stockholderMeetingAmountRatio|toNum}}%的上市公司！</p>
          </div>
          <div class="animated y-fadeInUp delay-05s">
            <p>回答投资者<span class="red-big y-scale">{{data.dataMap.answerInvestorAmount|toNum}}</span>个问题</p>
            <p class="font-mini" :class="{'vhide': !data.dataMap.answerInvestorAmount}">超过{{data.dataMap.answerInvestorAmountRatio|toNum}}%的上市公司！</p>
          </div>
          <div class="animated y-fadeInUp delay-1s">
            <p>全年有
              <span class="red-big y-scale">{{$array.autoPriceUnit(data.dataMap.companySentimentAmount,true)[0]}}<span class="red-big-1 y-scale">{{$array.autoPriceUnit(data.dataMap.companySentimentAmount,true)[1]}}</span>
              </span>条舆情</p>
            <p class="font-mini" :class="{'vhide': !data.dataMap.companySentimentAmount}">超过{{data.dataMap.companySentimentAmountRatio|toNum}}%的上市公司！</p>
          </div>
        </div>
        <div class="year-investor vux-1px-t">
            <p v-if="data.dataMap.csrReportDate">
              <span class="red-small animated y-inLeft">{{data.dataMap.csrReportDate}}</span> 披露了社会责任报告。
            </p>
            <p v-if="data.dataMap.csrReportName">
              入选了 <span class="red-small animated y-fadeInUp delay-2s">{{data.dataMap.csrReportName}}</span>
            </p>
            <div class="sh-tip" v-if="!data.dataMap.csrReportDate && !data.dataMap.csrReportName">
              <p>致投资者：</p>
              <p>千里姻缘一线牵，投关管理来搭线。</p>
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
    filters: {
      toNum: function (value) {
        return value ? value : 0
      }
    },
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  #yearShangHui {
    /*margin-top: 24px;*/
    .year-content {
      /*background: url('/static/img/year2018/xipibg.png') no-repeat;*/
      position: relative;
      padding:20px 11px 0 0;
      .bgimg {
        width: 100%;
      }
      .year-info {
        /*border: 1px solid red;*/
        position: absolute;
        left:64px;
        top:125px;
        .first{
          padding-top: 5px;
        }
        .year-line-img {
          position: relative;
          width: 16px;
          height: 120px;
          border: 2px solid #fe5321;
          border-right: 0;
          margin-top: 26px;
          float:left;
          &:before {
            content: '';
            position: absolute;
            width: 100%;
            top: 50%;
            height: 2px;
            background-color: #fe5321;
          }
        }
        .year-data, .year-investor {
          float: left;
          margin-left: 8px;
          p {
            color: #333333;
            font-size: 13px;
          }
          .red-big {
             color:#FF5400;
             font-size: 25px;
             font-weight: 800;
             display: inline-block;
             padding: 0 5px;
           }
          .red-big-1 {
            color:#FF5400;
            font-size: 23px;
            font-weight: 800;
            display: inline-block;
          }
          .red-small {
            display: inline-block;
            color:#FF5400;
            font-size: 16px;
            font-weight: 800;
          }
          .font-mini {
            font-size: 11px;
            color: #666666;
            padding-bottom: 6px;
          }
          .top10 {
            margin-top: 10px;
          }
        }
        .year-investor {
          margin-top: 12px;
          /*border-top: 1px solid #FF6029;*/
          padding-top: 16px;
          margin-left: 0;
          min-width: 240px;
        }
        .vux-1px-t:before {
          border-top-color: #FF6029;
        }
        .sh-tip {
          padding: 10px;
        }
      }
    }
    .vhide {
      visibility: hidden;
    }
  }
</style>
