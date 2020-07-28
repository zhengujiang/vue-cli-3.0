<template>
  <div id="xhQuestion">
    <!--添加问题弹窗-->
    <el-dialog title="写下你的问题" custom-class="questionDialog" center :visible="isShow" @close="xhListQuestionHide">
      <div class="succ-pop">
        <textarea v-model="questionWord" @input="textareaInput()" placeholder="输入问题并以问好结尾(4-50字以内)" maxlength="50"></textarea>
        <v-safeWordTip :tipType="'question'" v-show="tipShow[0]"></v-safeWordTip>
        <div class="succComplate" v-show="showSuccComplate && questionWord && succCompleteList.length>0">
          <ul>
            <li v-for="(item, index) in succCompleteList" @click="goQuestionDetaile(item)" :key="index">
              <p v-html="item.questionTitle"></p>
              <div>
                <span v-if="item.answerCount > 0">{{item.answerCount}}个回答 <i class="split">|</i></span>
                <span v-if="item.approveCount > 0">{{item.approveCount}}个赞同 <i class="split">|</i></span>
                <span v-if="item.attentionCount > 0">{{item.attentionCount}}个关注 <i class="split">|</i></span>
                <!--<span>{{$common.transTime(item.updateTime)[1]}}</span>-->
                <span>{{item.updateTime.split(' ')[0]}}</span>
              </div>
            </li>
          </ul>
          <div class="close"><el-button type="text btn" size="mini" @click="closeAutoCompletQuestion">关 闭</el-button></div>
        </div>
        <!--添加话题-->
        <div class="input">
          <ul @click="addTopicShow()">
            <li v-for="(item,index) in addTopicList">
              {{item.topicName.substring(0, 2)}}...
              <i class="iconfont web-X fcolor3" @click.stop="deleteSelectTopic(index,item)"></i>
            </li>
            添加话题({{addTopicList.length}}/5)
          </ul>
        </div>
        <div class="topicCompleteWrp" v-show="showtopicComplate">
          <ul class="topicComplate">
            <li v-for="(item, index) in topicList" :key="index">
              <img :src=item.topicImage>
              <div>
                <p class="ptitle" v-html="item.topicName"></p>
                <p class="pattr">
                  <span>{{item.attentionCount}}个关注 |</span>
                  <span> {{item.relatedQuestionCount}}个问题</span>
                </p>
              </div>
              <div class="topicImg">
                <img v-show="!item.isAdd" :src="$image.xinhu.questionadd" @click.stop="addTopicItem(item)">
                <img v-show="item.isAdd" :src="$image.xinhu.questionaddyet">
              </div>
            </li>
          </ul>
          <div class="close"><el-button type="text btn" size="mini" @click="showtopicComplate=false">关 闭</el-button></div>
        </div>
        <p>问题描述(可选)</p>
        <textarea v-model="questiondesc" placeholder="输入问题描述"></textarea>
        <v-safeWordTip :tipType="'question'" v-show="tipShow[1]"></v-safeWordTip>
        <!--<a @click="Submission()">提交问题</a>-->
        <div style="text-align: center;margin-top:20px;">
          <el-button type="primary" @click="addQuestion()" style="width:170px">提交问题</el-button>
        </div>
        <div class="safe-tip">温馨提示：应公安部网络安全规定，发帖提交后需要通过系统后台审核，审核成功后即可查看</div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  export default {
    mixins: [mixins],
    data() {
      return {
        showDialog: false,
        showSuccComplate: false,
        questionWord: '',
        succCompleteList: [],
        showtopicComplate: false,
        questiondesc: '',
        topicList: [],
        addTopicList: [],
        sensitiveWord: [],
        sensitiveType: 'question'
      }
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {
      goQuestionDetaile(item) {
        this.$router.push({path: '/xhQuestionDetail', query: {'questionId': item.questionId}})
      },
      xhListQuestionHide() {
        // this.isShow = false
        this.$emit('questionClose')
      },
      closeAutoCompletQuestion(index) {
        this.showSuccComplate = false
      },
      //  提问关键字补全
      textareaInput() {
        if (!this.questionWord) {
          return false
        }
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.autoComplete,
          params: {
            keyword: this.questionWord
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode === 200) {
            if (res.data.returnObject.count > 0) {
              this.showSuccComplate = true
              let obj = res.data.returnObject.list
              for (let i in obj) {
                var reg = new RegExp(this.questionWord, 'gmi')
                obj[i].questionTitle = obj[i].questionTitle.replace(reg, '<span class="hightLight">' + this.questionWord + '</span>')
              }
              this.succCompleteList = obj

            } else {
              this.showSuccComplate = false
              this.succCompleteList = []
            }
          }
        }).catch((err) => {

        })
      },
      addTopicShow() {
        if (!this.questionWord) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '请先输入问题'})
          this.showtopicComplate = false
          return false
        }
        this.topicFocus()
      },
      // 添加话题
      topicFocus() {
        console.log('1112')
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listTopic,
          params: {
            topicName: this.questionWord
          }
        }).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            this.showtopicComplate = true
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
          // this.$vux.toast.show({text: '最多添加5个话题', position: 'middle', type: 'text', width: 'auto', time: 2500})
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
      // 提问问题
      addQuestion() {
        // 敏感词检测
        if (this.checkWordQuestion(this.questionWord)) {
          this.$set(this.tipShow, 0, true)
          // this.tipShow[0] = true
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }
        if (this.checkWordQuestion(this.questiondesc)) {
          this.$set(this.tipShow, 1, true)
          return false
        } else {
          this.$set(this.tipShow, 1, false)
        }

        if (this.questionWord.length < 4) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '问题请输入至少4个字'})
          return false
        }
        let topicIds = []
        for (let i in this.addTopicList) {
          topicIds.push(this.addTopicList[i].topicId)
        }
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addQuestion,
          data: {
            questionTitle: this.questionWord,
            questionDescription: this.questiondesc,
            topicIds: topicIds.toString(),
            userId: this.$cookie.get('userId')
          },
          emulateJSON: true
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 && res.data.returnObject) {
             this.$router.push('/xhQuestionDetail?from=question&questionId=' + res.data.returnObject.questionId);
            // this.$router.push({path: '/transfer', query: {url: '/xhList'}})
          } else {

          }
        })
        // this.$router.push('/xhQuestionDetail')
      }
    }
  }
</script>

<style lang="scss">
  #xhQuestion {
    .questionDialog {
      width: 620px;
      height: 500px;
      .el-dialog__title {
        color: #ffb148;
      }
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
          border: 1px solid #ffb148;
          border-radius: 0;
          padding: 4px 8px;
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
        height: 250px;
        overflow-y: hidden;
        background-color: #fff;
        border: 1px solid #e3e3e3;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        ul {
          height: 212px;
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
            color:#aeaeae;
          }
        }
      }
      .topicCompleteWrp {
        width: 570px;
        position: absolute;
        min-height: 237px;
        overflow: hidden;
        border:1px solid #e3e3e3;
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
                margin-top:10px;
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
      .safe-tip {
        position: absolute;
        bottom: 5px;
        right: 5px;
        color: #aeaeae;
        font-size: 12px;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
</style>
