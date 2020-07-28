<template>
  <div id="regulatorCompanySet">
    <el-dialog id="dialog-regulator" :visible.sync="showDialog" width="980px" @close="close">
      <template slot="title">监管公司设置</template>
      <div class="company-list">
        <div class="company company-left">
          <div class="chk-search">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
            <span class="title">上市公司</span>

            <span class="checked-count" v-show="!showLeftSearch">（已选中{{addCompanyList.length}}/{{companyAll.total}}）</span>
            <div class="input-search" v-show="!showLeftSearch" @click="showSearch">
              <i class="el-icon-search icon-search fright"></i>
            </div>

            <el-input v-model="searchWordLeft" v-show="showLeftSearch" placeholder="股票代码/公司名称/行业/地区" class="input-search" size="mini" :focus="true" @change="changeLeft" @keyup.enter.native="search">
              <i slot="suffix" class="el-input__icon el-icon-search icon-btn-search" @click="search"></i>
            </el-input>

          </div>
          <div class="chk-item-box">
            <el-checkbox-group v-model="addCompanyList" @change="handleCheckedChange">
              <el-checkbox v-for="item in companyAll.list" :label="item.companyCode" :key="item.companyCode" :disabled="item.haveAdd">
                <span class="chk-item-text code">{{item.companyCode}}</span>
                <span class="chk-item-text">{{item.companyName}}</span>
                <span class="chk-item-text" :title="item.companyIndustry">{{item.companyIndustry}}</span>
                <span class="chk-item-text area">{{item.companyArea}}</span>
                <span class="chk-item-text selected" v-if="item.haveAdd">已选</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="center pagination" v-if="companyAll.total>10">
            <el-pagination background layout="prev, pager, next" :total="companyAll.total" :page-size="10" @current-change="pageChange" :small="true"></el-pagination>
          </div>
        </div>
        <div class="company-btn-box">
          <el-button type="primary" icon="el-icon-arrow-right" size="mini" class="company-btn" @click="addSuperviseCompanyList"></el-button>
          <el-button type="primary" icon="el-icon-arrow-left" size="mini" class="company-btn" @click="deleteSuperviseCompanyList"></el-button>
        </div>
        <div class="company company-right">
          <div class="chk-search">
            <el-checkbox :indeterminate="isIndeterminateRight" v-model="checkAllRight" @change="handleCheckAllChangeRight"></el-checkbox>
            <span class="title">监管公司</span>
            <span class="checked-count" v-show="!showRightSearch">（{{addCompanyListRight.length}}/{{companySet.total}}）</span>
            <i class="el-icon-search icon-search" v-show="!showRightSearch" @click="showRSearch"></i>
            <el-input v-model="searchWordRight" v-show="showRightSearch" class="input-search" size="mini" placeholder="股票代码/公司名称/行业/地区" @change="changeRight" @keyup.enter.native="searchRight">
              <i slot="suffix" class="el-input__icon el-icon-search icon-btn-search" @click="searchRight"></i>
            </el-input>

          </div>
          <div class="chk-item-box">
            <!--<el-checkbox-group v-model="addCompanyListRight" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">
                <span class="chk-item-text code">000123</span>
                <span class="chk-item-text">科伦药业</span>
                <span class="chk-item-text">医疗保健</span>
                <span class="chk-item-text area">四川</span>
              </el-checkbox>
            </el-checkbox-group>-->
            <el-checkbox-group v-model="addCompanyListRight" @change="handleCheckedChangeRight">
              <el-checkbox v-for="item in companySet.list" :label="item.id" :key="item.id">
                <span class="chk-item-text code">{{item.companyCode}}</span>
                <span class="chk-item-text">{{item.companyName}}</span>
                <span class="chk-item-text" :title="item.companyIndustry">{{item.companyIndustry}}</span>
                <span class="chk-item-text area">{{item.companyArea}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="center pagination" v-if="companySet.total>10">
            <el-pagination background layout="prev, pager, next" :total="companySet.total" :page-size="10" @current-change="pageChangeRight" :small="true"></el-pagination>
          </div>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        userId: '',
        showDialog: false,
        // 左侧
        showLeftSearch: false,
        searchWordLeft: '',
        checkAll: false,
        isIndeterminate: false,
        addCompanyList: [],
        // 右侧
        showRightSearch: false,
        searchWordRight: '',
        checkAllRight: false,
        isIndeterminateRight: false,
        addCompanyListRight: [],
        companyAll: {
          list: [],
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        companySet: {
          list: [],
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    computed: {},
    watch: {
      show: function (val) {
        this.showDialog = val
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.searchCompanyByKeyWordAll('')
      this.searchCompanyByKeyWordSet('')
    },
    mounted() {
    },
    // 方法
    methods: {
      close() {
        this.$emit('hideCompanySet')
      },
      // 左侧事件
      changeLeft () {
        if (this.searchWordLeft == '') {
          this.search()
        }
      },
      pageChange (index) {
        this.isIndeterminate = false
        this.checkAll = false
        this.addCompanyList = []
        this.companyAll.pageNum = index;
        this.searchCompanyByKeyWordAll(this.searchWordLeft)
      },
      handleCheckAllChange(val) {
        let companyListNowPage = this.companyAll.list.map(e => e.companyCode)
        this.addCompanyList = val ? companyListNowPage : [];
        this.isIndeterminate = false;
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.companyAll.list.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.companyAll.list.length;
      },
      showSearch () {
        this.showLeftSearch = true
      },
      search () {
        this.showLeftSearch = false
        this.isIndeterminate = false
        this.addCompanyList = []
        this.companyAll.pageNum = 1
        this.searchCompanyByKeyWordAll(this.searchWordLeft)
      },
      // 右侧事件
      changeRight () {
        if (this.searchWordRight == '') {
          this.searchRight()
        }
      },
      pageChangeRight (index) {
        this.isIndeterminateRight = false
        this.checkAllRight = false
        this.addCompanyListRight = []
        this.companySet.pageNum = index;
        this.searchCompanyByKeyWordSet()
      },
      handleCheckAllChangeRight(val) {
        let companyListNowPage = this.companySet.list.map(e => e.id)
        this.addCompanyListRight = val ? companyListNowPage : [];
        this.isIndeterminateRight = false;
      },
      handleCheckedChangeRight(value) {
        let checkedCount = value.length;
        this.checkAllRight = checkedCount === this.companySet.list.length;
        this.isIndeterminateRight = checkedCount > 0 && checkedCount < this.companySet.list.length;
      },
      showRSearch () {
        this.showRightSearch = true
      },
      searchRight () {
        this.showRightSearch = false
        this.isIndeterminateRight = false
        this.addCompanyListRight = []
        this.companySet.pageNum = 1
        this.searchCompanyByKeyWordSet(this.searchWordRight)
      },
      // 搜索全市场公司
      searchCompanyByKeyWordAll (keyWord) {
        this.$http({
          url: this.$api.superviseCompany.searchCompanyByKeyWord,
          method: "GET",
          params: {
            // keyWord: keyWord,
            keyWord: this.searchWordLeft,
            pageNum: this.companyAll.pageNum,
            pageSize: 10,
            searchType: 1, //  1: 搜索全市场公司 2: 搜索已监管的公司
            userId: this.userId
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.companyAll.list = res.data.returnObject
            this.companyAll.list.forEach(item => {
              if (item.haveAdd) {
                this.addCompanyList.push(item.companyCode)
              }
            })
            this.companyAll.total = res.data.total
          } else {
            this.companyAll.list = []
            this.companyAll.total = 0
          }
        })
      },
      // 搜索已监管的公司
      searchCompanyByKeyWordSet (keyWord) {
        this.$http({
          url: this.$api.superviseCompany.searchCompanyByKeyWord,
          method: "GET",
          params: {
            keyWord: keyWord,
            pageNum: this.companySet.pageNum,
            pageSize: 10,
            searchType: 2, //  1: 搜索全市场公司 2: 搜索已监管的公司
            userId: this.userId
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.companySet.list = res.data.returnObject
            this.companySet.total = res.data.total
          } else {
            this.companySet.list = []
            this.companySet.total = 0
          }
        })
      },
      // 🈯️批量添加
      addSuperviseCompanyList () {
        let setList = []
        this.addCompanyList.forEach((item) => {
          this.companyAll.list.forEach(item2 => {
            if (item == item2.companyCode) {
              item2.userId = this.userId
              setList.push(item2)
            }
          })
        })
        this.$http({
          url: this.$api.superviseCompany.addSuperviseCompanyList,
          method: "POST",
          data: setList
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.pageChange(this.companyAll.pageNum)
            this.pageChangeRight(1)
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        })
      },
      // 🈯️批量删除
      deleteSuperviseCompanyList () {
        let ids = this.addCompanyListRight.join(',')
        this.$http({
          url: this.$api.superviseCompany.deleteSuperviseCompanyList,
          method: "put",
          params: {
            ids: ids
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.pageChange(this.companyAll.pageNum)
            this.pageChangeRight(1)
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #regulatorCompanySet {
    .el-dialog__header {
      font-size: 16px;
      color: #FFB148;
      padding: 20px 0 18px 0;
      margin: 0 50px;
      border-bottom: 1px solid #eaeaea;
      .el-dialog__headerbtn {
        top: 20px;
        right: 20px;
      }
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    .company-list {
      background-color: #fdfdfd;
      min-height: 500px;
      display: flex;
      padding-bottom: 20px;
      .company {
        .chk-search {
          display: flex;
          align-items: center;
          height: 40px;
          border-bottom: 1px solid #e3e3e3;
          justify-content: space-between;
          .title {
            font-size: 16px;
            color: #323232;
            margin-left: 20px;
            white-space: nowrap;
          }
          .checked-count {
            font-size: 14px;
            color: #8d8d8d;
            line-height: 22px;
            white-space: nowrap;
          }
          .input-search {
            flex-grow: 1;
            width: 140px;
            margin-left: 10px
            /*.el-input__inner {
              border: 0;
            }*/
          }
          .icon-search {
            color: #ffb148;
            font-weight: 800;
            cursor: pointer;
            width: 214px;
            text-align: right;
          }
          .icon-btn-search {
            color: #ffb148;
            font-weight: 800;
            cursor: pointer;
          }
        }
        .chk-item-box {
          height: 400px;
          padding-top: 7px;
          border-bottom: 1px solid #eaeaea;
          .el-checkbox {
            display: block !important;
            padding-bottom: 16px;
            color: #323232;
            .el-checkbox__input {
              top: -5px;
            }
          }
          .el-checkbox + .el-checkbox {
            margin-left: 0;
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #323232;
          }
          .chk-item-text {
            display: inline-block;
            width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .code {
            margin-left:12px;
          }
          .area {
            width: 40px;
          }
          .selected {
            width: 40px;
            color: #ffb148;
            text-align: right;
          }
        }
        .pagination {
          height: 66px;
          padding: 20px 0;
          text-align: left;
          .el-pagination {
            padding: 2px 0;
          }
        }
      }
      .company-left {
        background: #FFFFFF;
        box-shadow: -10px 8px 12px 0 rgba(0,0,0,0.02);
        border-radius: 6px;
        width: 420px;
        padding: 0 25px 0 30px;
      }
      .company-right {
        background: #FFFFFF;
        box-shadow: -10px 8px 12px 0 rgba(0,0,0,0.02);
        border-radius: 6px;
        width: 420px;
        padding:0 30px 0 25px;
        .chk-item-box {
          .chk-item-text {
            display: inline-block;
            width: 94px;
          }
        }
      }
      .company-btn-box {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100px;
        height: 400px;
        .company-btn {
          width: 30px;
          padding: 7px 8px;
        }
        .el-button + .el-button {
          margin-left: 0;
          margin-top: 8px;
        }
        i {
          font-weight: 800;
        }
      }

    }
  }
</style>
