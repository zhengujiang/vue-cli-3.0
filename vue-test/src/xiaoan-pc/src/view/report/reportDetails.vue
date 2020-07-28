<template>
  <div id="reportDetail" class=" caseDetail">
    <div class="container">
      <div class="content mainContent" :class="{screenWidth: this.isScreen}">
        <div class="left" v-show="!isScreen">
          <el-collapse accordion v-model="activeName">
            <el-collapse-item name="1">
              <template slot="title">
                <div class="title header-row">
                  <i class="icon iconfont web-jibenxinxi"></i>
                  <span>基本信息</span>
                </div>
              </template>
              <div class="info">
                <div class="date" v-if="pubDate !== '' && pubDate !== '无' && pubDate !== null ">
                  <span>发布日期：</span>
                  <p v-if="pubDate !== '' && pubDate !== '无' && pubDate !== null ">{{ pubDate }}</p>
                  <p v-else>--</p>
                </div>
                <div class="area" v-if="marketType !== '' && marketType!=='无' && marketType !== null">
                  <span>证券公司：</span>
                  <p v-if="marketType !== '' && marketType!=='无' && marketType !== null">{{ marketType }}</p>
                  <p v-else>--</p>
                </div>
                <div class="author" v-if="author !== '' && author!=='无' && author !== null">
                  <span>报告作者：</span>
                  <p v-if="author !== '' && author!=='无' && author !== null">{{ author }}</p>
                  <p v-else>--</p>
                </div>
                <div class="code" v-if="reportSort !== '' && reportSort !=='无' && reportSort !== null">
                  <span>报告分类：</span>
                  <p v-if="reportSort !== '' && reportSort !=='无' && reportSort !== null">{{ reportSort }}</p>
                  <p v-else>--</p>
                </div>
                <div class="issued" v-if="companyTitle !== '' && companyTitle !=='无' && companyTitle !== null">
                  <span>半年评级：</span>
                  <p v-if="companyTitle !== '' && companyTitle !=='无' && companyTitle !== null">{{ companyTitle }}</p>
                  <p v-else>--</p>
                </div>
                <div class="issued" v-if="price !== '' && price !=='无' && price !== null">
                  <span>目标价格：</span>
                  <p v-if="price !== '' && price !=='无' && price !== null">{{ price }}</p>
                  <p v-else>--</p>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2"
                              v-if="reportSort == '公司报告' && !(!companyCode && !companyName && !market && !industry && !area)">
              <template slot="title">
                <div class="title header-row">
                  <i class="icon iconfont web-gongsixinxi"></i>
                  <span>公司信息</span>
                </div>
              </template>
              <div class="info">
                <div class="date" v-if="companyCode !== '' && companyCode !== '无' && companyCode !== null ">
                  <span>证券代码：</span>
                  <p v-if="companyCode !== '' && companyCode !== '无' && companyCode !== null ">{{ companyCode }}</p>
                  <p v-else>--</p>
                </div>
                <div class="area" v-if="companyName !== '' && companyName!=='无' && companyName !== null">
                  <span>证券简称：</span>
                  <p v-if="companyName !== '' && companyName!=='无' && companyName !== null">{{ companyName }}</p>
                  <p v-else>--</p>
                </div>
                <div class="author" v-if="market !== '' && market!=='无' && market !== null">
                  <span>所属板块：</span>
                  <p v-if="market !== '' && market!=='无' && market !== null">{{ market }}</p>
                  <p v-else>--</p>
                </div>
                <div class="code" v-if="industry !== '' && industry !=='无' && industry !== null">
                  <span>所属行业：</span>
                  <p v-if="industry !== '' && industry !=='无' && industry !== null">{{ industry }}</p>
                  <p v-else>--</p>
                </div>
                <div class="issued" v-if="area !== '' && area !=='无' && area !== null">
                  <span>所属地区：</span>
                  <p v-if="area !== '' && area !=='无' && area !== null">{{ area }}</p>
                  <p v-else>--</p>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="3" v-if="relationAffiche.length !== 0">
              <template slot="title">
                <div class="title header-row">
                  <i class="icon iconfont web-xiangguanyanbao" style="font-size: 23px;"></i>
                  <span>相关研报</span>
                </div>
              </template>
              <div class="info" id="releative">
                <div class="mulu" v-for="(list, index) in relationAffiche" @click="relationClick(index)">
                  <label class="listType"><i></i></label>
                  <div class="listDoc"><a href="javascript:void(0)">{{list.subject}}
                    <i
                      style="float: right;font-size: 14px;color:#8d8d8d;">{{$common.transTime(list.sentDate)[1]}}</i>
                  </a></div>
                </div>
                <div v-if="relationAffiche.length == 0">暂无相关！</div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="main" :class="{quanpin: this.isScreen}">
          <div class="affich-det-header">
            <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
              <span @click="collectDialogInfo=true">
                <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                  <i class="iconfont web-shoucang"></i> 
                </el-tooltip>
              </span>
            </div>
            {{afficheInfo.subject}}
          </div>
          <div class="pdfReport ruleCatalog" id="pdfReport">
            <v-iframe :src="pdfUrl"></v-iframe>
          </div>
        </div>
      </div>
      <!-- 侧边栏 -->
      <!--<v-sidebar :collectInfo="afficheInfo | delContent" v-show="isLogin" @scaleMethod="scaleScreen"-->
      <!--@printfMethod="printfM" :scaleShow="isScreen"></v-sidebar>-->
    </div>
    <v-contentLoading :stopLoading="isLoading"></v-contentLoading>
    <v-error :isAjaxError="isError"></v-error>
    <collect-dialog :collectDialogInfo="collectDialogInfo" :info="afficheInfo | delContent"
                    @changeCollectDialog="changeCollectDialog" v-if="afficheInfo.id"></collect-dialog>
  </div>
