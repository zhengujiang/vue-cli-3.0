<template>
  <div id="loading">
    <!--<div id="loading" v-show="loading">-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'warning',
    data() {
      return {
        loading: true,
        uri: '',
        title: ''
      }
    },
    created() {
      if (this.$route.query.url) {
        this.uri = this.$route.query.url;
      }
      if (this.$route.query.title) {
        this.title = encodeURIComponent(this.$route.query.title);
      }
      this.$router.replace(this.uri);
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style lang="scss">
  #warning {
    position: relative;
    /*height: 800px;*/
    width: 100%;
    #loading {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 22;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 1);
      text-align: center;
      color: #FFAC38;
      font-size: 50px;
      .el-icon-loading, img {
        margin: 27% auto;
      }
      img {
        width: 50px;
      }
    }
  }
</style>
