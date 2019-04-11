<template>
  <transition name="bounce">
    <div class="xiaoan-box xiaoan-my" id="my" ref="myDom">
      <div class="my-scroll">
        <div class="my-default" ref="dsfaultDom">
          <header class="my-header">
            <div class="my-h-box" @click="toManage">
              <ul class="my-h-box-tab">
                <li class="left">
                  <div class="img-box"><img :src="userInfo.weixinAvatar" alt="">
                  </div>
                </li>
                <li class="middle" v-if="this.Register">
                  <p class="top">{{userInfo.userName}}</p>
                  <p class="bottom">
                    <span v-if="userInfo.synopsis">{{userInfo.synopsis}}</span>
                    <span v-else>{{'编辑个人简介'}}</span>
                  </p>
                </li>
                <li class="middle" v-else>
                  <p class="pleaseLogin">登录小安，体验更多功能</p>
                </li>
                <li class="right">
                  <b class="icon iconfont icon-xiangyoujiantou"></b>
                </li>
              </ul>
            </div>
          </header>
          <div class="my-card-box">
            <div class="card-flex">
              <div v-for="(list,i) in cardBox" @click="cardClick(i)"
                   class="vux-fax-height xiaoan-active" :class="{'vux-1px-r':list.way}">
                <p class="value">
                  <countup :duration="1" :start-val="0" :end-val="list.value"></countup>
                </p>
                <p>{{list.name}}</p>
              </div>
            </div>
          </div>
          <div class="xiaoan-foo"></div>
          <div class="my-grid-box">
            <grid :cols="4" :show-lr-borders="false">
              <grid-item v-for="(list,i) in gridBox" :key="i" v-show="list.way" @click.native="gridClick(i)">
                <transition name="bounce">
                  <badge class="grid-badge" v-show="!list.badge" :text="list.badgeNum"></badge>
                </transition>
                <img slot="icon" :src="list.img">
                <span slot="label">{{list.name}}</span>
              </grid-item>
            </grid>
          </div>
          <div class="xiaoan-foo"></div>
        </div>
        <div class="my-banner">
          <vxa-banner advType="my"></vxa-banner>
        </div>
      </div>
    </div>
    <xiaoan-loading v-show="loading"></xiaoan-loading>
  </transition>
</template>

