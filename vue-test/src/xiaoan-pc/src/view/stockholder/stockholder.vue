<template>
  <div id="stockholder">
    <el-collapse-transition>
      <div class="menu-content vxa-image-stockholder-bg-menubg" v-if="showMenu">
        <ul class="content">
          <li @click="reportHolder" class="export vxa-hover">
            <img :src="menuList[0].img">
            <span class="vxa-hover">{{menuList[0].name}}</span>
          </li>
          <li class="vxa-hover" v-for="(item,index) in menuList" :key="index" :class="{'active':item.active}"
              v-if="index>0"
              @click="handleMenu(item, index)">
            <img :src="item.img">
            <span class="vxa-hover">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </el-collapse-transition>
    <router-view></router-view>
    <el-dialog class="recordDateCheckDialog" top="35vh" :before-close="beforeCloseDig" width="620px" title="小安提示"
               :visible.sync="exportData"
               append-to-body>
      <div class="progress-log">
        <div class="message">请至少导入两期完整数据</div>
        <div class="center" style="padding-top: 10px">
          <el-button style="width: 150px" size="small" type="primary" @click="exportRollOfficialClick(-1,false)">立即导入
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog top="35vh" class="dialogStockHolder exportRollOfficialDig" :visible.sync="exportRollOfficialDig"
               width="620px" :show-close="true" :close-on-click-modal="false" center
               :title="'导出股东行为分析报告'">
      <!---->
      <div class="progress-log" v-loading="dateLoading">
        <!-- <div class="message" style="color: #8d8d8d;padding: 0 0 10px 0;font-size:14px;">导出数据需要一些时间，请耐心等待！</div> -->
        <div class="officialDig-box">
          <div class="col title">选择期数:</div>
          <div class="col">
            <el-checkbox-group @change="checkboxChange" class="checkbox-group" v-model="checkListRecord">
              <el-checkbox :key="index" v-for="(item ,index) in recordDate" :label="item">{{item}}期</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="officialDig-box">
          <div class="col title">分析范围:</div>
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
      <el-dialog top="35vh" :before-close="beforeCloseDig" width="620px" :title="'导出股东行为分析报告'"
                 :visible.sync="doneDownProgress"
                 append-to-body>
        <div class="progress-log">
          <div class="message">导出数据需要一些时间，请耐心等待！</div>
          <vxa-progress v-model="uploadAnalysis" :animation="false" :height="12" :width="'100%'"></vxa-progress>
        </div>
      </el-dialog>
      <!---->
      <el-dialog top="35vh" :close-on-click-modal="false" :show-close="false" width="620px"
                 :title="'导出股东行为分析报告'"
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
                 :title="'导出股东行为分析报告'"
                 :visible.sync="doneDown" append-to-body>
        <div class="message" style="text-align: center;">导出完成！</div>
        <div class="center top20" style="padding-top: 20px">
          <el-button style="width: 150px" @click="exportRollOfficialClick(4,true)" type="primary" class="check-btn">确认
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <el-dialog class="recordDateCheckDialog" title="小安提示" :visible.sync="recordDateCheckShow" width="620px" center
               top="28vh">
      <div class="message">{{recordDateCheckTip}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goExport" size="small">立即导入</el-button>
      </span>
    </el-dialog>
    <el-dialog class="recordDateCheckDialog" title="企业版本专享功能" :visible.sync="authDialog" width="620px" center
               top="28vh">
      <div class="message">该功能为企业版用户专享功能，前往查看企业版专享功能吧！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goEnterprise">查看企业版</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog class="recordDateCheckDialog" title="小安提示" :visible.sync="messageDialog" width="620px" center top="28vh">
      <div class="message">{{contentInfo}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goExport">确定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        authDialog: false,
        recordDateCheckShow: false,
        recordDateCheckTip: '当前没有导入完整数据，请至少导入一期完整数据',
        exportRollOfficialDig: false,
        doneDownProgress: false,
        doneDownClear: false,
        doneDown: false,
        exportData: false,
        messageDialog: false,
        contentInfo: '',
        checkBoxNumOption: [
          {name: '前50', value: '50', disabled: true, checked: false},
          {name: '前100', value: '100', disabled: true, checked: false},
          {name: '前200', value: '200', disabled: true, checked: false},
          {name: '前500', value: '500', disabled: true, checked: false}
        ],
        checkListRecord: [],
        checkedNum: '200',
        dateLoading: false,
        uploadAnalysis: 0,
        showMenu: true,
        activeName: 'main',
        isRouteLink: 0,
        recordDate: [],
        menuList: [
          {
            name: '导出分析报告',
            tabName: 'stockholder',
            active: false,
            link: '/stockholder',
            isLink: false,
            type: 'down',
            needDateCount: 2,
            img: this.$image.stockholder.menu1
          },
          {
            name: '最新股东分析',
            tabName: 'newStockholderAnalysis',
            active: false,
            link: '/stockholder/importantStock',
            isLink: false,
            type: 'new',
            needDateCount: 1,
            img: this.$image.stockholder.menu2
          },
          {
            name: '股东对比分析',
            tabName: 'comparisonAnalysis',
            active: false,
            isLink: false,
            type: 'comparison',
            needDateCount: 2,
            link: '/stockholder/stockholderComparison',
            img: this.$image.stockholder.menu3
          },
          {
            name: '股东趋势分析',
            tabName: 'trendAnalysis',
            active: false,
            type: 'other',
            isLink: false,
            needDateCount: 0,
            link: '/stockholder/trendAnalysis',
            img: this.$image.stockholder.menu4
          },
          {
            name: '股东信息检索',
            tabName: 'informationRetrieval',
            active: false,
            type: 'search',
            isLink: false,
            needDateCount: 1,
            link: '/stockholder/historyStockholder',
            img: this.$image.stockholder.menu5
          },
          {
            name: '股东数据管理',
            tabName: 'dataManage',
            active: true,
            type: 'stockholder',
            isLink: true,
            needDateCount: 0,
            link: '/stockholder/rosterExport',
            img: this.$image.stockholder.menu6
          }
        ],
        code: 0,
        exportRollOfficialFileName: ''
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      $route: function (route) {
        this.getLastedRecordDate();
        this.menuLoad()
      },
      uploadAnalysis: function (val) {
        if (val >= 72) {
          clearInterval(window.exportRoll);
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
//      if (!this.userInfo.selectAgreeMent) {
//        this.showDialog = true
//      }
      this.getLastedRecordDate();
      this.menuLoad()
      console.log('3333333');
    },
    mounted() {
      // 获取当天的日期
      // let day = (new Date()).getDate();
      // // 获取当前月最大天数，即月末
      // let year = (new Date()).getFullYear(),
      //     month = (new Date()).getMonth() + 1,
      //     lastDay = (new Date(year, month, 0)).getDate();
      // let data = JSON.parse(localStorage.getItem('stockHolderNum'));
      // console.log(this.$route);
      // let path = this.$route.path;
      // if (path != '/stockholder/viewShareholder' && path != '/stockholder/institutionAccountInfo') {
      //   if (!data) {
      //     localStorage.setItem('stockHolderNum', JSON.stringify({num: 1, date: `${year}-${month}-${day}`}));
      //     data = {num: 1, date: `${year}-${month}-${day}`};
      //   }
      //   if (day == '10' || day == '20' || day == lastDay) {
      //     if (data.num == 1 && data.date == `${year}-${month}-${day}`) {
      //       this.messageDialog = true;
      //       this.contentInfo = '股东名册下载好了吗？分析工作交给小安就行！';
      //       localStorage.setItem('stockHolderNum', JSON.stringify({num: 2, date: `${year}-${month}-${day}`}));
      //     } else if (data.num == 2 && data.date == `${year}-${month}-${day}`) {
      //       this.messageDialog = true;
      //       this.contentInfo = '股东名册内容太多不好处理？让小安来搞定！';
      //       localStorage.setItem('stockHolderNum', JSON.stringify({num: 3, date: `${year}-${month}-${day}`}));
      //     } else if (data.num == 3 && data.date == `${year}-${month}-${day}`) {
      //       this.messageDialog = true;
      //       this.contentInfo = '想拿到全面的股东行为分析报告？快来找小安吧！';
      //       localStorage.setItem('stockHolderNum', JSON.stringify({num: 4, date: `${year}-${month}-${day}`}));
      //     } else if (data.date != `${year}-${month}-${day}`) {
      //       this.messageDialog = true;
      //       this.contentInfo = '股东名册下载好了吗？分析工作交给小安就行！';
      //       localStorage.setItem('stockHolderNum', JSON.stringify({num: 2, date: `${year}-${month}-${day}`}));
      //     }
      //   }
      // }
    },
    // 方法
    methods: {
      goEnterprise() {
        this.authDialog = false
        this.$router.push('/manage/purchase')
      },
      radioGroupChange() {

      },
      checkboxChange(val) {
        if (val.length > 2) {
          val.shift();
        }
        this.getHolderComparisonChooseDate();
      },
      goExport() {
        this.messageDialog = false
        this.recordDateCheckShow = false
        this.$router.push('/stockholder/rosterExport');
      },
      exportRollOfficialClick(type, bool) {
        switch (type) {
          case -1:
            this.exportData = false;
            this.$router.push('/stockholder/rosterExport');
            break;
          case 0:
            if (bool) {
              if (this.checkListRecord.length < 2) {
                this.$message({showClose: true, type: 'warning', duration: 3000, message: '请至少勾选两期名册'});
                return false
              }
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
      getUseStockCode() {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.gxfApi.getUseStockCode(params).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.code = res.data.returnObject.code;
          }
        })
      },
      exportRollOfficial() {
        let dates = [];
        this.checkListRecord.forEach(item => {
          dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
        })
        let time = dates.map(e => {
          return this.$common.transTime(e)[1]
        })
        time = time.sort();
        let params = {
          code: this.code,
          reports: dates.join(','),
          recordDate: time[1],
          oldRecodeDate: time[0],
          analysisRange: this.checkedNum,
          userId: this.$cookie.get('userId')
        }
        this.$axios.gxfApi.generateHolderAnalysisReport(params).then(res => {
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
      reportHolder() {
        if (!this.userInfo.enterpriseUser) {
          this.authDialog = true
          return false
        }
        this.$axios.gxfApi.getLastedRecordDate({userId: this.userId}).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.recordDate = res.data.returnObject
            if (this.recordDate.length < 2) {
              this.exportData = true;
            } else {
              // this.recordDate.reverse();
              this.exportRollOfficialDig = true;
              this.checkListRecord = this.recordDate.slice(0, 2);
              this.getHolderComparisonChooseDate();
              this.getUseStockCode();
            }
          }
        })

      },
      getHolderComparisonChooseDate() {
        this.dateLoading = true;
        let dates = [];
        this.checkListRecord.forEach(item => {
          dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
        })
        let params = {
          recordDates: dates.join(','),
          userId: this.$cookie.get('userId')
        }
        this.$axios.gxfApi.getHolderComparisonChooseDate(params).then((res) => {
          this.dateLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let number = res.data.returnObject;
            this.checkBoxNumOption.forEach(checkbox => {
              checkbox.disabled = true;
            })
            number.forEach(item => {
              this.checkBoxNumOption.forEach(checkbox => {
                if (item == checkbox.value) {
                  checkbox.disabled = false;
                }
              })
            })
            number[number.length - 1] >= 200 ? this.checkedNum = '200' : this.checkedNum = `${number[number.length - 1]}`;
          }
        }).catch(err => {
          this.dateLoading = false;
        })
      },
      getLastedRecordDate() {
        let params = {userId: this.$cookie.get('userId')};
        this.dateLoading = true;
        this.$axios.gxfApi.getLastedRecordDate(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.dateLoading = false;
            this.recordDate = res.data.returnObject;
            this.$store.commit('shareholderDates', this.recordDate);

            let needDateCount = this.$route.meta.needDateCount
            if (needDateCount == undefined) {
              needDateCount = 1
            }
            if (this.recordDate.length < needDateCount) {
              if (needDateCount == 2) {
                // this.$message({showClose: true, type: 'error', duration: 3000, message: '请至少导入二期完整数据'})
                // this.recordDateCheckShow = true
                this.recordDateCheckTip = '请至少导入两期完整数据'
              } else {
                // this.$message({showClose: true, type: 'error', duration: 3000, message: '当前没有导入完整数据，请至少导入一期完整数据'})
                // this.recordDateCheckShow = true
                this.recordDateCheckTip = '当前没有导入完整数据，请至少导入一期完整数据'
              }
              if (this.userInfo.selectAgreeMent) {
                this.recordDateCheckShow = true
              }

              if (this.$route.name != 'rosterExport') {
                this.$router.push('/stockholder/rosterExport');
              }
            }
          }
        }).catch((err) => {
          this.dateLoading = false;
          if (this.$route.name != 'rosterExport') {
            this.$router.push('/stockholder/rosterExport');
          }
        })
      },
      beforeCloseDig() {
        this.doneDownClear = true;
        this.exportData = false
      },
      //
      // getUserUploadRecord() {
      //   let params = {userId: this.$cookie.get('userId')}
      //   this.$axios.gxfApi.getUserUploadRecord(params).then(res => {
      //     if (res.data.returnCode == 200 || res.data.returnCode == 1) {
      //       let tableData = res.data.returnObject;
      //       if (tableData == null) {
      //         tableData = [];
      //       }
      //       this.isRouteLink = tableData.length
      //       if (tableData == [] || tableData.length == 0) {
      //         // 没有数据
      //         this.isRouteLink = 0;
      //         console.log(this.$router);
      //         this.$router.push({path: '/stockholder/rosterExport'});
      //       } else if (tableData.length >= 2) {
      //         // 有多组数据
      //         this.isRouteLink = 2;
      //
      //       } else if (tableData.length < 2) {
      //         // 最多只有一组数据
      //         this.isRouteLink = 1;
      //       }
      //     }
      //   }).catch(err => {
      //     this.tableLoading = false;
      //   })
      // },
      //
      menuLoad() {
        if (this.$route.meta.showMenu == 'hide') {
          this.showMenu = false
        } else {
          this.showMenu = true
        }
        let tabName = this.$route.meta.tabName
        this.menuList.forEach((item, index) => {
          if (item.tabName == tabName) {
            item.active = true
          } else {
            item.active = false
          }
        })
      },
      //
      handleMenu(item, index) {
        if (item.tabName != 'trendAnalysis' && !this.userInfo.enterpriseUser) {
          this.authDialog = true
          return false
        }
        this.$axios.gxfApi.getLastedRecordDate({userId: this.userId}).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.recordDate = res.data.returnObject

            if (this.recordDate.length >= item.needDateCount) {
              this.$router.push(item.link);
              this.menuList.forEach((item2, index2) => {
                if (index2 == index) {
                  this.$set(this.menuList[index2], 'active', true)
                } else {
                  this.$set(this.menuList[index2], 'active', false)
                }
              });
            } else {
              if (item.needDateCount == 2) {
                this.recordDateCheckShow = true
                this.recordDateCheckTip = '请至少导入两期完整数据'
              } else {
                this.recordDateCheckShow = true
                this.recordDateCheckTip = '当前没有导入完整数据，请至少导入一期完整数据'
              }
//              if (this.userInfo.selectAgreeMent) {
//                this.recordDateCheckShow = true
//              }
              // this.$message({showClose: true, type: 'error', duration: 3000, message: '请先导入数据'});
              /* if (item.tabName != 'dataManage') {
                this.$router.push('/stockholder/rosterExport');
              } */
            }
          }
        })

