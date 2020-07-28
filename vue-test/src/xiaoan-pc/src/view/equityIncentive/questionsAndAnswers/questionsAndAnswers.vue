<template>
  <div id="questionsAndAnswers">
    <div class="content">
      <el-row :gutter="12">
        <el-col :span="16">
          <el-tabs v-model="activeName">
            <el-tab-pane label="常见问答" name="first">
              <el-input size="mini" placeholder="输入问题关键字" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <div class="new">
                <div class="commonTotal">
                 <div class="show" v-if="this.code1 == 'show1'">
                      <p class="commonQuestion">
                      <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                      <span>
                        <el-button type="text" size="mini" @click="toEdit1">编辑</el-button>
                        <el-button type="text" size="mini">移出常见问答</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                    </p>
                 </div>
                 <div class="edit" v-if="this.code1 == 'edit1'">
                      <p class="commonQuestion">
                      <span>问题： <el-input v-model="input1"></el-input></span>
                      <span>
                        <el-button type="text" size="mini" @click="toShow1">取消编辑</el-button>
                        <el-button type="text" size="mini">移出常见问答</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span> <el-input v-model="input2" type="textarea" autosize></el-input></span>
                    </p>
                    <el-button class="submit" size="mini">提交</el-button>
                 </div>
                </div>
                <div class="commonTotal">
                 <div class="show" v-if="this.code2 == 'show2'">
                      <p class="commonQuestion">
                      <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                      <span>
                        <el-button type="text" size="mini" @click="toEdit2">编辑</el-button>
                        <el-button type="text" size="mini">移出常见问答</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                    </p>
                 </div>
                 <div class="edit" v-if="this.code2 == 'edit2'">
                      <p class="commonQuestion">
                      <span>问题： <el-input v-model="input1"></el-input></span>
                      <span>
                        <el-button type="text" size="mini" @click="toShow2">取消编辑</el-button>
                        <el-button type="text" size="mini">移出常见问答</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span> <el-input v-model="input2" type="textarea" autosize></el-input></span>
                    </p>
                    <el-button class="submit" size="mini">提交</el-button>
                 </div>
                </div>
              </div>
              <div class="common">
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
              </div>
              <div class="page">
                <el-pagination
                  background
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage"
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="2355">
                </el-pagination>
                <el-radio-group v-model="radio" size="mini">
                  <el-radio-button label="30">30条</el-radio-button>
                  <el-radio-button label="50">50条</el-radio-button>
                </el-radio-group>
              </div>
            </el-tab-pane>
            <el-tab-pane label="最新问答" name="second">
              <el-input size="mini" placeholder="输入问题关键字" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <div class="new">
                <div class="commonTotal">
                 <div class="show" v-if="this.newCode1 == 'newShow1'">
                      <p class="commonQuestion">
                      <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                      <span>
                        <el-button type="text" size="mini">移至常见问答</el-button>
                        <el-button type="text" size="mini" @click="toNewEdit1">编辑答案</el-button>
                        <el-button type="text" size="mini">删除</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                    </p>
                 </div>
                 <div class="edit" v-if="this.newCode1 == 'newEdit1'">
                      <p class="commonQuestion">
                      <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                      <span>
                        <el-button type="text" size="mini" @click="toNewShow1">取消编辑</el-button>
                        <el-button type="text" size="mini">删除</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span> <el-input v-model="ninput2" type="textarea" autosize></el-input></span>
                    </p>
                    <el-button class="submit" size="mini">提交</el-button>
                 </div>
                </div>
                <div class="commonTotal">
                 <div class="show" v-if="this.newCode2 == 'newShow2'">
                      <p class="commonQuestion">
                      <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                      <span>
                        <el-button type="text" size="mini">移至常见问答</el-button>
                        <el-button type="text" size="mini" @click="toNewEdit2">编辑答案</el-button>
                        <el-button type="text" size="mini">删除</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                    </p>
                 </div>
                 <div class="edit" v-if="this.newCode2 == 'newEdit2'">
                      <p class="commonQuestion">
                      <span>问题： <el-input v-model="ninput1"></el-input></span>
                      <span>
                        <el-button type="text" size="mini" @click="toNewShow2">取消编辑</el-button>
                        <el-button type="text" size="mini">删除</el-button>
                      </span>
                    </p>
                    <p class="commonAnswer">
                      <span>回答：</span>
                      <span> <el-input v-model="ninput2" type="textarea" autosize></el-input></span>
                    </p>
                    <el-button class="submit" size="mini">提交</el-button>
                 </div>
                </div>
              </div>
              <div class="lists">
                <ul>
                  <li v-for="list in lists" :key="list.index">
                      <span class="title">{{ list.title }}</span>
                      <span class="time">{{ list.time }}</span>
                  </li>
                </ul>
              </div>
              <div class="page">
                <el-pagination
                  background
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage"
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="2355">
                </el-pagination>
                <el-radio-group v-model="radio" size="mini">
                  <el-radio-button label="30">30条</el-radio-button>
                  <el-radio-button label="50">50条</el-radio-button>
                </el-radio-group>
              </div>
            </el-tab-pane>
            <el-tab-pane label="未回答问题" name="third">
              
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="8">

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "questionsAndAnswers",
    data() {
      return {
        code1: 'show1',
        code2: 'show2',
        newCode1: 'newShow1',
        newCode2: 'newShow2',
        input1: '这是常见问答的问题，样式和法规列表保持一致',
        input2: '这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容',
        ninput2: '编辑答案的输入框...',
        activeName: 'first',
        tableData: [
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'},
          {uploadName: '这是上传的文件名称', uploadPerson: '这是上传者的名称', updateDate: '2019.12.30 22:32'}
        ],
        lists: [
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'}
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

      },
      toEdit1() {
        this.code1 = 'edit1'
      },
      toEdit2() {
        this.code2 = 'edit2'
      },
      toShow1() {
        this.code1 = 'show1'
      },
      toShow2() {
        this.code2 = 'show2'
      },
      toNewEdit1() {
        this.newCode1 = 'newEdit1'
      },
      toNewEdit2() {
        this.newCode2 = 'newEdit2'
      },
      toNewShow1() {
        this.newCode1 = 'newShow1'
      },
      toNewShow2() {
        this.newCode2 = 'newShow2'
      }
    }
  }
