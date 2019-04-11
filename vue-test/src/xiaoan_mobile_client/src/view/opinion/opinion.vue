<template>
  <div class="opinion" id="opinion">
    <div ref="wrapper" id="SCROLL" class="opinionscroll" :class="{opinionScroll: middleShow}">
      <transition name="bounce">
        <div class="guideopinion" v-show="opinionGuidePages">
          <img :src="guideopinion[2].img" alt="">
          <p>{{guideopinion[2].text}}</p>
          <button @click="guideOpinionclick(1)">{{guideopinion[2].button}}</button>
        </div>
      </transition>
      <header class="head">
        <div class="label">
          <button class="btnOne"> <!--@click="fetchClick(0)"-->
            <span>{{keySub(AllProject.projectName)}}</span>
          </button>
          <button @click="routeClick()">
            <i class="icon iconfont icon-bianji"></i>
            <span>{{codeName[2]}}</span>
          </button>
        </div>
      </header>
      <transition name="bounce">
        <div v-show="middleShow" class="op-middle" @click="fetchClick(2)"></div>
      </transition>
      <div class="op-sub">
        <button class="" v-for="list in opinionNav" type="button">
          <div>
            <p v-if="list.name == 0" style="color: #8d8d8d">--</p>
            <p v-else>{{list.name}}</p>
            <label>{{list.type}}</label>
          </div>
        </button>
      </div>
      <div class="op-line-pie">
        <div class="op-line">
          <div class="opinion-l">
            <button v-for="(list,index) in opinionLine" :class="{isActive:list.isActive}"
                    @click="lineClick(index)">{{list.name}}
            </button>
          </div>
          <div class="opinion-pie-global opinion-line-global">
            <swiper v-model="active" :min-moving-distance="130" :height="'100%'" :show-dots="false">
              <swiper-item>
                <div class="opinion-pie-global">
                  <div class="pie-global-btn">
                    <button v-for="(list, index) in opinionTime.pei" :class="{isPitch: list.isSelected}"
                            @click="opinionTimeClick(true,index)">{{list.name}}
                    </button>
                  </div>
                  <div class="pie-line-shadow" v-show="pieLineShadow">
                    <div>{{warning[0]}}</div>
                  </div>
                  <div ref="styleWidth" :style="{'width':newWidth}" class="opinion-pie" id="opinion-pie">
                  </div>
                </div>
              </swiper-item>
              <swiper-item>
                <div class="opinion-line-global">
                  <div class="opinion-line-year">2017-2018</div>
                  <div class="pie-global-btn">
                    <button v-for="(list, index) in opinionTime.line" :class="{isPitch: list.isSelected}"
                            @click="opinionTimeClick(false,index)">
                      {{list.name}}
                    </button>
                  </div>

                  <div class="pie-line-shadow" v-show="pieLineShadow1">
                    <div>{{warning[0]}}</div>
                  </div>
                  <div ref="styleWidth1" :style="{'width':newWidth}" class="opinion-line" id="opinion-line"></div>
                </div>
              </swiper-item>
            </swiper>
          </div>
        </div>
      </div>
      <!---->
      <div class="op-sreen pie-line-sreen" ref="offsetSreen">
        <div class="nextsreen" :style="{width:100+'%'}">
          <tab :line-width="2" :scroll-threshold="10" v-model="sreenSelected" custom-bar-width="30px"
               :bar-active-color="'#ffb148'" :active-color="'#ffb148'">
            <tab-item :disabled="!list.isShow" :key="index" v-for="(list, index) in sreenData">
              <span v-show="list.isShow">{{list.name}}</span>
            </tab-item>
          </tab>
        </div>
      </div>
      <!-----------------------------列表----------------------------->
      <div class="op-list" v-if="listShow == 0">
        <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="0">
          <li v-for="(list,index) in listData.opinion" @click="opinionListClick(0,index)">
            <div class="li-div-item vux-1px-b">
              <p>{{list.title}}</p>
              <p class="last-p">
                <span>{{list.media}}&ensp;|</span>
                <b>{{list.createdStr}}</b>
              </p>
            </div>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
        </p>
      </div>
      <div class="op-list" v-if="listShow == 1">
        <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="0">
          <li v-for="(list,index) in listData.notice" @click="opinionAfficheClick(index)">
            <div class="li-div-item vux-1px-b">
              <p>{{list.title}}</p>
              <p class="last-p"><span>{{$const.format(list.releaseDate)}}</span></p>
            </div>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
        </p>
      </div>
      <div class="op-list" v-if="listShow == 2">
        <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="0">
          <li v-for="(list,index) in listData.report" @click="opinionReportClick(index)">
            <div class="li-div-item vux-1px-b">
              <p>{{list.subject}}</p>
              <p class="last-p">
                <span>{{list.securitiesCompany}}</span>
                <span v-show="list.securitiesCompany">|</span>
                <span>{{$const.format(list.sentDate)}}</span>
              </p>
            </div>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
        </p>
      </div>
      <div class="op-list" v-if="listShow == 3">
        <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="0">
          <li v-for="(list,index) in listData.bbs" @click="opinionListClick(1,index)">
            <div class="li-div-item vux-1px-b">
              <p>{{list.title}}</p>
              <p class="last-p">
                <span>{{list.media}}&ensp;|</span>
                <b>{{list.createdStr}}</b>
              </p>
            </div>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
        </p>
      </div>
    </div>
    <transition name="bounce">
      <div v-show="returnTop" class="returnTop" @click="returnTo">
        <i class="icon iconfont icon-xiangshangjiantou"></i>
        <p>顶部</p>
      </div>
    </transition>
    <xiaoan-loading v-show="loadingShadow" bgColor="rgba(255,255,255,1)"></xiaoan-loading>
  </div>
