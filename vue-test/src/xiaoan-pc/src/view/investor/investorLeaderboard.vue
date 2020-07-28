<template>
  <div class="investor-leaderboard" id="investor-leaderboard">
    <div class="box-header">
      <div class="content">
        <div class="list">
          <div class="row text">
            <div class="font-size-16 name" v-if="$route.meta.check == 'brief'">
              <span>e互动排行榜</span>
              <el-select class="select-item numberPev" size="mini" v-model="selectPev" placeholder="时间"
                         @change="headerChange">
                <el-option v-for="item in optionPevData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="font-size-16 name" v-if="$route.meta.check == 'overview'">
              <span>市场概览</span>
            </div>
          </div>
          <div class="row btns">
            <el-button class="radio-btn" type="primary" :plain="$route.meta.check == 'brief'"
                       @click="checkChange(true)">总览
            </el-button>
            <el-button class="radio-btn" type="primary" :plain="$route.meta.check == 'overview'"
                       @click="checkChange(false)">排行榜
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-card class="box-card no-border warning-all" :class="{'is-background': $route.meta.check == 'overview'}"
             shadow="never"
             body-style="padding:0px">
      <div class="content">
        <el-row :gutter="16">
          <el-col :span="18" class="left-list">
            <router-view></router-view>
          </el-col>
          <!---->
          <el-col :span="6" class="right-list">
            <v-adv :pageName="'投关市场概览'" style="margin-top:15px;"></v-adv>
            <el-card class="box-card" shadow="never" body-style="padding: 0px 16px"
                     v-loading="companyIndexFromMarketLading" v-if="userInfo.enterpriseUser">
              <!--广告-->
              <div id="companyItem">
                <div class="header vux-1px-b">
                  <div class="row title">过去30天本公司互动情况</div>
                  <div class="row r-pagination text">
                    <router-link :to="'/investor/company/overview?code='+companyCode" target="_blank">
                      更多<i class="el-icon-arrow-right"></i>
                    </router-link>
                  </div>
                </div>
                <table class="company-table">
                  <tr v-for="(item,index) of tableData">
                    <td class="name">{{item.name}}</td>
                    <td class="number">{{item.ratio}}</td>
                  </tr>
                </table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "investor-leaderboard",
    components: {},
    data() {
      return {
        check: false,
        tableData: [],
        dateTime: '',
        companyIndexLoading: true,
        companyIndexFromMarketData: {},
        companyIndexFromMarketLading: true,
        selectPev: 'LASTMONTH',
        optionPevData: [
          {
            value: 'LASTMONTH',
            label: '过去30天'
          }, {
            value: 'LASTQUARTER',
            label: '过去90天'
          }, {
            value: 'LASTYEAR',
            label: '过去1年'
          }
        ],
        userInfo: {},
        companyCode: ''
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      console.log(this.userInfo);
      this.companyCode = this.userInfo.enterpriseCompanyCode;
      this.getCompanyIndexFromMarket('LASTMONTH');
      if (this.$route.query.select) {
        this.selectPev = this.$route.query.select;
      } else {
        let query = Object.assign({}, this.$route.query, {select: 'LASTMONTH'});
        this.$router.replace({path: this.$route.path, query: query});
      }
    },
    methods: {
      headerChange(val) {
        console.log(this.$route);
        let query = Object.assign({}, this.$route.query, {select: val});
        this.$router.replace({path: '/investor/leaderboard/brief', query: query});
      },
      //
      getCompanyIndexFromMarket(type) {
        this.companyIndexFromMarketLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getCompanyIndexFromMarket,
          params: {
            interactCycleEnum: type,
            companyCode: this.companyCode
          }
        }).then((res) => {
          setTimeout(() => {
            this.companyIndexFromMarketLading = false;
          }, 300);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              let data = res.data.returnObject;
              //
              let dataNo = [
                {id: 'question-ratio', index: 60, type: 0, number: 0},
                {id: 'answer-ratio', index: 70, type: 1, number: 0},
                {id: 'recover-rate', index: 30, type: 2, number: 0}
              ];
              //
              if (data.questionIndexInfo) {
                this.companyIndexFromMarketData.question = data.questionIndexInfo.questionCount;
                dataNo[0].number = data.questionIndexInfo.indexNo;
                dataNo[0].name = '提问数';
                dataNo[0].ratio = data.questionIndexInfo.questionCount;
                this.companyIndexFromMarketData.questionNo = data.questionIndexInfo.indexNo;
              }
              //
              if (data.answerIndexInfo) {
                this.companyIndexFromMarketData.answer = data.answerIndexInfo.answerCount;
                this.companyIndexFromMarketData.answerNo = data.answerIndexInfo.indexNo;
                dataNo[1].ratio = data.answerIndexInfo.answerCount;
                dataNo[1].name = '回答数';
                dataNo[1].number = data.answerIndexInfo.indexNo;
              }
              //
              if (data.answerRateIndexInfo) {
                this.companyIndexFromMarketData.answerRate = data.answerRateIndexInfo.answerRate;
                dataNo[2].number = data.answerRateIndexInfo.indexNo;
                dataNo[2].ratio = data.answerRateIndexInfo.answerRate + '%';
                dataNo[2].name = '回复率';
                this.companyIndexFromMarketData.answerRateNo = data.answerRateIndexInfo.indexNo;
              }
              this.tableData = dataNo;
              console.log('this.companyIndexFromMarketData===>', dataNo, this.companyIndexFromMarketData);
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.companyIndexFromMarketLading = false;
          }, 1000)
        })
      },
      //
      checkChange(val) {
        console.log(this.$route, val);
        let link = ''
        if (val) {
          // true
          link = '/investor/leaderboard/overview'
        } else {
          // false list
          link = '/investor/leaderboard/brief'
        }
        this.$router.replace({path: link, query: this.$route.query});
      }
    }
  }
</script>

<style lang="scss" scoped>
  #investor-leaderboard {
    background-color: #fff;
    @import "../../../static/css/animate";
    .box-header {
      width: 100%;
      height: 100px;
      background: #fff;
      -moz-box-shadow: 0px 10px 20px #f6f6f6;
      -webkit-box-shadow: 0px 10px 20px #f6f6f6;
      box-shadow: 0px 10px 20px #f6f6f6;
      position: relative;
      overflow: hidden;
      .list {
        display: flex;
        height: 100px;
        align-items: center;
        .row {
          flex: 1;
          &.img {
            flex: inherit;
            .code {
              display: inline-block;
              height: 48px;
              width: 48px;
              border-radius: 50%;
              line-height: 48px;
              text-align: center;
              font-size: 12px;
              color: #FFFFFF;
            }
          }
          &.text {
            padding-left: 10px;
            .name {
              font-size: 20px;
              color: #323232;
              display: flex;
              align-items: center;
              font-weight: 500;
              .select-item {
                margin-left: 30px;
                width: 75px;
                &.number {
                  width: 85px;
                }
                &.numberPev {
                  width: 100px;
                }
              }
            }
          }
          &.btns {
            text-align: right;
            .radio-btn {
              padding: 0;
              height: 30px;
              width: 60px;
              text-align: center;
              border-radius: 2px;
            }
          }
        }
      }
    }
    .no-border {
      border: 0;
      border: none;
      margin: 0;
      padding-bottom: 16px;
      transition: all .3s;
      &.is-background {
        background-color: #f6f6f6;
      }
    }

    #companyItem {
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
              color: #8D8D8D;
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
        // table-layout: fixed;
        tr {
          height: 40px;
          .index {
            width: 6%;
            font-size: 16px;
            color: #323232;
            text-align: center;
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
  }
</style>
