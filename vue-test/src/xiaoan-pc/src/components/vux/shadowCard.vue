<template>
  <transition name="el-zoom-in-bottom">
    <div class="shadowCard-warning"><span>暂无数据</span></div>
  </transition>
</template>

<script>
  export default {
    name: "shadowCard",
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
  .shadowCard-warning {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    span {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #aeaeae;
    }
  }
</style>
