<template>
  <div id="finance-main">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card" shadow="never" body-style="padding:0">
          <el-form class="box-select" :label-position="'right'" label-width="75px" :model="formLabelAlign">
            <el-form-item class="list" label="起始日期">
              <el-select class="box" @change="formAlignStartChange" v-model="formLabelAlign.startTime" placeholder="请选择"
                         size="small">
                <el-option v-for="item in formSelectData.startData" :key="item.value" :label="item.label"
                           :disabled="item.disabled" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="list" label="截止日期">
              <el-select class="box" @change="formAlignEndChange" v-model="formLabelAlign.endTime" placeholder="请选择"
                         size="small">
                <el-option v-for="item in formSelectData.endData" :key="item.value" :label="item.label"
                           :disabled="item.disabled" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="list checkbox-list" label="报告期">
              <!-- <el-select calss="box" multiple collapse-tags v-model="formLabelAlign.allDate" @change="formAlignAllDateChange" @remove-tag="formAlignRemoveTagChange" placeholder="请选择" size="small">
                <el-option v-for="item in formSelectData.selectData" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-checkbox-group v-model="formLabelAlign.allDate">
                <el-checkbox v-for="item in formSelectData.selectData" :key="item.value" :label="item.value"
                             :value="item.value" @change="formAlignAllDateChange">{{item.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <el-collapse accordion v-model="collapseActive">
            <el-collapse-item name="focus">
              <template slot="title">
                <span class="item-title">关注指标</span>
              </template>
              <div class="collapse-content">
                <div class="radio-group-container">
                  <el-radio-group size="small" v-model="displayMode">
                    <el-radio-button label="table">数据表格</el-radio-button>
                    <el-radio-button label="chart">图形分析</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="checkbox">
                  <ul>
                    <li v-for="(list,index) of formIndicatorData" :key="index" :class="{isChecked: list.checkbox}">
                      <div class="check" @click="checkClick(index)" :title="list.indicatorsCN">
                        <span class="checkSpan"></span>
                        <span class="checkName">{{list.shortName}}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card shadow="never" class="box-card" v-show="displayMode=='table'" v-loading='isLoading'>
          <h4 class="card-title left-float">{{tableName}}</h4>
          <el-pagination class="pagination-box right-float" background :current-page.sync="currentPage"
                         layout="prev, next" :page-size="1" :total="totalPage"></el-pagination>
          <div class="pull-right" style="margin-top:10px">
            单位:
            <el-select v-model="moneyUnit" size="mini" class="unit-select">
              <el-option v-for="item in moneyUnits" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="clear"></div>
          <el-table :data="tableData" border size="small">
            <el-table-column label="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column v-for="(col,index) in columns" v-if="index>=-1+currentPage && index<=5+currentPage"
                             show-overflow-tooltip :key="index" :label="col" align="right">
              <template slot-scope="scope">
                <div v-if="scope.row.type == 0">
                  <div v-if="moneyUnit=='wan'">
                    <span v-if="!(scope.row.data[index] / 1)">{{scope.row.data[index]}}</span>
                    <span class="red" v-else-if="scope.row.data[index]<0">{{$common.wanUnit(scope.row.data[index]).split('万')[0]}}</span>
                    <span v-else>{{$common.wanUnit(scope.row.data[index]).split('万')[0]}}</span>
                  </div>
                  <div v-if="moneyUnit=='yi'">
                    <span v-if="!(scope.row.data[index] / 1)">{{scope.row.data[index]}}</span>
                    <span class="red" v-else-if="scope.row.data[index]<0">{{$common.yiUnit(scope.row.data[index]).split('亿')[0]}}</span>
                    <span v-else>{{$common.yiUnit(scope.row.data[index]).split('亿')[0]}}</span>
                  </div>
                  <div v-if="moneyUnit=='yuan'">
                    <span v-if="!(scope.row.data[index] / 1)">{{scope.row.data[index]}}</span>
                    <span class="red" v-else-if="scope.row.data[index]<0">{{$common.abs(scope.row.data[index]).split('元')[0]}}</span>
                    <span v-else>{{$common.abs(scope.row.data[index]).split('元')[0]}}</span>
                  </div>
                </div>
                <div v-else>
                  <span v-if="!(scope.row.data[index] / 1)">{{transCol(scope.row.data[index])}}</span>
                  <span class="red" v-else-if="scope.row.data[index]<0">{{transCol(scope.row.data[index])}}</span>
                  <span v-else>{{transCol(scope.row.data[index])}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card shadow="never" class="box-card" v-show="displayMode=='chart'">
          <div id="echart-box">
            <ul>
              <li v-for="(list, index) of echartsData" :key="index">
                <div class="card-title">{{list.name}}</div>
                <div class="pull-right">
                  <span v-if="tableTitleFun(list.name)">单位 ：<span>{{tableTitleFun(list.name)}}</span></span>
                </div>
                <div style="clear:both"></div>
                <el-card body-style="padding:10px" shadow="never">
                  <div class="echart" :id="'echart'+index"></div>
                </el-card>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: "finance-main",
    data() {
      return {
        collapseActive: "focus",
        formLabelAlign: {
          startTime: "",
          endTime: "",
          allDate: ["YEAR_REPORT", "NEW_REPORT"]
        },
        tableName: "",
        formSelectData: {
          startData: [],
          endData: [],
          selectData: [
            {label: "年报", value: "YEAR_REPORT"},
            {label: "第一季度报告", value: "FIRST_QUARTER_REPORT"},
            {label: "中报", value: "CENTER_REPORT"},
            {label: "第三季度报告", value: "THIRD_QUARTER_REPORT"},
            {label: "最新报告", value: "NEW_REPORT"}
          ]
        },
        formIndicatorData: [],
        formIndicatorCheck: [],
        displayMode: "chart",
        visible: [],
        echartsData: [],
        tableData: [],
        checkAll: false,
        checkedCities: [],
        isIndeterminate: true,
        columns: [],
        currentPage: 1,
        totalPage: 1,
        moneyUnit: "wan",
        moneyUnits: [
          {
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
        tableTitleObj: {
          营业收入及增长率: "万元",
          归属于母公司股东的净利润及增长率: "万元",
          扣除非经常性损益后的净利润及增长率: "万元",
          经营活动净流入及增长率: "万元",
          归属于母公司所有者权益合计及增长率: "万元",
          资产总计及增长率: "万元",
          "每股基本收益（元/股）及增长率": "元",
          "稀释每股收益（元/股）及增长率": "元",
          "扣非后每股收益（元/股）及增长率": "元",
          "净资产收益率（%）": "%",
          "扣非后净资产收益率（%）": "%"
        },
        isLoading: false,
        fullNames: []
      };
    },
    computed: {},
    mounted() {
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
        // this.listIndicators();
        this.getExportReportTimeList()
        // this.inception();
      }

    },
    methods: {
      getExportReportTimeList() {
        let t = new Date().getTime()
        this.$http({
          method: "GET",
          url: this.$api.disclosure.getExportReportTimeList,
          params: {
            companyCode: this.userInfo.enterpriseCompanyCode,
            t: t,
            userId: this.$cookie.get('userId'),
            type: 'MAIN_FINACIAL_DATA'
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
            this.listIndicators();
          }
        })
      },
      tableTitleFun(name) {
        if (name) {
          if (name.indexOf('元/股') > -1) {
            return '元'
          } else if (name.indexOf('收益率') > -1) {
            return '%'
          } else if (name.indexOf('增长率') > -1) {
            return '万元'
          }
        } else {
          return null
        }
      },
      //
      listIndicators() {
        this.isLoading = true;
        this.$http({
          method: "GET",
          url: this.$api.indicator.listIndicators,
          params: {}
        })
          .then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              let data = res.data.returnObject;

              data.forEach(item => {
                if (
                  item.indicators == "INCOMESTATEMENT_81" ||
                  item.indicators == "EPSEXBASIC" ||
                  item.indicators == "ROEEXWA"
                ) {
                  item.checkbox = false;
                } else {
                  item.checkbox = true;
                }
              });
              this.formIndicatorData = data;
              let array = [];
              this.formIndicatorData.forEach(item => {
                if (item.checkbox) {
                  array.push(item.indicators);
                }
              });
              this.formIndicatorCheck = array;
              this.listMainIndicatorsData();
              this.chartMainIndicatorsData();
            }
            // console.log(res);
          })
          .catch(res => {
            this.isLoading = false;
          });
      },
      //
      checkClick(index) {
        // console.log(this.formIndicatorData[index]);
        if (this.formIndicatorData[index].checkbox) {
          this.formIndicatorData[index].checkbox = false;
        } else {
          this.formIndicatorData[index].checkbox = true;
        }
        let array = [];
        this.formIndicatorData.forEach(item => {
          if (item.checkbox) {
            array.push(item.indicators);
          }
        });
        this.formIndicatorCheck = array;
        this.listMainIndicatorsData();
        this.chartMainIndicatorsData();
      },
      //
      listMainIndicatorsData() {
        this.$http({
          method: "GET",
          url: this.$api.indicator.listMainIndicatorsData,
          params: {
            reportDates: this.formLabelAlign.allDate.toString(),
            startYear: this.formLabelAlign.startTime,
            endYear: this.formLabelAlign.endTime,
            indicators: this.formIndicatorCheck.toString(),
            fullCode: this.userInfo.enterpriseCompanyFullCode
          }
        }).then(res => {
          // this.isLoading = false;
          this.tableData = [];
          this.columns = [];
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            this.tableName = data.name;
            for (let i of data.columns) {
              this.columns.push(i.substr(0, 7));
            }
            if (this.columns.length > 6) {
              this.totalPage = this.columns.length - 6;
            } else {
              this.totalPage = 1;
            }
            const obj = {
              name: "报告期",
              data: data.reportDateData,
              type: 0
            };
            this.tableData.push(obj);
            data.indicatorGroupData.forEach((group, index) => {
              group.forEach(row => {
                if (typeof row != "string") {
                  row.data = row.data.map(
                    e => (e === null ? "--" : e.toString())
                  );
                  row.type = index;
                  this.tableData.push(row);
                }
              });
            });
            // this.changeUnit();
          } else {
          }
        }).catch(res => {
          this.isLoading = false;
        });
      },
      chartMainIndicatorsData() {
        this.isLoading = true;
        this.$http({
          method: "GET",
          url: this.$api.indicator.chartMainIndicatorsData,
          params: {
            reportDates: this.formLabelAlign.allDate.toString(),
            startYear: this.formLabelAlign.startTime,
            endYear: this.formLabelAlign.endTime,
            indicators: this.formIndicatorCheck.toString(),
            fullCode: this.userInfo.enterpriseCompanyFullCode
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            this.echartsData = []
            if (data.length == 0) {
              return;
            }
            data.forEach((item, index) => {
              let noYear = 0;
              item.xAxis.forEach((itemI, j) => {
                if (itemI.indexOf('2014') > -1) {
                  noYear += 1;
                }
              });
              item.xAxis.splice(0, noYear); // 切除2014的数据
              //
              item.series.forEach(s => {
                s.data.splice(0, noYear); // 切除2014的数据
                // s.data.forEach(k => {
                //   if (k == null) {
                //     k = '';
                //   }
                // })
              });
              // if (item.name == '净资产收益率（%）' && this.formLabelAlign.allDate.toString() != 'NEW_REPORT') {
//              if (item.name == '净资产收益率（%）') {
//                item.name = '加权平均' + item.name
//              }
              //
              this.echartsData.push(item);
            });
            console.log('this.echartsData', this.echartsData);
            //
            this.$nextTick(() => {
              this.echartsData.forEach((k, i) => {
                this.drawEchart("echart" + i, k);
              });
            });
            this.isLoading = false;
          } else {
            this.echartsData = [];
          }
        }).catch(err => {
          this.isLoading = false;
        });
      },
      formAlignStartChange(val) {
        console.log("start", val);
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

        this.listMainIndicatorsData();
        this.chartMainIndicatorsData();
      },
      //
      formAlignEndChange(val) {
        console.log("end", val);
        if (this.formLabelAlign.startTime > val) {
          this.formLabelAlign.endTime = this.formLabelAlign.startTime;
        }
        this.listMainIndicatorsData();
        this.chartMainIndicatorsData();
      },
      //
      formAlignAllDateChange(val) {
        console.log("allDate", val);
        this.listMainIndicatorsData();
        this.chartMainIndicatorsData();
      },
      //
      formAlignRemoveTagChange(val) {
        console.log("remove-tag", val);
        this.listMainIndicatorsData();
        this.chartMainIndicatorsData();
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
            yearArr.push({
              label: toYear - i,
              value: toYear - i,
              disabled: false
            });
            sortArr.unshift({
              label: toYear - i,
              value: toYear - i,
              disabled: false
            });
          }
        } else {
          // 没有一季报
          toYear -= 1;
          for (let i = 4; i--;) {
            yearArr.push({
              label: toYear - i,
              value: toYear - i,
              disabled: false
            });
            sortArr.unshift({
              label: toYear - i,
              value: toYear - i,
              disabled: false
            });
          }
        }
        this.formSelectData.startData = yearArr;
        this.formSelectData.endData = sortArr;
        this.formLabelAlign.startTime = yearArr[0].value;
        this.formLabelAlign.endTime = sortArr[0].value;
        this.formSelectData.endData.forEach((end, i1) => {
          end.disabled = false;
          if (this.formLabelAlign.startTime > end.value) {
            end.disabled = true;
          }
        });
      },
      //
      drawEchart(id, {name, series, xAxis}) {
        var myChart = echarts.init(document.getElementById(id));
        const barSeriesConfig = {
          barWidth: 10,
          itemStyle: {
            normal: {
              color: "#738bff"
            }
          }
        };
        const lineSeriesConfig = {
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "#ffac25"
            }
          }
        };
        const yAxisConfig = {
          type: "value",
          name: "",
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
              color: "#ccc"
            }
          }
        };
        const echartSeries = [...series].map(seriesConfig => {
          let config = {};
          if (seriesConfig.type === "bar") {
            config = Object.assign({}, seriesConfig, barSeriesConfig);
            config.data = [...config.data].map(d => {
              return this.$common
                .wanUnit(d + "")
                .split("万")[0]
                .replace(/,/g, "");
            });
            config.yAxisIndex = 0;
          } else if (seriesConfig.type === "line") {
            config = Object.assign({}, seriesConfig, lineSeriesConfig);
            config.yAxisIndex = series.length > 1 ? 1 : 0;
          }
          return config;
        });
        const yAxisTypes = [...new Set(series.map(s => s.type))];
        const legendData = series.map(s => s.name);
        const yAxes = yAxisTypes.map(type => {
          let config = {};
          if (type === "bar") {
            config = Object.assign({}, yAxisConfig, {position: "left"});
          } else if (type === "line") {
            config = Object.assign({}, yAxisConfig, {
              position: yAxisTypes.length > 1 ? "right" : "left",
              name: "",
              // scale: true,
              splitLine: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter(v) {
                  return `${v}%`;
                }
              }
            });
          }
          return config;
        });
        var option = {
          title: {
            show: false
            // text: '2016年12月长宁区合规成本分析'
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "line" // 默认为直线，可选为：'line' | 'shadow'
            },
            position: [10, 10],
            textStyle: {
              fontSize: 10
            }
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            data: legendData,
            top: "bottom",
            textStyle: {
              color: "#8d8d8d",
              fontSize: 10
            }
            // align: 'center',
            // right: 0
          },
          grid: {
            top: "10%",
            left: "3%",
            right: "3%",
            bottom: "12%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisLabel: {
                rotate: 45,
                interval: 0,
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
                  color: "#ccc"
                }
              }
            }
          ],
          yAxis: yAxes,
          series: echartSeries
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      // 单位转换
      transCol(str) {
        if (str == "--" || str == undefined) {
          return "--";
        } else if (str == "y") {
          return "y";
        }
        if (str.indexOf("%") > -1) {
          return str;
        }
        return parseFloat(str).toFixed(2);
      }
    }
  };
