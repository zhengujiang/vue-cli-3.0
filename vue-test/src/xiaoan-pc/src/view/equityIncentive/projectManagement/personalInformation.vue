<template>
  <div id="personalInformation">
    <div class="content manage">
      <div class="project">
        <div class="header">
          <span class="name">姓名：张三某某 (共2期激励计划)</span>
          <span class="idNumber">身份证号：764337366262647826</span>
        </div>
        <div class="first">
          <p>第一期：股票期权<span>(获授总数：<span class="num">9,999,999 </span>)</span></p>
          <div class="line">
            <div class="word">第一次授予</div>
            <div class="lastLine"></div>
          </div>
          <el-table :data="tableData1" style="width: 100%" stripe>
            <el-table-column label="激励计划">
              <el-table-column prop="data1" label="解除禁售安排" width="84px">
              </el-table-column>
              <el-table-column prop="data2" label="授予期权数量" width="87px">
              </el-table-column>
              <el-table-column prop="data3" label="可行权数量" width="76px">
              </el-table-column>
              <el-table-column prop="data4" label="可行权日" width="84px">
              </el-table-column>
              <el-table-column prop="data5" label="行权到期日" width="80px">
              </el-table-column>
              <el-table-column prop="data6" label="实际行权日" width="76px">
              </el-table-column>
              <el-table-column prop="data7" label="实际行权数量" width="89px">
              </el-table-column>
              <el-table-column prop="data8" label="行权价格" width="64px">
              </el-table-column>
              <el-table-column prop="" label="期权状态"  width="91px">
                <template slot-scope="scope">
                  <span class="norm">正常</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="考核结果">
              <el-table-column prop="" label="公司考核" width="61px">
                <template slot-scope="scope">
                  <span>已达标</span>
                </template>
              </el-table-column>
              <el-table-column label="个人考核" width="64px">
                <template slot-scope="scope">
                  <span >已达标</span>
                </template>
              </el-table-column>
              <el-table-column label="解锁系数" width="76px">
                <template slot-scope="scope">
                  <span class="level">0~1</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="纳税情况">
              <el-table-column prop="tax1" label="应纳税所得额" width="83px">
              </el-table-column>
              <el-table-column prop="tax2" label="应纳税额" width="64px">
              </el-table-column>
              <el-table-column prop="tax3" label="最晚纳税日" width="88px">
              </el-table-column>
            </el-table-column>
          </el-table>
          <div class="line">
            <div class="word">第二次授予</div>
            <div class="lastLine"></div>
          </div>
          <el-table :data="tableData2" style="width: 100%" stripe>
            <el-table-column label="激励计划">
              <el-table-column prop="data1" label="解除禁售安排" width="84px">
              </el-table-column>
              <el-table-column prop="data2" label="授予期权数量" width="87px">
              </el-table-column>
              <el-table-column prop="data3" label="可行权数量" width="76px">
              </el-table-column>
              <el-table-column prop="data4" label="可行权日" width="84px">
              </el-table-column>
              <el-table-column prop="data5" label="行权到期日" width="80px">
              </el-table-column>
              <el-table-column prop="data6" label="实际行权日" width="76px">
              </el-table-column>
              <el-table-column prop="data7" label="实际行权数量" width="89px">
              </el-table-column>
              <el-table-column prop="data8" label="行权价格" width="64px">
              </el-table-column>
              <el-table-column prop="" label="期权状态"  width="91px">
                <template slot-scope="scope">
                  <span class="norm">正常</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="考核结果">
              <el-table-column prop="" label="公司考核" width="61px">
                <template slot-scope="scope">
                  <span>已达标</span>
                </template>
              </el-table-column>
              <el-table-column label="个人考核" width="64px">
                <template slot-scope="scope">
                  <span >已达标</span>
                </template>
              </el-table-column>
              <el-table-column label="解锁系数" width="76px">
                <template slot-scope="scope">
                  <span class="level">0~1</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="纳税情况">
              <el-table-column prop="tax1" label="应纳税所得额" width="83px">
              </el-table-column>
              <el-table-column prop="tax2" label="应纳税额" width="64px">
              </el-table-column>
              <el-table-column prop="tax3" label="最晚纳税日" width="88px">
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="second">
           <p>第二期：限制性股票<span>(获授总数：<span class="num">9,999,999 </span>)</span></p>
          <div class="line">
            <div class="word">第一次授予</div>
            <div class="lastLine"></div>
          </div>
          <el-table :data="tableData3" style="width: 100%" stripe>
            <el-table-column label="激励计划">
              <el-table-column prop="data1" label="解除禁售安排" width="84px">
              </el-table-column>
              <el-table-column prop="data2" label="授予期权数量" width="87px">
              </el-table-column>
              <el-table-column prop="data3" label="可行权数量" width="76px">
              </el-table-column>
              <el-table-column prop="data4" label="可行权日" width="84px">
              </el-table-column>
              <el-table-column prop="data5" label="行权到期日" width="80px">
              </el-table-column>
              <el-table-column prop="data6" label="实际行权日" width="76px">
              </el-table-column>
              <el-table-column prop="data7" label="实际行权数量" width="89px">
              </el-table-column>
              <el-table-column prop="data8" label="行权价格" width="64px">
              </el-table-column>
              <el-table-column prop="" label="期权状态"  width="91px">
                <template slot-scope="scope">
                  <span class="norm">正常</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="考核结果">
              <el-table-column prop="" label="公司考核" width="61px">
                <template slot-scope="scope">
                  <span>已达标</span>
                </template>
              </el-table-column>
              <el-table-column label="个人考核" width="64px">
                <template slot-scope="scope">
                  <span >已达标</span>
                </template>
              </el-table-column>
              <el-table-column label="解锁系数" width="76px">
                <template slot-scope="scope">
                  <span class="level">0~1</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="纳税情况">
              <el-table-column prop="tax1" label="应纳税所得额" width="83px">
              </el-table-column>
              <el-table-column prop="tax2" label="应纳税额" width="64px">
              </el-table-column>
              <el-table-column prop="tax3" label="最晚纳税日" width="88px">
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "personalInformation",
    data() {
      return {
         tableData1: [
          {data1: '第一个解禁期', data2: '2000', data3: '800', data4: '2019.02.20', data5: '2019.02.20', data6: '2019.02.20', data7: '800', data8: '18.3', tax1: '24.5', tax2: '24.5', tax3: '2019.03.21'},
          {data1: '第二个解禁期', data2: '2000', data3: '800', data4: '2019.02.20', data5: '2019.02.20', data6: '2019.02.20', data7: '800', data8: '18.3', tax1: '24.5', tax2: '24.5', tax3: '2019.03.21'},
          {data1: '第二个解禁期', data2: '2000', data3: '800', data4: '2019.02.20', data5: '2019.02.20', data6: '2019.02.20', data7: '800', data8: '18.3', tax1: '24.5', tax2: '24.5', tax3: '2019.03.21'}
         ],
          tableData2: [
          {data1: '第一个解禁期', data2: '2000', data3: '800', data4: '2019.02.20', data5: '2019.02.20', data6: '2019.02.20', data7: '800', data8: '18.3', tax1: '24.5', tax2: '24.5', tax3: '2019.03.21'}
         ],
          tableData3: [
          {data1: '第一个解禁期', data2: '2000', data3: '800', data4: '2019.02.20', data5: '2019.02.20', data6: '2019.02.20', data7: '800', data8: '18.3', tax1: '24.5', tax2: '24.5', tax3: '2019.03.21'},
          {data1: '第二个解禁期', data2: '2000', data3: '800', data4: '2019.02.20', data5: '2019.02.20', data6: '2019.02.20', data7: '800', data8: '18.3', tax1: '24.5', tax2: '24.5', tax3: '2019.03.21'}
         ]
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss">
  #personalInformation {
    padding: 16px 0 0;
    .manage {
      .project {
        min-height:496px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        padding: 0 16px 0px;
        .header {
            height:46px;
            line-height:46px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            span {
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
        }
        .first, .second {
          padding-top: 16px;
          p {
            height:20px;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
            line-height:20px;
            span {
              color:rgba(84,84,84,1);
              .num {
                color: #FFB148;
              }
            }
          }
          .line {
            margin-top: 12px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .word {
              height:17px;
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
              line-height:17px;
            }
            .lastLine {
              width: 1097px;
              height:1px;
              background:rgba(0,0,0,0.08);
            }
          }
          .el-table--border::after, .el-table--group::after {
            width: 0;
          }
          .el-table::before {
            height: 0;
          }
          .el-table {
            border: none;
            margin-bottom: 28px;
            td,th {
              border: none;
            }
            .cell {
              padding: 0;
            }
            thead {
              tr:first-child {
                th {
                  padding-top: 8px;
                  padding-bottom: 8px;
                  font-size:14px;
                  font-family:PingFangSC-Semibold;
                  font-weight:600;
                  color:rgba(50,50,50,1);
                  text-align: center;
                  border-right: 1px solid #ffffff;
                }
              }
              tr:last-child {
                th {
                  padding-top: 0;
                  padding-bottom: 8px;
                  height:17px;
                  font-size:12px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(84,84,84,1);
                  line-height:17px;
                  .cell {
                    text-align: right;
                  }
                }
                th:nth-child(4) {
                  padding-left: 20px;
                  .cell {
                  text-align: left;
                  }
                }
                th:nth-child(9) {
                  padding-right: 27px;
                }
                th:nth-child(12) {
                  padding-right: 12px;
                }
                th:nth-child(15) {
                  padding-right: 12px;
                }
              }
              tr {
                th:nth-child(9),
                th:nth-child(12),
                th:nth-child(15) {
                  border-right: 1px solid #ffffff;
                }
              }
            }
            tbody {
              tr {
                td:nth-child(9),
                td:nth-child(12),
                td:nth-child(15) {
                  border-right: 1px solid #ffffff;
                }
                td:nth-child(12) {
                  padding-right: 12px;
                }
                td {
                  text-align: right;
                  font-size:12px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(84,84,84,1);
                }
                td:nth-child(9) {
                  padding-right: 13px;
                  .norm {
                    display: inline-block;
                    width:62px;
                    height:20px;
                    line-height: 20px;
                    text-align: center;
                    background:rgba(255,240,219,1);
                    border-radius:4px;
                    border:1px solid rgba(255,177,72,1);
                    font-size:12px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(255,177,72,1);
                  }
                }
                td:nth-child(10),
                td:nth-child(11),
                td:nth-child(12) {
                  span {
                    display: inline-block;
                    width:48px;
                    height:20px;
                    line-height: 20px;
                    text-align: center;
                    background:rgba(144,184,244,1);
                    border-radius:4px;
                    font-size:12px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                  }
                }
                td:nth-child(12) {
                  span {
                    background:rgba(227,227,227,1);
                    border:1px solid rgba(174,174,174,1);
                    color:rgba(84,84,84,1);
                  }
                }
                td:last-child {
                  padding-right: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
