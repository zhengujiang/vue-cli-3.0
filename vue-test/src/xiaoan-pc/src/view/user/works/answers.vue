<template>
  <div id="works-answers">
    <header>
      <h4 class="card-title">我的回答</h4>
    </header>
    <ul class="question-list" style="min-height: 400px">
      <template v-if="questionList.length >0">
        <li v-for="(question, index) in questionList" :key="index"
            @click="goDetail(question.questionId,question.answerId)">
          <p class="title" v-line-clamp:22="1">{{question.questionTitle}}</p>
          <p class="desc" v-line-clamp:20="2">{{question.answerContent}}</p>
          <div class="info">
            <span>{{question.approveCount}}个赞同 | </span>
            <span>{{$common.transTime(question.createTime)[0]}}</span>
          </div>
        </li>
      </template>
      <v-noInfo v-else></v-noInfo>
    </ul>
    <el-pagination v-if="page.total>page.size" @current-change="currentChange" :current-page="page.index"
                   :page-size="page.size"
                   layout="prev, pager, next" :total="page.total" background style="text-align: center">
    </el-pagination>
  </div>
</template>
<script>
  export default {

    name: 'works-answers',

    data() {
      return {
        page: {
          index: 1,
          size: 5,
          total: 0
        },
        questionList: []
      }
    },
    created() {
      this.getUserAnswers();
    },
    methods: {
      getUserAnswers() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.searchUserAnswer,
          params: {
            userId: this.$cookie.get("userId"),
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page.total = res.data.total;
            this.questionList = res.data.returnObject;
          }
        }).catch(err => {
          this.questionList = [];
        });
      },
      currentChange(val) {
        this.page.index = val;
        this.getUserAnswers();
      },
      goDetail(questionId, answerId) {
        this.$router.push({path: '/xhAnswerDetail', query: {questionId, answerId}});
      }
    }
  }
</script>
<style lang="scss">
  #works-answers {
    .question-list li {
      padding: 10px 20px;
      border-bottom: 1px solid #e3e3e3;
      border-radius: 4px;
      margin: 10px 0px;
      &:hover {
        cursor: pointer;
        background-color: #f9f9f9;
      }
      .title {
        height: 22px;
        width: 100%;
        line-height: 22px;
        font-weight: bolder;
        font-size: 14px;
      }
      .desc {
        width: 100%;
        max-height: 40px;
        line-height: 20px;
        font-size: 12px;
        word-break: break-all;
        margin: 6px 0px;
      }
      .info {
        font-size: 12px;
        color: #8d8d8d
      }
    }
  }
</style>