</script>

<style lang="scss">
  #questionsAndAnswers {
    padding: 16px 0 40px;
    .el-col-16 {
      width:896px;
      .commonTotal:hover {
            background-color: #f8f8f8;
          }
      .el-tabs {
        background:rgba(255,255,255,1);
        border-radius:4px;
        padding: 0 16px 36px;
        .el-tabs__header {
          position: relative;
          overflow: inherit;
        }
        .el-tabs__content {
          overflow: inherit;
        }
        .el-tabs__nav-wrap::after {
          height: 1px;
        }
        .import {
          width:80px;
          position: absolute;
          right: 0;
          top: -48px;
        }
        .el-table {
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

        .input-with-select {
          width:332px;
          position: absolute;
          right: 0;
          top: -48px;
          .el-input__inner {
            border:1px solid rgba(255,224,182,1);
          }
          .el-input-group__append {
            background:rgba(255,177,72,1);
            border-color: rgba(255,224,182,1);
            .el-icon-search {
              color: #ffffff;
            }
          }
        }
        .common {
          .commonTotal {
            padding: 12px 0;
            border-top: 1px solid rgba(0,0,0,0.08);
            .commonQuestion {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              span:first-child {
                font-size:16px;
                font-family:PingFangSC-Medium;
                font-weight:600;
                color:rgba(50,50,50,1);
                line-height:22px;
              }
              span:last-child {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(174,174,174,1);
                line-height:20px;
              }
            }
            .commonAnswer {
              display: flex;
              span:first-child {
                display: inline-block;
                width: 100px;
                font-size:16px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(84,84,84,1);
                line-height:22px;
              }
              span:last-child {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(84,84,84,1);
                line-height:22px;
              }
            }
          }
          .commonTotal:last-child {
            border-bottom: 1px solid rgba(0,0,0,0.08);
            margin-bottom: 38px;
          }
        }
        .new {
          .commonTotal {
            padding: 12px 0;
            border-top: 1px solid rgba(0,0,0,0.08);
            .commonQuestion {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              span:first-child {
                font-size:16px;
                font-family:PingFangSC-Medium;
                font-weight:600;
                color:rgba(50,50,50,1);
                line-height:22px;
              }
              span:last-child {
                .el-button {
                  span {
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(141,141,141,1);
                    line-height:20px;
                    &:hover {
                      color:rgba(255,177,72,1);
                    }
                  }
                }
              }
            }
            .commonAnswer {
              display: flex;
              span:first-child {
                display: inline-block;
                width: 100px;
                font-size:16px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(84,84,84,1);
                line-height:22px;
              }
              span:last-child {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(84,84,84,1);
                line-height:22px;
              }
            }
          }
          .commonTotal:last-child {
            border-bottom: 1px solid rgba(0,0,0,0.08);
          }
          .edit {
              .submit {
                padding: 0;
                margin-top: 16px;
                margin-left: 53px!important;
                width:60px;
                height:28px;
                background:rgba(255,177,72,1);
                border-radius:4px;
                span {
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                    line-height:20px;
                }
              }
              .el-input {
                display: inline-block;
                  width: 448px;
                  height: 30px;
                .el-input__inner {
                  font-size:16px;
                  padding: 0;
                  width: 448px;
                  height: 30px;
                  background: #f5f5f5;
                  border: none;
                }
              }
              .commonAnswer {
               span:first-child {
                  display: inline-block;
                  width: 53px;
                  font-size:16px;
                  font-family:PingFangSC-Semibold;
                  font-weight:600;
                  color:rgba(84,84,84,1);
                  line-height:22px;
                }
                .el-textarea {
                  display: inline-block;
                    width: 786px;
                  .el-textarea__inner {
                   font-size:16px;
                    padding: 4px 14px 10px 11px;
                    width: 786px;
                    background: #f5f5f5;
                    border: none;
                    min-height: 58px!important; 
                    height: 58px;
                  }
                }
              }
            }
        }
        .lists {
          ul {
            margin-bottom: 26px;
            li {
              padding-top: 13px;
              height: 46px;
              line-height: 46px;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid rgba(0, 0, 0, 0.08);
              .title {
                font-size:16px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:22px;
              }
              .time {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(141,141,141,1);
                line-height:20px;
              }
            }
            li:hover {
              background-color: #f8f8f8;
            }
          }
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
