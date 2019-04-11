<template>
  <div id="xhSearchWord">
    <div class="searchBox">
      <div class="search">
        <input type="text" v-model="searchWord" placeholder="搜索关键词,多个关键词空格隔开" @input="searchInput">
        <i v-show="searchWord" class="icon iconfont closeInputVals icon-X" @click="clear"></i>
      </div>
      <div><i class="icon iconfont icon-tripsousuo" @click="handleClick"></i></div>
      <ul class="autoComplate" v-show="showAutoComplate && searchWord">
        <li v-for="(item, index) in autocompleteList" @click="goQuestionDetaile(item.questionId)">
          <p v-html="item.questionTitle"></p>
        </li>
      </ul>
    </div>
    <!--<v-search :keyWord="searchWord" @click="goSearchResult" @clear="clear"></v-search>-->
    <div class="historySearch">
      <div class="dsearch">
        <div class="dseText fcolor2"><span class="dsearchbox"></span>最近搜索</div>
        <div class="dseClear" @click="clearHistorySearch">清除 <i class="icon iconfont icon-shanchu"></i></div>
      </div>
      <div class="noneHistory" v-show="historySearch.length == 0">您还没有历史记录！</div>
      <div class="dseResult dseMixHeight" v-show="historySearch.length > 0">
        <button type="button" v-for="(list, index) in historySearch" @click="setSearchWordBy(list)">{{list}}</button>
      </div>
    </div>
    <div class="hotSearch">
      <div class="dsearch">
        <div class="dseText fcolor2"><span class="dsearchbox"></span>热门搜索</div>
        <div class="dseClear" @click="getHotSearchWords">换一批 <i class="icon iconfont icon-huanyipi2"></i></div>
      </div>
      <div class="dseResult dseResultDsearch">
        <button type="button" v-for="(list, index) in hotSearchWords" @click="setSearchWordBy(list)">
          <img class="hotImg" :src="$image.xinhu.hot" v-if="index<4 && index!=0"/> {{list}}
        </button>
      </div>
      <img class="guide1" :src="$image.xinhu.guide6" v-show="showGuide">
    </div>
    <div class="cover" v-show="showGuide">
      <button class="knowBtn" @click="hideGuide()">知道了</button>
    </div>

  </div>
</template>

