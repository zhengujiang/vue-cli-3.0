<template>
  <transition name="bounce">
    <div class="xiaoan-box new-rules" id="newRules" ref="newLawDom">
      <div class="new-rules-scroll" ref="scrollDom">
        <div ref="headDom" class="headSearch" @click="goSearch()" style="z-index: 2000;">
          <div>
            <span><i class="icon iconfont icon-tripsousuo"></i></span>
            <span>{{searchTxt}}</span></div>
        </div>
        <div class="wrapper" id="wrapper" :style="{ height: wrapperHeight +'px'}">
          <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
              infinite-scroll-distance="0">
            <li :key="index" class="medCont" v-for="(list,index) in contenta" @click="goCount(index)">
              <div class="medTil">{{nuwNumber(list.name)}}</div>
              <div class="medCondition">
                <span v-show="list.referenceNumber != '无' && list.referenceNumber">{{list.referenceNumber}}</span>
                <span v-show="list.referenceNumber != '无' && list.referenceNumber">|</span>
                <span v-show="list.timeliness">{{list.timeliness}}</span>
                <span v-show="list.PublishDate">|</span>
                <span v-show="list.PublishDate">{{$const.format(list.PublishDate)}}</span>
                <span class="medNew" v-if="list.PublishDate > LastWeek">New</span>
                <span v-else></span>
              </div>
              <div class="medP"></div>
            </li>
          </ul>
          <p v-show="infLoading" class="infinite-loading">
            <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
          </p>
        </div>
      </div>
      <div class="goTrack" @click="goTrack()">
        <div class="go-track-box">
          <img :src="track" alt="">
        </div>
      </div>
      <div class="showPrompt">仅显示最近三个月发布的新规</div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'newrules',
    data() {
      return {
        amli: this.$image.rules.anli,
        searchIon: this.$image.personal.search3x,
        searchTxt: '搜索',
        top: 1,
        bottom: 15,
        NowDate: '',//当前元素
        contenta: [],//数组
        nextd30: '',//倒数第三十天
        nextd0: '',//当天
        track: this.$image.base.track,
        isOnload: true,
        LastWeek: '',
        /**/
        num1: '',
        num2: '',
        bottomStatus: '', //下拉状态
        rulesListNum: '',
        shuliang: '',
        //
        infLoading: true,
        loading: false,
        allLoaded: true,
        wrapperHeight: 0,
      }
    },
    components: {},
    created() {
      /**/
      this.LastWeek = this.$const.getTimestamp(this.$const.getBeforeDate(7));
      this.nextd0 = this.$const.getBeforeDate(89);// 距离当前时间
      this.nextd30 = this.$const.getNewDate();// 当前
      console.log("前90天" + this.nextd0, "当前" + this.nextd30, "最近7天", this.LastWeek);
      /**/
      var user_id = this.$cookie.getCookie("userId");
      if (user_id == '') {
        this.isOnload = false;//未授权登录
      } else {
        this.isOnload = true;//授权登录
      }
      this.searchRules();
    },
    mounted() {
      this.$nextTick(() => {
        this.wrapperHeight = this.$refs.scrollDom.clientHeight - this.$refs.headDom.clientHeight;
      })
      //
      setTimeout(() => {
        this.$nextTick(() => {
          $('.showPrompt').animate({bottom: "0", opacity: 0});
        })
      }, 2500);
      //
      let adverttitle = document.title;
      let sharelink2 = decodeURI(window.location.href);//分享链接
      let shareDesc = "";//描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      ///处理。。
      nuwNumber(str) {
        var hei = document.body.clientWidth;
        var nowH = parseInt((hei - 39) / 16) * 2;
        if (str.length >= nowH) {
          return str.substring(0, nowH) + '...';
        } else {
          return str
        }
      },
      goTrack() {
        if (this.isOnload == false) {
          let refer_title = "我的足迹";
          let refer_url = this.$api.CURRENTIP.IP + "#/track";
          this.$storage.loginStatus(this, refer_title, refer_url);
        } else if (this.isOnload == true) {
          this.$router.push({path: '/track'});
        }
      },
      goSearch() {
        this.$router.push({path: '/rule/search'});
      },
      //
      goCount(index) {
        console.log(this.contenta[index]);
        this.$router.push({path: '/rule/details', query: {id: this.contenta[index].id}});
      },
      //
      loadMore() {
        let lastValue = this.top;
        if (lastValue < this.shuliang) {
          this.loading = true;
          this.allLoaded = true;
        } else {
          this.loading = false;
          this.allLoaded = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.shuliang) {
            this.top += 1;
            this.searchRules();
          }
          setTimeout(() => {
            this.loading = false;
            this.allLoaded = false;
          }, 5000)
        }, 300);
      },
      //最近30天
      searchRules() {
        let params = {
          pageNo: this.top,
          pageSize: this.bottom,
          releaseStart: this.nextd0,
          releaseEnd: this.nextd30,
          sortType: "发布日期",
          type: 'law'
        }
        this.$axios.law.search(params).then(res => {
          /* console.log(res);*/
          if (res.data.returnCode == 1) {
            //根据总条数 判断有多少页
            if (res.data.returnObject.count > 0) {
              var number = res.data.returnObject.count;
              this.shuliang = this.$array.totalPage(number, this.bottom);
              //控制下拉刷新
              var rat = res.data.returnObject.list;
              this.contenta = this.$array.loadMore(this.contenta, rat);
              console.log(this.contenta, this.shuliang);
            } else {
              this.contenta = [];
              this.num2 = "0";
              this.shuliang = 0;
              this.allLoaded = false;
            }
          } else {
            this.contenta = [];
            this.num2 = "0";
            this.shuliang = 0;
          }
        }).catch((err) => {
          console.log(err);
        })
      },
    }
  }
