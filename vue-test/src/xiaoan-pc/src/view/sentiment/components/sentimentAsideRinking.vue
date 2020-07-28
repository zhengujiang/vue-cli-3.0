<template>
  <div class="sentimentAsideRinking">
    <div class="el-card company-card-nopadding">
      <div class="company-card-header">
        <div class="company-card-title">同行业对比</div>
      </div>
      <div class="company-card-body">
        <div class="aside-list-header">
          <span class="list-header-num">排名</span>
          <span class="list-header-title" style="text-align: left;">公司名称</span>
          <span class="list-header-title">舆情数</span>
          <span class="list-header-title" style="width:71px;">7日涨幅</span>
        </div>
        <div class="card-aside-ranking">
          <ul>
            <li v-for="(item,index) in industryComparisonInfo" :key="index">

              <span v-if="index == '0'" class="list-content-num list-num list-num-first">{{index + 1}}</span>
              <span v-else-if="index == '1'" class="list-content-num list-num list-num-second">{{index + 1}}</span>
              <span v-else-if="index == '2'" class="list-content-num list-num list-num-third">{{index + 1}}</span>
              <span v-else="index" class="list-content-num list-num">{{index + 1}}</span>

              <!--<router-link tag="a" target="_blank" :to="urlBank + item.companyName" ><span class="list-content-item">{{item.companyName}}</span></router-link>-->
              <a class="a-link" @click="jumpUrl(item.companyName)"><span class="list-content-item"
                                                                         style="text-align: left;">{{item.companyName}}</span></a>
              <span class="list-content-item">{{item.sentimentCount}}</span>
              <span v-if="item.changeIndex == null" class="list-content-item" style="width:71px;">--</span>
              <span v-else class="list-content-item" style="width:70px;">{{item.changeIndex}}%</span>

            </li>
          </ul>
          <div class="updateTime-box" style="text-align: right;padding: 5px 16px 0 0;font-size: 12px;color: #AEAEAE">
            更新于： {{$common.transTime(updateTime)[2]}}
          </div>
          <no-info v-show="noInfo"></no-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NoInfo from "../../../components/noInfo.vue";

  export default {
    name: "sentimentAsideRinking",
    components: {NoInfo},
    props: {
      industryComparisonInfo: {
        type: Array,
        default: false
      },
      updateTime: '',
      noInfo: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        urlBank: '/sentiment/sentimentSearch?inputSearchText='
      }
    },
    methods: {
      jumpUrl (name) {
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: name
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            let code = res.data.returnObject[0].code
            let name = res.data.returnObject[0].name
            let routeData = this.$router.resolve({
              path: "/sentiment/sentimentSearch",
              query: {
                inputSearchCode: code,
                inputSearchName: name
              }
            });
            window.open(routeData.href, '_blank');
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .company-card-nopadding {
    margin: 10px;
    padding: 10px 0 20px;
    border-radius: 8px;
    border: none;
    &:hover {
      -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
    }
    .company-card-header {
      padding: 0 16px 10px;
      overflow: hidden;
    }
    .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
  }
  .company-card-header .company-card-title {
    float: left;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 800;
    color: #323232;
  }
  .company-card-body .card-aside-list {
    li {
      overflow: hidden;
      padding: 9px 0;
      border-bottom: 1px solid #E3E3E3;
    }
    .aside-list-title {
      font-size: 14px;
      color: #323232;
    }
    .aside-list-subtitle {
      font-size: 12px;
      color: #8D8D8D;
    }
  }
  .company-card-nopadding .aside-list-header {
    background: #F8F8F8;
    padding: 12px 16px;
    font-size: 12px;
    color: #8D8D8D;
    .list-header-num {
      display: inline-block;
      width: 50px;
      /*padding-left: 7px;*/
    }
    .list-header-title {
      display: inline-block;
      width: 60px;
      text-align: right;
    }
  }
  .company-card-body .card-aside-ranking {
    height: 360px;
    li {
      font-size: 12px;
      height: 34px;
      line-height: 34px;
      color: #323232;
      padding-left: 5px;
      &:hover, &.active {
        background-color: #F8F8F8;
      }
      .a-link {
        display: inline-block;
        height: 100%;
      }
    }
  }
  .company-card-nopadding .company-card-body .card-aside-ranking {
    li {
      padding: 0 16px;
    }
    .list-content-num {
      display: inline-block;
      margin: 0 30px 0 0;
      text-align: center;
    }
    .list-content-item {
      display: inline-block;
      width: 60px;
      text-align: right;
      color: #323232;
    }
  }
  .company-card-body {
    .list-num {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 6px;
      border-radius: 50%;
      padding: 8px 7px;
    }
    .list-num-first {
      background-color: #FFB148;
      color: #fff;
    }
    .list-num-second {
      background-color: #9292A0;
      color: #fff;
    }
    .list-num-third {
      background-color: #E8A77C;
      color: #fff;
    }
  }
</style>
