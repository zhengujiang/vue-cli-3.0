<template>
  <div id="searchBox">
    <div class="search">
      <input type="text" v-model="searchWord" placeholder="搜索关键词" @input="searchInput">
      <i v-show="searchWord" class="icon iconfont closeInputVals icon-X" @click="clear"></i>
    </div>
    <div><i class="icon iconfont icon-tripsousuo" @click="handleClick"></i></div>
    <ul class="autoComplate" v-show="showAutoComplate && searchWord">
      <li v-for="(item, index) in autocompleteList" @click="goQuestionDetaile(item.questionId)">
        <p v-html="item.questionTitle"></p>
      </li>
    </ul>
  </div>
</template>

<script>
  import {XInput, Toast} from 'vux'
  export default {
    data() {
      return {
        searchWord: '',
        showAutoComplate: false,
        historySearch: [],
        hotSearchWords: [],
        autocompleteList: []
      }
    },
    props: {
      keyWord: String
    },
    // 使用其它组件
    components: {
      XInput,
      Toast
    },
    computed: {},
    watch: {
      keyWord: function (val) {
        this.searchWord = val
        this.searchInput()
      }
    },
    // 生命周期函数
    created() {
      this.searchWord = this.keyWord
    },
    mounted() {
    },
    // 方法
    methods: {
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
        this.$emit('click', evt);
      },
      searchInput () {
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
                for(let i in obj) {
                  var reg = new RegExp(this.searchWord, 'gm')
                  obj[i].questionTitle = obj[i].questionTitle.replace(reg, '<span class="hightLight">'+ this.searchWord +'</span>')
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
      clear () {
        this.searchWord = ''
        this.showAutoComplate = false
        this.autocompleteList = []
        this.$emit('clear');
      },
      // 搜索按钮提交
      search () {
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
      },
      // 自动搜索下拉问题点击事件 跳转问题详情页
      goQuestionDetaile (questionId) {
        this.search()
        this.$router.push({path: '/xhQuestionDetaile', query: {'questionId': questionId}})
      }
    }
  }
</script>

<style lang="scss">
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
      .icon-tripsousuo {
        font-size: 26px;
        color: #8d8d8d;
      }
    }
    .autoComplate {
      position: absolute;
      z-index: 100;
      top:50px;
      left:0;
      width:100%;
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
</style>
