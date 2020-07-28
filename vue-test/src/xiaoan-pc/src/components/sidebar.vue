<template>
  <!-- 侧边栏 -->
  <div v-transfer-dom class="sidebar">
    <div class="bar" v-if="!scaleShow">
      <div class="menu">
        <div class="header" @click="headerLink">
          <img :src="this.info.weixinAvatar" alt="">
          <p>{{ this.info.userName }}</p>
        </div>
        <!---->
        <el-popover placement="left" width="400" trigger="hover" popper-class="rulesContent">
          <div class="imgArea"><img :src="$image.affiche.qrcode" alt=""></div>
          <!--<span>信公小安移动端</span>-->
          <span>扫码关注移动端<span style="margin: 0;">上市公司董办首选</span></span>
          <div class="qrcode" slot="reference">
            <div class="codeText">
              <!--<el-tooltip content="二维码" placement="left" effect="light">-->
              <i class="icon iconfont web-erweima iconColor"></i>
              <!--</el-tooltip>-->
            </div>
          </div>
        </el-popover>
        <!---->
        <el-popover ref="popoverShare" placement="left" width="400" trigger="hover" popper-class="rulesContent">
          <div class="imgArea">
            <v-qrcode :text="shareUrl"></v-qrcode>
          </div>
          <span style="margin-top: 25px;">扫码分享</span>
          <!---->
        </el-popover>
        <!---->
        <ul>
          <li @click="openWindow('note')">
            <el-tooltip content="笔记" placement="left" effect="light" :visible-arrow="false">
              <img class="sideNote" :src="$image.rules.sidebarnode">
            </el-tooltip>
          </li>
          <li @click="openWindow('collect')">
            <el-tooltip content="收藏" placement="left" effect="light" :visible-arrow="false">
              <i class="icon iconfont web-shoucang1 iconColor"></i>
            </el-tooltip>
          </li>
          <li @click="printf" v-if="$route.name == 'ruleDetail'">
            <el-tooltip content="打印" placement="left" effect="light" :visible-arrow="false">
              <i class="icon iconfont web-dayin iconColor"></i>
            </el-tooltip>
          </li>
          <li @click="printf" v-else-if="$route.name == 'caseDetail' && dayinShow">
            <el-tooltip content="打印" placement="left" effect="light" :visible-arrow="false">
              <i class="icon iconfont web-dayin iconColor"></i>
            </el-tooltip>
          </li>
          <li @click="printf" v-else-if="$route.name == 'ipo-details' && dayinShow">
            <el-tooltip content="打印" placement="left" effect="light">
              <i class="icon iconfont web-dayin iconColor"></i>
            </el-tooltip>
          </li>
          <li v-if="isQrcode" slot="reference" v-popover:popoverShare>
            <i class="icon iconfont web-fenxiang1 iconColor"></i>
          </li>
          <li @click="scaleScreen" v-show="scaleScreenShow">
            <el-tooltip content="最大化" placement="left" effect="light" v-if="!scaleShow" :visible-arrow="false">
              <i class="icon iconfont web-quanping iconColor"></i>
            </el-tooltip>
            <el-tooltip content="最小化" placement="left" effect="light" v-else :visible-arrow="false">
              <i class="icon iconfont web-suoxiaoquanping iconColor"></i>
            </el-tooltip>
          </li>
        </ul>
        <ul class="bottom">
          <li @click="openWindow('track')">
            <el-tooltip content="足迹" placement="left" effect="light" :visible-arrow="false">
              <i class="iconfont web-zuji1 iconColor"></i>
            </el-tooltip>
          </li>
          <li @click="$common.returnTop()">
            <el-tooltip content="返回顶部" placement="left" effect="light" :visible-arrow="false">
              <i class="iconfont web-dingbu1 iconColor"></i>
            </el-tooltip>
          </li>
        </ul>
      </div>
      <div class="barContent" :class="{'barWidth': windowFlag}">
        <div class="track" v-if="showColumn == 'track'">
          <div class="title" ref="trackTitleDom">
            <span>我的足迹</span>
            <i class="el-icon-close" @click="closeWindow"></i>
          </div>
          <!---->
          <div class="trackContent" v-show="!isNull">
            <div class="counter" ref="counterDom">
              <span>{{ trackNum }}</span>条记录
              <el-button type="text" @click="open2">
                <i class="el-icon-delete"></i>
              </el-button>
            </div>
            <div class="listContainer" ref="listContainerDom" :style="{height: listContainerHeight}">
              <el-button round v-if="todayList.length !== 0">今天</el-button>
              <div class="list" v-for="(list,index) in todayList" @click="linkTo(list.type,list.refId)">
                <div class="listTitle">{{ list.title }}</div>
                <el-button type="primary" v-if="list.type == 1" style="background-color: #90b8f4">法规</el-button>
                <el-button type="warning" v-else-if="list.type == 3" style="background-color: #ffd091">公告</el-button>
                <el-button type="danger" v-else-if="list.type == 5" style="background-color: #ffa691">案例</el-button>
                <el-button type="danger" v-else-if="list.type == 4" style="background-color: #9AE6ED">研报</el-button>
                <el-button type="danger" v-else-if="list.type == 6" style="background-color: #ffa691">问答</el-button>
                <el-button type="danger" v-else-if="list.type == 7" style="background-color: #ffa691">问答</el-button>
                <el-button type="danger" v-else-if="list.type == 8" style="background-color: #ffddb0">IPO</el-button>
                <el-button type="danger" v-else-if="list.type == 9" style="background-color: #ffa691">e互动</el-button>
                <span class="split" v-show="list.type">|</span>
                <span class="time">{{ $common.transTime(list.releaseTime)[1] }}</span>
                <span class="split" v-show="list.timeliness">|</span>
                <span class="time" v-show="list.timeliness">{{ list.timeliness }}</span>
              </div>
              <el-button round v-if="agoList.length !== 0">一天前</el-button>
              <div class="list" v-for="(list,index) in agoList" @click="linkTo(list.type,list.refId)">
                <div class="listTitle">{{ list.title }}</div>
                <el-button type="primary" v-if="list.type == 1" style="background-color: #90b8f4">法规</el-button>
                <el-button type="warning" v-else-if="list.type == 3" style="background-color: #ffd091">公告</el-button>
                <el-button type="danger" v-else-if="list.type == 5" style="background-color: #ffa691">案例</el-button>
                <el-button type="danger" v-else-if="list.type == 4" style="background-color: #8bdde4">研报</el-button>
                <el-button type="danger" v-else-if="list.type == 6" style="background-color: #ffa691">问答</el-button>
                <el-button type="danger" v-else-if="list.type == 7" style="background-color: #ffa691">问答</el-button>
                <el-button type="danger" v-else-if="list.type == 8" style="background-color: #ffddb0">IPO</el-button>
                <el-button type="danger" v-else-if="list.type == 9" style="background-color: #ffa691">e互动</el-button>
                <span class="split" v-show="list.type">|</span>
                <span class="time">{{ $common.transTime(list.releaseTime)[1] }}</span>
                <span class="split" v-show="list.timeliness">|</span>
                <span class="time" v-show="list.timeliness">{{ list.timeliness }}</span>
              </div>
            </div>
          </div>
          <div class="trackContent" v-show="isNull" style="padding-top: 180px;">
            <v-noInfo altText="暂无足迹" style="font-size: 16px" :imgSrc="noInfoImg"></v-noInfo>
          </div>
        </div>
        <v-collect :info="collectInfo" v-else-if="showColumn == 'collect'" @closeWindow="closeWindow"></v-collect>
        <v-sidebarNote ref="sideBarNote" :paragraph="noteParagraph" v-else-if="showColumn == 'note'"
                       @closeWindow="closeWindow"></v-sidebarNote>
      </div>
    </div>
    <!---->
    <transition name="el-fade-in-linear">
      <div class="shadow" v-show="windowFlag" @click="closeWindow"></div>
    </transition>
    <!---->
    <!--<div class="smallBar" v-if="scaleShow">-->
      <!--<div class="rightBox" @click="scaleScreen" style="margin-bottom: 10px;">-->
        <!--<el-tooltip content="最小化" placement="left" effect="light" :visible-arrow="false">-->
          <!--<i class="iconfont web-quxiaoquanping iconColor"></i>-->
        <!--</el-tooltip>-->
      <!--</div>-->
      <!--<div class="rightBox" @click="$common.returnTop()">-->
        <!--<el-tooltip content="返回顶部" placement="left" effect="light" :visible-arrow="false">-->
          <!--<i class="iconfont web-zhiding iconColor"></i>-->
        <!--</el-tooltip>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>
