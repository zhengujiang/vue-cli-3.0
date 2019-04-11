<template>
  <div class="xhRedirect">
    <div class="success">
      <img :src="$image.personal.register" alt="">
    </div>
    <div class="text">
      <p class="text1">{{message}}！</p>
      <p class="time"><span class="two">{{ timer }}</span><span>秒</span>后将自动跳转！</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "xhRedirect",
    data() {
      return {
        timer: 2,
        from: 'question',
        message: '提问成功',
        questionId: '',
        answerId: ''
      }
    },
    mounted: function () {
      let fromType  = this.$route.query.from
      if (fromType === 'question') {
        this.from = this.$route.query.from
        this.questionId = this.$route.query.questionId
        this.message = '提问成功'
      } else if (fromType === 'answer') {
        this.from = this.$route.query.from
        this.questionId = this.$route.query.questionId
        this.answerId = this.$route.query.answerId
        this.message = '回答成功'
      }
      if (fromType === 'question' || fromType === 'answer') {
        let interval = setInterval(() => {
          this.timer--;
          if (this.timer == 0) {
            clearInterval(interval)
            if (this.from === 'question') {
              this.$router.replace("/xhQuestionDetaile?questionId=" + this.questionId)
            } else if (this.from === 'answer') {
              this.$router.replace("/xhAnswerDetaile?questionId=" + this.questionId + "&answerId=" + this.answerId)
            }
          }
        }, 1000)
      } else if (fromType === 'questionDetaile') {
        // 问题详情页刷新,直接调转
        this.questionId = this.$route.query.questionId
        this.$router.replace("/xhQuestionDetaile?questionId=" + this.questionId)
      } else if (fromType === 'answerDetaile') {
        // 问题详情页刷新,直接调转
        this.questionId = this.$route.query.questionId
        this.answerId = this.$route.query.answerId
        this.$router.replace("/xhAnswerDetaile?questionId=" + this.questionId + '&answerId=' + this.answerId)
      } else if (fromType === 'year2018') {
        // 问题详情页刷新,直接调转
        this.$router.replace("/year2018")
      }

    }

  }
</script>

<style scoped>
  .xhRedirect {
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: 150px;
    box-sizing: border-box;
  }
  .success {
    width: 63px;
    height: 63px;
    margin: 0 auto;
  }
  .success img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .text {
    width: 100%;
    height: auto;
    margin-top: 40px;
  }
  .text1, .time {
    width: 100%;
    height: auto;
    text-align: center;
    font-family: PingFangSC-Medium, sans-serif, "Microsoft Yahei", "Helvetica";
    font-size: 15px;
    color: #323232;
    margin: 12px 0;
  }
  .text1 {
    font-weight: bold;
  }
  .time span {
    color: #ffb148;
  }
</style>
