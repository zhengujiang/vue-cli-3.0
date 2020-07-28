<template>
  <div id="stockPledge">
    <p class="title">股份整体质押情况分析</p>
    <el-table :data="tableData" stripe style="width: 100%;" size="mini" :default-sort="{prop:'date', order: 'descending'}">
      <el-table-column prop="date" sortable label="截止日期" width="100" align="center"></el-table-column>
      <el-table-column prop="pledgeRate" sortable label="质押比例(%)" width="150" align="right">
        <template slot-scope="scope">{{scope.row.pledgeRate.toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="stockTotal" sortable label="A股总股本(万)" width="180" align="right">
        <template slot-scope="scope">{{$array.abs(scope.row.stockTotal, true)}}</template>
      </el-table-column>
      <el-table-column prop="totalSales" sortable label="股份质押总数量(万)" align="right">
        <template slot-scope="scope">{{$array.abs(scope.row.totalSales, true)}}</template>
      </el-table-column>
      <el-table-column prop="noSales" sortable label="无限售股份质押数量(万)" align="right">
        <template slot-scope="scope">{{$array.abs(scope.row.noSales, true)}}</template>
      </el-table-column>
      <el-table-column prop="yesSales" sortable label="有限售股份质押数量(万)" align="right">
        <template slot-scope="scope">{{$array.abs(scope.row.yesSales, true)}}</template>
      </el-table-column>
      <el-table-column prop="num" sortable label="质押笔数" width="120" align="right"></el-table-column>
      <el-table-column prop="" label="" width="10"></el-table-column>
    </el-table>
    <div class="chart-box" v-show="stockPledge.rateChart && stockPledge.typeChart">
      <div id="pledgeTotal" class="pledge-chart"></div>
      <div id="pledgeType" class="pledge-chart"></div>
    </div>
    <div class="title-box" v-show="stockPledge.rateChart && stockPledge.typeChart">
      <div>A股总股本和股份质押总数量图</div>
      <div>质押股份类型分布</div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        stockPledge: {}
      }
    },
    props: ['companyCode'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      companyCode: function (val) {
        if (val) {
          this.getData()
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getData()
    },
    mounted() {

    },
    // 方法
    methods: {
      getData () {
        if (!this.companyCode) {
          return false
        }
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getStockPledge,
          params: {
            userId: this.userId,
            code: this.companyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject
            this.stockPledge = res.data.returnObject
            this.tableData = data.table
            this.$nextTick(() => {
              setTimeout(() => {
                if (data.rateChart) {
                  let rateChart = data.rateChart.reverse()
                  this.pieData('pledgeTotal', rateChart)
                }
                if (data.typeChart) {
                  let typeChart = data.typeChart
                  this.pieData('pledgeType', typeChart)
                }
              }, 500)
            })

          } else {
            this.pieData('pledgeTotal', [])
            this.pieData('pledgeType', [])
          }
        })
      },
      pieData(id, data) {
        console.log(data)
        let that = this
        var myChart = echarts.init(document.getElementById(id));
        var option = {
          title: {
            text: '',
            show: true
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            axisPointer: {
              type: 'line',
              lineStyle: {
                opacity: 0
              }
            },
            formatter: function(item) {
              return '<div style="border-bottom:1px solid #e3e3e3;max-width:250px;white-space: normal; text-align: left;">' + item.name + '</div>' + '<div>持股比例(%)：' + (item.data.ratio * 100).toFixed(2) + '%</div>'
            },
            textStyle: {
              color: "#aeaeae"
            }
          },
          color: ["#602221", "#FFB148", '#C0BAA7', '#FBD6A4', '#BB2740', '#DDDDDD', '#FEBAA8', '#CD4110', '#A96BC7', '#76C0CB'],
          legend: {
            orient: 'vertical',
            show: false,
            x: 'left'
          },
          series: [{
            name: '净流入',
            type: 'pie',
            selectedMode: 'single',
            startAngle: 45,
            minAngle: 1,
            radius: ['30%', '50%'],
            labelLine: {
              normal: {
                length: 10,
                length2: 10,
                lineStyle: {
                  color: '#aeaeae'
                }
              }
            },
            label: {
              normal: {
                formatter: function(item) {
//                  console.log(item.name)
//                  let itemArray = item.name.split('')
//                  itemArray.forEach((item, index) => {
//                    if (index == parseInt(itemArray.length / 2)) {
//                      itemArray.splice(index, 0, '\n')
//                    }
//                  })
//                  return itemArray.join('')
                  let value = that.$array.abs(item.data.value, true) + '万，'
                  let ratio = '占比' + (item.data.ratio * 100).toFixed(2) + '%'
                  if (item.name.indexOf('限售') > -1) {
                    value = '\n' + value
                  } else {
                    ratio = '\n' + ratio
                  }

                  return item.name + value + ratio
                },
                align: 'left',
                color: '#aeaeae',
                borderWidth: 0,
                borderRadius: 4,
                shadowBlur: 3,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowColor: '#999',
                // padding: [0, 0],
                rich: {
                  a: {
                    color: '#333',
                    fontSize: 12,
                    lineHeight: 10
                  },
                  hr: {
                    borderColor: '#333',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 15,
                    color: '#333'
                  }
                }
              }
            },
            data: data
          }]
        };
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss">
  #stockPledge {
    border-radius:4px;
    /*height: 440px;*/
    border:1px solid rgba(227,227,227,1);
    padding: 0 14px 16px 16px;
    margin-bottom: 16px;
    .title {
      height: 45px;
      line-height: 45px;
      font-size:14px;
      font-weight:600;
      color:rgba(50,50,50,1);
      border-bottom:1px solid rgba(227,227,227,1);
      margin-bottom: 16px;
    }
    .chart-box {
      display: flex;
      justify-content: space-between;
    }
    .pledge-chart {
      width: 50%;
      height: 300px;
    }
    .title-box {
      display: flex;
      justify-content: space-between;
      text-align: center;
      color: #545454;
      font-size: 12px;
      margin-top: -30px;
      padding-bottom:20px;
      div {
        width: 50%;
        text-align: center;
      }
    }

    .is-sortable {
      .cell {
        padding-right: 0;
      }
    }
    .el-table {
      &::before {
        /*height: 0;*/
      }
    }
  }
</style>
