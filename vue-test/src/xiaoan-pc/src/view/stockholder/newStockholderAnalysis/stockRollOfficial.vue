<template>
  <div id="rosterViewShareholder">
    <div class="vxa-container">
      <el-row :gutter="20">
        <el-col :span="18" v-loading="listLoading">
          <div class="check-container">
            <div class="col left">
              <el-input clearable size="small" @keyup.13.native="searchInfo" placeholder="搜索股东名称"
                        v-model="shareholderVal">
                <el-button slot="append" @click="searchInfo" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <div class="col vxa-is-right">
              <span class="holderTitle">股东性质</span>
              <el-select @change="holderChange" style="width: 140px" popper-class="shareholder" class="vxa-select-box" size="mini" v-model="holderSelect" placeholder="全部">
                <el-option
                  v-for="item in holderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button size="medium" type="primary" plain @click="addExportRollOfficial(1)">导出显示信息</el-button>
              <el-button size="medium" type="primary" @click="addExportRollOfficial(2)">导出完整信息</el-button>
            </div>
          </div>
          <!---->
          <div style="padding-top: 16px">
            <el-table ref="tableFocus" size="mini" @sort-change="sortChange" min-height="600" class="table-box-form"
                      :data="tableData" style="width: 100%;min-height: 600px;" stripe>
              <!---->
              <el-table-column header-align="center" prop="index" show-overflow-tooltip
                               label="序号" align="center" width="50px">
                <div slot-scope="scope" class="set-index">{{((page.index * page.size) - (page.size-1)) + scope.$index}}</div>
              </el-table-column>
              <el-table-column header-align="left" prop="possessorName" class-name="possessor-name"
                               label="股东名称" align="left" width="120px">
                <template slot-scope="scope">
                <el-tooltip :content="scope.row.possessorName" placement="top">
                  <router-link class="vxa-a-hover underline"
                               :to="'/stockholder/institutionAccountInfo?id='+scope.row.id" target="_blank">
                    {{scope.row.possessorName}}
                  </router-link>
                </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column header-align="center" prop="possessorType" show-overflow-tooltip
                               label="股东性质" align="center" width="140px">
                <div slot-scope="scope">
                  {{natureOption[scope.row.possessorType]}}
                </div>
                <!---->
              </el-table-column>
              <el-table-column header-align="right" sortable="custom" prop="possessorAmount" show-overflow-tooltip
                               label="持股数量(股)" align="right">
                <div slot-scope="scope" class="set-padding">
                  {{amountAbs(scope.row.possessorAmount)}}
                </div>
              </el-table-column>
              <el-table-column header-align="right" prop="possessorRatio" show-overflow-tooltip
                               label="持股比例(%)" align="right">
                <div slot-scope="scope">
                  {{scope.row.possessorRatio}}
                </div>
              </el-table-column>
              <el-table-column header-align="right" sortable="custom" prop="shareRestrictAmount" show-overflow-tooltip
                               label="限售股(股)" align="right">
                <div slot-scope="scope" class="set-padding">
                  {{amountAbs(scope.row.shareRestrictAmount)}}
                </div>
              </el-table-column>
              <el-table-column header-align="right" sortable="custom" prop="pledgeFreezeAmount" show-overflow-tooltip
                               label="质押/冻结(股)" align="right">
                <div slot-scope="scope" class="set-padding">
                  {{amountAbs(scope.row.pledgeFreezeAmount)}}
                </div>
              </el-table-column>
              <!--<el-table-column header-align="center" prop="messageAddress" class-name="message-address" label="地址"
                               align="right" width="100px">
              </el-table-column>-->
              <el-table-column header-align="left" :label-class-name="'adddb'" show-overflow-tooltip label="添加到投资者数据库"
                               align="center" width="85px">
                <template slot-scope="scope">
                  <a v-if="!scope.row.addInvestor" @click="addInvestorClick(scope)" class="text-primary scope_text"
                     href="javascript:">添加</a>
                  <a class="scope_text end_text" v-else href="javascript:">已添加</a>
                </template>
              </el-table-column>
            </el-table>
            <p class="vxa-prompt">*&nbsp;限售股：“--”表示该股东不持有限售股或因股东名册数据缺失无法匹配</p>
            <p class="vxa-prompt">*&nbsp;仅显示前1000名股东数据</p>
            <div class="vxa-flax-box">
              <div class="col t-left">
                <el-pagination class="pagination-new-box" @current-change="currentChange" :current-page="page.index"
                               :page-size="page.size"
                               layout="prev, pager, next" :total="page.total" background></el-pagination>
              </div>
              <div class="col t-right">
                <el-radio-group size="small" @change="pageSizeChange" v-model="page.size">
                  <el-radio-button :label="30">30条</el-radio-button>
                  <el-radio-button :label="50">50条</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
          <!---->
        </el-col>
        <el-col :span="6">
          <census-item :timeDate="timeDate" :type="type"></census-item>
          <named-item :timeDate="timeDate" :type="type"></named-item>
        </el-col>
      </el-row>
    </div>
    <!---->
    <el-dialog top="35vh" class="dialogStockHolder exportRollOfficialDig" :visible.sync="exportRollOfficialDig"
               width="620px" :show-close="true" :close-on-click-modal="false" center
               :title="exportRollOfficialDigTitle">
      <!---->
      <div class="progress-log">
        <div class="message" style="color: #8d8d8d;padding: 0 0 10px 0;font-size:14px;">导出数据需要一些时间，请耐心等待！</div>
        <div class="officialDig-box">
          <div class="col title">导出范围:</div>
          <div class="col">
            <el-radio-group v-model="checkedNum" @change="radioGroupChange">
              <el-radio :disabled="item.disabled" :label="item.value" :key="index"
                        v-for="(item,index) in checkBoxNumOption">{{item.name}}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="center" style="padding-top: 10px">
          <el-button style="width: 150px" size="small" type="primary" plain @click="exportRollOfficialClick(0,false)">取消
          </el-button>
          <el-button style="width: 150px" size="small" type="primary" @click="exportRollOfficialClick(0,true)">确认
          </el-button>
        </div>
      </div>
      <!---->
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
    </el-dialog>
  </div>
