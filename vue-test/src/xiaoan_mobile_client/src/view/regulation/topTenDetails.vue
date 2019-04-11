<template>
  <div class="xiaoan-box topTenDetails" id="topTenDetails" ref="rulesListBoxDom">
    <div class="rules-list-scroll" ref="rulesListDom">
      <!--内容页-->
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
      <div class="wrapper" id="wrapper" v-if="codification.length > 0">
        <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="50">
          <li class="anList" v-for="(list,index) in codification" :key="index" @click="goCount(list)">
            <div class="anListName">
              <span style="letter-spacing: 0; ">{{list.title}}</span>
            </div>
            <div class="anListState vux-1px-b">
              <span v-show="list.dispatchUnit">{{list.dispatchUnit}}</span>
              <span v-show="list.dispatchUnit && list.releaseDate">|</span>
              <span v-show="list.releaseDate">{{$const.format(list.releaseDate)}}</span>
            </div>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoadeded"></xiaoan-drop>
        </p>
      </div>
      <!---->
      <!-- <div class="noTrySenior" v-show="trySeniorDis">
        <div class="trySenior">
          <img src="/static/img/rules/trySenior.png" alt="全文检索">
          <div class="tryText" @click="popupShow">
            <span class="trytext scroll-trytext">搜索不到想要的内容，试试看全文检索吧！</span>
            <span class="tryimg"></span>
          </div>
        </div>
      </div> -->
      <div class="noInfo" v-if="noInfoShow">
        <div class="trySenior" style="width:100%" :class="{trySeniorShow:noInfoShow}">
          <img src="/static/img/rules/trySenior.png" alt="全文检索">
          <div class="tryText" style="display: flex;justify-content: center;width:100%;">
            <span class="trytext" style="margin-left:0;">搜索不到相关内容</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import loading from "@/components/warning/loading"
  import {Popup, TransferDom, Box, Icon, Cell} from 'vux'

  export default {
    name: 'topTenDetails',
    components: {
      "xiaoan-loading": loading,
      Popup,
      Box,
      Icon,
      Cell
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        num: 1,
        top: 1,
        bottom: 20,
        sortType: '',
        ruleslist: [],  //搜索结果列表数组
        shadowLoading: false,
        noInfoShow: false,
        Newarr: [], /* Newarrs: ["上市规则", '规则规则规则', "海洋规则规则规则规则"],*/
        newTitleKey: [],
        onloadOpen: true, //加载更多的开关  上滑加载的时候让它关闭 内容加载完成后让它开启
        yeahFlag: false, //点击确认提交筛选条件开关  选择完筛选条件后 点击确认yeahFlag为true 没有点击则为false 此时选中状态的样式是不应该有的 重置后再次设为false
        Number: '',
        infLoading: true,
        loading: false,
        allLoaded: false,
        allLoadeded: true,
        trySeniorShow: false,//没有搜索结果时候
        codification: [],
        detailsId: '',
        headText: ''
      }
    },
    created() {
      if (this.$cookie.isLogin()) {
        // 有
        console.log('有登录的情况');
        // if (window.localStorage.getItem('lisTitleName')) {
        //   let title = JSON.parse(window.localStorage.getItem('lisTitleName')).join('');
        //   window.document.title = title;
        // }
        if (this.$route.query.id) {
          this.detailsId = this.$route.query.id;
          this.getRecommendDetails();
          this.getRecommendCollectAttr();
        }
      } else {
        // 无
        console.log('没有登录的情况');
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }

    },
    methods: {
      //
      getRecommendCollectAttr() {
        this.$http({
          method: "GET",
          url: this.$api.recommend.getRecommendCollectAttr,
          params: {
            recommendId: this.detailsId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.headText = res.data.returnObject.recommendAttr.descrip;
            this.$nextTick(() => {
              window.document.title = res.data.returnObject.recommendAttr.title;
              let adverttitle =  window.document.title
              let sharelink2 = decodeURI(this.$api.CURRENTIP.IP + '#/topTenDetails?id=' + this.detailsId);// 分享链接
              let shareDesc = "";
              console.log(sharelink2);
              console.log(adverttitle);
              this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
            });
          }
        }).catch(err => {
        })
      },
      // 获取法规详情
      getRecommendDetails() {
        this.$http({
          method: "GET",
          url: this.$api.recommend.getRecommendDetails,
          params: {
            recommendId: this.detailsId
          }
        }).then((res) => {
        if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.codification = res.data.returnObject;
            if (this.codification.length < 5) {
              this.infLoading = false;
            }
            if (res.data.returnObject == null || res.data.returnObject == []) {
              this.noInfoShow = true;
              this.infLoading = false;
            } else {
              this.noInfoShow = false;
            }
          } else {
            this.noInfoShow = true;
            this.infLoading = false;
          }
        }).catch(err => {
          this.noInfoShow = true;
        })
      },
      loadMore() {
        this.shadowLoading = false;
        let lastValue = this.rulesListNum;
        if (lastValue < this.num) {
          this.loading = true;
          this.allLoadeded = true;
        } else {
          this.loading = false;
          this.allLoadeded = false;
          return
        }
        if (lastValue < this.num) {
          this.top += 1;
          // this.targetStr();//防止参数错误
          this.lawScarch();
          this.yeahFlag = false; //滚动触发的确认方法 开关为fals
          this.onloadOpen = false;
        }
        setTimeout(() => {
          this.allLoadeded = false;
          this.loading = false;
        }, 1000)
      },
      // 点击推荐使用高级搜索 弹出高级搜索侧边栏
      showSenior() {
      },
      //点击详情 存储状态
      goCount(list) {
        this.$router.push({
          path: '/rulesCount',
          query: {id: list.refId}
        })
      }
    }
  }
