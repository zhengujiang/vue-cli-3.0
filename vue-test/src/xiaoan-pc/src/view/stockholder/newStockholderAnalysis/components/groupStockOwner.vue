<template>
  <div class="group-stock-owner">
    <el-card shadow="never" class="el-cardbox">
      <div slot="header" class="header-box">
        <span>{{title}}</span>
        <span class="manage-btn" @click="goManageGroup()">管理分组</span>
      </div>
      <div class="listBox">
        <el-table ref="dataTable" :data="tableData" style="width: 100%" @sort-change="tableSortChange" :span-method="arraySpanMethod" stripe size="mini">
          <!--:default-sort="{prop:'groupHolderShareAmount', order: 'descending'}"-->
          <el-table-column prop="date" label="序号" width="90" align="center" >
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="组名" align="center">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="6" class="p-right">
                  <span class="pointer" @click="showItemInfo(scope.row,scope.$index)" :title="scope.row.groupName">
                    {{$common.number(scope.row.groupName)}}
                    <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                    <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                  </span>
                </el-col>
                <el-col :span="4" class="t-right p-right">{{scope.row.groupPersonNumber}}</el-col>
                <el-col :span="7" class="t-right p-right">{{$array.amountAbs(scope.row.groupHolderShareAmount)}}
                </el-col>
                <el-col :span="7" class="t-right">{{scope.row.groupHolderShareRatio}}</el-col>
              </el-row>
              <div class="group-info" v-show="scope.row.showList">
                <el-row v-for="(item,index) in scope.row.rollOfficialDataList" :key="index">
                  <el-col :span="6" class="p-right">
                    <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+item.id"
                                 target="_blank">
                      <div class="possessorname" :title="item.possessorName">{{ item.possessorName}}</div>
                    </router-link>
                  </el-col>
                  <el-col :span="4" class="t-right p-right">&nbsp;</el-col>
                  <el-col :span="7" class="t-right p-right">{{$array.amountAbs(item.possessorAmount)}}</el-col>
                  <el-col :span="7" class="t-right">{{item.possessorRatio}}</el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="groupPersonNumber" label="成员数(个)" width="120" align="right" sortable="custom">
          </el-table-column>
          <el-table-column prop="groupHolderShareAmount" label="持股数量(股)" width="180" align="right" sortable="custom">
            <template slot-scope="scope">{{$array.amountAbs(scope.row.groupHolderShareAmount)}}</template>
          </el-table-column>
          <el-table-column prop="groupHolderShareRatio" label="持股比例(%)" width="200" align="right">
            <template slot-scope="scope">{{scope.row.groupHolderShareRatio.toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="groupHolderShareGuardLine" label="持股比例警戒线(%)" width="200" align="right">
          </el-table-column>
          <el-table-column prop="" label="" width="40">
          </el-table-column>
          <el-table-column prop="groupHolderShareGuardLine" label="警戒进度条" width="180" align="center">
            <template slot-scope="scope">
              <div class="progress-box">
                <el-progress :percentage="scope.row.progressValue" color="#FFB148" v-if="scope.row.progressValue<50"></el-progress>
                <el-progress :percentage="scope.row.progressValue" color="#FB4319" v-else></el-progress>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title: '',
        tableData: [],
        sortTable: {
          groupPersonNumber: '',
          groupHolderShareAmount: ''
        }
      }
    },
    props: ['groupType', 'recordDate'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      recordDate: function (val) {
        if (val) {
          this.$refs.dataTable.clearSort();
          this.sortTable.groupPersonNumber = '';
          this.sortTable.groupHolderShareAmount = '';
          this.getGroupListInfo();
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      if (this.groupType == 2) {
        this.title = '野蛮人最新持股情况'
      } else if (this.groupType == 3) {
        this.title = '其他一致行动人最新持股情况'
      } else if (this.groupType == 4) {
        this.title = '其他分组最新持股情况'
      } else if (this.groupType == 5) {
        this.title = '相同管理人旗下产品最新持股情况'
      }
      this.getGroupListInfo()
    },
    mounted() {
    },
    // 方法
    methods: {
      // 表格合并列
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          return [1, 4];
        } else if (columnIndex == 2 || columnIndex == 3 || columnIndex == 4) {
          return [0, 0]
        }
      },
      goManageGroup() {
        this.$router.push('/stockholder/groupSet')
      },
      showItemInfo (row, index) {
        this.tableData.forEach((item, i) => {
          if (item.id == row.id) {
            item.showList = !item.showList
          }
        })
        this.tableData = Object.assign([], this.tableData)
      },
      tableSortChange (scope) {
        console.log(scope);
        this.sortTable = {
          groupPersonNumber: '',
          groupHolderShareAmount: ''
        }
        let sort = {
          'ascending': 'ASC',
          'descending': 'DESC',
          'null': ''
        };
        this.sortTable[scope.prop] = sort[scope.order];
        this.getGroupListInfo();
      },
      // 获取组信息 <!--2:野蛮人;3:其他一致行动人;4:自定义分组-->
      getGroupListInfo () {
        let gType = 'YE_MAN_REN'
        if (this.groupType == 3) {
          gType = 'QI_TA_XING_DONG_REN'
        } else if (this.groupType == 4) {
          gType = 'ZI_DING_YI'
        } else if (this.groupType == 5) {
          gType = 'MANAGER_FUND'
        }
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getGroupListInfo,
          params: {
            userId: this.userId,
            recordDate: this.recordDate,
            groupType: gType,
            isOne: 1,
            personNumberOrder: this.sortTable.groupPersonNumber,
            possessorAmountOrder: this.sortTable.groupHolderShareAmount
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.groupListInfo = res.data.returnObject
            if (this.groupType == 2) {
              this.tableData = this.groupListInfo.YE_MAN_REN || []
            } else if (this.groupType == 3) {
              this.tableData = this.groupListInfo.QI_TA_XING_DONG_REN || []
            } else if (this.groupType == 4) {
              this.tableData = this.groupListInfo.ZI_DING_YI || []
            } else if (this.groupType == 5) {
              this.tableData = this.groupListInfo.MANAGER_FUND || []
            }
            // this.tableData = this.groupListInfo.YE_MAN_REN
            // this.tableData = this.groupListInfo.ZI_DING_YI
            // this.tableData = this.groupListInfo.QI_TA_XING_DONG_REN || []

            this.tableData.forEach(item => {
              item.showList = false
              let pvalue = parseInt((item.groupHolderShareRatio / item.groupHolderShareGuardLine).toFixed(2) * 100)
              if (pvalue > 100) {
                pvalue = 100
              }
              if (Number.isNaN(pvalue)) {
                pvalue = 0
              }
              item.progressValue = pvalue
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .group-stock-owner {
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
    .t-right {
      text-align: right;
    }
    .p-right {
      padding-right: 10px;
    }
    .progress-box {
      padding-top: 5px;
    }
    .el-progress-bar__outer {
      background-color: #D8D8D8;
    }
    .el-progress__text {
      font-size: 12px !important;
      width: 35px;
      text-align: left;
    }
    .el-table__body-wrapper {
      max-height: 349px;
      overflow-y: auto;
    }
    .el-table td {
      vertical-align: top !important;
    }
  }
</style>
