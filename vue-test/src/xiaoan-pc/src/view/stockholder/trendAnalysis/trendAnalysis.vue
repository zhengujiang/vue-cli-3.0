<template>
  <div id="trendAnalysis">
    <div class="search">
      <!-- <div class="title">好莱客603898</div> -->
      <div v-if="specialAccount" class="title">{{userInfo.companyCode}}&nbsp;{{userInfo.enterpriseCompanyName}}</div>
      <div v-else class="title">{{companyCode}}&nbsp;{{companyName}}</div>
      <div class="search-input">
        <el-popover ref="popover" placement="bottom" width="300" trigger="click" popper-class="inputCode"
                    v-on:click="selectCode" v-model="gridData.length>0">
          <ul class="trend-autocomplete">
            <li style="display: flex;" v-for="(list,index) in gridData" :key="index" @click="selectCode(index)">
              <span style="flex: 1" v-html="$common.highlight(inputCode,list.code)"></span>
              <span style="flex: 1">{{ list.name }}</span>
            </li>
          </ul>
        </el-popover>
        <!-- <input class="input-text" v-model="searchWord" type="text" placeholder="输入公司代码/简称"> -->
        <input class="input-text" type="text" placeholder="输入公司代码/简称" v-popover:popover @focus="loadCode"
               @input="loadCode"
               v-model="inputCode" @keyup.13="searchChange">
        <button @click="searchChange">
          <i class="el-icon-search"></i>
        </button>
        <p class="input-code-error" v-show="inputCodeError">请输入正确的沪深股票代码或简称</p>
      </div>
      <button type="primary" class="report" @click="exportReports">一键导出报告</button>
    </div>
    <trendCard :companyCode="companyCode"></trendCard>
    <holderAnalysis :companyCode="companyCode"></holderAnalysis>
    <industryContrast :companyCode="companyCode"></industryContrast>
    <publicFund :companyCode="companyCode"></publicFund>
    <potentialFund :companyCode="companyCode"></potentialFund>
    <restrictedStock :companyCode="companyCode"></restrictedStock>
    <stock-pledge :companyCode="companyCode"></stock-pledge>
    <stock-ownership :companyCode="companyCode"></stock-ownership>
    <rzrq-analysis :companyCode="companyCode"></rzrq-analysis>

    <el-dialog top="35vh" :before-close="beforeCloseDig" width="620px" :title="exportRollOfficialDigTitle"
               :visible.sync="doneDownProgress"
               append-to-body>
      <div class="progress-log">
        <div class="message">导出数据需要一些时间，请耐心等待！</div>
        <vxa-progress v-model="uploadAnalysis" :animation="false" :height="12" :width="'100%'"></vxa-progress>
      </div>
    </el-dialog>
    <!---->
    <el-dialog top="35vh" :close-on-click-modal="false" :show-close="false" width="620px"
               :title="exportRollOfficialDigTitle"
               :visible.sync="doneDownClear" append-to-body>
      <div class="message" style="text-align: center">您将放弃导出显示信息！</div>
      <div class="center top20" style="padding-top: 20px">
        <el-button @click="exportRollOfficialClick(2,false)" style="width: 150px" type="primary" class="check-btn"
                   plain>放弃
        </el-button>
        <el-button @click="exportRollOfficialClick(2,true)" style="width: 150px" type="primary" class="check-btn">
          继续导出
        </el-button>
      </div>
    </el-dialog>
    <!---->
    <el-dialog top="35vh" :before-close="beforeCloseDig" :close-on-click-modal="false" width="620px"
               :title="exportRollOfficialDigTitle"
               :visible.sync="doneDown" append-to-body>
      <div class="message" style="text-align: center;">导出完成！</div>
      <div class="center top20" style="padding-top: 20px">
        <el-button style="width: 150px" @click="exportRollOfficialClick(4,true)" type="primary" class="check-btn">确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import trendCard from './components/trendCard.vue';
  import publicFund from './components/publicFund.vue';
  import potentialFund from './components/potentialFund.vue';
  import holderAnalysis from './components/holderAnalysis.vue';
  import industryContrast from './components/industryContrast.vue';
  import restrictedStock from './components/restrictedStock.vue';

  import stockPledge from './components/stockPledge'
  import stockOwnership from './components/stockOwnerShip'
  import rzrqAnalysis from './components/rzrqAnalysis'
  export default {
    data() {
      return {
        searchWord: '',
        companyCode: '',
        companyName: '',
        radio1: '',
        radio2: '',
        radio3: '',
        radio4: '',
        value: '3',
        gridData: [],
        inputCode: '',
        inputCodeError: false,
        showPopover: false,
        name: '',
        exportRollOfficialDig: false,
        doneDownProgress: false,
        doneDownClear: false,
        doneDown: false,
        uploadAnalysis: 0,
        exportRollOfficialFileUrl: '',
        exportRollOfficialDigTitle: '导出股东趋势分析报告',
        userInfo: {},
        specialAccount: false,
        exportRollOfficialFileName: ''
      }
    },
    components: {
      publicFund,
      potentialFund,
      trendCard,
      holderAnalysis,
      industryContrast,
      stockPledge,
      stockOwnership,
      rzrqAnalysis,
      restrictedStock
    },
    created() {
      if (this.$route.query.code) {
        this.companyName = this.$route.query.name;
        this.companyCode = this.$route.query.code;
      } else {
        this.getUseStockCode();
      }
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      if (this.userInfo.companyCode == '888888') {
        this.userInfo.enterpriseCompanyName = '信公小安';
        this.companyCode = '600000';
        this.specialAccount = true;
      }
    },
    mounted() {

    },
    methods: {
      getUseStockCode() {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getUseStockCode,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.companyName = res.data.returnObject.name;
            this.companyCode = res.data.returnObject.code;
            this.$router.push({
              path: '/stockHolder/trendAnalysis',
              query: {code: res.data.returnObject.code, name: this.companyName}
            });
          }
        })
      },
      selectCode(e) {
        this.inputCode = this.gridData[e].code + ' ' + this.gridData[e].name
        this.name = this.gridData[e].name
        this.showPopover = false;
        this.searchChange()
      },
      // 公司代码 autocomplete
      loadCode() {
        setTimeout(() => {
          this.inputCode = this.inputCode ? this.inputCode : ''
          this.$http({
            methods: 'GET',
            url: this.$api.affiche.autoCompleteA,
            params: {
              key: this.inputCode
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.inputCodeError = false
              this.gridData = res.data.returnObject;
              this.gridData = this.gridData.filter(e => {
                return e.bstock != true
              })
            } else {
              this.gridData = []
              this.inputCodeError = true
            }
          }).catch((err) => {
            this.gridData = []
            this.inputCodeError = true
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: err.message
            })
          })
        }, 500)

      },
      searchChange() {
        if (!this.inputCode) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '请输入公司代码/简称'});
          return false
        }
        let word = this.inputCode.split(' ')[0]
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: word
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject
            let hasCode = false
            data.forEach((item) => {
              if (item.code == word || item.name == word) {
                hasCode = true
                this.companyCode = item.code
                this.companyName = item.name
                this.specialAccount = false;
                // this.name = item.name
                this.$router.push({path: '/stockHolder/trendAnalysis', query: {code: item.code, name: item.name}});
              }
            })

            if (!hasCode) {
              this.inputCodeError = true
              // this.$message({showClose: true, type: 'warning', duration: 3000, message: '暂无股票信息，请输入正确的公司代码/简称'});
            } else {
              this.inputCodeError = false
            }
          } else {
            this.inputCodeError = true
          }
        }).catch((res) => {
          this.inputCodeError = true
        })

      },
      exportReports() {
        this.doneDownProgress = true;
        this.exportRollOfficialClick(0, true);
      },
      generateHolderTrendReport() {
        let userId = '';
        if (this.$cookie.get('userId')) {
          userId = this.$cookie.get('userId');
        }
        this.$http({
          methods: 'GET',
          url: this.$api.gxfApi.generateHolderTrendReport,
          params: {
            code: this.companyCode,
            userId: userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.exportRollOfficialFileUrl = res.data.returnObject.url;
            this.exportRollOfficialFileName = res.data.returnObject.fileName;
            this.uploadAnalysis = 100;
            setTimeout(_ => {
              clearInterval(window.exportRoll);
              this.exportRollOfficialClick(3, true)
            }, 300);
          } else {
            setTimeout(_ => {
              clearInterval(window.exportRoll);
              this.$message({showClose: true, type: 'warning', duration: 3000, message: '导出信息失败！'});
              this.exportRollOfficialDig = false;
              this.doneDownProgress = false;
              this.doneDownClear = false;
              this.doneDown = false;
            }, 300);
          }
        }).catch((err) => {
        })
      },
      exportRollOfficialClick(type, bool) {
        switch (type) {
          case 0:
            if (bool) {
              //
              this.exportRollOfficialDig = bool;
              this.doneDownProgress = bool;
              this.generateHolderTrendReport();
              this.uploadAnalysis = 0
              window.exportRoll = setInterval(_ => {
                this.uploadAnalysis += Math.ceil(Math.random());
                if (this.uploadAnalysis >= 72) {
                  clearInterval(window.exportRoll);
                }
              }, 1213)
            } else {
              this.exportRollOfficialDig = false;
            }
            break;
          case 1:
            break;
          case 2:
            if (bool) {
              //
              this.exportRollOfficialDig = bool;
              this.doneDownClear = false;
            } else {
              //
              this.exportRollOfficialDig = false;
              this.doneDownProgress = false;
              this.doneDownClear = false;
              this.doneDown = false;
            }
            break;
          case 3:
            if (bool) {
              this.doneDown = true;
            }
            break;
          case 4:
            if (bool) {
              this.exportRollOfficialDig = false;
              this.doneDownProgress = false;
              this.doneDownClear = false;
              this.doneDown = false;
              this.$array.download(this.exportRollOfficialFileUrl, this.exportRollOfficialFileName);
            }
            break;
        }
      },
      beforeCloseDig() {
        this.doneDownClear = true;
      }
    }
  }
