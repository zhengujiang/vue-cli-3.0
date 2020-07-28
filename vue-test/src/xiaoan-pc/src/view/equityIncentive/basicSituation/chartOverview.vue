<template>
  <div id="chartOverview">
    <div class="content data">
      <div class="first">
        <div class="header">
          <span>本公司三年财务数据分析</span>
          <el-radio-group v-model="radioChart" size="mini" style="margin-top: 11px;">
            <el-radio-button label="1" @click.native.prevent="toData">数据概览</el-radio-button>
            <el-radio-button label="2" @click.native.prevent="toChart">图表概览</el-radio-button>
          </el-radio-group>
        </div>
        <div class="image">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="营业收入" name="first">
              Echart
            </el-tab-pane>
            <el-tab-pane label="归母净利润" name="second"></el-tab-pane>
            <el-tab-pane label="扣非归母净利润" name="third"></el-tab-pane>
            <el-tab-pane label="每股收益" name="fourth"></el-tab-pane>
            <el-tab-pane label="加权平均净资产收益率" name="fifth"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="three">
        <div class="title">
          <span>董监高薪酬水平</span>
          <div class="right">
            <el-button type="primary" size="mini" @click="setCompare = true">可比公司设置</el-button>
            <el-radio-group v-model="radioChart" size="mini" style="margin-top: 11px;">
              <el-radio-button label="1" @click.native.prevent="toData">数据概览</el-radio-button>
              <el-radio-button label="2" @click.native.prevent="toChart">图表概览</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="image">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="贝肯能源" name="first">
              Echart
            </el-tab-pane>
            <el-tab-pane label="其他公司" name="second"></el-tab-pane>
            <el-tab-pane label="其他公司 copy" name="third"></el-tab-pane>
            <el-tab-pane label="其他公司 copy 2" name="fourth"></el-tab-pane>
            <el-tab-pane label="其他公司 copy 3" name="fifth"></el-tab-pane>
            <el-tab-pane label="其他公司 copy 4" name="sixth"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="four">
        <div class="title">
          <p>公司估值情况</p>
          <!-- <setCompare :setCompare="setCompare" ></setCompare> -->
          <div class="setCompare">
            <el-dialog title="可比公司设置" :visible.sync="setCompare" width="620px" center>
              <div class="left">
                <div class="leftHeader">
                  <span>上市公司</span>
                  <el-input placeholder="公司代码/公司简称" v-model="input" size="mini" class="elInput">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </div>
                <div class="leftBody">
                  <el-table :data="tableData8" style="width: 100%">
                    <el-table-column prop="code" width="69.5"></el-table-column>
                    <el-table-column prop="name" width="69.5"></el-table-column>
                    <el-table-column prop="address" width="69.5"></el-table-column>
                    <el-table-column label="操作" width="69.5" class="rightEdit">
                      <template slot-scope="scope">
                        <el-button
                          size="mini">添加
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="leftFooter">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :pager-count="3"
                    :total="100">
                  </el-pagination>
                </div>
              </div>
              <div class="right">
                <div class="rightHeader">
                  <span>已选可比公司</span>
                  <span class="number">(4/10)</span>
                </div>
                <div class="rightBody">
                  <el-table :data="tableData9" style="width: 100%">
                    <el-table-column prop="code" width="69.5"></el-table-column>
                    <el-table-column prop="name" width="69.5"></el-table-column>
                    <el-table-column prop="address" width="69.5"></el-table-column>
                    <el-table-column label="操作" width="69.5" class="rightEdit">
                      <template slot-scope="scope">
                        <el-button
                          size="mini">移除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                  <el-button @click="setCompare = false" class="noButton">取 消</el-button>
                  <el-button type="primary" @click="setCompare = false" class="yesButton">确 定</el-button>
                </span>
            </el-dialog>
          </div>
          <el-button type="primary" size="mini" @click="setCompare = true">可比公司设置</el-button>
        </div>
        <div class="image">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="贝肯能源" name="first">
              Echart
            </el-tab-pane>
            <el-tab-pane label="其他公司" name="second"></el-tab-pane>
            <el-tab-pane label="其他公司 copy" name="third"></el-tab-pane>
            <el-tab-pane label="其他公司 copy 2" name="fourth"></el-tab-pane>
            <el-tab-pane label="其他公司 copy 3" name="fifth"></el-tab-pane>
            <el-tab-pane label="其他公司 copy 4" name="sixth"></el-tab-pane>
          </el-tabs>
        </div>
        <p class="conclusion">结论：文字描述的假字填充文述的假字填充文述的假字填充文字描述的假字填</p>
      </div>
    </div>
    <div class="content">
      <div class="connectUs">
        <el-dialog title="联系我们" :visible.sync="connectUs" width="620px" center>
          <span class="content" style="display:block;text-indent:0;">尊敬的用户，您已申请股权激励服务咨询，专业股权激励团队随后将会电话联系您。或者您也可以致电： 021-20740322。</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="connectUs = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="bottom">
        <p>信公股权激励团队为您提供专业的股权激励方案若需要专业股权激励团队请联系我们</p>
        <p>设计股权激励方案/制定实施流程及时间表/协助内部沟通/准备公告文件及报备材料/实施过程的咨询辅导</p>
        <el-button type="primary" size="small" @click="connectUs = true">联系我们</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import setCompare from '../basicSituation/components/setCompare.vue'
  export default {
    name: "chartOverview",
    components: {
      setCompare
    },
    data() {
      return {
        setCompare: false,
        connectUs: false,
        activeName: 'first',
        tableData: [
          {
            name: '平均水平(万元)',
            income: '99,999,999',
            netMargin: '567,987',
            nonReturn: '9,999',
            profit: '89',
            rate: '9.32%'
          },
          {
            name: '平均增长率', income: '78.76%', netMargin: '567,987', nonReturn: '78.76%', profit: '78.76%', rate: '78.76%'
          },
          {
            name: '复合增长率', income: '78.76%', netMargin: '567,987', nonReturn: '78.76%', profit: '78.76%', rate: '78.76%'
          }
        ],
        radio: '1',
        radioChart: '2',
        tableData1: [
          {
            name: '可比公司均值',
            level: '9,999,999',
            averageRate: '34.23%',
            compoundRate: '34.23%',
            quantile25: '999.99',
            quantile50: '999.99',
            quantile75: '999.99'
          },
          {
            name: '证监会分类均值',
            level: '9,999,999',
            averageRate: '34.23%',
            compoundRate: '34.23%',
            quantile25: '999.99',
            quantile50: '999.99',
            quantile75: '999.99'
          },
          {
            name: '申万行业均值',
            level: '9,999,999',
            averageRate: '34.23%',
            compoundRate: '34.23%',
            quantile25: '999.99',
            quantile50: '999.99',
            quantile75: '999.99'
          }
        ],
        tableData2: [
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          }
        ],
        tableData3: [
          {
            beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          }
        ],
        input: '',
        value: '2019.02.28',
        options: [],
        tableData4: [
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          }
        ],
        tableData5: [
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          }
        ],
        tableData6: [
          {
            code: '000001',
            name: '平安银行',
            model: '股票期权',
            announcementDay: '2019.03.05',
            source: '定向发行15000万股(占总股本的13.90%)',
            object: '本次首次授予的激励对象人数共209人；占2017年末员工总人数的20.33%； 董监高人数合计6人，占激励对象总人数的2.87%',
            locking: '分3期行权，每期行权比例为40%、30%、30',
            amortizationCost: '预计摊销4年，总成本合计1,233,333万元'
          },
          {
            code: '000001',
            name: '平安银行',
            model: '股票期权',
            announcementDay: '2019.03.05',
            source: '定向发行15000万股(占总股本的13.90%)',
            object: '本次首次授予的激励对象人数共209人；占2017年末员工总人数的20.33%； 董监高人数合计6人，占激励对象总人数的2.87%',
            locking: '分3期行权，每期行权比例为40%、30%、30',
            amortizationCost: '预计摊销4年，总成本合计1,233,333万元'
          },
          {
            code: '000001',
            name: '平安银行',
            model: '股票期权',
            announcementDay: '2019.03.05',
            source: '定向发行15000万股(占总股本的13.90%)',
            object: '本次首次授予的激励对象人数共209人；占2017年末员工总人数的20.33%； 董监高人数合计6人，占激励对象总人数的2.87%',
            locking: '分3期行权，每期行权比例为40%、30%、30',
            amortizationCost: '预计摊销4年，总成本合计1,233,333万元'
          }
        ],
        tableData7: [
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告公告名称公告名公告名称公告名称称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告公告名称公告名称公告公告名称名称公告名称公告名称公告名称公告名称公告名称公告公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告名称公告名称称公告名告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告名称公告名称称公告名告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告名称公告名称称公告名告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          }
        ],
        tableData8: [
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          }
        ],
        tableData9: [
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          }
        ]
      }
    },
    methods: {
      toData() {
        this.$router.push({path: '/equityIncentive/basicSituation'})
      },
      toChart() {
        this.$router.push({path: '/equityIncentive/chartOverview'})
      },
      showMessage(data) {
        this.setCompare = false
      },
      handleClick() {

      }
    }
  }
