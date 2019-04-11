<template>
  <transition name="bounce">
    <div class="share-box-all" v-show="share" @click="shareChick">
      <div></div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        value: false
      }
    },
    props: {
      share: false
    },
    watch: {
      share: function (val) {
        this.value = val;
      }
    },
    created() {
    },
    methods: {
      shareChick() {
        this.$emit('change', false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .share-box-all {
    z-index: 2000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    background: rgba(0, 0, 0, 0.8);
    div {
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/testing/fenxiangT@3x.png);
      background-repeat: no-repeat;
      background-size: contain;
      width: 276.097px;
      height: 270px;
      margin: 35px auto 0 auto;
      margin-right: 25px;
    }
  }
</style>
