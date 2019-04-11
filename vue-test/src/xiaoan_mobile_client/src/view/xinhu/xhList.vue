<template>
  <div id="xhlist">
    <!--<img src="/static/img/xinhu/tiwen.png">-->
    <!--<search @on-focus="$router.push('/xhSearch')" > </search>-->
    <div class="searchBox">
      <div class="searchText" @click="searchRouter()">
        <i class="weui-icon-search"></i>
        <!--<Marquee v-show="titleShow">-->

        <!--<MarqueeItem v-for="(item,index) in titleData" :key="index" @click.native.stop ="questionRouter(index)">{{item.questionTitle}}</MarqueeItem>-->

        <!--</Marquee>-->

        <p class="placeholder" v-show="titleShow">{{titleContent}}</p>
        <!--<span class="searchClose" v-show="titleShow" @click.stop="searchClose">-->
        <!--<img src="/static/img/searchDelete.png">-->
        <!--</span>-->
        <!--<span v-show = "!titleShow">-->
        <!--搜索-->
        <!--</span>-->
        <!--item-height="22px" interval="20000" duration="300" direction="up"-->
      </div>
      <div class="searchTiwen c148 fb" @click="$router.push('/xhQuestion')">
        <!--<i class="icon iconfont icon-bianji1 c148"></i>-->
        <img class="editimg" :src="$image.xinhu.edit"/>
        提问
        <transition name="bounce">
          <img v-show="hiddenImg" class="tiwenImg" :src="$image.xinhu.tiwen"/>
        </transition>
      </div>
    </div>

    <tab :line-width="2" custom-bar-width="30px" bar-active-color="#ffb148" v-model="value" default-color="#8d8d8d"
         active-color="#ffb148">
      <tab-item v-for="(item, index) in tabItem" :key="index" @on-item-click="handler(index)">{{item}}</tab-item>
      <!--<tab-item @on-item-click="handler(0)">最新提问</tab-item>
      <tab-item @on-item-click="handler(1)">精选回答</tab-item>
      <tab-item @on-item-click="handler(2)">实时关注</tab-item>-->
    </tab>
    <swiper :min-moving-distance="200" v-model="value" :show-dots="false" class="xhSwiper"
            @on-index-change="handleChange">
      <swiper-item v-if="v==0">
        <div class="scrollBox">
          <ul>
            <inviteList :item="item" v-for="(item, index) in inviteList" :key="index" listType="new"></inviteList>
          </ul>
          <p class="infinite-loading">
            <xiaoan-drop v-model="inviteHasNext"></xiaoan-drop>
          </p>
        </div>
      </swiper-item>
      <swiper-item class="xhSwiperItem">
        <listLatest v-if="value==(1-v)" :fromPath="fromPath"></listLatest>
      </swiper-item>
      <swiper-item>
        <listFeatured v-if="value==2-v"></listFeatured>
      </swiper-item>
      <swiper-item>
        <listRealTime v-if="value==3-v"></listRealTime>
      </swiper-item>
    </swiper>

    <div class="cover" v-show="showGuide1">
      <img class="guide1" :src="$image.xinhu.guide1">
      <button class="knowBtn" @click="hideGuide(1)">知道了</button>
    </div>
    <div class="cover" v-show="showGuide2">
      <img class="guide2" :src="$image.xinhu.guide2">
      <button class="knowBtn" @click="hideGuide(2)">知道了</button>
    </div>
    <!---->
    <!--<div id="simpleModal" v-transfer-dom>
      <x-dialog v-model="simpleModal" class="dialog-demo">
        <div class="img-box" ref="imgBoxDom">
          <img :src="weekDayImg" id="imgShow"/>
          <canvas id="canvas_box" style="display: none"></canvas>
          <div class="fan" @click="simpleLink"><i class="icon iconfont icon-jia3"></i></div>
          <div class="box-btns">
            <div class="btn-label left">
              <button type="button">长按图片保存</button>
            </div>
            <div class="btn-label right">
              <button type="button" @click="shareShadow = true">分享</button>
            </div>
          </div>
          <div id="canvasCode" style="display: none">
            <v-qrcode :text="enterpriseApplyUrl"></v-qrcode>
          </div>
        </div>
      </x-dialog>
    </div>
    &lt;!&ndash;&ndash;&gt;
    <div id="shareXh" v-transfer-dom>
      <x-dialog hide-on-blur v-model="shareShadow" mask-z-index="5000">
        <div class="share-box" @click="shareShadow = false">
          <img src="/static/img/testing/fenxiangT@3x.png" alt="">
        </div>
      </x-dialog>
    </div>
    &lt;!&ndash;&ndash;&gt;
    <div id="market-now" v-transfer-dom>
      <x-dialog hide-on-blur v-model="propagate" mask-z-index="5000">
        <div class="propagate-box">
          <button class="close" @click="propagateLink(0)"></button>
          <img src="//oss.in-hope.cn/enterpriseApply/4a0faa76d3c64361955c4c27bde16e8c.png" alt=""/>
          <button class="quiz" @click="propagateLink(1)"></button>
        </div>
      </x-dialog>
    </div>-->
  </div>
