<template>
  <div id="xhQuestion">
    <div class="step1" v-show="step===1">
      <div class="inputArea vux-1px-b">
        <!--<input autofocus="autofocus" v-model="inputWord" type="text" class="textQuestion" maxlength="50" placeholder="输入问题并以问号结尾（4-50字以内）" @input="wordInput">-->
        <textarea v-model="inputWord" class="textQuestion" rows="3" maxlength="50" placeholder="输入问题并以问号结尾（4-50字以内）"
                  @input="wordInput"></textarea>
      </div>
      <textarea v-model="inputDesc" class="textDesc" placeholder="问题描述（选填）"></textarea>
    </div>
    <div class="step2" v-show="step===2">
      <div class="searchBox" v-show="!tipicSearch" @click="tipicSearch=true">
        <div class="search fcolor3" v-show="addTopicList.length===0">
          <i class="weui-icon-search"></i> 搜索
        </div>
        <div class="search fcolor3" v-show="addTopicList.length>0"><i class="icon iconfont icon-tripsousuo"></i>
          还可添加{{5 - addTopicList.length}}个
        </div>
      </div>
      <div class="tipicSearchBox" v-show="tipicSearch">
        <div class="search">
          <input type="text" v-model="topicSearchWord" placeholder="搜索关键词">
          <i v-show="topicSearchWord" class="icon iconfont closeInputVals icon-X" @click="handleTopicClose"></i>
        </div>
        <div><i class="icon iconfont icon-tripsousuo" @click="handleTopicSearch"></i></div>
      </div>
      <div class="huatiAddlist fcolor3" v-show="topicList.length===0">暂无相关话题</div>
      <div class="huatiAddlist fcolor3" v-show="topicList.length!==0 && addTopicList.length===0">还可添加5个话题</div>
      <div class="huatiAddlist fcolor3" v-show="addTopicList.length>0">
        <div class="item" v-for="(item,index) in addTopicList">
          <span>{{item.topicName | topicNameBubstr}}</span>
          <i v-show="item.topicName" class="icon iconfont icon-X fcolor3" @click="deleteSelectTopic(index,item)"></i>
        </div>
        <div class="none" v-show="addTopicList.length<2"></div>
        <div class="none" v-show="addTopicList.length<3"></div>
        <div class="none" v-show="addTopicList.length<4"></div>
        <div class="none" v-show="addTopicList.length<5"></div>
      </div>
      <div class="topicItemBox v-content" v-show="topicList.length>0">
        <div class="topicItem" v-for="(item, index) in topicList" :key="index" v-show="item.isShow">
          <div class="imgbox" @click="goTopicDetiale(item)">
            <img class="topicImg" :src="item.topicImage">
          </div>
          <div class="textBox" @click="goTopicDetiale(item)">
            <div class="title fb" v-html="hightLignt(item.topicName)"></div>
            <div>
              <span class="ae">{{item.attentionCount ? item.attentionCount : 0}}个关注</span>
              <span class="split">|</span>
              <span class="ae">{{item.relatedQuestionCount}}个问题</span>
            </div>
          </div>
          <div class="guanzuBox" v-show="!item.isAdd" @click="addTopicItem(item)">
            <img :src="$image.xinhu.questionadd"/>
          </div>
          <div class="guanzuBox" v-show="item.isAdd">
            <img :src="$image.xinhu.questionaddyet"/>
          </div>
        </div>
      </div>
    </div>
    <div class="adddesctip" @click="closeAutoComplate" v-show="showAutoComplate && inputWord">添加问题描述</div>
    <div class="footBtn">
      <div @click="cancel">取消</div>
      <div v-show="step==1" class="active" @click="nextStep">下一步</div>
      <div v-show="step==2" class="active" @click="addQuestion">提交</div>
    </div>
    <div class="autoComplate" v-show="showAutoComplate && inputWord">
      <v-listItem :item="item" v-for="(item, index) in autocompleteList" :key="index" :isShowDesc="false"></v-listItem>
    </div>
  </div>
</template>