</script>
<style lang="scss">
  .xiaoan-box.topTenDetails {
    .rules-list-scroll {
      height: 100%;
      width: 100%;
      background-color: #FFFFFF;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      #wrapper {
        padding-top: 0;
        padding-bottom: 50px;
        position: relative;
        width: 100%;
        height: auto !important;
        overflow: hidden;
      }
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
            border-bottom: 0.5px solid #ffb551;
            position: relative;
            top: -5px;
          }
          .testingEnd-content-middle1 div {
            height: 3px;
            width: 3px;
            background-color: #ffb551;
            position: absolute;
            border-radius: 50%;
            right: 0;
            top: 0;
          }
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
            padding: 0 6px 0 6px;
            font-size: 15px;
            font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          }
        }
        .collectGroomHeadText {
          letter-spacing: 0;
          font-size: 13px;
          font-family: PingFangSC-Light, sans-serif, Microsoft Yahei, Helvetica;
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
    }
  }
  input[type="date"]::-webkit-clear-button {
    display: none;
  }
  .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
  .anListName div span > span {
    margin-right: 0 !important;
  }
  .anListName div span > span > span {
    margin-right: 0 !important;
  }
  #LoadScroll {
    margin-bottom: 30px;
  }

</style>
<style scoped lang="scss">
  #topTenDetails .show {
    display: block;
  }
  #topTenDetails .scroll-trytext {
    text-decoration: none;
    border-bottom: 0.5px solid;
    color: #ffb148;
    font-size: 15px;
  }
  .tryimg {
    width: 8px;
    height: 14px;
    display: inline-block;
    background-image: url("/static/img/rules/rightOrange.png");
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: -2px;
    margin-left: 8px;
  }
  #topTenDetails .anList {
    padding: 0 12px;
    font-size: 0;
    text-align: justify;
    background-color: white;
  }
  #topTenDetails .anList:active {
    background-color: #f0f1f5;
  }
   .noInfo, .noTrySenior {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 90px;
    left: 0;
    /* z-index: 5;*/
    padding: 0 12.5px;
    box-sizing: border-box;
    background: #fff;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .trySenior {
    position: absolute;
    left: 0;
    top: 90px;
    right: 0;
    margin: auto;
    width: 100%;
    height: 125px;
    text-align: center;
    background-color: white;
    img {
      display: block;
      width: 110px;
      height: 95px;
      margin: 0 auto 25px;
    }
    .trytext {
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      font-size: 15px;
      color: #ffb148;
      margin-left: -12.5px;
    }
    .seniorButton {
      background: #ffb148;
      position: absolute;
      left: 0;
      top: 175px;
      right: 0;
      margin: auto;
      width: 90px;
      height: 30px;
      border-radius: 2px;
      font-size: 15px;
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      color: #fff;
      line-height: 30px;
    }
  }
  .anListName {
    font-size: 15px;
    padding: 18px 0 0 0;
    margin-bottom: 10px;
    /* background-color: white;*/
    box-sizing: border-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: clip;
    line-height: 19px;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    .star-icon {
      fill: #FFB148;
      position: relative;
      top: 2px;
      left: 5px;
    }
  }
  .anListName div {
    width: 100%;
    word-spacing: normal;
  }
  .anListName span:first-child {
    margin-right: -0.4em;
  }
  .anListName > div > span {
    margin-right: -0.4em;
  }
  .anListState {
    font-size: 12px;
    padding: 0 0 18px 0;
    color: #aeaeae;
    margin-top: -3px;
  }
  #topTenDetails .seniorText {
    padding: 0 12px;
    display: flex;
    text-align: justify;
    background-color: white;
    width: 100%;
    height: 70px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  #topTenDetails .seniorText span:active {
    /*color: white;*/
    border-bottom-color: white;
  }
  .colorBtn {
    background-color: #fef3e4 !important;
    color: #ffb148 !important;
  }
  #topTenDetails .searchCont {
    padding: 5px 0;
  }
  #topTenDetails .Matter-span {
    display: inline-block;
    font-size: 15px;
    width: 40%;
    text-align: right;
    box-sizing: border-box;
    padding-right: 10px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #topTenDetails .titleTip, #topTenDetails .titleTip1 {
    font-size: 12px;
    box-sizing: border-box;
    padding-left: 40%;
    color: red;
    display: none;
  }
  .itemTip {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    margin-right: 7px;
    border: 0.5px solid #e3e3e3;
    background-color: #f6f7f9;
  }
  .ruleslist .shadow {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1550;
    background: rgba(0, 0, 0, .5);
    overflow: hidden;
    border-radius: 0;
    box-shadow: none;
  }
  img[src=''] {
    opacity: 0 !important;
  }
  input:focus {
    outline: none !important;
    -webkit-appearance: none;
  }
  .showPrompt {
    height: 45px;
    width: 100%;
    color: #ffffff;
    background-color: rgba(255, 153, 51, 0.85);
    position: absolute;
    bottom: 49.5px;
    text-align: center;
    line-height: 45px;
    font-size: 15px;
    opacity: 0;
  }
</style>
