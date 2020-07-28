<template>
  <div id="supervise">
    <div class="content">
      <el-row :gutter="12">
        <el-col :span="24">
          <el-card class="box-card" shadow="never" body-style="padding:0">
            <div class="box-wrapper">
              <h4 class="card-title">
                <span v-if="!userInfo.superviseUser">{{projectTitle}} </span>
                <span v-else="userInfo.superviseUser">
                  <v-regulatorCompany :placement="'bottom-start'"></v-regulatorCompany>
                </span>
                <span>（ 今日舆情：{{dailyTotal}}</span>&nbsp;&nbsp;<span>本月舆情：{{monthlyTotal}} ）</span>
                <div class="button-group" v-if="!userInfo.superviseUser">
                  <el-button type="text" icon="el-icon-edit-outline" size="mini" @click="editProject">编辑项目</el-button>
                </div>
              </h4>
              <div style="clear:both"></div>
              <p class="sub-title">关键词 ：{{keywordsDisplay}}</p>
              <!-- 图表 -->
              <section class="chart-group">
                <div class="left">
                  <div class="radio-group">
                    <el-radio-group v-model="distributedDateType">
                      <el-radio border size="mini" label="1">按日</el-radio>
                      <el-radio border size="mini" label="2">按周</el-radio>
                      <el-radio border size="mini" label="3">按月</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="chart-left">
                    <div id="pieChart" v-if="pieData"></div>
                    <p style="margin:40%" v-else>暂无数据</p>
                  </div>
                </div>
                <div class="right">
                  <div class="radio-group">
                    <el-radio-group v-model="countDateType">
                      <el-radio border size="mini" label="7">前7天</el-radio>
                      <el-radio border size="mini" label="30">前30天</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="chart-right">
                    <div id="lineChart" v-if="lineData"></div>
                    <p style="margin:40%" v-else>暂无数据</p>
                  </div>
                </div>
              </section>
              <el-tabs class="news-tab" v-model="activeTab">
                <el-tab-pane class="infinite-scroll-pane" label="新闻" name="sentiment">
                  <ul class="news-list" v-if="keywords.length > 0">
                    <li v-for="news in newsData.list" :key="news.id">
                      <a :href="news.uri" target="_blank">
                        <h5 class="news-title"><span :class="sentimentClass(news.tendency)">{{news.tendency?news.tendency:'中性'}}</span>{{news.title}}
                        </h5>
                        <span class="desc" v-line-clamp:22="1" v-if="news.describe">{{news.describe.trim()}}</span>
                        <p>{{news.media}} {{news.createdStr}}</p>
                      </a>
                    </li>
                    <span v-if="newsData.list.length===0" class="no-results">暂无数据</span>
                    <infinite-loading @infinite="infiniteScrollHandler('sentiment',...arguments)">
                      <!-- <span class="no-results" slot="no-results">暂无数据</span> -->
                      <span class="no-more" slot="no-more">已经到底了</span>
                    </infinite-loading>
                  </ul>
                </el-tab-pane>

                <el-tab-pane class="infinite-scroll-pane" label="公告" name="announcement">
                  <ul class="news-list">
                    <li v-for="news in announcementData.list" :key="news.mainId">
                      <a href="javascript:;" @click="goDetail('/affiche/details',news.mainId)">
                        <h5 class="news-title">{{news.title}}</h5>
                        <span class="desc" v-line-clamp:22="1" v-if="news.content">{{news.content.trim()}}</span>
                        <p>{{$common.transTime(news.releaseDate)[0]}} | {{news.marketType}}</p>
                      </a>
                    </li>
                    <span v-if="announcementData.list.length===0" class="no-results">暂无数据</span>
                    <infinite-loading @infinite="infiniteScrollHandler('announcement',...arguments)">
                      <!-- <span class="no-results" slot="no-results">暂无数据</span> -->
                      <span class="no-more" slot="no-more">已经到底了</span>
                    </infinite-loading>
                  </ul>
                </el-tab-pane>
                <el-tab-pane class="infinite-scroll-pane" label="研报" name="report">
                  <ul class="news-list" v-if="this.companyInfo.sw2014">
                    <li v-for="report in reportData.list" :key="report.id">
                      <a href="javascript:;" @click="goDetail('/report/details',report.id)">
                        <h5 class="news-title">{{report.subject}}</h5>
                        <span class="desc" v-line-clamp:22="1" v-if="report.summary">{{report.summary.trim()}}</span>
                        <p>
                          <span v-if="report.sentDate">{{$common.transTime(report.sentDate)[0]}}</span>
                          <span v-if="report.securitiesCompany">| {{report.securitiesCompany}}</span>
                          <span v-if="report.author">| {{report.author}}</span>
                          <span v-if="report.levelTwo">| {{report.levelTwo}}</span>
                          <span v-if="report.rating">| {{report.rating}}</span>
                        </p>
                      </a>
                    </li>
                    <span v-if="reportData.list.length===0" class="no-results">暂无数据</span>
                    <infinite-loading @infinite="infiniteScrollHandler('report',...arguments)">
                      <!-- <span class="no-results" slot="no-results">暂无数据</span> -->
                      <span class="no-more" slot="no-more">已经到底了</span>
                    </infinite-loading>
                  </ul>
                </el-tab-pane>
                <el-tab-pane class="infinite-scroll-pane" :label="eName" name="interact">
                  <ul class="news-list">
                    <li v-for="item in interactData.list" :key="item.id">
                      <router-link class="a-link" :to="'/investor/answer?id='+item.id" style="cursor:pointer;"
                                   target="_blank">
                        <h5 class="news-title">{{item.question}}</h5>
                        <span class="desc line-2" v-line-clamp:44="2" v-if="item.answer">{{item.answer.trim()}}</span>
                        <p>
                          <span>{{$common.transTime(item.questionTime)[1]}}</span>
                          <span>| {{item.companyName}}</span>
                          <span>| {{item.userName}}</span>
                        </p>
                      </router-link>
                    </li>
                    <span v-if="interactData.list.length===0" class="no-results">暂无数据</span>
                    <infinite-loading @infinite="infiniteScrollHandler('interact',...arguments)">
                      <!-- <span class="no-results" slot="no-results">暂无数据</span> -->
                      <span class="no-more" slot="no-more">已经到底了</span>
                    </infinite-loading>
                  </ul>
                </el-tab-pane>
                <el-tab-pane class="infinite-scroll-pane" label="论坛" name="bbs">
                  <ul class="news-list">
                    <li v-for="news in bbsData.list" :key="news.id">
                      <a :href="news.uri" target="_blank">
                        <h5 class="news-title"><span :class="sentimentClass(news.tendency)">{{news.tendency}}</span>{{news.title}}
                        </h5>
                        <span class="desc" v-line-clamp:22="1" v-if="news.describe">{{news.describe.trim()}}</span>
                        <p>{{news.media}} {{news.createdStr}}</p>
                      </a>
                    </li>
                    <span v-if="bbsData.list.length===0" class="no-results">暂无数据</span>
                    <infinite-loading @infinite="infiniteScrollHandler('bbs',...arguments)">
                      <!-- <span class="no-results" slot="no-results">暂无数据</span> -->
                      <span class="no-more" slot="no-more">已经到底了</span>
                    </infinite-loading>
                  </ul>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="编辑舆情项目" :visible.sync="editProjectDialogVisible" width="500px">
      <el-form>
        <el-form-item>
          <el-input placeholder="项目名称(请不要超过30个字符)" v-model="editProjectForm.projectName">
            <template slot="prepend">项目名称</template>
          </el-input>
        </el-form-item>
        <el-form-item v-for="(item, index) in editProjectForm.keywords" :key="index">
          <el-autocomplete v-model="editProjectForm.keywords[index]" :fetch-suggestions="querySearchAsync"
                           :trigger-on-focus="false" placeholder="您感兴趣的关键词(请不要超过30个字符)" :disabled="index<2"
                           @keyup.native="keywordChange">
            <template slot="prepend">关键词{{index+1}}</template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editProjectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProject" :loading="isUpdating">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import InfiniteLoading from "vue-infinite-loading";
  export default {
    name: "supervise",
    components: {
      InfiniteLoading
    },
    data() {
      return {
        eName: "e互动",
        userId: "",
        userInfo: {},
        companyName: "",
        companyCode: "",
        distributedDateType: "1",
        countDateType: "7",
        mediaSummaryGroup: [],
        dailySummary: [],
        weekSummary: [],
        pieData: [],
        lineData: [],
        displayMode: "private",
        announcementData: {
          currentPage: 1,
          list: []
        },
        newsData: {
          currentPage: 1,
          list: []
        },
        bbsData: {
          currentPage: 1,
          list: []
        },
        reportData: {
          currentPage: 1,
          list: []
        },
        interactData: {
          currentPage: 1,
          list: []
        },
        lineX: [],
        activeTab: "sentiment",
        addNewProjectDialogVisible: false,
        editProjectDialogVisible: false,
        keywords: [],
        activeProject: "",
        newProjectForm: {
          projectName: "",
          keywords: []
        },
        editProjectForm: {
          projectName: "",
          keywords: []
        },
        currentProject: {},
        projectTitle: "",
        dailyTotal: "0",
        monthlyTotal: "0",
        isUpdating: false,
        companyInfo: {},
        companyItem: {} // 监管选中公司
      };
    },
    computed: {
      keywordsDisplay() {
        return this.keywords.join("、");
      }
    },
    mounted() {
    },
    created() {
      this.eName = this.$config.eName();
      this.userId = this.$cookie.get("userId");
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      if (this.userInfo.enterpriseUser) {
        this.initData()
      } else {
        this.userInfo.enterpriseCompanyFullCode = this.$route.query.companyCode
        this.initDataSupervise()
      }
    },
    methods: {
      initData() {
        if (this.userInfo.companyId === null || this.userInfo.companyId === "") {
          this.$message({
            showClose: true,
            type: "error",
            message: "非公司用户！"
          });
        } else {
          this.newsData = {
            currentPage: 1,
            list: []
          };
          this.bbsData = {currentPage: 1, list: []};
          this.announcementData = {currentPage: 1, list: []};
          this.reportData = {currentPage: 1, list: []};
          this.interactData = {currentPage: 1, list: []};
          this.distributedDateType = "1";
          this.countDateType = "7";
          this.$http({
            method: "GET",
            url: this.$api.manage.companyInfo,
            params: {
              companyId: this.userInfo.companyId
            }
          }).then(res => {
            if (res.data.returnCode === 1) {
              let {companyCode} = res.data.returnObject;
              this.companyCode = companyCode;
              this.getProjectData()
                .then(res => {
                  this.getSentimentSummary(this.keywords.join(","));
                  this.getSentimentData("sentiment", this.keywords.join(","));
                  this.getSentimentData("bbs", this.keywords.join(","));
                  this.getAnnouncementData();
                  this.getCompanyInfo().then(() => {
                    this.getReportData();
                  })
                  this.getInteractData();
                })
                .catch(err => {
                });
            }
          });
        }
      },
      getProjectData() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.sentiment.getProjectByCompanyId,
            params: {
              companyId: this.userInfo.companyId
            }
          })
            .then(res => {
              this.currentProject = res.data.returnObject[0];
              this.projectTitle = this.currentProject.projectName;
              this.keywords = [...this.currentProject.keywordList].map(
                e => e.keywordName
              );
              if (this.keywords.length < 3) {
                this.keywords.push("");
              }
              this.editProjectForm = {
                projectId: this.currentProject.id,
                projectName: this.currentProject.projectName,
                keywords: this.keywords
              }
              resolve(null);
            })
            .catch(err => reject);
        });
      },
      // 监管用户初始化代码
      initDataSupervise () {
        this.newsData = {
          currentPage: 1,
          list: []
        };
        this.bbsData = {currentPage: 1, list: []};
        this.announcementData = {currentPage: 1, list: []};
        this.reportData = {currentPage: 1, list: []};
        this.interactData = {currentPage: 1, list: []};
        this.distributedDateType = "1";
        this.countDateType = "7";
        // 获取所有监管公司
        this.$http({
          url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
          method: "GET",
          params: {
            userId: this.userId
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let companyObj = res.data.returnObject
            companyObj.forEach(item => {
              if (this.$route.query.companyCode == item.companyFullCode) {
                this.companyItem = item
              }
            })
            // this.currentProject = res.data.returnObject[0];
            this.companyCode = this.companyItem.companyCode
            this.projectTitle = this.companyItem.companyName;
            this.keywords = [this.companyItem.companyName, this.companyItem.companyCode, this.companyItem.companyFullName]

            this.editProjectForm = {
              projectId: '',
              projectName: this.projectTitle,
              keywords: this.keywords
            }
            this.getSentimentSummary(this.keywords.join(","));
            this.getSentimentData("sentiment", this.keywords.join(","));
            this.getSentimentData("bbs", this.keywords.join(","));
            this.getAnnouncementData();
            this.getCompanyInfo().then(() => {
              this.getReportData();
            })
            this.getInteractData();
          }
        })
      },

      // deleteProject(id) {
      //   this.$confirm("确定删除该项目?", "提示", {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning",
      //       center: true
      //     })
      //     .then(() => {
      //       this.$http({
      //           method: "POST",
      //           url: `${this.$api.sentiment.deleteProject}`,
      //           params: {
      //             userId: this.userId,
      //             projectId: id
      //           }
      //         })
      //         .then(res => {
      //           if (res.data.returnCode == 1) {
      //             this.$message({
      //               type: "success",
      //               message: "删除成功"
      //             });
      //             this.initData();
      //           } else {
      //             this.$message({
      //               type: "error",
      //               message: "删除失败"
      //             });
      //           }
      //         })
      //         .catch(err => {});
      //     })
      //     .catch(err => {});
      // },
      editProject() {
        this.editProjectDialogVisible = true;
      },
      updateProject() {
        this.isUpdating = true;
        let keywords = [...this.editProjectForm.keywords].filter(s => s.trim() !== "").join(",");
        if (this.editProjectForm.projectName.trim() === "") {
          this.$message({
            type: "error",
            message: "项目名称不能为空"
          });
          this.editProjectForm.projectName = this.currentProject.projectName;
          this.isUpdating = false;
          return;
        }
        if (this.editProjectForm.projectName.length > 30) {
          this.$message({
            type: "error",
            message: "项目名过长，请不要超过30个字符"
          });
          this.isUpdating = false;
          return;
        }
        if (this.editProjectForm.keywords[2].length > 30) {
          this.$message({
            type: "error",
            message: "关键字过长，请不要超过30个字符"
          });
          this.isUpdating = false;
          return;
        }
        this.currentProject.projectName = this.editProjectForm.projectName;
        this.currentProject.keywordList = this.editProjectForm.keywords.map(
          e => ({keywordName: e})
        );
        this.$http({
          url: this.$api.sentiment.updateProject,
          type: "POST",
          params: {
            userId: this.userId,
            projectId: this.editProjectForm.projectId,
            projectName: this.editProjectForm.projectName,
            keyword: keywords,
            isMonitor: true,
            isNotice: false
          }
        })
          .then(res => {
            this.isUpdating = false;
            if (res.data.returnCode == 1) {
              this.editProjectDialogVisible = false;
              this.initData();
              this.$message({
                type: "success",
                message: "更新成功"
              });
            } else {
              this.isUpdating = false;
              this.$message({
                type: "error",
                message: "更新失败"
              });
            }
          })
          .catch(err => {
            this.isUpdating = false;
          });
      },

      getSentimentData(source, keyword) {
        return new Promise((resolve, reject) => {
          let pageNo =
            source === "sentiment"
              ? this.newsData.currentPage
              : this.bbsData.currentPage;
          this.$http({
            method: "GET",
            url: this.$api.sentiment.getSentimentData,
            params: {
              type: source,
              keyword: keyword,
              pageNo: pageNo,
              pageSize: 10
            }
          })
            .then(res => {
              if (res.data.returnCode == 1 || res.data.returnCode == 200) {
                if (res.data.returnObject.data.length > 0) {
                  if (source === "sentiment") {
                    this.newsData.list = this.newsData.list.concat(
                      res.data.returnObject.data
                    );
                    this.newsData.currentPage += 1;
                  } else if (source === "bbs") {
                    this.bbsData.list = this.bbsData.list.concat(
                      res.data.returnObject.data
                    );
                    this.bbsData.currentPage += 1;
                  }
                  resolve("loaded");
                } else {
                  resolve("complete");
                }
              }
            })
            .catch(reject);
        });
      },
      //
      getAnnouncementData() {
        return new Promise((resolve, reject) => {
          if (this.companyCode) {
            this.$http({
              method: "GET",
              url: this.$api.affiche.afficheSearch,
              params: {
                companyCode: this.companyCode,
                pageNum: this.announcementData.currentPage,
                pageSize: 10
              }
            }).then(res => {
              if (res.data.returnCode == 1 || res.data.returnCode == 200) {
                if (res.data.returnObject.list.length > 0) {
                  this.announcementData.list = this.announcementData.list.concat(
                    res.data.returnObject.list
                  );
                  this.announcementData.currentPage += 1;
                  resolve("loaded");
                } else {
                  resolve("complete");
                }
              }
            });
          } else {
            resolve("complete");
          }
        });
      },
      getCompanyInfo() {
        return new Promise((resolve, reject) => {
          let enterpriseCompanyFullCode = this.userInfo.enterpriseCompanyFullCode
          this.$http({
            method: "GET",
            url: this.$api.company.getCompanyInfo,
            params: {
              companyCode: enterpriseCompanyFullCode.toString().substr(2) + "." + enterpriseCompanyFullCode.toString().substr(0, 2)
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.companyInfo = res.data.returnObject
              this.companyInfo.sw2014 = res.data.returnObject.sw2014.replace(/\//g, ',')
              resolve(this.companyInfo.sw2014)
            }
          })
        });
      },

      getReportData() {
        // this.getCompanyInfo().then((status) => {
        return new Promise((resolve, reject) => {
          if (this.companyCode) {
            this.$http({
              method: "GET",
              url: this.$api.report.searchReport,
              params: {
                pageNum: this.reportData.currentPage,
                pageSize: 10,
                industry: this.companyInfo.sw2014
              }
            }).then(res => {
              if (res.data.returnCode == 1 || res.data.returnCode == 200) {
                if (
                  res.data.returnObject != null &&
                  res.data.returnObject.length > 0
                ) {
                  this.reportData.list = this.reportData.list.concat(
                    res.data.returnObject
                  );
                  this.reportData.currentPage += 1;
                  resolve("loaded");
                } else {
                  resolve("complete");
                }
              }
            });
          } else {
            resolve("complete");
          }
        });
        // })
      },
      //
      getInteractData() {
        return new Promise((resolve, reject) => {
          if (this.companyCode) {
            this.$http({
              method: "GET",
              url: this.$api.investor.search,
              params: {
                pageNo: this.interactData.currentPage,
                pageSize: 10,
                companyCode: this.companyCode
              }
            }).then(res => {
              if (res.data.returnCode == 1 || res.data.returnCode == 200) {
                if (res.data.returnObject) {
                  if (res.data.returnObject.list.length > 0) {
                    this.interactData.list = this.interactData.list.concat(
                      res.data.returnObject.list
                    );
                    this.interactData.currentPage += 1;
                    resolve("loaded");
                  } else {
                    resolve("complete");
                  }
                }
              }
            });
          } else {
            resolve("complete");
          }
        });
      },
      //
      getSentimentSummary(keyword) {
        this.$http({
          method: "GET",
          url: this.$api.sentiment.getSentimentSummary,
          params: {
            type: "bbs,sentiment",
            keyword: keyword
          }
        })
          .then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.mediaSummaryGroup[0] = res.data.returnObject.mediaSummaryDay;
              this.mediaSummaryGroup[1] = res.data.returnObject.mediaSummaryWeek;
              this.mediaSummaryGroup[2] = res.data.returnObject.mediaSummaryMonth;
              this.dailySummary = res.data.returnObject.dailySummary;
              this.weekSummary = res.data.returnObject.weekSummary;
              if (
                this.dailySummary[this.dailySummary.length - 1].date ==
                this.$common.transTime(new Date().getTime())[1]
              ) {
                this.dailyTotal = this.dailySummary[this.dailySummary.length - 1].docCount;
              }
              this.monthlyTotal = res.data.returnObject.monthTotal;
              this.formatPieData(this.mediaSummaryGroup[0]);
              this.formatLineData();
            }
          })
          .catch(err => {
          });
      },
      //
      getCompanyCodeByKeyword(keyword) {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.affiche.autoCompleteA,
            params: {
              key: keyword
            }
          })
            .then(res => {
              let result = "";
              if (res.data.returnCode == 1 || res.data.returnCode == 200) {
                if (res.data.returnObject.length > 0) {
                  result = res.data.returnObject[0].fullCode;
                }
              }
              resolve(result);
            })
            .catch(reject);
        });
      },
      //
      sentimentClass(tendency) {
        return {
          "sentiment-label": true,
          positive: tendency === "正面",
          neutral: tendency === "中性" || tendency == null,
          negative: tendency === "负面"
        };
      },
      //
      keywordChange(e) {
        // 过滤逗号输入
        this.editProjectForm.keywords = [...this.editProjectForm.keywords].map(
          e => e.trim().replace(/[,，]/, "")
        );
      },
      //
      initPieEchart(id) {
        let myChart = echarts.init(document.getElementById(id));
        let option = {
          legend: {
            top: "bottom",
            textStyle: {
              color: "#8d8d8d"
            }
          },
          grid: {
            bottom: "10%"
          },
          backgroundColor: "#f9f9f9",
          tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)"
          },
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
          ],
          series: [
            {
              type: "pie",
              radius: "55%",
              center: ["50%", "40%"],
              label: {
                formatter: "{d}%",
                textStyle: {
                  color: "#8d8d8d"
                }
              },
              labelLine: {
                lineStyle: {
                  color: "#8d8d8d"
                }
              },
              data: this.pieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        myChart.setOption(option, true);
      },
      //
      initlineChart(id) {
        let myChart = echarts.init(document.getElementById(id));
        let option = {
          tooltip: {
            trigger: "axis"
          },
          grid: {
            top: "15%",
            bottom: "20%",
            containLabel: true
          },
          legend: {
            data: ["舆情数量走势"],
            top: "bottom"
          },
          xAxis: {
            type: "category",
            data: this.lineX,
            axisLabel: {
              rotate: 30,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#8d8d8d"
              }
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            axisTick: {
              lineStyle: {
                color: "#8d8d8d"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#8d8d8d"
              }
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: "舆情数量走势",
              type: "line",
              label: {
                show: false
              },
              symbol: "circle",
              symbolSize: 8,
              itemStyle: {
                normal: {
                  color: "#8ec8fe"
                }
              },
              data: this.lineData,
              markPoint: {
                data: [
                  {
                    type: "max",
                    name: "最大值"
                  },
                  {
                    type: "min",
                    name: "最小值"
                  }
                ]
              }
            }
          ]
        };
        myChart.setOption(option, true);
      },
      //
      formatPieData(data) {
        this.pieData = [];
        const obj = {
          name: "其他",
          value: 0
        };
        data.forEach((item, index) => {
          if (index >= 9) {
            obj.value = obj.value + item.docCount;
          } else {
            this.pieData.push({
              name: item.mediaName,
              value: item.docCount
            });
          }
        });
        if (data.length >= 9) {
          this.pieData.push(obj);
        }
        this.initPieEchart("pieChart");
      },
      //
      formatLineData() {
        if (this.countDateType == "7") {
          const data = this.weekSummary;
          this.lineData = [];
          this.lineX = [];
          data.forEach((item, index) => {
            this.lineData.push(item.docCount);
            this.lineX.push(item.date);
          });
        } else if (this.countDateType == "30") {
          const data = this.dailySummary;
          this.lineData = [];
          this.lineX = [];
          data.forEach((item, index) => {
            this.lineData.push(item.docCount);
            this.lineX.push(item.date);
          });
        }
        this.initlineChart("lineChart");
      },
      //
      infiniteScrollHandler(source, $state) {
        if (source === "sentiment" || source === "bbs") {
          this.getSentimentData(source, this.keywords.join(","))
            .then(status => {
              setTimeout(() => {
                if (status === "loaded") {
                  $state.loaded();
                } else if (status === "complete") {
                  $state.complete();
                }
              }, 1000);
            })
            .catch(err => {
            });
        }
        if (source === "announcement") {
          this.getAnnouncementData()
            .then(status => {
              setTimeout(() => {
                if (status === "loaded") {
                  $state.loaded();
                } else if (status === "complete") {
                  $state.complete();
                }
              }, 1000);
            })
            .catch(err => {
            });
        }
        if (source === "report") {
          this.getReportData()
            .then(status => {
              setTimeout(() => {
                if (status === "loaded") {
                  $state.loaded();
                } else if (status === "complete") {
                  $state.complete();
                }
              }, 1000);
            })
            .catch(err => {
            });
        }
        if (source === "interact") {
          this.getInteractData()
            .then(status => {
              setTimeout(() => {
                if (status === "loaded") {
                  $state.loaded();
                } else if (status === "complete") {
                  $state.complete();
                }
              }, 1000);
            })
            .catch(err => {
            });
        }
      },
      goDetail(path, id) {
        const {href} = this.$router.resolve({path: path, query: {id: id}});
        window.open(href, "_blank");
      },
      querySearchAsync(queryString, cb) {
        this.$http({
          method: "GET",
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: queryString
          }
        }).then(res => {
          const obj = [];
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            console.log(res.data.returnObject);
            let data = res.data.returnObject;
            data.forEach(item => {
              obj.push({
                value: item.name,
                code: item.code
              });
            });
          }
          cb(obj);
        });
      }
      // addProjectKeyword(isEditing) {
      //   if (isEditing) {
      //     if (this.editProjectForm.keywords.length === 3) {
      //       this.$message({
      //         type: "error",
      //         message: "最多添加3个关键词"
      //       });
      //     } else {
      //       this.editProjectForm.keywords.push("");
      //     }
      //   } else {
      //     if (this.newProjectForm.keywords.length === 3) {
      //       this.$message({
      //         type: "error",
      //         message: "最多添加3个关键词"
      //       });
      //     } else {
      //       this.newProjectForm.keywords.push("");
      //     }
      //   }
      // },
      //   addProject() {
      //     let keywords = [...this.newProjectForm.keywords]
      //       .filter(s => s.trim() !== "")
      //       .join(",");
      //     this.$http({
      //         method: "GET",
      //         url: this.$api.sentiment.addProject,
      //         params: {
      //           userId: this.userId,
      //           projectName: this.newProjectForm.projectName,
      //           keyword: keywords,
      //           isMonitor: true,
      //           isNotice: false
      //         }
      //       })
      //       .then(res => {
      //         if (res.data.returnCode == 1) {
      //           this.addNewProjectDialogVisible = false;
      //           this.getAllProject();
      //           this.$message({
      //             type: "success",
      //             message: "添加成功"
      //           });
      //         } else {
      //           this.$message({
      //             type: "error",
      //             message: "添加失败，请重试！"
      //           });
      //         }
      //       })
      //       .catch(err => {});
      //   },
      //   viewProject(project) {
      //     let keyword = project.keywordList.map(e => e.keywordName).join(",");
      //     this.activeProject = project.id;
      //     this.projectTitle = project.projectName;
      //     this.currentProject = project;
      //     this.keywords = keyword.split(",");
      //     this.activeTab = 'sentiment';
      //     this.newsData.currentPage = 1;
      //     this.newsData.list = [];
      //     this.bbsData.currentPage = 1;
      //     this.bbsData.list = [];
      //     this.announcementData.currentPage = 1;
      //     this.announcementData.list = [];
      //     this.getSentimentSummary(keyword);
      //     this.getSentimentData("sentiment", keyword);
      //     this.getSentimentData("bbs", keyword);
      //     this.getCompanyCodeByKeyword(project.keywordList[0].keywordName).then(companyCode => {
      //       this.companyCode = companyCode;
      //       this.getAnnouncementData();
      //     }).catch(err => {});
      //   }
    },
    watch: {
      distributedDateType(val) {
        if (val) {
          this.formatPieData(this.mediaSummaryGroup[val - 1]);
        }
      },
      countDateType(val) {
        this.formatLineData();
      }
    }
  };
