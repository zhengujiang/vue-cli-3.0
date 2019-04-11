<template>
  <div id="yearImportEventTwo">
    <div class="year-user-info">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <div class="user">
        <p class="user-nick">{{userInfo.userName}}</p>
        <p class="user-code">{{companyName + ' ' + companyCode}}</p>
      </div>
    </div>
    <div class="year-content">
      <img class="bgimg" :src="$image.year2018.importeventbg"/>
      <div class="year-info">
        <div class="year-data animated y-zoomIn">
          <div>
            <div class="customer-two" v-if="data.user_status==1 && data.event_data.length>=2">
              <p>您选择了“<span class="company-name">信公咨询</span>”
                <img class="zan" :src="$image.year2018.zan"/>
              </p>
              <p>作为公司的独立财务顾问，真机智！</p>
            </div>
            <template v-for="item in data.dataMap.event_data">
              <p class="data-title">{{item.keyName}}</p>
              <p class="data-time" v-for="(item2,index) in item.valueList">{{item2}}</p>
            </template>
            <!--<p class="data-title">发布股权激励方案</p>
            <p class="data-time">2018年7月15日</p>-->
            <!--<p class="data-title">发布员工持股计划草案</p>
            <p class="data-time">2018年7月15日</p>-->
            <div class="customer-one" v-if="data.dataMap.user_status==1 && data.dataMap.event_data.length==1">
              <p>您选择了“<span class="company-name">信公咨询</span>”
                <img class="zan" :src="$image.year2018.zan"/>
              </p>
              <p>作为公司的独立财务顾问，真机智！</p>
            </div>
          </div>
        </div>
        <div class="biaoyu animated y-inLeft">
          <img :src="$image.year2018.improtevent_jili"/>
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
  #yearImportEventTwo {
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
        top:110px;
        .year-data {
          height: 200px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          .customer-two {
            position: relative;
            font-size: 13px;
            color: #666666;
            padding-bottom: 5px;
            .company-name {
              color: #FF5400;
            }
            .zan {
              position: absolute;
              right: 40px;
              top: -10px;
              width: 31px;
            }
          }
          .customer-one {
            position: relative;
            font-size: 13px;
            color: #666666;
            padding-top: 40px;
            .company-name {
              color: #FF5400;
            }
            .zan {
              position: absolute;
              right: 40px;
              top: 10px;
              width: 31px;
            }
          }
          .data-title {
            color: #ff5400;
            font-size: 25px;
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
          padding: 0 80px 0 90px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
</style>
