<template>
  <div id="caseDetail" class="caseDetail">
    <div class="ruleContent" :class="{docCss: docFlag, screenWidth: isScreen}">
      <div class="ruleCatalog" v-show="!isScreen" :class="{ruleScr: ruleScroll}">
        <el-collapse accordion v-model="activeName" @change="collapse">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-jibenxinxi"></i>
                <span>{{ruleCont[0].title}}</span>
              </div>
            </template>
            <div class="warp-row">
              <div class="warp-row-list" v-for="(list,index) in BasicInformation"
                   v-if="list.doc !== '--' && list.doc !== '' && list.doc !== '无' && list.doc !== '-'">
                <label for="" v-html="list.title"></label>
                <div>{{list.doc}}</div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2" v-if="this.illegalInfo.length !== 0">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-weiguixinxi" style="font-size: 23px"></i>
                <span>{{ruleCont[1].title}}</span></div>
            </template>
            <div class="warp-row" v-if="this.illegalInfo.length !== 0">
              <div class="warp-row-list" v-for="(list,index) in illegalInfo">
                <label for="" v-html="list.title"></label>
                <div>{{list.doc}}</div>
              </div>
            </div>
            <div class="warp-row" v-else>暂无信息！</div>
          </el-collapse-item>
          <!--<el-collapse-item name="3">
            <template slot="title">
              <div class="header-row">
                <img src="../../assets/image/leftBar/jinchengIcon.png" alt="">
                <span>{{ruleCont[2].title}}</span>
              </div>
            </template>
            <div class="warp-row">
              <v-timeTravel></v-timeTravel>
            </div>
          </el-collapse-item>-->
          <el-collapse-item name="4" v-if="this.relationCase.length !== 0">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-anli" style="font-size: 23px;"></i>
                <span>{{ruleCont[3].title}}</span>
              </div>
            </template>
            <div class="warp-row" v-if="this.relationCase.length !== 0">
              <div class="warp-row-list" v-for="(list, index) in relationCase"
                   @click="relationClick(index, 'caseDetail')">
                <label class="listType"><i></i></label>
                <div class="listDoc"><a href="javascript:void(0)">{{list.title}}</a></div>
              </div>
            </div>
            <div class="warp-row" v-else>暂无相关！</div>
          </el-collapse-item>
          <el-collapse-item name="5" v-if="this.relationLaw.length !== 0">
            <template slot="title">
              <div class="header-row">
                <i class="iconfont web-xiangguanguize" style="font-size: 23px"></i>
                <span>{{ruleCont[4].title}}</span>
              </div>
            </template>
            <div class="warp-row" v-if="this.relationLaw.length !== 0">
              <div class="warp-row-list" v-for="(list, index) in relationLaw"
                   @click="relationClick(index, 'ruleDetail')">
                <label class="listType"><i></i></label>
                <div class="listDoc"><a href="javascript:void(0)">{{list.relationLawName}}</a></div>
              </div>
            </div>
            <div class="warp-row" v-else>暂无相关！</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!--startprint-->
      <!-- doc -->
      <div class="ruleText print" v-if="this.contentSort == 'doc'" :class="{isScreen: isScreen}"> <!-- id="pdf-wrap" -->
        <header class="rules-title" :class="{ruleScr: ruleScroll}">
          <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
              <span @click="collectDialogInfo=true">
                <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                  <i class="iconfont web-shoucang"></i> 
                </el-tooltip>
              </span>
          </div>
          {{contentDetail.docTitle}}
        </header>
        <div class="rules-contents" style="overflow: hidden">
          <iframe style="width: 100%;height: 1260px;margin-top: -90px;" :src="docUrl" v-if="docUrl"
                  frameborder="0"></iframe>
        </div>
        <footer class="rules-ref" v-show="attachment.length != 0">
          <h3>{{textDetail[0]}}</h3>
          <p class="" v-for="(list, index) in attachment" :key="index"><a :href="list.filePath"
                                                                          target="_Blank">{{list.fileName}}</a>
          </p>
        </footer>
      </div>
      <!-- html -->
      <div v-else-if="this.contentSort == 'html'" class="ruleText print" id="pdf-wrap" :class="{isScreen: isScreen}">
        <header class="rules-title" :class="{ruleScr: ruleScroll}">
          <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
              <span @click="collectDialogInfo=true">
                <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                  <i class="iconfont web-shoucang"></i> 
                </el-tooltip>
              </span>
          </div>
          {{contentDetail.docTitle}}
        </header>
        <div id="rules-contents" style="border:0;" v-html="this.$common.ClearBr(contentDetail.docContent)"></div>
        <footer class="rules-ref" v-show="attachment.length != 0">
          <h3>{{textDetail[0]}}</h3>
          <p class="" v-for="(list,index) in attachment" :key="index"><a :href="list.filePath"
                                                                         target="_Blank">{{list.fileName}}</a>
          </p>
        </footer>
      </div>
      <!-- pdf -->
      <div class="main" :class="{quanpin: isScreen}" v-else-if="this.contentSort == 'pdf'">
        <header v-if="contentDetail.docTitle" class="rules-title" style="border-bottom: none" :class="{ruleScr: ruleScroll, affScreen: $store.state.scaleShowState, fullScreenState: !$store.state.scaleShowState}">
          <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
              <span @click="collectDialogInfo=true">
                <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                  <i class="iconfont web-shoucang"></i> 
                </el-tooltip>
              </span>
          </div>
          {{contentDetail.docTitle}}
        </header>
        <div class="pdfReport ruleCatalog" id="pdfReport">
          <v-iframe :src="pdfUrl" v-if="pdfUrl"></v-iframe>
        </div>
      </div>
      <div class="main noInfo"
           v-else-if="this.contentSort == '' && (contentDetail.docContent == '' || contentDetail.docContent == null)">
        <!--<img :src="$image.prompt.noInfo" alt="">
        <p>暂无内容，去看看相关案例~</p>-->
        <v-noInfo altText="暂无内容，去看看相关案例~" :imgSrc="noInfoImg"></v-noInfo>
      </div>
      <!-- docContent -->
      <div class="main noInfo" id="pdf-wrap" :class="{quanpin: this.isScreen}"
           v-else-if="this.contentSort == '' && (contentDetail.docContent !== '' || contentDetail.docContent !== null)"
           style="margin-top: 0;height: auto;">
        <header class="rules-title" :class="{ruleScr: ruleScroll, docCC: docFlag}">
          <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
              <span @click="collectDialogInfo=true">
                <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                  <i class="iconfont web-shoucang"></i> 
                </el-tooltip>
              </span>
          </div>
          {{contentDetail.docTitle}}
        </header>
        <div id="rules-contentsDoc" style="border:0;" v-html="contentDetail.docContent"></div>
        <footer class="rules-ref" v-show="attachment.length != 0">
          <h3>{{textDetail[0]}}</h3>
          <p class="" v-for="(list,index) in attachment" :key="index">
            <a :href="list.filePath" target="_Blank">{{list.fileName}}</a>
          </p>
        </footer>
        <div class="main detailed" :class="{detailedScreen: isScreen}" v-show="this.tableData.length !== 0">
          <el-table
            :data="tableData"
            border
            style="width: 100%;">
            <el-table-column
              prop="num"
              label="序号"
              width="60"
              align="center"
              v-if="this.tableData.length > 1">
            </el-table-column>
            <el-table-column
              prop="obj"
              label="涉及当事人"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              prop="main"
              label="涉及对象"
              align="center">
            </el-table-column>
            <el-table-column
              prop="supervise"
              label="监管类型"
              align="center">
            </el-table-column>
            <el-table-column
              prop="illegal"
              label="违规类型"
              align="center">
            </el-table-column>
            <!--<el-table-column
              prop="confiscated"
              label="没收金额"
              align="center">
            </el-table-column>
            <el-table-column
              prop="penalty"
              label="处罚金额"
              align="center">
            </el-table-column>
            <el-table-column
              prop="year"
              label="禁入年限"
              align="center">
            </el-table-column>-->
          </el-table>
        </div>
      </div>
      <!--endprint-->
      <div class="main detailed" v-if="this.contentSort !== ''" :class="{detailedScreen: isScreen}"
           v-show="this.tableData.length !== 0">
        <el-table
          :data="tableData"
          border
          style="width: 100%;">
          <el-table-column
            prop="num"
            label="序号"
            width="60"
            align="center"
            v-if="this.tableData.length > 1">
          </el-table-column>
          <el-table-column
            prop="obj"
            label="涉及当事人"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="main"
            label="涉及对象"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supervise"
            label="监管类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="illegal"
            label="违规类型"
            align="center">
          </el-table-column>
          <!--<el-table-column
            prop="confiscated"
            label="没收金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="penalty"
            label="处罚金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="year"
            label="禁入年限"
            align="center">
          </el-table-column>-->
        </el-table>
      </div>
    </div>
    <!-- 侧边栏 -->
    <!--<v-sidebar v-show="isLogin" :collectInfo="caseInfo | delContent" @scaleMethod="scaleScreen"-->
               <!--@printfMethod="printfM" :scaleShow="isScreen" :dayinShow="printfShow"></v-sidebar>-->
    <v-contentLoading :stopLoading="isLoading"></v-contentLoading>
    <v-error :isAjaxError="isError" :sort="errorSort"></v-error>
    <collect-dialog :collectDialogInfo="collectDialogInfo" :info="caseInfo | delContent"
                    @changeCollectDialog="changeCollectDialog" v-if="caseInfo.id"></collect-dialog>
  </div>
