<template>
  <div id="report" class="xiaoan-box report-all">
    <div class="report-all-scroll" ref="reportAllDom">
      <div class="column" ref="columnDom">
        <div class="column_item" v-for="(list,index) in columnFirst" @click="selectColumn(index)">
          <p :class="{highLight:list.isLight}">{{ list.name }}</p>
          <span></span>
        </div>
        <div class="column_Search">
          <div slot="icon" @click="searchReport" class="searchIcon">
            <i class="icon iconfont icon-sousuo" style="color:#fff;"></i>
          </div>
        </div>
      </div>
      <div class="container">
        <!--最新 内容-->
        <div class="newContent content" v-show="columnFirst[0].isLight">
          <div class="secondary">
            <div class="tip"></div>
            <div class="secondary_item" :class="{secondary_item1:!secondary[2].isExit}" v-show="list.isExit"
                 v-for="(list,index) in secondary" @click="selectSecond(index)">
              <p :class="{highLightSecond:list.isLight}">{{ list.name }}</p>
              <div :class="{bottomLightSecond:list.isLight}"></div>
            </div>
          </div>
          <div class="secondContent">
            <!-- 我的研报 -->
            <div class="myReport" v-show="this.secondary[2].isLight">
              <!-- 没有我的研报信息 -->
              <div style="height:100%;background: #fff" v-show="isShowMyReport">
                <v-hint :message=hintText :imgSrc=hintImg :isShowBtn=isShowMyReportBtn
                        @event="goFocus"></v-hint>
              </div>
              <!-- 我的研报信息 -->
              <div class="nav-tab">
                <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="myLoading"
                    infinite-scroll-distance="0">
                  <li v-for="(list,index) in reportArr" class="nav-content-list"
                      @click="reportContent(list.id,2)">
                    <div class="nav-content-list-title">{{list.subject}}</div>
                    <div class="nav-content-list-doc vux-1px-t">
                      <span>{{list.securitiesCompany}}</span>
                      <span>&ensp;|&ensp;</span>
                      <span>{{list.author}}</span>
                      <span>&ensp;|&ensp;</span>
                      <span>{{list.levelTwo}}</span>
                      <span>{{$const.format(list.sentDate)}}</span>
                    </div>
                  </li>
                </ul>
                <p v-show="myInfLoading" class="infinite-loading">
                  <xiaoan-drop v-model="myAllLoaded"></xiaoan-drop>
                </p>
              </div>
            </div>
            <!-- 关注公司研报 -->
            <div class="focusReport" v-show="this.secondary[1].isLight">
              <!-- 没有关注公司的研报信息 -->
              <div class="nav-tab" style="background: #fff" v-show="isFocusShow">
                <v-hint :message=hintFocusText :imgSrc=hintNoFocusImg :isShow=isFocusShow
                        :isShowBtn=isShowFocusBtn :hintBtn=hintBtnText @event="goMyFocus"></v-hint>
              </div>
              <div class="nav-tab">
                <ul class="infinite-list" v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="focusLoading" infinite-scroll-distance="0">
                  <li v-for="(list,index) in focusReportArr" class="nav-content-list"
                      @click="reportContent(list.id,1)">
                    <div class="nav-content-list-title">{{list.subject}}</div>
                    <div class="nav-content-list-doc vux-1px-t">
                      <span>{{list.securitiesCompany}}</span>
                      <span>&ensp;|&ensp;</span>
                      <span>{{list.author}}</span>
                      <span>&ensp;|&ensp;</span>
                      <span>{{list.levelTwo}}</span>
                      <span>{{$const.format(list.sentDate)}}</span>
                    </div>
                  </li>
                </ul>
                <p v-show="focusInfLoading" class="infinite-loading">
                  <xiaoan-drop v-model="focusAllLoaded"></xiaoan-drop>
                </p>
              </div>
            </div>
            <!-- 最新研报 -->
            <div class="newReport" :class="{noInfo:isNewShow}" v-show="this.secondary[0].isLight">
              <div style="background: #fff;width: 100%;height: 100%" v-show="isNewShow">
                <v-hint :message=hintNewText :imgSrc=hintNoFocusImg :isShowBtn=false></v-hint>
              </div>
              <div class="nav-tab">
                <ul class="infinite-list" infinite-scroll-disabled="newLoading" v-infinite-scroll="loadMore"
                    infinite-scroll-distance="0">
                  <li v-for="(list,index) in newReportArr" class="nav-content-list"
                      @click="reportContent(list.id,0)">
                    <div class="nav-content-list-title">{{list.subject}}</div>
                    <div class="nav-content-list-doc vux-1px-t">
                      <span>{{list.securitiesCompany}}</span>
                      <span>&ensp;|&ensp;</span>
                      <span>{{list.author}}</span>
                      <span>&ensp;|&ensp;</span>
                      <span>{{list.levelTwo}}</span>
                      <span>{{$const.format(list.sentDate)}}</span>
                    </div>
                  </li>
                </ul>
                <p v-show="newInfLoading" class="infinite-loading">
                  <xiaoan-drop v-model="newAllLoaded" text="仅显示最近一周发布的研报"></xiaoan-drop>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!--公司 内容-->
        <div class="companyContent content" v-show="columnFirst[1].isLight">
          <div class="secondary secondary_company">
            <div class="tip tip_company"></div>
            <ul class="companyListContainer">
              <li class="companyList" v-for="(list,index) in companySort"
                  @click="selectSort(index,'company')">
                <p :class="{sortHighLight:list.isLight}">{{ list.sort }}</p>
                <span :class="{sortHighLight_span:list.isLight}"></span>
              </li>
            </ul>
            <div class="watchMore" :class="{watchMoreIcon:isShowMoreSort}" @click="watchMoreSort">
              <i class="icon iconfont icon-x"></i>
            </div>
            <!-- 更多公司分类 -->
            <ul class="moreCompanySort" :class="{moreCompanySort_animate:isShowMoreSort}"
                v-show="isShowMoreSort">
              <li class="companySortList" @click="moreSortClick(index,'company')"
                  v-for="(list,index) in companySort">
                <p :class="{sortHighLight:list.isLight}">{{ list.sort }}</p>
              </li>
            </ul>
          </div>
          <div class="secondContent" :class="{noInfo:isCompanyShow}">
            <!-- gongsi研报内容信息 -->
            <div class="nav-tab noInfo" style="background: #fff" v-show="isCompanyShow">
              <v-hint :message=hintMultipleText :imgSrc=hintNoFocusImg :isShowBtn=false></v-hint>
            </div>
            <!-- 公司研报内容信息 -->
            <div class="nav-tab">
              <ul class="infinite-list" v-infinite-scroll="loadMorea" infinite-scroll-disabled="comLoading"
                  infinite-scroll-distance="0">
                <li v-for="(list,index) in companyInfo" class="nav-content-list"
                    @click="reportContent(list.id,3)">
                  <div class="nav-content-list-title">{{list.subject}}</div>
                  <div class="nav-content-list-doc vux-1px-t">
                    <span>{{list.securitiesCompany}}</span>
                    <span>&ensp;|&ensp;</span>
                    <span>{{list.author}}</span>
                    <span>&ensp;|&ensp;</span>
                    <span>{{list.levelTwo}}</span>
                    <span>{{$const.format(list.sentDate)}}</span>
                  </div>
                </li>
              </ul>
              <p v-show="comInfLoading" class="infinite-loading">
                <xiaoan-drop v-model="comAllLoaded"></xiaoan-drop>
              </p>
            </div>
          </div>
        </div>
        <!--行业 内容-->
        <div class="industryContent content" v-show="columnFirst[2].isLight">
          <div class="secondary secondary_company">
            <div class="tip tip_industry"></div>
            <ul class="companyListContainer">
              <li class="companyList industryList" v-for="(list,index) in industrySort"
                  @click="selectSort(index,'industry')">
                <p :class="{sortHighLight:list.isLight}">{{ list.sort }}</p>
                <span :class="{sortHighLight_span:list.isLight}"></span>
              </li>
            </ul>
            <div class="watchMore" :class="{watchMoreIcon:isShowMoreSort}" @click="watchMoreSort">
              <i class="icon iconfont icon-x"></i>
            </div>
            <!-- 更多公司分类 -->
            <ul class="moreCompanySort" :class="{moreCompanySort_animate:isShowMoreSort}"
                v-show="isShowMoreSort">
              <li class="companySortList" @click="moreSortClick(index,'industry')"
                  v-for="(list,index) in industrySort">
                <p :class="{sortHighLight:list.isLight}">{{ list.sort }}</p>
              </li>
            </ul>
          </div>
          <div class="secondContent" :class="{noInfo:isInsdustryShow}">
            <!-- gongsi研报内容信息 -->
            <div class="nav-tab noInfo" style="background: #fff" v-show="isInsdustryShow">
              <v-hint :message=hintMultipleText :imgSrc=hintNoFocusImg :isShowBtn=false></v-hint>
            </div>
            <!-- 公司研报内容信息 -->
            <div class="nav-tab">
              <ul class="infinite-list" v-infinite-scroll="loadMoreb" infinite-scroll-disabled="insLoading"
                  infinite-scroll-distance="0">
                <li v-for="(list,index) in industryInfo" class="nav-content-list"
                    @click="reportContent(list.id,4)">
                  <div class="nav-content-list-title">{{list.subject}}</div>
                  <div class="nav-content-list-doc vux-1px-t">
                    <span>{{list.securitiesCompany}}</span>
                    <span>&ensp;|&ensp;</span>
                    <span>{{list.author}}</span>
                    <span>&ensp;|&ensp;</span>
                    <span>{{list.levelTwo}}</span>
                    <span>{{$const.format(list.sentDate)}}</span>
                  </div>
                </li>
              </ul>
              <p v-show="insInfLoading" class="infinite-loading">
                <xiaoan-drop v-model="insAllLoaded"></xiaoan-drop>
              </p>
            </div>
          </div>
        </div>
        <!--综合 内容-->
        <div class="multipleContent content" v-show="columnFirst[3].isLight">
          <div class="secondary secondary_company">
            <div class="tip tip_multiple"></div>
            <ul class="companyListContainer">
              <li class="companyList multipleList" v-for="(list,index) in multipleSort"
                  @click="selectSort(index,'multiple')">
                <p :class="{sortHighLight:list.isLight}">{{ list.sort }}</p>
                <span :class="{sortHighLight_span:list.isLight}"></span>
              </li>
            </ul>
            <div class="watchMore" :class="{watchMoreIcon:isShowMoreSort}" @click="watchMoreSort">
              <i class="icon iconfont icon-x"></i>
            </div>
            <!-- 更多公司分类 -->
            <ul class="moreCompanySort" :class="{moreCompanySort_animate:isShowMoreSort}"
                v-show="isShowMoreSort">
              <li class="companySortList" @click="moreSortClick(index,'multiple')"
                  v-for="(list,index) in multipleSort">
                <p :class="{sortHighLight:list.isLight}">{{ list.sort }}</p>
              </li>
            </ul>
          </div>
          <div class="secondContent" :class="{noInfo:isMultipleShow}">
            <!-- 综合研报内容信息 -->
            <div class="nav-tab noInfo" style="background: #fff" v-show="isMultipleShow">
              <v-hint :message=hintMultipleText :imgSrc=hintNoFocusImg :isShowBtn=false></v-hint>
            </div>
            <div class="nav-tab">
              <ul class="infinite-list" v-infinite-scroll="loadMorec" infinite-scroll-disabled="mulLoading"
                  infinite-scroll-distance="0">
                <li v-for="(list,index) in multipleInfo" class="nav-content-list"
                    @click="reportContent(list.id,5)">
                  <div class="nav-content-list-title">{{list.subject}}</div>
                  <div class="nav-content-list-doc vux-1px-t">
                    <span>{{list.securitiesCompany}}</span>
                    <span>&ensp;|&ensp;</span>
                    <span>{{list.author}}</span>
                    <span>&ensp;|&ensp;</span>
                    <span>{{list.levelTwo}}</span>
                    <span>{{$const.format(list.sentDate)}}</span>
                  </div>
                </li>
              </ul>
              <p v-show="mulInfLoading" class="infinite-loading">
                <xiaoan-drop v-model="mulAllLoaded" text="仅显示最近一周发布的研报"></xiaoan-drop>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shadow" v-show="isShowMoreSort" @click="watchMoreSort"></div>
  </div>