</template>

<script>
  import drop from "@/components/warning/drop"
  import listItem from "@/view/xinhu/components/listItem"
  import inviteList from "@/view/xinhu/components/inviteList"
  import listLatest from "@/view/xinhu/components/listLatest"
  import listFeatured from "@/view/xinhu/components/listFeatured"
  import listRealTime from "@/view/xinhu/components/listRealTime"
  import {
    Marquee, MarqueeItem, Search, Swiper, SwiperItem, Tab, TabItem, TransferDomDirective as TransferDom,
    XDialog
  } from 'vux'
  import mixins from './mixin/isTestUser'
  import posterObj from '@/assets/province/poster.json'
  export default {
    name: 'xh-list',
    mixins: [mixins],
    directives: {
      TransferDom
    },
    data() {
      return {
        propagate: false,
        fromPath: '',
        activatedVal: 0,
        shareShadow: false,
        posterData: posterObj,
        posterRandom: [],
        simpleModal: false,
        value: 0,
        v: 1,
        hiddenImg: true,
        inviteList: [],
        inviteHasNext: false,
        tabItem: ['最新提问', '精选回答', '实时关注'],
        showGuide1: true,
        showGuide2: false,
        titleData: [],
        titleContent: "",
        titleShow: true,
        num: "",
        weekDayImg: ''
      }
    },
    // 使用其它组件
    components: {
      XDialog,
      Tab,
      TabItem,
      Search,
      Swiper,
      SwiperItem,
      'xiaoan-drop': drop,
      'v-listItem': listItem,
      listLatest,
      listFeatured,
      listRealTime,
      inviteList,
      Marquee,
      MarqueeItem
    },
    computed: {},
    watch: {
      'simpleModal': function (val) {
      }
    },
    beforeRouteEnter(to, form, next) {
      next(vm => {
        if (form.name == 'xhQuestion') {
          vm.fromPath = 'xhQuestion'
        } else {
          vm.fromPath = ''
        }
      })
    },
    //
    activated() {
      let item = this.$route.query.item;
      if (!item) {
        this.showInvite()
      }
      this.titleCarousel();
      //
      if (this.activatedVal == 1) {

      } else {
        let userId = this.$cookie.getCookie("userId");
        if (userId) {
          this.posterRandom = [];
          this.indicationFun();
        }
      }
    },
    //
    deactivated() {
      this.propagate = false;
      this.simpleModal = false;
    },
    // 生命周期函数
    created() {
      this.isShowGuide()
      this.showInvite()
      this.titleCarousel()
      if (this.$cookie.isLogin()) {
        let myHome = this.$cookie.getUserInfo();
        console.log(myHome);
        this.indicationFun();
      } else {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      this.activatedVal = 1;
      //
      let adverttitle = '合规遇到问题？来信乎看看';
      let sharelink2 = window.location.href; // 分享链接
      let shareDesc = "上市公司、专业机构移动董办工具首选！"; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    mounted() {
      setTimeout(() => {
        this.hiddenImg = false
      }, 3000)
    },
    // 方法
    methods: {
      // indication  propagate
      indicationFun() {
        let start = 1531152000000; // 2018/7/10 00:00:0
        let end = 1531735200000; // 2018/7/16 18:00:0
        let timestamp = Date.parse(new Date());
        if (timestamp >= start && timestamp < end) {
          // 在 在线答疑时间
          this.propagateFun();
          console.log(111)
        } else {
          // 不在在线答疑时间
          console.log(222)
          this.simpleModalFun();
        }
      },
      //
      propagateFun() {
        // 在 在线答疑时间
        if (window.localStorage.getItem('propagate_market')) {
          let getTime = window.localStorage.getItem('propagate_market');
          let time = this.$const.formatArray(getTime);
          var day = new Date().getDate();
          if (time[time.length - 1] == day) {
            setTimeout(() => {
              this.propagate = false;
            }, 1000)
          } else {
            setTimeout(() => {
              this.propagate = true;
            }, 1000)
          }
        } else {
          setTimeout(() => {
            this.propagate = true;
          }, 1000)
        }
      },
      // 2018.6.12 9.30 ~11.30 在线答疑效果
      propagateLink(index) {
        var timestamp = Date.parse(new Date());
        window.localStorage.setItem('propagate_market', timestamp);
        switch (index) {
          case 0:
            this.propagate = false;
            break;
          case 1:
            this.propagate = false;
            this.$router.push({path: '/xhQuestion', query: {propagate: 1}});
            break;
        }
      },
      // 取出数组 不重复的值
      diff(arr1, arr2) {
        // 去除数组 不重复的值
        var newArr = [];
        var arr3 = [];
        for (var i = 0; i < arr1.length; i++) {
          if (arr2.indexOf(arr1[i]) === -1)
            arr3.push(arr1[i]);
        }
        var arr4 = [];
        for (var j = 0; j < arr2.length; j++) {
          if (arr1.indexOf(arr2[j]) === -1)
            arr4.push(arr2[j]);
        }

        newArr = arr3.concat(arr4);
        console.log('arr4', newArr, arr3, arr4);
        return newArr;
      },
      //
      simpleLink() {
        this.simpleModal = false;
        var timestamp = Date.parse(new Date());
        window.localStorage.setItem('simpleModal',
          JSON.stringify({data: {show: false, time: timestamp}, result: this.posterRandom}))
      },
      //
      simpleModalFun() {
        var array = [0, 1, 2, 3, 4];
        var timestamp = Date.parse(new Date()); // 当前时间戳
        let time = 1528387200000; // 2018.6.8
        // let time = 1528214400000; // 2018.6.6
        if (timestamp < time) {
          window.localStorage.removeItem('simpleModal');
          // 如果当前时间小于 2018.6.8 好 就不继续执行
          return false
        }
        //
        if (window.localStorage.getItem('simpleModal')) {
          let dataSimple = JSON.parse(window.localStorage.getItem('simpleModal'));
          //
          if (dataSimple.result) {
            this.posterRandom = dataSimple.result;
            array = this.diff(array, this.posterRandom);
          }
          if (array == [] || array.length == 0) {
            this.simpleModal = false;
            return
          }
          var value = array[Math.round(Math.random() * (array.length - 1))];
          this.posterRandom.push(value);
          console.log('this.posterRandom', this.posterRandom);
          this.weekDayImg = this.posterData.result[value].img;
          //
          if (dataSimple.data) {
            let time = this.$const.formatArray(dataSimple.data.time);
            var day = new Date().getDate();
            if (time[time.length - 1] == day) {
              console.log(true);
              this.simpleModal = false;
            } else {
              console.log(false);
              setTimeout(() => {
                this.simpleModal = true;
              }, 1000)
            }
          } else {
            setTimeout(() => {
              this.simpleModal = true;
            }, 1000)
          }
        } else {
          //
          var val = array[Math.round(Math.random() * (array.length - 1))];
          this.posterRandom = [];
          this.posterRandom.push(val);
          this.weekDayImg = this.posterData.result[val].img;
          //
          setTimeout(() => {
            this.simpleModal = true;
          }, 1000)
        }
      },
      // 剪切 画布 生成圆形 方法
      circleImg(ctx, img, x, y, r) {
        ctx.save();
        var d = 2 * r;
        var cx = x + r;
        var cy = y + r;
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, x, y, d, d);
        ctx.restore();
      },
      // 画布
      drawQrcode(data) {
        var _that = this;
        var imgData = this.weekDayImg;
        var headImg = data.weixinAvatar;
        var nameText = data.userName;
        var textsStyle = {
          textAlign: 'left',
          font: '32px PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica',
          lineWidth: 1.0,
          fillStyle: '#323232',
        };
        // 开始构造
        var nWidth = 375, // 屏幕可视区域 宽度
          nHeight = 667, // 屏幕可视区域 高度
          _canvasWidth = 375 * 2, // 画布 宽度
          _canvasHeight = 667 * 2; // 画布 高度
        // 开始画图，获取上下文；
        var _canvas = document.getElementById("canvas_box");
        _canvas.width = _canvasWidth;
        _canvas.height = _canvasHeight;
        var _context = _canvas.getContext('2d');
        // 背景
        _context.fillRect(0, 0, nWidth * 2, nHeight * 2);
        // 白色矩形部分
        _context.fill();
        _context.closePath();
        //
        //onload是异步加载，所以要等第一个onload 加载完毕再画第二张图片
        // 代言文字图片
        var _imagetext = new Image();
        // 解决跨域，如果有跨域错误信息一定要加此属性；
        _imagetext.crossOrigin = "anonymous";
        _imagetext.src = imgData;
        // 第一次 执行 话 大图
        _imagetext.onload = function () {
          _context.save(); // 保存当前_context的状态
          _context.drawImage(_imagetext, 0, 0);
          _context.stroke();//
          _context.closePath();
          // 第二次 执行 画头像
          var _imagehead = new Image();
          // 如果有跨域问题，请给img对象添加如下属性
          _imagehead.src = headImg;
          _imagehead.crossOrigin = "anonymous";
          _imagehead.onload = function () {
            // 保存当前_context的状态
            _context.save();
            // _that.circleImg(_context, _imagehead, 52, (603 - 95) * 2, 56);
            // 头像下面的文字
            _context.beginPath();
            _context.textAlign = textsStyle.textAlign;
            // 设置字体
            _context.font = textsStyle.font;
            _context.lineWidth = textsStyle.lineWidth; //
            _context.fillStyle = textsStyle.fillStyle; // 字颜色
            _context.fillText(nameText, (nWidth - 344) * 2, (603 - 16) * 2);
            // canvas 画完图 一定要生成图片流，作为img 的src属性值，同时隐藏canvas，只展示img 就ok了，在手机上试试长按保存功能吧
            var _imgSrc = _canvas.toDataURL("image/png", 1);
            _canvas.style.display = "none";
            var imgShow = document.getElementById('imgShow');
            imgShow.setAttribute('src', _imgSrc);
          }
        }
      },
      //
      isShowGuide() {
        let xhGuide = this.$storage.get('xhGuideList')
        if (xhGuide) {
          this.showGuide1 = false
        } else {
          this.showGuide1 = true
        }
      },
      //
      titleCarousel() {
        let params = {
          count: 15
        }
        /*this.$http({
          method: "GET",
          url: this.$api.xinhu.searchUserTiltle,
          params: {
            count: 15
          }
        })*/
        this.$axios.xinhu.searchUserTiltle(params).then((res) => {
          console.log("6666", res)
          if (res.data.returnCode == 200 && res.data.returnObject) {
            let data = res.data.returnObject
            let dataLength = data.length
            for (let i = 0; i < dataLength; i++) {
              this.titleData.push({questionId: data[i].questionId, questionTitle: data[i].questionTitle})
            }
            console.log(this.num)
            this.num = parseInt(Math.random() * 20)
            this.titleContent = this.titleData[this.num].questionTitle
          }

        })
      },
      //
      questionRouter() {
        // console.log("1111")
        this.$router.push({path: "/xhQuestionDetaile", query: {questionId: this.titleData[this.num].questionId}})
      },
      searchClose() {
        this.titleShow = false
      },
      searchRouter() {
        this.titleShow = true
        this.$router.push({path: "/xhSearch", query: {content: this.titleContent}})
      },
      hideGuide(index) {
        if (index === 1) {
          this.showGuide1 = false
          this.showGuide2 = true
        } else if (index === 2) {
          this.showGuide2 = false
          this.$storage.set('xhGuideList', 1)
        }
      },
      getQueryItem() {
        let item = this.$route.query.item
        if (item) {
          this.value = item
        } else {
          this.value = 0
        }
      },
      showInvite(val) {
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.showInvite,
          params: {}
        })*/
        this.$axios.xinhu.showInvite().then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.inviteList = res.data.returnObject
            if (this.inviteList.length > 0 && this.tabItem[0] != '邀请回答') {
              this.tabItem.unshift('邀请回答')
              this.v = 0
            }
            this.$nextTick(() => {
              this.getQueryItem()
            })

          }
        })
      },
      handler(val) {
        this.value = val
        this.$router.push({path: '/xhlist', query: {item: val}})
        console.log('handler:' + val)
      },
      handleChange(val) {
        this.handler(val)
        console.log('handleChange:' + val)
        if (this.tabItem[0] == '邀请回答' && val == 0 && this.inviteList.length > 0) {
          // this.showInvite()
        }
      },
      /* clickReloadData (val) {
        this.loading = true
        console.log('click loadMoreLatest')
        if (val == 0) {
          this.latestList = {
            viewType: 'LATEST_QUESTIONS',
            isLoading: false,
            data: [],
            nowPage: 1,
            hasNext: true
          }
          this.getListLatest()
        } else if (val == 1) {
          this.featuredList = {
            viewType: 'FEATURED_ANSWER',
            isLoading: false,
            data: [],
            nowPage: 1,
            hasNext: true
          }
          this.getListFeatured()
        } else if (val == 2) {
          this.realTimeList = {
            viewType: 'REAL_TIME_ATTENTION',
            isLoading: false,
            data: [],
            nowPage: 1,
            hasNext: true
          }
          this.getListRealTime()
        }
      },
      loadMoreLatest() {
        //this.loading = true
        if (this.latestList.hasNext && this.latestList.data.length>0) {
          setTimeout(() => {
            this.getListLatest()
          }, 300)
        }
      },
      loadMoreRealTime() {
        //this.loading = true
        if (this.realTimeList.hasNext && this.realTimeList.data.length>0) {
          setTimeout(() => {
            this.getListRealTime()
          }, 300)
        }
      },
      loadMoreFeatured() {
        //this.loading = true
        if (this.featuredList.hasNext && this.featuredList.data.length>0) {
          setTimeout(() => {
            this.getListFeatured()
          }, 300)
        }
      },
      // LATEST_QUESTIONS  REAL_TIME_ATTENTION  FEATURED_ANSWER
      // 最新提问
      getListLatest () {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listQuestionLatest,
          params: {
            topicId: '',
            pageNum: this.latestList.nowPage,
            pageSize: 10
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            let list = res.data.returnObject.list
            for (let i in list) {
              if (list[i].bestAnswer) {
                let bestAnswer = JSON.parse(list[i].bestAnswer)
                list[i].answerContent = bestAnswer.answerContent
                list[i].answerId = bestAnswer.answerId
                list[i].userName = bestAnswer.userName
              }
            }
            this.latestList.data = this.latestList.data.concat(list)
            let str = this.latestList.data[0].bestAnswer
            console.log('zuixin提问= ', this.latestList.data, JSON.parse(str))
            let page = 1
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.latestList.nowPage >= page) {
              this.latestList.hasNext = false
            } else {
              this.latestList.nowPage += 1
            }
          } else {
            this.latestList.hasNext = false
          }
        }).catch((err) => {
          this.latestList.hasNext = false
        })
      },
      // 精选问答
      getListFeatured () {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listSiftAnswer,
          params: {
            topicId: '',
            pageNum: this.featuredList.nowPage,
            pageSize: 10
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            this.featuredList.data = this.featuredList.data.concat(res.data.returnObject.list)
            let page = 1
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.featuredList.nowPage >= page) {
              this.featuredList.hasNext = false
            } else {
              this.featuredList.nowPage += 1
            }
          } else {
            this.featuredList.hasNext = false
          }
        }).catch((err) => {
          this.featuredList.hasNext = false
        })
      },
      // 实时关注
      getListRealTime () {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listQuestions,
          params: {
            viewType: this.realTimeList.viewType,
            pageNum: this.realTimeList.nowPage,
            pageSize: 10
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode === 200 && res.data.returnObject) {
            let list = res.data.returnObject.list
            for (let i in list) {
              list[i].updateTime = this.$const.format(list[i].createTime)
              list[i].userName = list[i].answerUserName
            }
            this.realTimeList.data = this.realTimeList.data.concat(list)
            let page = 1
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.realTimeList.nowPage >= page) {
              this.realTimeList.hasNext = false
            } else {
              this.realTimeList.nowPage += 1
            }
          } else {
            this.realTimeList.hasNext = false
          }
        }).catch((err) => {
          this.realTimeList.hasNext = false
        })

      }, */
    }
  }