</template>

<script>
  import sidebar from '../../components/sidebar.vue'
  import timeTravel from '../../components/timeTravel.vue'
  import contentLoading from '../../components/contentLoading.vue'
  import error from '../../components/error.vue'
  import iframe from '@/components/iframe.vue'
  import collectDialog from '@/view/aside/components/components/collectDialog.vue'

  export default {
    name: 'caseDetail',
    data() {
      return {
        collectDialogInfo: false,
        textDetail: ['相关附件', '暂无'],
        ruleloading: true,
        activeName: '1',
        iImg: this.$image.prompt.clue,
        ruleCont: [
          {
            id: '0', name: '', title: '基本信息', list: {},
            icon: 'agtImg'
          }, {
            id: '1', name: '', title: '违规信息', list: {},
            icon: 'agtImg'
          }, {
            id: '2', name: '', title: '案例进程', list: {},
            icon: 'agtImg'
          }, {
            id: '3', name: '', title: '相关案例', list: {},
            icon: 'agtImg'
          }, {
            id: '4', name: '', title: '相关法规', list: {},
            icon: 'agtImg'
          }
        ],
        tableData: [
          {
            num: '0',
            obj: '纳思达股份有限公司',
            main: '上市公司',
            supervise: '书面警示',
            illegal: '业绩预告、业绩快报、未按规定履行信息披露义务',
            confiscated: '12',
            penalty: '12',
            year: '12'
          }
        ],
        contentDetail: {},
        contentSort: '',
        BasicInformation: [
          {title: '证券代码：', doc: ''},
          {title: '证券简称：', doc: ''},
          {title: '所属板块：', doc: ''},
          {title: '所属地区：', doc: ''},
          {title: '所属行业：', doc: ''},
          {title: '监管机构：', doc: ''},
          {title: '文&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：', doc: ''},
          {title: '处理日期：', doc: ''}
        ],
        Directory: [], // 筛选 目录
        relationLaw: [], // 相关规则
        relationCase: [], // 相关案例
        illegalInfo: [
          {title: '监管机构：', doc: ''},
          {title: '监管类型：', doc: ''},
          {title: '违规类型：', doc: ''},
          {title: '处分日期：', doc: ''}
        ], // 违规信息
        scrolled: '',
        ruleScroll: false,
        attachment: [], // 附件
        isScreen: false,
        isLoading: true,
        isError: false,
        errorSort: '',
        pdfUrl: '',
        pdfIframe: '',
        docUrl: '',
        caseInfo: {},
        docFlag: false,
        noInfoImg: this.$image.prompt.noInfo,
        printfShow: false,
        screenWidth: document.body.clientWidth,
        userId: ''
      }
    },
    filters: {
      delContent: function (obj) {
        if (obj == {}) return obj
        var newObj = {
          id: obj.id,
          title: obj.docTitle,
          time: obj.createTime,
          type: 'caselaw'
        }
        return newObj
      }
    },
    // 使用其它组件
    components: {
      'v-sidebar': sidebar,
      'v-timeTravel': timeTravel,
      'v-contentLoading': contentLoading,
      'v-iframe': iframe,
      'v-error': error,
      collectDialog
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
        if (val) {
          this.scrolled = document.documentElement.scrollTop || document.body.scrollTop
          let headerHeight = document.getElementById('header').clientHeight
          console.log(headerHeight, 111111);
          if (this.scrolled >= headerHeight) {
            this.ruleScroll = true;
          } else {
            this.ruleScroll = false;
          }
        } else {
          this.ruleScroll = false;
        }
        this.isScreen = val;
        this.scaleScreen();
      },
      screenWidth: function (val) {
        this.screenWidth = val
        if (val < 1280) {
          this.isScreen = true
        } else {
          this.isScreen = false
        }
      },
      docFlag: function (val) {
        console.log('docFlag = ', val)
        if (val) {
          var bh = document.body.clientHeight
          var headerow = document.getElementsByClassName('header-row')[0].clientHeight
          this.$nextTick(() => {
            var docCss = document.getElementsByClassName('docCss')[0]
            docCss.style.minHeight = (bh - headerow) + 'px'
          })
        }
      },
      'ruleScroll': function (val) {
        console.log(' ruleScroll = ', val)
        var bh = document.body.clientHeight
        var headerow = document.getElementsByClassName('header-row')[0].clientHeight
        var num = parseInt(document.getElementsByClassName('header-row').length)
        var content = document.getElementsByClassName('el-collapse-item__content')
        /* if (val) {
          for (var i = 0; i < content.length; i++) {
            content[i].style.height = (bh - headerow * num - headerow) + 'px'
            // content[i].style.height = (bh * 0.35) + 'px'
          }
          // document.getElementsByClassName('docCC')[0].style.paddingLeft = '293px!important'
        } else {
          for (var j = 0; j < content.length; j++) {
            content[j].style.height = (bh - headerow * num - headerow - 120) + 'px'
            // content[j].style.height = (bh * 0.35) + 'px'
          }
          // document.getElementsByClassName('docCC')[0].style.paddingLeft = '0'
        } */
      }
    },
    methods: {
      changeCollectDialog() {
        this.collectDialogInfo = false
      },
      handleScroll() {
        this.scrolled = document.documentElement.scrollTop || document.body.scrollTop
        let dom = document.querySelector('#caseDetail').offsetTop
        let headerHeight = document.getElementById('header').clientHeight
        if (this.scrolled >= headerHeight) {
          this.ruleScroll = true
        } else {
          this.ruleScroll = false
        }
        var f = footer.getBoundingClientRect().top
        var c = document.documentElement.clientHeight
        var x = c - f
        if (x >= 0) {
          document.getElementsByClassName('ruleCatalog')[0].style.marginTop = -x + 90 + 'px'
        } else {
          document.getElementsByClassName('ruleCatalog')[0].style.marginTop = '0px'
        }
      },
      // 打印
      printfM() {
        /* var bdhtml = document.getElementById('mainContent').innerHTML
        // var bdhtml = document.getElementsByClassName('main')[0].innerHTML
        var sprnstr = '<!--startprint-->'
        var eprnstr = '<!--endprint-->'
        var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17)
        prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr))
        window.document.body.innerHTML = prnhtml
        window.print() */
        // window.print && window.print()
        let codestr = document.getElementById('mainContent').innerHTML
        console.log('codestr', codestr)
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
      collapse(data) {
        // console.log('====>', data)
        var content = document.getElementsByClassName('el-collapse-item__content')[data - 1]
        if (this.scrolled >= 120) {
          var bh = document.body.clientHeight
          var headerow = document.getElementsByClassName('header-row')[data - 1].clientHeight
          var num = parseInt(document.getElementsByClassName('header-row').length)
          content.style.maxHeight = (bh - headerow * (num + 1) - headerow - 20) + 'px'
          // console.log('headerow = ', (bh - headerow * num - headerow - 20))
        }
      },
      relationClick(index, sort) {
        if (sort == 'ruleDetail') {
          this.$common.openWindow('/rule/details?id=' + this.relationLaw[index].relationLawId)
          this.activeName = '1'
        } else {
          this.$common.openWindow('/case/details?id=' + this.relationCase[index].id)
          this.activeName = '3'
        }
      },
      /**/
      getDirectory(index) {
        window.scrollTo(0, this.Directory[index].offsetTop)
      },
      getDetails(id) {
        this.$http({
          method: 'GET',
          url: this.$api.cases.getdetailsC,
          params: {
            id: id,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 1) {
            this.contentDetail = res.data.returnObject
            document.title = this.contentDetail.docTitle ? this.contentDetail.docTitle : '案例详情'
            var mingxi = res.data.returnObject.processDetails
            this.tableData = []
            if (mingxi) {
              for (var i = 0; i < mingxi.length; i++) {
                var obj = {
                  num: i + 1,
                  obj: mingxi[i].involveObjectName == '' ? '--' : mingxi[i].involveObjectName,
                  main: mingxi[i].objectPositionName == '' ? '--' : mingxi[i].objectPositionName,
                  supervise: mingxi[i].supervisionTypeName == '' ? '--' : mingxi[i].supervisionTypeName,
                  illegal: mingxi[i].violationTypeName == '' ? '--' : mingxi[i].violationTypeName,
                  confiscated: mingxi[i].confiscatedAmount == '' ? '--' : mingxi[i].confiscatedAmount,
                  penalty: mingxi[i].penaltyAmount == '' ? '--' : mingxi[i].penaltyAmount,
                  year: mingxi[i].prohibitedYears == '' ? '--' : mingxi[i].prohibitedYears
                }
                this.tableData.push(obj)
              }
            }
            this.caseInfo = res.data.returnObject
            this.$common.getSidebarInfo(this.caseInfo, 'id', 'docTitle', 'createTime', '', 'caselaw')
            this.relationLaw = res.data.returnObject.relationLawList ? res.data.returnObject.relationLawList : []
            this.relationCase = res.data.returnObject.relationCaseLawList ? res.data.returnObject.relationCaseLawList : []
            // this.contentDetail.docContent = this.contentDetail.docContent.replace(/\n/g, '<br/>')
            // console.log('docurl == ', this.contentDetail.docUrl)
            if (this.docUrl == '') {
              this.docFlag = true
            } else {
              this.docFlag = false
            }
            // 打印文本
            if (this.contentDetail.docUrl == '') {
              if (this.contentDetail.docContent !== '' || this.contentDetail.docContent !== null) {
                this.printfShow = true
                // console.log('123123123213')
              }
            }
            if (this.contentDetail.docUrl) {
              var content = this.contentDetail.docUrl.toLocaleLowerCase()
              if (content.indexOf('pdf') > 0) {
                this.contentSort = 'pdf'
                console.log(this.contentSort);
                console.log(7777777);
                var httpText = document.location.protocol == 'https:' ? 'https:' : 'https:'
                var urllink = httpText + '//' + this.contentDetail.docUrl.split('://')[1]
                // console.log('case pdf = ', urllink)
                this.pdfUrl = this.$api.host + 'static/pdf/web/viewer.html?file=' + urllink
                // console.log(this.contentSort, content.indexOf('pdf'))
              } else if (content.indexOf('doc') > 0) {
                this.contentSort = 'doc'
                // console.log('ispc:' + this.$common.ispc())
                if (this.$common.ispc()) {
                  // 白色简约风格
                  this.docUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.contentDetail.docUrl
                  // 黑色风格
//                 this.docUrl = 'https://hk1-word-view.officeapps.live.com/wv/wordviewerframe.aspx?ui=zh-CN&rs=zh-CN&WOPISrc=http%3A%2F%2Fhk1-view-wopi%2Ewopi%2Elive%2Enet%3A808%2Foh%2Fwopi%2Ffiles%2F%40%2FwFileId%3FwFileId%3D' + this.contentDetail.docUrl + '&access_token_ttl=0&wdAccPdf=1'
                } else {
                  // 移动端样式
                  this.docUrl = 'https://hk1-word-view.officeapps.live.com/wv/mWord.aspx?ui=zh-CN&rs=zh-CN&WOPISrc=http%3A%2F%2Fhk1-view-wopi%2Ewopi%2Elive%2Enet%3A808%2Foh%2Fwopi%2Ffiles%2F%40%2FwFileId%3FwFileId%3D' + this.contentDetail.docUrl + '&access_token_ttl=0&wdAccPdf=1&wdMobileHost=2'
                  // this.contentSort = 'html'
                  // console.log(this.contentSort, content.indexOf('html'))
                }
                // console.log(this.contentSort, content.indexOf('pdf'))
              } else if (content.indexOf('html') > 0 || content.indexOf('shtml') > 0) {
                this.contentSort = 'html'
                // console.log(this.contentSort, content.indexOf('html'))
              }
            }
            /* 证券代码 */
            if (this.contentDetail.companyCode != null && this.contentDetail.companyCode != '无') {
              this.BasicInformation[0].doc = this.contentDetail.companyCode
            } else {
              this.BasicInformation[0].doc = '--'
            }
            /* 证券简称 */
            if (this.contentDetail.companyName != null && this.contentDetail.companyName != '无') {
              this.BasicInformation[1].doc = this.contentDetail.companyName
            } else {
              this.BasicInformation[1].doc = '--'
            }
            /* 板块 */
            if (this.contentDetail.companyMarketName != null && this.contentDetail.companyMarketName != '无') {
              this.BasicInformation[2].doc = this.contentDetail.companyMarketName
            } else {
              this.BasicInformation[2].doc = '--'
            }
            /* 地区 */
            if (this.contentDetail.companyArea != null && this.contentDetail.companyArea != '无') {
              this.BasicInformation[3].doc = this.contentDetail.companyArea
            } else {
              this.BasicInformation[3].doc = '--'
            }
            /* 行业 */
            if (this.contentDetail.companyIndustry != null && this.contentDetail.companyIndustry != '无') {
              this.BasicInformation[4].doc = this.contentDetail.companyIndustry
            } else {
              this.BasicInformation[4].doc = '--'
            }
            /* 机构 */
            if (this.contentDetail.supervisionOrganName != null && this.contentDetail.supervisionOrganName != '无') {
              this.BasicInformation[5].doc = this.contentDetail.supervisionOrganName
            } else {
              this.BasicInformation[5].doc = '--'
            }
            /* 发文号 */
            if (this.contentDetail.lssuedNumber != null && this.contentDetail.lssuedNumber != '无') {
              this.BasicInformation[6].doc = this.contentDetail.lssuedNumber
            } else {
              this.BasicInformation[6].doc = '--'
            }
            /* 处理日期 */
            if (this.contentDetail.processDate != null && this.contentDetail.processDate != '无') {
              this.BasicInformation[7].doc = this.$common.transTime(this.contentDetail.processDate)[0]
            } else {
              this.BasicInformation[7].doc = '--'
            }
            /* 监管机构 */
            if (this.contentDetail.supervisionOrganName != null && this.contentDetail.supervisionOrganName != '无') {
              this.illegalInfo[0].doc = this.contentDetail.supervisionOrganName
            } else {
              this.illegalInfo[0].doc = '--'
            }
            /* 监管类型 */
            if (this.contentDetail.supervisionTypeName != null && this.contentDetail.supervisionTypeName != '无') {
              this.illegalInfo[1].doc = this.contentDetail.supervisionTypeName
            } else {
              this.illegalInfo[1].doc = '--'
            }
            /* 处分日期 */
            if (this.contentDetail.processDate != null && this.contentDetail.processDate != '无') {
              this.illegalInfo[3].doc = this.$common.transTime(this.contentDetail.processDate)[0]
            } else {
              this.illegalInfo[3].doc = '--'
            }
            /* 违规类型 */
            if (this.contentDetail.violationTypeName != null && this.contentDetail.violationTypeName != '无') {
              this.illegalInfo[2].doc = this.contentDetail.violationTypeName
            } else {
              this.illegalInfo[2].doc = '--'
            }
            this.attachment = this.contentDetail.attachments == null ? [] : this.contentDetail.attachments
            window.scrollTo(0, 0)
            setTimeout(() => {
              this.$nextTick(() => {
                let h2 = document.querySelectorAll('#rules-contents h2')
                let h3 = document.querySelectorAll('#rules-contents h3')

                for (let i = 0; i < h2.length; i++) {
                  this.Directory.push({title: h2[i].innerText, offsetTop: h2[i].offsetTop})
                }
//                console.log('123', h2, h3)
//                console.log('123', this.Directory)
              })
            }, 550)
            this.isLoading = false
          } else {
            this.isLoading = false
            this.isError = true
            this.errorSort = 'noInfo'
          }
          this.$nextTick(() => {
            var bh = document.body.clientHeight
            var headerow = document.getElementsByClassName('header-row')[0].clientHeight
            var num = parseInt(document.getElementsByClassName('header-row').length)
            var content = document.getElementsByClassName('el-collapse-item__content')
            // for (var j = 0; j < content.length; j++) {
            //   content[j].style.height = (bh - headerow * num - headerow - 100) + 'px'
            // }
          })
        }).catch((err) => {
          this.isError = true
          this.isLoading = false
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.$store.commit('scaleShowState', true)
      this.$auth.logout_redirect()
      if (document.body.clientWidth < 1280) {
        this.isScreen = true
      } else {
        this.isScreen = false
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
      this.getDetails(this.$route.query.id)
      this.$nextTick(() => {
        var bh = document.body.clientHeight
        var headerow = document.getElementsByClassName('header-row')[0].clientHeight
        var num = parseInt(document.getElementsByClassName('header-row').length)
        var content = document.getElementsByClassName('el-collapse-item__content')
        // for (var j = 0; j < content.length; j++) {
        //   content[j].style.height = (bh - headerow * num - headerow - 100) + 'px'
        // }
      })
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
    },
    destroyed: function () {
      window.removeEventListener('scroll', this.handleScroll)
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
  #caseDetail {
    width: 100%;
    height: auto;
    position: relative;
    overflow: hidden;
    #error {
      line-height: 0;padding-top: 300px;
      p {
        margin-top: 20px;
      }
    }
    .ruleContent {
      width: 1200px;
      height: auto;
      min-height: 1200px;
      // margin: 0 auto;
      margin: 55px auto 0;
      overflow: hidden;
      font-size: 0;
      .icon-box {
        font-size: 14px;
        color: #ffb148;
        font-weight: 400;
        span {
          margin-right: 15px;
          cursor: pointer;
        }
      }
      .ruleScr {
        position: fixed;
        top: 60px;
        background-color: white;
        z-index: 100;
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
              .el-collapse-item__content {
                // max-height: 300px;
                overflow: hidden;
                -webkit-overflow-scrolling: touch;
                padding: 0 18px;
                margin: 25px 0;
                color: #8d8d8d;
                font-size: 16px;
                line-height: 1.3;
                .warp-row {
                  color: #8d8d8d;
                  .warp-row-list {
                    display: table;
                    width: 100%;
                    margin-bottom: 15px;
                    div {
                      width: 68px;
                    }
                    label {
                      display: table-cell;
                      width: 28%;
                      white-space: nowrap;
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
                      width: 4px;
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
                }
                &:hover {
                  overflow-y: auto;
                }
              }
            }
            .el-collapse-item__header {
              font-size: 17px;
              color: #323232;
              font-weight: normal;
              border: 0;
              box-sizing: border-box;
              padding: 0 18px;
              height: 60px;
              line-height: 60px;
              background-color: white;
              -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

              .el-collapse-item__arrow {
                font-size: 0;
                padding: 0;
                margin: 0;
              }
              .header-row {
                font-size: 18px;
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
                  font-size: 25px;
                  color: #ffb148;
                }
                span {
                  margin-left: 30px;
                }
              }
            }
          }
          .el-collapse-item:nth-of-type(3) {
            .el-collapse-item__content {
              // margin: 0 !important;
              max-height: 500px;
            }
          }
          .is-active {
            .el-collapse-item__header {
              font-size: 17px;
              color: #323232;
              border: 0;
              box-sizing: border-box;
              padding: 0 18px;
              background-color: rgba(255, 177, 72, 0.2);
              -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              .header-row {
                border-top-color: rgba(255, 177, 72, 0);
                color: #FFB148;
                width: 100%;
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
                width: 100%;
                border-top: 0;
              }
            }
          }
        }
      }
      .quanpin {
        // width: 98% !important;
        width: 100% !important;
        float: none !important;margin: 0 auto;
        .ruleScr {
          text-align: left;
          width: 100%;
          box-sizing: border-box;
        }
        .fullScreenState {
          width: 100% !important;
          position: fixed;
          background-color: white;
          z-index: 500;
          top: 0 !important;
        }
      }
      .ruleText, .main {
        display: inline-block;
        width: 855px;
        height: 100%;
        float: right;
        position: relative;
        .rules-title {
          width: 100%;
          color: #323232;
          font-size: 26px;
          line-height: 32px;
          padding: 0 0 16px 0;
          background-color: white;
          border-bottom: 1px solid #e3e3e3;
          font-weight: bold;
          text-align: left;
        }
        .ruleScr {
          position: fixed;
          top: 0;
          background-color: white;
          z-index: 2;
          padding: 25px 0;
        }
        #rules-contents, .rules-contents, #rules-contentsDoc, .rules-contents {
          width: 100%;
          height: auto;
          margin-top: 30px;
          margin-bottom: 10px;
          text-align: justify;
          word-spacing: 0;
          color: #323232;
          border: 1px solid #e3e3e3;
          font-size: 16px;
          line-height: 25px;
          font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif !important;
          * {
            font-size: 16px;
            font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif !important;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 5px 0;
            line-height: 20px;
            font-weight: normal;
          }
          p {
            margin: 16px 0;
            text-align: justify;
            box-sizing: border-box;
            text-indent: 2em;
            /*word-break: break-all;*/
            word-break: normal;
            line-height: 28px;
            color: #323232;
            font-size: 16px;
          }
          h1, h1 * {
            font-weight: 500;
            padding: 0;
            margin: 0;
            line-height: 25px;
            text-align: center;
          }
          h1 {
            padding: 10px 0 0 0;
          }
          h1 + p {
            margin: 0;
          }
          div {
            color: #323232;
          }
          h2, h2 * {
            margin: 5px 0 0 0;
            font-weight: 500;
          }
          h3, h3 * {
            box-sizing: border-box;
            margin: 5px 0 5px 0;
            color: #323232;
            font-weight: 500;
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
            text-align: right;
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
            border-width: 1px 1px 1px 1px;
            border-style: solid;
            border-color: #323232;
            border-collapse: collapse;
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
            border-color: #f0f1f5 !important;
          }
          img {
            width: 100%;
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
        .rules-ref {
          border-top: 1px solid #e3e3e3;
          margin-top: 10px;
          margin-bottom: 20px;
          h3 {
            font-size: 16px;
            margin: 30px 0 20px 0;
            font-weight: 500;
          }
          p {
            font-size: 16px;
            line-height: 24px;
            box-sizing: border-box;
          }
          p:hover {
            text-decoration: underline;
            color: #FFAC38;
            a {
              color: #FFAC38;
            }
          }
        }
      }
      .main {
        width: 896px;
        height: 1175px;
        float: right;
        .ruleScr {
          position: fixed;
          top: 60px;
          background-color: white;
          z-index: 500;
          /*padding: 25px 0;*/
          width: 896px;
        }
        .affScreen {
          width: 896px !important;
        }
        #pdfReport {
          width: 100%;
          height: 100%;
          // overflow: hidden;
        }
      }
      .noInfo {
        text-align: center;
        margin-top: 150px;
        p {
          font-size: 16px;
          color: #ffb148;
          margin-top: 30px;
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
          text-align: center;
          left: 0;
        }
      }
      .detailed {
        width: 850px;
        height: auto;
        margin: 30px 0 35px 0;
        .el-table thead {
          color: #323232;
          font-size: 16px;
          th {
            font-weight: normal;
            background: #fcefda;
          }
        }
        .el-table__body-wrapper {
          overflow: hidden;
        }
        .el-table--group, .el-table--border {
          border: 1px solid #e3e3e3;
          border-bottom: 0;
          border-right: 0;
        }
        .el-table--group::after, .el-table--border::after, .el-table::before {
          background-color: #e3e3e3;
        }
        .el-table .cell {
          font-size: 16px;
          color: #323232;
        }
        .el-table__header .el-table tr {
          background: #f6f6f6;
          font-weight: normal;
        }
        .el-table th.is-leaf, .el-table td {
          border-bottom: 1px solid #e3e3e3;
        }
        .el-table--border th, .el-table--border td {
          border-right: 1px solid #e3e3e3;
        }
      }
      .detailedScreen {
        width: 100% !important;
      }
    }
    .docCss {
      min-height: 600px;
      .docCC {
        // left: 160px;
        z-index: 2;
        // text-align: center!important;
      }
    }
  }
</style>
