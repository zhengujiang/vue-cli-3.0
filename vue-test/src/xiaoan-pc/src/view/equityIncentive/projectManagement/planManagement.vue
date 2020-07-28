<template>
  <div id="planManagement">
    <div class="content manage">
      <div class="project">
        <div class="header">
          <el-button type="text" class="el-icon-arrow-left" size="small" @click="goBack">返回</el-button>
        </div>
        <div class="running">
          <p>进行中</p>
          <div class="plan1">
            <div class="top">
              <div class="left">项目名称的假字填充</div>
              <div class="right">
                 <el-button class="el-icon-edit-outline edit"> 编辑</el-button>
                 <el-button class="el-icon-delete" @click="delTip = true"> 删除</el-button>
              </div>
            </div>
            <div class="center">
              <p>开始时间：2018年12月24日</p>
              <p>激励方式：限制性股票</p>
              <p>激励对象人数：30 人</p>
            </div>
            <div class="bottom">
              <p>距首次授予日：剩余 <span>12</span> 天</p>
              <p>距首次授予完成日：剩余 <span>35</span>  天</p>
              <p>距第一个限售期结束：剩余 <span>35</span>  天</p>
              <el-button>查看详情</el-button>
            </div>
          </div>
          <div class="plan2">
            <div class="top">
              <div class="left">项目名称的假字填充</div>
              <div class="right">
                 <el-button class="el-icon-edit-outline edit"> 编辑</el-button>
                 <el-button class="el-icon-delete" @click="delTip = true"> 删除</el-button>
              </div>
            </div>
            <div class="center">
              <p>开始时间：2018年12月24日</p>
              <p>激励方式：限制性股票</p>
              <p>激励对象人数：30 人</p>
            </div>
            <div class="bottom">
              <p>距首次授予日：剩余 <span>12</span> 天</p>
              <p>距首次授予完成日：剩余 <span>35</span>  天</p>
              <p>距第一个限售期结束：剩余 <span>35</span>  天</p>
              <el-button>查看详情</el-button>
            </div>
          </div>
        </div>
        <div class="complated">
          <p>已完成</p>
          <div class="plan1">
            <div class="top">
              <div class="left">项目名称的假字填充</div>
              <div class="right">
                 <el-button class="el-icon-edit-outline edit"> 编辑</el-button>
                 <el-button class="el-icon-delete" @click="delTip = true"> 删除</el-button>
              </div>
            </div>
            <div class="center">
              <p>开始时间：2018年12月24日</p>
              <p>激励方式：限制性股票</p>
              <p>激励对象人数：30 人</p>
            </div>
            <div class="bottom">
              <p>距首次授予日：剩余 <span>12</span> 天</p>
              <p>距首次授予完成日：剩余 <span>35</span>  天</p>
              <p>距第一个限售期结束：剩余 <span>35</span>  天</p>
              <el-button>查看详情</el-button>
            </div>
          </div>
        </div>
        <div class="delTip">
          <el-dialog title="删除人员" :visible.sync="delTip" width="620px" center>
                <p>您将删除此项目的所有内容，该操作不可撤回，是否确定删除？</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="delTip = false" class="noButton">取 消</el-button>
                  <el-button type="primary" @click="delTip = false" class="yesButton">删 除</el-button>
                </span>
              </el-dialog>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "planManagement",
    data() {
      return {
        delTip: false
      }
    },
    methods: {
      goBack() {
        this.$router.push({path: '/equityIncentive/complateNewPro'})
      }
    }
  }
</script>

<style lang="scss">
  #planManagement {
    padding: 16px 0 0;
    .manage {
      .project {
        min-height:496px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        padding: 0 16px 0px;
        .header {
            height:46px;
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(50,50,50,1);
            line-height:46px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            .el-button {
              span {
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(50,50,50,1);
                line-height:20px;
              }
            }
            .el-icon-arrow-left:before {
              font-size: 14px;
              color: #8D8D8D;
            }
        }
        .running {
          width: 100%;
          height: 377px;
          padding: 16px 0;
          p {
          height:22px;
          font-size:16px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(50,50,50,1);
          line-height:22px;
          margin-bottom: 16px;
          }
          .plan1,
          .plan2 {
            float: left;
            width: 378px;
            height: 307px;
            padding: 13px 16px 0  15px;border-radius:4px;
            border:1px solid rgba(0,0,0,0.2);
            .top {
              height: 30px;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid rgba(0,0,0,0.08);
              .left {
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(50,50,50,1);
                line-height:20px;
              }
              .right {
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(84,84,84,1);
                line-height:20px;
                 .el-button {
                  border: none;
                  padding: 0!important;
                }
                .edit {
                  margin-right: 18px;
                }
              }
            }
            .center {
              height: 109px;
              border-bottom: 1px solid rgba(0,0,0,0.08);
              padding-top: 12px;
              p {
                text-align: left;
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:20px;
                margin-bottom: 12px;
              }
            }
            .bottom {
              height: 151px;
              padding-top: 12px;
              p {
                text-align: left;
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:20px;
                margin-bottom: 12px;
                span {
                  color: #FFB148;
                }
              }
              .el-button {
                margin: 0;
                padding: 0;
                width:88px;
                height:24px;
                background:rgba(255,177,72,1);
                border-radius:4px;
                margin-left: 120px;
                margin-top: 4px;
                span {
                  height:20px;
                  font-size:14px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(255,255,255,1);
                  line-height:20px;
                }
              }
            }
          }
          .plan1 {
            margin-right: 16px;
          }
        }
        .complated {
           width: 100%;
          height: 377px;
          padding: 16px 0;
          p {
          height:22px;
          font-size:16px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(50,50,50,1);
          line-height:22px;
          margin-bottom: 16px;
          }
          .plan1 {
            float: left;
            width: 378px;
            height: 307px;
            padding: 13px 16px 0  15px;border-radius:4px;
            border:1px solid rgba(0,0,0,0.2);
            .top {
              height: 30px;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid rgba(0,0,0,0.08);
              .left {
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(50,50,50,1);
                line-height:20px;
              }
              .right {
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(84,84,84,1);
                line-height:20px;
                .el-button {
                  border: none;
                  padding: 0!important;
                }
                .edit {
                  margin-right: 18px;
                }
              }
            }
            .center {
              height: 109px;
              border-bottom: 1px solid rgba(0,0,0,0.08);
              padding-top: 12px;
              p {
                text-align: left;
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:20px;
                margin-bottom: 12px;
              }
            }
            .bottom {
              height: 151px;
              padding-top: 12px;
              p {
                text-align: left;
                height:20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:20px;
                margin-bottom: 12px;
                span {
                  color: #FFB148;
                }
              }
              .el-button {
                margin: 0;
                padding: 0;
                width:88px;
                height:24px;
                background:rgba(255,177,72,1);
                border-radius:4px;
                margin-left: 120px;
                margin-top: 4px;
                span {
                  height:20px;
                  font-size:14px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(255,255,255,1);
                  line-height:20px;
                }
              }
            }
          }
        }
        .delTip {
          .el-dialog {
                height: 176px;
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
                    width:473px;
                    height:22px;
                    font-size:16px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(50,50,50,1);
                    line-height:22px;
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
      }
    }
  }
</style>