<script>
  import collect from '@/components/collect/sideCollect.vue'
  import sidebarNote from '@/components/sidebar/sidebarNote.vue'
  import qrcode from '@/components/qrcode.vue'
  import noInfo from '@/components/noInfo.vue'
  import TransferDom from '../directive/transfer-dom'
  export default {
    name: 'sidebar',
    data() {
      return {
        listContainerHeight: '90%',
        windowFlag: false,
        trackNum: '12',
        todayList: [],
        agoList: [],
        isNull: false,
        showColumn: '',
        shareUrl: '',
        routeName: '',
        isQrcode: true,
        noInfoImg: this.$image.prompt.noInfo,
        noteParagraph: ''
      }
    },
    directives: {
      TransferDom
    },
    props: {
      // isQrcode: {
      //   type: Boolean,
      //   default: true
      // },
      collectInfo: {
        type: Object
      },
      scaleShow: {
        type: Boolean,
        default: false
      },
      scaleScreenShow: {
        type: Boolean,
        default: true
      },
      dayinShow: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.setShareUrl()
      this.routeName = this.$route.name;
      // routeName != 'caseDetail
      if (this.routeName == '`' || this.routeName == 'investor-answer' || this.routeName == 'ipo-details' || this.routeName == 'caseDetail') {
        this.isQrcode = false;
      }
      // console.log('routeName', this.routeName);
    },
    mounted: function () {
      window.addEventListener('scroll', this.handleScroll)
      this.handleScroll()
      // console.log('route = ', this.$route)
    },
    destroyed: function () {
      window.removeEventListener('scroll', this.handleScroll)
      document.body.style.overflow = 'auto'
    },
    components: {
      'v-collect': collect,
      'v-noInfo': noInfo,
      'v-qrcode': qrcode,
      'v-sidebarNote': sidebarNote
    },
    watch: {
      windowFlag() {
        this.$nextTick(() => {
          // console.log('windowFlag', this.windowFlag)
          if (this.windowFlag) {
            // document.body.style.overflow = 'hidden';
            // document.body.classList.add('el-popup-parent--hidden');
            var windowH = document.body.clientHeight
            var headerH = document.querySelector('#home #header').clientHeight;
            if (this.showColumn == 'track') {
              var titleH = this.$refs.trackTitleDom.clientHeight;
              var counterH = this.$refs.counterDom.clientHeight;
              console.log('====>', windowH, titleH, counterH);
              console.log('====>', headerH);
              // this.listContainerHeight
              this.listContainerHeight = (windowH - headerH - titleH - 70) + 'px'
            }
          } else {
            document.body.style.overflow = 'auto';
            // document.body.classList.remove('el-popup-parent--hidden');
          }
        })
      }
    },
    computed: {
      isLogin: function () {
        return this.$store.state.isLogin
      },
      info: function () {
        return this.$store.state.userData
      }
    },
    methods: {
      headerLink() {
        this.$router.push('/manage')
      },
      listScroll() {
        // console.log('123', document.getElementById('per').scrollTop)
      },
      setShareUrl() {
        let pageRouter = this.$route.name
        let id = this.$route.query.id
        if (pageRouter === 'ruleDetail') {
          this.shareUrl = this.$api.share.ruleDetail + id
        } else if (pageRouter === 'afficheContent') {
          this.shareUrl = this.$api.share.afficheDetail + id
        } else if (pageRouter === 'caseDetail') {
          this.shareUrl = this.$api.share.caseDetail + id
        } else if (pageRouter === 'reportDetail') {
          this.shareUrl = this.$api.share.detailReport + id
        } else if (pageRouter == 'xhAnswerDetail') {
          this.shareUrl = this.$api.share.xhAnswerDetaile + 'questionId=' + this.$route.query.questionId + '&answerId=' + this.$route.query.answerId
        }
      },
      open2() {
        this.$confirm('删除足迹, 是否继续?', '永久删除哦！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delTrack()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 删除足迹
      delTrack() {
        this.$http({
          method: 'POST',
          url: this.$api.user.delTrack,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '足迹清除成功！'})
            this.isNull = true
          }
        }).catch((err) => {
          console.log(err)
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 跳转内容
      linkTo(type, id) {
        var url = '';
        if (type == 1) {
          url = '/rule/details' + '?id=' + id;
        } else if (type == 3) {
          url = '/affiche/details' + '?id=' + id;
        } else if (type == 5) {
          url = '/case/details' + '?id=' + id;
        } else if (type == 4) {
          url = '/report/details' + '?id=' + id;
        } else if (type == 4) {
          url = '/report/details' + '?id=' + id;
        } else if (type == 6) {
          url = '/xhQuestionDetail' + '?questionId=' + id;
        } else if (type == 9) {
          url = '/investor/answer' + '?id=' + id;
        } else if (type == 8) {
          url = '/ipo/details' + '?id=' + id;
        }
        //
        if (type == 7) {
          this.getQuestionIdByAnswerId(id);
        } else {
          this.$common.openWindow(url);
        }
      },
      //
      getQuestionIdByAnswerId(id) {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.getQuestionIdByAnswerId,
          params: {
            answerId: id
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let url = '/xhAnswerDetail?questionId=' + res.data.returnObject + '&answerId=' + id;
            let that = this;
            var newWin = null, isBlock = !1;
            // ** 新窗口被某些扩展阻止打开，会抛出错误，因此使用try..catch **/
            try {
              newWin = window.open(url);
              console.log(newWin);
              if (newWin == null || newWin == undefined) {
                that.$router.push(url);
                setTimeout(() => {
                  if (that.$route.path == 'xhAnswerDetail') {
                    window.location.reload();
                  }
                }, 300)
              }
              /** 新窗口被阻止时，返回值是undefined或null**/
              (!newWin) && (isBlock = !0);
            } catch (ex) {
              isBlock = !0;
            }
            if (isBlock) {
              // 被拦截
              that.$router.push(url);
            }
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '问题不存在或者已删除！'})
          }
        }).catch((err) => {
          console.warn(err);
        })
      },
      // 滚动条位置
      handleScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        var body = document.body.clientHeight
        var contentH = document.getElementsByClassName('caseDetail')[0].clientHeight
        var content = document.getElementsByClassName('caseDetail')[0]
        var bar = document.getElementsByClassName('bar')[0]
        var sbar = document.getElementsByClassName('smallBar')[0]
        var footer = document.getElementById('footer')
        // console.log('====', body, contentH, scrollTop, footer.offsetTop, content.scrollHeight)

        // console.log('', footer.getBoundingClientRect().top, footer.offsetTop)
        var f = footer.getBoundingClientRect().top
        var c = document.documentElement.clientHeight
        var x = c - f;
        // console.log('sldfj', x, bar)
        if (x >= 0) {
          if (bar) {
            bar.style.marginTop = -x + 'px'
          }
          if (sbar) {
            sbar.style.bottom = x + 20 + 'px'
          }
        } else {
          if (bar) {
            bar.style.marginTop = '0px'
          }
          if (sbar) {
            sbar.style.bottom = '20px'
          }

        }
        if (bar) {
          bar.style.top = '60px'
          // bar.style.height = (body - 60) + 'px'
        }
        // if (bar) {
        //   if (scrollTop < 60) {
        //     bar.style.top = (60 - scrollTop) + 'px'
        //     bar.style.height = body - (60 - scrollTop) + 'px'
        //   } else {
        //     bar.style.top = '0'
        //     bar.style.height = body + 'px'
        //   }
        // }

      },
      // 获取足迹
      getTrackM() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getTrack,
          params: {
            userId: this.$cookie.get('userId'),
            rows: 20
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.todayList = res.data.returnObject.browsings
            this.agoList = res.data.returnObject.browsingAgo
            this.trackNum = this.todayList.length + this.agoList.length
            if (this.trackNum == 0) {
              this.isNull = true
            }
          } else if (res.data.returnCode == -1) {
            this.isNull = true
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // printf
      printf() {
        // this.$emit('printfMethod')
//        var bdhtml = document.getElementById('pdf-wrap').innerHTML
//        var sprnstr = '<!--startprint-->'
//        var eprnstr = '<!--endprint-->'
//        var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17)
//        prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr))
//        window.document.body.innerHTML = prnhtml
//        window.print()
        let newWindow = window.open('_blank')   // 打开新窗口
        let codestr = document.getElementById('pdf-wrap').innerHTML   // 获取需要生成pdf页面的div代码
        let cssStr = '<style>p {text-indent: 2em;} h2,h3 {text-indent: 2em;font-size: 17px;} h5 {text-align: right} .timeliness {display:none}</style>'
        newWindow.document.write(codestr + cssStr)   // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
        newWindow.print()   // 打印当前窗口
      },
      // smallMethod
      smallMethod() {
        this.$emit('smallMethod')
      },
      // 页面缩放
      scaleScreen() {
        this.windowFlag = false
        this.$emit('scaleMethod')
      },
      openWindow(sort, para) {
        this.showColumn = sort
        // window.scrollTo(0, 0)
        if (this.showColumn == 'track') {
          this.getTrackM()
          if (!this.windowFlag) {
            this.windowFlag = true
          }
        } else if (this.showColumn == 'collect') {
          console.log('sdklf')
          if (!this.windowFlag) {
            this.windowFlag = true
          }
        } else if (this.showColumn == 'note') {
          this.noteParagraph = para
          if (!this.windowFlag) {
            this.windowFlag = true
          }
        }
      },
      closeWindow() {
        this.showColumn = ''
        this.windowFlag = false
        this.$emit('closeSiderBar')
      }
    }
  }