</template>

<script>
  import censusItem from './components/censusItem.vue'
  import namedItem from './components/namedItem.vue'
  export default {
    name: "rosterViewShareholder",
    components: {
      censusItem,
      namedItem
    },
    data() {
      return {
        radioOption: {
          '50': 50,
          '100': 100,
          '200': 200,
          '500': 500,
          '1000': 1000,
          '20': ''
        },
        firstTime: false,
        holderOptions: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '公募基金'
        }, {
          value: '2',
          label: '私募基金'
        }, {
          value: '3',
          label: '证券公司资管产品'
        }, {
          value: '4',
          label: '社保基金'
        }, {
          value: '5',
          label: 'QFII'
        }, {
          value: '6',
          label: 'RQFII'
        }, {
          value: '7',
          label: '汇金公司'
        }, {
          value: '8',
          label: '中证金'
        }, {
          value: '9',
          label: '香港结算公司'
        }, {
          value: '10',
          label: '一般机构或产品'
        }, {
          value: '11',
          label: '自然人'
        }],
        holderSelect: '0',
        //
        checkBoxNumOption: [
          {name: '前50', value: '50', disabled: false, checked: false},
          {name: '前100', value: '100', disabled: false, checked: false},
          {name: '前200', value: '200', disabled: false, checked: false},
          {name: '前500', value: '500', disabled: false, checked: false}
        ],
        checkedNum: '200',
        NextShowNum: '200',
        timeDate: 0,
        exportType: 1,
        exportRollOfficialDig: false,
        doneDownProgress: false,
        doneDownClear: false,
        doneDown: false,
        uploadAnalysis: 0,
        exportRollOfficialFileUrl: '',
        exportRollOfficialDigTitle: '导出显示信息',
        //
        shareholderVal: '',
        page: {
          size: 30,
          index: 1,
          total: 1000 // 总条目数
        },
        listLoading: true,
        type: 0,
        rowData: [],
        tableData: [],
        sortTable: {
          possessorAmount: '', // 持股数量排序：1 降序 2 升序
          shareRestrictAmount: '', // 限售股排序：1 降序 2 升序
          pledgeFreezeAmount: '',
          possessorRatio: ''
        },
        columnClickData: {},
        natureOption: this.$config.gxfType,
        exportRollOfficialFileName: ''
      }
    },
    created() {
      // this.page.index = 1;
      this.timeDate = this.$route.query.time;
      this.searchRollOfficial();
    },
    watch: {
      uploadAnalysis: function (val) {
        if (val >= 72) {
          clearInterval(window.exportRoll);
        }
      },
      $route: function (to) {
        console.log('123123', to.query.time);
        this.timeDate = to.query.time;
        this.$refs.tableFocus.clearSort();
        this.sortTable = {
          possessorAmount: '', // 持股数量排序：1 降序 2 升序
          shareRestrictAmount: '', // 限售股排序：1 降序 2 升序
          pledgeFreezeAmount: '',
          possessorRatio: ''
        };
        this.searchRollOfficial();
      }
    },
    mounted() {

    },
    computed: {
      //
      timeDateFun: function () {
        return this.$common.transTime(this.timeDate)[1]
      },
      //
      typeFun() {
        let title = '月度股东名册';
        switch (this.type) {
          case 2:
            title = '月度股东名册';
            break;
          case 1:
            title = '股东全名册';
            break
        }
        return title;
      }
    },
    methods: {
      searchInfo () {
        this.page.index = 1;
        this.searchRollOfficial();
      },
      holderChange() {
        this.$refs.tableFocus.clearSort();
        this.sortTable = {
          possessorAmount: '', // 持股数量排序：1 降序 2 升序
          shareRestrictAmount: '', // 限售股排序：1 降序 2 升序
          pledgeFreezeAmount: '',
          possessorRatio: ''
        };
        this.page.index = 1;
        this.searchRollOfficial();
      },
      addExportRollOfficial(type) {
        // done()
        this.exportType = type;
        this.exportRollOfficialDig = true;
        this.checkedNum = this.NextShowNum;
        switch (type) {
          case 1:
            this.exportRollOfficialDigTitle = '导出显示信息'
            break;
          case 2:
            this.exportRollOfficialDigTitle = '导出完整信息'
            break;
        }
      },
      beforeCloseDig() {
        this.doneDownClear = true;
      },
      //
      exportRollOfficialClick(type, bool) {
        switch (type) {
          case 0:
            if (bool) {
              //
              this.exportRollOfficialDig = bool;
              this.doneDownProgress = bool;
              this.exportRollOfficial();
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
      //
      exportRollOfficial() {
        let params = {
          userId: this.$cookie.get('userId'),
          recordDate: this.timeDate,
          count: this.radioOption[this.checkedNum],
          exportType: this.exportType
        };
        this.$axios.gxfApi.exportShareholderList(params).then(res => {
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
              //
              this.exportRollOfficialDig = false;
              this.doneDownProgress = false;
              this.doneDownClear = false;
              this.doneDown = false;
            }, 300);
          }
        })
      },
      //
      radioGroupChange(check) {
        // console.log(this.checkBoxNumOption);
        // this.checkBoxNumOption.forEach((e, i) => {
        //   // if (e.checked == check) {
        //   //   e.checked = true;
        //   // }
        // })
        // console.log(this.checkedNum);
        console.log(check);
      },
      addInvestorClick(scope) {
        console.log(scope);
        let params = {
          investorName: scope.row.possessorName,
          investType: scope.row.possessorType,
          shareholdingNum: scope.row.possessorAmount,
          contactAddress: scope.row.messageAddress,
          createUserId: this.$cookie.get('userId'),
          rollOfficialId: scope.row.id,
          onePasswordAccount: scope.row.onePasswordAccount,
          recordDate: scope.row.recordDate
        };
        this.addInvestor(params);
      },
      //
      addInvestor(params) {
        this.$axios.gxfApi.addInvestor(params).then(res => {
          if (res.data.returnCode == 200) {
            this.searchRollOfficial();
          }
        })
      },
      //
      pageSizeChange(val) {
        this.page.index = 1;
        this.page.size = val;
        this.searchRollOfficial();
      },
      //
      amountAbs(val) {
        if (val == null || val === '') {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      //
      // headerCellChange(column, event) {
      //   this.columnClickData = column;
      // },
      //
      sortChange(scope) {
        // this.columnClickData = scope;
        console.log(scope);
        console.log(3333);
        this.$nextTick(_ => {
          setTimeout(_ => {
            this.sortTable = {
              possessorAmount: '', // 持股数量排序：1 降序 2 升序
              shareRestrictAmount: '', // 限售股排序：1 降序 2 升序
              pledgeFreezeAmount: '',
              possessorRatio: ''
            };
            let sort = {
              'ascending': 2,
              'descending': 1,
              'null': ''
            };
            // let prop = scope.prop;
            // let order = scope.order;
            this.sortTable[scope.prop] = sort[scope.order];
            this.searchRollOfficial();
          })
        })
      },
      //
      searchRollOfficial() {
        this.listLoading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          keyWord: this.shareholderVal.trim(),
          possessorType: this.holderSelect == 0 ? '' : this.holderSelect, // 持有人类型
          recordDate: this.timeDate, //
          ratioOrderType: this.sortTable.possessorRatio, // 持股比例排序：1 降序 2 升序
          possessorOrderType: this.sortTable.possessorAmount, // 持股数量排序：1 降序 2 升序
          restrictOrderType: this.sortTable.shareRestrictAmount, // 限售股排序：1 降序 2 升序
          freezeOrderType: this.sortTable.pledgeFreezeAmount, // 质押/冻结 排序：1 降序 2 升序
          pageNum: this.page.index,
          pageSize: this.page.size
        };
        this.$axios.gxfApi.searchShareholderList(params).then(res => {
          this.listLoading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            console.log(res);
            this.page.total = res.data.total;
            if (!this.firstTime) {
              this.checkBoxNumOption.forEach((e, i) => {
                if (this.page.total < e.value) {
                  e.disabled = true;
                }
                if (this.page.total <= 50) {
                  this.checkedNum = '50';
                }
                if (this.page.total <= 100) {
                  this.checkedNum = '100';
                }
              })
              this.firstTime = true;
              this.NextShowNum = this.checkedNum;
            }
            console.log('234234234===>', this.page);
            let data = res.data.returnObject.data;
            data.forEach((item, index) => {
              if (!!!item.messageAddress) {
                item.messageAddress = '--'
              }
              if (item.shareRestrictAmount == null || item.shareRestrictAmount === 0 || item.shareRestrictAmount == '') {
                item.shareRestrictAmount = '--'
              }
              item.index = (this.page.index * this.page.size) - (this.page.size - 1) + index;
            });
            this.tableData = data;
          }
        }).catch(err => {
          this.listLoading = false;
        })
      },
      //
      currentChange(index) {
        console.log(index);
        this.page.index = index;
        this.$array.scrollToTop();
        this.searchRollOfficial();
      }
    }
  }
