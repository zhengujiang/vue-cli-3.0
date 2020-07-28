<template>
  <div id="accessTables">
    <div class="content">
      <div class="left">
        <v-data @resetChange='changeDataM' @resetChangeInside="changeDataMinside"></v-data>
      </div>
      <div class="right" v-if="showLookuptable">
        <div class="title">
          <div class="return" @click="returnMethod" v-if="this.userObj.level == 1">
            <i class="icon iconfont web-fanhui"></i>
            返回
          </div>
          <div class="text" v-if="!userInfo.superviseUser">
            {{ companyCode ? companyCode : '' }}
            {{ companyName ? companyName : '' }} 权限速查表
          </div>
          <div v-else="userInfo.superviseUser">
            <v-regulatorCompany :showCode="true"></v-regulatorCompany>
            <span style="display: inline-block;margin-left: 10px;">权限速查表</span>
          </div>
        </div>
        <div class="unit">
          <ul>
            <li v-for="(list,index) in unitArr" :key="index" @click="selectUnit(index)">
              <span :class="{selectStyle: list.select}">{{ list.text }}</span>
              <span class="splitLine">|</span>
            </li>
          </ul>

          <span>单位：</span>
        </div>
        <el-tabs v-model="tabsValue" type="border-card" tab-position="left" @tab-click="selectSort" :before-leave="beforeLeave" style="width: 100%">
          <el-tab-pane label="非关联交易（担保除外）" name="0">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="200">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="icon iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="180">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gdNum"
                :label="column_GD">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.gdNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.gdNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.gdNum) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="关联交易（担保除外）" name="1">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="icon iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="180">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gdNum"
                :label="column_GD">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.gdNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.gdNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.gdNum) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="提供担保" name="2">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="icon iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="180">
                <template slot-scope="scope">
                <span v-if="selectNum == 2">
                  <span v-if="scope.row.plNum == 'y'"><i class=" iconfont web-dui"></i></span>
                  <span v-else>{{ $common.autoPrice(scope.row.plNum) }}</span>
                </span>
                  <span v-else-if="selectNum == 1">
                  <span v-if="scope.row.plNum == 'y'"><i class=" iconfont web-dui"></i></span>
                  <span v-else>{{ $common.yiUnit(scope.row.plNum) }}</span>
                </span>
                  <span v-else-if="selectNum == 0">
                  <span v-if="scope.row.plNum == 'y'"><i class=" iconfont web-dui"></i></span>
                  <span v-else>{{ $common.wanUnit(scope.row.plNum) }}</span>
                </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gdNum"
                :label="column_GD">
                <template slot-scope="scope">
                <span v-if="selectNum == 2">
                  <span v-if="scope.row.gdNum == 'y'"><i class=" iconfont web-dui"></i></span>
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
          <el-tab-pane label="重大资产重组" name="3" :disabled="tabsDisabled">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class=" iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_ZD"
                width="440">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.zdNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.zdNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.zdNum) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="title4_ht" name="4" :disabled="tabsDisabled">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="440">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="诉讼及仲裁" name="5" :disabled="tabsDisabled">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="440">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="政府补助" name="6" :disabled="tabsDisabled">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class=" iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="440">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="column_JZ" name="7" :disabled="tabsDisabled">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
              >
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.plNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.plNum) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gdNum"
                :label="column_GD"
                v-if="this.marketSort !== 'CY' && this.marketSort !== 'SZ'">
                <template slot-scope="scope">
                  <span v-if="selectNum == 2">{{ $common.autoPrice(scope.row.gdNum) }}</span>
                  <span v-else-if="selectNum == 1">{{ $common.yiUnit(scope.row.gdNum) }}</span>
                  <span v-else-if="selectNum == 0">{{ $common.wanUnit(scope.row.gdNum) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane v-if="this.dataList.financialAssistance.length > 0" label="财务资助" name="9">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="210">
                <template slot-scope="scope">
                  <span style="display: inline-block; width: 200px">
                    <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="icon iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="180">
                <template slot-scope="scope">
                <span v-if="selectNum == 2">
                  <span v-if="scope.row.plNum == 'y'"><i class=" iconfont web-dui"></i></span>
                  <span v-else>{{ $common.autoPrice(scope.row.plNum) }}</span>
                </span>
                  <span v-else-if="selectNum == 1">
                  <span v-if="scope.row.plNum == 'y'"><i class=" iconfont web-dui"></i></span>
                  <span v-else>{{ $common.yiUnit(scope.row.plNum) }}</span>
                </span>
                  <span v-else-if="selectNum == 0">
                  <span v-if="scope.row.plNum == 'y'"><i class=" iconfont web-dui"></i></span>
                  <span v-else>{{ $common.wanUnit(scope.row.plNum) }}</span>
                </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gdNum"
                :label="column_GD">
                <template slot-scope="scope">
                <span v-if="selectNum == 2">
                  <span v-if="scope.row.gdNum == 'y'"><i class=" iconfont web-dui"></i></span>
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
          <el-tab-pane label="重大突发事件" v-if="showColumn" name="8" :disabled="tabsDisabled">
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label=""
                width="180">
                <template slot-scope="scope">
                  <span style="text-align: left">{{ scope.row.name }}</span>
                  <i class="iconfont web-i" style="color:#ffb148;font-weight: bold"
                     @click="open4(scope.row)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="plNum"
                :label="column_PL"
                width="440">
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
          <li v-if="sort == 0">* 基于{{ years }}年年报公布的财务数据测算</li>
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
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="35%"
        center>
        <div>
          <div class="miaoshu" v-show="describe">
            <div class="titlem">描述</div>
            <p>{{ describe }}</p>
          </div>
          <div class="miaoshu" v-show="rules">
            <div class="titlem">计算标准</div>
            <div style="max-height: 300px;overflow: auto">
              <p v-for="n in this.rules" class="ruleText" style="margin-bottom: 1em">{{ n }}</p>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <el-dialog custom-class="authDialog" title="企业版本专享功能" :visible.sync="authDialog" width="620px" center top="28vh">
      <div class="message">该功能为企业版用户专享功能，前往查看企业版专享功能吧！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goEnterprise">查看企业版</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import nav from '../nav.vue'
  import VData from '../../../components/lookupTables/dataCalibration.vue'

  export default {
    name: 'accessTables',
    data() {
      return {
        tabsValue: '0',
        tabsDisabled: true,
        authDialog: false,
        userObj: {},
        showLookuptable: true,
        companyName: '',
        companyCode: '',
        column_GD: '股东大会',
        column_PL: '披露',
        column_ZD: '重大资产重组',
        column_JZ: '资产减值',
        unitArr: [
          {text: '万', select: false},
          {text: '亿', select: false},
          {text: '自适应', select: true}
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
        userInfo: {},
        dataList: {
          financialAssistance: []
        }
      }
    },
    created() {
      this.companyCode = window.sessionStorage.getItem('companyCode')
      this.companyName = window.sessionStorage.getItem('companyName')
      this.userInfo = JSON.parse(this.$cookie.get('userInfo'));
      if (this.userInfo.superviseUser) {
        this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
      }
      this.getMyInfo()
    },
    mounted() {
      this.isEnterprise()

    },
    watch: {
      marketSort: function (val) {
        val == 'SZ' || val == 'CY' ? this.column_JZ = '资产减值或核销' : this.column_JZ = '资产减值'
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
      isEnterprise () {
        let enterpriseUser = JSON.parse(this.$cookie.get('userInfo')).enterpriseUser
        this.$nextTick(() => {
          setTimeout(() => {
            if (enterpriseUser || this.userInfo.superviseUser) {
              this.tabsDisabled = false
            } else {
              this.tabsDisabled = true
              document.querySelector('#tab-3').addEventListener('click', () => { this.authDialog = true })
              document.querySelector('#tab-4').addEventListener('click', () => { this.authDialog = true })
              document.querySelector('#tab-5').addEventListener('click', () => { this.authDialog = true })
              document.querySelector('#tab-6').addEventListener('click', () => { this.authDialog = true })
              document.querySelector('#tab-7').addEventListener('click', () => { this.authDialog = true })
              if (document.querySelector('#tab-8')) {
                document.querySelector('#tab-8').addEventListener('click', () => { this.authDialog = true })
              }
            }
          }, 1000)
        })
      },
      goEnterprise() {
        this.authDialog = false
        this.$router.push('/manage/purchase')
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
          // console.log(res)
          if (res.data.returnCode == 1) {
            this.userObj = res.data.returnObject
            if (this.userObj.superviseUser) {
              this.userObj.level = 0
            }
            if (this.userObj.level == 0) {
              this.getInsideListOut()
            } else {
              this.getInsideList()
            }
          }
        }).catch((err) => {

        })
      },
      // 返回
      returnMethod() {
        this.$router.push('/lookupTables')
      },
      beforeLeave (activeName, oldActiveName) {
        // alert()
        // return false
      },
      // 选择查看权限选项
      selectSort(key) {
        var keys = key.index
        // 非企业用户只能查看前三项
//        let userInfo = this.$cookie.get('userInfo')
//        if (keys > 2 && !userInfo.enterpriseUser) {
//          this.authDialog = true
//          return false
//        }
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
          console.log(guarantees)
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
          if (this.marketSort == 'SZ' || this.marketSort == 'CY') {
            this.column_PL = '披露'
          }
          var impairmentOfSssets = this.dataList.impairmentOfSssets
          this.changeData(impairmentOfSssets)
        } else if (keys == 8) {
          var financialAssistance = this.dataList.financialAssistance 
          this.column_PL = '披露及董事会'
          this.changeData(financialAssistance)
        } else if (keys == 9) {
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
      // 获取权限速查表
      getInsideListOut() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.getInsideListOut,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: this.userInfo.enterpriseUser ? this.userInfo.companyId : '',
            companyCode: this.userInfo.enterpriseUser ? '' : this.companyCode
          }
        }).then((res) => {
          console.log('获取外部权限速查表', res)
          if (res.data.returnCode == 1) {
            var data = res.data.returnObject
            // var transaction = data.transaction
            this.dataList = data.data
            console.log('------- this.dataList.majorEmergency = ', this.dataList.majorEmergency)
            if (this.dataList.majorEmergency) {
              this.showColumn = true
            } else {
              this.showColumn = false
            }
            this.sort = data.sourceType
            this.years = data.year
            this.companyName = data.companyName
            this.companyCode = data.companyCode
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
            if (this.$store.state.selectAccessColumn !== '') {
              this.selectSort(this.$store.state.selectAccessColumn)
            } else {
              this.changeData(transaction)
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
      open4(row) {
        // console.log('row = ', row)
        this.centerDialogVisible = true
        this.describe = row.miaoshu
        var str = row.guize
        // 匹配中文标点符号 。；
        var reg = /[\u3002|\uff1b]/
        if (reg.test(str)) {
          var arr = str.split('\n')
          this.$common.ImpArr(arr) // 去除空元素
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
      selectUnit(index) {
        console.log(this.unitArr);
        for (var i = 0; i < this.unitArr.length; i++) {
          this.unitArr[i].select = false
        }
        this.unitArr[index].select = true
        this.selectNum = index
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
    components: {
      'v-nav': nav,
      VData
    }
  }
</script>
<style lang="scss">
  .el-message-box__title {
    span {
      text-align: center;
    }
  }
  #accessTables {
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
      .el-table__row {
        td:first-child {
          .cell {
            text-align: left;
            width: 112%;
          }
        }
      }
      .cell {
        font-size: 16px;
        color: #323232;
        text-align: right;
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
  .authDialog {
     .el-dialog__header {
       border-bottom: 1px solid #e3e3e3;
       .el-dialog__title {
         color: #ffb148;
         padding: 15px;
         display: inline-block;
       }

     }
      .el-dialog__body {
        /*padding: 25px;*/
        padding: 0;
      }
      .el-dialog__footer {
        height: 60px;
      }
     .message {
       text-align: center;
       padding-top: 15px;
     }
   }
</style>
<style lang="scss" scoped>
  #accessTables {
    padding: 20px 0;
    min-height: 700px;
    background-color: #f6f6f6;
    .left {
      float: left;
      width: 240px;
      min-height: 650px;
      height: 100% !important;
      background-color: #fff;
      border: 1px solid #e3e3e3;
      border-radius: 2px;
      .item {
        padding-right: 10px;
        padding-left: 10px !important;
        height: auto !important;
        line-height: 1;
        position: relative;
        .circle {
          width: 5px;
          position: absolute;
          top: 18px;
          left: inherit;
          height: 5px;
          background: #8d8d8d;
          border-radius: 50%;
        }
        span {
          width: 85%;
          height: 100%;
          text-overflow: ellipsis;
          float: right;
          overflow: hidden;
          white-space: nowrap;
        }
        li {
          padding: 10px 10px 5px 15px;
          // list-style: disc;
          line-height: 20px;
        }
      }
      .act {
        .circle {
          background: #ffb148;
        }
      }
    }
    .right {
      float: right;
      width: 940px;
      min-height: 650px;
      background-color: #fff;
      border: 1px solid #e3e3e3;
      height: auto !important;
      /*border-left: 20px solid #f6f6f6;*/
      padding: 0 25px !important;

      #small {
        margin-top: 15px;
        li {
          font-size: 13px;
          color: #8d8d8d;
          line-height: 25px;
          cursor: default;
        }
      }
      .iconfont {
        cursor: pointer;
      }
      .title {
        width: 100%;
        height: 55px;
        border-bottom: 1px solid #e3e3e3;
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
          cursor: pointer;
          .iconfont {
            font-size: 14px;
            cursor: pointer;
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
              /*width: auto;
              height: 30px;*/
              text-align: center;
              /*line-height: 30px;*/
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
      width: 1200px !important;
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
