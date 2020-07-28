<template>
  <div id="sentimentBanner">
    <a :href="imgUrl" v-show="showImg"><img src="../../../assets/image/sentiment/banner1.png"></a>
  </div>
</template>

<script>
  export default {
    name: "sentimentBanner",
    components: {},
    data() {
      return {
        showImg: false,
        imgUrl: 'http://www.alphainsight.ai/'
      }
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  img {
    width: 100%;
    padding: 0 10px;
  }
</style>
