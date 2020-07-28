<template>
  <div id="xhList">
    <div class="xhListSearch vxa-image-bg-affiche">
      <div class="xhListSearchContent">
        <div class="xhSearchInput">
          <input class="xhListSearchInput" v-model="searchWord" type="text" placeholder="请输入关键词，多关键词用空格隔开"
                 @input="searchInput">
          <button @click="btnSearch">
            <i class="el-icon-search"></i>
          </button>

          <ul class="autoComplate" v-show="showAutoComplate && searchWord">
            <li v-for="(item, index) in autocompleteList" @click="goQuestionDetaile(item)">
              <p v-html="item.questionTitle"></p>
            </li>
          </ul>
          <span class="xhListQuestion pointer" @click="questionOpen">
              <img :src="$image.xinhu.edit" class="editimg">提问
          </span>
        </div>
        <v-safeWordTip v-show="tipShow[0]"></v-safeWordTip>
      </div>
    </div>
    <div class="content">
      <div class="xhListContent">
        <el-row :gutter="20" class="mtop20">
          <el-col :span="18">

            <el-card id="searchTopicList" class="box-card" shadow="never" v-if="topicList.length>0">
              <div slot="header" class="header">
                <div>
                  <span class="fleft">话题</span>
                </div>
              </div>
              <div class="listBox" v-for="(item,index) in topicList">
                <div class="item">
                  <div class="headerImg"><img class="headerImg" :src="item.topicImage" @click="goTopicDetiale(item)">
                  </div>
                  <div class="info" @click="goTopicDetiale(item)">
                    <div v-html="hightLignt(item.topicName)"></div>
                    <div class="intro">
                      <span>{{item.attentionCount?item.attentionCount:0}}个关注</span>
                      <span class="split">|</span>
                      <span>{{item.relatedQuestionCount}}个问题</span>
                    </div>
                  </div>
                  <img v-show="item.attention" @click="unfollow(item,index)"
                       :src="$image.xinhu.attentyet" class="attent">
                  <img v-show="!item.attention" @click="addAttention(item,index)"
                       :src="$image.xinhu.attent" class="attent">
                </div>
              </div>
            </el-card>

            <!--搜索列表-->
            <div id="searchQuestion" v-if="dataList.data.length>0">
              <el-card v-for="(item,index) in dataList.data" :key="index" @click="xhAnswerToDetail(item)"
                       class="list-box-card" shadow="never" body-style="padding:12px">
                <div class="list-title" @click="xhAnswerToDetail(item)" v-html="item.questionTitle"></div>
                <div class="list-content" @click="xhAnswerToDetail(item)" v-if="item.bestAnswer">
                  <span>{{item.bestAnswer.anonymous? '匿名用户':item.bestAnswer.userName}}：</span>{{item.bestAnswer.answerContent
                  | answer}}
                </div>
                <div class="list-about" v-if="item.bestAnswer">
                  <span v-if="item.answerCount > 0">{{item.answerCount}}个回答 <i class="split">|</i></span>
                  <span v-if="item.bestAnswer.approveCount > 0">{{item.bestAnswer.approveCount}}个赞同 <i
                    class="split">|</i></span>
                  <span v-if="item.attentionCount > 0">{{item.attentionCount}}个关注 <i class="split">|</i></span>
                  <!--<span>{{$common.transTime(item.updateTime)[1]}}</span>-->
                  <span>{{item.updateTime.split(' ')[0]}}</span>
                </div>
                <div class="list-about" v-else>
                  <span>{{item.updateTime.split(' ')[0]}}</span>
                </div>
              </el-card>

              <div class="xhlist-pagination" v-if="dataList.data.length>0">
                <el-pagination class="vxa-footer-page-pagination" @current-change="selectPage"
                               layout="prev, pager, next" :total="allCount" :page-size="page.size"
                               :current-page="page.index">
                </el-pagination>
                <div class="button-group">
                  <el-radio-group size="mini" v-model="page.size" @change="handlePageChange">
                    <el-radio-button :label="30">30条</el-radio-button>
                    <el-radio-button :label="50">50条</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div style="min-height: 1px;" v-else>
              <el-card class="box-card" shadow="never">
                <v-noInfo></v-noInfo>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <v-ramdomv></v-ramdomv>
            <v-hotTopic></v-hotTopic>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--添加问题弹窗-->
    <v-xhQuestion :isShow="showQuestion" @questionClose="questionClose" v-if="showQuestion"></v-xhQuestion>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  import xhLaste from "./components/xhLatest"
  import xhAnswer from "./components/xhAnswer"
  import xhRealTime from "./components/xhRealTime"
  import xhInvite from "./components/xhInvite"

  import xhQuestion from "./components/xhQuestion"
  import hotTopic from './components/hotTopic.vue'
  import relatedQuestion from './components/relatedQuestion.vue'
  import ramdomv from './components/ramdomV.vue'

  export default {
    name: 'xhSearchResult',
    mixins: [mixins],
    data() {
      return {

        showQuestion: false,
        searchWord: "",
        autocompleteList: [],
        showAutoComplate: false,
        // 邀请回答弹窗
        showAnswer: false,
        // inviteQuestionTitle: '',
        isAnonymous: false,
        inviteAnswerContent: '',
        inviteItem: {},
        dataList: {
          data: [],
          nowPage: 1,
          hasNext: true
        },
        topicList: [],
        userId: '',
        allCount: 0,
        page: {
          index: 1,
          size: 30,
          total: 100
        }
      }
    },
    // 使用其它组件
    components: {
      xhLaste: xhLaste,
      xhAnswer: xhAnswer,
      xhRealTime: xhRealTime,
      'v-xhInvite': xhInvite,
      'v-hotTopic': hotTopic,
      'v-relatedQuestion': relatedQuestion,
      'v-ramdomv': ramdomv,
      'v-xhQuestion': xhQuestion
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
    computed: {},
    watch: {
      /* searchWord: function (val) {
         setTimeout(() => {
           this.searchInput()
         }, 500)
       }, */
      '$route': function (val, old) {
        this.searchWord = this.$route.query.word
        if (this.searchWord) {
          this.searchQuestions()
        }

      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.searchWord = this.$route.query.word
      this.$route.query.index ? this.page.index = parseInt(this.$route.query.index) : this.page.index = 1;
      this.$route.query.size ? this.page.size = parseInt(this.$route.query.size) : this.page.size = 30;
      if (this.searchWord) {
        this.searchQuestions()
      }
    },
    mounted() {
      document.querySelector('#xh-index').addEventListener('click', () => {
        this.showAutoComplate = false
      })
    },
    // 方法
    methods: {
      handlePageChange() {
        this.page.index = 1;
        this.$router.replace({query: Object.assign({}, this.$route.query, this.page)})
        this.searchQuestions()
      },
      // 提问关闭隐藏
      questionOpen() {
        this.showQuestion = true
      },
      questionClose() {
        this.showQuestion = false
      },
      goTopicDetiale(item) {
        // this.$router.push({path: '/xhSearchResult', query: {key: this.$route.query.key, keep: 1}})
        this.$router.push({path: '/xhTopic', query: {topicId: item.topicId}})
      },
      goQuestionDetaile(item) {
        this.$router.push({path: '/xhQuestionDetail', query: {'questionId': item.questionId}})
      },
      hightLignt(value) {
        let searchWord = this.searchWord.split(' ').join(',')
        if (searchWord.indexOf(',') > -1) {
          let searchWordArr = searchWord.split(',')
          for (let i in searchWordArr) {
            if (searchWordArr[i]) {
              let reg = new RegExp('(' + searchWordArr[i].replace('*', '') + ')', 'gmi')
              value = value.replace(reg, '<span class="hightLight">$1</span>')
            }
          }
          return value
        } else {
          let reg = new RegExp('(' + searchWord.replace('*', '') + ')', 'gmi')
          return value.replace(reg, '<span class="hightLight">$1</span>')
        }

      },
      // 取消关注
      unfollow(item, index) {
        this.$confirm('确定要取消关注吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$api.xinhu.unFollow,
            method: 'DELETE',
            params: {
              userId: this.userId,
              concernedId: item.topicId,
              attentionType: 0
            }
          }).then((res) => {
            if (res.data.returnCode == 200) {
              this.topicList[index].attention = false
              this.topicList[index].attentionCount = this.topicList[index].attentionCount - 1
            }
          })
        }).catch(() => {
        })
      },
      addAttention(item, index) {
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_TOPIC',
            concernedId: item.topicId,
            concernedTitle: item.topicName,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '关注成功'})
            this.topicList[index].attention = true
            this.topicList[index].attentionCount = this.topicList[index].attentionCount + 1
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        })
      },
      // 搜索关键词提示
      searchInput() {
        // 敏感词检测
        if (this.checkWordSearch(this.searchWord)) {
          // this.$set(this.tipShow, 0, true)
          this.showAutoComplate = false
          this.autocompleteList = []
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }

        if (!this.searchWord) {
          return false
        }
        let searchWord = this.searchWord.split(' ').join(',')
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.autoCompleteQuestionTitle,
          params: {
            keyword: searchWord
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode === 200) {
            if (res.data.returnObject.count > 0) {
              this.showAutoComplate = true
              let obj = res.data.returnObject.list
              for (let i in obj) {
                // var reg = new RegExp('(' + this.searchWord.replace('*', '') + ')', 'gmi')
                obj[i].questionTitle = this.hightLignt(obj[i].questionTitle)
              }
              this.autocompleteList = obj
            } else {
              this.showAutoComplate = false
              this.autocompleteList = []
            }
          }
        }).catch((err) => {

        })
      },
      // 搜索按钮
      btnSearch() {
        // 敏感词检测
        if (this.checkWordSearch(this.searchWord)) {
          this.$set(this.tipShow, 0, true)
          // this.tipShow[0] = true
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }

        if (!this.searchWord) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '请先输入搜索关键词'})
        } else {
          this.showAutoComplate = false
          this.$router.push({path: '/xhSearchResult', query: {word: this.searchWord}})
          this.searchQuestions()
        }
      },
      selectPage(index) {
        this.page.index = index;
        this.$router.replace({query: Object.assign({}, this.$route.query, this.page)})
        this.$array.scrollToTop()
        this.searchQuestions()
      },
      // 搜索 问题列表
      searchQuestions() {
        if (!this.searchWord) {
          return false
        }
        let searchWord = this.searchWord.split(' ').join(',')
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listQuestion,
          params: {
            keyword: searchWord,
            pageNum: this.page.index,
            pageSize: this.page.size,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200) {
            if (this.page.index === 1) {
              this.topicList = []
              this.dataList.data = []
              if (res.data.returnObject.topicList) {
                this.topicList = res.data.returnObject.topicList
              } else {
                this.topicList = []
              }
            }
            if (res.data.returnObject.list) {
              let list = res.data.returnObject.list
              for (let i in list) {
                list[i].questionTitle = this.hightLignt(list[i].questionTitle)
                if (list[i].bestAnswer) {
                  list[i].bestAnswer = JSON.parse(list[i].bestAnswer)
                }
              }
              this.dataList.data = list
              this.allCount = res.data.returnObject.count
              this.page.total = res.data.returnObject.count
            } else {
              this.dataList.data = []
            }

          }
        })
      },
      xhAnswerToDetail(evt) {
        if (!evt.bestAnswer) {
          this.$router.push({path: '/xhQuestionDetail', query: {questionId: evt.questionId}})
          return false
        }
        if (evt.bestAnswer.answerContent) {
          this.$router.push({
            path: '/xhAnswerDetail',
            query: {questionId: evt.questionId, answerId: evt.bestAnswer.answerId}
          })
        } else {
          this.$router.push({path: '/xhQuestionDetail', query: {questionId: evt.questionId}})
        }
      }
    }
  }
