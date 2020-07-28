<template>
  <div id="contentTable1">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="" label="" width="52">
        <template slot="header" slot-scope="scope">
          <el-select size="mini" v-model="value6" placeholder="">
            <el-option label="" value="1">全选</el-option>
            <el-option label="" value="2">全不选</el-option>
            <el-option label="" value="3">已停用账号</el-option>
            <el-option label="" value="4">正常状态账号</el-option>
          </el-select>
        </template>
        <template slot-scope="scope"><el-checkbox></el-checkbox></template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="110"></el-table-column>
      <el-table-column prop="tel" label="手机号" width="120">
        <template slot-scope="scope">
          <el-input type="text" size="mini" :placeholder="scope.row.tel"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
      <el-table-column prop="state" label="状态" width="150"></el-table-column>
      <el-table-column prop="handle" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">停用</el-button>
          <el-button type="text" size="small" @click="edit = true">编辑</el-button>
          <el-button type="text" size="small" @click="delate = true">删除</el-button>
          <div class="edit">
            <el-dialog title="编辑资料" :visible.sync="edit" width="620px" center>
              <span>姓名：</span><el-input v-model="input" placeholder="姓名"></el-input>
              <span>手机号：</span><el-input v-model="input" placeholder="15566667777"></el-input>
              <span>邮箱：</span><el-input v-model="input" placeholder="name@163/qq.com"></el-input>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="edit = false" class="noButton">取 消</el-button>
                    <el-button type="primary" @click="edit = false" class="yesButton">确 定</el-button>
                  </span>
            </el-dialog>
          </div>
          <div class="delate">
            <el-dialog title="删除人员" :visible.sync="delate" width="620px" center>
                  <p>您将要删除XXX统筹方/激励对象，该操作不可撤回，是否确定删除？</p>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="delate = false" class="noButton">取 消</el-button>
                    <el-button type="primary" @click="delate = false" class="yesButton">确 定</el-button>
                  </span>
            </el-dialog>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000">
      </el-pagination>
      <el-radio-group v-model="radio" size="mini">
        <el-radio-button label="30">30条</el-radio-button>
        <el-radio-button label="50">50条</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "contentTable1",
    data() {
      return {
        edit: false,
        delate: false,
        value6:'',
        tableData: [
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          }
        ],
        currentPage: 1,
        radio: '30',
        tel: ''
      }
    },
    methods: {
      handleSizeChange() {

      },
      handleCurrentChange() {

      }
    }
  }
</script>

<style lang="scss">
  #contentTable1 {
    .el-table {
      margin-bottom: 28px;
      th {
        height: 40px;
        background: rgba(0, 0, 0, 0.03);
        padding: 0;
        border: none;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(141,141,141,1);
        line-height:20px;
      }
      th:nth-child(6) {
        .cell {
          text-align: center;
        }
      }
      tr:nth-child(even) {
        td {
          background:rgba(0,0,0,0.03);
        }
      }
      td {
        height: 40px;
        padding: 0;
        border: none;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(50,50,50,1);
        line-height:17px;
      }
      td:nth-child(5) {
        color:rgba(141,141,141,1);
      }
      td:last-child {
        .el-button {
          color: rgba(141,141,141,1);
        }
      }
      .el-input {
        padding: 0;
        .el-input__inner {
          padding: 0;
          border: none;
          background: none;
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(50,50,50,1);
          line-height:17px;
          &:focus {
            width:84px;
            height:20px;
            background:rgba(238,238,238,1);
          }
        }
      }
    }
    .el-table::before {
      background: none;
    }
    .page {
      display: flex;
      justify-content: space-between;

    }
     thead {
       .el-select {
         padding: 0;
         .el-input {
           padding: 0;
           width: 38px;
           height: 20px;
           line-height: 20px !important;
           .el-input__inner {
            padding: 0 !important;
            width: 38px;
            height: 20px;
            border: 1px solid #e3e3e3;
            background-color: #fff;
           }
         }
       }
     }
     tbody {
      tr {
        td:first-child {
          .cell {
            padding-left: 13px;
          }
        }
      }
    }
    .edit {
      .el-dialog {
            height: 283px;
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
             height: 173px;
             padding-top: 20px;
             span {
               display: inline-block;
               width: 114px;
               text-align: right;
               font-size:14px;
               font-family:PingFangSC-Regular;
               font-weight:400;
               color:rgba(50,50,50,1);
             }
             .el-input {
               width: 440px;
                .el-input__inner {
                padding-left: 7px;
                height: 35px;
                border-radius:4px;
                border:1px solid rgba(227,227,227,1);
              }
              margin-bottom: 16px;
             }
            }
            .el-dialog__footer {
              padding-top: 0;
            }
            .dialog-footer {
              .noButton {
                width: 150px;
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
              width: 150px;
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
    .delate {
      .el-dialog {
            height: 179px;
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
              height: 69px;
              padding: 23px 74px 24px 73px;
              p {
                width:487px;
                height:22px;
                font-size:16px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:22px;
              }
            }
            .dialog-footer {
              .yesButton {
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
            .noButton {
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
</style>
