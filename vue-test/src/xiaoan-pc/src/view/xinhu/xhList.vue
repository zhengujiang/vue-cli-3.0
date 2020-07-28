<template>
  <div id="xhList">
    <div class="xhListSearch vxa-image-bg-affiche">
      <div class="xhListSearchContent">
        <div class="xhSearchInput">
          <el-input class="xhListSearchInput" v-model="searchWord" type="text" placeholder="请输入关键词，多关键词用空格隔开">
          </el-input>
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
        <ul class="xhListTab">
          <li class="xhListTabList" v-for="(item,index) in xhListTabData" :key="index"
              @click="xhListTabListVisted(index)" :class="{'xhListTabListVisted': xhListTabData[index].tabShow}">
            {{item.tab}}
          </li>
        </ul>
        <el-row :gutter="20" class="mtop20">
          <el-col :span="18">
            <xhLaste ref="xhLaste" v-show=xhListTabData[0].tabShow></xhLaste>
            <xhAnswer ref="xhAnswer" v-show=xhListTabData[1].tabShow></xhAnswer>
            <xhRealTime ref="xhRealTime" v-show=xhListTabData[2].tabShow></xhRealTime>
            <v-xhInvite ref="xhInvite" v-show=xhListTabData[3].tabShow></v-xhInvite>
          </el-col>
          <el-col :span="6">
            <v-adv :pageName="'信乎社区'"></v-adv>
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
    name: 'xhList',
    mixins: [mixins],
    data() {
      return {
        xhListTabData: [
          {
            'tab': '最新提问', 'tabShow': true
          }, {
            'tab': '精选回答', 'tabShow': ''
          }, {
            'tab': '实时关注', 'tabShow': ''
          }, {
            'tab': '邀请回答', 'tabShow': ''
          }
        ],
        showQuestion: false,
        searchWord: "",
        autocompleteList: [],
        showAutoComplate: false,
        // 邀请回答弹窗
        showAnswer: false,
        // inviteQuestionTitle: '',
        isAnonymous: false,
        inviteAnswerContent: '',
        inviteItem: {}
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
    computed: {},
    watch: {
      searchWord: function (val) {
        setTimeout(() => {
          this.searchInput()
        }, 500)

      }
    },
    // 生命周期函数
    created() {
      // console.log(this.$route.query.item)

      if (this.$route.query.item != undefined) {
        let k = this.$route.query.item
        let len = this.xhListTabData.length
        for (let i = 0; i < len; i++) {
          this.xhListTabData[i].tabShow = false
        }
        this.xhListTabData[k].tabShow = true
      } else {
        this.xhListTabData[0].tabShow = true
      }

    },
    mounted() {
      document.addEventListener('click', () => {
        this.showAutoComplate = false
      })
    },
    // 方法
    methods: {
      // 调用子组件方法
      xhListTabListVisted(index) {
        let len = this.xhListTabData.length
        for (let i = 0; i < len; i++) {
          this.xhListTabData[i].tabShow = false
        }
        this.xhListTabData[index].tabShow = true
        this.$router.push({path: '/xhList', query: {item: index}})
        if (index == 0) {
          this.$refs.xhLaste.getLasteData()
        } else if (index == 1) {
          this.$refs.xhAnswer.getAnswerData()
        } else if (index == 2) {
          this.$refs.xhRealTime.getRealTimeData()
        } else if (index == 3) {
          this.$refs.xhInvite.getData()
        }
      },

      // 提问关闭隐藏
      questionOpen() {
        this.showQuestion = true
      },
      questionClose() {
        this.showQuestion = false
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
      // 搜索关键词提示
      searchInput() {
        // 敏感词检测
        if (this.checkWordSearch(this.searchWord)) {
          // this.$set(this.tipShow, 0, true)
          // this.tipShow[0] = true
          this.showAutoComplate = false
          this.autocompleteList = []
          return false
        } else {
          // this.$set(this.tipShow, 0, false)
        }

        if (!this.searchWord) {
          return false
        }
        // let searchWordNow = this.searchWord
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
          // this.searchInput()
          this.$router.push({path: '/xhSearchResult', query: {'word': this.searchWord}})
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
            // box-shadow: 0px 0px 2px #FFB148;
            border-radius: 2px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            // padding: 0 12px;
            border: none;
            float: left;
            input {
              height: 100%;
              line-height: 1;
              border: 0;
              box-shadow: 0px 0px 2px #FFB148;
            }
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
            font-size: 18px;
            text-align: center;
            line-height: 44px;
            border: 1px solid #ffb148;
            border-radius: 4px;
            .editimg {
              position: relative;
              top: 2px;
              /*left: 30px;*/
              width: 16px;
              /*height: 19px;*/
              margin-right: 11px;
            }
          }
        }
      }
    }

    .xhListContent {
      width: 100%;
      .qListBox {
        min-height: 680px;
        background-color: #fff;
      }
      .xhListTab {
        width: 100%;
        height: 44px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        border-radius: 4px;
        margin-top: 20px;
        .xhListTabList {
          height: 100%;
          float: left;
          line-height: 42px;
          font-size: 16px;
          padding: 0;
          margin: 1px 140px 0 12px;
          cursor: pointer;
          &:hover {
            color: #ffb148;
          }
        }
        .xhListTabListVisted {
          border-bottom: 2px solid #FFAC38;
          color: #FFAC38;
        }
      }
    }
    .questionDialog {
      width: 620px;
      height: 500px;
      .el-dialog__title {
        color: #ffb148;
      }
    }
    .fade {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 99;
    }
    /*弹出层*/
    .succ-pop {
      h3.title {
        height: 90px;
        line-height: 90px;
        margin: 0;
        font-size: 17px;
        color: #ff9933;
        font-weight: 600;
      }
      .close {
        height: 38px;
        /*line-height: 40px;*/
        text-align: center;
        color: #323232;
        font-size: 14px;
        .btn {
          border-bottom: 1px solid #ffb148;
          border-radius: 0;
          padding: 4px 2px;
        }
      }
      .input {
        width: 100%;
        min-height: 45px;
        line-height: 45px;
        padding: 0 10px;
        text-align: left;
        border: 1px solid #e3e3e3;
        // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        margin: 10px 0 0 0;
        > ul {
          li {
            float: left;
            height: 26px;
            line-height: 26px;
            color: #ffb148;
            margin: 9px 5px;
            border-radius: 10px;
            padding: 0 6px;
            background: #ffefda;
            i {
              color: #ffb148;
              margin-left: 5px;
            }
          }
        }
      }
      > p {
        width: 100%;
        text-align: left;
        margin: 15px 0;
        color: #666666;
      }
      textarea {
        width: 100%;
        height: 100px;
        border: 1px solid #e3e3e3;
        // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        resize: none;
        outline: none;
      }

      .succComplate {
        position: absolute;
        z-index: 100 !important;
        top: 170px;
        left: 25px;
        width: 570px;
        height: 328px;
        overflow-y: hidden;
        background-color: #fff;
        border: 1px solid #e3e3e3;
        ul {
          height: 290px;
          overflow-y: auto;
        }
        li {
          margin: 0 12px;
          padding: 8px 2px;
          list-style-type: none;
          border-bottom: 1px solid #e3e3e3;
          line-height: 1;
          background-color: white;
          box-sizing: border-box;
          p {
            display: inline-block;
            padding-bottom: 5px;
            float: left;
            line-height: 20px;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: justify;
            color: #323232;
            font-size: 14px;
            /*border-bottom: 1px solid #e3e3e3;*/
            .hightLight {
              color: #ff9933;
            }
          }
          span {
            font-size: 13px;
            color: #aeaeae;
          }
        }
      }
      .topicCompleteWrp {
        width: 570px;
        position: absolute;
        min-height: 237px;
        overflow: hidden;
        border: 1px solid #e3e3e3;
        background-color: #fff;
        .allComplete {
          position: absolute;
          bottom: 0;
          width: 597px;
          height: 35px;
          background: #ffffff;
          > p {
            width: 100px;
            height: 30px;
            line-height: 30px;
            margin: 0 10px;
            float: right;
            border: 1px solid #e3e3e3;
            &:hover {
              color: #ffb148;
            }
          }
        }
        .topicComplate {
          position: relative;
          z-index: 100 !important;
          left: 0;
          width: 570px;
          top: 0;
          max-height: 202px;
          overflow-y: scroll;
          background-color: #fff;
          li {
            padding: 2px 12px;
            list-style-type: none;
            width: 100%;
            height: 75px;
            font-size: 17px;
            background-color: white;
            box-sizing: border-box;
            border-bottom: 1px solid #e3e3e3;
            img {
              width: 45px;
              height: 45px;
              float: left;
              border-radius: 5px;
              position: relative;
              top: 8px;
            }
            div {
              display: inline-block;
              float: left;
              margin-left: 20px;
              margin-top: 3px;
              .ptitle {
                height: 30px;
                line-height: 30px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: justify;
                color: #323232;
                font-size: 14px;
              }
              .pattr {
                color: #aeaeae;
                font-size: 12px;
              }
            }
            .topicImg {
              width: 80px;
              height: 35px;
              float: right;
              img {
                width: 65px;
                height: 28px;
                margin-top: 10px;
              }
            }
          }
        }
      }

      a {
        display: block;
        width: 175px;
        height: 40px;
        border: 1px solid #e3e3e3;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        line-height: 40px;
        margin: 27px auto;
        border: 1px solid #aeaeae;
        background: #ff9933;
        color: #ffffff;
      }
      .closePic {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 20px;
        color: #999999;
      }
    }
  }
</style>
