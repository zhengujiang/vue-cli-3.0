<template>
  <div id="companyQuestionItem" class="company-question">
    <div class="header vux-1px-b">
      <div class="row title">过去30天提问数最多的投资者</div>
      <div class="row r-pagination text">
        <router-link to="/investor/leaderboard/brief?tab=MAXQUESTIONUSER" target="_blank">
          更多<i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
    </div>
    <table class="company-table">
      <tr v-for="(item,index) of tableData">
        <td class="index">{{item.indexNo}}</td>
        <td class="code" v-if="false">
          <span class="market sh-bg-color" v-if="marketFunCode(item.companyCode) == 'SH'">{{item.companyCode}}</span>
          <span class="market sz-bg-color" v-else>{{item.companyCode}}</span>
        </td>
        <td class="companyName">
          <router-link target="_blank" class="a-link"
                       :to="'/investor/personal?market='+marketFun(item.marketType)+'&name='+item.userName">
            {{item.userName}}
          </router-link>
          <span class="market sh-bg-color" v-if="item.marketType.indexOf('沪') > -1">沪</span>
          <span class="market sz-bg-color" v-else>深</span>
        </td>
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
        marketData: [
          {id: 0, name: '沪市主板', type: '沪'},
          {id: 1, name: '深市主板', type: '深'},
          {id: 2, name: '深市中小板', type: '深'},
          {id: 3, name: '深市创业板', type: '深'}
        ],
        interactVal: 'LASTMONTH',
        tableData: []
      }
    },
    created() {
      // for (var i = 0; i < 2; i++) {
      //   this.tableData = this.tableData.concat(this.tableData);
      // }
      //
      this.getInteractTopTenRank();
    },
    methods: {
      marketFun(type) {
        let data = '';
        this.marketData.forEach((item) => {
          if (item.name.indexOf(type) > -1) {
            data = item.id
          }
        })
        console.log('213123', data);
        return data
      },
      marketFunCode(code) {
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
            interactTypeEnum: 'MAXQUESTIONUSER',
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
              font-size: 14px;
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
      table-layout: fixed;
      tr {
        height: 40px;
        .index {
          /*min-width: 10%;*/
          font-size: 16px;
          color: #323232;
          text-align: center;
          width: 6%;
        }
        .code {
          width: 60px;
          padding-left: 5px;
          .SH {
            display: inline-block;
            background: #FEA690;
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
          width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          .market {
            border-radius: 2px;
            color: #fff;
            height: 16px;
            width: 16px;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }
          .a-link {
            &:hover {
              color: #ffb148;
            }
          }
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
