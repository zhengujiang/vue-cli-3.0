<template>
  <div id="xhAnswerDetail" class="xhAnswerDetail caseDetail">
    <div class="content">
      <v-xhDetailTop :detailObject="detailObject" v-if="detailObject"></v-xhDetailTop>
      <!---->
      <el-row :gutter="20">
        <el-col :span="18">

          <el-card class="box-card box-card-bottom" shadow="never" body-style="padding:0 16px">
            <ul class="correlation">
              <li class="list-user" v-if="answerData.anonymous">
                <div class="list img">
                  <img :src="$image.user.timg2x" alt="">
                </div>
                <div class="list user-name">
                  <p class="name">{{'匿名用户'}}<span v-if="!answerData.audit" class="auditButton">正在审核</span></p>
                  <p class="desc">乎主很神秘，还没有留下任何信息。</p>
                </div>
                <div class="list btn"></div>
              </li>
              <li class="list-user" v-else>
                <div class="list img">
                  <a :href="'/xhMy?selectUserId='+answerData.userId" target="_blank">
                    <img v-if="answerData.userPicture" :src="answerData.userPicture" alt="">
                    <img :src="$image.user.timg2x" alt="" v-else>
                  </a>
                </div>
                <a class="list user-name" :href="'/xhMy?selectUserId='+answerData.userId" target="_blank">
                  <!-- <p class="name">{{answerData.userName}}</p> -->
                  <p class="name">{{answerData.userName}}<span v-if=" !answerData.audit " class="auditButton">正在审核</span></p>
                  <p class="desc" v-if="answerData.userSynopsis">{{decodeURIComponent(answerData.userSynopsis)}}</p>
                  <p class="desc" v-else>乎主很神秘，还没有留下任何信息。</p>
                </a>
                <div class="list btn" v-if="answerData.userId == userId">
                  <el-button @click="deleteAnswer" class="list-btns-off" plain size="mini"
                             icon="el-icon-delete">删除
                  </el-button>
                </div>
                <div class="list btn" v-else>
                  <el-button @click="attentionUser(0, answerData)" class="list-btns-off" plain size="mini"
                             v-if="answerData.followResponder">已关注
                  </el-button>
                  <el-button @click="attentionUser(1,answerData)" class="list-btns-on" plain size="mini"
                             icon="el-icon-plus"
                             v-else>关注
                  </el-button>
                </div>
                <img v-if="answerData.authentication" :src="$image.xinhu.rz" class="rzImg">
              </li>
            </ul>
            <div class="answerDetail" id="answerDetail" v-html="answerData.answerContent"></div>
            <div class="answer-time">最后编辑于{{$common.transTime(answerData.createTime)[1]}}</div>
            <div class="answer-selected">
              <span class="span">
                <el-tooltip content="赞同" :open-delay="1000" placement="bottom" effect="light">
                  <el-button @click="addORCancel(true)" size="mini" class="agree"
                             :class="{selected: approve.agree}">
                    <i class="iconfont web-sanjiaoxing"></i>
                    <span class="text">{{answerData.approveCount}}</span>
                  </el-button>
                </el-tooltip>
              </span>
              <span class="span">
                <el-tooltip content="反对" :open-delay="1000" placement="bottom" effect="light">
                  <el-button @click="addORCancel(false)" size="mini" class="oppose"
                             :class="{selected: approve.oppose}">
                    <i class="iconfont web-sanjiaoxing"></i>
                    <span class="text"></span>
                  </el-button>
                </el-tooltip>
              </span>
              <span class="span">
                <el-button type="text" class="share" @click="showQrcode = true">
                  <i class="iconfont web-fenxiang1"></i>
                  <span class="text">分享</span>
                </el-button>
              </span>
            </div>
          </el-card>

          <div class="divider-box">
            <p class="vux-divider">其他回答</p>
          </div>
          <!--其他回答-->
          <v-other-answer-item :answerId="answerId" :questionId="questionId"></v-other-answer-item>
        </el-col>
        <el-col :span="6">
          <v-relatedQuestion :questionId="questionId" :questionTitle="questionTitle"></v-relatedQuestion>
          <v-ramdomv></v-ramdomv>
          <v-hotTopic></v-hotTopic>
        </el-col>
      </el-row>
    </div>
    <el-dialog id="dialog-share" title="扫码分享" :visible="showQrcode" width="320px" @close="showQrcode = false">
      <div class="qrcenter">
        <v-qrcode :text="shareUrl"></v-qrcode>
      </div>
    </el-dialog>
    <!--<v-sidebar :collectInfo="answerData | delContent" @scaleMethod="scaleScreen" :scaleScreenShow="false"-->
               <!--@printfMethod="printfM" v-show="isLogin" :scaleShow="isScreen"></v-sidebar>-->
  </div>