</script>
<style lang="scss">
  #finance-main {
    min-height: 600px;
    width: 100%;
    .box-card {
      margin-bottom: 12px;
      min-height: 845px;

      .box-select {
        width: 100%;
        .el-form-item {
          padding: 10px;
          border-bottom: solid 1px #e3e3e3;
          margin-bottom: 0;
          &:last-child {
            border-bottom: 0;
          }
        }
        .box {
          width: 100%;
        }
        .checkbox-list {
          .el-form-item__label {
            line-height: 32px;
          }
          .el-checkbox {
            line-height: 32px;
          }
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
          }
        }
      }
      .el-collapse-item__wrap {
        border-bottom: none;
      }
      .el-collapse-item {
        .item-title {
          padding-left: 12px;
          font-size: 15px;
        }
      }
      .collapse-content {
        border-top: 1px solid #ebeef5;
        .collapse-select {
          margin-top: 10px;
          width: 100%;
          padding: 0 12px;
        }
        .checkbox {
          ul {
            li {
              cursor: pointer;
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
                -webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
                background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
                transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
                background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
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
            height: auto;
            margin-bottom: 20px;
            &:nth-child(odd) {
              padding-right: 10px;
            }
            &:nth-child(even) {
              padding-left: 10px;
            }
            .card-title {
              font-weight: 600;
              margin-bottom: 10px;
              float: left;
            }
            .echart {
              width: 100%;
              height: 300px;
            }
          }
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
    .pull-right {
      float: right;
      font-size: 12px;
      line-height: 22px;
      color: #8d8d8d;
    }
    .pagination-box {
      margin-top: 10px;
      margin-left: 18px;
    }
    .unit-select {
      width: 70px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 600;
      padding-left: 10px;
      position: relative;
      border-left: solid 4px #ffb148;
      line-height: 1;
    }
    .red {
      color: #f56c6c;
    }
    .left-float {
      float: left;
    }
    .right-float {
      float: right;
    }
    .clear {
      clear: both;
    }
    .list {
      .el-checkbox + .el-checkbox {
        margin-left: 0px;
        width: 100%;
        cursor: pointer;
      }
    }
  }
</style>