<script>
  import enterpriseInvite from '@/components/enterprise/enterpriseInvite'
  import XiaoanLoading from '@/components/warning/loading'
  import {mapState} from 'vuex'
  import {Badge, Countup, Grid, GridItem} from 'vux'

  export default {
    name: "my",
    components: {
      XiaoanLoading,
      Grid,
      GridItem, Countup, Badge,
      'v-enterpriseInvite': enterpriseInvite
    },
    data() {
      return {
        cardBox: [
          {id: 0, type: 'creation', name: '创作', value: 0, link: '/creation', way: true},
          {id: 1, type: 'focus', name: '关注', value: 0, link: '/focus', way: true},
          {id: 2, type: 'collect', name: '收藏', value: 0, link: '/collect', way: true},
          {id: 3, type: 'track', name: '足迹', value: 0, link: '/track', way: false}
        ],
        gridBox: [
          {
            type: 'testing',
            name: '测评',
            img: this.$image.my.testing,
            link: '/testing',
            way: true,
            badge: true
          },
          {
            type: 'internal',
            name: '权限速查',
            img: this.$image.my.internal,
            link: '',
            way: true,
            badge: true
          },
          {
            type: 'opinion',
            name: '舆情',
            img: this.$image.my.oponion,
            link: '/superviseList',
            way: true,
            badge: true
          },
          {
            type: 'calendar',
            name: '日历',
            img: this.$image.my.calendar,
            link: 'calendar/calendarAll',
            way: true,
            badge: true
          },
          {
            type: 'luyanzhong',
            name: 'IR旗舰店',
            img: this.$image.my.luyanzhong,
            link: '',
            way: false,
            badge: true
          },
          {
            type: 'tech',
            name: '小安商学院',
            img: this.$image.my.tech,
            link: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/',
            way: true,
            badge: true
          },
          {
            type: 'report',
            name: '研报',
            img: this.$image.my.report,
            link: '/report',
            way: true,
            badge: true
          },
          {
            type: 'publish',
            name: 'IPO',
            img: this.$image.my.publish,
            link: '/ipo/list',
            way: true,
            badge: true
          },
          {
            type: 'notice',
            name: '异动提醒',
            img: this.$image.my.remind,
            link: '',
            way: true,
            badge: true
          },
          {
            type: 'message',
            name: '消息',
            img: this.$image.my.message,
            link: '/message',
            way: true,
            badge: true
          },
          {
            type: 'manual',
            name: '小安指南',
            img: this.$image.my.brief,
            link: '/manual',
            way: true,
            badge: true
          },
          {
            type: 'manual',
            name: '十大新规',
            img: this.$image.my.newRule,
            link: '/topTenRules',
            way: true,
            badge: true
          }
        ],
        bannerHeight: 0,
        levels: 0,
        userData: {}, // searchUserData
        rulTime: '',
        user_Id: '',
        num: '',
        xiaoanVersion: '',
        Register: false, // 是否授权登录
        nowheight: '',
        loading: false,
        isMarket: false,
        isTestUser: 0,
        userInfo: {
          userName: '',
          weixinAvatar: this.$image.personal.timg
        }
      }
    },
    watch: {
      isMessage: function (val) {
        console.log('3242432432valvalvalvalval', val);
        this.isMessageSet(val);
      }
    },
    //页面构建前准备
    created() {
      this.xiaoanVersion = this.$api.version.code;
      window.localStorage.removeItem('SUBSCRIBE');
      window.localStorage.removeItem("collectStatus");
      if (this.$cookie.isLogin()) {
        this.apiUserHome();
        this.searchUserData();
        this.Register = true;
        this.isMessageSet(this.isMessage);
      } else {
        this.Register = false;
      }
    },
    computed: {
      ...mapState({
        isMessage: state => state.mutations.isMessage,
        footerHeight: state => state.mutations.footerHeight
      })
    },
    mounted() {
      setTimeout(() => {
        // this.loading = false;
        // this.$store.commit('UPDATE_HOMESHOW', {isHomeShow: true});
      }, 300);
      this.$nextTick(() => {
        clearInterval(window.timePianli);
        this.bannerHeight = this.nowheight - this.$refs.dsfaultDom.clientHeight;
      });
      //
      let adverttitle = document.title;
      let sharelink2 = window.location.href; // 分享链接
      let shareDesc = ""; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      //
      isMessageSet(val) {
        this.gridBox.forEach((item) => {
          if (item.type == 'message') {
            if (val == 0 || val == null) {
              item.badge = true;
              item.badgeNum = 0;
            } else {
              item.badge = false;
              item.badgeNum = val;
              if (val > 99) {
                item.badgeNum = "99+";
              }
            }
          }
        })
      },
      //
      toManage() {
        this.$router.push({path: '/manage'});
      },
      //
      gridClick(index) {
        console.log(index, this.gridBox[index].name);
        switch (this.gridBox[index].type) {
          case 'internal':
            if (this.Register) {
              this.internalLink(index);
            } else {
              this.$storage.loginStatus(this, '个人中心', window.location.href);
            }
            break;
          case 'luyanzhong':
            if (this.gridBox[index].link == null) {
              this.$vux.toast.show({text: '链接获取失败！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else {
              window.location.href = this.gridBox[index].link;
              this.$MTAmethod.mtaClick('Vv55tXYlcJIhB0Xm', {'drp393hmwy5gkngo': 'true'})
            }
            break;
          case 'tech':
            window.location.href = this.gridBox[index].link;
            break;
          case 'notice':
            // notice 异动提醒
            if (this.Register) {
              // 登陆状态
              this.noticeStock();
            } else {
              // 没登陆
              this.$storage.loginStatus(this, '个人中心', window.location.href);
            }
            break;
          default:
            this.$router.push({path: this.gridBox[index].link});
            break;
        }
      },
      //
      internalLink(index) {
        if (this.levels == 1) {
          this.$router.push({path: "/searchPower"});
        } else if (this.levels == 0) {
          if (!this.userInfo.enterpriseUser && !this.userInfo.companyCode) {
            let _this = this;
            this.$vux.confirm.show({
              title: '',
              content: '您目前不是上市公司用户，该功能只对上市公司用户有效',
              // 组件除show外的属性
              onConfirm() {
                _this.$router.push({path: 'manage/reviseInfo'});
              },
              onCancel() {
                console.log(false);
              }
            })
          } else {
            this.getPermissionCheckList(index);
          }
        }
      },
      //
      cardClick(index) {
        // isTestUser
        if (this.cardBox[index].type == 'creation') {
          if (this.isTestUser == 1) {
            // 测试用户
            this.$router.push({path: this.cardBox[index].link});
          } else if (this.isTestUser == 0) {
            // 正式用户
            this.$router.push({path: this.cardBox[index].link});
          } else if (this.isTestUser == 2) {
            // 非测试用户
            let _this = this;
            this.$vux.confirm.show({
              title: '',
              content: '该功能暂时只对内测用户开放',
              // 组件除show外的属性
              onConfirm() {
              },
              onCancel() {
              }
            })
          }
        } else {
          this.$router.push({path: this.cardBox[index].link});
        }
        console.log(this.cardBox[index]);
      },
      //
      autoComplete(code) {
        let params = {
          key: code,
        }
        this.$axios.common.autoComplete(params).then(res => {
          if (res.data.returnCode === 1) {
            let code = res.data.returnObject[0].fullCode;
            this.$router.push({path: '/afficheList', query: {code: code}});
          }
        }).catch((err) => {
          this.$vux.toast.show({
            text: 'common/autoComplete', position: 'middle', type: 'text', width: 'auto', time: 2500
          });
          console.error(err);
        })
      },
      //
      noticeStock() {
        if (this.isMarket) {
          this.autoComplete(this.userInfo.companyCode);
        } else {
          let _this = this;
          this.$vux.confirm.show({
            title: '',
            content: '您目前不是上市公司用户，该功能只对上市公司用户有效',
            // 组件除show外的属性
            onConfirm() {
              _this.$router.push({path: 'manage/reviseInfo'});
            },
            onCancel() {
              console.log(false);
            }
          })
        }
      },
      //
      searchUserData() {
        let params = {
          selectUserId: 0
        }
        /*this.$http({
          method: 'GET',
          url: this.$api.user.searchUserData,
          params: {
            selectUserId: 0
          }
        })*/
        this.$axios.user.searchUserData(params).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.userData = res.data.returnObject;
            this.cardBox.forEach((item) => {
              if (item.type == 'creation') {
                item.value = this.userData.creationNum
              }
              if (item.type == 'focus') {
                item.value = this.userData.attentionNum
              }
              if (item.type == 'collect') {
                item.value = this.userData.collectNum
              }
              if (item.type == 'track') {
                item.value = this.userData.browsingNum
                if (item.value > 20) {
                  item.value = 20
                }
              }
              if (item.value > 9999) {
                item.value = '9999+'
              }
            });
          } else {
            this.userData = {};
          }
        }).catch((err) => {
        })
      },
      // 获取登录信息
      apiUserHome() {
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            this.userInfo = data;
            if (!this.userInfo.weixinAvatar) {
              this.userInfo.weixinAvatar = this.$image.personal.timg;
            }
            this.levels = data.level; // 区分内外部用户
            //
            this.$cookie.set('userInfo', window.JSON.stringify(data));
            window.localStorage.setItem('wx-my-home', window.JSON.stringify(res.data.returnObject));
            // 判断是否上市公司
            if (data.companyCode == null || data.companyCode == '') {
              this.isMarket = false;
            } else {
              this.isMarket = true;
            }
            this.gridBox.forEach((item) => {
              if (item.type == 'luyanzhong') {
                item.way = false
                if (data.hasLyz) {
                  item.link = data.lyzUrl;
                  item.way = true
                }
              }
              if (item.type == 'tech') {
                item.way = true
              }
              if (item.type == 'internal') {
                if (data.companycode !== '' || data.levels == 1) {
                  if (data.stockType == 0 || data.levels == 1) {
                    item.way = true
                  }
                }
              }
            });
          } else if (res.data.returnCode == -1) {
            window.localStorage.removeItem('wx-auth');
          }
        }).catch((err) => {
          console.error(err);
          // this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      getPermissionCheckList() {
        let params = {
          companyId: this.userInfo.enterpriseUser ? this.userInfo.companyId : '',
          companyCode: this.userInfo.enterpriseUser ? '' : this.userInfo.companyCode
        };
        this.$axios.permission.getPermissionCheckList(params).then(res => {
          if (res.data.returnCode == -3) {
            this.$router.push({path: "/customerTables"});
          } else {
            this.$router.push({path: "/lookupTables"});
          }
        }).catch(() => {
          this.$router.push({path: "/customerTables"});
        })
      }
    }
  }
