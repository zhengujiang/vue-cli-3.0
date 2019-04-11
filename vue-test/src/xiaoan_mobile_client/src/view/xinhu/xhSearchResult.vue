<template>
  <div id="xhSearchResult" class="v-content">
    <div class="searchBox">
      <div class="search"  @click="clearResult">
        <!--<input v-model="searchWord" type="text"  placeholder="搜索关键词" readonly="readonly">-->
        <div class="spanBox">
          <span v-for="(item,index) in searchWordArray" :key="index" class="wordspan" @click.stop="deleteSearchWord(index)">{{item | textHide}}
          <i class="icon iconfont closeInputVals icon-X"></i></span>
        </div>


        <span class="allCount">{{allCount}}条 </span>
        <!---->
      </div>
      <div> <i class="icon iconfont icon-tripsousuo"  @click="clearResult"></i></div>
    </div>
    <template v-if="topicList.length>0">
      <div class="huati fcolor3"><span>话题</span></div>
      <!--<v-topicItem :keyWord="keyWord" stype="gz"></v-topicItem>-->
      <div class="topicItem" v-for="(item, index) in topicList" :key="index">
        <div class="imgbox" @click="goTopicDetiale(item)">
          <img class="topicImg" :src="item.topicImage">
        </div>
        <div class="textBox" @click="goTopicDetiale(item)">
          <div class="title" v-html="hightLignt(item.topicName)"></div>
          <div>
            <span>{{item.attentionCount?item.attentionCount:0}}个关注</span>
            <span class="split">|</span>
            <span>{{item.relatedQuestionCount}}个问题</span>
          </div>
        </div>
        <div class="guanzuBox">
          <!--<span v-show="!item.attention" class="add" @click="addAttention(item)">
            <i class="icon iconfont icon-jia2"></i>关注
          </span>
          <span v-show="item.attention"  class="delete" @click="unfollow(item.topicId,index)">已关注</span>-->
          <img v-show="item.attention" @click="unfollow(item.topicId,index)" :src="includesImg" class="focus includess delete">
          <img  v-show="!item.attention" @click="addAttention(item)" :src="offIncludes" class="focus includess add">
        </div>
      </div>
    </template>


    <div class="scrollBox">
      <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
        <v-listItem :item="item" v-for="(item,index) in dataList.data" :key="index"  listType="search"></v-listItem>
      </ul>
      <p class="infinite-loading">
        <xiaoan-drop v-model="dataList.hasNext"></xiaoan-drop>
      </p>
    </div>
    <!--<v-listItem :data="dataList" @click="handleListItem"></v-listItem>-->

  </div>
</template>

