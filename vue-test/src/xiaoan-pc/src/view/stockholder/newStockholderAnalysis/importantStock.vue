<template>
  <div id="importantStock">
    <div class="over-view">
      <div class="over-view-item">
        <div class="over-view-title">总户数
          <!--<el-tooltip effect="light" :content="'数据源自'+recordDate+'期数据'" placement="right" :visible-arrow="false">
            <i class="el-icon-info i-info"></i>
          </el-tooltip>-->
          <i class="el-icon-info i-info"  @mouseover="showView1=true" @mouseout="showView1=false"></i>
        </div>
        <div class="over-view-body" v-show="!showView1">
          <div class="over-view-total">{{holderOverview.allRegisterAmount}}<span>(户)</span></div>
        </div>
        <div class="over-view-tip" v-show="showView1">数据源自{{recordDate}}期数据</div>
      </div>
      <div class="over-view-item">
        <div class="over-view-title">机构户数及持股占比
          <!--<el-tooltip effect="light" :content="'数据源自'+recordDate+'期数据'" placement="right" :visible-arrow="false">
            <i class="el-icon-info i-info"></i>
          </el-tooltip>-->
          <i class="el-icon-info i-info"  @mouseover="showView2=true" @mouseout="showView2=false"></i>
        </div>
        <div class="over-view-flex" v-show="!showView2">
          <div class="over-view-col2" v-if="holderOverview.institutionRegisterAmount">
            {{holderOverview.institutionRegisterAmount}}<span>(户)</span>
          </div>
          <div class="over-view-col2 none-data" v-else>--</div>
          <div class="over-view-col2" v-if="holderOverview.householdRatio">
            {{holderOverview.householdRatio}}<span>(%)</span>
          </div>
          <div class="over-view-col2 none-data" v-else>--</div>
        </div>
        <div class="over-view-tip" v-show="showView2">数据源自{{recordDate}}期数据</div>
      </div>
      <div class="over-view-item">
        <div class="over-view-title">股东区域分布
          <!--<el-tooltip effect="light" :content="'数据源自'+recordDate+'期前200名股东数据'" placement="right" :visible-arrow="false">
            <i class="el-icon-info i-info"></i>
          </el-tooltip>-->
          <i class="el-icon-info i-info"  @mouseover="showView3=true" @mouseout="showView3=false"></i>
        </div>
        <div class="over-view-flex" v-show="!showView3">
          <div class="over-view-col3" v-for="(item, index) in districtInfo" v-if="index<3">
            {{item.hodlerAmount}}<span>{{item.districtName}}(户)</span>
          </div>
        </div>
        <div class="over-view-tip" v-show="showView3">数据源自{{recordDate}}期前200名股东数据</div>
      </div>
    </div>
    <!--最新前十大股东-->
    <el-card shadow="never" class="el-cardbox">
      <div slot="header" class="header-box">
        <span>最新前十大股东</span>
        <el-radio-group size="mini" v-model="xlShow" class="fright">
          <el-radio-button label="table">数据表格</el-radio-button>
          <el-radio-button label="chart">图表分析</el-radio-button>
        </el-radio-group>
      </div>
      <div class="listBox" v-show="xlShow=='table'">
        <el-table ref="xlTable" :data="xlData" @sort-change="sortChange" style="width: 100%" stripe size="mini" height="392">
          <el-table-column  label="序号" width="90" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="possessorName" label="股东名称" align="center">
            <template slot-scope="scope">
              <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.id" target="_blank">
                <div class="possessorname" :title="scope.row.possessorName">{{ scope.row.possessorName}}</div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="possessorTypeName" label="股东性质" width="150" align="center">
          </el-table-column>
          <el-table-column prop="possessorAmount" label="持股数量(股)" width="150" align="right" sortable="custom">
            <template slot-scope="scope">{{$array.amountAbs(scope.row.possessorAmount)}}</template>
          </el-table-column>
          <el-table-column prop="possessorRatio" label="持股比例(%)" width="190" align="right">
            <template slot-scope="scope">{{scope.row.possessorRatio.toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="shareRestrictAmount" label="限售股(股)" width="190" align="right" sortable="custom">
            <template slot-scope="scope">
              {{$array.amountAbs(scope.row.shareRestrictAmount)}}
            </template>
          </el-table-column>
          <el-table-column prop="pledgeFreezeAmount" label="质押/冻结(股)" width="190" align="right" sortable="custom">
            <template slot-scope="scope">{{$array.amountAbs(scope.row.pledgeFreezeAmount)}}</template>
          </el-table-column>
          <el-table-column prop="" label="" width="30">
          </el-table-column>
        </el-table>
        <div class="xl-table-tip">限售股：“--”表示该股东不持有限售股或因股东名册数据缺失无法匹配</div>
      </div>
      <div class="listBox" v-show="xlShow=='chart'">
        <div id="xlChart" class="line-chart"></div>
      </div>
    </el-card>
    <!--最新前十大流通股东-->
    <el-card shadow="never" class="el-cardbox" v-if="isShowPt">
      <div slot="header" class="header-box">
        <span>最新前十大流通股东</span>
        <el-radio-group size="mini" v-model="ptShow" class="fright">
          <el-radio-button label="table">数据表格</el-radio-button>
          <el-radio-button label="chart">图表分析</el-radio-button>
        </el-radio-group>
      </div>
      <div class="listBox" v-show="ptShow=='table'">
        <el-table ref="ptTable" :data="ptData" @sort-change="tableChange" style="width: 100%" stripe size="mini" height="392">
          <el-table-column  label="序号" width="90" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="possessorName" label="股东名称" align="center" width="200">
            <template slot-scope="scope">
              <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.id" target="_blank">
                <div class="possessorname" :title="scope.row.possessorName">{{ scope.row.possessorName}}</div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="possessorTypeName" label="股东性质"  align="center">
          </el-table-column>
          <el-table-column prop="possessorAmount" label="持股数量(股)" width="200" align="right" sortable="custom">
            <template slot-scope="scope">{{$array.amountAbs(scope.row.possessorAmount)}}</template>
          </el-table-column>
          <el-table-column prop="possessorRatio" label="持股比例(%)" width="200" align="right">
            <template slot-scope="scope">{{scope.row.possessorRatio.toFixed(2)}}</template>
          </el-table-column>
          <!--<el-table-column prop="shareRestrictAmount" label="限售股(股)" width="190" align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.shareRestrictAmount">{{scope.row.shareRestrictAmount}}</span>
              <span v-else>&#45;&#45;</span>
            </template>
          </el-table-column>-->
          <el-table-column prop="pledgeFreezeAmount" label="质押/冻结(股)" width="200" align="right" sortable="custom">
            <template slot-scope="scope">{{$array.amountAbs(scope.row.pledgeFreezeAmount)}}</template>
          </el-table-column>
          <el-table-column prop="" label="" width="30" align="right">
          </el-table-column>
        </el-table>
      </div>
      <div class="listBox" v-show="ptShow=='chart'">
        <div id="ptChart" class="line-chart"></div>
      </div>
    </el-card>



    <v-kongguStockOwner :recordDate="time"></v-kongguStockOwner>
    <!--2:野蛮人;3:其他一致行动人;4:自定义分组; 5:相同管理人旗下产品分组-->
    <v-groupStockOwner :groupType="2" :recordDate="time"></v-groupStockOwner>
    <v-groupStockOwner :groupType="3" :recordDate="time"></v-groupStockOwner>
    <v-groupStockOwner :groupType="5" :recordDate="time"></v-groupStockOwner>
    <v-groupStockOwner :groupType="4" :recordDate="time"></v-groupStockOwner>
  </div>
</template>

<script>
  import kongguStockOwner from './components/kongguStockOwner'
  import groupStockOwner from './components/groupStockOwner'
  export default {
    data() {
      return {
        showView1: false,
        showView2: false,
        showView3: false,
        userId: '',
        holderOverview: {},
        districtInfo: [],
        // PT：流通；XL：非流通
        ptShow: 'table',
        ptData: [],
        isShowPt: true,
        xlShow: 'table',
        xlData: [],
        time: '',
        recordDate: '',
        sortTable: {
          possessorAmount: '', // 持股数量排序：1 降序 2 升序
          shareRestrictAmount: '', // 限售股排序：1 降序 2 升序
          pledgeFreezeAmount: ''
        },
        sortTableChange: {
          possessorAmount: '',
          pledgeFreezeAmount: ''
        }
      }
    },
    // 使用其它组件
    components: {
      'v-kongguStockOwner': kongguStockOwner,
      'v-groupStockOwner': groupStockOwner
    },
    computed: {},
    watch: {
      $route: function () {
        if (this.$refs.xlTable) {
          this.$refs.xlTable.clearSort();
        }
        if (this.$refs.ptTable) {
          this.$refs.ptTable.clearSort();
        }
        this.sortTable.possessorAmount = '';
        this.sortTable.shareRestrictAmount = '';
        this.sortTable.pledgeFreezeAmount = '';
        this.sortTableChange.possessorAmount = '';
        this.sortTableChange.pledgeFreezeAmount = '';
        this.initData();
      }
    },
    // 生命周期函数
    created() {

    },
    mounted() {
      this.userId = this.$cookie.get('userId')
      this.initData()
    },
    // 方法
    methods: {
      sortChange(scope) {
        this.$nextTick(_ => {
          setTimeout(_ => {
            this.sortTable = {
              possessorAmount: '', // 持股数量排序：1 降序 2 升序
              shareRestrictAmount: '', // 限售股排序：1 降序 2 升序
              pledgeFreezeAmount: ''
            };
            let sort = {
              'ascending': 'ASC',
              'descending': 'DESC',
              'null': ''
            };
            let prop = scope.prop;
            let order = scope.order;
            this.sortTable[prop] = sort[order];
            // this.page.size = 1;
            this.getLastedImportantHolderInfo();
          })
        })
      },
      tableChange(scope) {
        this.$nextTick(_ => {
          setTimeout(_ => {
            this.sortTableChange = {
              possessorAmount: '',
              pledgeFreezeAmount: ''
            };
            let sort = {
              'ascending': 'ASC',
              'descending': 'DESC',
              'null': ''
            };
            let prop = scope.prop;
            let order = scope.order;
            this.sortTableChange[prop] = sort[order];
            // this.page.size = 1;
            this.getLastedPTHolderInfo();
          })
        })
      },
      initData() {
        if (this.$route.query.time) {
          this.time = this.$route.query.time
          this.recordDate = this.$common.transTime(this.time)[1]
          this.getImportantHolderOverview()
          this.getLastedPTHolderInfo()
          this.getLastedImportantHolderInfo()
        }
      },
      getImportantHolderOverview() {
        this.$http({
          method: "GET",
          url: this.$api.gxfApi.getImportantHolderOverview,
          params: {
            userId: this.userId,
            recordDate: this.time
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.holderOverview = res.data.returnObject
            this.holderOverview.districtInfo.forEach((item, index) => {
              if (index < 3) {
                let districtName = item.districtName.replace('省', '').replace('市', '')
                let hodlerAmount = item.hodlerAmount
                this.districtInfo.push({"districtName": districtName, "hodlerAmount": hodlerAmount})
              }
            })
          }
        })
      },
      getLastedPTHolderInfo() {
        this.$http({
          method: "GET",
          url: this.$api.gxfApi.getLastedPTHolderInfo,
          params: {
            userId: this.userId,
            recordDate: this.time,
            circulateType: 'PT',
            allAmountOrder: this.sortTableChange.possessorAmount,
            pledgeOrder: this.sortTableChange.pledgeFreezeAmount
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.ptData = res.data.returnObject.list
            let data = res.data.returnObject.list
            // 是否显示流通股东模块
            if (res.data.returnObject.wholeRollUploadStatus == 2) {
              this.isShowPt = true
            } else {
              this.isShowPt = false
            }
            let chartData = []
            chartData.possessorname = data.map(e => {
              return e.possessorName;
            })
            chartData.possessorAmount = data.map(e => {
              return e.possessorAmount ? e.possessorAmount : 0
            })
            chartData.pledgeFreezeAmount = data.map(e => {
              return e.pledgeFreezeAmount ? parseInt(e.pledgeFreezeAmount) : 0
            })
            chartData.shareRestrictAmount = data.map(e => {
              return e.shareRestrictAmount ? e.shareRestrictAmount : 0
            })
            this.ptData.forEach((item, index) => {

            })
            this.$nextTick(() => {
              setTimeout(() => {
                this.ptChartLine('ptChart', chartData)
              }, 300)
            })
          }
        })
      },
      getLastedImportantHolderInfo() {
        console.log(this.sortTable.possessorAmount);
        this.$http({
          method: "GET",
          url: this.$api.gxfApi.getLastedImportantHolderInfo,
          params: {
            userId: this.userId,
            recordDate: this.time,
            allAmountOrder: this.sortTable.possessorAmount,
            restrictAmountOrder: this.sortTable.shareRestrictAmount,
            pledgeOrder: this.sortTable.pledgeFreezeAmount
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.xlData = res.data.returnObject
            let data = res.data.returnObject
            let chartData = []
            this.xlData.forEach((item, index) => {
              chartData.possessorname = data.map(e => {
                return e.possessorName;
              })
              chartData.possessorAmount = data.map(e => {
                return e.possessorAmount;
              })
              chartData.pledgeFreezeAmount = data.map(e => {
                return this.tofiter(e.pledgeFreezeAmount)
              })
              chartData.shareRestrictAmount = data.map(e => {
                return this.tofiter(e.shareRestrictAmount)
              })
              if (item.shareRestrictAmount === 0) {
                item.shareRestrictAmount = '--'
              }
//              if (!item.shareRestrictAmount) {
//                item.shareRestrictAmount = '--'
//              }
            })
            this.$nextTick(() => {
              setTimeout(() => {
                this.xlChartLine('xlChart', chartData)
              }, 300)
            })
          }
        })
      },
      xlChartLine(id, data) {
        let that = this
        console.log('data1111')
        console.log(data)
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7'];
        var option = {
          title: {
            text: '',
            show: false,
            textStyle: {
              color: '#323232',
              fontWeight: 400,
              fontSize: 14
            },
            top: 10,
            left: 40
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
              let html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                      <span>${data[0].name}</span>
                      </div>`
              data.forEach((item, index) => {
                html += `
                  <div style="display:flex;justify-content:space-between">
                    <span>${item.seriesName}：</span><span>${that.$array.amountAbs(item.value)}</span>
                  </div>
                `
              })
              return html
            }
          },
          grid: {
            show: true,
            top: "15%",
            left: "0%",
            right: "0%",
            bottom: "0%",
            containLabel: true
          },
          legend: {
            selectedMode: true,
            align: 'left',
            top: 10,
            left: 5,
            data: ['持股数量(股)', '冻结/质押(股)', '限售股(股)']
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 30,
              margin: 10,
              formatter: function (data) {
                let value = data.toString()
                if (value.length > 11) {
                  value = value.substring(0, 12) + '...'
                }
                if (value.length > 6) {
                  value = value.substring(0, 6) + '\n' + value.substring(7, value.length)
                }
                return value
              },
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
            },
            data: data.possessorname
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
                formatter: '{value}%'
              },
              // min: 0,
              // // max: 100,
              // max: function(value) {
              //   let max = parseInt(value.max * 2)
              //   if (max == 0) {
              //     max = 1
              //   }
              //   return max
              // },
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
          series: [
            {
              name: '持股数量(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
//              barMinHeight: 8,
              barWidth: 20,
              barGap: 0,
              data: data.possessorAmount
            },
            {
              name: '冻结/质押(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
//              barMinHeight: 8,
              barWidth: 20,
              barGap: 0,
              data: data.pledgeFreezeAmount
            },
            {
              name: '限售股(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[2]}},
//              barMinHeight: 8,
              barWidth: 20,
              barGap: 0,
              data: data.shareRestrictAmount
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      ptChartLine(id, data) {
        let that = this
        console.log('data')
        console.log(data)
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7'];
        var option = {
          title: {
            text: '',
            show: false,
            textStyle: {
              color: '#323232',
              fontWeight: 400,
              fontSize: 14
            },
            top: 10,
            left: 40
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
              let html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                      <span>${data[0].name}</span>
                      </div>`
              data.forEach((item, index) => {
                html += `
                  <div style="display:flex;justify-content:space-between">
                    <span>${item.seriesName}：</span><span>${that.$array.amountAbs(item.value)}</span>
                  </div>
                `
              })
              return html
            }
          },
          grid: {
            show: true,
            top: "15%",
            left: "0%",
            right: "0%",
            bottom: "0%",
            containLabel: true
          },
          legend: {
            selectedMode: true,
            align: 'left',
            top: 10,
            left: 5,
            data: ['持股数量(股)', '冻结/质押(股)', '限售股(股)']
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 30,
              margin: 10,
              formatter: function (data) {
                let value = data.toString()
                if (value.length > 11) {
                  value = value.substring(0, 12) + '...'
                }
                if (value.length > 6) {
                  value = value.substring(0, 6) + '\n' + value.substring(7, value.length)
                }
                return value
              },
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
            },
            data: data.possessorname
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
                formatter: '{value}%'
              },
              min: 0,
              // max: 100,
              max: function(value) {
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
          series: [
            {
              name: '持股数量(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
//              barMinHeight: 2,
              barWidth: 20,
              barGap: 0,
              data: data.possessorAmount
            },
            {
              name: '冻结/质押(股)',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
//              barMinHeight: 2,
              barWidth: 20,
              barGap: 0,
              data: data.pledgeFreezeAmount
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      tofiter (value) {
        if (value == null || value == undefined || value === '') {
          return '--'
        } else if (value == 0) {
          return 0
        } else {
          return value
        }
      }
    }
  }
</script>

<style lang="scss">
  #importantStock {
    .is-sortable {
      .cell {
        padding: 0;
      }
    }
    .possessorname {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .over-view {
      padding-top: 20px;
      display: flex;
      .over-view-item {
        padding: 0 16px 12px 16px;
        width:391px;
        height:140px;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12);
        border-radius:4px;
        margin-right: 14px;
        &:last-child {
          margin-right: 0;
        }
        .over-view-title {
          height: 45px;
          line-height: 45px;
          font-size: 14px;
          border-bottom: 1px solid #e3e3e3;
          .i-info {
            margin-left: 4px;
            color: #d6d6d6;
            font-size: 12px;
            cursor: pointer;
          }
        }
        .over-view-body {
          height: 94px;
          padding-top:24px;
          .over-view-total {
            text-align: center;
            font-size: 32px;
            font-weight: 600;
            span {
              font-size: 14px;
              font-weight: normal;
            }
          }
        }
        .over-view-tip {
          padding-top:30px;
          font-size: 12px;
          color: #545454;
          text-align: center;
        }
        .over-view-flex {
          display: flex;
          height: 94px;
          padding-top:20px;
          justify-content: space-between;
          font-size: 32px;
          span {
            font-size: 14px;
          }
          .over-view-col2 {
            width: 50%;
            text-align: center;
            border-right: 1px solid #e3e3e3;
            height: 55px;
            line-height: 55px;
            font-weight: 600;
            span {
              font-weight: normal;
            }
            &:last-child {
              border-right: 0;
            }
          }
          .over-view-col3 {
            width: 33.3333%;
            text-align: center;
            border-right: 1px solid #e3e3e3;
            height: 55px;
            line-height: 55px;
            font-weight: 600;
            span {
              font-weight: normal;
            }
            &:last-child {
              border-right: 0;
            }
          }
          .none-data {
            font-weight: 400;
            font-size: 20px;
          }
        }
      }
    }
    .el-cardbox {
      margin-top: 16px;
      padding: 0 16px;
      .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .line-chart {
      height: 350px;
      width: 1166px;
    }
    .xl-table-tip {
      font-size: 12px;
      color: #8d8d8d;
      text-align: left;
      margin-top: 10px;
    }
  }
</style>
