<template>
  <div class="xinhulist"  @click="handleClick(item)">
    <div class="title fb" v-html="item.questionTitle"></div>
    <div v-if="isShowDesc && itemAnswerContent" class="desc" v-html="itemAnswerContent"></div>
    <div class="else" >
      <span v-if="item.answerCount > 0">{{item.answerCount}}个回答 <i class="split">|</i></span>
      <span v-if="approveCount > 0">{{approveCount}}个赞同 <i class="split">|</i></span>
      <span v-if="item.attentionCount > 0">{{item.attentionCount}}个关注 <i class="split">|</i></span>
      <span>{{updateTime}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'xhListItem',
    data() {
      return {
        itemAnswerContent: '',
        itemAnswerId: '',
        updateTime: '',
        userName: '',
        approveCount: 0
      }
    },
    props: {
      item: {
        type: Object,
        default: function() {
          return {};
        }
      },
      isShowDesc: {
        type: Boolean,
        default: true
      },
      listType: {
        type: String,
        default: ''
      }
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.farmatItem()
    },
    mounted() {
    },
    // 方法
    methods: {
      farmatItem () {
        // 最新显示latestAnswer，精选，实时显示answerContent, 搜索显示bestAnswer，已处理
        if (this.listType == 'new' || this.listType == 'search') {
          let answerObj = ''
          if (this.listType == 'search') {
            answerObj = this.item.bestAnswer
          } else {
            answerObj = this.item.latestAnswer
          }
          if (answerObj) {
            let jsonObj = JSON.parse(answerObj)
            this.itemAnswerContent = jsonObj.answerContent
            this.itemAnswerId = jsonObj.answerId
            // this.userName = jsonObj.userName ? jsonObj.userName : ''
            if (jsonObj.anonymous || jsonObj.anonymous == null) {
              this.userName = '匿名用户'
            } else {
              this.userName = jsonObj.userName
            }
            if (this.userName) {
              this.itemAnswerContent = this.userName + '：' + this.itemAnswerContent
            }
            this.approveCount = jsonObj.approveCount
            this.updateTime = this.formatDataT(jsonObj.updateTime)
          } else {
            this.updateTime = this.formatData(this.item.updateTime)
          }
        } else {
          if (this.item.answerContent) {
            this.itemAnswerContent = this.item.answerContent
            this.itemAnswerId = this.item.answerId
            if (this.item.anonymous || this.item.anonymous == null) {
              this.userName = '匿名用户'
            } else {
              this.userName = this.item.userName
            }
            if (this.userName) {
              this.itemAnswerContent = this.userName + '：' + this.itemAnswerContent
            }
            this.approveCount = this.item.approveCount
          }
          this.updateTime = this.formatData(this.item.updateTime)
        }
        this.itemAnswerContent = this.$const.clearHtml(this.itemAnswerContent)
      },
      formatJson (jsonObj) {
        // let jsonObj = JSON.parse(json)
        let userName = jsonObj.userName ? jsonObj.userName + '：' : ''
        if (jsonObj.anonymous || jsonObj.anonymous == null) {
          userName = '匿名用户: '
        }
        return userName + jsonObj.answerContent // .replace(/\n/g, '<br/>')
      },
      formatDataT (date) {
        // let dateObj = JSON.parse(date).updateTime
        let dateObj = this.$const.format(date)
        return dateObj
      },
      formatData (date) {
        if (date) {
          return date.split(' ')[0]
        } else {
          return date
        }
      },
      // 没有答案跳转问题页，有答案跳转答案页
      handleClick (evt) {
        if (this.itemAnswerContent) {
          this.$router.push({path: '/xhAnswerDetaile', query: {questionId: evt.questionId, answerId: this.itemAnswerId}})
        } else {
          this.$router.push({path: '/xhQuestionDetaile', query: {questionId: evt.questionId}})
        }
      }
    }
  }
</script>

<style lang="scss">
  .xhqPadding {
    padding: 3px 10px !important;
  }
  .xinhulist {
    margin-bottom: 7.5px;
    padding: 12px;
    background-color: #fff;
    width:100%;
    &:last-child {
      margin-bottom: 0;
    }
    .title {
      margin-bottom: 5px;
      font-size: 15px;
      color: #323232;
      text-align: justify;
      font-family: PingFangSC-Medium;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .desc {
      margin-bottom: 5px;
      font-size: 13px;
      color:#545454;
      text-align: justify;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .else {
      color:#aeaeae;
      span {
        display: inline-block;font-size: 12px;
      }
      .split {
        display: inline-block;
        padding: 0 .1px;
        margin:0;
      }
    }
  }
</style>
