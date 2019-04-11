<template>
  <div class="xiaoan-box topTenRules" id="topTenRules" ref="rulesListBoxDom">
    <div class="rules-list-scroll" ref="rulesListDom">
      <!--内容页-->
      <div class="wrapper" id="wrapper">
        <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="50">
          <li class="anList" v-for="(list,index) in codification" :key="index" @click="goCount(list)">
            <div class="anListName">
              <span style="letter-spacing: 0; vertical-align: middle; margin-right: 8px">{{list.title}}</span>
              <i v-for="(item, index) in 5" :key="index">
                <img v-if="item <= list.starNum" class="star-icon" :src="$image.rules.star" alt="">
                <img v-else class="star-icon" :src="$image.rules.grayStar" alt="">
                <!-- <img v-for="(item, index) in list.starNum" :key="index" class="star-icon" src="/static/img/rules/star.png" alt="">
                <img v-for="(item, index) in (5-list.starNum)" :key="index" class="star-icon" src="/static/img/rules/grayStar.png" alt=""> -->
              </i>
            </div>
            <div class="vux-1px-b"></div>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoadeded"></xiaoan-drop>
        </p>
      </div>
      <div class="noInfo" v-if="noInfoShow">
        <div class="trySenior" style="width:100%" :class="{trySeniorShow:noInfoShow}">
          <img :src="$image.rules.trySenior" alt="全文检索">
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
    name: 'topTenRules',
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
        ruleList: [
        {'退市新规': 5, level: 1},
        {'回购新规': 5, level: 2},
        {'公司治理': 4, level: 3},
        {'CDR新规': 4, level: 4},
        {'停复牌新规': 4, level: 5},
        {'重组新规': 4, level: 6},
        {'纪律处分和监管措施': 4, level: 7},
        {'公告格式': 3, level: 8},
        {'行业指引新规': 3, level: 9},
        {'高送转新规': 3, level: 10}
        ]
      }
    },
    created() {
      if (this.$cookie.isLogin()) {
        // 有
        console.log('有登录的情况');
        this.getRecommendCollectFavoriteAll();
      } else {
        // 无
        console.log('没有登录的情况');
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }

    },
    methods: {
      // 获取法规汇编
      getRecommendCollectFavoriteAll() {
        this.$http({
          method: "GET",
          url: this.$api.law.getRecommendCollectFavoriteAll,
          params: {
            userId: this.$cookie.getCookie('userId'),
            pageNum: 1,
            pageSize: 1000
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let arr = res.data.returnObject.favoriteList.slice(res.data.returnObject.favoriteList.length - 10)
            this.codification = arr;
              this.codification.forEach((item, index) => {
                for (let i = 0; i < this.ruleList.length; i++) {
                  for (let key in this.ruleList[i]) {
                    if (item.title.indexOf(key) != -1) {
                      this.codification[index].starNum = this.ruleList[i][key];
                      this.codification[index].level = this.ruleList[i].level;
                    }
                  }
                }
              })
              this.codification = this.codification.sort((a, b) => {
                return a['level'] - b['level']
              })
              console.log(this.codification);
            if (res.data.returnObject.favoriteList == null || res.data.returnObject.favoriteList == []) {
              this.noInfoShow = true;
            } else {
              this.noInfoShow = false;
            }
            let adverttitle = '2018年资本市场十大新规'
            let sharelink2 = decodeURI(this.$api.CURRENTIP.IP + '#/topTenRules');// 分享链接
            let shareDesc = "";
            this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
          } else {
            this.noInfoShow = true;
          }
        }).catch(err => {
          this.noInfoShow = true;
        });
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
          // this.lawScarch();
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
      /**/
      //点击详情 存储状态
      goCount(list) {
        this.$router.push({
          path: '/topTenDetails',
          query: {id: list.id}
        })
      }
    }
  }
</script>
<style lang="scss">
  .xiaoan-box.topTenRules {
    .rules-list-scroll {
      height: 100%;
      width: 100%;
      background-color: #FFFFFF;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      #wrapper {
        padding-top: 0px;
        padding-bottom: 50px;
        position: relative;
        width: 100%;
        height: auto !important;
        overflow: hidden;
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
  #topTenRules .show {
    display: block;
  }
  #topTenRules .scroll-trytext {
    text-decoration: none;
    border-bottom: 0.5px solid;
    color: #ffb148;
    font-size: 15px;
  }
  .tryimg {
    width: 8px;
    height: 14px;
    display: inline-block;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/rightOrange.png");
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: -2px;
    margin-left: 8px;
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
  #topTenRules .anList {
    padding: 0 12px;
    font-size: 0;
    text-align: justify;
    background-color: white;
  }
  #topTenRules .anList:active {
    background-color: #f0f1f5;
  }
  .anListName {
    font-size: 15px;
    font-weight: bold;
    // vertical-align: top;
    padding: 15px 0;
    box-sizing: border-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 19px;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    .star-icon {
      vertical-align: middle;
      width: 15px;
      height: 15px;
      margin-right: 3px;
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
  #topTenRules .seniorText {
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
  #topTenRules .seniorText span:active {
    /*color: white;*/
    border-bottom-color: white;
  }
  .colorBtn {
    background-color: #fef3e4 !important;
    color: #ffb148 !important;
  }
  #topTenRules .searchCont {
    padding: 5px 0;
  }
  #topTenRules .Matter-span {
    display: inline-block;
    font-size: 15px;
    width: 40%;
    text-align: right;
    box-sizing: border-box;
    padding-right: 10px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #topTenRules .titleTip, #topTenRules .titleTip1 {
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
</style>
