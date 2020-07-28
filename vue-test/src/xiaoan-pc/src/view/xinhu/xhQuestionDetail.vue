<template>
  <div id="xhQuestionDetaile" class="vxa-container">
    <!-- 问题页头部 -->
    <v-xhDetailTop :detailObject="detailObject" v-if="detailObject"></v-xhDetailTop>
    <el-row :gutter="20">
      <el-col :span="18">
        <v-inviteV :questionId="questionId"></v-inviteV>
        <!--其他回答-->
        <v-other-answer-item :questionId="questionId"></v-other-answer-item>
      </el-col>
      <el-col :span="6" >
        <v-relatedQuestion :questionId="questionId" :questionTitle="question.questionTitle" v-if="question.questionTitle"></v-relatedQuestion>
        <v-ramdomv></v-ramdomv>
        <v-hotTopic></v-hotTopic>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import xhDetailTop from './components/xhDetailTop.vue'
  import hotTopic from './components/hotTopic.vue'
  import relatedQuestion from './components/relatedQuestion.vue'
  import ramdomv from './components/ramdomV.vue'
  import inviteV from './components/inviteV.vue'
  import VOtherAnswerItem from './components/xhOtherAnswerItem.vue'
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    data() {
      return {
        detailObject: null,
        isshow: false,
        questionId: '',
        from: '',
        topicList: [],
        relatedQuestionList: [],
        question: {},
        describeShow: false,
        describeShowAll: false,
        isFocus: false,
        answerList: {
          isLoading: false,
          data: [],
          nowPage: 1,
          hasNext: true,
          total: 0
        },
        clueShow: false,
        isOwner: false,
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
        userId: '',
        showGuide: true,
        attentionUserList: [],
        vInfo: [] // 大v信息列表
      }
    },
    // 使用其它组件
    components: {
      ElCol,
      ElRow,
      VOtherAnswerItem,
      'v-hotTopic': hotTopic,
      'v-relatedQuestion': relatedQuestion,
      'v-ramdomv': ramdomv,
      'v-inviteV': inviteV,
      'v-xhDetailTop': xhDetailTop
    },
    computed: {

    },
    watch: {
      '$route': function (val) {
        this.questionId = this.$route.query.questionId
        location.href = location.href
      }
    },
    // 生命周期函数
    created() {
      this.questionId = this.$route.query.questionId
      this.userId = this.$cookie.get('userId')
      // 获取问题关注者列表
      // this.getQuestionAttentionUserList()
      // this.listAnswersForQuestion()
    },
    mounted() {
      // window.scrollTo(0, 0);
      this.getQuestionDetails()
    },
    // 方法
    methods: {
      // 获取问题详情
      getQuestionDetails() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getQuestionDetails,
          params: {
            questionId: this.questionId,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject) {
            this.detailObject = res.data.returnObject
            this.topicList = res.data.returnObject.topicList
            this.question = res.data.returnObject

            if ((this.$cookie.get('userId') != this.question.createUserId) && !this.question.audit) {
                this.$message({
                showClose: true,
                type: "error",
                duration: 3000,
                message: '信息正在审核中'
                })
              this.$router.push('/xhList');
            }

            if (this.question.questionDescription.length > 50) {
              this.isshow = true
            } else {
              this.isshow = false
            }
            this.question.questionDescriptionHtml = this.question.questionDescription.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
            this.eidtQuestion = this.question.questionTitle
            this.editQuestionDesc = this.question.questionDescription
            // this.isShowDescribe()
          } else {
            this.topicList = []

          }
        })
      }

      /* goUserInfo(othersUserId) {
        this.$router.push({path: '/userOther', query: {selectUserId: othersUserId}})
      },
      linkTopic(item) {
        this.$router.push({path: '/xhTopic', query: {topicId: item.topicId}})
      },
      linkQuestion(item) {
        this.$router.push({path: '/xhRedirect', query: {from: 'questionDetaile', questionId: item.questionId}})
      },
      formatData(date) {
        if (date) {
          return this.$common.transTime(date)[1]
        } else {
          return date
        }
      },
      showDialog (type) {
        if (type === 'showAnswer') {
          this.showAnswer = true
        } else if (type === 'showEdit') {
          this.showEdit = true
        }
      },
      hideDialog (type) {
        if (type === 'showAnswer') {
          this.showAnswer = false
        } else if (type === 'showEdit') {
          this.showEdit = false
        }
      },
      seeDetaile(list) {
        this.$router.push({
          path: '/xhAnswerDetaile',
          query: {
            questionId: this.questionId,
            answerId: list.answerId
          }
        })
      },
      selectPageChange(index) {
        console.log(index);
        this.answerList.nowPage = index
        this.listAnswersForQuestion();
      },
      // 问题列表
      listAnswersForQuestion() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listAnswersForQuestion,
          params: {
            questionId: this.questionId,
            // userId: this.$cookie.getCookie('userId'),
            pageNum: this.answerList.nowPage,
            pageSize: 10,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject) {
            this.answerList.data = res.data.returnObject
            this.answerList.total = res.data.total
          }
          // 显示提示 "别让问题孤单，留个回答试试”
          if (this.answerList.data.length === 0) {
            this.clueShow = true
            // this.getRandomV()
          }
        }).catch((err) => {
          // this.answerList.hasNext = false
        })
      }, */

      /* // 获取大v信息
      getRandomV() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getRandomV,
          params: {
            vNumber: 5,
            questionId: this.questionId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.vInfo = res.data.returnObject
            /!* this.vInfo.forEach((item, index) => {
              item.isv = false
            }) *!/
          }
        })
      },
      // 邀请大V
      inviteForQuestion(id) {
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.inviteForQuestion,
          params: {
            questionId: this.questionId,
            invitedUserId: id
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '邀请成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.vInfo.forEach((item, index) => {
              if (item.id == id) {
                item.invited = true
              }
            })
          } else {
            this.$vux.toast.show({text: '邀请失败，请重试', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      }, */

      /* // 获取问题关注者列表
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
          }
        })
      },
      unfollow (item, index) {
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

      // 回答问题
      answerQuestion() {
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
            this.$router.push({path: '/xhAnswerDetail', query: {from: 'xhQuestionDetail', questionId: qid, answerId: aid}})
            this.addUserAnswerMsg(aid, qid, this.question.questionTitle, this.isAnonymous)
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.returnMsg})
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
            isAnonymous: isAnonymous
          }
        }).then((res) => {

        })
      },
      // 编辑问题申请
      editQuestion() {
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
            this.isOwner = false
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
          // this.$vux.toast.show({text: '删除原因不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500})
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
            this.$vux.toast.show({text: '提交成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.showDelete = false
            this.isOwner = false
          } else {
            this.$vux.toast.show({text: res.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      } */
    }
  }
</script>

<style lang="scss">
  #xhQuestionDetaile {
    padding:20px 0;
  }
</style>
