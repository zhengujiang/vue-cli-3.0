<template>
  <div id="ruleContent" class="caseDetail">
    <div class="ruleContent" :class="{screenWidth: isScreen}">
      <!---->
      <div id="content_left" class="ruleCatalog" v-show="!isScreen" :class="{ruleScr: ruleScroll}">
        <el-collapse accordion v-model="activeName" @change="collapse">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-jibenxinxi"></i>
                <span>{{ruleCont[0].title}}</span>
                <i class="el-icon-arrow-down header-arrow" v-show="activeName!='1'"></i>
                <i class="el-icon-arrow-up header-arrow" v-show="activeName=='1'"></i>
              </div>
            </template>
            <div class="warp-row">
              <div class="warp-row-list" v-for="(list,index) in BasicInformation"
                   v-if="list.doc !== '--' && list.doc !== '' && list.doc !== '无'">
                <label for="" v-html="list.title"></label>
                <div>{{list.doc}}</div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-mulu"></i>
                <span>目&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</span><!--{{ruleCont[1].title}}-->
                <i class="el-icon-arrow-down header-arrow" v-show="activeName!='2'"></i>
                <i class="el-icon-arrow-up header-arrow" v-show="activeName=='2'"></i>
              </div>
            </template>
            <div class="warp-row">
              <div class="warp-row-list" v-if="Directory == null || Directory.length == 0">
                <label for="" style="width:100%;white-space: normal">{{textDetail[1]}}</label>
                <div></div>
              </div>
              <div class="warp-row-list" v-for="(list, index) in Directory" @click="getDirectory(index)" v-else
                   v-html="list.htmlText">
                <div></div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" v-if="relationLaw.length !== 0">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-xiangguanguize"></i>
                <span>{{ruleCont[2].title}}</span> <!--  -->
                <i class="el-icon-arrow-down header-arrow" v-show="activeName!='3'"></i>
                <i class="el-icon-arrow-up header-arrow" v-show="activeName=='3'"></i>
              </div>
            </template>
            <div class="warp-row">
              <div class="warp-row-list mulu" v-for="(list, index) in relationLaw" @click="relationClick(index)">
                <label class="listType"><i></i></label>
                <div class="listDoc"><a href="javascript:void(0)">{{list.relationLawName}}</a></div>
              </div>
              <div v-if="relationLaw.length == 0">暂无相关！</div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="4" v-if="relationCase.length !== 0">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-anli" style="font-size: 22px;"></i>
                <span>{{ruleCont[4].title}}</span>
                <i class="el-icon-arrow-down header-arrow" v-show="activeName!='4'"></i>
                <i class="el-icon-arrow-up header-arrow" v-show="activeName=='4'"></i>
              </div>
            </template>
            <div class="warp-row">
              <div class="warp-row-list mulu" v-for="(list, index) in relationCase"
                   @click="relationClick(index,list.id)">
                <label class="listType"><i></i></label>
                <div class="listDoc"><a href="javascript:void(0)">{{list.title}}</a></div>
              </div>
              <div v-if="relationCase.length == 0">暂无相关！</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!---->
      <div id="content_right" class="ruleText print" :class="{isScreen: isScreen}">
        <transition name="el-zoom-in-bottom">
          <div id="addnode" class="addnode" v-show="note.addNodeShow"
               style="position: absolute;  width:100%; border:1px solid #e3e3e3; background-color: #fff;z-index:1000;padding: 10px 15px;">
            <div style="text-align: center; font-size: 18px;">我的笔记
              <!--<i class="el-icon-close fright"></i>-->
            </div>
            <el-input class="noteContent" type="textarea" v-model="note.noteContent"
                      :autosize="{ minRows: 6, maxRows: 18}" placeholder="请输入内容" :maxlength="10000">
            </el-input>
            <div class="btnBox">
              <span style="font-size: 14px;">隐私设置：</span>
              <el-select class="select-note-type" v-model="note.noteType" placeholder="隐私设置" size="mini">
                <el-option v-for="item in note.noteTypeList" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <el-button type="primary" size="mini" @click="handleAddLawNote">确定</el-button>
              <el-button size="mini" @click="handleAddNodeHide">取消</el-button>
            </div>
          </div>
        </transition>
        <transition name="el-zoom-in-bottom">
          <div id="editnode" class="addnode" v-show="note.editNodeShow"
               style="position: absolute;  width:100%; border:1px solid #e3e3e3; background-color: #fff;z-index:1000;padding: 10px 15px;">
            <div style="text-align: center; font-size: 18px;">我的笔记
              <i class="el-icon-close fright pointer" @click="handleEditNodeHide"></i>
            </div>
            <el-input class="noteContent" type="textarea" v-model="note.editNoteContent"
                      :autosize="{ minRows: 6, maxRows: 18}" placeholder="请输入内容" :maxlength="10000"
                      :readonly="!note.editState" @focus="note.editState=true" spellcheck="false">
            </el-input>
            <div class="btnBox flexBox" v-show="!note.editState">
              <div class="flexBox" v-if="note.selectNote">
                <img class="icon-img" :src="$image.rules.dialog" style="height: 15px;">
                <span class="count-span">{{note.selectNote.commentCount}}</span>
                <i v-if="note.selectNote.like" class="iconfont web-dianzan1 likecolor" @click="giveLike(0)"></i>
                <i v-else class="iconfont web-dianzan1" @click="giveLike(1)"></i>
                <span class="count-span"
                      :class="{'likecolor': note.selectNote.like}">{{note.selectNote.likeCount}}</span>
              </div>
              <div class="flexBox">
                <span style="font-size: 14px;">隐私设置：</span>
                <el-select class="select-note-type" v-model="note.editNoteType" placeholder="隐私设置" size="mini"
                           @change="updatePrivacyStatus">
                  <el-option v-for="item in note.noteTypeList" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <img :src="$image.rules.delete" style="height: 16px;" @click="deleteLawNote">
              </div>
            </div>
            <div class="btnBox" v-show="note.editState">
              <el-button type="primary" size="mini" @click="handleUpdateLawNote">确定</el-button>
              <el-button size="mini" @click="cancelEdit">取消</el-button>
            </div>
          </div>
        </transition>
        <header id="content_header" class="rules-title" :class="{ruleScr: ruleScroll, fullScreenState: !$store.state.scaleShowState}">
          <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
            <span @click="loadingNote">
              <el-tooltip class="item" effect="dark" :content="loadNoteBtnText" placement="bottom">
                <i v-if="loadingNoteState" class="iconfont web-icon_xianxing_chakanbiji"></i>
                <i v-else class="iconfont web-icon_tianchong_biji"></i>
              </el-tooltip>
            </span>
            <span @click="collectDialogInfo=true">
              <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                <i v-if="!collectDialogInfo" class="iconfont web-shoucang"></i>
                <i v-else class="iconfont web-shoucang1"></i>
              </el-tooltip>
            </span>
          </div>
          {{contentDetail.title}}
          <div class="timeliness" v-if="this.BasicInformation[5].doc == '待生效'">
            <img :src="$image.rules.daishengxiao" alt="">
          </div>
          <div class="timeliness" v-else-if="this.BasicInformation[5].doc == '失效'">
            <img :src="$image.rules.yishixiao" alt="">
          </div>
          <!--<div class="fright" v-if="userId">
            <el-button type="primary" size="mini">{{loadNoteBtnText}}</el-button>
          </div>-->
          <!-- <div class="icon-box hide-print" v-if="userId">
            <span @click="loadingNote">
              <i class="iconfont web-icon_xianxing_chakanbiji"></i>
              {{loadNoteBtnText}}
            </span>
            <span @click="collectDialogInfo=true">
              <i class="iconfont web-shoucang"></i> 收藏
            </span>
          </div> -->
        </header>
        <div id="rules-contents" v-if="isScreen" style="max-width: 1200px" :style='{"width": screenWidth - 100 + "px"}' v-html="contentHtml"></div>
        <div id="rules-contents" v-else v-html="contentHtml"></div>
        <!--@mouseup="selectLogText"-->
        <!--<div style="text-align: right; font-size: 16px; margin-bottom: 20px;">最后编辑于：{{contentDetail.updateDate}}</div>-->
        <footer class="rules-ref" style="padding: 16px" v-show="attachment.length != 0">
          <div v-show="attachment.length != 0">
            <h3>{{textDetail[0]}}</h3>
            <p class="" v-for="(list,index) in attachment" v-if="list.attachmentTypeEnum == 'ATTACHMENT'">
              <i class="iconfont web-word" style="color:rgb(52,153,252)"
                 v-if="list.fileName.indexOf('doc') > 0"></i>
              <i class="iconfont web-pdf" style="color:rgb(236,82,95)"
                 v-else-if="list.fileName.indexOf('pdf') > 0"></i>
              <a :href="list.filePath" target="_Blank" :download="list.fileName">{{list.fileName}}</a>
            </p>
          </div>
        </footer>
      </div>
      <!--<v-suspension v-show="isScreen" :basicInfo="BasicInformation" :muluInfo="Directory"-->
      <!--@linkMulu="muluMethod"></v-suspension>-->
    </div>
    <!-- 选中，查看 菜单 -->
    <div id="div_menu" class="tooltip btns-tip">
      <div class="bubble-content">
        <ul class="action-list" style="list-style:none;">
          <li id="copyEle" class="action-underline" :data-clipboard-text="copyContent" @click="handleCopy('copyEle')">
            复制
          </li>
          |
          <li class="action-note" @click="handleAddNodeShow">笔记</li>
          <!--<li class="action-copy" @click="removeSelection">
            <button class="cancel">取消</button>
          </li>-->
        </ul>
      </div>
    </div>
    <div id="div_menu_view" class="tooltip btns-tip">
      <div class="bubble-content">
        <ul class="action-list" style="list-style:none;">
          <li id="copySelectNote" class="action-underline" :data-clipboard-text="copyContent"
              @click="handleCopy('copySelectNote')">复制
          </li>
          |
          <li @click="handleEditNodeShow">编辑</li>
          |
          <li @click="deleteLawNote">删除</li>
          |
          <li @click="showMoreNote">查看更多</li>
        </ul>
      </div>
    </div>
    <!---->
    <v-contentLoading :stopLoading="isLoading"></v-contentLoading>
    <!---->
    <v-error :isAjaxError="isError"></v-error>
    <!---->
    <collect-dialog :collectDialogInfo="collectDialogInfo" :info="contentDetail | delContent"
                    @changeCollectDialog="changeCollectDialog" v-if="contentDetail.id"></collect-dialog>
  </div>
