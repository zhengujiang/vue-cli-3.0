<template>
  <div id="myEquityIncentive">
    <div class="content main">
      <div class="title">
        <p><span class="name">姓名：张三某某 (共2期激励计划)</span><span class="idCard">身份证号：7************6</span><el-button type="text" class="el-icon-view view"></el-button></p>
      </div>
      <div class="plain">
        <div class="name">
          <div class="first">
            <span>数据总览</span>
          </div>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="限制性股票" name="first">
            <div class="data">
              <div class="block" v-for="(item, index) in 8">
                <p>999,999,9</p>
                <p>总股本(万股)</p>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="股票期权" name="second">
            <div class="data">
              <div class="block" v-for="(item, index) in 8">
                <p>999,999,9</p>
                <p>总股本(万股)</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="transcationRecord">
        <div class="name">
          <div class="first">
            <span>交易记录</span>
          </div>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="限制性股票" name="first">
          <el-table :data="tableData1" stripe style="width: 100%">
            <el-table-column prop="number" label="序号" width="56"></el-table-column>
            <el-table-column label="日期" width="109">
              <template>
                <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="capital" label="股本数" width="149"></el-table-column>
            <el-table-column prop="sale" label="卖出" width="167">
              <template slot-scope="scope">
                <el-input size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="交易价格" width="218">
               <template slot-scope="scope">
                <el-input size="mini" value="999.99"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="shoulePayHave" label="应纳税所得额" width="107"></el-table-column>
            <el-table-column prop="shoulePay" label="应纳税额" width="162"></el-table-column>
            <el-table-column prop="payDate" label="最晚纳税日" width="98"></el-table-column>
            <el-table-column prop="operation" label="操作" width="101">
              <template slot-scope="scope">
                <el-button type="text" class="el-icon-edit-outline"></el-button>
                <el-button type="text" class="el-icon-delete"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <p class="add"><el-button type="text" class="el-icon-circle-plus-outline"> 新增交易数据</el-button></p>
          </el-tab-pane>
          <el-tab-pane label="股票期权" name="second">
          <el-table :data="tableData1" stripe style="width: 100%">
            <el-table-column prop="number" label="序号" width="56"></el-table-column>
            <el-table-column label="日期" width="109">
              <template>
                <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="capital" label="股本数" width="149"></el-table-column>
            <el-table-column prop="sale" label="卖出" width="167">
              <template slot-scope="scope">
                <el-input size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="交易价格" width="218">
               <template slot-scope="scope">
                <el-input size="mini" value="999.99"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="shoulePayHave" label="应纳税所得额" width="107"></el-table-column>
            <el-table-column prop="shoulePay" label="应纳税额" width="162"></el-table-column>
            <el-table-column prop="payDate" label="最晚纳税日" width="98"></el-table-column>
            <el-table-column prop="operation" label="操作" width="101">
              <template slot-scope="scope">
                <el-button type="text" class="el-icon-edit-outline"></el-button>
                <el-button type="text" class="el-icon-delete"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <p class="add"><el-button type="text" class="el-icon-circle-plus-outline"> 新增交易数据</el-button></p>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="detailData">
        <div class="name">
          <div class="first">
            <span>详细信息</span>
          </div>
        </div>
        <div class="item1">
          <p>第二期：限制性股票<span>(获授总数：<span class="num">9,999,999 </span>)</span></p>
          <div class="line">
            <div class="word">第一次授予</div>
            <div class="lastLine"></div>
          </div>
          <el-table :data="tableData2" stripe style="width: 100%">
            <el-table-column label="激励计划">
              <el-table-column prop="data1" label="解除禁售安排" width="89"></el-table-column>
              <el-table-column prop="data2" label="本次获授股份数(股)" width="138"></el-table-column>
              <el-table-column prop="data3" label="可解除限售数量(股)" width="137"></el-table-column>
              <el-table-column prop="data4" label="可解除限售日期" width="147"></el-table-column>
              <el-table-column prop="data5" label="实际接触限售数量(股)" width="166"></el-table-column>
              <el-table-column prop="data6" label="实际接触限售日" width="134"></el-table-column>
              <el-table-column prop="data7" label="授予价格(元/股)" width="129"></el-table-column>
              <el-table-column prop="data8" label="回购价格(元/股)" width="120"></el-table-column>
              <el-table-column prop="data9" label="股份状态" width="108"></el-table-column>
            </el-table-column>
          </el-table>
          <div class="line">
            <div class="word">第二次授予</div>
            <div class="lastLine"></div>
          </div>
          <el-table :data="tableData2" stripe style="width: 100%">
            <el-table-column label="激励计划">
              <el-table-column prop="data1" label="解除禁售安排" width="89"></el-table-column>
              <el-table-column prop="data2" label="本次获授股份数(股)" width="138"></el-table-column>
              <el-table-column prop="data3" label="可解除限售数量(股)" width="137"></el-table-column>
              <el-table-column prop="data4" label="可解除限售日期" width="147"></el-table-column>
              <el-table-column prop="data5" label="实际接触限售数量(股)" width="166"></el-table-column>
              <el-table-column prop="data6" label="实际接触限售日" width="134"></el-table-column>
              <el-table-column prop="data7" label="授予价格(元/股)" width="129"></el-table-column>
              <el-table-column prop="data8" label="回购价格(元/股)" width="120"></el-table-column>
              <el-table-column prop="data9" label="股份状态" width="108"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="item2">
          <p>第二期：限制性股票<span>(获授总数：<span class="num">9,999,999 </span>)</span></p>
          <div class="line">
            <div class="word">第一次授予</div>
            <div class="lastLine"></div>
          </div>
          <el-table :data="tableData3" stripe style="width: 100%">
            <el-table-column label="激励计划">
              <el-table-column prop="data1" label="解除禁售安排" width="89"></el-table-column>
              <el-table-column prop="data2" label="本次获授股份数(股)" width="138"></el-table-column>
              <el-table-column prop="data3" label="可解除限售数量(股)" width="137"></el-table-column>
              <el-table-column prop="data4" label="可解除限售日期" width="147"></el-table-column>
              <el-table-column prop="data5" label="实际接触限售数量(股)" width="166"></el-table-column>
              <el-table-column prop="data6" label="实际接触限售日" width="134"></el-table-column>
              <el-table-column prop="data7" label="授予价格(元/股)" width="129"></el-table-column>
              <el-table-column prop="data8" label="回购价格(元/股)" width="120"></el-table-column>
              <el-table-column prop="data9" label="股份状态" width="108"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "myEquityIncentive",
  data() {
    return {
      targetAdvance: false,
      activeName: "first",
      tableData1: [
          {
            number: '1',
            capital: '999,999,999',
            sale: '',
            price: '',
            shoulePayHave: '233,234,244',
            shoulePay: '564,323',
            payDate: '2019.08.29'
          },
          {
            number: '2',
            capital: '999,999,999',
            sale: '',
            price: '',
            shoulePayHave: '233,234,244',
            shoulePay: '564,323',
            payDate: '2019.08.29'
          }
      ],
      tableData2: [
          {
            data1: '第一个解禁期',
            data2: '2000',
            data3: '800',
            data4: '2019.02.20',
            data5: '2019.02.20',
            data6: '2019.02.20',
            data7: '800',
            data8: '13.3',
            data9: '正常'
          },
          {
            data1: '第二个解禁期',
            data2: '2000',
            data3: '800',
            data4: '2019.02.20',
            data5: '2019.02.20',
            data6: '2019.02.20',
            data7: '800',
            data8: '13.3',
            data9: '正常'
          }
      ],
      tableData3: [
          {
            data1: '第一个解禁期',
            data2: '2000',
            data3: '800',
            data4: '2019.02.20',
            data5: '2019.02.20',
            data6: '2019.02.20',
            data7: '800',
            data8: '13.3',
            data9: '正常'
          }
      ]
    }
  },
  methods: {
    
  }
};
</script>

