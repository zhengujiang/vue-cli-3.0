<template>
  <div id="sentimentMonitorReport">
    <div id="company-header">
      <div class="content">
        <div class="company-title-only">
          <h2>公司舆情报告</h2>
        </div>
      </div>
    </div>
    <div id="company-body">
      <div class="content">
        <div class="el-row">
          <div class="el-col el-col-6">
            <div class="el-card company-card-nopadding">
              <div class="company-card-header">
                <div class="company-card-input">
                  <label>报告日期</label>
                  <el-date-picker v-model="selectDateVal" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                  type="date"
                                  placeholder="选择日期" style="width: 176px;" :editable="false"
                                  :clearable="false"></el-date-picker>
                </div>

                <div class="company-card-title">可比公司</div>
              </div>
              <div class="company-card-body" v-loading="planLoading">
                <div class="aside-left-list" style="min-height: 375px;">
                  <div class="aside-list-header">
                    <span class="list-header-title">股票代码</span>
                    <span class="list-header-title">公司名称</span>
                    <span class="list-header-page">
                                         <v-page v-show="!companyNoInfo" :flip="pageCompany.flip"
                                                 :total="pageCompany.total" v-on:addition="additionCompany"
                                                 v-on:subtraction="subtractionCompany"></v-page>
                                     </span>
                  </div>
                  <ul>
                    <li v-for="(item,index) in compareCompanyInfo" :key="index">
                      <div class="list-content-left list-content-sm">{{item.code}}</div>
                      <div class="list-content-left list-content-sm">{{item.name}}</div>
                      <div class="list-content-right list-content-xs">
                        <a @click="deleteCompareCompany(index)"><i class="iconfont web-shanchu"></i></a>
                      </div>
                    </li>
                    <no-info v-show="companyNoInfo" :altText="noInfoCompany" style="min-height: 340px;"></no-info>
                  </ul>
                </div>
                <div class="card-aside-btn">
                  <el-button v-if="!disabledBtn" class="btn-make-plan" type="warning" @click="generateReport()">
                    一键生成报告
                  </el-button>
                  <el-button v-else="!disabledBtn" disabled class="btn-make-plan" type="warning">
                    一键生成报告
                  </el-button>
                </div>

              </div>
            </div>
          </div>
          <div class="el-col el-col-18">

            <div class="el-col el-col-24">
              <div class="el-card company-card-nopadding" v-loading="tableLoading">
                <div class="company-card-header">
                  <div class="company-card-title">报告列表</div>
                </div>
                <div class="company-card-body" style="min-height: 480px;">

                  <table class="card-table">
                    <thead>
                    <tr>
                      <th width="60">序号</th>
                      <th width="300">报告名称</th>
                      <th width="160">报告生成日期</th>
                      <th width="200">状态</th>
                      <th width="80">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(td,index) in tableData" :key="index">
                      <td>{{index + 1}}</td>
                      <td>{{td.reportName}}</td>
                      <td>{{td.createTime.substr(0,10)}}</td>
                      <td v-if="td.status == '1'" class="status">已生成</td>
                      <td v-else="td.status" class="status highlight">生成中</td>

                      <td>
                        <!--<a :href="td.reportUrl">-->
                        <i class="iconfont web-download" @click="downloadReport(index)"></i>
                        <!--</a>-->
                        <i class="split"></i>
                        <i v-if="td.isDelete == '0'" class="iconfont web-shanchu" @click="deleteReport(index)"></i>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <no-info v-show="tableNoInfo" :altText="noInfoTable" style="min-height: 440px;"></no-info>
                  <div class="pagination" v-show="!tableNoInfo">
                    <div class="block" style="width: 100%;padding: 20px;position: relative;">
                      <el-pagination background
                                     @current-change="selectPage"
                                     layout="prev, pager, next"
                                     :current-page="pageReport.flip"
                                     :page-count="pageReport.total">
                      </el-pagination>

                      <div class="pageSizeBox" v-if="pageReport.pageSize == '30'">
                        <a class="pageSizeBtn pageSizeLeft active" @click="changePageSize('30')">30条</a>
                        <a class="pageSizeBtn pageSizeRight" @click="changePageSize('50')">50条</a>
                      </div>
                      <div class="pageSizeBox" v-else-if="pageReport.pageSize == '50'">
                        <a class="pageSizeBtn pageSizeLeft " @click="changePageSize('30')">30条</a>
                        <a class="pageSizeBtn pageSizeRight active" @click="changePageSize('50')">50条</a>
                      </div>
                      <div class="pageSizeBox" v-else="pageReport.pageSize">
                        <a class="pageSizeBtn pageSizeLeft " @click="changePageSize('30')">30条</a>
                        <a class="pageSizeBtn pageSizeRight" @click="changePageSize('50')">50条</a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  import VPage from '@/components/customPage.vue'
  import NoInfo from "../../components/noInfo.vue";

  export default {
    name: "sentimentMonitorReport",
    mixins: [mixins],
    components: {
      VPage,
      NoInfo
    },
    data() {
      return {
        userId: "",
        userInfo: {},
        companyName: "",
        companyCode: "",
        pageCompany: {
          flip: 1,
          total: 1,
          pageSize: 10
        },
        pageReport: {
          flip: 1,
          total: 50,
          pageSize: 30
        },
        selectDateVal: '',
        compareCompanyInfo: [],
        tableData: [],
        companyNoInfo: false,
        tableNoInfo: false,
        noInfoCompany: '没有可比公司',
        noInfoTable: '没有已生成报告',
        planLoading: false,
        tableLoading: false,
        disabledBtn: false,
        pickerOptions: {
          disabledDate(time) {
            var stringTime = "2018-02-28";
            var timestamp2 = Date.parse(new Date(stringTime));
            return time.getTime() < timestamp2 || time.getTime() > Date.now()
          }
        }
      }
    },
    computed: {},
    created() {
      this.userId = this.$cookie.get("userId");
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));

      if (this.userInfo.enterpriseUser) {
        this.companyCode = this.userInfo.enterpriseCompanyCode;
        this.companyName = this.userInfo.enterpriseCompanyName;
      } else {
        this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
      }

      this.selectDateVal = this.getNowFormatDate(new Date());

      this.getCompareCompanyData();
      this.getTableData();
    },
    watch: {
      pageCompany: {
        handler() {
          this.getCompareCompanyData();
        },
        deep: true
      },
      pageReport: {
        handler() {
          this.getTableData();
        },
        deep: true
      },
      disabledBtn(val) {
        if (val == true) {
          console.log("生成状态", this.disabledBtn)
          this.getTableData();
          let timer = setInterval(() => {
            if (this.tableData[0].status == "1") {
              clearTimeout(timer);
            } else {
              this.getTableData();
            }
          }, 1000);
        }
      }
    },
    methods: {
      getNowFormatDate(date) {
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      // 获取可比公司数据
      getCompareCompanyData() {
        var _this = this;
        _this.planLoading = true;
        this.$axios.sentiment.getCompanyCompare({
          companyId: _this.userInfo.companyId,
          pageNum: _this.pageCompany.flip,
          pageSize: _this.pageCompany.pageSize
        }).then(function (res) {
          _this.planLoading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject == null || res.data.returnObject == '') {
              _this.companyNoInfo = true;
              _this.compareCompanyInfo = '';
            } else {
              _this.compareCompanyInfo = res.data.returnObject;
              _this.pageCompany.total = Math.ceil(res.data.total / res.data.rows);
            }
          } else if (res.data.returnCode == 500) {
            _this.$message('Request failed with status code 500');
          }
        }, function (response) {
        })
      },
      // 删除可比公司数据
      deleteCompareCompanyData(index) {
        var _this = this;
//                var data = {
//                    userId: this.userId,
//                    companyId: this.userInfo.companyId,
//                    companyCode: this.compareCompanyInfo[index].code
//                }
//                var qs = require('querystring')
//                this.$http.post('http://dev.in-hope.com.cn/zuul/enterpriseCompany/deleteCompanyCompare', qs.stringify(data), {
//                    emulateJSON: true
        this.$axios.sentiment.deleteCompanyCompare({
          userId: this.userId,
          companyId: this.userInfo.companyId,
          companyCode: this.compareCompanyInfo[index].code
        }).then(function (res) {
          // console.log(res.data.returnObject)
          if (res.data.returnCode == 200) {
            _this.$message({
              type: 'success',
              message: '删除成功!'
            });
            _this.pageCompany.flip = 1;
            _this.getCompareCompanyData();
          } else if (res.data.returnCode == -1) {
            _this.$message.error('删除失败，请重试');
          } else if (res.data.returnCode == 201) {
            _this.$message({
              type: 'warning',
              message: '仅限管理员操作!'
            });
          }
        }, function (response) {
        })
      },
      deleteCompareCompany(index) {
        this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCompareCompanyData(index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 获取生成报告列表
      getTableData() {
        var _this = this;
        _this.tableLoading = true;
        this.$axios.sentiment.report({
          userId: _this.userId,
          companyId: _this.userInfo.companyId,
          pageNum: _this.pageReport.flip,
          pageSize: _this.pageReport.pageSize
        }).then(function (res) {
          _this.tableLoading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject.length == 0) {
              _this.tableNoInfo = true;
              _this.tableData = '';
            } else {
              _this.tableNoInfo = false;
              _this.tableData = res.data.returnObject;
              _this.pageReport.total = Math.ceil(res.data.total / res.data.rows);
            }
          } else if (res.data.returnCode == 500) {
            _this.$message('Request failed with status code 500');
          }
        }, function (response) {
        })
      },
      // 生成报告
      generateReport() {
        var _this = this;
        _this.disabledBtn = true;
        this.$axios.sentiment.generateSentimentReport({
          userId: _this.userId,
          companyId: _this.userInfo.companyId,
          reportDate: _this.selectDateVal
        }).then(function (res) {
          if (res.data.returnMsg == "success") {
            _this.$message({
              message: '报告生成成功',
              type: 'success'
            });
            // _this.getTableData();
            _this.disabledBtn = false;
          }
        }, function (response) {
        })

        if (_this.tableNoInfo == true) {
          this.getTableData();
          // _this.tableNoInfo == false;
        }
      },
      // 删除报告
      deleteReportData(index) {
        var _this = this;
        this.$axios.sentiment.sentimentReportLogDel({
          userId: this.userId,
          id: this.tableData[index].id
        }).then(function (res) {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            _this.$message({
              type: 'success',
              message: '删除成功!'
            });
            _this.pageReport.flip = 1;
            _this.getTableData();
          }
        }, function (response) {
        })
      },
      downloadReport(index) {
        let url = this.tableData[index].reportUrl

        this.$common.openWindow(url);
      },
      deleteReport(index) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteReportData(index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 页数加一
      additionCompany() {
        if (this.pageCompany.flip < this.pageCompany.total) {
          this.pageCompany.flip += 1
        }
      },
      // 页数减一
      subtractionCompany() {
        if (this.pageCompany.flip > 1) {
          this.pageCompany.flip -= 1
        }
      },
      // 选择页数
      selectPage(e) {
        this.pageReport.flip = e
        this.loading = true
      },
      changePageSize(page) {
        this.pageReport.pageSize = page;
        this.pageReport.flip = 1;
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
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      }
    }
    .company-card-nopadding {
      margin: 10px;
      padding: 10px 0 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      }
    }
    .company-card-header {
      border-bottom: 1px solid #E3E3E3;
      padding-bottom: 8px;
      overflow: hidden;
    }
    .company-card-nopadding .company-card-header {
      padding: 0 15px 10px;
    }
    .company-card-header {
      .company-card-title {
        float: left;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        font-weight: 800;
        color: #323232;
      }
      .company-card-link {
        float: right;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
      .company-card-input {
        margin-bottom: 15px;
        label {
          margin-right: 5px;
        }
      }
    }
    .company-card-body {
      overflow: hidden;
      padding-top: 10px;
    }
    .company-card-nopadding .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
  }
  .btn-make-plan {
    width: 100%;
    height: 34px;
    line-height: 12px;
    border: none;
    border-radius: 4px;
    background: #FFB148;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
  }
  .company-card-nopadding .aside-list-header {
    background: #F8F8F8;
    padding: 12px 15px;
    font-size: 12px;
    color: #8D8D8D;
    .list-header-num {
      display: inline-block;
      width: 30px;
      padding-left: 5px;
    }
    .list-header-title {
      display: inline-block;
      width: 70px;
      text-align: center;
    }
  }
  .company-card-body .aside-left-list {
    .list-content-left {
      display: inline-block;
      text-align: center;
      color: #8D8D8D;
      font-size: 12px;
    }
    border-bottom: 1px solid #D8D8D8;
    .aside-list-header {
      height: 34px;
      line-height: 34px;
      padding: 0;
      .list-header-title {
        width: 80px;
      }
      .list-header-page {
        float: right;
        margin-right: 12px;
        span {
          color: #545454;
          margin: 0 6px;
          font-size: 14px;
          position: relative;
          top: 1px;
        }
      }
    }
    li {
      width: 100%;
      height: 34px;
      line-height: 34px;
      padding: 0;
    }
    .list-content-left {
      display: inline-block;
      text-align: center;
      color: #8D8D8D;
      font-size: 12px;
    }
    .list-content-right {
      position: relative;
      left: 65px;
      display: inline-block;
      text-align: center;
      color: #8D8D8D;
      font-size: 12px;
    }
    .list-content-xs {
      width: 40px;
    }
    .list-content-sm {
      width: 80px;
    }
    .iconfont {
      display: none;
    }
    li {
      &:hover, &.active {
        background: #F8F8F8;
      }
      &:hover .iconfont, &.active .iconfont {
        display: inline-block;
        cursor: pointer;
      }
    }
  }
  .card-aside-btn {
    margin: 16px 16px 0;
  }
  .btn-make-plan {
    width: 100%;
    height: 34px;
    border: none;
    border-radius: 4px;
    background: #FFB148;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
  }
  #company-body .company-card-header {
    .company-card-link {
      float: right;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      font-weight: 400;
      color: #AEAEAE;
    }
    .company-card-input .iconfont {
      position: absolute;
      left: 110px;
      z-index: 99;
      color: #AEAEAE;
    }
  }
  .card-table {
    width: 100%;
    tr {
      height: 40px;
      line-height: 40px;
    }
    thead {
      background: #F8F8F8;
      font-size: 12px;
      color: #8D8D8D;
      /*padding: 0 15px;*/
      font-weight: 400;
      text-align: left;
      th {
        &:first-child {
          text-align: center;
        }
        &:last-child {
          text-align: center;
        }
      }
    }
    tbody {
      /*margin: 0 15px;*/
      tr {
        &:hover, &.active {
          background-color: #fff3e4;
        }
      }
      td {
        text-align: left;
        font-size: 12px;
        &:first-child {
          /*padding-left: 15px;*/
          text-align: center;
        }
        &:last-child {
          /*padding-right: 15px;*/
          text-align: center;
        }
        &.status {
          color: #AEAEAE;
        }
        &.status:hover {
          color: #FFB148;
        }
        &.highlight {
          color: #FB4319;
        }

        .iconfont {
          color: #AEAEAE;
          cursor: pointer;
        }
        .split {
          width: 1px;
          height: 14px;
          background: #AEAEAE;
          position: relative;
          top: 2px;
          margin: 0 4px;
        }
        .iconfont {
          &:hover, &.active {
            color: #FFB148;
          }
        }
      }
    }

  }
  .el-date-editor input {
    background: #f8f8f8;
  }
  .pageSizeBox {
    float: right;
    position: absolute;
    right: 30px;
    bottom: 20px;
    .pageSizeBtn {
      display: inline-block;
      width: 46px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: #8D8D8D;
      border: 1px solid #E3E3E3;
      cursor: pointer;
      &.active {
        color: #ffffff;
        border: 1px solid #FFB148;
        background: #FFB148;
      }
    }
    .pageSizeLeft {
      position: relative;
      left: 6px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .pageSizeRight {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
</style>