</script>
<style lang="scss">
  .el-popover.el-popper.rulesContent {
    width: 207px !important;
    height: 265px;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    overflow: hidden;
    padding: 30px;
    box-sizing: border-box;
    .imgArea {
      width: 155px;
      height: 155px;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      margin: 0 auto;
      position: relative;
      img {
        display: block;
        width: 130px;
        height: 130px;
        margin: auto;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
    }
    span {
      font-size: 16px;
      color: #ffb148;
      width: 100%;
      display: block;
      text-align: center;
      margin-top: 10px;
      margin-left: 5px;
    }
  }
  .smallBar {
    position: fixed;
    right: 10px;
    bottom: 20px;
    z-index: 100;
    border-radius: 2px;
    padding: 3px 0px;
    cursor: pointer;
    height: auto !important;
    top: inherit !important;
    i {
      font-size: 30px;
      color: #d4b486;
    }
  }
  .sidebar {
    .bar {
      width: auto;
      height: 100%;
      min-height: 575px;
      position: fixed;
      z-index: 700;
      right: 0;
      top: 60px;
      .el-button--text {
        float: right;
        padding: 0;
      }
      .web-erweima{
        line-height: 60px;
      }
      .iconfont {
        /*line-height: 60px;*/
      }
      .iconColor {
        color: #d4b486;
        font-size: 25px;
        text-align: center;
        margin-top: 35px;
      }
      .icon-dayin {
        font-size: 27px;
      }
      .icon-quanping, .icon-fenxiang1, .icon-dingbu {
        font-size: 24px;
      }
      .icon-zuji1 {
        margin-left: 5px;
      }
      .menu {
        width: 50px;
        height: 100%;
        position: relative;
        float: left;
        background: #fcefda;
        // padding-top: 15px;
        padding: 0 0 160px 0;
        box-sizing: border-box;
        .header {
          padding: 30% 0;
          cursor: pointer;
          img {
            width: 80%;
            height: 50%;
            border: 1px solid #d4b486;
            border-radius: 50%;
            display: block;
            margin: auto;
            -moz-box-shadow: 0px 0px 4px #FFB148;
            -webkit-box-shadow: 0px 0px 4px #FFB148;
            box-shadow: 0px 0px 4px #FFB148;
          }
          p {
            width: 100%;
            text-align: center;
            margin-top: 15px;
            font-size: 16px;
            color: #d4b486;
            height: auto;
            word-wrap: break-word;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .qrcode {
          width: 100%;
          div {
            width: 44%;
            height: 100%;
            border-top: 1px solid #d4b486;
            border-bottom: 1px solid #d4b486;
            margin: auto;
            position: relative;
            display: table;
            .iconfont {
              display: table-cell;
              vertical-align: middle;
              // line-height: 100px;
            }
          }
          &:hover {
            background: #fde3bd;
          }
        }
        ul {
          width: 100%;
          height: auto;
          margin-top: 40%;
          li {
            width: 100%;
            height: auto;
            overflow: hidden;
            text-align: center;
            margin-top: 24%;
            padding: 5px 0;
            .iconfont {
              line-height: inherit;
            }
            img {
              margin: 15px auto;
              width: 22px;
              height: 22px;
            }
            &:hover {
              background: #fde3bd;
            }
            .sideNote {
              margin: 0;
              width: auto;
              height: 22px;
            }
          }
        }
        .bottom {
          position: absolute;
          bottom: 10%;
          left: 3px;
          .web-zuji1 {
            margin-left: 3px;
          }
        }
      }
      .barContent {
        width: 0;
        height: 100%;
        background: #fff;
        float: right;
        padding: 0;
        box-sizing: border-box;
        /*border-left: 1px solid #e3e3e3;*/
        transition: width .3s;
        &.barWidth {
          width: 580px;
          transition: width .3s;
          padding: 10px 15px 0 15px;
        }
        .track {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          .title {
            width: 100%;
            height: 54px;
            line-height: 54px;
            border-bottom: 1px solid #e3e3e3;
            font-size: 17px;
            color: #323232;
            i {
              float: right;
              color: #8d8d8d;
              font-size: 20px;
              line-height: 54px;
              cursor: pointer;
            }
          }
          .trackContent {
            width: 100%;
            height: 90%;
            .counter {
              font-size: 16px;
              color: #a8a8a8;
              line-height: 54px;
              i {
                float: right;
                color: #bcbcbc;
                font-size: 20px;
                line-height: 54px;
                cursor: pointer;
              }
            }
            .listContainer {
              width: 100%;
              height: 90%;
              overflow: auto;
              .el-button.is-round {
                padding: 2px 6px;
                background: #d4b486;
                color: #fff;
                font-size: 14px;
                border: none;
                cursor: default;
                margin-bottom: 20px;
              }
              .list {
                cursor: pointer;
                .listTitle {
                  margin-bottom: 5px;
                  &:hover {
                    text-decoration: underline;
                    color: #ffb148;
                  }
                }
                font-size: 16px;
                color: #323232;
                .el-button {
                  font-size: 12px;
                  color: #fff;
                  padding: 3px 5px;
                  border: 0;
                  cursor: default;
                  margin-bottom: 20px;
                }
                .el-button--primary {
                  background-color: #90b8f5;
                }
                .el-button--warning {
                  background-color: #ffb148;
                }
                .time {
                  font-size: 12px;
                  color: #8d8d8d;
                }
                .split {
                  color: #e3e3e3;
                  margin: 0 10px;font-size: 10px;
                }
              }
            }
          }
        }

      }
    }
    .shadow {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .5);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 600;
    }
    .el-tooltip__popper.is-light {
      border: 1px solid #e3e3e3 !important;
      padding: 5px 10px !important;
      border-radius: 0;
      overflow: hidden;
    }
    .el-tooltip__popper .popper__arrow {
      border: 0 !important;
    }
  }
</style>
