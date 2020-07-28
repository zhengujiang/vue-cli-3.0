<template>
  <div id="ipo-details" class="caseDetail">
    <div class="content">
      <el-row :gutter="15">
        <el-col :span="18">
          <div class="details-box print">
            <!--html-->
            <div id="pdf-wrap" class="details-content" :class="{isScreen: isScreen}" v-if="contentSort == 'html'">
              <div v-if="contentDetail.title" class="affich-det-header affich-det-bottom  vxa-1px-b">
                <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
                  <span @click="collectDialogInfo=true">
                    <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                      <i class="iconfont web-shoucang"></i> 
                    </el-tooltip>
                  </span>
                </div>
                {{contentDetail.title}}
              </div>
              <div id="details-content" style="border:0;" v-html="contentHtmlDetails"></div>
            </div>
            <!--pdf-->
            <div class="details-content" :class="{isScreen: isScreen}" v-else-if="contentSort == 'pdf'">
              <div v-if="contentDetail.title" class="affich-det-header">
                <div class="icon-box hide-print" v-if="userId" style="display:inline-block">
                  <span @click="collectDialogInfo=true">
                    <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
                      <i class="iconfont web-shoucang"></i> 
                    </el-tooltip>
                  </span>
                </div>
                {{contentDetail.title}}
              </div>
              <div class="vux-1px pdf-box" id="pdf-content">
                <v-iframe :src="pdfUrl"></v-iframe>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <!--<v-adv :pageName="'投关检索'" style="margin-top:15px;"></v-adv>-->
          <v-company-i-p-o-course-item :companyName="contentDetail.companyName" :companyData="companyData"
                                       :activeNames="activeName" @change="activeCompanyChange">
          </v-company-i-p-o-course-item>
          <v-industry-i-p-o-course-item v-if="industryCourseData.length > 0" :industryData="industryCourseData"
                                        :activeNames="activeName"
                                        @change="activeIndustryChange">
          </v-industry-i-p-o-course-item>
        </el-col>
      </el-row>
    </div>
    <!--<v-sidebar :collectInfo="contentDetail | delContent" v-show="isLogin" @scaleMethod="scaleScreen"-->
    <!--@printfMethod="printfM" :scaleScreenShow="false" :scaleShow="isScreen"-->
    <!--:dayinShow="contentSort == 'html'"></v-sidebar>-->
    <collect-dialog :collectDialogInfo="collectDialogInfo" :info="contentDetail | delContent"
                    @changeCollectDialog="changeCollectDialog" v-if="contentDetail.id"></collect-dialog>
  </div>
</template>

