<template>
  <div class="detailReport xiaoan-box" id="detailReport">
    <div class="detailTitle" id="detailTitle">
      <p class="countTitle">{{titleName}}</p>
    </div>
    <div class="content" id="content" ref="contTextDom">
      <div id="detailText">
        <div id="detail-contents" v-html="detailContents"></div>
      </div>
    </div>
    <div class="pdfGlobal">
      <div class="pdfreport vux-1px-t">
        <img :src="pdfimg" class="pdfimg">
        <a href="javascript:void(0)" @click="goPdf" class="pdflink">点击查看PDF全文</a>
      </div>
    </div>
    <span class="tt-clue" :class="{clueActive: IsActive}">好内容点此收藏哟</span>
    <!---->
    <footer class="show_footer" ref="footerDom">
      <div class="footer-home" @click="returnHome">
        <div class="tabbar-Icon">
          <img :src="footerHome.icon" alt="">
        </div>
        <p>{{footerHome.name}}</p>
      </div>
      <div class="show_items" v-for="(list, index) in footerItem"
           @click="footerClick(index)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt="">
        </div>
        <p class="tabbar-value">{{list.name}}</p>
      </div>
    </footer>
    <!---->
    <div class="popup-report-details" v-transfer-dom>
      <popup class=" popup-bottom" v-model="popupData.relative" position="bottom">
        <h3 class="popup-bottom-title">基本信息</h3>
        <div class="popup-bottom-content">
          <div class="rulesPlateHeader">
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">报告标题：</div>
                <div class="unitsCont"><span class="unitsName unit">{{titleName}}</span>
                </div>
              </div>
            </div>
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">报告作者：</div>
                <div class="unitsCont">{{author?author:'无'}}</div>
              </div>
            </div>
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">报告分类：</div>
                <div class="unitsCont">{{levelTwo?levelTwo:'无'}}</div>
              </div>
            </div>
            <div class="smCaption">
              <div class="units nounits">
                <div class="unitsTitle">发布日期：</div>
                <div class="unitsCont">{{sentDate?sentDate:'无'}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-bottom-footer" @click="popupData.relative = false">
          <button class="share_btn">取消</button>
        </div>
      </popup>
    </div>
    <!---->
    <div class="popup-report-details" v-transfer-dom>
      <popup class="popup-bottom" v-model="popupData.collect" position="bottom">
        <h3 class="popup-bottom-title">收藏</h3>
        <div class="popup-bottom-content">
          <div class="collect_shg">
            <div class="inputgle">
              <input v-model="inputVal" type='text' @keyup.13="addFavourite()"
                     @input="createInput(40)" :placeholder='placeholders' class="createVal"/>
              <i class="icon iconfont icon-X closeInputVal" v-show="inputVal !=''"
                 @click="closeVal()"></i>
            </div>
            <div class="inputbtn">
              <button class='createDom' @click="addFavourite()">创建</button>
            </div>
          </div>
          <div class="am-collect-sns">
            <div class="collectMaxHeight">
              <ul class="default">
                <li class="collect-list" @click="addCollect('default')">
                  <div class="collect-item vux-1px-b">
                    <span class="defaultText">默认收藏夹</span>
                  </div>
                </li>
                <li class="collect-list create" v-for="(list,index) in collcell"
                    @click="addCollect(index)">
                  <div class="collect-item vux-1px-b">
                    <span class="defaultText">{{list.favouriteName}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="popup-bottom-footer" @click="popupData.collect = false">
          <button class="share_btn">取消</button>
        </div>
      </popup>
    </div>
    <!---->
    <div class="popup-report-details" v-transfer-dom>
      <popup class="popup-bottom" v-model="popupData.relevant" position="bottom">
        <h3 class="popup-bottom-title">相关内容</h3>
        <div class="popup-bottom-content">
          <ul class="am-relative-sns">
            <li v-for="(list,index) in newAttachment" @click="relevantLink(index)">
              <div style="text-align: left" class="vux-1px-b">{{ list.subject }}</div>
            </li>
          </ul>
          <ul class="am-relative-sns" v-show="RelativeSns">
            <li>暂无相关！</li>
          </ul>
        </div>
        <div class="popup-bottom-footer" @click="popupData.relevant = false">
          <button class="share_btn">取消</button>
        </div>
      </popup>
    </div>
    <!--目录侧边栏-->
    <return-top v-model="returnTop" @click="returnTo" style="bottom: 22%"></return-top>
    <xiaoan-loading v-show="loading" borderWidth="2px" width="20px"></xiaoan-loading>
    <xiaoan-error v-show="loadError"></xiaoan-error>
  </div>
</template>

<script>
  import loading from "../../components/warning/loading.vue"
  import {Popup, TransferDom} from 'vux'

  export default {
    name: 'detailRe',
    components: {
      'xiaoan-loading': loading,
      Popup
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        popupData: {
          relative: false,
          collect: false,
          relevant: false,
        },
        footerHome: {id: 0, name: '主页', value: '', icon: this.$image.base.home, isshow: false},
        returnTop: false,
        footerItem: [
          {
            id: 0,
            name: '基本信息',
            value: '',
            show: false,
            icon: this.$image.rules.Attribute,
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
        inputVal: '',
        IsActive: true,
        close: this.$image.personal.close,
        pdfimg: this.$image.report.pdf,
        titleName: '',
        scopesName: '',
        placeholders: '请输入新建收藏夹名称(最多40个字)',
        collcell: [],
        relevantList: [],
        loading: false,//是否加载中状态
        detailContents: "",
        pdfUrl: "",
        author: "",
        levelOne: "",
        levelTwo: '',
        sentDate: '',
        bottom: 10,
        pageTop: 1,
        newAttachment: [],
        loadError: false,
        RelativeSns: false,
        shareUrl: "",
      }
    },
    watch: {
      '$route'(to, from, next) {
        window.location.reload();
      }
    },
    created() {
      let userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      if (this.$cookie.isLogin()) {
      } else {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      this.rulesId = this.$route.query.id;
      this.loading = true;
      this.getReportDetails();//页面获取内容
    },
    mounted() {
      if (this.user_id) {
        // 有this.user_id
      } else {
        setTimeout(() => {
          this.IsActive = false;
          setTimeout(() => {
            this.IsActive = true;
          }, 5000)
        }, 2000)
      }
      this.$nextTick(() => {
        this.$refs.contTextDom.addEventListener('scroll', (e) => {
          e.stopPropagation();
          let isScrollTop = this.$refs.contTextDom.scrollTop;
          // console.log(isScrollTop);
          if (isScrollTop > 300) {
            this.returnTop = true;
          } else if (isScrollTop <= 300) {
            this.returnTop = false;
          }
        });
      })
    },
    updated() {
      this.textHeight();
    },
    methods: {
      footerClick(index) {
        if (index == 0) {
          this.popupData.relative = true;
        } else if (index == 1) {
          this.collectMethod();
        } else if (index == 2) {
          this.relativeMethod();
        }
      },
      // 动态设置屏幕内容高度
      textHeight() {
        this.$nextTick(() => {
          let winHeight = document.body.clientHeight;
          let anTitle = document.querySelector(".detailTitle").clientHeight;
          let anfoot = document.querySelector(".show_footer").clientHeight;
          let anpdf = document.querySelector(".pdfGlobal").clientHeight;
          let toheight = (winHeight - (anTitle + anfoot + anpdf)) + "px";
          document.querySelector("#content").style.height = toheight;
          // console.log(anTitle, anfoot, toheight, anpdf);
        })
      },
      //
      createInput(maxlength) {
        this.inputVal = this.$array.trim(this.inputVal);
        if (this.inputVal.length > maxlength) {
          this.inputVal = this.inputVal.substring(0, maxlength);
        }
      },
      // 返回顶部
      returnTo() {
        $("#content").animate({scrollTop: 0});
      },
      // 详情跳转到法规的主页
      returnHome() {
        console.log(',,,,', this.$route);
        this.$router.push({path: "/rule"});
      },
      //
      relativeMethod() {
        this.popupData.relevant = true;
      },
      //
      collectMethod() {
        console.log('userId=' + this.user_id);
        if (this.$cookie.isLogin()) {
          // you
          this.$nextTick(() => {
            this.popupData.collect = true;
            this.getFavourite();
            this.getDefault();
          })
        } else {
          console.log(window.location.href);
          // 主逻辑业务
          let title = '研报详情';
          this.$storage.loginStatus(this, title, window.location.href);
        }
      },
      // 增加收藏夹
      addFavourite() {
        $('.createVal').blur();
        if (this.inputVal.trim().length != 0) {
          let params = {
              favouriteName: this.inputVal,
              isDefault: 0
            }
          this.$axios.favourite.addFavourite(params).then(res => {
            if (res.data.returnCode == 1) {
              this.inputVal = '';
              document.querySelector('.closeInputVal').style.display = 'none';
              this.getFavourite();
              this.$vux.toast.show({text: '创建收藏夹成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else if (res.data.returnCode == 3) {
              this.$vux.toast.show({text: '收藏夹不能相同', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else if (res.data.returnCode == 2) {
              this.$vux.toast.show({text: '最多只能创建十个收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          }).catch((err) => {
            console.log(err)
          });
        }
      },
      // 根据用户id获取收藏夹
      getFavourite() {
        let params = {
            pageSize: this.bottom,
            pageIndex: this.pageTop
          }
        this.$axios.favourite.getFavourite(params).then(res => {
          console.log(res);
          console.log(res.data.returnObject);
          if (res.data.returnCode == 1) {
            this.collcell = res.data.returnObject.list;
            this.num = res.data.returnObject.list.length;
          }
        }).catch((err) => {
        });
      },
      // 获取默认收藏夹
      getDefault() {
        let params = {}
        this.$axios.favourite.getDefault(params).then(res => {
          this.getDefS = res.data.returnObject;
          console.log(this.getDefS.id, this.getDefS);
        }).catch((err) => {
          console.log(err);
        })
      },
      // 根据收藏夹添加
      addCollect(index) {
        let addcollect = {};
        if (index === 'default') {
          addcollect = {
            refId: this.rulesId, //文章id
            favourableId: this.getDefS.id,//文件夹id
            title: this.titleName,//标题名
            publishTime: this.relDate,//发布时间
            type: "report",//类型
          }
        } else {
          addcollect = {
            refId: this.rulesId, //文章id
            favourableId: this.collcell[index].id,//文件夹id
            title: this.titleName,//标题名
            publishTime: this.relDate,//发布时间
            type: "report",//类型
          }
        }
        this.$nextTick(() => {
          this.$axios.collect.addCollect(addcollect).then(res => {
            console.log(res);
            if (res.data.returnCode == 2) {
              this.$vux.toast.show({text: '你已添加进此收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else if (res.data.returnCode == 1) {
              this.$vux.toast.show({text: '收藏成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
              this.getDefault();
              this.getFavourite();
            } else {
              this.$vux.toast.show({text: '收藏失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          }).catch((err) => {
            console.error(err);
          })
        })
      },
      //
      closeVal() {
        if (this.inputVal.length != 0) {
          this.inputVal = '';
          document.querySelector('.createVal').focus();
        }
      },
      //
      getReportDetails() {
        let params = {
            id: this.rulesId,
          }
        this.$axios.report.getReportDetails(params).then(res => {
          this.loading = false;
          if (res.data.returnCode == 1) {
            let detailContents = res.data.returnObject.summary;
            let securitiesCompany = res.data.returnObject.securitiesCompany;
            if (detailContents == null) {
              this.detailContents = detailContents;
            } else {
              let detailContVal = [];
              if (securitiesCompany == '天风证券') {
                detailContVal = detailContents.split("\r\n");
              } else if (securitiesCompany == '国联证券') {
                detailContents = detailContents.replace(/<(?!(p|img|a)[ >])[^>/]*>/img, "");
                detailContVal = detailContents.split("<br />");
              }
              let detailContVal2 = this.$array.ImpArr(detailContVal); // 去除空元素
              let arr = [];
              for (let i = 0; i < detailContVal2.length; i++) {
                if (detailContVal2[i].indexOf('<p') > -1) {
                  detailContVal2[i] = this.$array.trim(detailContVal2[i])
                } else {
                  detailContVal2[i] = "<p>" + this.$array.trim(detailContVal2[i]) + "</p>";
                }
                arr.push(detailContVal2[i]);
              }
              console.log('123323', arr);
              let detailContVal3 = arr.join("");
              detailContVal3 = detailContVal3.replace("报告标题=", ""); // 剔除报告标题=
              detailContVal3 = detailContVal3.replace("报告日期=", ""); // 剔除报告日期=
              let val = "【报告摘要】";
              let reg = new RegExp('(' + val + ')', 'gm');
              this.detailContents = detailContVal3.replace(reg, "<h2 class='highlight'>$1</h2>");
            }
            this.titleName = res.data.returnObject.subject; // 标题
            window.document.title = this.titleName;
            this.pdfUrl = res.data.returnObject.pdfUrl; // pdf url
            var protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
            this.pdfUrl = this.pdfUrl.replace("http:", protocol);
            this.levelTwo = res.data.returnObject.levelTwo; // 分类
            this.levelOne = res.data.returnObject.levelOne; // 分类
            let industry = res.data.returnObject.industry;
            let id = res.data.returnObject.id;
            let companyCode = res.data.returnObject.companyCode;
            this.author = res.data.returnObject.author; // 作者名
            this.relDate = res.data.returnObject.sentDate;
            this.sentDate = this.$const.formatText(res.data.returnObject.sentDate); // 时间

            if (this.levelOne == "行业报告" && industry != "") {
              console.log(0);
              this.attachment0(industry, id);
            } else if (this.levelOne == "公司报告" && industry != "") {
              console.log(1);
              this.attachment1(industry, id, companyCode);
            } else {
              //综和
              this.attachment2(this.levelOne, id);
              console.log(2);
            }
            /***************/
            let adverttitle = document.title;
            let sharelink2 = window.location.href;//分享链接
            let shareDesc = "用信公小安，随时掌握最新研报";//描述
            this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
          }
        }).catch((err) => {
          this.loadError = true;
          this.loading = false;
          console.log(err);
        })
      },
      // /行业
      attachment0(levelOne, id) {
        let params = {
            pageNum: 1,
            pageSize: 5,
            industry: levelOne,
            id: id,
          }
        this.$axios.report.getRelatedIndutryReport(params).then(res => {
          if (res.data.returnCode == 1) {
            this.newAttachment = res.data.returnObject;
          } else {
            this.RelativeSns = true;
          }

        }).catch((err) => {
          this.RelativeSns = true;
        })
      },
      // 公司
      attachment1(levelOne, id, companyCode) {
        let params = {
            pageNum: 1,
            pageSize: 5,
            industry: levelOne,
            id: id,
            code: companyCode,
          }
        this.$axios.report.getRelatedCompanyReport(params).then(res => {
          if (res.data.returnCode == 1) {
            this.newAttachment = res.data.returnObject;
          } else {
            this.RelativeSns = true;
          }
        }).catch((err) => {
          this.RelativeSns = true;
        })
      },
      // 综合
      attachment2(levelOne, id) {
        let params = {
            pageNum: 1,
            pageSize: 5,
            type: levelOne,
            id: id
          }
        this.$axios.report.getRelatedIntegratedReport(params).then(res => {
          if (res.data.returnCode == 1) {
            this.newAttachment = res.data.returnObject;
          } else {
            this.RelativeSns = true;
          }
        }).catch((err) => {
          this.RelativeSns = true;
        })
      },
      //
      relevantLink(index) {
        this.$router.push({path: "", query: {id: this.newAttachment[index].id}})
      },
      // 离开当前页面后
      goPdf() {
        this.$router.push({
          path: "/pdfReport",
          query: {id: this.rulesId, url: this.pdfUrl, title: encodeURIComponent(this.titleName)}
        });
      }
    }
  }
</script>
<style lang="scss">
  .popup-report-details {
    .popup-bottom {
      max-height: 400px;
      background: white;
      font-size: 14px;
      border-radius: 0;
      text-align: center;
      width: 100%;
      z-index: 1200;
      .popup-bottom-title {
        width: 100%;
        height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #e3e3e3;
        color: #323232;
        margin: 0;
        font-size: 17px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        text-align: center;
        line-height: 50px;
      }
      .popup-bottom-content {
        //
        .rulesPlateHeader {
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 300px;
          -webkit-overflow-scrolling: touch;
          .rulesPlate {
            background-color: white;
            padding: 12px 12px 0 12px;
            font-size: 14px;
            text-align: left;
            color: #323232;
            .rulesGulop {
              padding-bottom: 12px;
              border-bottom: 0.5px solid #e3e3e3;
              .rulesfw {
                font-size: 15px;
                color: #323232;
              }
              .market {
                text-align: center;
                display: inline-block;
                padding: 0 5px;
                border-radius: 20px;
                font-size: 10px;
                border: 1px solid #f0ad4e;
                margin-right: 5px;
              }
            }
          }
          .smCaption {
            text-align: left;
            padding: 12px 12px 0 12px;
            color: #323232;
            .nounits {
              border-bottom: none !important;
            }
            .units {
              display: flex;
              flex-flow: row;
              color: #323232;
              font-size: 15px;
              padding-bottom: 12px;
              .unitsTitle {
              }
              .unitsCont {
                text-align: justify;
                flex: 1;
                box-sizing: border-box;
                .unitsName {
                }
              }
            }
          }
        }
        //
        .collect_shg {
          overflow: hidden;
          width: 100%;
          height: 50px;
          background-color: #f0f1f5;
          padding: 7.5px 12px;
          vertical-align: middle;
          .inputgle {
            height: 35px;
            width: 84%;
            background-color: #8d8d8d;
            border-radius: 2px;
            display: inline-block;
            float: left;
            border: 0;
            vertical-align: middle;
            position: relative;
            .createVal {
              border: 0;
              float: left;
              height: 35px;
              margin: 0;
              width: 100%;
              padding: 0 10% 0 12px;
              border-radius: 2px;
              outline: none;
              box-sizing: border-box;
              font-size: 15px;
            }
            .closeInputVal {
              line-height: 1;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 3%;
              color: #aeaeae;
            }
          }
          .inputbtn {
            height: 35px;
            width: 13%;
            border-radius: 2px;
            display: inline-block;
            float: right;
            vertical-align: middle;
            .createDom {
              float: right;
              border: 0;
              background-color: white;
              height: 35px;
              border-radius: 2px;
              font-size: 15px;
              width: 100%;
              padding: 0;
              color: #ffb148;
            }
          }
        }
        .am-collect-sns {
          background-color: #fff;
          width: 100%;
          max-height: 300px;
          margin: 0;
          list-style: none;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          font-size: 15px;
          color: #323232;
          .collectMaxHeight {
            width: 100%;
            max-height: 250px;
            .default {
              width: 100%;
              .collect-list {
                width: 100%;
                height: auto;
                padding: 0 12px;
                font-size: 15px;
                position: relative;
                overflow: hidden;
                text-align: left;
                .collect-item {
                  padding: 10px 0;
                  height: 100%;
                  .defaultText {
                    text-align: left;
                    color: #323232;
                  }
                }

              }
              .collect-list:last-child {
                .collect-item {
                  border-bottom: 0;
                }
              }
              .collect-list:active {
                background-color: #f0f1f5;
              }
            }
          }
        }
        //
        .am-relative-sns {
          background-color: #fff;
          width: 100%;
          max-height: 300px;
          overflow-y: scroll;
          margin: 0;
          list-style: none;
          -webkit-overflow-scrolling: touch;
          font-size: 15px;
          color: #323232;
          li {
            display: block;
            padding: 0 12.5px;
            div {
              padding: 12.5px 0;
            }
          }
          li:last-child {
            div {
              border-bottom: 0;
            }

          }
          li:active {
            background-color: #f0f1f5;
          }
        }
      }
      .popup-bottom-footer {
        width: 100%;
        height: 50px;
        font-size: 17px;
        font-family: PingFangSC-Medium, sans-serif;
        .share_btn {
          display: block;
          font-family: PingFangSC-Medium, sans-serif;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          text-align: center;
          line-height: 50px;
          background: white;
          color: #ffb148;
          border-top: 1px solid #eaeaea;
          font-size: 17px;
        }
      }
    }
  }
  .detailReport {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    position: relative;
    .detailTitle {
      padding: 15px 12px 15px 12px;
      border-bottom: 0.5px solid #e3e3e3;
      line-height: 26px;
      font-size: 20px;
      background-color: white;
      text-align: justify;
      font-family: PingFangSC-Medium, sans-serif;
      color: #323232 !important;
    }
    .shadow {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .4);
      z-index: 1111;
    }
    .clueActive {
      opacity: 0 !important;
      bottom: 55px !important;
    }
    .tt-clue {
      width: 120px;
      height: auto;
      line-height: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      text-align: center;
      border: 4px solid rgba(255, 177, 72, 0.9);
      text-indent: 0px;
      border-radius: 5px;
      position: absolute;
      pointer-events: none;
      background-color: rgba(255, 177, 72, 0.9);
      color: white;
      bottom: 62px;
      opacity: 1;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      -webkit-transition: all 1s ease-in-out;
      -moz-transition: all 1s ease-in-out;
      -o-transition: all 1s ease-in-out;
      -ms-transition: all 1s ease-in-out;
      transition: all 1s ease-in-out;
      &:before, &:after {
        content: '';
        position: absolute;
        bottom: -11px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid rgba(255, 177, 72, 0.9);
      }
    }
    #content {
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      height: 73%;
      overflow-y: auto;
      overflow-x: hidden;
    }
    #detailText {
      height: 100%;
      padding: 0 10px;
      font-family: PingFangSC-Regular, sans-serif;
    }
    .show_footer {
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      display: flex;
      z-index: 300;
      background: #f0f1f5;
      border-top: 1px solid #e3e3e3;
      box-shadow: 0 -8px 13px rgba(0, 0, 0, .02);
      -webkit-box-sizing: border-box;
      .show_items:hover .tt-clue {
        opacity: 0.9;
        bottom: 70px;
      }
      .footer-home:active {
        background-color: #e3e3e3;
        -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .footer-home {
        height: 100%;
        padding: 5px 15px;
        text-align: center;
        border-right: 1px solid #e3e3e3;
        text-decoration: none;
        box-sizing: border-box;
        .tabbar-Icon {
          margin: 0 auto;
          img {
            height: 19px;
          }
        }
        p {
          font-size: 12px;
          color: #767877;
        }
      }
      .show_items:active {
        background-color: #e3e3e3;
      }
      .show_items {
        -webkit-transition: all 0.07s ease-in-out;
        -moz-transition: all 0.07s ease-in-out;
        -o-transition: all 0.07s ease-in-out;
        -ms-transition: all 0.07s ease-in-out;
        transition: all 0.07s ease-in-out;
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
          margin: 0 auto;
          img {
            height: 20px;
          }
        }
        .tabbar-value {
          font-size: 12px;
          color: #767877;
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
    .pdfGlobal {
      width: 100%;
      height: 45px;
      padding: 0 12px;
      box-sizing: border-box;
      position: absolute;
      bottom: 50px;
      z-index: 500;
      background-color: #FFFFFF;
      .pdfreport {
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        height: 45px;
        line-height: 45px;
        background: #fff;
        .pdflink {
          display: inline-block;
          margin-left: 10px;
          text-decoration: underline;
          font-size: .4rem;
          color: #3D3DF2;
        }
        .pdfimg {
          height: 18px;
        }
      }
    }
  }
  #detail-contents {
    padding: 10px 0;
    text-align: justify;
    word-spacing: 0;
    color: #323232;
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 16px;
      margin: 5px 0;
      line-height: 20px;
      font-weight: normal;
    }
    p {
      font-size: 16px;
      margin: 16px 0;
      font-family: PingFangSC-Regular, sans-serif, PingFangSC-Thin, sans-serif, PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      text-align: justify;
      box-sizing: border-box;
      text-indent: 2em;
      word-break: break-all;
      line-height: 28px;
    }
    .MsoNormal{
      text-align: right;
    }

    h1, h1 * {
      padding: 0;
      margin: 0;
      line-height: 25px;
      font-size: 16px;
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
      font-size: 16px;
    }
    h3, h3 * {
      box-sizing: border-box;
      margin: 5px 0 5px 0;
      font-size: 16px !important;
      color: #323232 !important;
    }
    h4, h4 * {
      font-size: 16px;
      border-radius: 2px !important;
      margin: 5px 0 !important;
      text-indent: 2em !important;
      text-decoration: line-through !important;
    }
    h5, h5 * {
      margin: 0 !important;
      text-align: right !important;
      font-size: 16px !important;
      color: #323232;
      font-weight: normal !important;
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
  }
</style>
