<template>
  <transition name="bounce">
    <div class="xiaoan-box user-other">
      <div class="user-other-scroll" ref="docentDom">
        <div class="other-header" ref="headerDom">
          <div class="other-header-box" :class="{isChief: chief}">
            <div class="other-header-top vux-1px-b">
              <div class="left-img">
              <span class="middle-img">
                <img v-show="chief" class="Bug-V" :src="$image.userother.userOther" alt="">
                <img :class="{isChief: chief}" :src="userData.headUrl" alt="" v-if="userData.headUrl">
                <img :class="{isChief: chief}" :src="$image.personal.timg" alt="" v-else>
              </span>
              </div>
              <div class="right-title">
                <p class="title vux-1px-b" @click="synopsisClick">
                  <span class="synopsis">{{synopsis}}</span>
                </p>
                <!--<p class="about">{{userData.synopsis}}</p>-->
                <ul>
                  <li>
                    <div class="num">{{userData.answerNum}}</div>
                    <div class="name">他的回答</div>
                  </li>
                  <li>
                    <div class="num">{{userData.attentionUserNum}}</div>
                    <div class="name">他关注的人</div>
                  </li>
                  <li>
                    <div class="num">{{userData.coverAttentionUserNum}}</div>
                    <div class="name">关注他的人</div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="other-header-bottom">
              <div class="stateful">
                <ul>
                  <li>
                  <span class="list">
                    <img :src="$image.userother.zhan" alt="">
                    <span class="number">{{userData.praiseNum }}</span>
                  </span>
                    <span class="list two" v-show="false">
                    <img :src="$image.userother.integrate" alt="">
                    <span>21321</span>
                  </span>
                  </li>
                  <li class="statefulList" v-if="$route.query.selectUserId == userHomeData.id"></li>
                  <li class="statefulList" v-else>
                    <button class="select" :class="{isChief: chief}" @click="attentionClick(true)"
                            v-show="!userData.attention">
                      <i class="icon iconfont icon-jia3"></i>&ensp;关注
                    </button>
                    <button class="out" :class="{isChief: chief}" @click="attentionClick(false)"
                            v-show="userData.attention">已关注
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-transfer-dom>
          <x-dialog hide-on-blur class="dialog-userOther" v-model="synopsisInput">
            <div class="userOther-box">
              <div class="title">修改个人简介</div>
              <div class="content">
                <div class="vux-1px-b">
                  <input ref="inputDom" id="input-synopsis" type="text" placeholder="请输入个人简介，最多10个字符"
                         v-model="synopsisVal"
                         maxlength="10">
                </div>
              </div>
              <div class="footer vux-1px-t">
                <button @click="synopsisInput =false">取消</button>
                <button @click="synopsisSub">确定</button>
              </div>
            </div>
          </x-dialog>
        </div>
        <div class="other-container" :style="{height: contentHeight+'px'}">
          <div class="tab-box vux-1px-b" ref="tabDom">
            <tab :scroll-threshold=3 :line-width=2 :active-color="'#ffb148'" v-model="active" custom-bar-width="30px">
              <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index">
                {{item.name}}
              </tab-item>
            </tab>
          </div>
          <div class="tab-container" :style="{height:tabHeight+'px'}">
            <swiper v-model="active" :min-moving-distance="130" :height="'100%'" :show-dots="false">
              <swiper-item>
                <user-other-item :height="tabHeight" :active="tabData[active].type" :status="status"></user-other-item>
              </swiper-item>
              <swiper-item>
                <user-other-client-item :type="0" :height="tabHeight" :status="status"
                                        :active="tabData[active].type"></user-other-client-item>
              </swiper-item>
              <swiper-item>
                <user-other-client-item :type="1" :height="tabHeight"
                                        :active="tabData[active].type" :status="status"></user-other-client-item>
              </swiper-item>
            </swiper>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {Swiper, SwiperItem, Tab, TabItem, TransferDomDirective as TransferDom, XButton, XDialog} from 'vux'
  import userOtherItem from './components/userOther/userOtherItem'
  import userOtherClientItem from './components/userOther/userOtherClientItem'

  export default {
    name: "user-other",
    components: {
      Swiper, SwiperItem, Tab, TabItem, XButton,
      userOtherItem, userOtherClientItem, XDialog
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        synopsisVal: '',
        synopsisInput: false,
        tabHeight: 0,
        contentHeight: 0,
        active: 0,
        tabData: [
          {name: "他的回答", type: "collect"},
          {name: "他关注的人", type: "share"},
          {name: "关注他的人", type: "groom"}
        ],
        chief: false, // 是否是大V
        synopsis: '乎主很神秘，还没有留下任何信息。',
        userData: {
          answerNum: 0,
          attentionUserNum: 0,
          coverAttentionUserNum: 0,
          synopsis: '乎主很神秘，还没有留下任何信息。'
        },
        userHomeData: {},
        status: 0,
        selectUserId: '',
        stateChange: 0
      }
    },
    watch: {
      stateChange: function (val) {
        if (this.$route.query.selectUserId == this.userHomeData.id) {
          // 自己
          if (this.userData.synopsis) {
            //
            this.synopsis = this.userData.synopsis
          } else {
            //
            this.synopsis = '留下只字片语，让大家了解你。'
          }
        } else {
          // 非自身
          if (this.userData.synopsis) {
            //
            this.synopsis = this.userData.synopsis
          } else {
            //
            this.synopsis = '乎主很神秘，还没有留下任何信息。'
          }
        }
      }
    },
    created() {
      this.userId = this.$cookie.getCookie("userId");
      if (this.$cookie.getUserInfo()) {
        this.userHomeData = this.$cookie.getUserInfo();
        console.log(this.userHomeData);
      }
      if (this.$cookie.isLogin()) {
        // this.apiUserHome();
        if (this.$route.query.selectUserId) {
          this.selectUserId = this.$route.query.selectUserId;
          // 有 selectUserId
          this.searchUserData()
        } else {
          // 无

        }
      } else {
        this.$storage.loginStatus(this, '我的个人主页', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.contentHeight = this.$refs.docentDom.clientHeight - this.$refs.headerDom.clientHeight;
        console.log(this.$refs.docentDom.clientHeight, this.$refs.headerDom.clientHeight);
        this.tabHeight = this.$refs.docentDom.clientHeight - this.$refs.headerDom.clientHeight - this.$refs.tabDom.clientHeight;
      });
    },
    methods: {
      synopsisSub() {
        this.updateSynopsisByUserId();
      },
      synopsisClick() {
        if (this.$route.query.selectUserId == this.userHomeData.id) {
          this.synopsisInput = true;
          this.synopsisVal = this.userData.synopsis;
          if (this.userData.synopsis) {
            this.synopsisVal = this.userData.synopsis;
          } else {
            this.synopsisVal = '';
          }
          setTimeout(() => {
            this.$refs.inputDom.focus();
          }, 100)
        }
      },
      updateSynopsisByUserId() {
        let params = {
          synopsis: this.synopsisVal
        }
        this.$axios.user.updateSynopsisByUserId(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.searchUserData();
            this.synopsisInput = false;
            this.$vux.toast.show({text: '修改成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$vux.toast.show({text: '修改修改失败，请稍后再试', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      },
      // 获取登录信息
      apiUserHome() {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId.", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            this.stateChange += 1;
            this.userHomeData = data;
            let isTestUser = data.testUser;
            if (isTestUser == false) {
              // 非测试用户
              this.$router.replace({path: '/error', query: {img: '', text: '该功能暂时只对内测用户开放', show: 1}});

            }
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
      attentionClick(bal) {
        if (bal) {
          console.log('关注');
          this.addAttention();
          this.$MTAmethod.mtaClick('th7Yz7CYvV', {'j7r27qxjqp': 'true'});
        } else {
          let _this = this;
          this.$vux.confirm.show({
            title: '',
            content: '您确定要取消关注吗？',
            // 组件除show外的属性
            onConfirm() {
              _this.unFollow();
            },
            onCancel() {
              console.log(false);
            }
          })
        }
      },
      //
      unFollow() {
        /*this.$http({
          method: "DELETE",
          url: this.$api.xinhu.unFollow,
          params: {
            concernedId: this.userData.userId,
            attentionType: 2 // 取消关注用户的
          }
        })*/
        let params = {
          concernedId: this.userData.userId,
          attentionType: 2 // 取消关注用户的
        }
        this.$axios.xinhu.unFollow(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.searchUserData();
            this.status += 1;
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '取消失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      },
      //
      addAttention() {
        /*this.$http({
          method: "POST",
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_PEOPLE',
            concernedId: this.selectUserId,
            concernedTitle: this.userData.userName
          }
        })*/
        let params = {
          attentionType: 'ATTENTION_PEOPLE',
          concernedId: this.selectUserId,
          concernedTitle: this.userData.userName
        }
        this.$axios.xinhu.addAttention(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            console.log(res.data);
            this.status += 1;
            this.searchUserData();
          }
        }).catch((err) => {

        })
      },
      //
      searchUserData() {
        let params = {
          selectUserId: this.selectUserId
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.user.searchUserData,
          params: {
            selectUserId: this.selectUserId
          }
        })*/
        this.$axios.user.searchUserData(params).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.userData = res.data.returnObject;
            this.stateChange += 1;
            this.chief = this.userData.vip;
            document.title = this.userData.userName;
            //
            this.$nextTick(() => {
              var adverttitle = this.userData.userName + '的信公小安主页';
              var sharelink2 = window.location.href; // 分享链接
              var shareDesc = '';// 描述
              if (this.userData.synopsis) {
                shareDesc = this.userData.synopsis;
              }
              this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
            })
            this.$nextTick(() => {
              this.contentHeight = this.$refs.docentDom.clientHeight - this.$refs.headerDom.clientHeight;
              console.log(this.$refs.docentDom.clientHeight, this.$refs.headerDom.clientHeight);
              this.tabHeight = this.$refs.docentDom.clientHeight - this.$refs.headerDom.clientHeight - this.$refs.tabDom.clientHeight;
            });
          } else {
          }
        }).catch((err) => {
        })
      },
    }
  }