</script>

<style lang="scss">
  #chartOverview {
    padding: 16px 0 40px;
    .data {
      .first {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .header {
          height: 46px;
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 46px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          .el-radio-group {
            height: 24px;
            /*font-size: 12px;*/
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: white;
            line-height: 8px;
            .el-radio-button__inner {
              height: 24px;
              line-height: 8px;
            }
          }
        }
        .image {
          height: 300px;
        }
      }
      .three {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .title {
          height: 46px;
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 46px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          .right {
            display: flex;
            justify-content: space-between;
            .el-button {
              height: 24px;
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: white;
              line-height: 8px;
              margin-top: 11px;
              margin-right: 16px;
            }
            .el-radio-group {
              height: 24px;
              // font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: white;
              line-height: 8px;
              .el-radio-button__inner {
                height: 24px;
                line-height: 8px;
              }
            }
          }
        }
        .image {
          height: 287px;
        }
      }
      .four {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .title {
          height: 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
          p {
            font-size: 14px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(50, 50, 50, 1);
            line-height: 20px;
          }
          .el-button {
            height: 24px;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 8px;
          }
        }
        .image {
          height: 300px;
        }
        .conclusion {
          width: 762px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(95, 95, 95, 1);
          line-height: 17px;
        }
        .setCompare {
          .el-dialog {
            height: 618px;
            .el-dialog__header {
              border-bottom: 1px solid rgba(227, 227, 227, 1);
              height: 50px;
              padding-top: 14px;
              span {
                width: 96px;
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(255, 177, 72, 1);
                line-height: 22px;
              }
            }
            .el-dialog__body {
              height: 498px;
              padding: 0;
              .left {
                float: left;
                width: 44.838%;
                height: 488px;
                margin-left: 16px;
                .leftHeader {
                  display: flex;
                  justify-content: space-between;
                  width: 100%;
                  height: 59px;
                  box-sizing: border-box;
                  padding: 23px 0px 12px;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                  span {
                    width: 56px;
                    height: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Semibold;
                    font-weight: 600;
                    color: rgba(50, 50, 50, 1);
                    line-height: 20px;
                  }
                  .elInput {
                    width: 186px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    border: 1px solid rgba(255, 224, 182, 1);
                    .el-input__inner {
                      height: 24px;
                      padding: 0;
                      padding-left: 10px;
                      padding-top: 3px;
                      border: 1px solid rgba(255, 224, 182, 1);
                    }
                    .el-input-group__append {
                      width: 48px;
                      height: 22px;
                      background: rgba(255, 177, 72, 1);
                      border-radius: 0px 3px 3px 0px;
                      border-color: rgba(255, 224, 182, 1);
                      .el-icon-search {
                        color: #ffffff;
                      }
                    }
                  }
                }
                .leftBody {
                  width: 100%;
                  height: 360px;
                  padding-top: 7px;
                  .el-table__body tr,
                  .el-table__body td {
                    padding: 0;
                    padding-top: 11px;
                    height: 36px;
                  }
                  .el-table {
                    .el-table__header {
                      display: none;
                    }
                    .el-table__body {
                      tr {
                        td:nth-child(4) {
                          text-align: right;
                        }
                      }
                      .el-button {
                        width: 48px;
                        height: 24px;
                        background: rgba(255, 240, 219, 1);
                        border-radius: 4px;
                        border: 1px solid rgba(255, 177, 72, 1);
                        padding: 2px 10px;
                        span {
                          width: 28px;
                          height: 20px;
                          font-size: 14px;
                          font-family: PingFangSC-Regular;
                          font-weight: 400;
                          color: rgba(255, 177, 72, 1);
                          line-height: 20px;
                          margin: 0;
                        }
                      }
                      .cell {
                        width: 69px;
                        margin: 0;
                        padding: 0;
                        font-size: 14px;
                        font-family: PingFangSC-Regular;
                        font-weight: 400;
                        color: rgba(84, 84, 84, 1);
                        line-height: 20px;
                      }
                    }
                  }
                }
                .leftFooter {
                  width: 100%;
                  height: 78px;
                  margin: 35px 0px 24px;
                  .el-pagination {
                    .btn-prev,
                    .number,
                    .el-icon.more.btn-quicknext.el-icon-more,
                    .btn-next {
                      border: 1px solid #E3E3E3;
                      background-color: #fff;
                    }
                    .number.active {
                      background: #FFB148;
                    }
                  }
                }
              }
              .right {
                float: left;
                width: 50%;
                height: 488px;
                margin-left: 16px;
                .rightHeader {
                  width: 100%;
                  height: 59px;
                  box-sizing: border-box;
                  padding: 23px 0px 12px;
                  margin-left: 15px;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                  span {
                    width: 84px;
                    height: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Semibold;
                    font-weight: 600;
                    color: rgba(50, 50, 50, 1);
                    line-height: 20px;
                  }
                  .number {
                    width: 39px;
                    height: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(84, 84, 84, 1);
                    line-height: 20px;
                    margin-left: 4px;
                  }
                }
                .rightBody {
                  width: 100%;
                  height: 360px;
                  padding-left: 15px;
                  margin-top: 11px;
                  border-left: 1px solid rgba(0, 0, 0, 0.08);
                  .el-table__body tr,
                  .el-table__body td {
                    padding: 0;
                    height: 36px;
                  }
                  .el-table {
                    .el-table__header {
                      display: none;
                    }
                    .el-table__body {
                      tr {
                        td:nth-child(4) {
                          text-align: right;
                        }
                      }
                      .el-button {
                        width: 48px;
                        height: 24px;
                        background: rgba(255, 240, 219, 1);
                        border-radius: 4px;
                        border: 1px solid rgba(255, 177, 72, 1);
                        padding: 2px 10px;
                        span {
                          width: 28px;
                          height: 20px;
                          font-size: 14px;
                          font-family: PingFangSC-Regular;
                          font-weight: 400;
                          color: rgba(255, 177, 72, 1);
                          line-height: 20px;
                          margin: 0;
                        }
                      }
                      .cell {
                        width: 69px;
                        margin: 0;
                        padding: 0;
                        font-size: 14px;
                        font-family: PingFangSC-Regular;
                        font-weight: 400;
                        color: rgba(84, 84, 84, 1);
                        line-height: 20px;
                      }
                    }
                  }
                  .el-table::before {
                    height: 0;
                  }
                }
              }
            }
            .dialog-footer {
              margin-bottom: 8px;
              .noButton {
                width: 110px;
                height: 35px;
                background: rgba(255, 240, 219, 1);
                border-radius: 4px;
                border: 1px solid rgba(255, 177, 72, 1);
                padding: 7px 33px 6px;
                span {
                  width: 44px;
                  height: 22px;
                  font-size: 16px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: rgba(255, 177, 72, 1);
                  line-height: 22px;
                }
              }
            }
            .yesButton {
              width: 110px;
              height: 35px;
              background: rgba(255, 177, 72, 1);
              border-radius: 4px;
              padding: 7px 33px 6px;
              span {
                width: 44px;
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
                line-height: 22px;
              }
            }
            span {
              width: 96px;
              height: 22px;
              font-size: 16px;
              font-family: PingFangSC-Semibold;
              font-weight: 600;
              color: rgba(255, 177, 72, 1);
              line-height: 22px;
            }
          }
        }
      }
    }
    .bottom {
      height: 233px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      text-align: center;
      padding: 0 16px;
      p:first-of-type {
        font-size: 20px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 28px;
        text-align: center;
        padding: 50px 370px 0;
      }
      p:last-of-type {
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        text-align: center;
        margin: 11px 0 29px;
      }
      .el-button {
        width: 196px;
      }
    }
     .connectUs {
      .el-dialog {
        .el-dialog__header {
          border-bottom: 1px solid rgba(227, 227, 227, 1);
        }
        .dialog-footer {
          .el-button {
            width: 200px;
            height: 35px;
            background: rgba(255, 177, 72, 1);
            border-radius: 4px;
            padding-top: 7px;
            padding-bottom: 6px;
            span {
              width: 32px;
              height: 22px;
              font-size: 16px;
              font-family: PingFangSC-Semibold;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
              line-height: 14px;
            }
          }
        }
        span {
          width: 96px;
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(255, 177, 72, 1);
          line-height: 22px;
        }
        .content {
          width: 565px;
          height: 44px;
          font-size: 16px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(50, 50, 50, 1);
          line-height: 22px;
        }
      }
    }
  }
</style>

