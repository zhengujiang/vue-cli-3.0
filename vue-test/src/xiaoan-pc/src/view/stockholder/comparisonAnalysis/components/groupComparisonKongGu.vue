<template>
  <div id="groupComparisonKongGu">
    <el-card shadow="never" class="group-list">
      <div slot="header" class="header-box">
        <span>{{title}}
          <span class="record-date"
                v-if="recordDateValue.length<=2">{{recordDateValue[0]}}期与{{recordDateValue[1]}}期</span>
          <span class="record-date"
                v-else>{{recordDateValue[0]}}对比{{recordDateValue[1]}}等{{recordDateValue.length}}期</span>
        </span>
        <div style="display: flex;align-items: center">
          <div class="page-img" v-show="recordDateSearch.length>5">
            <img v-show="dateIndex==1" class="left-img" :src="$image.stockholder.left">
            <img v-show="dateIndex>1" class="rotate pointer left-img" :src="$image.stockholder.right"
                 @click="pageChange(-1)">
            <img v-show="dateIndex+4<recordDateSearch.length" class="pointer" :src="$image.stockholder.right"
                 @click="pageChange(1)">
            <img v-show="dateIndex+4>=recordDateSearch.length" class="rotate" :src="$image.stockholder.left">
          </div>
          <div class="manage-btn" @click="goManageGroup()">管理分组</div>
        </div>
      </div>
      <div class="list-box">
        <el-checkbox-group v-model="comparisonTypes" :min="1" :max="12" class="group-comparisontypes"
                           @change="comparisonTypeChange">
          <el-checkbox :label="1"><span>--</span>稳定</el-checkbox>
          <el-checkbox :label="2"><img class="chk-img" :src="$image.stockholder.c2">新进</el-checkbox>
          <el-checkbox :label="3"><img class="chk-img" :src="$image.stockholder.c3">退出</el-checkbox>
          <el-checkbox :label="4"><img class="chk-img" :src="$image.stockholder.c4">增持</el-checkbox>
          <el-checkbox :label="5"><img class="chk-img" :src="$image.stockholder.c5">减持</el-checkbox>
        </el-checkbox-group>
        <el-table ref="tableFocusKg" :data="groupComparisonInfo" style="width: 100%" stripe size="mini"
                  v-show="recordDateSearch.length==2" @sort-change="tableSortChange" show-summary
                  :summary-method="getSummaries">
          <!--<div slot="empty"><no-info :mini="true"></no-info></div>-->
          <el-table-column label="序号" width="50" align="center"
                           :default-sort="{prop: 'recordDate0', order: 'descending'}">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="holderName" label="股东名称" align="center">
            <template slot-scope="scope">
              <router-link class="vxa-a-hover underline"
                           :to="'/stockholder/institutionAccountInfo?id='+(scope.row.lastedId?scope.row.lastedId:scope.row.oldId)"
                           target="_blank">
                <div class="possessorname" :title="scope.row.holderName">{{ scope.row.holderName}}</div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="holderType" label="股东性质" width="150" align="center">
          </el-table-column>
          <el-table-column prop="lastedPossessAmount" :label="recordDateSearch[0]+'持股数量(股)'" width="130" align="right"
                           sortable="custom" class-name="date-column-sort">
            <template slot-scope="scope">
              {{$array.amountAbs(scope.row.lastedPossessAmount)}}
            </template>
          </el-table-column>
          <el-table-column prop="lastedRatio" :label="recordDateSearch[0]+'持股比例(%)'" width="130" align="right"
                           class-name="date-column">
            <template slot-scope="scope">
              <div class="tdp">{{scope.row.lastedRatio}}</div>
            </template>
          </el-table-column>
          <!--<el-table-column width="10"></el-table-column>-->
          <el-table-column label="序号" width="80" align="center" class-name="split-column">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="oldPossessAmount" :label="recordDateSearch[1]+'持股数量(股)'" width="120" align="right"
                           class-name="date-column">
            <template slot-scope="scope">
              {{$array.amountAbs(scope.row.oldPossessAmount)}}
            </template>
          </el-table-column>
          <el-table-column prop="oldRatio" :label="recordDateSearch[1]+'持股比例(%)'" width="120" align="right"
                           class-name="date-column">
            <template slot-scope="scope">
              <div class="tdp">{{scope.row.lastedRatio}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="changeStock" label="变化股(股)" width="120" align="right" sortable="custom">
            <template slot-scope="scope">
              <span v-if="scope.row.changeStock!=0">{{$array.amountAbs(scope.row.changeStock)}}</span>
              <span v-if="scope.row.status==1">&#45;&#45;</span>
              <span v-else-if="scope.row.status==2"><img class="chk-img" :src="$image.stockholder.c2"/></span>
              <span v-else-if="scope.row.status==3"><img class="chk-img" :src="$image.stockholder.c3"></span>
              <span v-else-if="scope.row.status==4"><img class="chk-img" :src="$image.stockholder.c4"></span>
              <span v-else-if="scope.row.status==5"><img class="chk-img" :src="$image.stockholder.c5"></span>
            </template>
          </el-table-column>
          <el-table-column prop="changeRatio" label="变化比例(占总股本)(%)" width="95" align="right">
          </el-table-column>
          <!--<el-table-column prop="groupName" label="添加到持股变动图" width="90" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="userId" @change="checkComparison(scope.row)"></el-checkbox>
            </template>
          </el-table-column>-->
        </el-table>

        <el-table ref="tableFocusOneKg" :data="groupComparisonInfo" style="width:100%;" stripe size="mini"
                  v-show="recordDateSearch.length>2" @sort-change="tableSortChange">
          <el-table-column label="序号" width="50" align="center"
                           :default-sort="{prop: 'recordDate0', order: 'descending'}">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="holderName" label="股东名称" align="center" width="180">
            <template slot-scope="scope">
              <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.id"
                           target="_blank">
                <div class="possessorname" :title="scope.row.holderName">{{ scope.row.holderName}}</div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="holderPropertyName" label="股东性质" width="130" align="center">
          </el-table-column>
          <el-table-column :prop="recordDateSearch[0]+'-holderInfo'" :label="recordDateSearch[0]+'持股数量(股)'" width="210"
                           align="center" sortable="custom" class-name="date-column-sort">
            <template slot-scope="scope">
              <span class="sp-sort">{{$array.amountAbs(scope.row[recordDateSearch[0]+'-holderInfo'])}}</span>
            </template>
          </el-table-column>

          <el-table-column :prop="recordDateShow[0]+'-holderInfo'" :label="recordDateShow[0]+'持股数量(股)'" align="center"
                           class-name="split-column date-column">
            <template slot-scope="scope">
              <span class="sp">{{$array.amountAbs(scope.row[recordDateShow[0]+'-holderInfo'])}}</span>
            </template>
          </el-table-column>
          <el-table-column :prop="recordDateShow[1]+'-holderInfo'" :label="recordDateShow[1]+'持股数量(股)'" align="center"
                           class-name="date-column">
            <template slot-scope="scope">
              <span class="sp">{{$array.amountAbs(scope.row[recordDateShow[1]+'-holderInfo'])}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="recordDateShow.length>2" :prop="recordDateShow[2]+'-holderInfo'"
                           :label="recordDateShow[2]+'持股数量(股)'" align="center" class-name="date-column">
            <template slot-scope="scope">
              <span class="sp">{{$array.amountAbs(scope.row[recordDateShow[2]+'-holderInfo'])}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="recordDateShow.length>3" :prop="recordDateShow[3]+'-holderInfo'"
                           :label="recordDateShow[3]+'持股数量(股)'" align="center" class-name="date-column">
            <template slot-scope="scope">
              <span class="sp">{{$array.amountAbs(scope.row[recordDateShow[3]+'-holderInfo'])}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column prop="groupName" label="添加到持股变动图" width="80" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.ischeck"></el-checkbox>
            </template>
          </el-table-column>-->
        </el-table>

      </div>
    </el-card>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    data() {
      return {
        title: '控股股东及一致行动人对比分析',
        isLoad: true,
        showChart: false,
        userId: '',
        dateIndex: 1,
        recordDateShow: [],
        recordDateSearch: [],
        // recordDateValue: [],
        // recordDate: [],
        comparisonTypes: [1, 2, 3, 4, 5],
        groupComparisonInfo: [],
        groupComparisonInfoTotal: {},
        chartData: {},
        personAmountOrder: '',
        possessorAmountOrder: '',
        changeAmountOrder: ''
      }
    },
    props: ['recordDateValue', 'groupType'],
    // 使用其它组件
    components: {ElRow},
    computed: {},
    watch: {
      recordDateValue: function (val) {

        let rdate = val || []
        if (rdate.length >= 2) {
          this.isLoad = true
          this.comparisonTypes = [1, 2, 3, 4, 5];
          this.personAmountOrder = '';
          this.possessorAmountOrder = '';
          this.changeAmountOrder = '';

          this.$nextTick(() => {
            this.$refs.tableFocusKg.clearSort();
            this.$refs.tableFocusOneKg.clearSort();
            this.handleComparison()
          })
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
    },
    mounted() {
    },
    // 方法
    methods: {
      getSummaries(param) {
        let {columns, data} = param
        let sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
          } else if (index == 1 || index == 2 || index == 5) {
            sums[index] = ''
          } else if (index == 3) {
            sums[index] = this.$array.amountAbs(this.groupComparisonInfoTotal.lastAllAmout)
          } else if (index == 4) {
            sums[index] = this.groupComparisonInfoTotal.lastAllRatio
          } else if (index == 6) {
            sums[index] = this.$array.amountAbs(this.groupComparisonInfoTotal.oldAllAmout)
          } else if (index == 7) {
            sums[index] = this.groupComparisonInfoTotal.oldAllRatio
          } else if (index == 8) {
            sums[index] = this.$array.amountAbs(this.groupComparisonInfoTotal.changeAllAmout)
          } else if (index == 9) {
            sums[index] = this.groupComparisonInfoTotal.changeAllRatio
          }
        })
        return sums;
      },
      span() {
        let count = this.recordDateShow.length
        return 'date' + this.recordDateShow.length
      },
      pageChang(index) {
        this.dateIndex = index;
        this.recordDateShow = []
        let endIndex = this.dateIndex + 4
        this.recordDateSearch.forEach((item, index) => {
          if (index >= this.dateIndex && index < endIndex) {
            this.recordDateShow.push(item)
          }
        })
      },
      pageChange(i) {
        this.dateIndex += i
        this.recordDateShow = []
        let endIndex = this.dateIndex + 4
        this.recordDateSearch.forEach((item, index) => {
          if (index >= this.dateIndex && index < endIndex) {
            this.recordDateShow.push(item)
          }
        })
      },
      goManageGroup() {
        this.$router.push('/stockholder/groupSet')
      },
      // 对比类型选择切换
      comparisonTypeChange() {
        this.handleComparison()
      },
      handleComparison() {
        this.recordDateSearch = Object.assign([], this.recordDateValue)
        this.dateIndex = 1

        this.pageChange(0)

        let recordDate = this.recordDateValue.map(item => {
          return this.$common.getTimestampms(item + ' 00:00:00')
        })
        this.getGroupComparisonInfo(recordDate)
      },
      tableSortChange(column, prop, order) {
        console.log(column, prop, order)
        this.personAmountOrder = ''
        this.possessorAmountOrder = ''
        this.changeAmountOrder = ''

        if (column.prop == 'changeStock') {
          if (column.order == 'ascending') { // 升序
            this.changeAmountOrder = 'ASC'
            this.handleComparison()
          } else if (column.order == 'descending') {
            this.changeAmountOrder = 'DESC'
            this.handleComparison()
          }
        }
        if (column.prop == this.recordDateSearch[0] + '-holderInfo' || column.prop == 'lastedPossessAmount') {
          if (column.order == 'ascending') { // 升序
            this.possessorAmountOrder = 'ASC'
            this.handleComparison()
          } else if (column.order == 'descending') {
            this.possessorAmountOrder = 'DESC'
            this.handleComparison()
          }
        }
      },
      // 组类别,1:控股股东及一致行动人;2:野蛮人;3:其他一致行动人;4:自定义分组
      getGroupComparisonInfo(recordDate) {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getGroupComparisonInfo,
          params: {
            groupType: this.groupType,
            comparisonTypes: this.comparisonTypes.join(','),
            recordDates: recordDate.join(','),
            personAmountOrder: this.personAmountOrder,
            possessorAmountOrder: this.possessorAmountOrder,
            changeAmountOrder: this.changeAmountOrder,
            pageSize: '',
            pageNo: '',
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              if (recordDate.length == 2) {
                this.groupComparisonInfoTotal = res.data.returnObject
                this.groupComparisonInfo = res.data.returnObject.comparisonInfo || []
              } else {
                this.groupComparisonInfo = res.data.returnObject || []
              }
            } else {
              this.groupComparisonInfo = []
            }
          } else {
            this.groupComparisonInfo = []
          }
        }).catch((err) => {
          this.groupComparisonInfo = []
        })
      }
    }
  }
