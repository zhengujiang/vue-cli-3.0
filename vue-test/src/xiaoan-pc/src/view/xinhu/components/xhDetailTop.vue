<template>
  <div class="xhDetailTop">
    <el-row type="flex" align="middle">
      <!-- 问题页头部 -->
      <el-col :span="18">
        <div class="title-content">
          <div class="question-topic">
            <div class="topicList" v-if="topicList.length>0">
              <span v-for="(item,index) in topicList" :key="index" @click="linkTopic(item)">{{item.topicName}}</span>
            </div>
            <div class="questionTitle">{{question.questionTitle}}
              <div v-if="!question.audit" class="auditButton">正在审核</div>
            </div>
            <div class="questionDesc">{{question.questionDescription}}</div>
          </div>
          <div class="btn-content">
            <el-row>
              <el-col :span="3">
                <template v-if="question.questionReply">
                  <div class="btn-write" @click="showDialog('showAnswer','edit')"
                       v-if="question.replyAnswerId == answerId">
                    <img class="btnIcon" :src="$image.xinhu.write"> 编辑回答
                  </div>
                  <div class="btn-write" @click="showDialog('showAnswer', 'show')" v-else>
                    <img class="btnIcon" :src="$image.xinhu.write"> 我的回答
                  </div>
                </template>

                <div class="btn-write" @click="showDialog('showAnswer','answer')" v-else>
                  <img class="btnIcon" :src="$image.xinhu.write"> 写回答
                </div>

              </el-col>
              <el-col :span="3">
                <div class="btn-edit" @click="showDialog('showEdit')">修改标题</div>
              </el-col>
              <el-col :span="15">
                <div class="btn-edit" @click="showDialog('showDelete')">删除问题</div>
              </el-col>
              <el-col :span="3">
                <div v-show="!question.attention" class="btn-attention" @click="addAttention">
                  <img class="btnIcon" :src="$image.xinhu.add"> 关注问题
                </div>
                <div v-show="question.attention" class="btn-attention-cancel" @click="unfollow">已关注</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="attention-content">
          <div class="count">关注者 <span>{{question.attentionCount}}</span></div>
          <div class="headerImg">
            <img v-for="(item,index) in attentionUserList" :src="item.weixinAvatar" :key="index" class="headerImg"
                 v-if="index<8">
            <span v-show="attentionUserList.length>8">...</span>
          </div>
          <div class="userName" v-if="attentionUserList.length>0">
          <span v-for="(item,index) in attentionUserList" v-if="index<2" class="name">
            <template v-if="index>0">、</template>
            {{item.userName}}
          </span>
            <span v-show="attentionUserList.length>2">...</span>
            也关注了该问题
          </div>
        </div>
      </el-col>
    </el-row>
    <!--写回答-->
    <el-dialog title="回答问题" custom-class="answerDialog" center :visible="showAnswer" @close="hideDialog('showAnswer')">
      <div class="dialog-answer">
        <div class="questionTitle">{{question.questionTitle}}</div>
        <div class="isAnonymous" v-show="isAnonymousShow">
          启用匿名
          <el-switch v-model="isAnonymous" style="float: right"></el-switch>
        </div>
        <textarea v-model="answerContent" placeholder="输入回答"></textarea>
        <v-safeWordTip :tipType="'question'" v-show="tipShow[0]"></v-safeWordTip>

        <div style="text-align: center;margin-top:15px;">
          <el-button type="primary" @click="answerEdit()" style="width:170px">提交</el-button>
        </div>
      </div>
      <div class="safe-tip">温馨提示：应公安部网络安全规定，发帖提交后需要通过系统后台审核，审核成功后即可查看</div>
    </el-dialog>
    <!--修改标题-->
    <el-dialog title="修改问题" custom-class="questionDialog" center :visible="showEdit" @close="hideDialog('showEdit')">
      <div class="dialog-answer">
        <div class="questionTitle">{{question.questionTitle}}</div>
        <textarea class="textarea-mini" v-model="eidtQuestion" placeholder="输入问题并以问号结尾（4-50字以内）"></textarea>
        <v-safeWordTip :tipType="'question'" v-show="tipShow[1]"></v-safeWordTip>
        <textarea class="textarea-small" v-model="editQuestionDesc" placeholder="请输入问题描述(200字以内)"></textarea>
        <v-safeWordTip :tipType="'question'" v-show="tipShow[2]"></v-safeWordTip>
        <div class="message">
          <i class="icon iconfont web-jibenxinxi"></i>
          编辑理由，仅提交给管理员,由管理员确认是否修改！
        </div>
        <textarea v-model="editContent" placeholder="请输入编辑理由"></textarea>
        <div style="text-align: center;margin-top:20px;">
          <el-button type="primary" @click="editQuestion()" style="width:170px">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!--修改标题-->
    <el-dialog title="删除问题" custom-class="deleteDialog" center :visible="showDelete" @close="hideDialog('showDelete')">
      <div class="dialog-answer">
        <div class="questionTitle">{{question.questionTitle}}</div>
        <div class="message">
          <i class="icon iconfont web-jibenxinxi"></i>
          仅提交给管理员,由管理员确认是否删除！
        </div>
        <textarea v-model="deleteContent" placeholder="请输入删除原因"></textarea>
        <div style="text-align: center;margin-top:20px;">
          <el-button type="primary" @click="deleteQuestion()" style="width:170px">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  export default {
    mixins: [mixins],
    data() {
      return {
        isEdit: false,
        questionId: '',
        question: {},
        topicList: [],
        // isOwner: false,
        showAnswer: false,
        showEdit: false,
        showDelete: false,
        showRelated: false,
        answerContent: '',
        editContent: '',
        editQuestionDesc: '',
        eidtQuestion: '',
        deleteContent: '',
        isAnonymous: false,
        isAnonymousShow: true,
        attentionUserList: [],
        answerData: {},
        userId: '',
        sensitiveType: 'question'
      }
    },
    props: {
      detailObject: Object
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.questionId = this.$route.query.questionId
      this.answerId = this.$route.query.answerId
      if (this.answerId) {
        this.getAnswerDetail()
      }
      if (this.detailObject) {
        this.question = this.detailObject
        this.topicList = this.detailObject.topicList
      }
      this.getQuestionAttentionUserList()
    },
    mounted() {
    },
    // 方法
    methods: {
      linkTopic(item) {
        this.$router.push({path: '/xhTopic', query: {topicId: item.topicId}})
      },
      showDialog(type, key) {
        if (type === 'showAnswer') {
          if (key == 'edit') {
            this.isAnonymousShow = false
            this.showAnswer = true
            this.isEdit = true
            this.answerContent = this.answerData.answerContent
          } else if (key == 'show') {
//            this.$router.push({
//              path: '/xhAnswerDetail',
//              query: {questionId: this.question.questionId, answerId: this.question.replyAnswerId}
//            })
//            location.href = location.href
            this.$router.push({
              path: '/transfer',
              query: {url: '/xhAnswerDetail?questionId=' + this.question.questionId + '&answerId=' + this.question.replyAnswerId}
            })
          } else if (key == 'answer') {
            this.isAnonymousShow = true
            this.showAnswer = true
            this.isEdit = false
          }
        } else if (type === 'showEdit') {
          this.showEdit = true
          this.eidtQuestion = this.question.questionTitle
          this.editQuestionDesc = this.question.questionDescription
        } else if (type == 'showDelete') {
          this.showDelete = true
        }
      },
      hideDialog(type) {
        if (type === 'showAnswer') {
          this.showAnswer = false
        } else if (type === 'showEdit') {
          this.showEdit = false
        } else if (type == 'showDelete') {
          this.showDelete = false
        }
      },
      // 获取问题关注者列表
      getQuestionAttentionUserList() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getQuestionAttentionUserList,
          params: {
            userId: this.userId,
            questionId: this.questionId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.attentionUserList = res.data.returnObject
          } else {
            this.attentionUserList = []
          }
        })
      },
      unfollow(item, index) {
        this.$confirm('确定要取消关注吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$api.xinhu.unFollow,
            method: 'DELETE',
            params: {
              userId: this.userId,
              concernedId: this.questionId,
              attentionType: 1
            }
          }).then((res) => {
            if (res.data.returnCode == 200) {
              this.question.attention = false
              this.question.attentionCount = this.question.attentionCount - 1
              this.getQuestionAttentionUserList()
            }
          })
        }).catch(() => {
        })
      },
      // 关注问题
      addAttention() {
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_QUESTION',
            concernedId: this.questionId,
            concernedTitle: this.question.questionTitle,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '关注成功'})
            this.question.attention = true
            if (this.question.attentionCount) {
              this.question.attentionCount = this.question.attentionCount + 1
            } else {
              this.question.attentionCount = 1
            }
            this.getQuestionAttentionUserList()
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '关注失败，请重试'})
          }
        }).catch((err) => {

        })
      },
      answerEdit() {
        if (this.isEdit) {
          this.editAnswer()
        } else {
          this.answerQuestion()
        }
      },
      // 编辑回答
      editAnswer() {
        if (this.checkWordQuestion(this.answerContent)) {
          this.$set(this.tipShow, 0, true)
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }
        if (!this.answerContent) {
          this.$vux.toast.show({text: '回答内容不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.editAnswer,
          params: {
            questionId: this.$route.query.questionId,
            answerId: this.$route.query.answerId,
            answerContent: this.answerContent,
            userId: this.userId
            // isAnonymous: this.isAnonymous
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            let qid = res.data.returnObject.questionId
            let aid = res.data.returnObject.answerId
            location.href = location.href
            // this.$router.push({path: '/xhAnswerDetail', query: {from: 'answer', questionId: qid, answerId: aid}})
            this.addUserAnswerMsg(aid, qid, this.question, this.isAnonymous)
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        }).catch((err) => {
        })
      },
      // 回答问题
      answerQuestion() {
        if (this.checkWordQuestion(this.answerContent)) {
          this.$set(this.tipShow, 0, true)
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }

        if (!this.answerContent) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '回答内容不能为空'})
          return false
        }
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addAnswer,
          params: {
            questionId: this.questionId,
            questionTitle: this.question.questionTitle,
            answerContent: this.answerContent,
            isAnonymous: this.isAnonymous,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            // this.$vux.toast.show({text: '提交成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            let qid = res.data.returnObject.questionId
            let aid = res.data.returnObject.answerId
            this.$router.push({
              path: '/xhAnswerDetail',
              query: {from: 'xhQuestionDetail', questionId: qid, answerId: aid}
            })
            this.addUserAnswerMsg(aid, qid, this.question.questionTitle, this.isAnonymous)
            location.href = location.href
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'success', duration: 3000, message: err.message})
        })
      },
      // 回答后回答通知接口
      addUserAnswerMsg(answerId, questionId, questionTitle, isAnonymous) {
        this.$http({
          method: 'POST',
          url: this.$api.userMsg.addUserAnswerMsg,
          params: {
            answerId: answerId,
            questionId: questionId,
            questionTitle: questionTitle,
            isAnonymous: isAnonymous,
            userId: this.userId
          }
        }).then((res) => {

        })
      },
      // 编辑问题申请
      editQuestion() {
        if (this.checkWordQuestion(this.eidtQuestion)) {
          this.$set(this.tipShow, 1, true)
          return false
        } else {
          this.$set(this.tipShow, 1, false)
        }
        if (this.checkWordQuestion(this.editQuestionDesc)) {
          this.$set(this.tipShow, 2, true)
          return false
        } else {
          this.$set(this.tipShow, 2, false)
        }
        if (this.eidtQuestion.length < 4) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '问题请输入至少4个字'})
          return false
        }
        if (this.editQuestionDesc.length > 200) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '问题描述200个字以内'})
          return false
        }
        if (!this.editContent) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '编辑理由不能为空'})
          return false
        }
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addEditQuestionApplication,
          params: {
            questionId: this.questionId,
            questionTitle: this.question.questionTitle,
            questionDescription: this.editQuestionDesc,
            applicationType: 'EDIT',
            reason: this.editContent,
            applicationContent: this.eidtQuestion,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '提交成功'})
            this.showEdit = false
          } else {
            // this.$vux.toast.show({text: res.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err)
          // this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 删除问题申请
      deleteQuestion() {
        if (!this.deleteContent) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '删除原因不能为空'})
          return false
        }
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addEditQuestionApplication,
          params: {
            questionId: this.questionId,
            questionTitle: this.question.questionTitle,
            questionDescription: '',
            applicationType: 'DEL',
            reason: this.deleteContent,
            applicationContent: '',
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '提交成功'})
            this.showDelete = false
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        }).catch((err) => {

        })
      },
      // 回答详情
      getAnswerDetail() {
        this.$http({
          methods: 'GET',
          url: this.$api.xinhu.getAnswerDetails,
          params: {
            answerId: this.answerId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.answerData = res.data.returnObject;
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @mixin btn {
    height: 35px;
    line-height: 35px;
    border-radius: 5px;
    font-size: 15px;
    text-align: center;
    cursor: pointer;
  }
  .xhDetailTop {
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #e3e3e3;
    .title-content {
      width: 100%;
      padding-bottom: 20px;
      .question-topic {
        min-height: 84px;
      }
      .topicList {
        padding: 12px 12px 0 12px;
        span {
          cursor: pointer;
          display: inline-block;
          margin-right: 10px;
          border-radius: 12px;
          padding: 3px 10px;
          font-size: 16px;
          color: #ffb148;
          background-color: #ffefda;
          margin-bottom: 5px;
        }
      }
      .questionTitle {
        font-size: 18px;
        color: #323232;
        padding: 12px 12px 0 12px;
        display: flex;
        .auditButton {
          display: inline-block;
          width: 66px;
          height: 18px;
          border-radius: 9px;
          border: 1px solid #fb4319;
          font-size: 12px;
          margin-left: 10px;
          text-align: center;
          color: #fb4319;
          align-self: center;
        }
      }
      .questionDesc {
        font-size: 14px;
        color: #aeaeae;
        padding: 12px 12px 0 12px;
      }
      .btn-content {
        padding: 12px 12px 0 12px;
        .btn-write {
          @include btn;
          width: 100px;
          background-color: #ffb148;
          color: #fff;
          img {
            position: relative;
            top: 3px;
            width: 15px;
          }
        }
        .btn-edit {
          @include btn;
          width: 100px;
          border: 1px solid #ffb148;
          color: #ffb148;
          /*margin-left: 20px;*/
        }
        .btn-attention {
          @include btn;
          width: 110px;
          border: 1px solid #ffb148;
          color: #ffb148;
          float: right;
        }
        .btn-attention-cancel {
          @include btn;
          width: 90px;
          border: 0;
          color: #8d8d8d;
          background-color: #f0f2f5;
          float: right;
        }
      }

    }
    .attention-content {
      margin: 0 0 0 5px;
      padding: 0 10px;
      width: 100%;
      min-height: 110px;
      border-left: 1px solid #e3e3e3;
      .count {
        font-size: 17px;
        color: #8d8d8d;
        span {
          display: inline-block;
          margin-left: 5px;
          font-size: 20px;
        }
      }
      .headerImg {
        margin: 8px 0;
        img {
          width: 35px;
          height: 35px;
          margin-left: -8px;
          border-radius: 50%;
          &:first-child {
            margin-left: 0;
          }
        }
      }
      .userName {
        font-size: 12px;
        color: #aeaeae;
        display: flex;
        align-items: center;
        .name {
          display: inline-block;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .questionDialog {
      width: 620px;
      .el-dialog__title {
        color: #ffb148;
      }
    }
    .deleteDialog {
      width: 620px;
      .el-dialog__title {
        color: #ffb148;
      }
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
        height: 55px;
      }
      .textarea-small {
        height: 80px;
      }
      .message {
        color: #ffb148;
        background-color: #f0f1f5;
        line-height: 30px;
        margin-bottom: 6px;
        padding: 0 5px;
        border-radius: 5px;
      }

    }
    .safe-tip {
      position: absolute;
      bottom: 5px;
      right: 5px;
      color: #aeaeae;
      font-size: 12px;
      text-align: right;
      margin-top: 10px;
    }
  }
</style>
