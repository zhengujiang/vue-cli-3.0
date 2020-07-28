<template>
  <div class="safe-word-tip">
    <i class="iconfont web-jibenxinxi"></i>
    {{tipMsg}}
  </div>
</template>

<script>
  export default {
    name: 'safeWordTip',
    data() {
      return {
        tipMsg: '您搜索的内容包含敏感词，请更换搜索关键词！',
        sensitiveWord: []
      }
    },
    props: {
      tipType: String,
      searchWord: String
    },
    watch: {},
    // 生命周期函数
    created() {
      if (this.tipType == 'question') {
        this.tipMsg = '你输入的内容包含敏感词，请更换！'
      }
    },
    mounted() {
    },
    // 方法
    methods: {
      // 1:发帖敏感词；2：搜索敏感词
      /* getSensitiveWord (type) {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getSensitiveWord,
          params: {
            type: type
          }
        }).then((res) => {
          if (res.data.returnCode === 200) {
            this.sensitiveWord = res.data.returnObject
          }
        }).catch((err) => {

        })
      } */
    }
  }
</script>

<style lang="scss">
  .safe-word-tip {
    display: inline-block;
    color: #FB4319;
    font-size: 12px;
    white-space: nowrap;
    .web-jibenxinxi {
      font-size: 14px;
    }
  }
</style>
