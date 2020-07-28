<template>
  <div id="accessTablesItem">
    <div class="right" v-if="showLookuptable">
      <div class="header">
        <ul class="head">
          <li class="title">
            <div class="text">{{ companyCode ? companyCode : '' }} {{ companyName ? companyName : '' }} 权限速查表</div>
          </li>
          <li class="unit">
            <ul>
              <li v-for="(list,index) in unitArr" :key="index" @click="selectUnit(index)">
                <span :class="{selectStyle: list.select}">{{ list.text }}</span>
                <span class="splitLine">|</span>
              </li>
            </ul>
            <span>单位：</span>
          </li>
        </ul>
      </div>
      <el-tabs type="border-card" tab-position="left" v-model="activeValue" @tab-click="selectSort" style="width: 100%">
        <el-tab-pane name="NonRelatedParty" label="非关联交易（担保除外）">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="240" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gdNum" :label="column_GD" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.gdNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.gdNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.gdNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="relatedParty" label="关联交易（担保除外）">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="180" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" width="180" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gdNum" :label="column_GD" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.gdNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.gdNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.gdNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="tenderGuarantee" label="提供担保">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="180" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" width="180" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">
                  <span v-if="scope.row.plNum == 'y'"><i class="iconfont web-dui"></i></span>
                  <span v-else>{{ $common.autoPrice(scope.row.plNum) }}</span>
                </span>
                <span v-else-if="selectNum == 1">
                  <span v-if="scope.row.plNum == 'y'"><i class="iconfont web-dui"></i></span>
                  <span v-else>{{ $common.yiUnit(scope.row.plNum) }}</span>
                </span>
                <span v-else-if="selectNum == 0">
                  <span v-if="scope.row.plNum == 'y'"><i class="iconfont web-dui"></i></span>
                  <span v-else>{{ $common.wanUnit(scope.row.plNum) }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="gdNum" :label="column_GD" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">
                  <span v-if="scope.row.gdNum == 'y'"><i class="iconfont web-dui"></i></span>
                  <span v-else-if="$common.autoPrice(scope.row.gdNum) == 'NaN.00'">{{ scope.row.gdNum }}</span>
                  <span v-else>{{ $common.autoPrice(scope.row.gdNum) }}</span>
                </span>
                <span v-else-if="selectNum == 1">
                  <span v-if="scope.row.gdNum == 'y'"><i class="iconfont web-dui"></i></span>
                  <span v-else-if="$common.yiUnit(scope.row.gdNum) == 'NaN.00'">{{ scope.row.gdNum }}</span>
                  <span v-else>{{ $common.yiUnit(scope.row.gdNum) }}</span>
                </span>
                <span v-else-if="selectNum == 0">
                   <span v-if="scope.row.gdNum == 'y'"><i class="iconfont web-dui"></i></span>
                  <span v-else-if="$common.wanUnit(scope.row.gdNum) == 'NaN.00'">{{ scope.row.gdNum }}</span>
                  <span v-else>{{ $common.wanUnit(scope.row.gdNum) }}</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="restructuring" label="重大资产重组">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="180" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_ZD" width="440" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.zdNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.zdNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.zdNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="majorContracts" :label="title4_ht">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="180" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" width="440" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="LitigationAndArbitration" label="诉讼及仲裁">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="240" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="governmentGrants" label="政府补助">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="180" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" width="440" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="impairmentOfAssets" label="资产减值">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="180" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{ scope.row.name }}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gdNum" :label="column_GD" align="right" v-if="this.marketSort !== 'ZX'">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.gdNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.gdNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.gdNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="seriousEmergency" label="重大突发事件" v-if="showColumn">
          <el-table :data="tableData" width="100%">
            <el-table-column prop="name" label="" width="180" align="left">
              <template slot-scope="scope">
                <div class="lookupName">
                  <span>{{scope.row.name}}</span>
                  <i class="iconfont web-i" @click="open4(scope.row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="plNum" :label="column_PL" width="440" align="right">
              <template slot-scope="scope">
                <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <ul id="small">
        <li v-if="sort == 0">
          <div class="bottom">* 基于{{ years }}年年报公布的财务数据测算</div>
          <div class="bottom"><span class="link text-primary" @click="accessTablesLink">查看最新权限速查表</span>
          </div>
        </li>
        <li v-else-if="sort !== 0">* 基于用户自定义的财务数据测算</li>
        <li>{{ market }}</li>
        <li>* 本页数据仅供参考，如需获得准确披露标准，请咨询信公咨询专属客户经理</li>
      </ul>
    </div>
    <div class="right errorMsg" v-else-if="!showLookuptable">
      <img :src="$image.user.lookuptables.feishangshi">
      <p>本功能仅适用于沪深上市公司，用户可在个人中心完善公司信息！</p>
      <el-button @click="goPersonal">前往完善</el-button>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="35%" center>
      <div>
        <div class="miaoshu" v-show="describe">
          <div class="titlem">描述</div>
          <p>{{ describe }}</p>
        </div>
        <div class="miaoshu" v-show="rules">
          <div class="titlem">计算标准</div>
          <div style="max-height: 300px;overflow: auto">
            <p v-for="n in rules" class="ruleText" style="margin-bottom: 1em">{{ n }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'accessTablesItem',
    data() {
      return {
        userObj: {},
        showLookuptable: true,
        column_GD: '股东大会',
        column_PL: '披露',
        column_ZD: '重大资产重组',
        unitArr: [
          {text: '万', select: false},
          {text: '亿', select: false},
          {text: '自适应', select: true}
        ],
        tabPaneData: [
          {name: '非关联交易（担保除外）', type: 'NonRelatedParty'},
          {name: '关联交易（担保除外）', type: 'relatedParty'},
          {name: '提供担保', type: 'tenderGuarantee'},
          {name: '重大资产重组', type: 'restructuring'},
          {name: '重大合同', type: 'majorContracts'},
          {name: '诉讼及仲裁', type: 'LitigationAndArbitration'},
          {name: '政府补助', type: 'governmentGrants'},
          {name: '资产减值', type: 'impairmentOfAssets'},
          {name: '重大突发事件', type: 'seriousEmergency'}
        ],
        selectNum: 2,
        tableData: [{
          name: '--',
          plNum: '--',
          gdNum: '--',
          zdNum: '--'
        }],
        centerDialogVisible: false,
        describe: '',
        rules: [],
        sort: 0,
        years: '2016',
        marketSort: 'SH',
        market: '* 适用于上交所主板披露规则',
        title4_ht: '重大合同',
        showColumn: false,
        companyCode: '',
        companyName: '',
        activeValue: 'NonRelatedParty'
      }
    },
    props: {
      // 本月日期
      companyId: '',
      activeName: ''
    },
    created() {

    },
    mounted() {

      this.getMyInfo();
    },
    watch: {
      activeName: function (val) {
        this.$nextTick(() => {
          if (this.activeName) {
            this.tabPaneData.forEach((item) => {
              if (item.name == '重大合同') {
                item.name = this.title4_ht;
              }
              if (item.name == this.activeName) {
                this.activeValue = item.type
              }
            })
          } else {
            this.activeValue = this.tabPaneData[0].type
          }
        })
        console.log('activeName', val);
      },
      marketSort: function (val) {
        if (val == 'SH') {
          this.market = '* 适用于上交所主板披露规则'
        } else if (val == 'SZ') {
          this.market = '* 适用于深交所主板披露规则'
        } else if (val == 'CY') {
          this.market = '* 适用于深交所创业板披露规则'
        } else if (val == 'ZX') {
          this.market = '* 适用于深交所中小板披露规则'
        } else {
          this.market = ''
        }
      }
    },
    methods: {
      accessTablesLink() {
        this.$common.openWindow('/accessTables');
      },
      changeDataMinside(x) {
        if (x == 'true') {
          this.getInsideList()
        }
      },
      changeDataM(x) {
        console.log('x = ', x)
        if (x == 'true') {
          this.getInsideListOut()
        }
      },
      goPersonal() {
        this.$router.push('/manage/person')
      },
      // 获取用户信息
      getMyInfo() {
        this.$http({
          methods: 'GET',
          url: this.$api.user.getMyInfo,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.userObj = res.data.returnObject;
            this.getInsideListOut()
          }
        }).catch((err) => {

        })
      },
      // 选择查看权限选项
      selectSort(key) {
        // console.log(key)
        var keys = key.index
        this.$store.commit('selectAccessColumn', key)
        if (keys == 0) {
          var transaction = this.dataList.transaction // 关联交易
          this.column_PL = '披露'
          this.changeData(transaction)
        } else if (keys == 1) {
          var relatedTransaction = this.dataList.relatedTransaction // 关联交易
          this.column_PL = '披露'
          if (this.marketSort == 'CY') {
            this.column_PL = '披露及董事会'
          }
          this.changeData(relatedTransaction)
        } else if (keys == 2) {
          var guarantees = this.dataList.guarantees // 提供担保
          this.column_PL = '披露及董事会'
          this.changeData(guarantees)
        } else if (keys == 3) {
          this.column_PL = '披露'
          var significantAssetRestructuring = this.dataList.significantAssetRestructuring
          this.tableData = []
          for (var i in significantAssetRestructuring) {
            var obj = {
              name: significantAssetRestructuring[i].projectName,
              zdNum: significantAssetRestructuring[i].otherCriteria,
              miaoshu: significantAssetRestructuring[i].description,
              guize: significantAssetRestructuring[i].disclosureRule
            }
            this.tableData.push(obj)
          }
        } else if (keys == 4) {
          this.column_PL = '披露及董事会'
          if (this.marketSort == 'ZX') {
            this.column_PL = '披露'
          } else if (this.marketSort == 'CY') {
            this.column_PL = '披露'
          }
          var especiallyMajorContract = this.dataList.especiallyMajorContract
          this.changeData(especiallyMajorContract)
        } else if (keys == 5) {
          this.column_PL = '披露'
          var litigationAndArbitration = this.dataList.litigationAndArbitration
          this.changeData(litigationAndArbitration)
        } else if (keys == 6) {
          this.column_PL = '披露'
          var governmentSubsidy = this.dataList.governmentSubsidy
          this.changeData(governmentSubsidy)
        } else if (keys == 7) {
          this.column_PL = '披露及董事会'
          if (this.marketSort == 'SH') {
            this.column_PL = '披露'
          }
          var impairmentOfSssets = this.dataList.impairmentOfSssets
          this.changeData(impairmentOfSssets)
        } else if (keys == 8) {
          this.column_PL = '披露'
          let majorEmergency = this.dataList.majorEmergency
          this.changeData(majorEmergency)
        }
      },
      changeData(arr) {
        this.tableData = []
        for (var i in arr) {
          var obj = {
            name: arr[i].projectName,
            plNum: arr[i].disclosureCriteria,
            gdNum: arr[i].meetingCriteria,
            miaoshu: arr[i].description,
            guize: arr[i].disclosureRule
          }
          this.tableData.push(obj)
        }
      },
      // 获取权限速查表 企业用户 获取权限速查表
      getInsideListOut() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.getPermissionCheckListEnterprise,
          params: {
            companyId: this.companyId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log('获取外部权限速查表', res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            var data = res.data.returnObject
            this.dataList = data.data;
            console.log('------- this.dataList.majorEmergency = ', this.dataList.majorEmergency)
            if (this.dataList.majorEmergency) {
              this.showColumn = true
            } else {
              this.showColumn = false
            }
            this.sort = data.sourceType
            this.years = data.year
            this.companyName = data.companyName
            this.companyCode = String(data.companyCode);

            this.marketSort = data.companyMarket
            if (this.marketSort == 'SH') {
              this.title4_ht = '特别重大合同'
            } else if (this.marketSort == 'SZ') {
              this.title4_ht = '重大合同'
            } else if (this.marketSort == 'CY') {
              this.title4_ht = '日常经营重大合同'
            } else if (this.marketSort == 'ZX') {
              this.title4_ht = '日常经营性重大合同'
            }
            //
            this.$nextTick(() => {
              if (this.activeName) {
                this.tabPaneData.forEach((item) => {
                  if (item.name == '重大合同') {
                    item.name = this.title4_ht;
                  }
                  if (item.name == this.activeName) {
                    this.activeValue = item.type
                  }
                })
              } else {
                this.activeValue = this.tabPaneData[0].type
              }
            })
            //
            var transaction = this.dataList.transaction // 关联交易
            if (this.$store.state.selectAccessColumn !== '') {
              this.selectSort(this.$store.state.selectAccessColumn)
            } else {
              this.changeData(transaction)
            }
          } else if (res.data.returnCode == -2) {
            console.log('非上市公司')
            this.showLookuptable = false
          } else if (res.data.returnCode == -3) {
            console.log('暂无该公司年报')
            this.showLookuptable = false
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // [内部]获取内部员工的权限速查表
      getInsideList() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.getInsideList,
          params: {
            userId: this.$cookie.get('userId'),
            code: this.companyCode
          }
        }).then((res) => {
          console.log('获取内部员工的权限速查表', res)
          if (res.data.returnCode == 1) {
            var data = res.data.returnObject
            // var transaction = data.transaction
            this.dataList = data.data
            if (this.dataList.majorEmergency) {
              this.showColumn = true
            } else {
              this.showColumn = false
            }
            this.sort = data.sourceType
            this.years = data.year
            this.companyName = data.companyName
            this.marketSort = data.companyMarket
            if (this.marketSort == 'SH') {
              this.title4_ht = '特别重大合同'
            } else if (this.marketSort == 'SZ') {
              this.title4_ht = '重大合同'
            } else if (this.marketSort == 'CY') {
              this.title4_ht = '日常经营重大合同'
            } else if (this.marketSort == 'ZX') {
              this.title4_ht = '日常经营性重大合同'
            }
            var transaction = this.dataList.transaction // 关联交易
            // this.changeData(transaction)
            if (this.$store.state.selectAccessColumn !== '') {
              this.selectSort(this.$store.state.selectAccessColumn)
            } else {
              this.changeData(transaction)
            }
            if (data.isNew === 1) {
              this.$confirm('系统自动检测到贵司已发布' + data.newYear + '年年度经审计年报，是否切换数据源？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.setNewAnnualReport()
              }).catch(() => {
                window.location.reload();
              })
            }
          } else if (res.data.returnCode == -2) {
            console.log('非上市公司')
            this.showLookuptable = false
          } else {
            this.companyName = res.data.returnObject.companyName
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //
      setNewAnnualReport() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.setNewAnnualReport,
          params: {
            userId: this.$cookie.get('userId'),
            code: this.companyCode
          }
        }).then((res) => {
          window.location.reload();
        })
      },
      //
      open4(row) {
        // console.log('row = ', row)
        this.centerDialogVisible = true
        this.describe = row.miaoshu
        var str = row.guize
        // 匹配中文标点符号 。；
        var reg = /[\u3002|\uff1b]/
        if (reg.test(str)) {
          var arr = str.split('\n')
          this.$common.ImpArr(arr)// 去除空元素
          for (var i in arr) {
            if (arr[i].indexOf('（2）') > 0) {
              var text = []
              text = '（2）' + arr[i].split('（2）')[1]
              arr[i] = arr[i].split('（2）')[0]
              arr.push(text)
            }
          }
          this.rules = arr
        }
      },
      //
      selectUnit(index) {
        this.unitArr.forEach((item) => {
          this.$set(item, 'select', false);
        });
        this.$set(this.unitArr[index], 'select', true);

        this.selectNum = index;
        if (index == 0) {
          console.log(this.unitArr[index].text)
        } else if (index == 1) {
          console.log(this.unitArr[index].text)
        } else if (index == 2) {
          console.log(this.unitArr[index].text)
        }
      }
    },
    // 使用其它组件
    components: {}
  }
