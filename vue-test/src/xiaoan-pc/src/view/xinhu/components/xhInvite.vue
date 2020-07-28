<template>
  <!--邀请回答-->
  <div id="xhInvite">
    <template v-if="xhAnswerListData.length>0">
      <el-card v-for="(item,index) in xhAnswerListData" :key="index" @click="xhAnswerToDetail(item)"
               class="list-box-card" shadow="never" body-style="padding:12px">
        <el-row type="flex" align="middle">
          <el-col :span="20">
            <div class="list-title">
              <a :href="'/xhQuestionDetail?questionId='+item.questionId" target="_blank">{{item.questionTitle}}</a>
            </div>
            <div class="list-about">
              <span>{{$common.transTime(item.createTime)[1]}}</span>
            </div>
          </el-col>
          <el-col :span="4" class="">
            <el-button size="mini" type="primary" @click="showInviteDialog(item)">回答</el-button>
            <el-button size="mini" class="ignoreBtn" @click="ignoreInvitedQuestion(item.id)">忽略</el-button>
          </el-col>
        </el-row>
      </el-card>
    </template>
    <template v-else>
      <el-card class="no-info-box-card" shadow="never" body-style="padding:12px">
        <v-noInfo></v-noInfo>
      </el-card>
    </template>
    <!--写邀请回答-->
    <el-dialog title="回答问题" custom-class="answerDialog" center :visible="showAnswer" @close="hideInviteDialog()">
      <div class="dialog-answer">
        <div class="questionTitle">{{inviteItem.questionTitle}}</div>
        <div class="isAnonymous">
          启用匿名
          <el-switch v-model="isAnonymous" style="float: right"></el-switch>
        </div>
        <textarea v-model="inviteAnswerContent" placeholder="输入回答"></textarea>
        <div style="text-align: center;margin-top:20px;">
          <el-button type="primary" @click="answerQuestion()" style="width:170px">回答</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "xhInvite",
    data() {
      return {
        xhAnswerListData: [],
        dataList: [{'nowPage': '1'}],
        pageNum: 1,
        // 邀请回答弹窗
        showAnswer: false,
        // inviteQuestionTitle: '',
        isAnonymous: false,
        inviteAnswerContent: '',
        inviteItem: {}
      }
    },
    // 使用其它组件
    components: {},

    created() {
      this.getData()
    },
    methods: {
      handlePageChange() {
        this.pageNum = 1;
      },
      //
      xhToPersonal() {
        this.$router.push({path: '/xhMy', query: {'otherUserId': this.$api.xinhuUserId}})
      },
//      handleSizeChange(val) {
//        this.dataList[0].nowPage = val
//        this.getData()
//      },
//      handleCurrentChange(val) {
//        this.dataList[0].nowPage = val
//        this.getData()
//      },
      getData() {
        this.$http({
          url: this.$api.xinhu.showInvite,
          method: 'GET',
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnObject) {
            this.xhAnswerListData = res.data.returnObject
//            this.pageNum = Math.ceil(res.data.returnObject.count / 10) * 10
//            if (this.pageNum > 10) {
//              this.pageShow = true
//            } else {
//              this.pageShow = false
//            }
          } else {
//            this.pageShow = false
          }

        })
      },
      xhAnswerToDetail(evt) {
        if (evt.answerContent) {
          this.$router.push({path: '/xhAnswerDetail', query: {questionId: evt.questionId, answerId: evt.answerId}})
        } else {
          this.$router.push({path: '/xhQuestionDetail', query: {questionId: evt.questionId}})
        }
      },
      // 邀请回答回答按钮事件
      showInviteDialog(item) {
        this.showAnswer = true
        this.inviteItem = item
      },
      hideInviteDialog() {
        this.showAnswer = false
      },
      // 回答问题
      answerQuestion() {
        if (!this.inviteAnswerContent) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '回答内容不能为空'})
          return false
        }
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addAnswer,
          params: {
            questionId: this.inviteItem.questionId,
            questionTitle: this.inviteItem.questionTitle,
            answerContent: this.inviteAnswerContent,
            isAnonymous: this.isAnonymous,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            let qid = res.data.returnObject.questionId
            let aid = res.data.returnObject.answerId
            this.$router.push({
              path: '/xhAnswerDetail',
              query: {from: 'xhQuestionDetail', questionId: qid, answerId: aid}
            })
            this.addUserAnswerMsg(aid, qid, this.question.questionTitle, this.isAnonymous)
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        })
      },
      // 忽略邀请
      ignoreInvitedQuestion(id) {
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.ignoreInvitedQuestion,
          params: {
            invitedId: id,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '已忽略'})
            this.getData()
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  #xhInvite {
    width: 100%;
    min-height: 1px;
    a {
      display: block;
      color: inherit;
    }
    .list-box-card {
      /*min-height: 100px;*/
      cursor: pointer;
      margin-bottom: 15px;
      .list-title {
        font-size: 17px;
        color: #323232;
        padding-bottom: 12px;
        /*border-bottom: 1px solid #e4e7ed;*/
      }
      .list-content {
        font-size: 13px;
        color: #545454;
        line-height: 20px;
        margin: 12px 0;
      }
      .list-about {
        font-size: 12px;
        padding-top: 12px;
        color: #aeaeae;
        cursor: default;
        /*border-top: 1px solid #e4e7ed;
        margin-top:-1px;*/
      }
    }
    .ignoreBtn {
      color: #ffb148;
      border: 1px solid #ffb148;
    }
    .mtop20 {
      margin-top: 20px;
    }
    .answerDialog {
      height: 400px;
      width: 620px;
      .el-dialog__title {
        color: #ffb148;
      }
    }
    .dialog-answer {
      .questionTitle {
        font-size: 16px;
        color: #323232;
        padding-bottom: 10px;
      }
      .isAnonymous {
        padding-bottom: 10px;
      }
      textarea {
        width: 100%;
        height: 150px;
        border: 1px solid #e3e3e3;
        // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        resize: vertical; //horizontal both
        outline: none;
      }
      .textarea-mini {
        height: 50px;
      }
      .textarea-small {
        height: 80px;
      }
      .message {
        color: #ffb148;
        background-color: #f0f1f5;
        line-height: 30px;
        margin-bottom: 6px;
      }
    }
  }
</style>


