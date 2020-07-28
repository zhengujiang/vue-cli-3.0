<template>
  <div id="restrictedStock">
    <div class="time">
      <p class="title">限售股解禁时间表</p>
      <el-table :data="timeData" stripe style="width: 100%;" max-height="395">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="freeDate" sortable label="解禁时间"></el-table-column>
        <el-table-column prop="num" label="解禁股份数量(股)"></el-table-column>
        <el-table-column prop="floatingStockRate" label="占解禁前流通股数量比例(%)"></el-table-column>
        <el-table-column prop="stockRate" label="占总股本数量比例(%)"></el-table-column>
        <el-table-column prop="type" label="限售类型" show-overflow-tooltip align="center" width="170"></el-table-column>
        <el-table-column prop="beforeChangeRate" label="解禁前20天累计涨跌幅(%)">
          <template slot-scope="scope">
            <span class="positive" v-if="scope.row.beforeChangeRate > 0">{{scope.row.beforeChangeRate}}</span>
            <span class="negative" v-else-if="scope.row.beforeChangeRate < 0">{{scope.row.beforeChangeRate}}</span>
            <span v-else>{{scope.row.beforeChangeRate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterChangeRate" label="解禁后20天累计涨跌幅(%)">
          <template slot-scope="scope">
            <span class="positive" v-if="scope.row.afterChangeRate > 0">{{scope.row.afterChangeRate}}</span>
            <span class="negative" v-else-if="scope.row.afterChangeRate < 0">{{scope.row.afterChangeRate}}</span>
            <span v-else>{{scope.row.afterChangeRate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="解禁明细" class-name="detail">
          <template slot-scope="scope">
            <a @click="viewDetails(scope)">查看详情</a>
          </template>
        </el-table-column>
        <el-table-column label="创建信披清单" class-name="icon">
          <template slot-scope="scope">
            <img class="show-icon pointer" :src="$image.stockholder.edit" @click="edit(scope.row.id)">
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog class="dialog-detail" title="解禁明细" :visible.sync="positionDetail" width="620px" top="30vh">
      <div class="dialog-table">
        <el-table :data="tableData" @sort-change="sortChange" stripe max-height="385" v-loading="tableDataLoading">
          <el-table-column type="index" label="序号" width="45" align="center"></el-table-column>
          <el-table-column prop="stockName" label="股东名称" align="center" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unlockNum" label="解禁股份数量(股)" align="right" sortable="custom"></el-table-column>
          <el-table-column prop="floatingRate" label="占解禁前流通股数量比例(%)" align="center" width="172"></el-table-column>
          <el-table-column prop="stockRate" label="占总股本数量比例(%)" align="center" width="135" class-name="shareholdNumber"></el-table-column>
        </el-table>
        <p>本次解禁股东<span>{{fewTotal}}</span>家，共<span>{{numTotal}}</span>万股</p>
      </div>
    </el-dialog>
    <el-dialog class="authDialog" title="企业版本专享功能" :visible.sync="authDialog" width="620px" center top="28vh">
      <div class="message">该功能为企业版用户专享功能，前往查看企业版专享功能吧！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goEnterprise">查看企业版</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: {},
        authDialog: false,
        positionDetail: false,
        timeData: [],
        tableData: [],
        freeDate: '',
        numTotal: '',
        fewTotal: '',
        timeDataLoding: false,
        tableDataLoading: false,
        sortType: ''
      }
    },
    props: ['companyCode'],
    watch: {
      companyCode: function (val) {
        if (val) {
          this.getLockStockTimeList();
        }
      }
    },
    components: {},
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      if (this.companyCode) {
        this.getLockStockTimeList();
      }
      // this.getLockStockTimeList();
    },
    mounted() {
    },
    methods: {
      sortChange(scope) {
        let sort = {
          'ascending': 'asc',
          'descending': 'desc',
          'null': ''
        };
        let order = scope.order;
        this.sortType = sort[order];
        this.getLockStockTimeDetail();
      },
      viewDetails (item) {
        this.numTotal = this.$array.abs(item.row.num.replace(/,/g, "") / 10000, true);
        this.freeDate = item.row.freeDate;
        this.positionDetail = true;
        this.sortType = 'desc'
        this.getLockStockTimeDetail();
      },
       // 数字每三位加一个逗号
      amountAbs(val) {
        if (val == null) {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      getLockStockTimeList () {
        this.timeDataLoding = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getLockStockTimeList,
          params: {
            code: this.companyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.timeDataLoding = false;
            let array = [];
            array = res.data.returnObject;
            array.forEach((item) => {
              item.num = this.amountAbs(item.num);
              item.afterChangeRate = this.$common.toDecimal2(item.afterChangeRate);
              item.beforeChangeRate = this.$common.toDecimal2(item.beforeChangeRate);
              item.floatingStockRate = this.$common.toDecimal2(item.floatingStockRate);
              item.stockRate = this.$common.toDecimal2(item.stockRate);
            })
            console.log(array);
            console.log(1212);
            this.timeData = array;
          }
        })
      },
      getLockStockTimeDetail () {
        this.tableDataLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getLockStockTimeDetail,
          params: {
            code: this.companyCode,
            date: this.freeDate, // 传日期字符串
            sortType: this.sortType
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.tableDataLoading = false;
            let array = [];
            array = res.data.returnObject;
            array.forEach((item) => {
              item.unlockNum = this.$array.abs(item.unlockNum / 10000, true) + '万';
              // item.unlockNum = this.amountAbs(item.unlockNum) + '万';
              item.floatingRate = this.$common.toDecimal2(item.floatingRate);
              item.stockRate = this.$common.toDecimal2(item.stockRate);
            })
            this.tableData = array;
            this.fewTotal = this.tableData.length;
          }
        })
      },
      edit(id) {
        if (!this.userInfo.enterpriseUser) {
          this.authDialog = true;
        } else {
          this.$router.push({
            path: '/disclosure', query: {
              value: '股票解除限售'
            }
          })
        }
      },
      goEnterprise() {
        this.authDialog = false;
        this.$router.push('/manage/purchase')
      }
    }
  }
