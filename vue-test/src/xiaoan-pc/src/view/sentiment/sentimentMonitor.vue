<template>
  <div id="sentimentMonitor">
    <div id="company-header">
      <div class="content">
        <div class="company-title-only">
          <h2>自定义舆情监控方案</h2>
        </div>
      </div>
    </div>

    <div id="company-body">
      <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
      <div class="content">
        <div class="el-row">
          <!--自定义左边栏方案列表-->
          <el-col :span="6">
            <sentiment-aside-plan @getsentimentListDatas="getSentimentData" @deletesentimeListData="deleteSentimentData"
                                  @addCustom="addSentimentCustom" :roundString="roundString"
                                  :plansIndexId="plansIndexId" :defaultStyle="defaultStyle"></sentiment-aside-plan>
          </el-col>
          <el-col :span="18">
            <!--右侧新建-->
            <sentiment-monitor-custom v-if='sentimentCustom' @resetCustom='resetCustom'
                                      @saveCustom='saveCustom'></sentiment-monitor-custom>
            <!--右侧编辑-->
            <sentiment-monitor-update-custom v-if='updataSentimentCustom' :updateMonitorData='updateSentiment'
                                             @resetUpdataCustom='resetUpdataCustom'
                                             @saveUpdateCustom='saveUpdateCustom'></sentiment-monitor-update-custom>
            <!--右侧列表/搜索-->
            <get-sentiment-list-data-monitor ref="childList" v-if='sentimentList' v-on:boxContent="getBoxContent"
                                             @openTimeAsis='openTimeAsis' :getSentimentListData="getData"
                                             :deletesentimeAsidePlanId="deletePlanId" :roundString="roundString"
                                             @updateSentimentData="updateSentimentData"
                                             @addCustomPlans='addCustomPlans'
                                             :sentimentIsUrl="sentimentIsUrl"></get-sentiment-list-data-monitor>
          </el-col>
        </div>
      </div>
    </div>
    <time-axis v-model="timeAsis" @close="closeTimeAsis" :dialogVisibleii="timeAsis"
               @resetSubscribe="resetTimeAsis"></time-axis>
  </div>
</template>