</template>

<script>
  import VHotTopic from './components/hotTopic.vue'
  import VRelatedQuestion from './components/relatedQuestion.vue'
  import VRamdomv from './components/ramdomV.vue'
  import VQrcode from '@/components/qrcode.vue'
  import VOtherAnswerItem from './components/xhOtherAnswerItem.vue'
  import VXhDetailTop from './components/xhDetailTop.vue'
  import VSidebar from '@/components/sidebar.vue'

  import VXhList from './xhList.vue'

  export default {
    name: "xh-answer-detail",
    data() {
      return {
        dialogCollect: false,
        shareUrl: '',
        showQrcode: false,
        chief: false, // 是否是大V
        synopsis: '乎主很神秘，还没有留下任何信息。',
        visible: false,
        approve: {
          agree: false,
          oppose: false
        },
        userId: '',
        isLogin: true,
        isScreen: false,
        /**/
        detailObject: null,
        questionId: '',
        answerId: '',
        selectUserId: '',
        newSelectUserId: '',
        answerData: {
          userPicture: this.$image.user.timg2x,
          userName: '信公小安用户',
          userSynopsis: '',
          followResponder: false
        },
        questionTitle: ''
      }
    },
    filters: {
      delContent: function (obj) {
        if (obj == {}) return obj
        var newObj = {
          id: obj.answerId,
          title: obj.questionTitle,
          time: obj.createTime,
          type: 'qa'
        }
        return newObj
      }
    },
    components: {
      VHotTopic,
      VRelatedQuestion,
      VRamdomv,
      VQrcode,
      VOtherAnswerItem,
      VXhDetailTop,
      VSidebar,
      VXhList
    },
    watch: {
      '$store.state.scaleShowState': function (val) {
        console.log(val);
        this.isScreen = val;
        this.scaleScreen();
      }
    },
    created() {
      this.$store.commit('scaleShowState', true)
      if (this.$cookie.get('userId')) {
        this.userId = this.$cookie.get('userId');
      }
      if (this.$route.query.questionId) {
        this.questionId = this.$route.query.questionId;
        // this.getQuestionDetails();
      }
      if (this.$route.query.answerId) {
        this.answerId = this.$route.query.answerId;
        this.getAnswerDetail();
      }
    },
    mounted() {
      // window.scrollTo(0, 0);
      this.$nextTick(() => {
        const that = this
        window.onresize = () => {
          return (() => {
            window.screenWidth = document.body.clientWidth
            that.screenWidth = window.screenWidth
            if (that.screenWidth < 1280) {
              that.isScreen = true
            } else {
              that.isScreen = false
            }
          })()
        }
      })
    },
    methods: {
      deleteAnswer() {
        this.$confirm('您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((success) => {
          this.$http({
            url: this.$api.xinhu.deleteAnswer,
            method: 'DELETE',
            params: {
              questionId: this.$route.query.questionId,
              answerId: this.answerId,
              userId: this.userId
            }
          }).then((res) => {
            if (res.data.returnCode == 200) {
              this.$router.replace({path: '/xhQuestionDetail', query: {questionId: this.$route.query.questionId}})
            }
          })
          // this.$message({type: 'success', message: success + '取消成功!'});
        }).catch((error) => {
          // this.$message({type: 'info', message: error + '已取消删除'})
        })
      },
      // 打印
      printfM() {
        // window.print && window.print()
        let codestr = document.getElementById('pdf-wrap').innerHTML
        window.print()
        let newWindow = window.open('_blank')   // 打开新窗口
        // let codestr = document.getElementById('pdf-wrap').innerHTML   // 获取需要生成pdf页面的div代码
        newWindow.document.write(codestr)   // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
        newWindow.print()   // 打印当前窗口
        return true
      },
      // 页面缩放
      scaleScreen() {
        this.isScreen ? this.isScreen = false : this.isScreen = true
        // console.log(this.isScreen)
      },
      // 获取问题详情
      getQuestionDetails() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getQuestionDetails,
          params: {
            questionId: this.questionId,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject) {
            this.detailObject = res.data.returnObject;
          }
        }).catch((err) => {

        })
      },
      // 控制赞同 反对
      addORCancel(type) {
        switch (type) {
          case true:
            // 点击赞同
            if (this.approve.agree == false && this.approve.oppose == false) {
              this.addEvaluate(true);
            } else if (this.approve.agree == true && this.approve.oppose == false) {
              // 已点击过赞同
              this.cancelEvaluate(0);
            } else if (this.approve.agree == false && this.approve.oppose == true) {
              console.log('this.approve', true);
              // 点击过反对 在反过来点击赞同
              this.cancelEvaluate(1);
            }
            break;
          case false:
            // 点击反对
            if (this.approve.agree == false && this.approve.oppose == false) {
              this.addEvaluate(false);
            } else if (this.approve.agree == false && this.approve.oppose == true) {
              // 已点击过反对
              this.cancelEvaluate(0);
            } else if (this.approve.agree == true && this.approve.oppose == false) {
              console.log('this.approve', false);
              // 点击过赞同 在反过来点击反对
              this.cancelEvaluate(2);
            }
            break
        }
      },
      // 是否赞同
      addEvaluate(status) {
        this.$http({
          method: "POST",
          url: this.$api.xinhu.addEvaluate,
          params: {
            evaluate: status,
            answerId: this.answerId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res.data.returnObject);
          if (res.data.returnCode == 200) {
            this.getAnswerDetail();
            if (status) {
              // this.$message({type: 'success', message: '已赞同'});
            } else {
              // this.$message({type: 'success', message: ''});
            }
          }
        }).catch((err) => {

        })
      },
      // 取消赞同反对
      cancelEvaluate(status) {
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.cancelEvaluate,
          params: {
            answerId: this.answerId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            if (status == 0) {
              this.getAnswerDetail();
            } else if (status == 1) {
              this.addEvaluate(true);
            } else if (status == 2) {
              this.addEvaluate(false);
            }
            // this.addEvaluate(status);
          }
        })
      },
      // 回答详情
      getAnswerDetail() {
        this.$http({
          methods: 'GET',
          url: this.$api.xinhu.getAnswerDetails,
          params: {
            answerId: this.answerId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.answerData = res.data.returnObject;
            this.$common.getSidebarInfo(this.answerData, 'answerId', 'questionTitle', 'createTime', '', 'qa')
            if ((this.$cookie.get('userId') != this.answerData.userId) && !this.answerData.audit) {
                this.$message({
                showClose: true,
                type: "error",
                duration: 3000,
                message: '信息正在审核中'
                })
              this.$router.push('/xhList');
            }

            if (this.answerData.approveStatus == true) {
              // 赞同
              this.approve.agree = true;
              this.approve.oppose = false;
            } else if (this.answerData.approveStatus == false) {
              // 反对
              this.approve.agree = false;
              this.approve.oppose = true;
            } else if (this.answerData.approveStatus == null) {
              // 没有评价
              this.approve.agree = false;
              this.approve.oppose = false;
            }
            console.log(this.$route);
            this.shareUrl = this.$api.share.xhAnswerDetaile + 'questionId=' + this.questionId + '&answerId=' + this.answerId
            console.log(this.shareUrl);
            //
            this.selectUserId = this.answerData.userId;
            this.questionId = this.answerData.questionId;
            // alert(1);
            this.getQuestionDetails();
            this.$nextTick(() => {
              let allA = document.querySelectorAll('#answerDetail a');
              allA.forEach((item) => {
                item.setAttribute('target', '_blank');
              })
            })
          }
        }).catch((err) => {
        })
      },
      //
      attentionUser(type, userData) {
        //  console.log(type)
        switch (type) {
          case 0:
            // 取消关注
            this.$confirm('您确定要取消关注吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then((success) => {
              this.unFollow(userData);
              // this.$message({type: 'success', message: success + '取消成功!'});
            }).catch((error) => {
              // this.$message({type: 'info', message: error + '已取消删除'})
            })
            break;
          case 1:
            // 添加关注
            this.addAttention(userData);
            break
        }
      },
      //
      unFollow(userData) {
        this.$http({
          method: "DELETE",
          url: this.$api.xinhu.unFollow,
          params: {
            concernedId: userData.userId,
            attentionType: 2, // 取消关注用户的
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({type: 'success', message: '取消成功!'});
            this.getAnswerDetail();
          }
        }).catch((err) => {
        })
      },
      //
      addAttention(userData) {
        this.$http({
          method: "POST",
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_PEOPLE',
            concernedId: userData.userId, // 关注人的userId
            concernedTitle: userData.userName, // 关注人的名称
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({type: 'success', message: '关注成功!'});
            this.getAnswerDetail();
          }
        }).catch((err) => {
        })
      }
      //
    }
  }