</script>
<style lang="scss">
  #supervise {
    background-color: #f6f6f6;
    min-height: 800px;
    .box-card {
      min-height: 600px;
      width: 100%;
      margin-top: 20px;
      margin-bottom: 20px;
      .box-wrapper {
        padding: 20px 20px;
        .card-title {
          margin: 10px 0;
          font-size: 16px;
          font-weight: 600;
          position: relative;
          line-height: 1;
        }
        .button-group {
          float: right;
        }
        .sub-title {
          color: #909399;
          font-size: 14px;
        }
        .chart-group {
          height: 500px;
          width: 100%;
          background-color: #f9f9f9;
          border: 1px solid #e3e3e3;
          margin: 15px 0;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          .radio-group {
            float: right;
            padding: 10px;
            .el-radio.is-bordered.is-checked {
              background: #ffb148;
            }
            .el-radio--mini.is-bordered {
              padding: 6px 10px 0px 10px;
            }
            .el-radio__input {
              display: none;
            }
            .el-radio__label {
              padding: 0;
            }
            .el-radio__input.is-checked + .el-radio__label {
              color: #fff;
              padding: 0;
            }
          }
          .left {
            width: 50%;
            height: 100%;
            border-right: 1px solid #e3e3e3;
            .chart-left {
              height: 450px;
            }
          }
          .right {
            width: 50%;
            height: 100%;
          }
        }
      }
      .box-item {
        padding: 15px;
        width: 100%;
        border-bottom: 1px solid #ebeef5;
        .box-button {
          width: 100%;
          font-size: 16px;
        }
      }
    }
    // .project-list {
    //   list-style: none;
    //   li {
    //     cursor: pointer;
    //     display: flex;
    //     align-items: center;
    //     &.active {
    //       color: #ffb148;
    //     }
    //     .project-name {
    //       flex: 1;
    //     }
    //     .el-button {
    //       padding: 0;
    //       visibility: hidden;
    //     }
    //     &:hover {
    //       background-color: #efefef;
    //     }
    //     &:hover .el-button {
    //       visibility: visible;
    //     }
    //   }
    // }
    .news-list {
      list-style: none;
      .a-link {
        &:hover {
          color: #ffb148;
        }
      }
      li {
        padding: 10px;
        border-bottom: solid 1px #ebeef5;
        &:last-child {
          border-bottom-width: 0;
        }
        &:hover {
          background-color: #efefef;
        }
        .news-title {
          margin: 0 0 4px 0;
          .sentiment-label {
            display: inline-block;
            width: 30px;
          font-size: 12px;
            text-align: center;
            color: #f7f7f7;
            margin-right: 4px;
          height: 18px;
          transform: scale(.8);
          border-radius: 2px;
            &.positive {
            background-color: #29da89;
            }
            &.neutral {
              background-color: #ffb148;
            }
            &.negative {
            background-color: #fa4319;
            }
          }
        }
        .desc {
          &.line-2 {
            height: 44px;
          }
          height: 22px;
          line-height: 22px;
          margin: 6px 0 4px 0;
          // overflow: hidden;
          // display: -webkit-box;
          color: #aeaeae;
          font-size: 12px;
          vertical-align: middle;
          // -webkit-box-orient: vertical;
          // -webkit-line-clamp: 1;
          // word-wrap: break-word;
          // height: 26px;
          // widows: 100%;
          // text-overflow: ellipsis;
          // overflow: hidden;
          // white-space: nowrap;
        }
        p {
          font-size: 12px;
          color: #aeaeae;
        }
      }
    }
    .radio-group-container {
      padding: 10px;
      border-bottom: 1px solid #ebeef5;
      .el-radio-group {
        width: 100%;
        .el-radio-button {
          width: 50%;
          .el-radio-button__inner {
            width: 100%;
          }
        }
      }
    }
    .no-more,
    .no-results {
      display: block;
      padding: 10px;
      color: #aeaeae;
      text-align: center;
    }
    .infinite-scroll-pane {
      max-height: 500px;
      overflow: auto;
    }
    .el-input-group__append {
      background-color: #ffb148;
      color: #fff;
      font-size: 16px;
    }

    #pieChart,
    #lineChart {
      height: 400px;
      width: 100%;
      margin-top: 50px;
    }
    .el-autocomplete {
      width: 100%;
    }
    .el-input-group__prepend {
      width: 100px;
    }
  }
</style>
