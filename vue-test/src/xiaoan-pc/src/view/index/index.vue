<template>
  <div id="index">
    <div class="banner vxa-image-index-bg-banner">
      <div class="showContainer">
        <p class="advertisement" v-html="Advertisement"></p>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 法规搜索栏 -->
          <el-tab-pane label="法规" name="first">
            <v-search sort="rule" :inputVal="lawInput" @searchM="goSearchs"></v-search>
            <v-safeWordTip v-show="tipShow[0]"></v-safeWordTip>
            <v-hotSearch sort="rule" @hotClick="hotMethod" :arr="hotArr" @another="getHotSearch"
                         v-show="this.hotArr.length !== 0"></v-hotSearch>

          </el-tab-pane>
          <!-- 公告搜索栏 -->
          <el-tab-pane label="公告" name="second">
            <v-search sort="affiche" :inputVal="afficheInput" :searchCode="inputCode" @searchM="goSearchs"></v-search>
            <v-safeWordTip v-show="tipShow[1]"></v-safeWordTip>
            <v-hotSearch sort="affiche" @hotClick="hotMethod" :arr="hotArr" @another="getHotSearch"
                         v-show="this.hotArr.length !== 0"></v-hotSearch>
          </el-tab-pane>
          <!-- 案例搜索栏 -->
          <el-tab-pane label="案例" name="third">
            <v-search :inputVal="caseInput" :searchCode="caseInputCode" sort="cases" @searchM="goSearchs"></v-search>
            <v-safeWordTip v-show="tipShow[2]"></v-safeWordTip>
            <v-hotSearch sort="case" @hotClick="hotMethod" :arr="hotArr" @another="getHotSearch"
                         v-show="this.hotArr.length !== 0"></v-hotSearch>
          </el-tab-pane>
          <!-- 研报搜索栏 -->
          <el-tab-pane label="研报" name="four">
            <v-search :inputVal="reportInput" :searchCode="reportInputCode" sort="report"
                      @searchM="goSearchs"></v-search>
            <v-safeWordTip v-show="tipShow[3]"></v-safeWordTip>
            <v-hotSearch sort="report" @hotClick="hotMethod" :arr="hotArrReport" @another="getHotSearch"
                         v-show="this.hotArrReport.length !== 0"></v-hotSearch>
          </el-tab-pane>
        </el-tabs>

      </div>
    </div>
    <div class="main" v-show="listHide">
      <div class="arrow vxa-image-index-bg-arrow"></div>
      <div class="content">
        <el-tabs :tab-position="tabPosition" style="height: 200px;">
          <el-tab-pane label="法规">
            <v-list :info="this.info" v-on:linkMethod="linkTo"></v-list>
            <div class="pagination">
              <div class="block" style="width: 100%">
                <el-pagination layout="prev, pager, next" :total="1000">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="公告">
            <v-list :info="this.info" v-on:linkMethod="linkTo"></v-list>
            <div class="pagination">
              <div class="block" style="width: 100%">
                <el-pagination layout="prev, pager, next" :total="200"></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="案例">
            <v-list :info="this.info" v-on:linkMethod="linkTo"></v-list>
            <div class="pagination">
              <div class="block" style="width: 100%">
                <el-pagination layout="prev, pager, next" :total="70">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="问答">
            <v-list :info="this.info" v-on:linkMethod="linkTo"></v-list>
            <div class="pagination">
              <div class="block" style="width: 100%">
                <el-pagination layout="prev, pager, next" :total="100">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <transition name="bounce">
      <div class="welcome" v-show="welcomeShow && !userInfo.enterpriseUser">
        <div class="close-btn" @click="welcomeShow=false"><i class="el-icon-close"></i></div>
        <div class="welcome-box">
          <h1>信公小安 • 企业版</h1>
          <ul class="feature-list">
            <li>获取信息</li>
            <li>学习知识</li>
            <li>提升效率</li>
            <li>洞察市场</li>
          </ul>
          <div class="round-box">来电咨询：021-20740322</div>
          <div class="btn-wrapper">
            <el-button class="apply-btn" type="primary" @click="$router.push('/manage/purchase')">申请试用</el-button>
            <div class="qrcode">
              <div class="qrcode-scan"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import mixins from '@/service/sensitiveWord'
  import list from "../../components/list.vue";
  import search from "../../components/search.vue";
  import hotSearch from "../../components/hotSearch.vue";

  export default {
    mixins: [mixins],
    data() {
      return {
        userInfo: {},
        listHide: false,
        sActive: "index",
        welcomeShow: true,
        Advertisement: "小安，让董办工作更安心",
        info: [
          {
            title: "中华人民共和国民法总则",
            describe:
              "为了提高协助执法工作效率和服务质量，本公司对原协助司法执行业务指南进行了修订。本次修订的主要内容说明如下：\n" +
              "        一、将协助执法机关查询的收费标准调整为免费。\n" +
              "        二、对协助执法机关扣划涉及的印花税、过户费等费用标准进行了调整。\n" +
              "        三、增加了执法机关填写各类执法文书的示例文本，供参考使用。\n" +
              "        三、增加了执法机关填写各类执法文书的示例文本，供参考使用。\n" +
              "        三、增加了执法机关填写各类执法文书的示例文本，供参考使用。",
            issued: "国字【60号】主席令",
            date: "2017年11月1日",
            timeliness: "",
            plate: ["沪主", "深主", "深创"]
          }
        ],
        tab: [
          {item: "首页", isSelect: true, to: "/"},
          {item: "法规", isSelect: false, to: "rule"},
          {item: "公告", isSelect: false, to: "affiche"},
          {item: "案例", isSelect: false, to: "case"},
          {item: "研报", isSelect: false, to: "report"}
        ],
        list: [
          {name: "法规", show: true, tab: "rule"},
          {name: "公告", show: false, tab: "affiche"},
          {name: "案例", show: false, tab: "case"},
          {name: "研报", show: false, tab: "report"}
        ],
        hotArr: [],
        hotArrReport: [
          "农林牧渔",
          "金融工程",
          "投资策略",
          "宏观经济",
          "固定收益"
        ],
        activeName: "first",
        tabPosition: "left",
        lawInput: "",
        afficheInput: "",
        caseInput: "",
        caseInputCode: "",
        reportInput: "",
        reportInputCode: "",
        inputCode: "",
        windowH: document.body.clientHeight,
        showItem: ""
      };
    },
    // 使用其它组件
    components: {
      "v-list": list,
      "v-search": search,
      "v-hotSearch": hotSearch
    },
    // 方法
    computed: {
      isLogin: function () {
        return this.$store.state.isLogin;
      }
    },
    watch: {
      windowH(val) {
        this.windowH = val;
        this.bannerH();
      },
      "$store.state.searchCode": function (val) {
        this.inputCode = val;
        console.log("val-=-=", val);
      }
    },
    // 生命周期函数
    created() {
      if (window.localStorage) {
        let storage = window.localStorage;
        if (storage.adTimestamp) {
          let time = storage.adTimestamp;
          let now = Date.parse(new Date());
          if (this.$common.transTime(now)[0] == this.$common.transTime(time)[0]) {
            // this.welcomeShow = false;
          } else {
            storage.setItem("adTimestamp", now);
          }
        } else {
          storage.setItem("adTimestamp", Date.parse(new Date()));
        }
      }
      if (this.$cookie.get("userInfo")) {
        this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      }
      this.isActive = this.$route.meta.tabName;
      this.showItem = this.$store.state.column;
      this.checkInviteCode();
    },
    mounted() {
      this.getHotSearch(this.showItem);
      this.bannerH();
      if (this.showItem == "affiche") {
        this.activeName = "second";
        this.afficheInput = this.$store.state.searchText;
        this.inputCode = this.$store.state.searchCode;
        // console.log('vuex = ', this.$store.state, this.inputCode, this.afficheInput)
      } else if (this.showItem == "rule") {
        this.activeName = "first";
        this.lawInput = this.$store.state.searchText;
      } else if (this.showItem == "case") {
        this.activeName = "third";
        this.caseInput = this.$store.state.searchText;
        this.caseInputCode = this.$store.state.searchCode;
      } else if (this.showItem == "report") {
        this.activeName = "four";
        this.reportInput = this.$store.state.searchText;
        this.reportInputCode = this.$store.state.searchCode;
        this.hotArrReport = [
          "农林牧渔",
          "金融工程",
          "投资策略",
          "宏观经济",
          "固定收益"
        ];
      }
      setTimeout(() => {
        this.welcomeShow = false;
      }, 3000);
    },
    methods: {
      /* caseShow() {
        var third = document.getElementById('tab-third')
        if (this.$cookie.get('userId')) {
          third.style.display = 'inline-block'
        } else {
          third.style.display = 'none'
        }
      }, */
      checkInviteCode() {
        let inviteCode =
          this.$route.query.inviteCode || sessionStorage.getItem('inviteCode')
        if (!inviteCode) {
          return false;
        }
        if (!this.$cookie.get("userId")) {
          // this.$cookie.set('inviteCode', inviteCode)
          sessionStorage.setItem('inviteCode', inviteCode)
          this.$router.replace("/login?redirect_url=/index");
          return false;
        }
        this.$http({
          url: this.$api.manage.checkInviteLink,
          method: "GET",
          params: {
            userId: this.$cookie.get("userId"),
            invite: inviteCode
          }
        })
          .then(res => {
            switch (res.data.returnCode) {
              case 200: // 未失效，获取信息成功
                // this.$cookie.remove("inviteCode");
                localStorage.removeItem('inviteCode')
                let companyFullName = res.data.returnObject.companyFullName;
                this.$confirm(
                  `${res.data.returnObject.inviteFromUser}邀请您加入${
                    res.data.returnObject.companyFullName
                    }，是否加入？`,
                  "邀请提示",
                  {
                    confirmButtonText: "加入",
                    cancelButtonText: "拒绝",
                    type: "warning",
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    closeOnHashChange: false,
                    showClose: false
                  }
                )
                  .then(() => {
                    // 接受邀请
                    this.$http({
                      url: this.$api.manage.acceptInvited,
                      method: "POST",
                      params: {
                        userId: this.$cookie.get("userId"),
                        invite: inviteCode
                      }
                    })
                      .then(res => {
                        switch (res.data.returnCode) {
                          case 200:
                            let _this = this;
                            this.$alert(`您已成功加入${companyFullName}`, "", {
                              showClose: false
                            })
                              .then(() => {
                                _this.$auth.reSetUserStore(_this);
                                setTimeout(() => {
                                  _this.$router.replace({path: "/dashboard"});
                                }, 500);
                              })
                              .catch(() => {
                              });
                            break;
                          default:
                            this.$auth.reSetUserStore(this);
                            this.$alert(res.data.returnMsg, "");
                        }
                      })
                      .catch(err => {
                      });
                  })
                  .catch(() => {
                    // 拒绝邀请
                    this.$http({
                      url: this.$api.manage.cancelInvited,
                      method: "POST",
                      params: {
                        userId: this.$cookie.get("userId"),
                        invite: inviteCode
                      }
                    })
                      .then(res => {
                        if (res.data.returnCode == 200) {
                          this.$message({
                            type: "success",
                            message: "拒绝成功"
                          });
                        } else {
                          this.$message({
                            type: "error",
                            message: res.data.returnMsg
                          });
                        }
                      })
                      .catch(err => {
                      });
                  });
                break;
              case 404: // 该链接已失效
                // this.$cookie.remove("inviteCode");
                localStorage.removeItem('inviteCode')
                this.$message({type: "error", message: "该邀请链接已失效"});
                break;
              // case -1: // 获取信息失败
              //   break;
              case 406: // 已加入该公司
                // this.$cookie.remove("inviteCode");
                localStorage.removeItem('inviteCode')
                this.$message({type: "error", message: "你已加入该公司"});
                break;
              default:
                // this.$cookie.remove("inviteCode");
                localStorage.removeItem('inviteCode')
                this.$message({type: "error", message: res.data.returnMsg});
            }
          })
          .catch(err => {
          });
      },
      setStore(value, code) {
        this.$store.commit("INPUTVAL", value);
        this.$store.commit("INPUTCODE", code);
      },
      goSearchs(value, sort, code) {
        this.setStore(value, code);
        if (sort == "affiche") {
          if (this.checkWordSearch(value) || this.checkWordSearch(code)) {
            this.$set(this.tipShow, 1, true)
            return false
          } else {
            this.$set(this.tipShow, 1, false)
          }
          if (value == "" && code == "") {
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写搜索关键词！'})
            this.$router.push({path: "/affiche"});
          } else {
            this.$router.push({
              path: "/affiche",
              query: {inputVal: value, inputCode: code}
            });
          }
        } else if (sort == "rule") {
          if (this.checkWordSearch(value)) {
            this.$set(this.tipShow, 0, true)
            return false
          } else {
            this.$set(this.tipShow, 0, false)
          }
          if (value == "") {
            this.$router.push({path: "/rule"});
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写搜索关键词！'})
          } else {
            this.$router.push({path: "/rule", query: {inputVal: value}});
          }
        } else if (sort == "case") {
          if (this.checkWordSearch(value) || this.checkWordSearch(code)) {
            this.$set(this.tipShow, 2, true)
            return false
          } else {
            this.$set(this.tipShow, 2, false)
          }
          if (value == "" && code == "") {
            this.$router.push({path: "/case"});
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写搜索关键词！'})
          } else {
            this.$router.push({
              path: "/" + sort,
              query: {inputVal: value, inputCode: code}
            });
          }
        } else if (sort == "report") {
          if (this.checkWordSearch(value) || this.checkWordSearch(code)) {
            this.$set(this.tipShow, 3, true)
            return false
          } else {
            this.$set(this.tipShow, 3, false)
          }
          if (value == "" && code == "") {
            this.$router.push({path: "/report"});
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写搜索关键词！'})
          } else {
            this.$router.push({
              path: "/" + sort,
              query: {inputVal: value, inputCode: code}
            });
          }
        }
      },
      getHotSearch(index) {
        var api = this.$api.rule.getHotSearch;
        if (index == "affiche") {
          api = this.$api.affiche.hotSearch;
        } else if (index == "case" || index == "cases") {
          api = this.$api.cases.getCaseHotSearch;
        }
        this.$http({
          methods: "GET",
          url: api
        })
          .then(res => {
            if (res.data.returnCode == 1) {
              this.hotArr = res.data.returnObject;
              // console.log('hotArrReport = ', this.hotArr)
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      hotMethod(index, sort) {
        if (sort == "affiche") {
          this.afficheInput = this.hotArr[index];
          this.setStore(this.afficheInput, this.inputCode);
          this.$nextTick(() => {
            this.$router.push({
              path: "/affiche",
              query: {inputVal: this.afficheInput, inputCode: this.inputCode}
            });
          }, 3000);
        } else if (sort == "rule") {
          this.lawInput = this.hotArr[index];
          this.setStore(this.lawInput, "");
          this.$nextTick(() => {
            this.$router.push({
              path: "/rule",
              query: {inputVal: this.lawInput}
            });
          }, 3000);
        } else if (sort == "case" || sort == "cases") {
          this.caseInput = this.hotArr[index];
          this.setStore(this.caseInput, this.inputCode);
          this.$nextTick(() => {
            this.$router.push({
              path: "/case",
              query: {inputVal: this.caseInput, inputCode: this.inputCode}
            });
          }, 3000);
        } else if (sort == "report") {
          this.reportInput = this.hotArrReport[index];
          this.setStore(this.reportInput, this.inputCode);
          this.$nextTick(() => {
            this.$router.push({
              path: "/report",
              query: {inputVal: this.reportInput, inputCode: this.inputCode}
            });
          }, 3000);
        }
      },
      linkTo(index) {
        this.$message({
          showClose: true,
          type: "success",
          duration: 3000,
          message: index
        });
      },
      selectItem(index) {
        for (let i in this.tab) {
          this.tab[i].isSelect = false;
        }
        this.tab[index].isSelect = true;
        this.$router.push(this.tab[index].to);
      },
      handleClick(tab) {
        console.log("123", tab.index);
        if (tab.index == 1) {
          this.getHotSearch("affiche");
        } else if (tab.index == 2) {
          this.getHotSearch("case");
        } else if (tab.index == 3) {
          this.hotArrReport = [
            "农林牧渔",
            "金融工程",
            "投资策略",
            "宏观经济",
            "固定收益"
          ];
        }
      },
      bannerH() {
        this.windowH = document.documentElement.clientHeight || document.body.clientHeight;
        const that = this;
        window.onresize = function temp() {
          that.windowH = document.documentElement.clientHeight || document.body.clientHeight;
        };
        var footer = document.getElementById("footer").clientHeight;
        var banner = document.getElementsByClassName("banner")[0];
        var index = document.getElementById("index");
        banner.style.height = this.windowH - footer + "px";
        banner.style.minHeight = "580px";
        index.style.height = this.windowH - footer + "px";
        index.style.minHeight = "580px";
      }
    }
  };
</script>
<style lang="scss">
  #index {
    width: 100%;
    height: 100%;
    min-width: 1200px;
    margin-top: -60px;
    .bounce-enter-active {
      animation: bounce-in 1s;
    }
    .bounce-leave-active {
      animation: bounce-out 1s;
    }
    @keyframes bounce-in {
      from {
        visibility: visible;
        opacity: 0.8;
        transform: scale(0.5);
      }
      to {
        visibility: visible;
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes bounce-out {
      from {
        visibility: visible;
        opacity: 1;
      }
      to {
        visibility: hidden;
        opacity: 0;
      }
    }
    .welcome {
      transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
      transform-origin: 50% 20%; // animation: zoomIn 1s forwards .5s;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3500;
      background-color: #fff;
      background-size: cover;
      @media all and (max-height: 1200px) and (min-height: 900px) {
        background-position: 0 -100px;
      }
      background-repeat: no-repeat;
      background-image: url(https://oss.in-hope.cn/xiaoan/web_static/promotion_welcome2.jpg);
      .welcome-box {
        position: absolute;
        top: 19.5%;
        left: 13.5%;
        h1 {
          font-size: 3rem;
          line-height: 1;
          margin-bottom: 10px;
        }
        .round-box {
          display: inline-block;
          font-size: 22px;
          padding: 6px 14px;
          /*height: 40px;*/
          width: auto;
          line-height: 1;
          text-align: center;
          border-radius: 20px;
          font-weight: normal;
          color: #ffac25;
          border: solid 2px #ffac25;
          margin-bottom: 40px;
        }
        .feature-list {
          color: #888;
          font-size: 1.5rem;
          margin: 15px 0;
          li {
            position: relative;
            display: inline-block;
            margin-right: 32px;
            cursor: default;
            &:after {
              display: block;
              content: "";
              position: absolute;
              width: 0;
              height: 20px;
              border-right: solid 2px #888;
              top: 50%;
              right: -20px;
              transform: translateY(-50%);
            }
            &:last-child:after {
              display: none;
            }
          }
        }
      }
      .btn-wrapper {
        display: flex;
      }
      .apply-btn {
        padding: 14px 80px;
        font-size: 20px;
      }
      .close-btn {
        position: absolute;
        width: 48px;
        height: 48px;
        background-color: rgba(0, 0, 0, 0.7);
        text-align: center;
        line-height: 48px;
        color: #fff;
        font-size: 30px;
        font-weight: 600;
        top: 20px;
        right: 20px;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0.5;
        &:hover {
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.7);
        }
      }
      .qrcode {
        position: relative;
        width: 50px;
        height: 50px;
        margin-left: 10px;
        background-image: url(https://oss.in-hope.cn/xiaoan/web_static/promotion_qrcode1.png);
        background-size: cover;
        &:hover {
          background-color: #fff;
          .qrcode-scan {
            display: block;
          }
        }
        .qrcode-scan {
          display: none;
          position: absolute;
          right: -210px;
          top: 0;
          width: 202px;
          height: 232px;
          background-image: url(https://oss.in-hope.cn/xiaoan/web_static/promotion_qrcode2.png);
          background-size: cover;
        }
      }
    }
    .banner {
      width: 100%;
      height: 100%;
      position: relative;
      .showContainer {
        width: 875px;
        margin: 0 auto;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: 20%;
        /* #tab-third {
            display: none;
          } */
        .advertisement {
          text-align: center;
          font-size: 50px;
          color: #fff;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          margin-bottom: 8%;
        }
        .el-tabs {
          width: 100%;
          margin: 0 auto;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          .el-tabs__header {
            margin: 20px 0px 10px;
            .el-tabs__nav-wrap::after {
              height: 0;
            }
            .el-tabs__nav {
              margin-left: 135px;
              .el-tabs__active-bar {
                height: 100%;
                width: 70px;
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAzCAYAAAAqwX72AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZCN0E5NjVDMTRCMTFFNzlENUI5RThCRkM0MTBGQUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZCN0E5NjZDMTRCMTFFNzlENUI5RThCRkM0MTBGQUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkI3QTk2M0MxNEIxMUU3OUQ1QjlFOEJGQzQxMEZBQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkI3QTk2NEMxNEIxMUU3OUQ1QjlFOEJGQzQxMEZBQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Por/UK4AAAFxSURBVHja7JqxSgMxHIfTo6MU30HEV+gsIoi6VHBXcRHcrXWuPoCT0K06OPgAUkRw8RF66ODuoq106KK/P41iqS21Wq9evh98B+GSI3wklwSSWT5+cMqsOBILIufCTEPUxJ64y+oxJ27FtAs7NiAKYl7kIz3KSOmKuShHfvqQ7ixGAf9TBmUqwsHXQQxiEIMYxCAGMYhBDGIQgxiCGMQgBjGIQQxiEIMYxCCGIAYxiEEMYhCDmP8npoGGnryYmBoeenJpYkriCRcfMRclE1MXeXEhmgELaXoH5qL+/vONxZrr3MfLjIniL3S+OMb+5byD+K9XJbtgffKD9hX/jVQu17viaoR21mYnzfuYtuvcvo6/0ebeD/F22jd4z2JFPA5R1+osJbFqJrXzHWYU2Lt1XzeoI8GN2BSvfd5vietQz0qn4rDPClYN/RB5IM4+lc/FftKdyk6AGJtK22LGlzcGTK+gxFhaYtXvQFuT0KE3AQYATv03ifa0b/4AAAAASUVORK5CYII=');
                background-repeat: no-repeat;
                background-color: inherit;
              }
              .el-tabs__item {
                z-index: 5;
                width: 110px;
                height: 50px;
                text-align: center;
                font-size: 20px;
                color: #fff;
                font-weight: normal !important;
                &:last-child {
                  padding-right: 0;
                  padding-left: 0;
                }
              }
              #tab-first {
                width: 90px;
                margin-right: 0;
              }
            }
          }
          .el-tabs__content {
            /*.searchArea {
                width: 100%;
                height: 45px;
                border-radius: 4px;
                overflow: hidden;
                input {
                  display: inline-block;
                  width: 85%;
                  height: inherit;
                  border: 0;
                  -webkit-appearance: none;
                  font-size: 18px;
                  padding-left: 15px;
                  box-sizing: border-box;
                  font-weight: normal!important;
                }
                input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
                  color: #aeaeae;font-weight: 300!important;
                }
                input:-moz-placeholder, textarea:-moz-placeholder {
                  color: #aeaeae;font-weight: 300!important;
                }
                input::-moz-placeholder, textarea::-moz-placeholder {
                  color: #aeaeae;font-weight: 300!important;
                }
                input:-ms-input-placeholder, textarea:-ms-input-placeholder {
                  color: #aeaeae;font-weight: 300!important;
                }
                span {
                  width: 15%;
                  height: 100%;
                  float: right;
                  line-height: 45px;
                  text-align: center;
                  font-size: 20px;
                  color: #fff;
                  font-weight: normal!important;
                  cursor: pointer;
                  background: #ffb147;
                  background: -webkit-linear-gradient(left, #ffb147, #e89423); !* Safari 5.1 - 6.0 *!
                  background: -o-linear-gradient(right, #ffb147, #e89423); !* Opera 11.1 - 12.0 *!
                  background: -moz-linear-gradient(right, #ffb147, #e89423); !* Firefox 3.6 - 15 *!
                  background: linear-gradient(to right, #ffb147, #e89423); !* 标准的语法 *!
                }
              }
              .affiche {
                input {
                  border-radius: 4px;
                  float: left;
                }
                input:first-child {
                  width: 24% !important;
                  margin-right: 1%;
                }
                input:nth-child(2) {
                  width: 60% !important;
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                }
                span {
                  float: left !important;
                  border-top-right-radius: 4px;
                  border-bottom-right-radius: 4px;
                }
              }*/
            .hot {
              margin: 40px auto 0;
              font-size: 16px;
              color: #fff;
              display: inline-block;
              width: 100%;
              height: auto;
              text-align: center;
              .hotTitle,
              ul,
              li,
              .changeAgain {
                display: inline-block;
                margin-right: 10px;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
              }
              .changeAgain {
                cursor: pointer;
                color: #ffb147;
                text-decoration: underline;
              }
              ul {
                margin: 0;
              }
            }
          }
        }
      }
    }
    .main {
      width: 100%;
      min-width: 1200px;
      height: 1040px;
      position: relative;
      background: #f2f1f1;
      padding: 40px 0;
      box-sizing: border-box;
      .arrow {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: -36px;
      }
      .content {
        width: 1200px;
        height: 100%;
        margin-right: auto;
        margin-left: auto;
        .el-tabs {
          height: 100% !important;
          .el-tabs__header {
            width: 200px;
            height: 100%;
            background: #fff;
            border: 1px solid #e3e3e3;
            box-sizing: border-box;
            border-radius: 4px;
            box-sizing: border-box;
            .el-tabs__nav {
              box-sizing: border-box;
              div {
                text-align: center;
                height: 60px;
                line-height: 60px;
                margin: 0 20px;
                -moz-box-shadow: 0px 1px 0px #e3e3e3;
                -webkit-box-shadow: 0px 1px 0px #e3e3e3;
                box-shadow: 0px 1px 0px #e3e3e3;
                box-sizing: border-box;
              }
              .el-tabs__active-bar {
                height: 50px !important;
                width: 3px;
                margin: 5px 0 5px;
                left: 0;
                right: auto;
                border: 0;
              }
              .el-tabs__item {
                color: #8d8d8d;
                font-size: 18px;
              }
              .el-tabs__item.is-active {
                color: #ffb148;
              }
            }
          }
          .el-tabs__nav-wrap::after {
            background-color: #fff;
            display: none;
          }
          .el-tabs__content {
            width: 960px;
            height: 100%;
            float: right;
            box-sizing: border-box;
            .pagination {
              width: 400px;
              height: auto;
              margin: 32px auto 0;
              .btn-prev,
              .btn-next,
              li {
                margin-right: 10px;
                width: 30px;
                height: 30px;
                border-radius: 4px;
                border: 1px solid #e3e3e3;
                box-sizing: border-box;
                padding: 0;
                min-width: 30px;
                .el-icon {
                  font-size: 14px;
                }
              }
              li:last-child {
                margin-right: 0;
              }
              .el-pager {
                li {
                  font-size: 12px;
                  color: #8d8d8d;
                }
                li.active {
                  color: #fff;
                  background: #ffb148;
                }
              }
              .btn-next {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
</style>
