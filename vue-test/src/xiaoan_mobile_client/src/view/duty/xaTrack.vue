<template>
  <div class="xiaoan-box xiaoan-track">
    <div class="xiaoan-track-scroll" ref="trackDom" style="position: relative">
      <div class="Theader" ref="trackScrollDom">
        <div class="Tleft">
          <span>共</span>
          <countup :duration="1" class="headNum" :start-val="0" :end-val="trackData.length"></countup>
          <span>条，最多为您保存</span><span class="headNum">20</span><span>条</span>
        </div>
        <div class="Tright Close" @click="deleteTrack"><span>清除</span><i class="icon iconfont icon-shanchu"></i></div>
      </div>
      <div class="track-container" :style="{height:scrollAll+'px'}">
        <div class="track-wrapper" :style="{height:scrollAll+'px'}">
          <ul class="trackScroll">
            <li v-for="(list,index) in trackData" @click="goTrack(index)">
              <!--法规-->
              <div class="Tcentitem vux-1px-b" v-if="list.type =='1'">
                <!--法规-->
                <div class="TcentTilt" v-if="list.expiryTime === null" :style="{color:'#323232'}">
                  {{nuwNumber(list.title)}}
                </div>
                <div class="TcentTilt" v-else :style="{color:'#8d8d8d'}">{{nuwNumber(list.title)}}</div>
                <!-------------->
                <div class="Tcentit">
                  <span class="titleType" :style="{backgroundColor:'#90b8f4'}">法规</span>
                  <!--------------法规-------------->
                  <span class="titleVal">{{list.dispatchUnit}}</span><!--发文字号-->
                  <span v-show="list.dispatchUnit" style="color: #8d8d8d;">|</span>
                  <!--法规不显示时间-->
                  <span class="titleVal" v-show="list.timeliness">{{list.timeliness}}</span>
                  <span v-show="list.releaseTime" style="color: #8d8d8d;">|</span>
                  <span style="color: #8d8d8d;">{{ $const.format(list.releaseTime)}}</span>
                </div>
              </div>
              <!--公告-->
              <div class="Tcentitem vux-1px-b" v-else-if="list.type == '3'">
                <div class="TcentTilt">{{nuwNumber(list.title)}}</div>
                <div class="Tcentit">
                  <span class="titleType" :style="{backgroundColor:'#ffd091'}">公告</span>
                  <span class="titleVal">{{$const.format(list.releaseTime)}}</span>
                </div>
              </div>
              <!--研报-->
              <div class="Tcentitem vux-1px-b" v-else-if="list.type == '4'">
                <div class="TcentTilt">{{nuwNumber(list.title)}}</div>
                <div class="Tcentit">
                  <span class="titleType" :style="{backgroundColor:'#9ae6ed'}">研报</span>
                  <span class="titleVal">{{list.dispatchUnit}}</span>
                  <span style="color: #8d8d8d;">|</span>
                  <span class="titleVal">{{$const.format(list.releaseTime)}}</span>
                </div>
              </div>
              <!--问答-->
              <div class="Tcentitem vux-1px-b" v-else-if="list.type == '6' || list.type == '7'">
                <div class="TcentTilt" v-html="nuwNumber(list.title)"></div>
                <div class="about" v-if="list.type == '7'" v-html="list.answerContent"></div>
                <div class="Tcentit">
                  <span class="titleType" :style="{backgroundColor:'#ffa691'}">问答</span>
                  <span class="titleVal">{{list.dispatchUnit}}</span>
                  <!--<span style="color: #8d8d8d;">|</span>-->
                  <span class="titleVal">{{$const.format(list.releaseTime)}}</span>
                </div>
              </div>
              <!--研报-->
              <div class="Tcentitem vux-1px-b" v-else-if="list.type == '8'">
                <div class="TcentTilt">{{nuwNumber(list.title)}}</div>
                <div class="Tcentit">
                  <span class="titleType" :style="{backgroundColor:'#ffd091'}">IPO</span>
                  <span class="titleVal">{{$const.format(list.releaseTime)}}</span>
                </div>
              </div>
            </li>
          </ul>
          <p class="infinite-loading">
            <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
          </p>
        </div>
        <xiaoan-loading v-show="loading"></xiaoan-loading>
      </div>
      <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="false"
                      :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
    </div>
  </div>
