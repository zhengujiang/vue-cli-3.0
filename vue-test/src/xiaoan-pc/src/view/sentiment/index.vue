<template>
  <div id="sentiment-index">
    <router-view></router-view>
    <div class="content-page">
      <div class="footer-message"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sentiment-index",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  #sentiment-index {
    width: 100%;
    min-height: 800px;
    background-color: #f6f6f6;
  }
  .footer-message {
    padding: 10px 0 15px 0;
    text-align: center;
    .el-button {
      padding: 0;
      height: 30px;
      width: 110px;
    }
  }
  .content-page {
    text-align: center;
  }
</style>

