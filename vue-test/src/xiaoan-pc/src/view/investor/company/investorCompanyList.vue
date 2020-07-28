<template>
  <div id="investorCompanyListItem" v-loading="loading">
    <!---->
    <div class="search-all-global">
      <ul class="search-tabs">
        <li class="row input">
          <!--<transition name="zoomUp">-->
          <el-autocomplete v-if="!showPanel" popper-class="my-autocomplete" v-model="inputText"
                           :fetch-suggestions="querySearch" :trigger-on-focus="false" @keyup.13.native="submitSearch"
                           placeholder="请输入内容" @select="handleSelect" size="medium">
            <template slot-scope="{item}">
              <div class="name" v-html="item.value"></div>
            </template>
            <template slot="append">
              <el-button type="primary" icon="el-icon-search" @click="submitSearch"></el-button>
            </template>
          </el-autocomplete>
          <!--</transition>-->
          <!--</el-collapse-transition>-->
          <!--<el-collapse-transition>-->
          <div class="seniorPanel-all" v-if="showPanel">
            <!--  日期控件 -->
            <div class="senior-row seniorDate seniorPanel">
              <div class="start">
                <label>自</label>
                <el-date-picker value-format="yyyy-MM-dd" v-model="startDate" type="date" placeholder="选择日期"
                                :editable="false" :clearable="true"
                                :picker-options="pickerOptions1"></el-date-picker>
              </div>
              <div class="end">
                <label>到</label>
                <el-date-picker value-format="yyyy-MM-dd" v-model="endDate" type="date" placeholder="选择日期"
                                :editable="false" :picker-options="pickerOptions2"></el-date-picker>
              </div>
            </div>
            <!-- 高级搜索panel -->
            <div class="senior-row seniorTitle" v-show="showPanel">
              <div class="mustTitle">
                <el-input v-model="inputText" placeholder="必含，多关键词空格隔开"
                          @keyup.enter.native="searchMethod">
                  <template slot="prepend">问题</template>
                </el-input>
              </div>
              <div class="mustTitle">
                <el-input v-model="titleMaybeIncludes" placeholder="可含，多关键词空格隔开"
                          @keyup.enter.native="searchMethod">
                  <template slot="prepend">问题</template>
                </el-input>
              </div>
              <div class="mustTitle last">
                <el-input v-model="titleExcludes" placeholder="不含，多关键词空格隔开"
                          @keyup.enter.native="searchMethod">
                  <template slot="prepend">问题</template>
                </el-input>
              </div>
            </div>
            <!---->
            <div class="senior-row seniorContent">
              <div class="mustTitle">
                <el-input v-model="contentIncludes" placeholder="必含，多关键词空格隔开"
                          @keyup.enter.native="searchMethod">
                  <template slot="prepend">全文</template>
                </el-input><!--fullTextIncludes-->
              </div>
              <div class="mustTitle">
                <el-input v-model="contentMaybeIncludes" placeholder="可含，多关键词空格隔开"
                          @keyup.enter.native="searchMethod">
                  <template slot="prepend">全文</template>
                </el-input>
              </div>
              <div class="mustTitle last">
                <el-input v-model="contentExcludes" placeholder="不含，多关键词空格隔开"
                          @keyup.enter.native="searchMethod">
                  <template slot="prepend">全文</template>
                </el-input>
              </div>
            </div>
            <!---->
            <div class="senior-row senior-last senior-search">
              <el-button type="primary" icon="el-icon-search" @click="submitSearch"
                         @keyup.13.native="submitSearch"></el-button>
            </div>
          </div>
          <!--</el-collapse-transition>-->
        </li>
        <li class="row senior">
          <div>
            <el-button type="primary" class="seniorButton" @click="seniorMethod">
              <span style="font-weight: normal">{{showPanel ? '默认' : '高级'}}</span>
              <i class="iconfont web-sanjiaoxing searchSanjiao"></i>
            </el-button>
          </div>
          <!---->
          <div class="senior-reset" v-show="showPanel">
            <el-button class="seniorResetBtn" @click="resetSenior">
              <span style="font-weight: normal">重置</span>
              <i class="iconfont web-huanyipi2" style="font-weight: 600"></i>
            </el-button>
          </div>
        </li>
      </ul>
    </div>
    <!---->
    <el-tabs class="list-tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="all">
        <template slot="label">
          <el-badge :value="0" :max="99" :hidden="true" class="item">全部</el-badge>
        </template>
        <!----------------->
        <div class="no-list-all" v-if="listInfo.length == 0">
          <v-noInfo></v-noInfo>
        </div>
        <div class="no-list-all" v-loading="loading" v-else>
          <v-list :data="listInfo"></v-list>
          <div class="foot-pagination">
            <el-pagination class="pagination-white" @current-change="currentChange" :current-page="page.index"
                           :page-size="page.size" layout="prev, pager, next" :page-count="page.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <template slot="label">
          <el-badge :value="0" :max="99" :hidden="true" class="item">已回答</el-badge>
        </template>
        <!----------------->
        <div class="no-list-all" v-if="listInfo.length == 0">
          <v-noInfo></v-noInfo>
        </div>
        <div class="no-list-all" v-loading="loading" v-else>
          <v-list :data="listInfo"></v-list>
          <div class="foot-pagination">
            <el-pagination class="pagination-white" @current-change="currentChange" :current-page="page.index"
                           :page-size="page.size" layout="prev, pager, next" :page-count="page.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="third">
        <template slot="label">
          <el-badge :value="totalCount" :max="99" :hidden="!totalCount>0" class="item">未回答</el-badge>
        </template>
        <!----------------->
        <div class="no-list-all" v-if="listInfo.length == 0">
          <v-noInfo></v-noInfo>
        </div>
        <div class="no-list-all" v-loading="loading" v-else>
          <v-list :data="listInfo"></v-list>
          <div class="foot-pagination">
            <el-pagination class="pagination-white" @current-change="currentChange" :current-page="page.index"
                           :page-size="page.size" layout="prev, pager, next" :page-count="page.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import VList from '../components/list'
  export default {
    name: "investorCompanyListItem",
    components: {VList},
    data() {
      return {
        state3: '',
        restaurants: [],
        companyCode: '',
        totalCount: '',
        //
        loading: true,
        hideAfter: 500,  // hover 筛选框的预提示
        autoNo: ['换一个关键词吧！', '高级', '请输入法规关键词，多关键词用空格隔开，如：股东 减持', '重置', '确认', '从', '到', '搜索筛选条件'], // 页面的文字抽出
        showPanel: '', // isShow panel
        prestrain: [], // autoComplete的数据
        inputText: '', // user inpput affiche text
        titleIncludes: '', // 标题包含
        titleExcludes: '', // 标题不包含
        titleMaybeIncludes: '', // 标题可能包含
        contentIncludes: '', // 全文包含
        contentExcludes: '', // 全文不包含
        contentMaybeIncludes: '', // 全文可能包含
        fullTextIncludes: '', // 正文包含
        fullTextExcludes: '', // 正文不包含
        fullTextMaybeIncludes: '', // 正文可能包含
        startDate: '',  // 发布日期（起）
        endDate: '',  // 发布日期（至）
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          }, {
            text: '一月前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }]
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          }, {
            text: '一月前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }]
        },
        /**/
        tableData: [
          {
            id: '0',
            code: '600119',
            full: 'SZ',
            companyName: '长江投资',
            number: 100
          }
        ],
        activeName: 'all',
        check: false,
        page: {
          index: 1,
          size: 10,
          total: 100
        },
        isAnswer: '',
        listInfo: []
      }
    },
    watch: {
      check(val) {
        this.checkChange(val);
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      // this.companyCode = this.userInfo.enterpriseCompanyCode;
      if (this.userInfo.enterpriseUser) {
        this.companyCode = this.userInfo.enterpriseCompanyCode;
      } else {
        if (this.$route.query.companyCode) {
          this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
        }
      }
      this.stateful();
      //
    },
    mounted() {
      this.restaurants = [];
    },
    methods: {
      // /  * 保存状态 */
      stateful() {
        this.titleIncludes = (this.$route.query.mustTitle == undefined || this.$route.query.mustTitle == '') ? '' : this.$common.transComma(this.$route.query.mustTitle)
        this.inputText = decodeURI(this.titleIncludes);
        this.handlerSearchList()
      },
      //
      submitSearch() {
        this.page.index = 1;
        this.handlerSearchList();
      },
      //
      checkChange(val) {
        console.log(val);
        let query = {};
        if (val) {
          // true
          query = Object.assign({}, this.$route.query, {check: 'overview'});
        } else {
          // false list
          query = Object.assign({}, this.$route.query, {check: 'list'});
        }
        this.$router.replace({query: query});
      },
      //
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      //
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //
      isNumberSearch() {
        let isAnswer = 'false';
        this.$http({
          methods: 'GET',
          url: this.$api.investor.search,
          params: {
            isAnswer: isAnswer, // 是否回答
            companyCode: this.companyCode, // code
            pageNum: 1, // 页数
            pageSize: 10 // 每页条数
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            console.log(typeof isAnswer, '23423', isAnswer)
            this.totalCount = res.data.returnObject.count;
          }
        }).catch((err) => {

        })
      },
      //
      handlerSearchList() {
        this.loading = true;
        //
        this.isNumberSearch();
        this.inputText = this.inputText ? this.inputText : ''
        this.inputCode = this.inputCode ? this.inputCode : ''
        this.startDate = this.startDate ? this.startDate : ''
        this.endDate = this.endDate ? this.endDate : ''
        var dateStart = this.startDate, dateEnd = this.endDate;
        if (dateStart !== '') {
          dateStart = new Date(dateStart + ' 00:00:00').getTime()
        }
        if (dateEnd !== '') {
          dateEnd = new Date(dateEnd + ' 00:00:00').getTime()
        }
        //
        let isAnswer = '';
        switch (this.activeName) {
          case 'all':
            isAnswer = '';
            break;
          case 'second':
            isAnswer = 'true';
            break;
          case 'third':
            isAnswer = 'false';
            break;
        }
        // //
        // //
        this.$http({
          methods: 'GET',
          url: this.$api.investor.search,
          params: {
            mustTitle: this.$common.transStr(this.inputText), // this.titleIncludes,
            possibleTitle: this.$common.transStr(this.titleMaybeIncludes),
            exceptTitle: this.$common.transStr(this.titleExcludes),
            mustContent: this.$common.transStr(this.contentIncludes),
            possibleContent: this.$common.transStr(this.contentMaybeIncludes),
            exceptContent: this.$common.transStr(this.contentExcludes),
            questionTimeStart: dateStart,
            questionTimeEnd: dateEnd,
            isAnswer: isAnswer, // 是否回答
            // marketType: this.companyData, // 板块
            companyCode: this.companyCode, // code
            pageNum: this.page.index, // 页数
            pageSize: this.page.size // 每页条数
          }
        }).then((res) => {
          setTimeout(() => {
            this.loading = false
          }, 300)
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            console.log(typeof isAnswer, '23423', isAnswer)
            this.page.total = Math.ceil(res.data.returnObject.count / this.page.size)
            // total数量超过1000条 控制显示
            if (this.page.total > 1000) {
              this.page.total = 1000
            }
            // 没有搜索结果
            if (this.page.total == 0) {
              this.listInfo = []
            } else {
              var arrList = res.data.returnObject.list;
              this.listInfo = []
              var reg = /\s/g
              var content = '';
              arrList.forEach((item, i) => {
                if (item.answer) {
                  content = item.answer.replace(reg, '')
                }
                //
                var strs = '', obj = {}, link = '', img = '';
                let highColorTitle = this.inputText + ' ' + this.titleMaybeIncludes + ' ' + this.contentIncludes + ' ' + this.contentMaybeIncludes
                let highColorContent = this.contentIncludes + ' ' + this.contentMaybeIncludes
                if (this.$common.browserSort() != 'Chrome') {
                  // 兼容 非chrome浏览器 只显示2行
                  strs = this.$common.key(highColorContent, content)
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                } else {
                  strs = this.$common.key(highColorContent, content)
                }
                link = '/investor/answer?id=' + item.id;
                img = 'http://oss.in-hope.cn/enterpriseApply/cd27274ef95c489687413e81fb1d51b2.png'
                obj = {
                  id: item.id,
                  userName: item.userName,
                  userImage: item.userImage,
                  companyName: item.companyName,
                  companyCode: item.companyCode,
                  question: this.$common.key(highColorTitle, item.question),
                  questionTime: item.questionTime,
                  questionSource: item.questionSource,
                  answer: strs,
                  answerTime: item.answerTime,
                  answerSource: item.answerSource,
                  marketType: item.marketType,
                  industry: item.industry,
                  userId: item.userId,
                  isIndex: item.isIndex,
                  isAnswer: item.isAnswer,
                  link: link,
                  img: img
                };
                this.listInfo.push(obj)
              })
            }
          } else {
            this.listInfo = [];
          }
        }).catch((err) => {
          setTimeout(() => {
            this.listInfo = [];
            this.loading = false;
          }, 3000)
          this.$message({
            showClose: true,
            type: 'error',
            duration: 3000,
            message: err.message
          })
        })
      },
      //
      handleSelect(item) {
        console.log(item);
      },
      //
      currentChange(index) {
        this.$common.returnTop();
        this.page.index = index;
        this.handlerSearchList();
      },
      //
      handleClick(val) {
        let querys = Object.assign({}, this.$route.query, '');
        this.$router.push({path: '', query: querys});
        console.log(this.activeName);
        this.page.index = 1;
        this.handlerSearchList();
      },
      // autocomplete rules click
      selectText(i) {
        this.inputText = this.prestrain[i].title
        var tit = document.getElementsByClassName('ele-popover')[0]
        tit.style.display = 'none'
        // this.submitAll()
      },
      // input 聚焦执行方法
      inputFocus() {
        // this.boxContClick()
        // this.autoComplete()
        var tit = document.getElementsByClassName('ele-popover')
        console.log('inputFocus = ', this.prestrain, this.prestrain.length)
        if (this.prestrain.length == 0) {
          tit[0].style.zIndex = '-10'
        } else {
          tit[0].style.zIndex = '2000'
        }
      },
      // 打开高级搜索
      seniorMethod() {
        this.showPanel ? this.showPanel = false : this.showPanel = true
        // this.boxContClick()
      },
      //
      resetSenior() {
        this.inputText = '' // user inpput affiche text
        this.titleIncludes = '' // 标题包含
        this.titleExcludes = '' // 标题不包含
        this.titleMaybeIncludes = '' // 标题可能包含
        this.contentIncludes = '' // 全文包含
        this.contentExcludes = '' // 全文不包含
        this.contentMaybeIncludes = '' // 全文可能包含
        this.fullTextIncludes = '' // 正文包含
        this.fullTextExcludes = '' // 正文不包含
        this.fullTextMaybeIncludes = '' // 正文可能包含
        this.startDate = ''  // 发布日期（起）
        this.endDate = ''  // 发布日期（至）
      },
      //
      searchMethod() {
        this.startDate = this.startDate ? this.startDate : ''
        this.endDate = this.endDate ? this.endDate : ''
        // 增加关键词判断
        if (this.titleIncludes.length == 1 || this.titleExcludes.length == 1 || this.titleMaybeIncludes.length == 1 || this.inputText.length == 1 || this.fullTextMaybeIncludes.length == 1 || this.fullTextExcludes.length == 1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'})
        } else {
          this.flip = 1
          this.sortType = ''
          this.submitAll()
        }
      }
    }
  }
