<template>
  <div id="finance-financials">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card" shadow="never" body-style="padding:0">
          <el-form class="box-select" :label-position="'right'" label-width="75px" :model="formLabelAlign">
            <el-form-item class="list" label="起始日期">
              <el-select class="box" @change="formAlignStartChange" v-model="formLabelAlign.startTime" placeholder="请选择" size="small">
                <el-option v-for="item in formSelectData.startData" :key="item.value" :label="item.label"
                           :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="list" label="截止日期">
              <el-select class="box" @change="formAlignEndChange" v-model="formLabelAlign.endTime" placeholder="请选择" size="small">
                <el-option v-for="item in formSelectData.endData" :key="item.value" :label="item.label"
                           :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="list" label="财报类型">
              <el-select calss="box" v-model="formLabelAlign.type" @change="formAlignAllTypeChange" placeholder="请选择" size="small">
                <el-option v-for="item in formSelectData.typeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="list" label="报告期">
              <el-checkbox-group v-model="formLabelAlign.allDate">
                <el-checkbox v-for="item in formSelectData.selectData" :key="item.value" :label="item.value" :value="item.value" @change="formAlignAllDateChange">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card shadow="never" class="box-card" v-loading='isLoading'>
          <div class="columnar-box">
            <!--echart 数据图形-->
            <div class="card-title">
              {{type}} <span class="sub-text">{{headerSubtext}}</span>
              <div class="unit">
                单位:
                <el-select v-model="moneyUnit" size="mini" class="unit-select">
                  <el-option v-for="item in moneyUnits" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div id="barEchart"></div>
          </div>
          <div class="columnar-table">
            <ul class="columnar-table-head">
              <li class="left">科目复选框，至多选三项 </li>
              <li class="right">
                <el-checkbox v-model="hideBlankRow" @change="handleHideBlankRowChange">隐藏空数据项</el-checkbox>
              </li>
              <li>
                <el-pagination class="pagination-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page.sync="currentPage" layout="prev, next" :page-size="1" :total="totalPage">
                </el-pagination>
              </li>
            </ul>
            <div>
              <el-table :data="tableData" border size="small" :row-class-name="setRoleClassName">
                <el-table-column label="科目/年度" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checkbox" @change="handleSelectionChange(scope.$index)"></el-checkbox>
                    <span class="check-label" :title="fullNames[scope.$index]" @click="handleCheckLabelClick(scope.$index)">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-for="(col,index) in tableTimeData" v-if="index>=-1+currentPage && index<=5+currentPage" show-overflow-tooltip :key="col" :label="col" align="right" :render-header="renderTableHeader">
                  <template slot-scope="scope">
                    <span :title="fullNames[index]">
                      {{scope.row.data[index]}}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "finance-financials",
  data() {
    return {
      collapseActive: "focus",
      formLabelAlign: {
        startTime: "",
        endTime: "",
        type: "BALANCE_STATEMENT",
        allDate: ["YEAR_REPORT", "NEW_REPORT"]
      },
      typeFormatter: {
        'BALANCE_STATEMENT': '资产负债表',
        'INCOME_STATEMENT': '利润表',
        'CASHFLOW_STATEMENT': '现金流量表'
      },
      type: '资产负债表',
      formSelectData: {
        startData: [],
        endData: [],
        typeData: [
          { label: "资产负债表", value: "BALANCE_STATEMENT" },
          { label: "利润表", value: "INCOME_STATEMENT" },
          { label: "现金流量表", value: "CASHFLOW_STATEMENT" }
        ],
        selectData: [
          { label: "年报", value: "YEAR_REPORT" },
          { label: "第一季度报告", value: "FIRST_QUARTER_REPORT" },
          { label: "中报", value: "CENTER_REPORT" },
          { label: "第三季度报告", value: "THIRD_QUARTER_REPORT" },
          { label: "最新报告", value: "NEW_REPORT" }
        ]
      },
      hideBlankRow: true, // 行为空不显示
      // 类目
      tableTimeData: [],
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      totalPage: 1,
      checkedItemArr: [],
      chartSeries: [],
      moneyUnit: "wan",
      chineseUnit: "",
      moneyUnits: [{
          label: "亿元",
          value: "yi"
        },
        {
          label: "万元",
          value: "wan"
        },
        {
          label: "元",
          value: "yuan"
        }
      ],
      isLoading: false,
      userInfo: {},
      bolderDataList: [],
      fullNames: []
    };
  },
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
    if (this.userInfo.superviseUser) {
      if (this.$route.query.companyCode) {
        this.userInfo.enterpriseCompanyFullCode = this.$route.query.companyCode
      }
    }
    if (this.userInfo.enterpriseCompanyFullCode) {
      // 处理数据
      this.getExportReportTimeList()
      // this.inception();
      // this.listFinancialData();
    }

  },
  mounted() {},
  methods: {
    // 获得可选日期
    getExportReportTimeList() {
      let t = new Date().getTime()
      this.$http({
        method: "GET",
        url: this.$api.disclosure.getExportReportTimeList,
        params: {
          companyCode: this.userInfo.enterpriseCompanyCode,
          t: t,
          userId: this.$cookie.get('userId'),
          type: 'COMPANY_FINACIAL_REPORT'
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          let data = res.data.returnObject;
          let arr = [];
          for (let item of data) {
            let obj = {
              label: item,
              value: item,
              disabled: false
            }
            arr.push(obj);
          }
          let data1 = [...data].reverse();
          let arr1 = [];
          for (let item of data1) {
            let obj1 = {
              label: item,
              value: item,
              disabled: false
            }
            arr1.push(obj1);
          }
          this.formSelectData.startData = arr1;
          this.formSelectData.endData = arr;
          this.formLabelAlign.startTime = this.formSelectData.startData[0].value;
          this.formLabelAlign.endTime = this.formSelectData.endData[0].value;
          this.formSelectData.endData.forEach((end, i1) => {
            end.disabled = false;
            if (this.formLabelAlign.startTime > end.value) {
              end.disabled = true;
            }
          });
          this.listFinancialData();
        }
      })
    },
    // data
    listFinancialData() {
      this.isLoading = true;
      this.chartSeries = [];
      this.$http({
          method: "GET",
          url: this.$api.indicator.listFinancialData,
          params: {
            reportDates: this.formLabelAlign.allDate.toString(),
            reportType: this.formLabelAlign.type.toString(),
            startYear: this.formLabelAlign.startTime,
            endYear: this.formLabelAlign.endTime,
            hideBlankRow: this.hideBlankRow,
            fullCode: this.userInfo.enterpriseCompanyFullCode
          }
        })
        .then(res => {
          this.isLoading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.tableData = [];
            let { data, columns, titles, bolds, fullNames } = res.data.returnObject;
            this.fullNames = fullNames
            let boldIndexArr = [];
            bolds.forEach(item => {
              let index = data.findIndex(e => e[0] == item);
              boldIndexArr.push(index);
            });
            this.tableTimeData = [...titles.slice(2)].map(e => e.substr(0, 7));
            data.forEach((item, i) => {
              let row = {
                checkbox: false,
                name: item[1],
                data: [...item.slice(2, item.length)].map(
                  e => (e === null ? "--" : e.toString())
                )
              };
              if (i < 3) {
                row.checkbox = true;
              }
              this.tableData.push(row);
            });
            if (this.tableTimeData.length > 6) {
              this.totalPage = this.tableTimeData.length - 6;
            } else {
              this.totalPage = 1;
            }
            this.changeUnit();
            if (!this.checkedItemArr.length) {
              this.updateChartSeries(0);
              this.updateChartSeries(1);
              this.updateChartSeries(2);
            } else {
              this.syncChartSeries();
            }
            this.barEchart("barEchart");
            console.log("boldIndexArr:", boldIndexArr);
            this.bolderDataList = boldIndexArr;
          } else {
            this.tableTimeData = [];
            this.tableData = [];
          }
        })
        .catch(res => {
          this.isLoading = false;
        });
    },
    // 初始处理方法
    inception() {
      var timestamp = Date.parse(new Date()); // 当前时间戳
      let date = new Date(); // 当前时间OBJ
      let year = date.getFullYear(); // 当前年份
      let toDate = this.$common.getTimestampms(year + "-03-31");
      //
      let toYear = year;
      let yearArr = [],
        sortArr = [];
      if (timestamp > toDate) {
        // 有1季报
        for (let i = 4; i--;) {
          yearArr.push({ label: toYear - i, value: toYear - i });
          sortArr.unshift({ label: toYear - i, value: toYear - i });
        }
      } else {
        // 没有一季报
        toYear -= 1;
        for (let i = 4; i--;) {
          yearArr.push({ label: toYear - i, value: toYear - i });
          sortArr.unshift({ label: toYear - i, value: toYear - i });
        }
      }
      this.formSelectData.startData = yearArr;
      this.formSelectData.endData = sortArr;
      this.formLabelAlign.startTime = yearArr[0].value;
      this.formLabelAlign.endTime = sortArr[0].value;
    },
    formAlignStartChange(val) {
      if (val > this.formLabelAlign.endTime) {
        this.formLabelAlign.endTime = val;
      }
      //
      this.formSelectData.endData.forEach((end, i1) => {
        end.disabled = false;
        if (this.formLabelAlign.startTime > end.value) {
          end.disabled = true;
        }
      });
      this.listFinancialData();
    },
    //
    formAlignEndChange(val) {
      console.log("end", val);
      if (this.formLabelAlign.startTime > val) {
        this.formLabelAlign.endTime = this.formLabelAlign.startTime;
      }
      this.listFinancialData();
    },
    //
    formAlignAllDateChange(val) {
      this.listFinancialData();
    },
    formAlignAllTypeChange(val) {
      this.type = this.typeFormatter[val]
      this.checkedItemArr = [];
      this.listFinancialData();
    },
    //
    formAlignRemoveTagChange(val) {
      this.listFinancialData();
    },
    //
    handleHideBlankRowChange(val) {
      this.checkedItemArr = [];
      this.listFinancialData();
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    // 自定义表头
    renderTableHeader(h, { column, $index }) {
      if ($index === 1) {
        return h(
          "span", {
            class: {
              "column-custom-header": true
            }
          }, [
            h("span", {}, column.label),
            h(
              "span", {
                class: {
                  "notification-dot": true
                }
              },
              ""
            )
          ]
        );
      }
      return column.label;
    },
    barEchart(id, data) {
      let myChart = echarts.init(document.getElementById(id));
      let _this = this;
      let txt = this.chineseUnit == '元' ? this.chineseUnit : `${this.chineseUnit}元`;
      let option = {
        title: [{
          text: `单位：${txt}`,
          top: 16,
          right: 20,
          textStyle: {
            fontSize: 10,
            fontWeight: 400,
            color: "#8d8d8d"
          }
        }],
        backgroundColor: "rgb(250,249,251)",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'，
          }
        },
        legend: {
          data: this.checkedItemArr,
          align: "right",
          right: 100,
          top: 15,
          textStyle: {
            fontSize: 10,
            fontWeight: 400,
            color: "#8d8d8d"
          }
        },
        grid: {
          left: "3%",
          right: "0%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [{
          type: "category",
          data: this.xAxisData,
          axisLabel: {
            textStyle: {
              color: "#8d8d8d",
              fontSize: 10
            },
            formatter(value, index) {
              if (index === _this.xAxisData.length - 1) {
                return `${value}{a|}`;
              } else {
                return value;
              }
            },
            rich:{
              a:{
                width:6,
                height:6,
                backgroundColor:'#ffb148',
                borderRadius:3
              }
            }
          },
          axisTick: {
            length: 0
          },
          axisLine: {
            lineStyle: {
              color: "#8d8d8d"
            }
          }
        }],
        yAxis: [{
          axisLabel: {
            textStyle: {
              color: "#8d8d8d",
              fontSize: 10
            }
          },
          axisTick: {
            length: 0
          },
          axisLine: {
            symbolSize: [0, 0],
            lineStyle: {
              color: "#8d8d8d"
            }
          }
        }],
        color: ["rgb(119,138,251)", "rgb(255,177,72)", "rgb(105,217,189)"],
        series: this.chartSeries.map(e => {
          return Object.assign(e, { data: e.data.reverse() });
        })
      };
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option, true);
    },
    updateChartSeries(rowIndex) {
      const row = JSON.parse(JSON.stringify(this.tableData[rowIndex]));
      if (row.checkbox) {
        this.checkedItemArr.push(row.name);
        this.chartSeries.push(row);
        this.$set(
          this.chartSeries[this.checkedItemArr.length - 1],
          "type",
          "bar"
        );
        this.chartSeries[this.chartSeries.length - 1].data.forEach(
          (d, index) => {
            this.$set(
              this.chartSeries[this.chartSeries.length - 1].data,
              index,
              d.replace(/,/g, "")
            );
          }
        );
      } else {
        let index = this.checkedItemArr.findIndex(e => e == row.name);
        this.checkedItemArr.splice(index, 1);
        this.chartSeries.splice(index, 1);
      }
    },
    handleSelectionChange(rowIndex) {
      const row = this.tableData[rowIndex];
      if (this.checkedItemArr.length < 3) {
        this.updateChartSeries(rowIndex);
        this.barEchart("barEchart");
      } else {
        if (row.checkbox) {
          this.$message({
            type: "error",
            message: "最多三个选项"
          });
          this.$set(row, "checkbox", false);
        } else {
          let index = this.checkedItemArr.findIndex(e => e == row.name);
          this.checkedItemArr.splice(index, 1);
          this.chartSeries.splice(index, 1);
          this.barEchart("barEchart");
        }
      }
    },
    handleCheckLabelClick(rowIndex) {
      const row = this.tableData[rowIndex];
      this.$set(
        this.tableData[rowIndex],
        "checkbox", !this.tableData[rowIndex].checkbox
      );
      if (this.checkedItemArr.length < 3) {
        this.updateChartSeries(rowIndex);
        this.barEchart("barEchart");
      } else {
        if (row.checkbox) {
          this.$message({
            type: "error",
            message: "最多三个选项"
          });
          this.$set(row, "checkbox", false);
        } else {
          let index = this.checkedItemArr.findIndex(e => e == row.name);
          this.checkedItemArr.splice(index, 1);
          this.chartSeries.splice(index, 1);
        }
      }
    },
    // 判断数据行是否为空
    ifDataLineIsNull() {
      const data = this.tableData;
      data.forEach(row => {
        row.isNull = true;
        for (let i in row.data) {
          if (row.data[i] / 1) {
            row.isNull = false;
            continue;
          }
        }
      });
    },
    // 单位转换
    changeUnit() {
      this.chineseUnit = "";
      if (this.moneyUnit == "yi") {
        this.tableData.forEach((row, rIndex) => {
          this.chineseUnit = "亿";
          row.data.forEach((d, dIndex) => {
            let str = this.$common.yiUnit(d);
            if (str != "--") {
              this.$set(
                this.tableData[rIndex].data,
                dIndex,
                str.split("亿")[0]
              );
            }
          });
        });
      } else if (this.moneyUnit == "wan") {
        this.tableData.forEach((row, rIndex) => {
          this.chineseUnit = "万";
          row.data.forEach((d, dIndex) => {
            let str = this.$common.wanUnit(d);
            // str = str.replace(/,/, '')
            if (str != "--") {
              this.$set(
                this.tableData[rIndex].data,
                dIndex,
                str.split("万")[0]
              );
            }
          });
        });
      } else {
        this.tableData.forEach((row, rIndex) => {
          this.chineseUnit = "元";
          row.data.forEach((d, dIndex) => {
            let str = this.$common.abs(d);
            // str = str.replace(/,/, '')
            if (str != "--") {
              this.$set(
                this.tableData[rIndex].data,
                dIndex,
                str.split("元")[0]
              );
            }
          });
        });
      }
    },
    // 同步图表数据
    syncChartSeries() {
      this.chartSeries = [];
      for (let i in this.checkedItemArr) {
        let index = this.tableData.findIndex(
          row => row.name == this.checkedItemArr[i]
        );
        const row = JSON.parse(JSON.stringify(this.tableData[index]));
        this.chartSeries.push(row);
        this.$set(this.chartSeries[this.chartSeries.length - 1], "type", "bar");
        this.chartSeries[this.chartSeries.length - 1].data.forEach(
          (d, index) => {
            this.$set(
              this.chartSeries[this.chartSeries.length - 1].data,
              index,
              d.replace(/,/g, "")
            );
          }
        );
      }
      // this.barEchart("barEchart");
    },
    // 给表单行赋值
    setRoleClassName(row) {
      let bolderStr = "," + this.bolderDataList.join(",") + ",";
      if (bolderStr.indexOf("," + row.rowIndex + ",") != -1) {
        console.log("row-bolder");
        return "row-bolder";
      } else {
        return "";
      }
    }
  },
  watch: {
    xAxisData() {
      this.barEchart("barEchart");
    },
    checkedItemArr() {
      this.barEchart("barEchart");
    },
    moneyUnit(val) {
      this.listFinancialData();
    }
  },
  computed: {
    headerSubtext() {
      if (this.checkedItemArr.length == 0) return null;
      let str = `(${this.checkedItemArr.join("/").toString()})`;
      return str;
    },
    xAxisData() {
      const arr = [];
      for (let i in this.tableTimeData) {
        if (i >= -1 + this.currentPage && i <= 5 + this.currentPage) {
          arr.push(this.tableTimeData[i]);
        }
      }
      return arr.reverse();
    }
  }
};
</script>
<style lang="scss">
#finance-financials {
  min-height: 600px;
  width: 100%;
  .box-card {
    margin-bottom: 12px;
    min-height: 845px;
    .box-select {
      .el-form-item {
        padding: 10px;
        border-bottom: solid 1px #e3e3e3;
        margin-bottom: 0;
        &:last-child {
          border-bottom: 0;
        }
      }
      width: 100%;
      .box {
        width: 100%;
      }
      .el-select {
        width: 100%;
        .el-tag--small {
          color: #ffb148;
          background: #ffb14847;
          .el-select__tags-text {
            color: #ffb148;
          }
          i {
            color: #ff9100 !important;
            background: #ffb14847 !important;
            border: 1px solid #ff9100;
          }
        } // .el-select .el-tag{
        //   // color: #ffb148;
        //   background: #ffb14847
        // }
        // .el-tag .el-tag--info .el-tag--small{
        //   color: #ffb148;
        //   background: #ffb14847
        // }
      }
    }
    .collapse-content {
      border-top: 1px solid #ebeef5;
      .collapse-select {
        margin-top: 10px;
        width: 100%;
      }
      .checkbox {
        .el-tree-node__content>.el-tree-node__expand-icon {
          padding: 0;
          width: 0;
        }
      }
    }
    .columnar-box {
      width: 100%;
      height: 280px;
      #barEchart {
        width: 100%;
        height: 240px;
      }
    }
    .columnar-table {
      margin-top: 20px;
      height: auto;
      width: 100%;
      .columnar-table-head {
        display: flex;
        align-items: center;
        width: 100%;
        color: #8d8d8d;
        font-size: 14px;
        margin: 10px 0;
        li {
          &.left {
            flex: 1;
            text-align: left;
          }
          &.right {
            flex: 1;
            text-align: right;
          }
        }
      }
      .check-label {
        margin-left: 10px;
        cursor: pointer;
      }
      .row-bolder {
        font-weight: bolder;
        color: #000;
        font-size: 13px;
      }
      .el-table th.is-right,
      .el-table td.is-right {
        padding-right: 10px;
      }
      .column-custom-header {
        position: relative;
      }
      .notification-dot {
        display: block;
        position: absolute;
        top: -4px;
        right: -8px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #ffac25;
      }
      #xa-el-table {
        width: 100%;
        table-layout: fixed;
        .el-table__body-wrapper.is-scrolling-left~.el-table__fixed {
          box-shadow: none;
        }
        .el-table__fixed {
          &:before {
            height: 0;
          }

          box-shadow: 0 -10px 10px rgba(0, 0, 0, 0.12);
        }
      }
    }
    #echart-box {
      ul {
        width: 100%;
        height: auto;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        li {
          width: 50%;
          height: 200px;
        }
      }
    }
  }
  .card-title {
    font-size: 14px;
    font-weight: 600;
    padding-left: 10px;
    position: relative;
    border-left: solid 4px #ffb148;
    line-height: 1;
    margin-bottom: 10px;
    .sub-text {
      font-weight: 400;
      font-size: 12px;
      margin-left: 10px;
      color: #8d8d8d;
    }
  }
  .unit {
    float: right;
    .unit-select {
      width: 70px;
    }
  }
  .list {
    .el-checkbox+.el-checkbox {
      margin-left: 0px;
      width: 100%;
    }
  }
}
</style>