</script>

<style lang="scss">
  .exportRollOfficialDig {
    .officialDig-box {
      display: flex;
      .col {
        flex: 1;
        &.title {
          flex: 0 0 20%;
        }
        .el-radio-group {
          .el-radio + .el-radio {
            margin-left: 0;
          }
          .el-radio {
            margin: 5px 0;
            margin-right: 40px;
          }
        }
      }
    }
  }
  #trendAnalysis {
    width: 1200px;
    margin: 0 auto;
    .search {
      border-bottom: 1px solid #E3E3E3;
      height: 80px;
      margin-bottom: 20px;
      .stock-search {
        width: 300px;
      }
      .title {
        float: left;
        width: 180px;
        height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: rgba(50, 50, 50, 1);
        line-height: 28px;
        margin: 34px 16px 18px 0;
      }
      .search-input {
        float: left;
        height: 24px;
        display: inline-block;
        margin: 36px 0 20px 0;
        .input-text {
          width: 290px;
          height: 24px;
          border-radius: 2px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          padding: 0 9px;
          border: 1px solid #E3E3E3;
          float: left;
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          line-height: 24px;
          border-right: none;
        }
        .input-code-error {
          color: red;
          font-size: 12px;
        }
        button {
          width: 40px;
          height: 24px;
          background: #FFB148;
          float: left;
          border: 0;
          outline: none;
          font-size: 13px;
          border-radius: 0;
          color: #ffffff;
          padding: 0 !important;
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
        }
      }
      .report {
        float: right;
        border: 0;
        margin-top: 30px;
        display: block;
        width: 150px;
        height: 35px;
        line-height: 35px;
        background: rgba(255, 177, 72, 1);
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
    }
    // .averageImage {
    //   height:360px;
    //   border-radius:4px;
    //   border:1px solid rgba(227,227,227,1);
    //   padding: 0 16px 8px 16px;
    //   margin-bottom: 16px;
    //   .title {
    //     height: 45px;
    //     border-bottom:1px solid rgba(227,227,227,1);
    //     margin-top: 2px;
    //     p {
    //       float: left;
    //       font-size:14px;
    //       font-weight:600;
    //       color:rgba(50,50,50,1);
    //       margin-top: 13px;
    //     }
    //     .el-radio-group {
    //       float: right;
    //       margin-top: 8px;
    //     }
    //   }
    // }
    // .compare {
    //   height:465px;
    //   border-radius:4px;
    //   border:1px solid rgba(227,227,227,1);
    //   padding: 0 15px 16px 16px;
    //   margin-bottom: 16px;
    //   .title {
    //     height: 45px;
    //     border-bottom:1px solid rgba(227,227,227,1);
    //     margin-top: 2px;
    //     margin-bottom: 16px;
    //     p {
    //       float: left;
    //       font-size:14px;
    //       font-weight:600;
    //       color:rgba(50,50,50,1);
    //       margin-top: 13px;
    //     }
    //     .el-radio-group {
    //       float: right;
    //       margin-top: 8px;
    //     }
    //   }
    //   .el-table {
    //     &::before {
    //       height: 0;
    //     }
    //     th {
    //       padding: 0 30px;
    //       height: 35px;
    //       border: none;
    //       background:rgba(240,240,240,1);
    //       .cell {
    //         font-size:12px;
    //         font-weight:400;
    //         text-align: right;
    //         color:rgba(50,50,50,1);
    //       }
    //     }
    //     td {
    //       border: none;
    //       padding: 0 38px;
    //       height: 35px;
    //       .cell {
    //         font-size:12px;
    //         font-weight:400;
    //         height: 35px;
    //         line-height: 35px;
    //         text-align: right;
    //         color:rgba(0,0,0,1);
    //       }
    //     }
    //     tr:nth-child(even) {
    //       background:rgba(248,248,248,1);
    //     }
    //   }
    //
  }
  .trend-autocomplete {
    li {
      padding: 5px 0;
      &:hover {
        color: #ffb148;
      }
    }
  }
</style>
