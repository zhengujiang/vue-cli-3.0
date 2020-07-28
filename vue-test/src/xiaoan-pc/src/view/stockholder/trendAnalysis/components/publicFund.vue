<template>
  <div id="publicFund">
    <div class="publicFund" v-loading="tableLoading">
      <div class="header-box">
        <div class="title">
          <p>公募基金持股情况分析</p>
        </div>
        <div style="display: flex; align-items: center">
          <span class="set-company-btn" @click="setCompnay">设置同行业公司</span>
          <el-pagination v-show="recordDateSearch.length > 4" @prev-click="backward" @next-click="forward" class="primary-small" :current-page.sync="currentPage" small background layout="prev, next" :total="pageNum"></el-pagination>
          <el-select @change="holderTypeChange" v-model="quarter" size="mini" placeholder="季度">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <template v-if="cutArray.length>0">
        <el-table :data="tableData" stripe style="width: 100%;">
          <el-table-column prop="code" label="股票代码"></el-table-column>
          <el-table-column prop="companyName" label="股票简称"></el-table-column>
          <el-table-column v-if="cutArray[0]" :label="cutArray[0]+'期'">
            <el-table-column label="家数" >
              <template slot-scope="scope">
                {{scope.row.list[cutArray[0]].managerCount}}
              </template>
            </el-table-column>
            <el-table-column label="产品">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[0]].productCount}}
              </template>
            </el-table-column>
            <el-table-column label="比例(%)">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[0]].totalRate}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column v-if="cutArray[1]" :label="cutArray[1]+'期'">
            <el-table-column label="家数" class-name="numValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[1]].managerCount}}
              </template>
            </el-table-column>
            <el-table-column label="产品" class-name="productValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[1]].productCount}}
              </template>
            </el-table-column>
            <el-table-column label="比例(%)" class-name="ratioValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[1]].totalRate}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column v-if="cutArray[2]" :label="cutArray[2]+'期'">
            <el-table-column label="家数" class-name="numValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[2]].managerCount}}
              </template>
            </el-table-column>
            <el-table-column label="产品" class-name="productValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[2]].productCount}}
              </template>
            </el-table-column>
            <el-table-column label="比例(%)" class-name="ratioValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[2]].totalRate}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column v-if="cutArray[3]" :label="cutArray[3]+'期'">
            <el-table-column label="家数" class-name="numValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[3]].managerCount}}
              </template>
            </el-table-column>
            <el-table-column label="产品" class-name="productValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[3]].productCount}}
              </template>
            </el-table-column>
            <el-table-column label="比例(%)" class-name="ratioValue">
              <template slot-scope="scope">
                {{scope.row.list[cutArray[3]].totalRate}}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div>
          <el-row :gutter="20">
            <el-col :span="8">
              <div id="comparisonNumValue" style="width:100%;height: 330px;"></div>
            </el-col>
            <el-col :span="8">
              <div id="comparisonProduct" style="width:100%;height: 330px;"></div>
            </el-col>
            <el-col :span="8">
              <div id="comparisonRadio" style="width:100%;height: 330px;"></div>
            </el-col>
          </el-row>
        </div>
      </template>
      <div class="noData" v-else>
        <span>暂无数据</span>
      </div>
    </div>
    <industry-company v-if="displayState" :companyCode="companyCode" :setDialogInfo="setDialogInfo" @upAdd="upTitle($event)"></industry-company>
  </div>
</template>

