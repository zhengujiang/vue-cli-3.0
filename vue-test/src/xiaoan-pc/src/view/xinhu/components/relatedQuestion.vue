<template>
  <el-card id="relatedQuestion" class="box-card" shadow="never">
    <div slot="header" class="header">
      <div>
        <img class="titleImg" :src="$image.xinhu.relatedQuestion">
        <span class="fleft">相关问题</span>
      </div>
    </div>
    <ul class="listBox" v-if="relatedQuestionList.length>0">
      <li v-for="(item,index) in relatedQuestionList" class="hiddenLine2" @click="link(item.questionId)">
        <span class="disc"></span>{{item.questionTitle}}
      </li>
    </ul>
    <div class="listBox" v-else>
      暂无相关问题
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        relatedQuestionList: []
      }
    },
    props: {
      questionTitle: String,
      questionId: String
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.relatedQuestion()
    },
    mounted() {
    },
    // 方法
    methods: {
      link(id) {
        this.$router.push({path: '/xhQuestionDetail', query: {questionId: id}});
      },
      // 相关问题
      relatedQuestion() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listRelatedQuestions,
          params: {
            keyWord: this.questionTitle,
            questionId: this.questionId,
            pageNum: 1,
            pageSize: 5,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.relatedQuestionList = res.data.returnObject.list
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #relatedQuestion {
    width: 100%;
    min-height: 300px !important;
    padding: 0 12px 12px 12px;
    margin-bottom: 20px;
    .el-card__header {
      padding: 0;
    }
    .el-card__body {
      padding: 0;
      padding-top: 12px;
    }
    .header {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .titleImg {
        width: 23px;
      }
      div {
        display: flex;
        align-items: center;
      }
      .fleft {
        display: inline-block;
        margin-left: 5px;
      }
      .fright {
        display: inline-block;
        margin-right: 5px;
      }
    }
    .listBox {
      font-size: 14px;
      li {
        width: 100%;
        font-size: 14px;
        color: #323232;
        word-wrap: break-word;
        padding: 0 0 0 12px;
        margin: 8px 0;
        position: relative;
        cursor: pointer;
        max-height: 40px;
        overflow: hidden;
        line-height: 20px;
        &:hover {
          color: #ffb148;
        }
        .disc {
          display: inline-block;
          position: absolute;
          top: 6px;
          left: 0px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #aeaeae;
          margin-right: 5px;
        }
        span {
          display: inline-block;
        }
      }
    }
  }
</style>
