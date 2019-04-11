<template>
  <div class="collect xiaoan-collect" id="collect">
    <div class="collect-scroll" ref="collectDom">
      <div class="tab-box vux-1px-b" ref="tabDom">
        <tab :scroll-threshold=3 :line-width=2 :active-color="'#ffb148'" v-model="active" custom-bar-width="30px">
          <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index">
            {{item.name}}
          </tab-item>
        </tab>
      </div>
      <div class="tab-container" :style="{height:tabHeight+'px'}">
        <swiper v-model="active" :min-moving-distance="667" :height="'100%'" :show-dots="false">
          <swiper-item>
            <collect-item :height="tabHeight" :active="active"></collect-item>
          </swiper-item>
          <swiper-item>
            <collect-share-item :height="tabHeight" :active="active"></collect-share-item>
          </swiper-item>
          <swiper-item>
            <collect-sub-item :height="tabHeight" :active="active"></collect-sub-item>
          </swiper-item>
        </swiper>
      </div>
    </div>

  </div>
</template>
<script>
  import VReturnHome from '../../components/warning/returnHome.vue';
  import CollectItem from '../../view/duty/components/collect/collectItem'
  import CollectShareItem from '../../view/duty/components/collect/collectShareItem'
  import CollectSubItem from '../../view/duty/components/collect/collectSubItem'
  import {Swiper, SwiperItem, Tab, TabItem} from 'vux'

  import {mapState} from 'vuex'

  export default {
    name: "collect",
    computed: {
      ...mapState({
        footerHeight: state => state.mutations.footerHeight
      })
    },
    components: {
      CollectItem, CollectShareItem, CollectSubItem,
      VReturnHome,
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    data() {
      return {
        tabHeight: 0,
        tabData: [
          {name: "收藏", type: "collect"},
          {name: "分享", type: "share"},
          {name: "订阅", type: "groom"}
        ],
        active: 0,
        user_id: ''
      }
    },
    watch: {
      active: function (val) {
        console.log(val);
        this.$router.replace({path: '/collect', query: {active: this.tabData[val].type}});
      }
    },
    created() {
      let userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      console.log(userId);
      if (this.$cookie.isLogin()) {
        //
        if (this.$route.query.active) {
          this.active = 0;
          this.tabData.forEach((item, index) => {
            if (item.type == this.$route.query.active) {
              this.active = index;
            }
          })
        } else {
          this.$router.replace({path: '/collect', query: {active: this.tabData[this.active].type}});
        }
      } else {
        console.warn('没登陆');
        this.$storage.loginStatus(this, '我的收藏', this.$api.CURRENTIP.IP + '#/collect');
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.tabHeight = this.$refs.collectDom.clientHeight - this.$refs.tabDom.clientHeight - 1;
      });
      let adverttitle = '我的收藏';
      let sharelink2 = this.$api.CURRENTIP.IP + '#/collect'; // 分享链接
      let shareDesc = ""; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {}
  }
</script>
<style lang="scss">
  .collect.xiaoan-collect {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    padding-bottom: 50px;
    .collect-scroll {
      height: 100%;
      width: 100%;
      .tab-box{
       // padding-bottom: 2px;
      }
      .tab-container {
        .vux-slider {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
</style>
