<template>
  <div id="electron-head" class="vxa-flex-box align">
    <div><img class="headImg" :src="img"/></div>
    <div class="col"><span class="title vxa-ellipsis">{{name}}</span></div>
    <div><span class="nxt" v-if="show"><span class="num">{{indexNum}}</span>/6</span></div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        img: 'https://oss.in-hope.cn/xiaoan/h5_static/electron/headicon.png',
        indexNum: 1,
      }
    },
    props: {
      show: {
        type: Boolean,
        default: true
      },
      index: {
        type: [Number],
        default: 0
      },
      name: {
        type: [String],
        default: '信公小安'
      }
    },
    watch: {
      index: function (i) {
        this.indexNum = Number(i) + 1;
      }
    },
    created() {
      if (this.$cookie.isLogin()) {
        let userInfo = this.$cookie.getUserInfo();
        if (userInfo.weixinAvatar) {
          this.img = userInfo.weixinAvatar;
        }
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  #electron-head {
    width: 100%;
    padding: 20px 15px;
    .headImg {
      height: 44px;
      width: 44px;
      display: inherit;
      border-radius: 50%;
    }
    .title {
      padding-left: 10px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
      display: inline-block;
      width: 260px;
    }

    .nxt {
      display: inline-block;
      height: 45px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      line-height: 22px;
      .num {
        color: rgba(255, 205, 0, 1);
      }
    }
  }
</style>
