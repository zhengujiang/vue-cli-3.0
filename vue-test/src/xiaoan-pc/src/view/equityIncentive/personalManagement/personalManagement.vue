<template>
  <div id="personalManagement">
    <div class="content">
      <el-row :gutter="12">
        <el-col :span="16">
          <div class="leftCol">
            <div class="addSome">
              <el-dialog title="添加统筹方" :visible.sync="addSome" width="644px" center>
                <p class="humanTip">当前套餐成员数 <span>2</span>/5 剩余可邀请人数：<span>3</span></p>
                <div class="humanInfo">
                  <div class="humanTel">
                    <p>统筹方手机号(必填)</p>
                    <el-input placeholder="请输入11位手机号"></el-input>
                  </div>
                  <div class="humanName">
                    <p>统筹方用户名(选填)</p>
                    <el-input placeholder="用于邮件使用名称"></el-input>
                  </div>
                  <div class="humanEmail">
                    <p>统筹方邮箱(选填)</p>
                    <el-input placeholder="name@example.com"></el-input>
                  </div>
                </div>
                <div class="operation">
                  <span class="addFriend el-icon-circle-plus-outline">  添加一位好友</span>
                  <el-button type="primary" size="mini" class="sendYq">发送邀请</el-button>
                </div>
                <div class="link">
                  <p>您也可以通过向好友发送链接邀请他加入小安！<span>(点击更新共享链接后，愿共享链接失效）</span></p>
                  <el-input size="mini" placeholder="https://xiaoan.in-hope.cn/disclosure/checklist">
                    <el-button slot="append">复制链接</el-button>
                  </el-input>
                  <el-button type="text" class="el-icon-refresh refresh">  更新链接</el-button>
                </div>
              </el-dialog>
            </div>
            <div class="addError">
              <el-dialog title="添加统筹方" :visible.sync="addError" width="620px" center>
                <p class="errorTip">当前套餐成员数 <span>5</span>/5 剩余可邀请人数：<span>0</span></p>
                <p class="quesTel"> 如需添加，请咨询：021-20740322</p>
                <el-button  @click="addError = false" class="yesButton">确 定</el-button>
              </el-dialog>
            </div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="统筹方管理" name="first" class="first">
                <el-button icon="el-icon-plus" type="primary" class="titleButton" size="mini" @click="addError = true">添加统筹方</el-button>
                <content-table></content-table>
              </el-tab-pane>
              <el-tab-pane label="被激励对象管理" name="second" class="second">
                <el-button type="primary" size="mini" class="secondInput" >获取邀请模版</el-button>
                <div class="batch">
                  <el-button type="primary" size="mini">批量停用</el-button>
                  <el-button type="primary" size="mini">批量删除</el-button>
                </div>
                <content-table1></content-table1>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="rightCol">
          </div>
        </el-col>
        <el-col :span="8">
          <div class="rightCol">
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import ContentTable from './components/contentTable'
  import ContentTable1 from './components/contentTable1'
  export default {
    name: "personalManagement",
    data() {
      return {
        addSome: false,
        addError: false,
        activeName: 'first',
        input: ''
      }
    },
    components: {
      ContentTable,
      ContentTable1
    }, 
    methods: {
  }
}
</script>

<style lang="scss">
  #personalManagement {
    padding: 16px 0 40px;
    .el-col-16 {
      width:896px;
      .leftCol {
        background:rgba(255,255,255,1);
        border-radius:4px;
        padding: 0 16px 36px;
        .el-tabs {
          position: relative;
          overflow: auto;
          .el-tabs__header {
            margin-bottom: 0;
            .el-tabs__item {
                height: 48px;
              }
          }
          .el-tabs__content {
            padding-top: 12px;
            overflow: visible;
          }
          .first {
            .titleButton {
              position: absolute;
              right: 0;
              top: -39px;
            }
          }
          .second {
            .secondInput {
              position: absolute;
              right: 0;
              top: -39px;
              width: 116px;
            }
            .batch {
              height: 40px;
              .el-button {
                background:rgba(255,240,219,1);
                border-radius:4px;
                border:1px solid rgba(255,177,72,1);
                span {
                  font-size:14px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(255,177,72,1);
                }
              }
            }
          }
        }
        .addSome{
          .el-dialog {
            padding-left: 16px;
            padding-right: 16px;
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
              padding: 0;
              height: 290px;
              .humanTip {
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(141,141,141,1);
                line-height:20px;
                margin-top: 20px;
                margin-bottom: 20px;
                span {
                  color: #FFB148;
                }
              }
              .humanInfo {
                height: 64px;
                p {
                  height:20px;
                  font-size:14px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(50,50,50,1);
                  line-height:20px;
                  margin-bottom: 12px;
                }
                .el-input {
                  .el-input__inner {
                    width:190px;
                    height:32px;
                    border-radius:4px;
                    border:1px solid rgba(227,227,227,1);
                  }
                }
                .humanTel,
                .humanName,
                .humanEmail {
                  width: 190px;
                  height: 64px;
                  float: left;
                  margin-right: 12px;
                }
              }
              .operation {
                height: 64px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid rgba(227, 227, 227, 1);
                .addFriend {
                  margin-top: 12px;
                  height:20px;
                  font-size:14px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(255,177,72,1);
                  line-height:20px;
                }
                .sendYq {
                  width:110px;
                  height:32px;
                  background:rgba(255,177,72,1);
                  border-radius:4px;
                  margin-top: 12px;
                  margin-right: 18px;
                  span {
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                  }
                }
              }
              .link {
                height: 101px;
                padding-top: 20px;
                p {
                  font-size:12px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(84,84,84,1);
                  margin-bottom: 8px;
                  span {
                    color: #8D8D8D;
                  }
                }
                .el-input {
                    width: 522px;
                  .el-input__inner {
                    height: 32px;
                  }
                  .el-button {
                    padding: 0;
                    width: 110px;
                    height: 32px;
                    background:rgba(255,177,72,1);
                    border-radius:0px 4px 4px 0px;
                    span {
                      font-size:14px;
                      font-family:PingFangSC-Regular;
                      font-weight:400;
                      color:rgba(255,255,255,1);
                    }
                  }
                }
                .refresh {
                    margin-left: 10px;
                  span {
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(84,84,84,1);
                  }
                }
                  .el-icon-refresh:before {
                    color: #8D8D8D;
                  }
              }
            }
          }
        }
        .addError {
          .el-dialog {
            height: 193px;
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
              padding: 0;
              height: 0px;
              p {
                text-align: center;
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#323232;
                line-height:20px;
                span {
                  color: #FFB148;
                }
              }
              .errorTip {
                margin-top: 23px;
              }
              .quesTel {
                margin-bottom: 16px;
              }
              .yesButton {
                width: 110px;
                height: 35px;
                background: rgba(255, 177, 72, 1);
                border-radius: 4px;
                padding-top: 7px;
                padding-bottom: 6px;
                margin-left: 255px;
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
          }
        }
      }
      .rightCol {
        height: 164px;
      }
    }
    .el-col-8 {
      width:292px;
      height:164px;
      background:rgba(255,252,243,1);
      border-radius:4px;
    }
    .el-col-8:last-child {
      margin-top: 12px;
    }

  }
</style>
