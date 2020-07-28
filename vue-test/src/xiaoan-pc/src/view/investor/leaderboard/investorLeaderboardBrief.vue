<template>
  <div id="investorLeaderboardBrief" v-loading="tableDataLading">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-box">
      <el-tab-pane class="v-tabs-item" label="提问数最多的公司" name="QUESTION">
        <!--提问数最多的公司-->
        <table border="0" class="company-table">
          <thead>
          <tr>
            <td class="index">序号</td>
            <td class="companyName">公司名称</td>
            <td class="code">股票代码</td>
            <td class="number">提问数</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) of tableDataQ" :class="{'is-background': (index+1) % 2 == 0}">
            <td class="index"><span class="indexNo" :class="'index'+index">{{index+1}}</span></td>
            <td class="companyName">{{item.companyName}}</td>
            <td class="code">{{item.companyCode}}</td>
            <td class="number">{{$common.abs(item.questionCount).replace('.00','')}}</td>
          </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane class="v-tabs-item" label="回答数最多的公司" name="ANSWER">
        <!--回答数最多的公司-->
        <table border="0" class="company-table">
          <thead>
          <tr>
            <td class="index">序号</td>
            <td class="companyName">公司名称</td>
            <td class="code">股票代码</td>
            <td class="number">提问数</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) of tableDataA" :class="{'is-background': (index+1) % 2 == 0}">
            <td class="index"><span class="indexNo" :class="'index'+index">{{index+1}}</span></td>
            <td class="companyName">{{item.companyName}}</td>
            <td class="code">{{item.companyCode}}</td>
            <td class="number">{{$common.abs(item.answerCount).replace('.00','')}}</td>
          </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane class="v-tabs-item" label="回复率最多的公司" name="ANSWERRATE">
        <!--回复率最多的公司-->
        <table border="0" class="company-table">
          <thead>
          <tr>
            <td class="index">序号</td>
            <td class="companyName">公司名称</td>
            <td class="code">股票代码</td>
            <td class="number">回复率</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) of tableDataR" :class="{'is-background': (index+1) % 2 == 0}">
            <td class="index"><span class="indexNo" :class="'index'+index">{{index+1}}</span></td>
            <td class="companyName">{{item.companyName}}</td>
            <td class="code">{{item.companyCode}}</td>
            <td class="number">{{item.answerRate +'%'}}</td>
          </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane class="v-tabs-item" label="提问数最多的投资者" name="MAXQUESTIONUSER">
        <!--提问数最多的投资者-->
        <table border="0" class="company-table">
          <thead>
          <tr>
            <td class="index">序号</td>
            <td class="companyName">投资者名称</td>
            <td class="code">来源</td>
            <td class="number">提问数</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) of tableDataM" :class="{'is-background': (index+1) % 2 == 0}">
            <td class="index"><span class="indexNo" :class="'index'+index">{{index+1}}</span></td>
            <td class="companyName" v-if="userInfo.enterpriseUser">
              <router-link target="_blank" class="a-link"
                           :to="'/investor/personal?market='+marketFun(item.marketType)+'&name='+encodeURI(item.userName)">
                {{item.userName}}
              </router-link>
            </td>
            <td class="companyName" v-else>{{item.userName}}</td>
            <td class="code">{{item.marketType}}</td>
            <td class="number">{{$common.abs(item.questionCount).replace('.00','')}}</td>
          </tr>
          </tbody>
        </table>
      </el-tab-pane>
    </el-tabs>
    <div class="warning">数据更新于{{dateTime}}</div>
  </div>
</template>