</template>
<script>
  import hint from "@/components/warning/hint"

  export default {
    name: 'report',
    data() {
      return {
        columnFirst: [
          {name: '最新', isLight: true},
          {name: '公司', isLight: false},
          {name: '行业', isLight: false},
          {name: '综合', isLight: false}
        ],
        secondary: [
          {name: '最新研报', isLight: true, isExit: true},
          {name: '关注公司的研报', isLight: false, isExit: true},
          {name: '我的研报', isLight: false, isExit: true}
        ],
        hintText: '暂无研报，前往查看关注公司研报',
        hintMultipleText: '暂无研报数据！',
        isShowMyReportBtn: true,
        isShowMyReport: false,//是否显示没有我的研报的提示信息
        hintImg: this.$image.report.noReportInfo,
        hintFocusText: '关注更多公司，也许有你想要的！',
        hintNewText: '暂无最新研报数据！',
        isFocusShow: false,
        isShowFocusBtn: true,
        isNewShow: false,
        isMultipleShow: false,
        isCompanyShow: false,
        isInsdustryShow: false,
        hintBtnText: '前往关注',
        hintNoFocusImg: this.$image.personal.toFocus,
        reportArr: [],//我的研报信息
        focusReportArr: [],//我的关注公司研报信息
        newReportArr: [],//最新研报信息
        newrepArrLength: 0,
        focrepArrLength: 0,
        myrepArrLength: 0,
        reportTotal: 0,//研报数量
        reportTotal_new: 0,//研报数量
        reportTotal_focus: 0,//研报数量
        reportTotal_my: 0,//研报数量
        /* 滚动加载 */
        page: 1,
        focusPage: 1,
        newPage: 1,
        myPage: 1,
        pagesize: 10,
        loading: false,
        allLoaded: true,
        infLoading: true,

        myLoading: false,
        myAllLoaded: true,
        myInfLoading: true,

        newLoading: false,
        newAllLoaded: true,
        newInfLoading: true,

        focusLoading: false,
        focusAllLoaded: true,
        focusInfLoading: true,
        /* 公司分类 */
        companySort: [],
        companyInfo: [],//公司报告
        comInfoLength: 0,
        allCompanyPage: 1,
        comLoading: false,
        comAllLoaded: true,
        comInfLoading: true,
        isShowMoreSort: false,//是否显示更多公司分类
        offScroll: [],//记录二级公司类型菜单scroll
        /* 行业分类 */
        industrySort: [],
        industryInfo: [],//公司报告
        allIndustryPage: 1,
        industryInfoLength: 0,
        insLoading: false,
        insAllLoaded: true,
        insInfLoading: true,
        /* 综合分类 */
        multipleSort: [],
        multipleInfo: [],//公司报告
        allMultiplePage: 1,
        multipleInfoLength: 0,
        mulLoading: false,
        mulAllLoaded: true,
        mulInfLoading: true,
        /* 当前选择二级菜单 */
        companySecond: '',
        industrySecond: '',
        multipleSecond: '',
      }
    },
    watch: {
      active: "scroll",
    },
    beforeCreate() {
      this.user_Id = this.$cookie.getCookie("userId");
      if (this.user_Id.length == 0 || this.user_Id == undefined) {
        let url = window.location.href;
        window.sessionStorage.setItem("refer_url", url);
        window.sessionStorage.setItem("refer_title", '研报');
        this.$router.push({path: "/number"});
      } else {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          if (res.data.returnCode == 1 && res.data.returnObject.companyCode !== '') {
            this.getNewReport();
          } else {
            this.secondary[2].isExit = false;
            this.getNewReport();
          }

        }).catch((err) => {
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      }
    },
    mounted() {
      if (this.$storage.sessionStorageAll('reportFocus').length !== 0) {
        // 从关注公司的研报出去的 默认显示关注公司的研报模块
        for (var i in this.secondary) {
          this.secondary[i].isLight = false;
        }
        this.secondary[1].isLight = true;
        this.getMyFocusReport();
      }
      $(".mint-tab-item").removeClass('is-selected').eq(2).addClass('is-selected');
      this.containerHeight();

      var adverttitle = "信公小安 x 天风证券研究所";
      var sharelink2 = decodeURI(window.location.href);//分享链接
      var shareDesc = "用信公小安，随时掌握最新研报";//描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);

      var store0 = this.$YBstore.store[0];
      var store1 = this.$YBstore.store[1];
      var store2 = this.$YBstore.store[2];
      if (store0 == '最新' && store1 == '关注公司的研报') {
        this.selectSecond(1)
      } else if (store0 == '最新' && store1 == '我的研报') {
        this.selectSecond(2)
      } else if (store0 == '最新' && store1 == '最新研报') {
        this.selectSecond(0)
      } else if (store0 == '公司') {
        this.companySecond = store2;
        this.selectColumn(1);
        this.selectSort('company', store2)
      } else if (store0 == '行业') {
        this.industrySecond = store2;
        this.selectColumn(2);
        this.selectSort('industry', store2)
      } else if (store0 == '综合') {
        this.multipleSecond = store2;
        this.selectColumn(3);
        this.selectSort('multiple', store2)
      }
    },
    components: {
      'v-hint': hint
    },
    methods: {
      // 行业获取综合报告
      getIndustry_multiple(index) {
        let params = {
          pageNum: this.allMultiplePage,
          pageSize: this.pagesize,
          type: index
        }
        this.$axios.report.getIntegratedReportByType(params).then(res => {
          if (res.data.returnCode == 1) {
            this.isMultipleShow = false;

            if (index == this.multipleSort[this.multipleSecond].sort) {
              if (this.multipleInfo.length == 0) {
                this.multipleInfo = res.data.returnObject;
              } else {
                var arr = res.data.returnObject;
                if (this.multipleInfo[0].subject !== arr[0].subject) {
                  this.multipleInfo = this.multipleInfo.concat(res.data.returnObject);
                }
              }
              this.multipleInfoLength = this.multipleInfo.length;
              this.reportTotal = res.data.total;

              this.$nextTick(() => {
                if (res.data.total <= 10) {
                  this.mulAllLoaded = false;
                }
              }, 2500)
            }
            console.log('.,./,/.,./,./,/', this.reportTotal);
          } else {
            this.isMultipleShow = true;
            if (this.allMultiplePage > 1) {
              this.isMultipleShow = false;
            }
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取综合研报
      getAllMultiple() {
        let params = {
          pageNum: this.allMultiplePage,
          pageSize: this.pagesize
        }
        this.$axios.report.getAllIntegratedReport(params).then(res => {
          console.log(res)
//            if(this.multipleSecond == '' || this.multipleSecond == 0){
          if (res.data.returnCode == 1) {
            if (this.multipleInfo.length == 0) {
              this.multipleInfo = res.data.returnObject;
            } else {
              var arr = res.data.returnObject;
              if (this.multipleInfo[0].subject !== arr[0].subject) {
                this.multipleInfo = this.multipleInfo.concat(res.data.returnObject);
              }
            }
            this.multipleInfoLength = this.multipleInfo.length;
            this.reportTotal = res.data.total;
          }
          /*}*/
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取综合报告的行业类型集合
      getMultipleSort() {
        this.$axios.report.getIntegratedTypeList().then(res => {
          console.log(res)
          if (res.data.returnCode == 1) {
            var arr = res.data.returnObject;
            var newarr = [];

            function obj(string, boolean) {
              this.sort = string;
              this.isLight = boolean;
            }

            for (var i in arr) {
              newarr.push(new obj(arr[i], false));
            }
            this.multipleSort = newarr;
            this.multipleSort = [{sort: '全部', isLight: true}].concat(this.multipleSort)

            var store1 = this.$YBstore.store[0];
            if (store1 == '综合' && store1 !== undefined) {
              var store2 = this.$YBstore.store[2];
              if (store2 !== '') {
                for (var i in this.multipleSort) {
                  this.multipleSort[i].isLight = false;
                }
                this.multipleSort[store2].isLight = true;

                if (store2 == 0) {
                  this.getAllMultiple();
                } else {
                  this.getIndustry_multiple(this.multipleSort[store2].sort);
                }

                this.$nextTick(() => {
                  this.offsetLeft(store2, 'multiple');
                }, 2500)
              }
            }
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 行业获取行业报告
      getIndustry_industry(index) {
        let params = {
          pageNum: this.allIndustryPage,
          pageSize: this.pagesize,
          industry: index
        }
        this.$axios.report.getAllIndutryReportByIndustry(params).then(res => {
          if (res.data.returnCode == 1) {
            this.isInsdustryShow = false;
            console.log(this.industrySort[this.industrySecond].sort);
            if (index == this.industrySort[this.industrySecond].sort) {
              if (this.industryInfo.length == 0) {
                this.industryInfo = res.data.returnObject;
              } else {
                var arr = res.data.returnObject;
                if (this.industryInfo[0].subject !== arr[0].subject) {
                  this.industryInfo = this.industryInfo.concat(res.data.returnObject);
                }
              }
              this.industryInfoLength = this.industryInfo.length;
              this.reportTotal = res.data.total;
              this.$nextTick(() => {
                if (res.data.total <= 10) {
                  this.insAllLoaded = false;
                }
              }, 2500)
            }
          } else {
            this.isInsdustryShow = true;
            if (this.allIndustryPage > 1) {
              this.isInsdustryShow = false;
            }
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取全部行业报告
      getAllIndustry() {
        let params = {
          pageNum: this.allIndustryPage,
          pageSize: this.pagesize
        }
        this.$axios.report.getAllIndustryReport(params).then(res => {
          console.log(res)
          /*if(this.industrySecond == '' || this.industrySecond == 0){*/
          if (res.data.returnCode == 1) {
            if (this.industryInfo.length == 0) {
              this.industryInfo = res.data.returnObject;
            } else {
              if (this.industryInfo !== res.data.returnObject) {

                var arr = res.data.returnObject;
                if (this.industryInfo[0].subject !== arr[0].subject) {
                  this.industryInfo = this.industryInfo.concat(res.data.returnObject);
                }
              }
            }
            this.industryInfoLength = this.industryInfo.length;
            this.reportTotal = res.data.total;
          }
          /* }*/
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取行业报告的行业类型集合
      getIndustrySort() {
        this.$axios.report.getIndustryTypeList().then(res => {
          console.log(res)
          if (res.data.returnCode == 1) {
            var arr = res.data.returnObject;
            var newarr = [];

            function obj(string, boolean) {
              this.sort = string;
              this.isLight = boolean;
            }

            for (var i in arr) {
              newarr.push(new obj(arr[i], false));
            }
            this.industrySort = newarr;
            this.industrySort = [{sort: '全部', isLight: true}].concat(this.industrySort)

            var store1 = this.$YBstore.store[0];
            if (store1 == '行业' && store1 !== undefined) {
              var store2 = this.$YBstore.store[2];
              if (store2 !== '') {
                for (var i in this.industrySort) {
                  this.industrySort[i].isLight = false;
                }
                this.industrySort[store2].isLight = true;
                if (store2 == 0) {
                  this.getAllIndustry();
                } else {
                  this.getIndustry_industry(this.industrySort[store2].sort);
                }

                this.$nextTick(() => {
                  this.offsetLeft(store2, 'industry');
                }, 2500)
              }
            }
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 行业获取公司报告
      getIndustry(index) {
        //console.log('company4');
        let params = {
          pageNum: this.allCompanyPage,
          pageSize: this.pagesize,
          industry: index
        }
        this.$axios.report.getAllCompanyReportByIndustry(params).then(res => {
          if (res.data.returnCode == 1) {
            this.isCompanyShow = false;
            console.log(this.companySort[this.companySecond].sort);
            if (index == this.companySort[this.companySecond].sort) {
              if (this.companyInfo.length == 0) {
                this.companyInfo = res.data.returnObject;
              } else {
                var arr = res.data.returnObject;
                if (this.companyInfo[0].subject !== arr[0].subject) {
                  this.companyInfo = this.companyInfo.concat(res.data.returnObject);
                }
              }
              this.comInfoLength = this.companyInfo.length;
              this.reportTotal = res.data.total;
              this.$nextTick(() => {
                if (res.data.total <= 10) {
                  this.comAllLoaded = false;
                }
              }, 2500)
            }
          } else {
            this.isCompanyShow = true;
            if (this.allCompanyPage > 1) {
              this.isCompanyShow = false;
            }
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取公司报告的行业
      getCompanySort() {
        this.$axios.report.getAllCompanyIndustryList().then(res => {
          console.log(res)
          if (res.data.returnCode == 1) {
            var arr = res.data.returnObject;
            var newarr = [];

            function obj(string, boolean) {
              this.sort = string;
              this.isLight = boolean;
            }

            for (var i in arr) {
              newarr.push(new obj(arr[i], false));
            }
            this.companySort = newarr;
            this.companySort = [{sort: '全部', isLight: true}].concat(this.companySort)
            var store1 = this.$YBstore.store[0];
            if (store1 == '公司' && store1 !== undefined) {
              var store2 = this.$YBstore.store[2];
              if (store2 !== '') {
                for (var i in this.companySort) {
                  this.companySort[i].isLight = false;
                }
                console.log('gggggg', this.$YBstore.store, store2, this.companySort[store2]);
                this.companySort[store2].isLight = true;
                this.companyInfo = [];

                if (store2 == 0) {
                  this.getAllCompany();
                } else {
                  this.getIndustry(this.companySort[store2].sort);
                }
                this.$nextTick(() => {
                  this.offsetLeft(store2, 'company');
                }, 2500)
              }
            }
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取全部公司报告
      getAllCompany() {
        let params = {
          pageNum: this.allCompanyPage,
          pageSize: this.pagesize
        }
        this.$axios.report.getAllCompanyReport(params).then(res => {
          //console.log(res)
          console.log(',.,.,.,.,.,.', this.companySecond);
          /*if(this.companySecond == '' || this.companySecond == 0){*/
          if (res.data.returnCode == 1) {
            if (this.companyInfo.length == 0) {
              this.companyInfo = res.data.returnObject;
            } else {
              var arr = res.data.returnObject;
              if (this.companyInfo[0].subject !== arr[0].subject) {
                this.companyInfo = this.companyInfo.concat(res.data.returnObject);
              }

            }
            this.comInfoLength = this.companyInfo.length;
            this.reportTotal = res.data.total;
          }
          /*}*/

        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取最新研报
      getNewReport() {
        let params = {
          pageNum: this.newPage,
          pageSize: 10,
          days: 5
        }
        this.$axios.report.getNewResearchReport(params).then(res => {
          if (res.data.returnCode == 1) {
            if (this.newReportArr.length == 0) {
              this.newReportArr = res.data.returnObject;
            } else {
              var arr = res.data.returnObject;
              if (this.newReportArr[0].subject !== arr[0].subject) {
                this.newReportArr = this.newReportArr.concat(res.data.returnObject);
              }
            }
            this.newrepArrLength = this.newReportArr.length;
            this.reportTotal_new = res.data.total;
          } else if (res.data.returnCode == -1) {
            this.isNewShow = true;
          }
        }).catch((err) => {
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取我关注公司的研报
      getMyFocusReport() {
        let params = {
          pageNum: this.focusPage,
          pageSize: this.pagesize
        }
        this.$axios.report.getMyAttentionCompany(params).then(res => {
          console.log(res)
          if (res.data.returnCode == 1) {
            if (this.focusReportArr.length == 0) {
              this.focusReportArr = res.data.returnObject;
            } else {
              var arr = res.data.returnObject;
              if (this.focusReportArr[0].subject !== arr[0].subject) {
                this.focusReportArr = this.focusReportArr.concat(res.data.returnObject);
              }
            }
            this.focrepArrLength = this.focusReportArr.length;
            this.isFocusShow = false;
            this.reportTotal_focus = res.data.total;
            this.$nextTick(() => {
              if (res.data.total <= 10) {
                this.focusAllLoaded = false;
              }
            }, 2500)
          } else if (res.data.returnCode == -1) {
            this.isFocusShow = true;
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取我的研报
      getMyReport() {
        console.log('reportarr', this.reportArr);
        let params = {
          pageNum: this.myPage,
          pageSize: this.pagesize
        }
        this.$axios.report.getMyResearchReport(params).then(res => {
          console.log('我的研报接口返回', res);
          if (res.data.returnCode == 1) {
            if (this.reportArr.length == 0) {
              this.reportArr = res.data.returnObject;
            } else {
              if (this.reportArr !== res.data.returnObject) {
                this.reportArr = this.reportArr.concat(res.data.returnObject);
              }

            }
            this.myrepArrLength = this.reportArr.length;
            this.reportTotal_my = res.data.total;
            this.$nextTick(() => {
              if (res.data.total <= 10) {
                this.myAllLoaded = false;
              }
            }, 2500)
          } else if (res.data.returnCode == -1) {
            this.isShowMyReport = true;
          }
        }).catch((err) => {
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 一级内容区域高度自适应
      containerHeight() {
        var hei = this.$refs.reportAllDom.clientHeight;
        var searchs = this.$refs.columnDom.clientHeight;
        var heig = (hei - searchs) + "px";
        $('.container').height(heig);//一级内容区域高度自适应

        var secondary = document.querySelector(".secondary").clientHeight;
        var secondContentHeight = (hei - (searchs + secondary)) + "px";
        $('.secondContent').height(secondContentHeight);//二级内容区域高度自适应
        $('.nav-tab').height(secondContentHeight);//二级内容区域高度自适应
        $('.wrapper').height(secondContentHeight);//二级内容区域高度自适应
      },
      // 一级菜单选择
      selectColumn(index) {
        for (var i in this.columnFirst) {
          this.columnFirst[i].isLight = false;
        }
        this.columnFirst[index].isLight = true;
        if (index == 1) {
          this.getCompanySort();
          this.companyInfo = [];
          this.allCompanyPage = 1;
          $(".companyListContainer").eq(0).animate({scrollLeft: 0}, 100);
          this.getAllCompany();

          var store1 = this.$YBstore.store[0];
          var store2 = this.$YBstore.store[2];
          if (store1 == '公司' && store1 !== undefined) {
            if (store2 == '') {
              this.getAllCompany();
            }
          } else {
            this.getAllCompany();
            this.$YBstore.store[0] = '';
            this.$YBstore.store[2] = '';
          }
        } else if (index == 2) {
          this.getIndustrySort();
          this.industryInfo = [];
          this.allIndustryPage = 1;
          $(".companyListContainer").eq(1).animate({scrollLeft: 0}, 100);
          var store1 = this.$YBstore.store[0];
          var store2 = this.$YBstore.store[2];
          if (store1 == '行业' && store1 !== undefined) {
            if (store2 == '') {
              this.getAllIndustry();
            }
          } else {
            this.getAllIndustry();
            this.$YBstore.store[0] = '';
            this.$YBstore.store[2] = '';
          }
        } else if (index == 3) {
          this.getMultipleSort();
          this.multipleInfo = [];
          this.allMultiplePage = 1;
          $(".companyListContainer").eq(2).animate({scrollLeft: 0}, 100);
          var store1 = this.$YBstore.store[0];
          var store2 = this.$YBstore.store[2];

          if (store1 == '综合' && store1 !== undefined) {
            if (store2 == '') {
              this.getAllMultiple();
            }
          } else {
            this.getAllMultiple();
            this.$YBstore.store[0] = '';
            this.$YBstore.store[2] = '';
          }
        } else if (index == 0) {
          this.$YBstore.store[0] = '';
          this.$YBstore.store[2] = '';
        }
      },
      // 搜索研报
      searchReport() {
        this.$router.push({path: '/searchReport'})
      },
      // 最新 二级菜单选择
      selectSecond(index) {
        for (var i in this.secondary) {
          this.secondary[i].isLight = false;
        }
        this.secondary[index].isLight = true;

        if (index == 1) {
          if (this.focusReportArr.length == 0) {
            this.getMyFocusReport();
          }
        } else if (index == 2) {
          if (this.reportArr.length == 0) {
            this.getMyReport();
          }
        }
      },
      // 无我的研报信息 跳转查看关注公司的研报信息
      goFocus() {
        this.secondary[1].isLight = true;
        this.secondary[2].isLight = false;
        this.focusReportArr = [];
        this.getMyFocusReport();
      },
      // 跳转我的关注，添加关注
      goMyFocus() {
        this.$router.push({path: "/addfocus"});
        sessionStorage.removeItem("reportFocus");
        this.$storage.sessionStorageSystem('reportFocus', true);
      },
      // 查看研报内容
      reportContent(index, num) {
        if (num <= 2) {
          for (var i in this.secondary) {
            if (num == i) {
              this.$YBstore.store = ['最新', this.secondary[i].name];
            }
          }
        } else if (num == 3) {
          for (var i in this.companySort) {
            if (this.companySort[i].isLight == true) {
              this.$YBstore.store = ['公司', this.companySort[i].sort, i];
            }
          }
          console.log('---->公司', num, this.companySort, this.$YBstore.store);
        } else if (num == 4) {
          for (var i in this.industrySort) {
            if (this.industrySort[i].isLight == true) {
              this.$YBstore.store = ['行业', this.industrySort[i].sort, i];
            }
          }
        } else if (num == 5) {
          for (var i in this.multipleSort) {
            if (this.multipleSort[i].isLight == true) {
              this.$YBstore.store = ['综合', this.multipleSort[i].sort, i];
            }
          }
        }
        this.$router.push({path: '/detailReport', query: {id: index}});
      },
      // 综合查看更多
      loadMorec() {
        var runMethod, isSort, str;
        for (var i in this.multipleSort) {
          if (this.multipleSort[i].isLight == true) {
            if (i == 0) {
              isSort = true;
              runMethod = this.getAllMultiple;
            } else {
              isSort = false;
              str = this.multipleSort[i].sort;
              runMethod = this.getIndustry_multiple;
            }
          }
        }
        var length = this.multipleInfoLength;
        var total = this.reportTotal;
        //console.log('sd========',length,total,this.allCompanyPage,length<total);
        if (length < total) {
          this.mulLoading = true;
        } else {
          /*this.allLoaded = false;*/
          this.mulAllLoaded = false;
        }
        if (length < total) {
          this.allMultiplePage += 1;
          this.mulAllLoaded = true;
          if (isSort) {
            runMethod();
          } else {
            runMethod(str);
          }

        } else {
          this.mulAllLoaded = false;
        }
        this.mulLoading = false;
      },
      // 行业查看更多
      loadMoreb() {
        var runMethod, isSort, str;
        for (var i in this.industrySort) {
          if (this.industrySort[i].isLight == true) {
            if (i == 0) {
              isSort = true;
              runMethod = this.getAllIndustry;
            } else {
              isSort = false;
              str = this.industrySort[i].sort;
              runMethod = this.getIndustry_industry;
            }
          }
        }
        var length = this.industryInfoLength;
        var total = this.reportTotal;
        if (length < total) {
          this.loading = true;
        } else {
          this.insAllLoaded = false;
        }
        if (length < total) {
          this.allIndustryPage += 1;
          this.allLoaded = true;
          if (isSort) {
            runMethod();
          } else {
            runMethod(str);
          }
        } else {
          this.allLoaded = false;
        }
        if (length == total) {
          this.insAllLoaded = false;
        }
        this.loading = false;
      },
      // 公司加载更多
      loadMorea() {
        var runMethod, isSort, str;
        for (var i in this.companySort) {
          if (this.companySort[i].isLight == true) {
            if (i == 0) {
              isSort = true;
              runMethod = this.getAllCompany;
            } else {
              isSort = false;
              str = this.companySort[i].sort;
              runMethod = this.getIndustry;
            }
          }
        }
        var length = this.comInfoLength;
        var total = this.reportTotal;
        if (length < total) {
          this.comLoading = true;
        } else {
          //this.allLoaded = false;
          this.comAllLoaded = false;
        }
        if (length < total) {
          this.allCompanyPage += 1;
          this.comAllLoaded = true;
          if (isSort) {
            runMethod();
          } else {
            runMethod(str);
          }
        } else {
          this.comAllLoaded = false;
        }
        this.comLoading = false;
      },
      // 加载更多
      loadMore() {
        var length, total, runMethod;
        if (this.secondary[0].isLight) {
          length = this.newrepArrLength;
          total = this.reportTotal_new;
          runMethod = this.getNewReport;
        } else if (this.secondary[1].isLight) {
          length = this.focrepArrLength;
          total = this.reportTotal_focus;
          runMethod = this.getMyFocusReport;
        } else if (this.secondary[2].isLight) {
          length = this.myrepArrLength;
          total = this.reportTotal_my;
          runMethod = this.getMyReport;
        }
        if (length < total) {
          if (this.secondary[0].isLight) {
            this.newLoading = true;
          } else if (this.secondary[1].isLight) {
            this.focusLoading = true;
          } else if (this.secondary[2].isLight) {
            this.myLoading = true;
          }
        } else {
          if (this.secondary[0].isLight) {
            this.newAllLoaded = true;
          } else if (this.secondary[1].isLight) {
            this.focusAllLoaded = true;
          } else if (this.secondary[2].isLight) {
            this.myAllLoaded = true;
          }
        }
        if (length < total) {
          if (this.secondary[0].isLight) {
            this.newPage += 1;
            this.newAllLoaded = true;
          } else if (this.secondary[1].isLight) {
            this.focusPage += 1;
            this.focusAllLoaded = true;
          } else if (this.secondary[2].isLight) {
            this.myPage += 1;
            this.myAllLoaded = true;
          }
          runMethod();
        } else {
          if (this.secondary[0].isLight) {
            this.newAllLoaded = false;
          } else if (this.secondary[1].isLight) {
            this.focusAllLoaded = false;
          } else if (this.secondary[2].isLight) {
            this.myAllLoaded = false;
          }
        }
        if (this.secondary[0].isLight) {
          this.newLoading = false;
        } else if (this.secondary[1].isLight) {
          this.focusLoading = false;
        } else if (this.secondary[2].isLight) {
          this.myLoading = false;
        }
      },
      // 查看更多公司分类
      watchMoreSort() {
        this.isShowMoreSort ? this.isShowMoreSort = false : this.isShowMoreSort = true;
      },
      // 查看更多展开分类点击
      moreSortClick(index, name) {
        this.selectSort(index, name);
        this.isShowMoreSort = false
      },
      // 点击选择公司类型
      selectSort(index, name) {
        if (name == 'company') {
          for (var i in this.companySort) {
            this.companySort[i].isLight = false;
          }
          this.companySort[index].isLight = true;
          this.offsetLeft(index, name);

          this.companyInfo = [];
          this.comInfoLength = 0;
          this.allCompanyPage = 1;
          this.comAllLoaded = true;
          this.companySecond = index;
          if (index == 0) {
            this.getAllCompany();
          } else {
            this.getIndustry(this.companySort[index].sort);
          }
          this.isShowMoreSort = false;
        } else if (name == 'industry') {
          for (var i in this.industrySort) {
            this.industrySort[i].isLight = false;
          }
          this.industrySort[index].isLight = true;
          this.offsetLeft(index, name);
          this.industryInfo = [];
          this.industryInfoLength = 0;
          this.allIndustryPage = 1;
          this.insAllLoaded = true;
          this.industrySecond = index;
          if (index == 0) {
            this.getAllIndustry();
          } else {
            this.getIndustry_industry(this.industrySort[index].sort);
          }
          this.isShowMoreSort = false;
          this.$nextTick(() => {
            this.$YBstore.store = ['行业', '全部', 0];
          })
        } else if (name == 'multiple') {
          for (var i in this.multipleSort) {
            this.multipleSort[i].isLight = false;
          }
          this.multipleSort[index].isLight = true;
          this.offsetLeft(index, name);
          this.multipleInfo = [];
          this.multipleInfoLength = 0;
          this.allMultiplePage = 1;
          this.mulAllLoaded = true;
          this.multipleSecond = index;
          if (index == 0) {
            this.getAllMultiple();
          } else {
            this.getIndustry_multiple(this.multipleSort[index].sort);
          }
          this.isShowMoreSort = false;
        }
      },
      // 点击选项定位
      offsetLeft(index, name) {
        console.log('>>>>>', index);

        let hei = document.body.clientWidth, arr = [], office;
        if (name == 'company') {
          office = document.querySelectorAll(".companyList");
        } else if (name == 'industry') {
          office = document.querySelectorAll(".industryList");
        } else if (name == 'multiple') {
          office = document.querySelectorAll(".multipleList");
        }
        //判断初次进入是 "this.offScroll"是否赋值成功
        /*if (this.offScroll == "" || this.offScroll.length == 0 || this.offScroll == undefined) {
            this.$nextTick(() => {*/
        for (let i = 0; i < office.length; i++) {
          arr.push(office[i].offsetLeft);
        }
        this.offScroll = arr;
        //console.log("111",this.offScroll);
        /*});
    } else {*/
        if (name == 'company') {
          var clientWidth = $(".companyList")[index].clientWidth;
        } else if (name == 'industry') {
          var clientWidth = $(".industryList")[index].clientWidth;
        } else if (name == 'multiple') {
          var clientWidth = $(".multipleList")[index].clientWidth;
        }
        /*let clientWidth = $(".companyList")[index].clientWidth;*/
        //console.log('89890',office,clientWidth,$(".companyList"),$(".companyListContainer"))
        let clientW = (clientWidth / 2);
        let liLeft = ((this.offScroll[index]) + clientW);
        var heiS = (hei / 2);
        //console.log("222", clientWidth, clientW, liLeft, heiS);
        if (name == 'company') {
          $(".companyListContainer").eq(0).animate({scrollLeft: liLeft - heiS});
        } else if (name == 'industry') {
          $(".companyListContainer").eq(1).animate({scrollLeft: liLeft - heiS});
        } else if (name == 'multiple') {
          $(".companyListContainer").eq(2).animate({scrollLeft: liLeft - heiS});
        }

        /*}*/
      },
    }
  }
</script>
<style lang="scss">
  .xiaoan-box.report-all {
    padding-bottom: 50px;
    position: relative;
    .report-all-scroll {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background-color: #FFFFFF;
    }
  }
  #report .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
</style>
<style lang="scss" scoped>
  .column {
    width: 100%;
    height: 50px;
    background: #ffc148;
    padding: 0 12.5px;
    box-sizing: border-box;
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1010;
  }
  .column_item {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 16px;
    color: #fee1ba;
    position: relative;
  }
  .column_item p {
    width: 100%;
    height: 100%;
  }
  .highLight {
    color: #fff;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  .column_item span {
    width: 1px;
    height: 14px;
    margin: auto 0;
    background: #fee1ba;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }
  .column_item:first-child {
    flex-grow: 1;
  }
  .column_item:nth-child(2), .column_item:nth-child(3), .column_item:nth-child(4) {
    flex-grow: 1.8;
    text-align: center;
  }
  .column_Search {
    flex-grow: 0.7;
    text-align: right;
    .icon {
      font-size: 20px;
    }
  }
  /* 内容区域 */
  .container {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
  }
  .content {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .secondary {
    width: 100%;
    height: 40px;
    border-bottom: 0.5px solid #e3e3e3;
    position: relative;
    z-index: 1010;
    background: #fff;
  }
  /* 公司栏目下 二级菜单 */
  .secondary_company {
    width: 100%;
    height: 40px;
    padding: 0 32px 0 10px;
    box-sizing: border-box;
  }
  .companyListContainer {
    height: 100%;
    width: auto;
    display: -webkit-box;
    line-height: 40px;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .companyListContainer::-webkit-scrollbar {
    display: none;
    opacity: 0;
  }
  .companyList {
    width: auto;
    margin-right: 30px;
    list-style: none;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 13px;
    color: #c2c2c2;
    position: relative;
  }
  /* 选中高亮 */
  .sortHighLight {
    color: #ffb148;
  }
  .sortHighLight_span {
    width: 25px;
    height: 2px;
    border-radius: 1px;
    background: #ffb148;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: inline-block;
  }
  .watchMore {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
  .watchMore .iconfont {
    color: #ffb148;
    font-size: 15px;
    transform: rotate(135deg);
    -ms-transform: rotate(135deg); /* IE 9 */
    -moz-transform: rotate(135deg); /* Firefox */
    -webkit-transform: rotate(135deg); /* Safari 和 Chrome */
    -o-transform: rotate(135deg); /* Opera */
    display: inline-block;
  }
  .watchMoreIcon .iconfont {
    color: #ffb148;
    font-size: 15px;
    display: inline;
  }
  /* 更多公司分类选项展开 */
  .moreCompanySort {
    width: 100%;
    height: auto;
    position: absolute;
    top: 40px;
    left: 0;
    background: #f0f1f5;
    z-index: 100;
    padding: 15px 22.5px 5px;
    box-sizing: border-box;
    margin: 0;
  }
  .moreCompanySort_animate {
    animation: active 0.5s;
    -moz-animation: active 0.5s; /* Firefox */
    -webkit-animation: active 0.5s; /* Safari 和 Chrome */
    -o-animation: active 0.5s; /* Opera */
  }
  @keyframes active {
    from {
      opacity: 0;
      top: 0;
      left: 100%;
    }
    to {
      opacity: 1;
      top: 40px;
      left: 0
    }
  }
  .companySortList {
    list-style: none;
    width: 75px;
    height: 25px;
    border: 0.5px solid #e3e3e3;
    float: left;
    margin-right: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    font-size: 13px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #535353;
    background: #fff;
    border-radius: 2px;
    line-height: 25px;
    text-align: center;
  }
  .companySortList:nth-child(4n) {
    margin-right: 0;
  }
  .secondary_item {
    width: 33.33%;
    height: 100%;
    text-align: center;
    line-height: 40px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 13px;
    color: #aeaeae;
    float: left;
    position: relative;
  }
  .secondary_item1 {
    width: 50%;
  }
  .bottomLightSecond {
    width: 25px;
    height: 2px;
    border-radius: 1px;
    background: #ffb148;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .highLightSecond {
    color: #ffb148;
  }
  /* tip 三角标识当前菜单项 */
  .tip {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 6px solid #fff;
    position: absolute;
    left: 24px;
    top: -6px;
  }
  .tip_company {
    left: 107px;
  }
  .tip_industry {
    left: 188px;
  }
  .tip_multiple {
    left: 270px;
  }
  /* 二级菜单内容区域 */
  .secondContent {
    background: #f0f1f5;
  }
  .noInfo {
    overflow: hidden !important;
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .secondContent, .myReport {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .nav-tab {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background: #f0f1f5;
  }
  /* 二级区域内容列表 */
  .nav-content-list {
    width: 100%;
    height: auto;
    background: #fff;
    margin: 10px 0 0 0;
    box-sizing: border-box;
    border-radius: 2px;
    padding: 5px 15px;
  }
  .nav-content-list-title {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
    padding: 8px 0;
  }
  .nav-content-list-doc {
    color: #aeaeae;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 11px;
    width: 100%;
    height: auto;
    padding: 10px 0;
  }
  .nav-content-list-doc span:last-child {
    float: right;
  }
  .shadow {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1009;
  }

</style>
