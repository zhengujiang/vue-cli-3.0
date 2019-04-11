<template>
  <tabbar class="xa-Footer" ref="tabbarDom" @on-index-change="tabBerClick">
    <tabbar-item v-for="(list,index) of TabBerData" :link="list.link"
                 :badge="list.badgeNum" :key="list.type" :class="{'hot': list.type == 'competition'}"
                 :selected="$route.meta.name  === list.type" v-show="list.show">
      <i slot="icon" class="icon iconfont" :class="list.icon">
        <img :src="list.newIcon" v-if="list.new" alt="new" class="newTip">
      </i>
      <span slot="label">{{list.name}}</span>
    </tabbar-item>
  </tabbar>
</template>

<script>
  import {Cell, TransferDom, Group, Tabbar, TabbarItem} from 'vux'
  import {mapState} from 'vuex'
  export default {
    name: "xafooter",
    directives: {
      TransferDom
    },
    data() {
      return {
        TabBerData: [
          {
            newIcon: '',
            new: false,
            badge: true,
            show: true,
            badgeNum: '',
            type: 'rule',
            link: '/rule',
            name: '法规',
            icon: 'icon-fagui'
          },
          {
            newIcon: '',
            new: false,
            badge: true,
            show: true,
            badgeNum: '',
            type: 'Affiche',
            link: '/affiche',
            name: '公告',
            icon: 'icon-gonggao1'
          },
          // {
          //   newIcon: '/static/img/footer/new@3x.png',
          //   new: true,
          //   badge: true,
          //   show: true,
          //   badgeNum: '',
          //   type: 'publishList',
          //   link: '/publishList',
          //   name: 'IPO',
          //   icon: 'icon-IPO'
          // },
          // {
          //   newIcon: '/static/img/footer/hot@2x.png',
          //   new: true,
          //   badge: true,
          //   show: true,
          //   badgeNum: '',
          //   type: 'competition',
          //   link: '/competition',
          //   name: '5万',
          //   icon: 'icon-pcket'
          // },
          {
            newIcon: '',
            new: false,
            badge: true,
            show: true,
            badgeNum: '',
            type: 'xinhu',
            link: '/xhlist',
            name: '信乎',
            icon: 'icon-wenda'
          },
          {
            newIcon: '',
            new: false,
            badge: true,
            show: true,
            badgeNum: '',
            type: 'Report',
            link: '/report',
            name: '研报',
            icon: 'icon-yanbao1'
          },
          {
            newIcon: '',
            new: false,
            badge: true,
            show: true,
            badgeNum: '',
            type: 'My',
            link: '/home',
            name: '个人中心',
            icon: 'icon-gerenzhongxin1'
          }
        ],
        isTestUser: 0,
        userData: {},
        num: 0
      }
    },
    computed: {
      ...mapState({
        isMessage: state => state.mutations.isMessage,
        isFootMsg: state => state.mutations.isFootMsg
      })
    },
    components: {
      Tabbar,
      TabbarItem,
      Group,
      Cell
    },
    watch: {
      isMessage: function (val) {
        // console.log('32132131isMessage====>>>>>', val);
        let userId = this.$cookie.getCookie('userId');
        if (userId) {
          this.isMessageSet(val);
        }
      }
    },
    created() {
      let userId = this.$cookie.getCookie("userId");
      if (userId) {
        //this.xhloading(this.isFootMsg.xh);
        if (this.isFootMsg.loading) {
          // this.apiUserHome();
        }
        this.isMessageSet(this.isMessage)
      }
      // console.log('32132131isMessage====>', this.isMessage);
    },
    mounted() {
    },
    methods: {
      // 个人中心的tab 消息数
      isMessageSet(val) {
        this.TabBerData.forEach((item) => {
          if (item.type == 'My') {
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
      // 默认执行 是否是信乎
      xhloading(show) {
        if (show == false) {
          // 非测试用户 ipo
          this.isTestUser = 2;
          this.TabBerData.forEach((item) => {
            if (item.type == 'xinhu') {
              item.show = false
            }
            if (item.type == 'publishList') {
              item.show = true;
            }
          })
        } else {
          // 测试用户 or 正式用户
          this.TabBerData.forEach((item) => {
            item.show = true;
            if (item.type == 'publishList') {
              item.show = false;
            }
          })
        }
      },
      // 获取登录信息
      apiUserHome() {
        this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        }).then((res) => {
          // console.log("有userId======>>>>>>>>>>", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            let isTestUser = data.testUser;
            // if (isTestUser == false) {
            // 非测试用户 ipo
            // this.isTestUser = 2;
            // this.TabBerData.forEach((item) => {
            //   if (item.type == 'xinhu') {
            //     item.show = false
            //   }
            //   if (item.type == 'publishList') {
            //     item.show = true;
            //   }
            // })
            // } else {
            //   // 测试用户 or 正式用户
            //   this.TabBerData.forEach((item) => {
            //     item.show = true;
            //     if (item.type == 'publishList') {
            //       item.show = false;
            //     }
            //   })
            // }
            this.$store.commit('IS_FOOTER_MESSAGE', {isFootMsg: {xh: isTestUser, loading: false}});
          }
        }).catch((err) => {
          console.error(err);
          // this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      tabBerClick(val) {
        // console.log('3242424324', val);
      }
    }
  }
</script>
<style lang="scss">
  .xa-Footer {
    height: 50px;
    background-color: white !important;
    .newTip {
      position: absolute;
      top: -3px;
      width: auto;
      height: 20px;
    }
  }
  .weui-tabbar.xa-Footer {
    position: absolute;
    position: fixed;
    bottom: 0 !important;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    box-shadow: 0px -5px 13px rgba(0, 0, 0, .06);
    &:before {
      border-color: transparent !important;
    }
    .weui-tabbar__item {
      padding-top: 5px;
      text-decoration: none;
      .weui-tabbar__icon {
        height: 22px;
        width: 22px;
        i {
          font-size: 22px;
        }
        > sup {
          top: -4px;
          left: 130%;
        }
        .vux-badge-single {
          min-width: 16px;
          width: auto;
          padding: 0 1px;
        }
      }
      .weui-tabbar__label {
        font-size: 13px;
        // color: #ffb148 !important;
      }
    }
    .weui-bar__item_on {
      color: #ffb148;
      .weui-tabbar__label {
        color: #ffb148;
        -webkit-transition: all 300ms ease-in-out;
        transition: all 300ms ease-in-out;
      }
      .weui-tabbar__icon {
        i {
          -webkit-transition: all 300ms ease-in-out;
          transition: all 300ms ease-in-out;
          color: #ffb148;
        }
      }
    }
  }
</style>
