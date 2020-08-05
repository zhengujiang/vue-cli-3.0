<template>
  <div id="afficheContent" class="caseDetail">
    <div class="container">
      <div class="mainContent" :class="{screenWidth: isScreen}">
        <div class="left" v-show="!isScreen" :class="{ruleScr: ruleScroll}">
          <el-collapse accordion v-model="activeName">
            <el-collapse-item name="1">
              <template slot="title">
                <div class="title header-row">
                  <i class="icon iconfont web-jibenxinxi"></i>
                  <span>基本信息</span>
                  <i class="el-icon-arrow-down header-arrow" v-show="activeName!='1'"></i>
                  <i class="el-icon-arrow-up header-arrow" v-show="activeName=='1'"></i>
                </div>
              </template>
              <div class="synopsis">
                <ul class="info">
                  <li class="flax area vxa-flax-box"
                      v-if="marketType !== '' && marketType!=='无' && marketType !== null">
                    <div class="title col">{{ leftColumn[0] }}：</div>
                    <div class="cont col" v-if="marketType !== '' && marketType!=='无' && marketType !== null">
                      {{ marketType }}
                    </div>
                    <div class="cont" v-else>--</div>
                  </li>
                  <li class="flax vxa-flax-box industry" v-if="industry !== '' && industry!=='无' && industry !== null">
                    <div class="col title">{{ leftColumn[1] }}：</div>
                    <div class="col cont" v-if="industry !== '' && industry!=='无' && industry !== null">{{ industry }}
                    </div>
                    <div class="col cont" v-else>--</div>
                  </li>
                  <li class="flax vxa-flax-box industry" v-if="industry !== '' && industry!=='无' && industry !== null">
                    <div class="col title">{{ leftColumn[5] }}：</div>
                    <div class="col cont">
                      <template v-if="afficheInfo.threeYearLevel.length > 0">
                        <div class="level" :key="index" v-for="(item, index) in afficheInfo.threeYearLevel">
                          <span>{{item.value}}</span>
                          <span>{{item.key}}</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="level">
                          <span style="width: 100px;text-align: left">该上市公司</span>
                          <span style="width: 100px;text-align: left">尚无信披评级</span>
                        </div>
                      </template>
                    </div>
                  </li>
                  <li class="flax vxa-flax-box code"
                      v-if="companyCode !== '' && companyCode !=='无' && companyCode !== null">
                    <div class="col title">{{ leftColumn[2] }}：</div>
                    <div class="col cont" v-if="companyCode !== '' && companyCode !=='无' && companyCode !== null">
                      {{companyCode}}
                    </div>
                    <div class="col cont" v-else>--</div>
                  </li>
                  <li class="flax vxa-flax-box issued"
                      v-if="companyTitle !== '' && companyTitle !=='无' && companyTitle !== null">
                    <div class="col title">{{ leftColumn[3] }}：</div>
                    <div class="col cont" v-if="companyTitle !== '' && companyTitle !=='无' && companyTitle !== null">
                      {{companyTitle }}
                    </div>
                    <div class="content" v-else>--</div>
                  </li>
                  <li class="flax vxa-flax-box date" v-if="pubDate !== '' && pubDate !== '无' && pubDate !== null ">
                    <div class="col title">{{ leftColumn[4] }}：</div>
                    <div class="col cont" v-if="pubDate !== '' && pubDate !== '无' && pubDate !== null ">{{ pubDate }}
                    </div>
                    <div class="col cont" v-else>--</div>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2" v-if="relationAffiche.length !== 0">
              <template slot="title">
                <div class="title header-row">
                  <i class="icon iconfont web-xiangguanguize" style="font-size: 23px;"></i>
                  <span>相关公告</span>
                  <i class="el-icon-arrow-down header-arrow" v-show="activeName!='2'"></i>
                  <i class="el-icon-arrow-up header-arrow" v-show="activeName=='2'"></i>
                </div>
              </template>
              <div class="synopsis">
                <div class="info" id="releative">
                  <div class="mulu" v-for="(list, index) in relationAffiche" @click="relationClick(index)">
                    <label class="listType"><i></i></label>
                    <div class="listDoc"><a href="javascript:void(0)">{{list.title}}
                      <i
                        style="float: right;font-size: 14px;color:#8d8d8d;">{{$common.transTime(list.releaseDate)[1]}}</i>
                    </a></div>
                  </div>
                  <div v-if="relationAffiche.length == 0">暂无相关！</div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="main" :class="{quanpin: isScreen}">
          <div ref="header" class="affich-det-header" v-if="afficheInfo.title" :class="{ruleScr: ruleScroll, affScreen: $store.state.scaleShowState, fullScreenState: !$store.state.scaleShowState}">
            <div class="icon-box hide-print" v-if="userId">
              <span @click="collectDialogInfo=true">
                <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                  <i class="iconfont web-shoucang"></i> 
                </el-tooltip>
                <!-- <i class="iconfont web-shoucang"></i> 收藏 -->
              </span>
            </div>
            {{afficheInfo.title}}
          </div>
          <div style="height: 90px" v-if="titleFix"></div>
          <el-card ref="card" class="pdfReport ruleCatalog" id="pdfReport" shadow="hover" body-style="padding:0;height:100%">
            <v-iframe :src="pdfUrl" v-if="pdfUrl"></v-iframe>
          </el-card>
        </div>
      </div>
      <!-- 侧边栏 -->
      <!-- <v-sidebar :collectInfo="afficheInfo | delContent" v-show="isLogin" @scaleMethod="scaleScreen"
      @printfMethod="printfM" :scaleShow="isScreen"></v-sidebar> -->
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
    name: 'afficheContent',
    data() {
      return {
        collectDialogInfo: false,
        mainId: '',
        leftColumn: ['适用范围', '所属行业', '证券代码', '公司名称', '发布日期', '信披评级'],
        marketType: '',
        industry: '',
        companyCode: '',
        companyTitle: '',
        pubDate: '',
        pdfUrl: '',
        pdfIframe: '',
        activeName: '1',
        isScreen: false,
        isLoading: true,
        isError: false,
        afficheInfo: {},
        ruleScroll: false, // false 代表全屏； true代表不是全屏
        titleFix: false,
        scrolled: '',
        relationAffiche: [],
        screenWidth: document.body.clientWidth,
        userId: '',
        headerWidth: ''
      }
    },
    filters: {
      delContent: function (obj) {
        if (obj == {}) return obj
        var newObj = {
          id: obj.mainId,
          title: obj.title,
          time: obj.releaseDate,
          type: 'case'
        }
        return newObj
      }
    },
    created() {
      this.userId = this.$cookie.get('userId')
      this.$store.commit('scaleShowState', true)
      // this.pdfUrl = 'static/pdf/web/viewer.html?file=abc.pdf'
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
      this.resize();
      window.onresize = () => {
        return (() => {
          this.resize()
        })()
      }
    },
    watch: {
      '$store.state.scaleShowState': function (val) {
        console.log(val);
        console.log(2222);
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
      },
      'isScreen': function (val) {
        console.log('isScreen', val)
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
      resize() {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth;
        this.headerWidth = this.$refs.card.$el.clientWidth
        if (this.screenWidth < 1280) {
          this.isScreen = true
        } else {
          this.isScreen = false
        }
      },
      changeCollectDialog() {
        this.collectDialogInfo = false
      },
      relationClick(index) {
        this.$common.openWindow('/affiche/details?id=' + this.relationAffiche[index].id)
        // this.getDetails(this.$route.query.id)
        this.activeName = '2'
      },
      handleScroll() {
        this.scrolled = document.documentElement.scrollTop || document.body.scrollTop
        let headerHeight = document.getElementById('header').clientHeight
        console.log(headerHeight + ' headerHeight');
        // let dom = document.querySelector('#afficheContent').offsetTop
        if (this.scrolled >= headerHeight) {
          this.ruleScroll = true
        } else {
          this.ruleScroll = false
        }
        // this.scrolled > 96 ? this.titleFix = true : this.titleFix = false;
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
        console.log(this.isScreen)
      },
      // 获取公告详情
      afficheContent() {
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.afficheContent,
          params: {
            id: this.mainId,
            userId: this.userId
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            let obj = res.data.returnObject
            document.title = obj.title ? obj.title : '公告详情'
            this.afficheInfo = obj
            this.$common.getSidebarInfo(this.afficheInfo, 'mainId', 'title', 'releaseDate', '', 'case')
            this.marketType = obj.marketType
            this.companyCode = obj.companyCode
            this.industry = obj.tradeType
            this.companyTitle = obj.companyName
            this.pubDate = this.$common.transTime(obj.releaseDate)[0]
            var httpText = document.location.protocol == 'https:' ? 'https:' : 'https:'
            var url = httpText + '//' + obj.url.split('://')[1]
            // this.pdfUrl = this.$api.host + 'static/pdf/web/viewer.html?file=' + url
            this.pdfUrl = url
            // this.pdfUrl = `http://local.in-hope.com.cn:8081/static/pdf/web/viewer.html`
            this.isLoading = false
            if (obj.relationAnnouncementList) {
              if (obj.relationAnnouncementList.length !== 0) {
                this.relationAffiche = obj.relationAnnouncementList
              }
            }
          } else if (res.data.returnCode == -1) {
            this.isLoading = false
            this.isError = true
            document.getElementsByClassName('main')[0].style.height = 'auto'
          }
        }).catch((err) => {
          this.isLoading = false
          // this.isError = true
          document.getElementsByClassName('main')[0].style.height = 'auto'
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
  /*.mainContent{
    margin-top: 0;
  }
  @media screen and (max-width: 1280px) {
    #afficheContent {
      .mainContent {
        transform: scale(0.9);margin-top: -70px;
      }
    }
  }*/

  #afficheContent {
    .container {
      background-color: #F6F6F6;
      width: 100%;
      height: auto;
      position: relative;
      overflow: hidden;
      .mainContent {
        overflow: hidden;
        width: 1200px;
        background-color: #F6F6F6;
        margin: 16px auto 30px;
        /*padding: 0 15px;*/
        // padding-left: 15px;
        // padding-right: 30px;
        .ruleScr {
          position: fixed;
          top: 60px;
          background-color: white;
          z-index: 500;
          width: 63%;
        }
        .left, .main {
          width: 292px;
          height: 700px;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          box-sizing: border-box;
          float: left;
          &.main {
            border: none;
          }
        }
        .left {
          height: auto;
          .el-collapse {
            border-top: none;
            .el-collapse-item {
              .el-icon-arrow-right:before {
                display: none !important;
              }
              .el-collapse-item__header {
                height: auto !important;
                padding: 0 20px;
                border-bottom: none;
                .title {
                  width: 100%;
                  height: 45px;
                  line-height: 45px;
                  font-size: 16px;
                  font-weight: normal;
                  border-bottom: 1px solid #e3e3e3;
                  position: relative;
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
                &:hover {
                  background-color: #F6F6F6;
                }
              }
              .el-collapse-item__wrap {
                border-bottom: none;
                .el-collapse-item__content {
                  padding-bottom: 0;
                }
              }
              &:last-child {
                .title {
                  border-bottom: none;
                }
                .el-collapse-item__content {
                  border-bottom: none;
                }
              }
              &.is-active {
                .el-collapse-item__header {
                  background: #F6F6F6;
                  .title {
                    border-bottom: none !important;
                  }
                }
              }
            }
          }
          .synopsis {
            border-bottom: 1px solid #e3e3e3;
            max-height: 400px;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            padding: 0 18px;
            color: #8d8d8d;
            font-size: 16px;
            line-height: 1.3;
            .info {
              width: 100%;
              height: auto;
              box-sizing: border-box;
              font-size: 16px;
              color: #8d8d8d;
              overflow: hidden;
              margin-top: 20px;
              .flax {
                width: 100%;
                overflow: hidden;
                height: auto;
                padding-bottom: 15px;
                .col.title {
                  flex: 0 0 35%;
                }
                .cont {
                  .level {
                    display: inline-block;
                    width: 40px;
                    margin-right: 10px;
                    span {
                      display: inline-block;
                      width: 40px;
                      text-align: center;
                      line-height: 20px;
                    }
                  }
                }
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
          width: 896px;
          // width: 100%;
          height: auto;
          float: right;
          position: relative;
          /*.affScreen {*/
            /*width: 896px !important;*/
          /*}*/
          .ruleScr {
            position: fixed;
            top: 60px;
            background-color: white;
            z-index: 500;
            /*padding: 25px 0;*/
            width: 896px !important;
          }
          .icon-box {
            font-size: 14px;
            color: #ffb148;
            font-weight: 400;
            display: inline-block;
            span {
              margin-right: 5px;
              cursor: pointer;
            }
          }
          .affich-det-header {
            // max-width: 1200px;
            width: 100%;
            color: #323232;
            font-size: 20px;
            line-height: 32px;
            padding: 16px 16px 12px 16px;
            background-color: white;
            font-weight: bold;
            border-bottom: 1px solid #f6f6f6;
          }
          /*.titleFix {*/
            /*position: fixed;*/
            /*// max-width: 1200px;*/
            /*width: 880px;*/
            /*z-index: 1;*/
            /*top: 60px;*/
          /*}*/
          /*.titleWidth {*/
            /*position: fixed;*/
            /*top: 0;*/
            /*background-color: white;*/
            /*z-index: 500;*/
            /*width: 100% !important;*/
          /*}*/
          #pdfReport {
            width: 100%;
            height: 1175px;
            position: relative;
            // overflow: hidden;
          }
          .pdfTop {
            margin-top: 90px;
          }

        }
        .quanpin {
          width: 100% !important;
          float: none !important;
          animation: showChange 500ms forwards;
          -moz-animation: showChange 500ms forwards;
          -webkit-animation: showChange 500ms forwards;
          -o-animation: showChange 500ms forwards;
          margin: 0 auto;
          .affich-det-header {
            text-align: left;
          }
          .ruleScr {
            text-align: left;
            width: 100% !important;
            box-sizing: border-box;
          }
          .fullScreenState {
            width: 100%;
            position: fixed;
            background-color: white;
            z-index: 500;
            top: 0 !important;
          }
        }
      }
    }
  }
</style>
