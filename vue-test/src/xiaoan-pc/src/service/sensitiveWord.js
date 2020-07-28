export default {
  data() {
    return {
      sensitiveWordQuestion: [],
      sensitiveWordSearch: [],
      tipShow: [false, false, false, false, false, false, false, false, false, false, false, false]
    }
  },
  created() {
    // if (this.sensitiveType == 'question') {
    //   this.getSensitiveWord(1)
    //   this.getSensitiveWord(2)
    // } else {
    //   this.getSensitiveWord(2)
    // }
  },
  methods: {
    // 1:发帖敏感词；2：搜索敏感词
    getSensitiveWord(type) {
      this.$http({
        method: 'GET',
        url: this.$api.xinhu.getSensitiveWord,
        params: {
          type: type
        }
      }).then((res) => {
        if (res.data.returnCode == 200) {
          if (type == 1) {
            this.sensitiveWordQuestion = res.data.returnObject
            // localStorage.setItem('sensitiveWord_question', this.sensitiveWord)
          } else {
            this.sensitiveWordSearch = res.data.returnObject
            // localStorage.setItem('sensitiveWord_search', this.sensitiveWord)
          }
        }
      }).catch((err) => {

      })
    },
    checkWordSearch(word) {
      let rtn = false
      this.sensitiveWordSearch.forEach(item => {
        if (word.indexOf(item) > -1) {
          rtn = true
        }
      })
      console.log('21321', rtn);
      return rtn
    },
    checkWordQuestion(word) {
      let rtn = false
      this.sensitiveWordQuestion.forEach(item => {
        if (word.indexOf(item) > -1) {
          rtn = true
        }
      })
      console.log('21321', rtn);
      return rtn
    }
  }
}
