<template>
  <div class="app-index app-body-overflow" ref="contentDom">
    <!--<transition name="bounce">-->
    23423423423
    <!--</transition>-->
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .app-index {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    &.app-body-overflow {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      background-color: white;
      overflow: hidden;
    }
  }
</style>
