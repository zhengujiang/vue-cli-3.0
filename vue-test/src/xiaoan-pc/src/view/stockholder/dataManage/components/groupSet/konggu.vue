<template>
  <div id="groupset-konggu">
    <el-card shadow="never" class="export-list">
      <div slot="header" class="header-box">
        <span>控股股东及一致行动人管理</span>
        <el-button type="primary" class="export-btn fright" size="small" @click="openSetDialog()">设置控股股东</el-button>
      </div>
      <div class="listBox">
        <el-table :data="rollOfficialDataList" style="width: 100%" stripe size="mini" :default-sort="{prop:'possessorAmount', order: 'descending'}">
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
          <el-table-column prop="possessorTypeName" label="股东性质" width="180" align="center">
          </el-table-column>
          <el-table-column prop="possessorAmount" label="持股数量(股)" width="180" align="right" sortable>
            <template slot-scope="scope">{{$array.amountAbs(scope.row.possessorAmount)}}</template>
          </el-table-column>
          <el-table-column prop="possessorRatio" label="持股比例(%)" width="150" align="right">
            <template slot-scope="scope">{{tofix(scope.row.possessorRatio)}}</template>
          </el-table-column>
          <el-table-column prop="onePasswordAccount" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <img class="pointer" :src="$image.stockholder.delete" title="删除" @click="deleteHoldCrew(scope.row)">
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--设置控股股东-->
    <el-dialog class="dialogStockHolder set-kong-gu" :visible.sync="setDialog" width="900px" center>
      <template slot="title">设置控股股东</template>
      <div class="setkonggu-content">
        <div class="konggu-search">
          <!-- <span class="sp">{{lastRecordDate}}期</span> -->
          <el-select size="mini" v-model="lastRecordDate" placeholder="选择期数" class="recordDate-select" @change="startRecordDateChange">
            <el-option v-for="item in recordDate" :key="item" :label="item+'期'" :value="item">
            </el-option>
          </el-select>
          <span class="ml sp">股东性质</span>
          <el-select size="mini" v-model="possessorTypeValue" placeholder="" class="gdxj ml" @change="searchHolderInfoReset">
            <el-option v-for="item in possessorTypes" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
          <span class="ml sp">股东名称</span>
          <el-input v-model="possessorName" placeholder="请输入内容" size="mini" class="stock-name ml"></el-input>
          <el-button type="primary" icon="el-icon-search"  size="mini" class="ml" @click="searchHolderInfoReset"></el-button>
        </div>
        <!--<el-table :data="holderInfo" style="width: 100%" height="380" class="holderInfo" stripe size="mini">
          <el-table-column prop="onePasswordAccount" label="排名" width="50" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="possessorName" label="股东名称" align="center">
            <template slot-scope="scope">
              <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.id" target="_blank">
                <div class="possessorname" :title="scope.row.possessorName">{{ scope.row.possessorName}}</div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="possessorAmount" label="持股数量(股)" width="150" align="right" sortable>
            <template slot-scope="scope">{{$array.amountAbs(scope.row.possessorAmount)}}</template>
          </el-table-column>
          <el-table-column prop="possessorRatio" label="持股比例(%)" width="150" align="right">
            <template slot-scope="scope">{{tofix(scope.row.possessorRatio)}}</template>
          </el-table-column>
          <el-table-column prop="possessorTypeName" label="股东性质" width="180" align="center">
          </el-table-column>
          <el-table-column prop="onePasswordAccount" label="控股股东" width="100" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.ischecked" @change="holderChk(scope.row,scope.$index)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