</script>

<style lang="scss">

  @mixin btn {
    height: 35px;
    line-height: 35px;
    border-radius: 3px;
    font-size: 17px;
    text-align: center;
    cursor: pointer;
  }
  #dialog-share {
    .qrcenter {
      margin-left: 12px;
    }
  }
  #xhAnswerDetail {
    padding-top: 20px;
    #answerDetail {
      height: 100%;
      padding: 10px;
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        font-size: 16px;
        font-family: PingFangSC-Light, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        margin: 5px 0;
        line-height: 20px;
        font-weight: normal;
      }
      p {
        font-size: 16px;
        margin: 8px 0;
        font-family: PingFangSC-Light, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        text-align: justify;
        box-sizing: border-box;
        text-indent: 2em;
        word-break: break-all;
        line-height: 24px;
      }
      p {
        img {
          margin-left: -2em;
        }
      }
      h1, h1 * {
        padding: 10px 0 0 0;
        margin: 0;
        line-height: 25px;
        font-size: 16px;
        text-align: center;
      }
      h2, h2 * {
        margin: 5px 0 0 0;
        font-size: 16px;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
      }
      h3, h3 * {
        box-sizing: border-box;
        margin: 5px 0 5px 0;
        font-size: 16px !important;
        color: #323232 !important;
        font-family: PingFangSC-Medium, sans-serif;
      }
      h4, h4 * {
        font-size: 16px;
        border-radius: 2px !important;
        font-family: PingFangSC-Light, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        margin: 5px 0 !important;
        text-indent: 2em !important;
        text-decoration: line-through !important;
      }
      h5, h5 * {
        margin: 0 !important;
        text-align: right !important;
        font-size: 16px !important;
        color: #323232;
        font-family: PingFangSC-Light, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        font-weight: normal !important;
      }
      h6, h6 * {
        font-size: 14px !important;
        font-family: PingFangSC-Light, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        font-style: oblique !important;
        margin: 15px 0;
      }
      p cite, p cite * {
        color: #3D3DF2;
        font-style: italic !important;
      }
      a {
        text-decoration: none;
        word-wrap: break-word;
      }
      a:hover, a:visited, a:link, a:active {
        color: #3D3DF2;
        text-decoration: none !important;
      }
      img {
        width: 100% !important;
        height: auto !important;
      }
      i {
        font-style: normal;
      }
      div {
        color: #323232;
      }
      //
      .wrapScoller, .wrapScoller * {
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
      }
      .wrapScoller {
        padding-top: 5px;
        padding-bottom: 2px;
      }
      .wrap {
        overflow-x: auto;
      }
      table {
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        border-spacing: 0;
        border: 0;
        border-collapse: collapse;
        table-layout: fixed;
        > table > tbody > tr > td {
          border-color: #f0f1f5 !important;
        }
        td {
          width: 0 !important;
          text-shadow: none !important;
          word-break: break-all !important;
          word-wrap: break-word !important;
          margin: 0 !important;
          vertical-align: middle;
          border: 1px solid #323232;
          border-collapse: collapse;
          p {
            text-indent: 0;
            margin: 5px 0;
          }
        }
      }

    }
    .divider-box {
      width: 100%;
      padding: 0 30%;
      .vux-divider {
        display: table;
        white-space: nowrap;
        height: auto;
        overflow: hidden;
        line-height: 1;
        text-align: center;
        padding: 20px 0;
        color: #aeaeae;
        font-size: 12px;
      }
      .vux-divider:after, .vux-divider:before {
        content: '';
        display: table-cell;
        position: relative;
        top: 50%;
        width: 50%;
        background-repeat: no-repeat;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC)
      }
      .vux-divider:before {
        background-position: right 1em top 50%
      }
      .vux-divider:after {
        background-position: left 1em top 50%
      }
    }
    .box-card {
      min-height: 30px;
      margin-top: 20px;
      width: 100%;
      &.box-card-bottom {
        /*min-height: 510px;*/
        // .answerDetail {
          /*min-height: 385px;*/
        // }
        .answer-time {
          width: 100%;
          text-align: right;
          font-size: 14px;
          color: #aeaeae;
          padding: 20px 0;
        }
        .answer-selected {
          width: 100%;
          padding: 10px 0;
          border-top: 1px solid #e4e7ed;
          display: inline-flex;
          .span {
            margin-right: 12px;
            .agree {
              height: 30px;
              padding: 0 7px;
              background-color: rgba(255, 177, 72, 0.2);
              border: 1px solid rgba(255, 177, 72, 0);
              &.selected {
                transition: 0.3s;
                background-color: #ffb148;
                border: 1px solid #ffb148;
                i {
                  color: white;
                }
                .text {
                  color: white;
                }
              }
              i {
                font-size: 12px;
                color: #ffb148;
                display: inline-block;
                transform: rotate(180deg);
                transition: .3s;
              }
              .text {
                /*color: white;*/
                color: #ffb148;
                line-height: 1;
                font-size: 12px;
                font-weight: 400;
              }
            }
            .oppose {
              height: 30px;
              padding: 0 8px;
              background-color: rgba(255, 177, 72, 0.2);
              border: 1px solid rgba(255, 177, 72, 0);
              &.selected {
                transition: 0.3s;
                background-color: #ffb148;
                border: 1px solid #ffb148;
                i {
                  color: white;
                }
                .text {
                  color: white;
                }
              }
              i {
                font-size: 12px;
                color: #ffb148;
                display: inline-block;
              }
              .text {
                color: #ffb148;
                line-height: 1;
                font-size: 12px;
                font-weight: 400;
              }
            }
            .collect, .share {
              height: 30px;
              padding: 0 7px;
              i {
                color: #aeaeae;
              }
              span {
                color: #aeaeae;
              }
            }
            .share {
              &:hover {
                .web-fenxiang1, span {
                  color: #ffb148;
                }

              }
            }
          }
        }
      }
      &.head-card {
        min-height: 150px;
      }
      .correlation {
        .list-user {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e4e7ed;
          position: relative;
          .list {
            flex: 1;
            &.img {
              flex: 0 0 50px;
              font-size: 0;
              line-height: 1;
              img {
                border-radius: 50%;
              }
            }
            &.user-name {
              flex: 0 0 50%;
              padding-left: 10px;
              .name {
                font-size: 14px;
                color: #323232;
                text-justify: distribute;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                text-overflow: ellipsis;
              .auditButton{
                display: inline-block;
                width: 66px;
                height: 18px;
                border-radius: 9px;
                border: 1px solid #fb4319;
                font-size: 12px;
                margin-left: 10px;
                text-align: center;
                color: #fb4319;
              }
              }
              .desc {
                font-size: 12px;
                color: #aeaeae;
                padding-top: 3px;
              }
            }
            &.btn {
              text-align: right;
            }
            img {
              height: 50px;
              width: 50px;
            }
            .list-btns-on {
              color: #ffb148;
              border-color: #ffb148;
              padding: 7px 0;
              width: 70px;
              text-align: center;
              font-size: 14px;
              i {
                font-weight: bold;
                color: #ffb148;
              }
            }
            .list-btns-off {
              color: #8d8d8d;
              background-color: #f0f1f5;
              font-size: 14px;
              padding: 7px 0;
              width: 70px;
              text-align: center;
              &:hover {
                border-color: #e3e3e3;
              }
              &:active {
                border-color: #e3e3e3;
              }
              &:focus {
                border-color: #e3e3e3;
              }
            }
          }
          .rzImg {
            position: absolute;
            right: 0;
            top: 60px;
            width: 100px;
          }
        }
      }
    }
  }
</style>
