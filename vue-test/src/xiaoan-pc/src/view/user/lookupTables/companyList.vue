<template>
  <div id="companyList">
    <el-table
      :data="infoArr"
      stripe
      style="width: 100%"
      @row-click="linkTo">
      <el-table-column
        prop="code"
        sortable
        label="证券代码">
        <template slot-scope="scope">
          <img :src="$image.user.lookuptables.sh" alt="" v-if="scope.row.stockMarket == 'SH'">
          <img :src="$image.user.lookuptables.sz" alt="" v-else>
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="证券简称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="year"
        label="数据来源">
        <template slot-scope="scope">
          <span v-if="scope.row.year == 1">自定义</span>
          <span v-else>{{ scope.row.year }}年报</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalAssets"
        sortable
        label="年末总资产">
        <template slot-scope="scope">
          <span>{{ $common.autoPrices(scope.row.totalAssets) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="netAssets"
        sortable
        label="年末净资产">
        <template slot-scope="scope">
          <span>{{ $common.autoPrices(scope.row.netAssets) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="netProfit"
        sortable
        label="年度净利润">
        <template slot-scope="scope">
          <span>{{ $common.autoPrices(scope.row.netProfit) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalOperatingIncome"
        sortable
        label="营业总收入">
        <template slot-scope="scope">
          <span style="margin-right: 10px;">{{ $common.autoPrices(scope.row.totalOperatingIncome) }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="address"-->
      <!--label="成交额">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.name }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'companyList',
    data () {
      return {}
    },
    props: {
      infoArr: {
        type: Array,
        default: []
      }
    },
    watch: {
      infoArr: function (val) {
        console.log('info = ', val)
      }
    },
    methods: {
      linkTo (row) {
        // console.log(' == ', row)
        window.sessionStorage.setItem('companyCode', row.code)
        window.sessionStorage.setItem('companyName', row.name)
        this.$store.commit('selectAccessColumn', '')
        this.$router.push('/accessTables')
//        this.$router.push({
//          path: '/accessTables',
//          query: {
//            code: row.code,
//            name: row.name
//          }
//        })
      }
    }
  }
</script>
<style lang="scss">
  .el-table {
    height: 100%;
    .el-table__body {
      .el-table_1_column_7 {
        /*padding-right: 20px;*/
      }
    }
    .sort-caret {
      color: #e3e3e3;
      font-size: 14px;
    }
  }

  #companyList {
    .el-table {

      .cell {
        text-align: right;
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        img {
          width: 18px;
          font-size: 0;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
      }
      th {
        background: #f8f8f8;
        border: 0;
        .cell {
          font-size: 16px;
          color: #323232;
        }
      }
      th.is-leaf {
        border: 0;
      }
      td {
        border: 0;
      }
      .el-table th.is-leaf, .el-table td, .el-table td, .el-table th.is-leaf {
        border: 0;
      }
      .el-table__body-wrapper {
        height: 660px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
</style>
<style lang="scss" scoped>
  #companyList {
    width: 100%;
    min-height: 600px;height: auto;
  }
</style>
