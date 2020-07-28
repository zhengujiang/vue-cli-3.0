<template>
  <el-card shadow="never" class="box-card" id="regulatorCompanyList">
    <div slot="header">
      <span>监管公司</span>
      <div class="icon-input">
        <el-input placeholder="请输入公司名称/股票代码" v-model="searchWord" size="mini" class="input-search" @keyup.enter.native="handleSearch">
          <i slot="suffix" class="el-input__icon el-icon-search  icon-search" @click="handleSearch"></i>
          <!--<i class="el-icon-search icon-search"></i>-->
        </el-input>
        <div class="set-buttom"  @click="showCompanySet">
          <img class="set-img" :src="$image.dashboard.set">设置
        </div>
      </div>

    </div>
    <div class="company-table-card">
      <el-table :data="showData" style="width: 100%;" stripe>
        <el-table-column prop="companyCode" label="股票代码" sortable width="110">
          <template slot-scope="scope">
            <a :href="'/company-condition/'+scope.row.companyFullCode" target="_blank">{{scope.row.companyCode}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称" sortable width="110">
          <template slot-scope="scope">
            <a :href="'/company-condition/'+scope.row.companyFullCode" target="_blank">{{scope.row.companyName}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="xianjia" label="现价" sortable width="80" align="right">
          <template slot-scope="scope">
            <div class="num" :class="{green: scope.row.zhangdiefu<0, red: scope.row.zhangdiefu>0}">{{scope.row.xianjia}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="zhangdie" label="涨跌" sortable width="80" align="right">
          <template slot-scope="scope">
            <div class="num" :class="{green: scope.row.zhangdiefu<0, red: scope.row.zhangdiefu>0}">{{scope.row.zhangdie}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="zhangdiefu" label="涨跌幅" sortable width="90" align="right">
          <template slot-scope="scope">
            <div class="num" :class="{green: scope.row.zhangdiefu<0, red: scope.row.zhangdiefu>0}">{{scope.row.zhangdiefu}}%</div>
          </template>
        </el-table-column>
        <el-table-column prop="announceTotal" label="公告" sortable width="100" align="right">
          <template slot-scope="scope">
            <div class="num"><a :href="'/affiche?inputCode='+scope.row.companyCode" target="_blank">{{scope.row.announceTotal}}</a></div>
          </template>
        </el-table-column>
        <el-table-column prop="sentimentTotal" label="监管舆情" sortable width="110"  align="right">
          <template slot-scope="scope">
            <div class="num"><a :href="'/activities'" target="_blank">{{scope.row.sentimentTotal}}</a></div>
          </template>
        </el-table-column>
        <el-table-column label="权限速查" width="90" align="center">
          <template slot-scope="scope">
            <a :href="'/accessTables?companyCode='+scope.row.companyFullCode" target="_blank">查看</a>
          </template>
        </el-table-column>
        <el-table-column label="财务报告" width="80" align="center">
          <template slot-scope="scope">
            <a :href="'/finance/main?companyCode='+scope.row.companyFullCode" target="_blank">查看</a>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 12px;" v-if="showMore==0"></div>
      <div class="show-more" v-if="showMore==1" @click="handleShowMore">查看更多</div>
      <div class="show-more" v-if="showMore==2" @click="handleHideMore">收起</div>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        searchWord: '',
        tableData: [],
        showData: [],
        showMore: 1,
        interval: null
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getSuperviseCompanyList()
      this.interval = setInterval(() => {
        if (this.$common.checkMarkTime()) {
          this.getSuperviseCompanyList()
        }
      }, 1000 * 60)
    },
    mounted() {
    },
    destroyed() {
      window.clearInterval(this.interval)
    },
    // 方法
    methods: {
      showCompanySet () {
        this.$emit('showCompanySet')
      },
      handleSearch () {
        this.getSuperviseCompanyList()
      },
      handleShowMore () {
        this.showData = []
        this.tableData.forEach((item) => {
          this.showData.push(item)
        })
        this.showMore = 2
      },
      handleHideMore () {
        this.showData = []
        this.tableData.forEach((item, index) => {
          if (index < 10) {
            this.showData.push(item)
          }
        })
        this.showMore = 1
      },
      // 获取所有监管公司
      getSuperviseCompanyList () {
        this.$http({
          url: this.$api.superviseCompany.getSuperviseCompanyList,
          method: "GET",
          params: {
            userId: this.userId,
            keyWord: this.searchWord
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.tableData = res.data.returnObject
            this.showData = []
            if (this.tableData.length > 10) {
              this.tableData.forEach((item, index) => {
                 if (index < 10) {
                   this.showData.push(item)
                 }
              })
              this.showMore = 1
            } else {
              this.showData = res.data.returnObject
              this.showMore = 0
            }
          } else {
            this.showData = res.data.returnObject
            this.showMore = 0
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #regulatorCompanyList {
    .el-card__body {
      padding: 0;
    }
    .icon-input {
      display: inline-block;
      float: right;
      position: relative;
      top: -3px;
    }
    .input-search {
      display: inline-block;
      width: 250px;
      margin-right: 10px;
      .icon-search {
        color: #ffb148;
        font-weight: 800;
        cursor: pointer;
      }
    }
    .set-buttom {
      height: 28px;
      padding: 3px 6px;
    }
    .company-table-card {
      padding: 3px 20px;
      .el-table th, .el-table td {
        padding: 8px 0;
      }
      .el-table th > .cell {
        font-size: 13px;
        color: #BB9766;
        font-weight: normal;
      }
      .el-table .cell {
        font-size: 12px;
      }
      .el-table .hover-row {
        background-color: #ffb148;
      }
      .up {
        color: #FF581B;
      }
      /* .el-table__body-wrapper {
        min-height: 300px;
        max-height: 480px;
        overflow-y: auto;
      } */
      .show-more {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        color: #8d8d8d;
        cursor: pointer;
      }
      a {
        &:hover {
          color: #ffb148;
          text-decoration: underline;
        }
      }
      .num {
        padding-right: 10px;
      }
      .red {
        color: #fa4319;
      }
      .green {
        color: #29da89;
      }
    }
  }
</style>