</template>

<script>
  // 合test
  import drop from "@/components/warning/drop"
  import loading from '@/components/warning/loading'
  import guideopinion from '@/assets/icon/Guide'
  import {Swiper, SwiperItem, Tab, TabItem} from 'vux'
  export default {
    name: 'opinion',
    components: {
      "xiaoan-drop": drop,
      "xiaoan-loading": loading,
      Tab,
      TabItem, Swiper, SwiperItem
    },
    data() {
      return {
        active: 0,
        nextsreenWidth: 45,
        guideimg: '',
        topBtn: '4%',
        geideText: '',
        loadingShadow: true,
        listShow: 0,
        listShowData: 0,
        sreenData: [
          {isShow: true, name: '舆情', id: 0, totalPage: 0, pageNo: 1, pageSize: 20},
          {isShow: true, name: '论坛', id: 1, totalPage: 0, pageNo: 1, pageSize: 20},
          {isShow: true, name: '公告', id: 2, totalPage: 0, pageNo: 1, pageSize: 20},
          {isShow: true, name: '研报', id: 3, totalPage: 0, pageNo: 1, pageSize: 20},
          {isShow: false, name: '', id: 4, totalPage: 0, pageNo: 1, pageSize: 20},
          {isShow: false, name: '', id: 5, totalPage: 0, pageNo: 1, pageSize: 20},
          {isShow: false, name: '', id: 6, totalPage: 0, pageNo: 1, pageSize: 20}
        ],
        listData: {
          opinion: [],
          notice: [],
          report: [],
          bbs: []
        },
        isKeyWordName: false,
        sreenSelected: 0,
        codeName: ['', '切换', '项目管理', '所有分类', ''],
        warning: ['暂无数据', '没有更多了'],
        column: false,
        opinionNav: [
          {'name': 0, type: '今日最新舆情'},
          {'name': 0, type: '本月最新舆情'}
        ],
        returnTop: false,
        sreenSouce: false,
        pieLineShadow: true,
        pieLineShadow1: false,
        sreenCol: false,
        middleShow: false,
        opinionLine: [
          {id: 0, name: '舆情分布', title: '', type: '', list: [], isActive: true},
          {id: 1, name: '媒体舆情走势', title: '', type: '', list: [], isActive: false}
        ],
        pieLine: true,
        newWidth: '',
        opinionList: [],
        loading: false,
        allLoaded: false,
        infLoading: true,
        container: '',
        keywordId: '', // 当前选择的关键字的id
        AllProject: {}, // 当前选中的数据
        keywordName: [],
        opinionTime: {
          pei: [
            {name: '按日', list: [], isSelected: false},
            {name: '按周', list: [], isSelected: true},
            {name: '按月', list: [], isSelected: false}
          ],
          line: [
            {name: '前7天', list: [], isSelected: true},
            {name: '前30天', list: [], isSelected: false}
          ]
        },
        guideopinion: guideopinion.opinionGuide,
        opinionGuidePages: true,
        opinionGuidePages2: false,
        AllSource: [
          {id: '', name: '所有分类'},
        ], // 所有分类
        timestamp: 0,
        myCompanyInfo: {},
        // keywordName:[]
        monthSouOther: [],
        weekSouOther: [],
        daySouOther: [],
        monthNumber: "",
        weekNumber: "",
        dayNumber: ""
      }
    },
    watch: {
      active: function (val) {
        this.opinionLine.forEach((item) => {
          item.isActive = false;
        });
        this.opinionLine[val].isActive = true;
      },
      sreenSelected: function (val) {
        //
        switch (this.sreenData[val].name) {
          case '舆情':
            this.listShow = 0;
            break;
          case '公告':
            this.listShow = 1;
            break;
          case '研报':
            this.listShow = 2;
            break;
          case '论坛':
            this.listShow = 3;
            break;
        }
        console.log(this.listShow);
        // 通过监听 选项 来还原加载中状态。。。
        // 处理数据较少时不显示
        if (this.sreenData[val].totalPage == this.sreenData[val].pageNo) {
          this.infLoading = false;
          this.allLoaded = false;
        } else {
          this.infLoading = true;
          this.allLoaded = true;
        }
      },
      $route: function () {
        setTimeout(() => {
          //this.loadingShadow = false;
        }, 1000);
      }
    },
    // 离开当前页面后
    destroyed() {
    },
    created() {
      if (window.localStorage.getItem('opinionGuidePages-detail')) {
        this.opinionGuidePages = false;
      }
      this.user_id = this.$cookie.getCookie("userId");
      if (this.$cookie.isLogin()) {
      } else {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      this.timestamp = Date.parse(new Date());
      this.$nextTick(() => {
        this.getAllProject();
      });
    },
    mounted() {
      this.newWidth = this.$refs.styleWidth.getBoundingClientRect().width;
      console.log(this.$refs.styleWidth.getBoundingClientRect())
      this.$nextTick(() => {
        this.$refs.wrapper.addEventListener('scroll', (e) => {
          e.stopPropagation();
          let isScrollTop = this.$refs.wrapper.scrollTop;
          if (isScrollTop > 300) {
            this.returnTop = true;
          } else if (isScrollTop <= 300) {
            this.returnTop = false;
          }
        });
      });
      let adverttitle = "";
      let sharelink2 = this.$api.CURRENTIP.IP + '#/rule'; // 分享链接
      let shareDesc = ""; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      // 获取项目
      getAllProject() {
        this.$axios.opinion.getAllProject({}).then((res) => {
          console.log("all", res)
          if (res.data.returnCode == 1) {
            let container = res.data.returnObject;
            let defaultProject = {};
            container.forEach((item) => {
              if (item.id == this.$route.query.id) {
                defaultProject = item;
              }
            });
            //
            this.AllProject = defaultProject;
            //
            defaultProject.keywordList.forEach((item) => {
              this.keywordName.push(item.keywordName);
            });
            console.log('====>', this.keywordName);
            this.apiGetCompanyInfoByName();

          }
        }).catch((err) => {
          console.error(err);
        })
      },
      //
      keySub(key) {
        key = String(key);
        if (key.length > 7) {
          return (key.substring(0, 7) + '...');
        }
        return key
      },
      // 返回顶部
      returnTo() {
        console.log(1122121212);
        $('#SCROLL').animate({scrollTop: 0});
      },
      // 初始执行方法
      apiGetCompanyInfoByName() {
        let params = {
          name: this.keywordName[0]
        }
        this.$axios.common.getCompanyInfoByName(params).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject == null || res.data.returnObject == '') {
              //
              this.sreenData = [
                {isShow: true, name: '舆情', id: 0, totalPage: 0, pageNo: 1, pageSize: 10},
                {isShow: true, name: '论坛', id: 3, totalPage: 0, pageNo: 1, pageSize: 10},
                {isShow: false, name: '', id: 4, totalPage: 0, pageNo: 1, pageSize: 10},
                {isShow: false, name: '', id: 4, totalPage: 0, pageNo: 1, pageSize: 10},
                {isShow: false, name: '', id: 4, totalPage: 0, pageNo: 1, pageSize: 10},
                {isShow: false, name: '', id: 4, totalPage: 0, pageNo: 1, pageSize: 10},
                {isShow: false, name: '', id: 4, totalPage: 0, pageNo: 1, pageSize: 10}
              ];
              this.nextsreenWidth = 15;
            } else {
              this.sreenData.forEach((item) => {
                item.isShow = false;
                if (item.name == '舆情' || item.name == '论坛') {
                  item.isShow = true;
                }
                if (item.name == '公告' || item.name == '研报') {
                  item.isShow = true;
                }
              });
              this.myCompanyInfo = res.data.returnObject;
              // 公告
              this.apiAnnouncement(this.myCompanyInfo.code);
              // 舆情
              this.searchReports(this.keywordName.join(","));
            }
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '网络连接错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
        setTimeout(() => {
          this.$nextTick(() => {
            this.getSentimentSummary(this.keywordName.join(","));
            this.getSemtimentData();
            this.getSemtimentDataBBS();
          })
        }, 1200);
      },
      // 搜索公告
      apiAnnouncement(code) {
        let index = 1;
        this.sreenData.forEach((item, i) => {
          if (item.name == '公告') {
            index = i;
          }
        });
        // 公告搜索
        let params = {
          sort: 'releaseDate',
          pageSize: this.sreenData[index].pageSize,
          pageNum: this.sreenData[index].pageNo,
          companyCode: code
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.disclosure.search,
          params: {
            sort: 'releaseDate',
            pageSize: this.sreenData[index].pageSize,
            pageNum: this.sreenData[index].pageNo,
            companyCode: code
          }
        })*/
        this.$axios.disclosure.search(params).then((res) => {
          console.log("2222222", res)
          if (res.data.returnCode == 1) {
            //根据总条数 判断有多少页
            if (res.data.returnObject == null || res.data.returnObject == '') {
              if (this.listData.notice.length == 0) {
                this.sreenData.forEach((item, i) => {
                  if (item.name == '公告') {
                    this.sreenData.splice(i, 1)
                  }
                })
              }
            } else {
              let number = res.data.returnObject.count;
              this.sreenData[index].totalPage = this.$array.totalPage(number, this.sreenData[index].pageSize);
              //控制下拉刷新
              let rat = res.data.returnObject.list;
              this.listData.notice = this.$array.loadMore(this.listData.notice, rat);
              this.infLoading = true;
            }
          }
          console.log(this.sreenData);
        }).catch((err) => {
          console.error(err);
        })
      },
      // 舆情搜索
      getSemtimentData() {
        let params = {
          pageSize: this.sreenData[0].pageSize,
          pageNo: this.sreenData[0].pageNo,
          keyword: this.keywordName.join(","),
          type: 'sentiment'
        }
        this.$axios.opinion.getSemtimentData(params).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.data == null || res.data.returnObject.data == []) {
              if (this.listData.opinion.length == 0) {
                this.infLoading = false;
                this.allLoaded = false;
              } else {
                this.infLoading = true;
                this.allLoaded = true;
              }
            } else {
              let number = res.data.returnObject.totalCount;
              this.sreenData[0].totalPage = this.$array.totalPage(number, this.sreenData[0].pageSize);
              //控制下拉刷新
              let data = res.data.returnObject.data;
              this.listData.opinion = this.$array.loadMore(this.listData.opinion, data);
              this.infLoading = true;
              if (number <= 10) {
                this.infLoading = false;
                this.allLoaded = false;
              }
            }
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      // 舆情论坛 搜索数据
      getSemtimentDataBBS() {
        let index = 3;
        this.sreenData.forEach((item, i) => {
          if (item.name == '论坛') {
            index = i;
          }
        });
        let params = {
          pageSize: this.sreenData[index].pageSize,
          pageNo: this.sreenData[index].pageNo,
          keyword: this.keywordName.join(","),
          type: 'bbs'
        }
        this.$axios.opinion.getSemtimentData(params).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.data == null || res.data.returnObject.data == []) {
              if (this.listData.bbs.length == 0) {
                this.infLoading = false;
                this.allLoaded = false;
              } else {
                this.infLoading = true;
                this.allLoaded = true;
              }
            } else {
              let number = res.data.returnObject.totalCount;
              this.sreenData[index].totalPage = this.$array.totalPage(number, this.sreenData[index].pageSize);
              //控制下拉刷新
              console.log('234234324', this.sreenData[index]);
              console.log('234234324', this.sreenData);
              console.log('234234324', this.sreenData[index].pageSize);
              let data = res.data.returnObject.data;
              this.listData.bbs = this.$array.loadMore(this.listData.bbs, data);
              this.infLoading = true;
              if (number <= 10) {
                this.infLoading = false;
                this.allLoaded = false;
              }
            }
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      // 研报搜索
      searchReports() {
        let index = 2;
        this.sreenData.forEach((item, i) => {
          if (item.name == '研报') {
            index = i;
          }
        });
        let params = {
          pageSize: this.sreenData[index].pageSize,
          pageNum: this.sreenData[index].pageNo,
          keyWord: this.keywordName.join(",")
        }
        this.$axios.report.searchReports(params).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject == null || res.data.returnObject == '') {
              // false 没有研报
              if (this.listData.report.length == 0) {
                this.sreenData.forEach((item, i) => {
                  if (item.name == '研报') {
                    this.sreenData.splice(i, 1)
                  }
                })
              }
            } else {
              // true 有研报
              let number = res.data.total;
              this.sreenData[index].totalPage = this.$array.totalPage(number, this.sreenData[index].pageSize);
              //控制下拉刷新
              let data = res.data.returnObject;
              this.listData.report = this.$array.loadMore(this.listData.report, data);
              this.infLoading = true;
              if (number <= 10) {
                this.infLoading = false;
                this.allLoaded = false;
              }
              console.log(number, this.sreenData[index].totalPage, 12345);
            }
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      //饼图与折线图数据
      getSentimentSummary() {
        let params = {
          keyword: this.keywordName.join(","),
          type: 'sentiment'
        }
        this.$axios.opinion.getSentimentSummary(params).then((res) => {
          console.log("getSentimentSummary", res.data.returnObject);
          // setTimeout(() => {
          this.$nextTick(() => {
            this.loadingShadow = false;
          })
          // }, 0);
          if (res.data.returnCode == 1) {
            let summarySource = res.data.returnObject;
            // 获取舆情 今日  和 该月 总数
            let dailySummary = summarySource.dailySummary;
            let newDate = this.$const.getNewDate();
            dailySummary.forEach((item) => {
              if (item.date == newDate) {
                this.opinionNav[0].name = item.docCount;
              }
            });
            this.opinionNav[1].name = res.data.returnObject.monthTotal; // 当月的舆情总数
            // 处理饼图数据
            this.opinionTime.pei[0].list = this.summarySourceDom(summarySource.mediaSummaryDay);
            this.opinionTime.pei[1].list = this.summarySourceDom(summarySource.mediaSummaryWeek);
            this.opinionTime.pei[2].list = this.summarySourceDom(summarySource.mediaSummaryMonth);
            // 饼图
            this.opinionPie(this.opinionTime.pei[1].list);
            if (this.opinionTime.pei[1].list.length == 0) {
              this.pieLineShadow = true;
            } else {
              this.pieLineShadow = false;
            }
            // 处理折线图数据
            this.opinionTime.line[1].list = this.summaryProjectDom(summarySource.dailySummary);
            this.opinionTime.line[0].list = this.summaryProjectDom(summarySource.weekSummary);
            // 折线图
            this.opinionLines(this.opinionTime.line[0].list);
          } else if (res.data.returnCode == -1) {
            console.log('未获取到数据');
          }
        }).catch((err) => {
          setTimeout(() => {
            this.$nextTick(() => {
              this.loadingShadow = false;
            })
          }, 3000);
        })
      },
      // 点击 切换 按日 按周 按月 前7天 前30天
      opinionTimeClick(state, index) {
        if (state) {
          // 饼图切换
          this.opinionTime.pei.forEach((item) => {
            item.isSelected = false;
          });
          this.opinionTime.pei[index].isSelected = true;
          this.opinionPie(this.opinionTime.pei[index].list);
          //
          if (this.opinionTime.pei[index].list == [] || this.opinionTime.pei[index].list.length == 0) {
            this.pieLineShadow = true;
          } else {
            this.pieLineShadow = false;
          }
        } else {
          // 折线图切换
          this.opinionTime.line.forEach((item) => {
            item.isSelected = false;
          });
          this.opinionTime.line[index].isSelected = true;
          this.opinionLines(this.opinionTime.line[index].list);
          //
          if (this.opinionTime.line[index].list == "" || this.opinionTime.line[index].list == []) {
            this.pieLineShadow1 = true;
          } else {
            this.pieLineShadow1 = false;
          }
        }
      },
      // 点击列表
      opinionListClick(type, index) {
        if (type == 0) {
          window.location.href = this.listData.opinion[index].uri;
        } else if (type == 1) {
          window.location.href = this.listData.bbs[index].uri;
        }
      },
      // 公告获取跳转
      opinionAfficheClick(index) {
        this.$router.push({path: '/afficheContent', query: {id: this.listData.notice[index].mainId}});
      },
      // 研报跳转
      opinionReportClick(index) {
        this.$router.push({
          path: '/detailReport',
          query: {id: this.listData.report[index].id}
        });
      },
      // 获取项目详情
      summarySourceDom(mediaSummary) {
        // 处理饼图数据
        let mediaSummaryData = [];
        let mediaSummaryDataOther = [];
        let mediaNumber = 0;
        if (mediaSummary == null || mediaSummary == '') {
        } else {
          if (mediaSummary == null || mediaSummary.length == 0) {
            mediaSummaryData = [];
          } else {
            let mediaSummarySou = mediaSummary.slice(0, 9);
            let mediaSummaryOther = mediaSummary.slice(9, mediaSummary.length);
            mediaSummaryOther.forEach((item) => {
              mediaNumber += item.docCount
            });
            console.log('mediaNumber', mediaNumber);
            if (mediaNumber == 0 || mediaNumber == "") {
              mediaSummaryDataOther = []
            } else {
              mediaSummaryDataOther = [{docCount: mediaNumber, mediaName: '其他'}]
            }
            mediaSummarySou = mediaSummarySou.concat(mediaSummaryDataOther);
            // 饼图月
            mediaSummarySou.forEach((item) => {
              if (item.docCount != 0) {
                mediaSummaryData.push({value: item.docCount, name: item.mediaName});
              }
            })
          }
        }
        return mediaSummaryData
      },
      //
      summaryProjectDom(obj) {
        // 处理折线图 数据
        let data = [];
        let returnData = [];
        if (obj == null || obj.length == 0) {
          returnData = [];
        } else {
          data = obj;
          data.forEach((item) => {
            returnData.push({
                name: (item.date.split('-')[1] + '.' + item.date.split('-')[2]),
                value: item.docCount
              }
            )
          })
        }
        return returnData;
      },
      // 点击项目管理
      routeClick() {
         this.$router.push({path: '/supervise', query: {add: 0, id: this.$route.query.id}});
        // this.$router.push({path: '/superviseList'});
      },
      // 筛选分类（暂无用）
      fetchClick(index) {
        if (index == 0) {
          this.column === true ? this.column = false : this.column = true;
          this.middleShow = this.column;
        } else if (index == 1) {
          this.sreenCol === true ? this.sreenCol = false : this.sreenCol = true;
          this.middleShow = this.sreenCol;
        } else if (index == 3) {
          this.sreenSouce === true ? this.sreenSouce = false : this.sreenSouce = true;
          this.middleShow = this.sreenSouce;
        } else if (index == 2) {
          this.column = false;
          this.middleShow = false;
          this.sreenSouce = false;
          this.sreenCol = false;
        }
        // console.log(index);
      },
      // 切换 饼图 和 折线图
      lineClick(index) {
        this.active = index;
        this.opinionLine.forEach((item) => {
          item.isActive = false;
        });
        this.opinionLine[index].isActive = true;
      },
      // 饼图
      opinionPie(dataNode) {
        // console.log(dataNode)
        let myChart = echarts.init(document.getElementById('opinion-pie'));
        let lineColor = ['#f9f9f9', '#8d8d8d', 'rgba(0,0,0,0)', '#c5c5c5'];
        let dataName = [], dataValue = [];
        for (let i in dataNode) {
          dataName.push(dataNode[i].name);
        }
        for (let i in dataNode) {
          dataValue.push({value: dataNode[i].value, name: dataNode[i].name});
        }
        // // console.log('dataNode', dataName, dataNode);
        let option = {
          backgroundColor: lineColor[0],
          legend: {
            x: 'center',
            y: 'bottom',
            selectedMode: false,
            data: dataName,
            orient: 'horizontal',
            pageButtonItemGap: 0,
            textStyle: {
              fontSize: 12,
              color: '#8d8d8d'
            },
            itemWidth: 10,
            itemHeight: 10
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '42%'],
            data: dataValue,
            color: [
              "#f8c674",
              "#f9a728",
              "#febaa8",
              "#fc724c",
              "#cd4110",
              "#af83c4",
              "#8dc8fe",
              "#5ea1e0",
              "#4bc28e",
              "#d0d0d0"
              // "#d0d0d0",
              // "#4bc28e",
              // "#5ea1e0",
              // "#8dc8fe",
              // "#af83c4",
              // "#cd4110",
              // "#fc724c",
              // "#febaa8",
              // "#f9a728",
              // "#f8c674",
            ],
            // roseType: 'radius',
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  color: lineColor[1]
                },
                formatter: function (param) {
                  // console.log('1234567890', param.percent, Math.round(param.percent));
                  return param.percent.toFixed(2) + '%';
                }
              }
            },
            labelLine: {
              normal: {
                show: true,
                lineStyle: {
                  width: 1,
                  color: lineColor[3],
                  fontSize: 5
                },
                textStyle: {
                  color: lineColor[1],
                  fontSize: 5
                }
              }
            },
            itemStyle: {
              normal: {
                show: false,
                shadowBlur: 200,
                shadowColor: lineColor[2]
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }],

        };
        myChart.setOption(option, true);
      },
      // 折线图
      opinionLines(arr) {
        console.log(arr)
        let myChart1 = echarts.init(document.getElementById('opinion-line'));
        let color = ['#f0f1f5', '#8d8d8d', '#f9f9f9'];
        let dataArray = arr;
        let dataName = [], dataValue = [];
        for (let i in dataArray) {
          dataName.push(dataArray[i].name);
          dataValue.push(dataArray[i].value)
        }
        let yuping = ['2017-2018']
        let option = {
          backgroundColor: color[2],
          color: [
            '#90c4f5',
            '#e36f4b',
            '#c87aec',
            '#ffe26f',
            '#ffbb48',
            '#5ec995',
            '#eba8e3',
            '#878687',
            '#b6de15',
            '#ff7e9e',
          ],
          /*tooltip: {
               trigger: 'axis'
           },*/
          legend: {
            x: 'center',
            y: 'bottom',
            textStyle: {
              color: '#8d8d8d',
            },
            // data: yuping,
            selectedMode: false
          },
          grid: {
            left: 5,
            right: 25,
            top: 65,
            bottom: 15,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: color[1]
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              // interval: 0,
              rotate: 50,
              margin: 10,
              textStyle: {
                color: color[1]
              },
            },
            boundaryGap: false,
            data: dataName
          },
          yAxis: {
            type: 'value',
            minInterval: 1, // 保持 y轴正整数
            axisLine: {
              lineStyle: {
                color: color[1]
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: true
            },
            axisLabel: {
              textStyle: {
                color: color[1]
              }
            },
          },
          series: [{
            name: yuping[0],
            type: 'line',
            symbolSize: 3,
            symbol: 'circle',
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,//折线宽度
                }
              }
            },
            markPoint: {
              symbolSize: 36,
              data: [{
                type: 'max',
                name: '最大值',
                symbolSize: 36
              }, {
                type: 'min',
                name: '最小值',
                symbolSize: 36
              }]
            },
            data: dataValue
          }]
        };
        myChart1.setOption(option, true);
      },
      // 上拉加载
      loadMore() {
        let lastValue = this.sreenData[this.sreenSelected].pageNo;
        if (lastValue < this.sreenData[this.sreenSelected].totalPage) {
          this.loading = true;
          this.allLoaded = true;
        } else {
          this.allLoaded = false;
          this.loading = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.sreenData[this.sreenSelected].totalPage) {
            this.sreenData[this.sreenSelected].pageNo += 1;
            if (this.listShow == 0) {
              this.getSemtimentData();
            } else if (this.listShow == 1) {
              this.apiAnnouncement(this.myCompanyInfo.code);
            } else if (this.listShow == 2) {
              this.searchReports(this.keywordName[0]);
            } else if (this.listShow == 3) {
              this.getSemtimentDataBBS();
            }
          }
          setTimeout(() => {
            this.allLoaded = false;
            this.loading = false;
          }, 3300)
        }, 300);
      },
      //
      guideOpinionclick(index) {
        console.log(123);
        this.opinionGuidePages = false;
        window.localStorage.setItem('opinionGuidePages-detail', 'true');
      },
    }
  }
