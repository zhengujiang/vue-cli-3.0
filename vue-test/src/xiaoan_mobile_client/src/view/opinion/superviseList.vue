<template>
  <div class="supervise-list xiaoan-box" id="supervise-list" ref="superviseDom">
    <transition name="bounce">
      <div class="guideopinion" v-show="opinionGuidePages">
        <img :src="guideopinion[0].img" alt="">
        <p>{{guideopinion[0].text}}</p>
        <button @click="guideOpinionclick(1)">{{guideopinion[0].button}}</button>
      </div>
    </transition>
    <transition name="bounce">
      <div class="guideopinion top" v-show="opinionGuidePages2">
        <img :src="guideopinion[1].img" alt="">
        <p>{{guideopinion[1].text}}</p>
        <button @click="guideOpinionclick(2)">{{guideopinion[1].button}}</button>
      </div>
    </transition>
    <!--//-->
    <div class="supervise-li" ref="headHeight">
      <header>
        <button><span>{{headTitle[0]}}</span>
          <span class="docDom">({{projectNumber[0]}}/{{projectNumber[1]}})</span>
        </button>
        <button @click="settingClick()"><i class="icon iconfont icon-bianji"></i><span>{{headTitle[1]}}</span>
        </button>
      </header>
    </div>
    <div class="sub-swipe" ref="subSwipe" :style="{ height: scrollAll + 'px'}">
      <div class="infinite-list">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="(list,index) in container" :key="index">
            <div slot="right-menu" class="menuBtns">
              <swipeout-button :background-color="'#ffb148'" @click.native="contClick(index)">编辑</swipeout-button>
              <swipeout-button :background-color="'#ff7250'" @click.native="deleteed(index)">删除</swipeout-button>
            </div>
            <div slot="content" class="infinite" @click="containerClick(index)">
              <div class="infinite-box">
                <p class="name">
                  <span class="name-item name-title"><span>{{list.projectName}}</span></span>
                  <span class="name-item name-right">
                  <button class="nomoColor"
                          v-if="list.monitor == true && list.isGather == false">{{'采集中('+numberTime(list.time)+')'}}</button>
                  <button v-else-if="list.monitor == true && list.isGather == true">{{textGlobal[0]}}</button>
                  <button class="nomonitor" v-else-if="list.monitor == false">{{textGlobal[6]}}</button>
                </span>
                </p>
                <p class="doc"><span>{{textGlobal[1]}}{{keyword(list.keywordList)}}</span></p>
                <p class="doc">
                  <span v-if="list.notice">{{textGlobal[2]}}{{textGlobal[4]}}</span>
                  <span v-else>{{textGlobal[2]}}{{textGlobal[5]}}</span>
                  <span>{{$const.format(list.createTime)}}</span>
                </p>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoaded" :text="loadingDrop[1]"></xiaoan-drop>
        </p>
        <xa-loading v-show="loading" bgColor="rgba(255,255,255,1)"></xa-loading>
      </div>
    </div>
    <v-returnHome bottom="6%"></v-returnHome><!--@event="goHome"-->
  </div>
</template>