</script>

<style lang="scss">
  #market-now {
    .weui-dialog {
      background: transparent;
      .propagate-box {
        position: relative;
        button {
          width: 50px;
          height: 30px;
          position: absolute;
          &.close {
            border: 0;
            height: 50px;
            border-radius: 50%;
            right: -5px;
            top: -8px;
            background: transparent;
          }
          &.quiz {
            background: transparent;
            border: 0;
            width: 170px;
            height: 40px;
            bottom: 33px;
            left: 50%;
            border-radius: 20px;
            margin-left: -85px;
          }
        }
      }
    }
    img {
      width: 100%;
      vertical-align: middle;
    }
  }
  #shareXh {
    .weui-dialog {
      position: absolute;
      background-color: transparent;
      z-index: 6000;
    }
    .weui-mask {background-color: rgba(0, 0, 0, 0.8)}
    .share-box {
      img {
        display: inherit;
        width: 100%;
        padding-left: 9%;
        padding-bottom: 92%;
      }
    }
  }
  #simpleModal {
    .weui-dialog {
      position: absolute;
      height: auto;
      width: 75%;
      max-width: 100%;
      max-height: 100%;
      background-color: transparent;
    }
    .img-box {
      height: 100%;
      width: 100%;
      /*.box-content {*/
      /*position: relative;*/
      #canvas_box {
        display: inherit;
        width: 100%;
      }
      #imgShow {
        -webkit-touch-callout: default;
        max-width: 100%;
        display: inherit;
        border-radius: 2px;
        user-select: default;
      }
      .fan {
        position: absolute;
        top: 0;
        right: 0;
        i {
          position: absolute;
          top: 5px;
          right: 5px;
          color: white;
          transform: rotate(45deg);
        }
      }
      .fan:before {
        content: '';
        position: absolute;
        top: -35px;
        right: -35px;
        width: 0;
        height: 0;
        border-radius: 35px;
        border-width: 35px;
        border-style: solid;
        border-color: transparent transparent transparent rgba(0, 0, 0, 0.4);
        transform: rotate(-45deg);
        line-height: 99em;
        overflow: hidden;
        cursor: pointer;
      }
      /*}*/
      .box-btns {
        margin-top: 5px;
        display: flex;
        .btn-label {
          flex: 1;
          button {
            border: 0;
            width: 98%;
            height: 40px;
            border-radius: 4px;
            color: #8d8d8d;
            background-color: white;
            &:active {
              background-color: #F5A44B;
              color: #323232;
            }
          }
        }
        .btn-label.left {
          text-align: left;
          button {
            background-color: #fff;
            color: #ffb148;
            font-size: 15px;
          }
        }
        .btn-label.right {
          text-align: right;
          button {
            background-color: #ffb148;
            color: #fff;
            font-size: 15px;
          }
        }
      }
    }
  }
  #xhlist {
    display: flex;
    flex-direction: column;
    background-color: #f0f1f5;
    min-height: 100%;
    .c148 {
      color: #ffb148;
      font-size: 16px;
    }
    .searchBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 7.5px 12px;
      .searchText {
        position: relative;
        display: flex;
        align-items: center;
        background-color: #fff;
        height: 100%;
        width: 82%;
        border-radius: 3px;
        padding-left: 5px;
        font-size: 15px;
        color: #aeaeae;
        /*.weui-icon-search {*/
        /*font-size: 18px;*/
        /*}*/
        /*.vux-marquee{*/
        /*height: 21px!important;*/
        /*.vux-marquee-box{*/
        /*li{*/
        /*height: 21px!important;*/
        /*margin: 0!important;*/
        /*padding: 0!important;*/
        /*}*/

        /*}*/
        /*}*/
        p {
          width: 85%;
        }
        .searchClose {
          display: inline-block;
          height: 100%;
          position: relative;
          top: 0;
          right: 0;
          width: 30px;
          z-index: 200;
          img {
            position: relative;
            width: 16px;
            height: 45%;
            top: 27%;
            left: 0;
          }
        }
      }
      .searchTiwen {
        position: relative;
        .editimg {
          display: inline-block;
          height: 15px;
          position: relative;
          top: 1.6px;
        }
        .tiwenImg {
          z-index: 200;
          position: absolute;
          top: 74%;
          right: -10px;
          width: 84px;
        }
      }
    }
    .xhSwiper {
      display: flex;
      flex-grow: 1;
      // padding-bottom: 50px;
      padding-top: 10px;
    }
    .scrollBox {
      height: 100%;
      overflow-y: scroll;
    }
    .vux-slider > .vux-swiper {
      flex-grow: 1;
      height: auto !important;
    }
    .vux-tab .vux-tab-item {
      font-size: 15px;
    }
    @keyframes hidden {
      0% {opacity: 1;}
      80% {opacity: 1; }
      99% {opacity: 0;}
      100% {opacity: 0;}
    }
    .guide1 {
      position: absolute;
      width: 300px;
      right: 10px;
      top: 10px;
    }
    .guide2 {
      position: absolute;
      width: 200px;
      right: 5px;
      top: 55px;
    }
  }
</style>