<script>
  import {XInput} from 'vux'
  import search from './components/search.vue'
  export default {
    data() {
      return {
        searchWord: '',
        showAutoComplate: false,
        historySearch: [],
        hotSearchWords: [],
        autocompleteList: [],
        showGuide: true,
      }
    },
    // 使用其它组件
    components: {
      XInput,
      'v-search': search
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.isShowGuide()
      this.getHotSearchWords()
      this.getHistSearch()
      // this.searchWord = this.$route.query.content
      if (this.$route.query.key) {
        this.searchWord = this.$route.query.key
      }

    },
    mounted() {
    },
    // 方法
    methods: {
      isShowGuide() {
        let xhGuide = this.$storage.get('xhGuideSearch')
        if (xhGuide) {
          this.showGuide = false
        } else {
          this.showGuide = true
        }
      },
      hideGuide() {
        this.$storage.set('xhGuideSearch', 1)
        this.showGuide = false
      },
      searchInput() {
        if (!this.searchWord) {
          return false
        }
        setTimeout(() => {
          let params = {
            keyword: this.searchWord
          }
          /*this.$http ({
            method: 'GET',
            url: this.$api.xinhu.autoComplete,
            params: {
              keyword: this.searchWord
            }
          })*/
          this.$axios.xinhu.autoComplete(params).then((res) => {
            if (res.data.returnCode === 200) {
              if (res.data.returnObject.count > 0) {
                this.showAutoComplate = true
                let obj = res.data.returnObject.list
                for (let i in obj) {
                  var reg = new RegExp('(' + this.searchWord.replace('*', '') + ')', 'gmi')
                  obj[i].questionTitle = obj[i].questionTitle.replace(reg, '<span class="hightLight">$1</span>')
                }
                this.autocompleteList = obj
              } else {
                this.showAutoComplate = false
                this.autocompleteList = []
              }
            }
          }).catch((err) => {

          })
        }, 500)
      },
      clear() {
        this.searchWord = ''
        this.showAutoComplate = false
        this.autocompleteList = []
      },
      // 点击 最近搜索，热门搜索
      setSearchWordBy(key) {
        this.searchWord = key
        this.searchInput()
      },
      // 清除最近搜索
      clearHistorySearch() {
        localStorage.removeItem('xhHistorySearch')
        this.historySearch = []
      },
      // 最近搜索
      getHistSearch() {
        let xhHistorySearch = []
        if (localStorage.getItem('xhHistorySearch')) {
          xhHistorySearch = window.JSON.parse(localStorage.getItem('xhHistorySearch'))
        }
        this.historySearch = xhHistorySearch
      },
      // 搜索按钮提交
      handleClick(evt) {
        if (!this.$array.trim(this.searchWord)) {
          this.$vux.toast.show({text: '请输入搜索关键词', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return false
        }
        if (this.$array.trim(this.searchWord).length < 2) {
          this.$vux.toast.show({text: '搜索内容大于二个字符', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return false
        }
        this.showAutoComplate = false
        this.search()
        this.$router.replace({path: '/xhSearch', query: {'key': this.searchWord}})
        this.$router.push({path: '/xhSearchResult', query: {'key': this.searchWord}})
      },
      search() {
        let xhHistorySearch = []
        if (localStorage.getItem('xhHistorySearch')) {
          xhHistorySearch = window.JSON.parse(localStorage.getItem('xhHistorySearch'))
        }
        // 删除已经存在key
        for (let i in xhHistorySearch) {
          if (xhHistorySearch[i] === this.searchWord) {
            xhHistorySearch.splice(i, 1);
          }
        }
        // 添加KEY
        xhHistorySearch.unshift(this.searchWord)
        localStorage.setItem('xhHistorySearch', window.JSON.stringify(xhHistorySearch))
        this.historySearch = xhHistorySearch
        // this.$router.push({path: '/xhSearchResult', query: this.searchWord})
      },
      goSearchResult() {
        // this.search()
        // this.$router.push({path: '/xhSearch', query: {'key': this.searchWord}})
        this.$router.push({path: '/xhSearchResult', query: {'key': this.searchWord}})
      },
      goQuestionDetaile(questionId) {
        this.search()
        this.$router.push({path: '/xhQuestionDetaile', query: {'questionId': questionId}})
      },
      getHotSearchWords() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.getHotSearchWords,
          params: {
            pageNum: 0,
            pageSize: 10
          }
        })*/
        let params = {
          pageNum: 0,
          pageSize: 10
        }
        this.$axios.xinhu.getHotSearchWords(params).then((res) => {
          if (res.data.returnCode === 200) {
            this.hotSearchWords = res.data.returnObject
            if (this.$route.query.content) {
              this.hotSearchWords.unshift(this.$route.query.content)
            }
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #xhSearchWord {
    height: 100%;
    display: flex;
    flex-direction: column;
    div {
      box-sizing: border-box;
    }
    .hightLight {
      color: #ffc051;
    }
    .searchBox {
      position: relative;
      width: 100%;
      height: 50px;
      background: #f0f1f5;
      padding: 7.5px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .search {
        width: 90%;
        height: 100%;
        position: relative;
        background: white;
        border-radius: 2px;
        overflow: hidden;
        input {
          width: 90%;
          height: 100%;
          background: #fff;
          color: #8d8d8d;
          display: inline-block;
          box-sizing: border-box;
          -webkit-appearance: none;
          border-radius: 2px;
          border: 0;
          font-size: 15px;
          padding: 7px 8px;
          outline: none;
        }
        input[type=search]::-webkit-search-cancel-button {
          -webkit-appearance: none;
        }
        input::-webkit-input-placeholder {
          font-weight: lighter !important;
        }
        i {
          color: #c1c1c1;
        }
      }
      .icon-tripsousuo {
        font-size: 26px;
        color: #8d8d8d;
      }
      .autoComplate {
        position: absolute;
        z-index: 100;
        top: 50px;
        left: 0;
        width: 100%;
        min-height: 15rem;
        background-color: #fff;
        li {
          padding: 0 12px;
          list-style-type: none;
          width: 100%;
          height: 45px;
          line-height: 1;
          font-size: 15px;
          background-color: white;
          box-sizing: border-box;
          p {
            display: inline-block;
            float: left;
            height: 45px;
            line-height: 45px;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: justify;
            border-bottom: 1px solid #e3e3e3;
          }
        }
      }
    }
    .historySearch {
      padding-top: 10px;
      .noneHistory {
        padding: 10px 0 24px 0;
        text-align: center;
        font-size: 15px;
        color: #8d8d8d;
      }
    }
    .hotSearch {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .dsearch {
      height: 45px;
      line-height: 45px;
      padding: 0 12px;
      box-sizing: border-box;
      background-color: white;
      z-index: 20;
      .icon-shanchu, .icon-huanyipi2 {
        font-size: 16px;
        color: #ffb148;
      }
      .dseText {
        font-size: 15px;
        /*color: #ffb148;*/
        display: inline-block;
        height: 45px;
      }
      .dseClear {
        display: inline-block;
        float: right;
        height: 45px;
        font-size: 15px;
        color: #ffb148;
        img {
          float: right;
          padding: 14.5px 0 0 3px;
          height: 15px;
          width: 15px;
          margin-top: 1px;
        }
      }
      .dseClear:active {
        /*background-color: #f0f1f5;*/
        opacity: 0.4;
      }
      .dsearchbox {
        display: inline-block;
        height: 15px;
        width: 2px;
        background-color: #ffb148;
        float: left;
        margin: 15px 3px 16px 0;
      }

    }
    .dseResult {
      flex-grow: 1;
      padding: 1px 12px 0 12px;
      box-sizing: border-box;
      position: relative;
      overflow-y: auto;
      button {
        display: inline-block;
        line-height: 20px;
        text-align: left;
        padding: 4px 6px;
        font-size: 13px;
        border: 1px solid #e3e3e3;
        background-color: white;
        border-radius: 2px;
        color: #8d8d8d;
        margin: 0 10px 9px 0;
        z-index: 100;
        -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      button:last-child {
        margin-right: 0 !important;
      }
      button:active {
        background-color: #f0f1f5;
        border-color: #f0f1f5;
        -webkit-transition: background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .desResBox {
        padding-right: 12px;
      }
    }
    .dseResultDsearch {
      min-height: 200px;
      padding-bottom: 20px;
      .hotImg {
        width: 10px;
      }
    }
    .dseMixHeight {
      font-weight: lighter !important;
      max-height: 114px !important;
      z-index: 10 !important;
      overflow: hidden !important;
    }
    .guide1 {
      position: absolute;
      width: 200px;
      left: 5px;
      top: 8px;
      z-index: 2001;
    }
  }
</style>
