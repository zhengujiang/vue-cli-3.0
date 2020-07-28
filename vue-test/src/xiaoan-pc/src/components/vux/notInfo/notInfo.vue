<template>
  <div class="vxa-not_info_box">
    <span class="not_info_text"><slot>暂时没有内容</slot></span>
  </div>
</template>

<script>
  export default {
    name: "notInfo",
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
  .vxa-not_info_box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    z-index: 2001;
    .not_info_text {
      font-size: 12px;
      color: #8d8d8d;
    }
  }
</style>