</script>
<style lang="scss">
  .xiaoan-my {
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 50px;
    .my-scroll {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }
    .my-default {
      .my-header {
        width: 100%;
        height: 110px;
        .my-h-box {
          width: 100%;
          height: 110px;
          padding: 12px;
          ul.my-h-box-tab {
            display: table;
            table-layout: fixed;
            word-wrap: break-word;
            height: 100%;
            width: 100%;
            background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/my/myHeader@3x.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            border-radius: 3px;
            -moz-box-shadow: 0 0 15px rgba(255, 177, 72, 0.4);
            -webkit-box-shadow: 0 0 15px rgba(255, 177, 72, 0.4);
            box-shadow: 0 0 15px rgba(255, 177, 72, 0.4);
            li {
              display: table-cell;
              vertical-align: middle;
              .img-box {
                background: #ffd998;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                img {
                  width: 54px;
                  height: 54px;
                  display: block;
                  border-radius: 50%;
                }
              }
            }
            li.left {
              width: 25%;
              padding-left: 10px;
            }
            li.middle {
              width: 60%;
              p.pleaseLogin {
                font-size: 16px;
                color: white;
                text-align: left;
              }
              p.top {
                color: #FFFFFF;
                font-size: 15px;
                font-family: PingFangSC-Medium, sans-serif;
                /*padding-bottom: 1px;*/
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                width: 100%;
              }
              p.bottom {
                color: #FFFFFF;
                font-size: 12px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                width: 100%;
              }
            }
            li.right {
              width: 8%;
              text-align: right;
              padding-right: 10px;
              line-height: 1;
              b {
                color: #FFFFFF;
                font-weight: bold;
              }
            }
          }
        }
      }
      .xiaoan-foo {
        height: 7px;
        width: 100%;
        background-color: #f0f1f5;
      }
      .my-card-box {
        width: 100%;
        .card-flex {
          display: flex;
          div.vux-fax-height {
            padding: 3px 0 10px 0;
            &:after {
              height: 25px;
              top: 50%;
              transform: translateY(-50%);
            }
            &:active {
              background-color: #f0f1f5;
            }
          }
          div {
            flex: 1;
            text-align: center;
            font-size: 12px;
            p {
              color: #8d8d8d;
              font-size: 12px;
            }
            p.value {
              font-family: PingFangSC-Medium, sans-serif;
              font-size: 22px;
              color: #786a58;
            }
          }
        }
      }
      .my-grid-box {
        width: 100%;
        .weui-grids {
          .weui-grid.vux-grid-item-no-border:before {
            display: block;
          }
          .weui-grid {
            height: 85px;
            padding: 19px 0 0 0;
            .weui-grid__label {
              color: #8d8d8d;
              font-size: 12px;
              line-height: 1;
              margin-top: 8px;
            }
            .grid-badge {
              position: absolute;
              top: 14px;
              min-width: 16px;
              width: auto;
              left: 53px;
            }
            .vux-badge-single {
              padding: 0 6px;
            }
            .weui-grid__icon {
              width: auto;
              height: 24px;
              img {
                width: auto;
                margin: auto;
              }
            }
          }
        }
      }
    }
    .my-banner {
      width: 100%;
      padding: 12px;
      img {
        height: auto;
        /*height: 160px;*/
        width: 100%;
        border-radius: 2px;
      }
    }
  }
</style>
