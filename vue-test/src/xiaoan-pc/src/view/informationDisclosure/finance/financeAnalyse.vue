<template>
  <div id="finance-analyse">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card box-card-left" shadow="never" body-style="padding:0">
          <el-form class="box-select" :label-position="'right'" label-width="75px" :model="form">
            <!--<el-form-item class="list" label="报告年份">
              <el-date-picker value-format="yyyy" format="yyyy" class="box" v-model="form.reportYear" type="year" placeholder="选择日期" size="small" disabled></el-date-picker>
            </el-form-item>-->
            <el-form-item label="报告年份">
              <el-select v-model="form.reportYear" placeholder="请选择" size="small">
                <el-option v-for="item in formData.yearSelect" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报告期">
              <el-select v-model="form.reportDate" placeholder="请选择" size="small" disabled>
                <el-option v-for="item in formData.reportDateSelect" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <!--               <div class="bottom-select">
                <span @click="recentlySelect('year')">最近一年</span>
                <span @click="recentlySelect('stage')">最近一期</span>
              </div> -->
            </el-form-item>
            <!--             <el-form-item label="对比公司">
              <el-select v-model="form.compareCompany" placeholder="请选择" size="small">
                <el-option v-for="item in formData.compareCompany" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label-width="0">
              <el-button type="primary" style="width:100%" @click="generateReport" size="small">一键生成报表</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="box-card">
          <h4 class="card-title">生成报表列表</h4>
          <el-table :data="tableData" style="width: 100%" size="small" stripe>
            <el-table-column type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="docName" label="报告名称" width="300">
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">{{$common.transTime(scope.row.generateTime)[2]}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.progress >= 100">已生成</span>
                <div class="progress-bar" v-else>
                  <el-progress :percentage="scope.row.progress" color="#738bff" :show-text="false"></el-progress>
                  <span class="progress-text">生成中</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="info" plain @click="downloadReport(scope.row.fileUrl)" icon="el-icon-download" v-if="scope.row.progress>=100"></el-button>
                <!--                 <el-button size="mini" type="primary" plain icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "finance-analyse",
  data() {
    return {
      userInfo: {},
      form: {
        reportYear: '2017',
        reportDate: "年报",
        compareCompany: ""
      },
      formData: {
        yearSelect: [],
        // [{ label: "2018", value: "2018" },{ label: "2017", value: "2017" }],
        reportDateSelect: [
          { label: "年报", value: "YEAR_REPORT" },
          { label: "第一季度报告", value: "FIRST_QUARTER_REPORT" },
          { label: "中报", value: "CENTER_REPORT" },
          { label: "第三季度报告", value: "THIRD_QUARTER_REPORT" },
          { label: "最新报告", value: "NEW_REPORT" }
        ],
        compareCompany: []
      },
      tableData: [
        // {
        //   number: "01",
        //   name: "同花顺2018年一季度财务报告",
        //   createTime: "2017-12-31 21:30",
        //   status: "已生成",
        //   progress: 100
        // },
        // {
        //   number: "02",
        //   name: "同花顺2018年一季度财务报告",
        //   createTime: "2017-12-31 21:30",
        //   status: "已生成",
        //   progress: 100
        // }
      ]
    };
  },
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"))
    if (this.userInfo.superviseUser) {
      if (this.$route.query.companyCode) {
        this.userInfo.enterpriseCompanyCode = this.$route.query.companyCode.replace('SH', '').replace('SZ', '')
      }
    }
    this.getExportReportTimeList()
    this.getReportList()
  },
  beforeRouteLeave(to, from, next) {
    if (this.tableData.length > 0 && !this.tableData[this.tableData.length - 1].generated) {
      this.$confirm('您的报告还在生成中，确认离开当前页面吗？（预计生成时间：5分钟）').then(() => {
        next()
      }).catch(() => {
        next(false)
      });
    } else {
      next()
    }
  },
  methods: {
    // 点击最近一年 和最新一期
    recentlySelect(type) {
      if (type == "year") {
        // 最近一年
        this.form.reportDate = "YEAR_REPORT";
      } else if (type == "stage") {
        // 最近一期
        this.form.reportDate = "NEW_REPORT";
      }
    },
    getExportReportTimeList() {
      let t = new Date().getTime()
      this.$http({
        method: "GET",
        url: this.$api.disclosure.getExportReportTimeList,
        params: {
          companyCode: this.userInfo.enterpriseCompanyCode,
          t: t,
          userId: this.$cookie.get('userId'),
          type: 'YEAR_FINACIAL_ANALYSIS_REPORT'
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          let timeList = res.data.returnObject || []
          this.form.reportYear = timeList[0]
          timeList.forEach((item) => {
            this.formData.yearSelect.push({ label: item, value: item })
          })
        }
      })
    },
    getReportList() {
      this.$http({
        method: "GET",
        url: this.$api.disclosure.getDocRecordList,
        params: {
          userId: this.$cookie.get('userId'),
          type: 0,
          companyCode: this.userInfo.enterpriseCompanyCode
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          let reportList = res.data.returnObject;
          reportList.forEach(e => {
            if (e.generated) {
              e.progress = 100
            } else {
              e.progress = 0
            }
          });
          if (res.data.returnObject.generated) {
            report.progress = 100;
          }
          this.tableData = reportList;
        }
      }).catch(err => {});
    },
    downloadReport(url) {
      this.$common.openWindow(url);
    },
    // checkReport(docId) {
    //   this.$http({
    //     method: "GET",
    //     url: this.$api.disclosure.checkDocExist,
    //     params: {
    //       docId
    //     }
    //   }).then(res => {}).catch(err => {});
    // },
    generateReport() {
      this.$http({
        method: "GET",
        url: this.$api.disclosure.downloadReport,
        params: {
          userId: this.$cookie.get('userId'),
          reportYear: this.form.reportYear,
          companyCode: this.userInfo.enterpriseCompanyCode,
          type: 0
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          let report = res.data.returnObject;
          report.progress = 0;
          this.tableData.push(report);
          let reportIdx = this.tableData.findIndex(e => e.id === report.id);
          let timer = setInterval(() => {
            if (this.tableData[reportIdx].progress == 100) {
              clearTimeout(timer);
            } else {
              this.$http({
                method: "GET",
                url: this.$api.disclosure.checkDocExist,
                params: {
                  docId: report.id
                }
              }).then(res => {
                if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                  if (!res.data.returnObject.generated) {
                    if (this.tableData[reportIdx].progress < 50) {
                      this.$set(this.tableData[reportIdx], 'progress', this.tableData[reportIdx].progress + Math.random() * 2);
                    } else if (this.tableData[reportIdx].progress < 90) {
                      this.$set(this.tableData[reportIdx], 'progress', this.tableData[reportIdx].progress + Math.random() * 1);
                    } else if (this.tableData[reportIdx].progress < 99) {
                      this.$set(this.tableData[reportIdx], 'progress', this.tableData[reportIdx].progress + 0.02);
                    }
                  } else {
                    this.$set(this.tableData[reportIdx], 'progress', 100);
                    this.$set(this.tableData[reportIdx], 'generated', true);
                    this.$set(this.tableData[reportIdx], 'fileUrl', res.data.returnObject.fileUrl);
                  }
                }
              }).catch(err => {});
            }
          }, 1000);
        }
      }).catch(err => {});
      // this.$set(this.tableData[0], 'progress', 0);
      // this.$http({
      //   method: "GET",
      //   url: this.$api.disclosure.downloadReport,
      //   params: {
      //     companyCode: this.userInfo.enterpriseCompanyCode,
      //     reportYear: this.form.reportYear,
      //     type: 0
      //   },
      //   timeout: 180 * 1000
      // }).then(res => {
      //   if (res.data.returnCode == 200 || res.data.returnCode == 1) {
      //     this.$set(this.tableData[0], 'progress', 100);
      //   }
      // }).catch(err => {});
    },
    handleDelete(index, row) {
      this.$confirm("确认删除该报告？")
        .then(() => {})
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
#finance-analyse {
  min-height: 600px;
  width: 100%;
  .box-card {
    margin-bottom: 12px;
    min-height: 700px;
    .el-form-item {
      &:last-child {
        margin-top: 20px;
        border-bottom-width: 0;
      }
      margin: 0;
      padding: 10px 0;
      border-bottom: solid 1px #ebeef5;
    }
    &.box-card-left {
      min-height: 600px;
    }
    .el-date-editor {
      width: 100%;
    }
    .box-select {
      padding: 10px 12px 0 12px;
      width: 100%;
      .el-select {
        width: 100%;
      }
    }
    .bottom-select {
      padding-top: 10px;
      font-size: 12px;
      line-height: 1;
      color: #aeaeae;
      span {
        padding-right: 10px;
        cursor: pointer;
        &:active {
          color: #ffb148;
          transition: 0.03s;
        }
      }
    }
    .card-title {
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: 600;
      padding-left: 10px;
      position: relative;
      border-left: solid 4px #ffb148;
      line-height: 1;
    }
    .progress-bar {
      display: flex;
      align-items: center;
      .el-progress {
        width: 80px;
        margin-right: 10px;
      }
      .progress-text {
        color: #c0c4cc;
      }
    }
    .el-button--info.is-plain {
      color: #738bff;
      border-color: transparent;
      background-color: #eaeeff;
      padding: 6px;
      &:hover {
        color: #fff;
        background-color: #738bff;
      }
    }
    .el-button--primary.is-plain {
      color: #ffac25;
      border-color: transparent;
      background-color: #f9edd9;
      &:hover {
        color: #fff;
        background-color: #ffac25;
      }
    }
    .el-button--primary.is-plain {
      border-color: transparent;
    }
  }
}
</style>