</script>
<style lang="scss">
  .el-message-box__title {
    span {
      text-align: center;
    }
  }
  #accessTablesItem {
    .el-table__body-wrapper {
      overflow: hidden;
    }
    .el-icon-close {
      font-size: 16px;
    }
    .el-dialog {
      border-radius: 4px;
    }
    .el-dialog__wrapper {
      .el-dialog__header, .el-dialog__footer {
        padding: 0;
      }
      .el-dialog__body {
        padding: 0 15px 15px 15px;
        .titlem {
          line-height: 50px;
          color: #ffb148;
          font-size: 16px;
          font-weight: bold;
          border-bottom: 1px solid #e3e3e3;
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        }
        p {
          text-align: justify;
          color: #323232;
          font-size: 14px;
          overflow: auto;
        }
      }
    }
    .el-table {
      .lookupName {
        i {
          color: #ffb148;
          font-weight: bold
        }
      }
      .cell {
        font-size: 16px;
        color: #323232;
        cursor: pointer;
        .icon-dui {
          font-size: 12px !important;
        }
      }
      th.is-leaf, td {
        border-bottom: 1px solid #e3e3e3;
      }
    }
    .el-tabs--border-card {
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      box-shadow: none !important;
      .el-tabs__header {
        border-bottom: 0;
      }
      .el-tabs__nav {
        transform: none;
      }
      .el-tabs__nav-wrap {
        padding: 0;
        transform: none;
        .el-tabs__item {
          text-align: left;
          background: #f8f8f8;
          height: 52px;
          line-height: 52px;
          border-top: 1px solid #e3e3e3;
          border-bottom: 1px solid #e3e3e3;
          border-right: 1px solid #e3e3e3;
          /*border-top-right-radius: 4px;*/
          /*border-bottom-right-radius: 4px;*/
          /*overflow: hidden;*/
          font-size: 16px;
          color: #323232;
          padding: 0 20px;
        }
        .el-tabs__item:last-child {
          border-bottom: 0;
        }
        .is-active {
          background: #fff;
          border-right: 0;
          color: #ffb148;
          border-left: 5px solid #ffb148;
        }
      }
      .el-tabs__content {
        padding: 15px 15px 0 15px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  #accessTablesItem {
    padding: 0 0 20px 0;
    min-height: 700px;
    background-color: #fff;
    .right {
      width: 100%;
      min-height: 650px;
      background-color: #fff;
      border: 1px solid #e3e3e3;
      height: auto !important;
      padding: 0 25px !important;
      #small {
        // margin-top: 15px;
        li {
          font-size: 13px;
          color: #8d8d8d;
          line-height: 25px;
          cursor: default;
          display: flex;
          .bottom {
            flex: 1;
            &:last-child {
              text-align: right;
            }
            .link {
              text-align: right;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
      .iconfont {
        cursor: pointer;
      }

      .header {
        .head {
          display: flex;
          align-items: center;
          li {
            flex: 1;
            &.title {
              width: 100%;
              height: 55px;
              line-height: 55px;
              text-align: center;
              position: relative;
              font-size: 16px;
              font-weight: bold;
              color: #323232;
              .return {
                position: absolute;
                left: 0;
                top: 0px;
                color: #ffb148;
                cursor: pointer;
                font-size: 14px;
                font-weight: normal;
                .iconfont {
                  font-size: 14px;
                  cursor: pointer;
                }
              }
            }
            .text {
              text-align: left;
            }
          }
        }
      }
      .unit {
        width: auto;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: right;
        span {
          display: inline-block;
          // float: right;
        }
        ul {
          float: right;
          li {
            display: inline-block;
            margin: 0 15px;
            position: relative;
            cursor: pointer;
            &:first-child {
              margin-left: 0;
            }
            &:last-child {
              margin-right: 0;
            }
            span {
              display: inline-block;
              width: auto;
              height: 30px;
              line-height: 30px;
            }
            .selectStyle {
              background: #cbb390;
              color: #fff;
              border-radius: 4px;
              text-align: center;
              padding: 0 5px;
            }
            .splitLine {
              font-size: 14px;
              color: #e3e3e3;
              position: absolute;
              top: 0;
              right: -15px;
            }
          }
          li:last-child {
            .splitLine {
              display: none;
            }
          }
          .selectStyle {
            background: #cbb390;
            color: #fff;
            border-radius: 4px;
            width: auto;
            height: 20px;
            text-align: center;
            line-height: 20px;
            padding: 0 5px;
          }
        }
      }
    }
    .errorMsg {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 22;
      img {
        width: 200px;
        margin: 150px auto 10px;
        height: auto;
        display: inherit;
      }
      p {
        color: #ffb148;
        font-size: 14px;
        text-align: center;
        margin-bottom: 10px;
      }
      button {
        margin: 0 auto;
        border: 0;
        display: inherit;
        background: #ffb148;
        color: #fff;
      }
    }
  }
</style>
