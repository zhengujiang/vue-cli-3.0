<template>
  <!--实时关注-->
  <div id="xhRealTime">
    <div v-if="xhAnswerListData.length>0">
      <el-card v-for="(item,index) in xhAnswerListData" :key="index" @click="xhAnswerToDetail(item)"
               class="list-box-card" shadow="never" body-style="padding:12px">
        <div class="list-title">
          <a :href="'/xhAnswerDetail?questionId='+item.questionId+'&answerId='+item.answerId" target="_blank"
             v-if="item.answerContent">{{item.questionTitle}}</a>
          <a :href="'/xhQuestionDetail?questionId='+item.questionId" target="_blank" v-else>{{item.questionTitle}}</a>
        </div>
        <div class="list-content hiddenLine2" v-if="item.answerContent">
          <a :href="'/xhAnswerDetail?questionId='+item.questionId+'&answerId='+item.answerId" target="_blank">
            <span>{{item.anonymous? '匿名用户：':item.answerUserName}}</span>
            <span v-if="item.answerUserName">：</span>{{item.answerContent | answer}}
          </a>
        </div>
        <div class="list-about" v-if="item.answerContent">
          <span v-if="item.answerCount > 0">{{item.answerCount}}个回答 <i class="split">|</i></span>
          <span v-if="item.approveCount > 0">{{item.approveCount}}个赞同 <i class="split">|</i></span>
          <span v-if="item.attentionCount > 0">{{item.attentionCount}}个关注 <i class="split">|</i></span>
          <span>{{$common.transTime(item.createTime)[1]}}</span>
          <!--<span>{{item.updateTime.split(' ')[0]}}</span>-->
        </div>
        <div class="list-about" v-else>
          <span>{{$common.transTime(item.createTime)[1]}}</span>
        </div>
      </el-card>
    </div>
    <div v-else>
      <el-card class="list-box-card" shadow="never" body-style="padding:12px">
        <v-noInfo></v-noInfo>
      </el-card>
    </div>
    <div style="margin:20px 0 20px 0; text-align: center" class="xhlist-pagination" v-if="xhAnswerListData.length>0">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     layout="prev, pager, next" :total=pageNum>
      </el-pagination>
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
    name: "xhRealTime",
    data() {
      return {
        xhAnswerListData: [],
        dataList: [{'nowPage': '1'}],
        pageNum: 1,
        pageSize: 30,
        total: 50
      }
    },
    created() {
      this.getRealTimeData()
    },
    filters: {
      answer: function (answerContent) {
        if (!answerContent) {
          return ''
        }
        if (answerContent.length > 300) {
          return answerContent.substring(0, 300) + '...'
        } else {
          return answerContent
        }
      }
    },
    // 使用其它组件
    methods: {
      handlePageChange() {
        this.pageNum = 1;
        this.getRealTimeData();
      },
      //
      xhToPersonal() {
        this.$router.push({path: '/xhMy', query: {'otherUserId': this.$api.xinhuUserId}})
      },
      handleSizeChange(val) {
        this.dataList[0].nowPage = val
        this.getRealTimeData()
      },
      handleCurrentChange(val) {
        this.dataList[0].nowPage = val;
        this.$array.scrollToTop();
        this.getRealTimeData()
      },
      getRealTimeData() {
        this.$http({
          url: this.$api.xinhu.listQuestions,
          method: 'GET',
          params: {
            viewType: 'REAL_TIME_ATTENTION',
            pageNum: this.dataList[0].nowPage,
            pageSize: this.pageSize,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnObject) {
            this.xhAnswerListData = res.data.returnObject.list
            this.pageNum = Math.ceil(res.data.returnObject.count / 10) * 10
            if (this.pageNum > 10) {
              this.pageShow = true
            } else {
              this.pageShow = false
            }
          } else {
            this.pageShow = false
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
  #xhRealTime {
    a {
      display: block;
      color: inherit;
    }
    width: 100%;
    min-height: 1px;
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

