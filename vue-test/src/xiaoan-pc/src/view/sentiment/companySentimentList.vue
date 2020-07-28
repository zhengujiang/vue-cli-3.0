<template>
  <div id="companySentiment">
    <div id="company-header">
      <div class="content">
        <div class="company-title">
          <h2>公司舆情</h2>
          <p>{{companyName}}&nbsp;&nbsp;{{companyCode}}</p>

        </div>
        <div class="company-tools row2">
          <div class="company-tools-row">
            <span><a :href="overviewUrl" class="company-btn">概况</a></span>
            <span><a href="#" class="company-btn active">列表</a></span>
          </div>
          <div class="company-tools-row">

            <span><a href='#' @click="subscribeSettings = true"><i
              class="iconfont web-dingyueshezhi"></i>订阅设置</a></span>

            <span><a :href="reportUrl" target="_blank"><i class="iconfont web-shengchengbiaoge"></i>生成报告</a></span>
          </div>
        </div>
      </div>
    </div>

    <div id="company-body">
      <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
      <div class="content">
        <div class="el-row">
          <div class="el-col el-col-18">
            <!--舆情列表-->
            <div class="el-col el-col-24">
              <sentiment-list ref="childList" :listInfo="companySentiment" :mediaState="mediaState"
                              :condition="condition" @openTimeAsis='openTimeAsis' :noInfo="companySentimentNoInfo"
                              :page="pageSentiment" :sort="sortSentiment" v-if="pageSentiment && sortSentiment"
                              v-on:changePage="changeSentimentPage" v-on:changeSort="changeSentimentSort"
                              v-on:boxContent="getBoxContent" v-loading="sentimentLoading"
                              @clickScreenData='clickScreenData'>
              </sentiment-list>
            </div>
          </div>

          <!--右边栏-->
          <div class="el-col el-col-6">
            <!--广告-->
            <div class="el-col el-col-24">
              <sentiment-banner></sentiment-banner>
            </div>
            <!--公司舆情-->
            <div class="el-col el-col-24">
              <sentiment-aside-list :companyListInfo="asideSentimentInfo" :noInfo="asideSentimentNoInfo"
                                    v-loading="asideSentimentLoading"></sentiment-aside-list>
            </div>
            <!--同行业对比-->
            <div class="el-col el-col-24">
              <sentiment-aside-rinking :industryComparisonInfo="industryComparisonInfo"
                                       :noInfo="industryComparisonNoInfo" :updateTime="industryUpdateTime"
                                       v-loading="industryComparisonLoading"></sentiment-aside-rinking>
            </div>
          </div>
        </div>
      </div>
    </div>
    <subscribe v-model="subscribeSettings" @close="closeSubscribe" @resetSubscribe="resetSubscribes"></subscribe>
    <time-axis v-model="timeAsis" @close="closeTimeAsis" :dialogVisibleii="timeAsis"
               @resetSubscribe="resetTimeAsis"></time-axis>
  </div>
</template>

