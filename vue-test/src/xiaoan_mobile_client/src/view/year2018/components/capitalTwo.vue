<template>
  <div id="yearPiWen">
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
        <div class="year-data  animated y-zoomIn">
          <div>
            <template v-for="item in data.dataMap.event_data">
              <p class="data-title">{{item.keyName}}</p>
              <p class="data-time" v-for="(item2,index) in item.valueList">{{item2}}</p>
            </template>
            <!--<p class="data-title">非公开发行A股股票获批文</p>
            <p class="data-time">2018年7月15日</p>-->
          </div>
          <!--<img class="zan" src="/static/img/year2018/zan.png"/>-->
        </div>
        <div class="vux-1px-t">
          <div class="biaoyu animated y-inLeft">
            <img :src="$image.year2018.ziben_biaoyu"/>
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
        datalen: 1
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
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  #yearPiWen {
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
        /*left:54px;*/
        top:130px;
        padding: 0 70px;
        .year-data {
          position: relative;
          height: 160px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          .customer-one {
            position: relative;
            font-size: 13px;
            color: #666666;
            padding-top: 40px;
            .company-name {
              color: #FF5400;
            }

          }
          .zan {
             position: absolute;
             right: 40px;
             bottom: 10px;
             width: 31px;
           }
          .data-title {
            color: #ff5400;
            font-size: 24px;
            font-weight: 800;
          }
          .data-date {
            color: #666666;
            font-size: 13px;
          }
          .data-time+.data-title {
            margin-top: 8px;
          }
        }
        .biaoyu {
          padding: 20px 10px 0 10px;
          img {
            width: 100%;
          }
        }
        .vux-1px-t:before {
          border-top-color: #FF6029;
        }
      }
    }
  }
</style>
