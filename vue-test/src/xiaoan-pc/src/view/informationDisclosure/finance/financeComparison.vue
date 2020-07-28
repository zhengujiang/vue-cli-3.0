<template>
  <div id="finance-comparison">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" shadow="never" body-style="padding:0">
          <el-form label-position="left" class="box-select-form" label-width="75px" :model="formLabelAlign">
            <el-form-item size="mini" class="list" label="报告年份">
              <el-select size="mini" class="box" @change="formAlignStartChange" v-model="formLabelAlign.startTime"
                         placeholder="请选择">
                <el-option v-for="item in formSelectData.startData" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" class="list reporting" label="报告期">
              <el-select popper-class="reporting-select-report" size="mini" calss="box"
                         v-model="formLabelAlign.allDate" @change="formAlignAllDateChange" placeholder="请选择">
                <el-option v-for="item in formSelectData.selectData" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <div class="bottom-select">
                <span @click="recentlySelect('year')">最近一年</span>
                <span @click="recentlySelect('stage')">最近一期</span>
              </div>
            </el-form-item>
          </el-form>
          <el-collapse v-model="collapseSelected" class="finance-collapse">
            <el-collapse-item :name="0">
              <div class="title" slot="title">对比公司</div>
              <div class="collapse-content" v-loading="loading">
                <ul class="box-tabs-content">
                  <li v-for="(list , index) in bar" :key="index" :class="{active: list.active,[list.class]:list.class}">
                    <span class="text" @click="handleClick(index)">
                      {{list.name}}
                      <span class="bar"></span>
                    </span>
                  </li>
                </ul>
                <!---->
                <div class="checkbox-scroll" ref="checkboxScrollDom" v-if="activeSereen == 'shenwan'">
                  <div class="checkbox">
                    <ul>
                      <li v-for="(list,index) of bar[activeIndex].list" :key="index">
                        <span class="fullName">{{list.fullCode}}&emsp;{{list.stockName}}</span>
                        <span class="icon"></span>
                      </li>
                    </ul>
                  </div>
                </div>
                <!---->
                <div class="checkbox-scroll" ref="checkboxScrollDom" v-else-if="activeSereen == 'CSRC'">
                  <div class="checkbox">
                    <ul>
                      <li v-for="(list,index) of bar[activeIndex].list" :key="index">
                        <span class="fullName">{{list.fullCode}}&emsp;{{list.stockName}}</span>
                        <span class="icon"></span>
                      </li>
                    </ul>
                  </div>
                </div>
                <!---->
                <div class="checkbox-scroll" ref="checkboxScrollDom" v-else-if="activeSereen == 'custom'">
                  <!--<div class="collapse-select">-->
                  <!--<el-input size="mini" placeholder="请输入内容" v-model="customize" suffix-icon="el-icon-plus">-->
                  <!--</el-input>-->
                  <!--</div>-->
                  <div class="checkbox">
                    <ul v-if="bar[activeIndex].list.length >0">
                      <li v-for="(list,index) of bar[activeIndex].list" :key="index">
                        <span class="fullName text-hidden">{{list.fullCode}}&emsp;{{list.name}}</span>
                      </li>
                    </ul>
                    <ul v-else>
                      <li>
                        <span class="fullName text-hidden">暂无数据</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="corporation-page-type" v-if="false"> <!--v-if="sameIndustryPage.total > 0"-->
                  <el-pagination small :page-size="sameIndustryPage.size" @current-change="handleCurrentChange"
                                 background layout="prev, pager, next" :current-page.sync="sameIndustryPage.index"
                                 :total="sameIndustryPage.total">
                  </el-pagination>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item :name="1">
              <div class="title" slot="title">关注指标</div>
              <div class="collapse-content">
                <div class="collapse-select" v-if="false">
                  <el-select size="mini" v-model="customize" filterable placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                  <el-button class="select-sub" type="text" size="mini" icon="el-icon-plus"></el-button>
                </div>
                <div class="checkbox-scroll indicatorScroll">
                  <div class="checkboxList">
                    <ul>
                      <li v-for="(list,index) of formIndicatorData" :class="{isChecked: list.checkbox}" :key="index">
                        <div class="check" @click="checkClick(index)" :title="list.indicatorsCN">
                          <span class="checkSpan"></span>
                          <span class="checkName">{{list.shortName}}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" shadow="never" body-style="padding:10px">
          <div class="columnar-select-box">
            <div class="columnar-unit">
              <el-form label-position="left" class="box-select-form" label-width="45px">
                <el-form-item size="mini" label="单位:">
                  <el-select v-model="selectUnit" placeholder="请选择单位" size="mini" @change="selectUnitChange">
                    <el-option v-for="item in unitYuan" :key="item.type" :label="item.name"
                               :value="item.type">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="columnar-table-box" v-loading="loading">
            <el-table ref="multipleTable" stripe size="small" border class="columnar-table" :data="tableData"
                      max-height="700" width="100%" @sort-change="tableSortChange"
                      :row-class-name="tableRowClassName">
              <template slot="empty">
                <div style="text-align: left">暂无数据</div>
              </template>
              <el-table-column fixed width="95" prop="fullCode" label="股票代码" header-align="center"
                               align="center">
              </el-table-column>
              <el-table-column fixed width="85" prop="stockName" label="股票简称" header-align="center"
                               align="center">
              </el-table-column>
              <el-table-column fixed min-width="55" prop="displayOrder" label="排名" header-align="center"
                               align="center">
              </el-table-column>
              <el-table-column :render-header="renderColumn" :key="list.type" min-width="150" sortable="custom"
                               :width="sortWidth(list.name)" v-for="list of formIndicatorCheckTable"
                               header-align="center" :label="list.name"
                               align="right" :prop="list.type" :sort-orders="['ascending','descending']">
                <template slot-scope="scope">
                  <div v-if="list.unit == 'lv' || list.unit == 'yigu'">
                    <div class="right" :class="{downColor: downColorFun(scope.row[list.type])}">
                      {{$common.abs(scope.row[list.type])}}
                    </div>
                  </div>
                  <div v-else>
                    <div class="right" :class="{downColor: downColorFun(scope.row[list.type])}"
                         v-if="selectUnit == 'wan'">
                      {{$common.wanUnit(String(Number(scope.row[list.type]).toFixed(2))).replace('万', '')}}
                    </div>
                    <div class="right" :class="{downColor: downColorFun(scope.row[list.type])}"
                         v-else-if="selectUnit == 'yi'">
                      {{$common.yiUnit(String(Number(scope.row[list.type]).toFixed(2))).replace('亿', '')}}
                    </div>
                    <div class="right" :class="{downColor: downColorFun(scope.row[list.type])}" v-else>
                      {{$common.abs(scope.row[list.type])}}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
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
        loading: true,
        userInfo: {},
        formInline: {},
        activeName: 'main',
        bar: [
          {name: '证监会分类', class: 'casc', type: 'CSRC', list: [], active: true},
          {name: '申万行业', class: 'shenwan', type: 'shenwan', list: [], active: false},
          {name: '可比公司', class: 'custom', type: 'custom', list: [], active: false}
        ],
        customize: '',
        enterpriseUserInfo: {},
        activeSereen: 'CSRC',
        activeIndex: 0,
        corporation: {
          code: 'SH600056',
          name: ''
        },
        tableData: [],
        totalTableData: [],
        unitYuan: [
          {id: '0', name: '万元', type: 'wan'},
          {id: '1', name: '亿元', type: 'yi'},
          {id: '2', name: '元', type: 'yuan'}
        ],
        selectUnit: 'wan',
        allCodes: [],
        collapseSelected: [0, 1],
        checkedAll: false, //
        formLabelAlign: {
          startTime: '',
          endTime: '',
          allDate: 'YEAR_REPORT',
          allType: []
        },
        formIndicatorData: [],
        formIndicatorCheck: [],
        formIndicatorCheckTable: [],
        formSelectData: {
          startData: [],
          endData: [],
          typeData: [],
          selectData: [
            {label: '年报', value: 'YEAR_REPORT', type: 0},
            {label: '第一季度报告', value: 'FIRST_QUARTER_REPORT', type: 1},
            {label: '中报', value: 'CENTER_REPORT', type: 2},
            {label: '第三季度报告', value: 'THIRD_QUARTER_REPORT', type: 3}
          ]
        },
        options: [
          {
            value: 'zhinan',
            label: '指南'
          },
          {
            value: 'zujian',
            label: '组件'
          },
          {
            value: 'ziyuan',
            label: '资源'
          }
        ],
        multipleSelection: [],
        currentPage: 10,
        sameIndustryPage: {
          size: 500,
          index: 1,
          total: 0
        }
      }
    },
    watch: {
      tableSortChange: function (val) {
      },
      'formLabelAlign.startTime': function (val) {
      },
      'formLabelAlign.allDate': function (val) {
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      if (this.userInfo.superviseUser) {
        if (this.$route.query.companyCode) {
          this.userInfo.enterpriseCompanyFullCode = this.$route.query.companyCode
        }
      }
      if (this.userInfo.enterpriseCompanyFullCode) {
        // this.getCompany();
        this.getExportReportTimeList()
        // let yearData = this.inception(0);
        // this.formSelectData.startData = yearData;
        // this.formLabelAlign.startTime = yearData[1].value;
        // this.listCompareCompany();
      }

    },
    mounted() {
    },
    methods: {
      // 获得日期
      getExportReportTimeList() {
        let t = new Date().getTime()
        this.$http({
          method: "GET",
          url: this.$api.disclosure.getExportReportTimeList,
          params: {
            companyCode: this.userInfo.enterpriseCompanyCode,
            t: t,
            userId: this.$cookie.get('userId'),
            type: 'SAME_INDUSTRY_DATA_COMPARE'
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
            this.formSelectData.startData = arr;
            this.formLabelAlign.startTime = this.formSelectData.startData[1].value;
            this.getCompany();
          }
        })
      },
      unitFixed(type, row) {
        switch (type) {
          case 'yi':
            break;
          case 'wan':
        }
      },
      // 获取当前所在公司的信息
      getCompany() {
        this.corporation.code = this.userInfo.enterpriseCompanyFullCode
        this.listIndicators()
        setTimeout(() => {
          this.$nextTick(() => {
            this.listSameIndustryCompany(0);
          })
        })

        /* console.log(this.userInfo.companyId);
        if (this.userInfo.companyId === null || this.userInfo.companyId === '') {
          this.$message({showClose: true, type: 'error', message: '非公司用户！'})
        } else {
          this.$http({
            method: 'GET',
            url: this.$api.manage.companyInfo,
            params: {
              companyId: this.userInfo.companyId
            }
          }).then((res) => {
            if (res.data.returnCode === 1) {
              this.enterpriseUserInfo = res.data.returnObject;
              this.corporation.code = res.data.returnObject.companyFullCode;
              this.listIndicators();
              setTimeout(() => {
                this.$nextTick(() => {
                  this.listSameIndustryCompany(0);
                })
              })
            }
          })
        } */
      },
      //
      downColorFun(val) {
        if (String(val).indexOf('-') > -1) {
          return true
        }
        return false
      },
      //
      handleCurrentChange(index) {
        this.$refs.checkboxScrollDom.scrollTop = 0
        this.sameIndustryPage.index = index;
        this.listSameIndustryCompany(this.activeIndex)
      },
      //
      checkClick(index) {
        if (this.formIndicatorData[index].checkbox) {
          this.formIndicatorData[index].checkbox = false;
        } else {
          this.formIndicatorData[index].checkbox = true;
        }
        let array = [], arrayData = [];
        this.formIndicatorData.forEach((item) => {
          if (item.checkbox) {
            array.push(item.indicators);
            if (item.shortName.indexOf('率') > -1) {
              arrayData.push({name: item.shortName, type: item.indicators});
            } else {
              arrayData.push({name: item.shortName, type: item.indicators});
            }
          }
        });
        this.formIndicatorCheckTable = [];
        this.formIndicatorCheck = [];
        this.formIndicatorCheckTable = arrayData;
        this.formIndicatorCheck = array;
        this.tableData = [];
        this.listSameIndustryFinData();
      },
      //
      listIndicators() {
        this.$http({
          method: 'GET',
          url: this.$api.indicator.listIndicators,
          params: {}
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            data.forEach((item) => {
              item.checkbox = true;
            });
            this.formIndicatorData = data;

            let array = [];
            let arrayData = [];
            this.formIndicatorData.forEach((item) => {
              if (item.checkbox) {
                array.push(item.indicators);
                if (item.shortName.indexOf('率') > -1) {
                  arrayData.push({unit: 'lv', name: item.shortName, type: item.indicators});
                } else if (item.shortName.indexOf('元/股') > -1) {
                  arrayData.push({unit: 'yigu', name: item.shortName, type: item.indicators});
                } else {
                  arrayData.push({unit: 'yuan', name: item.shortName, type: item.indicators});
                }
              }
            });
            this.formIndicatorCheck = array;
            this.formIndicatorCheckTable = arrayData;
            this.loading = true;
          }
        }).catch((res) => {

        })
      },
      //
      renderColumn(h, {column, $index}) {
        // console.log(column, $index);
        return column.label
      },
      //
      tableRowClassName({row, rowIndex}) {
        //  console.log('rowIndex', row, rowIndex);
        if (row.fullCode === this.corporation.code) {
          return 'my-row-color';
        }
        if (row.stockName === '中位数') {
          return 'my-zhong-color';
        }
        if (row.stockName === '最高值') {
          return 'my-zui-color';
        }
        return '';
      },
      //
      sortTable(tableDatas, formIndicatorCheck, sort) {
        let myTableData = [];
        let newTableData = [];
        let codeTableData = [];
        let tableData = JSON.parse(tableDatas);
        tableData.forEach((item) => {
          if (item.stockName === '中位数') {
            myTableData.unshift(item);
          }
          if (item.stockName === '最高值') {
            myTableData.unshift(item);
          }
          if (item.stockName === '中位数' || item.stockName === '最高值') {
            //
          } else {
            codeTableData.push(item);
          }
        });
        if (sort == 'descending') {
          codeTableData.sort((a, b) => {
            return b[formIndicatorCheck] - a[formIndicatorCheck]
          });
        } else {
          codeTableData.sort((a, b) => {
            return a[formIndicatorCheck] - b[formIndicatorCheck]
          });
        }
        codeTableData.forEach((item, index) => {
          item.displayOrder = index + 1;
          if (item.fullCode == this.corporation.code) {
            myTableData.unshift(item)
          } else {
            newTableData.push(item);
          }
        });
        newTableData = myTableData.concat(newTableData);
        return newTableData
      },
      // 获取相关对比公司的 数据
      listSameIndustryFinData() {
        this.loading = true;
        this.$refs.multipleTable.doLayout();
        this.$http({
          method: 'POST',
          url: this.$api.stock.listSameIndustryFinData,
          data: {
            reportDate: this.formLabelAlign.allDate,
            indicators: this.formIndicatorCheck.toString(),
            year: this.formLabelAlign.startTime,
            fullCodes: this.allCodes.toString()
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$refs.multipleTable.clearSort();
            this.loading = false;
            let totalTableData = res.data.returnObject;
            this.totalTableData = totalTableData.filter((item) => {
              return item != null
            })
            // console.log('34234', this.totalTableData);
            // 给是百分比的数据增加 字段
            let tableData = this.totalTableData;
            this.tableData = [];
            this.tableData = this.sortTable(JSON.stringify(tableData), this.formIndicatorCheck[0], 'descending');
            // this.$refs.multipleTable.sort({prop: this.formIndicatorCheck[0], order: 'descending'});
            //
          } else {
            this.loading = false;
            this.tableData = [];
          }
        }).catch((err) => {
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        })
      },
      sortWidth(str) {
        let strs = str.toString().replace('(', '').replace(')', '').replace('/', '');
        // console.log(strs);
        // console.log(20 * strs.length);
        return ''
      },
      //
      selectUnitChange(val) {
      },
      // 对比公司切换tab
      handleClick(index) {
        this.bar.forEach((item) => {
          item.active = false;
        });
        this.bar[index].active = true;
        this.activeSereen = this.bar[index].type;
        this.activeIndex = index;
        this.sameIndustryPage.total = 0
        this.sameIndustryPage.index = 1;
        if (index == 2) {
          this.getCompanyCompare();
        } else {
          this.listSameIndustryCompany(this.activeIndex)
        }
      },
      // 获取对比公司
      getCompanyCompare() {
        this.$http({
          method: 'GET',
          url: this.$api.enterpriseCompany.getCompanyCompare,
          params: {
            companyId: this.userInfo.companyId,
            pageNum: this.sameIndustryPage.index,
            pageSize: this.sameIndustryPage.size
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.bar[this.activeIndex].list = res.data.returnObject;
              this.sameIndustryPage.total = res.data.total;
              let data = res.data.returnObject;
              this.allCodes = [];
              this.allCodes = data.map(e => e.fullCode);
              this.allCodes.push(this.corporation.code);
              this.listSameIndustryFinData();
            } else {
              this.allCodes = [];
              this.allCodes.push(this.corporation.code);
              this.listSameIndustryFinData();
            }
          }
        }).catch((err) => {

        })
      },
      //
      listSameIndustryCompany(type) {
        this.$http({
          method: 'GET',
          url: this.$api.stock.listSameIndustryCompany,
          params: {
            industryType: type,
            fullCode: this.corporation.code,
            pageNum: this.sameIndustryPage.index,
            pageSize: this.sameIndustryPage.size
          }
        }).then((res) => {
          // console.log(res.data.returnObject);
          if (res.data.returnCode == 1) {
            this.bar[type].list = res.data.returnObject;
            this.sameIndustryPage.total = res.data.total;
            let data = res.data.returnObject;
            this.allCodes = [];
            data.forEach((item) => {
              if (item.fullCode == this.corporation.code) {
              } else {
                this.allCodes.push(item.fullCode);
              }
            })
            this.allCodes.push(this.corporation.code);
            this.listSameIndustryFinData();
          }
        }).catch((err) => {

        })
      },
      //
      tableSortChange(order) {
        let props = order.prop;
        let total = JSON.stringify(this.totalTableData);
        this.tableData = this.sortTable(total, props, order.order);
      },
      // 点击最近一年 和最新一期
      recentlySelect(type) {
        if (type == 'year') {
          // 最近一年
          this.formLabelAlign.allDate = 'YEAR_REPORT'
        } else if (type == 'stage') {
          // 最近一期
          var timestamp = Date.parse(new Date()) // 当前时间戳
          let date = new Date(); // 当前时间OBJ
          let year = date.getFullYear(); // 当前年份
          let toOneDate = this.$common.getTimestampms(year + '-04-30'); // 一季报截止日
          let toMiddleDate = this.$common.getTimestampms(year + '-08-31'); // 半年报截止日
          let toThreeDate = this.$common.getTimestampms(year + '-10-31'); // 三季报截止日
          this.formLabelAlign.startTime = parseInt(year)
          if (timestamp > toThreeDate) {
            // 三季报截止日
            this.formLabelAlign.allDate = 'THIRD_QUARTER_REPORT'
          } else if (timestamp > toMiddleDate) {
            // 半年报截止日
            this.formLabelAlign.allDate = 'CENTER_REPORT'
          } else if (timestamp > toOneDate) {
            // 一季报截止日
            this.formLabelAlign.allDate = 'FIRST_QUARTER_REPORT'
          } else {
            this.formLabelAlign.allDate = 'YEAR_REPORT'
            this.formLabelAlign.startTime = parseInt(year) - 1
          }

        }
        this.listSameIndustryFinData();
      },
      // 初始处理方法
      inception(index) {
        var timestamp = Date.parse(new Date()) // 当前时间戳
        let date = new Date(); // 当前时间OBJ
        let year = date.getFullYear(); // 当前年份
        let toDate = this.$common.getTimestampms(year + '-03-31');
        //
        let toYear = year;
        let yearArr = [], sortArr = [];
        if ((timestamp > toDate)) {
          // 有1季报
          for (let i = 4; i--;) {
            yearArr.push({label: toYear - i, value: toYear - i});
            sortArr.unshift({label: toYear - i, value: toYear - i})
          }
        } else {
          // 没有一季报
          toYear -= 1;
          for (let i = 4; i--;) {
            yearArr.push({label: toYear - i, value: toYear - i});
            sortArr.unshift({label: toYear - i, value: toYear - i})
          }
        }
        return sortArr
        //
      },
      //
      formAlignStartChange(val) {
        this.listSameIndustryFinData();
      },
      //
      formAlignAllDateChange(val) {
        let numberQuarter = {};
        this.formSelectData.selectData.forEach((item) => {
          if (item.value == val) {
            numberQuarter = item
          }
        });
        let yearData = this.inception(numberQuarter.type);
        this.formSelectData.startData = yearData;
        this.listSameIndustryFinData();
      }
    }
  }
