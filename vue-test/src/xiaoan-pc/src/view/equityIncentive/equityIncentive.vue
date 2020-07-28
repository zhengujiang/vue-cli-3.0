<template>
  <div id="equityIncentive">
    <equity-header></equity-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import equityHeader from './components/header/equityHeader.vue'
  export default {
    name: "equityIncentive",
    components: {
      equityHeader
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
  #equityIncentive {
    min-height: 600px;
    background:rgba(246,246,246,1);
    width: 100%;
  }
</style>