//        this.$router.push(item.link);
//        this.menuList.forEach((item2, index2) => {
//          if (index2 == index) {
//            this.$set(this.menuList[index2], 'active', true)
//          } else {
//            this.$set(this.menuList[index2], 'active', false)
//          }
//        });
        //
        // 没导入数据时 拦截
        switch (this.menuList[index].type) {
          case 'stockholder':
            this.$router.push(item.link);
            break;
          case 'other':
            break;
          case 'down':
            break;
          case 'search':
            break;
          case 'comparison':
            break;
          case 'new':
            break;
        }
      }
    }
  }
</script>

<style lang="scss">
  #stockholder {
    padding-bottom: 20px;
    .progress-log {
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
      .el-checkbox {
        margin-right: 30px;
        margin-bottom: 10px;
      }
    }
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
    .menu-content {
      height: 100px;
      ul {
        height: 100px;
        .export {
          width: 276px;
          background: rgba(84, 84, 84, 1);
          margin-left: 50px;
        }
        li {
          float: left;
          width: 105px;
          height: 100%;
          margin: 0 30px;
          text-align: center;
          cursor: pointer;
          img {
            margin-top: 14px;
            margin-bottom: 8px;
          }
          span {
            display: block;
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
          &:hover, &.active {
            background-color: #363535;
            span {
              color: #ffb148;
            }
          }
        }

      }

    }
    .el-card__header {
      padding: 0;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      font-weight: 600;
    }
    .el-card__body {
      padding: 16px 0;
    }
    .el-table {
      .el-table__row {
        transition: all .3s;
      }
    }
    .el-table th {
      padding: 3px 0;
      background-color: #F0F0F0;
      font-size: 12px;
      font-weight: normal;
    }
    .el-table td {
      vertical-align: middle;
      font-size: 12px;
      transition: all .3s;
      border-bottom: 0;
    }
    .b148 {
      color: #ffb148;
    }
  }
  .dialogStockHolder {
    .top20 {
      margin-top: 10px;
    }
    .el-dialog__header {
      font-size: 16px;
      color: #FFB148;
      padding: 15px 0;
      border-bottom: 1px solid #eaeaea;
      .el-dialog__title {
        color: #FFB148 !important;
      }
      .el-dialog__headerbtn {
        top: 15px;
        right: 10px;
        font-weight: 800;
      }
    }
    .el-dialog__body {
      padding: 16px;
      .message {
        text-align: left;
        font-size: 16px;
        padding: 20px 0
      }
      .progress-log {
        .log-warning {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          line-height: 17px;
        }
      }
    }
    .xieye-content {
      height: 400px;
      overflow-y: auto;
      border-bottom: 1px solid #e3e3e3;
    }
    .check-btn {
      width: 200px;
    }
  }
  .dialogXieye {
    .el-dialog__body {
      padding: 0 0 16px 20px;
    }
  }
  .recordDateCheckDialog {
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
</style>
