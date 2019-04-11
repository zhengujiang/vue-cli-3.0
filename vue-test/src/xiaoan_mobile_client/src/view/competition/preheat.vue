<template>
  <div id="comp-preheat">
    <img src="https://oss.in-hope.cn/xiaoan/h5_static/competition/promotionList.jpg" alt="">
  </div>
</template>

<script>
  export default {
    name: "comp-preheat",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    methods: {}
  }
</script>

<style lang="scss">
  #comp-preheat {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    img {
      width: 100%;
    }
  }
</style>
