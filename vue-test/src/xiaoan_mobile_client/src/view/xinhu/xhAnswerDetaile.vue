<template>
  <div id="xhAnswerDetail">
    <!--<vsearch></vsearch>-->
    <div class="searchs" id="inputS">
      <!--------ios--------------->
      <div class="seabox">
        <form action="" onsubmit=" return false;">
          <input id="inputCount" type="text" class="text" :placeholder="placeholder" @focus="searchFocus"
                 @blur="searchBlur" v-model="values" @input="searchInput" @keyup.13="searchBlur">
        </form>
        <div class="nodeGroup">
          <div class="nodesLen">{{indexs + 1}}/{{nodessLen}}</div>
          <div class="nodeslenText">无结果</div>
          <img :src="close" alt="" @click="closeCount()" class="closeCount">
        </div>
      </div>
      <div class="icon selection" v-show="iconShow">
        <button class="rulesBtn">
          <i class="icon iconfont icon-xiangshangjiantou" @click="topRules()"></i>
        </button>
        <button class="rulesBtn">
          <i class="icon iconfont icon-xiangxiajiantou" @click="bottomRules()"></i>
        </button>
      </div>
    </div>
    <div class="headerTitle" id="headerContent">
      <div class="title vux-1px-b">{{ question }}</div>
      <div class="line">

          <span @click="editInterface('edit')" v-if="othersUserId == userIdMy">
            <img :src="editImg" alt=""> 编辑答案
          </span>
        <span @click="editInterface('add')" v-else-if="!questionReply">
            <img :src="editImg" alt=""> 写回答
          </span>
        <span @click="goMyAnswer()" v-else>
            <img :src="showImg" alt="" style="position: relative;top:-1px;"> 我的答案
          </span>
        <span @click="questionList">
            查看全部<span style="color:#ffb148" class="count">{{ answerCount }}</span>个回答
            <i class="icon iconfont icon-xiangyoujiantou"></i>
          </span>
        <img class="guide1" :src="$image.xinhu.guide3" v-show="showGuide1">
      </div>
    </div>
    <!---->
    <div :style="{height: heightLe+'px'}" class="detaileBox" @click="cancelMethod">
      <swiper height="100%" :style="{height: heightLe+'px'}" v-model="index" :show-dots="false"
              @on-index-change="indexChange"
              :min-moving-distance="50">
        <swiper-item v-for="(item, index) in questionIdList" :key="index" :style="{height: heightLe+'px'}">
          <div class="tab-swiper vux-center answer" v-show="item==answerId">
            <div class="author vux-1px-b">
              <img :src="headerImg" @click="goUserInfo">
              <div class="authorText" @click="goUserInfo">
                <p>{{ userName }}</p>
                <p>{{ userSynopsis }}</p>
              </div>
              <div v-show="!showFocus" @click="deleteAnswer" class="focus deleteA">
                <i class="icon iconfont icon-shanchu"></i> 删除回答
              </div>
              <div v-show="showFocus && userName!='匿名用户'">
                <img v-if="followResponder" @click="unfollow" :src="includesImg" class="focus includess">
                <img v-else-if="!followResponder" @click="addAttention" :src="offIncludes" class="focus includess">
              </div>
            </div>
            <div class="content" :id="'m' + item" v-show="!showLoading" @click="cancelMethod">
              <div v-html="answerContent" class="rules-contents" id="answerDetail"></div>
              <p class="editDate">
                编辑于{{ atTimes }}
              </p>
              <img :src="rzImg" class="rzImgStyle" alt="" v-show="authentication">
            </div>
          </div>
        </swiper-item>
      </swiper>
      <img class="guide3" :src="$image.xinhu.guide5" v-show="showGuide3">
    </div>

    <div class="show_footer" id="footerDom">
      <div class="footer-home" @click="goHome">
        <div class="tabbar-Icon">
          <img :src="footerHome.icon" alt="">
        </div>
        <p>{{footerHome.name}}</p>
      </div>
      <div class="show_items" v-for="(list, index) in footerItem" @click="footerClick(index)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt="" v-if="list.name == '已反对'" style="transform: rotate(180deg)">
          <img :src="list.icon" alt="" v-else>
        </div>
        <p class="tabbar-value">{{list.name}}</p>
      </div>
    </div>
    <div class="editContent" v-show="editSwitch">
      <div class="editBody">
        <div class="editTitle">
          {{ question }}
        </div>
        <div class="anonymous" v-if="othersUserId != userIdMy">
          <!--<x-switch title="启用匿名"></x-switch>-->
          <x-switch title="启用匿名" v-model="isAnonymous"></x-switch>
        </div>
        <textarea id="editText" v-model="editContent" placeholder="输入回答"></textarea>
      </div>
      <div class="editButton">
        <span @click="closeEdit">取消</span>
        <span @click="answerQuestion">发布</span>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showCollect" position="bottom" max-height="80%" class="popup-xhRelated">
        <v-popupCollect iType="qa" :refId="answerId"></v-popupCollect>
        <div class="popup-close" @click="showCollect = false"> 取消</div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showRelated" position="bottom" max-height="80%" class="popup-xhRelated">
        <h3 class="popup-title fb">相关内容</h3>
        <ul class="popup-content" v-if="relatedQuestionList.length>0">
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
    <loading :show="showLoading" text=""></loading>
    <div class="agreeBox" v-show="showAgree">
      <div v-if="this.approveStatus == null" @click="agreeMethod">
        <i class="iconfont icon-sanjiaoxing rotate"></i>
        <span>赞同</span>
      </div>
      <div v-if="this.approveStatus == null" @click="opposeMethod">
        <i class="iconfont icon-sanjiaoxing"></i>
        <span>反对</span>
      </div>
      <p v-else-if="this.approveStatus !== null && !this.approveStatus" @click="cancelAgree">
        <i class="iconfont icon-sanjiaoxing"></i>
        <span>取消反对</span>
      </p>
      <p v-else-if="this.approveStatus !== null && this.approveStatus" @click="cancelAgree">
        <i class="iconfont icon-sanjiaoxing" style="display: inline-block;transform: rotate(180deg)"></i>
        <span>取消赞同</span>
      </p>
    </div>

    <div class="cover" v-show="showGuide1">
      <!--<img class="guide1" src="/static/img/xinhu/guide3.png">-->
    </div>
    <button class="knowBtn" v-show="showGuide1" @click="hideGuide(1)">知道了</button>
    <div class="cover" v-show="showGuide2">
      <img class="guide2" :src="$image.xinhu.guide4">
      <button class="knowBtn" @click="hideGuide(2)">知道了</button>
    </div>
    <div class="cover" v-show="showGuide3">
      <!--<img class="guide2" src="/static/img/xinhu/guide5.png">-->
    </div>
    <button class="knowBtn" v-show="showGuide3" @click="hideGuide(3)">知道了</button>
  </div>
