<template>
  <div>
    <el-card shadow="never" class="group-list">
      <div slot="header" class="header-box">
        <span>{{title}}
          <span class="record-date"
                v-if="recordDateValue.length<=2">{{recordDateValue[0]}}期与{{recordDateValue[1]}}期</span>
          <span class="record-date"
                v-else>{{recordDateValue[0]}}对比{{recordDateValue[1]}}等{{recordDateValue.length}}期</span>
        </span>
        <div style="display: flex;align-items: center">
          <!--{{this.recordDateShow}}-->
          <!--<el-pagination class="primary-small" small background layout="prev, next" :page-size="1" :total="recordDateSearch.length-4" @current-change="pageChang" style="height: 22px;margin-right: 20px;"></el-pagination>-->
          <span class="page-img" v-show="recordDateSearch.length>5">
            <img v-show="dateIndex==1" class="left-img" :src="$image.stockholder.left">
            <img v-show="dateIndex>1" class="rotate pointer left-img" :src="$image.stockholder.right"
                 @click="pageChange(-1)">
            <img v-show="dateIndex+4<recordDateSearch.length" class="pointer" :src="$image.stockholder.right"
                 @click="pageChange(1)">
            <img v-show="dateIndex+4>=recordDateSearch.length" class="rotate" :src="$image.stockholder.left">
          </span>
          <span class="manage-btn" @click="goManageGroup()">管理分组</span>
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
        <el-table ref="tableFocus" :data="groupComparisonInfo" style="width: 100%" stripe size="mini"
                  :span-method="arraySpanMethod" v-show="recordDateSearch.length==2" @sort-change="tableSortChange">
          <!--<div slot="empty"><no-info :mini="true"></no-info></div>-->
          <el-table-column label="序号" width="50" align="center"
                           :default-sort="{prop: 'recordDate0', order: 'descending'}">
            <template slot-scope="scope">
              <!--{{ scope.$index + 1 }}-->
              <el-row>
                <el-col :span="2" class="el-center">{{scope.$index + 1}}</el-col>
                <el-col :span="8" class="item1">
                  <span class="pointer" @click="showItemInfo(scope.row,scope.$index)" :title="scope.row.groupName">
                    {{$common.number(scope.row.groupName)}}
                    <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                    <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                  </span>
                </el-col>
                <el-col :span="3" class="el-right">{{scope.row.lastGroupPersonNumber}}</el-col>
                <el-col :span="5" class="el-right">{{$array.amountAbs(scope.row[recordDateSearch[0]])}}</el-col>
                <el-col :span="5" class="el-right">{{scope.row.lastRatio}}</el-col>
              </el-row>
              <div class="group-info" v-show="scope.row.showList">
                <el-row v-for="(item,index) in scope.row.comparisonInfo" :key="index">
                  <el-col :span="2" class="item1">&nbsp;</el-col>
                  <el-col :span="8" class="item1" style="padding:0 20px;">
                    <router-link class="vxa-a-hover underline"
                                 :to="'/stockholder/institutionAccountInfo?id='+(item.lastedId?item.lastedId:item.oldId)"
                                 target="_blank">
                      <div class="possessorname" :title="item.holderName">{{ item.holderName}}</div>
                    </router-link>
                  </el-col>
                  <el-col :span="3" class="el-right">&nbsp;</el-col>
                  <el-col :span="5" class="el-right">{{$array.amountAbs(item.lastedPossessAmount)}}</el-col>
                  <el-col :span="5" class="el-right">{{item.lastedRatio}}</el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="组名" align="center">
          </el-table-column>
          <el-table-column prop="lastGroupPersonNumber" label="成员数" width="100" align="right" sortable="custom">
          </el-table-column>
          <el-table-column :prop="recordDateSearch[0]" :label="recordDateSearch[0]+'持股数量(股)'" width="120" align="center"
                           sortable="custom" class-name="date-column">
            <!--<template slot-scope="scope">-->
            <!--{{scope.row[recordDateSearch[0]]}}-->
            <!--</template>-->
          </el-table-column>
          <el-table-column prop="lastRatio" :label="recordDateSearch[0]+'持股比例(%)'" width="120" align="right"
                           class-name="date-column">
          </el-table-column>
          <el-table-column label="序号" width="80" align="center" class-name="split-column">
            <template slot-scope="scope">
              <!--{{ scope.$index + 1 }}-->
              <el-row>
                <el-col :span="2" class="el-center">{{scope.$index + 1}}</el-col>
                <el-col :span="5" class="el-right">{{$array.amountAbs(scope.row[recordDateSearch[1]])}}</el-col>
                <el-col :span="5" class="el-right">{{scope.row.oldRatio}}</el-col>
                <el-col :span="4" class="el-right">
                  <span v-if="scope.row.changeAmount!=0">{{scope.row.changeAmount}}</span>
                  <span v-if="scope.row.status==1">--</span>
                  <span v-else-if="scope.row.status==2"><img class="chk-img" :src="$image.stockholder.c2"></span>
                  <span v-else-if="scope.row.status==3"><img class="chk-img" :src="$image.stockholder.c3"></span>
                  <span v-else-if="scope.row.status==4"><img class="chk-img" :src="$image.stockholder.c4"></span>
                  <span v-else-if="scope.row.status==5"><img class="chk-img" :src="$image.stockholder.c5"></span>
                </el-col>
                <el-col :span="4" class="el-right">{{scope.row.changeRatio}}</el-col>
                <el-col :span="3" class="el-right">
                  <el-checkbox v-model="scope.row.ischeck" @change="checkComparison(scope.row)"></el-checkbox>
                </el-col>
              </el-row>
              <div class="group-info" v-show="scope.row.showList">
                <el-row v-for="(item,index) in scope.row.comparisonInfo" :key="index">
                  <el-col :span="2" class="item1">&nbsp;</el-col>
                  <el-col :span="5" class="el-right">{{$array.amountAbs(item.oldPossessAmount)}}</el-col>
                  <el-col :span="5" class="el-right">{{item.oldRatio}}</el-col>
                  <el-col :span="4" class="el-right">
                    <span v-if="item.changeStock!=0">{{item.changeStock}}</span>
                    <span v-if="item.status==1">--</span>
                    <span v-else-if="item.status==2"><img class="chk-img" :src="$image.stockholder.c2"></span>
                    <span v-else-if="item.status==3"><img class="chk-img" :src="$image.stockholder.c3"></span>
                    <span v-else-if="item.status==4"><img class="chk-img" :src="$image.stockholder.c4"></span>
                    <span v-else-if="item.status==5"><img class="chk-img" :src="$image.stockholder.c5"></span>
                    <!--{{item.changeStock}}-->
                  </el-col>
                  <el-col :span="4" class="el-right">{{item.changeRatio}}</el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="lastRatio" :label="recordDateSearch[1]+'持股数量(股)'" width="120" align="right"
                           class-name="date-column">
            <template slot-scope="scope">
              {{scope.row[recordDateSearch[1]]}}
            </template>
          </el-table-column>
          <el-table-column prop="lastRatio" :label="recordDateSearch[1]+'持股比例(%)'" width="120" align="right"
                           class-name="date-column">
          </el-table-column>
          <el-table-column prop="changeAmount" label="变化股(股)" width="100" align="right" sortable="custom">
            <template slot-scope="scope">
              {{scope.row.comparisonType}}
            </template>
          </el-table-column>
          <el-table-column prop="changeRatio" label="变化比例(占总股本)(%)" width="95" align="right">
          </el-table-column>
          <el-table-column prop="groupName" label="添加到持股变动图" width="90" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="userId" @change="checkComparison(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>

        <el-table ref="tableFocusOne" :data="groupComparisonInfo" style="width:100%;" stripe size="mini"
                  :span-method="arraySpanMethod2" v-show="recordDateSearch.length>2" @sort-change="tableSortChange">
          <el-table-column label="序号" width="50" align="center"
                           :default-sort="{prop: 'recordDate0', order: 'descending'}">
            <template slot-scope="scope">
              <!--{{ scope.$index + 1 }}-->
              <el-row>
                <el-col :span="2" class="el-center">{{scope.$index + 1}}</el-col>
                <el-col :span="9" class="item1">
                  <span class="pointer" @click="showItemInfo(scope.row,scope.$index)" :title="scope.row.groupName">
                    {{$common.number(scope.row.groupName)}}
                    <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                    <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                  </span>
                </el-col>
                <el-col :span="3" class="el-right">{{scope.row.lastGroupPersonNumber}}</el-col>
                <el-col :span="7" class="el-right">{{$array.amountAbs(scope.row[recordDateSearch[0]])}}</el-col>
                <!--<el-col :span="5" class="el-right">{{scope.row.lastRatio}}</el-col>-->
              </el-row>
              <div class="group-info" v-show="scope.row.showList">
                <el-row v-for="(item,index) in scope.row[recordDateSearch[0]+'-HolderInfo']" :key="index">
                  <el-col :span="2" class="item1">&nbsp;</el-col>
                  <el-col :span="9" class="item1" style="padding:0 20px">
                    <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+item.id"
                                 target="_blank">
                      <div class="possessorname" :title="item.possessorName">{{ item.possessorName}}</div>
                    </router-link>
                  </el-col>
                  <el-col :span="3" class="el-right">&nbsp;</el-col>
                  <el-col :span="7" class="el-right">{{$array.amountAbs(item.possessorAmount)}}</el-col>
                  <!--<el-col :span="5" class="el-right">{{item.possessorRatio}}</el-col>-->
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="组名" align="center" width="180">
          </el-table-column>
          <el-table-column prop="lastGroupPersonNumber" label="成员数" width="100" align="right" sortable="custom">
          </el-table-column>
          <el-table-column :prop="recordDateSearch[0]" :label="recordDateSearch[0]+'持股数量(股)'" width="210" align="center"
                           sortable="custom" class-name="date-column">
            <template slot-scope="scope">
              {{scope.row[recordDateSearch[0]]}}
            </template>
          </el-table-column>

          <el-table-column prop="lastRatio" :label="recordDateShow[0]+'持股数量(股)'" align="center"
                           class-name="split-column date-column">
            <template slot-scope="scope">
              <el-row style="width:614px;">
                <el-col :span="5" :class="span()" class="el-right">{{$array.amountAbs(scope.row[recordDateShow[0]])}}
                </el-col>
                <el-col :span="5" :class="span()" class="el-right">{{$array.amountAbs(scope.row[recordDateShow[1]])}}
                </el-col>
                <el-col :span="5" :class="span()" class="el-right" v-if="recordDateShow.length>2">
                  {{$array.amountAbs(scope.row[recordDateShow[2]])}}
                </el-col>
                <el-col :span="5" :class="span()" class="el-right" v-if="recordDateShow.length>3">
                  {{$array.amountAbs(scope.row[recordDateShow[3]])}}
                </el-col>
                <el-col :span="3" class="el-center elchk">
                  <el-checkbox v-model="scope.row.ischeck" @change="checkComparison(scope.row)"></el-checkbox>
                </el-col>
              </el-row>
              <div class="group-info" v-show="scope.row.showList">
                <el-row style="width:614px;">
                  <el-col :span="5" :class="span()" class="el-right" v-for="(item,index) in recordDateShow"
                          :key="index">
                    <div v-for="item in scope.row[item+'-HolderInfo']">{{$array.amountAbs(item.possessorAmount)}}</div>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="lastRatio" :label="recordDateShow[1]+'持股数量(股)'" align="center"
                           class-name="date-column">
            <template slot-scope="scope">
              {{scope.row[recordDateShow[1]]}}
            </template>
          </el-table-column>
          <el-table-column v-if="recordDateShow.length>2" prop="lastRatio" :label="recordDateShow[2]+'持股数量(股)'"
                           align="center" class-name="date-column">
            <template slot-scope="scope">
              {{scope.row[recordDateShow[2]]}}
            </template>
          </el-table-column>
          <el-table-column v-if="recordDateShow.length>3" prop="lastRatio" :label="recordDateShow[3]+'持股数量(股)'"
                           align="center" class-name="date-column">
            <template slot-scope="scope">
              {{scope.row[recordDateShow[3]]}}
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="添加到持股变动图" width="80" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.ischeck"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="showChart">
          <div class="chart-title">
            <span v-if="recordDateValue.length<=2">{{recordDateValue[0]}}期与对比{{recordDateValue[1]}}期 </span>
            <span v-else>{{recordDateValue[0]}}对比{{recordDateValue[1]}}等{{recordDateValue.length}}期 </span>
            持股变动图
          </div>
          <div :id="'comparisonChart'+groupType" style="width:100%;height: 330px;"></div>
        </div>

      </div>
    </el-card>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    data() {
      return {
        title: '野蛮人股东对比分析',
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
            this.$refs.tableFocus.clearSort();
            this.$refs.tableFocusOne.clearSort();
            this.handleComparison()
          })

          // this.getGroupComparisonChart()
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      if (this.groupType == 3) {
        this.title = '其他一致行动人股东对比分析'
      } else if (this.groupType == 4) {
        this.title = '其他分组股东对比分析'
      } else if (this.groupType == 5) {
        this.title = '相同管理人旗下产品对比分析'
      }
    },
    mounted() {
    },
    // 方法
    methods: {
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
      // 表格合并列
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          return [1, 5];
        } else if (columnIndex == 1 || columnIndex == 2 || columnIndex == 3 || columnIndex == 4) {
          return [0, 0]
        } else if (columnIndex == 5) {
          return [1, 6]
        } else if (columnIndex == 6 || columnIndex == 7 || columnIndex == 8 || columnIndex == 9) {
          return [0, 0]
        }
      },
      arraySpanMethod2({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          return [1, 4];
        } else if (columnIndex == 1 || columnIndex == 2 || columnIndex == 3) {
          return [0, 0]
        } else if (columnIndex == 4) {
          return [1, 5]
        } else if (columnIndex == 5 || columnIndex == 6 || columnIndex == 7 || columnIndex == 8 || columnIndex == 9) {
          return [0, 0]
        }
      },
      showItemInfo(row, index) {
        this.groupComparisonInfo.forEach((item, i) => {
          if (item.groupId == row.groupId) {
            item.showList = !item.showList
          }
        })
        // this.$set(this.groupComparisonInfo[index], 'showList', !this.groupComparisonInfo[index].showList)
        this.groupComparisonInfo = Object.assign([], this.groupComparisonInfo)
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
        if (column.prop == 'lastGroupPersonNumber') {
          if (column.order == 'ascending') { // 升序
            this.personAmountOrder = 'ASC';
            this.handleComparison()
          } else if (column.order == 'descending') {
            this.personAmountOrder = 'DESC';
            this.handleComparison()
          }
        }
        if (column.prop == 'changeAmount') {
          if (column.order == 'ascending') { // 升序
            this.changeAmountOrder = 'ASC'
            this.handleComparison()
          } else if (column.order == 'descending') {
            this.changeAmountOrder = 'DESC'
            this.handleComparison()
          }
        }
        if (column.prop == this.recordDateSearch[0]) {
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
            this.groupComparisonInfo = res.data.returnObject
            if (recordDate.length >= 2) {
              this.groupComparisonInfo.forEach((item, index) => {
                item.ischeck = false
                item.showList = false
                /* let last = item[this.recordDateValue[0]]
                let old = item[this.recordDateValue[1]]
                if (last == 0 && old != 0) {
                  item.comparisonType = 3 // 退出
                } else if (last != 0 && old == 0) {
                  item.comparisonType = 2 // 新进
                } else if (last - old > 0) {
                  item.comparisonType = 4 // 增持
                } else if (last - old < 0) {
                  item.comparisonType = 5 // 减持
                } else {
                  item.comparisonType = 1 // 稳定
                } */
                if (this.groupType == 2) {
                  if (index < 3) {
                    item.ischeck = true
                  }
                }
              })
              this.isLoad = false
              this.checkComparison()
            }
          }
        })
      },
      // 列表多选框选中对比组事件
      checkComparison(rowItem) {
        let groupIds = []
        this.groupComparisonInfo.forEach((item, index) => {
          if (item.ischeck) {
            groupIds.push(item.groupId)
          }
        })
        if (groupIds.length > 3) {
          this.groupComparisonInfo.forEach((item, index) => {
            if (item.groupId == rowItem.groupId) {
              item.ischeck = false
            }
          })
          this.groupComparisonInfo = Object.assign([], this.groupComparisonInfo)
          this.$message({showClose: true, type: 'error', duration: 3000, message: '最多选择三项'})
          return false
        }
        this.groupComparisonInfo = Object.assign([], this.groupComparisonInfo)

        if (groupIds.length > 0) {
          this.showChart = true
          this.getGroupComparisonChart(groupIds.join(','))
        } else {
          this.showChart = false
        }
      },
      // 持股变动图
      getGroupComparisonChart(groupIds) {
        let recordDate = this.recordDateValue.map(item => {
          return this.$common.getTimestampms(item + ' 00:00:00')
        })
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getGroupComparisonChart,
          params: {
            groupType: this.groupType,
            groupIds: groupIds,
            recordDates: recordDate.join(','),
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject.reverse();
            this.chartData.dateTime = data.map(e => {
              return e.date
            })
            this.chartData.stockPrice = data.map(e => {
              return e.stockPrice
            })
            this.chartData.groupName = data[0].gxfGroupInfolist.map(e => {
              return e.groupName
            })
            this.chartData.groupName.push('股价')

            let amountData = []
            data[0].gxfGroupInfolist.forEach((item, index) => {
              let groupName = item.groupName
              let amount = []
              data.forEach((item2, index2) => {
                amount.push(item2.gxfGroupInfolist[index].groupHolderShareAmount)
              })
              amount = this.unitArray(amount)

              amountData.push({'groupName': groupName, 'amount': amount})
            })
            this.chartData.amountData = amountData

            this.chartData.dateTime = this.unitArray(this.chartData.dateTime)
            this.chartData.stockPrice = this.unitArray(this.chartData.stockPrice)

            this.echartOverview('comparisonChart' + this.groupType, this.chartData)

          }
        })
      },
      unitArray(arr) {
        arr.unshift('')
        arr.unshift('')
        arr.unshift('')
        arr.push('')
        arr.push('')
        arr.push('')
        return arr
      },
      echartOverview(id, data) {
        console.log(data)
        let that = this
        var myChart = echarts.init(document.getElementById(id));
        var colors = ['#602221', '#ffb148', '#ffe0b7'];
        let seriesData = []
        data.amountData.forEach((item, index) => {
          seriesData.push({
            name: item.groupName,
            type: 'bar',
            itemStyle: {normal: {color: colors[index]}},
            // barMinHeight: 8,
            barWidth: 10,
            barGap: '10%',
            data: item.amount
          })
        })
        seriesData.push({
          name: '股价',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {normal: {color: '#C0BAA7'}},
          symbol: "circle",
          symbolSize: 7,
          data: data.stockPrice
        })
        var option = {
          title: {
            text: '市值： (亿元)',
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
              if (!data[0].name) {
                return ''
              } else {
                let html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                      <span>${data[0].name}</span>
                      </div>`
                data.forEach((item, index) => {
                  let value = 0
                  if (item.seriesName == '股价' && item.value) {
                    value = item.value.toFixed(2)
                  } else {
                    value = that.$array.amountAbs(item.value)
                  }
                  html += `
                  <div style="display:flex;justify-content:space-between">
                    <span>${item.seriesName}：</span><span>${value}</span>
                  </div>
                `
                })
                return html
              }
            }
          },
          grid: {
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
            formatter: function (name) {
              if (name == '股价') {
                return name + '(元)'
              } else {
                return name + '(股)'
              }
            },
            data: data.groupName
//             data: ['辖区总市值1', '监管公司市值2', '监管公司市值占比3']
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 30,
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
            },
            data: data.dateTime
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
                show: false
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
          series: seriesData
          /* series: [
            {
              name: '辖区总市值',
              type: 'bar',
              itemStyle: {normal: {color: color[0]}},
              barMinHeight: 8,
              barWidth: 19,
              barGap: '100%',
              data: data.areaMarketValue
            },
            {
              name: '监管公司市值',
              type: 'bar',
              itemStyle: {normal: {color: color[1]}},
              barMinHeight: 8,
              barWidth: 19,
              barGap: '100%',
              data: data.companyMarketValue
            },
            {
              name: '监管公司市值占比',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: '#C0BAA7'}},
              symbol: "circle",
              symbolSize: 7,
              data: data.stockPrice
            }
          ] */
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss">
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
  }
</style>