</script>

<style lang="scss">
  .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
    strong {
      font-weight: normal;
    }
  }
  .snake {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #535353;
    height: 50px;
    box-sizing: border-box;
    text-align: center;
  }
  .fold-enter-active {
    animation: fold-in .3s;
  }
  .fold-leave-active {
    animation: fold-in .3s reverse;
  }
  @keyframes fold-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
      z-index: 2000;
    }
  }
  .bounce-enter-active {
    animation: bounce-in .3s;
  }
  .bounce-leave-active {
    animation: bounce-in .3s reverse;
  }
  @-moz-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @-o-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  .opinionScroll {
    overflow: hidden !important;
  }
  .opinion {
    width: 100%;
    height: 100%;
    background: white;
    overflow: hidden;
    .opinionscroll {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      padding: 12px 0 0 0;
    }
    .guideopinion.top {
      img {
        top: 52.5%;
        left: 1px;
        height: 215px;
      }
      p {
        left: 27%;
        top: 52.5%;
        right: inherit;
      }
    }
    .guideopinion {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 5000;
      img {
        height: 260px;
        position: absolute;
        right: 12px;
        top: 4%;
      }
      p {
        position: absolute;
        right: 16%;
        top: 48%;
        // background-color: ;
        color: white;
        font-size: 15px;
      }
      button {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        height: 32.5px;
        width: 100px;
        background-color: rgba(0, 0, 0, 0.01);
        color: #ffb148;
        border-radius: 2px;
        font-size: 15px;
        text-align: center;
        line-height: 1;
        border: 1.5px dashed #ffb148;
      }
    }
    .mint-spinner-snake {
      height: 14px !important;
      width: 14px !important;
      border: 2px solid transparent;
      border-top-color: rgb(252, 199, 127) !important;
      border-left-color: rgb(252, 199, 127) !important;
      border-bottom-color: rgb(252, 199, 127) !important;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    .returnTop {
      width: 45px;
      height: 45px;
      position: absolute;
      bottom: 75px;
      right: 25px;
      z-index: 10;
      text-align: center;
      padding: 5px 10px 0 10px;
      font-size: 0;
      box-sizing: border-box;
      border-radius: 50%;
      background: rgba(0, 0, 0, .44);
      color: #fff;
      overflow: hidden;
      i {
        color: white;
        font-weight: 600;
        font-size: 18px;
        margin-top: 5px;
      }
      p {
        font-size: 10px;
        line-height: 1;
      }
    }
    .head {
      position: relative;
      height: 60px;
      width: 100%;
      padding: 0 12px;
      box-sizing: border-box;

      .label {
        display: table;
        width: 100%;
        height: 100%;
        font-size: 0;
        box-sizing: border-box;
        border-radius: 2px;
        -moz-box-shadow: 0px 0px 15px rgba(255, 177, 72, 0.4);
        -webkit-box-shadow: 0px 0px 15px rgba(255, 177, 72, 0.4);
        box-shadow: 0px 0px 15px rgba(255, 177, 72, 0.4);
        background: -webkit-linear-gradient(left, #ffc548, #ffb148); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, #ffc548, #ffb148); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, #ffc548, #ffb148); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #ffc548, #ffb148); /* 标准的语法 */
        button {
          font-size: 16px;
          /*width: 50%;*/
          height: 100%;
          display: table-cell;
          border: none;
          border: 0;
          background: transparent;
          vertical-align: middle;
          color: white;
          i {
            //  color: white;
            font-size: 12px;
            // font-weight: 900;
            //  display: inline-block;
          }
        }
        button:last-child {
          text-align: right;
          padding-right: 12px;
          width: 28%;
          span {
            vertical-align: middle;
            font-size: 12px;
            display: inline-block;
            line-height: 1;
          }
          .icon-bianji {
            font-size: 18px;
            vertical-align: middle;
            color: white;
          }
          .bj {
            font-size: 0;
            display: inline-block;
            background: url("https://oss.in-hope.cn/xiaoan/h5_static/opinion/bj-opinionw@3x.png") no-repeat center center;
            background-size: contain;
            height: 16px;
            width: 16px;
            vertical-align: middle;
          }
        }
        .btnOne {
          width: 72%;
          box-sizing: border-box;
          font-size: 22px;
          text-align: left;
          padding-left: 12px;
          i {
            vertical-align: middle;
            transition: transform .3s, -webkit-transform .3s;
            transform: rotate(0deg);
          }
          .trarm {
            transition: transform .3s, -webkit-transform .3s;
            transform: rotate(180deg);
          }
          .flip {
            font-size: 12px;
            vertical-align: middle;
          }
        }
      }
      .column {
        position: absolute;
        background: white;
        top: 60px;
        left: 0;
        width: 100%;
        height: 60px;
        font-size: 0;
        box-sizing: border-box;
        transition: transform .3s, -webkit-transform .3s;
        transform: rotateY(0);
        z-index: 1200;
        i {
          position: absolute;
          top: -5px;
          left: 25%;
        }
        i:before {
          content: '';
          height: 0;
          width: 0;
          display: block;
          border: 6px transparent solid;
          border-left-width: 5px;
          border-right-width: 5px;
          border-top-width: 0;
          border-bottom-color: rgba(255, 255, 255, 1);
        }
        button {
          width: 50%;
          height: 100%;
          color: #8d8d8d;
          font-size: 15px;
          text-align: center;
          vertical-align: middle;
          border: 0;
          background-color: white;
        }
      }
    }
    .op-middle {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.25);
      z-index: 1000;
    }
    .op-sub {
      font-size: 0;
      display: table;
      height: 55px;
      width: 100%;
      margin-top: 10px;
      button {
        border: 0;
        background: transparent;
        width: 50%;
        height: 100%;
        display: table-cell;
        color: #8d8d8d;
        div {
          border-right: 0.5px solid #E3E3E3;
          p {
            font-size: 25px;
            color: #ffb148;
          }
          label {
            font-size: 12px;
          }
        }
      }
      button:last-child {
        div {
          border-right: 0;
        }
      }
    }
    .op-line-pie {
      padding: 0 12px;
      box-sizing: border-box;
      .op-line {
        border: 0.5px solid #e3e3e3;
        margin-top: 10px;
        width: 100%;
        background-color: #f9f9f9;
        .opinion-l {
          width: 100%;
          font-size: 0;
          height: 40px;
          display: table;
          box-sizing: border-box;
          .isActive {
            color: #ffb148;
            background-color: #f9f9f9;
            -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
            color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
            color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
          button {
            display: table-cell;
            width: 50%;
            text-align: center;
            height: 100%;
            font-size: 13px;
            border: 0;
            color: #8d8d8d;
            background: #edecec;
            -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
            color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
            color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        }
        .opinion-pie-global, .opinion-line-global {
          position: relative;
          height: 300px;
          width: 100%;
          .vux-slider {
            height: 100%;
          }
          .opinion-line-year {
            position: absolute;
            bottom: 2px;
            left: 10px;
            font-size: 12px;
            color: white;
            z-index: 100;
            background-color: #90c4f5;
            border-radius: 2px;
            padding: 0 2px;
            display: none;
          }
          .pie-line-shadow {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            z-index: 300;
            background-color: #f9f9f9;
            margin: auto;
            text-align: center;
            vertical-align: middle;
            div {
              margin-top: 40%;
              font-size: 15px;
              color: #8d8d8d;
            }
          }
          .pie-global-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 0;
            display: table;
            z-index: 310;
            button {
              font-size: 11px;
              display: table-cell;
              box-sizing: border-box;
              color: white;
              height: 18px;
              padding: 0 5px;
              border-radius: 10px;
              background-color: #cecece;
              border: none;
              margin-left: 10px;
              vertical-align: middle;
              text-align: center;
            }
            .isPitch {
              background-color: rgba(255, 177, 72, 0.8);
            }
          }
          .opinion-pie {
            width: 100%;
            height: 300px;
            background: white;
            position: relative;
          }
        }
        .opinion-line {
          width: 100%;
          height: 300px;
          background: white;
          position: relative;
        }
      }
    }
    .op-sreen.pie-line-sreen {
      .nextsreen {
        .vux-tab-wrap {
          .vux-tab-container {
            .vux-tab {
              .vux-tab-item {
                text-align: left;
              }
              .vux-tab-bar-inner {
                margin: 0;
              }
            }
          }
        }
      }
    }
    .op-sreen {
      height: auto;
      box-sizing: border-box;
      // position: relative;
      padding: 0 12px;
      .sreen-cont {
        width: 100%;
        height: 48px;
        font-size: 0;
        border-bottom: 0.5px solid #e3e3e3;
        display: flex;
        .nextsreen {
          width: 45%;
          .mint-navbar {
            height: 100%;
            .mint-tab-item {
              display: inline-block;
              flex: none;
              margin-right: 18px;
              padding: 16px 0 12px 0;
              -webkit-transition: border-bottom-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: border-bottom-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              .mint-tab-item-label {
                font-size: 15px;
              }
            }
            .is-selected {
              border-bottom: 2px solid #ffb148;
              color: #ffb148;
              font-family: PingFangSC-Medium, sans-serif;
              margin-bottom: 0;
              -webkit-transition: border-bottom-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: border-bottom-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
          }
        }
        button {
          //  flex: 1;
          height: 100%;
          display: table-cell;
          vertical-align: middle;
          font-size: 15px;
          border: 0;
          background: transparent;
          color: #8d8d8d;
          i {
            /*color: #ffb148;*/
            font-size: 12px;
            font-weight: bold;
          }

          span {
            font-size: 12px;
          }
          .filler {
            font-size: 15px;
            color: #323232;
          }
        }
        button:first-child {
          text-align: left;
          i {
            display: inline-block;
            vertical-align: middle;
            transition: transform .3s, -webkit-transform .3s;
            transform: rotate(0deg);
          }
          .trarm {
            transition: transform .3s, -webkit-transform .3s;
            transform: rotate(180deg);
          }
        }
        button:last-child {
          text-align: right;
        }
      }
      .column {
        position: absolute;
        background: white;
        top: 44px;
        left: 0;
        width: 100%;
        height: 60px;
        font-size: 0;
        box-sizing: border-box;
        transition: transform .3s, -webkit-transform .3s;
        transform: rotateY(0);
        z-index: 1200;
        display: flex;
        i {
          position: absolute;
          top: 0;
          left: 25%;
          height: 0;
        }
        .column-right {
          left: initial;
          right: 25%;
        }
        i:before {
          position: relative;
          top: -5px;
          left: 25%;
          content: '';
          height: 0;
          width: 0;
          display: block;
          border: 6px transparent solid;
          border-left-width: 5px;
          border-right-width: 5px;
          border-top-width: 0;
          border-bottom-color: rgba(255, 255, 255, 1);
        }
        button {
          flex: 1;
          border: 0;
          background-color: white;
          height: 100%;
          color: #8d8d8d;
          font-size: 15px;
          text-align: center;
          vertical-align: middle;
        }
      }
    }
    .op-list {
      ul {
        list-style-type: none;
        li:active {
          background-color: #f0f1f5;
          -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        li {
          padding: 0 12px;
          list-style-type: none;
          -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          .li-div-item {
            width: 100%;
            .lists-item {
              width: 100%;
              padding: 12px 0;
              box-sizing: border-box;
              font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
              font-size: 15px;
              color: #323232;
              letter-spacing: 0.2px;
              display: flex;
              display: -webkit-flex;
              align-items: center;
              line-height: 19px;
              text-align: justify;
              .affichedate {
                float: right;
                color: #aeaeae;
                font-size: 12px;
              }
            }
            p {
              font-size: 15px;
              color: #323232;
              span {
                font-size: 12px;
              }
              b {
                font-size: 12px;
              }

            }
            p:first-child {
              padding-top: 10px;
            }
            .last-p {
              padding-bottom: 10px;
              color: #aeaeae;
              * {
                color: #aeaeae;
              }
            }
            b {
              font-weight: normal;
            }
          }
        }
      }
    }
  }
</style>
