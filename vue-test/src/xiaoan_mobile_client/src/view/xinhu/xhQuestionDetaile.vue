<template>
  <div id="xhQuestionDetaile">
    <!-- 问题页 -->
    <div class="scrollArea" v-show="question.questionTitle">
      <div class="question">
        <div class="tag" v-if="topicList.length>0">
          <span v-for="(item,index) in topicList" :key="index" @click="linkTopic(item)">{{item.topicName}}</span>
        </div>
        <div class="title fb">{{question.questionTitle}}</div>
        <div class="describe" style="max-height: 50px; overflow: hidden"
             v-show="question.questionDescription && !describeShowAll">
          <span class="container" v-html="question.questionDescription"></span>
          <span v-show="isshow" class="switch" @click="switchControl">
            <span><b>...</b>展开问题描述<i class="icon iconfont icon-xiangxiajiantou"></i></span>
          </span>
        </div>
        <div class="describeAll" v-show="describeShowAll">
          <span style="text-align: justify;" v-html="question.questionDescriptionHtml"></span>
          <div class="switchAll" @click="describeShowAll=false">
            <span>收起问题描述<i class="icon iconfont icon-xiangshangjiantou"></i></span>
          </div>
        </div>
        <div class="other vux-1px-t">
          <span><i>{{question.attentionCount}}</i>人关注</span>
          <span class="joinLine">|</span>
          <span><i>{{question.answerCount}}</i>个回答</span>
          <template v-if="this.userId!=question.createUserId">
            <span class="focusButton" :class="{blurButton: question.attention}" v-if="!question.attention"
                  @click="addAttention"><i class="icon iconfont icon-jia3"></i> 关注问题
            </span>
            <span class="focusButton" :class="{blurButton: question.attention}" v-else-if="question.attention"
                  @click="unfollow">已关注
            </span>
            <!--<img src="/static/img/personal/focus/closefoc.png" class="focus includess" v-else-if="question.attention" @click="unfollow">-->
          </template>
        </div>
      </div>
      <div class="content" v-if="!clueShow"> <!--  :style="{height: widthChange}" -->
        <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="0">
          <div class="xinhulist" v-for="(item, index) in answerList.data" :key="index">
            <div class="title" v-if="item.anonymous">
              <img :src="$image.xinhu.headerImg" alt="">
              <span>匿名用户</span>
            </div>
            <div class="title fb" @click="goUserInfo(item.userId)" v-else>
              <img :src="item.userPicture" alt="">
              <span>{{item.userName}}</span>
            </div>
            <div class="desc" @click="seeDetaile(item)">{{item.answerContent}}</div>
            <div class="else">
              <span v-if="item.approveCount>0">{{item.approveCount}}个赞同 <i class="split">|</i></span>
              <span>{{formatData(item.createTime)}}</span>
            </div>
            <img v-if="item.authentication" class="zanImg" :src="$image.xinhu.rz">
          </div>
        </ul>
        <p class="infinite-loading">
          <xiaoan-drop v-model="answerList.hasNext"></xiaoan-drop>
        </p>
      </div>
      <div class="content" style="background-color: #fff;margin-top:12px;" v-else>
        <div class="qsuccess vux-1px-b">
          <div class="text fb" v-show="from">
            <icon type="success"></icon>
            {{prompt.title}}
          </div>
          <div class="tip">{{prompt.desc}}</div>
        </div>
        <div class="inviterBox">
          <div class="inviter vux-1px-b" v-for="(item, index) in vInfo">
            <img class="inviterImg" :src="item.weixinAvatar" @click="goUserInfo(item.id)">
            <div class="info" @click="goUserInfo(item.id)">
              <div class="inviterName fb">{{item.userName}}</div>
              <div class="inviterDesc">{{item.synopsis}}</div>
            </div>
            <div class="inviterBtn" @click="inviteForQuestion(item.id)" v-show="!item.invited">邀请</div>
            <div class="inviterBtnNo" v-show="item.invited">已邀请</div>
          </div>
        </div>

      </div>
    </div>
    <span class="tt-clue" :class="{clueActive: IsActive}" v-show="clueShow">别让问题孤单，留个回答试试</span>
    <div class="show_footer footer" id="footerDom" v-if="!isOwner">
      <div class="footer-home" @click="goHome">
        <div class="tabbar-Icon">
          <img :src="footerHome.icon" alt="">
        </div>
        <p>{{footerHome.name}}</p>
      </div>
      <div class="show_items" v-for="(list, index) in footerItem" :key="index" @click="footerClick(list)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt="">
        </div>
        <p class="tabbar-value">{{list.name}}</p>
      </div>
    </div>
    <div class="show_footer owner" v-else-if="isOwner">
      <div class="show_items" v-for="(list, index) in ownerItem" :key="index" @click="footerClick(list)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt=""><span class="tabbar-value">{{list.name}}</span>
        </div>
      </div>
      <span class="splitLine"></span>
    </div>
    <div v-transfer-dom>
      <popup v-model="showAnswer" height="100%">
        <div id="popAnswer" class="popupQuestionDetail">
          <div class="title">{{question.questionTitle}}</div>
          <div class="tipAnonymous vux-1px-t vux-1px-b">
            <group>
              <x-switch title="启用匿名" v-model="isAnonymous" style="padding-left: 10px;"></x-switch>
            </group>
          </div>
          <textarea v-model="answerContent" class="textAreaInput" placeholder="输入回答"></textarea>
          <div class="footBtn">
            <div @click="cancel(0)">取消</div>
            <div class="active" @click="answerQuestion">提交</div>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showEdit" height="100%">
        <div id="popEdit" class="popupQuestionDetail">
          <!--<div class="title" style="text-align: center; padding: 6px 12px;">编辑问题</div>-->
          <div style="height: 6px;"></div>
          <div class="vux-1px-b" style="margin: 0 12px; padding: 6px 0;"><input v-model="eidtQuestion" type="text"
                                                                                class="textQuestion" maxlength="50"
                                                                                placeholder="输入问题并以问号结尾（4-50字以内）"
                                                                                @input="wordInput"></div>
          <textarea v-model="editQuestionDesc" class="textAreaDesc" placeholder="请输入问题描述(200字以内)"></textarea>
          <div class="tipMsg">
            <i class="icon iconfont icon-jibenxinxi"></i>
            编辑理由，仅提交给管理员,由管理员确认是否修改！
          </div>
          <textarea v-model="editContent" class="textAreaContent" placeholder="请输入编辑理由"></textarea>
          <div class="footBtn">
            <div @click="cancel(1)">取消</div>
            <div class="active" @click="editQuestion">提交</div>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showDelete" height="100%">
        <div id="popDelete" class="popupQuestionDetail">
          <div class="title">{{question.questionTitle}}</div>
          <div class="tipMsg">
            <i class="icon iconfont icon-jibenxinxi"></i>
            仅提交给管理员,由管理员确认是否删除！
          </div>
          <textarea v-model="deleteContent" class="textAreaInput" placeholder="请输入删除原因"></textarea>

          <div class="footBtn">
            <div @click="cancel(2)">取消</div>
            <div class="active" @click="deleteQuestion">提交</div>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showRelated" position="bottom" max-height="80%" class="popup-xhRelated">
        <h3 class="popup-title fb">相关内容</h3>
        <ul class="popup-content" v-if="relatedQuestionList.length > 0">
          <li v-for="(list,index) in relatedQuestionList" :key="index" @click="linkQuestion(list)">
            <p>{{ list.questionTitle}}</p>
          </li>
        </ul>
        <ul class="popup-content" v-else>
          <li style="text-align: center">暂无相关内容</li>
        </ul>
        <div class="popup-close fb" @click="showRelated = false"> 取消</div>
      </popup>
    </div>
    <div class="cover" v-show="showGuide">
      <img class="guide1" :src="$image.xinhu.guide7">
      <button class="knowBtn" @click="hideGuide()">知道了</button>
    </div>
  </div>
