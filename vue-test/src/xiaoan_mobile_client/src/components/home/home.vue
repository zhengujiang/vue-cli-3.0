<template>
  <div class="xa-drawer-home">
    <blur :blur-amount=40 :url="userHomeData.weixinAvatar" class="xa-blur-header" :height="150">
      <p class="center"><img :src="userHomeData.weixinAvatar"></p>
      <p class="title"><b>{{userHomeData.userName}}</b></p>
    </blur>
    <grid>
      <grid-item v-for="i in 3" :key="i">
        <span slot="label">Grid</span>
        <img slot="icon" src="https://o3e85j0cv.qnssl.com/tulips-1083572__340.jpg">
      </grid-item>
    </grid>
    <group class="xa-islink">
      <cell :title="'法规'" :link="'/rule'" @click.native="cellClick" is-link></cell>
      <cell :title="'公告'" :link="'/affiche'" is-link></cell> <!--:is-loading="!money" :value="money"-->
      <cell :title="'研报'" :link="'/report'" is-link></cell>
      <cell :title="'个人中心'" :link="'/home'" is-link></cell>
    </group>
    <box class="footer-button" @click="checkout">
      <x-button :gradients="['#FF5E3A', '#FF9500']" v-if="isLogin">退&emsp;出</x-button>
      <x-button :gradients="['#FF5E3A', '#FF9500']" v-else>登&emsp;录</x-button>
    </box>
  </div>
</template>

<script>
  import {Badge, Blur, Box, Cell, Grid, GridItem, Group, GroupTitle, XButton} from 'vux'
  export default {
    components: {
      Blur, Grid,
      GridItem,
      GroupTitle, Group, Cell, Badge, XButton, Box
    },
    name: "home",
    data() {
      return {
        money: 0,
        images: [
          // 'https://o3e85j0cv.qnssl.com/tulips-1083572__340.jpg',
          // 'https://o3e85j0cv.qnssl.com/waterway-107810__340.jpg',
          // 'https://o3e85j0cv.qnssl.com/hot-chocolate-1068703__340.jpg'
        ],
        userHomeData: {
          weixinAvatar: ''
        },
        user_Id: '',
        isLogin: false,
      }
    },
    watch: {},
    created() {
      this.user_Id = this.$cookie.getCookie("userId");
      if (this.user_Id) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
      if (this.$cookie.getUserInfo()) {
        this.userHomeData = this.$cookie.getUserInfo();
        // console.log(this.userHomeData);
      }
    },
    methods: {
      cellClick() {

      },
      checkout() {
        console.warn('用户要退出？');
      }
    },
    destroyed() {

    }
  }
</script>

<style lang="scss">
  .xa-drawer-home {
    width: 100%;
    .weui-grids {
      background-color: whitesmoke;
    }
    .xa-blur-header {
      // height: 160px !important;
      .center {
        text-align: center;
        padding-top: 10px;
        color: #fff;
        font-size: 18px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid #c1c1c1;
        }
      }
      .title {
        text-align: center;
        font-size: 16px;
      }
    }
    .xa-islink {
      .weui-cells {
        background-color: whitesmoke;
      }
    }
    .footer-button {
      padding: 10px 10px;
      width: 100%;
      position: absolute;
      bottom: 0;
    }
  }
</style>