</template>
<script>
  import {Loading, TransferDom, XSwitch, Swiper, SwiperItem, Popup} from 'vux'
  import vsearch from './components/input.vue'
  import popupCollect from './components/popupCollect'
  import mixins from './mixin/isTestUser'
  const list = () => []
  export default {
    mixins: [mixins],
    name: 'xhAnswerDetaile',
    components: {
      Loading,
      XSwitch,
      Swiper,
      SwiperItem,
      vsearch,
      Popup,
      'v-popupCollect': popupCollect
    },
    data() {
      return {
        heightLe: 400,
        answerId: '',
        answerDetails: '',
        showCollect: false,
        showRelated: false,
        index: 0,
        copyIndex: 0,
        demo2: '',
        list2: list(),
        rzImg: this.$image.xinhu.rz,
        editImg: this.$image.xinhu.edit,
        showImg: this.$image.xinhu.show,
        editSwitch: false,
        isSelect: false,
        question: '',
        questionDescription: '',
        anonymous: true,
        headerImg: this.$image.xinhu.headerImg,
        includesImg: this.$image.personal.closefoc,
        offIncludes: this.$image.personal.foc,
        footerHome: {id: 0, name: '信乎', value: '', icon: this.$image.base.home, isshow: false},
        footerItem: [
          {
            id: 0,
            name: '赞同',
            value: '',
            show: false,
            icon: this.$image.xinhu.agree1,
            isshow: false
          },
          {
            id: 1,
            name: '收藏',
            value: '',
            show: false,
            icon: this.$image.rules.celloctIcon,
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
        questionIdList: [],
        userIdMy: '',
        showFocus: true,
        userName: '',
        othersUserId: '',
        userSynopsis: '',
        atTimes: '',
        answerContent: '',
        copyContent: '',
        editContent: '',
        answerCount: '',
        followResponder: false,
        pageSize: 100,
        pageNum: 1,
        relatedQuestionList: [],
        showLoading: false,
        showAgree: false,
        approveCount: '',
        approveStatus: '',
        authentication: false,
        isAnonymous: false,
        questionReply: false,
        replyAnswerId: '',

        values: '',
        placeholder: '搜索关键字，全文精确搜索',
        close: this.$image.personal.close,
        indexs: 0,
        nodessLen: 0,
        iconShow: false,
        IOSAn: true,
        AndroidShow: true,
        showGuide1: true,
        showGuide2: false,
        showGuide3: false
      }
    },
    directives: {
      TransferDom
    },
    created() {
      this.isShowGuide()
      let userId = this.$cookie.getCookie('userId')
      if (!this.$cookie.isLogin()) {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href)
      } else {
        this.answerId = this.$route.query.answerId
        this.userIdMy = this.$cookie.getUserInfo().id
        this.$MTAmethod.mtaShare('th7Yz7CYvV', {'6tf8e8t9uw': 'true'})
      }

    },
    watch: {
      question() {
        this.$nextTick(() => {
          var body = document.body.clientHeight
          var footer = document.getElementById('footerDom').clientHeight
          var header = document.getElementById('headerContent').clientHeight;
          var input = document.getElementById('inputS').clientHeight
          var heightFact = body - footer - header - input
          this.heightLe = body - footer - header - input;
          var height = body - footer - header - input;
          console.log('====>', document.getElementById('headerContent'));
          console.log(this.index, 'body = ', body, 'footer = ', footer, 'header = ', header, 'input = ', input)
          // document.getElementsByClassName('vux-swiper')[0].style.cssText = 'height:auto;min-height:' + height + 'px;margin-bottom:' + footer + 'px;background: #fff;overflow-y: scroll;'
        })
      },
      approveStatus(val) {
        console.log('val ===', val)
        if (val == null) {
          if (this.approveCount && this.approveCount > 0) {
            this.footerItem[0].name = '赞同' + this.approveCount
            this.footerItem[0].icon = this.$image.xinhu.agree1
            this.footerItem = Object.assign({}, this.footerItem)
          } else {
            this.footerItem[0].name = '赞同'
            this.footerItem[0].icon = this.$image.xinhu.agree1
            this.footerItem = Object.assign({}, this.footerItem)
          }

        } else if (val == true) {
          this.footerItem[0].name = '已赞同' + this.approveCount
          this.footerItem[0].icon = this.$image.xinhu.agree2
          this.footerItem = Object.assign({}, this.footerItem)
        } else if (val == false) {
          this.footerItem[0].name = '已反对'
          this.footerItem[0].icon = this.$image.xinhu.agree2
          this.footerItem = Object.assign({}, this.footerItem)
        }
      }
    },
    mounted() {

      this.$nextTick(() => {
        var body = document.body.clientHeight
        var footer = document.getElementById('footerDom').clientHeight
        var header = document.getElementById('headerContent').clientHeight;
        var input = document.getElementById('inputS').clientHeight
        var heightFact = body - footer - header - input;
        var height = body - footer - header - input;
        this.heightLe = body - footer - header - input;
        console.log('====>', document.getElementById('headerContent').style);
        console.log('body = ', body, 'footer = ', footer, 'header = ', header, 'input = ', input);
        // document.getElementsByClassName('vux-swiper')[this.index].style.cssText = 'height:auto;min-height:' + height + 'px;margin-bottom:' + footer + 'px;background: #fff;overflow-y: scroll;'
      })
      this.getQuestion()
      this.getQuestionIdList()
    },
    methods: {
      isShowGuide() {
        let xhGuide = this.$storage.get('xhGuideAnswer')
        if (xhGuide) {
          this.showGuide1 = false
        } else {
          this.showGuide1 = true
        }
      },
      hideGuide(index) {
        if (index === 1) {
          this.showGuide1 = false
          this.showGuide2 = true
        } else if (index === 2) {
          this.showGuide2 = false
          this.showGuide3 = true
        } else if (index === 3) {
          this.showGuide3 = false
          this.$storage.set('xhGuideAnswer', 1)
        }
      },
      deleteAnswer() {
        let _this = this
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除该答案吗？',
          // 组件除show外的属性
          onConfirm() {
            /*_this.$http ({
              url: _this.$api.xinhu.deleteAnswer,
              method: 'DELETE',
              params: {
                questionId: _this.$route.query.questionId,
                answerId: _this.answerId
              }
            })*/
            let params = {
              questionId: _this.$route.query.questionId,
              answerId: _this.answerId
            }
            _this.$axios.xinhu.deleteAnswer(params).then((res) => {
              if (res.data.returnCode == 200) {
                _this.$router.push({
                  path: '/xhQuestionDetaile',
                  query: {
                    questionId: _this.$route.query.questionId
                  }
                })
              }
            })
          },
          onCancel() {
          }
        })
      },
      goUserInfo() {
        if (!this.anonymous) {
          this.$router.push({path: '/userOther', query: {selectUserId: this.othersUserId}})
        }
      },
      goMyAnswer() {
        this.$router.push({
          path: '/xhRedirect',
          query: {from: 'answerDetaile', questionId: this.$route.query.questionId, answerId: this.replyAnswerId}
        })
      },
      bottomRules() {
        // console.log('下：' + this.indexs);
        if (this.indexs >= this.nodess.length - 1) {
          this.indexs = this.nodess.length - 1
          this.searchBlur()
          return
        }
        this.SelectText(this.nodess[this.indexs + 1])
        //console.log(this.index);
        this.indexs++
      },
      topRules() {
        // console.log('上：' + this.indexs);
        if (this.indexs <= 0) {
          this.indexs = 0
          this.$toast({message: '没有上一个了', position: 'middle', duration: 1500})
          return
        }
        this.SelectText(this.nodess[this.indexs - 1])
        this.indexs--
      },
      closeCount() {
        this.values = ''
        this.iconShow = false
        $('.nodeslenText').hide()
        $('.nodesLen').hide()
        this.searchBlur()
        $('.seabox-and').css('width', '90%')
        // $('#inputCount').focus()
        $('#inputCount-an').focus()
        $('.closeCount').hide()
        $('.seabox').width('100%')
      },
      searchFocus() {

      },
      //
      searchBlur() {
        document.activeElement.blur()
        $('#inputCount').blur()
        if (this.values.trim().length != 0) {
          this.answerContent = this.copyContent
          let val = this.values
          val = val.replace(/\./g, '\\.')
          let reg = new RegExp('(' + val.replace('*', '') + ')', 'gmi')
          this.answerContent = this.answerContent.replace(reg, '<span class=\'highlight\'>$1</span>')
          //读取页面所有满足要求的节点
          this.$nextTick(() => {
            this.nodess = document.querySelectorAll('#m' + this.answerId + ' .highlight')
            //默认选择第一个
            this.nodessLen = this.answerContent.match(/highlight/gm) ? this.answerContent.match(/highlight/gm).length : 0
            if (this.nodessLen >= 2) {
              $('.nodesLen').show()//关键词条数
              $('.seabox').width('85%')
              this.iconShow = true
              $('.nodeslenText').hide()
              $('.seabox-and').css('width', '85%')
              this.AndroidShow = false
            } else if (this.nodessLen == 1) {
              $('.nodesLen').show()//关键词条数
              $('.nodeslenText').hide()
              this.iconShow = false
            } else if (this.nodessLen == 0) {
              $('.seabox-and').css('width', '90%')
              $('.seabox').width('100%')
              this.AndroidShow = true
              this.indexs = 0
              this.iconShow = false
              $('.nodesLen').hide() // 关键词条数
              $('.nodeslenText').show()
            }
            this.SelectText(this.nodess[0])
            this.indexs = 0
          })
        } else {
//          $('#rulesText').each(function () {
//            //找到所有highlight属性的元素；
//            $(this).find('.highlight').each(function () {
//              $(this).replaceWith($(this).html()) //将他们的属性去掉；
//            })
//          })
          this.answerContent = this.copyContent
        }
      },
      SelectText(element) {
        //移除所有灰色背景
        $('span.highlight.graybg').removeClass('graybg')
        // let text = document.getElementById(element)
        let selection = window.getSelection()
        this.range = document.createRange()
        selection.removeAllRanges()
        selection.addRange(this.range)
        //检测是否要滚动展示
        this.scrollToElement('.vux-swiper', element)
        $(element).addClass('graybg')
      },
      scrollToElement(container, child) {
        container = $(container)
        // console.log('container = ', container)
        let search = $('.searchs').outerHeight()
        // let countTil = $('.countTli').outerHeight()
        let countTil = $('.headerTitle').outerHeight()
        let author = $('.author').outerHeight()
        // console.log('search', search, countTil, search + countTil)
        let tobeHeight = search + countTil + author
        child = $(child)
        // console.log('234324suoyi', $(child))
        if (child.length == 0) {
          console.log(0)
        } else {
          let conScrollTop = container.scrollTop()
          let childOffsetTop = child.position().top
          // console.log('eqweqweq', childOffsetTop)
//          console.log(childOffsetTop, conScrollTop, childOffsetTop + conScrollTop - tobeHeight - 5)
          if (this.indexs == this.nodessLen - 1) {
            container.animate({
              scrollTop: 0
            })
          } else {
            container.animate({
              scrollTop: childOffsetTop + conScrollTop - tobeHeight - 5
            })
          }
        }
      },
      searchInput() {
        if (this.values.trim().length !== 0) {
          $('.closeCount').show()
        } else {
          $('.closeCount').hide()
        }
      },
      /* */
      cancelAgree() {
        let params = {
          answerId: this.answerId
          // userId: this.$cookie.getCookie('userId')
        }
        this.$axios.xinhu.cancelEvaluate(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.showAgree = false
            this.getDetaile(this.index)
          }
        })
      },
      answerQuestion() {
        if (this.othersUserId !== this.userIdMy) {
          this.addAnswer()
        } else {
          this.editAnswer()
        }
      },
      addAnswer() {
        if (!this.editContent) {
          this.$vux.toast.show({text: '回答内容不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.addAnswer,
          params: {
            questionId: this.$route.query.questionId,
            questionTitle: this.question,
            answerContent: this.editContent,
            isAnonymous: this.isAnonymous
          }
        })*/
        let params = {
          questionId: this.$route.query.questionId,
          questionTitle: this.question,
          answerContent: this.editContent,
          isAnonymous: this.isAnonymous
        }
        this.$axios.xinhu.addAnswer(params).then((res) => {
          if (res.data.returnCode == 200) {
            let qid = res.data.returnObject.questionId
            let aid = res.data.returnObject.answerId
            this.$router.push({path: '/xhRedirect', query: {from: 'answer', questionId: qid, answerId: aid}})
            this.addUserAnswerMsg(aid, qid, this.question, this.isAnonymous)
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'v69qaryvzz': 'true'})
          } else {
            this.$vux.toast.show({text: res.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500})
          }
        }).catch((err) => {

        })
      },
      editAnswer() {
        if (!this.editContent) {
          this.$vux.toast.show({text: '回答内容不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500})
          return false
        }
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.editAnswer,
          params: {
            questionId: this.$route.query.questionId,
            answerId: this.$route.query.answerId,
            answerContent: this.editContent
            // isAnonymous: this.isAnonymous
          }
        })*/
        let params = {
          questionId: this.$route.query.questionId,
          answerId: this.$route.query.answerId,
          answerContent: this.editContent
        }
        this.$axios.xinhu.editAnswer(params).then((res) => {
          if (res.data.returnCode == 200) {
            let qid = res.data.returnObject.questionId
            let aid = res.data.returnObject.answerId
            this.$router.push({path: '/xhRedirect', query: {from: 'answer', questionId: qid, answerId: aid}})
            this.addUserAnswerMsg(aid, qid, this.question, this.isAnonymous)
          } else {
            this.$vux.toast.show({text: res.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500})
          }
        }).catch((err) => {

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
      cancelMethod() {
        this.showAgree = false
      },
      agreeMethod() {
        let params = {
          answerId: this.answerId,
          evaluate: true
          // userId: this.$cookie.getCookie('userId')
        }
        this.$axios.xinhu.addEvaluate(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.showAgree = false
            this.getDetaile(this.index)
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'p4ps4v64vc': 'true'})
          }
        })
      },
      opposeMethod() {
        let params = {
          answerId: this.answerId,
          evaluate: false
          // userId: this.$cookie.getCookie('userId')
        }
        this.$axios.xinhu.addEvaluate(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.showAgree = false
            this.getDetaile(this.index)
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'65tj6ydy58': 'true'})
          }
        })
      },
      relatedQuestion() {
        let params = {
          keyWord: this.question,
          questionId: this.$route.query.questionId,
          pageNum: 1,
          pageSize: 5
        }
        /* this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listRelatedQuestions,
          params: {
            keyWord: this.question,
            questionId: this.$route.query.questionId,
            pageNum: 1,
            pageSize: 5
          }
        }) */
        this.$axios.xinhu.listRelatedQuestions(params).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.relatedQuestionList = res.data.returnObject.list
          }
        })
      },
      linkQuestion(list) {
        this.$router.push({
          path: 'xhQuestionDetaile',
          query: {
            questionId: list.questionId
          }
        })
      },
      questionList() {
        this.$router.push({
          path: 'xhQuestionDetaile',
          query: {
            questionId: this.$route.query.questionId
          }
        })
      },
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
                userId: _this.$cookie.getCookie('userId'),
                concernedId: _this.othersUserId,
                attentionType: 2
              }
            })*/
            let params = {
              userId: _this.$cookie.getCookie('userId'),
              concernedId: _this.othersUserId,
              attentionType: 2
            }
            _this.$axios.xinhu.unFollow(params).then((res) => {
              if (res.data.returnCode == 200) {
                _this.followResponder = false
              }
            })
          },
          onCancel() {
          }
        })
      },
      addAttention() {
        /*this.$http ({
          url: this.$api.xinhu.addAttention,
          method: 'POST',
          params: {
            attentionType: 'ATTENTION_PEOPLE',
            concernedId: this.othersUserId,
            concernedTitle: this.userName
            // userId: this.$cookie.getCookie('userId')
          }
        })*/
        let params = {
          attentionType: 'ATTENTION_PEOPLE',
          concernedId: this.othersUserId,
          concernedTitle: this.userName
        }
        this.$axios.xinhu.addAttention(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.followResponder = true
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'j7r27qxjqp': 'true'})
          }
        })
      },
      indexChange(val) {
        this.index = val
        this.getDetaile(this.index)
        console.log('=========', this.index, this.copyIndex)
        this.showLoading = true
        // console.log('sdf = ', this.index, this.questionIdList.length)
//        if (this.index >= this.questionIdList.length - 1) {
//          this.pageNum += 1
//          this.getQuestionIdList()
//        } else {
//          this.getDetaile(this.index)
//        }
        this.approveStatus = ''

        this.closeCount()
      },
      getQuestion() {
        let params = {
          questionId: this.$route.query.questionId
          // userId: this.$cookie.getCookie('userId')
        }
        /* this.$http ({
          url: this.$api.xinhu.getQuestionDetails,
          methods: 'GET',
          params: {
            questionId: this.$route.query.questionId
            // userId: this.$cookie.getCookie('userId')
          }
        })*/
        this.$axios.xinhu.getQuestionDetails(params).then((res) => {
          if (res.data.returnCode == 200) {
            console.log(' getQuestion = ', res.data.returnObject)
            var question = res.data.returnObject
            this.answerCount = question.answerCount
            this.question = question.questionTitle
            this.questionDescription = question.questionDescription
            this.questionReply = question.questionReply
            this.replyAnswerId = question.replyAnswerId
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            })
          }
          this.weixin()
        })
      },
      getQuestionIdList() {
        let params = {
          questionId: this.$route.query.questionId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        /* this.$http ({
          url: this.$api.xinhu.listAnswerIdsByQuestionId,
          methods: 'GET',
          params: {
            questionId: this.$route.query.questionId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }) */
        this.$axios.xinhu.listAnswerIdsByQuestionId(params).then((res) => {
          if (res.data.returnCode == 200) {
            // console.log('questionIdList = ', res.data.returnObject, '-------', this.questionIdList)
            if (this.questionIdList.length == 0) {
              this.questionIdList = res.data.returnObject
            } else {
              var arr = res.data.returnObject
              this.questionIdList = this.questionIdList.concat(arr)
            }
            if (this.answerId) {
              for (let i = 0; i <= this.questionIdList.length; i++) {
                if (this.answerId == this.questionIdList[i]) {
                  this.index = i
                }
              }
            }
            this.copyIndex = this.index
            this.getDetaile(this.index)
          }
        })
      },
      getDetaile(index) {
        if (!index) {
          index = 0
        }
        let params = {
          answerId: this.questionIdList[index]
        }
        /* this.$http ({
          url: this.$api.xinhu.getAnswerDetails,
          method: 'GET',
          params: {
            answerId: this.questionIdList[index]
          }
        }) */
        this.$axios.xinhu.getAnswerDetails(params).then((res) => {
          if (res.data.returnCode == 200) {
            var infoObj = res.data.returnObject
            this.answerDetails = infoObj
            this.anonymous = infoObj.anonymous
            this.headerImg = infoObj.userPicture ? infoObj.userPicture : this.$image.xinhu.headerImg
            this.userName = infoObj.userName ? infoObj.userName : '匿名用户'
            this.othersUserId = infoObj.userId ? infoObj.userId : ''
            if (infoObj.answerContent.indexOf('class') > -1 || infoObj.answerContent.indexOf('style') > -1 || infoObj.answerContent.indexOf('<p>') > -1) {
              this.answerContent = infoObj.answerContent
            } else {
              let detailContVal = infoObj.answerContent.split("\n");
              let detailContVal2 = this.$array.ImpArr(detailContVal); // 去除空元素
              let arr = [];
              for (let i = 0; i < detailContVal2.length; i++) {
                detailContVal2[i] = "<p>" + detailContVal2[i] + "</p>";
                arr.push(detailContVal2[i]);
              }
              console.log('123323', arr);
              this.answerContent = arr.join("")
              // this.answerContent = infoObj.answerContent ? infoObj.answerContent.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;') : '未获取到答案，请稍后重试！'
            }
            this.copyContent = this.answerContent
            this.userSynopsis = infoObj.userSynopsis
            this.followResponder = infoObj.followResponder
            this.answerId = infoObj.answerId
            this.approveStatus = infoObj.approveStatus
            this.authentication = infoObj.authentication
            this.approveCount = infoObj.approveCount
            if (this.approveStatus == true && this.approveCount && this.approveCount > 0) {
              this.footerItem[0].name = '已赞同' + this.approveCount
              this.footerItem[0].icon = this.$image.xinhu.agree2
            }

            this.atTimes = this.$const.format(infoObj.createTime)
            this.showLoading = false
            if (this.othersUserId !== this.userIdMy) {
              this.showFocus = true
            } else {
              this.showFocus = false
            }
          }
        })
      },
      closeEdit() {
        this.editSwitch = false
      },
      editInterface(key) {
        if (key === 'edit') {
          // this.$router.push({path: '/xhRedirect', query: {from: 'answerDetaile', questionId: this.$route.query.questionId, answerId: this.replyAnswerId}})
          this.editSwitch = true
          this.editContent = this.answerDetails.answerContent
          this.$nextTick(() => {
            var bodyH = document.getElementsByClassName('editBody')[0].clientHeight
            var tH = document.getElementsByClassName('editTitle')[0].clientHeight
            document.getElementById('editText').style.cssText = 'height: ' + (bodyH - tH) + 'px;'
          })
        } else {
          this.editSwitch = true
          this.$nextTick(() => {
            var bodyH = document.getElementsByClassName('editBody')[0].clientHeight
            var tH = document.getElementsByClassName('editTitle')[0].clientHeight
            var aH = document.getElementsByClassName('anonymous')[0].clientHeight
            document.getElementById('editText').style.cssText = 'height: ' + (bodyH - tH - aH) + 'px;'
          })
        }
      },
      goHome() {
        this.$router.push('/xhList')
      },
      footerClick(index) {
        if (index == 0) {
          this.showAgree = true
        } else if (index == 1) {
          this.showCollect = true
        } else if (index == 2) {
          this.showRelated = true
          this.relatedQuestion()
        }
      },
      weixin() {
        let adverttitle = this.question
        let sharelink2 = window.location.href//分享链接
        let questionDescription = this.questionDescription
        if (questionDescription.length > 30) {
          questionDescription = questionDescription.substring(0, 30) + '...'
        }
        let shareDesc = questionDescription//描述
        this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true)
      }
    }
  }