<script>
  import drop from "@/components/warning/drop"
  import topicItem from "@/view/xinhu/components/topicItem"
  import listItem from "@/view/xinhu/components/listItem"
  import search from './components/search.vue'
  export default {
    data() {
      return {
        includesImg: this.$image.personal.closefoc,
        offIncludes: this.$image.personal.foc,
        searchWord: '',
        searchWordArray: [],
        keyWord: '',  // 话题搜索关键词
        userId: '',
        dataList: {
          data: [],
          nowPage: 1,
          hasNext: true
        },
        topicList: [],
        allCount: 0
      }
    },
    // 使用其它组件
    components: {
      'xiaoan-drop': drop,
      'v-topicItem': topicItem,
      'v-listItem': listItem,
      'v-search': search
    },
    computed: {},
    filters: {
      textHide: function (value) {
        if (value.length > 10) {
          value = value.substring(0, 10) + '...'
        }
        return value
      }
    },
    watch: {

    },
    activated () {

    },
    beforeRouteEnter(to, form, next) {
      next(vm => {
        if (form.name != 'xhAnswerDetaile' && form.name != 'xhQuestionDetaile' && form.name != 'xhTopic') {
          vm.keepAliveData()
          vm.dataList = {
            data: [],
            nowPage: 1,
            hasNext: true
          }
          vm.topicList = []
          vm.allCount = 0
          vm.searchWord = vm.searchWordArray.join(',')
          vm.searchQuestions()
        }
      })
    },
    // 生命周期函数
    created() {
      let userId = this.$cookie.getCookie('userId')
      if (!this.$cookie.isLogin()) {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href)
      }
      this.keepAliveData()
    },
    mounted() {
    },
    // 方法
    methods: {
      keepAliveData () {
        this.searchWord = this.$route.query.key
        this.searchWord = this.searchWord.replace(/,$/, '').replace(/^,/, '')
        if (this.searchWord.indexOf(' ') > -1) {
          this.searchWord = this.searchWord.split(' ').join(',')
        }
        this.searchWordArray = this.searchWord.split(',')
        // this.keyWord = this.searchWord
        this.userId = this.$cookie.getCookie('userId')
        // this.listTopic()
      },
      goTopicDetiale (item) {
        this.$router.push({path: '/xhSearchResult', query: {key: this.$route.query.key, keep: 1}})
        this.$router.push({path: '/xhTopic', query: {topicId: item.topicId}})
      },
      hightLignt (value) {
        if (this.searchWord.indexOf(',') > -1) {
          let searchWordArr = this.searchWord.split(',')
          for (let i in searchWordArr) {
            if (searchWordArr[i]) {
              var reg = new RegExp('(' + searchWordArr[i].replace('*', '') + ')', 'gmi')
              value =  value.replace(reg, '<span class="hightLight">$1</span>')
            }
          }
          return value
        } else {
          var reg = new RegExp('(' + this.searchWord.replace('*', '') + ')', 'gmi')
          return value.replace(reg, '<span class="hightLight">$1</span>')
        }

      },
      clearResult () {
        this.$router.push('/xhSearch?key='+this.searchWordArray.join(' '))
      },
      goSearchResult() {
        this.keyWord = this.searchWord
      },
      loadMore() {
        if (this.dataList.hasNext) {
          setTimeout(() => {
            this.searchQuestions()
          }, 1000)
        }
      },
      // 取消关注
      unfollow (topicId, index) {
        let _this = this
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消关注吗？',
          // 组件除show外的属性
          onConfirm () {
            /*_this.$http ({
              url: _this.$api.xinhu.unFollow,
              method: 'DELETE',
              params: {
                concernedId: topicId,
                attentionType: 0
              }
            })*/
            let params = {
              concernedId: topicId,
              attentionType: 0
            }
            _this.$axios.xinhu.unFollow(params).then((res) => {
              if (res.data.returnCode == 200) {
                _this.topicList[index].attention = false
              }
            })
          },
          onCancel () {
          }
        })
      },
      // 删除关键词操作
      deleteSearchWord (index) {
        this.searchWordArray.splice(index, 1)
        if (this.searchWordArray.length === 0) {
          this.$router.push('/xhSearch?key='+this.$route.query.key)
        } else {
          this.dataList = {
            data: [],
            nowPage: 1,
            hasNext: true
          }
          this.searchWord = this.searchWordArray.join(',')
          this.searchQuestions()
        }

      },
      // 搜索 问题列表
      searchQuestions () {
        let params = {
          keyword: this.searchWord,
          pageNum: this.dataList.nowPage,
          pageSize: 10
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listQuestion,
          params: {
            keyword: this.searchWord,
            pageNum: this.dataList.nowPage,
            pageSize: 10
          }
        })*/
        this.$axios.xinhu.listQuestion(params).then((res) => {
          if (res.data.returnCode === 200) {
            if (this.dataList.nowPage === 1) {
              this.dataList.data = []
              this.topicList = []
            }

            if (res.data.returnObject.topicList) {
              if (this.dataList.nowPage === 1) {
                this.topicList = res.data.returnObject.topicList
              }
            }
            if (res.data.returnObject.list) {
              let list = res.data.returnObject.list
              for (let i in list) {
                list[i].questionTitle = this.hightLignt(list[i].questionTitle)
                /* if (list[i].bestAnswer) {
                  let bestAnswer = JSON.parse(list[i].bestAnswer)
                  list[i].answerContent = bestAnswer.answerContent
                  list[i].answerId = bestAnswer.answerId
                  list[i].userName = bestAnswer.userName
                } */
              }

              this.dataList.data = this.dataList.data.concat(list)
              this.allCount = res.data.returnObject.count

              let page = 1
              let allCount = res.data.returnObject.count
              if (allCount % 10 == 0) {
                page = parseInt(allCount / 10)
              } else {
                page = parseInt(allCount / 10) + 1
              }
              if (this.dataList.nowPage >= page) {
                this.dataList.hasNext = false
              } else {
                this.dataList.nowPage += 1
              }
            } else {
              this.dataList.hasNext = false
            }

          } else {
            this.dataList.hasNext = false
          }
        }).catch((err) => {

        })
      },
      addAttention (item) {
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_TOPIC',
            concernedId: item.topicId,
            concernedTitle: item.topicName
          }
        })*/
        let params = {
          attentionType: 'ATTENTION_TOPIC',
          concernedId: item.topicId,
          concernedTitle: item.topicName
        }
        this.$axios.xinhu.addAttention(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '关注成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            let topicListArr = this.topicList
            for (let i in topicListArr) {
              if (topicListArr[i].topicId == item.topicId) {
                topicListArr[i].attention = true
              }
            }
            this.topicList = topicListArr
            this.$MTAmethod.mtaShare('th7Yz7CYvV',{'27c8sycs4q':'true'})
          } else {
            this.$vux.toast.show({text: res.data.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      },
      handleListItem (item) {
        alert(item.gz)
      }
    }
  }