<style lang="scss">
#myEquityIncentive {
  padding: 0 0 40px;
  .main {
    .title {
      background: #f6f6f6!important;
      height: 46px;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      p {
        span {
            width:210px;
            height:20px;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
            line-height:20px;
        }
        .name {
          margin-right: 20px;
        }
        .view {
            margin-left: 9px;
            color: #FFDCDC;
        }
      }
    }
    .plain {
      margin-bottom: 16px;
      border-radius: 4px;
      padding: 0 16px;
      background: rgba(255, 255, 255, 1);
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 46px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        .first {
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 600;
            color: #323232;
            line-height: 20px;
          }
        }
      }
      .el-tabs {
        .el-tabs__nav-wrap::after {
          width: 151px;
        }
        .el-tabs__header {
          margin: 0;
        }
        .el-tabs__item:nth-child(2) {
          padding: 0;
        }
      }
      .data {
        padding: 36px 0;
        display: flex;
        justify-content: space-between;
        .block {
            p {
                width: 92px;
            }
          p:first-child {
            text-align: center;
            font-size: 18px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(50, 50, 50, 1);
            line-height: 25px;
            margin-bottom: 16px;
          }
          p:last-child {
            text-align: center;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(141, 141, 141, 1);
            line-height: 17px;
          }
        }
        .block:nth-child(2n+1) {
          padding-left: 40px;
        }
        .block:nth-child(2n) {
            padding: 0 40px;
          border-right: 1px solid rgba(174, 174, 174, 1);
        }
        .block:nth-child(8) {
          padding-right: 0;
          border-right: none;
        }
        .block:nth-child(1) {
          padding-left: 0;
        }
      }
      .charts {
        height: 224px;
      }
    }
    .transcationRecord {
      height: 276px;
      margin-bottom: 16px;
      border-radius: 4px;
      padding: 0 16px;
      background: rgba(255, 255, 255, 1);
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 46px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        .first {
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 600;
            color: #323232;
            line-height: 20px;
          }
        }
      }
      .el-tabs {
        .el-tabs__nav-wrap::after {
          width: 151px;
        }
        .el-tabs__header {
          margin: 0;
        }
        .el-tabs__item:nth-child(2) {
          padding: 0;
        }
        .el-tabs__content {
          .el-tab-pane {
            .el-table {
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(84,84,84,1);
              margin-top: 16px;
              th,td {
                border-bottom: none;
                .cell {
                  padding: 0;
                }
              }
              thead {
                tr {
                  th {
                    padding: 0;
                    height: 40px;
                    line-height: 40px;
                    background: #F6F6F6;
                    .cell {
                      text-align: right;
                    }
                  }
                  th:nth-child(5),
                  th:nth-child(8) {
                    border-right:1px solid #fff;
                  }
                  th:nth-child(5) {
                    .cell {
                      padding-right: 38px;
                    }
                  }
                  th:nth-child(1),
                  th:nth-child(7),
                  th:nth-child(9) {
                    .cell {
                      text-align: center;
                    }
                  }
                  th:nth-child(2),
                  th:nth-child(8) {
                    .cell {
                      text-align: left;
                    }
                  }
                }
              }
              tbody {
                td {
                  padding: 0;
                  height: 40px;
                  line-height: 40px;
                  .cell {
                      text-align: right;
                    }
                }
                tr {
                  td:nth-child(5),
                  td:nth-child(8) {
                    border-right:1px solid #fff;
                  }
                  td:nth-child(5) {
                      .cell {
                        padding-right: 38px;
                      }
                    }
                  td:nth-child(1),
                  td:nth-child(7),
                  td:nth-child(9) {
                    .cell {
                      display: flex;
                      justify-content: space-around;
                      .el-button {
                        padding: 0;
                        margin: 0;
                        border: none;
                        color: #8d8d8d;
                      }
                    }
                  }
                  td:nth-child(8) {
                    .cell {
                      text-align: left;
                    }
                  }
                  td:nth-child(2) {
                    .cell {
                      text-align: left;
                      .el-date-editor {
                        width: 109px;
                        .el-input__inner {
                          padding: 0;
                          padding-left: 28px;
                          height: 24px;
                        }
                      }
                    }
                  }
                  td:nth-child(4) {
                    .cell {
                      padding-left: 92px;
                      .el-input {
                        width: 75px;
                          .el-input__inner {
                            padding: 0;
                            padding-left: 28px;
                            height: 24px;
                        }
                      }
                    }
                  }
                  td:nth-child(5) {
                    .cell {
                      padding-left: 105px;
                      .el-input {
                        width: 75px;
                          .el-input__inner {
                            padding: 0;
                            padding-left: 28px;
                            height: 24px;
                        }
                      }
                    }
                  }
                }
              }
            }
            .el-table::before {
              height: 0;
            }
            .add {
              padding-left: 21px;
              .el-button {
                font-size:12px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(84,84,84,1);
              }
            }
          }
        }
      }
    }
    .detailData {
      margin-bottom: 16px;
      border-radius: 4px;
      padding: 0 16px;
      padding-bottom: 17px;
      background: rgba(255, 255, 255, 1);
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 46px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        margin-bottom: 16px;
        .first {
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 600;
            color: #323232;
            line-height: 20px;
          }
        }
      }
      .item1,.item2 {
        margin-bottom: 20px;
        p {
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(50,50,50,1);
          span {
            color: #545454;
            .num {
              color: #FFB148;
            }
          }
        }
        .line {
          margin: 12px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .word {
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
            .lastLine {
              width: 1100px;
              height:1px;
              background:rgba(0,0,0,0.08);
            }
        }
        .el-table {
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(84,84,84,1);
          margin-top: 16px;
          padding-bottom: 12px;
          border:none;
          .cell {
                padding: 0;
              }
          thead {
            tr {
              th {
                padding: 0;
                height: 40px;
                line-height: 40px;
                background: #F6F6F6;
                text-align: right;
                border:none;
              }
            }
            tr:nth-child(1) {
              th {
                text-align: center;
                font-size:14px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(50,50,50,1);
              }
            }
            tr:nth-child(2) {
              th:nth-child(9) {
                padding-right: 16px;
              }
            }
          }
          tbody {
            tr {
              td {
                border:none;
                padding: 0;
                height: 40px;
                line-height: 40px;
                text-align: right;
              }
              td:nth-child(4),
              td:nth-child(5),
              td:nth-child(6),
              td:nth-child(9) {
                text-align: left;
                padding-left: 50px;
              }
              td:nth-child(4) {
                padding-left: 64px;
              }
              td:nth-child(9) {
                padding-left: 44px;
              }
            }
          }
        }
        .el-table::before {
          height: 0;
        }
        .el-table--group::after {
          width: 0;
        }
      }
      .item2 {
          margin-bottom: 0;
        .el-table{
          border-bottom: 1px solid #e3e3e3;
        }
      }
    }
  }
}
</style>
