<template>
  <div id="groupset-yemanren">
    <!--野蛮人管理-->
    <el-card shadow="never" class="export-list">
      <div slot="header" class="header-box">
        <span>自定义分组管理</span>
        <el-button type="primary" class="export-btn fright" size="small" @click="openSetDialog()">新建股东分组</el-button>
      </div>
      <div class="listBox">
        <el-table :data="tableData" style="width: 100%" @sort-change="tableSortChange" :span-method="arraySpanMethod" stripe size="mini">
          <el-table-column prop="date" label="序号" width="90" align="center" >
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="组名" align="center" width="180" >
            <template slot-scope="scope">
              <el-row>
                <el-col :span="6" class="item1">
                  <span class="pointer" @click="showItemInfo(scope.row,scope.$index)" :title="scope.row.groupName">
                    {{$common.number(scope.row.groupName)}}
                    <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                    <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                  </span>
                </el-col>
                <el-col :span="4" class="item2">{{scope.row.groupPersonNumber}}</el-col>
                <el-col :span="7" class="item3">{{$array.amountAbs(scope.row.groupHolderShareAmount)}}</el-col>
                <el-col :span="7" class="item4">{{tofix(scope.row.groupHolderShareRatio)}}</el-col>
              </el-row>
              <div class="group-info" v-show="scope.row.showList">
                <el-row  v-for="(item,index) in scope.row.rollOfficialDataList" :key="index">
                  <el-col :span="6" class="item1">
                    <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+item.id" target="_blank">
                      <div class="possessorname" :title="item.possessorName">{{ item.possessorName}}</div>
                    </router-link>
                  </el-col>
                  <el-col :span="4" class="item2">&nbsp;</el-col>
                  <el-col :span="7" class="item3">{{$array.amountAbs(item.possessorAmount)}}</el-col>
                  <el-col :span="7" class="item4">{{tofix(item.possessorRatio)}}</el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="groupPersonNumber" label="成员数(个)" sortable="custom" width="120" align="right">
          </el-table-column>
          <el-table-column prop="groupHolderShareAmount" label="最新持股数量(股)" width="210" align="right" sortable="custom">
          </el-table-column>
          <el-table-column prop="groupHolderShareRatio" label="最新持股比例(%)" width="180" align="right">
          </el-table-column>
          <el-table-column prop="groupHolderShareGuardLine" label="持股比例警戒线(%)" align="right">
            <template slot-scope="scope">
              {{scope.row.groupHolderShareGuardLine || '--'}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <img class="show-icon pointer" :src="$image.stockholder.edit" title="编辑" @click="editGroup(scope.row)">
              <img class="show-icon pointer" :src="$image.stockholder.set" title="设置持股比例警戒线" @click="setWarnGroup(scope.row)">
              <img class="pointer" :src="$image.stockholder.delete" title="删除" @click="deleteGroup(scope.row)">
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--新建股东分组-->
    <el-dialog class="dialogStockHolder" :visible.sync="setDialog" width="620px" top="35vh" center>
      <template slot="title">新建自定义分组</template>
      <div>股东分组名称 <el-input v-model="groupName" placeholder="请输入股东分组名称，仅限输入20个字符" style="width: 480px;" :maxlength="20"></el-input></div>
      <div class="btn-box">
        <el-button type="primary" class="btn-main" @click="closeSetDialog" plain size="small">取消</el-button>
        <el-button type="primary" class="btn-main" @click="addGroupName" size="small">下一步</el-button>
      </div>
    </el-dialog>
    <el-dialog class="dialogStockHolder add-yemanren" :visible.sync="setDialog2" width="900px" top="10vh" center>
      <template slot="title">{{isAdd?'新建自定义分组':'添加自定义组成员'}}</template>
      <div class="">
        <div class="box-search">
          <!-- <span class="sp">{{startRecordDate}}期</span> -->
          <el-select size="mini" v-model="startRecordDate" class="recordDate-select" @change="startRecordDateChange">
            <el-option v-for="item in recordDate" :key="item" :label="item+'期'" :value="item">
            </el-option>
          </el-select>
          <!--<el-select size="mini" v-model="startRecordDate" placeholder="选择期数" class="recordDate-select" @change="startRecordDateChange">
            <el-option v-for="item in recordDate" :key="item" :label="item+'期'" :value="item">
            </el-option>
          </el-select>
          <span class="split">至</span>
          <el-select size="mini" v-model="endRecordDate" placeholder="选择期数" class="recordDate-select">
            <el-option v-for="item in recordDate" :key="item" :label="item+'期'" :value="item" :disabled="new Date(startRecordDate) > new Date(item)">
            </el-option>
          </el-select>-->
          <span class="span-text ml sp">股东性质</span>
          <el-select size="mini" v-model="possessorTypeValue" placeholder="" class="recordDate-select ml" @change="searchHolderInfo">
            <el-option v-for="item in possessorTypes" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
          <span class="span-text ml sp">股东名称</span>
          <el-input v-model="possessorName" placeholder="请输入内容" size="mini" class="stockname ml"></el-input>
          <el-button type="primary" icon="el-icon-search"  size="mini" class="ml" @click="searchHolderInfo"></el-button>
          <!--<el-button type="primary"  size="mini" class="ml" @click="showMoreHandle">{{showMore?'收起':'更多'}}</el-button>-->
        </div>
        <!--<div class="box-search" v-show="showMore">
          <span class="more-text">股东地址中包含</span>
          <el-input v-model="holderAddress" placeholder="多关键词用空格隔开" size="mini" class="stockname"></el-input>
          <span class="more-text">身份证号码中包含</span>
          <el-input v-model="holderIdNumber" placeholder="多关键词用空格隔开" size="mini" class="stockname"></el-input>
          <span class="more-text">邮政编码中包含</span>
          <el-input v-model="holderPostCode" placeholder="多关键词用空格隔开" size="mini" class="stockname"></el-input>
        </div>-->
        <div class="holderInfo-box">
          <div class="hleft">
            <el-table :data="holderInfo" style="width: 100%" height="362" class="holderInfo" stripe size="mini">
              <!--<el-table-column prop="onePasswordAccount" label="排名" width="50" align="center">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
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
        <el-button type="primary" class="btn-main" @click="addGroup" size="small" v-if="isAdd">确认</el-button>
        <el-button type="primary" class="btn-main" @click="editGroupInfoAccount" size="small" v-else>确认</el-button>
      </div>
    </el-dialog>

    <!--编辑分组-->
    <el-dialog class="dialogStockHolder group-edit-dialog" :visible.sync="editDialog" width="900px" center>
      <template slot="title">编辑分组</template>
      <div class="setkonggu-content">
        <div class="edit-groupname">
          <span>分组名称</span>
          <el-input maxlength="20" v-model="editGroupName" placeholder="请输入内容" size="mini" class="group-name"></el-input>
          <el-button type="primary"  size="mini" class="ml" @click="editGroupAccount">新增组成员</el-button>
        </div>
        <el-table :data="editGroupItem.rollOfficialDataList" style="width: 100%" height="380" class="holderInfo" stripe size="mini">
          <el-table-column prop="onePasswordAccount" label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
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
          <el-table-column prop="possessorTypeName" label="股东性质" width="150" align="center">
          </el-table-column>
          <el-table-column prop="onePasswordAccount" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <!--<el-checkbox v-model="scope.row.ischecked" @change="holderChk(scope.row,scope.$index)"></el-checkbox>-->
              <img class="pointer" :src="$image.stockholder.delete" @click="deleteEditGroupItem(scope.row,scope.$index)">
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div class="allstock-count">共{{holderInfo.length}}条</div>-->
      <div class="center top20">
        <el-button type="primary" class="btn-main" @click="closeSetDialog" plain size="small">取消</el-button>
        <el-button type="primary" class="btn-main" @click="editGroupInfo" size="small">确认</el-button>
      </div>
    </el-dialog>

    <!--设置持股比例警戒线-->
    <el-dialog class="dialogStockHolder setWarn" :visible.sync="warnDialog" width="620px" top="35vh" center>
      <template slot="title">自定义分组持股比例设置</template>
      <div>自定义分组持股比例合计变动值达到 <span class="text-primary">{{warnValue}}%</span> ，将在“最新股东分析”界面提醒。 </div>
      <div>
        <el-slider v-model="warnValue" :step="0.5"></el-slider>
      </div>
      <div class="min-max-value">
        <span>0%</span>
        <span>100%</span>
      </div>
      <div class="btn-box">
        <el-button type="primary" class="btn-main" @click="closeWarnDialog" plain size="small">取消</el-button>
        <el-button type="primary" class="btn-main" @click="editGroupGuardLine" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        groupType: 4,
        userId: '',
        setDialog: false,
        setDialog2: false,
        isAdd: true,
        warnDialog: false,
        editDialog: false,
        warnValue: 0,
        // 新建弹窗
        showMore: false,
        groupName: '',
        startRecordDate: '',
        endRecordDate: '',
        possessorName: '',
        holderAddress: '',
        holderIdNumber: '',
        holderPostCode: '',
        radio: '0',
        groupListInfo: [],
        editGroupName: '',
        editGroupItem: {},
        onePasswordAccounts: '',
        tableData: [],
        total: 30,
        pageNum: 1,
        pageSize: 10,
        holderInfo: [],
        holderInfoAdd: [],
        recordDate: [],
        possessorTypeValue:'',
        possessorTypes: [],
        kongGuRatio: 0,
        sortTable: {
          groupPersonNumber: '',
          groupHolderShareAmount: ''
        }
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
      startRecordDateChange () {
        this.pageNum = 1;
        this.searchHolderInfo();
        // if (new Date(this.startRecordDate) > new Date(this.endRecordDate)) {
        //   this.endRecordDate = this.startRecordDate
        // }
      },
      tofix (value) {
        if (value == null || value == undefined || value === '') {
          return '--'
        } else if (value == 0) {
          return 0
        } else {
          return value.toFixed(2)
        }
      },
      // 添加组操作
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
      // 显示隐藏更多搜索
      showMoreHandle() {
        this.showMore = !this.showMore
        if (!this.showMore) {
          this.holderAddress = ''
          this.holderIdNumber = ''
          this.holderPostCode = ''
        }
      },
      // 组列表操作
      // 显示组成员
      showItemInfo (row, index) {
        this.tableData.forEach((item, i) => {
          if (item.id == row.id) {
            item.showList = !item.showList
          }
        })
        // this.$set(this.tableData[index], 'showList', !this.tableData[index].showList)
        this.tableData = Object.assign([], this.tableData)
      },
      // 分布
      pageChange (index) {
        this.pageNum = index;
        this.searchHolderInfo()
      },
      // 表格合并列
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          return [1, 4];
        } else if (columnIndex == 2 || columnIndex == 3 || columnIndex == 4) {
          return [0, 0]
        }
      },
      // 新建分组弹窗按钮
      openSetDialog () {
        this.groupName = ''
//        this.startRecordDate = this.recordDate[0]
//        this.endRecordDate = this.recordDate[this.recordDate.length - 1]
        this.possessorTypeValue = ''
        this.possessorName = ''
        this.isAdd = true
        this.setDialog = true
        if (this.possessorTypes.length == 0) {
          this.getPossessorTypes()
        }
//        if (this.holderInfo.length == 0) {
//          this.searchHolderInfo()
//        }
        this.holderInfoAdd = []
        this.pageNum = 1
        this.searchHolderInfo()
      },
      // 关闭新建弹窗
      closeSetDialog () {
        this.setDialog = false
        this.setDialog2 = false
        this.warnDialog = false
        this.editDialog = false
      },
      // 添加组名操作
      addGroupName () {
        if (this.groupName) {
          this.setDialog2 = true
        } else {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '请输入股东分组名称，仅限输入10个字符！'})
        }
      },
      // 关闭警戒线设置弹窗
      closeWarnDialog () {
        this.warnDialog = false
      },
      // 修改警戒线
      editGroupGuardLine () {
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.editGroupGuardLine,
          params: {
            userId: this.userId,
            groupId: this.editGroupItem.id,
            groupHolderShareGuardLine: this.warnValue
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.warnDialog = false
            this.$message({showClose: true, type: "success", duration: 3000, message: '修改成功'})
            this.getGroupListInfo()
          }
        })
      },
      // 获取组信息
      getGroupListInfo () {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getGroupListInfo,
          params: {
            userId: this.userId,
            groupType: 'ZI_DING_YI',
            isOne: 1,
            personNumberOrder: this.sortTable.groupPersonNumber,
            possessorAmountOrder: this.sortTable.groupHolderShareAmount
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.groupListInfo = res.data.returnObject
            // this.kongGuRatio = this.groupListInfo.KONG_GU_RATIO
            // this.kongGuRatio = 3
            this.tableData = this.groupListInfo.ZI_DING_YI || [] // .rollOfficialDataList
            this.tableData.forEach(item => {
              item.showList = false
            })
//            let idsArray = this.tableData.map(e => e.onePasswordAccount)
//            this.onePasswordAccounts = idsArray.join(',')
          }
        })
      },
      // 添加组
      addGroup () {
        // let groupId = this.groupListInfo.YE_MAN_REN.id
        let onePass = []
        this.holderInfoAdd.forEach((item) => {
          onePass.push(item.onePasswordAccount)
        })
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.addGroup,
          params: {
            userId: this.userId,
            groupId: '',
            groupName: this.groupName,
            groupType: this.groupType,
            onePassWordAccounts: onePass.join(',')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.setDialog = false
            this.setDialog2 = false
            this.$message({showClose: true, type: "success", duration: 3000, message: '添加成功'})
            this.getGroupListInfo()
          }
        })
      },
      // 打开编辑弹窗
      editGroup(item) {
        this.editDialog = true
        this.editGroupItem = item
        this.editGroupName = item.groupName
      },
      // 删除编辑组成员
      deleteEditGroupItem(item, index) {
        this.$confirm('您将删除组成员' + item.possessorName + '，是否删除?', '小安提示', {
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
              groupId: this.editGroupItem.id
            }
          }).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.editGroupItem.rollOfficialDataList.splice(index, 1)
              this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'})
              this.getGroupListInfo()
            }
          })
        }).catch(() => {

        })
      },
      // 打开警戒线弹窗
      setWarnGroup(item) {
        this.warnValue = 0
        this.warnDialog = true
        this.editGroupItem = item
        this.warnValue = item.groupHolderShareGuardLine
      },
      // 删除分组
      deleteGroup (item) {
        this.$confirm('您将删除' + item.groupName + '分组，是否删除?', '小安提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.gxfApi.deleteGroup,
            params: {
              userId: this.userId,
              groupId: item.id
            }
          }).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'})
              this.getGroupListInfo()
            }
          })
        }).catch(() => {

        })

      },
      // 编辑分组
      editGroupInfo() {
        let onePassWordAccounts = this.editGroupItem.rollOfficialDataList.map(e => e.onePasswordAccount).join(',')
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.editGroupInfo,
          params: {
            userId: this.userId,
            groupId: this.editGroupItem.id,
            groupName: this.editGroupName,
            groupType: this.groupType,
            onePassWordAccounts: onePassWordAccounts
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.editDialog = false
            this.$message({showClose: true, type: "success", duration: 3000, message: '编辑成功'})
            this.getGroupListInfo()
          }
        })
      },
      // 编辑组成员 编辑接口，参数从添加界面获取
      editGroupInfoAccount() {
        let onePassWordAccounts = this.holderInfoAdd.map(e => e.onePasswordAccount).join(',')
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.editGroupInfo,
          params: {
            userId: this.userId,
            groupId: this.editGroupItem.id,
            groupName: this.editGroupName,
            groupType: this.groupType,
            onePassWordAccounts: onePassWordAccounts
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.setDialog2 = false
            this.$message({showClose: true, type: "success", duration: 3000, message: '编辑成功'})
            this.getGroupListInfo()
          }
        })
      },
      // 新增加组成员
      editGroupAccount() {
        this.isAdd = false
        this.editDialog = false
        this.setDialog2 = true
//        this.startRecordDate = this.recordDate[0]
//        this.endRecordDate = this.recordDate[this.recordDate.length - 1]
        if (this.possessorTypes.length == 0) {
          this.getPossessorTypes()
        }
        this.holderInfoAdd = Object.assign([], this.editGroupItem.rollOfficialDataList)
        this.searchHolderInfo()
      },
      // 股东人员信息
      searchHolderInfo () {
        let paras = {
          recordStartDate: this.startRecordDate,
          recordEndDate: this.startRecordDate,
          holderPropertys: this.possessorTypeValue,
          holderName: this.possessorName,
          holderAddress: this.holderAddress,
          holderIdNumber: this.holderIdNumber,
          holderPostCode: this.holderPostCode,
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
              this.startRecordDate = this.recordDate[0]
              this.endRecordDate = this.recordDate[0]
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
  #groupset-yemanren {
    .allstock-count {
      font-size:12px;
      color: #B4B4B4;
      padding-top: 5px;
      text-align: left;
    }
  }
  .add-yemanren {
    .box-search {
      font-size: 12px;
      display: flex;
      align-items: center;
      padding-bottom: 8px;
      .ml {
        display: inline-block;
        margin-left: 10px;
      }
    }
    .recordDate-select {
      width: 135px;
    }
    .split {
      padding: 0 5px;
    }
    .span-text {
      width: 60px;
    }
    .sp {
      white-space: nowrap;
    }
    .stockname {
      width: 440px;
    }
    .more-text {
      white-space: nowrap;
      padding-right: 6px;
      padding-left: 6px;
      &:first-child {
        padding-left: 0
      }
    }
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
  .setWarn {
    .el-slider__bar {
      background-color: #FFD091;
      height: 14px;
    }
    .el-slider__button {
      width:14px;
      height:23px;
      background:#FFB148;
      border-radius:1px;
    }
    .el-slider__button-wrapper {
      top: -12px;
    }
    .el-slider__runway {
      height: 14px;
    }
    .min-max-value {
      display: flex;
      justify-content: space-between;
      margin-top: -10px;
      color: #8D8D8D;
    }
  }
  .group-edit-dialog {
    .edit-groupname {
      font-size: 12px;
      padding-bottom: 16px;
      .group-name{
        width: 686px;
        margin-left:8px;
      }
      .ml {
        margin-left: 16px;
      }
    }
  }
</style>
