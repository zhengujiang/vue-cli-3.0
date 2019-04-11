<template>
  <div id="comp-select">

  </div>
</template>

<script>
  export default {
    name: "comp-select",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    methods: {}
  }
</script>

<style lang="scss">
  #comp-select {

  }
</style>
