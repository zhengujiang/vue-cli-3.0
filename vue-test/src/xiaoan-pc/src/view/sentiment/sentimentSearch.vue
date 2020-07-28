<template>
  <div id="sentimentSearch">
    <div id="company-header">
      <div class="content">
        <div class="company-title-only">
          <h2>舆情实时搜索</h2>
        </div>
      </div>
    </div>
    <div id="company-body">
      <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
      <div class="content">
        <div class="el-row">
          <!--搜索框-->
          <div class="el-col el-col-18">
            <div class="el-col el-col-24">
              <div class="el-card company-card" style="padding: 15px;">
                <div class="company-card-body">
                  <!-- 卡片搜索框-->
                  <div class="card-search-box">
                    <div class="search-content">
                      <div class="search-input-sm code">
                        <el-autocomplete :debounce="500" popper-class="auto-list"
                                         v-model="inputCodeText" :fetch-suggestions="querySearchAsync"
                                         :placeholder="autoNo[0]" :clearable="true">
                          <el-button slot="prepend" size="small" class="codeBtn">公司</el-button>
                          <el-dropdown slot="append" placement="bottom" class="codeBtn" @command="handleSelect">
                            <el-button type="primary">组合</el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item command="company">本公司</el-dropdown-item>
                              <el-dropdown-item command="attention">关注公司</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                          <template slot-scope="{item}">
                            <div style="width:300px;">
                              <span style="width:60px;display: inline-block"
                                    v-html="$common.highlight(inputCodeText,item.code)"></span>
                              <span v-html="$common.highlight(inputCodeText,item.name)"></span>
                            </div>
                          </template>
                        </el-autocomplete>

                      </div>
                      <div class="search-input-lg">
                        <a class="search-input-title search-input-title-left">全文</a>
                        <button class="search-input-btn" @click="getSearchCode()">
                          <i class="iconfont web-tripsousuo"></i>
                        </button>
                        <input class="search-input" type="text" :placeholder="autoNo[1]"
                               v-model="inputContentText" @keyup.enter.self="getSearchCode()">
                      </div>
                    </div>
                    <div class="search-keyword">
                      <span>市场关键词：</span>
                      <div v-for="(item,index) in keywordsInfo" :key="index" v-if="index < 10" class="keyword-item">
                        <span><a @click="searchKeyword(index)" style="cursor: pointer">{{item.word}}</a></span>
                        <i v-if="index != 9" class="keyword-split"></i>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--列表-->
            <div class="el-col el-col-24">
              <sentiment-list ref="childList" :listInfo="searchSentiment" :defaultCheckedKeys="defaultCheckedKeys"
                              :condition="condition" @openTimeAsis='openTimeAsis' :noInfo="searchSentimentNoInfo"
                              :page="pageSentiment" :sort="sortSentiment" v-if="pageSentiment && sortSentiment"
                              v-on:changePage="changeSentimentPage" v-on:changeSort="changeSentimentSort"
                              v-on:boxContent="getBoxContent" v-loading="searchSentimentLoading"
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
    <time-axis v-model="timeAsis" @close="closeTimeAsis" :dialogVisibleii="timeAsis"
               @resetSubscribe="resetTimeAsis"></time-axis>
  </div>
</template>