</template>

<script>
  import {Group, Icon, Popup, Swiper, SwiperItem, TransferDom, XSwitch} from 'vux'
  import mixins from './mixin/isTestUser'
  export default {
    mixins: [mixins],
    data() {
      return {
        prompt: {
          title: '成功提问',
          desc: '你可以邀请下面用户来更快获得回答'
        },
        isshow: false,
        questionId: '',
        from: '',
        topicList: [],
        relatedQuestionList: [],
        question: {},
        describeShow: false,
        describeShowAll: false,
        isFocus: false,
        answerList: {
          isLoading: false,
          data: [],
          nowPage: 1,
          hasNext: true
        },
        clueShow: false,
        footerHome: {id: 0, name: '信乎', value: '', icon: this.$image.base.home, isshow: false},
        footerItem: [
          {
            id: 0,
            name: '修改标题',
            value: '',
            show: false,
            icon: this.$image.xinhu.qedit,
            isshow: false
          },
          {
            id: 1,
            name: '回答问题',
            value: '',
            show: false,
            icon: this.$image.xinhu.answer,
            isshow: true
          },
          {
            id: 2,
            name: '相关内容',
            value: '',
            show: false,
            icon: this.$image.rules.linkIcon,
            isshow: false
          },
        ],
        ownerItem: [
          {
            id: 3,
            name: '编辑问题',
            value: '',
            show: false,
            icon: this.$image.xinhu.qedit,
            isshow: false
          },
          {
            id: 4,
            name: '删除问题',
            value: '',
            show: false,
            icon: this.$image.xinhu.qdelete,
            isshow: true
          }
        ],
        // loaded: true,
        isOwner: false,
        // headerImg: '../../../static/img/xinhu/headerImg.png',
        showAnswer: false,
        showEdit: false,
        showDelete: false,
        showRelated: false,
        answerContent: '',
        editContent: '',
        editQuestionDesc: '',
        eidtQuestion: '',
        deleteContent: '',
        isAnonymous: false,
        userId: '',
        showGuide: true,
        vInfo: [] // 大v信息列表
      }
    },
    // 使用其它组件
    components: {
      Swiper,
      SwiperItem,
      Popup,
      XSwitch,
      Group,
      Icon
    },
    directives: {
      TransferDom
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.isShowGuide()
      this.from = this.$route.query.from
      let userId = this.$cookie.getCookie("userId");
      if (!this.$cookie.isLogin()) {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      //
      if (this.$route.query.propagate) {
        this.prompt.title = '您的问题已经提交信公技术部';
        this.prompt.desc = '专家团队即将为您解答';
      }
      this.questionId = this.$route.query.questionId
      // this.relatedQuestion()
      this.userId = this.$cookie.getUserInfo().id
      console.log('userId:' + this.userId)
      this.$MTAmethod.mtaShare('th7Yz7CYvV', {'43n6gb9v7a': 'true'})
    },
    mounted() {
      this.getQuestionDetails();
      this.$nextTick(() => {
        document.getElementById('xhQuestionDetaile').style.height = document.body.clientHeight + 'px'
        document.querySelector('#popAnswer').style.height = document.body.clientHeight + 'px'
        document.querySelector('#popEdit').style.height = document.body.clientHeight + 'px'
        document.querySelector('#popDelete').style.height = document.body.clientHeight + 'px'
        var answer = document.getElementById('xhQuestionDetaile').clientHeight
        var footer = document.getElementsByClassName('show_footer')[0].clientHeight
        var scrollArea = document.getElementsByClassName('scrollArea')[0]
        scrollArea.style.height = answer - footer + 'px'
      })
    },
    // 方法
    methods: {
      isShowGuide() {
        let xhGuide = this.$storage.get('xhGuideQuestion')
        if (xhGuide) {
          this.showGuide = false
        } else {
          this.showGuide = true
        }
      },
      hideGuide() {
        this.$storage.set('xhGuideQuestion', 1)
        this.showGuide = false
      },
      goUserInfo(othersUserId) {
        this.$router.push({path: '/userOther', query: {selectUserId: othersUserId}})
      },
      linkTopic(item) {
        this.$router.push({path: '/xhTopic', query: {topicId: item.topicId}})
      },
      linkQuestion(item) {
        this.$router.push({path: '/xhRedirect', query: {from: 'questionDetaile', questionId: item.questionId}})
      },
      formatData(date) {
        if (date) {
          return this.$const.format(date)
        } else {
          return date
        }
      },
      seeDetaile(list) {
        this.$router.push({
          path: '/xhAnswerDetaile',
          query: {
            questionId: this.questionId,
            answerId: list.answerId
          }
        })
      },
      footerClick(index) {
        console.log(index)
        let id = index.id
        if (id === 0) {
          this.isOwner = true
        } else if (id === 1) {
          if (this.question.questionReply) {
            this.$router.push({
              path: '/xhAnswerDetaile',
              query: {questionId: this.question.questionId, answerId: this.question.replyAnswerId}
            })
          } else {
            this.showAnswer = true
          }
        } else if (id === 2) {
          this.showRelated = true
          this.relatedQuestion()
        } else if (id === 3) {
          this.showEdit = true
          document.title = '编辑问题'
        } else if (id === 4) {
          this.showDelete = true
          document.title = '删除问题'
        }

      },
      goHome() {
        this.$router.push({path: '/xhList'})
      },
      switchControl() {
        this.describeShowAll = true
        // this.describeShow = this.describeShow ? false : true
      },
      focusMethod() {
        this.isFocus = this.isFocus ? false : true
      },
      isShowDescribe() {
        this.$nextTick(() => {
          let hei = document.querySelector('.describe').clientHeight;
          if (hei / 20 > 2) {
            this.describeShow = false
          } else {
            this.describeShow = true
          }
          console.log('hei:' + hei)
        })
      },
      //
      cancel(index) {
        if (index === 0) {
          this.showAnswer = false
        } else if (index === 1) {
          this.showEdit = false
          document.title = '信乎'
        } else if (index === 2) {
          this.showDelete = false
          document.title = '信乎'
        } else if (index === 3) {
          this.showRelated = false
        }
        this.isOwner = false
      },
      loadMore() {
        if (this.answerList.hasNext) {
          this.listAnswersForQuestion()
        }
      },
      // 取消关注
      unfollow() {
        let _this = this
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消关注吗？',
          // 组件除show外的属性
          onConfirm() {
            /*_this.$http ({
              url: _this.$api.xinhu.unFollow,
              method: 'DELETE',
              params: {
                concernedId: _this.questionId,
                attentionType: 1
              }
            })*/
            let params = {
              concernedId: _this.questionId,
              attentionType: 1
            }
            _this.$axios.xinhu.unFollow(params).then((res) => {
              if (res.data.returnCode == 200) {
                _this.question.attention = false
                _this.question.attentionCount = _this.question.attentionCount - 1
              }
            })
          },
          onCancel() {
          }
        })
      },
      // 问题列表
      listAnswersForQuestion() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listAnswersForQuestion,
          params: {
            questionId: this.questionId,
            // userId: this.$cookie.getCookie('userId'),
            pageNum: this.answerList.nowPage,
            pageSize: 10
          }
        })*/
        let params = {
          questionId: this.questionId,
          pageNum: this.answerList.nowPage,
          pageSize: 10
        }
        this.$axios.xinhu.listAnswersForQuestion(params).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject) {
            this.answerList.data = this.answerList.data.concat(res.data.returnObject)
            let page = 1
            let allCount = res.data.total
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.answerList.nowPage >= page) {
              this.answerList.hasNext = false
            } else {
              this.answerList.nowPage += 1
            }
          } else {
            this.answerList.hasNext = false
          }
          // 显示提示 "别让问题孤单，留个回答试试”
          if (this.answerList.data.length === 0) {
            this.clueShow = true
            this.getRandomV()
          }
        }).catch((err) => {
          this.answerList.hasNext = false
        })
      },
      // 获取大v信息
      getRandomV() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.getRandomV,
          params: {
            vNumber: 5,
            questionId: this.questionId
          }
        })*/
        let params = {
          vNumber: 5,
          questionId: this.questionId
        }
        this.$axios.xinhu.getRandomV(params).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.vInfo = res.data.returnObject
            /* this.vInfo.forEach((item, index) => {
              item.isv = false
            }) */
          }
        })
      },
      // 邀请大V
      inviteForQuestion(id) {
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.inviteForQuestion,
          params: {
            questionId: this.questionId,
            invitedUserId: id
          }
        })*/
        let params = {
          questionId: this.questionId,
          invitedUserId: id
        }
        this.$axios.xinhu.inviteForQuestion(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '邀请成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.vInfo.forEach((item, index) => {
              if (item.id == id) {
                item.invited = true
              }
            })
          } else {
            this.$vux.toast.show({text: '邀请失败，请重试', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      },
      // 相关问题
      relatedQuestion() {
        let params = {
          keyWord: this.question.questionTitle,
          questionId: this.questionId,
          pageNum: 1,
          pageSize: 5
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listRelatedQuestions,
          params: {
            keyWord: this.question.questionTitle,
            questionId: this.questionId,
            pageNum: 1,
            pageSize: 5
          }
        })*/
        this.$axios.xinhu.listRelatedQuestions(params).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.relatedQuestionList = res.data.returnObject.list
          }
        })
      },
      // 获取问题详情
      getQuestionDetails() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.getQuestionDetails,
          params: {
            questionId: this.questionId
          }
        })*/
        let params = {
          questionId: this.questionId
        }
        this.$axios.xinhu.getQuestionDetails(params).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject) {
            this.topicList = res.data.returnObject.topicList
            // this.answerList = returnObj.answer
            this.question = res.data.returnObject
            // this.question.questionDescription = '测试数据测试数据测试数据测试数据'
            if (this.question.questionDescription.length > 50) {
              this.isshow = true
            } else {
              this.isshow = false
            }

            this.question.questionDescriptionHtml = this.question.questionDescription.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')

            this.eidtQuestion = this.question.questionTitle
            this.editQuestionDesc = this.question.questionDescription
            this.isShowDescribe()
            // 是否可以提交编辑，删除别人的问题
//            if (this.userId != this.question.createUserId) {
//              this.footerItem.shift()
//            }
            this.weixin()
          } else {
            this.topicList = []
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          this.$vux.toast.show({text: error.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      weixin() {
        let adverttitle = this.question.questionTitle;
        let sharelink2 = window.location.href;//分享链接
        let questionDescription = this.question.questionDescription
        if (questionDescription.length > 30) {
          questionDescription = questionDescription.substring(0, 30) + '...'
        }
        let shareDesc = questionDescription;//描述
        this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
      },
      // 关注问题
      addAttention(item) {
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_QUESTION',
            concernedId: this.questionId,
            concernedTitle: this.question.questionTitle
          }
        })*/
        let params = {
          attentionType: 'ATTENTION_QUESTION',
          concernedId: this.questionId,
          concernedTitle: this.question.questionTitle
        }
        this.$axios.xinhu.addAttention(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '关注成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.question.attention = true
            if (this.question.attentionCount) {
              this.question.attentionCount = this.question.attentionCount + 1
            } else {
              this.question.attentionCount = 1
            }
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'b6s37vcuq3': 'true'})
          } else {
            this.$vux.toast.show({text: '关注失败，请重试', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      },

      // 回答问题
      answerQuestion() {
        if (!this.answerContent) {
          this.$vux.toast.show({text: '回答内容不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        let params = {
          questionId: this.questionId,
          questionTitle: this.question.questionTitle,
          answerContent: this.answerContent,
          isAnonymous: this.isAnonymous
        }
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.addAnswer,
          params: {
            questionId: this.questionId,
            questionTitle: this.question.questionTitle,
            answerContent: this.answerContent,
            isAnonymous: this.isAnonymous
          }
        })*/
        this.$axios.xinhu.addAnswer(params).then((res) => {
          if (res.data.returnCode == 200) {
            // this.$vux.toast.show({text: '提交成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            let qid = res.data.returnObject.questionId
            let aid = res.data.returnObject.answerId
            this.$router.push({path: '/xhRedirect', query: {from: 'answer', questionId: qid, answerId: aid}})
            this.addUserAnswerMsg(aid, qid, this.question.questionTitle, this.isAnonymous)
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'v69qaryvzz': 'true'})
          } else {
            this.$vux.toast.show({text: res.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      addUserAnswerMsg(answerId, questionId, questionTitle, isAnonymous) {
        let params = {
          answerId: answerId,
          questionId: questionId,
          questionTitle: questionTitle,
          isAnonymous: isAnonymous
        }
        this.$axios.userMsg.addUserAnswerMsg(params).then(res => {

        })
      },
      // 编辑问题申请
      editQuestion() {
        if (this.eidtQuestion.length < 4) {
          this.$vux.toast.show({text: '问题请输入至少4个字', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        if (this.editQuestionDesc.length > 200) {
          this.$vux.toast.show({text: '问题描述200个字以内', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        if (!this.editContent) {
          this.$vux.toast.show({text: '编辑理由不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        let params = {
          questionId: this.questionId,
          questionTitle: this.question.questionTitle,
          questionDescription: this.editQuestionDesc,
          applicationType: 'EDIT',
          reason: this.editContent,
          applicationContent: this.eidtQuestion
        }
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.addEditQuestionApplication,
          params: {
            questionId: this.questionId,
            questionTitle: this.question.questionTitle,
            questionDescription: this.editQuestionDesc,
            applicationType: 'EDIT',
            reason: this.editContent,
            applicationContent: this.eidtQuestion
          }
        })*/
        this.$axios.xinhu.addEditQuestionApplication(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '提交成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.showEdit = false
            this.isOwner = false
          } else {
            this.$vux.toast.show({text: res.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err)
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 删除问题申请
      deleteQuestion() {
        if (!this.deleteContent) {
          this.$vux.toast.show({text: '删除原因不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        let params = {
          questionId: this.questionId,
          questionTitle: this.question.questionTitle,
          questionDescription: '',
          applicationType: 'DEL',
          reason: this.deleteContent,
          applicationContent: ''
        }
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.addEditQuestionApplication,
          params: {
            questionId: this.questionId,
            questionTitle: this.question.questionTitle,
            questionDescription: '',
            applicationType: 'DEL',
            reason: this.deleteContent,
            applicationContent: ''
          }
        })*/
        this.$axios.xinhu.addEditQuestionApplication(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '提交成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.showDelete = false
            this.isOwner = false
          } else {
            this.$vux.toast.show({text: res.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #xhQuestionDetaile {
    font-size: 12px;
    background: #f0f1f5;
    width: 100%;
    height: 100%;
    .scrollArea {
      width: 100%;
      height: auto;
      overflow-y: scroll;
      box-sizing: border-box;
      .question {
        width: 100%;
        height: auto;
        background: #FFF;
        padding: 6px 12px 6px 12px;
        .tag {
          height: 30px;
          width: 100%;
          overflow-x: scroll;
          margin-bottom: 6px;
          position: relative;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          &::-webkit-scrollbar {
            display: none;
            opacity: 0;
          }
          span {
            height: 24px;
            line-height: 24px;
            display: inline-block;
            font-size: 13px;
            color: #8d8d8d;
            padding: 0 7px;
            background: #f0f1f5;
            border-radius: 2px;
            margin-right: 5px;
            margin-top: 3px;
            margin-bottom: 3px;
          }
        }
        .title {
          font-size: 16px;
          color: #323232;
          padding-bottom: 3px;
        }
        .describe, .describeAll {
          width: 100%;
          display: inline-block;
          font-size: 14px;
          color: #545454;
          position: relative;
          margin: 0 0 4px 0;
          /*border-bottom: 1px solid #e3e3e3;*/
          box-sizing: border-box;
          .container {
            width: 100%;
            height: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; //规定几行显示省略号
            -webkit-box-orient: vertical;
          }
          .switch {
            position: absolute;
            right: 0;
            bottom: 0;
            background: #fff;
            color: #ffb148;
            b {
              color: #545454;
              margin-right: 3px;
              display: inline-block;
              padding-left: 2px;
              box-sizing: border-box;
              font-weight: normal;
            }
          }
          .switchAll {
            text-align: right;
            background: #fff;
            color: #ffb148;
            b {
              color: #545454;
              margin-right: 3px;
              display: inline-block;
              padding-left: 2px;
              box-sizing: border-box;
              font-weight: normal;
            }
          }
          span {
            i {
              color: #ffb148;
              font-size: 10px;
            }
          }
        }
        .other {
          width: 100%;
          height: auto;
          /*margin-top:6px;*/
          padding: 6px 0 0 0;
          line-height: 24px;
          box-sizing: border-box;
          color: #aeaeae;
          font-size: 13px;
          .joinLine {
            font-size: 11px;
            margin: 0 3px;
          }
          i {
            font-weight: normal;
            color: #ffb148;
          }
          .focusButton {
            width: auto;
            height: 25px;
            /*line-height: 23px;*/
            text-align: center;
            border-radius: 2px;
            border: 1px solid #ffb148;
            font-size: 13px;
            box-sizing: border-box;
            float: right;
            color: #ffb148;
            padding: 0 3px;
            display: inline-flex;
            align-items: center;
            i {
              font-size: 12px;
              line-height: normal;
              margin-right: 2px;
            }
          }
          .blurButton {
            display: inline-block;
            background-color: #f0f1f5;
            border: 0;
            color: #aeaeae;
            padding: 1px 6px;
            i {
              color: #aeaeae
            }
          }
        }
      }
      .content {
        width: 100%;
        height: 200px;
        .xinhulist {
          width: 100%;
          height: 100%;
          margin-top: 10px;
          padding: 0 12px 10px 12px;
          background-color: #fff;
          position: relative;
          .title {
            color: #323232;display: flex;align-items: center;padding: 5px 0;
            img {
              width: 20px;
              height: 20px;
              border-radius: 50%;
            }
            span {
              font-size: 15px;color: #323232;margin-left: 5px;
            }
          }
          .desc {
            margin-bottom: 5px;
            font-size: 14px;
            color: #545454;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          .else {
            color: #aeaeae;
            span {
              display: inline-block;
            }
            .split {
              display: inline-block;
              padding: 0 .3px;
            }
          }
          .zanImg {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 70px;
          }
        }
        .vux-slider > .vux-swiper {
          height: 100% !important;
          overflow-y: scroll;
        }
        .qsuccess {
          /*height: 70px;*/
          margin: 0 12px;
          padding: 12px;
          .text {
            font-size: 16px;
          }
          .weui-icon-success {
            font-size: 18px;
            position: relative;
            top: -1px;
          }
          .tip {
            margin-top: 6px;
            font-size: 13px;
            color: #aeaeae;
          }
          & > div {
            text-align: center;
          }
        }
        .inviterBox {
          width: 100%;
          background-color: #fff;
          .inviter {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 12px 12px 12px;
            padding: 6px 0;
            background-color: #fff;
            height: 60px;
            .inviterImg {
              width: 35px;
              height: 35px;
              border-radius: 50%;
            }
            .info {
              flex-grow: 1;
              padding-left: 6px;
              max-width: 70%;
              .inviterName {
                font-size: 15px;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .inviterDesc {
                font-size: 13px;
                color: #aeaeae;
              }
            }
            .inviterBtn {
              padding: 3px;
              text-align: center;
              min-width: 64px;
              display: inline-block;
              color: #ffb148;
              font-size: 13px;
              background-color: #fff;
              border: 1px solid #ffb148;
              border-radius: 2px;
            }
            .inviterBtnNo {
              padding: 3px;
              text-align: center;
              min-width: 64px;
              display: inline-block;
              font-size: 13px;
              color: #8d8d8d;
              background-color: #f0f1f5;
              border: 1px solid #f0f1f5;
              border-radius: 2px;
            }
          }
        }

      }
    }
    .clueActive {
      opacity: 0 !important;
      bottom: 55px !important;
    }
    .tt-clue {
      width: 200px;
      height: auto;
      line-height: 20px;
      left: 58%;
      transform: translateX(-50%);
      font-size: 13px;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      text-align: center;
      border: 4px solid rgba(255, 177, 72, 0.9);
      text-indent: 0px;
      border-radius: 2px;
      position: absolute;
      pointer-events: none;
      background-color: rgba(255, 177, 72, 0.9);
      color: white;
      bottom: 62px;
      z-index: 800;
      opacity: 1;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      -webkit-transition: all 1s ease-in-out;
      -moz-transition: all 1s ease-in-out;
      -o-transition: all 1s ease-in-out;
      -ms-transition: all 1s ease-in-out;
      transition: all 1s ease-in-out;
      animation: hidden 3s;
      animation-fill-mode: forwards;
      &:before, &:after {
        content: '';
        position: absolute;
        bottom: -14px;
        left: 50%;
        transform: translateX(-75%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid rgba(255, 177, 72, 0.9);
      }
    }
    @keyframes hidden {
      0% {opacity: 1; bottom: 62px;}
      80% {opacity: 1; bottom: 62px;}
      99% {opacity: 0;; bottom: 62px;}
      100% {opacity: 0; right: -300px;}
    }
    .show_footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      z-index: 300;
      display: flex;
      background: #f0f1f5;
      border-top: 1px solid #e3e3e3;
      box-shadow: 0 -8px 13px rgba(0, 0, 0, .02);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .show_items:hover .tt-clue {
        opacity: 0.9;
        bottom: 70px;
      }
      .footer-home:active {
        background-color: #e3e3e3;
        -webkit-transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .footer-home {
        height: 100%;
        padding: 5px 0;
        text-align: center;
        border-right: 1px solid #e3e3e3;
        box-sizing: border-box;
        float: left;
        .tabbar-Icon {
          padding: 0 15px;
          img {
            height: 20px;
          }
        }
        p {
          font-size: 13px;
          color: #767877;
        }
      }
      .show_items {
        flex: 1;
        height: 100%;
        text-align: center;
        color: #767877;
        font-size: 12px;
        text-decoration: none;
        padding: 5px 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        position: relative;
        .tabbar-Icon {
          img {
            height: 20px;
          }
        }
        .tabbar-value {
          font-size: 13px;
          color: #767877;
        }
        .show_shareIcon {
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/Attribute.png");
        }
        .show_collectIcon {
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/celloctIcon.png");
        }
        .show_relativeIcon {
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/linkIcon.png");
        }
      }

      .show_items.active {
        color: #f6900c;
      }
      .show_items span {
        display: block;
        width: 100%;
      }
      .show_shareIcon, .show_collectIcon, .show_relativeIcon {
        height: 50%;
      }

    }
    .owner {
      position: relative;
      .splitLine {
        display: inline-block;width: 1px;height: 35px;background: #e3e3e3;
        position: absolute;left: 0;right: 0;bottom: 0;top: 0;margin: auto;
      }
      .show_items {
        .tabbar-Icon {
          margin-top: 10px;overflow: hidden;
          img {
            display: inline-block;
            height: 17px;vertical-align: middle;
          }
          span {
            display: inline-block;
            vertical-align: middle;
            width: auto;
            height: 100%;
            font-size: 14px;
            font-weight: normal;
            color: #8d8d8d;
            margin-left: 5px;
          }
        }
      }
    }
    .guide1 {
      position: absolute;
      width: 260px;
      left: 55px;
      bottom: 1px;
    }
  }
  .popupQuestionDetail {
    textarea {
      font-size: 15px;
    }
    background-color: #fff;
    height: 100%;
    position: relative;
    .title {
      padding: 12px;
      font-size: 17px;
      font-family: PingFangSC-Medium;
      color: #323232;
    }
    .tipMsg {
      padding: 12px;
      background-color: #f0f1f5;
      color: #ffb148;
      font-size: 14px;
      i {
        display: inline-block;
        transform: rotate(180deg);
        color: #ffb148;
      }
    }
    .tipAnonymous {
      color: #aeaeae
    }
    .textAreaInput {
      height: 400px;
      width: 100%;
      padding: 10px;
      border: 0;
    }
    .textQuestion {
      font-size: 15px;
      width: 100%;
      /*padding: 6px 12px;*/
      border: 0;
    }
    .textAreaDesc {
      height: 80px;
      width: 100%;
      padding: 6px 12px;
      border: 0;
    }
    .textAreaContent {
      height: 200px;
      width: 100%;
      padding: 6px 12px;
      border: 0;
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
  }
  .popup-xhRelated {
    background-color: #fff !important;
    .popup-title {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #e3e3e3;
      color: #323232;
      margin: 0;
      font-size: 17px;
      box-sizing: border-box;
      text-align: center;
      line-height: 50px;
    }
    .popup-content {
      width: 100%;
      max-height: 300px;
      overflow-y: scroll;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      list-style: none;
      -webkit-overflow-scrolling: touch;
      font-size: 15px;
      color: #323232;
      li {
        padding: 12px 0;
        margin: 0 12px;
        box-sizing: border-box;
        border-bottom: 0.5px solid #e3e3e3;
        p {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      li:last-child {
        border-bottom: 0;
      }
      li:active {
        background-color: #f0f1f5;
      }
    }
    .popup-close {
      width: 100%;
      height: 50px;
      border-top: 1px solid #e3e3e3;
      color: #f6900c;
      margin: 0;
      font-size: 17px;
      box-sizing: border-box;
      text-align: center;
      line-height: 50px;
    }
  }
  .vux-no-group-title {
    margin-top: 0 !important;
    font-size: 14px;
  }
  .weui-switch:checked {
    border-color: #ffb148 !important;
    background-color: #ffb148 !important;
  }
</style>
