<template>
  <div id="xinpiOne">
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
        <img class="xinpi-line-img" :src="$image.year2018.xinpiline"/>
        <div class="xinpi-data">
          <p class="first">共发布公告<span class="red-big y-scale">{{data.dataMap.announcementAmount|toNum}}</span>份</p>
          <p class="f11">超过{{data.dataMap.announcementExceedRatio|toNum}}%的上市公司！</p>

          <div class="top28 animated y-fadeInUp">
            <p><span class="red-mini">{{data.dataMap.firstAnnouncementDate}}</span></p> <!--animated y-fadeInDown fast-->
            <p>发布第一份公告</p>
          </div>
          <div class="top24 animated y-fadeInUp delay-05s">
            <p>公告字数达<span class="red-small y-scale">{{$array.autoPriceUnit(data.dataMap.announcementWordAmount,true)[0]}}<span class="red-small-1">{{$array.autoPriceUnit(data.dataMap.announcementWordAmount,true)[1]}}</span></span>字！</p>
            <p>相当于抄写了<span class="red-small y-scale">{{data.dataMap.listRuleAmount|toNum}}</span>本股票上市规则！</p>

          </div>
          <div class="top21 animated y-fadeInUp delay-1s">
            <p><span class="red-mini">{{data.dataMap.lastAnnouncementDate}}</span></p>
            <!--animated y-fadeInUp fast delay-1s-->
            <p>发布最后一份公告</p>
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
  #xinpiOne {
    /*margin-top: 24px;*/
    .xinpi-content {
      /*background: url('/static/img/year2018/xipibg.png') no-repeat;*/
      position: relative;
      padding:20px 11px 0 0;
      .bgimg {
        width: 100%;
      }
      .xinpi-info {
        /*border: 1px solid red;*/
        position: absolute;
        left:64px;
        top:130px;
        .first{
          /*padding-top: 5px;*/
        }
        .xinpi-line-img {
          width: 18px;
          margin-top: 52px;
          float:left;
        }
        .xinpi-data {
          float: left;
          margin-left: 8px;
          p {
            color: #333333;
            font-size: 13px;
            .red-big {
              color:#FF5400;
              font-size: 25px;
              font-weight: 800;
              display: inline-block;
              padding: 0 5px;
            }
            .red-small {
              display: inline-block;
              color:#FF5400;
              font-size: 18px;
              font-weight: 800;
              padding: 0 5px;
            }
            .red-small-1 {
              display: inline-block;
              color:#FF5400;
              font-size: 16px;
              font-weight: 800;
            }
            .red-mini {
              display: inline-block;
              color:#FF5400;
              font-size: 15px;
              /*padding: 0 5px;*/
            }
          }
          .f11 {
            font-size: 11px;
            color: #666;
          }
          .top28 {
            margin-top: 18px;
          }
          .top24 {
            margin-top: 14px;
          }
          .top21 {
            margin-top: 16px;
          }
        }


      }
    }
  }
</style>
