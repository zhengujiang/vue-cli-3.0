<template>
  <div id="file">
    <div class="content">
      <el-row :gutter="12">
        <el-col :span="16">
              <div class="container">
                <el-popover ref="popover1" placement="bottom-end" width="385px" trigger="hover" content="提示：文件大小5M以内。系统支持导入：zip | pdf | word | excel | ppt"></el-popover>
                <p class="header"><span>激励计划文件</span><el-button type="primary" size="mini" class="import" v-popover:popover1 @click="importTip = true">导入</el-button></p>
                <div class="importTip">
                  <el-dialog title="导入文件" :visible.sync="importTip" width="620px" center>
                        <p class="name">文件名称：这是文件名称的回显</p>
                        <p class="nameHad">当前文件名已存在，系统将替换原有文件。</p>
                        <el-button class="again" type="text">重新上传</el-button>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="importTip = false" class="noButton">取 消</el-button>
                          <el-button type="primary" @click="importTip = false" class="yesButton">确 定</el-button>
                        </span>
                  </el-dialog>
                </div>
               <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="uploadName" label="上传文件名称" width="230">
                  <template slot-scope="scope">
                    <p>{{scope.row.uploadName}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="uploadPerson" label="上传者" width="250"></el-table-column>
                <el-table-column prop="updateDate" label="更新日期" width="280"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope" class="button">
                    <el-button type="text" size="mini" class="button">下载</el-button>
                    <el-button type="text" size="mini" class="button">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page">
                <el-pagination
                  background
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
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
        </el-col>
        <el-col :span="8">

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "file",
    data() {
      return {
        activeName: 'first',
        importTip: false,
        tableData: [
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'}
        ],
        radio: '30',
        input: '',
        currentPage: 1
      }
    },
    methods: {
      handleSizeChange() {

      },
      handleCurrentChange() {

      },
      handleSizeChange1() {

      },
      handleCurrentChange1() {

      }
    }
  }
</script>

<style lang="scss">
  #file {
    padding: 16px 0 40px;
    .el-col-16 {
      width:896px;
      height: 594px;
      background-color: #fff;
      .container {
        padding: 0 10px;
        .el-popover {
          padding: 6px;
          height: 29px;
          line-height: 29px;
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(84,84,84,1);
        }
        .importTip {
          .el-dialog {
            height: 223px;
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
              height: 107px;
              padding: 0;
              padding-left: 70px;
              padding-top: 20px;
              .name {
                height:22px;
                font-size:16px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:22px;
              }
              .nameHad {
                height:17px;
                font-size:12px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(251,67,25,1);
                line-height:17px;
              }
              .again {
                padding-top: 12px;
                span {
                font-size:16px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                }
              }
            }
            .dialog-footer {
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
        .header {
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #D8D8D8;
          span {
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(50,50,50,1);
          }
          .el-button {
            margin-left: 700px;
            padding: 0;
            width: 80px;
            height: 28px;
            background:rgba(255,177,72,1);
            border-radius:4px;
            span {
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(255,255,255,1);
            }
          }
        }
        .el-table {
          margin-top: 12px;
          margin-bottom: 28px;
          th, td {
            height: 40px;
            padding: 0;
            border: none;
          }
          th {
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(141,141,141,1);
            background:rgba(0,0,0,0.03);
          }
          td {
            font-size:12px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
          td:nth-child(3) {
            color:rgba(141,141,141,1);
          }
          .icon {
            display: inline-block;
            width:24px;
            height:16px;
            background:rgba(255,177,72,1);
            border-radius:4px;
            font-size:10px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height: 16px;
            margin-left: 5px;
            text-align: center;
          }
          .button {
            span {
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
          }
          }
          .el-table::before {
            height: 0;
          }
          .page {
            display: flex;
            justify-content: space-between;
          }
      }
    }
    .el-col-8 {
      width:292px;
      height:164px;
      background:rgba(255,252,243,1);
      border-radius:4px;
    }
  }
</style>