<script>
  import Subscribe from './components/subscribe.vue';
  import SentimentList from "./components/sentimentList.vue";
  import SentimentBanner from "./components/sentimentBanner.vue";
  import SentimentAsideList from "./components/sentimentAsideList.vue";
  import SentimentAsideRinking from "./components/sentimentAsideRinking.vue";
  import TimeAxis from "./components/timeAxis.vue";

  export default {
    components: {
      TimeAxis,
      SentimentAsideRinking,
      SentimentAsideList,
      SentimentBanner,
      SentimentList,
      Subscribe
    },
    name: "companySentimentList",
    data() {
      return {
        boxContent: false,
        userId: "",
        mediaState: false,
        userInfo: {},
        companyName: "",
        companyCode: "",
        timeAsis: {
          "dataInfo": '',
          "dataType": false
        },
        dialogVisible: false,
        subscribeSettings: false,
        overviewUrl: '/sentiment/companySentiment',
        listUrl: '/sentiment/companySentimentList',
        reportUrl: '/sentiment/sentimentMonitorReport',
        titleName: 'num',
        sentimentTools: '',
        companySentiment: [],
        companySentimentNoInfo: false,
        sentimentLoading: false,
        sortSentiment: {
          sortList: [
            {id: '0', name: '日期', type: 'date', mode: 'desc', isShow: true},
            {id: '1', name: '热度', type: 'heat', mode: '', isShow: true}
          ],
          sortType: '日期',
          sortMode: 'desc'
        },
        pageSentiment: {
          flip: 1,
          total: 50,
          pageSize: 30
        },
        tendency: '',
        mediaType: '',
        startDate: '',
        endDate: '',
        media: '',
        inputContentText: '',
        asideSentimentNoInfo: false,
        asideSentimentLoading: false,
        asideSentimentInfo: [],
        industryComparisonNoInfo: false,
        industryComparisonLoading: false,
        industryUpdateTime: '',
        industryComparisonInfo: [],
        condition: {
          "tendency": '',
          "mediaType": '',
          "inputKeyword": '',
          "media": '',
          "startDate": '',
          "endDate": '',
          "stockName": '',
          "value": 1
        }
      }

    },
    created() {
      var urli = window.location.href;
      var value = String(urli).split("?")[1];
      var valueType = typeof (value);
      if (valueType == 'undefined') {
        this.condition.value = 2
      }
      this.tendency = this.$route.query.tendency;
      this.mediaType = this.$route.query.mediaType;
      this.inputContentText = this.$route.query.inputKeyword;
      this.media = this.$route.query.media;
      this.startDate = this.$route.query.startDate;
      this.endDate = this.$route.query.endDate;

      this.condition.tendency = this.tendency;
      this.condition.mediaType = this.mediaType;
      this.condition.inputKeyword = this.inputContentText;
      this.condition.media = this.media;
      this.condition.startDate = this.startDate;
      this.condition.endDate = this.endDate;

      this.userId = this.$cookie.get("userId");
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      if (this.userInfo.enterpriseUser) {
        this.companyCode = this.userInfo.enterpriseCompanyCode;
        this.companyName = this.userInfo.enterpriseCompanyName;
      } else {
        this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
      }
      console.log('this.condition', this.condition)
      this.getSentimentList();
      this.getAsideSentiment();
      this.getIndustryComparison();
    },
    watch: {
      pageSentiment: {
        handler() {
          this.getSentimentList();
        },
        deep: true
      },
      sortSentiment: {
        handler() {
          this.getSentimentList();
        },
        deep: true
      }
    },
    methods: {
      openTimeAsis(res) {
        console.log('openTimeAsis', res)
        var _this = this;
//                this.$http.get('http://dev.in-hope.com.cn/zuul/companySentiment/companyNewsDir', {
//                    params:{
//                        title: data,
//                        code: _this.companyCode
//                    }
        this.$axios.sentiment.newsDir({
          title: res.data
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
      clickScreenData(dataObject) {
        console.log('dataObject', dataObject);
        if (dataObject.all == 1) {
          this.startDate = '';
          this.endDate = '';
          this.tendency = '';
          this.mediaType = '';
          this.searchContent = '';
          this.inputContentText = '';
          this.searchName = '';
        } else {
          this.startDate = dataObject.startDate ? dataObject.startDate : '';
          this.endDate = dataObject.endDate ? dataObject.endDate : '';
          this.tendency = dataObject.feeling ? dataObject.feeling : '';
          this.mediaType = dataObject.source ? dataObject.source : '';
        }
        this.pageSentiment.flip = 1;
        this.getSentimentList();
      },
      changeSentimentPage(page) {
        this.pageSentiment.flip = page;
      },
      changeSentimentSort(type, mode) {
        this.sortSentiment.sortType = type;
        this.sortSentiment.sortMode = mode;
      },
      closeSubscribe() {
        this.subscribeSettings = false;
      },
      resetSubscribes() {
        this.subscribeSettings = false;
      },

      // 获取公司舆情列表
      getSentimentList() {
        var _this = this;
        if (this.condition.value == 2) {
          _this.mediaType = "手机新闻,网络新闻,报纸"
        }
        _this.sentimentLoading = true;
        this.$axios.sentiment.listCompanySentiment({
          stockCode: _this.companyCode, // 股票代码
          startDate: _this.startDate, // 开始时间
          endDate: _this.endDate, // 结束时间
          tendency: _this.tendency, // 情感色彩
          mediaType: _this.mediaType, // 来源类型
          pageNum: _this.pageSentiment.flip,
          pageSize: _this.pageSentiment.pageSize,
          sortField: _this.sortSentiment.sortType,
          sortOrder: _this.sortSentiment.sortMode,
          keyWord: _this.inputContentText,
          media: _this.media
        }).then(function (res) {
          _this.sentimentLoading = false;
          console.log('111', res)
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {

            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.companySentimentNoInfo = true;
              _this.companySentiment = [];
            } else {
              var arr = res.data.returnObject;
              for (let i in arr) {
                arr[i].isDescribe = false
              }
//                            _this.companySentiment = arr;
              _this.changeColor(arr)
              _this.companySentimentNoInfo = false;
              _this.pageSentiment.total = Math.ceil(res.data.total / _this.pageSentiment.pageSize);
            }

          } else if (res.data.returnCode == 500) {
            _this.$message('Request failed with status code 500');
          }

        }, function (response) {
        })
      },
      changeColor(resultsList) {
        resultsList.map((item, index) => {
          if (this.inputContentText && this.inputContentText.length > 0) {
            this.inputContentText.split(',').forEach(function (a) {
              // 匹配关键字正则
              let replaceReg = new RegExp(a, 'g')
              // 高亮替换v-html值
              let replaceString = '<span style="color: #FFB148">' + a + '</span>'
              resultsList[index].isDescribe = true
              resultsList[index].title = item.title.replace(replaceReg, replaceString)
              resultsList[index].summary = item.summary.replace(replaceReg, replaceString)
            })
          }
          if (this.media && this.media.length > 0) {
            this.mediaState = true;
            resultsList[index].isDescribe = true
          }
        })
        this.companySentiment = resultsList;
      },
      // 获取公司舆情信息
      getAsideSentiment() {
        var _this = this;
        _this.asideSentimentLoading = true;
        this.$axios.sentiment.listCompanySentimentTop10({
          companyId: this.userInfo.companyId
        }).then(function (res) {
          _this.asideSentimentLoading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {

            if (res.data.returnObject == null) {
              _this.asideSentimentNoInfo = true;
              _this.asideSentimentInfo = '';
            } else {
              _this.asideSentimentNoInfo = false;
              _this.asideSentimentInfo = res.data.returnObject;
            }
          } else if (res.data.returnCode == 500) {
            _this.$message('Request failed with status code 500');
          }
        }, function (response) {
        })
      },
      // 获取可比公司信息
      getIndustryComparison() {
        var _this = this;
        _this.industryComparisonLoading = true;
        this.$axios.sentiment.listComparisonWithIndustry({
          companyId: this.userInfo.companyId
        }).then(function (res) {
          _this.industryComparisonLoading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {

            if (res.data.returnObject == null) {
              _this.industryComparisonNoInfo = true;
              _this.industryComparisonInfo = '';
            } else {
              _this.industryUpdateTime = res.data.returnObject.updateTime;
              _this.industryComparisonNoInfo = false;
              _this.industryComparisonInfo = res.data.returnObject.data;
            }
          } else if (res.data.returnCode == 500) {
            _this.$message('Request failed with status code 500');
          }

        }, function (response) {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-dingyueshezhi {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    background: url(../../assets/image/sentiment/icon/icon-dingyueshezhi.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-shengchengbiaoge {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    background: url(../../assets/image/sentiment/icon/icon-shengchengbiaoge.svg) no-repeat center;
    background-size: 100%;
  }
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
    .company-tools {
      display: table-cell;
      vertical-align: middle;
      text-align: right;
      float: right;
      &.row1 {
        height: 26px;
        margin: 62px 0;
      }
      &.row2 {
        height: 50px;
        margin: 50px 0;
      }
      .company-tools-row {
        height: 24px;
        margin-bottom: 5px;
      }
      a {
        color: #fff;
      }
      span:first-child {
        margin-right: 10px;
      }
      .iconfont {
        margin-right: 6px;
      }
    }
  }
  #company-body {
    padding: 10px 0;
    overflow: hidden;
    .el-row {
      margin: 0 -10px;
    }
  }
  .company-btn {
    display: inline-block;
    width: 60px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    font-size: 14px;
    border-radius: 4px;
    background-color: rgba(255, 177, 72, 0.2);
    border: 1px solid #FFB148;
    color: #FFB148;

    &.active {
      background-color: #FFB148;
      border: 1px solid transparent;
      color: #fff;
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
