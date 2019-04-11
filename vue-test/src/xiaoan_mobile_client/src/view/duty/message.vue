<template>
  <transition name="bounce">
    <div class="xiaoan-box push-message">
      <div class="push-message-scroll" ref="messageDom">
        <div class="" ref="tabDom">
          <flexbox :gutter="0" wrap="wrap" class="vux-1px-b">
            <flexbox-item :span="6/7">
              <div class="tab-box">
                <tab :scroll-threshold=7 :line-width=2 :active-color="'#ffb148'" v-model="active"
                     custom-bar-width="28px">
                  <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index" v-if="item.show">
                    {{item.name}}
                    <badge class="tab-badge" v-if="!item.badge"></badge>
                  </tab-item>
                </tab>
              </div>
            </flexbox-item>
            <flexbox-item :span="1/7">
              <div class="tab-right vux-1px-l" @click="megRead">
                <img :src="$image.message.tab" alt="" :class="{filter:filterImg}">
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="tab-container" :style="{height:tabHeight+'px'}">
          <swiper v-model="active" :min-moving-distance="130" :height="'100%'" :show-dots="false">
            <swiper-item v-for="(item ,index) of tabData" :key="index" v-if="item.show">
              <message-item :height="tabHeight" :remind="remind" :type="item.type"
                            :active="active"></message-item>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {Badge, Divider, Flexbox, FlexboxItem, Swiper, SwiperItem, Tab, TabItem} from 'vux'
  import MessageItem from './components/message/messageItem'

  export default {
    name: "push-message",
    components: {
      Flexbox, Badge,
      FlexboxItem,
      Divider, Tab, TabItem, Swiper,
      SwiperItem, MessageItem
    },
    data() {
      return {
        page: {
          index: 1,
          size: 10,
          total: 0
        },
        filterImg: false,
        totalBadge: false,
        allLoading: false,
        tabHeight: 0,
        active: 0,
        remind: 0,
        tabData: [
          {show: true, type: 'total', name: '全部', value: 0, active: '', badge: true},
          {show: true, type: 'xinhu', name: '信乎', value: 6, active: '', badge: true},
          {show: true, type: 'focus', name: '关注', value: 1, active: '', badge: true},
          {show: true, type: 'notice', name: '公告', value: 2, active: '', badge: true},
          {show: true, type: 'stock', name: '异动', value: 3, active: '', badge: true},
          {show: true, type: 'report', name: '研报', value: 4, active: '', badge: true},
          {show: true, type: 'opinion', name: '舆情', value: 5, active: '', badge: true}
        ],
        messageTypeObj: [
          {type: 'total', value: 0, name: '全部'},
          {type: 'focus', value: 1, name: '关注'},
          {type: 'notice', value: 2, name: '公告'},
          {type: 'stock', value: 3, name: '异动'},
          {type: 'report', value: 4, name: '研报'},
          {type: 'opinion', value: 5, name: '舆情'},
          {type: 'xinhu', value: 6, name: '信乎'}
        ],
        isData: true,
        isTestUser: 0,
      }
    },
    watch: {
      active: function (val) {
        console.log('this.active', val);
        console.log('this.active', this.tabData[val].value);
        let showData = [];
        this.tabData.forEach((item) => {
          if (item.show) {
            showData.push(item)
          }
        });
        this.$router.replace({query: {active: showData[val].type}});
        this.getMessageByType(showData[this.active].value);
        if (this.active == 0) {
          this.filterImg = this.totalBadge;
        } else {
          console.log('====>', showData[this.active].badge);
          this.filterImg = showData[this.active].badge
        }
      },
      remind: function (val) {
        this.searchUserData();
      }
    },
    created() {
      this.userId = this.$cookie.getCookie("userId");
      // 我的关注获取用户信息判断是否填写个人信息  若是没有则跳转填写个人信息页面
      if (this.$cookie.isLogin()) {
        // this.apiUserHome();
        if (this.$route.query.active) {
          this.tabData.forEach((item, index) => {
            if (item.type == this.$route.query.active) {
              this.active = index;
              this.getMessageByType(this.tabData[this.active].value);
            }
          })
        } else {
          this.getMessageByType(this.tabData[this.active].value);
          this.$router.replace({query: {active: this.tabData[this.active].type}});
        }
      } else {
        this.$storage.loginStatus(this, '消息', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.tabHeight = this.$refs.messageDom.clientHeight - this.$refs.tabDom.clientHeight;
      });
      let adverttitle = '';
      let sharelink2 = this.$api.CURRENTIP.IP + '#/rule';// 分享链接
      let shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      // 获取登录信息
      apiUserHome() {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            // let isTestUser = data.testUser;
            // if (isTestUser == false) {
            //   // 非测试用户
            //   this.isTestUser = 2;
            //   console.warn(2);
            //   this.tabData.forEach((item) => {
            //     if (item.type == 'xinhu') {
            //       item.show = false
            //     }
            //   })
            // } else {
            //   this.tabData.forEach((item) => {
            //     item.show = true;
            //   })
            // }
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({
              text: res.data.returnCode + res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      megRead() {
        if (!this.isData) {
          return false
        }
        if (this.active == 0) {
          if (this.totalBadge) {
            return false
          }
        } else {
          if (this.tabData[this.active].badge) {
            return false
          }
        }
        let val = this.tabData[this.active].value;
        let contentText = '确定要将"' + this.tabData[this.active].name + '"标记为已读吗？';
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: contentText,
          // 组件除show外的属性
          onConfirm() {
            _this.setAllUserMsgRead(val);
          },
          onCancel() {
          }
        });
        console.log(this.active);
        console.log(this.tabData[this.active].value);
      },
      //
      setAllUserMsgRead(messageType) {
        let params =  {
            msgType: messageType,
          }
        this.$axios.userMsg.setAllUserMsgRead(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.remind += 1;
            this.getMessageByType(0);
          }
        }).catch((error) => {
          this.$vux.toast.show({text: error, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      //
      //
      searchUserData() {
        let params = {
          selectUserId: 0
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.user.searchUserData,
          params: {
            selectUserId: 0
          }
        })*/
        this.$axios.common.autoComplete(params).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let userData = res.data.returnObject;
            let badgeD = true;
            if (userData.readMsgCount == 0 || userData.readMsgCount == null) {
              badgeD = 0
            } else {
              badgeD = userData.readMsgCount;
              if (userData.readMsgCount > 99) {
                badgeD = "99+";
              }
            }
            this.$store.commit('IS_MESSAGE', {isMessage: badgeD});
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      //
      getMessageByType(message) {
        let params = {
          messageType: message,
          pageNum: 1,
          pageSize: 2
        }
        this.$axios.userMsg.getMessageByType(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            if (data.XIN_HU && data.ATTENTION && data.NOTICE && data.TRANSACTION && data.REPORT&& data.SENTIMENT) {
              this.totalBadge = true;
              // 没有消息
              this.filterImg = true;
            } else {
              // 有消息
              this.totalBadge = false;
            }
            this.tabData.forEach((item) => {
              if (item.type == 'xinhu') {
                item.badge = data.XIN_HU;
              }
              if (item.type == 'focus') {
                item.badge = data.ATTENTION
              }
              if (item.type == 'notice') {
                item.badge = data.NOTICE
              }
              if (item.type == 'stock') {
                item.badge = data.TRANSACTION
              }
              if (item.type == 'report') {
                item.badge = data.REPORT
              }
              if (item.type == 'opinion') {
                item.badge = data.SENTIMENT
              }
            });
            this.tabData = Object.assign([], this.tabData);
            console.log('32424242', this.tabData);
            if (data.isAllReadIs) {
              this.isData = false;
            } else {
              this.isData = true;
            }
          } else {
            this.isData = false;
          }
        }).catch((error) => {
          this.$vux.toast.show({text: error, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      }
    }
  }
</script>

<style lang="scss">
  .push-message {
    padding-bottom: 50px;
    .push-message-scroll {
      height: 100%;
      width: 100%;
      background-color: #FFFFFF;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .tab-box {
        .vux-tab .vux-tab-item {
          background: transparent;
        }
        .tab-badge {
          position: absolute;
          top: 9px;
          padding: 3px;
        }
      }
      .tab-right {
        height: 100%;
        width: 100%;
        text-align: center;
        img {
          height: 18px;
        }
        .filter {
          -webkit-filter: grayscale(1);
        }
      }
      .tab-right.vux-1px-l {
        &:before {
          border-left-color: #8d8d8d;
          height: 20px;
        }
      }
      .tab-container {
        .vux-slider {
          height: 100%;
        }
      }
    }
  }
</style>