</script>

<style lang="scss">
  #xhList {
    .mtop20 {
      margin-top: 20px;
    }
    .xhListSearch {
      width: 100%;
      height: auto;
      padding: 38px 0 38px 0;
      .xhListSearchContent {
        width: 1200px;
        margin: 0 auto;
        .xhSearchInput {
          height: 44px;
          position: relative;
          .xhListSearchInput {
            width: 931px;
            height: 44px;
            box-shadow: 0px 0px 2px #FFB148;
            border-radius: 2px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            padding: 0 12px;
            border: none;
            float: left;
          }
          button {
            width: 125px;
            height: 44px;
            background: #ffb148;
            float: left;
            border: 0;
            outline: none;
            font-size: 22px;
            border-radius: 0;
            color: #ffffff;
            padding: 0 !important;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            -webkit-box-shadow: 0px 0px 2px #FFB148;
            box-shadow: 0px 0px 2px #FFB148;
          }
          .autoComplate {
            position: absolute;
            z-index: 100 !important;
            top: 50px;
            left: 0;
            width: 895px;
            min-height: 48px;
            background-color: #fff;
            li {
              padding: 0 12px;
              list-style-type: none;
              width: 100%;
              height: 48px;
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
                .hightLight {
                  color: #ff9933;
                }
              }
            }
          }
          .xhListQuestion {
            width: 123px;
            height: 44px;
            background: #f6debd;
            color: #ffb148;
            float: right;
            font-size: 15px;
            text-align: center;
            line-height: 44px;
            border: 1px solid #ff9933;
            border-radius: 4px;
            .editimg {
              position: relative;
              top: 2px;
              /*left: 30px;*/
              width: 15px;
              /*height: 19px;*/
              margin-right: 11px;
            }
          }
        }
      }
    }

    .xhListContent {
      width: 100%;
      margin: 10px 0;
      .qListBox {
        min-height: 680px;
        background-color: #fff;
      }
    }

    .xhlist-pagination {
      width: 100%;
      margin: 0 0 20px 0;
      text-align: center;
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #ffb148;
      }
      .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
        background-color: white;
      }
    }

    #searchTopicList {
      width: 100%;
      min-height: 150px;
      padding: 0 12px 12px 12px;
      margin-bottom: 20px;
      .pointer {
        cursor: pointer;
      }
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
          font-size: 14px;
          color: #8d8d8d;
        }
      }
      .listBox {
        padding: 10px 0;
        border-bottom: 1px solid #e3e3e3;
        cursor: pointer;
        .item {
          display: flex;
          align-items: center;
          height: 50px;
          .info {
            padding-left: 6px;
            width: 86%;
            .name {
              width: 172px;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #323232;
              font-size: 14px;
            }
            .intro {
              padding-top: 5px;
              width: 172px;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #aeaeae;
              font-size: 12px;
            }
          }
          .headerImg {
            width: 50px;
            height: 50px;
            border-radius: 5px;
          }
          .attent {
            /*width:71px;*/
            /*height: 30px;*/
          }
        }
      }
    }

    #searchQuestion {
      width: 100%;
      min-height: 1px;
      .list-box-card {
        cursor: pointer;
        margin-bottom: 15px;
        .list-title {
          font-size: 17px;
          color: #303133;
          padding-bottom: 12px;
          border-bottom: 1px solid #e4e7ed;
        }
        .list-content {
          font-size: 13px;
          color: #8d8d8d;
          line-height: 20px;
          margin: 12px 0;
        }
        .list-about {
          font-size: 12px;
          padding-top: 12px;
          color: #8d8d8d;
          border-top: 1px solid #e4e7ed;
          margin-top: -1px;
        }
      }
    }
  }
</style>