<script>
  // 左边栏方案列表
  import SentimentAsidePlan from "./components/sentimentAsidePlan";
  // 右侧新建
  import sentimentMonitorCustom from "./sentimentMonitorCustom";
  // 右侧编辑
  import sentimentMonitorUpdateCustom from "./sentimentMonitorUpdateCustom";
  // 右侧列表/搜索
  import GetSentimentListDataMonitor from "./components/getSentimentListDataMonitor";

  import TimeAxis from "./components/timeAxis.vue";

  export default {
    name: "sentimentMonitor",
    components: {
      TimeAxis,
      SentimentAsidePlan,
      sentimentMonitorCustom,
      sentimentMonitorUpdateCustom,
      GetSentimentListDataMonitor

    },
    data() {
      return {
        boxContent: false,
        // 右侧新建默认不显示
        sentimentCustom: false,
        // 编辑方案默认不显示
        updataSentimentCustom: false,
        // 右侧列表/搜索
        sentimentList: true,
        // 随机字符串
        roundString: '',
        // 默认的样式
        defaultStyle: '',
        // 获取一个方案ID
        plansIndexId: '',
        // 编辑时获取的数据
        updateSentiment: '',
        deletePlanId: '',
        timeAsis: {
          "dataInfo": [],
          "dataType": false
        },
        getData: {},
        // 获取通过url地址传过来的参数
        sentimentIsUrl: ''
      }
    },
    mounted() {
      this.menu();
    },
    created() {
      // this.sentimentPlanIds = this.$route.query.SentimentPlanId ? this.$route.query.SentimentPlanId : 0;
      // this.getData = this.$route.query.z ? this.$route.query.z : {};
    },
    methods: {
      openTimeAsis(data) {
        var _this = this;
//                this.$http.get('http://dev.in-hope.com.cn/zuul/companySentiment/newsDir', {
//                    params:{
//                        title: data
//                    }
        this.$axios.sentiment.newsDir({
          title: data
        }).then(function (res) {
          if (res.data.returnMsg == "success") {
            _this.timeAsis.dataInfo = res.data.returnObject;
            _this.timeAsis.dataType = true;
          }
        }, function (response) {
        })
      },
      getBoxContent(content) {
        this.boxContent = content;
      },
      boxContClick() {
        this.$refs.childList.boxContClick();
      },
      closeTimeAsis() {
        this.timeAsis = false;
      },
      resetTimeAsis() {
        this.timeAsis = false;
      },
      menu() {
        window.scrollTo(0, 0);
      },
      // 新增一个自定义方案
      addSentimentCustom() {
        this.updataSentimentCustom = false;
        this.sentimentCustom = true;
        this.sentimentList = false;
        if (this.$route.query.SentimentPlanId) {
          this.sentimentIsUrl = 1;
        } else {
          this.sentimentIsUrl = 0;
        }
        // 传递一个随机字符串
        // this.roundString = Math.random();
      },
      // 保存一个自定义方案
      saveCustom() {
        this.isShowAssembly();
        // 传递一个随机字符串
        this.defaultStyle = Math.random();
      },
      // 新增取消自定义方案
      resetCustom() {
        this.isShowAssembly();
        this.menu();
      },
      // 编辑取消自定义方案
      resetUpdataCustom(val) {
        this.updataSentimentCustom = false;
        this.sentimentCustom = false;
        this.sentimentList = true;
        this.getData = val;
        this.menu();
      },
      // 保存编辑自定义方案
      saveUpdateCustom(val) {
        this.updataSentimentCustom = false;
        this.sentimentCustom = false;
        this.sentimentList = true;
        this.getData = val;
        this.menu();
        // 传递一个随机字符串
        this.roundString = Math.random();
      },
      // 获取一个自定义方案
      getSentimentData(data, index) {
        this.updataSentimentCustom = false;
        this.sentimentCustom = false;
        this.sentimentList = true;
        this.getData = data;
        this.roundString = Math.random();
        this.plansIndexId = index;
      },
      // 删除一个自定义方案
      deleteSentimentData(deleteId) {
        this.menu();
        this.getData = {};
        this.deletePlanId = deleteId;
        this.updataSentimentCustom = false;
        this.sentimentCustom = false;
        this.sentimentList = true;
        if (this.$route.query.SentimentPlanId) {
          this.sentimentIsUrl = 1;
        } else {
          this.sentimentIsUrl = 0;
        }

        // 传递一个随机字符串
        // this.roundString = Math.random();

      },
      // 编辑一个自定义方案
      updateSentimentData(dataObject) {
        this.updataSentimentCustom = true;
        this.sentimentCustom = false;
        this.sentimentList = false;
        this.updateSentiment = dataObject;
        // 传递一个随机字符串
        // this.roundString = Math.random();
      },
      // 自定义显示组件
      isShowAssembly() {
        this.updataSentimentCustom = false;
        this.sentimentCustom = false;
        this.sentimentList = true;
        this.menu();
        // 传递一个随机字符串
        this.roundString = Math.random();
      },
      // 在右侧数据列表中添加一个自定义方按
      addCustomPlans() {
        this.addSentimentCustom();
      }
    }
  }
</script>

<style lang="scss" scoped>
  #company-header {
    background: url(../../assets/image/sentiment/company-slogan@2x.png) no-repeat center;
    width: 100%;
    height: 150px;
    color: #fff;
    font-size: 16px;
    background-size: 100% 100%;
    .company-title {
      display: table-cell;
      vertical-align: middle;
      float: left;
      height: 64px;
      margin: 43px 0;
      h2 {
        margin: 0;
        font-size: 30px;
        line-height: 42px;
      }
    }
    .company-title-only {
      display: table-cell;
      vertical-align: middle;
      float: left;
      height: 42px;
      margin: 54px 0;
      h2 {
        margin: 0;
        font-size: 30px;
        line-height: 42px;
      }
    }
    .company-title p {
      margin: 0;
      font-size: 16px;
      line-height: 22px;
    }
  }
  .contentShadow {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0);
  }
</style>