</template>

<script>
  import VReturnHome from "../../components/warning/returnHome.vue"
  import XiaoanLoading from "../../components/warning/loading"
  import XiaoanWarning from '@/components/warning/warning'
  import {Countup} from 'vux'
  export default {
    name: "xa-track",
    data() {
      return {
        allLoaded: false,
        trackData: [],
        user_Id: '',
        todayTime: '',
        toTime: '',
        loading: false,
        TemptyShow: false,
        scrollAll: '',
        warning: {
          top: '25%',
          show: false,
          img: this.$image.warning.warning2,
          text: '暂无浏览记录！',
          btnText: ''
        },
      }
    },
    updated() {

    },
    created() {
      let user_id = this.$cookie.getCookie("userId");
      this.user_Id = user_id;
      if (this.$cookie.isLogin()) {
        console.warn('是登陆用户');
        this.userHome();
        this.getBrowsing();
      } else {
        this.$vux.toast.show({
          text: '正在跳转登陆',
          position: 'middle',
          type: 'text',
          width: 'auto',
          time: 2500
        });
        this.$storage.loginStatus(this, '我的足迹', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.scrollAll = this.$refs.trackDom.clientHeight - this.$refs.trackScrollDom.clientHeight;
      });
      /**
       * todo
       **/
      var adverttitle = '';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/rule'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
      /**/
      this.$nextTick(() => {
        window.sessionStorage.removeItem("refer_url");
        window.sessionStorage.removeItem("refer_title");
      });
    },
    components: {
      VReturnHome,
      XiaoanLoading,
      XiaoanWarning,
      Countup
    },
    methods: {
      getQuestionIdByAnswerId(id) {
        /*this.$http ({
          method: "GET",
          url: this.$api.xinhu.getQuestionIdByAnswerId,
          params: {
            answerId: id
          },
        })*/
        let params = {
          answerId: id
        }
        this.$axios.xinhu.getQuestionIdByAnswerId(params).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$router.push({path: '/xhAnswerDetaile', query: {questionId: res.data.returnObject, answerId: id}});
          } else if (res.data.returnCode == -1) {
            this.$router.push({path: '/error', query: {text: '', img: ''}});
          }
        }).catch((err) => {
          console.warn(err);
        })
      },
      //
      userHome() {
        //我的足迹获取用户信息判断是否填写个人信息  若是没有则跳转填写个人信息页面
        /*this.$http ({
          method: "GET",
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome().then((res) => {
          console.log(res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.realName === '' || res.data.returnObject.realName === null) {
              this.$router.push({path: '/completeInfo'});
            }
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // /处理。。。
      nuwNumber(str) {
        var hei = document.body.clientWidth;
        var nowH = parseInt((hei - 39) / 16) * 2;
        // console.log("=====================>", nowH);
        if (str.length >= nowH) {
          return str = str.substring(0, nowH) + '...';
        } else {
          return str
        }
      },
      //
      goTrack(index) {
        switch (this.trackData[index].type) {
          case (1 || '1'):
            this.$router.push({path: "/rule/details", query: {id: this.trackData[index].refId}});
            break;
          case (2 || '2'):
            this.$router.push({
              path: "/answersDetails",
              query: {question: this.trackData[index].title, scopeId: this.trackData[index].dispatchUnit}
            });
            break;
          case (3 || '3'):
            this.$router.push({path: '/afficheContent', query: {id: this.trackData[index].refId}});
            break;
          case (4 || '4'):
            this.$router.push({path: '/detailReport', query: {id: this.trackData[index].refId}});
            break;
          case (6 || '6'):
            this.$router.push({path: '/xhQuestionDetaile', query: {questionId: this.trackData[index].refId}});
            break;
          case (7 || '7'):
            this.getQuestionIdByAnswerId(this.trackData[index].refId);
            break;
          case (8 || '8'):
            this.$router.push({
              path: '/ipo/details',
              query: {id: this.trackData[index].refId, type: this.trackData[index].dispatchUnit}
            });
            break;
        }
      },
      //获取足迹
      getBrowsing() {
        this.loading = true;
        /*this.$http ({
          method: "GET",
          url: this.$api.browsing.getBrowsing,
          params: {},
        })*/
        this.$axios.browsing.getBrowsing().then((res) => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          console.log(res);
          if (res.data.returnCode === 1) {
            this.trackData = res.data.returnObject;
            this.warning.show = false;
          } else if (res.data.returnCode === -1) {
            this.warning.show = true;
          }
        }).catch((err) => {
          this.$vux.toast.show({
            text: 'browsing.getBrowsing请求失败',
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
          setTimeout(() => {
            this.loading = false;
          }, 5000);
        });
      },
      deleteTrack() {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要清除吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteByUserId();
          },
          onCancel() {
          }
        })
      },
      //清除足迹
      deleteByUserId() {
        /*this.$http ({
          method: "POST",
          url: this.$api.browsing.deleteByUserId,
          params: {},
        })*/
        this.$axios.browsing.deleteByUserId().then((res) => {
          console.log("asdas" + res.data.returnCode);
          if (res.data.returnCode == 1) {
            this.trackData = [];
            this.warning.show = true;
          } else {
            this.warning.show = false;
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({
            text: 'browsing.deleteByUserId请求失败',
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .xiaoan-track {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    padding-bottom: 50px;
    .xiaoan-track-scroll {
      height: 100%;
      width: 100%;
    }
    .Theader {
      height: 35px;
      width: auto;
      background-color: #f0f1f5;
      overflow: hidden;
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      /*box-shadow: 0 1px 1px #e3e3e3;*/
      .Tleft {
        text-align: left;
        padding: 8px 12px;
        /*font-weight: 400;*/
        color: #939394;
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        display: inline-block;
        float: left;
        font-size: 0;
        span {
          font-size: 14px;
        }
        .headNum {
          color: #ffb148;
        }
      }
      .Tright {
        text-align: left;
        padding: 8px 12px;
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        display: inline-block;
        font-size: 14px;
        float: right;
        color: #ffb148;
        span {
          margin-right: 3px;
        }
        i {
          /*float: right;*/
          /*margin-top: 3px;*/
          font-size: 15px;
          color: #ffb148;
        }
      }
    }
    .track-container {
      height: auto;
      width: 100%;
      position: relative;
      background-color: #f0f1f5;
      .track-wrapper {
        background-color: #FFFFFF;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
    }
    .trackScroll {
      li {
        padding: 0 12px;
        &:active {
          background-color: #f0f1f5;
        }
        .Tcentitem {
          text-align: justify;
          .about {
            font-size: 12px;
            color: #545454;
            text-justify: distribute;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .TcentTilt {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 15px;
        color: #323232;
        padding: 15px 0 0 0;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        line-height: 19px;
      }
    }
    .Tempty {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
  .Tcentit {
    padding-bottom: 15px;
    padding-top: 6px;
    /*border-bottom: 0.5px solid #e3e3e3;*/
    font-size: 12px;
  }
  .Tcentit div {
    display: initial;
  }
  .Tcentit img {
    height: 14px;
    position: relative;
    top: 2px;
    left: 0;
  }
  .Tcentit .Tvalue {
    background-color: #f6900c;
    color: white !important;
    padding: 1px 3px;
    border-radius: 4px;
    margin-right: 2px !important;
  }
  .Tcentit .titleVal {
    font-size: 12px;
    color: #8d8d8d;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .Tcentit span {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .titleType {
    padding: 1px 3px 1px 3px;
    border-radius: 2px;
    color: white;
    font-size: 12px;
  }
  #track .TcentList:active {
    background-color: #f0f1f5;
  }
</style>