<script>
  import industryCompany from './industryCompany'
  export default {
    data() {
      return {
        displayState: false,
        setDialogInfo: false, // 设置同行业公司弹框的状态
        recordDateSearch: [], // 公募基金显示的月数
        cutArray: [], // 翻页截取的字段
        chartArray: [], // 图表反续后的数组
        indexNum: 0,
        length: '',
        pageNum: 1,
        tableLoading: false,
        currentPage: 1,
        tableData: [
          {code: '', companyName: '', list: {}},
          {code: '', companyName: '', list: {}},
          {code: '', companyName: '', list: {}},
          {code: '', companyName: '', list: {}},
          {code: '', companyName: '', list: {}}
        ],
        quarter: 'half',
        options: [
          {
          value: 'season',
          label: '季度'
        }, {
          value: 'half',
          label: '半年度'
        }],
        chartData: [
          {amount: [], month: ''},
          {amount: [], month: ''},
          {amount: [], month: ''},
          {amount: [], month: ''},
          {company: []},
          {title: '家数'}
        ],
        chartDataProduct: [
          {amount: [], month: ''},
          {amount: [], month: ''},
          {amount: [], month: ''},
          {amount: [], month: ''},
          {company: []},
          {title: '产品'}
        ],
        chartDataRadio: [
          {amount: [], month: ''},
          {amount: [], month: ''},
          {amount: [], month: ''},
          {amount: [], month: ''},
          {company: []},
          {title: '比例'}
        ]
      }
    },
    props: ['companyCode'],
    watch: {
      companyCode: function (val) {
        if (val) {
          this.quarter = 'half';
          this.getPublicHolder();
        }
      },
      '$store.state.setDialogInfo': function(val) {
        if (val) {
          this.getPublicHolder();
        }
      }
    },
    components: {
      industryCompany
    },
    created() {

    },
    mounted() {
      if (this.companyCode) {
        this.getPublicHolder();
      }
    },
    methods: {
      upTitle (item) {
        this.setDialogInfo = item;
      },
      backward() {
        if (this.indexNum > 0) {
          this.indexNum -= 1;
          this.cutArray = this.recordDateSearch.slice((this.indexNum), (this.indexNum + 4));

          for (let index = 0; index < 4; index++) {
            this.chartData[index].amount = [];
            this.chartData[index].month = '';
            this.chartDataProduct[index].amount = [];
            this.chartDataProduct[index].month = '';
            this.chartDataRadio[index].amount = [];
            this.chartDataRadio[index].month = '';
          }
          this.chartArray = [...this.cutArray];
          this.chartArray = this.chartArray.reverse();
          this.chartArray.forEach((item, index) => {
          this.chartData[index].month = item;
          this.chartDataProduct[index].month = item;
          this.chartDataRadio[index].month = item;
          for (let i = 0; i < 5; i++) {
            this.chartData[index].amount.push(this.tableData[i].list[item].managerCount)
            this.chartDataProduct[index].amount.push(this.tableData[i].list[item].productCount)
            this.chartDataRadio[index].amount.push(this.tableData[i].list[item].totalRate)
          }
        })
        this.echartOverview('comparisonNumValue', this.chartData);
        this.echartOverview('comparisonProduct', this.chartDataProduct);
        this.echartOverview('comparisonRadio', this.chartDataRadio);
        }
      },
      forward() {
        if (this.indexNum < this.length) {
          this.indexNum += 1;
          this.cutArray = this.recordDateSearch.slice((this.indexNum), (this.indexNum + 4));

          for (let index = 0; index < 4; index++) {
            this.chartData[index].amount = [];
            this.chartData[index].month = '';
            this.chartDataProduct[index].amount = [];
            this.chartDataProduct[index].month = '';
            this.chartDataRadio[index].amount = [];
            this.chartDataRadio[index].month = '';
          }
          this.chartArray = [...this.cutArray];
          this.chartArray = this.chartArray.reverse();
          this.chartArray.forEach((item, index) => {
          this.chartData[index].month = item;
          this.chartDataProduct[index].month = item;
          this.chartDataRadio[index].month = item;
          for (let i = 0; i < 5; i++) {
            this.chartData[index].amount.push(this.tableData[i].list[item].managerCount)
            this.chartDataProduct[index].amount.push(this.tableData[i].list[item].productCount)
            this.chartDataRadio[index].amount.push(this.tableData[i].list[item].totalRate)
          }
        })

        this.echartOverview('comparisonNumValue', this.chartData);
        this.echartOverview('comparisonProduct', this.chartDataProduct);
        this.echartOverview('comparisonRadio', this.chartDataRadio);
        }
      },
      // 获取公募基金持股情况分析
      getPublicHolder() {
        this.displayState = true;
        this.tableLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getPublicHolder,
          params: {
            code: this.companyCode,
            type: this.quarter,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          this.tableLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.currentPage = 1;
            this.recordDateSearch = res.data.returnObject.dateList;
            // if (this.recordDateSearch.length == 0) {
            //   this.quarter = 'season';
            //   this.getPublicHolder();
            // }
            if (this.recordDateSearch.length > 3) {
              this.pageNum = (this.recordDateSearch.length - 3) * 10;
            }
            // console.log(this.pageNum);
            this.length = this.recordDateSearch.length - 4;
            this.cutArray = this.recordDateSearch.slice(0, 4);
            let companyArray = res.data.returnObject.company;
            let code = res.data.returnObject.code;
            let list = res.data.returnObject.list;
            for (let key in list) {
              this.recordDateSearch.forEach((item) => {
                if (list[key][item].managerCount == null) {
                  list[key][item].managerCount = '--'
                }
                if (list[key][item].productCount == null) {
                  list[key][item].productCount = '--'
                }
                if (list[key][item].totalRate == null) {
                  list[key][item].totalRate = '--'
                }
                if (list[key][item].totalRate != '--') {
                  // list[key][item].totalRate = this.$common.toDecimal2(list[key][item].totalRate);
                  list[key][item].totalRate = (list[key][item].totalRate).toFixed(4);
                }
              })
            }
            for (let index = 0; index < this.tableData.length; index++) {
              this.tableData[index].code = code[index];
              this.tableData[index].companyName = companyArray[index];
              Object.keys(list).forEach((value) => {
              if (value == this.tableData[index].code) {
                this.tableData[index].list = list[value]
              }
            })
            }
            for (let index = 0; index < 4; index++) {
              this.chartData[index].amount = [];
              this.chartData[index].month = '';
              this.chartDataProduct[index].amount = [];
              this.chartDataProduct[index].month = '';
              this.chartDataRadio[index].amount = [];
              this.chartDataRadio[index].month = '';
            }
            this.chartArray = [...this.cutArray];
            this.chartArray = this.chartArray.reverse();
            this.chartArray.forEach((item, index) => {
              this.chartData[index].month = item;
              this.chartDataProduct[index].month = item;
              this.chartDataRadio[index].month = item;
              for (let i = 0; i < 5; i++) {
                this.chartData[index].amount.push(this.tableData[i].list[item].managerCount)
                this.chartDataProduct[index].amount.push(this.tableData[i].list[item].productCount)
                this.chartDataRadio[index].amount.push(this.tableData[i].list[item].totalRate)
              }
            })
            this.chartData[4].company = res.data.returnObject.company;
            this.chartDataProduct[4].company = res.data.returnObject.company;
            this.chartDataRadio[4].company = res.data.returnObject.company;
            this.$nextTick(() => {
              this.echartOverview('comparisonNumValue', this.chartData);
              this.echartOverview('comparisonProduct', this.chartDataProduct);
              this.echartOverview('comparisonRadio', this.chartDataRadio);
            })
          }
        }).catch(() => {
          this.tableLoading = false;
        })
      },
      holderTypeChange () {
        this.getPublicHolder();
      },
      echartOverview(id, data) {
        if (!!!document.getElementById(id)) {
          return false
        }
        // debugger;
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'];
        let seriesData = []
        data.forEach((item, index) => {
          seriesData.push({
            name: item.month,
            type: 'bar',
            itemStyle: {normal: {color: color[index]}},
            barMinHeight: 8,
            barWidth: 4,
            barGap: '100%',
            data: item.amount
          })
        })
        var option = {
          title: {
            text: data[data.length - 1].title,
            show: true,
            textStyle: {
              fontSize:16,
              fontWeight:600,
              color: '#545454'
            },
            top: 16,
            left: 180
          },
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae"
            },
            formatter: function (data) {
              let html = `<div style="display:flex;justify-content:center;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                      <span>${data[0].name}</span>
                      </div>`
              data.forEach((item, index) => {
                html += `
                  <div style="display:flex;justify-content:space-between">
                    <span>${item.seriesName}：</span><span>${item.value}</span>
                  </div>
                `
              })
              return html
            }
          },
          grid: {
            top: "25%",
            left: "0%",
            right: "1%",
            bottom: "0%",
            // borderWidth: 1,
            containLabel: true
          },
          legend: {
            selectedMode: true,
            align: 'left',
            top: 45,
            left: 0,
            itemGap: 0,
            itemWidth: 15,
            data: data.month,
            textStyle: {
              color: "#8d8d8d",
              fontSize: 10,
              padding: -1
            }
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 45,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 12
              }
            },

            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: data[data.length - 2].company
          }],
          yAxis: [
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              splitLine: {
                show: true
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
            },
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: '{value}'
              },
              min: 0,
              // max: 100,
              max: function (value) {
                let max = parseInt(value.max * 2)
                if (max == 0) {
                  max = 1
                }
                return max
              },
              position: 'right',
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            }
          ],
          //  yAxis: yAxes,
          series: seriesData
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      setCompnay() {
        this.$store.commit('setDialogInfo', false);
        this.setDialogInfo = true;
      }
    }
  }