<script>
  import VReturnHome from '../../components/warning/returnHome.vue';
  import XaLoading from '@/components/warning/loading'
  import guideopinion from '@/assets/icon/Guide'
  import {Swipeout, SwipeoutButton, SwipeoutItem} from 'vux'
  export default {
    name: "supervise-list",
    data() {
      return {
        projectNumber: ['00', 10], // [\/xx] 新增项目上限
        infLoading: false,
        allLoaded: false,
        userHomeData: {},
        loadingDrop: ['加载中', '您的账户已无法创建更多项目'],
        headTitle: ['我的项目', '新增项目'],
        textGlobal: ['监测中', '关键词：', '微信提醒：', '创建时间：', '已开启', '未开启', '未监测', 5],
        container: [],
        scrollAll: '',
        loading: true,
        twoTime: 300000, // 5分钟
        isGather: false,
        timestamp: 0,
        user_id: '',
        guideopinion: guideopinion.opinionGuide,
        opinionGuidePages: false,
        opinionGuidePages2: false
      }
    },
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XaLoading,
      VReturnHome
    },
    created() {
      this.user_id = this.$cookie.getCookie("userId");
      if (this.$cookie.isLogin()) {
        console.warn('已登录');
      } else {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      // 如果需要增加区分外部和内部用户 打开下行注释
      if (this.$cookie.getUserInfo()) {
        this.userHomeData = this.$cookie.getUserInfo();
        let level = this.userHomeData.level;
        if (level == 0) {
          // 外部用户
          this.projectNumber[1] = '03';
        }
      } else {
        this.userHome();
      }
      //
      this.timestamp = Date.parse(new Date()); // 当前时间
      //
      this.getAllProject();
      // 页面引导显示
      this.guideStatus();
    },
    mounted() {
      this.$nextTick(() => {
        this.scrollAll = (this.$refs.superviseDom.clientHeight - this.$refs.headHeight.clientHeight);
      });
      let adverttitle = "我的舆情";
      let sharelink2 = decodeURI(window.location.href);// 分享链接
      let shareDesc = ""; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
      console.log('2133321313', this.guideopinion);
    },
    methods: {
      //
      guideStatus() {
        if (window.localStorage.getItem('opinionGuidePages-list') == 'true') {
          this.opinionGuidePages = false;
          this.opinionGuidePages2 = false;
        } else {
          this.opinionGuidePages = true;
          this.opinionGuidePages2 = false;
        }
      },
      //
      userHome() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome().then((res) => {
          console.log('', res, '123');
          if (res.data.returnCode == 1) {
            if (res.data.returnObject !== null) {
              let level = res.data.returnObject.level;
              if (level == 0) {
                // 外部用户
                this.projectNumber[1] = '03';
              }
            }
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '请重新登录', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      //
      keyword(array) {
        let arr = [];
        for (let i in array) {
          arr.push(array[i].keywordName);
        }
        let key = [], keylen = 0;
        if (arr.length < 4) {
          keylen = 5
        } else {
          keylen = 3
        }
        for (let j in arr) {
          if (arr[j].length > keylen) {
            key.push(arr[j].substring(0, keylen) + '...');
          } else {
            key.push(arr[j]);
          }
        }
        console.log(key);
        return (key.join("，"))
      },
      //
      deleteProject(index) {
        let params = {
          projectId: this.container[index].id
        }
        this.$axios.opinion.deleteProject(params).then(res => {
          if (res.data.returnCode == 1) {
            this.loading = true;
            setTimeout(() => {
              this.$vux.toast.show({text: '删除成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }, 1000);
            this.getAllProject();
            setTimeout(() => {
              this.$nextTick(() => {
                this.loading = false;
              })
            }, 300)
          } else {

          }
        }).catch((err) => {
          console.error(err);
        })
      },
      // 删除
      deleteed(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteProject(index);
            console.log(index);
          },
          onCancel() {
          }
        })
      },
      //
      containerClick(index) {
        console.log(this.container[index]);
        if (this.container[index].isGather == false) {
          this.$vux.toast.show({text: '正在采集该项目数据，请稍后再试', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.$router.push({
            path: '/opinion',
            query: {id: this.container[index].id}
          });
        }
      },
      numberTime(number) {
        var time = '';
        console.log('number', number);
        if (number) {
          if (number >= 60) {
            time = (number / 60).toString().substring(0, 1) + '分钟';
          } else {
            time = '1分钟';
          }
          return time
        } else {
          return 5 + '分钟'
        }
      },
      //
      getAllProject() {
        this.loading = true;
        let params = {}
        this.$axios.opinion.getAllProject(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            setTimeout(() => {
              this.loading = false;
            }, 300);
            let container = res.data.returnObject;
            console.log((this.timestamp + this.twoTime));
            container.forEach((item) => {
              item.isGather = true;
              // if ((this.timestamp - item.createTime) < this.twoTime) {
              //   item.isGather = false;
              //   item.time = 315 - ((this.timestamp - item.createTime) / 1000);
              // }
            });
            //
            this.container = container;
            //
            if (container == null || container == [] || container.length == 0) {
              this.projectNumber[0] == '00';
            } else {
              this.projectNumber[0] = this.$const.add0(container.length);
              if (container.length >= Number(this.projectNumber[1])) {
                this.infLoading = true;
              } else {
                this.infLoading = false;
              }
            }
          } else {
            setTimeout(() => {
              this.$nextTick(() => {
                this.$router.replace({
                  path: '/supervise',
                  query: {add: '1'}
                });
              })
            }, 300)
          }
        }).catch((err) => {
          setTimeout(() => {
            this.loading = false;
          }, 3300);
          console.error(err);
        })
      },
      // 编辑
      contClick(index) {
        this.$router.push({
          path: '/supervise',
          query: {add: '0', id: this.container[index].id}
        });
      },
      // 新增
      settingClick() {
        if (this.container.length >= this.projectNumber[1]) {
          this.$vux.toast.show({text: '新增项目已达上限，无法创建新项目', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.$router.push({path: '/supervise', query: {add: 1}});
        }
      },
      //
      guideOpinionclick(index) {
        console.log(123);
        //
        if (index == 1) {
          this.opinionGuidePages = false;
          this.opinionGuidePages2 = true;
        }
        if (index == 2) {
          this.opinionGuidePages2 = false
        }
        if (this.opinionGuidePages2) {
          // true
        } else {
          // false
          window.localStorage.setItem('opinionGuidePages-list', 'true');
        }
      }
    }
  }
</script>

<style lang="scss">
  .bounce-enter-active {
    animation: bounce-in .3s;
  }
  .bounce-leave-active {
    animation: bounce-in .3s reverse;
  }
  @-moz-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @-o-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  .supervise-list {
  }
  #supervise-list {
    background-color: #f0f1f5;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .guideopinion.top {
      img {
        top: 1%;
        height: 280px;
      }
    }
    .guideopinion {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 5000;
      img {
        height: 230px;
        position: absolute;
        right: 0;
        top: 15%;
      }
      p {
        position: absolute;
        right: 18%;
        top: 55%;
        // background-color: ;
        color: white;
        font-size: 15px;
      }
      button {
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        height: 32.5px;
        width: 100px;
        background-color: rgba(0, 0, 0, 0.01);
        color: #ffb148;
        border-radius: 2px;
        font-size: 15px;
        text-align: center;
        line-height: 1;
        border: 1.5px dashed #ffb148;
      }
    }
    .supervise-li {
      background-color: white;
      padding: 0 12px;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      border-bottom: 0.5px solid #e3e3e3;
      header {
        box-sizing: border-box;
        font-size: 0;
        height: 100%;
        width: 100%;
        display: table;
        button {
          font-size: 15px;
          display: table-cell;
          vertical-align: middle;
          border: 0;
          background: #fff;
          width: 50%;
          height: 100%;
          color: #ffb148;
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          .icon-bianji {
            font-size: 18px;
            vertical-align: middle;
            color: #ffb148;
            padding-right: 5px;
          }
          .bj {
            font-size: 0;
            display: inline-block;
            background: url("https://oss.in-hope.cn/xiaoan/h5_static/opinion/bj-opiniono@3x.png") no-repeat center center;
            background-size: contain;
            height: 16px;
            width: 16px;
            margin-right: 4px;
          }
          span {
            vertical-align: middle;
            line-height: 1;
            display: inline-block;
          }
          .docDom {
            font-size: 12px;
            color: #aeaeae;
            font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          }
        }
        button:last-child {
          text-align: right;
          font-size: 12px;
        }
        button:first-child {
          font-size: 15px;
          text-align: left;
        }
      }
    }
    .sub-swipe {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      .infinite-list {
        padding-top: 10px;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .menuBtns {
          padding-bottom: 10px;
        }
        .menuBtns {
          padding-bottom: 10px;
        }
        .infinite {
          background-color: #f0f1f5;
          padding: 0 10px 10px 10px;

          .infinite-box {
            position: relative;
            background-color: white;
            padding: 10px;
            .click {
              border: 0;
              position: absolute;
              right: 0;
              bottom: 0;
              height: 40px;
              width: 60px;
              background-color: rgba(0, 0, 0, 0);
              z-index: 200;
            }
            .name {
              width: 100%;
              font-size: 15px;
              color: #323232;
              display: table;
              table-layout: fixed;
              white-space: normal;
              padding-bottom: 5px;
              box-sizing: border-box;
              padding-top: 2px;
              .name-item {
                display: table-cell;
                width: 50%;
                button {
                  border: 0;
                  background: #90b8f4;
                  height: 100%;
                  padding: 0 3px;
                  color: white;
                  border-radius: 2px;
                  font-size: 12px;
                }
              }
              .name-title {
                text-align: left;
                width: 75%;
                span {
                  width: 100%;
                  display: block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .nomoColor {
                background-color: rgba(255, 177, 72, 0.75);
              }
              .nomonitor {
                background-color: #8d8d8d;
              }
              .name-right {
                text-align: right;
                width: 25%;
              }
            }
            .doc {
              display: table;
              width: 100%;
              font-size: 12px;
              color: #8d8d8d;
              position: relative;
              margin-bottom: 3px;
              table-layout: fixed;
              white-space: normal;
              span {
                display: table-cell;
                width: 50%;
                vertical-align: middle;
                .bj {
                  font-size: 0;
                  display: inline-block;
                  background: url("https://oss.in-hope.cn/xiaoan/h5_static/opinion/bj-opinion@3x.png") no-repeat center center;
                  background-size: contain;
                  height: 16px;
                  width: 16px;
                  vertical-align: middle;
                }
              }

              span:last-child {
                text-align: right;
                font-size: 12px;
              }
              span:first-child {
                text-align: left;
              }
            }
            .doc:last-child {
              margin: 0
            }
          }

        }
      }
    }
  }
</style>
