<template>
  <div id="yearImportEvent">
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
            <template v-for="item in data.dataMap.event_data">
              <p class="data-title">{{item.keyName}}</p>
              <p class="data-time" v-for="(item2,index) in item.valueList">{{item2}}</p>
            </template>
            <!--<p class="data-title">增持计划实施完成</p>
            <p class="data-time">2018年7月15日</p>
            <p class="data-time">2018年7月15日</p>
            <p class="data-time">2018年7月15日</p>
            <p class="data-title">发布股份回购报告书</p>
            <p class="data-time">2018年7月15日</p>
            <p class="data-time">2018年7月15日</p>-->
          </div>
        </div>
        <div class="biaoyu animated y-inLeft">
          <img :src="$image.year2018.importevent_biaoyu"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
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
  #yearImportEvent {
    /*margin-top: 24px;*/
    .year-content {
      position: relative;
      padding: 20px 11px 0 0;
      .bgimg {
        width: 100%;
      }
      .year-info {
        /*border: 1px solid red;*/
        position: absolute;
        /*left:64px;*/
        top: 125px;
        .year-data {
          height: 185px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          .data-title {
            color: #ff5400;
            font-size: 25px;
          }
          .data-date {
            color: #666666;
            font-size: 13px;
          }
          .data-time + .data-title {
            margin-top: 8px;
          }
        }
        .biaoyu {
          padding: 10px 80px 0 90px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
</style>