</script>

<style lang="scss">
  #investorCompanyListItem {
    .search-all-global {
      .search-tabs {
        display: flex;
        padding: 15px 0;
        .row {
          flex: 1;
          &.senior {
            flex: inherit;
            margin-left: 16px;
            .senior-reset {
              margin-top: 10px;
              .seniorResetBtn {
                color: #ffb148;
                font-size: 16px;
                font-weight: bold;
                margin: 0 !important;
                cursor: pointer;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                padding: 0;
                background: 0;
                border: 0;
              }
            }
            .el-button {
              width: 100px;
              height: 35px;
              padding: 0;
              line-height: 35px;
              background: #f6debd;
              color: #ffb148;
              font-size: 16px;
            }
          }
          &.input {
            .el-autocomplete {
              width: 100%;
              .el-input {
                height: 35px;
                border: #ffb148;
                input {
                  height: 100%;
                  width: 100%;
                  border-color: #ffb148;
                }
              }
              .el-input-group__append {
                width: 100px;
                height: 35px;
                padding: 0;
                text-align: center;
                background-color: #ffb148;
                border: #ffb148;
                color: #fff;
                .el-button {
                  width: 100%;
                  padding: 10px 0;
                  .el-icon-search {
                    font-size: 18px;
                  }
                }
              }
            }
            /**/
            /**/
            .seniorPanel-all {
              display: flex;
              width: 100%;
              transition: all .3s;
              .senior-row {
                flex: 1;
                margin-right: 16px;
                &.seniorDate {
                  flex: 0 0 21%;
                }
                &.senior-search {
                  flex: 0 0 100px;
                  height: 35px;
                  .el-button {
                    width: 100%;
                    padding: 0;
                    text-align: center;
                    background-color: #ffb148;
                    border: #ffb148;
                    color: #fff;
                    height: 100%;
                    vertical-align: middle;
                    i {
                      font-size: 18px;
                      vertical-align: middle;
                    }
                  }
                }
                &.senior-last {
                  margin-right: 0;
                }
                .start, .end, .mustTitle {
                  width: 100%;
                  height: 35px;
                  display: table;
                  margin-bottom: 16px;
                  border-radius: 4px;
                  -moz-box-shadow: 0px 0px 2px #FFB148;
                  -webkit-box-shadow: 0px 0px 2px #FFB148;
                  box-shadow: 0px 0px 2px #FFB148;
                  overflow: hidden;
                  &.last {
                    margin-bottom: 0;
                  }
                  label, input {
                    width: 40px;
                    display: table-cell;
                    height: 35px;
                    vertical-align: middle;
                    text-align: center;
                    font-size: 14px;
                    color: #636363;
                  }
                  label {
                    background-color: #ffc87f;
                  }
                  .el-input {
                    display: table;
                    .el-input-group__prepend {
                      font-size: 14px;
                      color: #636363;
                      background-color: #ffc87f;
                      border: 0;
                      padding: 0;
                      width: 50px;
                      text-align: center;
                    }
                    .el-input__inner {
                      width: 100%;
                      text-align: left;
                    }
                  }
                  input {
                    border: 0;
                    border-radius: 0;
                  }
                  //
                  .el-date-editor.el-input, .el-date-editor.el-input__inner {
                    width: 100%;
                    .el-input__prefix {
                      display: none;
                    }
                    .el-input__suffix {
                      background: rgba(255, 255, 255, 0);
                      .el-input__suffix-inner {
                        text-align: right;
                        .el-input__icon {
                          color: #aeaeae
                        }
                        .el-icon-circle-close {
                          color: #aeaeae
                        }
                      }
                      span {
                        background: rgba(255, 255, 255, 0)
                      }
                    }
                    input {
                      width: 100%;
                      padding: 0 0 0 15px;
                    }
                  }
                }
              }
              .seniorPanelA {
                animation: dateShowD 800ms forwards;
                -moz-animation: dateShowD 800ms forwards;
                -webkit-animation: dateShowD 800ms forwards;
                -o-animation: dateShowD 800ms forwards;
              }
              .seniorReset {
                color: #ffb148;
                font-size: 18px;
                font-weight: bold;
                margin-right: 29px;
                margin-top: 30px;
                float: right;
                cursor: pointer;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                padding: 0;
                background: 0;
                border: 0;
              }
              .seniorResetA {
                animation: seniorResetA 800ms forwards;
                -moz-animation: seniorResetA 800ms forwards;
                -webkit-animation: seniorResetA 800ms forwards;
                -o-animation: seniorResetA 800ms forwards;
              }
              .searchAuto {
                animation: searchAuto 800ms forwards;
                -moz-animation: searchAuto 800ms forwards;
                -webkit-animation: searchAuto 800ms forwards;
                -o-animation: searchAuto 800ms forwards;
              }
              .searchHeight {
                animation: searchHeight 1s forwards;
                -moz-animation: searchHeight 1s forwards;
                -webkit-animation: searchHeight 1s forwards;
                -o-animation: searchHeight 1s forwards;
              }
              .search {
                width: 100%;
                height: 44px;
                margin: auto;
                position: relative;
                z-index: 300;
                // overflow: hidden;
                input {
                  text-align: left !important;
                }
                .searchText {
                  float: left;
                  height: 44px;
                  // display: inline-block;
                  .codeBox {
                    width: 100%;
                    height: 44px;
                    border-radius: 4px;
                    -moz-box-shadow: 0px 0px 2px #FFB148;
                    -webkit-box-shadow: 0px 0px 2px #FFB148;
                    box-shadow: 0px 0px 2px #FFB148;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                    overflow: hidden;
                    input {
                      width: 100%;
                      height: 44px;
                      border: 0;
                      font-size: 16px;
                      line-height: 44px;
                      color: #5a5e66;
                      outline: none;
                      padding: 0 15px;
                      box-sizing: border-box;
                      border-top-right-radius: 0;
                      border-bottom-right-radius: 0;
                    }
                    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                      color: #aeaeae;
                      opacity: 1;
                    }
                    ::-moz-placeholder { /* Mozilla Firefox 19+ */
                      color: #aeaeae;
                      opacity: 1;
                    }
                    input:-ms-input-placeholder {
                      color: #aeaeae;
                      opacity: 1;
                    }
                    input::-webkit-input-placeholder {
                      color: #aeaeae;
                      opacity: 1;
                    }
                    .el-autocomplete {
                      .el-input {
                        .el-input__inner {
                          width: 100%;
                          height: 44px;
                          border: 0;
                          font-size: 20px;
                          line-height: 44px;
                        }
                      }
                    }
                  }
                }
                .searchText {
                  float: left;
                  /*width: 630px !important;*/
                  height: 44px;
                  border-top-right-radius: 0px;
                  border-bottom-right-radius: 0px;

                  .el-autocomplete {
                    width: 100%;
                    height: 44px;
                  }
                  .seniorShow {
                    animation: contentShow 800ms forwards;
                    -moz-animation: contentShow 800ms forwards;
                    -webkit-animation: contentShow 800ms forwards;
                    -o-animation: contentShow 800ms forwards;
                  }
                  .seniorShow:last-child {
                    margin-left: 20px;
                    animation: titleShow 800ms forwards;
                    -moz-animation: titleShow 800ms forwards;
                    -webkit-animation: titleShow 800ms forwards;
                    -o-animation: titleShow 800ms forwards;
                  }
                }
                .searchButton {
                  width: 100px;
                  height: 44px;
                  background: #ffb148;
                  float: right;
                  border: 0;
                  border-radius: 0;
                  padding: 0 !important;
                  border-top-right-radius: 4px;
                  border-bottom-right-radius: 4px;
                  -moz-box-shadow: 0px 0px 2px #FFB148;
                  -webkit-box-shadow: 0px 0px 2px #FFB148;
                  box-shadow: 0px 0px 2px #FFB148;
                  i {
                    font-size: 22px;
                  }
                  &:active {
                    background: rgba(255, 177, 72, 0.5);
                  }
                }
                .searchSenior {
                  float: right;
                  margin-left: 20px;
                  .seniorButton {
                    width: 125px;
                    height: 44px;
                    background: #f6debd;
                    color: #ffb148;
                    font-size: 18px;
                    &:active {
                      background: rgba(255, 177, 72, 0.15);
                    }
                    .searchSanjiao {
                      margin-left: 10px;
                    }
                    .web-sanjiaoxing:before {
                      font-size: 14px !important;
                    }
                    .el-icon-arrow-down:before {
                      content: ""
                    }
                  }
                }
                .buttonFlag {
                  border-radius: 4px !important;
                }
              }
            }
          }
        }
      }
    }
    .search-global {
      min-height: 400px;
      .search {
        width: 100%;
        height: 44px;
        margin: auto;
        position: relative;
        z-index: 300;
        // overflow: hidden;
        input {
          text-align: left !important;
        }
        .searchText {
          float: left;
          height: 44px;
          // display: inline-block;
          .codeBox {
            width: 100%;
            height: 44px;
            border-radius: 4px;
            -moz-box-shadow: 0px 0px 2px #FFB148;
            -webkit-box-shadow: 0px 0px 2px #FFB148;
            box-shadow: 0px 0px 2px #FFB148;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            overflow: hidden;
            input {
              width: 100%;
              height: 44px;
              border: 0;
              font-size: 16px;
              line-height: 44px;
              color: #5a5e66;
              outline: none;
              padding: 0 15px;
              box-sizing: border-box;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
              color: #aeaeae;
              opacity: 1;
            }
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
              color: #aeaeae;
              opacity: 1;
            }
            input:-ms-input-placeholder {
              color: #aeaeae;
              opacity: 1;
            }
            input::-webkit-input-placeholder {
              color: #aeaeae;
              opacity: 1;
            }
            .el-autocomplete {
              .el-input {
                .el-input__inner {
                  width: 100%;
                  height: 44px;
                  border: 0;
                  font-size: 20px;
                  line-height: 44px;
                }
              }
            }
          }
        }
        .searchText {
          float: left;
          /*width: 630px !important;*/
          height: 44px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;

          .el-autocomplete {
            width: 100%;
            height: 44px;
          }
          .seniorShow {
            animation: contentShow 800ms forwards;
            -moz-animation: contentShow 800ms forwards;
            -webkit-animation: contentShow 800ms forwards;
            -o-animation: contentShow 800ms forwards;
          }
          .seniorShow:last-child {
            margin-left: 20px;
            animation: titleShow 800ms forwards;
            -moz-animation: titleShow 800ms forwards;
            -webkit-animation: titleShow 800ms forwards;
            -o-animation: titleShow 800ms forwards;
          }
        }
        .searchButton {
          width: 125px;
          height: 44px;
          background: #ffb148;
          float: right;
          border: 0;
          border-radius: 0;
          padding: 0 !important;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          -moz-box-shadow: 0px 0px 2px #FFB148;
          -webkit-box-shadow: 0px 0px 2px #FFB148;
          box-shadow: 0px 0px 2px #FFB148;
          i {
            font-size: 22px;
          }
          &:active {
            background: rgba(255, 177, 72, 0.5);
          }
        }
        .searchSenior {
          float: right;
          margin-left: 20px;
          .seniorButton {
            width: 125px;
            height: 44px;
            background: #f6debd;
            color: #ffb148;
            font-size: 18px;
            &:active {
              background: rgba(255, 177, 72, 0.15);
            }
            .searchSanjiao {
              margin-left: 10px;
            }
            .web-sanjiaoxing:before {
              font-size: 14px !important;
            }
            .el-icon-arrow-down:before {
              content: ""
            }
          }
        }
        .buttonFlag {
          border-radius: 4px !important;
        }
        .seniorPanel, .seniorPanel-2, .seniorPanel-3 {
          width: 180px;
          height: auto;
          float: left;
          .start, .end, .mustTitle, .mustContent {
            width: 100%;
            height: 44px;
            display: table;
            margin-top: 16px;
            border-radius: 4px;
            -moz-box-shadow: 0px 0px 2px #FFB148;
            -webkit-box-shadow: 0px 0px 2px #FFB148;
            box-shadow: 0px 0px 2px #FFB148;
            overflow: hidden;
            span, input {
              width: 45px;
              display: table-cell;
              height: 44px;
              /*line-height: 44px;*/
              vertical-align: middle;
              text-align: center;
              font-size: 16px;
              color: #636363;
            }
            .el-input {
              display: table;
            }
            span {
              background: #ffc87f;
            }
            input {
              width: 135px;
              border: 0;
              border-radius: 0;
            }
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
              width: 100%;
              .el-input__prefix {
                display: none;
              }
              .el-input__suffix {
                background: rgba(255, 255, 255, 0);
                .el-input__suffix-inner {
                  text-align: right;
                  .el-input__icon {
                    color: #aeaeae
                  }
                  .el-icon-circle-close {
                    color: #aeaeae
                  }
                }
                span {
                  background: rgba(255, 255, 255, 0)
                }
              }
              input {
                width: 100%;
                padding: 0 0 0 15px;
              }
            }
          }
        }
        .seniorPanel-2, .seniorPanel-3 {
          width: 345px;
          .mustTitle, .mustContent {
            width: 345px;
            span {
              width: 68px;
            }
            input {
              width: 277px;
            }
          }
        }
        .seniorPanelA {
          animation: dateShowD 800ms forwards;
          -moz-animation: dateShowD 800ms forwards;
          -webkit-animation: dateShowD 800ms forwards;
          -o-animation: dateShowD 800ms forwards;
        }
        .seniorReset {
          color: #ffb148;
          font-size: 18px;
          font-weight: bold;
          margin-right: 29px;
          margin-top: 30px;
          float: right;
          cursor: pointer;
          user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          padding: 0;
          background: 0;
          border: 0;
        }
        .seniorResetA {
          animation: seniorResetA 800ms forwards;
          -moz-animation: seniorResetA 800ms forwards;
          -webkit-animation: seniorResetA 800ms forwards;
          -o-animation: seniorResetA 800ms forwards;
        }
      }
      .searchAuto {
        animation: searchAuto 800ms forwards;
        -moz-animation: searchAuto 800ms forwards;
        -webkit-animation: searchAuto 800ms forwards;
        -o-animation: searchAuto 800ms forwards;
      }
      .searchHeight {
        animation: searchHeight 1s forwards;
        -moz-animation: searchHeight 1s forwards;
        -webkit-animation: searchHeight 1s forwards;
        -o-animation: searchHeight 1s forwards;
      }
    }
  }
</style>
