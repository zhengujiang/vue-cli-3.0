<template>
  <div class="xiaoan-box creation">
    <div class="creation-scroll" ref="scrollDom">
      <div class="tab-box vux-1px-b" ref="tabDom">
        <tab :scroll-threshold=6 :line-width=2 :active-color="'#ffb148'" v-model="active" custom-bar-width="30px">
          <tab-item class="vux-center" v-for="(item, index) in tabData" :key="item.type"
                    @on-item-click="handler(index)">
            {{item.name}}
          </tab-item>
        </tab>
      </div>
      <div class="tab-container" :style="{height:tabHeight+'px'}">
        <swiper v-model="active" :min-moving-distance="100" :height="'100%'" :show-dots="false"
                @on-index-change="handler">
          <swiper-item>
            <creation-item :height="tabHeight" :active="active"></creation-item>
          </swiper-item>
          <swiper-item>
            <creation-reply-item :height="tabHeight" :active="active"></creation-reply-item>
          </swiper-item>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
  import {Swiper, SwiperItem, Tab, TabItem} from 'vux'
  import VReturnHome from "@/components/warning/returnHome.vue"
  import XiaoanLoading from '@/components/warning/loading'
  import CreationItem from './components/creation/creationItem'
  import CreationReplyItem from './components/creation/creationReplyItem'

  export default {
    name: "creation",
    components: {
      VReturnHome, XiaoanLoading, CreationItem, CreationReplyItem,
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    data() {
      return {
        tabHeight: 0,
        active: 0,
        tabData: [
          {type: 'ask', name: '我的提问', active: true},
          {type: 'reply', name: '我的回答', active: true}
        ],
      }
    },
    created() {
      let userId = this.$cookie.getCookie('userId');
      if (this.$cookie.isLogin()) {
        // 处理内部用户
       // this.apiUserHome();
      } else {
        // 没登陆
        this.$storage.loginStatus(this, '我的创作', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.tabHeight = this.$refs.scrollDom.clientHeight - this.$refs.tabDom.clientHeight - 1;
        let item = this.$route.query.item
        if (item) {
          this.active = item
        } else {
          this.active = 0
        }
      });
      //
      let adverttitle = '';
      let sharelink2 = this.$api.CURRENTIP.IP + '#/rule';// 分享链接
      let shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      // 获取登录信息
      apiUserHome() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
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
      handler(val) {
        this.active = val
        this.$router.replace({path: '/creation', query: {item: val}})
      }
    }
  }
</script>

<style lang="scss">
  .xiaoan-box.creation {
    padding-bottom: 50px;
    .creation-scroll {
      height: 100%;
      width: 100%;
      background-color: #FFFFFF;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      .tab-container {
        .vux-slider {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
</style>
