<template>
  <!--精选回答-->
  <div id="xhAnswer">
    <template v-if="xhAnswerListData.length>0">
      <el-card v-for="(item,index) in xhAnswerListData" :key="index" @click="xhAnswerToDetail(item)"
               class="list-box-card" shadow="never" body-style="padding:12px">
        <div class="list-title">
          <a :href="'/xhAnswerDetail?questionId='+item.questionId+'&answerId='+item.answerId" target="_blank"
             v-if="item.answerContent">{{item.questionTitle}}</a>
          <a :href="'/xhQuestionDetail?questionId='+item.questionId" target="_blank" v-else>{{item.questionTitle}}</a>
        </div>
        <div class="list-content hiddenLine2" v-if="item.answerContent">
          <a :href="'/xhAnswerDetail?questionId='+item.questionId+'&answerId='+item.answerId" target="_blank">
            <span>{{item.anonymous? '匿名用户：':item.userName}}</span>
            <span v-if="item.userName">：</span>{{item.answerContent | answer}}
          </a>
        </div>
        <div class="list-about">
          <span v-if="item.answerCount > 0">{{item.answerCount}}个回答 <i class="split">|</i></span>
          <span v-if="item.approveCount > 0">{{item.approveCount}}个赞同 <i class="split">|</i></span>
          <span v-if="item.attentionCount > 0">{{item.attentionCount}}个关注 <i class="split">|</i></span>
          <!--<span>{{$common.transTime(item.updateTime)[1]}}</span>-->
          <span>{{item.updateTime.split(' ')[0]}}</span>
        </div>
      </el-card>
    </template>
    <template v-else>
      <el-card class="no-info-box-card" shadow="never" body-style="padding:12px">
        <v-noInfo></v-noInfo>
      </el-card>
    </template>
    <div class="xhlist-pagination" v-if="xhAnswerListData.length>0">
      <el-pagination class="vxa-footer-page-pagination" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" layout="prev, pager, next" :total="total"
                     :current-page="pageNum" :page-size="pageSize"></el-pagination>
      <div class="button-group">
        <el-radio-group size="mini" v-model="pageSize" @change="handlePageChange">
          <el-radio-button label="30">30条</el-radio-button>
          <el-radio-button label="50">50条</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "xhAnswer",
    data() {
      return {
        xhAnswerListData: [],
        dataList: 1,
        pageNum: 1,
        pageSize: 30,
        total: 50
      }
    },
    props: {
      topicId: {
        type: String,
        default: ''
      }
    },
    // 使用其它组件
    filters: {
      answer: function (answerContent) {
        if (answerContent.length > 300) {
          return answerContent.substring(0, 300) + '...'
        } else {
          return answerContent
        }
      }
    },
    created() {
      this.getAnswerData()
    },
    methods: {
      handlePageChange() {
        this.pageNum = 1;
        this.getAnswerData()
      },
      xhToPersonal() {
        this.$router.push({path: '/xhMy', query: {'otherUserId': this.$api.xinhuUserId}})
      },
      handleSizeChange(val) {
        this.pageNum = val;
        this.getAnswerData()
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.$array.scrollToTop();
        this.getAnswerData()
      },
      getAnswerData() {
        this.$http({
          url: this.$api.xinhu.listSiftAnswer,
          method: 'GET',
          params: {
            topicId: this.topicId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnObject) {
            this.xhAnswerListData = res.data.returnObject.list;
            this.total = res.data.returnObject.count;
          }
        })
      },
      xhAnswerToDetail(evt) {
        if (evt.answerContent) {
          this.$router.push({path: '/xhAnswerDetail', query: {questionId: evt.questionId, answerId: evt.answerId}})
        } else {
          this.$router.push({path: '/xhQuestionDetail', query: {questionId: evt.questionId}})
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  #xhAnswer {
    width: 100%;
    min-height: 1px;
    a {
      display: block;
      color: inherit;
    }
    .list-box-card {
      cursor: pointer;
      margin-bottom: 15px;
      .list-title {
        font-size: 17px;
        color: #323232;
        padding-bottom: 12px;
        border-bottom: 1px solid #e4e7ed;
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
        border-top: 1px solid #e4e7ed;
        margin-top: -1px;
        cursor: default;
      }
    }

  }
</style>