</script>

<style lang="scss">
  #restrictedStock {
    width: 100%;
    margin-bottom: 16px;
    .time {
      border-radius:4px;
      // max-height: 474px;
      border:1px solid rgba(227,227,227,1);
      padding: 0 16px 16px 16px;
      margin-bottom: 16px;
      .title {
        height: 45px;
        line-height: 45px;
        font-size:14px;
        font-weight:600;
        color:rgba(50,50,50,1);
        border-bottom:1px solid rgba(227,227,227,1);
        margin-bottom: 16px;
      }
      .el-table {
        &::before {
          height: 0;
        }
        th {
          height: 45px;
          background:rgba(240,240,240,1);
          padding: 0;
          text-align: center;
          border: none;
          .cell {
            font-size:12px;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
        }
        td {
          height:35px;
          padding: 0;
          text-align: center;
          border: none;
          .cell {
            font-size:12px;
            font-weight:400;
            color:rgba(0,0,0,1);
            height: 35px;
            line-height: 35px;
          }
        }
        tr:nth-child(even) {
          background:rgba(248,248,248,1);
        }
        .detail {
          a {
            font-size:12px;
            font-weight:400;
            color:rgba(255,177,72,1);
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .icon {
          i {
            color:rgba(174,174,174,1);
            font-size: 14px;
          }
        }
        th:nth-child(3), th:nth-child(4), th:nth-child(5), th:nth-child(7), th:nth-child(8) {
          .cell {
            padding-left: 20px;
            line-height: 17px;
            text-align: left;
          }
        }
        td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(7), td:nth-child(8) {
          padding-right: 10px;
          text-align: right;
        }
        .pointer {
          padding-top: 10px;
        }
        .positive {
          color:rgba(251,67,25,1);
        }
        .negative {
          color:rgba(41,218,137,1);
        }
      }
    }
     .dialog-detail {
      .el-dialog__header {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 14px;
        border-bottom: 1px solid #E3E3E3;
        .el-dialog__title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 177, 72, 1);
        }
        .el-dialog__headerbtn {
          top: 18px;
        }
      }
      .el-dialog__body {
        padding: 0;
      }
      .dialog-table {
        padding: 16px 16px 6px 16px;
        p{
          font-size:12px;
          font-weight:400;
          color:rgba(141,141,141,1);
          line-height:17px;
          margin-top: 10px;
          margin-bottom: 6px;
        }
      }
      .el-table::before {
        display: none;
      }
      .el-table {
        th {
          padding: 0;
          .cell {
            font-size:12px;
            font-weight:400;
            color:rgba(50,50,50,1);
            line-height:35px;
            padding: 0;
          }
        }
        td {
          padding: 0;
          .cell {
            font-size:12px;
            font-weight:400;
            color:rgba(84,84,84,1);
            line-height:35px;
          }
        }
        td.shareholdNumber {
          .cell {
            text-align: right;
            padding-right: 32px;
          }
        }
      }
    }
    .authDialog {
      .el-dialog__header {
        border-bottom: 1px solid #e3e3e3;
        .el-dialog__title {
          color: #ffb148;
        }
        .el-dialog__body {
          padding: 25px;
        }
      }
      .message {
        text-align: center;
      }
    }
  }
</style>
