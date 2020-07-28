<template>
  <div class="vxa-aside" v-show='asideState'>

    <vxa-popup v-model="show" class="vxa-aside-popup" :activeClass="active.activeClass" position="right" width="400px"
               height="100%">
      <div slot="aside-right" class="vxa-aside-right">
        <ul :class="{itemColor: item.active}" v-for="(item ,index) in asideList" @click="handleClick(index)">
          <el-tooltip class="item" effect="dark" :content="item.promptTitle" placement="left">
            <li v-if="item.show">
              <i v-if="index != 4 && item.active" :class="[item.icon, {'active':item.active}]"></i>
              <i v-if="index != 4 && !item.active" :class="[item.icon1, {'active':item.active}]"></i>
              <i v-if="index == 4 && item.active" :class="[item.icon, {'active':item.active}]" v-popover:popoverShare></i>
              <i v-if="index == 4 && !item.active" :class="[item.icon1, {'active':item.active}]"
                 v-popover:popoverShare></i>
            </li>
          </el-tooltip>
        </ul>
      </div>
      <!---->
      <template slot="content">
        <vxa-note :paragraph="noteParagraph" class="vxa-aside-content" name="笔记"
                  v-if="active.type=='note' && active.show"
                  ref="sideBarNote" @isShow="showF"></vxa-note>
        <vxa-collect class="vxa-aside-content" name="收藏" @isShow="showF"
                     v-if="active.type=='collect' && active.show"></vxa-collect>
        <vxa-track class="vxa-aside-content" ref="trak" @isShow="showF" name="足迹"
                   v-if="active.type=='track' && active.show"></vxa-track>
      </template>
    </vxa-popup>
    <el-popover ref="popoverShare" placement="left" width="400" trigger="hover" popper-class="rulesContent">
      <div class="imgArea">
        <v-qrcode :text="shareUrl"></v-qrcode>
      </div>
      <span style="margin-top: 25px;">扫码分享</span>
      <!---->
    </el-popover>
    <div class="vux-popup-mask" @click="show = false" :class="{'vux-popup-show': show}"></div>
  </div>
</template>