-->
        <div class="holderInfo-box">
          <div class="hleft">
            <el-table :data="holderInfo" style="width: 100%" height="362" class="holderInfo" stripe size="mini">
              <!--<el-table-column prop="onePasswordAccount" label="排名" width="50" align="center">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>-->
              <el-table-column prop="possessorName" label="股东名称" align="center">
                <template slot-scope="scope">
                  <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.id" target="_blank">
                    <div class="possessorname" :title="scope.row.possessorName">{{ scope.row.possessorName}}</div>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column prop="recordDate" label="期数" align="center" width="100">
              </el-table-column>
              <el-table-column prop="possessorAmount" label="持股数量(股)" width="120" align="right">
                <template slot-scope="scope">{{$array.amountAbs(scope.row.possessorAmount)}}</template>
              </el-table-column>
              <el-table-column prop="possessorRatio" label="持股比例(%)" width="100" align="right">
                <template slot-scope="scope">{{tofix(scope.row.possessorRatio)}}</template>
              </el-table-column>
              <el-table-column prop="possessorTypeName" label="股东性质" width="130" align="center">
              </el-table-column>
              <el-table-column prop="onePasswordAccount" label="操作" width="60" align="center">
                <template slot-scope="scope">
                  <!--<span v-show="!scope.row.ischecked" class="addh" @click="addToRight(scope.row, scope.$index)">+</span>-->
                  <!--<span v-show="scope.row.ischecked" class="addhyet">+</span>-->
                  <i class="iconfont web-jia addh" v-show="!scope.row.ischecked" @click="addToRight(scope.row, scope.$index)"></i>
                  <i class="iconfont web-jia addhyet" v-show="scope.row.ischecked"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="center pagination" v-if="total>20">
              <el-pagination background layout="prev, pager, next" :total="total" :current-page="pageNum" :page-size="10" @current-change="pageChange" :small="true"></el-pagination>
            </div>
          </div>
          <div class="hright">
            <el-table :data="holderInfoAdd" style="width: 100%" height="362" class="holderInfo" stripe size="mini">
              <!--<el-table-column prop="onePasswordAccount" label="排名" width="50" align="center">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>-->
              <el-table-column prop="possessorName" label="已添加股东名称" align="left">
                <template slot-scope="scope">
                  <div class="possessorname" :title="scope.row.possessorName">{{ scope.row.possessorName}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="onePasswordAccount" label="操作" width="60" align="center">
                <template slot-scope="scope">
                  <img class="pointer" :src="$image.stockholder.delete" @click="deleteTo(scope.row, scope.$index)">
                </template>
              </el-table-column>
            </el-table>
            <div class="r-btn-box">
              <span class="span-btn" @click="addAll">全部添加</span>
              <span class="span-btn" @click="deleteAll">全部删除</span>
            </div>
          </div>

        </div>
      </div>
      <!--<div class="allstock-count">共{{holderInfo.length}}条</div>-->
      <div class="center top20">
        <el-button type="primary" class="btn-main" @click="closeSetDialog" plain size="small">取消</el-button>
        <el-button type="primary" class="btn-main" @click="addKongGu" size="small">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog class="dialogStockHolder setHolderIe" :visible.sync="setDialog2" width="620px" top="35vh" center>
      <template slot="title">设置控股股东</template>
      <div>修改范围</div>
      <div class="editstage">
        <div><el-radio v-model="radio" label="0">仅修改{{lastRecordDate}}期数据</el-radio></div>
        <div><el-radio v-model="radio" label="1" :disabled="recordDate.length<=1">修改{{lastRecordDate}}期及以前的数据</el-radio></div>
      </div>
      <div class="center top20">
        <el-button type="primary" class="btn-main" @click="setDialog2=false" plain size="small">取消</el-button>
        <el-button type="primary" class="btn-main" @click="setControllShareholder" size="small">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        setDialog: false,
        setDialog2: false,
        addDialog: false,
        possessorName: '',
        radio: '0',
        groupListInfo: [],
        onePasswordAccounts: '',
        rollOfficialDataList: [],
        holderInfo: [],
        recordDate: [],
        startRecordDate: '',
        lastRecordDate: '',
        possessorTypeValue:'',
        possessorTypes: [],
        holderInfoAdd: [],
        total: 30,
        pageNum: 1,
        pageSize: 10
      }
    },
    props: {
//      data: Array,
//      holderInfo: Array
//      recordDate: Array,
//      possessorTypes: Array
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getGroupListInfo()
      this.getLastedRecordDate()
      // this.searchHolderInfo()
    },
    mounted() {
    },
    // 方法
    methods: {
      tofix (value) {
        if (value == null || value == undefined || value === '') {
          return '--'
        } else if (value == 0) {
          return 0
        } else {
          return value.toFixed(2)
        }
      },
      holderChk (item, index) {
        this.holderInfo = Object.assign([], this.holderInfo)
      },
      openSetDialog () {
        this.setDialog = true
        if (this.possessorTypes.length == 0) {
          this.getPossessorTypes()
        }
        this.possessorTypeValue = ''
        this.holderInfoAdd = Object.assign([], this.rollOfficialDataList)
        this.holderInfo = []
        this.pageNum = 1
        this.searchHolderInfo()
      },
      closeSetDialog () {
        this.setDialog = false
      },
      addKongGu () {
        // this.setDialog2 = true
        this.setControllShareholder();
      },
      startRecordDateChange() {
        this.pageNum = 1;
        this.searchHolderInfo();
      },

      // + 号操作
      addToRight (item, index) {
        this.$set(this.holderInfo[index], 'ischecked', true)
        this.holderInfo = Object.assign([], this.holderInfo)
        this.holderInfoAdd.unshift(item)
      },
      // 全部添加
      addAll() {
        this.holderInfo.forEach((item, index) => {
          if (!item.ischecked) {
            // item.ischecked = true
            this.$set(this.holderInfo[index], 'ischecked', true)
            this.holderInfoAdd.unshift(item)
          }
        })
        this.holderInfo = Object.assign([], this.holderInfo)
      },
      // 删除已添加
      deleteTo (obj, i) {
        this.holderInfoAdd.splice(i, 1)
        this.holderInfo.forEach((item, index) => {
          if (obj.onePasswordAccount == item.onePasswordAccount) {
            this.$set(this.holderInfo[index], 'ischecked', false)
          }
        })
        this.holderInfo = Object.assign([], this.holderInfo)
      },
      // 删除所有已添加
      deleteAll() {
        this.holderInfoAdd = []
        this.holderInfo.forEach((item, index) => {
          this.$set(this.holderInfo[index], 'ischecked', false)
        })
        this.holderInfo = Object.assign([], this.holderInfo)
      },

      pageChange (index) {
        this.pageNum = index;
        this.searchHolderInfo()
      },
      // 获取组信息
      getGroupListInfo () {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getGroupListInfo,
          params: {
            userId: this.userId,
            groupType: 'KONG_GU',
            isOne: 1
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.groupListInfo = res.data.returnObject
            this.rollOfficialDataList = this.groupListInfo.KONG_GU[0].rollOfficialDataList || []
            let idsArray = this.rollOfficialDataList.map(e => e.onePasswordAccount)
            this.onePasswordAccounts = idsArray.join(',')

          }
        })
      },
      // 设置控股股东
      setControllShareholder () {
        let groupId = this.groupListInfo.KONG_GU[0].id
        let onePass = []
        this.holderInfoAdd.forEach((item, index) => {
          onePass.push(item.onePasswordAccount)
        })
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.setControllShareholder,
          params: {
            userId: this.userId,
            groupId: groupId,
            onePass: onePass.join(','),
            // dateLimit: this.radio,
            // recordDate: this.lastRecordDate
            dateLimit: '',
            recordDate: ''
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.setDialog = false
            this.setDialog2 = false
            this.$message({showClose: true, type: "success", duration: 3000, message: '设置成功'})
            this.getGroupListInfo()
            this.$emit('updateWarn')
          }
        })
      },
      // 删除控股股东
      deleteHoldCrew (item) {
        this.$confirm('你将删除控股股东 ' + item.possessorName + '，是否删除?', '小安提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.gxfApi.deleteHoldCrew,
            params: {
              userId: this.userId,
              holderId: item.onePasswordAccount,
              groupId: this.groupListInfo.KONG_GU[0].id
            }
          }).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'})
              this.getGroupListInfo()
              this.$emit('updateWarn')
            }
          })
        }).catch(() => {

        })

      },
      searchHolderInfoReset() {
        this.pageNum = 1
        this.searchHolderInfo()
      },
      // 股东人员信息
      searchHolderInfo () {
        let paras = {
          recordStartDate: this.lastRecordDate,
          recordEndDate: this.lastRecordDate,
          holderPropertys: this.possessorTypeValue,
          holderName: this.possessorName,
          holderAddress: '',
          holderIdNumber: '',
          holderPostCode: '',
          holderPhone: '',
          holderProperty: '',
          userId: this.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        this.$axios.gxfApi.searchHolderInfo(paras)
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.holderInfo = res.data.returnObject
              this.total = res.data.total
              let onePass = this.holderInfoAdd.map(e => e.onePasswordAccount).join(',')
              this.holderInfo.forEach((item, index) => {
                if (onePass.indexOf(item.onePasswordAccount) > -1) {
                  item.ischecked = true
                } else {
                  item.ischecked = false
                }
              })
            }
          })
      },
      // 获取名册期数
      getLastedRecordDate () {
        let paras = {
          userId: this.userId
        }
        this.$axios.gxfApi.getLastedRecordDate(paras)
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.recordDate = res.data.returnObject
              this.lastRecordDate = this.recordDate[0]
            }
          })
      },
      // 股东性质
      getPossessorTypes () {
        this.$axios.gxfApi.getPossessorTypes()
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.possessorTypes = res.data.returnObject
              this.possessorTypes.unshift({'type':'', 'name': '全部'})
              this.possessorTypeValue = this.possessorTypes[0].type
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  #groupset-konggu {
    .allstock-count {
      font-size:12px;
      color: #B4B4B4;
      padding-top: 5px;
      text-align: left;
    }
    .setHolderIe {
      .el-dialog__body {
        text-align: left;
      }
    }
  }
  .set-kong-gu {
    .holderInfo-box {
      height: 408px;
      .hleft {
        width: 614px;
        float: left;
        border: 1px solid #e3e3e3;
        .pagination {
          padding: 5px 0;
        }
      }
      .hright {
        width: 240px;
        float: right;
        border: 1px solid #e3e3e3;
        .r-btn-box {
          height: 36px;
          line-height: 36px;
          text-align: right;
          .span-btn {
            font-size: 12px;
            color: #ffb148;
            margin-right: 10px;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
