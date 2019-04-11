<template>
  <div class="xiaoan-box opinion-index">
    <!--<keep-alive include="opinion">-->
      <router-view></router-view>
    <!--</keep-alive>-->
  </div>
</template>

<script>
  export default {
    name: "opinion-index",
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .opinion-index {
    width: 100%;
    height: 100%;
    background: #f0f1f5;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