</script>

<style lang="scss">
  #xhSearchResult {
    height: 92%;
    background-color:#f0f1f5;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .highLight {
      font-family: PingFangSC-Medium;
    }
    .searchBox {
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
        padding:0 5px;
        position: relative;
        background: white;
        border-radius: 2px;
        overflow: hidden;
        overflow-x: auto;
        color: #8d8d8d;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
        flex-wrap: nowrap;
        .allCount{
          color: #8d8d8d;
          font-size: 12px;
          font-weight: normal;
        }
        span {
          flex-shrink: 0;
        }
        .spanBox {
          width: 90%;
          height: 100%;
          position: relative;
          border-radius: 2px;
          overflow: hidden;
          overflow-x: auto;
          display: flex;
          align-items: center;
          font-size: 15px;
          flex-wrap: nowrap;
          margin-right: 5px;
          &::-webkit-scrollbar {
            display: none;
            opacity: 0;
          }
        }
        .wordspan {
          display: inline-block;
          padding: 1px 5px;
          background-color: #fff2e1;
          height: 25px;
          margin-right: 5px;
        }
        .icon-X {
          font-size: 14px;
        }
        /* input {
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
        i {
          color: #c1c1c1;
        }
        */
      }
      .icon-tripsousuo {
        font-size: 26px;
        color: #8d8d8d;
      }
    }
    .huati {
      height: 40px;
      padding: 0 12px;
      background-color: #fff;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        width:100%;
        border-bottom: 1px solid #e3e3e3;
      }
    }
    .topicItem {
      height: 65px;
      padding:10px 12px;
      background-color: #fff;margin-bottom: 10px;
      /*border-bottom: 1px solid #e3e3e3;*/

      &>div {
        float:left ;
      }
      .topicImg {
        width:45px;
        height: 45px;
        border-radius: 4px;
      }
      .guanzhuImg {
        width: auto;
        height: .64rem;
      }
      .textBox{
        padding:2px 10px 5px 10px;
        width:70%;
        .title {
          font-size: 15px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .split {
          display: inline-block;
          margin:0 2px !important;
        }
        div:last-child{
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 12px;color:#aeaeae;
        }
      }
      .guanzuBox {
        display: inline-block;
        float:right;
        margin-top: 10px;
        font-size: 14px;
        .focus{
          width: auto;height: 24px;border-radius: 0%;
        }
        /*.add {*/
        /*padding:3px 3px;*/
        /*min-width:64px;*/
        /*display: inline-block;*/
        /*color: #ffb148;*/
        /*background-color:#fff;*/
        /*border: 1px solid #ffb148;*/
        /*border-radius: 2px;*/
        /*}*/
        /*.delete {*/
        /*padding:3px 7px;*/
        /*min-width: 64px;*/
        /*display: inline-block;*/
        /*color:#8d8d8d;*/
        /*background-color:#f0f1f5;*/
        /*border: 1px solid #f0f1f5;*/
        /*}*/
        .icon {
          color: #ffb148;
        }
      }
    }
  }
</style>
