<template>
  <div id="potentialFund" v-if="potentialFundData.length>0">
    <div v-if="!userInfo.enterpriseUser" class="potentialFund">
      <div class="title">
        <p>潜在基金持股情况分析</p>
      </div>
      <el-table :data="potentialFundData" stripe style="width: 100%;" height="210px">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="fundHolder" label="机构投资者" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fundCompany" label="所属公司" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="近期持股明细" align="center">
          <template slot-scope="scope">
            <a class="viewDetail" @click="viewDetails(scope)">查看详情</a>
          </template>
        </el-table-column>
        <el-table-column prop="fundHolderScore" label="持股可能性" align="center">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.fundHolderScore" disabled-void-color="#DBDBDB" disabled ></el-rate>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <p>共<span>{{totalNum}}</span>条</p>
        <el-button type="primary" @click="lookAll">查看全部</el-button>
      </div>
    </div>
    <div v-else class="potentialFund">
      <div class="title">
        <p>潜在基金持股情况分析</p>
      </div>
      <el-table :data="potentialFundData" stripe style="width: 100%;" height="350px">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="fundHolder" label="机构投资者" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fundCompany" label="所属公司" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="近期持股明细" align="center">
          <template slot-scope="scope">
            <a class="viewDetail" @click="viewDetails(scope)">查看详情</a>
          </template>
        </el-table-column>
        <el-table-column prop="fundHolderScore" label="持股可能性" align="center">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.fundHolderScore" disabled-void-color="#DBDBDB" disabled ></el-rate>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <p>共<span>{{totalNum}}</span>条</p>
      </div>
    </div>
    <el-dialog class="dialog-detail" title="持股明细" :visible.sync="positionDetail" width="620px" top="30vh">
      <div class="dialog-table">
        <el-table :data="tableData" stripe height="385px" v-loading="tableDataLoading">
          <el-table-column type="index" label="序号" width="90" align="center"></el-table-column>
          <el-table-column prop="date" label="截止日期" align="center" sortable></el-table-column>
          <el-table-column prop="stockCode" label="股票代码" align="center"></el-table-column>
          <el-table-column prop="stockName" label="股票简称" align="center"></el-table-column>
          <el-table-column prop="stakeHolderNum" label="持股数量" align="center" class-name="shareholdNumber"></el-table-column>
        </el-table>
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
        totalNum: '',
        fundId: '',
        positionDetail: false,
        authDialog: false,
        potentialFundData: [],
        tableData: [],
        tableDataLoading: false
      }
    },
    props: ['companyCode'],
    watch: {
      companyCode: function (val) {
        if (val) {
          this.getPotentialFundHolderByStockCode();
        }
      }
    },
    components: {},
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      if (this.companyCode) {
        this.getPotentialFundHolderByStockCode();
      }
    },
    mounted() {
    },
    methods: {
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
      viewDetails (item) {
        this.fundId = item.row.id;
        this.positionDetail = true
        this.getPotentialFundHolderDetails();
      },
      lookAll () {
        this.authDialog = true;
      },
      goEnterprise() {
        this.authDialog = false;
        this.$router.push('/manage/purchase')
      },
      getPotentialFundHolderByStockCode () {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getPotentialFundHolderByStockCode,
          params: {
            stockCode: this.companyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let array = [];
            array = res.data.returnObject.data.row;
            array.forEach((item) => {
              if (item.fundHolderScore > 2 && item.fundHolderScore < 5) {
                item.fundHolderScore = 1;
              } else if (item.fundHolderScore >= 5 && item.fundHolderScore < 10) {
                item.fundHolderScore = 2;
              } else if (item.fundHolderScore >= 10 && item.fundHolderScore < 15) {
                item.fundHolderScore = 3;
              } else if (item.fundHolderScore >= 15 && item.fundHolderScore < 20) {
                item.fundHolderScore = 4;
              } else if (item.fundHolderScore >= 20) {
                item.fundHolderScore = 5;
              } else {
                item.fundHolderScore = 0;
              }
            })

            if (!this.userInfo.enterpriseUser) {
              this.potentialFundData = array.slice(0, 5);
            } else {
              this.potentialFundData = array;
            }
            this.totalNum = this.potentialFundData.length;
          }
        })
      },
      getPotentialFundHolderDetails () {
        this.tableDataLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getPotentialFundHolderDetails,
          params: {
            fundId: this.fundId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.tableDataLoading = false;
            let array = [];
            array = res.data.returnObject.data.row;
            array.forEach((item) => {
              item.stakeHolderNum = this.amountAbs(item.stakeHolderNum);
            })
            this.tableData = array;
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #potentialFund {
    .potentialFund {
      border-radius:4px;
      border:1px solid rgba(227,227,227,1);
      padding: 0 16px 0 16px;
      margin-bottom: 16px;
      .title {
        display: flex;
        align-items: center;
        height: 45px;
        border-bottom: 1px solid #E3E3E3;
        p {
          font-size:14px;
          font-weight:600;
          color:rgba(50,50,50,1);
        }
      }
      .el-table {
        margin-top: 16px;
        th {
          padding: 0;
          .cell {
            padding: 0;
            color:rgba(50,50,50,1);
            line-height: 35px;
            font-size:12px;
            font-weight:400;
          }
        }
        td {
          padding: 0;
          .cell {
            color:rgba(0,0,0,1);
            padding: 0;
            line-height: 35px;
            font-size:12px;
            font-weight:400;
            .el-rate {
              height: 35px;
            }
            .el-rate__item {
              margin-top: 7px;
            }
          }
        }

      }
      .viewDetail {
        cursor: pointer;
        font-size:12px;
        font-weight:400;
        color:rgba(255,177,72,1);
        line-height:17px;
        text-decoration: underline;
      }
      .bottom {
        height: 50px;
        line-height: 50px;
        p {
          float: left;
          font-size:12px;
          font-weight:400;
          color:rgba(174,174,174,1);
        }
        .el-button {
          width:150px;
          height:35px;
          background:rgba(255,177,72,1);
          border-radius:4px;
          float: right;
          padding: 0;
          margin-top: 7px;
          span {
            font-size:16px;
            font-weight:600;
            color:rgba(255,255,255,1);
          }
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