<script>
  export default {
    name: "investorLeaderboardBrief",
    components: {},
    data() {
      return {
        activeName: 'QUESTION',
        tableDataQ: [],
        tableDataA: [],
        tableDataR: [],
        tableDataM: [],
        dateTime: '',
        tableDataLading: false,
        interactVal: 'LASTMONTH',
        userInfo: {}
      }
    },
    watch: {
      $route: function (route) {
        console.log(route);
        if (this.$route.query.select) {
          this.interactVal = this.$route.query.select;
        } else {
          let query = Object.assign({}, this.$route.query, {select: 'LASTMONTH'});
          this.$router.replace({path: this.$route.path, query: query});
        }
        //
        if (this.$route.query.tab) {
          this.activeName = this.$route.query.tab;
        } else {
          let query = Object.assign({}, this.$route.query, {tab: 'QUESTION'});
          this.$router.replace({path: this.$route.path, query: query});
        }
        //
        this.getInteractTopTenRank(this.activeName);
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      if (this.$route.query.select) {
        this.interactVal = this.$route.query.select;
      }
      if (this.$route.query.tab) {
        this.activeName = this.$route.query.tab;
      }
      this.dateTime = this.getFirstDayOfWeek(new Date());
      this.getInteractTopTenRank(this.activeName);
    },
    methods: {
      handleClick(val) {
        let query = Object.assign({}, this.$route.query, {tab: this.activeName});
        this.$router.replace({path: this.$route.path, query: query});
        this.getInteractTopTenRank(this.activeName);
      },
      // 获取这周的周一
      getFirstDayOfWeek(date) {
        var weekday = date.getDay() || 7; // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
        date.setDate(date.getDate() - weekday + 1);// 往前算（weekday-1）天，年份、月份会自动变化
        console.log(date);
        return this.$common.transTime(date.getTime())[0];
      },
      marketFun(code) {
        let market = '';
        if (String(code).substring(0, 1) == '6' || String(code).substring(0, 1) == '9') {
          market = 'SH'
        } else {
          market = 'SZ'
        }
        console.log('2222', market);
        return market;
      },
      getInteractTopTenRank(index) {
        this.tableDataLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getInteractTopTenRank,
          params: {
            interactTypeEnum: index,
            interactCycleEnum: this.interactVal
          }
        }).then((res) => {
          setTimeout(() => {
            this.tableDataLading = false;
          }, 300)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              let data = res.data.returnObject;
              if (index == 'QUESTION') {
                this.tableDataQ = data;
              } else if (index == 'ANSWER') {
                this.tableDataA = data;
              } else if (index == 'ANSWERRATE') {
                this.tableDataR = data;
              } else if (index == 'MAXQUESTIONUSER') {
                this.tableDataM = data;
              }
              // console.log('data', this.tableData);
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.tableDataLading = false;
          }, 1000)
        })
      }
    }
  }
</script>

<style lang="scss">
  #investorLeaderboardBrief {
    .warning {
      font-size: 12px;
      color: #aeaeae;
      text-align: left;
      margin-top: 20px;
      font-weight: normal;
    }
    .tabs-box {
      .splitTab {
        position: absolute;
        right: -40px;
        top: 0;
        color: #e3e3e3;
        font-weight: 100;
      }
      /*.el-tabs__active-bar {*/
      /*display: none;*/
      /*}*/
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__item {
        height: 56px;
        line-height: 56px;
        color: #8d8d8d;
        font-size: 14px;
        font-weight: normal;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      /* .el-tabs__item.is-top:nth-child(2) {
         margin-left: 16px;
       }
       .el-tabs__item.is-top:last-child {
         margin-right: 0;
       }*/

      .el-tabs__item.is-active {
        color: #ffb148;
        // border-bottom: 2px solid #ffb148;
        .date {
          color: #ffb148;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  #investorLeaderboardBrief {
    width: 100%;
    min-height: 600px;
    .company-table {
      width: 100%;
      font-size: 14px;
      border: none;
      border: 0;
      border-collapse: collapse;
      table-layout: fixed;
      thead {
        tr {
          background: #f2f2f2;
          td {
            color: #323232;
            font-size: 16px !important;
          }
        }
      }
      tr {
        height: 40px;
        td {
          font-size: 14px;
          color: #545454;
        }
        &.is-background {
          background: #F8F8F8;
        }
        .index {
          padding-left: 16px;
          width: 55px;
          font-size: 16px;
          color: #323232;
          text-align: center;
          .indexNo {
            display: inline-flex;
            align-items: center;
            text-align: center;
            height: 18px;
            width: 18px;
            font-size: 14px;
            line-height: 1;
            border-radius: 50%;
            justify-content: center;
            &.index0 {
              background-color: #FFC952;
              color: white;
            }
            &.index1 {
              background-color: #90B8F5;
              color: white;
            }
            &.index2 {
              background-color: #F5BE95;
              color: white;
            }
          }
        }
        .code {
          width: 30%;
          text-align: center;
          // width: 60px;
          //padding-left: 70px;
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
          padding-left: 13%;
          text-align: center;
          font-size: 14px;
          color: #323232;
          .a-link {
            &:hover {
              color: #ffb148;
            }
          }
        }
        .number {
          text-align: right;
          font-size: 14px;
          padding-right: 85px;
          width: 25%;
          color: #323232;
          .small {
            font-size: 12px;
            color: #AEAEAE;
          }
        }
      }
    }
  }
</style>