</script>

<style lang="scss">
  #finance-comparison {
    min-height: 600px;
    width: 100%;
    .box-card {
      margin-bottom: 12px;
      min-height: 845px;
      position: relative;
      #loading {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 22;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 1);
        text-align: center;
        color: #FFAC38;
        font-size: 50px;
        .el-icon-loading, img {
          margin: 27% auto;
        }
        img {
          width: 50px;
        }
      }
      .box-select-form {
        width: 100%;
        .list {
          margin-bottom: 0;
          padding: 12px;
          border-bottom: 1px solid #e3e3e3;
          .el-form-item__label {
            color: #323232;
          }
          &.reporting {
            padding-bottom: 0;
            border-bottom: 0;
          }
          .bottom-select {
            font-size: 12px;
            color: #aeaeae;
            span {
              padding-right: 10px;
              cursor: pointer;
              &:active {
                color: #ffb148;
                transition: .03s;
              }
            }
          }
        }
        .box {
          width: 100%;
        }
        .el-select {
          width: 100%;
        }
      }
      .finance-collapse {
        .el-collapse-item__header {
          padding: 0 12px;
          .title {
            font-size: 16px;
          }
          .el-collapse-item__arrow {
            margin-right: 0;
          }
        }
        .el-collapse-item__content {
          padding-bottom: 0;
          .collapse-content {
            min-height: 200px;
            border-top: 1px solid #ebeef5;
            .box-tabs-content {
              display: flex;
              align-items: center;
              height: 50px;
              border-bottom: 1px solid #ebeef5;
              li {
                height: 100%;
                flex: 1;
                text-align: center;
                position: relative;
                line-height: normal;
                font-size: 14px;
                &.casc {
                  flex: 0 0 36%;
                }
                &:after {
                  content: '';
                  position: absolute;
                  right: 0;
                  height: 20px;
                  width: 2px;
                  background-color: #f0f1f5;
                  top: 50%;
                  transform: translateY(-50%);
                }
                &:last-child {
                  &:after {
                    width: 0;
                  }
                }
                &.active {
                  color: #ffb148;
                  .bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    width: 30px;
                    background-color: #ffb148;
                    margin: 0 auto;
                  }
                }
                .text {
                  height: 100%;
                  display: flex;
                  padding: 0 9px;
                  line-height: 1.2;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  color: #8d8d8d;
                  .label {
                  }
                }
              }
            }
            .collapse-select {
              padding: 12px;
              width: 100%;
              border-bottom: 1px solid #ebeef5;
              position: relative;
              .el-select {
                width: 100%;
              }
              .select-sub {
                background-color: white;
                position: absolute;
                right: 14px;
                top: 50%;
                margin-top: -12px;
                padding: 0;
                height: 24px;
                width: 30px;
                .name {
                }
                i {
                  font-weight: bold;
                  font-size: 16px;
                }
              }
              .el-cascader {
                width: 100%;
              }
            }
            .checkbox-scroll {
              height: 350px;
              overflow-y: auto;
              overflow-x: hidden;
              &.indicatorScroll {
                height: 400px;
              }
              .checkboxList {
                ul {
                  li {
                    display: flex;
                    padding: 5px 12px;
                    align-items: center;
                    .check {
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      flex: 1;
                    }
                    &.isChecked {
                      .checkSpan {
                        background-color: #ffb148;
                        border-color: #ffb148;
                        &::after {
                          -webkit-transform: rotate(45deg) scaleY(1);
                          -ms-transform: rotate(45deg) scaleY(1);
                          transform: rotate(45deg) scaleY(1);
                        }
                      }
                    }

                    .checkSpan {
                      display: inline-block;
                      display: inline-flex;
                      position: relative;
                      border: 1px solid #d8dce5;
                      border-radius: 2px;
                      -webkit-box-sizing: border-box;
                      -moz-box-sizing: border-box;
                      box-sizing: border-box;
                      width: 14px;
                      height: 14px;
                      background-color: #fff;
                      z-index: 1;
                      -webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
                      transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
                      &::after {
                        -webkit-box-sizing: content-box;
                        -moz-box-sizing: content-box;
                        box-sizing: content-box;
                        content: "";
                        border: 1px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        height: 7px;
                        left: 4px;
                        position: absolute;
                        top: 1px;
                        -webkit-transform: rotate(45deg) scaleY(0);
                        -ms-transform: rotate(45deg) scaleY(0);
                        transform: rotate(45deg) scaleY(0);
                        width: 3px;
                        -webkit-transition: -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
                        transition: -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
                        transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
                        -webkit-transform-origin: center;
                        -ms-transform-origin: center;
                        transform-origin: center;
                      }
                    }
                    .checkName {
                      padding-left: 5px;
                      font-size: 14px;
                      color: #555;
                    }
                    .checkClear {
                      float: right;
                      display: none;
                      i {
                        color: #8d8d8d;
                      }
                    }
                    &:hover {
                      background: #f7f7f9;
                      .checkClear {
                        display: inline-block;
                      }
                    }
                    &:focus {
                      background-color: rgba(255, 177, 72, 0.2);
                    }
                  }
                }
                .el-tree-node__content > .el-tree-node__expand-icon {
                  padding: 0;
                  width: 0;
                }
              }
              .checkbox {
                ul {
                  li {
                    padding: 0 12px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    font-size: 14px;
                    color: #545454;
                    cursor: pointer;
                    span.icon {
                      display: none;
                      flex: 0 0 10%;
                      text-align: right;
                    }
                    span.fullName {
                      flex: 0 0 90%;
                    }
                    span.checkbox-left {
                      flex: 0 0 100%;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      .el-checkbox {
                        width: 100%;
                        padding: 12px 0;
                      }
                    }
                    &:hover {
                      background-color: rgba(255, 177, 72, 0.1);
                      span.icon {
                        display: inline-block;
                        i {
                          color: #ffb148;
                        }
                      }
                    }
                  }
                }
              }
            }
            .corporation-page-type {
              border-top: 1px solid #ebeef5;
              width: 100%;
              text-align: center;
            }
          }
        }
      }
      .columnar-box {
        width: 100%;
        height: 240px;
        #barEchart {
          height: 100%;
          width: 100%;
        }
      }
      .columnar-select-box {
        text-align: right;
        padding: 5px 0;
        .columnar-unit {
          width: 125px;
          display: inline-block;
          .el-form-item {
            margin-bottom: 0;
          }
        }
      }
      .columnar-table-box {
        .el-table .my-row-color {
          background: rgba(255, 177, 72, 0.2) !important;
          color: #ffb148 !important;
        }
        .el-table .my-zhong-color {
          // background: rgba(245, 108, 108, 0.2) !important;
          // color: #f56c6c !important;
        }
        .el-table .my-zui-color {
          // background: rgba(245, 108, 108, 0.2) !important;
          // color: #f56c6c !important;
        }
        .columnar-table {
          background-color: white;
          .empty-table {
            height: 400px;
            text-align: center;
          }
          .el-table__header-wrapper {
          }
          .downColor {
            color: #f56c6c;
          }
          .el-table__fixed {
            background-color: white;
            &:before {
              border: 0;
              height: 0;
            }
          }
          .el-table__header {
            background-color: #f8f8f8;
            tr {
              th {
                background-color: #f8f8f8;
                .cell {
                  color: #323232;
                  // text-align: center;
                }
              }
            }
          }
        }
      }
      .columnar-pagination {
        width: 100%;
        .pagination-box {
          margin: 20px 0;
          text-align: center;
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
  }
</style>