</template>

<script>
  import detailsMixins from '../../libs/details'
  import sidebar from '../../components/sidebar.vue'
  import contentLoading from '../../components/contentLoading.vue'
  import error from '../../components/error.vue'
  import suspension from '../../components/suspension.vue'
  import Clipboard from 'clipboard'
  import collectDialog from '@/view/aside/components/components/collectDialog.vue'

  export default {
    name: 'rule-detail',
    data() {
      return {
        loadingNoteState: true, // 控制收藏图标
        collectDialogInfo: false,
        userId: '',
        lawId: '',
        dialogVisible: false,
        textDetail: ['相关附件', '暂无目录'],
        ruleloading: true,
        activeName: '1',
        iImg: this.$image.prompt.clue,
        ruleCont: [
          {
            id: '0', name: '', title: '基本信息', list: {},
            icon: 'agtImg'
          }, {
            id: '1', name: '', title: '目录', list: {},
            icon: 'agtImg'
          }, {
            id: '2', name: '', title: '相关法规', list: {},
            icon: 'agtImg'
          }, {
            id: '3', name: '', title: '相关问答', list: {},
            icon: 'agtImg'
          }, {
            id: '4', name: '', title: '相关案例', list: {},
            icon: 'agtImg'
          }
        ],
        contentDetail: {},
        contentHtml: '',
        collectInfo: {},
        BasicInformation: [
          {title: '发布日期：', doc: ''},
          {title: '生效日期：', doc: ''},
          {title: '文&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：', doc: ''},
          {title: '发文单位：', doc: ''},
          {title: '适用范围：', doc: ''},
          {title: '时&nbsp;&nbsp;效&nbsp;&nbsp;性：', doc: ''}
        ],
        Directory: [], // 筛选 目录
        relationLaw: [], // 相关规则
        relationCase: [], // 相关案例
        scrolled: '',
        ruleScroll: false,
        attachment: [], // 附件
        /* windowFlag: false,
        windowFlag2: true,
        trackNum: '12', */
        isScreen: false,
        isLoading: true,
        isError: false,
        screenWidth: document.body.clientWidth,
        copyContent: '',

        note: {
          myNoteList: [],
          myNoteImg: this.$image.rules.mynote,
          addNodeShow: false,
          noteContent: '',
          noteType: 0,
          editState: false, // 是否编辑状态
          editNodeShow: false,
          editNoteContent: '',
          editNoteType: 0,
          noteTypeList: [
            {
              value: 0,
              label: '个人可见'
            }, {
              value: 1,
              label: '团队可见'
            }, {
              value: 2,
              label: '全站可见'
            }, {
              value: 3,
              label: '全站可见'
            }
          ],
          startContainerId: '',
          endContainerId: '',
          section: '',
          selectNote: {},
          noteId: '' // 点击笔记时，设置选中的ID
        },
        loadNoteBtnText: '显示笔记'
      }
    },
    mixins: [detailsMixins],
    // 使用其它组件
    components: {
      'v-sidebar': sidebar,
      'v-contentLoading': contentLoading,
      'v-suspension': suspension,
      'v-error': error,
      collectDialog
    },
    filters: {
      delContent: function (obj) {
        if (obj == {}) return obj
        var newObj = {
          id: obj.id,
          title: obj.title,
          time: obj.publishDate,
          timeliness: obj.timeliness,
          type: 'law'
        }
        return newObj
      }
    },
    // 方法
    computed: {
      isLogin: function () {
        return this.$store.state.isLogin
      },
      info: function () {
        return this.$store.state.userData
      }
    },
    watch: {
      '$store.state.scaleShowState': function (val) {
        this.ruleScroll = false
        this.isScreen = val;
        this.scaleScreen();
      },
      screenWidth: function (val) {
        this.screenWidth = val
        if (val < 1290) {
          this.isScreen = true
        } else {
          this.isScreen = false
        }
      },
      'ruleScroll': function (val) {
        // console.log(' ruleScroll = ', val)
        // var bh = document.body.clientHeight
        // var headerow = document.getElementsByClassName('header-row')[0].clientHeight
        // var num = parseInt(document.getElementsByClassName('header-row').length)
        // var content = document.getElementsByClassName('el-collapse-item__content')
        /* if (val) {
          for (var i = 0; i < content.length; i++) {
            content[i].style.height = (bh - headerow * num - headerow) + 'px'
            // content[i].style.height = (bh * 0.2) + 'px'
          }
        } else {
          for (var j = 0; j < content.length; j++) {
            content[j].style.height = (bh - headerow * num - headerow - 120) + 'px'
            // content[j].style.height = (bh * 0.5) + 'px'
          }
        } */
      }
    },
    // 生命周期函数
    created() {
      this.$store.commit('scaleShowState', true)
      this.lawId = this.$route.query.id
      this.userId = this.$cookie.get('userId')
      if (this.userId) {
        this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'))
        // 小安用户 全站可见notetype=2,普通用户notetype=3
        if (this.userInfo.xiaoAnUser) {
          this.note.noteTypeList.splice(3, 1)
        } else {
          this.note.noteTypeList.splice(2, 1)
        }
        if (!this.userInfo.enterpriseUser) {
          this.note.noteTypeList.splice(1, 1)
        }
      }
      // this.inputText = this.$route.query.inputVal;
      if (document.body.clientWidth < 1290) {
        this.isScreen = true
      } else {
        this.isScreen = false
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
      this.getDetails(this.$route.query.id)
      // 勿删
      this.$nextTick(() => {
        var bh = document.body.clientHeight
        var headerow = document.getElementsByClassName('header-row')[0].clientHeight
        var num = parseInt(document.getElementsByClassName('header-row').length)
        var content = document.getElementsByClassName('el-collapse-item__content')
        for (var i = 0; i < content.length; i++) {
          content[i].style.height = (bh - headerow * (num + 1) - headerow - 100) + 'px'
        }
      })
      const that = this
      this.windowOnresize()
      document.addEventListener('click', this.windowOnresize)
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      windowOnresize() {
        const that = this
        setTimeout(() => {
          window.onresize = () => {
            return (() => {
              console.log(document.body.clientWidth)
              window.screenWidth = document.body.clientWidth
              that.screenWidth = window.screenWidth
              if (that.screenWidth < 1280) {
                that.isScreen = true
              } else {
                that.isScreen = false
              }
            })()
          }
        }, 300)
      },
      loadingNote() {
        if (this.loadNoteBtnText == '显示笔记') {
          this.loadingNoteState = false;
          this.loadNoteBtnText = '关闭笔记'
          this.isLoading = true
          setTimeout(() => {
            this.selectNotesLog();
          }, 300)
        } else {
          this.loadNoteBtnText = '显示笔记'
          this.loadingNoteState = true;
          this.isLoading = true
          this.contentHtml = ''
          setTimeout(() => {
            this.contentHtml = this.contentDetail.content
            // document.onmousedown = true
            this.isLoading = false
          }, 500)

          document.oncontextmenu = () => {
            event.cancelBubble = false
            event.returnValue = true;
            return true;
          }
          document.onmousedown = (e) => {
            if (window.Event) {
              if (e.which == 2 || e.which == 3) {
                return true;
              }
            } else if (event.button == 2 || event.button == 3) {
              event.cancelBubble = false
              event.returnValue = true;
              return true;
            }
          }
        }
      },
      selectNotesLog() {
        // 禁止鼠标右击
        var that = this;
        if (window.Event) {
          document.captureEvents(Event.MOUSEUP);
        }

        function nocontextmenu() {
          event.cancelBubble = true
          event.returnValue = false;
          return false;
        }

        function noRightClick(e) {
          if (window.Event) {
            if (e.which == 2 || e.which == 3) {
              return false;
            }
          } else if (event.button == 2 || event.button == 3) {
            event.cancelBubble = true
            event.returnValue = false;
            return false;
          }
        }

        document.oncontextmenu = nocontextmenu; // for IE5+
        document.onmousedown = noRightClick; // for all others
        //
        // 获取文件后给正常文本每个字符添加 span
        (function () {
          var childrenDom, childrenPDom;
          if (document.querySelector('#rules-contents .content-abs')) {
            childrenDom = document.querySelector('#rules-contents .content-abs');
            childrenPDom = document.querySelectorAll('#rules-contents .content-abs > p');
            // console.log(1);
          } else {
            childrenDom = document.querySelector('#rules-contents');
            childrenPDom = document.querySelectorAll('#rules-contents > p');
            // console.log(0);
          }
          var nextDom = childrenDom.children;
          var len = childrenDom.children.length;
          // console.log('nextDom', nextDom);
          //
          var defaultIndex = 0, number = 0;
          for (var i = 0; i < len; i++) {
            var textById = 'text';
            nextDom[i].setAttribute('id', 'section' + i);
            if (nextDom[i].nodeName == 'P' || nextDom[i].nodeName.indexOf('H') > -1) {
              if (nextDom[i].childElementCount > 0) {
                // 有子节点
                let chLen = nextDom[i].childNodes.length;
                var setHtmlDom = '';
                for (var j = 0; j < chLen; j++) {
                  if (nextDom[i].childNodes[j].nodeName == '#text') {
                    var nodeValue = nextDom[i].childNodes[j].nodeValue.replace(/(^\s*)|(\s*$)/gmi, '');
                    var lenC = nodeValue.length;
                    for (var k = 0; k < lenC; k++) {
                      // console.log(nextDom[i].childNodes[j].nodeValue[k]);
                      if (nodeValue[k] != null || nodeValue[k] != ' ') {
                        setHtmlDom += '<span class="word" data-length="' + nodeValue[k].length + '" id="' + textById + '-' + number + '" data-offset="' + number + '">' + nodeValue[k] + '</span>'
                        number += 1;
                      }
                    }
                  } else if (nextDom[i].childNodes[j].outerText) {
                    if (nextDom[i].childNodes[j].outerText.length > 0) {
                      setHtmlDom += '<span class="word" data-length="' + nextDom[i].childNodes[j].outerText.length + '" id="' + textById + '-' + number + '" data-offset="' + number + '">' + nextDom[i].childNodes[j].outerHTML + '</span>';
                    } else {
                      setHtmlDom += nextDom[i].childNodes[j].outerHTML;
                    }
                    number += 1;
                  } else if (nextDom[i].childNodes[j].nodeName == 'IMG') {
                    setHtmlDom += nextDom[i].childNodes[j].outerHTML;
                  }
                }
                nextDom[i].innerHTML = setHtmlDom;
                // var regex = new RegExp(/<[^>]*>*<\/*>/gm);
                // console.log('有子节点', setHtmlDom);
                // console.log('有子节点', nextDom[i].innerText);
              } else {
                // console.log('无子节点', nextDom[i].childNodes[0].nodeValue);
                nextDom[i].innerText = nextDom[i].innerText.replace('&ensp;', '').replace('&nbsp;', '').replace(/(^\s*)|(\s*$)/gmi, '');
                var textLen = nextDom[i].innerText.length;
                let htmlDom = '';
                for (let j = 0; j < textLen; j++) {
                  htmlDom += '<span class="word" id="' + textById + '-' + number + '" data-length="' + nextDom[i].innerText[j].length + '" data-offset="' + number + '">' + nextDom[i].innerText[j] + '</span>'
                  number += 1;
                }
                nextDom[i].innerHTML = htmlDom;
              }
              //
            } else if (nextDom[i].nodeName.indexOf('H') > -1) {
              // console.log('32423===>H', nextDom[i]);
              // nextDom[i].innerHTML = '<span class="ward" id="' + textById + '-' + 0 + '" data-length="' + nextDom[i].innerText.length + '" data-offset="0">' + nextDom[i].innerText + '</span>';
            }
            // console.log(nextDom[i].nodeName);
          }
          //
          // console.log('nextDom', childrenPDom);
          // console.log('nextDom1', nextDom);
          // that.loadNoteText(100, 200, 1)
          that.getNoteByUserId()
          /* setTimeout(() => {
            that.isLoading = false
          }, 1000) */
          // if (that.$route.query.id == 'ec2f9ff0aeac4d88a89cb7b3a85ec748') {}
        })();

        //
        function textCode(htmlText) {
          var r = htmlText;
          var p1 = /([A-Za-z])((<[^<]*>)*[\u4e00-\u9fa5]+)/gi;
          r = r.replace(p1, "$1 $2")
          var p2 = /([\u4e00-\u9fa5]+(<[^<]*>)*)([A-Za-z])/gi;
          r = r.replace(p2, "$2 $3");
          return r //
        }

        //
        function selectText() {
          $('.word.select').removeClass('select')
          that.note.addNodeShow = false
          that.note.editNodeShow = false
          $("#div_menu_view").hide();
          var startSpanObj, endSpanObj, editObj;
          var startNodeTop, startNodeLeft;
          var endNodeTop, endNodeLeft;
          var firstNode, lastNode; // 选中的开始dom 和结束dom
          var choice_obj = window.getSelection ? window.getSelection() : document.selection.createRange();
          that.copyContent = choice_obj.toString()
//          if (that.copyContent.length == 4) {
//            alert('你选中的文字中已包含笔记，无法重复')
//            that.removeSelection()
//            return false
//          }
          // console.log(choice_obj);
          if (choice_obj.isCollapsed) {
            // 起始位置和终止位置在一个点上为true
            that.removeSelection()
            return false
          }
          //
          firstNode = choice_obj.anchorNode.parentNode;
          startSpanObj = $(firstNode);
          startNodeTop = startSpanObj.offset().top;
          startNodeLeft = startSpanObj.offset().left;
          if (choice_obj.anchorNode.nodeName !== '#text') {
            that.removeSelection();
            return false
          }
          //
          lastNode = choice_obj.focusNode.parentNode;
          endSpanObj = $(lastNode);
          endNodeTop = $(lastNode).offset().top;
          endNodeLeft = $(lastNode).offset().left;

          if (choice_obj.focusNode.nodeName !== '#text') {
            lastNode = choice_obj.focusNode;
            endSpanObj = $(choice_obj.focusNode).prev().children(":last");
            lastNode = endSpanObj[0]
            // console.log('endSpanObj', endSpanObj);
            endNodeTop = endSpanObj.offset().top;
            endNodeLeft = endSpanObj.offset().left;
          }
          //
          var endSpanWidth, endSpanHeight;
          endSpanWidth = startSpanObj.width();
          endSpanHeight = startSpanObj.height();
          var contentOffsetLeft = $('#rules-contents').offset().left;
          var contentWidth = $('#rules-contents').width();

          //
          var menu_top = (endNodeTop + endSpanHeight);
          var menu_left = endNodeLeft + endSpanWidth;
          //
          if ((contentOffsetLeft + contentWidth) - (endNodeLeft) < 210) {
            menu_left = menu_left - 210;
          }
          // console.log(menu_left);
          $("#div_menu").css("top", (parseFloat(menu_top) - 55 - 80) + "px");
          $("#div_menu").css("left", (parseFloat(menu_left)) + "px");
          $("#div_menu").show();

          // 获取数据
          let startIndex = firstNode.dataset.offset
          let lastIndex = lastNode.dataset.offset
          // console.log(startIndex, lastIndex)
          if (startIndex && lastIndex) {
            that.note.startContainerId = Math.min(startIndex, lastIndex)
            that.note.endContainerId = Math.max(startIndex, lastIndex)
            if (parseInt(startIndex) > parseInt(lastIndex)) {
              that.note.section = firstNode.parentNode.id.replace('section', '')
            } else {
              that.note.section = lastNode.parentNode.id.replace('section', '')
            }
            // let startText = firstNode.innerHTML
            // let lastText = lastNode.innerHTML

            // that.setlogText(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex))
          } else {
            that.removeSelection()
            return false
          }
          // 判断选中项是否包含已有笔记
          for (let i = that.note.startContainerId; i < that.note.endContainerId; i++) {
            let className = document.querySelector('#text-' + i).getAttribute('class')
            if (className.indexOf('myselect') > -1) {
              that.removeSelection()
              // console.log('note exist')
              that.$message({showClose: true, type: 'error', duration: 3000, message: '请不要在相同位置重复添加法规笔记！'});
              return false
            }
          }
        }

        //
        document.getElementById('rules-contents').onmouseup = selectText;
        //

        document.body.onmouseup = function () {
          var choice_obj_body = window.getSelection ? window.getSelection() : document.selection.createRange();
          setTimeout(() => {
            that.$nextTick(() => {
              if (choice_obj_body.isCollapsed) {
                that.removeSelection();
              }
              // console.log('choice_objA', choice_obj_body);
            })
          })
        };
      },
      // 清除选中
      removeSelection() {
        // window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        $("#div_menu").hide();
        $("#div_display_note").hide();
      },
      selectLogText() {
        let selectedText = ''
        if (window.getSelection) {
          selectedText = window.getSelection().toString();
        } else if (document.selection && document.selection.createRange) {
          selectedText = document.selection.createRange().text;
        }
        if (selectedText) {
          this.contentHtml = this.contentDetail.content.replace(selectedText,
            `
          <span id="ruleLogText" style="color: #FFB148;position:relative;">
          <span class="beizhuBox">
            <span id="ruleCopy">复制 |</span>
            <span id="ruleUnderLine">划线 |</span>
            <span id="ruleWrite">写备注</span>
          </span>
          ` + selectedText + '</span>')
          this.$nextTick(() => {
            document.querySelector('#ruleCopy').addEventListener("click", function () {

            })
            document.querySelector('#ruleUnderLine').addEventListener("click", function () {
              document.querySelector('#ruleLogText').style.textDecoration = 'underline'
            })
            document.querySelector('#ruleWrite').addEventListener("click", function () {

            })
          })

        }

      },
      // 全屏目录
      muluMethod(index) {
        // console.log('aaaaa === ', index)
        this.getDirectory(index)
      },
      // 打印
      printfM() {
        // window.print && window.print()
        let codestr = document.getElementById('content_right').innerHTML
        window.print()
        let newWindow = window.open('_blank')   // 打开新窗口
        // let codestr = document.getElementById('content_right').innerHTML   // 获取需要生成pdf页面的div代码
        newWindow.document.write(codestr)   // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
        newWindow.print()   // 打印当前窗口
        return true
      },
      // 页面缩放
      scaleScreen() {
        this.isScreen ? this.isScreen = false : this.isScreen = true
        // console.log(this.isScreen)
        this.Directory = []
        this.$nextTick(() => {
          let h2 = document.querySelectorAll('#rules-contents h2, #rules-contents h3')
          for (let i = 0; i < h2.length; i++) {
            this.Directory.push({title: h2[i].innerText, offsetTop: h2[i].offsetTop, htmlText: h2[i].outerHTML})
          }
        })
      },
      //
      handleScroll() {
        this.scrolled = document.documentElement.scrollTop || document.body.scrollTop
        let headerHeight = document.getElementById('header').clientHeight
        console.log(headerHeight + ' headerHeight');

        // let dom = document.querySelector('.ruleContent').offsetTop
        if (this.scrolled >= headerHeight) { // this.scrolled >= dom
          this.ruleScroll = true
        } else {
          this.ruleScroll = false
        }
        var f = footer.getBoundingClientRect().top
        var c = document.documentElement.clientHeight
        var x = c - f
        // console.log(x);
        if (x >= 0) {
          document.getElementsByClassName('ruleCatalog')[0].style.marginTop = -x + 110 + 'px'
        } else {
          document.getElementsByClassName('ruleCatalog')[0].style.marginTop = '0px'
          // document.getElementsByClassName('ruleCatalog')[0].style.marginTop = '60px'
        }
        let wh = window.innerHeight || document.documentElement.clientHeight
        let bottomValue = document.body.scrollHeight - this.scrolled - wh - 100
        if (bottomValue > 0) {
          document.querySelector('#addnode').style.bottom = bottomValue + 'px'
          document.querySelector('#editnode').style.bottom = bottomValue + 'px'
        } else {
          document.querySelector('#addnode').style.bottom = 0
          document.querySelector('#editnode').style.bottom = 0
        }

      },
      //
      collapse(data) {
        /* 勿删！ */
        var content = document.getElementsByClassName('el-collapse-item__content')[data - 1]
        if (this.scrolled >= 120) {
          var bh = document.body.clientHeight
          var headerow = document.getElementsByClassName('header-row')[data - 1].clientHeight
          var num = parseInt(document.getElementsByClassName('header-row').length)
          content.style.maxHeight = (bh - headerow * (num + 1) - headerow - 20) + 'px'
          // console.log('headerow = ', (bh - headerow * num - headerow - 20))
        }
        // console.log('====>', data, this.scrolled)
      },
      //
      relationClick(index, id) {
        if (id) {
          this.$common.openWindow('/case/details?id=' + id)
        } else {
          this.$common.openWindow('/rule/details?id=' + this.relationLaw[index].relationLawId)
        }
        this.getDetails(this.$route.query.id)
        this.activeName = '1'
      },
      //
      getDirectory(index) {
        window.scrollTo(0, this.Directory[index].offsetTop - 30)
      },
      //
      getDetails(id) {
        this.$http({
          method: 'GET',
          url: this.$api.rule.getDetails,
          params: {
            id: id,
            type: 'law',
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log('12121', res)
          if (res.data.returnCode === 1) {
            this.contentDetail = res.data.returnObject
            this.contentHtml = this.contentDetail.content
            document.title = this.contentDetail.name ? this.contentDetail.name : '法规详情'
            /* 生效日期 */
            if (this.contentDetail.PublishDate != null) {
              this.BasicInformation[0].doc = this.$common.transTime(this.contentDetail.PublishDate)[0]
            } else {
              this.BasicInformation[0].doc = '--'
            }
            /* 发布日期 */
            if (this.contentDetail.effectDate != null) {
              this.BasicInformation[1].doc = this.$common.transTime(this.contentDetail.effectDate)[0]
            } else {
              this.BasicInformation[1].doc = '--'
            }
            /* 发文字号 */
            if (this.contentDetail.referenceNumber != null) {
              this.BasicInformation[2].doc = this.contentDetail.referenceNumber
            } else {
              this.BasicInformation[2].doc = '--'
            }
            /* 发文单位 */
            if (this.contentDetail.organizations != null) {
              let unitssStr = []
              for (let i = 0; i < this.contentDetail.organizations.length; i++) {
                unitssStr.push(this.contentDetail.organizations[i].value)
              }
              this.BasicInformation[3].doc = unitssStr.join('，')
            } else {
              this.BasicInformation[3].doc = '--'
            }
            /* 适用范围 */
            if (this.contentDetail.markets != null) {
              let markets = []
              this.contentDetail.markets.sort((a, b) => {
                return a.marketId > b.marketId
              })
              for (let i = 0; i < this.contentDetail.markets.length; i++) {
                markets.push(this.contentDetail.markets[i].treeNodeValue)
              }
              this.BasicInformation[4].doc = markets.join('，')
            } else {
              this.BasicInformation[4].doc = '--'
            }
            /* 时效性 */
            if (this.contentDetail.timeliness != null) {
              this.BasicInformation[5].doc = this.contentDetail.timeliness
            } else {
              this.BasicInformation[5].doc = '--'
            }
            /* 相关规则 */
            if (this.contentDetail.relationLaws == null || this.contentDetail.relationLaws.length == 0) {

            } else {
              this.relationLaw = this.contentDetail.relationLaws
            }
            /* 相关案例 */
            if (this.contentDetail.relationCase !== null && this.contentDetail.relationCase.length !== 0) {
              this.relationCase = this.contentDetail.relationCase
            }
            if (this.contentDetail.updateDate) {
              this.contentDetail.updateDate = this.$common.transTime(this.contentDetail.updateDate)[2]
            }
            this.attachment = this.contentDetail.attachments == null ? [] : this.contentDetail.attachments
            // console.log('attachment 1 =', this.attachment)
            if (this.contentDetail.attachments !== null) {
              var arrz = []
              for (var i = 0; i < this.attachment.length; i++) {
                if (this.attachment[i].attachmentTypeEnum == 'ATTACHMENT') {
                  arrz.push(this.attachment[i])
                }
              }
              this.$nextTick(() => {
                this.attachment = arrz
                // this.attachment.sort((a, b) => {
                //   return a.id > b.id
                // })

                // console.log('attachment', this.attachment)
              })
            }
            window.scrollTo(0, 0)
            if (this.contentDetail.isShowCatalog) {
              setTimeout(() => {
                this.$nextTick(() => {
                  let h2 = document.querySelectorAll('#rules-contents h2, #rules-contents h3')
                  for (let i = 0; i < h2.length; i++) {
                    this.Directory.push({title: h2[i].innerText, offsetTop: h2[i].offsetTop, htmlText: h2[i].outerHTML})
                  }
                })
              }, 550)
            }
            // if (!this.userId) { // id != 'ec2f9ff0aeac4d88a89cb7b3a85ec748' ||
            //   this.isLoading = false
            // }
            if (this.$route.query.havenote != 1) {
              this.isLoading = false
            }
          }
          this.$nextTick(() => {
            var bh = document.body.clientHeight
            var headerow = document.getElementsByClassName('header-row')[0].clientHeight
            var num = parseInt(document.getElementsByClassName('header-row').length)
            var content = document.getElementsByClassName('el-collapse-item__content')
            // console.log('content = ', content.length)
            for (var i = 0; i < content.length; i++) {
              content[i].style.height = (bh - headerow * (num + 1) - headerow - 100) + 'px'
            }
          })
          //
          if (this.userId) {
            setTimeout(() => {
              this.$nextTick(() => {
                // this.selectNotesLog();
                if (this.$route.query.havenote == 1) {
                  this.loadingNote()
                }
              })
            }, 300)
          }

        }).catch((err) => {
          this.isError = true
          this.isLoading = false
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 复制选中文本
      handleCopy(id) {
        this.setlogText(this.note.startContainerId, this.note.endContainerId)
        const clipboard = new Clipboard('#' + id)
        clipboard.on('success', () => {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '复制成功！'});
          clipboard.destroy();
        });
      },
      // 隐藏添加笔记弹窗
      handleAddNodeHide() {
        this.note.addNodeShow = false
      },
      // 显示添加笔记弹窗
      handleAddNodeShow() {
        this.setlogText(this.note.startContainerId, this.note.endContainerId)
        let wh = window.innerHeight || document.documentElement.clientHeight
        let bottomValue = document.body.scrollHeight - this.scrolled - wh - 100
        if (bottomValue > 0) {
          document.querySelector('#addnode').style.bottom = bottomValue + 'px'
        } else {
          document.querySelector('#addnode').style.bottom = 0
        }
        this.note.addNodeShow = true
      },
      // 隐藏编辑笔记弹窗
      handleEditNodeHide() {
        this.note.editNodeShow = false
      },
      // 显示编辑笔记弹窗
      handleEditNodeShow() {
        this.getNoteDetail().then(() => {
          $('#div_menu_view').hide()
          this.note.editState = false
          this.note.editNoteContent = this.note.selectNote.noteContent
          this.note.editNoteType = this.note.selectNote.noteType
          let wh = window.innerHeight || document.documentElement.clientHeight
          let bottomValue = document.body.scrollHeight - this.scrolled - wh - 100
          if (bottomValue > 0) {
            document.querySelector('#editnode').style.bottom = bottomValue + 'px'
          } else {
            document.querySelector('#editnode').style.bottom = 0
          }
          this.note.editNodeShow = true
        })

      },
      // 根据开始和结束位置，设置选中状态
      setlogText(start, end) {
        /* let allWordEle = document.querySelectorAll('.word')
        for (let i = 0; i < allWordEle.length; i++) {
          let ele = allWordEle[i]
          let dataOffset = ele.getAttribute('data-offset')
          if (parseInt(dataOffset) >= start && parseInt(dataOffset) <= end) {
            // ele.style.backgroundColor = '#ffb14a'
            $(ele).addClass('select')
          }
        } */
        for (let i = start; i <= end; i++) {
          $('#text-' + i).addClass('select')
        }
        /* allWordEle.forEach(ele => {
          let dataOffset = ele.getAttribute('data-offset')
          if (parseInt(dataOffset) >= start && parseInt(dataOffset) <= end) {
            // ele.style.backgroundColor = '#ffb14a'
            $(ele).addClass('select')
          }
        }) */
      },
      // 回显单个笔记
      loadNoteText(item) {
        let start = item.startContainerId
        let end = item.endContainerId
        let section = item.paragraph
        let allWordEle = document.querySelectorAll('.word')
        let endNode = $('#text-' + end)
        if ($('#section' + section).children('.sectionImg').length == 0) {
          $('#section' + section).append('<img id="sectionImg' + section + '" class="sectionImg" src="' + this.note.myNoteImg + '" style="width:14px; position:relative;top:2px;cursor: pointer;margin-left: 5px;" title="查看当前段落笔记"/>')
          document.querySelector('#sectionImg' + section).addEventListener("click", () => {
            if (this.isScreen) {
              this.scaleScreen()
            }
            this.$store.commit('asideNoteState', true);
            // this.$refs.sideBarEle.openWindow('note', section)
          })
        }
        if (item.userId == this.userId) {
          for (let i = start; i <= end; i++) {
            let demo = document.querySelector('#text-' + i)
            let ele = $(demo)
            ele.addClass('myselect')
            demo.addEventListener("click", () => {
              let endNodeTop = ele.offset().top;
              let endNodeLeft = ele.offset().left;
              let contentOffsetLeft = $('#rules-contents').offset().left;
              let contentWidth = $('#rules-contents').width();
              if ((contentOffsetLeft + contentWidth) - (endNodeLeft) < 300) {
                endNodeLeft = contentOffsetLeft + contentWidth - 320;
              }
              this.note.noteId = item.id // 设置选中
              this.copyContent = item.snippet // 设置复制内容
              this.note.selectNote = item
              // console.log(item)
              $("#div_menu_view").css("top", (parseFloat(endNodeTop) - 35) + "px");
              $("#div_menu_view").css("left", (parseFloat(endNodeLeft)) + "px");
              $("#div_menu_view").show();
            })
          }
        }

        /* allWordEle.forEach(ele => {
          let dataOffset = ele.getAttribute('data-offset')
          if (dataOffset == end) {
            ele.innerHTML = ele.innerHTML + '<span style="background-color: #fff;"></span>'
          }
          if (parseInt(dataOffset) >= start && parseInt(dataOffset) <= end) {
            // ele.style.backgroundColor = '#b2d7ff'
            $(ele).addClass('myselect')
            ele.addEventListener("click", () => {

              let endNodeTop = $(ele).offset().top;
              let endNodeLeft = $(ele).offset().left;
              let contentOffsetLeft = $('#rules-contents').offset().left;
              let contentWidth = $('#rules-contents').width();
              if ((contentOffsetLeft + contentWidth) - (endNodeLeft) < 300) {
                endNodeLeft = contentOffsetLeft + contentWidth - 320;
              }
              this.note.noteId = item.id // 设置选中
              this.copyContent = item.snippet // 设置复制内容
              this.note.selectNote = item
              console.log(item)
              $("#div_menu_view").css("top", (parseFloat(endNodeTop) - 35) + "px");
              $("#div_menu_view").css("left", (parseFloat(endNodeLeft)) + "px");
              $("#div_menu_view").show();
            })
          }
        }) */
      },
      // 添加笔记
      handleAddLawNote() {
        let sourceId = this.userId
        if (this.note.noteType == 1 && this.userInfo.enterpriseUser) {
          sourceId = this.userInfo.companyId
        }
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.addLawNote,
          data: {
            sourceId: sourceId,
            lawId: this.$route.query.id,
            snippet: this.copyContent,
            noteType: this.note.noteType,
            noteContent: this.note.noteContent,
            cssClass: '',
            startContainerId: this.note.startContainerId,
            endContainerId: this.note.endContainerId,
            paragraph: this.note.section,
            userName: this.userInfo.userName,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.note.addNodeShow = false
            this.note.noteContent = ''
            this.note.noteType = 0
            this.$message({showClose: true, type: 'success', duration: 3000, message: '笔记添加成功'})
            setTimeout(() => {
              this.getNoteByUserId()
            }, 1000)

          } else {

          }
        })
      },
      // 侧边栏关闭时，重新加载数据
      closeSiderBar() {
        $('.sectionImg').remove()
        this.getNoteByUserId()
      },
      // 获取个人笔记(废弃，使用搜索接口)
      getNoteByUserId_bak() {
        this.$http({
          method: 'GET',
          url: this.$api.lawnote.getNoteByUserId,
          params: {
            lawId: this.lawId,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 || res.data.returnCode === 1) {
            this.myNoteList = res.data.returnObject
            $('.word').removeClass('myselect')
            this.myNoteList.forEach((item) => {
              this.loadNoteText(item)
            })
          }
        }).catch((err) => {
          this.myNoteList = []
        })
      },
      // 搜索接口
      getNoteByUserId() {
        this.$http({
          method: 'GET',
          url: this.$api.lawnote.searchNote,
          params: {
            lawId: this.lawId,
            keyWord: '',
            noteType: 'ALL_NOTE',
            orderTypeEnum: 'DEFAULT_SORT',
            paragraph: '',
            pageSize: 10000,
            pageNum: 1,
            sourcedId: '',
            refresh: 'wait_for',
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 || res.data.returnCode === 1) {
            if (res.data.returnObject) {
              this.myNoteList = res.data.returnObject.list
              $('.word.myselect').removeClass('myselect')
              this.myNoteList.forEach((item) => {
                this.loadNoteText(item)
              })
            }
          }
          this.isLoading = false
        }).catch((err) => {
          this.myNoteList = []
          this.isLoading = false
        })
      },
      // 获取笔记详情
      getNoteDetail() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: 'GET',
            url: this.$api.lawnote.getNoteDetail,
            params: {
              noteId: this.note.selectNote.id,
              userId: this.userId
            }
          }).then((res) => {
            if (res.data.returnCode === 200 || res.data.returnCode === 1) {
              this.note.selectNote = res.data.returnObject
              resolve(null)
            }
          }).catch(reject)
        })
      },
      // 删除笔记
      deleteLawNote() {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // modal: false,
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.lawnote.deleteLawNote,
            params: {
              noteIds: this.note.noteId,
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            console.log(res)
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.note.noteId = ''
              this.copyContent = ''
              this.$message({showClose: true, type: 'error', duration: 3000, message: '笔记删除成功'})
              let sectionId = this.note.selectNote.paragraph
              // $('#section' + sectionId).removeChild('.sectionImg')
              $('#section' + sectionId).children('.sectionImg').remove()
              $("#div_menu_view").hide();
              $("#editnode").hide()
              setTimeout(() => {
                this.getNoteByUserId()
              }, 1000)
            } else {

            }
          })
        }).catch(() => {

        })

      },
      // 编辑个人日历
      handleUpdateLawNote() {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.updateLawNote,
          data: {
            id: this.note.selectNote.id,
            noteContent: this.note.editNoteContent,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.note.editState = false
            this.$message({showClose: true, type: 'error', duration: 3000, message: '笔记修改成功'})
            $('#editnode').hide()
          } else {

          }
        })
      },
      cancelEdit() {
        this.note.editState = false
        this.note.editNoteContent = this.note.selectNote.noteContent
      },
      // 隐私设置
      updatePrivacyStatus() {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.updatePrivacyStatus,
          params: {
            noteId: this.note.selectNote.id,
            noteType: this.note.editNoteType,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 || res.data.returnCode === 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '隐私设置成功'})
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.retrunMsg})
          }
        })
      },
      // 点赞
      giveLike(like) {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.giveLike,
          params: {
            sourceId: this.note.selectNote.id,
            sourceType: 1,
            like: like,
            userId: this.userId
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (like == 1) {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞成功'})
              this.$set(this.note.selectNote, 'likeCount', this.note.selectNote.likeCount + 1)
              this.$set(this.note.selectNote, 'like', true)
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞已取消'})
              this.$set(this.note.selectNote, 'likeCount', this.note.selectNote.likeCount - 1)
              this.$set(this.note.selectNote, 'like', false)
            }

          } else {

          }
        })
      },
      // 菜单查看更多
      showMoreNote() {
        this.$store.commit('asideNoteState', true);
        // $("#div_menu_view").hide();
        // if (this.isScreen) {
        //   this.scaleScreen()
        // }
        // let section = this.note.selectNote.paragraph
        // this.$refs.sideBarEle.openWindow('note', section)
      },
      changeCollectDialog() {
        this.collectDialogInfo = false
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
  .el-loading-spinner i {
    font-size: 50px;
  }
  #ruleContent {
    width: 100%;
    height: auto;
    position: relative;
    overflow: hidden;
    background-color: #F6F6F6;
    .ruleContent {
      width: 1200px;
      height: auto;
      min-height: 800px;
      /*margin: 0 auto;*/
      margin: 16px auto 30px;
      overflow: hidden;
      position: relative;
      font-size: 0;
      .ruleScr {
        position: fixed;
        top: 60px;
        background-color: white;
        z-index: 500;
        width: 63%;
      }
      .ruleCatalog {
        width: 292px;
        float: left;
        display: inline-block;
        border: 1px solid #e3e3e3;
        box-sizing: border-box;
        padding-bottom: 1px;
        .el-collapse {
          border: 0;
          .el-collapse-item {
            .el-collapse-item__wrap {
              border-bottom: 0;
              font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif;
              max-height: 400px;
              overflow-y: auto;
              .el-collapse-item__content {
                // min-height: 320px;
                overflow: hidden;
                -webkit-overflow-scrolling: touch;
                padding: 0 18px;
                margin: 25px 0;
                color: #8d8d8d;
                font-size: 16px;
                line-height: 1.3;
                height: 100% !important;
                .warp-row {
                  color: #8d8d8d;
                  .warp-row-list {
                    display: table;
                    width: 100%;
                    margin-bottom: 15px;
                    div {
                      width: 57%;
                    }
                    h2, h3 {
                      font-weight: normal;
                      padding: 0;
                      margin: 0;
                      color: #8d8d8d;
                      line-height: 1.3;
                      cursor: pointer;
                      strong, * {
                        font-weight: normal !important;
                        font-size: 15px;
                        span {
                          font-size: inherit;
                        }
                      }
                    }
                    h2 {
                      font-size: 16px;
                    }
                    h3 {
                      font-size: 15px;
                      text-indent: 2em;
                    }
                    label, h2 {
                      display: table-cell;
                      width: 31%;
                      // white-space: nowrap;
                      text-align: justify;
                      a {
                        color: #8d8d8d;
                      }
                      a:hover {
                        text-decoration: underline;
                        color: #FFAC38;
                      }
                    }
                    .listType {
                      width: 10px;
                      i {
                        font-size: 0;
                        display: inline-block;
                        height: 4px;
                        width: 4px;
                        border-radius: 50%;
                        background-color: #8d8d8d;
                        vertical-align: middle;
                      }
                    }
                    div {
                      display: table-cell;
                      text-align: justify;
                    }
                    .listDoc:hover {
                      text-decoration: underline;
                      color: #FFAC38;
                      a {
                        color: #FFAC38;
                      }
                    }
                  }
                  .warp-row-list:last-child {
                    margin-bottom: 0;
                  }
                  .mulu {
                    label {
                      width: 80px;
                    }
                    div {
                      width: 240px;
                    }
                  }
                }
                &:hover {
                  overflow-y: auto;
                }
              }
            }
            .el-collapse-item__header {
              position: relative;
              font-size: 16px;
              color: #323232;
              font-weight: normal;
              border: 0;
              box-sizing: border-box;
              padding: 0 18px;
              height: 45px;
              line-height: 45px;
              background-color: white;
              -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              &:hover {
                background-color: #f7f7f7;
              }
              .el-collapse-item__arrow {
                font-size: 0;
                padding: 0;
                margin: 0;
                display: none;
              }
              .header-row {
                font-size: 16px;
                color: #323232;
                height: 100%;
                box-sizing: border-box;
                border-top: 1px solid #e3e3e3;
                position: relative;
                width: 100%;
                img, i {
                  display: inline-block;
                  /*width: 24px;*/
                  height: 20px;
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                }
                i {
                  line-height: 20px;
                  font-size: 20px;
                  color: #ffb148;
                }
                span {
                  margin-left: 30px;
                  display: inline-block;
                  width: 200px;
                }
                .header-arrow {
                  color: #8d8d8d;
                }
              }
            }
          }
          .is-active {
            .el-collapse-item__header {
              font-size: 16px;
              color: #323232;
              border: 0;
              box-sizing: border-box;
              padding: 0 18px;
              background-color: #f7f7f7;
              /*-webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);*/
              /*transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);*/
              .header-row {
                // border-top-color: rgba(255, 177, 72, 0);
                /*color: #FFB148;*/
                color: #323232;
                width: 100%;
                border-bottom: 1px solid #e3e3e3;
              }
            }
          }
          .el-collapse-item:last-child.is-active {
            .el-collapse-item__wrap {
              border-top-color: #fff;
            }
          }
          .el-collapse-item:first-child {
            .el-collapse-item__header {
              .header-row {
                border-top: 0;
                width: 100%;
              }
            }
          }
        }
      }
      .ruleText {
        display: inline-block;
        width: 896px;
        height: 100%;
        border-radius: 4px;
        min-height: 800px;
        float: right;
        position: relative;
        background-color: #ffffff;
        .timeliness {
          width: 90px;
          height: 60px;
          position: absolute;
          right: 10px;
          top: 30px;
          img {
            width: 100%;
            display: block;
          }
        }
        .rules-title {
          width: 100%;
          color: #323232;
          font-size: 20px;
          line-height: 32px;
          padding: 16px 16px 12px 16px;
          background-color: white;
          border-bottom: 1px solid #e3e3e3;
          font-weight: bold;
          .icon-box {
            font-size: 14px;
            color: #ffb148;
            font-weight: 400;
            span {
              margin-right: 5px;
              cursor: pointer;
            }
          }
        }
        .ruleScr {
          position: fixed;
          top: 60px;
          background-color: white;
          z-index: 500;
          /*padding: 25px 0;*/
          width: 896px;
        }
        .fullScreenState {
          width: 100%;
          position: fixed;
          background-color: white;
          z-index: 500;
          top: 0 !important;
        }
        .rules-ref {
          border-top: 1px solid #e3e3e3;
          margin-top: 10px;
          margin-bottom: 20px;
          h3 {
            font-size: 16px;
            margin: 0 0 16px 0;
            font-weight: 500;
          }
          p {
            font-size: 16px;
            line-height: 24px;
            box-sizing: border-box;
            padding: 5px 0;
          }
          p:hover {
            text-decoration: underline;
            color: #FFAC38;
            a {
              color: #FFAC38;
            }
          }
        }
        .addnode {
          .noteContent {
            margin-top: 10px;
            border-color: #e3e3e3;
          }
          .select-note-type {
            width: 100px;
            margin-right: 10px;
          }
          .btnBox {
            text-align: right;
            margin-top: 10px;
          }
          .flexBox {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #8d8d8d;
            .icon-img {
              margin-right: 8px;
              cursor: pointer;
            }
            .web-dianzan1 {
              cursor: pointer;
              margin-right: 8px;
              font-size: 20px;
              position: relative;
              top: -1px;
              color: #a4a4a4;
            }
            .count-span {
              margin-right: 30px;
            }
            .likecolor {
              color: #ffb148;
            }
          }
        }
      }
      .isScreen {
        width: 100%;
        animation: showChange 500ms forwards;
        -moz-animation: showChange 500ms forwards;
        -webkit-animation: showChange 500ms forwards;
        -o-animation: showChange 500ms forwards;
        .rules-title {
          text-align: left;
        }
        .ruleScr {
          text-align: left;
          /*left: 0;padding-left: 60px;*/
          // max-width: 1200px;
          width: 100%;
          box-sizing: border-box;
          /*padding-right: 80px;*/
        }
      }

      .beizhuBox {
        display: inline-block;
        position: absolute;
        height: 30px;
        line-height: 30px;
        font-size: 12px !important;
        text-indent: 0;
        text-align: center;
        top: -35px;
        width: 150px;
        background-color: rgba(0, 0, 0, .5);
        color: #fff;
        border-radius: 5px;
        * {
          font-size: 14px !important;
        }
      }
    }
    //
    .ruleContent {
      #rules-contents {
        position: relative;
        width: 100%;
        height: auto;
        /*margin-top: 30px;*/
        padding: 16px;
        /*margin-bottom: 10px;*/
        text-align: justify;
        word-spacing: 0;
        color: #323232;
        font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif !important;
        * {
          font-size: 16px;
          font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif !important;
        }
        .word {
          line-height: 1;
          cursor: text;
          /*font-weight: normal;*/
          /*background-color: #aeaeae;*/
        }
        .select {
          background: #FAEFDE;
          /*color: white;*/
        }
        .myselect {
          background-color: #FAEFDE;
          cursor: pointer;
        }
        .word::selection {
          line-height: 1;
          background: #FAEFDE;
          /*color: white;*/
          font-weight: normal;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 5px 0;
          line-height: 20px;
          font-weight: normal;
        }
        p {
          margin: 0 0 16px 0;
          text-align: justify;
          box-sizing: border-box;
          text-indent: 2em;
          /*word-break: break-all;*/
          word-break: normal;
          line-height: 1.7;
          text-justify: distribute;
          -webkit-hyphens: auto;
          -ms-hyphens: auto;
          hyphens: auto;
          white-space: pre-line;
        }
        p::selection {
          background-color: #FAEFDE
        }
        h1, h1 * {
          font-weight: 600;
          padding: 0;
          margin: 0;
          line-height: 25px;
          text-align: center;
        }
        h1 {
          padding: 40px 0 30px 0;
        }
        h1 + p {
          margin: 0;
        }
        div {
          color: #323232;
        }
        h2, h2 * {
          margin: 0 0 16px 0;
          font-weight: bolder;
          text-indent: 2em;
        }
        h3, h3 * {
          box-sizing: border-box;
          margin: 0 0 20px 0;
          color: #323232;
          font-weight: 700;
          text-indent: 2em;
        }
        h4, h4 * {
          border-radius: 2px !important;
          margin: 5px 0 !important;
          text-indent: 2em !important;
          text-decoration: line-through !important;
          font-weight: 500;
        }
        h5, h5 * {
          margin: 0;
          text-align: right !important;
          color: #323232;
          font-weight: normal;
        }
        h6, h6 * {
          font-size: 14px !important;
          font-style: oblique !important;
          margin: 15px 0;
        }
        a {
          text-decoration: none;
          word-wrap: break-word;
        }
        a:hover, a:visited, a:link, a:active {
          color: #3D3DF2;
          text-decoration: none !important;
        }
        p cite, p cite * {
          color: #3D3DF2;
          font-style: italic !important;
        }
        table, pre, h1, p > img {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        }
        table {
          padding: 0 !important;
          width: 100% !important;
          border-spacing: 0;
          border: 0;
          border-collapse: collapse;
        }
        table td {
          width: 0 !important;
          text-shadow: none !important;
          word-break: break-all !important;
          word-wrap: break-word !important;
          margin: 0 !important;
          vertical-align: middle;
          /*border-width: 1px 1px 1px 1px;*/
          /*border-style: solid;*/
          /*border-color: #323232;*/
          border-collapse: collapse;
          padding: 0 10px;
          /*3423*/
        }
        table td p {
          text-indent: 0;
          margin: 5px 0;
        }
        .MsoHeading7 {
          text-align: center !important;
          padding-bottom: 0;
          text-indent: 0;
        }
        > table > tbody > tr > td {
          border-color: #aeaeae !important;
        }
        img {
          width: 90%;
          /* padding: 0 1px;*/
        }
        i {
          font-style: normal;
        }
        /**************表格横向滚动*************/
        .wrapScoller, .wrapScoller * {
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        .wrapScoller {
          /* border: 1px solid #323232;*/
          padding-top: 5px;
          padding-bottom: 2px;
        }
        .wrap {
          overflow-x: auto;
        }
      }
    }
    /*划线*/
    .btns-tip {
      position: absolute;
      background: #ffb148;
      margin: 0;
      padding: 0;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.20);
      border-radius: 2px;
      display: none;
    }
    .btns-tip .action-list {
      padding: 4px 0;
      color: #fff;
    }
    .bubble-content {
      /*margin-top: -17px;*/
      padding: 0;
    }
    .btns-tip .action-list li:hover {
      /*background-color: #3a3a38;*/
      color: lighten(#FFB148, 50%);
      cursor: pointer;
    }
    .btns-tip .action-list li {
      display: inline-block;
      /*border-right: 1px solid #5b5b58;*/
    }
    .btns-tip .action-list li {
      background: #ffb148;
      border: none;
      color: #fff;
      padding: 0 10px;
      line-height: 26px;
      margin: 0 6px;
    }
    .spanL {
      line-height: 2;
    }
    /*笔记css*/
    .tooltip {
      z-index: 101;
    }
    textarea {
      font-size: 14px;
      font-family: inherit;
      display: inline-block;
      *display: inline;
      *zoom: 1;
      padding: 4px;
      height: 20px;
      line-height: 19px;
      border: 1px solid #e3e3e3;
      overflow: auto;
      vertical-align: top;
      margin: 0;
      resize: none;
    }
  }
</style>
