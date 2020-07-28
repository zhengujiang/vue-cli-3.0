<template>
  <div id="IncentiveObject">
    <IncentiveObject-header></IncentiveObject-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import IncentiveObjectHeader from './components/header/IncentiveObjectHeader.vue'
  export default {
    name: "IncentiveObject",
    components: {
      IncentiveObjectHeader
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  #IncentiveObject {
    min-height: 600px;
    background:rgba(246,246,246,1);
    width: 100%;
  }
</style>
