<template>
  <div id="collectGroom" class="collectGroom xiaoan-box">
    <div class="collectGroom-scroll" id="scroll" ref="containerDom">
      <div class="collectGroomHead" v-if="headText!==null || headText !== ''">
        <div class="collectGroomHe">
          <div class="testingEnd-content-middle-item">
            <span class="testingEnd-content-middle1"><div></div></span>
            <span class="testingEnd-content-middle-text">推荐理由</span>
            <span class="testingEnd-content-middle2"><div></div></span>
          </div>
        </div>
        <div class="collectGroomHeadText">{{headText}}</div>
      </div>
      <div class="splitLine" v-show="headText!==null || headText !== ''"></div>
      <div v-if="isOutLine" class="getIsOutLine" v-html="isOutLine"></div>
      <!---->
      <div v-show="isPDFUrl" class="gitIDshow vux-1px-t">
        <div class="ioon" v-if="pdfArr.length==0">
          <img :src="pdf" alt="">
          <a :href="isPDFUrl">{{ isPDFName }}</a>
        </div>
        <div class="ioon pdfArrIoon" v-else v-for="list in pdfArr">
          <img :src="pdf" alt="">
          <a :href="list.url">{{ list.name }}</a>
        </div>
      </div>
      <!---->
      <ul class="collect-groom-content">
        <li v-for="(list,index) in groomArr" @click="goRulesCont(index)">
          <!--法规-->
          <div class="Tcentitem vux-1px-b" v-if="list.type =='law'">
            <!--法规-->
            <div class="TcentTilt">{{list.title}}</div>
            <div class="Tcentit">
              <span class="titleType" :style="{backgroundColor:'#90b8f4'}">法规</span>
              <span class="titleVal">{{list.dispatchUnit}}</span><!--发文字号-->
              <span class="titleVal" v-show="list.dispatchUnit">|</span>
              <span class="titleVal">{{list.timeliness}}</span><!--时效性-->
              <span class="titleVal" v-show="list.timeliness">|</span>
              <span class="titleVal">{{$const.format(list.releaseDate)}}</span><!--时效性-->
            </div>
          </div>
          <!--公告-->
          <div class="Tcentitem vux-1px-b" v-else>
            <div class="TcentTilt">{{list.title}}</div>
            <div class="Tcentit">
              <span class="titleType" :style="{backgroundColor:'#ffd091'}">公告</span>
              <span class="titleVal">{{$const.format(list.releaseDate)}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!---->
    <div class="collect-details-footer vux-1px-t" ref="tabbarDom">
      <div class="tabbar-items footer-home" @click="goHome">
        <div class="tabbar-icon">
          <img :src="footerHome.icon" alt="">
        </div>
        <p class="tabbar-value">{{footerHome.name}}</p>
      </div>
      <div class="tabbar-items" v-for="(list, index) in tabbarData" @click="footerClick(index)">
        <div class="tabbar-icon">
          <img :src="list.img" alt="">
        </div>
        <p class="tabbar-value">{{list.name}}</p>
      </div>
    </div>
    <!---->
    <div class="popup-groom-details" v-transfer-dom>
      <popup v-model="shareShow" class="ans-popup">
        <div class="collect-head">基本信息</div>
        <div class="shareCont">
          <div class="rulesPlate vux-1px-b">
            <div class="rulesGulop">
              <span class="rulesfw">适用范围：</span>
              <span v-for="list in scopesName">
              <span v-if="list == '沪市主板'" :style="{color:'#a9262c',borderColor:'#a9262c'}">沪主板</span>
              <span v-else-if="list == '深市主板'" :style="{color:'#174299',borderColor:'#174299'}">深主板</span>
              <span v-else-if="list == '深市中小板'" :style="{color:'#174299',borderColor:'#174299'}">中小板</span>
              <span v-else-if="list == '深市创业板'" :style="{color:'#174299',borderColor:'#174299'}">创业板</span>
              <span v-else-if="list == '新三板'" :style="{color:'#f6900c',borderColor:'#f6900c'}">新三板</span>
          </span>
            </div>
          </div>
          <div class="smCaption vux-1px-b">
            <div class="units">
              <div class="unitsTitle">清单名称：</div>
              <div class="unitsCont">
                <span class="unitsName unit" v-if="heightTitle">{{heightTitle}}</span>
                <span class="unitsName unit" v-else>无</span>
              </div>
            </div>
          </div>
          <div class="smCaption vux-1px-b">
            <div class="units">
              <div class="unitsTitle">清单作者：</div>
              <div class="unitsCont">
                <span class="unitsName unit" v-if="unitss">{{unitss}}</span>
                <span class="unitsName unit" v-else>无</span>
              </div>
            </div>
          </div>

          <div class="smCaption vux-1px-b">
            <div class="units">
              <div class="unitsTitle">发布日期：</div>
              <div class="unitsCont" v-if="releaseStart">{{releaseStart}}</div>
              <div class="unitsCont" v-else-if="releaseStart">无</div>
            </div>
          </div>
          <div class="smCaption">
            <div class="units nounits">
              <div class="unitsTitle">更新日期：</div>
              <div class="unitsCont" v-if="releaseEnd">{{releaseEnd}}</div>
              <div class="unitsCont" v-else>无</div>
            </div>
          </div>
        </div>
        <button class="collect-foot" @click="shareShow = false">取消</button>
      </popup>
    </div>
    <!---->
    <div class="popup-groom-details" v-transfer-dom>
      <popup v-model="relativeShow" class="ans-popup">
        <div class="collect-head link_head">相关内容</div>
        <div class="linkGal">
          <div v-for="(list,index) in relatedQuestion" class="linkList">
            <div @click="linkRulesContent(index)" class="linkBtn">{{list.title}}</div>
          </div>
          <div v-show="relatedQuestion.length == 0" class="linkList">
            <div class="linkBtn" style="text-align: center">没有相关内容！</div>
          </div>
        </div>
        <button class="collect-foot" @click="relativeShow = false">取消</button>
      </popup>
    </div>
    <!---->
    <return-top v-model="returnTop" @click="returnTo" style="bottom: 15%"></return-top>
    <xiaoan-loading v-show="false"></xiaoan-loading>
  </div>
</template>

<script>
  import XiaoanLoading from "@/components/warning/loading"
  import {Popup, TransferDom} from 'vux'

  export default {
    name: 'collectGroom',
    directives: {
      TransferDom
    },
    components: {
      XiaoanLoading,
      Popup
    },
    data() {
      return {
        returnTop: false,
        footerHome: {id: 0, name: '主页', value: '', icon: this.$image.base.home, isshow: false},
        tabbarData: [
          {name: "基本信息", type: "attribute", show: true, selected: false, img: this.$image.rules.Attribute},
          {name: "订阅", type: "groom", show: false, selected: true, img: this.$image.personal.groomCl},
          {name: "相关内容", type: "relative", show: false, selected: false, img: this.$image.rules.linkIcon},
        ],
        goText: '主页',
        headText: "",
        toNumber: '',
        groomArr: [],
        pdf: this.$image.personal.pdf,
        shareIcon: this.$image.rules.Attribute,
        collectIcon: this.$image.personal.groomCl,
        relativeIcon: this.$image.rules.linkIcon,
        collectShow: false,
        relativeShow: false,
        shareShow: false,
        relatedQuestion: [],
        user_id: '',
        pageTop: 1,
        bottom: 10,
        getDefId: '',
        isOutLine: "",//演讲提纲
        isPDFName: "",//演讲pdf
        isPDFUrl: "",//演讲pdf地址
        pdfNameArr: [],
        pdfUrlArr: [],
        pdfArr: [],
        /**/
        titles: "",
        toId: '',
        scopesName: [],
        referenceNumber: '',
        releaseStart: '',
        releaseEnd: '',
        unitss: "",
        heightTitle: '',
        isCollects: 0,
        gitToId: false,
        getID: 0,
      }
    },
    watch: {
      $route: function (to, from) {
        window.location.reload();
      },
      isCollects: function (val) {
        if (val == 1) {
          this.tabbarData[1].name = '已订阅';
        } else {
          this.tabbarData[1].name = '订阅';
        }
      }
    },
    created() {
      var userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      if (this.$cookie.isLogin()) {
        // 获取路由上的id
        this.toId = this.$route.query.id;
        this.titles = this.$route.query.title;
        if (this.titles !== undefined) {
          window.document.title = decodeURI(this.titles);
        } else {
          window.document.title = "推荐内容";
        }
      } else {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
    },
    mounted() {
      if (this.user_id) {
        this.$nextTick(() => {
          this.groom();
          this.getRecommendCollectAttr();
        })
      }
      this.$nextTick(() => {
        this.$refs.containerDom.addEventListener('scroll', (e) => {
          e.stopPropagation();
          let isScrollTop = this.$refs.containerDom.scrollTop;
          if (isScrollTop > 300) {
            this.returnTop = true;
          } else if (isScrollTop <= 300) {
            this.returnTop = false;
          }
        });
      });
    },
    methods: {
      returnTo() {
        $('#scroll').animate({scrollTop: 0});
      },
      //
      footerClick(index) {
        console.log(index, this.tabbarData[index]);
        switch (this.tabbarData[index].type) {
          case 'attribute':
            this.shareShows();
            break;
          case 'groom':
            this.collectShows();
            break;
          case 'relative':
            this.relativeShows();
            break;
        }
      },
      // 详情跳转到法规的主页
      goHome() {
        this.$nextTick(() => {
          this.$router.push({path: "/rule"});
        })
      },
      shareShows() {
        this.shareShow = true;
      },
      //点击订阅
      collectShows() {
        console.log("", this.toId);
        if (this.isCollects == 0) {
          let params = {
              recommendId: this.toId
            }
          this.$axios.recommend.collectRecommend(params).then(res => {
            console.log("订阅成功", res);
            if (res.data.returnCode == 1) {
              this.isCollects = 1;
              this.$vux.toast.show({text: '订阅成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else {
              this.isCollects = 0;
            }
          }).catch((err) => {
            console.log('订阅', err)
          });
        } else if (this.isCollects == 1) {
          let params={
              recommendId: this.toId,
            }
          this.$axios.recommend.deleteUserCollectRecommend(params).then(res => {
            console.log("删除成功", res);
            if (res.data.returnCode == 1) {
              this.isCollects = 0;
              this.$vux.toast.show({text: '取消订阅成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else {
              this.isCollects = 1;
            }
          }).catch((err) => {
            console.log(err)
          });
        }
      },
      // 下面
      getRecommendCollectAttr() {
        let params = {
            recommendId: this.toId
          }
        this.$axios.recommend.getRecommendCollectAttr(params).then(res => {
          console.log("请求成功", res);
          if (res.data.returnCode == 1) {
            this.releaseStart = res.data.returnObject.recommendAttr.releaseTime; // 发布
            this.releaseStart = this.$const.formatText(this.releaseStart);
            this.releaseEnd = res.data.returnObject.recommendAttr.effectTime; // 更新
            this.releaseEnd = this.$const.formatText(this.releaseEnd);
            var markets = res.data.returnObject.recommendAttr.market; // 板块
            this.unitss = res.data.returnObject.recommendAttr.dispatchUnit; // 发文单位
            this.headText = res.data.returnObject.recommendAttr.descrip; // 发文单位
            this.heightTitle = res.data.returnObject.recommendAttr.title; // yiyle
            this.isCollects = res.data.returnObject.recommendAttr.isCollect; // yiyle
            this.isOutLine = res.data.returnObject.recommendAttr.outline; // yiyle
            this.isPDFName = res.data.returnObject.recommendAttr.pdfName; // yiyle
            this.isPDFUrl = res.data.returnObject.recommendAttr.pdfUrl; // yiyle
            if (this.isPDFUrl == null || this.isPDFName == null) {
              console.log("aaaa");
            } else {
              if (this.isPDFName.indexOf('&') > -1 && this.isPDFUrl.indexOf('&') > -1) {
                this.pdfArr = [];
                this.pdfNameArr = this.isPDFName.split('&');
                this.pdfUrlArr = this.isPDFUrl.split('&');
                this.pdfNameArr.forEach((item, index) => {
                  var obj = {name: this.pdfNameArr[index], url: this.pdfUrlArr[index]};
                  this.pdfArr.push(obj);
                })
              }
            }
            this.scopesName = markets.split("，");
            this.relatedQuestion = res.data.returnObject.relatedList;
            this.$nextTick(() => {
              $(".getIsOutLine span").removeAttr("style");
            });
            //
            var adverttitle = decodeURI(window.document.title);
            var sharelink2 = window.location.href;//分享链接
            var shareDesc = this.headText == "" ? "上市公司、专业机构移动董办工具首选！" : this.headText;//描述
            this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
          } else {
          }
        }).catch((err) => {
          console.log('getRecommendCollectAttr', err);
          // this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      relativeShows() {
        this.relativeShow = true;
      },
      //
      linkRulesContent(index) {
        this.relativeShow = false;
        setTimeout(() => {
          this.$nextTick(() => {
            this.$router.push({
              path: '/collectGroom',
              query: {
                id: this.relatedQuestion[index].recommendId,
                title: this.relatedQuestion[index].title
              }
            });
          })
        }, 200);
      },
      // 处理。。。获取列表
      groom() {
        let params = {
            recommendId: this.toId
          }
        this.$axios.recommend.getRecommendDetails(params).then(res => {
          this.groomArr = res.data.returnObject;
        }).catch((err) => {
          console.log(err);
        })
      },
      //
      goRulesCont(index) {
        $("input").blur();
        setTimeout(() => {
          this.$nextTick(() => {
            //console.log("43534543",this.groomArr[index]);
            if (this.groomArr[index].type == 'law') {
              this.$router.push({
                path: '/rule/details',
                query: {id: this.groomArr[index].refId}
              });
            } else {
              this.$router.push({path: '/afficheContent', query: {id: this.groomArr[index].refId}});
            }
          })
        }, 200);
      }
    }
  }
</script>

<style lang="scss">
  .collectGroom {
    padding-bottom: 48px;
    background-color: #FFFFFF;
    .collectGroom-scroll {
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .collectGroomHead {
        height: auto;
        box-sizing: border-box;
        padding: 0 12px;
        .collectGroomHe {
          box-sizing: border-box;
          padding: 17.5px 0 12.5px 0;
        }
        .testingEnd-content-middle-item {
          text-align: center;
          color: #ffb551;
          .testingEnd-content-middle1, .testingEnd-content-middle2 {
            width: 60px;
            height: 2px;
            display: inline-block;
            box-sizing: border-box;
            border-bottom: 1px solid #E3E3E3;
            position: relative;
            top: -5px;
          }
          // .testingEnd-content-middle1 div {
          //   height: 3px;
          //   width: 3px;
          //   background-color: #ffb551;
          //   position: absolute;
          //   border-radius: 50%;
          //   right: 0;
          //   top: 0;
          // }
          .testingEnd-content-middle2 div {
            height: 3px;
            width: 3px;
            background-color: #ffb551;
            position: absolute;
            border-radius: 50%;
            left: 0;
            top: 0;
          }
          .testingEnd-content-middle-text {
            padding: 0 3px;
            font-size:13px;
            font-weight:400;
            color:rgba(40,50,65,1);

          }
        }
        .collectGroomHeadText {
          letter-spacing: 0;
          font-size: 13px;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          color: #8d8d8d;
          line-height: 19px;
          text-align: justify;
          padding-bottom: 17.5px;
        }
      }
      .splitLine {
        height: 7.5px;
        background-color: #f0f1f5;
      }
      .getIsOutLine {
        padding: 8px 12px;
        h3, h2, h1 {
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          font-size: 15px;
          color: #323232;
          padding: 5px 0;
          box-sizing: border-box;
        }
        h1 {
          text-align: center;
          * {
            padding: 0;
            margin: 0;
            font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica !important;
          }
        }
        h2 {
          * {
            padding: 0;
            margin: 0;
            font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica !important;
          }
        }
        p {
          text-indent: 2em;
          padding: 2px 0;
          box-sizing: border-box;
          font-size: 15px;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          color: #323232;
          /*color: rgba(0, 0, 0, 0.6);*/
        }
      }
      .collect-groom-content {
        li {
          padding: 0 12px;
          &:active {
            background-color: #f0f1f5;
          }
          .Tcentitem {
            box-sizing: border-box;
            .TcentTilt {
              overflow: hidden;
              text-align: justify;
              font-size: 15px;
              color: #323232;
              padding: 15px 0 0 0;
              font-family: PingFangSC-Medium, sans-serif, "Microsoft Yahei", "Helvetica";
              line-height: 19px;
            }
            .Tcentit {
              padding-bottom: 15px;
              padding-top: 6px;
              box-sizing: border-box;
              font-size: 12px;
              .titleType {
                height: 16px;
                width: 28px;
                line-height: 16px;
                text-align: center;
                display: inline-block;
                border-radius: 2px;
                color: white;
                font-size: 12px;
              }
              .titleVal {
                font-size: 12px;
                color: #8d8d8d;
              }
            }
          }
        }
      }
      .gitIDshow {
        color: #323232;
        font-size: 15px;
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        .foo {
          height: 7.5px;
          background-color: #f0f1f5;
          width: 100%;
        }
        a {
          text-decoration: none;
          color: #323232;
          /*padding: 0 12px;*/
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          font-size: 15px;
          display: table-cell;
          box-sizing: border-box;
          vertical-align: middle;
          &:active {
            color: #ffb148;
            text-decoration: underline;
          }
        }
        .ioon {
          padding: 15px 12px;
          display: table;
          width: 100%;
          box-sizing: border-box;
          img {
            width: 19px;
            display: table-cell;
          }
        }
        .pdfArrIoon:first-child {
          padding-bottom: 0;
        }
      }
    }
    .collect-details-footer {
      position: absolute;
      z-index: 500;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background-color: #F7F7FA;
      display: flex;
      //
      .tabbar-items:hover .tt-clue {
        opacity: 0.9;
        bottom: 70px;
      }
      .footer-home:active {
        background-color: #e3e3e3;
        -webkit-transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .tabbar-items.footer-home {
        text-align: center;
        border-right: 1px solid #e3e3e3;
        flex: 0 0 15%;
      }
      .tabbar-items {
        flex: 1;
        height: 100%;
        text-align: center;
        color: #767877;
        font-size: 12px;
        text-decoration: none;
        padding: 6px 0 5px 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        position: relative;
        .tabbar-icon {
          font-size: 0;
          img {
            height: 17px;
          }
        }
        .tabbar-value {
          font-size: 12px;
          color: #767877;
          padding-top: 3px;
        }
      }
      .tabbar-items.active {
        color: #f6900c;
      }
      .tabbar-items span {
        display: block;
        width: 100%;
      }
    }
  }
  .popup-groom-details {
    .ans-popup {
      height: auto;
      background-color: white;
      width: 100%;
      .collect-head {
        height: 50px;
        width: 100%;
        color: #323232;
        background-color: white;
        line-height: 50px;
        text-align: center;
        border-bottom: 1px solid #e3e3e3;
        margin: 0;
        font-size: 17px;
        box-sizing: border-box;
        font-family: PingFangSC-Medium, sans-serif, "Microsoft Yahei", "Helvetica";
      }
      .shareCont {
        padding: 0 12px;
        box-sizing: border-box;
        .rulesPlate {
          background-color: white;
          padding: 12px 0 0 0;
          font-size: 14px;
          text-align: left;
          color: #323232;
        }
        .rulesPlate .rulesGulop {
          padding-bottom: 12px;
        }
        .rulesPlate .rulesfw {
          font-size: 15px;
          color: #323232;
        }
        .rulesPlate div > span > span {
          text-align: center;
          display: inline-block;
          padding: 0 5px;
          border-radius: 20px;
          font-size: 10px;
          border: 1px solid #f0ad4e;
          margin-right: 5px;
        }
        .smCaption {
          text-align: left;
          padding: 12px 0 0 0;
        }
        .smCaption .units {
          display: flex;
          color: #323232;
          font-size: 15px;
          padding-bottom: 12px;
          box-sizing: border-box;
        }
        .nounits {
          border-bottom: none !important;
        }
        .unitsTitle {
          display: inline-table;
        }
        .unitsCont {
          text-align: justify;
          max-width: 79%;
        }
      }
      .linkGal {
        max-height: 300px;
        padding: 0 12px;
        height: auto;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .linkList {
          color: #323232;
          font-size: 15px;
          line-height: 16px;
          box-sizing: border-box;
          border-bottom: 0.5px solid #f0f1f5;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          &:last-child {
            border-bottom: none;
          }
          .linkBtn {
            border: 0;
            box-shadow: none;
            background-color: white;
            width: 100%;
            height: auto;
            font-size: 15px;
            text-align: left;
            padding: 17.5px 0;
            color: #323232;
          }
        }
      }
      .collect-foot {
        width: 100%;
        height: 50px;
        border: 0;
        background-color: #fff;
        box-shadow: none;
        border-top: 1px solid #e3e3e3;
        font-size: 17px;
        color: #ffb148;
        line-height: 50px;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
      }
    }

  }
</style>