</script>

<style lang="scss">
  #publicFund {
    width: 100%;
    margin-bottom: 16px;
    .publicFund {
      min-height: 300px;
      .noData {
        display: flex;
        justify-content:center;  //水平居中
        align-items:Center;      //垂直居中
        color: #8d8d8d;
        font-size: 14px;
      }
      .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          height: 45px;
          p {
            float: left;
            font-size:14px;
            font-weight:600;
            line-height: 45px;
            color:rgba(50,50,50,1);
          }
        }
        .primary-small {
          float: left;
          margin-top: 1px;
          margin-right: 16px;
          .btn-prev {
            margin-right: 13px;
          }
        }
        .el-select {
          float: right;
          .el-input__inner {
            width: 80px;
            height: 24px;
            font-size:12px;
            font-weight:400;
            color:rgba(174,174,174,1);
          }
        }
      }
      border-radius:4px;
      border:1px solid rgba(227,227,227,1);
      padding: 0 16px 33px 16px;
      .el-table--group::after, .el-table--border::after {
        display: none;
      }
      .el-table::before {
        background-color: #D8D8D8;
      }
      .el-table {
        border: none;
        th {
          text-align: center;
          padding: 0;
          border: none;
        }
        th.numValue, td.numValue {
          .cell {
            width: 115px;
            text-align: right;
            padding-right: 46px;
          }
        }
        th.productValue, td.productValue {
          .cell {
            width: 115px;
            text-align: right;
            padding-right: 60px;
          }
        }
        th.ratioValue, td.ratioValue {
          .cell {
            width: 80px;
            text-align: right;
            padding-right: 20px;
          }
        }
        tr:first-child {
          font-size:12px;
          font-weight:400;
          color:rgba(50,50,50,1);
          th:nth-child(n+3) {
            height: 23px;
          }
        }
        tr:nth-child(2) {
          th {
            height: 22px;
            font-size:10px;
            font-weight:400;
            color:rgba(141,141,141,1);
          }
        }
        td {
          border: none;
          text-align: center;
          height: 35px;
          padding: 0;
          .cell {
            font-size:12px;
            font-weight:400;
            height: 35px;
            line-height: 35px;
            color:rgba(50,50,50,1);
          }
        }
      }
    }
    .set-company-btn {
      height:20px;
      font-size:14px;
      font-weight:400;
      color:#FFB148;
      line-height:20px;
      text-decoration: underline;
      cursor: pointer;
      margin: 5px 15px 0 0;
    }
  }
</style>
