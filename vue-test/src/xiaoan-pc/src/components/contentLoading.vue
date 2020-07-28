<template>
  <div id="contentLoading" v-show="stopLoading">
    <img :src="$image.prompt.loading" alt="">
  </div>
</template>
<script>
  export default {
    name: 'contentLoading',
    data () {
      return {}
    },
    props: {
      stopLoading: {
        type: Boolean,
        default: true
      }
    },
    methods: {},
    mounted () {
      var bodyH = document.body.offsetHeight
      var content = document.getElementById('contentLoading')
      content.style.lineHeight = bodyH + 'px'
    }
  }
</script>
<style lang="scss" scoped>
  #contentLoading {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .9);
    position: fixed;
    line-height: 800px;
    left: 0;
    top: 0;
    z-index: 9999;
    text-align: center;
    font-size: 50px;
    color: #ffb148;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 50px;
    }
  }
</style>