<script>
  import VIframe from '@/components/iframe.vue'
  import VSidebar from '@/components/sidebar'
  import VCompanyIPOCourseItem from './components/company/companyIPOCourseItem'
  import VIndustryIPOCourseItem from './components/industry/industryIPOCourseItem'
  import collectDialog from '@/view/aside/components/components/collectDialog.vue'
  export default {
    name: "ipo-details",
    components: {
      VCompanyIPOCourseItem,
      VIndustryIPOCourseItem,
      VSidebar,
      VIframe,
      collectDialog
    },
    data() {
      return {
        collectDialogInfo: false,
        detailsData: {
          title: '关于互联互通机制港股通股票调入相关安排的通知'
        },
        activeName: 'all',
        isLogin: true,
        isScreen: false,
        dayinShow: true,
        page: {
          index: 1,
          size: 10,
          total: 0
        },
        contentSort: false,
        contentDetail: {},
        contentHtmlDetails: '',
        industryCourseData: [],
        companyData: [],
        docUrl: '',
        pdfUrl: '',
        userId: ''
      }
    },
    filters: {
      delContent: function (obj) {
        if (obj == {}) return obj
        var newObj = {
          id: obj.id,
          title: obj.title,
          time: obj.releaseDate,
          timeliness: '',
          type: 'publish'
        };
        console.log(newObj);
        return newObj
      }
    },
    watch: {
      '$store.state.scaleShowState': function (val) {
        console.log(val);
        this.isScreen = val;
        this.scaleScreen();
      }
    },
    created() {
      this.userId = this.$cookie.get('userId')
      this.$store.commit('scaleShowState', true)
      if (this.$route.query.id) {
        if (this.$route.query.id == 'null' || this.$route.query.id == 'undefined') {
          this.$router.replace({path: '/ipo/search'});
        }
        this.getDetails(this.$route.query.id);
      } else {
        this.$router.replace({path: '/ipo/search'});
      }
      console.log(this.$route.name);
    },
    methods: {
      //
      changeCollectDialog() {
        this.collectDialogInfo = false
      },
      printfM() {
        let codestr = document.getElementById('details-content').innerHTML
        window.print()
        let newWindow = window.open('_blank')   // 打开新窗口
        // let codestr = document.getElementById('pdf-wrap').innerHTML   // 获取需要生成pdf页面的div代码
        newWindow.document.write(codestr)   // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
        newWindow.print()   // 打印当前窗口
        return true
      },
      //
      classify(array) {
        console.log('=======>', array);
        let dateArray = [];
        let tempType = "";
        const arrays = array;
        arrays.forEach((item, index) => {
          if (item.type == tempType) {
            dateArray[dateArray.length - 1].children.push(item);
          } else {
            dateArray.push({type: item.type, children: [item]});
            tempType = item.type;
          }
          console.log(dateArray);
        })
        return dateArray
      },
      //
      getDetails(id) {
        //
        function checkHtml(htmlStr) {
          var reg = /<[^>]+>/g;
          return reg.test(htmlStr);
        }
        //
        this.$http({
          methods: 'GET',
          url: this.$api.publish.getDetails,
          params: {
            publishId: id,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.contentDetail = res.data.returnObject;
            this.$common.getSidebarInfo(this.contentDetail, 'id', 'title', 'releaseDate', '', 'publish')
            document.title = this.contentDetail.title ? this.contentDetail.title : 'IPO详情';
            //
            var companyData = this.contentDetail.relatedContentList ? this.contentDetail.relatedContentList : null;
            if (companyData) {
              this.companyData = this.classify(companyData);
            } else {
              this.companyData = companyData;
            }
            //
            var industryCourseData = this.contentDetail.smaeIndustryArray ? this.contentDetail.smaeIndustryArray : null;
            //
            if (industryCourseData) {
              this.industryCourseData = [];
              industryCourseData.forEach((item, index) => {
                this.industryCourseData.push({
                  companyName: item.companyName,
                  children: this.classify(item.publishDataSourceList)
                })
              })
              console.log('==>', this.industryCourseData);
            } else {
              this.industryCourseData = industryCourseData
            }

            var textCountArray, textCount;
            if (this.contentDetail.type == 4 || this.contentDetail.type == 3) {
              // txt
              this.contentSort = 'html'
              // this.contentDetail.content = this.contentDetail.content.replace(/(^\s+)|(\s+$)/g, '')
              textCountArray = this.contentDetail.content.split('\n');
              textCountArray = this.$common.ImpArr(textCountArray);
              textCount = '';
              //
              if (textCountArray[0] != this.contentDetail.title.trim()) {
                textCountArray.unshift(this.contentDetail.title.trim());
              }
              for (var i = 0, len = textCountArray.length; i < len; i++) {
                if (textCountArray[i] == this.contentDetail.title.trim()) {
                  textCount += '<h1>' + textCountArray[i].trim() + '</h1>'
                } else if (textCountArray[i].charAt(textCountArray[i].length - 1) == '：') {
                  textCount += '<pre>' + textCountArray[i].trim() + '</pre>'
                } else {
                  textCount += '<p>' + textCountArray[i].trim() + '</p>'
                }
              }
              textCount += '<h5>' + this.$common.transTime(this.contentDetail.releaseDate)[0] + '</h5>'
              // console.log(textCount);
              this.contentHtmlDetails = textCount;
            } else if (this.contentDetail.type == 5) {
              // html
              this.contentSort = 'html';
              if (checkHtml(this.contentDetail.content)) {
                textCountArray = this.contentDetail.content.split("\n");
                textCountArray = this.$common.ImpArr(textCountArray);
                textCount = '';
                for (var j = 0, lena = textCountArray.length; j < lena; j++) {
                  textCount += textCountArray[j].trim();
                }
                this.contentHtmlDetails = textCount;
                this.$nextTick(() => {
                  var contDom = document.querySelectorAll('#details-content p');
                  for (var k = 0; k < contDom.length; k++) {
                    if (contDom[k].getAttribute('align')) {
                      if (contDom[k].getAttribute('align') == 'left') {
                        contDom[k].style.textAlign = 'left';
                      } else {
                        contDom[k].style.textAlign = 'right';
                      }
                    }
                  }
                })
              } else {
                textCountArray = this.contentDetail.content.trim().split('。');
                textCountArray = this.$common.ImpArr(textCountArray);
                textCount = '';
                textCount += '<h1>' + this.contentDetail.title + '</h1>'
                textCountArray.forEach((item) => {
                  textCount += '<p>' + item + '。</p>'
                })
                textCount += '<h5>' + this.$common.transTime(this.contentDetail.releaseDate)[0] + '</h5>'
                this.contentHtmlDetails = textCount;
              }

              // this.contentDetail.fileUrl = this.contentDetail.fileUrl.replace('http://', 'https://')
              // if (this.$common.ispc()) {
              //   // 白色简约风格
              //   this.docUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.contentDetail.fileUrl;
              //   // 黑色风格
              //   // this.docUrl = 'https://hk1-word-view.officeapps.live.com/wv/wordviewerframe.aspx?ui=zh-CN&rs=zh-CN&WOPISrc=http%3A%2F%2Fhk1-view-wopi%2Ewopi%2Elive%2Enet%3A808%2Foh%2Fwopi%2Ffiles%2F%40%2FwFileId%3FwFileId%3D' + this.contentDetail.docUrl + '&access_token_ttl=0&wdAccPdf=1'
              // } else {
              //   // 移动端样式
              //   this.docUrl = 'https://hk1-word-view.officeapps.live.com/wv/mWord.aspx?ui=zh-CN&rs=zh-CN&WOPISrc=http%3A%2F%2Fhk1-view-wopi%2Ewopi%2Elive%2Enet%3A808%2Foh%2Fwopi%2Ffiles%2F%40%2FwFileId%3FwFileId%3D' + this.contentDetail.fileUrl + '&access_token_ttl=0&wdAccPdf=1&wdMobileHost=2'
              // }
            } else if (this.contentDetail.type == 2 || this.contentDetail.type == 1) {
              // pdf
              this.contentSort = 'pdf';
              var httpText = document.location.protocol == 'https:' ? 'https:' : 'https:'
              var urlLink = httpText + '//' + this.contentDetail.fileUrl.split('://')[1]
              this.pdfUrl = this.$api.host + 'static/pdf/web/viewer.html?file=' + urlLink;
            }
            //
          }
        }).catch((err) => {

        })
      },
      // 页面缩放
      scaleScreen() {
        this.isScreen = !this.isScreen
      },
      //
      activeIndustryChange(val) {
        if (val) {
          this.activeName = val;
        } else {
          this.activeName = 'all';
        }
      },
      activeCompanyChange(val) {
        if (val) {
          this.activeName = 'all'
        }
      }
    }
  }
</script>

<style lang="scss">
  #ipo-details {
    min-height: 800px;
    padding-top: 16px;
    // background: #e5e4db;
    .details-box {
      width: 100%;
      padding: 0 20px;
      padding-bottom: 20px;
      // background-color: #f6f4ec;
      .details-content {
        min-height: 750px;
        @import "../../styles/details-style";
        #pdf-content {
          height: 1175px;
        }
        .pdf-box {
          border-radius: 2px;
        }
      }
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
      .affich-det-bottom {
        margin-bottom: 16px;
      }
    }
    .ipo-det-header {
      padding: 16px 0;
      font-size: 20px;
      font-weight: bold;
      color: rgba(50, 50, 50, 1);
      line-height: 26px;
      /*margin-bottom: 16px;*/
    }
  }
</style>