<script>
  import SentimentList from "./components/sentimentList";
  import SentimentBanner from "./components/sentimentBanner";
  import SentimentAsideList from "./components/sentimentAsideList";
  import SentimentAsideRinking from "./components/sentimentAsideRinking";
  import TimeAxis from "./components/timeAxis.vue";

  export default {
    components: {
      TimeAxis,
      SentimentAsideRinking,
      SentimentAsideList,
      SentimentBanner,
      SentimentList
    },
    name: "sentimentSearch",
    data() {
      return {
        boxContent: false,
        defaultCheckedKeys: [1],
        userId: "",
        userInfo: {},
        companyName: "",
        companyCode: "",
        timeAsis: {
          "dataInfo": [],
          "dataType": false
        },
        searchSentiment: [],
        searchSentimentNoInfo: false,
        searchSentimentLoading: false,
        searchCode: '',
        searchName: '',
        searchContent: '',
        searchUserId: '',
        isAttention: false,
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
        autoNo: ['证券代码/简称', '请输入舆情关键词，多关键词用空格隔开'], // 页面的文字抽出,
        inputCodeText: '',
        inputContentText: '',
        keywordsInfo: [],
        tendency: '',
        mediaType: '',
        startDate: '',
        endDate: '',
        stockName: '',
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

      this.userId = this.$cookie.get("userId");
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));

      if (this.userInfo.enterpriseUser) {
        this.companyCode = this.userInfo.enterpriseCompanyCode;
        this.companyName = this.userInfo.enterpriseCompanyName;
      } else {
        this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
      }
      // console.log('998', window.location.href)
      this.tendency = this.$route.query.tendency
      this.mediaType = this.$route.query.mediaType

      if (this.$route.query.inputKeyword) {
        this.searchContent = this.$route.query.inputKeyword;
        this.inputContentText = this.$route.query.inputKeyword;
      }

      this.searchName = this.$route.query.stockName;
      this.startDate = this.$route.query.startDate
      this.endDate = this.$route.query.endDate

      if (this.$route.query.inputSearchCode) {
        this.searchCode = this.$route.query.inputSearchCode;
        this.searchName = this.$route.query.inputSearchName;
        this.inputCodeText = this.$route.query.inputSearchCode + '/' + this.$route.query.inputSearchName;
      }

      this.condition.tendency = this.tendency;
      this.condition.mediaType = this.mediaType;
      this.condition.inputKeyword = this.inputContentText;
      this.condition.stockName = this.searchName;
      this.condition.startDate = this.startDate;
      this.condition.endDate = this.endDate;

      this.getKeywords();
      this.searchSentimentList();
      this.getAsideSentiment();
      this.getIndustryComparison();

    },
    mounted() {
    },
    watch: {
      pageSentiment: {
        handler() {
          this.searchSentimentList();
        },
        deep: true
      },
      sortSentiment: {
        handler() {
          this.searchSentimentList();
        },
        deep: true
      }
    },
    methods: {
      getBoxContent(content) {
        this.boxContent = content;
      },
      boxContClick() {
        this.$refs.childList.boxContClick();
      },
      openTimeAsis(res) {
        var _this = this;
        if (this.isAttention) {
          this.$axios.sentiment.companyNewsDir({
            title: res.data,
            companyId: res.code
          }).then(function (res) {
            if (res.data.returnMsg == "success") {
              _this.timeAsis.dataInfo = res.data.returnObject;
              _this.timeAsis.dataType = true;
            }
          }, function (response) {
          })
        } else {
          this.$axios.sentiment.newsDir({
            title: res.data
          }).then(function (res) {
            if (res.data.returnMsg == "success") {
              _this.timeAsis.dataInfo = res.data.returnObject;
              _this.timeAsis.dataType = true;
            }
          }, function (response) {
          })
        }

      },
      closeTimeAsis() {
        this.timeAsis = false;
      },
      resetTimeAsis() {
        this.timeAsis = false;
      },
      // 公司代码 autocomplete
      loadCode() {
        return new Promise((resolve, reject) => {
          this.$http({
            methods: 'GET',
            url: this.$api.affiche.autoCompleteA,
            params: {
              key: this.inputCodeText
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.autocompleteList = res.data.returnObject
              this.autocompleteList.forEach((item) => {
                item.value = item.code + '/' + item.name
              })
            } else {
              this.autocompleteList = []
            }
            resolve(null)
          })
        })
      },
      querySearchAsync(queryString, cb) {
        this.loadCode().then(() => {
          var autocompleteList = this.autocompleteList;
          cb(autocompleteList);
        })
      },
      handleSelect(command) {
        switch (command) {
          case 'company':
            this.inputCodeText = '本公司'
            break
          case 'attention':
            this.inputCodeText = '关注公司'
            break
        }
      },
      // 获取我关注的公司代码
      getMyAttentionCodes() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.stock.getMyAttentions,
            params: {
              userId: this.userId,
              pageNum: 1,
              pageSize: 1000
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
//                            resolve(res.data.returnObject.map(e => e.obj));
              var arr1 = [];
              var arr2 = [];
              for (var i = 0; i < res.data.returnObject.length; i++) {
                arr1.push(res.data.returnObject[i].obj)
                arr2.push(res.data.returnObject[i].zhongWenJianCheng)
              }

            }
            resolve({arr1, arr2})
          }).catch(reject);
        });
      },
      clickScreenData(dataObject) {
        console.log('clickScreenData', dataObject)
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

        this.searchSentimentList();
      },
      changeSentimentPage(page) {
        this.pageSentiment.flip = page;
      },
      changeSentimentSort(type, mode) {
        this.sortSentiment.sortType = type;
        this.sortSentiment.sortMode = mode;
      },
      getKeywords() {
        var _this = this;
        this.$axios.sentiment.hotWords({
          companyId: this.userInfo.companyId,
          type: 'industry',
          scope: 30
        }).then(function (res) {
          _this.keywordsInfo = res.data.returnObject;
        }, function (response) {
        })
      },
      searchKeyword(index) {
        var keyword = this.keywordsInfo[index].word;
        this.inputContentText = keyword;

        this.getSearchCode()
      },
      // 搜索条件
      getSearchCode() {
        let inputVal1 = this.inputCodeText
        let inputVal2 = this.inputContentText
        this.pageSentiment.flip = 1;

        if (inputVal1 == "") {
          this.searchCode = '';
          this.searchName = '';
          this.searchUserId = '';
          this.isAttention = false;
          if (inputVal2 == '') {
            this.searchContent = '';
          } else {
            this.searchContent = inputVal2.replace(/\s+|&nbsp;/ig, ',');
          }

          this.searchSentimentList();

        } else if (inputVal1 == '本公司') {
          this.searchCode = this.companyCode;
          this.searchName = this.companyName;
          this.searchUserId = '';
          this.isAttention = false;
          if (inputVal2 == '') {
            this.searchContent = '';
          } else {
            this.searchContent = inputVal2.replace(/\s+|&nbsp;/ig, ',');
          }

          this.searchSentimentList();

        } else if (inputVal1 == '关注公司') {
//                    this.getMyAttentionCodes().then(codes => {
//                        if (codes.arr1.length > 0) {
//
//                            this.searchCode = codes.arr1.join(',').replace(/[a-zA-Z]/g, '');
//                            this.searchName = codes.arr2.join(',');
//                            this.searchUserId = this.userId;
//                            this.isAttention = true;
//                            if (inputVal2 == '') {
//                                this.searchContent = '';
//                            } else {
//                                this.searchContent = inputVal2.replace(/\s+|&nbsp;/ig, ',');
//                            }
//                            this.searchSentimentList();
//                        } else {
//                            this.$confirm('尚未设置关注公司，是否立即设置?', '提示', {
//                                confirmButtonText: '确定',
//                                cancelButtonText: '取消',
//                                type: 'warning'
//                            }).then(() => {
//                                this.$router.push('/follow/companies')
//                            }).catch(() => {
//                                this.inputCodeText = '';
//                            })
//                        }
//                    }).catch(err => {
//                    })
          this.searchCode = '';
          this.searchName = '';
          this.searchUserId = this.userId;
          this.isAttention = true;

          this.searchSentimentList();

        } else if (inputVal1.indexOf('/')) {
          this.searchCode = inputVal1.substr(0, 6);
          this.searchName = inputVal1.substr(7);
          this.searchUserId = '';
          this.isAttention = false;

          if (inputVal2 == '') {
            this.searchContent = '';
          } else {
            this.searchContent = inputVal2.replace(/\s+|&nbsp;/ig, ',');
          }
          this.searchSentimentList();
        } else {
          this.searchCode = this.inputCodeText;
          if (inputVal2 == '') {
            this.searchContent = '';
          } else {
            this.searchContent = inputVal2.replace(/\s+|&nbsp;/ig, ',');
          }
          this.searchSentimentList();
        }

      },

      // 搜索公司舆情列表
      searchSentimentList() {
        var _this = this;
        var startDate = _this.startDate ? _this.startDate : '';
        var endDate = _this.endDate ? _this.endDate : '';
        var tendency = _this.tendency ? _this.tendency : '';
        if (this.condition.value == 2) {
          _this.mediaType = "手机新闻,网络新闻,报纸"
        }
        // console.log('code:' + _this.searchCode + ',name:' + _this.searchName + ',userId:' + _this.searchUserId + ',attention:' + _this.isAttention);
        _this.searchSentimentLoading = true;

        this.$axios.sentiment.sentimentSearch({
          stockCode: _this.searchCode,
          stockName: _this.searchName,
          startDate: startDate, // 开始时间
          endDate: endDate, // 结束时间
          tendency: tendency, // 情感色彩
          mediaType: _this.mediaType, // 来源类型
          pageNum: _this.pageSentiment.flip,
          pageSize: _this.pageSentiment.pageSize,
          sortField: _this.sortSentiment.sortType,
          sortOrder: _this.sortSentiment.sortMode,
          keyWord: _this.searchContent,
          userId: _this.searchUserId,
          isAttention: _this.isAttention

        }).then(function (res) {
          _this.searchSentimentLoading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.searchSentimentNoInfo = true;
              _this.searchSentiment = [];
            } else {
              var arr = res.data.returnObject;
              for (let i in arr) {
                arr[i].isDescribe = false
              }
              console.log('companyCode', res)
              // _this.searchSentiment = arr;
              _this.changeColor(arr)
              _this.searchSentimentNoInfo = false;
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
          // console.log('item', item)
          if (this.searchContent && this.searchContent.length > 0) {
            // alert(typeof this.newKeyword.split(','));
            this.searchContent.split(',').forEach(function (a) {
              // alert(new RegExp(a, 'ig'));
              resultsList[index].isDescribe = true
              if (!a.indexOf('*')) {
                a = '\\' + a;
              }

              if (a.substr(a.length - 1, 1) == '*') {
                a = a.substring(0, a.length - 1) + '\\*';
              }

              // 保存旧标题
              let oldHtml = item.title;
              // 要查询的字符串
              // let inpVal = a;
              // 获取新标题
              let texts = oldHtml;
              // 获取要查询的正则
              let allVal = oldHtml.match(new RegExp(a, 'ig'));
              // 当正则匹配的字符串存在时
              if (allVal) {
                for (var j = 0; j < allVal.length; j++) {
                  texts = texts.replace(allVal[j], '[*' + j + '*]');
                }
                for (var i = 0; i < allVal.length; i++) {
                  texts = texts.replace('[*' + i + '*]', '<span style="color: #FFB148">' + allVal[i] + '</span>');
                }

              }

              resultsList[index].title = texts;

              // 保存旧内容
              let oldHtmls = item.summary;
              // 要查询的字符串
              // let inpVals = a;
              // 获取新标题
              let textss = oldHtmls;
              // 获取要查询的正则
              let allVals = oldHtmls.match(new RegExp(a, 'ig'));
              // 当正则匹配的字符串存在时
              if (allVals) {
                for (var k = 0; k < allVals.length; k++) {
                  textss = textss.replace(allVals[k], '[*' + k + '*]');
                }
                for (var l = 0; l < allVals.length; l++) {
                  textss = textss.replace('[*' + l + '*]', '<span style="color: #FFB148">' + allVals[l] + '</span>');
                }

              }

              resultsList[index].summary = textss;

              // } else {
              //     var olda = a;
              //     a = a.substr(1, a.length - 1);

              //     // 保存旧标题
              //     let oldHtml = item.title;
              //     // 要查询的字符串
              //     let inpVal = a;
              //     // 获取新标题
              //     let texts = oldHtml;
              //     // 获取要查询的正则
              //     let allVal = oldHtml.match(new RegExp(inpVal, 'ig'));
              //     // 当正则匹配的字符串存在时
              //     if (allVal) {
              //         for (var m = 0; m < allVal.length; m++) {
              //             texts = texts.replace(allVal[m], '[*' + m + '*]');
              //         }
              //         for (var n = 0; n < allVal.length; n++) {
              //             texts = texts.replace('[*' + n + '*]', '<span style="color: #FFB148">' + allVal[n] + '</span>');
              //         }
              //     }

              //     resultsList[index].title = texts;

              //     // 保存旧内容
              //     let oldHtmls = item.summary;
              //     // 要查询的字符串
              //     let inpVals = a;
              //     // 获取新标题
              //     let textss = oldHtmls;
              //     // 获取要查询的正则
              //     let allVals = oldHtmls.match(new RegExp(inpVals, 'ig'));
              //     // 当正则匹配的字符串存在时
              //     if (allVals) {
              //         for (var o = 0; o < allVals.length; o++) {
              //             textss = textss.replace(allVals[o], '[*' + o + '*]');
              //         }
              //         for (var p = 0; p < allVals.length; p++) {
              //             textss = textss.replace('[*' + p + '*]', '<span style="color: #FFB148">' + allVals[p] + '</span>');
              //         }

              //     }

              //     resultsList[index].summary = textss;
              // }
              // // 匹配关键字正则
              // let replaceReg = new RegExp(a, 'ig');
              // // alert(replaceReg);
              // // 高亮替换v-html值
              // let replaceString = '<span style="color: #FFB148">' + a + '</span>'
              // resultsList[index].isDescribe = true
              // resultsList[index].title = item.title.replace(replaceReg, replaceString)
              // resultsList[index].summary = item.summary.replace(replaceReg, replaceString)
            })
          }
        })
        // console.log(resultsList);
        this.searchSentiment = resultsList;
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

            if (res.data.returnObject == null || res.data.returnObject == '') {
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

            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.industryComparisonNoInfo = true;
              _this.industryComparisonInfo = '';
            } else {
              // console.log(res.data.returnObject)
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
      a {
        color: #fff;
      }
      span:first-child {
        margin-right: 10px;
      }
      .company-btn {
        display: inline-block;
        width: 60px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        font-size: 14px;
        border-radius: 4px;
        background-color: #FFB148;
        border: 1px solid transparent;
        color: #fff;
        &.active {
          background-color: rgba(255, 177, 72, 0.2);
          border: 1px solid #FFB148;
          color: #FFB148;
        }
      }
    }
  }
  #company-body {
    padding: 10px 0;
    overflow: hidden;
    .el-row {
      margin: 0 -10px;
    }
    .company-card {
      margin: 10px;
      padding: 10px 15px 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.2);
      }
    }
    .company-card-nopadding {
      margin: 10px;
      padding: 10px 0 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.2);
      }
    }
    .company-card-nopadding .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
  }
  .card-search-box {
    .search-content {
      width: 100%;
      height: 40px;
      .search-input-sm {
        float: left;
        width: 220px;
        height: 40px;
        position: relative;
        margin-right: 18px;
      }
      .search-input-lg {
        float: left;
        width: 626px;
        height: 40px;
        position: relative;
      }
      .search-input-block {
        float: left;
        width: 100%;
        height: 40px;
        position: relative;
      }
      .search-input {
        position: absolute;
        left: 0;
        height: 40px;
        border: 1px solid #E3E3E3;
        border-radius: 2px;
        padding: 0 12px 0 57px;
      }
      .search-input-title {
        position: absolute;
        left: 0;
        width: 58px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #545454;
        background: #f5f7fa;
        border: 1px solid #E3E3E3;
        z-index: 99;
      }
      .search-input-btn {
        position: absolute;
        right: 0;
        width: 125px;
        height: 40px;
        background: #ffb148;
        border: 0;
        outline: none;
        font-size: 22px;
        border-radius: 0;
        color: #fff;
        padding: 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        z-index: 99;
      }
    }
    .search-input-sm .search-input {
      width: 220px;
      padding: 0 57px;
    }
    .search-input-lg .search-input, .search-input-block .search-input {
      width: 626px;
      padding: 0 12px 0 70px;
    }
    .search-input-title {
      &.search-input-title-left {
        left: 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &.search-input-title-right {
        left: 175px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    .search-keyword {
      width: 100%;
      height: 20px;
      margin-top: 8px;
      font-size: 12px;
      color: #8D8D8D;
      .keyword-item {
        display: inline-block;
        a {
          height: 20px;
          font-size: 12px;
          line-height: 20px;
          color: #8D8D8D;
        }
      }
      .keyword-split {
        display: inline-block;
        width: 1px;
        height: 12px;
        background: #AEAEAE;
        position: relative;
        top: 2px;
        margin: 0 15px 0 8px;
      }
    }
  }
  .el-input-group__append {
    padding: 0;
    /*line-height: 40px;*/
    color: #545454;
    .codeBtn {
      padding: 0 6px;
      /*height: 38px;*/
      /*line-height: 38px;*/
      text-align: center;
      color: #545454;
      font-size: 16px;
    }
    .el-button {
      padding: 0;
      height: 38px;
    }
  }
  .el-input-group__prepend {
    padding: 0;
    color: #545454;
    .codeBtn {
      padding: 0 8px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #545454;
      font-size: 16px;
    }
    .el-dropdown {
      color: #8d8d8d;
      font-size: 13px;
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

<style lang="scss">
  .el-autocomplete .el-input--suffix .el-input__inner {
    padding: 0 10px;
  }
  .auto-list {
    width: 170px !important;
  }
  .el-autocomplete-suggestion__wrap {
    max-height: 380px;
  }
</style>