</script>

<style lang="scss">
  #groupComparisonKongGu {
    .group-list {
      .el-left {
        text-align: left;
      }
      .el-center {
        text-align: center;
      }
      .el-right {
        text-align: right;
      }
      .elchk {
        width: 70px;
      }
      .date2 {
        width: 270px;
        padding-right: 120px;
      }
      .date3 {
        width: 180px;
        padding-right: 80px;
      }
      .date4 {
        width: 135px;
        padding-right: 48px;
      }
      .group-info {
        border-top: 1px solid #e3e3e3;
        margin-top: 10px;
      }
      .el-table__body-wrapper {
        max-height: 350px;
        overflow-y: auto;
      }
      .list-box {
        th.date-column {
          .cell {
            width: 70px;
            height: 34px;
            line-height: 17px;
            text-align: left;
            padding-left: 0;
            padding-right: 0;
            .caret-wrapper {
              position: relative;
              top: -34px;
              right: -65px;
            }
          }
        }
        th.date-column-sort {
          .cell {
            width: 90px;
            height: 34px;
            line-height: 17px;
            text-align: left;
            padding-left: 0;
            padding-right: 20px;
            .caret-wrapper {
              position: relative;
              top: -34px;
              right: -65px;
            }
          }
        }
      }
    }
    .tdp {
      width: 100%;
      text-align: right;
    }
    .sp {
      display: inline-block;
      padding-right: 30px;
      width: 125px;
      text-align: right;
    }
    .sp-sort {
      display: inline-block;
      padding-right: 28px;
      width: 125px;
      text-align: right;
    }
  }

</style>