<script>
  import VxaNote from '@/view/aside/components/vxa-note'
  import VxaCollect from '@/view/aside/components/vxa-collect'
  import VxaTrack from '@/view/aside/components/vxa-track'
  import VxaPopup from '@/view/aside/popup/index'
  import qrcode from '@/components/qrcode.vue'
  import _conf from '../../config/config'
  export default {
    name: "aside",
    components: {
      VxaPopup,
      VxaNote,
      VxaCollect,
      VxaTrack,
      'v-qrcode': qrcode
    },
    data() {
      return {
        asideState: true,
        shareUrl: '',
        reference: '',
        show: false,
        active: {
          show: false
        },
        noteParagraph: '',
        asideList: [
          {
            promptTitle:'笔记',
            show: false,
            type: 'note',
            activeClass: 'animate-right-active',
            icon: 'iconfont web-icon_tianchong_biji', // 不透明
            icon1: 'iconfont web-noteicon', // 透明
            alt: '笔记',
            active: false
          },
          {
            promptTitle:'收藏',
            show: false,
            type: 'collect',
            activeClass: 'animate-right-active',
            icon: 'iconfont web-shoucang1', // 不透明
            icon1: 'iconfont web-shoucang', // 透明
            alt: '收藏',
            active: false
          },
          {
            promptTitle:'打印',
            show: false,
            type: 'print',
            activeClass: 'animate-right-active',
            icon: 'iconfont web-icon_tianchong_dayin1', // 不透明
            icon1: 'iconfont web-icon_dayin-', // 透明  web-icon_tianchong_dayin
            alt: '打印',
            active: false
          },
          {
            promptTitle:'足迹',
            show: false,
            type: 'track',
            activeClass: 'animate-right-active',
            icon: 'iconfont web-icon_tianchong_zuji',  // 不透明
            icon1: 'iconfont web-xianxing_zuji', // 透明
            alt: '足迹',
            active: false
          },
          {
            promptTitle:'分享',
            show: false,
            type: 'share',
            activeClass: 'animate-right-active',
            icon: 'iconfont web-fenxiang1', // 不透明
            icon1: 'iconfont web-share', // 透明
            alt: '分享',
            active: false
          },
          {
            promptTitle:'全屏',
            show: false,
            type: 'zoom',
            activeClass: 'animate-right-active',
            icon: 'iconfont web-icon_xianxing_quanping-quxiaoquanping',
            icon1: 'iconfont web-quanping-quanping',
            alt: '全屏',
            active: false
          }
        ],
        printStyle: _conf.printStyle
      }
    },
    watch: {
      show: function (val) {
        if (val) {
          //
          //
        } else {
          this.asideList.forEach((item, i) => {
            item.active = false;
          });
          this.active = {};
        }
      },
      '$store.state.asideNoteState': function (val) {
        if (this.$store.state.asideNoteState) {
          this.handleClick(0);
          this.$store.commit('asideNoteState', false);
        }
      }
    },
    created() {
      if (this.$route.meta.asideOption) {
        let arr = this.$route.meta.asideOption;
        for (let i = 0; i < arr.length; i++) {
          this.asideList.forEach((item) => {
            if (item.type == arr[i]) {
              item.show = true;
            }
          })
        }
      }
      console.log(this.asideList);
      this.setShareUrl()
    },
    mounted() {
      // setTimeout(() => {
      //   this.show = true
      // }, 2000)
    },
    methods: {
      setShareUrl() {
        let pageRouter = this.$route.name
        console.log(pageRouter + '5555');
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
        console.log(this.shareUrl);
      },
      handleClick(index, para) {
        this.asideList.forEach((item, i) => {
          item.active = false;
          if (index === i) {
            item.active = true;
          }
        });
        if (index == 5) {
          if (this.$store.state.scaleShowState) {
            this.asideList[5].icon = 'iconfont web-icon_tianchong_quanping-quxiaoquanping';
            this.$store.commit('scaleShowState', false)
            return
          } else {
            this.asideList[5].icon = 'iconfont web-icon_tianchong_quanping-quanping';
            this.$store.commit('scaleShowState', true)
            return
          }
        } else {
          if (this.$store.state.scaleShowState) {
            this.asideList[5].icon = 'iconfont web-quanping-quanping';
          } else {
            this.asideList[5].icon1 = 'iconfont web-icon_xianxing_quanping-quxiaoquanping';
          }
        }
        if (index == 0) {
          this.noteParagraph = para;
        }
        if (index == 2) {
          this.printf();
          return
        }
        if (index == 3) {
          this.$nextTick(() => {
            this.$refs.trak.getTrackM();
          });
        }
        if (index == 4) {
          return
        }
        this.active = this.asideList[index];
        console.log(this.active);
        this.show = true;
      },
      printf() {
        // this.$emit('printfMethod')
//        var bdhtml = document.getElementById('pdf-wrap').innerHTML
//        var sprnstr = '<!--startprint-->'
//        var eprnstr = '<!--endprint-->'
//        var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17)
//        prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr))
//        window.document.body.innerHTML = prnhtml
//        window.print()
//         let newWindow = window.open('_blank')   // 打开新窗口
//         let codestr = document.getElementById('pdf-wrap').innerHTML   // 获取需要生成pdf页面的div代码
//         let cssStr = this.printStyle
//         newWindow.document.write(`<div class="details">${codestr}</div>${cssStr}`)   // 向文档写入HTML表达式或者JavaScript代码
//         newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
//         newWindow.print()   // 打印当前窗口
        let codestr = document.getElementById('content_right').innerHTML
        // window.print()
        let newWindow = window.open('_blank')   // 打开新窗口
        // let codestr = document.getElementById('content_right').innerHTML   // 获取需要生成pdf页面的div代码
        newWindow.document.write(codestr)   // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
        newWindow.print()   // 打印当前窗口
        return true
      },
      showF() {
        this.show = false;
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
    margin-right: 30px;
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
</style>

<style lang="scss" scoped>
  @import "styles/vux-modal";
  @import "styles/transition";
  .vxa-aside {
    background-color: #f6f6f6;
    &-popup {
      .vxa-aside-right {
        position: absolute;
        display: inline-block;
        left: -50px;
        top: 50%;
        transform: translateY(-50%);
        margin: auto;
        width: 50px;
        height: auto;
        background: rgba(51, 52, 55, 1);
        border-radius: 4px 0px 0px 4px;
        opacity: 0.9;
        // z-index: 3001;
        // transition:  .3s;
        .itemColor {
          background-color: #000000;
        }
        padding: 35px 0;
        li {
          color: white;
          text-align: center;
          padding: 15px 0;
          &:last-child {
            // padding-bottom: 0;
          }
          i {
            font-size: 21px;
          }
          i.active {
            color: #ffb148;
          }
          &:hover {
            background-color: black;
          }
        }
      }
      .vxa-aside-content {
        height: 100%;
        width: 100%;
        .vxa-aside-close {
          position: absolute;
          right: 0;
        }
      }
    }
  }
</style>
