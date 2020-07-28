<template>
  <!--提问过的上市公司-->
  <div id="companyQuestionItem" class="company-question">
    <div class="header vux-1px-b">
      <div class="row title">过去30天提问数最多的公司</div>
      <div class="row r-pagination text">
        <router-link to="/investor/leaderboard/brief?tab=QUESTION" target="_blank">
          更多<i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
    </div>
    <table class="company-table">
      <tr v-for="(item, index) of tableData">
        <td class="index">{{item.indexNo}}</td>
        <td class="code">
          <span class="market sh-bg-color" v-if="marketFun(item.companyCode) == 'SH'">{{item.companyCode}}</span>
          <span class="market sz-bg-color" v-else>{{item.companyCode}}</span>
        </td>
        <td class="companyName">{{item.companyName}}</td>
        <td class="number">{{item.questionCount}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: "companyQuestionItem",
    components: {},
    data() {
      return {
        interactVal: 'LASTMONTH',
        tableData: []
      }
    },
    created() {
      this.getInteractTopTenRank();
      //
    },
    methods: {
      marketFun(code) {
        let market = '';
        if (String(code).substring(0, 1) == '6' || String(code).substring(0, 1) == '9') {
          market = 'SH'
        } else {
          market = 'SZ'
        }
        console.log(market);
        return market;
      },
      getInteractTopTenRank() {
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getInteractTopTenRank,
          params: {
            interactTypeEnum: 'QUESTION',
            interactCycleEnum: this.interactVal
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              let data = res.data.returnObject;
              if (data.length > 5) {
                this.tableData = data.slice(0, 5);
              } else {
                this.tableData = data;
              }
              console.log('data', this.tableData);
            }
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #companyQuestionItem {
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .row {
        flex: 1;
        &.title {
          font-size: 14px;
          color: #323232;
          font-weight: 600;
        }
        &.r-pagination {
          flex: 0 0 20%;
          text-align: right;
          &.text {
            font-size: 12px;
            color: #8d8d8d;
            cursor: pointer;
            i {
              font-size: 12px;
            }
          }
        }
      }
    }
    .company-table {
      width: 100%;
      font-size: 14px;
      margin: 11px 0;
      border: none;
      border: 0;
      border-collapse: collapse;
      // table-layout: fixed;
      tr {
        height: 40px;
        .index {
          width: 6%;
          font-size: 16px;
          color: #323232;
          text-align: left;
        }
        .code {
          width: 60px;
          padding-left: 5px;
          .market {
            display: inline-block;
            border-radius: 2px;
            height: 20px;
            width: 50px;
            line-height: 20px;
            text-align: center;
            color: white;
            font-size: 12px;
          }
        }
        .companyName {
          padding-left: 5px;
          font-size: 14px;
          color: #323232;
          width: 70px;
        }
        .number {
          text-align: right;
          font-size: 14px;
          color: #323232;
          padding-right: 3px;
          .small {
            font-size: 12px;
            color: #AEAEAE;
          }
        }
      }
    }
  }
</style>