</script>

<style lang="scss">
  .dialog-userOther {
    .weui-dialog {
      height: auto;
      width: 72%;
      max-width: 100%;
      max-height: 100%;
      background-color: transparent;
      border-radius: 10px;
    }
    .userOther-box {
      height: 100%;
      position: relative;
      background-color: #fff;
      .title {
        padding: 14px 12px;
        text-align: center;
        width: 100%;
        font-size: 15px;
        color: rgba(255, 255, 255, 0.7);
        background: -webkit-gradient(linear, 50% 0%, 75% 100%, from(#DAC28B), to(#BDA36D));
      }
      .content {
        width: 100%;
        padding: 30px 12px 0 12px;
        margin-bottom: 75px;
        input {
          width: 100%;
          border: 0;
          border-radius: 2px;
          color: #545454;
          padding: 5px 0 10px 0;
          font-size: 15px;
        }
      }
      .footer {
        display: flex;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        button {
          font-size: 15px;
          border: 0;
          height: 44px;
          background-color: #FFFFFF;
          color: #BDA36D;
          flex: 1;
          &:last-child {
            color: #FFFFFF;
            background: -webkit-gradient(linear, 50% 0%, 75% 100%, from(#DAC28B), to(#BDA36D));
          }
        }
      }
    }
  }
  .user-other {
    padding-bottom: 50px;
    .user-other-scroll {
      background-color: #FFFFFF;
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .other-header {
        width: 100%;
        padding: 12px 12px 1px 12px;
        .other-header-box.isChief {
          box-shadow: 0px -2px 10px rgba(122, 100, 67, 0.23);
          background: -webkit-gradient(linear, 50% 0%, 75% 100%, from(#DAC28B), to(#BDA36D));
        }
        .other-header-box {
          width: 100%;
          background: -webkit-gradient(linear, 50% 0%, 75% 100%, from(#b8b8b8), to(#bbb6af));
          display: table;
          table-layout: fixed;
          word-wrap: break-word;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0px -2px 10px rgba(184, 184, 184, 0.23);
          .other-header-top {
            .left-img {
              display: table-cell;
              width: 22%;
              vertical-align: middle;
              line-height: 1;
              .middle-img {
                display: inline-block;
                height: 65px;
                width: 65px;
                background-color: #fff;
                border-radius: 50%;
                position: relative;
                .Bug-V {
                  height: 17px;
                  width: 17px;
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  border: 0;
                }
                img {
                  height: 100%;
                  width: 100%;
                  border-radius: 50%;
                  border: 2px solid #d2d3d0;
                }
                img.isChief {
                  border: 2px solid #ebdcc1;
                }
              }

            }
            .right-title {
              width: 78%;
              display: table-cell;
              vertical-align: middle;
              .title {
                font-size: 15px;
                color: #FFFFFF;
                font-family: PingFangSC-Medium, sans-serif;
                padding-bottom: 5px;
                display: flex;
                align-items: center;
                .userName {
                  display: inline-block;
                  max-width: 80px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                input {
                  color: #FFFFFF;
                  background-color: transparent;
                  border: 0;
                  width: 100%;
                }
              }
              .about {
                font-size: 12px;
                color: #fff;
              }
              ul {
                padding-top: 6px;
                padding-bottom: 6px;
                display: table;
                table-layout: fixed;
                word-wrap: break-word;
                width: 100%;
                color: #FFFFFF;
                li {
                  display: table-cell;
                  vertical-align: middle;
                  .num {
                    font-size: 15px;
                    font-family: PingFangSC-Medium, sans-serif;
                  }
                  .name {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.6);
                  }
                }
                li:last-child {
                  padding-left: 9%;
                }
                li:first-child {
                }
              }
            }
          }
          .other-header-bottom {
            color: #FFFFFF;
            .customer {
              padding-top: 5px;
              span {
                height: 15px;
                display: inline-block;
                img {
                  height: 100%;
                  vertical-align: top;
                }
              }
            }
            .stateful {
              padding-top: 10px;
              ul {
                display: table;
                width: 100%;
                li {
                  display: table-cell;
                  vertical-align: middle;
                  .list {
                    img {
                      height: 12px;
                    }
                    .number {
                      font-size: 15px;
                      font-family: PingFangSC-Medium, sans-serif;
                    }
                  }
                  .list.two {
                    padding-left: 20px;
                  }

                }
                .statefulList {
                  .select {
                    width: 56px;
                    border-radius: 2px;
                    border: 0;
                    border: none;
                    text-align: center;
                    background-color: #FFFFFF;
                    height: 21px;
                    color: rgba(184, 184, 184, 1);
                    font-size: 12px;
                    i {
                      font-size: 11px;
                      color: rgba(184, 184, 184, 1);
                    }
                  }
                  .out {
                    border-radius: 2px;
                    width: 56px;
                    height: 21px;
                    border: none;
                    background-color: rgba(255, 255, 255, 0.7);
                    color: rgba(184, 184, 184, 1);
                    font-size: 12px;
                  }
                  .select.isChief {
                    color: rgba(189, 163, 109, 1);
                    i {
                      color: rgba(189, 163, 109, 1);
                    }
                  }
                  .out.isChief {
                    background-color: rgba(255, 255, 255, 0.7);
                    color: rgba(189, 163, 109, 1);
                  }
                }
                li:last-child {
                  text-align: right;
                }
              }
            }
          }
        }
      }
      .other-container {
        .tab-container {
          .vux-slider {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
</style>