</template>
<script>
  import iframe from '@/components/iframe.vue'
  import sidebar from '../../components/sidebar.vue'
  import error from '../../components/error.vue'
  import contentLoading from '../../components/contentLoading.vue'
  import collectDialog from '@/view/aside/components/components/collectDialog.vue'

  export default {
    name: 'reportDetail',
    data() {
      return {
        collectDialogInfo: false,
        mainId: '',
        marketType: '',
        author: '',
        reportSort: '',
        industry: '',
        reportId: '',
        companyName: '',
        companyCode: '',
        companyTitle: '',
        area: '',
        market: '',
        price: '',
        pubDate: '',
        pdfUrl: '',
        pdfIframe: '',
        activeName: '1',
        isScreen: false,
        isLoading: true,
        isError: false,
        afficheInfo: {},
        ruleScroll: false,
        scrolled: '',
        relationAffiche: [],
        num: 10,
        page: 1,
        screenWidth: document.body.clientWidth,
        userId: ''
      }
    },
    filters: {
      delContent: function (obj) {
        if (obj == {}) return obj
        var newObj = {
          id: obj.id,
          title: obj.subject,
          time: obj.sentDate,
          type: 'report'
        }
        return newObj
      }
    },
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
      this.mainId = this.$route.query.id
      this.afficheContent()
      window.addEventListener('scroll', this.handleScroll)
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
    watch: {
      '$store.state.scaleShowState': function (val) {
        console.log(val);
        this.isScreen = val;
        this.scaleScreen();
      },
      screenWidth: function (val) {
        // console.log('val = ', val)
        this.screenWidth = val
        if (val < 1280) {
          this.isScreen = true
        } else {
          this.isScreen = false
        }
      },
      'ruleScroll': function (val) {
        // console.log(' ruleScroll = ', val)
//        var bh = document.body.clientHeight
//        var headerow = document.getElementsByClassName('header-row')[0].clientHeight
//        var num = parseInt(document.getElementsByClassName('header-row').length)
//        var content = document.getElementsByClassName('el-collapse-item__content')
//        if (val) {
//          for (var i = 0; i < content.length; i++) {
//            // content[i].style.height = (bh - headerow * num - headerow) + 'px'
//            content[i].style.height = (bh * 0.2) + 'px'
//          }
//        } else {
//          for (var j = 0; j < content.length; j++) {
//            // content[j].style.height = (bh - headerow * num - headerow - 120) + 'px'
//            content[j].style.height = (bh * 0.2) + 'px'
//          }
//        }
      },
      'isScreen': function (val) {
        // console.log('isScreen', val)
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
      changeCollectDialog() {
        this.collectDialogInfo = false
      },
      relationClick(index) {
        // window.open('/report/details?id=' + this.relationAffiche[index].id)
        // this.getDetails(this.$route.query.id)
        this.activeName = '4'
        var sort = '/reportDetail'
        var id = this.relationAffiche[index].id
        var url = sort + '?id=' + id
        var a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('target', '_blank')
        a.setAttribute('class', '')
        a.setAttribute('class', sort + id)
        if (!document.getElementsByClassName(sort + id)[0]) {
          document.body.appendChild(a)
        }
        a.click()
        a.parentNode.removeChild(a)
      },
      handleScroll() {
        this.scrolled = document.documentElement.scrollTop || document.body.scrollTop
        // let dom = document.querySelector('#afficheContent').offsetTop
        // if (this.scrolled >= dom) {
        //   this.ruleScroll = true
        // } else {
        //   this.ruleScroll = false
        // }
      },
      // 打印
      printfM() {
        var bdhtml = document.getElementById('pdf-wrap').innerHTML
        var sprnstr = '<!--startprint-->'
        var eprnstr = '<!--endprint-->'
        var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17)
        prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr))
        window.document.body.innerHTML = prnhtml
        window.print()
      },
      // 页面缩放
      scaleScreen() {
        this.isScreen ? this.isScreen = false : this.isScreen = true
        // console.log(this.isScreen)
      },
      // 获取综合相关研报
      releaseAffiche_T() {
        this.$http({
          methods: 'GET',
          url: this.$api.report.releaseAffiche_T,
          params: {
            pageNum: this.page,
            pageSize: this.num,
            type: this.reportSort,
            id: this.reportId
          }
        }).then((res) => {
          console.log('report = ', res)
          if (res.data.returnCode == 1) {
            var arr = res.data.returnObject
            if (arr.length !== 0) {
              this.relationAffiche = arr
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取行业相关研报
      releaseAffiche_I() {
        this.$http({
          methods: 'GET',
          url: this.$api.report.releaseAffiche_I,
          params: {
            pageNum: this.page,
            pageSize: this.num,
            industry: this.industry ? this.industry : '',
            id: this.reportId
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            var arr = res.data.returnObject
            if (arr.length !== 0) {
              this.relationAffiche = arr
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取公司相关研报
      releaseAffiche() {
        this.$http({
          methods: 'GET',
          url: this.$api.report.releaseAffiche_C,
          params: {
            pageNum: this.page,
            pageSize: this.num,
            industry: this.industry ? this.industry : '',
            id: this.reportId,
            code: this.companyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            var arr = res.data.returnObject
            if (arr.length !== 0) {
              this.relationAffiche = arr
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取公告详情
      afficheContent() {
        this.$http({
          methods: 'GET',
          url: this.$api.report.reportDetail,
          params: {
            id: this.mainId,
            userId: this.userId
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            let obj = res.data.returnObject
            document.title = obj.subject ? obj.subject : '研报详情'
            // console.log('123123123====== ', obj)
            this.afficheInfo = obj
            this.$common.getSidebarInfo(this.afficheInfo, 'id', 'subject', 'sentDate', '', 'report')
            this.marketType = obj.securitiesCompany
            this.reportSort = obj.levelOne
            this.author = obj.author
            this.industry = obj.industry
            this.reportId = obj.id
            this.companyCode = obj.companyCode
            this.companyName = obj.name
            this.companyTitle = obj.rating
            this.price = obj.destPrice ? obj.destPrice + '元' : ''
            this.area = obj.area
            this.market = obj.market
            this.pubDate = this.$common.transTime(obj.sentDate)[0]
            var httpText = document.location.protocol == 'https:' ? 'https:' : 'https:'
            var url = httpText + '//' + obj.pdfUrl.split('://')[1]
            this.pdfUrl = this.$api.host + 'static/pdf/web/viewer.html?file=' + url
            //
            this.isLoading = false
            if (this.reportSort == '公司报告') {
              this.releaseAffiche()
            } else if (this.reportSort == '行业报告') {
              this.releaseAffiche_I()
            } else {
              this.releaseAffiche_T()
            }
//            if (obj.relationAnnouncementList) {
//              if (obj.relationAnnouncementList.length !== 0) {
//                this.relationAffiche = obj.relationAnnouncementList
//              }
//            }
          } else if (res.data.returnCode == -1) {
            this.isLoading = false
            this.isError = true
          }
        }).catch((err) => {
          this.isLoading = false
          this.isError = true
          this.$message({showClose: true, type: 'success', duration: 3000, message: err.message})
        })
      }
    },
    components: {
      'v-iframe': iframe,
      'v-sidebar': sidebar,
      'v-error': error,
      'v-contentLoading': contentLoading,
      collectDialog
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
  #reportDetail {
    .container {
      width: 100%;
      height: auto;
      position: relative;
      overflow: hidden;
      .content {
        overflow: hidden;
        .quanpin {
          width: 100% !important;
          float: none !important;
          margin: 0 auto;
        }
        .left, .main {
          margin: 54px 0;
          width: 309px;
          height: 700px;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          box-sizing: border-box;
          float: left;
        }
        .left {
          height: auto;
          .el-collapse {
            border-top: none;
            .el-collapse-item:last-child {
              .title {
                border-bottom: none;
              }
              .el-collapse-item__content {
                border-bottom: none;
              }
            }
            .el-icon-arrow-right:before {
              display: none !important;
            }
            .el-collapse-item__header {
              height: auto !important;
              padding: 0 20px;
              border-bottom: none;
              .title {
                height: 50px;
                line-height: 50px;
                font-size: 17px;
                font-weight: normal;
                border-bottom: 1px solid #e3e3e3;
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
            .el-collapse-item__wrap {
              // padding: 0 20px;
              border-bottom: none;
              font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif;
              .el-collapse-item__content {
                border-bottom: 1px solid #e3e3e3;
                // padding-bottom: 100px;
                min-height: 320px;
                overflow-y: auto;
                overflow-x: hidden;
                -webkit-overflow-scrolling: touch;
                padding: 0 18px;
                /*margin: 25px 0;*/
                color: #8d8d8d;
                font-size: 16px;
                line-height: 1.3;
              }
            }
            .is-active {
              .el-collapse-item__header {
                color: #ffb148 !important;
                background: #fff7ec;
                .title {
                  border-bottom: none !important;
                }
              }
            }
          }
          .info {
            width: 100%;
            height: auto;
            padding-top: 20px;
            box-sizing: border-box;
            font-size: 16px;
            color: #8d8d8d;
            overflow: hidden;
            div {
              width: 100%;
              overflow: hidden;
              height: auto;
              margin-bottom: 15px;
              span, p {
                float: left;
                width: 30%;
              }
              p {
                width: 70%;
                white-space: pre-wrap;
                word-break: break-all
              }
            }
          }
          #releative {
            .mulu {
              margin-bottom: 15px;
              display: table;
              line-height: 1.3;
              .listType {
                width: 10px;
                display: table-cell;
                text-align: justify;
                margin-right: 20px;
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
              .listDoc {
                display: table-cell;
                text-align: justify;
                width: 96%;
                a {
                  &:hover {
                    color: #ffb148;
                    text-decoration: underline;
                  }
                }
              }
            }
          }
        }
        .main {
          width: 850px;
          height: auto;
          margin-left: 20px;
          float: left;
          .icon-box {
            font-size: 14px;
            color: #ffb148;
            font-weight: 400;
            span {
              margin-right: 15px;
              cursor: pointer;
            }
          }
          .affich-det-header {
            width: 100%;
            color: #323232;
            font-size: 20px;
            line-height: 32px;
            padding: 16px 16px 12px 16px;
            background-color: white;
            font-weight: bold;
          }
          #pdfReport {
            width: 100%;
            height: 100%;
            height: 1175px;
            // overflow: hidden;
          }
        }
      }
    }
  }
</style>