</script>
<style lang="scss">

  #xhAnswerDetail {
    background: #f0f1f5;
    overflow-y: hidden;
    // overflow-y: auto;
    height: 100%;
    width: 100%;
    position: relative;
    .searchs {
      width: 100%;
      height: 50px;
      background: #f0f1f5;
      padding: 7.5px 10px;
      box-sizing: border-box;
      vertical-align: middle;
      font-size: 0;
      .seabox {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 2px;
        background-color: white;
        display: inline-block;
        float: left;
        i {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          position: absolute;
          top: 0;
          right: 6px;
          bottom: 0;
          margin: auto;
          border-radius: 50%;
          color: #ffb148;
          font-style: normal;
        }
        form {
          height: 100%;
          box-sizing: border-box;
          input.text {
            outline: none;
            width: 86%;
            height: 100%;
            background: #fff;
            color: #8d8d8d;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -webkit-appearance: none;
            border-radius: 2px;
            border: 0;
            padding: 0 8px 0 27px;
            font-size: 15px;
            background: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/search@3x.png");
            background-size: 15px 15px;
            background-position: 5px center;
            background-repeat: no-repeat;
          }
        }
        .nodeGroup {
          position: absolute;
          top: 9.5px;
          right: 10px;
          font-size: 0;
          display: -webkit-box;
          .nodesLen {
            background-color: white;
            z-index: 50;
            font-size: 13px;
            display: none;
            color: #8d8d8d;
            position: relative;
            top: -1px;
          }
          .nodeslenText {
            background-color: white;
            z-index: 50;
            font-size: 13px;
            display: none;
            color: #8d8d8d;
            position: relative;
            top: -2px;
          }
          .closeCount {
            height: 16px;
            display: none;
            margin: 0 -3px 0 5px;
          }
        }
      }
      .seabox-and {
        height: 100%;
        width: 90%;
        position: relative;
        border-radius: 2px;
        background-color: white;
        display: inline-block;
        float: left;
        form {
          height: 100%;
          box-sizing: border-box;
          input {
            outline: none;
            width: 86%;
            height: 100%;
            background: #fff;
            color: #8d8d8d;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -webkit-appearance: none;
            border-radius: 2px;
            padding: 0 0 0 8px;
            border: 0;
            font-size: 15px;
            line-height: 1;
          }
        }
        .nodeGroup {
          position: absolute;
          top: 9.5px;
          right: 10px;
          font-size: 0;
          display: -webkit-box;
          .nodesLen {
            background-color: white;
            z-index: 50;
            font-size: 13px;
            display: none;
            color: #8d8d8d;
          }
          .nodeslenText {
            background-color: white;
            z-index: 50;
            font-size: 13px;
            display: none;
            color: #8d8d8d;
            position: relative;
            top: 1px;
          }
          .closeCount {
            height: 16px;
            display: none;
            margin: 0 -3px 0 5px;
          }
        }
      }
      .icon.selection {
        width: 15%;
        height: 35px;
        display: table;
        table-layout: fixed;
        .rulesBtn {
          display: table-cell;
          height: 100%;
          width: 50%;
          background-color: #f0f1f5;
          border: 0;
          i {
            font-weight: bold;
          }
        }
      }
      .icons {
        width: 23px;
        height: 23px;
        display: inline-block;
        background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/search@3x.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        top: 6px;
        float: right;
      }
    }
    // 移除 属性的构造 属性
    .graybg {
      background-color: #e3e3e3 !important;
      border-radius: 2px !important;
    }
    // 高亮 的class
    .highlight {
      background: rgba(255, 255, 255, .4);
      color: #ffb148;
    }
    .headerTitle {
      padding: 0 12px;
      box-sizing: border-box;
      background: #fff;
      margin-bottom: 7.5px;
      .title {
        color: #323232;
        /*font-size: 15px;*/
        font-size: 17px;
        /*border-bottom: 1px solid #e3e3e3;*/
        padding: 12px 0;
        text-align: justify;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
      }
      .line {
        position: relative;
        padding: 8px 0;
        color: #8d8d8d;
        font-size: 14px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        span {
          .iconfont {
            color: #8d8d8d;
            font-size: 12px;
            font-weight: bold;
          }
        }
        span:first-child {
          vertical-align: middle;
          display: inline-block;
          img {
            width: 15px;
            height: 15px;
            vertical-align: middle;
            display: inline-block;
            margin-bottom: 2px;
            margin-right: 2px;
          }
        }
        span:last-child {
          margin-right: -3px;
        }
        .count {
          margin-bottom: 2px;
        }
      }
    }
    .detaileBox {
      position: relative;
    }
    .answer {
      padding: 0 12px;
      box-sizing: border-box;
      background: #fff;
      position: relative;
      overflow-y: scroll;
      height: 100%;
      .author {
        width: 100%;
        height: 50px;
        /*border-bottom: 1px solid #e3e3e3;*/
        box-sizing: border-box;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        img {
          width: 31px;
          height: 31px;
          border-radius: 50%;
        }
        .authorText {
          display: inline-block;
          margin-left: 10px;
          width: 70%;
          p {
            font-size: 11px;
            color: #aeaeae;
          }
          p:first-child {
            font-size: 14px;
            color: #323232;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .focus {
          justify-content: flex-end;
          position: absolute;
          right: 0;
          top: 12px;
          vertical-align: middle;
          /*background: #f0f1f5;*/
          /*font-size: 13px;*/
          /*color: #8d8d8d;*/
          /*padding: 4px 7px;*/
          /*border-radius: 2px;*/
          /*min-width: 50px;*/
          /*text-align: center;*/
          width: auto;
          height: 24px;
          border-radius: 0%;
        }
        .deleteA {
          height: auto;
          top: 15px;
          color: #8d8d8d;
          font-size: 14px;
        }
        .focusgz {
          color: #ffb148;
          background-color: #fff;
          border: 1px solid #ffb148;
          i {
            font-size: 12px;
            color: #ffb148;
          }
        }
      }
      .content {
        padding: 15px 0;
        /*font-size: 15px;*/
        font-size: 16px;
        color: #323232;
        text-align: justify;
        position: relative;
        font-family: PingFangSC-Regular, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        box-sizing: border-box;
        word-break: break-all;
        line-height: 28px;
        .editDate {
          text-align: right;
          padding: 20px 0 10px 0;
          font-size: 14px;
          color: #8d8d8d;
        }
      }
      .rzImgStyle {
        width: 100px;
        position: absolute;
        right: 0;
        top: -10px;
      }
    }
    .show_footer {
      position: absolute;
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
    .editContent {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9999;
      background: #fff;
      .editButton {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        border: 1px solid #e3e3e3;
        display: flex;
        align-items: center;
        font-size: 18px;
        span {
          background: #fff;
          color: #ffb148;
          width: 50%;
          text-align: center;
          height: 100%;
          line-height: 50px;
        }
        span:last-child {
          background: #ffb148;
          color: #fff;
        }
      }
      .editBody {
        width: 100%;
        height: 90%;
        padding: 0 12px;
        box-sizing: border-box;
        .editTitle {
          color: #323232;
          font-size: 16px;
          font-family: PingFangSC-Medium;
          text-align: justify;
          border-bottom: 1px solid #e3e3e3;
          padding: 10px 0;
          box-sizing: border-box;
        }
        .anonymous {
          padding: 10px 0;
          border-bottom: 1px solid #e3e3e3;
          box-sizing: border-box;
          font-size: 15px;
          color: #8d8d8d;
          .weui-cell, .weui-cell_switch {
            padding: 0;
            .weui-label {
              color: #8d8d8d;
              font-size: 15px;
            }
          }
          .weui-switch:checked {
            border-color: #ffb148;
            background-color: #ffb148;
          }
        }
        #editText {
          resize: none;
          width: 100%;
          height: 100px;
          border: none;
          outline: none;
          padding: 15px 0;
          box-sizing: border-box;
          font-size: 15px;
          color: #323232;
          caret-color: #ffb148;
          overflow-y: auto;
        }
      }
    }
    .agreeBox {
      width: 100%;
      height: 50px;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 500;
      display: flex;
      background: #f0f1f5;
      border-top: 1px solid #e3e3e3;
      box-shadow: 0 -8px 13px rgba(0, 0, 0, .02);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      div {
        width: 50%;
        height: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 12px;
        color: #767877;
        i {
          font-size: 10px;
        }
        .rotate:before {
          display: inline-block;
          transform: rotate(180deg);
        }
      }
      p {
        width: 100%;
        height: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 12px;
        color: #767877;
        i {
          font-size: 10px;
        }
      }
    }
    #answerDetail {
      height: 100%;
      /*padding: 0 10px;*/
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        font-size: 16px;
        font-family: PingFangSC-Regular, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        margin: 5px 0;
        line-height: 20px;
        font-weight: normal;
      }
      p {
        font-size: 16px;
        margin: 8px 0;
        font-family: PingFangSC-Regular, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
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
        font-family: PingFangSC-Regular, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        margin: 5px 0 !important;
        text-indent: 2em !important;
        text-decoration: line-through !important;
      }
      h5, h5 * {
        margin: 0 !important;
        text-align: right !important;
        font-size: 16px !important;
        color: #323232;
        font-family: PingFangSC-Regular, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        font-weight: normal !important;
      }
      h6, h6 * {
        font-size: 14px !important;
        font-family: PingFangSC-Regular, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
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

    .guide1 {
      position: absolute;
      width: 300px;
      left: 0;
      top: 5px;
      z-index: 2001;
    }
    .guide2 {
      position: absolute;
      width: 260px;
      left: 55px;
      bottom: 1px;
      z-index: 2001;
    }
    .guide3 {
      position: absolute;
      width: 270px;
      right: 5px;
      top: 10px;
      z-index: 2001;
    }

    .vux-slider > .vux-swiper {
      height: 100%;
      overflow: auto;
      overflow-x: hidden;
      position: relative;
      -webkit-overflow-scrolling: touch;
    }
  }
  /*相关内容*/
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
</style>