<script>
  import listItem from '@/view/xinhu/components/listItem'
  import topicItem from '@/view/xinhu/components/topicItem'
  export default {
    data() {
      return {
        inputWord: '',
        inputDesc: '',
        showAutoComplate: false,
        step: 1,
        autocompleteList: [],
        topicList: [],
        addTopicList: [],
        tipicSearch: false,
        topicSearchWord: '',
        propagate: false
      }
    },
    // 使用其它组件
    components: {
      'v-topicItem': topicItem,
      'v-listItem': listItem,
    },
    filters: {
      topicNameBubstr(topicName) {
        if (topicName.length > 2) {
          topicName = topicName.substring(0, 2) + '..'
        }
        return topicName
      }
    },
    computed: {},
    watch: {},
    deactivated() {
      // 离开这个页面时
      this.propagate = false;
      document.title = this.$route.meta.title
    },
    activated() {
      this.propagateFun();
      let userId = this.$cookie.getCookie('userId');
      if (!this.$cookie.isLogin()) {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
    },
    beforeRouteEnter(to, form, next) {
      next(vm => {
        if (form.name != 'xhTopic') {
          vm.inputWord = ''
          vm.inputDesc = ''
          vm.addTopicList = []
        }
        vm.step = 1
      })
    },
    // 生命周期函数
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.lineHeight()
        document.querySelector('.textQuestion').focus()
        var inputElem = document.querySelector('.textQuestion')
        inputElem.addEventListener('click', function (ev) {
          inputElem.focus();
        });
        inputElem.click();
      })
    },
    // 方法
    methods: {
      propagateFun() {
        console.warn('propagateFun');
        if (this.$route.query.propagate) {
          this.propagate = true;
          document.title = '向信公技术部提问'
        }
      },
      // 在线答疑 方法
      inviteForQuestion(questionId) {
        let userId = '';
        if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'development') {
          userId = '6f751e7b745611e8a87552545e2ed1e2' // 本地  信安
        } else if (process.env.NODE_ENV == 'testing') {
          userId = 'd619e679805611e8a87552545e2ed1e2' // 董办
        } else if (process.env.NODE_ENV == 'product') {
          userId = '1761b59881d911e8960352549577cc48' // 正式
        }
        // 邀请'信公技术部'用户
        /*this.$http({
          method: 'POST',
          url: this.$api.xinhu.inviteForQuestion,
          params: {
            questionId: questionId,
            invitedUserId: userId
          }
        })*/
        let params = {
          questionId: questionId,
          invitedUserId: userId
        }
        this.$axios.xinhu.inviteForQuestion(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            setTimeout(() => {
              this.$vux.toast.show({text: '问题已向信公技术部提交', position: 'middle', type: 'text', width: 'auto', time: 3000});
            }, 300)
          }
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
      },
      //
      autoAreatextHeight() {
        let ele = document.querySelector('.textQuestion')
        ele.style.height = ele.scrollHeight + 'px'
      },
      goTopicDetiale(item) {
        this.$router.push({path: '/xhTopic', query: {topicId: item.topicId}})
      },
      hightLignt(value) {
        var reg = new RegExp(this.inputWord, 'gmi')
        return value.replace(reg, '<span class="hightLight">' + this.inputWord + '</span>')
      },
      cancel() {
        if (this.step == 2) {
          this.autocompleteList = []
          this.showAutoComplate = false
          this.step = 1
          this.addTopicList = []
        } else {
//          this.inputWord = ''
//          this.inputDesc = ''
          this.$router.push('/xhList')
        }
      },
      closeAutoComplate() {
        this.autocompleteList = []
        this.showAutoComplate = false
        document.querySelector('.textDesc').focus()
      },
      lineHeight() {
        let hei = document.body.clientHeight
        document.querySelector('.autoComplate').style.height = (hei - 140) + 'px'
        document.querySelector('.topicItemBox').style.height = (hei - 150) + 'px'

      },
      nextStep() {
        if (this.inputWord.length < 4) {
          this.$vux.toast.show({text: '问题请输入至少4个字', position: 'middle', type: 'text', width: 'auto', time: 2500})
          document.querySelector('.textQuestion').focus()
          return false
        }
        if (this.inputWord) {
          this.showAutoComplate = false
          this.step += 1
          this.listTopic(this.inputWord)
        } else {
          this.$vux.toast.show({text: '请输入问题', position: 'middle', type: 'text', width: 'auto', time: 2500})
          document.querySelector('.textQuestion').focus()
        }
        // this.$router.push({path: '/xhQuestion', query: {keep: 1}})
      },
      submit() {
        this.$router.push('/xhRedirect?from=question')
      },
      handleTopicClose() {
        this.topicSearchWord = ''
        this.tipicSearch = false
        for (let i in this.topicList) {
          this.topicList[i].isShow = true
        }
      },
      handleTopicSearch() {
        // this.tipicSearch = false
        // this.listTopic(this.topicSearchWord)
        if (this.topicSearchWord) {
          for (let i in this.topicList) {
            if (this.topicList[i].topicName.indexOf(this.topicSearchWord) > -1) {
              this.topicList[i].isShow = true
            } else {
              this.topicList[i].isShow = false
            }
          }
        }
        this.topicList = Object.assign([], this.topicList)
        console.log(this.topicList)

      },
      wordInput() {
        if (!this.inputWord) {
          return false
        }
        // this.autoAreatextHeight()
        setTimeout(() => {
          let params = {
            keyword: this.inputWord
          }
          /*this.$http({
            method: 'GET',
            url: this.$api.xinhu.autoCompleteQuestionTitle,
            params: {
              keyword: this.inputWord
            }
          })*/
          this.$axios.xinhu.autoCompleteQuestionTitle(params).then((res) => {
            if (res.data.returnCode === 200) {
              if (res.data.returnObject.count > 0) {
                this.showAutoComplate = true
                let obj = res.data.returnObject.list
                for (let i in obj) {
                  var reg = new RegExp(this.inputWord, 'gmi')
                  obj[i].questionTitle = obj[i].questionTitle.replace(reg, '<span class="hightLight">' + this.inputWord + '</span>')
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
      // 搜索相关话题
      listTopic(topicName) {
        /*this.$http({
          method: 'GET',
          url: this.$api.xinhu.listTopic,
          params: {
            topicName: topicName
          }
        })*/
        let params = {topicName: topicName}
        this.$axios.xinhu.listTopic(params).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            this.topicList = res.data.returnObject.list
            for (let i in this.topicList) {
              this.topicList[i].isAdd = false
              this.topicList[i].isShow = true
            }
          } else {
            this.topicList = []
          }
        }).catch((err) => {

        })
      },
      // 点击话题添加按钮
      addTopicItem(item) {
        if (this.addTopicList.length < 5) {
          for (let i in this.topicList) {
            if (this.topicList[i].topicId == item.topicId) {
              this.topicList[i].isAdd = true
            }
          }
          // this.topicList = Object.assign([], this.topicList);
          this.addTopicList.push(item)
        } else {
          this.$vux.toast.show({text: '最多添加5个话题', position: 'middle', type: 'text', width: 'auto', time: 2500})
        }
      },
      // 删除添加的话题
      deleteSelectTopic(index, item) {
        this.addTopicList.splice(index, 1)
        for (let i in this.topicList) {
          if (this.topicList[i].topicId == item.topicId) {
            this.topicList[i].isAdd = false
          }
        }
      },
      // 添加问题
      addQuestion() {
        let topicIds = []
        for (let i in this.addTopicList) {
          topicIds.push(this.addTopicList[i].topicId)
        }
        /*this.$http({
          method: 'POST',
          url: this.$api.xinhu.addQuestion,
          params: {
            questionTitle: this.inputWord,
            questionDescription: this.inputDesc,
            topicIds: topicIds.toString()
          }
        })*/
        let params = {
          questionTitle: this.inputWord,
          questionDescription: this.inputDesc,
          topicIds: topicIds.toString(),
          userId: this.$cookie.get('userId')
        }
        this.$axios.xinhu.addQuestion(params).then((res) => {
          if (res.data.returnCode == 200) {
            // this.$router.push('/xhRedirect?from=question&questionId=' + res.data.returnObject.questionId)
            // 宣传的 是否是在线答疑
            if (this.propagate) {
              // 是
              this.inviteForQuestion(res.data.returnObject.questionId);
              this.$router.push({
                path: '/xhQuestionDetaile',
                query: {
                  from: 'question',
                  questionId: res.data.returnObject.questionId,
                  propagate: 1
                }
              });
            } else {
              // 跳转详情页
              this.$router.push('/xhQuestionDetaile?from=question&questionId=' + res.data.returnObject.questionId);
            }
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'y3ua6mh5z4': 'true'});
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            })
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  @mixin flex {
    display: flex;
    display: -webkit-flex;
    align-items: center;
  }
  #xhQuestion {
    font-size: 14px;
    height: 100%;
    overflow-y: scroll;
    .inputArea {
      position: relative;
      .textQuestion {
        /*border-bottom: 1px solid #e3e3e3;*/
        border: 0;
        width: 100%;
        height: 80px;
        padding: 12px 10px 6px 10px;
        font-size: 15px;
        font-family: PingFangSC-Medium;
        color: #323232;
      }
    }
    /*.inputArea:after{
      position: absolute;
      right: 0;
      bottom: 0;
      content: '';
      width:100%;
      height: 1px;
      border-bottom: 1px solid #e3e3e3;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }*/

    .textDesc {
      height: 400px;
      width: 100%;
      padding: 10px;
      border: 0;
      font-size: 15px;
      font-family: PingFangSC-Regular, sans-serif;
    }
    .searchBox {
      width: 100%;
      height: 50px;
      background: #f0f1f5;
      padding: 7.5px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: relative;
        background: white;
        border-radius: 3px;
        font-size: 15px;
        i {
          color: #c1c1c1;
        }
        .icon-tripsousuo {
          font-size: 16px;
          color: #8d8d8d;
          margin-right: 5px;
        }
        .weui-icon-search {
          font-size: 18px;
        }
      }
    }

    .tipicSearchBox {
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
    }

    .huatiAddlist {
      @include flex;
      border-bottom: 1px solid #e3e3e3;
      height: 50px;
      padding: 0 10px;
      div {
        @include flex;
        flex-grow: 0;
        justify-content: space-between;
        height: 30px;
        min-width: 19%;
        padding: 3px 5px;
        overflow: hidden;
        margin-left: 5px;
        border-radius: 4px;
        i {
          font-size: 14px;
          margin-left: 3px;
          color: #aeaeae;
        }
        &:first-child {
          margin-left: 0;
        }
      }
      .item {
        background-color: #f0f1f5;
      }
      .none {
        border: 1px dashed #e3e3e3;
      }
    }
    .topicItemBox {
      min-height: 60%;
      overflow-y: scroll;
      .topicItem {
        height: 80px;
        padding: 18px 10px;
        background-color: #fff;
        border-bottom: 1px solid #e3e3e3;
        display: flex;
        & > div {
          float: left;
        }
        .topicImg {
          width: 45px;
          height: 45px;
          border-radius: 4px;
        }
        .guanzhuImg {
          width: auto;
          height: .64rem;
        }
        .textBox {
          padding: 0 10px 5px 10px;
          .title {
            font-size: 15px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 220px;
            padding-bottom: 3px;
          }
          .ae {
            color: #aeaeae;
            font-size: 13px;
          }
          .split {
            display: inline-block;
            margin: 0 2px !important;
            color: #aeaeae;
            font-size: 12px;
          }
        }
        .guanzuBox {
          display: inline-block;
          float: right;
          margin-top: 10px;
          font-size: 14px;
          img {
            height: 25px;
          }
        }
      }
    }

    .adddesctip {
      z-index: 200;
      position: absolute;
      bottom: 50px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      width: 100%;
      background-color: #fff;
      border-top: 1px solid #e3e3e3;
    }
    .footBtn {
      z-index: 200;
      position: absolute;
      bottom: 0;
      display: flex;
      height: 50px;
      width: 100%;
      background-color: #fff;
      & > div {
        text-align: center;
        height: 50px;
        line-height: 50px;
        width: 50%;
        font-size: 16px;
        color: #ffb148;
        border: 1px solid #e3e3e3;
      }
      .active {
        background-color: #ffb148;
        border: 0;
        color: #fff;
      }
    }
    .autoComplate {
      position: absolute;
      z-index: 100;
      top: 50px;
      left: 0;
      width: 100%;
      min-height: 12rem;
      overflow-y: scroll;
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
      .xinhulist {
        margin-top: 0;
        border-bottom: 1px solid #e3e3e3;
      }
    }
  }
  .weui-toast.vux-toast-middle {
    top: 44% !important;
  }
</style>
