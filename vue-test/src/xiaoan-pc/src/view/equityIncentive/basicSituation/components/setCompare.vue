<template>
   <div id="setCompare">
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
                          <el-table-column  prop="code" width="69.5"></el-table-column>
                          <el-table-column  prop="name" width="69.5"></el-table-column>
                          <el-table-column  prop="address" width="69.5"></el-table-column>
                          <el-table-column label="操作" width="69.5" class="rightEdit">
                          <template slot-scope="scope">
                            <el-button
                              size="mini">添加</el-button>
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
                          <el-table-column  prop="code" width="69.5"></el-table-column>
                          <el-table-column  prop="name" width="69.5"></el-table-column>
                          <el-table-column  prop="address" width="69.5"></el-table-column>
                          <el-table-column label="操作" width="69.5" class="rightEdit">
                          <template slot-scope="scope">
                            <el-button
                              size="mini">移除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="sendMessage" class="noButton">取 消</el-button>
                  <el-button type="primary" @click="sendMessage" class="yesButton">确 定</el-button>
                </span>
              </el-dialog>
     </div>
    </div>
</template>

<script>
export default {
  name:"setCompare",
  props:["setCompare"],
  data () {
    return {
          input: '',
          setCompare1:this.setCompare,
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
    sendMessage() {
      this.setCompare = false
      this.$emit("setCompare")
    }
  },
  watch: {
    setCompare1: {
      handler(newName, oldName) {
        this.$emit("setCompare")
      }
    }
  },
  created () {
  }
}
</script>

<style lang='scss'>
  #setCompare {
    width:620px;
    height:618px;
                .el-dialog{
                  height: 618px;
                  .el-dialog__header {
                    border-bottom: 1px solid rgba(227,227,227,1);
                    height: 50px;
                    padding-top: 14px;
                    span {
                      width:96px;
                      height:22px;
                      font-size:16px;
                      font-family:PingFangSC-Semibold;
                      font-weight:600;
                      color:rgba(255,177,72,1);
                      line-height:22px;
                    }
                  }
                  .el-dialog__body {
                      height: 498px;
                      padding: 0;
                    .left {
                      float:left;
                      width: 44.838%;
                      height: 488px;
                      margin-left:  16px;
                      .leftHeader {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 59px;
                        box-sizing: border-box;
                        padding: 23px 0px 12px;
                        border-bottom: 1px solid rgba(0,0,0,0.08);
                        span {
                          width:56px;
                          height:20px;
                          font-size:14px;
                          font-family:PingFangSC-Semibold;
                          font-weight:600;
                          color:rgba(50,50,50,1);
                          line-height:20px;
                        }
                          .elInput {
                            width:186px;
                            box-sizing: border-box;
                            border-radius:4px;
                            border:1px solid rgba(255,224,182,1);
                            .el-input__inner {
                              height:24px;
                              padding: 0;
                              padding-left: 10px;
                              padding-top: 3px;
                            border:1px solid rgba(255,224,182,1);
                            }
                            .el-input-group__append {
                              width:48px;
                              height:22px;
                              background:rgba(255,177,72,1);
                              border-radius:0px 3px 3px 0px;
                              border-color: rgba(255,224,182,1);
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
                        .el-table{
                          .el-table__header {
                            display: none;
                          }
                          .el-table__body {
                            tr {
                                td:nth-child(4) {
                                text-align: right;
                              }
                            }
                            .el-button{
                              width:48px;
                              height:24px;
                              background:rgba(255,240,219,1);
                              border-radius:4px;
                              border:1px solid rgba(255,177,72,1);
                              padding: 2px 10px;
                              span {
                                width:28px;
                                height:20px;
                                font-size:14px;
                                font-family:PingFangSC-Regular;
                                font-weight:400;
                                color:rgba(255,177,72,1);
                                line-height:20px;
                                margin: 0;
                              }
                            }
                              .cell {
                                  width: 69px;
                                  margin: 0;
                                  padding: 0;
                                  font-size:14px;
                                  font-family:PingFangSC-Regular;
                                  font-weight:400;
                                  color:rgba(84,84,84,1);
                                  line-height:20px;
                                }
                          }
                        }
                      }
                      .leftFooter {
                        width: 100%;
                        height: 78px;
                          margin:35px 0px 24px;
                        .el-pagination {
                          .btn-prev,
                          .number,
                          .el-icon.more.btn-quicknext.el-icon-more,
                          .btn-next{
                            border:1px solid #E3E3E3;  
                            background-color:#fff;
                          }
                          .number.active{
                            background:#FFB148;

                          }
                        }
                      }
                    }
                    .right {
                      float:left;
                      width: 50%;
                      height: 488px;
                      margin-left:  16px;
                      .rightHeader {
                        width: 100%;
                        height: 59px;
                        box-sizing: border-box;
                        padding: 23px 0px 12px;
                        margin-left: 15px;
                        border-bottom: 1px solid rgba(0,0,0,0.08);
                         span {
                          width:84px;
                          height:20px;
                          font-size:14px;
                          font-family:PingFangSC-Semibold;
                          font-weight:600;
                          color:rgba(50,50,50,1);
                          line-height:20px;
                        }
                        .number {
                          width:39px;
                          height:20px;
                          font-size:14px;
                          font-family:PingFangSC-Regular;
                          font-weight:400;
                          color:rgba(84,84,84,1);
                          line-height:20px;
                          margin-left:4px;
                        }
                      }
                      .rightBody {
                        width: 100%;
                        height: 360px;
                        padding-left: 15px;
                        margin-top: 11px;
                        border-left:1px solid rgba(0,0,0,0.08);
                        .el-table__body tr,
                        .el-table__body td {
                          padding: 0;
                          height: 36px;
                        }
                         .el-table{
                          .el-table__header {
                            display: none;
                          }
                          .el-table__body {
                            tr {
                                td:nth-child(4) {
                                text-align: right;
                              }
                            }
                            .el-button{
                              width:48px;
                              height:24px;
                              background:rgba(255,240,219,1);
                              border-radius:4px;
                              border:1px solid rgba(255,177,72,1);
                              padding: 2px 10px;
                              span {
                                width:28px;
                                height:20px;
                                font-size:14px;
                                font-family:PingFangSC-Regular;
                                font-weight:400;
                                color:rgba(255,177,72,1);
                                line-height:20px;
                                margin: 0;
                              }
                            }
                              .cell {
                                  width: 69px;
                                  margin: 0;
                                  padding: 0;
                                  font-size:14px;
                                  font-family:PingFangSC-Regular;
                                  font-weight:400;
                                  color:rgba(84,84,84,1);
                                  line-height:20px;
                                }
                          }
                        }
                        .el-table::before {
                          height:0;
                        }
                      }
                    }
                  }
                  .dialog-footer{
                    margin-bottom: 8px;
                    .noButton{
                        width:110px;
                        height:35px;
                        background:rgba(255,240,219,1);
                        border-radius:4px;
                        border:1px solid rgba(255,177,72,1);
                        padding: 7px 33px 6px;
                        span {
                          width:44px;
                          height:22px;
                          font-size:16px;
                          font-family:PingFangSC-Semibold;
                          font-weight:600;
                          color:rgba(255,177,72,1);
                          line-height:22px;
                        }
                      }
                  }
                    .yesButton {
                      width:110px;
                      height:35px;
                      background:rgba(255,177,72,1);
                      border-radius:4px;
                      padding: 7px 33px 6px;
                      span {
                        width:44px;
                        height:22px;
                        font-size:16px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                        line-height:22px;                       
                      }
                    }
                  span{
                    width:96px;
                    height:22px;
                    font-size:16px;
                    font-family:PingFangSC-Semibold;
                    font-weight:600;
                    color:rgba(255,177,72,1);
                    line-height:22px;
                  }
                } 
              }
  
</style>