</script>

<style lang="scss" scoped>
  #rosterViewShareholder {
    .header-box {
      height: 100px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.09);
      .header {
        height: 100%;
        display: flex;
        align-items: center;
        .title {
          font-size: 20px;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
        }
        .time {
          color: #8D8D8D;
          font-size: 17px;
        }
      }
    }
    .vxa-container {
      transition: .3s all;
      padding-top: 16px;
      .check-container {
        width: 100%;
        display: flex;
        align-items: center;
        .col {
          flex: 1;
          &.left {
            flex: 0 0 330px;
          }
        }
      }
      .vxa-prompt {
        padding: 10px 0 0 0;
        font-size: 12px;
        font-weight: 400;
        color: rgba(141, 141, 141, 1);
      }
      .vxa-flax-box {
        padding: 20px 0 30px 0;
      }
    }
  }
</style>

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
  #rosterViewShareholder {
    .check-container {
      .holderTitle {
        font-size: 12px;
        color: #8D8D8D;
      }
      .el-input {
        input {
          // border-right-color: #FFB148;
        }
        .el-input-group__append {
          background-color: #FFB148;
          border-color: #FFB148;
          i {
            color: white;
            font-size: 16px;
          }
        }
      }
    }
    .table-box-form {
      &.el-table .cell {
        padding-right: 0;
        padding-left: 0;
      }
      .adddb {
        line-height: 1.5;
        padding: 0 10px;
      }
      .set-padding {
        padding-right: 8px;
      }
      .scope_text {
        text-decoration: underline;
        &.end_text {
          cursor: not-allowed;
          text-decoration: none;
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
        }
      }
      .message-address, .possessor-name {
        .cell {
          width: 120px;
          text-align: center;
          max-height: 46px;
          overflow : hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
