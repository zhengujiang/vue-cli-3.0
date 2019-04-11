<template>
  <div class="xiaoan-box reference-index">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "reference-index",
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .reference-index {
    width: 100%;
    height: 100%;
    background: #fff;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
