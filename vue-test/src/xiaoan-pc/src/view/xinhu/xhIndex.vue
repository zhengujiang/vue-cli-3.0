<template>
  <div id="xh-index">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "xh-index",
    data() {
      return {}
    }
  }
</script>

<style lang="scss">
  #xh-index {
    background-color: #f6f6f6;
    width: 100%;
  }
  .xhlist-pagination {
    width: 100%;
    margin: 20px 0 20px 0;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .button-group {
      .el-radio-button__inner {
        padding: 5px 9px 5px 9px;
        line-height: 17px;
      }
    }
  }
</style>
