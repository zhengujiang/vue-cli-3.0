<template>
  <div id="kongguStockOwner">
    <el-card shadow="never" class="el-cardbox">
      <div slot="header" class="header-box">
        <span>控股股东及一致行动人最新持股情况</span>
        <span class="manage-btn" @click="goManageGroup()">管理分组</span>
      </div>
      <div class="listBox vxa-flax-box" v-if="!loading && rollOfficialDataList.length==0">
        <v-noInfo :altText="'暂无分组信息，请点击“管理分组”设置分组'" size="mini"></v-noInfo>
        <el-table ref="rollTable"></el-table>
      </div>
      <div class="listBox vxa-flax-box" v-else>
        <div id="kongguChartPie" style="height: 380px" class="col konggu-chart-pie"></div>
        <div class="konggu-table-data col">
          <el-table ref="rollTable" :data="rollOfficialDataList" style="width: 100%" stripe size="mini" show-summary
                    :summary-method="getSummaries" @sort-change="tableSortChange">
            <el-table-column label="序号" width="50" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="possessorName" label="股东名称" align="center">
              <template slot-scope="scope">
                <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.id"
                             target="_blank">
                  <div class="possessorname" :title="scope.row.possessorName">{{ scope.row.possessorName}}</div>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="possessorTypeName" label="股东性质" width="150" align="center">
            </el-table-column>
            <el-table-column prop="possessorAmount" label="持股数量(股)" width="120" align="right" sortable>
              <template slot-scope="scope">{{$array.amountAbs(scope.row.possessorAmount)}}</template>
            </el-table-column>
            <el-table-column prop="possessorRatio" label="持股比例(%)" width="120" align="right">
              <template slot-scope="scope">{{scope.row.possessorRatio.toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="" label="" width="10"></el-table-column>
          </el-table>
        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        loading: true,
        groupListInfo: [],
        rollOfficialDataList: [],
        possessorAmountOrder: ''
      }
    },
    props: ['recordDate'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      recordDate: function (val) {
        if (val) {
          this.$refs.rollTable.clearSort();
          this.possessorAmountOrder = '';
          this.getGroupListInfo()
        }
      }
    },
    // 生命周期函数
    created() {

    },
    mounted() {
      this.userId = this.$cookie.get('userId')
      this.getGroupListInfo()
    },
    // 方法
    methods: {
      goManageGroup() {
        this.$router.push('/stockholder/groupSet')
      },
      tableSortChange(column, prop, order) {
        if (column.order == 'ascending') { // 升序
          this.possessorAmountOrder = 'ASC';
          this.getGroupListInfo();
        }
        if (column.order == 'descending') {
          this.possessorAmountOrder = 'DESC';
          this.getGroupListInfo();
        }
      },
      getSummaries(param) {
        let {columns, data} = param
        let sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
          } else if (index == 1 || index == 2) {
            sums[index] = ''
          } else if (index == 3) {
            sums[index] = this.$array.amountAbs(this.groupListInfo.KONG_GU_AMOUNT)
          } else if (index == 4) {
            sums[index] = this.groupListInfo.KONG_GU_RATIO
          }
        })
        return sums;
      },
      getGroupListInfo() {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getGroupListInfo,
          params: {
            userId: this.userId,
            groupType: 'KONG_GU',
            recordDate: this.recordDate,
            isOne: 1,
            possessorAmountOrder: this.possessorAmountOrder
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.groupListInfo = res.data.returnObject
            let data = res.data.returnObject
            this.rollOfficialDataList = this.groupListInfo.KONG_GU[0].rollOfficialDataList || []
            if (this.rollOfficialDataList.length > 0) {
              this.rollOfficialDataList.sort((a, b) => {
                return b.possessorAmount - a.possessorAmount
              })
              let chartData = this.rollOfficialDataList.map(e => {
                return {'value': e.possessorAmount, 'name': e.possessorName, 'ratio': e.possessorRatio}
              })
              let elseAmount = data.ALL_Hold_Amount - data.KONG_GU_AMOUNT
              let elseRatio = (100 - data.KONG_GU_RATIO).toFixed(2)
              chartData.push({'value': elseAmount, 'name': '其它股东', 'ratio': elseRatio})
              this.$nextTick(() => {
                setTimeout(() => {
                  this.pieData('kongguChartPie', chartData)
                }, 300)
              })
            }
          }
        })
      },
      pieData(id, data) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
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
            formatter: function (item) {
              return '<div style="border-bottom:1px solid #e3e3e3;max-width:380px;white-space: normal; text-align: left;">' + item.name + '</div>' + '<div>持股比例(%)：' + item.data.ratio + '%</div>'
            },
            textStyle: {
              color: "#aeaeae"
            }
          },
          color: ["#602221", "#FFB148", '#968C6D', '#DDDDDD', '#DB536A', '#FFB600', '#BB2740', '#FFE0B7'],
          // color: ["#602221", "#FFB148", '#C0BAA7', '#DDDDDD', '#DB536A', '#FFB600'],
          legend: {
            orient: 'vertical',
            show: false,
            x: 'left'
          },
          series: [{
            name: '净流入',
            type: 'pie',
            selectedMode: 'single',
            minAngle: 15,
            radius: ['30%', '50%'],
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                length: 10,
                length2: 40,
                lineStyle: {
                  color: '#aeaeae'
                }
              }
            },
            label: {
              normal: {
                width: 50,
                formatter: '{b|{b}}\n{d|{d}%}',
                // formatter: function(item) {
                //  console.log(item)
                //  let itemStr = item.name;
                //  if(itemStr.toString().length > 12){
                //   itemStr = insert_flg(itemStr,'\n',12)
                //  }
                // },
//                 formatter: function(item) {
// //                  console.log(item.name)
// //                  let itemArray = item.name.split('')
// //                  itemArray.forEach((item, index) => {
// //                    if (index == parseInt(itemArray.length / 2)) {
// //                      itemArray.splice(index, 0, '\n')
// //                    }
// //                  })
// //                  return itemArray.join('')
//                   return item.name + item.data.ratio + '%'
//                 },
                align: 'left',
                color: '#aeaeae',
                borderWidth: 0,
                borderRadius: 4,
                shadowBlur: 3,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowColor: '#999',
                // padding: [0, 0],
                rich: {}
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
  #kongguStockOwner {
    .manage-btn {
      width:60px;
      height:20px;
      font-size:14px;
      font-weight:400;
      color:#FFB148;
      line-height:20px;
      text-decoration: underline;
      cursor: pointer;
    }
    .listBox {
      display: flex;
      justify-content: space-between;
    }
    .konggu-chart-pie {
      width: 540px;
      height: 380px;
      /*float: left;*/
    }
    .konggu-table-data {
      width: 590px;
      /*float: right;*/
    }
    .el-table__body-wrapper {
      max-height: 349px;
      overflow-y: auto;
    }
  }
</style>