</script>

<style lang="scss">
  .newrules {
    height: 100%;
    width: 100%;
  }
  /***********加载动画****************/
  .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
</style>

<style scoped lang="scss">
  .xiaoan-box.new-rules {
    padding-bottom: 50px;
    .new-rules-scroll {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background-color: #FFFFFF;
    }
    .headSearch {
      height: 50px;
      background-color: #f0f1f5;
      padding: 0 12px;
      /*box-sizing: border-box;*/
      div {
        height: 35px;
        background-color: white;
        text-align: center;
        line-height: 35px;
        font-size: 15px;
        position: relative;
        border: none;
        top: 7.5px;
        box-sizing: border-box;
        color: #8d8d8d;
        border-radius: 2px;
        font-weight: lighter;

        img {
          height: 15px;
          position: relative;
          top: 2px;
          margin-right: 10px;
        }
      }
      .icon-tripsousuo {
        font-size: 18px;
      }
    }
    .wrapper {
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }
  }
  #newRules .medCont {
    font-size: 0;
  }
  #newRules .medCont:active {
    background-color: #f0f1f5;
  }
  #newRules .medCont .medTil {
    padding: 18px 12px 0 12px;
    overflow: hidden;
    text-overflow: clip;
    /*display: -webkit-box;*/
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /*line-height: 19px;*/
    font-size: 15px;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  #newRules .medCont .medCondition {
    padding: 7px 12px 20px 12px;
    font-size: 12px;
    color: #aeaeae;
  }
  #newRules .medCont .medCondition .medNew {
    float: right;
    border: 1px solid #faa02a;
    border-radius: 2px;
    box-sizing: border-box;
    width: 32.5px;
    color: #f6900c;
    height: 17px;
    line-height: 17px;
    text-align: center;
    padding: 0;
    margin: 0;
  }
  #newRules .medCont .medP {
    height: 7.5px;
    background-color: #f0f1f5;
  }
  #newRules {
    .goTrack {
      display: inline-block;
      position: absolute;
      bottom: 95px;
      right: 12px;
      background-color: white;
      border-radius: 50%;
      opacity: 0.9;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.15);
      margin: 0 auto;
      .go-track-box {
        height: 45px;
        width: 45px;
        position: relative;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          height: 25px;
          width: 25px;
          margin: 0 auto;
        }
      }
    }
  }
  /**********************************/
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
  }
</style>
